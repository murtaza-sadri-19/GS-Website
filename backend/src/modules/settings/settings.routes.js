const { Router }          = require('express');
const settingsController  = require('./settings.controller');
const authMiddleware      = require('../../middlewares/auth.middleware');
const { allow }           = require('../../middlewares/role.middleware');

const router = Router();

// ── Site Settings ─────────────────────────────────────────────────────────────
// GET all settings (public — needed by frontend for site config)
router.get('/', settingsController.getAll);
router.get('/key/:key', settingsController.getOne);

// Write settings — CENTRAL_ADMIN only
router.put('/key/:key', authMiddleware, allow('CENTRAL_ADMIN'), settingsController.setOne);
router.put('/',         authMiddleware, allow('CENTRAL_ADMIN'), settingsController.setBulk);

// ── CMS Sections ──────────────────────────────────────────────────────────────
// Public read (for footer, home page content, etc.)
router.get('/cms',              settingsController.listSections);
router.get('/cms/:section',     settingsController.getSection);

// Write CMS sections — CENTRAL_ADMIN only
router.put('/cms/:section', authMiddleware, allow('CENTRAL_ADMIN'), settingsController.saveSection);

module.exports = router;
