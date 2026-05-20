# Files — Design

## Tables

- `files` — primary (see [`../../01-database/design.md`](../../01-database/design.md#1012-files))
- `audit_logs` — write on upload + delete

## Endpoints

Base: `/api/v1/files`

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/upload` | Logged-in | Upload a file |
| GET | `/` | CENTRAL_ADMIN | List uploaded files |
| GET | `/:id` | CENTRAL_ADMIN | File metadata |
| DELETE | `/:id` | Owner OR CENTRAL_ADMIN | Delete file + asset |

### POST /upload

Request: multipart/form-data, field `file`, optional `usage` (one of: `notices`, `downloads`, `gallery`, `faculty`, `events`, `departments`, `exam`, `placement`). `usage` selects:
- which MIME types are allowed
- which size limit applies
- whether LOCAL or CLOUDINARY is used

Response (201):
```json
{ "ok": true, "data": {
  "id": 42,
  "file_url": "https://res.cloudinary.com/.../image.jpg",
  "file_type": "image/jpeg",
  "file_size": 184320,
  "storage_type": "CLOUDINARY"
}}
```

### DELETE /:id

1. Load row. If not found → 404.
2. If `req.user.id !== row.uploaded_by` AND `req.user.role !== 'CENTRAL_ADMIN'` → 403.
3. Run reference check across all modules that have FK to `files.id`. If any reference exists → 409 with message listing which module/record.
4. Delete the underlying asset (disk unlink OR `cloudinary.uploader.destroy`).
5. Delete the DB row.
6. Audit log.
7. Return 204.

## Multer configuration (`upload.middleware.js`)

```
fields:    file (single)
limits:    fileSize: dynamic based on `usage` (2/10/25 MB)
fileFilter: validates MIME against allowed list per usage
storage:   memoryStorage  (so we can stream to Cloudinary or write to disk)
```

The middleware sets `req.file`; the service does the actual storage write so it can branch on Cloudinary vs local.

## Cloudinary routing rules

- Gallery, faculty, events cover, departments image → `cloudinary.uploader.upload` with `resource_type: 'image'`.
- All PDF/DOC/ZIP and unrouted images → choice based on env: `STORAGE_DEFAULT_NON_IMAGE = LOCAL | CLOUDINARY_RAW` (default LOCAL for v1).
- Local files saved under `backend/uploads/<yyyy>/<mm>/<uuid>.<ext>`; URL is `${API_BASE}/uploads/<yyyy>/<mm>/<uuid>.<ext>`.
- Express serves `/uploads/*` as static (read-only) for local files.

## Service responsibilities (`files.service.js`)

- `uploadFile(reqFile, uploadedBy, usage)` → validates again, stores, inserts row, audit logs, returns row.
- `listFiles(opts)` → paginated list for admin.
- `deleteFile(id, currentUser)` → ownership check, reference check, asset cleanup, row delete, audit log.
- `isReferenced(id)` → SELECT EXISTS across the FK-bearing tables.

## Reference check

The following tables reference `files.id` — check all in one transaction-friendly batch:

```
notices.file_id
downloads.file_id
exam_documents.file_id
placement_records.file_id
events.cover_image_file_id
gallery.file_id
departments.image_file_id
faculty_profiles.profile_image_file_id
```

(Internal helper lives in `files.service.js`. Don't duplicate this list elsewhere.)

## Audit log entries

| Action | description |
| --- | --- |
| CREATE | `Uploaded file "<original_name>" (id=<id>, type=<file_type>, size=<bytes>)` |
| DELETE | `Deleted file id=<id> ("<original_name>")` |

## Edge cases

- **Cloudinary fails mid-upload** → no DB row written; return 502.
- **Disk write fails mid-upload** → same.
- **Asset delete fails but row delete succeeds** → log warning; the row delete still happens to prevent orphan refs. Add to manual cleanup task.
- **Concurrent delete and reference creation** → reference check happens BEFORE asset/row delete; any post-check race is acceptable in v1 (CENTRAL_ADMIN can fix manually).

## Security

- File extension is verified against MIME type. No trust in client-supplied extension alone.
- Original filename is sanitized before being stored (alphanumeric + dot + dash; everything else stripped).
- Local files are served by Express static — disable directory listing. Confirm no path traversal via the static middleware config.
