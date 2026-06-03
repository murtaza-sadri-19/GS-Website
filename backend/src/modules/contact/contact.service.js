const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { cleanText } = require('../../utils/sanitize');

const { httpError } = require('../../utils/errors');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function submit(dto, ipAddress) {
  const name    = cleanText(dto.name);
  const email   = (dto.email || '').trim();
  const subject = cleanText(dto.subject);
  const message = cleanText(dto.message);
  const phone   = cleanText(dto.phone);

  if (!name)              throw httpError('name is required', 400);
  if (!EMAIL_RE.test(email)) throw httpError('A valid email is required', 400);
  if (!message)           throw httpError('message is required', 400);

  const [result] = await pool.execute(
    `INSERT INTO contact_submissions (name, email, phone, subject, message, ip_address)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, email.toLowerCase(), phone || null, subject || null, message, ipAddress || null]
  );
  return { id: result.insertId };
}

async function list({ is_read } = {}) {
  const conds = [];
  const params = [];
  if (is_read !== undefined) { conds.push('is_read = ?'); params.push(is_read === 'true' || is_read === true ? 1 : 0); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT * FROM contact_submissions ${where} ORDER BY created_at DESC`, params);
  return rows;
}

async function markRead(id, actor) {
  const [result] = await pool.execute('UPDATE contact_submissions SET is_read = 1 WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw httpError('Submission not found', 404);
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'contact', recordId: id, description: `Marked submission id=${id} read` });
}

async function remove(id, actor) {
  const [result] = await pool.execute('DELETE FROM contact_submissions WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw httpError('Submission not found', 404);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'contact', recordId: id, description: `Deleted submission id=${id}` });
}

module.exports = { submit, list, markRead, remove };
