const { Router } = require('express');
const ctrl       = require('./chatbot.controller');
const auth       = require('../../middlewares/auth.middleware');
const { allow }  = require('../../middlewares/role.middleware');

const router = Router();
const EDIT = ['CENTRAL_ADMIN', 'CONTENT_EDITOR'];

// Public reads (widget)
router.get('/config',    ctrl.getConfig);
router.get('/responses', ctrl.listResponses);

// Admin writes
router.put('/config',         auth, allow(...EDIT), ctrl.updateConfig);
router.post('/responses',     auth, allow(...EDIT), ctrl.createResponse);
router.put('/responses/:id',  auth, allow(...EDIT), ctrl.updateResponse);
router.delete('/responses/:id', auth, allow(...EDIT), ctrl.deleteResponse);

module.exports = router;
