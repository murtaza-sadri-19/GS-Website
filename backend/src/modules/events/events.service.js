const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { slugify, ensureUniqueSlug } = require('../../utils/slug');
const { parsePagination } = require('../../utils/pagination');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const EVENT_COLS = `
  e.id, e.title, e.slug, e.description, e.event_date, e.department_id,
  e.cover_image_file_id, e.created_by, e.status, e.created_at, e.updated_at,
  u.name AS created_by_name,
  d.name AS department_name, d.slug AS department_slug,
  f.file_url AS cover_image_url,
  COALESCE(f.attachment_type, 'FILE') AS cover_attachment_type,
  f.original_name AS cover_original_name
`;

const FROM_CLAUSE = `
  FROM events e
  INNER JOIN users u        ON e.created_by          = u.id
  LEFT  JOIN departments d  ON e.department_id        = d.id
  LEFT  JOIN files f        ON e.cover_image_file_id  = f.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchEvent(id) {
  const [rows] = await pool.execute(
    `SELECT ${EVENT_COLS} ${FROM_CLAUSE} WHERE e.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function fetchEventBySlug(slug) {
  const [rows] = await pool.execute(
    `SELECT ${EVENT_COLS} ${FROM_CLAUSE} WHERE e.slug = ?`,
    [slug]
  );
  return rows[0] || null;
}

function canManage(actor, event) {
  if (actor.role === 'CENTRAL_ADMIN' || actor.role === 'SUPER_ADMIN') return true;
  if (actor.role === 'HOD') {
    return Number(event.department_id) === Number(actor.department_id);
  }
  return false;
}

// ── Public ────────────────────────────────────────────────────────────────────

async function listEvents({ page, pageSize, department_id, q } = {}, actor = null) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;

  const conditions = [];
  const params     = [];

  // Authenticated admin/staff see all non-ARCHIVED events; public sees only PUBLISHED
  const adminRoles = ['CENTRAL_ADMIN', 'SUPER_ADMIN', 'HOD', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER', 'TEACHER'];
  if (!actor || !adminRoles.includes(actor.role)) {
    conditions.push("e.status = 'PUBLISHED'");
  } else {
    conditions.push("e.status != 'ARCHIVED'");
  }

  if (department_id) {
    conditions.push('e.department_id = ?');
    params.push(parseInt(department_id));
  }
  if (q) {
    conditions.push('(e.title LIKE ? OR e.description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${EVENT_COLS} ${FROM_CLAUSE} ${where} ORDER BY e.event_date DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM events e ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    events: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getEvent(slug) {
  const event = await fetchEventBySlug(slug);
  if (!event || event.status !== 'PUBLISHED') throw httpError('Event not found', 404);
  return event;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createEvent(dto, actor) {
  const { title, description, event_date, cover_image_file_id } = dto;
  const eventStatus = ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(dto.status) ? dto.status : 'DRAFT';

  if (!title || !title.trim()) throw httpError('title is required', 400);

  // Resolve and enforce department_id based on role
  let department_id;
  if (actor.role === 'HOD') {
    if (!actor.department_id) throw httpError('HOD must be assigned to a department', 403);
    department_id = actor.department_id; // always forced — HOD cannot create college-wide events
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

  // Validate cover image if provided
  if (cover_image_file_id) {
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [cover_image_file_id]);
    if (!fileRows[0]) throw httpError('cover_image_file_id does not reference a valid file', 400);
  }

  const baseSlug = slugify(title.trim());
  if (!baseSlug) throw httpError('Could not generate a valid slug from the provided title', 400);
  const slug = await ensureUniqueSlug('events', baseSlug);

  const [result] = await pool.execute(
    `INSERT INTO events
       (title, slug, description, event_date, department_id, cover_image_file_id, created_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title.trim(),
      slug,
      description          || null,
      event_date           || null,
      department_id        || null,
      cover_image_file_id  || null,
      actor.id,
      eventStatus,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'events',
    recordId: newId,
    description: `Created event "${title.trim()}" (slug: ${slug}, dept=${department_id ?? 'null'})`,
  });

  return await fetchEvent(newId);
}

async function updateEvent(id, dto, actor) {
  const event = await fetchEvent(id);
  if (!event) throw httpError('Event not found', 404);

  if (!canManage(actor, event)) {
    throw httpError('You do not have permission to update this event', 403);
  }

  // Only CENTRAL_ADMIN can change department_id
  let newDeptId = event.department_id;
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

  // Cover image validation
  if (dto.cover_image_file_id !== undefined && dto.cover_image_file_id) {
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [dto.cover_image_file_id]);
    if (!fileRows[0]) throw httpError('cover_image_file_id does not reference a valid file', 400);
  }

  // Regenerate slug only when title actually changes
  let newTitle = event.title;
  let newSlug  = event.slug;
  if (dto.title !== undefined) {
    const trimmed = dto.title.trim();
    if (!trimmed) throw httpError('title cannot be empty', 400);
    if (trimmed !== event.title) {
      newTitle = trimmed;
      const base = slugify(newTitle);
      if (!base) throw httpError('Could not generate a valid slug from the provided title', 400);
      newSlug = await ensureUniqueSlug('events', base, id);
    }
  }

  const newDescription       = dto.description          !== undefined ? (dto.description          || null) : event.description;
  const newEventDate         = dto.event_date            !== undefined ? (dto.event_date            || null) : event.event_date;
  const newCoverImageFileId  = dto.cover_image_file_id  !== undefined ? (dto.cover_image_file_id   || null) : event.cover_image_file_id;

  await pool.execute(
    `UPDATE events
     SET title = ?, slug = ?, description = ?, event_date = ?,
         department_id = ?, cover_image_file_id = ?
     WHERE id = ?`,
    [newTitle, newSlug, newDescription, newEventDate, newDeptId, newCoverImageFileId, id]
  );

  const changed = [];
  if (newTitle              !== event.title)                                      changed.push('title');
  if (newSlug               !== event.slug)                                       changed.push('slug');
  if (newDescription        !== event.description)                                changed.push('description');
  if (String(newEventDate)  !== String(event.event_date))                        changed.push('event_date');
  if (String(newDeptId)     !== String(event.department_id))                     changed.push('department_id');
  if (String(newCoverImageFileId) !== String(event.cover_image_file_id))        changed.push('cover_image_file_id');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'events',
    recordId: id,
    description: changed.length
      ? `Updated event id=${id}: changed [${changed.join(', ')}]`
      : `Updated event id=${id}: no changes`,
  });

  return await fetchEvent(id);
}

async function setStatus(id, newStatus, actor) {
  const event = await fetchEvent(id);
  if (!event) throw httpError('Event not found', 404);

  if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(newStatus)) {
    throw httpError('status must be DRAFT, PUBLISHED, or ARCHIVED', 400);
  }

  if (!canManage(actor, event)) {
    throw httpError('You do not have permission to update this event', 403);
  }

  await pool.execute('UPDATE events SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'events',
    recordId: id,
    description: `Changed status of event id=${id} ("${event.title}") to ${newStatus}`,
  });

  return await fetchEvent(id);
}

async function archiveEvent(id, actor) {
  const event = await fetchEvent(id);
  if (!event) throw httpError('Event not found', 404);

  if (!canManage(actor, event)) {
    throw httpError('You do not have permission to delete this event', 403);
  }

  await pool.execute("UPDATE events SET status = 'ARCHIVED' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'events',
    recordId: id,
    description: `Archived event id=${id} ("${event.title}")`,
  });
}

module.exports = { listEvents, getEvent, createEvent, updateEvent, setStatus, archiveEvent };
