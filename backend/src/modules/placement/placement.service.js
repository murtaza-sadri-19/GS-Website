const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const RECORD_TYPES = ['NOTICE', 'COMPANY_VISIT', 'PLACEMENT_RECORD', 'TRAINING_PROGRAM'];

const PLACEMENT_COLS = `
  pr.id, pr.title, pr.record_type, pr.company_name, pr.academic_year,
  pr.description, pr.file_id, pr.uploaded_by, pr.status, pr.created_at, pr.updated_at,
  u.name AS uploaded_by_name,
  f.file_url, f.original_name, f.file_type, f.file_size
`;

const FROM_CLAUSE = `
  FROM placement_records pr
  INNER JOIN users u ON pr.uploaded_by = u.id
  LEFT  JOIN files f ON pr.file_id     = f.id
`;

// ── Internal helpers ──────────────────────────────────────────────────────────

async function fetchRecord(id) {
  const [rows] = await pool.execute(
    `SELECT ${PLACEMENT_COLS} ${FROM_CLAUSE} WHERE pr.id = ?`,
    [id]
  );
  return rows[0] || null;
}

// Validate required fields that differ per record_type
function validateByType(record_type, dto) {
  const { company_name, academic_year, description } = dto;

  if (!description || !String(description).trim()) {
    throw httpError('description is required', 400);
  }
  if (record_type === 'COMPANY_VISIT') {
    if (!company_name  || !String(company_name).trim())  throw httpError('company_name is required for COMPANY_VISIT', 400);
    if (!academic_year || !String(academic_year).trim()) throw httpError('academic_year is required for COMPANY_VISIT', 400);
  }
  if (record_type === 'PLACEMENT_RECORD') {
    if (!academic_year || !String(academic_year).trim()) throw httpError('academic_year is required for PLACEMENT_RECORD', 400);
  }
}

// ── Public ────────────────────────────────────────────────────────────────────

// Single function backing all four public GET routes.
// Pass record_type to pre-filter; leave undefined for any general listing.
async function listRecords({ page = 1, pageSize = 20, record_type, company_name, academic_year, q } = {}) {
  page     = Math.max(1, parseInt(page)     || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const conditions = ["pr.status = 'ACTIVE'"];
  const params     = [];

  if (record_type) {
    conditions.push('pr.record_type = ?');
    params.push(record_type);
  }
  if (company_name) {
    conditions.push('pr.company_name LIKE ?');
    params.push(`%${company_name}%`);
  }
  if (academic_year) {
    conditions.push('pr.academic_year = ?');
    params.push(academic_year);
  }
  if (q) {
    conditions.push('(pr.title LIKE ? OR pr.description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${PLACEMENT_COLS} ${FROM_CLAUSE} ${where} ORDER BY pr.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(
      `SELECT COUNT(*) AS total FROM placement_records pr ${where}`,
      params
    ),
  ]);

  const total = countRows[0].total;
  return {
    records: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

async function getRecord(id) {
  const record = await fetchRecord(id);
  if (!record || record.status !== 'ACTIVE') throw httpError('Record not found', 404);
  return record;
}

// ── Admin ─────────────────────────────────────────────────────────────────────

async function createRecord(dto, actor) {
  const { title, record_type, company_name, academic_year, description, file_id } = dto;

  if (!title || !title.trim()) throw httpError('title is required', 400);
  if (!record_type)            throw httpError('record_type is required', 400);
  if (!RECORD_TYPES.includes(record_type)) {
    throw httpError(`record_type must be one of: ${RECORD_TYPES.join(', ')}`, 400);
  }

  validateByType(record_type, dto);

  // file_id is optional but must be valid if provided
  if (file_id) {
    const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [file_id]);
    if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
  }

  const [result] = await pool.execute(
    `INSERT INTO placement_records
       (title, record_type, company_name, academic_year, description, file_id, uploaded_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
    [
      title.trim(),
      record_type,
      company_name  || null,
      academic_year || null,
      description   || null,
      file_id       || null,
      actor.id,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId: actor.id,
    action: 'CREATE',
    module: 'placement',
    recordId: newId,
    description: `Created placement record "${title.trim()}" (type=${record_type})`,
  });

  return await fetchRecord(newId);
}

async function updateRecord(id, dto, actor) {
  const record = await fetchRecord(id);
  if (!record) throw httpError('Record not found', 404);

  // record_type is immutable after creation
  if (dto.record_type !== undefined && dto.record_type !== record.record_type) {
    throw httpError('record_type cannot be changed after creation', 400);
  }

  // file_id is optional but must be valid if provided
  let newFileId = record.file_id;
  if (dto.file_id !== undefined) {
    newFileId = dto.file_id || null;
    if (newFileId) {
      const [fileRows] = await pool.execute('SELECT id FROM files WHERE id = ?', [newFileId]);
      if (!fileRows[0]) throw httpError('file_id does not reference a valid file', 400);
    }
  }

  const newTitle        = dto.title        !== undefined ? (dto.title?.trim()  || record.title)        : record.title;
  const newCompanyName  = dto.company_name  !== undefined ? (dto.company_name  || null)                : record.company_name;
  const newAcademicYear = dto.academic_year !== undefined ? (dto.academic_year || null)                : record.academic_year;
  const newDescription  = dto.description  !== undefined ? (dto.description   || null)                : record.description;

  if (!newTitle) throw httpError('title cannot be empty', 400);

  // Re-validate required fields for the (fixed) record_type with resolved values
  validateByType(record.record_type, {
    description:  newDescription,
    company_name: newCompanyName,
    academic_year: newAcademicYear,
  });

  await pool.execute(
    `UPDATE placement_records
     SET title = ?, company_name = ?, academic_year = ?, description = ?, file_id = ?
     WHERE id = ?`,
    [newTitle, newCompanyName, newAcademicYear, newDescription, newFileId, id]
  );

  const changed = [];
  if (newTitle                              !== record.title)         changed.push('title');
  if (newCompanyName                        !== record.company_name)  changed.push('company_name');
  if (newAcademicYear                       !== record.academic_year) changed.push('academic_year');
  if (newDescription                        !== record.description)   changed.push('description');
  if (String(newFileId)                     !== String(record.file_id)) changed.push('file_id');

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'placement',
    recordId: id,
    description: changed.length
      ? `Updated placement record id=${id}: changed [${changed.join(', ')}]`
      : `Updated placement record id=${id}: no changes`,
  });

  return await fetchRecord(id);
}

async function setStatus(id, newStatus, actor) {
  const record = await fetchRecord(id);
  if (!record) throw httpError('Record not found', 404);

  if (!['ACTIVE', 'INACTIVE'].includes(newStatus)) {
    throw httpError('status must be ACTIVE or INACTIVE', 400);
  }

  await pool.execute('UPDATE placement_records SET status = ? WHERE id = ?', [newStatus, id]);

  await writeAudit({
    userId: actor.id,
    action: 'UPDATE',
    module: 'placement',
    recordId: id,
    description: `Changed status of placement record id=${id} ("${record.title}") to ${newStatus}`,
  });

  return await fetchRecord(id);
}

async function softDelete(id, actor) {
  const record = await fetchRecord(id);
  if (!record) throw httpError('Record not found', 404);

  await pool.execute("UPDATE placement_records SET status = 'INACTIVE' WHERE id = ?", [id]);

  await writeAudit({
    userId: actor.id,
    action: 'DELETE',
    module: 'placement',
    recordId: id,
    description: `Soft-deleted placement record id=${id} ("${record.title}")`,
  });
}

module.exports = { listRecords, getRecord, createRecord, updateRecord, setStatus, softDelete };
