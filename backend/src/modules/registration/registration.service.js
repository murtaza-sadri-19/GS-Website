const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };
const COLS = `rr.*, d.name AS department_name, rv.name AS reviewer_name`;
const FROM = `FROM registration_requests rr
              INNER JOIN departments d ON rr.department_id = d.id
              LEFT JOIN users rv ON rr.reviewed_by = rv.id`;

function assertOwnsDept(actor, deptId) {
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(deptId)) {
    throw httpError('HOD can only manage registration requests for their own department', 403);
  }
}

async function fetchById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} WHERE rr.id = ?`, [id]);
  return rows[0] || null;
}

async function list(actor, { status } = {}) {
  const conds = [];
  const params = [];
  if (actor.role === 'HOD') { conds.push('rr.department_id = ?'); params.push(actor.department_id); }
  if (status) { conds.push('rr.status = ?'); params.push(status); }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} ${where} ORDER BY rr.created_at DESC`, params);
  return rows;
}

async function create(dto, actor) {
  const department_id = actor.role === 'HOD' ? actor.department_id : dto.department_id;
  if (!department_id) throw httpError('department_id is required', 400);
  const { student_enrollment_no, student_name, subject_label, semester, reason } = dto;
  const [result] = await pool.execute(
    `INSERT INTO registration_requests
       (department_id, student_enrollment_no, student_name, subject_label, semester, reason)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [department_id, student_enrollment_no || null, student_name || null,
     subject_label || null, semester || null, reason || null]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'registration', recordId: result.insertId,
    description: `Created registration request id=${result.insertId}` });
  return fetchById(result.insertId);
}

async function review(id, decision, actor, remarks) {
  if (!['approved', 'rejected'].includes(decision)) throw httpError('decision must be approved or rejected', 400);
  const req = await fetchById(id);
  if (!req) throw httpError('Registration request not found', 404);
  assertOwnsDept(actor, req.department_id);
  if (req.status !== 'pending') throw httpError(`Request is already ${req.status}`, 409);
  await pool.execute(
    'UPDATE registration_requests SET status = ?, reviewed_by = ?, review_remarks = ? WHERE id = ?',
    [decision, actor.id, remarks || null, id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'registration', recordId: id,
    description: `${decision} registration request id=${id}` });
  return fetchById(id);
}

module.exports = { list, create, review };
