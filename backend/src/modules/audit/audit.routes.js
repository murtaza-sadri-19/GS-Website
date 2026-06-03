const { Router }      = require('express');
const auditController = require('./audit.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const { allow }       = require('../../middlewares/role.middleware');

const router = Router();
const admin  = [authMiddleware, allow('CENTRAL_ADMIN')];

// Specific paths before /:id to avoid numeric conflict
router.get('/filter-options', ...admin, auditController.filterOptions);
router.get('/stats',          ...admin, auditController.stats);
router.get('/recent',         ...admin, auditController.recentActivity);
router.get('/user/:userId',   ...admin, auditController.getByUser);

router.get('/',    ...admin, auditController.list);
router.get('/:id', ...admin, auditController.getOne);

module.exports = router;
