const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const { httpError } = require('../../utils/errors');

const COLS = `
  lr.id, lr.user_id, lr.department_id, lr.leave_type, lr.from_date, lr.to_date,
  lr.days_count, lr.reason, lr.attachment_file_id, lr.status, lr.reviewed_by,
  lr.review_remarks, lr.applied_at, lr.created_at, lr.updated_at,
  u.name AS applicant_name, u.email AS applicant_email,
  rv.name AS reviewer_name
`;
const FROM = `
  FROM leave_requests lr
  INNER JOIN users u ON lr.user_id = u.id
  LEFT JOIN users rv ON lr.reviewed_by = rv.id
`;

async function fetchById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} WHERE lr.id = ?`, [id]);
  return rows[0] || null;
}

function daysBetween(from, to) {
  const d = Math.round((new Date(to) - new Date(from)) / 86400000) + 1;
  return d > 0 ? d : 1;
}

// Teacher applies for leave
async function apply(dto, actor) {
  const { leave_type = 'Casual', from_date, to_date, reason, attachment_file_id } = dto;
  if (!from_date || !to_date) throw httpError('from_date and to_date are required', 400);
  if (!reason || !reason.trim()) throw httpError('reason is required', 400);
  if (new Date(to_date) < new Date(from_date)) throw httpError('to_date cannot be before from_date', 400);

  const [result] = await pool.execute(
    `INSERT INTO leave_requests
       (user_id, department_id, leave_type, from_date, to_date, days_count, reason, attachment_file_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [actor.id, actor.department_id || null, leave_type, from_date, to_date,
     daysBetween(from_date, to_date), reason.trim(), attachment_file_id || null]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'leaves', recordId: result.insertId,
    description: `Applied for ${leave_type} leave ${from_date}→${to_date}` });
  return fetchById(result.insertId);
}

// Teacher's own leaves
async function listMine(actor, { status } = {}) {
  const conds = ['lr.user_id = ?'];
  const params = [actor.id];
  if (status) { conds.push('lr.status = ?'); params.push(status); }
  const [rows] = await pool.execute(
    `SELECT ${COLS} ${FROM} WHERE ${conds.join(' AND ')} ORDER BY lr.applied_at DESC`, params
  );
  return rows;
}

// HOD/admin view — HOD restricted to own department
async function listForReview(actor, { status, department_id } = {}) {
  const conds = [];
  const params = [];
  if (actor.role === 'HOD') { conds.push('lr.department_id = ?'); params.push(actor.department_id); }
  else if (department_id)   { conds.push('lr.department_id = ?'); params.push(parseInt(department_id)); }
  if (status) { conds.push('lr.status = ?'); params.push(status); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT ${COLS} ${FROM} ${where} ORDER BY lr.applied_at DESC`, params
  );
  return rows;
}

async function review(id, decision, actor, remarks) {
  if (!['approved', 'rejected'].includes(decision)) throw httpError('decision must be approved or rejected', 400);
  const leave = await fetchById(id);
  if (!leave) throw httpError('Leave request not found', 404);
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(leave.department_id)) {
    throw httpError('HOD can only review leaves from their own department', 403);
  }
  if (leave.status !== 'pending') throw httpError(`Leave is already ${leave.status}`, 409);

  await pool.execute(
    'UPDATE leave_requests SET status = ?, reviewed_by = ?, review_remarks = ? WHERE id = ?',
    [decision, actor.id, remarks || null, id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'leaves', recordId: id,
    description: `${decision} leave id=${id}` });
  return fetchById(id);
}

module.exports = { apply, listMine, listForReview, review };
