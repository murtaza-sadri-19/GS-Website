const svc = require('./labs.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'Labs fetched', await svc.list(req.query)); } catch (err) { next(err); }
}
async function getOne(req, res, next) {
  try { return success(res, 'Lab fetched', await svc.getOne(parseInt(req.params.id))); } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return success(res, 'Lab created', await svc.create(req.body, req.user), 201); } catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, 'Lab updated', await svc.update(parseInt(req.params.id), req.body, req.user)); } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { await svc.remove(parseInt(req.params.id), req.user); return success(res, 'Lab removed', null); } catch (err) { next(err); }
}

module.exports = { list, getOne, create, update, remove };
