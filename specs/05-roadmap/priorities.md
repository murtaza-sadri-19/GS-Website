# Build Priority

When time is short, this is the order to cut from.

## v1 ship list (minimum to deploy)

### Backend
- Auth
- Users
- Departments
- Faculty
- Notices
- Downloads
- Files
- Audit logs

### Public side
- Home
- About
- Departments
- Department Detail
- Faculty Profile
- Notices
- Downloads
- Contact

### Dashboard side
- Login
- CENTRAL_ADMIN dashboard
- Manage Users
- Manage Departments
- Manage Notices
- Manage Downloads
- HOD dashboard
- Department Profile
- Manage Teachers

## v1.1 — after v1 is stable

- Exam module (backend + EXAM_CONTROLLER dashboard + public examination page)
- Placement module (backend + PLACEMENT_OFFICER dashboard + public training-placement page)
- Events module + Events public pages
- Gallery module + public Gallery page
- Pages editor (CENTRAL_ADMIN)

## Priority by feature

From doc section 19:

| Priority | Feature |
| --- | --- |
| High | Auth and role-based dashboards |
| High | Public pages and department pages |
| High | User and department management |
| High | Notices and downloads |
| High | File upload |
| Medium | Faculty profile management |
| Medium | Exam module |
| Medium | Placement module |
| Medium | Events and gallery |
| Low initially | Advanced page editor (rich text, drafts) |
| Low initially | Analytics / dashboard charts |

## Deferred to v1.1 — has design-doc HOD entries but no schema in v1

The design doc (section 2.5) lists these as HOD responsibilities, but section 10 doesn't define tables for them. To keep v1 scope tight, we defer both:

- **Labs** — `/hod/labs` page and underlying `labs` table. Will need: id, department_id (FK), name, description, image_file_id (FK), status, timestamps.
- **Achievements** — `/hod/achievements` page and `achievements` table. Will need: id, department_id (FK), category (student/faculty/department), title, description, achiever_name, achieved_on, file_id (FK, optional), status, timestamps.

When v1 ships and v1.1 starts, write specs under `03-modules/labs/` and `03-modules/achievements/` using the `spec-author` agent and add tables to `01-database/design.md`.

## What to skip (or defer to v2)

- Email/SMS notifications
- Password reset flow (admin re-creates user for v1)
- Bulk import
- Per-user permission overrides
- Public RSS feeds
- Multi-language
- Dark mode
- A/B testing or feature flags
- Real-time collaboration
- Granular publish workflows (review/approve/schedule)
