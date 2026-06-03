const auditService       = require('./audit.service');
const { success }        = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, user_id, action, module_name, severity, search, date_from, date_to } = req.query;
    const result = await auditService.listLogs({
      page, pageSize: pageSize || limit,
      user_id, action, module_name, severity, search, date_from, date_to,
    });
    return success(res, 'Audit logs fetched', result);
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const log = await auditService.getLog(parseInt(req.params.id));
    return success(res, 'Audit log entry fetched', log);
  } catch (err) { next(err); }
}

async function getByUser(req, res, next) {
  try {
    const { page, pageSize, limit } = req.query;
    const result = await auditService.getLogsByUser(parseInt(req.params.userId), { page, pageSize: pageSize || limit });
    return success(res, 'Audit logs fetched', result);
  } catch (err) { next(err); }
}

async function filterOptions(req, res, next) {
  try {
    const opts = await auditService.getFilterOptions();
    return success(res, 'Filter options fetched', opts);
  } catch (err) { next(err); }
}

async function stats(req, res, next) {
  try {
    const data = await auditService.getStats();
    return success(res, 'Audit stats fetched', data);
  } catch (err) { next(err); }
}

async function recentActivity(req, res, next) {
  try {
    const limit = Math.min(50, parseInt(req.query.limit) || 15);
    const logs  = await auditService.getRecentActivity(limit);
    return success(res, 'Recent activity fetched', logs);
  } catch (err) { next(err); }
}

module.exports = { list, getOne, getByUser, filterOptions, stats, recentActivity };
