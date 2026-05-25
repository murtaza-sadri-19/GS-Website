const settingsService    = require('./settings.service');
const { success, error } = require('../../utils/response');

// ── Site Settings ─────────────────────────────────────────────────────────────

async function getAll(req, res, next) {
  try {
    return success(res, 'Settings fetched', await settingsService.getAllSettings());
  } catch (err) { next(err); }
}

async function getOne(req, res, next) {
  try {
    const value = await settingsService.getSetting(req.params.key);
    return success(res, 'Setting fetched', { key: req.params.key, value });
  } catch (err) { next(err); }
}

async function setOne(req, res, next) {
  try {
    const { value } = req.body;
    await settingsService.setSetting(req.params.key, value, req.user);
    return success(res, 'Setting saved', { key: req.params.key, value });
  } catch (err) { next(err); }
}

async function setBulk(req, res, next) {
  try {
    if (!req.body || typeof req.body !== 'object') return error(res, 'Body must be a settings object', null, 400);
    await settingsService.setBulkSettings(req.body, req.user);
    return success(res, 'Settings saved', null);
  } catch (err) { next(err); }
}

// ── CMS Sections ──────────────────────────────────────────────────────────────

async function listSections(req, res, next) {
  try {
    return success(res, 'CMS sections listed', await settingsService.listCmsSections());
  } catch (err) { next(err); }
}

async function getSection(req, res, next) {
  try {
    const data = await settingsService.getCmsSection(req.params.section);
    return success(res, 'CMS section fetched', data);
  } catch (err) { next(err); }
}

async function saveSection(req, res, next) {
  try {
    await settingsService.setCmsSection(req.params.section, req.body, req.user);
    return success(res, 'CMS section saved', null);
  } catch (err) { next(err); }
}

module.exports = { getAll, getOne, setOne, setBulk, listSections, getSection, saveSection };
