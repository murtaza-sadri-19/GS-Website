/**
 * Marks Service — Regular Assessment Marks, Test Details, ATKT Marks
 *
 * Ported from exam-office-website assessment.js and atkt.js
 * using GS-Website raw mysql2 pattern.
 *
 * faculty_user_id (INT, GS-Website user.id) ↔ exam-office faculty_id (string)
 * session_id references exam_sessions.id
 * subject_id references exam_subjects.id
 */

const pool = require('../../config/db');
const fs   = require('fs');
const csv  = require('csv-parser');

const httpError = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

async function getLatestSession() {
  const [rows] = await pool.execute(
    'SELECT * FROM exam_sessions ORDER BY start_year DESC, start_month DESC LIMIT 1'
  );
  if (!rows[0]) throw httpError('No academic session found', 404);
  return rows[0];
}

// ─── TEST DETAILS (Max marks per component/CO) ────────────────────────────────

async function insertTestDetails({ subject_id, component_name, sub_component_name, co_marks }) {
  if (!subject_id || !component_name || !sub_component_name || !Array.isArray(co_marks))
    throw httpError('subject_id, component_name, sub_component_name, co_marks[] required', 400);

  const session = await getLatestSession();
  const session_id = session.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const { co_name, max_marks } of co_marks) {
      await conn.execute(
        `INSERT INTO exam_test_details (session_id, subject_id, component_name, sub_component_name, co_name, max_marks)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE max_marks=VALUES(max_marks)`,
        [session_id, subject_id, component_name, sub_component_name, co_name, max_marks]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Test details saved' };
}

async function fetchTestDetails({ subject_id, component_name, sub_component_name }) {
  if (!subject_id || !component_name || !sub_component_name)
    throw httpError('subject_id, component_name, sub_component_name required', 400);

  const session = await getLatestSession();
  const [rows] = await pool.execute(
    `SELECT co_name, max_marks FROM exam_test_details
     WHERE session_id=? AND subject_id=? AND component_name=? AND sub_component_name=?`,
    [session.id, subject_id, component_name, sub_component_name]
  );
  return { exists: rows.length > 0, co_marks: rows };
}

async function deleteTestDetails({ subject_id, component_name, sub_component_name }) {
  const session = await getLatestSession();
  const [result] = await pool.execute(
    `DELETE FROM exam_test_details
     WHERE session_id=? AND subject_id=? AND component_name=? AND sub_component_name=?`,
    [session.id, subject_id, component_name, sub_component_name]
  );
  if (result.affectedRows === 0) throw httpError('No test details found', 404);
  return { message: 'Test details deleted' };
}

// ─── MARKS SAVE / SUBMIT ─────────────────────────────────────────────────────

async function saveMarks(data) {
  if (!Array.isArray(data)) throw httpError('data must be an array', 400);

  const session = await getLatestSession();
  const session_id = session.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const entry of data) {
      const { enrollment_no, subject_id, component_name, sub_component_name, co_marks } = entry;
      if (!enrollment_no || !subject_id || !component_name || !sub_component_name || typeof co_marks !== 'object')
        throw httpError('Missing fields in marks entry', 400);

      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        await conn.execute(
          `INSERT INTO exam_marks
             (session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'saved')
           ON DUPLICATE KEY UPDATE marks_obtained=VALUES(marks_obtained), status='saved'`,
          [session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained]
        );
      }
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Marks saved successfully' };
}

async function submitMarks(data) {
  if (!Array.isArray(data) || data.length === 0) throw httpError('data must be a non-empty array', 400);

  const session = await getLatestSession();
  const session_id = session.id;
  const { subject_id, component_name, sub_component_name } = data[0];
  if (!subject_id || !component_name || !sub_component_name) throw httpError('Missing subject/component info', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    // Clear existing marks for this component
    await conn.execute(
      `DELETE FROM exam_marks WHERE session_id=? AND subject_id=? AND component_name=? AND sub_component_name=?`,
      [session_id, subject_id, component_name, sub_component_name]
    );
    for (const entry of data) {
      const { enrollment_no, co_marks } = entry;
      if (!enrollment_no || typeof co_marks !== 'object') throw httpError('Invalid entry', 400);
      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        await conn.execute(
          `INSERT INTO exam_marks
             (session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'submitted')`,
          [session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained]
        );
      }
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Marks submitted successfully' };
}

async function fetchMarksData({ subject_id, component_name, sub_component_name, faculty_user_id }) {
  if (!subject_id || !component_name || !sub_component_name) throw httpError('Required fields missing', 400);

  const session = await getLatestSession();
  const session_id = session.id;

  // Check faculty is assigned to this subject
  const [assignments] = await pool.execute(
    `SELECT section_id FROM exam_faculty_subjects WHERE session_id=? AND subject_id=? AND faculty_user_id=?`,
    [session_id, subject_id, faculty_user_id]
  );
  if (assignments.length === 0) throw httpError('Unauthorized: not assigned to this subject', 403);

  // Check if already submitted
  const [submitted] = await pool.execute(
    `SELECT id FROM exam_marks WHERE session_id=? AND subject_id=? AND component_name=? AND sub_component_name=? AND status='submitted' LIMIT 1`,
    [session_id, subject_id, component_name, sub_component_name]
  );
  if (submitted[0]) return { status: 'submitted', message: 'Marks already submitted for this component' };

  // Get saved marks
  const [savedMarks] = await pool.execute(
    `SELECT enrollment_no, co_name, marks_obtained FROM exam_marks
     WHERE session_id=? AND subject_id=? AND component_name=? AND sub_component_name=? AND status='saved'`,
    [session_id, subject_id, component_name, sub_component_name]
  );
  if (savedMarks.length > 0) {
    const [testDetails] = await pool.execute(
      `SELECT co_name, max_marks FROM exam_test_details
       WHERE session_id=? AND subject_id=? AND component_name=? AND sub_component_name=?`,
      [session_id, subject_id, component_name, sub_component_name]
    );
    return { status: 'saved', saved_marks: savedMarks, test_details: testDetails };
  }

  return { status: 'not_found', message: 'No marks data found' };
}

// ─── MARKS FILL REQUEST ───────────────────────────────────────────────────────

async function createMarksFillRequest({ subject_id, component_name, sub_component_name, last_date, faculty_user_id }) {
  const session = await getLatestSession();
  const [result] = await pool.execute(
    `INSERT INTO exam_marks_fill_requests
       (session_id, faculty_user_id, subject_id, component_name, sub_component_name, last_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [session.id, faculty_user_id, subject_id, component_name, sub_component_name, last_date]
  );
  return { request_id: result.insertId, message: 'Marks fill request created' };
}

async function listMarksFillRequests(faculty_user_id) {
  const session = await getLatestSession();
  const cond = faculty_user_id ? 'AND mfr.faculty_user_id=?' : '';
  const params = faculty_user_id ? [session.id, faculty_user_id] : [session.id];
  const [rows] = await pool.execute(
    `SELECT mfr.*, u.name AS faculty_name, esub.subject_name FROM exam_marks_fill_requests mfr
     JOIN users u ON mfr.faculty_user_id = u.id
     JOIN exam_subjects esub ON mfr.subject_id = esub.id
     WHERE mfr.session_id=? ${cond} ORDER BY mfr.assigned_at DESC`,
    params
  );
  return rows;
}

// ─── ATKT ────────────────────────────────────────────────────────────────────

async function uploadATKTStudentsCSV(filePath, { department_id, course_id }) {
  const session = await getLatestSession();
  const session_id = session.id;

  const results = [];
  const seenSet = new Set();

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/﻿/, '') }))
      .on('data', (row) => {
        const enrollment_no = row['Enrollment No']?.trim();
        const student_name  = row['Student Name']?.trim();
        const subject_code  = row['Subject Code']?.trim();

        if (!enrollment_no || !student_name || !subject_code) return;
        const key = `${enrollment_no}|${subject_code}`;
        if (seenSet.has(key)) return;
        seenSet.add(key);

        results.push({ enrollment_no, student_name, subject_code });
      })
      .on('end', resolve)
      .on('error', reject);
  });

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  if (results.length === 0) throw httpError('No valid data in CSV', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const entry of results) {
      // Find subject by code in current session
      const [subj] = await conn.execute(
        "SELECT id FROM exam_subjects WHERE session_id=? AND subject_code=? AND subject_type='ATKT'",
        [session_id, entry.subject_code]
      );
      if (!subj[0]) continue; // skip unknown subjects

      await conn.execute(
        `INSERT IGNORE INTO exam_atkt_students
           (session_id, enrollment_no, student_name, department_id, course_id, subject_id, subject_session)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [session_id, entry.enrollment_no, entry.student_name, department_id, course_id, subj[0].id, session_id]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { inserted: results.length };
}

async function getATKTStudentsBySubject(subject_id) {
  const session = await getLatestSession();
  const [rows] = await pool.execute(
    `SELECT * FROM exam_atkt_students WHERE session_id=? AND subject_id=?`,
    [session.id, subject_id]
  );
  return rows;
}

async function insertATKTTestDetails({ subject_id, co_marks }) {
  if (!subject_id || !Array.isArray(co_marks)) throw httpError('subject_id and co_marks[] required', 400);
  const session = await getLatestSession();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const { co_name, max_marks } of co_marks) {
      await conn.execute(
        `INSERT INTO exam_atkt_test_details (session_id, subject_id, co_name, max_marks)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE max_marks=VALUES(max_marks)`,
        [session.id, subject_id, co_name, max_marks]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'ATKT test details saved' };
}

async function fetchATKTTestDetails(subject_id) {
  const session = await getLatestSession();
  const [rows] = await pool.execute(
    `SELECT co_name, max_marks FROM exam_atkt_test_details WHERE session_id=? AND subject_id=?`,
    [session.id, subject_id]
  );
  return { exists: rows.length > 0, co_marks: rows };
}

async function saveATKTMarks(data) {
  if (!Array.isArray(data)) throw httpError('data must be an array', 400);
  const session = await getLatestSession();
  const session_id = session.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const { enrollment_no, subject_id, co_marks } of data) {
      // Verify student is ATKT for this subject
      const [atkt] = await conn.execute(
        'SELECT id FROM exam_atkt_students WHERE session_id=? AND enrollment_no=? AND subject_id=?',
        [session_id, enrollment_no, subject_id]
      );
      if (!atkt[0]) throw httpError(`${enrollment_no} is not ATKT for this subject`, 403);

      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        await conn.execute(
          `INSERT INTO exam_atkt_marks (session_id, enrollment_no, subject_id, co_name, marks_obtained, status)
           VALUES (?, ?, ?, ?, ?, 'saved')
           ON DUPLICATE KEY UPDATE marks_obtained=VALUES(marks_obtained), status='saved'`,
          [session_id, enrollment_no, subject_id, co_name, marks_obtained]
        );
      }
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'ATKT marks saved' };
}

async function submitATKTMarks(data) {
  if (!Array.isArray(data) || data.length === 0) throw httpError('data must be non-empty array', 400);
  const { subject_id } = data[0];
  if (!subject_id) throw httpError('subject_id required', 400);

  const session = await getLatestSession();
  const session_id = session.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      'DELETE FROM exam_atkt_marks WHERE session_id=? AND subject_id=?', [session_id, subject_id]
    );
    for (const { enrollment_no, co_marks } of data) {
      for (const [co_name, marks_obtained] of Object.entries(co_marks)) {
        await conn.execute(
          `INSERT INTO exam_atkt_marks (session_id, enrollment_no, subject_id, co_name, marks_obtained, status)
           VALUES (?, ?, ?, ?, ?, 'submitted')`,
          [session_id, enrollment_no, subject_id, co_name, marks_obtained]
        );
      }
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'ATKT marks submitted' };
}

async function fetchATKTMarksData(subject_id) {
  const session = await getLatestSession();
  const session_id = session.id;

  const [submitted] = await pool.execute(
    "SELECT id FROM exam_atkt_marks WHERE session_id=? AND subject_id=? AND status='submitted' LIMIT 1",
    [session_id, subject_id]
  );
  if (submitted[0]) return { status: 'submitted', message: 'ATKT marks already submitted' };

  const [savedMarks] = await pool.execute(
    "SELECT enrollment_no, co_name, marks_obtained FROM exam_atkt_marks WHERE session_id=? AND subject_id=? AND status='saved'",
    [session_id, subject_id]
  );
  if (savedMarks.length > 0) {
    const [testDetails] = await pool.execute(
      'SELECT co_name, max_marks FROM exam_atkt_test_details WHERE session_id=? AND subject_id=?',
      [session_id, subject_id]
    );
    return { status: 'saved', saved_marks: savedMarks, test_details: testDetails };
  }

  return { status: 'not_found', message: 'No ATKT marks data found' };
}

// ─── CORRECTION REQUESTS ──────────────────────────────────────────────────────

async function submitCorrectionRequest({
  subject_id, component_name, sub_component_name, reason, form_status, enrollment_nos, faculty_user_id
}) {
  if (!subject_id || !reason || !form_status || !Array.isArray(enrollment_nos) || enrollment_nos.length === 0)
    throw httpError('Missing required fields', 400);

  const session = await getLatestSession();
  const session_id = session.id;

  // Check for pending request
  const [pending] = await pool.execute(
    `SELECT id FROM exam_correction_requests
     WHERE faculty_user_id=? AND subject_id=? AND component_name=? AND sub_component_name=? AND session_id=? AND status='Pending'`,
    [faculty_user_id, subject_id, component_name || null, sub_component_name || null, session_id]
  );
  if (pending[0]) throw httpError('A pending request already exists for this subject-component', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [result] = await conn.execute(
      `INSERT INTO exam_correction_requests
         (session_id, faculty_user_id, subject_id, component_name, sub_component_name, reason, form_status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [session_id, faculty_user_id, subject_id, component_name || null, sub_component_name || null, reason, form_status]
    );
    const request_id = result.insertId;
    for (const enrollment_no of enrollment_nos) {
      await conn.execute(
        'INSERT INTO exam_correction_request_students (request_id, enrollment_no) VALUES (?, ?)',
        [request_id, enrollment_no]
      );
    }
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Correction request submitted' };
}

async function getCorrectionRequests(faculty_user_id) {
  const session = await getLatestSession();
  const cond = faculty_user_id ? 'AND ecr.faculty_user_id=?' : '';
  const params = faculty_user_id ? [session.id, faculty_user_id] : [session.id];

  const [rows] = await pool.execute(
    `SELECT ecr.*, u.name AS faculty_name, esub.subject_name,
            GROUP_CONCAT(ecrs.enrollment_no) AS enrollment_nos
     FROM exam_correction_requests ecr
     JOIN users u ON ecr.faculty_user_id = u.id
     JOIN exam_subjects esub ON ecr.subject_id = esub.id
     LEFT JOIN exam_correction_request_students ecrs ON ecr.id = ecrs.request_id
     WHERE ecr.session_id=? ${cond}
     GROUP BY ecr.id
     ORDER BY ecr.created_at DESC`,
    params
  );
  // Parse enrollment_nos back to array
  return rows.map(r => ({
    ...r,
    enrollment_nos: r.enrollment_nos ? r.enrollment_nos.split(',') : [],
  }));
}

async function updateCorrectionRequestStatus(request_id, status) {
  if (!['Approved', 'Rejected'].includes(status)) throw httpError('status must be Approved or Rejected', 400);

  const [req] = await pool.execute(
    'SELECT id, status FROM exam_correction_requests WHERE id=?', [request_id]
  );
  if (!req[0]) throw httpError('Request not found', 404);
  if (req[0].status !== 'Pending') throw httpError('Action already taken on this request', 400);

  await pool.execute('UPDATE exam_correction_requests SET status=? WHERE id=?', [status, request_id]);
  return { message: 'Request status updated' };
}

async function withdrawCorrectionRequest(request_id, faculty_user_id) {
  const session = await getLatestSession();
  const [req] = await pool.execute(
    'SELECT id, status, faculty_user_id FROM exam_correction_requests WHERE id=? AND session_id=?',
    [request_id, session.id]
  );
  if (!req[0]) throw httpError('Request not found', 404);
  if (req[0].faculty_user_id !== faculty_user_id) throw httpError('Unauthorized', 403);
  if (req[0].status !== 'Pending') throw httpError('Only pending requests can be withdrawn', 400);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM exam_correction_request_students WHERE request_id=?', [request_id]);
    await conn.execute('DELETE FROM exam_correction_requests WHERE id=?', [request_id]);
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Request withdrawn' };
}

async function getMarksForCorrectionRequest(request_id) {
  const session = await getLatestSession();
  const [reqs] = await pool.execute(
    'SELECT * FROM exam_correction_requests WHERE id=? AND session_id=?', [request_id, session.id]
  );
  if (!reqs[0]) throw httpError('Request not found', 404);
  if (reqs[0].status !== 'Approved') throw httpError('Request not yet approved', 400);

  const req = reqs[0];
  const [students] = await pool.execute(
    'SELECT enrollment_no FROM exam_correction_request_students WHERE request_id=?', [request_id]
  );
  const enrollmentNos = students.map(s => s.enrollment_no);
  if (enrollmentNos.length === 0) throw httpError('No students in request', 404);

  const table = req.form_status === 'ATKT' ? 'exam_atkt_marks' : 'exam_marks';
  const placeholders = enrollmentNos.map(() => '?').join(',');

  let query = `SELECT enrollment_no, co_name, marks_obtained FROM ${table}
               WHERE session_id=? AND subject_id=? AND enrollment_no IN (${placeholders})`;
  const params = [session.id, req.subject_id, ...enrollmentNos];

  if (req.form_status !== 'ATKT' && req.component_name) {
    query += ' AND component_name=? AND sub_component_name=?';
    params.push(req.component_name, req.sub_component_name);
  }

  const [marks] = await pool.execute(query, params);

  const tdTable = req.form_status === 'ATKT' ? 'exam_atkt_test_details' : 'exam_test_details';
  const [testDetails] = await pool.execute(
    `SELECT co_name, max_marks FROM ${tdTable} WHERE session_id=? AND subject_id=?`,
    [session.id, req.subject_id]
  );

  return { marks, test_details: testDetails };
}

async function resubmitCorrectionMarks({ request_id, updatedMarks, faculty_user_id }) {
  const session = await getLatestSession();
  const [reqs] = await pool.execute(
    'SELECT * FROM exam_correction_requests WHERE id=? AND session_id=?', [request_id, session.id]
  );
  if (!reqs[0]) throw httpError('Request not found', 404);
  if (reqs[0].faculty_user_id !== faculty_user_id) throw httpError('Unauthorized', 403);
  if (reqs[0].status !== 'Approved') throw httpError('Request not approved', 400);

  const req = reqs[0];
  const table = req.form_status === 'ATKT' ? 'exam_atkt_marks' : 'exam_marks';

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const entry of updatedMarks) {
      const base = [session.id, entry.enrollment_no, req.subject_id, entry.co_name, entry.marks_obtained];
      if (req.form_status === 'ATKT') {
        await conn.execute(
          `INSERT INTO exam_atkt_marks (session_id, enrollment_no, subject_id, co_name, marks_obtained, status)
           VALUES (?, ?, ?, ?, ?, 'resubmitted')
           ON DUPLICATE KEY UPDATE marks_obtained=VALUES(marks_obtained), status='resubmitted'`,
          base
        );
      } else {
        await conn.execute(
          `INSERT INTO exam_marks
             (session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'resubmitted')
           ON DUPLICATE KEY UPDATE marks_obtained=VALUES(marks_obtained), status='resubmitted'`,
          [session.id, entry.enrollment_no, req.subject_id, req.component_name, req.sub_component_name, entry.co_name, entry.marks_obtained]
        );
      }
    }
    await conn.execute(
      'INSERT INTO exam_correction_update_logs (request_id) VALUES (?)', [request_id]
    );
    await conn.commit();
  } catch (e) { await conn.rollback(); throw e; }
  finally { conn.release(); }
  return { message: 'Marks resubmitted and logged' };
}

module.exports = {
  insertTestDetails, fetchTestDetails, deleteTestDetails,
  saveMarks, submitMarks, fetchMarksData,
  createMarksFillRequest, listMarksFillRequests,
  uploadATKTStudentsCSV, getATKTStudentsBySubject,
  insertATKTTestDetails, fetchATKTTestDetails,
  saveATKTMarks, submitATKTMarks, fetchATKTMarksData,
  submitCorrectionRequest, getCorrectionRequests, updateCorrectionRequestStatus,
  withdrawCorrectionRequest, getMarksForCorrectionRequest, resubmitCorrectionMarks,
};
