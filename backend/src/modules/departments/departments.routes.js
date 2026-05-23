const { Router } = require('express');
const deptController = require('./departments.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const { allow }     = require('../../middlewares/role.middleware');

const router = Router();

const adminOnly   = [authMiddleware, allow('CENTRAL_ADMIN')];
const adminOrHod  = [authMiddleware, allow('CENTRAL_ADMIN', 'HOD')];

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/',      deptController.list);
router.get('/:slug', deptController.getBySlug);

// ── Admin only ────────────────────────────────────────────────────────────────
router.post('/',              ...adminOnly,  deptController.create);
router.patch('/:id/status',   ...adminOnly,  deptController.patchStatus);
router.delete('/:id',         ...adminOnly,  deptController.remove);
router.patch('/:id/hod',      ...adminOnly,  deptController.assignHod);

// ── Admin or HOD of that department (ownership enforced in service) ────────────
router.put('/:id',            ...adminOrHod, deptController.update);

module.exports = router;
