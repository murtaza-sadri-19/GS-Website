const svc = require('./registration.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'Registration requests fetched', await svc.list(req.user, req.query)); } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return success(res, 'Registration request created', await svc.create(req.body, req.user), 201); } catch (err) { next(err); }
}
async function approve(req, res, next) {
  try { return success(res, 'Request approved', await svc.review(parseInt(req.params.id), 'approved', req.user, req.body.remarks)); } catch (err) { next(err); }
}
async function reject(req, res, next) {
  try { return success(res, 'Request rejected', await svc.review(parseInt(req.params.id), 'rejected', req.user, req.body.remarks)); } catch (err) { next(err); }
}

module.exports = { list, create, approve, reject };
