const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// Allowed categories — string field, not DB enum, so validated here
const ALLOWED_CATEGORIES = [
  'Form', 'Forms',
  'Syllabus',
  'Circular', 'Circulars',
  'Brochure', 'Brochures',
  'Document', 'Documents',
  'Ordinance', 'Ordinances',
  'Result', 'Results',
  'General'
];

const DOWNLOAD_COLS = `
  dw.id, dw.title, dw.category, dw.department_id, dw.file_id,
  dw.uploaded_by, dw.download_count, dw.status, dw.created_at, dw.updated_at,
  u.name  AS uploaded_by_name,
  d.name  AS department_name,
  f.file_url, f.original_name, f.file_type, f.file_size,
  COALESCE(f.attachment_type, 'FILE') AS attachment_type
`;

const FROM_CLAUSE = `
  FROM downloads dw
  INNER JOIN users u       ON dw.uploaded_by  = u.id
  INNER JOIN files f       ON dw.file_id      = f.id
  LEFT  JOIN departments d ON dw.department_id = d.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchDownload(id) {
  const [rows] = await pool.execute(
    `SELECT ${DOWNLOAD_COLS} ${FROM_CLAUSE} WHERE dw.id = ?`,
    [id]
  );
  return rows[0] || null;
}

function canManage(actor, download) {
  if (actor.role === 'CENTRAL_ADMIN' || actor.role === 'SUPER_ADMIN') return true;
  if (actor.role === 'HOD') {
    return Number(download.department_id) === Number(actor.department_id);
  }
  return false;
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listDownloads({ page = 1, pageSize = 20, category, department_id, q } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const conditions = ["dw.status = 'ACTIVE'"];
  const params     = [];

  if (category) {
    conditions.push('dw.category = ?');
    params.push(category);
  }
  if (department_id) {
    conditions.push('dw.department_id = ?');
    params.push(parseInt(department_id));
  }
  if (q) {
    conditions.push('dw.title LIKE ?');
    params.push(`%${q}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${DOWNLOAD_COLS} ${FROM_CLAUSE} ${where} ORDER BY dw.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM downloads dw ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    downloads: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getDownload(id) {
  const download = await fetchDownload(id);
  if (!download || download.status !== 'ACTIVE') throw httpError('Download not found', 404);
  return download;
}

async function incrementCount(id) {
  const download = await fetchDownload(id);
  if (!download || download.status !== 'ACTIVE') throw httpError('Download not found', 404);

  await pool.execute(
    'UPDATE downloads SET download_count = download_count + 1 WHERE id = ?',
    [id]
  );

  return await fetchDownload(id);
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createDownload(dto, actor) {
  const { title, category, file_id } = dto;

  if (!title || !title.trim()) throw httpError('title is required', 400);
  if (!category)               throw httpError('category is required', 400);
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw httpError(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`, 400);
  }
  if (!file_id) throw httpError('file_id is required', 400);

  // Resolve and validate department_id based on role
  let department_id;
  if (actor.role === 'HOD') {
    if (!actor.department_id) throw httpError('HOD must be assigned to a department', 403);
    department_id = actor.department_id; // always forced — ignore client value
  } else {
    // CENTRAL_ADMIN: accepts null (global) or a specific dept
    department_id = dto.department_id || null;
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
    `INSERT INTO downloads (title, category, department_id, file_id, uploaded_by, download_count, status)
     VALUES (?, ?, ?, ?, ?, 0, 'ACTIVE')`,
    [title.trim(), category, department_id || null, file_id, actor.id]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'downloads',
    recordId: newId,
    description: `Created download "${title.trim()}" (category=${category}, dept=${department_id ?? 'null'})`,
  });

  return await fetchDownload(newId);
}

async function updateDownload(id, dto, actor) {
  const download = await fetchDownload(id);
  if (!download) throw httpError('Download not found', 404);

  if (!canManage(actor, download)) {
    throw httpError('You do not have permission to update this download', 403);
  }

  // Category validation if changing
  if (dto.category !== undefined) {
    if (!ALLOWED_CATEGORIES.includes(dto.category)) {
      throw httpError(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`, 400);
    }
  }

  // department_id can only be changed by CENTRAL_ADMIN
  let newDeptId = download.department_id;
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
  let newFileId = download.file_id;
  if (dto.file_id !== undefined) {
    if (!dto.file_id) throw httpError('file_id cannot be removed — a download must always have a file', 400);
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [dto.file_id]);
    if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
    newFileId = dto.file_id;
  }

  const newTitle    = dto.title    !== undefined ? (dto.title?.trim() || download.title) : download.title;
  const newCategory = dto.category !== undefined ?  dto.category                         : download.category;

  await pool.execute(
    'UPDATE downloads SET title = ?, category = ?, department_id = ?, file_id = ? WHERE id = ?',
    [newTitle, newCategory, newDeptId, newFileId, id]
  );

  const changed = [];
  if (newTitle    !== download.title)                                 changed.push('title');
  if (newCategory !== download.category)                             changed.push('category');
  if (String(newDeptId) !== String(download.department_id))         changed.push('department_id');
  if (String(newFileId) !== String(download.file_id))               changed.push('file_id');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'downloads',
    recordId: id,
    description: changed.length
      ? `Updated download id=${id}: changed [${changed.join(', ')}]`
      : `Updated download id=${id}: no changes`,
  });

  return await fetchDownload(id);
}

async function setStatus(id, newStatus, actor) {
  const download = await fetchDownload(id);
  if (!download) throw httpError('Download not found', 404);

  if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
    throw httpError('status must be ACTIVE or INACTIVE', 400);
  }

  if (!canManage(actor, download)) {
    throw httpError('You do not have permission to update this download', 403);
  }

  await pool.execute('UPDATE downloads SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'downloads',
    recordId: id,
    description: `Changed status of download id=${id} ("${download.title}") to ${newStatus}`,
  });

  return await fetchDownload(id);
}

async function softDelete(id, actor) {
  const download = await fetchDownload(id);
  if (!download) throw httpError('Download not found', 404);

  if (!canManage(actor, download)) {
    throw httpError('You do not have permission to delete this download', 403);
  }

  await pool.execute("UPDATE downloads SET status = 'INACTIVE' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'downloads',
    recordId: id,
    description: `Soft-deleted download id=${id} ("${download.title}")`,
  });
}

module.exports = {
  listDownloads,
  getDownload,
  incrementCount,
  createDownload,
  updateDownload,
  setStatus,
  softDelete,
};
