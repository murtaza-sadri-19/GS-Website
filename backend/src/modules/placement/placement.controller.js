const placementService   = require('./placement.service');
const { success, error } = require('../../utils/response');

// ── Shared list helper ────────────────────────────────────────────────────────

async function listWith(record_type, req, res, next) {
  try {
    const { page, pageSize, limit, company_name, academic_year, q } = req.query;
    const result = await placementService.listRecords({
      page,
      pageSize: pageSize || limit,
      record_type,
      company_name,
      academic_year,
      q,
    });
    return success(res, 'Records fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

// ── Public GET routes ─────────────────────────────────────────────────────────

async function listNotices(req, res, next) {
  return listWith('NOTICE', req, res, next);
}

async function listCompanyVisits(req, res, next) {
  return listWith('COMPANY_VISIT', req, res, next);
}

async function listRecords(req, res, next) {
  return listWith('PLACEMENT_RECORD', req, res, next);
}

async function listTrainingPrograms(req, res, next) {
  return listWith('TRAINING_PROGRAM', req, res, next);
}

async function getOne(req, res, next) {
  try {
    const record = await placementService.getRecord(parseInt(req.params.id));
    return success(res, 'Record fetched successfully', record);
  } catch (err) {
    next(err);
  }
}

// ── Admin routes ──────────────────────────────────────────────────────────────

async function create(req, res, next) {
  try {
    const record = await placementService.createRecord(req.body, req.user);
    return success(res, 'Record created successfully', record, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const record = await placementService.updateRecord(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Record updated successfully', record);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const record = await placementService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Record status updated successfully', record);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await placementService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Record deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listNotices, listCompanyVisits, listRecords, listTrainingPrograms,
  getOne, create, update, patchStatus, remove,
};
