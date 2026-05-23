const auditService       = require('./audit.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, user_id, action, module_name } = req.query;
    const result = await auditService.listLogs({
      page,
      pageSize: pageSize || limit,
      user_id,
      action,
      module_name,
    });
    return success(res, 'Audit logs fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const log = await auditService.getLog(parseInt(req.params.id));
    return success(res, 'Audit log entry fetched successfully', log);
  } catch (err) {
    next(err);
  }
}

async function getByUser(req, res, next) {
  try {
    const { page, pageSize, limit } = req.query;
    const result = await auditService.getLogsByUser(parseInt(req.params.userId), {
      page,
      pageSize: pageSize || limit,
    });
    return success(res, 'Audit logs fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, getByUser };
