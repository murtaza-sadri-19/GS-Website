const alertsService      = require('./alerts.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const activeOnly = req.query.all !== 'true';
    return success(res, 'Alerts fetched', await alertsService.listAlerts({ activeOnly }));
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    return success(res, 'Alert fetched', await alertsService.getAlert(parseInt(req.params.id)));
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    return success(res, 'Alert created', await alertsService.createAlert(req.body, req.user), 201);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    return success(res, 'Alert updated', await alertsService.updateAlert(parseInt(req.params.id), req.body, req.user));
  } catch (err) { next(err); }
}

async function toggle(req, res, next) {
  try {
    const { is_active } = req.body;
    if (is_active === undefined) return error(res, 'is_active is required', null, 400);
    return success(res, 'Alert toggled', await alertsService.toggleActive(parseInt(req.params.id), is_active, req.user));
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    await alertsService.deleteAlert(parseInt(req.params.id), req.user);
    return success(res, 'Alert deleted', null);
  } catch (err) { next(err); }
}

module.exports = { list, getOne, create, update, toggle, remove };
