const pool      = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { slugify, ensureUniqueSlug } = require('../../utils/slug');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Columns returned in every department response
const DEPT_COLS = `
  d.id, d.name, d.slug, d.short_name, d.description, d.vision, d.mission,
  d.hod_user_id, d.image_file_id, d.status, d.created_at, d.updated_at,
  d.established_year, d.contact_email, d.contact_phone,
  u.name AS hod_name, u.email AS hod_email, u.phone AS hod_phone,
  df.file_url AS image_url,
  COALESCE(df.attachment_type, 'FILE') AS image_attachment_type
`;

const FROM_CLAUSE = `
  FROM departments d
  LEFT JOIN users u ON d.hod_user_id = u.id
  LEFT JOIN files df ON d.image_file_id = df.id
`;

// ── Internal helper ───────────────────────────────────────────────────────────

async function getDeptById(id) {
  const [rows] = await pool.execute(
    `SELECT ${DEPT_COLS} ${FROM_CLAUSE} WHERE d.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listDepartments() {
  const [rows] = await pool.execute(
    `SELECT ${DEPT_COLS} ${FROM_CLAUSE} WHERE d.status = 'ACTIVE' ORDER BY d.name ASC`
  );
  return rows;
}

async function getDeptBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT ${DEPT_COLS} ${FROM_CLAUSE} WHERE d.slug = ? AND d.status = 'ACTIVE'`,
    [slug]
  );
  const dept = rows[0];
  if (!dept) throw httpError('Department not found', 404);
  return dept;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createDepartment(dto, actor) {
  const { name, short_name, description, vision, mission, image_file_id } = dto;

  if (!name || name.trim().length < 2) {
    throw httpError('Department name must be at least 2 characters', 400);
  }

  const base = slugify(name.trim());
  if (!base) throw httpError('Could not generate a valid slug from the provided name', 400);

  const slug = await ensureUniqueSlug('departments', base);

  const [result] = await pool.execute(
    `INSERT INTO departments (name, slug, short_name, description, vision, mission, image_file_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      name.trim(),
      slug,
      short_name  || null,
      description || null,
      vision      || null,
      mission     || null,
      image_file_id || null,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'departments',
    recordId: newId,
    description: `Created department "${name.trim()}" (slug: ${slug})`,
  });

  return await getDeptById(newId);
}

async function updateDepartment(id, dto, actor) {
  const dept = await getDeptById(id);
  if (!dept) throw httpError('Department not found', 404);

  const isAdmin = actor.role === 'CENTRAL_ADMIN';
  const isHod   = actor.role === 'HOD';

  // HOD ownership: must be assigned to this department
  if (isHod) {
    if (Number(actor.department_id) !== Number(dept.id)) {
      throw httpError('You can only update your own department', 403);
    }

    // HOD restricted fields
    const restricted = ['name', 'short_name', 'hod_user_id', 'status', 'slug'];
    const attempted  = restricted.filter(f => dto[f] !== undefined);
    if (attempted.length > 0) {
      throw httpError(`HOD cannot update field(s): ${attempted.join(', ')}`, 403);
    }
  }

  if (!isAdmin && !isHod) {
    throw httpError('Forbidden', 403);
  }

  // Resolve values — only CENTRAL_ADMIN can change name/short_name/slug
  let newName      = dept.name;
  let newSlug      = dept.slug;
  let newShortName = dept.short_name;

  if (isAdmin) {
    if (dto.name !== undefined) {
      newName = dto.name.trim();
      if (newName.length < 2) throw httpError('Department name must be at least 2 characters', 400);
      // Regenerate slug only when name actually changes
      if (newName !== dept.name) {
        newSlug = await ensureUniqueSlug('departments', slugify(newName), id);
      }
    }
    if (dto.short_name !== undefined) {
      newShortName = dto.short_name || null;
    }
  }

  const newDescription    = dto.description      !== undefined ? (dto.description     || null) : dept.description;
  const newVision         = dto.vision           !== undefined ? (dto.vision          || null) : dept.vision;
  const newMission        = dto.mission          !== undefined ? (dto.mission         || null) : dept.mission;
  const newImageFileId    = dto.image_file_id    !== undefined ? (dto.image_file_id   || null) : dept.image_file_id;
  const newEstablishedYear = dto.established_year !== undefined ? (dto.established_year || null) : dept.established_year;
  const newContactEmail   = dto.contact_email    !== undefined ? (dto.contact_email   || null) : dept.contact_email;
  const newContactPhone   = dto.contact_phone    !== undefined ? (dto.contact_phone   || null) : dept.contact_phone;

  await pool.execute(
    `UPDATE departments
     SET name = ?, slug = ?, short_name = ?, description = ?, vision = ?, mission = ?,
         image_file_id = ?, established_year = ?, contact_email = ?, contact_phone = ?
     WHERE id = ?`,
    [newName, newSlug, newShortName, newDescription, newVision, newMission,
     newImageFileId, newEstablishedYear, newContactEmail, newContactPhone, id]
  );

  // Build changed-fields list for audit
  const changed = [];
  if (newName            !== dept.name)             changed.push('name');
  if (newSlug            !== dept.slug)             changed.push('slug');
  if (newShortName       !== dept.short_name)       changed.push('short_name');
  if (newDescription     !== dept.description)      changed.push('description');
  if (newVision          !== dept.vision)           changed.push('vision');
  if (newMission         !== dept.mission)          changed.push('mission');
  if (newImageFileId     !== dept.image_file_id)    changed.push('image_file_id');
  if (newEstablishedYear !== dept.established_year) changed.push('established_year');
  if (newContactEmail    !== dept.contact_email)    changed.push('contact_email');
  if (newContactPhone    !== dept.contact_phone)    changed.push('contact_phone');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'departments',
    recordId: id,
    description: changed.length
      ? `Updated department "${dept.name}": changed [${changed.join(', ')}]`
      : `Updated department "${dept.name}": no changes`,
  });

  return await getDeptById(id);
}

async function setStatus(id, newStatus, actor) {
  const dept = await getDeptById(id);
  if (!dept) throw httpError('Department not found', 404);

  if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
    throw httpError('status must be ACTIVE or INACTIVE', 400);
  }

  await pool.execute('UPDATE departments SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'departments',
    recordId: id,
    description: `Changed status of department "${dept.name}" to ${newStatus}`,
  });

  return await getDeptById(id);
}

async function softDelete(id, actor) {
  const dept = await getDeptById(id);
  if (!dept) throw httpError('Department not found', 404);

  await pool.execute("UPDATE departments SET status = 'INACTIVE' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'departments',
    recordId: id,
    description: `Soft-deleted department "${dept.name}"`,
  });
}

async function assignHod(deptId, userId, actor) {
  const dept = await getDeptById(deptId);
  if (!dept) throw httpError('Department not found', 404);

  // Validate the target user
  const [userRows] = await pool.execute(
    `SELECT u.id, u.name, u.department_id, u.status, r.role_name AS role
     FROM users u INNER JOIN roles r ON u.role_id = r.id
     WHERE u.id = ?`,
    [userId]
  );
  const newHod = userRows[0];
  if (!newHod)               throw httpError('User not found', 404);
  if (newHod.role !== 'HOD') throw httpError('User must have the HOD role', 400);
  if (newHod.status !== 'ACTIVE') throw httpError('User must be ACTIVE', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Clear the outgoing HOD's department_id (only if they belonged to this dept)
    if (dept.hod_user_id && Number(dept.hod_user_id) !== Number(userId)) {
      await conn.execute(
        'UPDATE users SET department_id = NULL WHERE id = ? AND department_id = ?',
        [dept.hod_user_id, deptId]
      );
    }

    // Set new HOD's department_id to this department
    await conn.execute(
      'UPDATE users SET department_id = ? WHERE id = ?',
      [deptId, userId]
    );

    // Update the department's hod_user_id
    await conn.execute(
      'UPDATE departments SET hod_user_id = ? WHERE id = ?',
      [userId, deptId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'departments',
    recordId: deptId,
    description: `Assigned user "${newHod.name}" (id: ${userId}) as HOD of department "${dept.name}"`,
  });

  return await getDeptById(deptId);
}

module.exports = {
  listDepartments,
  getDeptBySlug,
  createDepartment,
  updateDepartment,
  setStatus,
  softDelete,
  assignHod,
};
