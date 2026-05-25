const svc = require('./placement.extra.service');
const { success } = require('../../utils/response');

const listRes = (resource) => async (req, res, next) => {
  try { return success(res, `${resource} fetched`, await svc.list(resource)); } catch (err) { next(err); }
};
const createRes = (resource) => async (req, res, next) => {
  try { return success(res, `${resource} created`, await svc.create(resource, req.body, req.user), 201); } catch (err) { next(err); }
};
const updateRes = (resource) => async (req, res, next) => {
  try { return success(res, `${resource} updated`, await svc.update(resource, parseInt(req.params.id), req.body, req.user)); } catch (err) { next(err); }
};
const removeRes = (resource) => async (req, res, next) => {
  try { await svc.remove(resource, parseInt(req.params.id), req.user); return success(res, `${resource} deleted`, null); } catch (err) { next(err); }
};

async function listStats(req, res, next) {
  try { return success(res, 'Placement stats fetched', await svc.listStats()); } catch (err) { next(err); }
}
async function upsertStats(req, res, next) {
  try { return success(res, 'Placement stats saved', await svc.upsertStats(req.body, req.user)); } catch (err) { next(err); }
}

module.exports = { listRes, createRes, updateRes, removeRes, listStats, upsertStats };
