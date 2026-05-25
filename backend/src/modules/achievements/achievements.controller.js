const svc = require('./achievements.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'Achievements fetched', await svc.list(req.query)); } catch (err) { next(err); }
}
async function getOne(req, res, next) {
  try { return success(res, 'Achievement fetched', await svc.getOne(parseInt(req.params.id))); } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return success(res, 'Achievement created', await svc.create(req.body, req.user), 201); } catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, 'Achievement updated', await svc.update(parseInt(req.params.id), req.body, req.user)); } catch (err) { next(err); }
}
async function patchStatus(req, res, next) {
  try {
    if (!req.body.status) return error(res, 'status is required', null, 400);
    return success(res, 'Achievement status updated', await svc.setStatus(parseInt(req.params.id), req.body.status, req.user));
  } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { await svc.remove(parseInt(req.params.id), req.user); return success(res, 'Achievement archived', null); } catch (err) { next(err); }
}

module.exports = { list, getOne, create, update, patchStatus, remove };
