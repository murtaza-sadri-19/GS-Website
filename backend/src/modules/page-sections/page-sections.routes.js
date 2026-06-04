const { Router } = require('express');
const ctrl        = require('./page-sections.controller');
const auth        = require('../../middlewares/auth.middleware');
const { allow }   = require('../../middlewares/role.middleware');

const router = Router();

// ── Public ────────────────────────────────────────────────────────────────────
// GET /api/v1/page-sections?page_key=facilities
// GET /api/v1/page-sections?page_key=facilities&all=1  (admin, shows inactive too)
router.get('/',         ctrl.list);

// GET /api/v1/page-sections/live-stats  — aggregate DB counts
router.get('/live-stats', ctrl.stats);

// ── Admin (CENTRAL_ADMIN only) ────────────────────────────────────────────────
router.post(   '/',            auth, allow('CENTRAL_ADMIN'), ctrl.create);
router.put(    '/reorder',     auth, allow('CENTRAL_ADMIN'), ctrl.reorder);
router.put(    '/:id',         auth, allow('CENTRAL_ADMIN'), ctrl.update);
router.delete( '/:id',         auth, allow('CENTRAL_ADMIN'), ctrl.remove);

module.exports = router;
