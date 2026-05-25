const svc = require('./seo.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'SEO entries fetched', await svc.list()); } catch (err) { next(err); }
}
async function getByKey(req, res, next) {
  try { return success(res, 'SEO fetched', await svc.getByKey(req.params.pageKey)); } catch (err) { next(err); }
}
async function upsert(req, res, next) {
  try { return success(res, 'SEO saved', await svc.upsert(req.params.pageKey, req.body, req.user)); } catch (err) { next(err); }
}

module.exports = { list, getByKey, upsert };
