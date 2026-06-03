const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { slugify, ensureUniqueSlug } = require('../../utils/slug');
const { parsePagination } = require('../../utils/pagination');

const { httpError } = require('../../utils/errors');

const NOTICE_TYPES = ['GENERAL', 'DEPARTMENT', 'EXAM', 'PLACEMENT'];

const NOTICE_COLS = `
  n.id, n.title, n.slug, n.description, n.notice_type, n.department_id, n.file_id,
  n.created_by, n.publish_date, n.status, n.created_at, n.updated_at,
  u.name AS created_by_name,
  d.name AS department_name,
  f.file_url, f.original_name, f.file_type, f.file_size,
  COALESCE(f.attachment_type, 'FILE') AS attachment_type
`;

const FROM_CLAUSE = `
  FROM notices n
  INNER JOIN users u ON n.created_by = u.id
  LEFT JOIN departments d ON n.department_id = d.id
  LEFT JOIN files f ON n.file_id = f.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchNotice(id) {
  const [rows] = await pool.execute(
    `SELECT ${NOTICE_COLS} ${FROM_CLAUSE} WHERE n.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// Returns true if actor is allowed to create/edit/delete this notice
function canManage(actor, notice) {
  if (actor.role === 'CENTRAL_ADMIN' || actor.role === 'SUPER_ADMIN') return true;
  if (actor.role === 'HOD') {
    return notice.notice_type === 'DEPARTMENT'
      && Number(notice.department_id) === Number(actor.department_id);
  }
  if (actor.role === 'EXAM_CONTROLLER')   return notice.notice_type === 'EXAM';
  if (actor.role === 'PLACEMENT_OFFICER') return notice.notice_type === 'PLACEMENT';
  return false;
}

function toDateStr(val) {
  if (!val) return '';
  if (val instanceof Date) return val.toISOString().slice(0, 10);
  return String(val).slice(0, 10);
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listNotices({ page, pageSize, notice_type, department_id, q } = {}, actor = null) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;

  const conditions = [];
  const params     = [];

  // Public endpoint always restricts to published + non-future dates.
  // Authenticated administrators/staff can view draft and future-dated notices.
  if (!actor || !['CENTRAL_ADMIN', 'SUPER_ADMIN', 'HOD', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER'].includes(actor.role)) {
    conditions.push("n.status = 'PUBLISHED'");
    conditions.push('(n.publish_date IS NULL OR n.publish_date <= CURDATE())');
  } else {
    // Hide archived notices for administrators
    conditions.push("n.status != 'ARCHIVED'");
  }

  if (notice_type && NOTICE_TYPES.includes(notice_type)) {
    conditions.push('n.notice_type = ?');
    params.push(notice_type);
  }
  if (department_id) {
    conditions.push('n.department_id = ?');
    params.push(parseInt(department_id));
  }
  if (q) {
    conditions.push('(n.title LIKE ? OR n.description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${NOTICE_COLS} ${FROM_CLAUSE} ${where} ORDER BY n.publish_date DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM notices n ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    notices: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getNotice(id) {
  const notice = await fetchNotice(id);
  if (!notice || notice.status !== 'PUBLISHED') throw httpError('Notice not found', 404);

  // Future-dated notices are not publicly visible yet
  const today = new Date().toISOString().slice(0, 10);
  if (toDateStr(notice.publish_date) > today) throw httpError('Notice not found', 404);

  return notice;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createNotice(dto, actor) {
  const { title, description, notice_type, file_id, publish_date } = dto;
  const status = dto.status || 'DRAFT';

  if (!title || !title.trim()) throw httpError('title is required', 400);
  if (!notice_type)            throw httpError('notice_type is required', 400);
  if (!NOTICE_TYPES.includes(notice_type)) {
    throw httpError(`notice_type must be one of: ${NOTICE_TYPES.join(', ')}`, 400);
  }
  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
    throw httpError('status must be DRAFT, PUBLISHED, or ARCHIVED', 400);
  }
  if (!publish_date) throw httpError('publish_date is required', 400);

  // Enforce role × notice_type rules and resolve department_id
  let department_id = dto.department_id || null;

  if (actor.role === 'HOD') {
    if (notice_type !== 'DEPARTMENT') {
      throw httpError('HOD can only create DEPARTMENT notices', 403);
    }
    department_id = actor.department_id; // always forced — ignore client value
  } else if (actor.role === 'EXAM_CONTROLLER') {
    if (notice_type !== 'EXAM') throw httpError('EXAM_CONTROLLER can only create EXAM notices', 403);
    department_id = null;
  } else if (actor.role === 'PLACEMENT_OFFICER') {
    if (notice_type !== 'PLACEMENT') throw httpError('PLACEMENT_OFFICER can only create PLACEMENT notices', 403);
    department_id = null;
  } else if (actor.role === 'CENTRAL_ADMIN' || actor.role === 'SUPER_ADMIN') {
    if (notice_type === 'DEPARTMENT' && !department_id) {
      throw httpError('department_id is required for DEPARTMENT notices', 400);
    }
    if (notice_type !== 'DEPARTMENT') {
      department_id = null;
    }
  }

  // Validate department if set
  if (department_id) {
    const [deptRows] = await pool.execute(
      "SELECT id FROM departments WHERE id = ? AND status = 'ACTIVE'",
      [department_id]
    );
    if (!deptRows[0]) throw httpError('Department not found or not active', 400);
  }

  // Validate file if provided
  if (file_id) {
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [file_id]);
    if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
  }

  const baseSlug = slugify(title.trim());
  if (!baseSlug) throw httpError('Could not generate a valid slug from the provided title', 400);
  const slug = await ensureUniqueSlug('notices', baseSlug);

  const [result] = await pool.execute(
    `INSERT INTO notices
       (title, slug, description, notice_type, department_id, file_id, created_by, publish_date, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title.trim(),
      slug,
      description   || null,
      notice_type,
      department_id || null,
      file_id       || null,
      actor.id,
      publish_date,
      status,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'notices',
    recordId: newId,
    description: `Created notice "${title.trim()}" (type=${notice_type}, dept=${department_id ?? 'null'})`,
  });

  return await fetchNotice(newId);
}

async function updateNotice(id, dto, actor) {
  const notice = await fetchNotice(id);
  if (!notice) throw httpError('Notice not found', 404);

  if (!canManage(actor, notice)) {
    throw httpError('You do not have permission to update this notice', 403);
  }

  // notice_type is immutable after creation
  if (dto.notice_type !== undefined && dto.notice_type !== notice.notice_type) {
    throw httpError('notice_type cannot be changed after creation', 400);
  }

  // Only CENTRAL_ADMIN can change department_id
  let newDeptId = notice.department_id;
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

  // File validation
  if (dto.file_id !== undefined && dto.file_id) {
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [dto.file_id]);
    if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
  }

  // Regenerate slug only if title actually changes
  let newTitle = notice.title;
  let newSlug  = notice.slug;
  if (dto.title !== undefined) {
    const trimmed = dto.title.trim();
    if (!trimmed) throw httpError('title cannot be empty', 400);
    if (trimmed !== notice.title) {
      newTitle = trimmed;
      const base = slugify(newTitle);
      if (!base) throw httpError('Could not generate a valid slug from the provided title', 400);
      newSlug = await ensureUniqueSlug('notices', base, id);
    }
  }

  const newDescription = dto.description  !== undefined ? (dto.description  || null)      : notice.description;
  const newFileId      = dto.file_id      !== undefined ? (dto.file_id      || null)      : notice.file_id;
  const newPublishDate = dto.publish_date !== undefined ?  dto.publish_date               : notice.publish_date;

  let newStatus = notice.status;
  if (dto.status !== undefined) {
    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(dto.status)) {
      throw httpError('status must be DRAFT, PUBLISHED, or ARCHIVED', 400);
    }
    newStatus = dto.status;
  }

  await pool.execute(
    `UPDATE notices
     SET title = ?, slug = ?, description = ?, department_id = ?, file_id = ?, publish_date = ?, status = ?
     WHERE id = ?`,
    [newTitle, newSlug, newDescription, newDeptId, newFileId, newPublishDate, newStatus, id]
  );

  const changed = [];
  if (newTitle       !== notice.title)                               changed.push('title');
  if (newSlug        !== notice.slug)                                changed.push('slug');
  if (newDescription !== notice.description)                         changed.push('description');
  if (String(newDeptId) !== String(notice.department_id))           changed.push('department_id');
  if (String(newFileId) !== String(notice.file_id))                 changed.push('file_id');
  if (toDateStr(newPublishDate) !== toDateStr(notice.publish_date)) changed.push('publish_date');
  if (newStatus      !== notice.status)                              changed.push('status');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'notices',
    recordId: id,
    description: changed.length
      ? `Updated notice id=${id}: changed [${changed.join(', ')}]`
      : `Updated notice id=${id}: no changes`,
  });

  return await fetchNotice(id);
}

async function setStatus(id, newStatus, actor) {
  const notice = await fetchNotice(id);
  if (!notice) throw httpError('Notice not found', 404);

  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(newStatus)) {
    throw httpError('status must be DRAFT, PUBLISHED, or ARCHIVED', 400);
  }

  if (!canManage(actor, notice)) {
    throw httpError('You do not have permission to update this notice', 403);
  }

  await pool.execute('UPDATE notices SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'notices',
    recordId: id,
    description: `Changed status of notice id=${id} ("${notice.title}") to ${newStatus}`,
  });

  return await fetchNotice(id);
}

async function archiveNotice(id, actor) {
  const notice = await fetchNotice(id);
  if (!notice) throw httpError('Notice not found', 404);

  if (!canManage(actor, notice)) {
    throw httpError('You do not have permission to delete this notice', 403);
  }

  await pool.execute("UPDATE notices SET status = 'ARCHIVED' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'notices',
    recordId: id,
    description: `Archived notice id=${id} ("${notice.title}")`,
  });
}

module.exports = { listNotices, getNotice, createNotice, updateNotice, setStatus, archiveNotice };
