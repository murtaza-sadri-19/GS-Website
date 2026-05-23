const examService        = require('./exam.service');
const { success, error } = require('../../utils/response');

// ── Shared list helper ────────────────────────────────────────────────────────

async function listWith(document_type, req, res, next) {
  try {
    const { page, pageSize, limit, q } = req.query;
    // document_type from path overrides any ?document_type= query param
    const result = await examService.listDocuments({
      page,
      pageSize: pageSize || limit,
      document_type,
      q,
    });
    return success(res, 'Documents fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

// ── Public GET routes ─────────────────────────────────────────────────────────

async function listAll(req, res, next) {
  // Supports optional ?document_type= filter on the general endpoint
  return listWith(req.query.document_type || undefined, req, res, next);
}

async function listNotices(req, res, next) {
  return listWith('NOTICE', req, res, next);
}

async function listTimetables(req, res, next) {
  return listWith('TIMETABLE', req, res, next);
}

async function listResults(req, res, next) {
  return listWith('RESULT', req, res, next);
}

async function listAcademicCalendar(req, res, next) {
  return listWith('ACADEMIC_CALENDAR', req, res, next);
}

async function getOne(req, res, next) {
  try {
    const doc = await examService.getDocument(parseInt(req.params.id));
    return success(res, 'Document fetched successfully', doc);
  } catch (err) {
    next(err);
  }
}

// ── Admin routes ──────────────────────────────────────────────────────────────

async function create(req, res, next) {
  try {
    const doc = await examService.createDocument(req.body, req.user);
    return success(res, 'Document created successfully', doc, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const doc = await examService.updateDocument(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Document updated successfully', doc);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!status) return error(res, 'status is required in request body', null, 400);
    const doc = await examService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Document status updated successfully', doc);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await examService.softDelete(parseInt(req.params.id), req.user);
    return success(res, 'Document deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listAll, listNotices, listTimetables, listResults, listAcademicCalendar,
  getOne, create, update, patchStatus, remove,
};
