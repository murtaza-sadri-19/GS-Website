const { Router } = require('express');
const ctrl       = require('./navigation.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();

router.get('/', ctrl.get);                                                  // public
router.put('/', auth, allow('CENTRAL_ADMIN', 'CONTENT_EDITOR'), ctrl.replace); // admin replace-all

module.exports = router;
