const eventsService      = require('./events.service');
const { success, error } = require('../../utils/response');

async function list(req, res, next) {
  try {
    const { page, pageSize, limit, department_id, q } = req.query;
    const result = await eventsService.listEvents({
      page,
      pageSize: pageSize || limit,
      department_id,
      q,
    });
    return success(res, 'Events fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const event = await eventsService.getEvent(req.params.slug);
    return success(res, 'Event fetched successfully', event);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const event = await eventsService.createEvent(req.body, req.user);
    return success(res, 'Event created successfully', event, 201);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const event = await eventsService.updateEvent(parseInt(req.params.id), req.body, req.user);
    return success(res, 'Event updated successfully', event);
  } catch (err) {
    next(err);
  }
}

async function patchStatus(req, res, next) {
  try {
    // req.body.status validated by Zod patchStatusSchema
    const { status } = req.body;
    const event = await eventsService.setStatus(parseInt(req.params.id), status, req.user);
    return success(res, 'Event status updated successfully', event);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await eventsService.archiveEvent(parseInt(req.params.id), req.user);
    return success(res, 'Event archived successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getOne, create, update, patchStatus, remove };
