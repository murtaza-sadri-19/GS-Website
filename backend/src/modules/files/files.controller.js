/**
 * Files Controller — handles both file uploads and external link registration.
 */
const filesService = require('./files.service');
const { success, error } = require('../../utils/response');

// ── POST /api/v1/files/upload ─────────────────────────────────────────────────
async function upload(req, res, next) {
  try {
    if (!req.file) {
      return error(res, 'No file provided — use field name "file" in multipart/form-data', null, 400);
    }

    const usage = req.body.usage || 'notices';

    if (!filesService.VALID_USAGES.includes(usage)) {
      return error(res, `Invalid usage "${usage}". Valid values: ${filesService.VALID_USAGES.join(', ')}`, null, 400);
    }

    const file = await filesService.uploadFile(req.file, req.user.id, usage);
    return success(res, 'File uploaded successfully', file, 201);
  } catch (err) {
    next(err);
  }
}

// ── POST /api/v1/files/link ───────────────────────────────────────────────────
/**
 * Registers an external URL as an attachment.
 *
 * Body (JSON):
 *   external_url        string  required
 *   original_name       string  optional  display name
 *   alt_text            string  optional  accessible description
 *   thumbnail_url       string  optional  preview image URL
 *   meta_title          string  optional  display title
 *   meta_description    string  optional  short description
 *   usage               string  optional  context for audit logging
 */
async function registerLink(req, res, next) {
  try {
    const { external_url, original_name, alt_text, thumbnail_url, meta_title, meta_description, usage } = req.body;

    if (!external_url || typeof external_url !== 'string' || !external_url.trim()) {
      return error(res, 'external_url is required', null, 400);
    }

    const file = await filesService.registerExternalLink(
      { external_url, original_name, alt_text, thumbnail_url, meta_title, meta_description, usage },
      req.user.id
    );

    return success(res, 'External link registered successfully', file, 201);
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/v1/files/link/:id ─────────────────────────────────────────────
/**
 * Updates metadata on an existing EXTERNAL_LINK attachment.
 */
async function updateLink(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (!id) return error(res, 'Invalid file id', null, 400);

    const file = await filesService.updateExternalLink(id, req.body, req.user);
    return success(res, 'External link updated successfully', file);
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/files ─────────────────────────────────────────────────────────
async function list(req, res, next) {
  try {
    const { page, pageSize, attachment_type } = req.query;
    const result = await filesService.listFiles({ page, pageSize, attachment_type });
    return success(res, 'Files fetched successfully', result);
  } catch (err) {
    next(err);
  }
}

// ── GET /api/v1/files/:id ─────────────────────────────────────────────────────
async function getOne(req, res, next) {
  try {
    const file = await filesService.getFile(parseInt(req.params.id), req.user);
    return success(res, 'File fetched successfully', file);
  } catch (err) {
    next(err);
  }
}

// ── DELETE /api/v1/files/:id ──────────────────────────────────────────────────
async function remove(req, res, next) {
  try {
    await filesService.deleteFile(parseInt(req.params.id), req.user);
    return success(res, 'Attachment deleted successfully', null);
  } catch (err) {
    next(err);
  }
}

module.exports = { upload, registerLink, updateLink, list, getOne, remove };
