# SGSITS Portal — Roles, Permissions & Feature Matrix

> Single source of truth for what each role can see and do across the unified
> SGSITS web platform. Derived from:
>
> 1. **Legacy public site** (`public_html/`) — Joomla 4 CMS that powers the
>    current `sgsits.ac.in` (public content, no academic workflow).
> 2. **Legacy exam-office app** (`exam-office-website/`) — independent
>    React + Node/Express + MySQL/Knex app that powers Admin / HOD / Faculty
>    marks workflow.
> 3. **Current rebuild** (`sgsits-frontend/`, this repo) — the unified React
>    site that absorbs both: Joomla content parity + admin CMS + portals
>    for Faculty / HOD / Exam Department / Admin.
>
> Parity rule: the public-facing layout, colours (`#fff`, `#0b2545`,
> `#bfa15f`), fonts and section ordering must mirror the existing
> `sgsits.ac.in`. The portals are additive — the public site is **not**
> redesigned.

---

## 1 · Role catalogue

The Login page (`src/pages/Login.tsx`) exposes **five** login surfaces.
The first is an external redirect; the other four resolve to in-app portals.

| Role tab            | Auth endpoint (planned)              | Lands on                | Source of truth          |
| ------------------- | ------------------------------------ | ----------------------- | ------------------------ |
| **Student**         | _External_ — `erp.sgsits.ac.in`      | ERP portal (new tab)    | ERP system (out of scope)|
| **Faculty**         | `POST /api/auth/faculty/login`       | `/faculty/dashboard`    | `faculty` table          |
| **HOD**             | `POST /api/auth/hod/login`           | `/hod/dashboard` †      | `hod` table              |
| **Admin** (CMS)     | `POST /api/auth/admin/login`         | `/admin/dashboard`      | `admin` table (CMS)      |
| **Exam Dept.**      | `POST /api/auth/exam/login`          | `/exam/dashboard` †     | `admin` table (Exam role)|

† HOD and Exam Dept layouts (`HodLayout.tsx`, `PortalLayout`-based exam pages)
exist in source but their parent routes have not yet been wired in
`src/routes/routes.tsx` — they currently fall through to `/faculty/dashboard`
on login. See **§ 6 — Backlog**.

Two further visitor classes that don't sign in:

| Role            | Notes                                                          |
| --------------- | -------------------------------------------------------------- |
| **Anonymous**   | All public pages — about, academics, departments, news, etc. |
| **Prospective student** | Same as Anonymous + visible "Admissions" funnel.        |

---

## 2 · Permission matrix (capability-level)

`R` = read · `W` = create/edit · `D` = delete · `A` = approve/reject  
`—` = no access · `(own)` = scoped to own records · `(branch)` = scoped to own branch

### 2.1 Public content (CMS-managed)

| Capability                              | Anon | Student | Faculty | HOD     | Exam | Admin |
| --------------------------------------- | :--: | :-----: | :-----: | :-----: | :--: | :---: |
| Browse public pages (About / Acad / …)  |  R   |   R     |   R     |   R     |  R   |   R   |
| View News / Events / Tenders / Notices  |  R   |   R     |   R     |   R     |  R   |   R   |
| View Photo Gallery / Video Tour         |  R   |   R     |   R     |   R     |  R   |   R   |
| View Faculty directory & profiles       |  R   |   R     |   R     |   R     |  R   |   R   |
| Manage Notices (CRUD)                   |  —   |   —     |   —     |   —     |  —   |  WD   |
| Manage News articles                    |  —   |   —     |   —     |   —     |  —   |  WD   |
| Manage Events                           |  —   |   —     |   —     |   —     |  —   |  WD   |
| Manage Tenders                          |  —   |   —     |   —     |   —     |  —   |  WD   |
| Manage Marquee / Urgent Alerts          |  —   |   —     |   —     |   —     |  —   |  WD   |
| Manage Departments (description, HOD)   |  —   |   —     |   —     | W(own)  |  —   |  WD   |
| Manage Faculty directory entries        |  —   |   —     |  W(own) | W(branch)|  —  |  WD   |
| Manage Photo Gallery (albums / images)  |  —   |   —     |   —     |   —     |  —   |  WD   |
| Manage Placement record                 |  —   |   —     |   —     |   —     |  —   |  WD   |
| System Settings (theme, contacts, SMTP) |  —   |   —     |   —     |   —     |  —   |  WD   |

### 2.2 Academic / Exam workflow (`exam-office-website` parity)

| Capability                                          | Faculty   | HOD       | Exam | Admin |
| --------------------------------------------------- | :-------: | :-------: | :--: | :---: |
| **Session** — create / activate / close             |    —      |    —      | WD A |   R   |
| **Branch** — create / rename / delete               |    —      |    —      | WDA  |   R   |
| **Course** — create / specialization / sem count    |    —      |    —      | WD   |   R   |
| **Section** — define A/B/C per course               |    —      |    —      | WD   |   R   |
| **Subject upload** (CSV per session)                |    —      |    —      | W    |   R   |
| **Student upload** (CSV per session)                |    —      |    —      | W    |   R   |
| **ATKT student upload**                             |    —      |    —      | W    |   R   |
| **Elective subject data** (per branch, per sem)     |    —      |  W(branch)|  R   |   —   |
| **HOD registration request** (self-signup approval) |    —      |  A(branch)|  R   |   —   |
| **Faculty allocation** (subject ↔ faculty mapping)  |    —      |  W(branch)|  R   |   —   |
| **View department subjects + faculty load**         | R (own)   |  R(branch)|  R   |   R   |
| **Marks fill request** (generate "fill this form")  |    —      |    —      | W    |   —   |
| **Save / Submit marks** (CW, MST, Theory, Lab, Viva)| W (own)   |    R      |  R   |   —   |
| **ATKT marks feed**                                 | W (own)   |    R      |  R   |   —   |
| **Marks correction request** (post-submit edits)    | W (own)   |    R      |  A   |   —   |
| **Withdraw own correction request**                 | W (own)   |    —      |  —   |   —   |
| **Approve / Reject correction request**             |    —      |    —      |  A   |   —   |
| **Resubmit marks after approval**                   | W (own)   |    —      |  R   |   —   |
| **Result summary (branch-wise / subject-wise)**     |    —      |  R(branch)|  R   |   R   |
| **Edit own profile / change password**              |    W      |    W      |  W   |   W   |

Anonymous, Student and Prospective Student have no access to §2.2.

---

## 3 · Per-role feature spec

### 3.1 Faculty — `/faculty/*`

**Lands on:** `/faculty/dashboard` (file: `src/pages/faculty/FacultyDashboard.tsx`)

**Sidebar items (planned, from `exam-office-website` parity):**

| Page                     | Path                              | What it does                                                    |
| ------------------------ | --------------------------------- | --------------------------------------------------------------- |
| Dashboard                | `/faculty/dashboard`              | Welcome card, assigned subjects, pending marks tasks, notices.  |
| My Profile               | `/faculty/profile`                | Read/update name, email, password (`infoUpdate` API).           |
| View Subjects            | `/faculty/view-subjects`          | All subjects allocated by HOD this session (primary/secondary). |
| Marks Feed               | `/faculty/marks-feed`             | Save / Submit CW · MST · Theory · Viva · Lab marks per CO.      |
| ATKT Marks Feed          | `/faculty/atkt-marks-feed`        | Enter marks for ATKT students of the subject.                   |
| Correction Request       | `/faculty/correction-request`     | Raise → withdraw → resubmit marks for specific enrollments.     |
| Timetable                | `/faculty/timetable`              | Lecture schedule (new).                                         |
| Leave Application        | `/faculty/leave`                  | Apply / track leave (HOD approves).                             |
| Notices                  | `/faculty/notices`                | Department + institute notices.                                 |
| Research Portal          | `/faculty/research`               | Publications, projects, funding (placeholder).                  |
| Logout                   | —                                 | Clears auth via `useAdminStore.clearAuth()`.                    |

**Sign-up:** faculty self-register from `/login → Faculty → Register`. The
request lands in `faculty_registration_request` and waits for the HOD of
that branch to approve.

**Scoping rule:** every read/write is filtered by `req.user.userId` —
faculty can only see/edit subjects they were allocated by the HOD in the
current session.

### 3.2 HOD (Head of Department) — `/hod/*`

**Layout:** `src/components/layout/HodLayout.tsx` (already authored, route
parent not yet wired — see backlog).

**Sidebar items (from `HodLayout.tsx`):**

| Page                      | Path                          | What it does                                                            |
| ------------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| Dashboard                 | `/hod/dashboard`              | Branch KPIs: faculty count, pending requests, marks status.             |
| Subjects                  | `/hod/subjects`               | View all subjects of the branch for the active session.                 |
| Faculty                   | `/hod/faculty`                | Roster of branch faculty; quick view of allocations.                    |
| Students                  | `/hod/students`               | Enrolled students per course / sem / section in the branch.             |
| Timetable                 | `/hod/timetable`              | Branch timetable view (planned).                                        |
| Leave Approvals           | `/hod/leaves`                 | Approve / reject faculty leave (planned).                               |
| Marks Approval            | `/hod/marks`                  | Branch-wide submitted marks summary (read).                             |
| Correction Requests       | `/hod/corrections`            | Visibility on faculty correction requests (Exam Dept actually approves).|
| Registration Requests     | `/hod/registration`           | Approve / reject faculty self-registration in branch.                   |
| Faculty Allocation        | `/hod/faculty-allocation`     | Assign 1–2 faculties (primary + secondary) to each subject of branch.   |
| Elective Data Upload      | `/hod/elective-data`          | Upload list of students opting for each elective (per session).         |
| Department Notices        | `/hod/notices`                | Post notices visible to branch faculty & students.                      |
| Result Summary            | `/hod/results`                | CO-wise / subject-wise / course-wise summary for the branch.            |
| View Department Details   | `/hod/department-details`     | Branch landing — courses, semesters, subjects, allocated faculty.       |
| Logout                    | —                             |                                                                         |

**Scoping rule:** JWT carries `branchId`; all backend controllers
(`faculty.js`, `correctionrequest.js`, etc.) gate by
`req.user.branchId`. An HOD cannot see another branch's data.

### 3.3 Exam Department / Exam Controller — `/exam/*`

**Layout:** `PortalLayout` (generic). Pages already exist in
`src/pages/exam/`; the `/exam` route tree still needs to be added.

| Page                  | Path                          | What it does                                                                   |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------------ |
| Dashboard             | `/exam/dashboard`             | Active session, branches, courses, subject/student counts, marks request KPIs. |
| Session Management    | `/exam/session-management`    | Create / activate academic sessions (one active at a time).                    |
| Branch Management     | `/exam/branch-management`     | Add / rename / delete branches.                                                |
| Course Management     | `/exam/course-management`     | Create degree programs (B.E., M.E., Ph.D., …) with specialization & sems.      |
| Subject Upload        | `/exam/subject-upload`        | CSV upload of subjects (per session, per course, per sem).                     |
| Student Upload        | `/exam/student-upload`        | CSV upload of regular students (enrolment, sem, status).                       |
| ATKT Upload           | `/exam/atkt-upload`           | CSV upload of ATKT-eligible students for back paper.                           |
| Correction Requests   | `/exam/requests`              | Review faculty correction requests → Approve / Reject.                         |
| Marks Fill Requests   | `/exam/marks-request`         | Generate "fill marks" tasks with a due date for faculty.                       |
| Withdraw Requests     | _within Requests_             | View withdrawn / closed requests.                                              |
| Logout                | —                             |                                                                                |

**Scoping rule:** Exam Dept is **institute-wide** — no branch filter.
It is the only role that decides whether a marks correction is finally
applied. The Exam Controller does **not** create CMS content.

### 3.4 Admin (Website CMS) — `/admin/*`

**Layout:** `src/components/layout/AdminLayout.tsx`  
**Protected by:** `AdminProtectedRoute` (route file `routes.tsx:393`)

| Page                  | Path                  | What it does                                                                   |
| --------------------- | --------------------- | ------------------------------------------------------------------------------ |
| Dashboard Overview    | `/admin/dashboard`    | Live counts of notices/news/events/tenders/faculty/alerts, system health.      |
| Manage Notices        | `/admin/notices`      | CRUD notices (category, isNew, isActive, publishedAt).                         |
| Manage News           | `/admin/news`         | CRUD news articles (summary, content, tags).                                   |
| Manage Events         | `/admin/events`       | CRUD events (venue, start/end, organizer).                                     |
| Manage Tenders        | `/admin/tenders`      | CRUD tenders (refNo, department, status, last date).                           |
| Urgent Alerts         | `/admin/alerts`       | CRUD marquee/ticker items shown on home page.                                  |
| Departments           | `/admin/departments`  | CRUD departments (name, HOD, intake, contact, description).                    |
| Faculty Directory     | `/admin/faculty`      | CRUD faculty profiles surfaced on public site & department pages.              |
| Photo Gallery         | `/admin/gallery`      | CRUD albums + image upload.                                                    |
| Placement Cell        | `/admin/placement`    | CRUD year-wise placement records, top recruiters, salary bands.                |
| System Settings       | `/admin/settings`     | Site name, contact, social links, SMTP, theme tweaks.                          |

**Admin roles (sub-roles inside `admin` table):**

| Sub-role        | Difference                                                       |
| --------------- | ---------------------------------------------------------------- |
| `super_admin`   | All of the above + can create/disable other admin accounts.      |
| `editor`        | All CRUD on content (Notices / News / Events / Tenders / Gallery)|
|                 | — **cannot** access System Settings or manage other admins.      |

`roleMap` in `src/api/index.ts:38` shows the seed admins:
`admin@sgsits.ac.in`, `director@sgsits.ac.in` → `super_admin`; everyone else
defaults to `editor`.

### 3.5 Student / Anonymous (public site)

Same set of public pages as on `sgsits.ac.in`. Routing tree in
`src/routes/routes.tsx` covers:

```
/                              Home
/about/*                       Institute, Vision, Director, Governing Body,
                               Administration, Committees, Telephone Directory,
                               Infrastructure, IQAC, Academic Council, Accreditation
/academics/*                   Calendar, UG/PG/PhD/PTDC/Online Courses,
                               First Year, Exam Results, Ordinances,
                               Plagiarism Policy, Code of Conduct, OBE/NEP 2020
/departments[/:slug]           Landing + per-department detail (sidebar)
/faculty/:facultyId            Per-faculty public profile
/institute-professors[/:slug]  Institute-wide professor list & profile
/students/*                    Activities, Scholarships (Govt/Inst), SSS, NCC, NSS
/facilities/*                  Computer Center, Library, Workshop, Gymnasium,
                               Dispensary, CIDI, Sports, Hostels (Boys/Girls/
                               Transit/Staff Quarters), IDEA Lab
/placement/*                   T&P Cell, Companies, Record, Contact
/admission/*                   UG, PG, PhD, Prospectus
/explore/*                     Campus Map, Photo Gallery (+ album), Video Tour, Anthem
/startup-cell, /teqip/:sub     Startup Cell, TEQIP info
/notices /news /events /tenders Live-feed list pages
/policy/*                      Privacy, Terms, Disclaimer, Accessibility,
                               Copyright, Hyperlink, Security, Sitemap,
                               Web Info Manager, Help, Feedback
/contact                       Contact form
/login                         Unified login (5 tabs)
*                              404
```

Students who try `/login → Student` are redirected to `https://erp.sgsits.ac.in`
in a new tab — the in-house portals do **not** carry student-side features
(those live in the ERP).

---

## 4 · Data model (workflow tables — from `exam-office-website`)

These tables live in the marks-workflow DB (knex migration
`20250221211801_init_table.js`). They will be re-used as the portal
backend for this rebuild.

| Table                          | Owner                  | Key fields                                                                |
| ------------------------------ | ---------------------- | ------------------------------------------------------------------------- |
| `admin`                        | Admin / Exam Dept      | `admin_id` (PK), email, password                                          |
| `hod`                          | HOD                    | `branch_id` (PK + FK), `hod_id`, email, password                          |
| `faculty`                      | Faculty                | `faculty_id` (PK), name, email, password, `branch_id`                     |
| `faculty_registration_request` | Faculty (pre-approval) | Same shape as `faculty`, waiting for HOD approval                         |
| `branch`                       | Exam Dept              | `branch_id` (PK), branch_name                                             |
| `course`                       | Exam Dept              | composite PK (branch_id, course_id, specialization)                       |
| `section`                      | Exam Dept              | per course section letter (A/B/C…)                                        |
| `session`                      | Exam Dept              | start_month, start_year, end_month, end_year                              |
| `subject`                      | Exam Dept              | session-scoped subjects (theory / practical / elective)                   |
| `faculty_subject`              | HOD                    | maps faculty ↔ subject ↔ session (assignment_type: primary/secondary)     |
| `student`                      | Exam Dept              | session-scoped enrolments, status: regular / sem-back / year-back         |
| `elective_data`                | HOD                    | maps enrolment → chosen elective                                          |
| `atkt_students`                | Exam Dept              | back-paper eligible students per subject                                  |
| `course_outcome`               | Faculty                | per-subject CO definitions                                                |
| `test_details`                 | Faculty                | per-component / sub-component / CO max marks                              |
| `atkt_test_details`            | Faculty                | per-CO max marks for ATKT                                                 |
| `marks`                        | Faculty                | per-student CO marks; status: saved → submitted → resaved → resubmitted   |
| `atkt_marks`                   | Faculty                | same shape as `marks`, for ATKT                                           |
| `marks_update_request`         | Faculty                | correction request; Pending → Approved/Rejected by Exam Dept              |
| `marks_update_students`        | Faculty                | enrolments included in a correction request                               |
| `update_logs`                  | system                 | audit log of resubmissions                                                |
| `marks_fill_request`           | Exam Dept              | "fill marks for X subject by Y date" task; status: Pending/Submitted/Due  |
| `marks_fill_submission`        | system                 | timestamp when faculty submitted a fill request                           |

A separate CMS DB will hold tables for the public-content side
(`notices`, `news`, `events`, `tenders`, `alerts`, `faculty_directory`,
`gallery_albums`, `gallery_images`, `placement_records`, `site_settings`).
The schemas mirror the TypeScript types in `src/types/index.ts`.

---

## 5 · API surface (target)

Auth (one endpoint per role keeps controllers thin):

```
POST /api/auth/admin/login        { email, password }       → { token, user }
POST /api/auth/faculty/login      { employeeId, password }  → { token, user }
POST /api/auth/hod/login          { employeeId, password }  → { token, user }
POST /api/auth/exam/login         { employeeId, password }  → { token, user }
POST /api/auth/logout
POST /api/auth/forgot-password    { email, role }
POST /api/auth/reset-password/:token  { newPassword }
POST /api/auth/info-update        { userId, role, oldPassword, newEmail?, newPassword? }
```

CMS — Admin only:

```
GET|POST|PUT|DELETE /api/notices[/:id]
GET|POST|PUT|DELETE /api/news[/:id]
GET|POST|PUT|DELETE /api/events[/:id]
GET|POST|PUT|DELETE /api/tenders[/:id]
GET|POST|PUT|DELETE /api/alerts[/:id]
GET|POST|PUT|DELETE /api/departments[/:id]
GET|POST|PUT|DELETE /api/faculty-directory[/:id]
GET|POST|PUT|DELETE /api/gallery/albums[/:id]
POST                /api/gallery/albums/:id/images
GET|POST|PUT|DELETE /api/placement[/:id]
GET|PUT             /api/settings
```

Exam Dept — institute-wide academic data:

```
GET|POST|PUT|DELETE /api/session[/:id]
GET|POST|PUT|DELETE /api/branch[/:id]
GET|POST|PUT|DELETE /api/course[/:id]
GET|POST|PUT|DELETE /api/section[/:id]
POST /api/subject/upload                  CSV
POST /api/student/upload                  CSV
POST /api/atkt/upload                     CSV
POST /api/request/marks-fill              { …, last_date }     generate fill request
GET  /api/request                         list correction requests
PUT  /api/request/:request_id             { status: Approved|Rejected }
```

HOD — branch-scoped (server reads `req.user.branchId`):

```
GET  /api/faculty/pending                 pending registration requests
POST /api/faculty/approve                 { faculty_id }
POST /api/faculty/reject                  { faculty_id }
GET  /api/faculty                         branch faculty list
POST /api/faculty/assign                  { faculty_ids[], subject_id, subject_type, section }
GET  /api/branch/details                  { branch_id, course_id, specialization, semester }
POST /api/elective                        upload elective student data
```

Faculty — own data only:

```
GET  /api/faculty/me
GET  /api/faculty/subjects                allocated subjects, current session
POST /api/assesment/test-details          set max marks per CO
GET  /api/assesment/test-details          read max marks
DEL  /api/assesment/test-details          delete max marks
POST /api/assesment/save                  save marks (status=saved)
POST /api/assesment/submit                submit marks (status=submitted)
GET  /api/assesment/marks                 fetch own saved/submitted marks
POST /api/request                         submit correction request
GET  /api/request?faculty_id=…            list own requests
DEL  /api/request/:request_id             withdraw (only if Pending)
GET  /api/request/check-form              precondition check before raising request
GET  /api/request/:request_id/marks       fetch marks once approved
POST /api/request/resubmit                resubmit with corrected marks
POST /api/atkt/*                          ATKT analogue of the above
```

All non-auth routes require `Authorization: Bearer <jwt>`. The JWT carries
`{ userId, role, branchId }` and expires in **5 hours**. A middleware
should drop the request if the role does not match the route's required
role (e.g. `requireRole('hod')` on `/api/faculty/approve`).

---

## 6 · Backlog — what's needed to ship the portals

Public site (Joomla parity) and Admin CMS are already in place with mock
data. The portals need:

1. **Wire the `/hod` route tree** in `src/routes/routes.tsx` —
   add `HodLayout` + child routes for the 11 sidebar items.
2. **Wire the `/exam` route tree** similarly — the page files
   (`ExamDashboard`, `ExamSessions`, `ExamBranches`, `ExamCourses`,
   `ExamSubjectUpload`, `ExamStudentUpload`) already exist.
3. **Route redirect after login** — `Login.tsx` currently sends HOD and
   Exam Dept users to `/faculty/dashboard`; switch to `/hod/dashboard`
   and `/exam/dashboard` once the trees are wired.
4. **`AdminProtectedRoute` equivalent for HOD / Faculty / Exam** —
   factor out the existing component so it accepts an allowed-roles list,
   then create `HodProtectedRoute`, `FacultyProtectedRoute`,
   `ExamProtectedRoute`.
5. **Replace mock data with real APIs** — every page that imports from
   `src/data/mockPortalData.ts` or the `*API` modules in `src/api/index.ts`
   has a `// REAL: …` comment showing the target call. Flip them on once
   the Node backend is up.
6. **Backend** — port `exam-office-website/backend/` into the unified
   server (or run it as-is and proxy via `VITE_API_BASE_URL`). Add the
   CMS endpoints listed in **§ 5**.
7. **Forgot-password UI** — `Login.tsx` has the link but no page; backend
   route already exists (`POST /api/user/forgot-password`).
8. **CSV templates** — provide downloadable templates for Subject /
   Student / ATKT / Elective uploads.
9. **Role-aware navigation header** — once logged-in, the public-site
   header should show "Go to my portal" linking to the right dashboard.
10. **Audit trail UI** — surface `update_logs` to Exam Dept so they can
    see who corrected what and when.

---

## 7 · Quick cross-reference

| Legacy concept (Joomla / exam-office) | Where it lives in this rebuild                            |
| ------------------------------------- | --------------------------------------------------------- |
| Joomla article → "Notices" category   | `Notice` type + `/admin/notices` + public `/notices`      |
| Joomla `com_content` for News         | `NewsItem` type + `/admin/news` + public `/news`          |
| `dj-imageslider` / SP Easy Gallery    | `GalleryAlbum` + `/admin/gallery` + public `/explore/gallery` |
| `com_contact`                         | `/contact` (form posts to `/api/contact`)                 |
| Joomla menu structure                 | `MainLayout` mega menu + `SidebarLayout` for sub-sections |
| `administrator/` Joomla back-office   | `/admin/*` (CMS)                                          |
| `exam-office-website` Admin role      | **Exam Dept** in this rebuild (`/exam/*`)                 |
| `exam-office-website` HOD role        | **HOD** (`/hod/*`)                                        |
| `exam-office-website` Faculty role    | **Faculty** (`/faculty/*`)                                |
| MySQL DB `sgsits_dblive` (`w18q2_*`)  | Replaced by new schema in **§ 4**                         |

---

_Last updated: 2026-05-23. Owner: SGSITS rebuild team._
