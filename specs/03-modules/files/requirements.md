# Files — Requirements

## Purpose

Single chokepoint for all file uploads in the system. Every other module references files by `file_id`; no module stores raw paths or URLs.

## Actors

| Role | Can do |
| --- | --- |
| Any logged-in staff | Upload a file, delete own uploaded file |
| CENTRAL_ADMIN | List all files, delete any file |
| Public visitor | Indirectly: opens a URL stored in `files.file_url` from a related record |

## Data this feature handles

- Original filename
- MIME type, size in bytes
- Storage location (LOCAL disk or CLOUDINARY)
- Stored name (disk filename or Cloudinary public ID)
- Public URL
- Uploader user id

## File type and size rules

| Usage | Allowed types | Storage |
| --- | --- | --- |
| Notices attachments | PDF, DOC, DOCX, JPG, PNG, WEBP | LOCAL or Cloudinary raw |
| Downloads | PDF, DOC, DOCX, ZIP | LOCAL or Cloudinary raw |
| Gallery | JPG, JPEG, PNG, WEBP | CLOUDINARY (image transforms) |
| Faculty profile image | JPG, JPEG, PNG, WEBP | CLOUDINARY |
| Event cover | JPG, JPEG, PNG, WEBP | CLOUDINARY |
| Department image | JPG, JPEG, PNG, WEBP | CLOUDINARY |
| Exam documents | PDF (recommended) | LOCAL or Cloudinary raw |

| File type | Max size |
| --- | --- |
| Images | 2 MB |
| PDFs | 10 MB |
| Documents (DOC/DOCX) | 10 MB |
| ZIP | 25 MB |

## Acceptance criteria

- [ ] `POST /api/v1/files/upload` accepts multipart/form-data with field `file`; returns `{file_id, file_url, file_type, file_size, storage_type}`.
- [ ] Wrong MIME → 400, payload not stored.
- [ ] Oversized file → 400 BEFORE the file is written to disk (multer limit).
- [ ] An unauthenticated request → 401.
- [ ] `GET /api/v1/files` (admin) lists files paginated, newest first.
- [ ] `DELETE /api/v1/files/:id` deletes the storage asset AND the row. Owner OR CENTRAL_ADMIN. Others → 403.
- [ ] Deleting a file that is still referenced (`SELECT 1 FROM notices WHERE file_id = ?` etc.) returns 409.
- [ ] Audit log entry on every upload and delete.

## Out of scope

- Orphan-file cleanup cron (file with no referencing module record) — defer to v2
- Resumable/multipart big uploads
- Per-folder organization
- Inline image editing (rotate, crop)
