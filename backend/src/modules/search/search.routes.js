const { Router } = require('express');
const svc        = require('./search.service');
const { success } = require('../../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    return success(res, 'Search results', await svc.search(req.query.q, { limit: req.query.limit }));
  } catch (err) { next(err); }
});

module.exports = router;
