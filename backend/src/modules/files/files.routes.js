/**
 * Files Routes
 *
 * POST   /upload          — single file upload (multipart/form-data, field: "file")
 * POST   /upload-multiple — up to 20 files at once (multipart/form-data, field: "files")
 * POST   /link            — register an external URL attachment (JSON)
 * PATCH  /link/:id        — update metadata on an external link attachment (JSON)
 * GET    /                — list all attachments (CENTRAL_ADMIN only)
 * GET    /:id             — get one attachment (owner or CENTRAL_ADMIN)
 * DELETE /:id             — delete an attachment (owner or CENTRAL_ADMIN)
 */
const { Router }               = require('express');
const filesController          = require('./files.controller');
const authMiddleware           = require('../../middlewares/auth.middleware');
const { allow }                = require('../../middlewares/role.middleware');
const { uploadSingle, uploadArray } = require('../../middlewares/upload.middleware');

const router = Router();

// ── Single file upload — any authenticated user ───────────────────────────────
router.post('/upload', authMiddleware, uploadSingle, filesController.upload);

// ── Multiple file upload (up to 20) — any authenticated user ─────────────────
router.post('/upload-multiple', authMiddleware, uploadArray, filesController.uploadMultiple);

// ── External link registration — any authenticated user ───────────────────────
router.post('/link', authMiddleware, filesController.registerLink);

// ── Update external link metadata — owner or CENTRAL_ADMIN ───────────────────
router.patch('/link/:id', authMiddleware, filesController.updateLink);

// ── List all attachments — CENTRAL_ADMIN only ─────────────────────────────────
router.get('/', authMiddleware, allow('CENTRAL_ADMIN'), filesController.list);

// ── Get one attachment — owner or CENTRAL_ADMIN (enforced in service) ─────────
router.get('/:id', authMiddleware, filesController.getOne);

// ── Delete attachment — owner or CENTRAL_ADMIN ────────────────────────────────
router.delete('/:id', authMiddleware, filesController.remove);

module.exports = router;
