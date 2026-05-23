const { Router }      = require('express');
const examController  = require('./exam.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const { allow }       = require('../../middlewares/role.middleware');

const router = Router();

// ── Public GET routes ─────────────────────────────────────────────────────────
// Specific typed routes registered before /documents/:id to avoid param collision

router.get('/documents',           examController.listAll);
router.get('/notices',             examController.listNotices);
router.get('/timetables',          examController.listTimetables);
router.get('/results',             examController.listResults);
router.get('/academic-calendar',   examController.listAcademicCalendar);
router.get('/documents/:id',       examController.getOne);

// ── EXAM_CONTROLLER-only write routes ─────────────────────────────────────────

router.post(  '/documents',            authMiddleware, allow('EXAM_CONTROLLER'), examController.create);
router.put(   '/documents/:id',        authMiddleware, allow('EXAM_CONTROLLER'), examController.update);
router.patch( '/documents/:id/status', authMiddleware, allow('EXAM_CONTROLLER'), examController.patchStatus);
router.delete('/documents/:id',        authMiddleware, allow('EXAM_CONTROLLER'), examController.remove);

module.exports = router;
