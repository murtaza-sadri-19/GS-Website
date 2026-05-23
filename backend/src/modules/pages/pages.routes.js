const { Router }      = require('express');
const pagesController = require('./pages.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const { allow }       = require('../../middlewares/role.middleware');

const router = Router();

// GET / — CENTRAL_ADMIN only (admin list, all statuses)
// Registered before /:slug so the literal '/' does not fall through to the slug handler
router.get('/', authMiddleware, allow('CENTRAL_ADMIN'), pagesController.list);

// GET /:slug — public (PUBLISHED only, enforced in service)
router.get('/:slug', pagesController.getBySlug);

// POST / — CENTRAL_ADMIN only
router.post('/', authMiddleware, allow('CENTRAL_ADMIN'), pagesController.create);

// PUT /:id — CENTRAL_ADMIN only
router.put('/:id', authMiddleware, allow('CENTRAL_ADMIN'), pagesController.update);

// PATCH /:id/status — CENTRAL_ADMIN only
router.patch('/:id/status', authMiddleware, allow('CENTRAL_ADMIN'), pagesController.patchStatus);

// DELETE /:id — CENTRAL_ADMIN only (soft delete → status = DRAFT)
router.delete('/:id', authMiddleware, allow('CENTRAL_ADMIN'), pagesController.remove);

module.exports = router;
