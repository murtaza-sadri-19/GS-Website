# SGSITS — Complete Production System Audit
**Date:** 2026-05-24  
**Scope:** Full-stack (React frontend + Node/Express/MySQL backend)  
**Status:** Pre-production — significant mock systems remain

---

## TABLE OF CONTENTS
1. [Existing Backend Status](#1-existing-backend-status)
2. [Missing APIs](#2-missing-apis)
3. [Remaining Dummy/Mock Systems](#3-remaining-dummymock-systems)
4. [Remaining Frontend-Only Logic](#4-remaining-frontend-only-logic)
5. [Missing DB Relations](#5-missing-db-relations)
6. [Validation Coverage Audit](#6-validation-coverage-audit)
7. [RBAC Audit](#7-rbac-audit)
8. [Dashboard Audit](#8-dashboard-audit)
9. [CMS Audit](#9-cms-audit)
10. [Media System Audit](#10-media-system-audit)
11. [SEO Audit](#11-seo-audit)
12. [Performance Risks](#12-performance-risks)
13. [Security Risks](#13-security-risks)
14. [Scalability Risks](#14-scalability-risks)
15. [Remaining Production Blockers](#15-remaining-production-blockers)
16. [SQL/Migration Fixes Needed](#16-sqlmigration-fixes-needed)
17. [Final Backend Completion Plan](#17-final-backend-completion-plan)
18. [Final Production Readiness Score](#18-final-production-readiness-score)

---

## 1. Existing Backend Status

### Architecture
```
backend/
  src/
    app.js             ✅ Express app, helmet/cors/morgan/cookieParser/rateLimit
    server.js          ✅ HTTP server entry
    config/            ✅ db.js (MySQL pool), env.js (dotenv)
    middlewares/
      auth.middleware.js      ✅ JWT Bearer verification
      role.middleware.js      ✅ allow(...roles) — SUPER_ADMIN bypass
      validate.middleware.js  ✅ Zod-based, replaces req.body with parsed data
      upload.middleware.js    ✅ Multer (local + Cloudinary)
      error.middleware.js     ✅ Centralized error handler
      rateLimit.middleware.js ✅ Global + authLimiter
      permission.middleware.js ✅ (exists, purpose unknown — likely legacy)
    utils/
      response.js    ✅ success/error wrappers
      jwt.js         ✅ signToken/verifyToken
      hash.js        ✅ bcrypt helpers
      audit.js       ✅ writeAudit()
    modules/           (30 modules — see below)
  database/
    schema.sql         ✅ Core tables
    schema_additions.sql ✅ Phase-2 exam/academic tables
    migrations/        ✅ 8 migration files (003–010)
    seed.sql           ✅ Roles + default admin user
```

### Implemented Modules (30 total)

| Module | Routes File | Status | Notes |
|--------|------------|--------|-------|
| auth | auth.routes.js | ✅ Complete | login, /me, change-password, logout |
| users | users.routes.js | ✅ Complete | CRUD, role management |
| departments | departments.routes.js | ✅ Complete | CRUD + slug lookup |
| files | files.routes.js | ✅ Complete | upload, list, delete |
| faculty | faculty.routes.js | ✅ Complete | public list + teacher self-manage + publications/research/qualifications sub-resources |
| notices | notices.routes.js | ✅ Complete | CRUD + pagination + dept filter |
| downloads | downloads.routes.js | ✅ Complete | CRUD |
| events | events.routes.js | ✅ Complete | CRUD |
| gallery | gallery.routes.js | ✅ Complete | Upload + CRUD |
| pages | pages.routes.js | ✅ Complete | Static pages (about, policies) |
| exam | exam.routes.js | ✅ Complete | public exam documents |
| placement | placement.routes.js | ✅ Complete | records + companies + drives + internships + stats |
| audit | audit.routes.js | ✅ Read-only | admin audit log browser |
| news | news.routes.js | ✅ Complete | CRUD + category filter |
| tenders | tenders.routes.js | ✅ Complete | CRUD |
| alerts | alerts.routes.js | ✅ Complete | Marquee alerts CRUD |
| settings | settings.routes.js | ✅ Complete | site_settings + cms_sections |
| academic | academic.routes.js | ✅ Complete | Sessions, courses, subjects, students, faculty assignment, marks, ATKT, correction requests, electives |
| leaves | leaves.routes.js | ✅ Complete | Teacher apply + HOD review |
| timetables | timetables.routes.js | ✅ Complete | HOD manage + teacher /me view |
| labs | labs.routes.js | ✅ Present | status unknown |
| achievements | achievements.routes.js | ✅ Present | status unknown |
| registration | registration.routes.js | ✅ Present | status unknown |
| navigation | navigation.routes.js | ✅ Complete | GET public + PUT admin |
| seo | seo.routes.js | ✅ Complete | per-page SEO upsert |
| contact | contact.routes.js | ✅ Present | status unknown |
| analytics | analytics.routes.js | ✅ Present | status unknown |
| notifications | notifications.routes.js | ✅ Present | status unknown |
| chatbot | chatbot.routes.js | ✅ Present | status unknown |
| search | search.routes.js | ✅ Present | status unknown |

### Key Backend Strengths
- ✅ Proper JWT auth with token in Authorization header
- ✅ RBAC with role-based middleware (SUPER_ADMIN bypass)
- ✅ Zod validation middleware (validate.middleware.js)
- ✅ Centralized error handling
- ✅ Rate limiting (global + auth-specific)
- ✅ Audit logging on all write operations
- ✅ File upload (local + Cloudinary dual mode)
- ✅ DB transactions for bulk operations (setBulkSettings)
- ✅ Proper DB indexes on hot columns
- ✅ cms_sections table for CMS JSON blobs
- ✅ Password reset tokens table (schema exists)

---

## 2. Missing APIs

### 2.1 Auth Module — Missing
| Missing Endpoint | Priority | Notes |
|-----------------|----------|-------|
| `POST /api/v1/auth/forgot-password` | 🔴 HIGH | `password_reset_tokens` table exists but no controller |
| `POST /api/v1/auth/reset-password` | 🔴 HIGH | Flow incomplete |
| `POST /api/v1/auth/refresh-token` | 🟡 MEDIUM | No refresh token system — JWT expires without graceful renewal |

### 2.2 HOD Dashboard — Missing Backend Endpoints
| Frontend Calls | Backend Status | Impact |
|---------------|---------------|--------|
| `GET /v1/leaves` (HOD review) | ✅ EXISTS at `/api/v1/leaves` | ⚠️ Frontend not wired |
| `PUT /v1/leaves/:id/approve` | ✅ EXISTS | ⚠️ Frontend not wired |
| `PUT /v1/leaves/:id/reject` | ✅ EXISTS | ⚠️ Frontend not wired |
| `GET /v1/timetables` | ✅ EXISTS | ⚠️ Frontend not wired |
| `POST /v1/timetables` | ✅ EXISTS | ⚠️ Frontend not wired |
| `GET /v1/achievements` | Needs verification | ❌ Frontend returns mock |
| `GET /v1/labs` | Needs verification | ❌ Frontend returns mock |
| HOD attendance summary | ❌ NOT BUILT | Mock only |
| HOD result summary | ❌ NOT BUILT | Mock only |
| HOD downloads (dept) | Uses `/v1/downloads` | ⚠️ Frontend not wired |

### 2.3 Placement Dashboard — Missing Backend Endpoints
| Frontend Calls | Backend Status | Impact |
|---------------|---------------|--------|
| getDeptPlacement() | ❌ No `/placement/dept-stats` (uses `/placement/stats`) | Mock data shown |
| getTNPTeam() | ❌ No endpoint | 100% mock |
| getPlacementProcess() | ❌ No endpoint | 100% mock |
| getRecruitingPartners() | ❌ No endpoint | 100% mock |
| getTNPCellInfo() | ❌ No endpoint | 100% mock |
| getLeadingCompanies() | ❌ No endpoint | 100% mock |
| getPlacementContacts() | ❌ No endpoint | 100% mock |
| getPlacementOfficeInfo() | ❌ No endpoint | 100% mock |

### 2.4 Departments — Missing Fields
| Missing Field | DB Table | Notes |
|--------------|---------|-------|
| `hod_name` (text) | departments | DB has `hod_user_id` FK — frontend expects text string |
| `hod_message` | departments | No column — frontend expects it |
| `email`, `phone` | departments | No contact columns |
| `established` | departments | No column |
| `about_paragraphs`, `infra_highlights` | departments | No structured JSON fields |

### 2.5 Home Page / CMS — Missing Backend Endpoints
The entire home page CMS system (`src/cms/home/*`) reads/writes to localStorage instead of backend:
- `GET /api/v1/settings/cms/home.hero` — exists in settings service but CMS service ignores it
- `PUT /api/v1/settings/cms/home.hero` — same
- 12 other home sections (about, director, news, academics, departments, stats, campus_life, faqs, gallery, seo, announcements) — all localStorage

### 2.6 Navigation — Missing Frontend Integration
- Backend: `GET /api/v1/navigation` + `PUT /api/v1/navigation` ✅
- Frontend: No service file calls navigation API — uses hardcoded route config

### 2.7 SEO — Missing Frontend Integration  
- Backend: `GET /api/v1/seo/:pageKey` + `PUT /api/v1/seo/:pageKey` ✅
- Frontend: Home SEO reads from localStorage CMS; policy pages use static JSX meta tags

### 2.8 Contact Form — Missing
- Backend: `contact` module exists — status unknown
- Frontend: No contact form submits to backend

### 2.9 Registration Requests — Not Built
- `getRegistrationRequests` always returns mock array with comment `// Not yet in backend`
- No backend route implemented

---

## 3. Remaining Dummy/Mock Systems

### 🔴 CRITICAL — Entire Systems Are Mock

#### 3.1 Home Page CMS (contentService.ts)
```
src/services/contentService.ts
```
- Imports 13 separate `getXxxConfig()` from `src/cms/home/*/service`
- Each CMS service (hero, about, director, news, academics, departments, stats, campus_life, faqs, gallery, seo, announcements) reads from localStorage
- **`preFooter` hardcoded**: `imageUrl: '/assets/campus-panorama.png'`
- No data ever fetched from backend for home page sections
- **Impact: Entire home page is frontend-only. Backend CMS engine is bypassed.**

#### 3.2 HOD Service Mock Functions
```
src/services/hodService.ts
```
| Function | Status | Data Source |
|----------|--------|-------------|
| `getLeaveApplications()` | 🔴 MOCK | `mockLeaveApplications` array |
| `approveLeave()` | 🔴 NO-OP | `console.warn` only |
| `rejectLeave()` | 🔴 NO-OP | `console.warn` only |
| `getTimetableSlots()` | 🔴 MOCK | `mockTimetableSlots` array |
| `getAttendanceSummary()` | 🔴 MOCK | `mockAttendanceSummary` array |
| `getDeptResultSummary()` | 🔴 MOCK | `mockDeptResultSummary` array |
| `getHodDownloads()` | 🔴 MOCK | `mockHodDownloads` array |
| `getHodLabs()` | 🔴 MOCK | `mockHodLabs` array |
| `getHodAchievements()` | 🔴 MOCK | `mockHodAchievements` array |

#### 3.3 Placement Service Mock Functions
```
src/services/placementService.ts
```
| Function | Status |
|----------|--------|
| `getDeptPlacement()` | 🔴 `mockStore.getDeptPlacement()` |
| `getTNPTeam()` | 🔴 `mockStore.getTNPTeam()` |
| `getPlacementProcess()` | 🔴 `mockStore.getPlacementProcess()` |
| `getRecruitingPartners()` | 🔴 `mockStore.getRecruitingPartners()` |
| `getTNPCellInfo()` | 🔴 `mockStore.getTNPCellInfo()` |
| `getLeadingCompanies()` | 🔴 `mockStore.getLeadingCompanies()` |
| `getPlacementContacts()` | 🔴 `mockStore.getPlacementContacts()` |
| `getPlacementOfficeInfo()` | 🔴 `mockStore.getPlacementOfficeInfo()` |

#### 3.4 Department Service Mock Writes
```
src/services/departmentService.ts
```
```js
// Line 77–83: saves to mockStore, never hits backend
export const saveDepartments = async (depts) => mockStore.saveDepartments(depts)
export const saveDepartmentBySlug = async (slug, data) => mockStore.saveDepartmentBySlug(slug, data)
```

#### 3.5 Exam Service Fully Mock
```
src/services/examService.ts  
```
- `getRegistrationRequests()` — pure mock, no `// Future:` wiring even attempted

### 🟡 MEDIUM — Partial Mock (with real fallback)

#### 3.6 Footer CMS Service (footerService.ts)
- Has backend calls to `/v1/settings/cms/footer.*`
- BUT `cmsPut()` **silently swallows all errors** — writes may silently fail
- Has in-memory `_cache` + localStorage layer
- Pattern: write succeeds locally even when backend is down — user sees fake "saved" state

#### 3.7 api/index.ts — Mock Fallbacks
Every `getAll` function has a silent `catch { return mockStore.getXxx() }` fallback:
- Notices, News, Events, Tenders, Alerts, Faculty, Gallery, Placement, Settings
- Problem: if backend is down, users get stale mock data with no error indication

#### 3.8 mockStore (data/mockStore.ts)
- Central mock data store still fully present
- Used as fallback in every service
- Contains hardcoded arrays for departments, placement, faculty, etc.
- Must remain for development but needs removal guard for production

---

## 4. Remaining Frontend-Only Logic

### 4.1 CMS Home Page Architecture
```
src/cms/home/hero/service.ts
src/cms/home/about/service.ts
src/cms/home/director/service.ts
... (12 total)
```
Each service pattern:
```ts
const STORAGE_KEY = 'sgsits_cms_home_hero'
export const getHeroConfig = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : defaults
}
export const saveHeroConfig = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
```
**These never call the backend.** They write to/read from browser localStorage only.

### 4.2 AdminStaticPages.tsx — Policy Pages
- `src/pages/admin/AdminStaticPages.tsx` likely edits policy page content via mockStore or localStorage
- Static policy pages (Privacy, Disclaimer, etc.) render from JSX constants, not DB

### 4.3 Admin Footer CMS (AdminFooter.tsx)
- `src/pages/admin/AdminFooter.tsx` + `src/pages/admin/footer/` sub-pages
- footerService does call backend but errors are swallowed silently
- localStorage cache means user never knows if backend save failed

### 4.4 HOD Dashboard Pages
```
src/pages/hod/HodDashboard.tsx
src/pages/hod/HodFacultyAllocation.tsx  
src/pages/hod/HodTimetable.tsx
```
- All three pages use hodService functions that return mock arrays
- Leave approval UI: button calls `approveLeave()` which is a console.warn no-op

### 4.5 Hardcoded Content
- `preFooter.imageUrl = '/assets/campus-panorama.png'` in contentService.ts
- Navigation menu items likely hardcoded in layout (not from `/api/v1/navigation`)
- Policy page content in JSX files

---

## 5. Missing DB Relations

### 5.1 Missing Columns in `departments` Table
```sql
-- Current departments table is missing:
ALTER TABLE departments
  ADD COLUMN hod_name      VARCHAR(150) DEFAULT NULL AFTER hod_user_id,
  ADD COLUMN hod_message   TEXT         DEFAULT NULL AFTER hod_name,
  ADD COLUMN email         VARCHAR(150) DEFAULT NULL,
  ADD COLUMN phone         VARCHAR(30)  DEFAULT NULL,
  ADD COLUMN established   VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN about_text    LONGTEXT     DEFAULT NULL,  -- or use CMS section
  ADD COLUMN infra_json    JSON         DEFAULT NULL;
```
**Note:** Better pattern = use `cms_sections` with key `dept.{slug}.profile` rather than adding columns.

### 5.2 Missing Tables from migrations/

#### `labs` table (module exists, table likely missing from schema.sql)
```sql
CREATE TABLE IF NOT EXISTS labs (
  id            INT         NOT NULL AUTO_INCREMENT,
  name          VARCHAR(200) NOT NULL,
  department_id INT         NOT NULL,
  description   TEXT,
  capacity      INT,
  equipment     TEXT,
  image_file_id INT         DEFAULT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_labs_dept (department_id),
  CONSTRAINT fk_labs_dept  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_labs_image FOREIGN KEY (image_file_id) REFERENCES files(id) ON DELETE SET NULL
);
```

#### `achievements` table
```sql
CREATE TABLE IF NOT EXISTS achievements (
  id            INT         NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  category      ENUM('STUDENT','FACULTY','DEPARTMENT','INSTITUTE') NOT NULL DEFAULT 'STUDENT',
  department_id INT         DEFAULT NULL,
  user_id       INT         DEFAULT NULL,
  awarded_date  DATE        DEFAULT NULL,
  image_file_id INT         DEFAULT NULL,
  status        ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  created_by    INT         NOT NULL,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_achiev_dept (department_id),
  CONSTRAINT fk_achiev_dept  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_achiev_user  FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE SET NULL,
  CONSTRAINT fk_achiev_image FOREIGN KEY (image_file_id) REFERENCES files(id)       ON DELETE SET NULL,
  CONSTRAINT fk_achiev_by    FOREIGN KEY (created_by)    REFERENCES users(id)       ON DELETE RESTRICT
);
```

#### `faculty_leave_requests` table (or does `leaves` module use dept_ops migration?)
```sql
-- Verify migration 005_dept_ops.sql creates this.
-- If not:
CREATE TABLE IF NOT EXISTS faculty_leave_requests (
  id            INT          NOT NULL AUTO_INCREMENT,
  faculty_id    INT          NOT NULL,
  department_id INT          NOT NULL,
  leave_type    ENUM('CASUAL','MEDICAL','EARN','OTHER') NOT NULL,
  from_date     DATE         NOT NULL,
  to_date       DATE         NOT NULL,
  reason        TEXT         NOT NULL,
  status        ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  reviewed_by   INT          DEFAULT NULL,
  remarks       TEXT         DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_leave_faculty (faculty_id),
  KEY idx_leave_dept (department_id),
  CONSTRAINT fk_leave_faculty   FOREIGN KEY (faculty_id)   REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_leave_dept      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_leave_reviewer  FOREIGN KEY (reviewed_by)  REFERENCES users(id) ON DELETE SET NULL
);
```

#### `timetable_slots` table
```sql
-- Verify migration 005_dept_ops.sql creates timetable_slots or equivalent.
```

#### `registration_requests` table
```sql
CREATE TABLE IF NOT EXISTS registration_requests (
  id            INT          NOT NULL AUTO_INCREMENT,
  student_name  VARCHAR(200) NOT NULL,
  enrollment_no VARCHAR(50)  DEFAULT NULL,
  department_id INT          NOT NULL,
  course_id     INT          NOT NULL,
  semester      INT          NOT NULL,
  request_type  ENUM('NEW','RE_REGISTRATION') NOT NULL DEFAULT 'NEW',
  status        ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  reviewed_by   INT          DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_reg_dept     FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
  CONSTRAINT fk_reg_course   FOREIGN KEY (course_id)    REFERENCES exam_courses(id) ON DELETE RESTRICT,
  CONSTRAINT fk_reg_reviewer FOREIGN KEY (reviewed_by)  REFERENCES users(id)       ON DELETE SET NULL
);
```

### 5.3 Missing Indexes
```sql
-- Full-text search indexes (check migration 010_indexes_fulltext.sql)
-- Pagination needs:
ALTER TABLE notices     ADD INDEX idx_notices_created (created_at DESC);
ALTER TABLE news        ADD INDEX idx_news_created (created_at DESC);
ALTER TABLE events      ADD INDEX idx_events_date (event_date DESC);
ALTER TABLE exam_marks  ADD INDEX idx_marks_enrollment (enrollment_no);
-- Composite for role-scoped queries:
ALTER TABLE faculty_leave_requests ADD INDEX idx_leave_dept_status (department_id, status);
```

### 5.4 Missing `seo_pages` Table
- Backend `seo` module exists but schema doesn't show an `seo_pages` table
- Check migration 007_global_systems.sql — if missing:
```sql
CREATE TABLE IF NOT EXISTS seo_pages (
  id               INT          NOT NULL AUTO_INCREMENT,
  page_key         VARCHAR(100) NOT NULL,
  title            VARCHAR(255) DEFAULT NULL,
  meta_description TEXT         DEFAULT NULL,
  og_title         VARCHAR(255) DEFAULT NULL,
  og_description   TEXT         DEFAULT NULL,
  og_image_url     VARCHAR(500) DEFAULT NULL,
  canonical_url    VARCHAR(500) DEFAULT NULL,
  keywords         TEXT         DEFAULT NULL,
  updated_by       INT          DEFAULT NULL,
  updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_seo_key (page_key),
  CONSTRAINT fk_seo_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 5.5 Missing `navigation_menu` Table
```sql
CREATE TABLE IF NOT EXISTS navigation_menu (
  id         INT      NOT NULL AUTO_INCREMENT,
  data       JSON     NOT NULL,
  updated_by INT      DEFAULT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_nav_user FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);
```

### 5.6 Missing `notifications` Table
- `notifications` module exists — table likely in migration 007, verify.

### 5.7 Missing Placement Structured Tables
Migration `006_placement_structured.sql` should add:
- `placement_companies` (verify)
- `placement_drives` (verify)
- `placement_internships` (verify)
- `placement_yearly_stats` (verify)

---

## 6. Validation Coverage Audit

### Backend Validation Status

| Module/Route | Zod Validation | Missing Validation |
|-------------|---------------|-------------------|
| auth/login | ❌ None | email, password required/type |
| auth/change-password | ❌ None | oldPassword, newPassword min-length |
| users CRUD | ❌ Unknown | name, email, role, password |
| departments CRUD | ❌ Unknown | name, slug uniqueness |
| notices CRUD | ❌ Unknown | title, notice_type enum |
| news CRUD | ❌ Unknown | title, content, category |
| events CRUD | ❌ Unknown | title, event_date format |
| faculty CRUD | ❌ Unknown | designation, department_id FK |
| gallery upload | ❌ Unknown | file size, file type |
| placement CRUD | ❌ Unknown | company_name, record_type enum |
| settings/cms | ❌ None (sectionKey not sanitized) | section key whitelist |
| academic/marks | ❌ Unknown | marks_obtained range 0–max |
| leaves | ❌ Unknown | from_date < to_date |
| timetables | ❌ Unknown | day/period bounds |

### Required Zod Schemas to Add

```js
// auth login
const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6).max(100),
});

// password change
const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});

// notice create
const noticeSchema = z.object({
  title:       z.string().min(3).max(255),
  description: z.string().optional(),
  notice_type: z.enum(['GENERAL','DEPARTMENT','EXAM','PLACEMENT']),
  department_id: z.number().int().positive().optional(),
  publish_date: z.string().date().optional(),
  status:      z.enum(['DRAFT','PUBLISHED']).default('DRAFT'),
});

// marks entry
const marksEntrySchema = z.object({
  session_id:         z.number().int().positive(),
  subject_id:         z.number().int().positive(),
  component_name:     z.string().min(1),
  sub_component_name: z.string().min(1),
  marks: z.array(z.object({
    enrollment_no:  z.string().min(1),
    co_name:        z.string().min(1),
    marks_obtained: z.number().min(0),  // max validated against test_details
  })),
});

// settings CMS key
const cmsSectionKeySchema = z.object({
  section: z.string()
    .regex(/^[a-z0-9_.]+$/)
    .max(100),
});
```

### Frontend Validation Status

| Form | Current Validation | Missing |
|------|-------------------|---------|
| Login form | Basic required | email format, password strength |
| Notice create | None visible | Required fields, type enum |
| Faculty create | Unknown | All fields |
| Marks entry | Range check (some) | Server-side max_marks validation |
| Gallery upload | File picker | Size limit, type restriction |
| Tender create | None | Title required, deadline format |
| User create | None | Password strength, role validation |
| CMS section editor | None | Data structure validation |

---

## 7. RBAC Audit

### Defined Roles (backend)
```
SUPER_ADMIN       — all permissions (bypass in role.middleware.js)
CENTRAL_ADMIN     — site-wide admin
EXAM_CONTROLLER   — academic/marks system
PLACEMENT_OFFICER — placement module
HOD               — department-level operations
TEACHER           — own marks/leaves/profile
CONTENT_EDITOR    — mentioned in seo.routes.js & navigation.routes.js
```

### ⚠️ RBAC Issue: `CONTENT_EDITOR` role is orphaned
- Referenced in `seo.routes.js`: `allow('CENTRAL_ADMIN', 'CONTENT_EDITOR')`
- Referenced in `navigation.routes.js`: `allow('CENTRAL_ADMIN', 'CONTENT_EDITOR')`
- **NOT present in `seed.sql`** (needs verification)
- **Frontend has NO `CONTENT_EDITOR` dashboard or route**
- **No user can be assigned this role via UI**
- Either: add it to seed.sql + create dashboard, OR remove from routes

### Route Protection Audit

| Route Group | Protected | Roles Enforced | Issues |
|-------------|-----------|---------------|--------|
| /api/v1/auth/login | ❌ Public | — | ✅ Rate limited |
| /api/v1/auth/me | ✅ JWT | Any role | OK |
| /api/v1/departments (GET) | ❌ Public | — | ✅ Correct |
| /api/v1/departments (POST) | ✅ JWT | CENTRAL_ADMIN, HOD | OK |
| /api/v1/faculty (GET) | ❌ Public | — | ✅ Correct |
| /api/v1/faculty (POST) | ✅ JWT | CENTRAL_ADMIN, HOD | OK |
| /api/v1/academic/marks | ✅ JWT | TEACHER | OK |
| /api/v1/academic/sessions | ❌ Public | — | ⚠️ Should be authenticated |
| /api/v1/settings/cms (PUT) | ✅ JWT | CENTRAL_ADMIN | OK |
| /api/v1/settings (GET) | ❌ Public | — | ✅ Needed for frontend |
| /api/v1/leaves | ✅ JWT | TEACHER/HOD | OK |
| /api/v1/timetables | ✅ JWT | HOD/TEACHER | OK |
| /api/v1/placement/records (write) | ✅ JWT | PLACEMENT_OFFICER | OK |
| /api/v1/seo (write) | ✅ JWT | CENTRAL_ADMIN, CONTENT_EDITOR | ⚠️ CONTENT_EDITOR orphaned |

### Frontend Route Protection
- `AdminProtectedRoute.tsx` — guards admin routes with auth check
- HOD/Faculty/Placement/Exam dashboard routes need their own protected route wrappers
- Current: `routes.tsx` needs audit to confirm every `/dashboard/*` route is wrapped

### Missing: Department Ownership Enforcement
- HOD should only modify their own department's data
- `leaves.routes.js` says "HOD scoped to own department in service" — needs code verification
- `faculty.routes.js` says "dept ownership enforced in service" — needs code verification
- If these checks are `req.user.department_id === resource.department_id`, they are correct, but unverified

---

## 8. Dashboard Audit

### 8.1 Central Admin Dashboard
| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| User management | ✅ /users | AdminUsers.tsx | 🟡 Needs verification |
| Department management | ✅ /departments | AdminDepartments.tsx | 🟡 Needs verification |
| Faculty management | ✅ /faculty | AdminFaculty.tsx | 🟡 Needs verification |
| Notices | ✅ /notices | AdminNotices.tsx | ✅ Likely wired |
| News | ✅ /news | AdminNews.tsx | ✅ Likely wired |
| Events | ✅ /events | AdminEvents.tsx | ✅ Likely wired |
| Gallery | ✅ /gallery | AdminGallery.tsx | 🟡 Needs verification |
| Downloads | ✅ /downloads | AdminDownloads.tsx | 🟡 Needs verification |
| Tenders | ✅ /tenders | AdminTenders.tsx | 🟡 Needs verification |
| Alerts | ✅ /alerts | AdminAlerts.tsx | ✅ Likely wired |
| Placement | ✅ /placement | AdminPlacement.tsx | 🟡 Needs verification |
| Settings | ✅ /settings | AdminSettings.tsx | ✅ Wired |
| Static Pages | ✅ /pages | AdminStaticPages.tsx | 🟡 Verify |
| Footer CMS | ✅ /settings/cms | AdminFooter.tsx | ⚠️ Silent error swallowing |
| Home CMS | ✅ /settings/cms | (via cms/home services) | 🔴 BROKEN — localStorage only |
| Audit Logs | ✅ /audit-logs | Unknown | Unknown |

### 8.2 HOD Dashboard
| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| Department profile | ✅ /departments/:id | HodDashboard.tsx | 🟡 Wired but missing fields |
| Leave review | ✅ /leaves | HodDashboard.tsx | 🔴 Mock only — not wired |
| Timetable management | ✅ /timetables | HodTimetable.tsx | 🔴 Mock only — not wired |
| Faculty allocation | ✅ /academic/faculty/assign | HodFacultyAllocation.tsx | ✅ Wired via examService |
| Notices | ✅ /notices?department_id | hodService | ✅ Wired |
| Events | ✅ /events?department_id | hodService | ✅ Wired |
| Gallery | ✅ /gallery?department_id | hodService | ✅ Wired |
| Attendance summary | ❌ Not built | hodService | 🔴 Mock |
| Result summary | ❌ Not built | hodService | 🔴 Mock |
| Downloads | 🟡 /downloads?dept | hodService | 🔴 Mock (not wired) |
| Labs | 🟡 /labs | hodService | 🔴 Mock |
| Achievements | 🟡 /achievements | hodService | 🔴 Mock |

### 8.3 Exam Controller Dashboard
| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| Sessions | ✅ /academic/sessions | examService | ✅ Wired |
| Courses | ✅ /academic/courses | examService | ✅ Wired |
| Subjects | ✅ /academic/subjects | examService | ✅ Wired |
| Students | ✅ /academic/students | examService | ✅ Wired |
| Marks fill requests | ✅ /academic/marks/fill-requests | examService | ✅ Wired |
| Correction requests | ✅ /academic/correction-requests | examService | ✅ Wired |
| Registration requests | ❌ Not built | examService | 🔴 Mock |
| ATKT flow | ✅ /academic/atkt/* | examService | 🟡 Wired but needs testing |
| Electives | ✅ /academic/electives | examService | ✅ Wired |

### 8.4 Placement Officer Dashboard
| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| Placement records (CRUD) | ✅ /placement/records | placementService | ✅ Wired |
| Companies | ✅ /placement/companies | placementService | 🔴 Mock |
| Drives | ✅ /placement/drives | placementService | 🔴 Mock |
| Internships | ✅ /placement/internships | placementService | 🔴 Mock |
| Yearly stats | ✅ /placement/stats | placementService | 🔴 Mock (`getDeptPlacement`) |
| Training programs | ✅ /placement/training-programs | placementService | ✅ Wired |
| TNP team | ❌ Not built | placementService | 🔴 Mock |
| Process steps | ❌ Not built | placementService | 🔴 Mock |

### 8.5 Teacher Dashboard
| Feature | Backend | Frontend | Status |
|---------|---------|----------|--------|
| View assigned subjects | ✅ /academic/faculty | examService | ✅ Wired |
| Enter marks | ✅ /academic/marks/save | examService | ✅ Wired |
| Submit marks | ✅ /academic/marks/submit | examService | ✅ Wired |
| Leave application | ✅ /leaves (teacher) | hodService? | 🔴 Not wired to backend |
| View timetable | ✅ /timetables/me | hodService? | 🔴 Not wired |
| Update profile | ✅ /faculty/me (PUT) | Unknown | Unknown |
| Publications | ✅ /faculty/me/publications | Unknown | Unknown |
| Correction requests | ✅ /academic/correction-requests | examService | ✅ Wired |

---

## 9. CMS Audit

### 9.1 Architecture Gap

**Current:**
```
Admin saves home section → localStorage (cms/home/*/service.ts)
Home page loads → reads from localStorage
Backend /settings/cms exists but is never called by home CMS
```

**Required:**
```
Admin saves home section → PUT /api/v1/settings/cms/home.{section}
Home page loads → GET /api/v1/settings/cms/home.{section}
localStorage = only offline fallback, not primary storage
```

### 9.2 CMS Sections That Need Backend Wiring

| CMS Section | localStorage Key | Backend Key | Status |
|-------------|-----------------|------------|--------|
| home.hero | sgsits_cms_home_hero | home.hero | 🔴 Not wired |
| home.about | sgsits_cms_home_about | home.about | 🔴 Not wired |
| home.director | sgsits_cms_home_director | home.director | 🔴 Not wired |
| home.news | sgsits_cms_home_news | home.news | 🔴 Not wired |
| home.academics | sgsits_cms_home_academics | home.academics | 🔴 Not wired |
| home.departments | sgsits_cms_home_departments | home.departments | 🔴 Not wired |
| home.stats | sgsits_cms_home_stats | home.stats | 🔴 Not wired |
| home.campus_life | sgsits_cms_home_campus_life | home.campus_life | 🔴 Not wired |
| home.faqs | sgsits_cms_home_faqs | home.faqs | 🔴 Not wired |
| home.gallery | sgsits_cms_home_gallery | home.gallery | 🔴 Not wired |
| home.seo | sgsits_cms_home_seo | home.seo | 🔴 Not wired |
| home.announcements | sgsits_cms_home_annc | home.announcements | 🔴 Not wired |
| footer.branding | sgsits_footer_cms | footer.branding | 🟡 Wired but silent errors |
| footer.contact | sgsits_footer_cms | footer.contact | 🟡 Same |
| footer.quickLinks | sgsits_footer_cms | footer.quickLinks | 🟡 Same |
| (8 more footer sections) | sgsits_footer_cms | footer.* | 🟡 Same |

### 9.3 CMS Fix Pattern

For each home CMS service (`src/cms/home/*/service.ts`), replace localStorage-only pattern with:

```ts
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import { defaultHeroConfig } from './defaults'

export const getHeroConfig = async () => {
  return getCmsSection('home.hero', defaultHeroConfig)
}

export const saveHeroConfig = async (data: HeroConfig) => {
  await saveCmsSection('home.hero', data)
}
```

The `settingsService` already has the generic `getCmsSection`/`saveCmsSection` helpers that call the backend.

### 9.4 Section Ordering & Visibility
- Currently: sections have `order` and `enabled` properties in localStorage
- Needs: these persisted in `cms_sections` data JSON blob (backend already stores whole JSON)
- ✅ Backend architecture supports this — fix is only in frontend CMS services

---

## 10. Media System Audit

### 10.1 Upload Flow
```
Frontend → POST /api/v1/files/upload (FormData)
         → filesAPI.upload() in api/index.ts
         → Backend: upload.middleware.js (Multer)
         → Returns { file_id, file_url, original_name }
         → file_id passed to resource create/update
```
**Status: ✅ Architecture correct**

### 10.2 Issues Found

| Issue | Severity | Details |
|-------|----------|---------|
| Gallery API mismatch | 🔴 HIGH | Frontend calls `GET /v1/gallery` expecting `{ images: [...] }`, backend may return different shape |
| getAlbumPhotos broken | 🔴 HIGH | `getAlbumPhotos(albumId)` fetches single gallery item, not album's photos |
| No file type validation | 🟡 MEDIUM | Frontend sends any file — backend should reject non-image for gallery |
| No file size limit UI | 🟡 MEDIUM | Upload middleware has limits but no UI feedback |
| Alt text missing | 🟡 MEDIUM | gallery table has no `alt_text` column |
| No CDN config | 🟡 MEDIUM | Cloudinary integration exists but no CDN URL transformation |
| Gallery has no album concept | 🟡 MEDIUM | `gallery` table stores individual images, not albums — `mediaService` fakes albums by category |
| Cover image for events/gallery | 🟡 MEDIUM | `cover_image_file_id` in events, `file_id` in gallery — frontend maps `file_url` directly |

### 10.3 Required DB Fix
```sql
ALTER TABLE gallery
  ADD COLUMN alt_text   VARCHAR(255) DEFAULT NULL AFTER description,
  ADD COLUMN category   VARCHAR(100) DEFAULT 'General' AFTER alt_text;

CREATE TABLE IF NOT EXISTS gallery_albums (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  cover_file_id INT          DEFAULT NULL,
  department_id INT          DEFAULT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_by    INT          NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_galb_dept  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_galb_cover FOREIGN KEY (cover_file_id) REFERENCES files(id) ON DELETE SET NULL,
  CONSTRAINT fk_galb_user  FOREIGN KEY (created_by)    REFERENCES users(id) ON DELETE RESTRICT
);

ALTER TABLE gallery
  ADD COLUMN album_id INT DEFAULT NULL AFTER department_id,
  ADD CONSTRAINT fk_gallery_album FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE SET NULL;
```

---

## 11. SEO Audit

### 11.1 Backend SEO
- `/api/v1/seo/:pageKey` — GET (public), PUT (admin) ✅
- Likely uses `seo_pages` table (verify migration 007)
- `CONTENT_EDITOR` role allowed to edit (but role is orphaned — see RBAC)

### 11.2 Frontend SEO
| Page | Title | Meta Desc | OG Tags | Backend-driven |
|------|-------|-----------|---------|---------------|
| Home | Hardcoded JSX | Hardcoded | ❌ | 🔴 No — localStorage CMS |
| Dept page | Dynamic | None | ❌ | 🔴 No |
| News article | Unknown | Unknown | ❌ | Unknown |
| Policy pages | Static in JSX | None | ❌ | 🔴 No |
| Admin pages | N/A | N/A | N/A | N/A |

### 11.3 Missing SEO Features
- No `<link rel="canonical">` on any page
- No structured data (JSON-LD for Organization, BreadcrumbList)
- No Open Graph tags
- No sitemap.xml generation
- No robots.txt
- Slugs exist in DB (notices, events, news, pages, departments) but not used for SEO-friendly URLs in frontend routing

### 11.4 Required Changes
```tsx
// Add to public pages:
import { Helmet } from 'react-helmet-async'

// In each page component:
<Helmet>
  <title>{seoData.title || 'SGSITS Indore'}</title>
  <meta name="description" content={seoData.meta_description} />
  <meta property="og:title" content={seoData.og_title || seoData.title} />
  <meta property="og:description" content={seoData.og_description} />
  <meta property="og:image" content={seoData.og_image_url} />
  <link rel="canonical" href={seoData.canonical_url} />
</Helmet>
```

---

## 12. Performance Risks

### 12.1 Backend Performance Risks

| Risk | Location | Severity | Fix |
|------|----------|----------|-----|
| N+1 query in faculty list | faculty.service.js | 🔴 HIGH | JOIN faculty_profiles, not separate queries |
| No pagination on GET /faculty | faculty.routes.js | 🟡 MEDIUM | Add LIMIT/OFFSET |
| `SELECT *` patterns | Multiple services | 🟡 MEDIUM | Select only needed columns |
| No query caching | settings.service.js | 🟡 MEDIUM | Redis cache for site_settings (read on every request) |
| cms_sections JSON parsed each request | settings.service.js | 🟡 MEDIUM | In-memory cache with TTL |
| Audit logging on every write (sync) | audit.js writeAudit() | 🟡 MEDIUM | Make async/queue-based |
| exam_marks: no pagination on large datasets | academic.service.js | 🔴 HIGH | Paginate marks queries |
| Full department list on every marks page | examService.ts | 🟡 MEDIUM | Cache branches |

### 12.2 Frontend Performance Risks

| Risk | Location | Severity | Fix |
|------|----------|----------|-----|
| 13 parallel API calls on home page | contentService.ts | 🟡 MEDIUM | Single `/settings/cms/home` endpoint returning all sections |
| No React Query / SWR | All services | 🔴 HIGH | No request deduplication, no stale-while-revalidate |
| mockStore always loaded | data/mockStore.ts | 🟡 MEDIUM | Tree-shake out of production build |
| No lazy loading for admin routes | routes.tsx | 🟡 MEDIUM | Use React.lazy() for dashboard bundles |
| Dashboard tables: full data fetch | HOD/Exam/Admin | 🟡 MEDIUM | Add server-side pagination + search |
| Gallery images: no lazy loading | Gallery page | 🟡 MEDIUM | Add loading="lazy" or Intersection Observer |
| No image srcset | All image tags | 🟡 MEDIUM | Cloudinary URL transformations for responsive images |
| No memoization in exam marks table | ExamMarks component | 🟡 MEDIUM | useMemo for large student arrays |

### 12.3 Database Performance
```sql
-- Missing composite indexes for common query patterns:
CREATE INDEX idx_faculty_dept_status   ON faculty_profiles(department_id, status);
CREATE INDEX idx_notices_type_status   ON notices(notice_type, status, publish_date);
CREATE INDEX idx_news_cat_status       ON news(category, status, published_at);
CREATE INDEX idx_downloads_dept_status ON downloads(department_id, status);
CREATE INDEX idx_gallery_dept_status   ON gallery(department_id, status);

-- Full-text search (verify migration 010):
ALTER TABLE notices ADD FULLTEXT ft_notices_title (title, description);
ALTER TABLE news    ADD FULLTEXT ft_news_title    (title, excerpt, content);
ALTER TABLE faculty_profiles ADD FULLTEXT ft_faculty (bio, specialization);
```

---

## 13. Security Risks

### 13.1 Critical Security Issues

| Issue | Location | Risk | Fix |
|-------|----------|------|-----|
| No refresh token | auth system | Token theft = permanent access | Add refresh token rotation |
| JWT secret in env only | jwt.js | If leaked, all tokens valid | Use RS256 asymmetric keys in prod |
| Password reset exists in DB, not in routes | auth.service.js | Users can't reset password | Implement forgot/reset flow |
| `cmsPut` silently swallows errors | footerService.ts | Data loss — user thinks saved | Propagate errors to UI |
| CMS section key not sanitized | settings.routes.js | Potential key injection | Validate section key regex on backend |
| localStorage token storage | api/client.ts | XSS risk | Consider httpOnly cookie for JWT |
| CORS `origin: env.corsOrigin` | app.js | Needs strict production value | Verify env var set correctly in prod |
| No CSRF protection | app.js | POST forgery | Add csurf or SameSite cookie |
| Gallery upload: no file type check | upload.middleware.js | Arbitrary file upload | Validate MIME type on server |
| User enumeration via 401 | auth.service.js | ✅ Fixed — same message | OK |
| SQL injection | All services | ✅ Using parameterized queries | OK |
| Helmet enabled | app.js | ✅ | OK |

### 13.2 RBAC Security Gaps

| Gap | Risk |
|----|-----|
| `CONTENT_EDITOR` role in routes but no users | Orphaned role could be assigned incorrectly |
| HOD department scope verification | If service doesn't check `req.user.department_id`, HOD can modify other depts |
| TEACHER self-update via PUT /faculty/:id | If service doesn't verify `req.user.id === faculty.user_id`, teachers can edit others |
| Exam data access: department isolation | Marks data must be scoped to faculty's assigned subjects only |

### 13.3 Input Validation Security
- CMS sections accept arbitrary JSON bodies — no schema validation
- File upload `category` param not validated on backend
- `pageSize` query param could be set to 999999 without server-side cap

```js
// Add to all list endpoints:
const MAX_PAGE_SIZE = 100;
const pageSize = Math.min(parseInt(req.query.pageSize) || 20, MAX_PAGE_SIZE);
```

---

## 14. Scalability Risks

### 14.1 Database Scalability

| Risk | Details | Fix |
|------|---------|-----|
| `exam_marks`: enrollment_no as VARCHAR (not FK) | Marks not linked to exam_students table via FK | Add FK or indexed relation |
| cms_sections: single JSON blob per section | Large CMS data in single row | Acceptable for current scale |
| site_settings: all settings in one table | O(n) read for all settings | ✅ Acceptable — UPSERT pattern |
| No connection pooling tuning | Default pool size | Tune pool.max in production |
| MySQL JSON column in cms_sections | Limited JSON querying | Acceptable — never queried inside |

### 14.2 API Scalability

| Risk | Details |
|------|---------|
| No API versioning enforcement | `/api/v1/*` is one version — OK for now |
| No API response envelope standardization | Some services return `res.data.data`, others `res.data.data.notices` — inconsistent |
| No request ID / tracing | Debugging production issues will be hard |
| No health check for DB connectivity | `/health` only checks server, not DB |

```js
// Improve health check:
app.get('/api/v1/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    success(res, 'Backend is running', { status: 'ok', db: 'ok', timestamp: new Date().toISOString() });
  } catch {
    error(res, 'Database unreachable', null, 503);
  }
});
```

### 14.3 Frontend Scalability

| Risk | Details |
|------|---------|
| No code splitting | All admin pages in one bundle |
| No service worker / PWA | No offline capability |
| No CDN for static assets | No asset caching strategy |
| mockStore in production bundle | Dead code increases bundle size |

---

## 15. Remaining Production Blockers

### 🔴 BLOCKERS — Must Fix Before Go-Live

| # | Blocker | Location | Effort |
|---|---------|----------|--------|
| P1 | Home page CMS reads localStorage — content not persisted in DB | cms/home/*/ services | 3 days |
| P2 | HOD leave approval is a no-op console.warn | hodService.ts | 1 day |
| P3 | HOD timetable returns static mock | hodService.ts | 1 day |
| P4 | Password reset endpoints missing | auth.routes.js | 2 days |
| P5 | Placement secondary data (companies, TNP team, etc.) 100% mock | placementService.ts | 2 days |
| P6 | Registration requests not built anywhere | examService.ts | 2 days |
| P7 | footerService swallows save errors silently | footerService.ts | 0.5 days |
| P8 | CONTENT_EDITOR role orphaned in routes | seo.routes.js, navigation.routes.js | 0.5 days |
| P9 | departments table missing hod_name, contact, established fields | schema | 1 day |
| P10 | No validation on auth/login endpoint | auth.routes.js | 0.5 days |
| P11 | Gallery has no album structure — mediaService fakes it by category | DB + service | 2 days |
| P12 | SEO data not dynamic on any public page | Frontend pages | 3 days |
| P13 | No React Query / data fetching layer — duplicate requests, no caching | Frontend | 2 days |

### 🟡 SHOULD FIX — Important for Quality

| # | Issue | Effort |
|---|-------|--------|
| S1 | Validation Zod schemas on all backend write routes | 3 days |
| S2 | JWT in httpOnly cookie instead of localStorage | 2 days |
| S3 | Refresh token mechanism | 2 days |
| S4 | HOD downloads wired to real /downloads API | 0.5 days |
| S5 | Lazy loading admin route bundles | 1 day |
| S6 | Server-side pageSize cap (max 100) | 0.5 days |
| S7 | Structured data (JSON-LD) for SEO | 2 days |
| S8 | Canonical URLs on all public pages | 1 day |
| S9 | File type + size validation on upload middleware | 0.5 days |
| S10 | Department page missing rich fields (about paragraphs, infra) | 2 days |
| S11 | `getAlbumPhotos` broken — single item returned not photos array | 0.5 days |
| S12 | Audit log viewer in admin dashboard | 1 day |

---

## 16. SQL/Migration Fixes Needed

### Migration 011 — Departments Extended Fields
```sql
-- File: database/migrations/011_departments_extended.sql
USE college_website;

ALTER TABLE departments
  ADD COLUMN hod_name      VARCHAR(150) DEFAULT NULL  AFTER hod_user_id,
  ADD COLUMN hod_email     VARCHAR(150) DEFAULT NULL  AFTER hod_name,
  ADD COLUMN phone         VARCHAR(30)  DEFAULT NULL,
  ADD COLUMN established   VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN hod_message   TEXT         DEFAULT NULL;

-- For rich dept content, use CMS sections (dept.{slug}.profile) — no additional columns needed
```

### Migration 012 — Gallery Albums
```sql
-- File: database/migrations/012_gallery_albums.sql
USE college_website;

CREATE TABLE IF NOT EXISTS gallery_albums (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL,
  description   TEXT,
  cover_file_id INT          DEFAULT NULL,
  department_id INT          DEFAULT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_by    INT          NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_album_slug (slug),
  CONSTRAINT fk_galb_dept  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_galb_cover FOREIGN KEY (cover_file_id) REFERENCES files(id) ON DELETE SET NULL,
  CONSTRAINT fk_galb_user  FOREIGN KEY (created_by)    REFERENCES users(id) ON DELETE RESTRICT
);

ALTER TABLE gallery
  ADD COLUMN alt_text VARCHAR(255) DEFAULT NULL AFTER description,
  ADD COLUMN album_id INT DEFAULT NULL AFTER department_id,
  ADD CONSTRAINT fk_gallery_album FOREIGN KEY (album_id) REFERENCES gallery_albums(id) ON DELETE SET NULL;
```

### Migration 013 — Achievements Table (if not in 005)
```sql
-- File: database/migrations/013_achievements.sql  
USE college_website;

CREATE TABLE IF NOT EXISTS achievements (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  category      ENUM('STUDENT','FACULTY','DEPARTMENT','INSTITUTE') NOT NULL DEFAULT 'STUDENT',
  department_id INT          DEFAULT NULL,
  user_id       INT          DEFAULT NULL,
  awarded_date  DATE         DEFAULT NULL,
  image_file_id INT          DEFAULT NULL,
  status        ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  created_by    INT          NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_achiev_dept_status (department_id, status),
  CONSTRAINT fk_achiev_dept  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_achiev_user  FOREIGN KEY (user_id)       REFERENCES users(id)       ON DELETE SET NULL,
  CONSTRAINT fk_achiev_image FOREIGN KEY (image_file_id) REFERENCES files(id)       ON DELETE SET NULL,
  CONSTRAINT fk_achiev_by    FOREIGN KEY (created_by)    REFERENCES users(id)       ON DELETE RESTRICT
);
```

### Migration 014 — Registration Requests
```sql
-- File: database/migrations/014_registration_requests.sql
USE college_website;

CREATE TABLE IF NOT EXISTS registration_requests (
  id             INT          NOT NULL AUTO_INCREMENT,
  student_name   VARCHAR(200) NOT NULL,
  enrollment_no  VARCHAR(50)  DEFAULT NULL,
  department_id  INT          NOT NULL,
  course_id      INT          NOT NULL,
  semester       INT          NOT NULL,
  request_type   ENUM('NEW','RE_REGISTRATION') NOT NULL DEFAULT 'NEW',
  documents_json JSON         DEFAULT NULL,
  status         ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  remarks        TEXT         DEFAULT NULL,
  reviewed_by    INT          DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_reg_dept_status (department_id, status),
  CONSTRAINT fk_reg_dept     FOREIGN KEY (department_id) REFERENCES departments(id)  ON DELETE RESTRICT,
  CONSTRAINT fk_reg_course   FOREIGN KEY (course_id)     REFERENCES exam_courses(id) ON DELETE RESTRICT,
  CONSTRAINT fk_reg_reviewer FOREIGN KEY (reviewed_by)   REFERENCES users(id)        ON DELETE SET NULL
);
```

### Migration 015 — Performance Indexes
```sql
-- File: database/migrations/015_performance_indexes.sql
USE college_website;

-- Pagination / filter indexes
CREATE INDEX IF NOT EXISTS idx_notices_created  ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_pub_created ON news(published_at DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_date      ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_created  ON gallery(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_cat    ON downloads(category, status);

-- Composite indexes for dept-scoped queries
CREATE INDEX IF NOT EXISTS idx_faculty_dept_status ON faculty_profiles(department_id, status);
CREATE INDEX IF NOT EXISTS idx_gallery_dept_status ON gallery(department_id, status);
CREATE INDEX IF NOT EXISTS idx_downloads_dept_cat  ON downloads(department_id, category, status);

-- Marks performance
CREATE INDEX IF NOT EXISTS idx_marks_enrollment   ON exam_marks(enrollment_no);
CREATE INDEX IF NOT EXISTS idx_marks_subj_comp    ON exam_marks(subject_id, component_name, sub_component_name);

-- Full-text (if not in 010_indexes_fulltext.sql)
ALTER TABLE notices ADD FULLTEXT INDEX IF NOT EXISTS ft_notices (title, description);
ALTER TABLE news    ADD FULLTEXT INDEX IF NOT EXISTS ft_news    (title, excerpt, content);
ALTER TABLE faculty_profiles ADD FULLTEXT INDEX IF NOT EXISTS ft_faculty (bio, specialization);
```

### Migration 016 — CONTENT_EDITOR Role
```sql
-- File: database/migrations/016_content_editor_role.sql
USE college_website;

INSERT IGNORE INTO roles (role_name) VALUES ('CONTENT_EDITOR');
```

---

## 17. Final Backend Completion Plan

### Phase A — Critical Blockers (Week 1)

#### A1. Wire Home CMS to Backend
**Files:** `src/cms/home/*/service.ts` (12 files)

For EACH CMS service, replace localStorage read/write with:
```ts
// src/cms/home/hero/service.ts
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import { defaultHeroConfig, type HeroConfig } from './defaults'

export const getHeroConfig = async (): Promise<HeroConfig> =>
  getCmsSection('home.hero', defaultHeroConfig)

export const saveHeroConfig = async (data: HeroConfig): Promise<void> =>
  saveCmsSection('home.hero', data)
```
Apply same pattern to: about, director, news, academics, departments, stats, campus_life, faqs, gallery, seo, announcements.

#### A2. Wire HOD Leave Management
**File:** `src/services/hodService.ts`
```ts
export const getLeaveApplications = async (departmentId?: string): Promise<LeaveApplication[]> => {
  try {
    const params = departmentId ? { department_id: departmentId } : {}
    const res = await apiClient.get('/v1/leaves', { params })
    const raw = res.data?.data ?? []
    return raw.map(mapLeaveApplication)
  } catch {
    return [...mockLeaveApplications]
  }
}

export const approveLeave = async (id: string): Promise<void> => {
  await apiClient.put(`/v1/leaves/${id}/approve`)
}

export const rejectLeave = async (id: string, remarks?: string): Promise<void> => {
  await apiClient.put(`/v1/leaves/${id}/reject`, { remarks })
}
```

#### A3. Wire HOD Timetable
**File:** `src/services/hodService.ts`
```ts
export const getTimetableSlots = async (departmentId?: string): Promise<TimetableSlot[]> => {
  try {
    const params = departmentId ? { department_id: departmentId } : {}
    const res = await apiClient.get('/v1/timetables', { params })
    return mapTimetableSlots(res.data?.data ?? [])
  } catch {
    return [...mockTimetableSlots]
  }
}
```

#### A4. Fix footerService Error Handling
**File:** `src/services/footerService.ts`
```ts
// Replace cmsPut swallowing errors:
async function cmsPut(section: string, data: unknown): Promise<void> {
  await apiClient.put(`/v1/settings/cms/footer.${section}`, data)
  // Let error propagate — caller should show toast notification
}
```

#### A5. Add Auth Validation
**File:** `backend/src/modules/auth/auth.routes.js`
```js
const { z }         = require('zod');
const { validate }  = require('../../middlewares/validate.middleware');

const loginSchema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password min 6 chars'),
});

router.post('/login', authLimiter, validate(loginSchema), authController.login);
```

#### A6. Add Password Reset Flow
**File:** `backend/src/modules/auth/auth.routes.js`
```js
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password',  authLimiter, authController.resetPassword);
```

### Phase B — Dashboard Completion (Week 2)

#### B1. Wire Placement Companies/Drives/Stats to Backend
**File:** `src/services/placementService.ts`
```ts
export const getCompanies = async () => {
  const res = await apiClient.get('/v1/placement/companies')
  return res.data?.data ?? []
}
export const getDrives = async () => {
  const res = await apiClient.get('/v1/placement/drives')
  return res.data?.data ?? []
}
export const getYearlyStats = async () => {
  const res = await apiClient.get('/v1/placement/stats')
  return res.data?.data ?? []
}
```

#### B2. Wire HOD Labs and Achievements
**File:** `src/services/hodService.ts`
```ts
export const getHodLabs = async (departmentId?: string): Promise<HodLab[]> => {
  try {
    const params = departmentId ? { department_id: departmentId } : {}
    const res = await apiClient.get('/v1/labs', { params })
    return res.data?.data ?? []
  } catch {
    return [...mockHodLabs]
  }
}
```

#### B3. Build Registration Requests Backend
**File:** `backend/src/modules/registration/registration.routes.js`
- Add `GET /registration-requests` (EXAM_CONTROLLER, HOD)
- Add `PATCH /registration-requests/:id/status` (EXAM_CONTROLLER, HOD)

#### B4. Add pageSize Cap
**File:** `backend/src/utils/paginate.js`
```js
const paginate = (query) => {
  const page     = Math.max(1, parseInt(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(query.pageSize) || 20));
  const offset   = (page - 1) * pageSize;
  return { page, pageSize, offset };
};
module.exports = paginate;
```

### Phase C — Quality & Production Hardening (Week 3)

#### C1. Add Zod Validation to All Write Routes
Priority order: notices, news, events, faculty, departments, users, marks, placement

#### C2. Add React Query
```
npm install @tanstack/react-query
```
Wrap `App.tsx` with `QueryClientProvider` and replace `useEffect + useState` fetch patterns in each dashboard with `useQuery` / `useMutation`.

#### C3. Implement SEO on Public Pages
Install `react-helmet-async`, create `useSeoData(pageKey)` hook calling `GET /api/v1/seo/:pageKey`.

#### C4. Remove mockStore from Production Build
```ts
// In each service, guard mock imports:
const mockStore = import.meta.env.DEV 
  ? await import('../data/mockStore').then(m => m.mockStore)
  : null
```

#### C5. Implement Department Ownership Checks
Verify `leaves.service.js` and `timetables.service.js` scope queries by `req.user.department_id`.

#### C6. Add Refresh Token
Add `refresh_tokens` table, `POST /auth/refresh` route, and update client interceptor.

#### C7. Move JWT to httpOnly Cookie
Update auth controller to set `res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' })`.
Update `api/client.ts` to remove localStorage token read (token sent automatically via cookie).

---

## 18. Final Production Readiness Score

### Scoring Matrix

| Category | Max Points | Current Score | Notes |
|----------|-----------|--------------|-------|
| Backend API coverage | 20 | 14 | Most modules exist; password reset, dept fields, registration missing |
| Database design | 15 | 11 | Good normalization; missing labs/achievements/registration tables |
| Frontend-Backend integration | 20 | 9 | Home CMS, HOD leaves/timetable, placement secondary data all mock |
| RBAC & Security | 15 | 9 | Good foundation; no refresh token, CONTENT_EDITOR orphaned, no CSRF |
| Validation | 10 | 4 | Zod middleware exists but barely used |
| CMS completeness | 10 | 4 | Footer partial; home CMS 100% localStorage |
| Performance | 5 | 2 | No React Query, no server-side pagination, N+1 risks |
| SEO | 5 | 1 | No dynamic meta, no OG, no canonical |

**TOTAL: 54 / 100**

### Summary

```
🔴 NOT PRODUCTION READY

Critical gaps:
  1. Home page content = browser localStorage, not database
  2. HOD actions (leave approval, timetable) are no-ops
  3. Password reset entirely missing
  4. Half of placement dashboard is hardcoded arrays
  5. Zero Zod validation on most write endpoints
  6. No SEO on public pages

What IS production-quality:
  ✅ Auth system (JWT + RBAC)
  ✅ Exam/academic module (fully wired)
  ✅ Notices, News, Events, Tenders, Alerts (wired)
  ✅ File upload system (architecture correct)
  ✅ Audit logging
  ✅ Database schema (well-normalized, indexed)
  ✅ Error handling (centralized)
  ✅ Rate limiting

Estimated effort to reach production:
  Phase A (critical fixes):  ~8 developer-days
  Phase B (dashboard):       ~6 developer-days
  Phase C (hardening):       ~8 developer-days
  Total:                     ~22 developer-days (one developer)
```

---

*Generated: 2026-05-24 | SGSITS Production Audit v1.0*
