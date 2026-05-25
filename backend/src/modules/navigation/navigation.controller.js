const svc = require('./navigation.service');
const { success } = require('../../utils/response');

async function get(req, res, next) {
  try { return success(res, 'Navigation fetched', await svc.getTree(req.query)); } catch (err) { next(err); }
}
async function replace(req, res, next) {
  try {
    const items = Array.isArray(req.body) ? req.body : req.body.items;
    return success(res, 'Navigation saved', await svc.replaceTree(items, req.user));
  } catch (err) { next(err); }
}

module.exports = { get, replace };
