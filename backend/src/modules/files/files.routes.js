const { Router }       = require('express');
const filesController  = require('./files.controller');
const authMiddleware   = require('../../middlewares/auth.middleware');
const { allow }        = require('../../middlewares/role.middleware');
const { uploadSingle } = require('../../middlewares/upload.middleware');

const router = Router();

// POST /upload — any authenticated user
router.post('/upload', authMiddleware, uploadSingle, filesController.upload);

// GET / — CENTRAL_ADMIN only
router.get('/', authMiddleware, allow('CENTRAL_ADMIN'), filesController.list);

// GET /:id — owner or CENTRAL_ADMIN (ownership enforced in service)
router.get('/:id', authMiddleware, filesController.getOne);

// DELETE /:id — owner or CENTRAL_ADMIN (ownership + reference check in service)
router.delete('/:id', authMiddleware, filesController.remove);

module.exports = router;
