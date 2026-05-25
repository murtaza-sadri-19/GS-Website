const { Router }          = require('express');
const noticesController   = require('./notices.controller');
const authMiddleware      = require('../../middlewares/auth.middleware');
const { allow }           = require('../../middlewares/role.middleware');
const { validate }        = require('../../middlewares/validate.middleware');
const { createNoticeSchema, updateNoticeSchema, patchStatusSchema } = require('./notices.schema');

const router = Router();

// Roles that can write notices — fine-grained type/ownership enforced in service
const WRITE_ROLES = ['CENTRAL_ADMIN', 'HOD', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER'];

// GET / — public, but optional auth for admin view
router.get('/', authMiddleware.optional, noticesController.list);

// GET /:id — public
router.get('/:id', noticesController.getOne);

// POST / — create (role×type matrix enforced in service)
router.post('/', authMiddleware, allow(...WRITE_ROLES), validate(createNoticeSchema), noticesController.create);

// PUT /:id — update (ownership enforced in service)
router.put('/:id', authMiddleware, allow(...WRITE_ROLES), validate(updateNoticeSchema), noticesController.update);

// PATCH /:id/status — set status (ownership enforced in service)
router.patch('/:id/status', authMiddleware, allow(...WRITE_ROLES), validate(patchStatusSchema), noticesController.patchStatus);

// DELETE /:id — archive (ownership enforced in service)
router.delete('/:id', authMiddleware, allow(...WRITE_ROLES), noticesController.remove);

module.exports = router;
