const { Router }        = require('express');
const galleryController = require('./gallery.controller');
const authMiddleware    = require('../../middlewares/auth.middleware');
const { allow }         = require('../../middlewares/role.middleware');

const router = Router();

// GET / — public
router.get('/', galleryController.list);

// GET /:id — public
router.get('/:id', galleryController.getOne);

// POST / — CENTRAL_ADMIN or HOD
router.post('/', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), galleryController.create);

// PUT /:id — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.put('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), galleryController.update);

// PATCH /:id/status — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.patch('/:id/status', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), galleryController.patchStatus);

// DELETE /:id — CENTRAL_ADMIN or HOD (ownership enforced in service)
router.delete('/:id', authMiddleware, allow('CENTRAL_ADMIN', 'HOD'), galleryController.remove);

module.exports = router;
