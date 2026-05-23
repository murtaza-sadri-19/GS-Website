const { Router }         = require('express');
const facultyController  = require('./faculty.controller');
const authMiddleware     = require('../../middlewares/auth.middleware');
const { allow }          = require('../../middlewares/role.middleware');

const router = Router();

// GET /faculty — public
router.get('/', facultyController.list);

// GET /faculty/me — TEACHER only (registered before /:id so "me" is not treated as a param)
router.get('/me', authMiddleware, allow('TEACHER'), facultyController.getMe);

// GET /faculty/:id — public
router.get('/:id', facultyController.getOne);

// POST /faculty — CENTRAL_ADMIN or HOD
router.post('/', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), facultyController.create);

// PUT /faculty/me — TEACHER only (registered before /:id)
router.put('/me', authMiddleware, allow('TEACHER'), facultyController.updateMe);

// PUT /faculty/:id — CENTRAL_ADMIN, HOD, or TEACHER self (ownership enforced in service)
router.put('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD', 'TEACHER'), facultyController.update);

// PATCH /faculty/:id/status — CENTRAL_ADMIN or HOD (dept ownership enforced in service)
router.patch('/:id/status', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), facultyController.patchStatus);

// DELETE /faculty/:id — CENTRAL_ADMIN or HOD (dept ownership enforced in service)
router.delete('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), facultyController.remove);

module.exports = router;
