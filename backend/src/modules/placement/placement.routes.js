const { Router }          = require('express');
const placementController = require('./placement.controller');
const extra               = require('./placement.extra.controller');
const offersController    = require('./placement.offers.controller');
const authMiddleware      = require('../../middlewares/auth.middleware');
const { allow }           = require('../../middlewares/role.middleware');

const router = Router();
const WRITE = ['PLACEMENT_OFFICER', 'CENTRAL_ADMIN'];

// ── Public GET routes ─────────────────────────────────────────────────────────
// Specific typed routes registered before /records/:id to avoid param collision

router.get('/notices',           placementController.listNotices);
router.get('/company-visits',    placementController.listCompanyVisits);
router.get('/records',           placementController.listRecords);
router.get('/training-programs', placementController.listTrainingPrograms);

// ── Individual student placement offers (Placement Officer portal) ─────────────
router.get('/offers',            authMiddleware, allow(...WRITE), offersController.list);
router.post('/offers',           authMiddleware, allow(...WRITE), offersController.create);
router.delete('/offers/:id',     authMiddleware, allow(...WRITE), offersController.remove);

// ── Structured entities: companies / drives / internships / yearly stats ──────
for (const r of ['companies', 'drives', 'internships']) {
  router.get(`/${r}`,        extra.listRes(r));
  router.post(`/${r}`,       authMiddleware, allow(...WRITE), extra.createRes(r));
  router.put(`/${r}/:id`,    authMiddleware, allow(...WRITE), extra.updateRes(r));
  router.delete(`/${r}/:id`, authMiddleware, allow(...WRITE), extra.removeRes(r));
}
router.get('/stats',  extra.listStats);
router.post('/stats', authMiddleware, allow(...WRITE), extra.upsertStats);

router.get('/records/:id',       placementController.getOne);

// ── PLACEMENT_OFFICER-only write routes ───────────────────────────────────────

router.post(  '/records',            authMiddleware, allow('PLACEMENT_OFFICER'), placementController.create);
router.put(   '/records/:id',        authMiddleware, allow('PLACEMENT_OFFICER'), placementController.update);
router.patch( '/records/:id/status', authMiddleware, allow('PLACEMENT_OFFICER'), placementController.patchStatus);
router.delete('/records/:id',        authMiddleware, allow('PLACEMENT_OFFICER'), placementController.remove);

module.exports = router;
