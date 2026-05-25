const svc = require('./leaves.service');
const { success } = require('../../utils/response');

async function apply(req, res, next) {
  try { return success(res, 'Leave request submitted', await svc.apply(req.body, req.user), 201); }
  catch (err) { next(err); }
}
async function listMine(req, res, next) {
  try { return success(res, 'Leaves fetched', await svc.listMine(req.user, req.query)); }
  catch (err) { next(err); }
}
async function listForReview(req, res, next) {
  try { return success(res, 'Leaves fetched', await svc.listForReview(req.user, req.query)); }
  catch (err) { next(err); }
}
async function approve(req, res, next) {
  try { return success(res, 'Leave approved', await svc.review(parseInt(req.params.id), 'approved', req.user, req.body.remarks)); }
  catch (err) { next(err); }
}
async function reject(req, res, next) {
  try { return success(res, 'Leave rejected', await svc.review(parseInt(req.params.id), 'rejected', req.user, req.body.remarks)); }
  catch (err) { next(err); }
}

module.exports = { apply, listMine, listForReview, approve, reject };
