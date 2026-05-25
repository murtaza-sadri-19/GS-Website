const { Router }         = require('express');
const facultyController  = require('./faculty.controller');
const content            = require('./faculty.content.controller');
const authMiddleware     = require('../../middlewares/auth.middleware');
const { allow }          = require('../../middlewares/role.middleware');

const router = Router();
const RESOURCES = ['publications', 'research', 'qualifications'];

// GET /faculty — public
router.get('/', facultyController.list);

// GET /faculty/me — TEACHER only (registered before /:id so "me" is not treated as a param)
router.get('/me', authMiddleware, allow('TEACHER'), facultyController.getMe);

// ── Faculty content sub-resources — TEACHER manages own (registered before /:id) ──
for (const r of RESOURCES) {
  router.get(   `/me/${r}`,          authMiddleware, allow('TEACHER'), content.listMine(r));
  router.post(  `/me/${r}`,          authMiddleware, allow('TEACHER'), content.createMine(r));
  router.put(   `/me/${r}/:itemId`,  authMiddleware, allow('TEACHER'), content.updateMine(r));
  router.delete(`/me/${r}/:itemId`,  authMiddleware, allow('TEACHER'), content.removeMine(r));
}

// GET /faculty/:id — public
router.get('/:id', facultyController.getOne);

// GET /faculty/:id/{publications|research|qualifications} — public profile content
for (const r of RESOURCES) {
  router.get(`/:id/${r}`, content.listPublic(r));
}

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
