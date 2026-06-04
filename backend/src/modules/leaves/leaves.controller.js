const svc          = require('./leaves.service');
const typesSvc     = require('./leave.types.service');
const policiesSvc  = require('./leave.policies.service');
const balanceSvc   = require('./leave.balance.service');
const { success }  = require('../../utils/response');

// ── Leave Requests ────────────────────────────────────────────────────────────

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
  try { return success(res, 'Leave approved', await svc.review(parseInt(req.params.id), 'approved', req.user, req.body?.remarks)); }
  catch (err) { next(err); }
}
async function reject(req, res, next) {
  try { return success(res, 'Leave rejected', await svc.review(parseInt(req.params.id), 'rejected', req.user, req.body?.remarks)); }
  catch (err) { next(err); }
}

// ── Leave Types ───────────────────────────────────────────────────────────────

async function listTypes(req, res, next) {
  try { return success(res, 'Leave types fetched', await typesSvc.list()); }
  catch (err) { next(err); }
}
async function createType(req, res, next) {
  try { return success(res, 'Leave type created', await typesSvc.create(req.body, req.user), 201); }
  catch (err) { next(err); }
}
async function updateType(req, res, next) {
  try { return success(res, 'Leave type updated', await typesSvc.update(parseInt(req.params.id), req.body, req.user)); }
  catch (err) { next(err); }
}
async function deleteType(req, res, next) {
  try { await typesSvc.remove(parseInt(req.params.id), req.user); return success(res, 'Leave type deleted', null); }
  catch (err) { next(err); }
}

// ── Leave Policies ────────────────────────────────────────────────────────────

async function listPolicies(req, res, next) {
  try { return success(res, 'Leave policies fetched', await policiesSvc.list(req.user, req.query)); }
  catch (err) { next(err); }
}
async function createPolicy(req, res, next) {
  try { return success(res, 'Leave policy created', await policiesSvc.create(req.body, req.user), 201); }
  catch (err) { next(err); }
}
async function updatePolicy(req, res, next) {
  try { return success(res, 'Leave policy updated', await policiesSvc.update(parseInt(req.params.id), req.body, req.user)); }
  catch (err) { next(err); }
}
async function deletePolicy(req, res, next) {
  try { await policiesSvc.remove(parseInt(req.params.id), req.user); return success(res, 'Leave policy deleted', null); }
  catch (err) { next(err); }
}

// ── Leave Balance ─────────────────────────────────────────────────────────────

async function getMyBalance(req, res, next) {
  try {
    const balance = await balanceSvc.getBalance(
      req.user.id, req.user.department_id, req.user.role,
      req.query.academic_year || null
    );
    return success(res, 'Leave balance fetched', balance);
  } catch (err) { next(err); }
}

async function getUserBalance(req, res, next) {
  try {
    const balance = await balanceSvc.getBalanceForUser(parseInt(req.params.userId), req.user);
    return success(res, 'Leave balance fetched', balance);
  } catch (err) { next(err); }
}

module.exports = {
  apply, listMine, listForReview, approve, reject,
  listTypes, createType, updateType, deleteType,
  listPolicies, createPolicy, updatePolicy, deletePolicy,
  getMyBalance, getUserBalance,
};
