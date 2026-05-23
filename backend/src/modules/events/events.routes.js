const { Router }       = require('express');
const eventsController = require('./events.controller');
const authMiddleware   = require('../../middlewares/auth.middleware');
const { allow }        = require('../../middlewares/role.middleware');

const router = Router();

// GET / — public
router.get('/', eventsController.list);

// GET /:slug — public (slug string, not numeric id)
router.get('/:slug', eventsController.getOne);

// POST / — CENTRAL_ADMIN or HOD
router.post('/', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), eventsController.create);

// PUT /:id — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.put('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), eventsController.update);

// PATCH /:id/status — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.patch('/:id/status', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), eventsController.patchStatus);

// DELETE /:id — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.delete('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), eventsController.remove);

module.exports = router;
