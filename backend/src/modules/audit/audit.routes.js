const { Router }      = require('express');
const auditController = require('./audit.controller');
const authMiddleware  = require('../../middlewares/auth.middleware');
const { allow }       = require('../../middlewares/role.middleware');

const router = Router();

// All audit-log routes are CENTRAL_ADMIN only

// GET /user/:userId — registered before /:id to avoid "user" being treated as a numeric id
router.get('/user/:userId', authMiddleware, allow('CENTRAL_ADMIN'), auditController.getByUser);

router.get('/',     authMiddleware, allow('CENTRAL_ADMIN'), auditController.list);
router.get('/:id',  authMiddleware, allow('CENTRAL_ADMIN'), auditController.getOne);

module.exports = router;
