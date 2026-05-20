# Files — Tasks

## Backend

- [ ] Install: `multer`, `cloudinary`, `uuid`
- [ ] `config/cloudinary.js`: init SDK from env
- [ ] `middlewares/upload.middleware.js`: factory `uploadFor(usage)` returning multer instance with size + MIME limits
- [ ] `modules/files/files.service.js`:
  - [ ] `uploadFile(reqFile, uploadedBy, usage)` — branches LOCAL vs CLOUDINARY
  - [ ] `listFiles({ page, pageSize, q })`
  - [ ] `getFile(id)`
  - [ ] `deleteFile(id, currentUser)` — ownership + reference checks + asset cleanup
  - [ ] private `isReferenced(id)` — SELECT EXISTS across 8 tables
- [ ] `modules/files/files.controller.js`
- [ ] `modules/files/files.routes.js`:
  - [ ] POST /upload with `auth + uploadFor(req.body.usage)` middleware
  - [ ] GET / with `auth + allow('CENTRAL_ADMIN')`
  - [ ] GET /:id with `auth + allow('CENTRAL_ADMIN')`
  - [ ] DELETE /:id with `auth` (service checks ownership)
- [ ] `app.js`: `app.use('/uploads', express.static(UPLOAD_DIR, { dotfiles: 'deny' }))` BEFORE routes
- [ ] Mount router at `/api/v1/files`
- [ ] Tests:
  - [ ] Happy path image upload → returns id + url
  - [ ] Wrong MIME → 400
  - [ ] Oversized → 400
  - [ ] No token → 401
  - [ ] Delete owner → 204
  - [ ] Delete by other user (non-admin) → 403
  - [ ] Delete referenced file → 409
  - [ ] audit_logs has CREATE row after upload

## Frontend

- [ ] `api/fileApi.js`: `uploadFile(file, usage)` posting FormData, returns `{id, file_url, ...}`
- [ ] `components/common/FileUploader.jsx`:
  - [ ] Props: `usage` (string), `onUploaded(fileMeta)`, `accept` (auto from usage), `maxMB` (auto)
  - [ ] Shows progress bar, validation errors, success state
  - [ ] Returns file_id to parent form
- [ ] Use this component in every dashboard form that takes a file — no bespoke uploaders.

## Verification

- [ ] Upload one of each: PDF, DOCX, JPG, PNG, ZIP
- [ ] Verify size limits reject 3 MB image, 11 MB PDF, 26 MB ZIP
- [ ] Upload gallery image and confirm it lands in Cloudinary (check dashboard)
- [ ] Delete an unreferenced file → asset gone
- [ ] Attach a file to a notice, then try to delete the file → 409
