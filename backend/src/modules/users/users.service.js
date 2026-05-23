const pool = require('../../config/db');
const { hashPassword } = require('../../utils/hash');
const { generatePassword } = require('../../utils/password');
const writeAudit = require('../../utils/audit');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Columns returned in every user response — never includes password_hash
const USER_COLS = `
  u.id, u.name, u.email, u.phone, u.status, u.department_id,
  u.created_at, u.updated_at, r.role_name AS role
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchUser(id) {
  const [rows] = await pool.execute(
    `SELECT ${USER_COLS}
     FROM users u INNER JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getRoleById(roleId) {
  const [rows] = await pool.execute('SELECT id, role_name FROM roles WHERE id = ?', [roleId]);
  return rows[0] || null;
}

async function validateDepartment(deptId) {
  const [rows] = await pool.execute(
    'SELECT id FROM departments WHERE id = ? AND status = ?',
    [deptId, 'ACTIVE']
  );
  return !!rows[0];
}

// ── Service functions ─────────────────────────────────────────────────────────

async function listUsers({ q, role, department_id, status, page = 1, pageSize = 20 } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));

  const conditions = [];
  const params     = [];

  if (q) {
    conditions.push('(u.name LIKE ? OR u.email LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }
  if (role) {
    conditions.push('r.role_name = ?');
    params.push(role);
  }
  if (department_id) {
    conditions.push('u.department_id = ?');
    params.push(parseInt(department_id));
  }
  if (status) {
    conditions.push('u.status = ?');
    params.push(status);
  }

  const where  = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * pageSize;
  const base   = `FROM users u INNER JOIN roles r ON u.role_id = r.id ${where}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${USER_COLS} ${base} ORDER BY u.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(`SELECT COUNT(*) AS total ${base}`, params),
  ]);

  const total = countRows[0].total;
  return {
    users: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getUser(id) {
  const user = await fetchUser(id);
  if (!user) throw httpError('User not found', 404);
  return user;
}

async function createUser(dto, currentUser) {
  const { name, email, phone, role_id, department_id } = dto;

  // Basic field validation
  if (!name || name.trim().length < 2 || name.trim().length > 150) {
    throw httpError('Name must be between 2 and 150 characters', 400);
  }
  if (!EMAIL_RE.test(email)) {
    throw httpError('Invalid email format', 400);
  }
  if (phone && (phone.length < 7 || phone.length > 20)) {
    throw httpError('Phone must be between 7 and 20 characters', 400);
  }

  // Role must exist
  const roleRow = await getRoleById(role_id);
  if (!roleRow) throw httpError('Invalid role_id', 400);
  const roleName = roleRow.role_name;

  // department_id required for HOD and TEACHER
  if (['HOD', 'TEACHER'].includes(roleName) && !department_id) {
    throw httpError(`department_id is required for role ${roleName}`, 400);
  }

  // Validate department if provided
  if (department_id) {
    const deptValid = await validateDepartment(department_id);
    if (!deptValid) throw httpError('Department not found or not active', 400);
  }

  // Email uniqueness
  const [existing] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email.toLowerCase()]
  );
  if (existing[0]) throw httpError('Email is already in use', 409);

  // Generate and hash initial password
  const plainPassword = generatePassword();
  const passwordHash  = await hashPassword(plainPassword);

  const [result] = await pool.execute(
    `INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status)
     VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [role_id, department_id || null, name.trim(), email.toLowerCase(), passwordHash, phone || null]
  );

  const newUserId = result.insertId;

  await writeAudit({
    userId: currentUser.id,
    action: 'CREATE',
    module: 'users',
    recordId: newUserId,
    description: `Created user ${email.toLowerCase()} with role ${roleName}`,
  });

  const user = await fetchUser(newUserId);
  return { user, initial_password: plainPassword };
}

async function updateUser(id, dto, currentUser) {
  const { name, phone, role_id, department_id } = dto;

  // Fetch current state
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, u.phone, u.role_id, u.department_id, r.role_name AS role
     FROM users u INNER JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [id]
  );
  const user = rows[0];
  if (!user) throw httpError('User not found', 404);

  // Resolve new values (undefined = keep current)
  const newRoleId = role_id      !== undefined ? role_id      : user.role_id;
  const newDeptId = department_id !== undefined ? department_id : user.department_id;

  // Resolve new role name
  let newRoleName = user.role;
  if (role_id !== undefined && Number(role_id) !== Number(user.role_id)) {
    const roleRow = await getRoleById(newRoleId);
    if (!roleRow) throw httpError('Invalid role_id', 400);
    newRoleName = roleRow.role_name;
  }

  // department_id required for HOD / TEACHER
  if (['HOD', 'TEACHER'].includes(newRoleName) && !newDeptId) {
    throw httpError(`department_id is required for role ${newRoleName}`, 400);
  }

  // Validate new department if it is changing
  if (department_id !== undefined && Number(department_id) !== Number(user.department_id) && department_id) {
    const deptValid = await validateDepartment(department_id);
    if (!deptValid) throw httpError('Department not found or not active', 400);
  }

  // name validation
  if (name !== undefined) {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 150) {
      throw httpError('Name must be between 2 and 150 characters', 400);
    }
  }

  if (phone !== undefined && phone && (phone.length < 7 || phone.length > 20)) {
    throw httpError('Phone must be between 7 and 20 characters', 400);
  }

  // Transaction: cascade dept changes to related tables
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const deptChanging = department_id !== undefined && Number(department_id) !== Number(user.department_id);

    // HOD leaving a department → clear that department's hod_user_id
    if (user.role === 'HOD' && deptChanging) {
      await conn.execute(
        'UPDATE departments SET hod_user_id = NULL WHERE hod_user_id = ?',
        [id]
      );
    }

    // TEACHER moving to a new department → sync faculty_profiles row
    if (user.role === 'TEACHER' && deptChanging) {
      await conn.execute(
        'UPDATE faculty_profiles SET department_id = ? WHERE user_id = ?',
        [newDeptId || null, id]
      );
    }

    await conn.execute(
      `UPDATE users SET name = ?, phone = ?, role_id = ?, department_id = ? WHERE id = ?`,
      [
        name !== undefined ? name.trim() : user.name,
        phone !== undefined ? (phone || null) : user.phone,
        newRoleId,
        newDeptId || null,
        id,
      ]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  // Build changed-fields list for audit description
  const changed = [];
  if (name !== undefined && name.trim() !== user.name) changed.push('name');
  if (phone !== undefined && (phone || null) !== user.phone) changed.push('phone');
  if (role_id !== undefined && Number(role_id) !== Number(user.role_id)) changed.push('role');
  if (department_id !== undefined && Number(department_id) !== Number(user.department_id)) changed.push('department_id');

  await writeAudit({
    userId: currentUser.id,
    action: 'UPDATE',
    module: 'users',
    recordId: id,
    description: changed.length
      ? `Updated user ${user.email}: changed fields [${changed.join(', ')}]`
      : `Updated user ${user.email}: no changes`,
  });

  return await fetchUser(id);
}

async function setStatus(id, newStatus, currentUser) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.email, u.status, r.role_name AS role
     FROM users u INNER JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [id]
  );
  const user = rows[0];
  if (!user) throw httpError('User not found', 404);

  if (newStatus === 'INACTIVE') {
    if (Number(id) === Number(currentUser.id)) {
      throw httpError('Cannot deactivate your own account', 409);
    }

    if (user.role === 'CENTRAL_ADMIN') {
      const [countRows] = await pool.execute(
        `SELECT COUNT(*) AS cnt
         FROM users u INNER JOIN roles r ON u.role_id = r.id
         WHERE r.role_name = 'CENTRAL_ADMIN' AND u.status = 'ACTIVE'`
      );
      if (countRows[0].cnt <= 1) {
        throw httpError('At least one CENTRAL_ADMIN must remain active', 409);
      }
    }
  }

  await pool.execute('UPDATE users SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: currentUser.id,
    action: 'UPDATE',
    module: 'users',
    recordId: id,
    description: `Changed status of user ${user.email} to ${newStatus}`,
  });

  return await fetchUser(id);
}

async function softDelete(id, currentUser) {
  // Soft delete is implemented as deactivation
  const user = await setStatus(id, 'INACTIVE', currentUser);

  await writeAudit({
    userId: currentUser.id,
    action: 'DELETE',
    module: 'users',
    recordId: id,
    description: `Soft-deleted user ${user.email}`,
  });

  return user;
}

module.exports = { listUsers, getUser, createUser, updateUser, setStatus, softDelete };
