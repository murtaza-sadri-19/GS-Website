const { Router }            = require('express');
const downloadsController   = require('./downloads.controller');
const authMiddleware        = require('../../middlewares/auth.middleware');
const { allow }             = require('../../middlewares/role.middleware');

const router = Router();

// GET / — public
router.get('/', downloadsController.list);

// GET /:id — public
router.get('/:id', downloadsController.getOne);

// PATCH /:id/increment-count — public (registered before /:id/status to avoid collision)
router.patch('/:id/increment-count', downloadsController.incrementCount);

// POST / — CENTRAL_ADMIN or HOD
router.post('/', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), downloadsController.create);

// PUT /:id — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.put('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), downloadsController.update);

// PATCH /:id/status — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.patch('/:id/status', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), downloadsController.patchStatus);

// DELETE /:id — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.delete('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), downloadsController.remove);

module.exports = router;
