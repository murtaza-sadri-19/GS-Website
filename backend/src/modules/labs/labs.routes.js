const { Router } = require('express');
const ctrl       = require('./labs.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

// Public read (department pages render labs)
router.get('/',    ctrl.list);
router.get('/:id', ctrl.getOne);

// HOD / Admin manage (ownership enforced in service)
router.post('/',      auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.create);
router.put('/:id',    auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.update);
router.delete('/:id', auth, allow('HOD', 'CENTRAL_ADMIN'), ctrl.remove);

module.exports = router;
