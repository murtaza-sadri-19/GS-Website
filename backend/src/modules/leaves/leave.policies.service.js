/**
 * Leave Policies — per role/department/year CRUD
 */
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { httpError } = require('../../utils/errors');

const COLS = `
  lp.id, lp.leave_type_id, lp.role, lp.department_id, lp.academic_year,
  lp.max_days, lp.carry_forward, lp.requires_attachment,
  lp.requires_hod_approval, lp.requires_principal_approval,
  lp.created_at, lp.updated_at,
  lt.name AS leave_type_name, lt.code AS leave_type_code, lt.color AS leave_type_color,
  d.name AS department_name
`;
const FROM = `
  FROM leave_policies lp
  JOIN leave_types lt ON lp.leave_type_id = lt.id
  LEFT JOIN departments d ON lp.department_id = d.id
`;

async function fetchById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} WHERE lp.id = ?`, [id]);
  return rows[0] || null;
}

/**
 * List policies. HOD sees only their dept (+ global policies).
 */
async function list(actor, { academic_year, role, department_id } = {}) {
  const conds  = [];
  const params = [];

  if (actor.role === 'HOD') {
    // HOD sees global (NULL dept) + their own department policies
    conds.push('(lp.department_id IS NULL OR lp.department_id = ?)');
    params.push(actor.department_id);
  } else if (department_id) {
    conds.push('lp.department_id = ?');
    params.push(parseInt(department_id));
  }

  if (academic_year) { conds.push('lp.academic_year = ?'); params.push(academic_year); }
  if (role)          { conds.push('lp.role = ?');          params.push(role); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT ${COLS} ${FROM} ${where} ORDER BY lp.academic_year DESC, lt.name ASC`, params
  );
  return rows;
}

async function create(dto, actor) {
  const {
    leave_type_id, role = 'TEACHER', department_id = null,
    academic_year = currentAcademicYear(), max_days = 0,
    carry_forward = 0, requires_attachment = 0,
    requires_hod_approval = 1, requires_principal_approval = 0,
  } = dto;

  if (!leave_type_id) throw httpError('leave_type_id is required', 400);

  // HOD can only create policies for their own department (or null dept = global)
  if (actor.role === 'HOD' && department_id !== null && Number(department_id) !== Number(actor.department_id)) {
    throw httpError('HOD can only create policies for their own department', 403);
  }

  const [result] = await pool.execute(
    `INSERT INTO leave_policies
       (leave_type_id, role, department_id, academic_year, max_days, carry_forward,
        requires_attachment, requires_hod_approval, requires_principal_approval)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [leave_type_id, role, department_id || null, academic_year, max_days,
     carry_forward ? 1 : 0, requires_attachment ? 1 : 0,
     requires_hod_approval ? 1 : 0, requires_principal_approval ? 1 : 0]
  );
  await writeAudit({ userId: actor.id, action: 'CREATE', module: 'leave_policies', recordId: result.insertId,
    description: `Created leave policy id=${result.insertId} (type=${leave_type_id}, role=${role}, year=${academic_year})` });
  return fetchById(result.insertId);
}

async function update(id, dto, actor) {
  const existing = await fetchById(id);
  if (!existing) throw httpError('Policy not found', 404);

  if (actor.role === 'HOD' && existing.department_id !== null && Number(existing.department_id) !== Number(actor.department_id)) {
    throw httpError('HOD can only update policies for their own department', 403);
  }

  const max_days                  = dto.max_days                  !== undefined ? parseInt(dto.max_days)                : existing.max_days;
  const carry_forward             = dto.carry_forward             !== undefined ? (dto.carry_forward ? 1 : 0)           : existing.carry_forward;
  const requires_attachment       = dto.requires_attachment       !== undefined ? (dto.requires_attachment ? 1 : 0)     : existing.requires_attachment;
  const requires_hod_approval     = dto.requires_hod_approval     !== undefined ? (dto.requires_hod_approval ? 1 : 0)   : existing.requires_hod_approval;
  const requires_principal_approval = dto.requires_principal_approval !== undefined
    ? (dto.requires_principal_approval ? 1 : 0) : existing.requires_principal_approval;

  await pool.execute(
    `UPDATE leave_policies SET max_days = ?, carry_forward = ?, requires_attachment = ?,
       requires_hod_approval = ?, requires_principal_approval = ? WHERE id = ?`,
    [max_days, carry_forward, requires_attachment, requires_hod_approval, requires_principal_approval, id]
  );
  await writeAudit({ userId: actor.id, action: 'UPDATE', module: 'leave_policies', recordId: id,
    description: `Updated leave policy id=${id} (max_days=${max_days})` });
  return fetchById(id);
}

async function remove(id, actor) {
  const existing = await fetchById(id);
  if (!existing) throw httpError('Policy not found', 404);
  if (actor.role === 'HOD' && existing.department_id !== null && Number(existing.department_id) !== Number(actor.department_id)) {
    throw httpError('HOD can only delete policies for their own department', 403);
  }
  await pool.execute('DELETE FROM leave_policies WHERE id = ?', [id]);
  await writeAudit({ userId: actor.id, action: 'DELETE', module: 'leave_policies', recordId: id,
    description: `Deleted leave policy id=${id}` });
}

/** Helper: current academic year string e.g. "2026-27" */
function currentAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const startYear = m >= 7 ? y : y - 1;
  return `${startYear}-${String(startYear + 1).slice(-2)}`;
}

module.exports = { list, create, update, remove, currentAcademicYear };
