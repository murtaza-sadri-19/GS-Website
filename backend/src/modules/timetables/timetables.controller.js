const svc = require('./timetables.service');
const { success } = require('../../utils/response');

async function list(req, res, next) {
  try { return success(res, 'Timetables fetched', await svc.list(req.query)); } catch (err) { next(err); }
}
async function listMine(req, res, next) {
  try { return success(res, 'Timetable fetched', await svc.listMine(req.user)); } catch (err) { next(err); }
}
async function getOne(req, res, next) {
  try { return success(res, 'Timetable fetched', await svc.getOne(parseInt(req.params.id))); } catch (err) { next(err); }
}
async function create(req, res, next) {
  try { return success(res, 'Timetable created', await svc.create(req.body, req.user), 201); } catch (err) { next(err); }
}
async function update(req, res, next) {
  try { return success(res, 'Timetable updated', await svc.update(parseInt(req.params.id), req.body, req.user)); } catch (err) { next(err); }
}
async function replaceEntries(req, res, next) {
  try { return success(res, 'Timetable entries saved', await svc.replaceEntries(parseInt(req.params.id), req.body.entries, req.user)); } catch (err) { next(err); }
}
async function remove(req, res, next) {
  try { await svc.remove(parseInt(req.params.id), req.user); return success(res, 'Timetable deleted', null); } catch (err) { next(err); }
}

async function getPeriodsConfig(req, res, next) {
  try {
    const config = await svc.getPeriodsConfig(parseInt(req.params.deptId));
    return success(res, 'Periods config fetched', config);
  } catch (err) { next(err); }
}

async function savePeriodsConfig(req, res, next) {
  try {
    const config = await svc.savePeriodsConfig(parseInt(req.params.deptId), req.body, req.user);
    return success(res, 'Periods config saved', config);
  } catch (err) { next(err); }
}

module.exports = { list, listMine, getOne, create, update, replaceEntries, remove, getPeriodsConfig, savePeriodsConfig };
