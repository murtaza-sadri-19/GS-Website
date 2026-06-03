/**
 * Files Service — Universal Attachment Registry
 *
 * Supports two attachment types:
 *   FILE          → binary upload stored on local disk under uploads/{usage}/
 *   EXTERNAL_LINK → URL-only reference, no binary stored here
 *
 * Both types are registered in the `files` table and return a file_id
 * that dependent modules (notices, downloads, events, …) reference via FK.
 *
 * Storage: dynamic local folders — uploads/{usage}/{uniqueFilename}
 * Folders are created automatically; no hardcoded folder list required.
 */

const fs         = require('fs');
const path       = require('path');
const pool       = require('../../config/db');
const writeAudit = require('../../utils/audit');
const env        = require('../../config/env');
const { assertExternalUrl, guessMimeFromUrl } = require('../../utils/urlValidator');
const { indexPDF } = require('../search/search.service');
const { httpError } = require('../../utils/errors');
const { parsePagination } = require('../../utils/pagination');

const UPLOADS_DIR = path.join(__dirname, '../../../uploads');

// ── Usage-based validation config ─────────────────────────────────────────────

const IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const DOC_MIMES   = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const USAGE_CONFIG = {
  gallery:      { mimes: IMAGE_MIMES,                      maxMB: 2  },
  faculty:      { mimes: IMAGE_MIMES,                      maxMB: 2  },
  events:       { mimes: IMAGE_MIMES,                      maxMB: 2  },
  departments:  { mimes: IMAGE_MIMES,                      maxMB: 2  },
  pages:        { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  settings:     { mimes: IMAGE_MIMES,                      maxMB: 5  },
  users:        { mimes: IMAGE_MIMES,                      maxMB: 2  },
  notices:      { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  exam:         { mimes: ['application/pdf'],               maxMB: 10 },
  placement:    { mimes: DOC_MIMES,                        maxMB: 10 },
  downloads:    { mimes: [...DOC_MIMES, 'application/zip', 'application/x-zip-compressed'], maxMB: 25 },
  tenders:      { mimes: [...DOC_MIMES],                   maxMB: 10 },
  admission:    { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  homepage:     { mimes: IMAGE_MIMES,                      maxMB: 5  },
  labs:         { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  achievements: { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  research:     { mimes: DOC_MIMES,                        maxMB: 25 },
  cms:          { mimes: [...IMAGE_MIMES, ...DOC_MIMES],   maxMB: 10 },
  chatbot:      { mimes: [...DOC_MIMES],                   maxMB: 25 },
};

const DEFAULT_USAGE_CONFIG = USAGE_CONFIG.notices;

const VALID_USAGES = Object.keys(USAGE_CONFIG);

// Tables that hold FK references to files.id — used for safe-delete check
const FILE_REFERENCE_CHECKS = [
  { table: 'notices',           col: 'file_id'                 },
  { table: 'downloads',         col: 'file_id'                 },
  { table: 'exam_documents',    col: 'file_id'                 },
  { table: 'placement_records', col: 'file_id'                 },
  { table: 'events',            col: 'cover_image_file_id'     },
  { table: 'gallery',           col: 'file_id'                 },
  { table: 'gallery_albums',    col: 'cover_file_id'           },
  { table: 'departments',       col: 'image_file_id'           },
  { table: 'faculty_profiles',  col: 'profile_image_file_id'   },
  { table: 'tenders',           col: 'file_id'                 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Upload a file buffer to a dynamic local folder based on usage.
 * Creates uploads/{usage}/ directory automatically if it doesn't exist.
 * Returns { storedPath, fileUrl } where storedPath is relative to UPLOADS_DIR.
 */
async function uploadToLocalFolder(buffer, sanitizedName, usage) {
  const folderPath = path.join(UPLOADS_DIR, usage);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const ext      = path.extname(sanitizedName);
  const base     = path.basename(sanitizedName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  const stored   = `${base}_${Date.now()}${ext}`;
  const destPath = path.join(folderPath, stored);

  fs.writeFileSync(destPath, buffer);

  return {
    storedPath: `${usage}/${stored}`,
    fileUrl: `${env.appUrl}/uploads/${usage}/${stored}`,
  };
}

/**
 * Fetch a file record (joined with uploader name).
 */
async function fetchFile(id) {
  const [rows] = await pool.execute(
    `SELECT
       f.id,
       COALESCE(f.attachment_type, 'FILE') AS attachment_type,
       f.usage,
       f.original_name,
       f.stored_name,
       f.file_url,
       f.external_url,
       f.thumbnail_url,
       f.alt_text,
       f.meta_title,
       f.meta_description,
       f.file_type,
       f.file_size,
       f.storage_type,
       f.uploaded_by,
       f.created_at,
       u.name AS uploader_name
     FROM files f
     INNER JOIN users u ON f.uploaded_by = u.id
     WHERE f.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function isReferenced(fileId) {
  const refs = await Promise.all(
    FILE_REFERENCE_CHECKS.map(async ({ table, col }) => {
      try {
        const [rows] = await pool.execute(
          `SELECT 1 FROM ${table} WHERE ${col} = ? LIMIT 1`,
          [fileId]
        );
        return rows[0] ? table : null;
      } catch {
        // Table may not exist yet during migration
        return null;
      }
    })
  );
  return refs.filter(Boolean);
}

// ── Service: Upload real file ─────────────────────────────────────────────────

/**
 * Accepts a multer-processed file, validates it, stores it locally under
 * uploads/{usage}/, inserts a row in `files`, and returns the record.
 */
async function uploadFile(reqFile, uploadedBy, usage = 'notices') {
  if (!reqFile) throw httpError('No file provided', 400);

  const { originalname, mimetype, size, buffer } = reqFile;
  const config = USAGE_CONFIG[usage] || DEFAULT_USAGE_CONFIG;

  if (!config.mimes.includes(mimetype)) {
    throw httpError(
      `File type "${mimetype}" is not allowed for usage "${usage}". Allowed: ${config.mimes.join(', ')}`,
      400
    );
  }

  const maxBytes = config.maxMB * 1024 * 1024;
  if (size > maxBytes) {
    throw httpError(
      `File size ${(size / 1024 / 1024).toFixed(2)} MB exceeds the ${config.maxMB} MB limit for usage "${usage}"`,
      400
    );
  }

  const sanitizedName = sanitizeFilename(originalname);
  const { storedPath, fileUrl } = await uploadToLocalFolder(buffer, sanitizedName, usage);

  const [result] = await pool.execute(
    `INSERT INTO files
       (attachment_type, \`usage\`, original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by)
     VALUES ('FILE', ?, ?, ?, ?, ?, ?, 'LOCAL', ?)`,
    [usage, sanitizedName, storedPath, fileUrl, mimetype, size, uploadedBy]
  );

  const newId = result.insertId;

  await writeAudit({
    userId:      uploadedBy,
    action:      'CREATE',
    module:      'files',
    recordId:    newId,
    description: `Uploaded file "${sanitizedName}" (id=${newId}, type=${mimetype}, size=${size}, path=${storedPath})`,
  });

  // Fire-and-forget PDF text extraction — non-blocking, never throws
  if (mimetype === 'application/pdf') {
    const physicalPath = path.join(UPLOADS_DIR, storedPath);
    setImmediate(() => indexPDF('file', newId, newId, sanitizedName, physicalPath, fileUrl));
  }

  return await fetchFile(newId);
}

// ── Service: Register external link ──────────────────────────────────────────

/**
 * Registers an external URL as an attachment record in `files`.
 * No binary data is stored — the URL itself is the attachment.
 */
async function registerExternalLink(dto, uploadedBy) {
  const {
    external_url,
    original_name,
    alt_text,
    thumbnail_url,
    meta_title,
    meta_description,
    usage = 'external',
  } = dto;

  if (!external_url || typeof external_url !== 'string' || !external_url.trim()) {
    throw httpError('external_url is required', 400);
  }

  assertExternalUrl(external_url.trim());

  if (thumbnail_url && thumbnail_url.trim()) {
    assertExternalUrl(thumbnail_url.trim());
  }

  let displayName = (original_name || '').trim();
  if (!displayName) {
    try {
      const urlObj   = new URL(external_url.trim());
      const pathTail = urlObj.pathname.split('/').filter(Boolean).pop() || '';
      displayName = pathTail || urlObj.hostname;
    } catch {
      displayName = 'external-link';
    }
  }

  const guessedMime = guessMimeFromUrl(external_url.trim());

  const [result] = await pool.execute(
    `INSERT INTO files
       (attachment_type, original_name, stored_name, file_url, external_url,
        thumbnail_url, alt_text, meta_title, meta_description,
        file_type, file_size, storage_type, uploaded_by)
     VALUES ('EXTERNAL_LINK', ?, NULL, ?, ?, ?, ?, ?, ?, ?, NULL, 'EXTERNAL', ?)`,
    [
      displayName,
      external_url.trim(),
      external_url.trim(),
      thumbnail_url ? thumbnail_url.trim() : null,
      alt_text      ? alt_text.trim()      : null,
      meta_title    ? meta_title.trim()    : null,
      meta_description ? meta_description.trim() : null,
      guessedMime   || null,
      uploadedBy,
    ]
  );

  const newId = result.insertId;

  await writeAudit({
    userId:      uploadedBy,
    action:      'CREATE',
    module:      'files',
    recordId:    newId,
    description: `Registered external link "${displayName}" (id=${newId}, url=${external_url.trim()}, usage=${usage})`,
  });

  return await fetchFile(newId);
}

// ── Service: List ─────────────────────────────────────────────────────────────

async function listFiles({ page = 1, pageSize = 20, attachment_type, usage, q } = {}) {
  const { page: p, pageSize: ps, offset } = parsePagination({ page, pageSize });
  page = p; pageSize = ps;
  const conditions = [];
  const params     = [];

  if (attachment_type && ['FILE', 'EXTERNAL_LINK'].includes(attachment_type)) {
    conditions.push('COALESCE(f.attachment_type, \'FILE\') = ?');
    params.push(attachment_type);
  }
  if (usage && typeof usage === 'string') {
    conditions.push('f.usage = ?');
    params.push(usage);
  }
  if (q && typeof q === 'string' && q.trim()) {
    conditions.push('(f.original_name LIKE ? OR f.alt_text LIKE ? OR f.meta_title LIKE ?)');
    const like = `%${q.trim()}%`;
    params.push(like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [[rows], [countRows]] = await Promise.all([
    pool.execute(
      `SELECT
         f.id,
         COALESCE(f.attachment_type, 'FILE') AS attachment_type,
         f.usage,
         f.original_name, f.stored_name, f.file_url, f.external_url,
         f.thumbnail_url, f.alt_text, f.meta_title, f.meta_description,
         f.file_type, f.file_size, f.storage_type, f.uploaded_by, f.created_at,
         u.name AS uploader_name
       FROM files f
       INNER JOIN users u ON f.uploaded_by = u.id
       ${where}
       ORDER BY f.created_at DESC
       LIMIT ${pageSize} OFFSET ${offset}`,
      params
    ),
    pool.execute(`SELECT COUNT(*) AS total FROM files f ${where}`, params),
  ]);

  const total = countRows[0].total;
  return {
    files: rows,
    pagination: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
  };
}

// ── Service: Get one ──────────────────────────────────────────────────────────

async function getFile(id, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('File not found', 404);
  return file;
}

// ── Service: Delete ───────────────────────────────────────────────────────────

async function deleteFile(id, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('File not found', 404);

  if (Number(file.uploaded_by) !== Number(currentUser.id) && currentUser.role !== 'CENTRAL_ADMIN') {
    throw httpError('You do not have permission to delete this file', 403);
  }

  const refs = await isReferenced(id);
  if (refs.length > 0) {
    throw httpError(`File is still referenced by: ${refs.join(', ')}`, 409);
  }

  if (file.attachment_type === 'FILE' && file.stored_name) {
    try {
      const localPath = path.join(UPLOADS_DIR, file.stored_name);
      if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
    } catch (err) {
      console.warn(`Local file delete failed for file id=${id} (${file.stored_name}):`, err.message);
    }
  }

  await pool.execute('DELETE FROM files WHERE id = ?', [id]);

  await writeAudit({
    userId:      currentUser.id,
    action:      'DELETE',
    module:      'files',
    recordId:    id,
    description: `Deleted ${file.attachment_type === 'EXTERNAL_LINK' ? 'external link' : 'file'} id=${id} ("${file.original_name}")`,
  });
}

// ── Service: Update external link metadata ────────────────────────────────────

async function updateExternalLink(id, dto, currentUser) {
  const file = await fetchFile(id);
  if (!file) throw httpError('Attachment not found', 404);
  if (file.attachment_type !== 'EXTERNAL_LINK') {
    throw httpError('Only EXTERNAL_LINK attachments can be updated via this endpoint', 400);
  }
  if (Number(file.uploaded_by) !== Number(currentUser.id) && currentUser.role !== 'CENTRAL_ADMIN') {
    throw httpError('You do not have permission to update this attachment', 403);
  }

  const fields = [];
  const params = [];

  if (dto.external_url !== undefined && dto.external_url !== null) {
    assertExternalUrl(dto.external_url.trim());
    fields.push('external_url = ?', 'file_url = ?');
    params.push(dto.external_url.trim(), dto.external_url.trim());
  }
  if (dto.original_name !== undefined) { fields.push('original_name = ?');    params.push(dto.original_name?.trim() || file.original_name); }
  if (dto.alt_text      !== undefined) { fields.push('alt_text = ?');          params.push(dto.alt_text?.trim()      || null); }
  if (dto.thumbnail_url !== undefined) {
    if (dto.thumbnail_url) assertExternalUrl(dto.thumbnail_url.trim());
    fields.push('thumbnail_url = ?');
    params.push(dto.thumbnail_url?.trim() || null);
  }
  if (dto.meta_title       !== undefined) { fields.push('meta_title = ?');       params.push(dto.meta_title?.trim()       || null); }
  if (dto.meta_description !== undefined) { fields.push('meta_description = ?'); params.push(dto.meta_description?.trim() || null); }

  if (fields.length === 0) return file;

  params.push(id);
  await pool.execute(`UPDATE files SET ${fields.join(', ')} WHERE id = ?`, params);

  await writeAudit({
    userId:      currentUser.id,
    action:      'UPDATE',
    module:      'files',
    recordId:    id,
    description: `Updated external link id=${id} (fields: ${fields.map(f => f.split(' ')[0]).join(', ')})`,
  });

  return await fetchFile(id);
}

/**
 * Upload multiple files (up to 20) in one request.
 * Each file is processed independently — failures are collected and returned,
 * successful uploads are returned alongside them.
 * Body: multipart/form-data with field name "files[]" or "files" and optional "usage".
 */
async function uploadMultipleFiles(reqFiles, uploadedBy, usage = 'notices') {
  if (!reqFiles || reqFiles.length === 0) throw httpError('No files provided', 400);

  const results = await Promise.allSettled(
    reqFiles.map(file => uploadFile(file, uploadedBy, usage))
  );

  const succeeded = [];
  const failed    = [];

  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      succeeded.push(r.value);
    } else {
      failed.push({
        index:   i,
        name:    reqFiles[i]?.originalname || `file_${i}`,
        error:   r.reason?.message || 'Upload failed',
      });
    }
  });

  return { succeeded, failed, total: reqFiles.length };
}

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  registerExternalLink,
  updateExternalLink,
  listFiles,
  getFile,
  deleteFile,
  VALID_USAGES,
};
