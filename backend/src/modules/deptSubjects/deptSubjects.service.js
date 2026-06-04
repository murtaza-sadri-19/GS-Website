/**
 * Department Subjects Service
 *
 * HOD-owned subject management, fully independent from the exam system.
 * HOD has full CRUD on their own department's subjects.
 * Faculty list comes from faculty_profiles for the same department.
 */
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const { httpError } = require('../../utils/errors');

const COLS = `
  ds.id, ds.department_id, ds.subject_code, ds.subject_name,
  ds.subject_type, ds.semester, ds.credits, ds.program,
  ds.academic_year, ds.description, ds.faculty_user_id, ds.is_active,
  ds.created_by, ds.created_at, ds.updated_at,
  u.name  AS faculty_name,
  u.email AS faculty_email,
  d.name  AS department_name
`;
const FROM = `
  FROM dept_subjects ds
  JOIN departments d ON ds.department_id = d.id
  LEFT JOIN users u ON ds.faculty_user_id = u.id
`;

async function fetchById(id) {
  const [rows] = await pool.execute(`SELECT ${COLS} ${FROM} WHERE ds.id = ?`, [id]);
  return rows[0] || null;
}

/** HOD enforcement — they can only touch their own department */
function assertHodOwnership(actor, departmentId) {
  if (actor.role === 'HOD' && Number(actor.department_id) !== Number(departmentId)) {
    throw httpError('HOD can only manage subjects for their own department', 403);
  }
}

// ── List ──────────────────────────────────────────────────────────────────────

async function list({ department_id, semester, academic_year, is_active, program } = {}) {
  const conds  = [];
  const params = [];
  if (department_id) { conds.push('ds.department_id = ?'); params.push(parseInt(department_id)); }
  if (semester)      { conds.push('ds.semester = ?');       params.push(parseInt(semester)); }
  if (academic_year) { conds.push('ds.academic_year = ?');  params.push(academic_year); }
  if (program)       { conds.push('ds.program = ?');        params.push(program); }
  if (is_active !== undefined) {
    conds.push('ds.is_active = ?'); params.push(is_active ? 1 : 0);
  } else {
    conds.push('ds.is_active = 1'); // default: only active
  }
  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT ${COLS} ${FROM} ${where} ORDER BY ds.semester ASC, ds.subject_code ASC`,
    params
  );
  return rows;
}

// ── Create ────────────────────────────────────────────────────────────────────

async function create(dto, actor) {
  const {
    department_id, subject_code, subject_name,
    subject_type = 'Theory', semester = 1, credits = 3,
    program = 'B.Tech', academic_year, description = null,
    faculty_user_id = null,
  } = dto;

  if (!department_id)         throw httpError('department_id is required', 400);
  if (!subject_code?.trim())  throw httpError('subject_code is required', 400);
  if (!subject_name?.trim())  throw httpError('subject_name is required', 400);

  assertHodOwnership(actor, department_id);

  const year = academic_year || currentAcademicYear();
  const code = subject_code.trim().toUpperCase();

  // Duplicate check
  const [dup] = await pool.execute(
    'SELECT id FROM dept_subjects WHERE department_id = ? AND subject_code = ? AND academic_year = ?',
    [department_id, code, year]
  );
  if (dup[0]) throw httpError(`Subject code ${code} already exists for this department and year`, 409);

  // Validate faculty belongs to same dept if provided
  if (faculty_user_id) {
    const [fac] = await pool.execute(
      "SELECT id FROM users WHERE id = ? AND department_id = ?",
      [faculty_user_id, department_id]
    );
    if (!fac[0]) throw httpError('Assigned faculty must belong to the same department', 400);
  }

  const [result] = await pool.execute(
    `INSERT INTO dept_subjects
       (department_id, subject_code, subject_name, subject_type, semester, credits,
        program, academic_year, description, faculty_user_id, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [department_id, code, subject_name.trim(), subject_type,
     semester, credits, program, year, description, faculty_user_id || null, actor.id]
  );
  await writeAudit({
    userId: actor.id, action: 'CREATE', module: 'dept_subjects', recordId: result.insertId,
    description: `Created subject ${code} — ${subject_name} (dept=${department_id}, year=${year})`,
  });
  return fetchById(result.insertId);
}

// ── Update ────────────────────────────────────────────────────────────────────

async function update(id, dto, actor) {
  const existing = await fetchById(id);
  if (!existing) throw httpError('Subject not found', 404);
  assertHodOwnership(actor, existing.department_id);

  const name     = dto.subject_name !== undefined ? dto.subject_name.trim() : existing.subject_name;
  const type     = dto.subject_type !== undefined ? dto.subject_type         : existing.subject_type;
  const sem      = dto.semester     !== undefined ? parseInt(dto.semester)   : existing.semester;
  const credits  = dto.credits      !== undefined ? parseInt(dto.credits)    : existing.credits;
  const program  = dto.program      !== undefined ? dto.program               : existing.program;
  const desc     = dto.description  !== undefined ? dto.description           : existing.description;
  const facId    = dto.faculty_user_id !== undefined ? (dto.faculty_user_id || null) : existing.faculty_user_id;

  if (facId) {
    const [fac] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND department_id = ?',
      [facId, existing.department_id]
    );
    if (!fac[0]) throw httpError('Assigned faculty must belong to the same department', 400);
  }

  await pool.execute(
    `UPDATE dept_subjects
     SET subject_name = ?, subject_type = ?, semester = ?, credits = ?,
         program = ?, description = ?, faculty_user_id = ?
     WHERE id = ?`,
    [name, type, sem, credits, program, desc, facId, id]
  );
  await writeAudit({
    userId: actor.id, action: 'UPDATE', module: 'dept_subjects', recordId: id,
    description: `Updated dept subject id=${id} (${existing.subject_code})`,
  });
  return fetchById(id);
}

// ── Delete ────────────────────────────────────────────────────────────────────

async function remove(id, actor) {
  const existing = await fetchById(id);
  if (!existing) throw httpError('Subject not found', 404);
  assertHodOwnership(actor, existing.department_id);

  await pool.execute('DELETE FROM dept_subjects WHERE id = ?', [id]);
  await writeAudit({
    userId: actor.id, action: 'DELETE', module: 'dept_subjects', recordId: id,
    description: `Deleted dept subject id=${id} (${existing.subject_code} — ${existing.subject_name})`,
  });
}

// ── Assign Faculty ────────────────────────────────────────────────────────────

async function assignFaculty(id, facultyUserId, actor) {
  const existing = await fetchById(id);
  if (!existing) throw httpError('Subject not found', 404);
  assertHodOwnership(actor, existing.department_id);

  if (facultyUserId) {
    const [fac] = await pool.execute(
      'SELECT id FROM users WHERE id = ? AND department_id = ?',
      [facultyUserId, existing.department_id]
    );
    if (!fac[0]) throw httpError('Faculty must belong to the same department', 400);
  }

  await pool.execute('UPDATE dept_subjects SET faculty_user_id = ? WHERE id = ?',
    [facultyUserId || null, id]);
  await writeAudit({
    userId: actor.id, action: 'UPDATE', module: 'dept_subjects', recordId: id,
    description: `Assigned faculty user_id=${facultyUserId} to subject id=${id}`,
  });
  return fetchById(id);
}

// ── Faculty list for HOD's dept ───────────────────────────────────────────────

async function getFacultyForDept(departmentId) {
  const [rows] = await pool.execute(
    `SELECT fp.id AS profile_id, u.id AS user_id, u.name, u.email, fp.designation, fp.specialization
     FROM faculty_profiles fp
     JOIN users u ON fp.user_id = u.id
     WHERE fp.department_id = ? AND fp.status = 'ACTIVE'
     ORDER BY u.name ASC`,
    [departmentId]
  );
  return rows;
}

function currentAcademicYear() {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const start = m >= 7 ? y : y - 1;
  return `${start}-${String(start + 1).slice(-2)}`;
}

module.exports = { list, create, update, remove, assignFaculty, getFacultyForDept };
