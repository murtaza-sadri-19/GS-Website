# Dashboards

All dashboard routes require auth. `RoleBasedRoutes` mounts only the tree matching the logged-in user's role.

## CENTRAL_ADMIN — `/admin/...`

| Page | Route |
| --- | --- |
| Dashboard | `/admin/dashboard` |
| Manage Users | `/admin/users` |
| Manage Departments | `/admin/departments` |
| Manage Notices | `/admin/notices` |
| Manage Events | `/admin/events` |
| Manage Gallery | `/admin/gallery` |
| Manage Pages | `/admin/pages` |
| Manage Downloads | `/admin/downloads` |
| Audit Logs | `/admin/audit-logs` |

## EXAM_CONTROLLER — `/exam/...`

| Page | Route |
| --- | --- |
| Dashboard | `/exam/dashboard` |
| Exam Notices | `/exam/notices` |
| Exam Timetables | `/exam/timetables` |
| Results | `/exam/results` |
| Academic Calendar | `/exam/academic-calendar` |

## PLACEMENT_OFFICER — `/placement/...`

| Page | Route |
| --- | --- |
| Dashboard | `/placement/dashboard` |
| Placement Notices | `/placement/notices` |
| Company Visits | `/placement/company-visits` |
| Placement Records | `/placement/records` |
| Training Programs | `/placement/training-programs` |

## HOD — `/hod/...`

| Page | Route |
| --- | --- |
| Dashboard | `/hod/dashboard` |
| Department Profile | `/hod/department-profile` |
| Manage Teachers | `/hod/teachers` |
| Department Notices | `/hod/notices` |
| Department Downloads | `/hod/downloads` |
| Department Events | `/hod/events` |
| Department Gallery | `/hod/gallery` |
| ~~Labs~~ | ~~`/hod/labs`~~ — **deferred to v1.1** (no `labs` table in v1 schema) |
| ~~Achievements~~ | ~~`/hod/achievements`~~ — **deferred to v1.1** (no `achievements` table in v1 schema) |

> **Labs and Achievements are deferred to v1.1.** Doc section 2.5 lists them as HOD responsibilities, but the schema in doc section 10 doesn't define tables for them. See [`../05-roadmap/priorities.md`](../05-roadmap/priorities.md#deferred-to-v11) for the v1.1 plan. Don't surface these nav entries in the HOD sidebar in v1.

## TEACHER — `/teacher/...`

| Page | Route | Edits which `faculty_profiles` columns |
| --- | --- | --- |
| Dashboard | `/teacher/dashboard` | (read-only summary) |
| My Profile | `/teacher/profile` | designation, bio, experience, specialization, profile_image_file_id |
| Publications | `/teacher/publications` | publications |
| Research Work | `/teacher/research` | research_work |
| Subjects | `/teacher/subjects` | subjects |
| Qualifications | `/teacher/qualifications` | qualification |

All six pages operate on the same `faculty_profiles` row (the one with `user_id = req.user.id`). They're separate UI surfaces over partial updates of the same record — each sub-page submits only its own fields via PUT `/faculty/:id`. This matches doc section 8.5.

## Layout

`<DashboardLayout>`:
- Left sidebar with role-filtered nav (only shows allowed pages for current role)
- Top bar: user name, role, logout
- Body: `<Outlet />`

## Shared patterns

Every list page has the same skeleton (DataTable + Toolbar with search/filter/create button). Every create/edit page is `<FormShell>`. Every destructive action is `<ConfirmDialog>`. Every file field is `<FileUploader usage="...">`.

Build the shared components first (Phase 3, before role dashboards in Phase 6).

## Role-based hiding (UX only)

Hide nav items the role can't use. Hide create/edit/delete buttons in lists the role can't act on. **The backend still enforces everything** — hiding is just UX.

Use `useRole().hasRole('CENTRAL_ADMIN', 'HOD')` instead of comparing role strings inline.
