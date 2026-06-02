const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Note: gallery table has no updated_at column — omitted from cols and UPDATE
const GALLERY_COLS = `
  g.id, g.title, g.description, g.department_id, g.file_id,
  g.uploaded_by, g.status, g.created_at,
  u.name  AS uploaded_by_name,
  d.name  AS department_name,
  f.file_url, f.file_type, f.file_size, f.original_name,
  COALESCE(f.attachment_type, 'FILE') AS attachment_type
`;

const FROM_CLAUSE = `
  FROM gallery g
  INNER JOIN users u       ON g.uploaded_by   = u.id
  INNER JOIN files f       ON g.file_id       = f.id
  LEFT  JOIN departments d ON g.department_id = d.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchItem(id) {
  const [rows] = await pool.execute(
    `SELECT ${GALLERY_COLS} ${FROM_CLAUSE} WHERE g.id = ?`,
    [id]
  );
  return rows[0] || null;
}

function canManage(actor, item) {
  if (actor.role === 'CENTRAL_ADMIN' || actor.role === 'SUPER_ADMIN') return true;
  if (actor.role === 'HOD') {
    return Number(item.department_id) === Number(actor.department_id);
  }
  return false;
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listGallery({ page = 1, pageSize = 20, department_id, q } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const conditions = ["g.status = 'ACTIVE'"];
  const params     = [];

  if (department_id) {
    conditions.push('g.department_id = ?');
    params.push(parseInt(department_id));
  }
  if (q) {
    conditions.push('(g.title LIKE ? OR g.description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${GALLERY_COLS} ${FROM_CLAUSE} ${where} ORDER BY g.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM gallery g ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    gallery: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getItem(id) {
  const item = await fetchItem(id);
  if (!item || item.status !== 'ACTIVE') throw httpError('Gallery item not found', 404);
  return item;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createItem(dto, actor) {
  const { title, description, file_id } = dto;

  if (!title || !title.trim()) throw httpError('title is required', 400);
  if (!file_id)                throw httpError('file_id is required', 400);

  // Resolve department_id based on role
  let department_id;
  if (actor.role === 'HOD') {
    if (!actor.department_id) throw httpError('HOD must be assigned to a department', 403);
    department_id = actor.department_id; // always forced
  } else {
    department_id = dto.department_id || null; // CENTRAL_ADMIN: null = college-wide
  }

  // Validate department if set
  if (department_id) {
    const [deptRows] = await pool.execute(
      "SELECT id FROM departments WHERE id = ? AND status = 'ACTIVE'",
      [department_id]
    );
    if (!deptRows[0]) throw httpError('Department not found or not active', 400);
  }

  // file_id must exist
  const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [file_id]);
  if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);

  const [result] = await pool.execute(
    `INSERT INTO gallery (title, description, department_id, file_id, uploaded_by, status)
     VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
    [title.trim(), description || null, department_id || null, file_id, actor.id]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'gallery',
    recordId: newId,
    description: `Created gallery item "${title.trim()}" (dept=${department_id ?? 'null'})`,
  });

  return await fetchItem(newId);
}

async function updateItem(id, dto, actor) {
  const item = await fetchItem(id);
  if (!item) throw httpError('Gallery item not found', 404);

  if (!canManage(actor, item)) {
    throw httpError('You do not have permission to update this gallery item', 403);
  }

  // Only CENTRAL_ADMIN can change department_id
  let newDeptId = item.department_id;
  if (dto.department_id !== undefined && (actor.role === 'CENTRAL_ADMIN' || actor.role === 'SUPER_ADMIN')) {
    newDeptId = dto.department_id || null;
    if (newDeptId) {
      const [deptRows] = await pool.execute(
        "SELECT id FROM departments WHERE id = ? AND status = 'ACTIVE'",
        [newDeptId]
      );
      if (!deptRows[0]) throw httpError('Department not found or not active', 400);
    }
  }

  // file_id can be changed but must remain valid
  let newFileId = item.file_id;
  if (dto.file_id !== undefined) {
    if (!dto.file_id) throw httpError('file_id cannot be removed — a gallery item must always have a file', 400);
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [dto.file_id]);
    if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
    newFileId = dto.file_id;
  }

  const newTitle       = dto.title       !== undefined ? (dto.title?.trim() || item.title) : item.title;
  const newDescription = dto.description !== undefined ? (dto.description   || null)        : item.description;

  await pool.execute(
    'UPDATE gallery SET title = ?, description = ?, department_id = ?, file_id = ? WHERE id = ?',
    [newTitle, newDescription, newDeptId, newFileId, id]
  );

  const changed = [];
  if (newTitle              !== item.title)                           changed.push('title');
  if (newDescription        !== item.description)                    changed.push('description');
  if (String(newDeptId)     !== String(item.department_id))         changed.push('department_id');
  if (String(newFileId)     !== String(item.file_id))               changed.push('file_id');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'gallery',
    recordId: id,
    description: changed.length
      ? `Updated gallery item id=${id}: changed [${changed.join(', ')}]`
      : `Updated gallery item id=${id}: no changes`,
  });

  return await fetchItem(id);
}

async function setStatus(id, newStatus, actor) {
  const item = await fetchItem(id);
  if (!item) throw httpError('Gallery item not found', 404);

  if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
    throw httpError('status must be ACTIVE or INACTIVE', 400);
  }

  if (!canManage(actor, item)) {
    throw httpError('You do not have permission to update this gallery item', 403);
  }

  await pool.execute('UPDATE gallery SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'gallery',
    recordId: id,
    description: `Changed status of gallery item id=${id} ("${item.title}") to ${newStatus}`,
  });

  return await fetchItem(id);
}

async function softDelete(id, actor) {
  const item = await fetchItem(id);
  if (!item) throw httpError('Gallery item not found', 404);

  if (!canManage(actor, item)) {
    throw httpError('You do not have permission to delete this gallery item', 403);
  }

  await pool.execute("UPDATE gallery SET status = 'INACTIVE' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'gallery',
    recordId: id,
    description: `Soft-deleted gallery item id=${id} ("${item.title}")`,
  });
}

module.exports = { listGallery, getItem, createItem, updateItem, setStatus, softDelete };
