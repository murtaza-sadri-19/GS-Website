/**
 * Academic Routes — Sessions, Courses, Subjects, Students, Marks, ATKT, Correction Requests
 *
 * Role access:
 *   CENTRAL_ADMIN / EXAM_CONTROLLER — session management, marks fill requests
 *   HOD                             — subject management, faculty assignment
 *   TEACHER                         — marks entry, correction requests
 *   All authenticated               — read own department data
 */

const { Router }       = require('express');
const ac               = require('./academic.controller');
const auth             = require('../../middlewares/auth.middleware');
const { allow }        = require('../../middlewares/role.middleware');
const multer           = require('multer');
const path             = require('path');
const os               = require('os');

const router  = Router();
const upload  = multer({ dest: os.tmpdir() });

// ── SESSIONS ──────────────────────────────────────────────────────────────────
router.get( '/sessions',             ac.getAllSessions);
router.get( '/sessions/latest',      ac.getLatestSession);
router.get( '/sessions/download',    auth, allow('CENTRAL_ADMIN','EXAM_CONTROLLER','HOD'), ac.downloadSessionData);
router.post('/sessions',             auth, allow('CENTRAL_ADMIN','EXAM_CONTROLLER'), ac.createSession);
router.patch('/sessions/:id/active', auth, allow('CENTRAL_ADMIN','EXAM_CONTROLLER'), ac.setActiveSession);

// ── COURSES ───────────────────────────────────────────────────────────────────
router.get( '/courses',  auth, ac.getCourses);
router.post('/courses',  auth, allow('CENTRAL_ADMIN','EXAM_CONTROLLER'), ac.createCourse);

// ── SECTIONS ──────────────────────────────────────────────────────────────────
router.get( '/sections',  auth, ac.getSections);
router.post('/sections',  auth, allow('CENTRAL_ADMIN','HOD'), ac.createSections);

// ── SUBJECTS ──────────────────────────────────────────────────────────────────
router.get( '/subjects',  auth, ac.getSubjects);
router.post('/subjects',  auth, allow('CENTRAL_ADMIN','EXAM_CONTROLLER','HOD'), ac.createSubject);

// ── STUDENTS ──────────────────────────────────────────────────────────────────
router.get( '/students',              auth, ac.getStudents);
router.post('/students/upload',       auth, allow('CENTRAL_ADMIN','EXAM_CONTROLLER'), upload.single('file'), ac.uploadStudents);

// ── FACULTY ASSIGNMENT ────────────────────────────────────────────────────────
router.get( '/faculty',          auth, allow('CENTRAL_ADMIN','HOD','EXAM_CONTROLLER'), ac.getFacultyForDept);
router.post('/faculty/assign',   auth, allow('HOD'), ac.assignFaculty);

// ── COURSE OUTCOMES ───────────────────────────────────────────────────────────
router.get( '/course-outcomes',  auth, allow('TEACHER','HOD'), ac.getCourseOutcomes);
router.post('/course-outcomes',  auth, allow('TEACHER'), ac.saveCourseOutcomes);

// ── ELECTIVES ─────────────────────────────────────────────────────────────────
router.get( '/electives',                auth, ac.getElectives);
router.post('/electives/upload',         auth, allow('HOD','EXAM_CONTROLLER'), upload.single('file'), ac.uploadElectiveData);

// ── MARKS — TEST DETAILS ──────────────────────────────────────────────────────
router.get(   '/marks/test-details',     auth, allow('TEACHER','EXAM_CONTROLLER'), ac.fetchTestDetails);
router.post(  '/marks/test-details',     auth, allow('TEACHER'), ac.insertTestDetails);
router.delete('/marks/test-details',     auth, allow('TEACHER'), ac.deleteTestDetails);

// ── MARKS — SAVE / SUBMIT ─────────────────────────────────────────────────────
router.get( '/marks',         auth, allow('TEACHER'), ac.fetchMarksData);
router.post('/marks/save',    auth, allow('TEACHER'), ac.saveMarks);
router.post('/marks/submit',  auth, allow('TEACHER'), ac.submitMarks);

// ── MARKS FILL REQUESTS ───────────────────────────────────────────────────────
router.get( '/marks/fill-requests',      auth, allow('EXAM_CONTROLLER','TEACHER','HOD'), ac.listMarksFillRequests);
router.post('/marks/fill-requests',      auth, allow('EXAM_CONTROLLER'), ac.createMarksFillRequest);

// ── ATKT ──────────────────────────────────────────────────────────────────────
router.get( '/atkt/students',            auth, allow('TEACHER','EXAM_CONTROLLER'), ac.getATKTStudents);
router.post('/atkt/students/upload',     auth, allow('EXAM_CONTROLLER'), upload.single('file'), ac.uploadATKTStudents);
router.get( '/atkt/test-details',        auth, allow('TEACHER','EXAM_CONTROLLER'), ac.fetchATKTTestDetails);
router.post('/atkt/test-details',        auth, allow('TEACHER'), ac.insertATKTTestDetails);
router.get( '/atkt/marks',               auth, allow('TEACHER'), ac.fetchATKTMarksData);
router.post('/atkt/marks/save',          auth, allow('TEACHER'), ac.saveATKTMarks);
router.post('/atkt/marks/submit',        auth, allow('TEACHER'), ac.submitATKTMarks);

// ── REGISTRATION REQUESTS ─────────────────────────────────────────────────────
router.get('/registration-requests',   auth, allow('HOD','EXAM_CONTROLLER','CENTRAL_ADMIN'), ac.getRegistrationRequests);

// ── CORRECTION REQUESTS ───────────────────────────────────────────────────────
router.get(   '/correction-requests',           auth, allow('TEACHER','EXAM_CONTROLLER','HOD'), ac.getCorrectionRequests);
router.post(  '/correction-requests',           auth, allow('TEACHER'), ac.submitCorrectionRequest);
router.patch( '/correction-requests/:id/status',auth, allow('EXAM_CONTROLLER'), ac.updateCorrectionRequestStatus);
router.delete('/correction-requests/:id',       auth, allow('TEACHER'), ac.withdrawCorrectionRequest);
router.get(   '/correction-requests/:id/marks', auth, allow('TEACHER','EXAM_CONTROLLER'), ac.getMarksForCorrectionRequest);
router.post(  '/correction-requests/resubmit',  auth, allow('TEACHER'), ac.resubmitCorrectionMarks);

module.exports = router;
