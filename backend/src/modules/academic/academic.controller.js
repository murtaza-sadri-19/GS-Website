const academicService    = require('./academic.service');
const marksService       = require('../marks/marks.service');
const { success, error } = require('../../utils/response');
const fs                 = require('fs');

// ── SESSIONS ──────────────────────────────────────────────────────────────────

async function createSession(req, res, next) {
  try {
    const session = await academicService.createSession(req.body);
    return success(res, 'Session created', session, 201);
  } catch (err) { next(err); }
}

async function getAllSessions(req, res, next) {
  try {
    return success(res, 'Sessions fetched', await academicService.getAllSessions());
  } catch (err) { next(err); }
}

async function getLatestSession(req, res, next) {
  try {
    return success(res, 'Latest session fetched', await academicService.getLatestSessionPublic());
  } catch (err) { next(err); }
}

async function setActiveSession(req, res, next) {
  try {
    const { id } = req.params;
    await academicService.setActiveSession(parseInt(id));
    return success(res, 'Active session updated', null);
  } catch (err) { next(err); }
}

async function downloadSessionData(req, res, next) {
  try {
    const { session_id, department_id, course_id, students, subjects } = req.query;
    if (!session_id || !department_id || !course_id) {
      return error(res, 'session_id, department_id, course_id are required', null, 400);
    }
    const { filePath, filename } = await academicService.downloadSessionData({
      session_id: parseInt(session_id),
      department_id: parseInt(department_id),
      course_id: parseInt(course_id),
      includeStudents: students === 'true',
      includeSubjects: subjects === 'true',
    });
    res.download(filePath, filename, () => { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); });
  } catch (err) { next(err); }
}

// ── COURSES ───────────────────────────────────────────────────────────────────

async function getCourses(req, res, next) {
  try {
    const dept = req.query.department_id ? parseInt(req.query.department_id) : null;
    return success(res, 'Courses fetched', await academicService.getCourses(dept));
  } catch (err) { next(err); }
}

async function createCourse(req, res, next) {
  try {
    return success(res, 'Course created', await academicService.createCourse(req.body), 201);
  } catch (err) { next(err); }
}

// ── SECTIONS ──────────────────────────────────────────────────────────────────

async function getSections(req, res, next) {
  try {
    const { department_id, course_id } = req.query;
    return success(res, 'Sections fetched', await academicService.getSections(parseInt(department_id), parseInt(course_id)));
  } catch (err) { next(err); }
}

async function createSections(req, res, next) {
  try {
    return success(res, 'Sections created', await academicService.createSections(req.body));
  } catch (err) { next(err); }
}

// ── SUBJECTS ──────────────────────────────────────────────────────────────────

async function getSubjects(req, res, next) {
  try {
    const { session_id, department_id, course_id, subject_type } = req.query;
    return success(res, 'Subjects fetched', await academicService.getSubjects({
      session_id: session_id ? parseInt(session_id) : null,
      department_id: department_id ? parseInt(department_id) : null,
      course_id: course_id ? parseInt(course_id) : null,
      subject_type,
    }));
  } catch (err) { next(err); }
}

async function createSubject(req, res, next) {
  try {
    return success(res, 'Subject created', await academicService.createSubject(req.body), 201);
  } catch (err) { next(err); }
}

// ── STUDENTS ──────────────────────────────────────────────────────────────────

async function getStudents(req, res, next) {
  try {
    const { session_id, department_id, course_id, semester } = req.query;
    return success(res, 'Students fetched', await academicService.getStudents({
      session_id: session_id ? parseInt(session_id) : null,
      department_id: department_id ? parseInt(department_id) : null,
      course_id: course_id ? parseInt(course_id) : null,
      semester: semester ? parseInt(semester) : null,
    }));
  } catch (err) { next(err); }
}

async function uploadStudents(req, res, next) {
  try {
    // CSV parsed by middleware into req.csvRows (see upload helper or parse inline)
    const { session_id, department_id, course_id } = req.body;
    if (!session_id || !department_id || !course_id)
      return error(res, 'session_id, department_id, course_id required', null, 400);
    if (!req.file) return error(res, 'CSV file required', null, 400);

    // Parse CSV inline
    const csv = require('csv-parser');
    const fs = require('fs');
    const rows = [];
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
        .on('data', row => rows.push({
          enrollment_no: row['Enrollment No']?.trim(),
          student_name:  row['Student Name']?.trim(),
          semester:      parseInt(row['Semester'] || '0'),
          status:        (row['Status'] || 'regular').toLowerCase(),
          section_name:  row['Section']?.trim(),
        }))
        .on('end', resolve).on('error', reject);
    });
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const result = await academicService.uploadStudentsCSV(rows.filter(r => r.enrollment_no), {
      session_id: parseInt(session_id),
      department_id: parseInt(department_id),
      course_id: parseInt(course_id),
    });
    return success(res, 'Students uploaded', result);
  } catch (err) { next(err); }
}

// ── FACULTY ───────────────────────────────────────────────────────────────────

async function getFacultyForDept(req, res, next) {
  try {
    const dept = req.query.department_id ? parseInt(req.query.department_id) : req.user.department_id;
    return success(res, 'Faculty fetched', await academicService.getFacultyForDept(dept));
  } catch (err) { next(err); }
}

async function assignFaculty(req, res, next) {
  try {
    const result = await academicService.assignFaculty({
      ...req.body,
      hod_user_id: req.user.id,
      hod_dept_id: req.user.department_id,
    });
    return success(res, 'Faculty assigned', result);
  } catch (err) { next(err); }
}

// ── COURSE OUTCOMES ───────────────────────────────────────────────────────────

async function getCourseOutcomes(req, res, next) {
  try {
    const { subject_id, session_id } = req.query;
    return success(res, 'COs fetched',
      await academicService.getCourseOutcomes(parseInt(subject_id), parseInt(session_id), req.user.id));
  } catch (err) { next(err); }
}

async function saveCourseOutcomes(req, res, next) {
  try {
    const { subject_id, session_id, co_names } = req.body;
    return success(res, 'COs saved',
      await academicService.saveCourseOutcomes(parseInt(subject_id), parseInt(session_id), req.user.id, co_names));
  } catch (err) { next(err); }
}

// ── ELECTIVES ─────────────────────────────────────────────────────────────────

async function getElectives(req, res, next) {
  try {
    const dept = req.query.department_id ? parseInt(req.query.department_id) : req.user.department_id;
    return success(res, 'Electives fetched', await academicService.getElectiveSubjects(dept));
  } catch (err) { next(err); }
}

async function uploadElectiveData(req, res, next) {
  try {
    const { subject_id, enrollment_nos } = req.body;
    if (!subject_id) return error(res, 'subject_id required', null, 400);
    let nos = enrollment_nos;
    // If CSV file sent instead
    if (!nos && req.file) {
      const csv = require('csv-parser');
      const fs = require('fs');
      const collected = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
          .on('data', row => { const e = row['Enrollment No']?.trim(); if (e) collected.push(e); })
          .on('end', resolve).on('error', reject);
      });
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      nos = collected;
    }
    if (!nos || !nos.length) return error(res, 'enrollment_nos required', null, 400);
    return success(res, 'Elective data uploaded', await academicService.uploadElectiveData(parseInt(subject_id), nos));
  } catch (err) { next(err); }
}

// ── MARKS (delegated) ─────────────────────────────────────────────────────────

async function insertTestDetails(req, res, next) {
  try {
    return success(res, 'Test details saved', await marksService.insertTestDetails(req.body), 201);
  } catch (err) { next(err); }
}

async function fetchTestDetails(req, res, next) {
  try {
    return success(res, 'Test details fetched', await marksService.fetchTestDetails(req.query));
  } catch (err) { next(err); }
}

async function deleteTestDetails(req, res, next) {
  try {
    return success(res, 'Test details deleted', await marksService.deleteTestDetails(req.query));
  } catch (err) { next(err); }
}

async function saveMarks(req, res, next) {
  try {
    return success(res, 'Marks saved', await marksService.saveMarks(req.body.data));
  } catch (err) { next(err); }
}

async function submitMarks(req, res, next) {
  try {
    return success(res, 'Marks submitted', await marksService.submitMarks(req.body.data));
  } catch (err) { next(err); }
}

async function fetchMarksData(req, res, next) {
  try {
    return success(res, 'Marks data fetched', await marksService.fetchMarksData({ ...req.query, faculty_user_id: req.user.id }));
  } catch (err) { next(err); }
}

async function createMarksFillRequest(req, res, next) {
  try {
    return success(res, 'Marks fill request created',
      await marksService.createMarksFillRequest({ ...req.body, faculty_user_id: req.user.id }), 201);
  } catch (err) { next(err); }
}

async function listMarksFillRequests(req, res, next) {
  try {
    const fid = req.user.role === 'TEACHER' ? req.user.id : null;
    return success(res, 'Requests fetched', await marksService.listMarksFillRequests(fid));
  } catch (err) { next(err); }
}

// ATKT
async function uploadATKTStudents(req, res, next) {
  try {
    const { department_id, course_id } = req.body;
    if (!req.file || !department_id || !course_id) return error(res, 'CSV file, department_id, course_id required', null, 400);
    return success(res, 'ATKT students uploaded',
      await marksService.uploadATKTStudentsCSV(req.file.path, { department_id: parseInt(department_id), course_id: parseInt(course_id) }));
  } catch (err) { next(err); }
}

async function getATKTStudents(req, res, next) {
  try {
    const { subject_id } = req.query;
    if (!subject_id) return error(res, 'subject_id required', null, 400);
    return success(res, 'ATKT students fetched', await marksService.getATKTStudentsBySubject(parseInt(subject_id)));
  } catch (err) { next(err); }
}

async function insertATKTTestDetails(req, res, next) {
  try {
    return success(res, 'ATKT test details saved', await marksService.insertATKTTestDetails(req.body), 201);
  } catch (err) { next(err); }
}

async function fetchATKTTestDetails(req, res, next) {
  try {
    return success(res, 'ATKT test details fetched', await marksService.fetchATKTTestDetails(parseInt(req.query.subject_id)));
  } catch (err) { next(err); }
}

async function saveATKTMarks(req, res, next) {
  try {
    return success(res, 'ATKT marks saved', await marksService.saveATKTMarks(req.body.data));
  } catch (err) { next(err); }
}

async function submitATKTMarks(req, res, next) {
  try {
    return success(res, 'ATKT marks submitted', await marksService.submitATKTMarks(req.body.data));
  } catch (err) { next(err); }
}

async function fetchATKTMarksData(req, res, next) {
  try {
    return success(res, 'ATKT marks data fetched', await marksService.fetchATKTMarksData(parseInt(req.query.subject_id)));
  } catch (err) { next(err); }
}

// Correction Requests
async function submitCorrectionRequest(req, res, next) {
  try {
    return success(res, 'Correction request submitted',
      await marksService.submitCorrectionRequest({ ...req.body, faculty_user_id: req.user.id }));
  } catch (err) { next(err); }
}

async function getCorrectionRequests(req, res, next) {
  try {
    const fid = req.user.role === 'TEACHER' ? req.user.id : null;
    return success(res, 'Correction requests fetched', await marksService.getCorrectionRequests(fid));
  } catch (err) { next(err); }
}

async function updateCorrectionRequestStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status required', null, 400);
    return success(res, 'Request status updated',
      await marksService.updateCorrectionRequestStatus(parseInt(req.params.id), status));
  } catch (err) { next(err); }
}

async function withdrawCorrectionRequest(req, res, next) {
  try {
    return success(res, 'Request withdrawn',
      await marksService.withdrawCorrectionRequest(parseInt(req.params.id), req.user.id));
  } catch (err) { next(err); }
}

async function getMarksForCorrectionRequest(req, res, next) {
  try {
    return success(res, 'Marks fetched',
      await marksService.getMarksForCorrectionRequest(parseInt(req.params.id)));
  } catch (err) { next(err); }
}

async function resubmitCorrectionMarks(req, res, next) {
  try {
    return success(res, 'Marks resubmitted',
      await marksService.resubmitCorrectionMarks({ ...req.body, faculty_user_id: req.user.id }));
  } catch (err) { next(err); }
}

module.exports = {
  createSession, getAllSessions, getLatestSession, setActiveSession, downloadSessionData,
  getCourses, createCourse,
  getSections, createSections,
  getSubjects, createSubject,
  getStudents, uploadStudents,
  getFacultyForDept, assignFaculty,
  getCourseOutcomes, saveCourseOutcomes,
  getElectives, uploadElectiveData,
  insertTestDetails, fetchTestDetails, deleteTestDetails,
  saveMarks, submitMarks, fetchMarksData,
  createMarksFillRequest, listMarksFillRequests,
  uploadATKTStudents, getATKTStudents,
  insertATKTTestDetails, fetchATKTTestDetails,
  saveATKTMarks, submitATKTMarks, fetchATKTMarksData,
  submitCorrectionRequest, getCorrectionRequests, updateCorrectionRequestStatus,
  withdrawCorrectionRequest, getMarksForCorrectionRequest, resubmitCorrectionMarks,
};
