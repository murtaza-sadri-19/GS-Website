/**
 * Files Routes
 *
 * POST   /upload        — upload a real file (multipart/form-data)
 * POST   /link          — register an external URL attachment (JSON)
 * PATCH  /link/:id      — update metadata on an external link attachment (JSON)
 * GET    /              — list all attachments (CENTRAL_ADMIN only)
 * GET    /:id           — get one attachment (owner or CENTRAL_ADMIN)
 * DELETE /:id           — delete an attachment (owner or CENTRAL_ADMIN)
 */
const { Router }       = require('express');
const filesController  = require('./files.controller');
const authMiddleware   = require('../../middlewares/auth.middleware');
const { allow }        = require('../../middlewares/role.middleware');
const { uploadSingle } = require('../../middlewares/upload.middleware');

const router = Router();

// ── File upload (binary) — any authenticated user ─────────────────────────────
router.post('/upload', authMiddleware, uploadSingle, filesController.upload);

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
