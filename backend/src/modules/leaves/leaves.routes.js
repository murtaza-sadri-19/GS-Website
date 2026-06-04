const { Router } = require('express');
const ctrl       = require('./leaves.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router    = Router();
const staffAuth = [auth, allow('TEACHER', 'HOD', 'CENTRAL_ADMIN', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER')];
const adminHod  = [auth, allow('HOD', 'CENTRAL_ADMIN')];
const adminOnly = [auth, allow('CENTRAL_ADMIN')];

// ── Leave Requests ─────────────────────────────────────────────────────────────
router.get('/me',               ...staffAuth, ctrl.listMine);
router.post('/',                ...staffAuth, ctrl.apply);
router.get('/',                 ...adminHod,  ctrl.listForReview);
router.put('/:id/approve',      ...adminHod,  ctrl.approve);
router.put('/:id/reject',       ...adminHod,  ctrl.reject);

// ── Leave Balance ──────────────────────────────────────────────────────────────
router.get('/balance',              ...staffAuth, ctrl.getMyBalance);
router.get('/balance/:userId',      ...adminHod,  ctrl.getUserBalance);

// ── Leave Types ────────────────────────────────────────────────────────────────
router.get('/types',            ctrl.listTypes);           // public — teachers need to see types
router.post('/types',           ...adminHod,  ctrl.createType);
router.put('/types/:id',        ...adminHod,  ctrl.updateType);
router.delete('/types/:id',     ...adminOnly, ctrl.deleteType);

// ── Leave Policies ─────────────────────────────────────────────────────────────
router.get('/policies',         ...adminHod,  ctrl.listPolicies);
router.post('/policies',        ...adminHod,  ctrl.createPolicy);
router.put('/policies/:id',     ...adminHod,  ctrl.updatePolicy);
router.delete('/policies/:id',  ...adminHod,  ctrl.deletePolicy);

module.exports = router;
