/**
 * Academic Service — Sessions, Courses, Subjects, Students, Faculty Assignment
 *
 * Ported from exam-office-website/backend using GS-Website's raw mysql2 pool pattern.
 * Maps:
 *   exam-office branch_id     → GS-Website department_id (INT)
 *   exam-office faculty_id    → GS-Website user.id (INT, role=TEACHER)
 *   exam-office session_id    → exam_sessions.id (INT)
 *   exam-office subject_id    → exam_subjects.id  (INT)
 */

const pool = require('../../config/db');
const path = require('path');
const os   = require('os');
const fs   = require('fs');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getLatestSession() {
  const [rows] = await pool.execute(
    'SELECT * FROM exam_sessions ORDER BY start_year DESC, start_month DESC LIMIT 1'
  );
  if (!rows[0]) throw httpError('No academic session found', 404);
  return rows[0];
}

// ─── SESSIONS ────────────────────────────────────────────────────────────────

async function createSession({ start_month, start_year, end_month, end_year }) {
  if (!start_month || !start_year || !end_month || !end_year)
    throw httpError('start_month, start_year, end_month, end_year are required', 400);

  const [exist] = await pool.execute(
    'SELECT id FROM exam_sessions WHERE start_month=? AND start_year=? AND end_month=? AND end_year=?',
    [start_month, start_year, end_month, end_year]
  );
  if (exist[0]) throw httpError('Session already exists', 409);

  const [result] = await pool.execute(
    'INSERT INTO exam_sessions (start_month, start_year, end_month, end_year) VALUES (?, ?, ?, ?)',
    [start_month, start_year, end_month, end_year]
  );
  const [session] = await pool.execute('SELECT * FROM exam_sessions WHERE id=?', [result.insertId]);
  return session[0];
}

async function getAllSessions() {
  const [rows] = await pool.execute(
    'SELECT * FROM exam_sessions ORDER BY start_year DESC, start_month DESC'
  );
  return rows;
}

async function getLatestSessionPublic() {
  return getLatestSession();
}

async function setActiveSession(id) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('UPDATE exam_sessions SET is_active=0');
    await conn.execute('UPDATE exam_sessions SET is_active=1 WHERE id=?', [id]);
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
}

async function downloadSessionData({ session_id, department_id, course_id, includeStudents, includeSubjects }) {
  const { Parser } = require('json2csv');
  const allData = [];

  if (includeStudents) {
    const [students] = await pool.execute(
      `SELECT es.enrollment_no, es.student_name, es.semester, es.status, ec.course_name, ec.specialization
       FROM exam_students es
       JOIN exam_courses ec ON es.course_id = ec.id
       WHERE es.session_id=? AND es.department_id=? AND es.course_id=?`,
      [session_id, department_id, course_id]
    );
    allData.push(...students.map(s => ({ Type: 'Student', ...s })));
  }

  if (includeSubjects) {
    const [subjects] = await pool.execute(
      `SELECT esub.subject_code, esub.subject_name, esub.subject_type, esub.semester,
              u.name AS faculty_name
       FROM exam_subjects esub
       LEFT JOIN exam_faculty_subjects efs ON efs.subject_id = esub.id AND efs.session_id = esub.session_id AND efs.assignment_type='primary'
       LEFT JOIN users u ON efs.faculty_user_id = u.id
       WHERE esub.session_id=? AND esub.department_id=? AND esub.course_id=?`,
      [session_id, department_id, course_id]
    );
    allData.push(...subjects.map(s => ({ Type: 'Subject', ...s })));
  }

  if (allData.length === 0) throw httpError('No data selected for download', 400);

  const parser = new Parser();
  const csv = parser.parse(allData);
  const filename = `session_${session_id}_${Date.now()}.csv`;
  const filePath = path.join(os.tmpdir(), filename);
  fs.writeFileSync(filePath, csv);
  return { filePath, filename };
}

// ─── COURSES ─────────────────────────────────────────────────────────────────

async function getCourses(department_id) {
  const cond = department_id ? 'WHERE department_id=?' : '';
  const params = department_id ? [department_id] : [];
  const [rows] = await pool.execute(
    `SELECT ec.*, d.name AS department_name FROM exam_courses ec
     JOIN departments d ON ec.department_id = d.id ${cond} ORDER BY ec.course_name`,
    params
  );
  return rows;
}

async function createCourse({ course_code, course_name, specialization = '', department_id }) {
  if (!course_code || !course_name || !department_id)
    throw httpError('course_code, course_name, department_id are required', 400);

  const [result] = await pool.execute(
    'INSERT INTO exam_courses (course_code, course_name, specialization, department_id) VALUES (?, ?, ?, ?)',
    [course_code, course_name, specialization, department_id]
  );
  const [rows] = await pool.execute('SELECT * FROM exam_courses WHERE id=?', [result.insertId]);
  return rows[0];
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

async function getSections(department_id, course_id) {
  const [rows] = await pool.execute(
    'SELECT * FROM exam_sections WHERE department_id=? AND course_id=? ORDER BY section_name',
    [department_id, course_id]
  );
  return rows;
}

async function createSections({ department_id, course_id, count }) {
  if (!department_id || !course_id || !count) throw httpError('department_id, course_id, count required', 400);
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.slice(0, Math.min(count, 26));
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const letter of letters) {
      await conn.execute(
        'INSERT IGNORE INTO exam_sections (department_id, course_id, section_name) VALUES (?, ?, ?)',
        [department_id, course_id, letter]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return getSections(department_id, course_id);
}

// ─── SUBJECTS ────────────────────────────────────────────────────────────────

async function getSubjects({ session_id, department_id, course_id, subject_type } = {}) {
  const conds = [];
  const params = [];
  if (session_id)    { conds.push('esub.session_id=?');    params.push(session_id); }
  if (department_id) { conds.push('esub.department_id=?'); params.push(department_id); }
  if (course_id)     { conds.push('esub.course_id=?');     params.push(course_id); }
  if (subject_type)  { conds.push('esub.subject_type=?');  params.push(subject_type); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT esub.*, ec.course_name, ec.specialization, d.name AS department_name
     FROM exam_subjects esub
     JOIN exam_courses ec ON esub.course_id = ec.id
     JOIN departments d ON esub.department_id = d.id
     ${where} ORDER BY esub.semester, esub.subject_name`,
    params
  );
  return rows;
}

async function createSubject({ session_id, subject_code, subject_name, subject_type = 'Regular', semester, department_id, course_id }) {
  if (!session_id || !subject_code || !subject_name || !semester || !department_id || !course_id)
    throw httpError('session_id, subject_code, subject_name, semester, department_id, course_id required', 400);

  const [result] = await pool.execute(
    `INSERT INTO exam_subjects (session_id, subject_code, subject_name, subject_type, semester, department_id, course_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [session_id, subject_code, subject_name, subject_type, semester, department_id, course_id]
  );
  const [rows] = await pool.execute('SELECT * FROM exam_subjects WHERE id=?', [result.insertId]);
  return rows[0];
}

// ─── STUDENTS ────────────────────────────────────────────────────────────────

async function getStudents({ session_id, department_id, course_id, semester } = {}) {
  const conds = [];
  const params = [];
  if (session_id)    { conds.push('session_id=?');    params.push(session_id); }
  if (department_id) { conds.push('department_id=?'); params.push(department_id); }
  if (course_id)     { conds.push('course_id=?');     params.push(course_id); }
  if (semester)      { conds.push('semester=?');      params.push(semester); }

  const where = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT * FROM exam_students ${where} ORDER BY enrollment_no`, params
  );
  return rows;
}

async function uploadStudentsCSV(csvRows, { session_id, department_id, course_id }) {
  // csvRows: [{ enrollment_no, student_name, semester, status, section_name? }]
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const row of csvRows) {
      let section_id = null;
      if (row.section_name) {
        const [srows] = await conn.execute(
          'SELECT id FROM exam_sections WHERE department_id=? AND course_id=? AND section_name=?',
          [department_id, course_id, row.section_name]
        );
        section_id = srows[0]?.id || null;
      }
      await conn.execute(
        `INSERT INTO exam_students (session_id, enrollment_no, student_name, department_id, course_id, section_id, semester, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE student_name=VALUES(student_name), section_id=VALUES(section_id),
           semester=VALUES(semester), status=VALUES(status)`,
        [session_id, row.enrollment_no, row.student_name, department_id, course_id, section_id, row.semester, row.status || 'regular']
      );
    }
    await conn.commit();
    return { inserted: csvRows.length };
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
}

// ─── FACULTY ASSIGNMENT ───────────────────────────────────────────────────────

async function getFacultyForDept(department_id) {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email, fp.designation
     FROM users u
     LEFT JOIN faculty_profiles fp ON u.id = fp.user_id
     WHERE u.role_id = (SELECT id FROM roles WHERE role_name='TEACHER')
       AND u.department_id=? AND u.status='ACTIVE'
     ORDER BY u.name`,
    [department_id]
  );
  return rows;
}

async function assignFaculty({ session_id, subject_id, faculty_user_ids, section_id, hod_user_id, hod_dept_id }) {
  if (!Array.isArray(faculty_user_ids) || faculty_user_ids.length === 0 || faculty_user_ids.length > 2)
    throw httpError('Provide 1 or 2 faculty_user_ids', 400);

  // Verify subject belongs to HOD's dept
  const [subj] = await pool.execute(
    'SELECT * FROM exam_subjects WHERE id=? AND department_id=?', [subject_id, hod_dept_id]
  );
  if (!subj[0]) throw httpError('Subject not found in your department', 404);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Remove existing assignments for this subject+session (same section)
    await conn.execute(
      'DELETE FROM exam_faculty_subjects WHERE session_id=? AND subject_id=? AND (section_id=? OR section_id IS NULL)',
      [session_id, subject_id, section_id || null]
    );
    // Insert new assignments
    for (let i = 0; i < faculty_user_ids.length; i++) {
      await conn.execute(
        `INSERT INTO exam_faculty_subjects (session_id, subject_id, faculty_user_id, assignment_type, section_id)
         VALUES (?, ?, ?, ?, ?)`,
        [session_id, subject_id, faculty_user_ids[i], i === 0 ? 'primary' : 'secondary', section_id || null]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Faculty assigned successfully' };
}

// ─── COURSE OUTCOMES ─────────────────────────────────────────────────────────

async function getCourseOutcomes(subject_id, session_id, faculty_user_id) {
  const [rows] = await pool.execute(
    'SELECT * FROM exam_course_outcomes WHERE subject_id=? AND session_id=? AND faculty_user_id=?',
    [subject_id, session_id, faculty_user_id]
  );
  return rows;
}

async function saveCourseOutcomes(subject_id, session_id, faculty_user_id, co_names) {
  if (!Array.isArray(co_names)) throw httpError('co_names must be an array', 400);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      'DELETE FROM exam_course_outcomes WHERE subject_id=? AND session_id=? AND faculty_user_id=?',
      [subject_id, session_id, faculty_user_id]
    );
    for (const co_name of co_names) {
      await conn.execute(
        'INSERT INTO exam_course_outcomes (session_id, subject_id, faculty_user_id, co_name) VALUES (?, ?, ?, ?)',
        [session_id, subject_id, faculty_user_id, co_name]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return getCourseOutcomes(subject_id, session_id, faculty_user_id);
}

// ─── ELECTIVES ───────────────────────────────────────────────────────────────

async function getElectiveSubjects(department_id) {
  const session = await getLatestSession();
  const [rows] = await pool.execute(
    `SELECT esub.* FROM exam_subjects esub
     WHERE esub.department_id=? AND esub.subject_type='Elective' AND esub.session_id=?
     ORDER BY esub.semester, esub.subject_name`,
    [department_id, session.id]
  );
  return rows;
}

async function uploadElectiveData(subject_id, enrollmentNos) {
  if (!Array.isArray(enrollmentNos) || enrollmentNos.length === 0)
    throw httpError('enrollmentNos must be a non-empty array', 400);

  const session = await getLatestSession();
  const session_id = session.id;

  // Verify subject exists
  const [subj] = await pool.execute(
    "SELECT id FROM exam_subjects WHERE id=? AND subject_type='Elective' AND session_id=?",
    [subject_id, session_id]
  );
  if (!subj[0]) throw httpError('Elective subject not found for current session', 404);

  // Verify all students exist in this session
  const placeholders = enrollmentNos.map(() => '?').join(',');
  const [existing] = await pool.execute(
    `SELECT enrollment_no FROM exam_students WHERE session_id=? AND enrollment_no IN (${placeholders})`,
    [session_id, ...enrollmentNos]
  );
  const existingSet = new Set(existing.map(r => r.enrollment_no));
  const missing = enrollmentNos.filter(e => !existingSet.has(e));
  if (missing.length) throw httpError(`Students not found in session: ${missing.join(', ')}`, 400);

  // Check duplicates
  const [dups] = await pool.execute(
    `SELECT enrollment_no FROM exam_elective_data WHERE session_id=? AND subject_id=? AND enrollment_no IN (${placeholders})`,
    [session_id, subject_id, ...enrollmentNos]
  );
  if (dups.length) throw httpError(`Already selected for students: ${dups.map(d => d.enrollment_no).join(', ')}`, 409);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const enrollment_no of enrollmentNos) {
      await conn.execute(
        'INSERT INTO exam_elective_data (session_id, enrollment_no, subject_id) VALUES (?, ?, ?)',
        [session_id, enrollment_no, subject_id]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { inserted: enrollmentNos.length };
}

module.exports = {
  createSession, getAllSessions, getLatestSessionPublic, setActiveSession, downloadSessionData,
  getCourses, createCourse,
  getSections, createSections,
  getSubjects, createSubject,
  getStudents, uploadStudentsCSV,
  getFacultyForDept, assignFaculty,
  getCourseOutcomes, saveCourseOutcomes,
  getElectiveSubjects, uploadElectiveData,
};
