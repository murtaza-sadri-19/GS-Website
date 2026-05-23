const { Router }          = require('express');
const placementController = require('./placement.controller');
const authMiddleware      = require('../../middlewares/auth.middleware');
const { allow }           = require('../../middlewares/role.middleware');

const router = Router();

// ── Public GET routes ─────────────────────────────────────────────────────────
// Specific typed routes registered before /records/:id to avoid param collision

router.get('/notices',           placementController.listNotices);
router.get('/company-visits',    placementController.listCompanyVisits);
router.get('/records',           placementController.listRecords);
router.get('/training-programs', placementController.listTrainingPrograms);
router.get('/records/:id',       placementController.getOne);

// ── PLACEMENT_OFFICER-only write routes ───────────────────────────────────────

router.post(  '/records',            authMiddleware, allow('PLACEMENT_OFFICER'), placementController.create);
router.put(   '/records/:id',        authMiddleware, allow('PLACEMENT_OFFICER'), placementController.update);
router.patch( '/records/:id/status', authMiddleware, allow('PLACEMENT_OFFICER'), placementController.patchStatus);
router.delete('/records/:id',        authMiddleware, allow('PLACEMENT_OFFICER'), placementController.remove);

module.exports = router;
