const { Router }          = require('express');
const noticesController   = require('./notices.controller');
const authMiddleware      = require('../../middlewares/auth.middleware');
const { allow }           = require('../../middlewares/role.middleware');

const router = Router();

// Roles that can write notices — fine-grained type/ownership enforced in service
const WRITE_ROLES = ['CENTRAL_ADMIN', 'HOD', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER'];

// GET / — public
router.get('/', noticesController.list);

// GET /:id — public
router.get('/:id', noticesController.getOne);

// POST / — create (role×type matrix enforced in service)
router.post('/', authMiddleware, allow(...WRITE_ROLES), noticesController.create);

// PUT /:id — update (ownership enforced in service)
router.put('/:id', authMiddleware, allow(...WRITE_ROLES), noticesController.update);

// PATCH /:id/status — set status (ownership enforced in service)
router.patch('/:id/status', authMiddleware, allow(...WRITE_ROLES), noticesController.patchStatus);

// DELETE /:id — archive (ownership enforced in service)
router.delete('/:id', authMiddleware, allow(...WRITE_ROLES), noticesController.remove);

module.exports = router;
