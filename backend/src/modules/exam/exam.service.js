const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');
const { parsePagination } = require('../../utils/pagination');

const DOCUMENT_TYPES = ['NOTICE', 'TIMETABLE', 'RESULT', 'ACADEMIC_CALENDAR'];

const EXAM_COLS = `
  ed.id, ed.title, ed.document_type, ed.description, ed.file_id,
  ed.uploaded_by, ed.publish_date, ed.status, ed.created_at, ed.updated_at,
  u.name AS uploaded_by_name,
  f.file_url, f.original_name, f.file_type, f.file_size
`;

const FROM_CLAUSE = `
  FROM exam_documents ed
  INNER JOIN users u ON ed.uploaded_by = u.id
  INNER JOIN files f ON ed.file_id     = f.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchDocument(id) {
  const [rows] = await pool.execute(
    `SELECT ${EXAM_COLS} ${FROM_CLAUSE} WHERE ed.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// ── Public ────────────────────────────────────────────────────────────────────

// Single function backing all five public GET routes.
// Pass document_type to pre-filter; leave undefined for the general /documents list.
async function listDocuments({ page = 1, pageSize = 20, document_type, q } = {}) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;
  const conditions = ["ed.status = 'ACTIVE'"];
  const params     = [];

  if (document_type) {
    conditions.push('ed.document_type = ?');
    params.push(document_type);
  }
  if (q) {
    conditions.push('(ed.title LIKE ? OR ed.description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${EXAM_COLS} ${FROM_CLAUSE} ${where} ORDER BY ed.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM exam_documents ed ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    documents: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getDocument(id) {
  const doc = await fetchDocument(id);
  if (!doc || doc.status !== 'ACTIVE') throw httpError('Document not found', 404);
  return doc;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createDocument(dto, actor) {
  const { title, document_type, description, file_id, publish_date } = dto;

  if (!title || !title.trim())  throw httpError('title is required', 400);
  if (!document_type)           throw httpError('document_type is required', 400);
  if (!DOCUMENT_TYPES.includes(document_type)) {
    throw httpError(`document_type must be one of: ${DOCUMENT_TYPES.join(', ')}`, 400);
  }
  if (!file_id) throw httpError('file_id is required', 400);

  // file_id must exist
  const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [file_id]);
  if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);

  const [result] = await pool.execute(
    `INSERT INTO exam_documents
       (title, document_type, description, file_id, uploaded_by, publish_date, status)
     VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      title.trim(),
      document_type,
      description  || null,
      file_id,
      actor.id,
      publish_date || null,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'exam',
    recordId: newId,
    description: `Created exam document "${title.trim()}" (type=${document_type})`,
  });

  return await fetchDocument(newId);
}

async function updateDocument(id, dto, actor) {
  const doc = await fetchDocument(id);
  if (!doc) throw httpError('Document not found', 404);

  // document_type cannot be changed after creation
  if (dto.document_type !== undefined && dto.document_type !== doc.document_type) {
    throw httpError('document_type cannot be changed after creation', 400);
  }

  // file_id can be changed but must remain valid
  let newFileId = doc.file_id;
  if (dto.file_id !== undefined) {
    if (!dto.file_id) throw httpError('file_id cannot be removed — a document must always have a file', 400);
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [dto.file_id]);
    if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
    newFileId = dto.file_id;
  }

  const newTitle       = dto.title        !== undefined ? (dto.title?.trim()  || doc.title)  : doc.title;
  const newDescription = dto.description  !== undefined ? (dto.description    || null)        : doc.description;
  const newPublishDate = dto.publish_date !== undefined ? (dto.publish_date   || null)        : doc.publish_date;

  if (!newTitle) throw httpError('title cannot be empty', 400);

  await pool.execute(
    `UPDATE exam_documents
     SET title = ?, description = ?, file_id = ?, publish_date = ?
     WHERE id = ?`,
    [newTitle, newDescription, newFileId, newPublishDate, id]
  );

  const changed = [];
  if (newTitle                        !== doc.title)        changed.push('title');
  if (newDescription                  !== doc.description)  changed.push('description');
  if (String(newFileId)               !== String(doc.file_id))       changed.push('file_id');
  if (String(newPublishDate)          !== String(doc.publish_date))   changed.push('publish_date');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'exam',
    recordId: id,
    description: changed.length
      ? `Updated exam document id=${id}: changed [${changed.join(', ')}]`
      : `Updated exam document id=${id}: no changes`,
  });

  return await fetchDocument(id);
}

async function setStatus(id, newStatus, actor) {
  const doc = await fetchDocument(id);
  if (!doc) throw httpError('Document not found', 404);

  if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
    throw httpError('status must be ACTIVE or INACTIVE', 400);
  }

  await pool.execute('UPDATE exam_documents SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'exam',
    recordId: id,
    description: `Changed status of exam document id=${id} ("${doc.title}") to ${newStatus}`,
  });

  return await fetchDocument(id);
}

async function softDelete(id, actor) {
  const doc = await fetchDocument(id);
  if (!doc) throw httpError('Document not found', 404);

  await pool.execute("UPDATE exam_documents SET status = 'INACTIVE' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'exam',
    recordId: id,
    description: `Soft-deleted exam document id=${id} ("${doc.title}")`,
  });
}

module.exports = { listDocuments, getDocument, createDocument, updateDocument, setStatus, softDelete };
