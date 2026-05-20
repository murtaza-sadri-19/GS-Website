# Notices — Tasks

Blocked by: `files/`, `users/`, `departments/`, auth.

## Backend

- [ ] `utils/slug.js`: `slugify(text)`, `ensureUnique(slug, table, column)`
- [ ] `modules/notices/notices.validators.js`: create + update schemas
- [ ] `modules/notices/notices.service.js`:
  - [ ] `listPublicNotices(filters)`
  - [ ] `getPublicNoticeBySlug(slug)`
  - [ ] `listDashboardNotices(currentUser, filters)` — applies role-scope
  - [ ] `createNotice(dto, currentUser)` — role/type matrix enforced
  - [ ] `updateNotice(id, dto, currentUser)` — ownership + no type change
  - [ ] `archiveNotice(id, currentUser)`
- [ ] `modules/notices/notices.controller.js`
- [ ] `modules/notices/notices.routes.js`:
  - [ ] GET / and GET /:slug — public, no auth
  - [ ] POST/PUT/DELETE — `auth + allow('CENTRAL_ADMIN','HOD','EXAM_CONTROLLER','PLACEMENT_OFFICER')` — service does fine-grained ownership
- [ ] Mount at `/api/v1/notices`
- [ ] Tests:
  - [ ] Public list excludes DRAFT, ARCHIVED, future-dated
  - [ ] HOD creating GENERAL → 403
  - [ ] HOD editing other dept's notice → 403
  - [ ] EXAM_CONTROLLER creating EXAM with department_id set → 400 (or silently nulled — pick one and test)
  - [ ] Slug collision → suffixed
  - [ ] Archive sets status, doesn't hard delete
  - [ ] audit_logs entries on each CUD

## Frontend

- [ ] `api/noticeApi.js`: `listPublic`, `getPublic`, `listDashboard`, `create`, `update`, `archive`
- [ ] Public pages:
  - [ ] `pages/public/Notices.jsx` — filterable list
  - [ ] `pages/public/NoticeDetail.jsx`
- [ ] Dashboard pages:
  - [ ] `pages/dashboard/centralAdmin/Notices.jsx` — full management
  - [ ] `pages/dashboard/hod/Notices.jsx` — scoped to own dept, type forced to DEPARTMENT
  - [ ] `pages/dashboard/examController/Notices.jsx` — type forced to EXAM
  - [ ] `pages/dashboard/placementOfficer/Notices.jsx` — type forced to PLACEMENT
- [ ] Reuse `<FileUploader usage="notices">` for the attachment field
- [ ] Status badge component reflects DRAFT/PUBLISHED/ARCHIVED

## Verification

- [ ] As HOD of dept 1, create a notice — appears on public site under dept 1
- [ ] As HOD of dept 1, try to GET edit URL of a dept-2 notice → 403
- [ ] Set publish_date to tomorrow → not visible publicly today
- [ ] Archive a notice → disappears from public list
- [ ] Public detail URL uses slug not id
