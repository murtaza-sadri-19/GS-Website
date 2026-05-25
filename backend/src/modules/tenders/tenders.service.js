const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const slugUtil   = require('../../utils/slug');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

const TENDER_COLS = `
  t.id, t.title, t.slug, t.description, t.file_id, t.tender_no,
  t.deadline, t.created_by, t.status, t.created_at, t.updated_at,
  u.name AS created_by_name,
  f.file_url, f.original_name, f.file_type, f.file_size
`;
const FROM_CLAUSE = `
  FROM tenders t
  INNER JOIN users u ON t.created_by = u.id
  LEFT JOIN files f ON t.file_id = f.id
`;

async function fetchById(id) {
  const [rows] = await pool.execute(
    `SELECT ${TENDER_COLS} ${FROM_CLAUSE} WHERE t.id = ?`, [id]
  );
  return rows[0] || null;
}

async function listTenders({ page = 1, pageSize = 20, status, q } = {}) {
  page     = Math.max(1, parseInt(page) || 1);
  pageSize = Math.min(100, Math.max(1, parseInt(pageSize) || 20));
  const offset = (page - 1) * pageSize;

  const conds = [];
  const params = [];

  if (status) { conds.push('t.status = ?'); params.push(status); }
  else         { conds.push("t.status = 'PUBLISHED'"); }
  if (q) { conds.push('(t.title LIKE ? OR t.tender_no LIKE ?)'); params.push(`%${q}%`, `%${q}%`); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT ${TENDER_COLS} ${FROM_CLAUSE} ${where} ORDER BY t.created_at DESC LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(`SELECT COUNT(*) AS total FROM tenders t ${where}`, params),
  ]);

  const total = countRows[0].total;
  return { tenders: rows, pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) } };
}

async function getTender(id) {
  const t = await fetchById(id);
  if (!t) throw httpError('Tender not found', 404);
  return t;
}

async function createTender(dto, actor) {
  const { title, description, file_id, tender_no, deadline, status = 'DRAFT' } = dto;
  if (!title?.trim()) throw httpError('title is required', 400);

  let slug = slugUtil.slugify(title);
  const [existSlug] = await pool.execute('SELECT id FROM tenders WHERE slug = ?', [slug]);
  if (existSlug[0]) slug = `${slug}-${Date.now()}`;

  const [result] = await pool.execute(
    `INSERT INTO tenders (title, slug, description, file_id, tender_no, deadline, created_by, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title.trim(), slug, description || null, file_id || null, tender_no || null, deadline || null, actor.id, status]
  );

  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'tenders', recordId: result.insertId,
    description: `Created tender "${title.trim()}"` });
  return fetchById(result.insertId);
}

async function updateTender(id, dto, actor) {
  const t = await fetchById(id);
  if (!t) throw httpError('Tender not found', 404);

  const title      = dto.title      !== undefined ? dto.title.trim()  : t.title;
  const desc       = dto.description !== undefined ? dto.description   : t.description;
  const file_id    = dto.file_id    !== undefined ? dto.file_id        : t.file_id;
  const tender_no  = dto.tender_no  !== undefined ? dto.tender_no      : t.tender_no;
  const deadline   = dto.deadline   !== undefined ? dto.deadline        : t.deadline;
  const status     = dto.status     !== undefined ? dto.status          : t.status;

  if (!title) throw httpError('title cannot be empty', 400);

  await pool.execute(
    `UPDATE tenders SET title=?, description=?, file_id=?, tender_no=?, deadline=?, status=?, updated_at=NOW() WHERE id=?`,
    [title, desc, file_id, tender_no, deadline, status, id]
  );

  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'tenders', recordId: id,
    description: `Updated tender id=${id}` });
  return fetchById(id);
}

async function setStatus(id, newStatus, actor) {
  const valid = ['DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'];
  if (!valid.includes(newStatus)) throw httpError(`status must be one of: ${valid.join(', ')}`, 400);

  const t = await fetchById(id);
  if (!t) throw httpError('Tender not found', 404);

  await pool.execute('UPDATE tenders SET status=? WHERE id=?', [newStatus, id]);
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'tenders', recordId: id,
    description: `Changed tender id=${id} status to ${newStatus}` });
  return fetchById(id);
}

async function deleteTender(id, actor) {
  const t = await fetchById(id);
  if (!t) throw httpError('Tender not found', 404);

  await pool.execute("UPDATE tenders SET status='ARCHIVED' WHERE id=?", [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'tenders', recordId: id,
    description: `Archived tender id=${id} "${t.title}"` });
}

module.exports = { listTenders, getTender, createTender, updateTender, setStatus, deleteTender };
