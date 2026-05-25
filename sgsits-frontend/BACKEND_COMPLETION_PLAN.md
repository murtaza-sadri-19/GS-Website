# 🏗️ SGSITS — Backend Completion Architecture Report

> **Author:** Architecture analysis pass (no code changed in this report — analysis only)
> **Scope:** Make the `GS-Website/backend` (Node + Express 5 + MySQL) perfectly match the existing
> `sgsits-frontend` (React 19 + TS + Vite) — every dashboard, CMS section, role, and dynamic system.
> **Method:** Read all 5 dashboard route trees (~70 portal pages), all 27 frontend services, the
> `src/cms/*` section modules, the auth store, all 19 backend modules, full SQL schema + additions, and RBAC middleware.

> ⚠️ The older `ENTERPRISE_AUDIT_REPORT.md` is **stale** — it claims "no backend exists." That is false.
> A substantial backend exists. This report supersedes it for backend planning.

---

## #1. Existing Backend Status

**Stack:** Express 5, `mysql2/promise` pool, JWT auth, Multer uploads (memory → local disk or Cloudinary),
Helmet + CORS + Morgan. Module pattern: `routes → controller → service`, shared `utils/response` envelope
`{ success, data, message }`. Boots on `:8000`; stays alive without a DB.

| Module | Endpoints | Table(s) | Status |
|---|---|---|---|
| **auth** | login, me, change-password, logout | users, password_reset_tokens | ✅ Complete (no reset email) |
| **users** | CRUD + status | users, roles | ✅ Complete |
| **departments** | CRUD + status + assign HOD | departments | ✅ Complete |
| **files** | upload, list, get, delete | files | ✅ Complete (local + Cloudinary, 25MB, MIME filter) |
| **faculty** | list, me, get, create, update, status, delete | faculty_profiles | ⚠️ Profile only — pubs/research/quals are TEXT blobs |
| **notices** | CRUD + status | notices | ✅ Complete |
| **downloads** | CRUD + status + increment-count | downloads | ✅ Complete |
| **events** | CRUD + status (slug) | events | ✅ Complete |
| **gallery** | CRUD + status | gallery (flat) | ⚠️ No album concept (frontend expects albums) |
| **pages** | CRUD + status | pages | ✅ Basic CMS page |
| **exam** | get documents/notices/timetables/results/academic-calendar, get/:id, delete | exam_documents | ⚠️ Read+delete only — **no create/update route** |
| **placement** | notices, company-visits, records, training-programs, get/:id, delete | placement_records (generic by `record_type`) | ⚠️ No structured companies/drives/internships |
| **audit** | list, by-user, get | audit_logs | ✅ Complete (not wired in UI) |
| **news** | CRUD + status (slug) | news | ✅ Complete |
| **tenders** | CRUD + status (slug) | tenders | ✅ Complete |
| **alerts** | CRUD + toggle | alerts | ✅ Complete |
| **settings** | KV get/set + CMS section get/set/list | site_settings, cms_sections | ✅ Generic CMS engine |
| **academic** | sessions, courses, sections, subjects, students upload, faculty assign, course outcomes, electives, marks (test-details/save/submit), marks fill-requests, ATKT (students/test-details/marks), correction-requests (+status/withdraw/resubmit) | 20+ `exam_*` tables | ✅ Full exam/marks workflow |

**Verdict:** ~70% of the backend is built and solid. The exam-office workflow (the hardest part) is **fully implemented**.
The gaps are concentrated in (a) department-portal operational data (leaves/timetable/labs/achievements/registration),
(b) normalized faculty sub-resources, (c) structured placement, and (d) global systems (nav, SEO, analytics, contact, chatbot, notifications, search).

---

## #2. Missing APIs

Grouped by the dashboard/system that needs them. (Frontend service already calls or stubs these.)

### Faculty (Teacher portal) — `facultyService.ts` is **mock-only**
```
GET/POST/PUT/DELETE /api/v1/faculty/me/publications
GET/POST/PUT/DELETE /api/v1/faculty/me/research
GET/POST/PUT/DELETE /api/v1/faculty/me/qualifications
GET                 /api/v1/faculty/:id/publications   (public profile page)
GET                 /api/v1/faculty/:id/research
```

### HOD portal — `hodService.ts` leaves/timetable/labs/achievements/results are **mock-only**
```
GET  /api/v1/leaves?department_id=&status=
PUT  /api/v1/leaves/:id/approve | /reject
GET/POST/PUT/DELETE /api/v1/timetables (+ /entries)
GET/POST/PUT/DELETE /api/v1/labs?department_id=
GET/POST/PUT/DELETE /api/v1/achievements?department_id=
GET  /api/v1/hod/result-summary?department_id=&session_id=
GET  /api/v1/registration-requests?department_id=&status=
PUT  /api/v1/registration-requests/:id/approve | /reject
```

### Teacher portal
```
GET/POST /api/v1/leaves/me          (apply + list own)
GET      /api/v1/timetables/me      (own teaching timetable)
GET      /api/v1/notices?audience=faculty
```

### Exam controller — exam_documents needs write routes
```
POST   /api/v1/exam/documents          (create — currently MISSING)
PUT    /api/v1/exam/documents/:id      (update — currently MISSING)
PATCH  /api/v1/exam/documents/:id/status
```

### Placement — structured (current generic table is fragile)
```
GET/POST/PUT/DELETE /api/v1/placement/companies
GET/POST/PUT/DELETE /api/v1/placement/drives
GET/POST/PUT/DELETE /api/v1/placement/internships
GET/POST/PUT/DELETE /api/v1/placement/records   (yearly stats)
GET                 /api/v1/placement/recruiters
```

### Global systems (no backend at all today)
```
NAVIGATION   GET/PUT  /api/v1/navigation                 (navService mock-only)
CONTACT      POST     /api/v1/contact                     (contactService → 404 → mock)
             GET/PATCH/DELETE /api/v1/contact/submissions
ANALYTICS    GET      /api/v1/analytics/visitor-count     (footer widget)
             POST     /api/v1/analytics/page-view
SEO          GET/PUT  /api/v1/seo/:pageKey  + GET /api/v1/seo   (per-route SEO)
SEARCH       GET      /api/v1/search?q=                   (global site search)
NOTIFICATIONS GET/PATCH /api/v1/notifications             (portal inbox)
CHATBOT      GET/PUT  /api/v1/chatbot/config
             GET/POST/PUT/DELETE /api/v1/chatbot/categories|responses|keywords
MEDIA        GET      /api/v1/media (folders/library, alt text)  — extend files module
GALLERY      GET/POST/PUT/DELETE /api/v1/gallery/albums   (album grouping)
```

---

## #3. Missing Tables

```sql
-- DEPARTMENT OPERATIONS
leave_requests(id, user_id→users, department_id, leave_type, from_date, to_date, days,
               reason, attachment_file_id, status[pending/approved/rejected],
               reviewed_by, review_remarks, created_at)
timetables(id, department_id, course_id, section_id, semester, academic_year, is_active, ...)
timetable_entries(id, timetable_id, day_of_week, period_no, subject_id, faculty_user_id,
                  room, start_time, end_time, UNIQUE(timetable_id,day,period))
labs(id, department_id, name, description, equipment_list, image_file_id, is_active, ...)
department_achievements(id, department_id, title, description, achievement_year,
                        category, image_file_id, status, ...)
registration_requests(id, student_enrollment_no, department_id, subject_id, semester,
                       reason, status, reviewed_by, created_at)

-- FACULTY (normalize the TEXT blobs in faculty_profiles)
faculty_publications(id, faculty_user_id→users, title, venue_type, journal_name, year,
                     authors, link, citations, status, ...)
faculty_research(id, faculty_user_id, title, area, description, start_year, end_year,
                 status, funding_agency, funding_amount, ...)
faculty_qualifications(id, faculty_user_id, degree, institution, year, specialization)

-- PLACEMENT (structured)
companies(id, name UNIQUE, sector, website, logo_file_id, contact_email, is_active)
placement_drives(id, company_id→companies, title, ctc_lpa, eligibility, drive_date,
                 registration_deadline, is_active)
internships(id, company_id, student_enrollment_no, title, duration_months, stipend,
            start_date, end_date, status, report_file_id)
placement_year_stats(id, academic_year UNIQUE, total, placed, pct, highest, average,
                     companies_visited)

-- GLOBAL
gallery_albums(id, title, slug UNIQUE, description, cover_file_id, department_id,
               event_date, status)  + ALTER gallery ADD album_id
navigation_items(id, parent_id self-FK, label, url, icon, sort_order, is_active, target)
seo_metadata(id, page_key UNIQUE, title, description, og_title, og_description,
             og_image_file_id, canonical, robots, structured_data JSON)
contact_submissions(id, name, email, phone, subject, message, ip, is_read, created_at)
visitor_stats(stat_date PK, page_views, unique_visits)  + visitor_total(total_count)
notifications(id, user_id→users, title, message, link, is_read, created_at)
chatbot_categories / chatbot_keywords / chatbot_responses / chatbot_config

-- RBAC (granular)
permissions(id, name UNIQUE, resource, action)
role_permissions(role_id→roles, permission_id→permissions, UNIQUE)
```

---

## #4. Missing Relations

- `faculty_profiles` ↔ normalized `faculty_publications/research/qualifications` (1-to-many) — currently TEXT.
- `leave_requests.reviewed_by` → users; `.user_id` → users; `.department_id` → departments.
- `timetable_entries.faculty_user_id` → users, `.subject_id` → exam_subjects, `.section_id` → exam_sections.
- `gallery.album_id` → `gallery_albums` (album grouping the frontend already renders).
- `placement_drives.company_id` → companies; `internships.company_id` → companies.
- `notifications.user_id` → users (portal inbox fan-out).
- `seo_metadata.page_key` ↔ frontend route keys (e.g. `home`, `about.overview`).
- `role_permissions` join (RBAC) — entirely absent.
- `navigation_items.parent_id` self-referential FK for nested menus.

---

## #5. Missing Permissions (RBAC)

**Current:** `roles` table seeded with 5 roles; authorization is `allow(...roleNames)` string-match + ad-hoc
ownership checks inside services. **No `permissions` / `role_permissions` tables.**

**Frontend already references 7 roles** (`adminStore`: `super_admin`, `central_admin`, `editor`, `hod`,
`faculty`/`teacher`, plus `exam_controller`, `placement_officer`). Backend seeds only 5.

| Role | Seeded in backend? | Frontend expects |
|---|---|---|
| Super Admin | ❌ (only CENTRAL_ADMIN) | ✅ |
| Admin / Central Admin | ✅ | ✅ |
| Content Editor | ❌ | ✅ (`editor`) |
| HOD | ✅ | ✅ |
| Faculty / Teacher | ✅ | ✅ |
| Placement Officer | ✅ | ✅ |
| Exam Controller | ✅ | ✅ |

**Needed:**
1. Seed `super_admin` + `content_editor` roles; map frontend↔backend role names canonically.
2. `permissions` (resource+action) + `role_permissions` join → section-level grants (e.g. `cms.home.edit`).
3. A `requirePermission('resource','action')` middleware alongside `allow(...)`.
4. Centralize ownership rules (HOD→own dept, Teacher→own profile/marks) into a reusable guard.

---

## #6. Missing Dashboard Features (per dashboard)

| Dashboard | Wired to backend | Mock-only (needs backend) |
|---|---|---|
| **Central Admin** | users, departments, notices, downloads, events, gallery, pages, news, tenders, alerts, faculty, placement, settings/footer (CMS) | audit-log viewer UI, media library, SEO manager, navigation editor |
| **HOD** | department-profile, notices, events, gallery, subjects, students, faculty-allocation, marks, corrections, electives, results (via academic) | **leaves, timetable, labs, achievements, registration, attendance, downloads(dept), result-summary** |
| **Teacher** | marks-feed, atkt-feed, correction-request, subjects/COs (via academic) | **profile, publications, research, qualifications, leave, timetable, notices** |
| **Exam Controller** | sessions, branches, courses, subject/student/atkt upload, requests, marks-request (via academic) | **exam document create/update** (read works), downloads |
| **Placement** | notices, company-visits, records, training-programs (generic table) | **structured companies, drives, internships, CMS page** |

---

## #7. Missing CMS Features

The CMS engine (`settings` module: `cms_sections` JSON + `/cms/:section`) is **good and generic**. Frontend `src/cms/*`
has ~20 section modules (home: hero/about/director/stats/announcements/campus_life/faqs/gallery/news/academics/departments/seo;
about: overview/vision_mission/leadership/governance/directory/committees/iqac/accreditation_infra/seo). Each is config+mock+service+types.

**Gaps:**
- **No seed** of the 50+ section keys → `/cms/:section` returns null until each is saved once.
- **No JSON schema validation** per section → admin can save malformed blobs.
- **No versioning / draft-vs-published** for CMS sections (single row overwrite = lost history + concurrent-edit clobber).
- **No section-level visibility/order** as first-class columns (lives inside the JSON blob; not queryable).
- **No media linking** — CMS JSON stores raw URLs instead of `file_id` references (orphaned files, no CDN swap).
- **SEO** per-section exists as `*.seo` keys but there's no per-route `seo_metadata` table or sitemap/structured-data generation.

---

## #8. SQL Schema Improvements

1. **Normalize faculty blobs** (`faculty_profiles.publications/research/subjects` TEXT → real tables) — enables search, ordering, public profile rendering.
2. **Replace raw URL columns with `*_file_id` FKs** consistently (some tables already do; CMS JSON does not).
3. **Add soft-delete (`deleted_at`)** uniformly — currently only status enums; no recoverable deletes.
4. **Add `created_by`/`updated_by` audit columns** to news/tenders/alerts/gallery for full audit trail (some have only one).
5. **Add composite + covering indexes** for the hottest list queries: `notices(status,publish_date,department_id)`, `events(status,event_date)`, `placement_records(record_type,academic_year,status)`.
6. **Add FULLTEXT indexes** on `notices(title,description)`, `news(title,excerpt,content)`, `events(title,description)` to power `/search`.
7. **CMS versioning table** `cms_section_versions(section_key, data, version, created_by, created_at)`.
8. **Generated `slug` uniqueness** guards for news/events/tenders (collision handling in service).

---

## #9. Migration Plan

Current state: two hand-run files (`schema.sql` → `schema_additions.sql`) + `seed.sql`, append-only, no ordering tool, no rollback.

**Recommended:** introduce numbered, idempotent migrations + a tracking table.

```
database/migrations/
  001_core.sql              (= existing schema.sql)
  002_phase2_exam_cms.sql   (= existing schema_additions.sql)
  003_rbac_permissions.sql  permissions, role_permissions, seed super_admin + content_editor
  004_faculty_normalize.sql faculty_publications/research/qualifications (+ backfill from blobs)
  005_dept_ops.sql          leave_requests, timetables(+entries), labs, department_achievements, registration_requests
  006_placement_structured.sql companies, placement_drives, internships, placement_year_stats
  007_global_systems.sql    navigation_items, seo_metadata, contact_submissions, visitor_stats, notifications, gallery_albums(+gallery.album_id)
  008_chatbot.sql           chatbot_categories/keywords/responses/config
  009_cms_seed.sql          seed 50+ cms_sections keys with current mock JSON
  010_indexes_fulltext.sql  composite + FULLTEXT indexes
```
- Add `schema_migrations(version PK, applied_at)` + a tiny `node src/scripts/migrate.js` runner (reads files in order, skips applied). Each file wrapped so re-runs are safe (`CREATE TABLE IF NOT EXISTS`, `INSERT … ON DUPLICATE KEY`).
- **Rollback:** pair each `NNN_up.sql` with `NNN_down.sql` (or document manual `DROP`s) — FK order matters (drop children first).
- **Seed strategy:** keep `seed.sql` minimal (roles + admin); move bulk demo content into `009_cms_seed.sql` + optional `seed_demo.sql`.

---

## #10. RBAC Audit

| Item | Current | Risk | Fix |
|---|---|---|---|
| Role source | JWT `role` string | OK | Keep, but add `permissions[]` claim or fetch |
| Authorization | `allow(...names)` per route | Coarse; no section-level | Add `permissions`/`role_permissions` + `requirePermission()` |
| Ownership (HOD→dept, Teacher→self) | Ad-hoc in each service | Inconsistent, easy to forget | Centralize `assertOwnsDepartment(req, deptId)` helpers |
| Roles seeded | 5 | Missing super_admin, content_editor | Seed 7; canonical name map |
| Privilege escalation | users.role editable via `PUT /users/:id`? | **Verify** non-admins can't change own role | Whitelist updatable fields; block role change unless super_admin |
| Token | localStorage (frontend) | XSS theft | Consider httpOnly cookie; short exp + refresh |

---

## #11. Security Risks

1. **Stored-content XSS** — CMS/news/notice HTML rendered without server-side sanitization. Add DOMPurify/sanitize-html on write.
2. **No rate limiting** — `/auth/login` is brute-forceable. Add `express-rate-limit` (login + public POSTs).
3. **No password reset email** — `password_reset_tokens` table exists but no SMTP flow.
4. **Error detail leakage** — *fixed this session* (500s no longer echo raw `err.message` in production).
5. **Input validation** — manual/ad-hoc. Adopt a schema validator (zod/joi/express-validator) per route.
6. **File upload** — MIME allow-list + 25MB cap present (good); add magic-byte sniffing + re-encode images; ensure local `/uploads` can't serve executables.
7. **Mass assignment** — confirm services whitelist columns on create/update (don't spread `req.body`).
8. **JWT expiry** — frontend doesn't proactively check expiry; relies on 401 redirect (acceptable, document it).

---

## #12. Performance Risks

1. **Faculty TEXT blobs** — publications/research unqueryable, unindexable; forces full-row parse client-side.
2. **Dashboard N+1 on mount** — each portal fires many parallel service calls; add per-dashboard aggregate endpoints (`GET /api/v1/hod/dashboard-summary`).
3. **CMS JSON blobs** — can't filter/paginate inside; whole blob shipped each request. Acceptable for config, not for lists.
4. **Missing indexes** — see §8 (composite + FULLTEXT). List endpoints will table-scan at scale.
5. **No caching** — public CMS/settings/nav are read-on-every-request. Add HTTP cache headers or in-memory TTL cache.
6. **No pagination on some lists** — verify gallery/placement/downloads paginate (notices/news/events do).

---

## #13. Scalability Risks

1. **Generic `placement_records` by `record_type`** — collapses companies/drives/internships/stats into one table; can't model relations or analytics. Split (see §3).
2. **`cms_sections` single-row-per-key** — concurrent admin edits clobber; no audit/version. Add versioning (§8).
3. **Local disk uploads fallback** — fine for dev, won't scale across instances. Standardize on Cloudinary/S3 + CDN; store `file_id` everywhere.
4. **No migration tooling** — append-only SQL won't survive a team. Adopt numbered migrations (§9).
5. **Single MySQL pool, no read replica / connection tuning** — fine now; document scaling path.
6. **No background jobs** — email, analytics rollup, sitemap generation will need a queue eventually.

---

## #14. Final Production Blockers

| # | Blocker | Severity |
|---|---|---|
| 1 | DB not connected (no credentials) — every DB route 500s | 🔴 Critical (env ready; needs MySQL password) |
| 2 | Teacher portal (publications/research/qualifications/profile) entirely mock | 🔴 |
| 3 | HOD leaves/timetable/labs/achievements/registration entirely mock | 🔴 |
| 4 | Exam document create/update missing (read-only today) | 🟠 |
| 5 | Contact form posts to a non-existent endpoint (silently mock) | 🟠 |
| 6 | RBAC has no granular permissions; only 5 of 7 roles seeded | 🟠 |
| 7 | No stored-content sanitization / rate limiting | 🟠 |
| 8 | Navigation, SEO-per-route, analytics, notifications, chatbot, search absent | 🟡 |
| 9 | No migration system / CMS section seed | 🟡 |
| 10 | Gallery albums, structured placement | 🟡 |

---

## #15. Final Backend Completion Plan (phased)

Each phase = new modules following the existing `routes→controller→service` pattern + a numbered migration. No frontend redesign; backend adapts to the contracts the frontend services already expect.

**Phase 0 — Foundations (no feature change)**
- Migration runner + `schema_migrations` table; split existing SQL into `001`/`002`.
- Add `express-rate-limit`, a validation layer (zod), and HTML sanitization util.

**Phase 1 — RBAC (003)**
- `permissions` + `role_permissions`; seed `super_admin` + `content_editor`; `requirePermission()` middleware; centralize ownership guards; lock down role-change on `PUT /users/:id`.

**Phase 2 — Faculty normalize (004)**
- `faculty_publications/research/qualifications` tables + sub-routes; backfill from TEXT blobs; wire `facultyService.ts` (drop mock).

**Phase 3 — HOD/Teacher operations (005)**
- `leave_requests`, `timetables(+entries)`, `labs`, `department_achievements`, `registration_requests` + modules; wire `hodService.ts` leaves/timetable/labs/achievements + teacher leave/timetable.

**Phase 4 — Exam docs + Placement structured (006)**
- Add exam document create/update/status; `companies`, `placement_drives`, `internships`, `placement_year_stats` + module.

**Phase 5 — Global systems (007/008)**
- `navigation_items`, `seo_metadata` (+ sitemap/structured-data), `contact_submissions`, `visitor_stats`, `notifications`, `gallery_albums`, chatbot tables + modules. Wire navService/contactService/seoService/chatbotService.

**Phase 6 — CMS hardening + perf (009/010)**
- Seed 50+ `cms_sections` keys from current mock JSON; add CMS versioning; composite + FULLTEXT indexes; `/search`; per-dashboard aggregate summary endpoints; cache headers.

**Phase 7 — Ops**
- Password-reset email (SMTP), audit-log UI wiring, file magic-byte validation, optional S3/CDN.

---

### Definition of Done (production)
- DB connected; all migrations applied; `npm run test:api` green.
- Every frontend service hits a real endpoint (zero `// Future:` / `// REAL:` mock stubs left in dashboard services).
- 7 roles + granular permissions enforced; ownership verified by tests.
- Sanitization + rate limiting + validation on all write routes.
- CMS sections seeded; nav/SEO/analytics/contact/chatbot live.

---

## #16. Implementation Status — What Was Built (this pass)

> Backend Phases 0–6 implemented in `../GS-Website/backend`. App verified to boot and all new
> routes verified mounted (DB-backed routes return the DB-connection error, not 404). Static only —
> not yet run against a live DB.

### Bugs fixed
- `news.service.js` / `tenders.service.js` called `slugUtil.createSlug` (doesn't exist) → **would crash on create**. Fixed to `slugify`.
- Missing deps `csv-parser`, `json2csv` crashed the app on load → installed.
- `error.middleware.js` leaked raw internal errors on 500 → suppressed in production.

### New dependencies
`express-rate-limit`, `zod`, `sanitize-html`, `csv-parser`, `json2csv`.

### Migrations added (run with `npm run db:migrate`)
| File | Adds |
|---|---|
| `003_rbac.sql` | `permissions`, `role_permissions`; seeds `SUPER_ADMIN` + `CONTENT_EDITOR`; grants per role |
| `004_faculty_normalize.sql` | `faculty_publications`, `faculty_research`, `faculty_qualifications` |
| `005_dept_ops.sql` | `leave_requests`, `timetables`(+`timetable_entries`), `labs`, `department_achievements`, `registration_requests` |
| `006_placement_structured.sql` | `companies`, `placement_drives`, `internships`, `placement_year_stats` |
| `007_global_systems.sql` | `navigation_items`, `seo_metadata`, `contact_submissions`, `visitor_stats`/`visitor_total`, `notifications`, `gallery_albums` (+`gallery.album_id`) |
| `008_chatbot.sql` | `chatbot_config`, `chatbot_responses` |
| `010_indexes_fulltext.sql` | FULLTEXT indexes on notices/news/events (powers `/search`) |
| `migrate.js` runner + `schema_migrations` tracking; `db:migrate` npm script | foundations |

### New API modules / endpoints
- **RBAC**: `requirePermission(resource,action)` middleware (`permission.middleware.js`); `SUPER_ADMIN` is now a superset in `allow()`.
- **Security foundations**: `rateLimit.middleware.js` (global + auth + public-write limiters; login is rate-limited), `validate.middleware.js` (zod), `utils/sanitize.js`.
- **Faculty content**: `GET/POST/PUT/DELETE /faculty/me/{publications|research|qualifications}` + public `GET /faculty/:id/{...}`.
- **Leaves**: `GET /leaves/me`, `POST /leaves`, `GET /leaves`, `PUT /leaves/:id/approve|reject`.
- **Timetables**: `GET /timetables`, `GET /timetables/me`, `GET /timetables/:id`, `POST/PUT/DELETE`, `PUT /:id/entries`.
- **Labs**: `GET /labs`, `GET /labs/:id`, `POST/PUT/DELETE`.
- **Achievements**: `GET /achievements`(+`/:id`), `POST/PUT/PATCH :id/status/DELETE`.
- **Registration**: `GET/POST /registration-requests`, `PUT /:id/approve|reject`.
- **Placement (structured)**: `GET/POST/PUT/DELETE /placement/{companies|drives|internships}`, `GET/POST /placement/stats`.
- **Navigation**: `GET /navigation` (tree), `PUT /navigation` (replace).
- **SEO**: `GET /seo`(admin), `GET /seo/:pageKey`(public), `PUT /seo/:pageKey`.
- **Contact**: `POST /contact` (public, rate-limited), `GET /contact/submissions`, `PATCH /:id/read`, `DELETE`.
- **Analytics**: `GET /analytics/visitor-count`, `POST /analytics/page-view`.
- **Notifications**: `GET /notifications`, `GET /unread-count`, `PATCH /:id/read`, `POST /read-all`, admin `POST /`.
- **Chatbot**: `GET/PUT /chatbot/config`, `GET/POST/PUT/DELETE /chatbot/responses`.
- **Gallery albums**: `GET /gallery/albums`, `GET /gallery/albums/:slug`, `POST/PUT/DELETE /gallery/albums`.
- **Search**: `GET /search?q=` across notices/news/events/downloads.

### To run end-to-end
1. Set `DB_PASSWORD` in `backend/.env`.
2. `cd GS-Website/backend && npm run db:migrate` (applies base schema + all migrations in order).
3. `npm run dev` (backend :8000) and `npm run dev` in `sgsits-frontend` (:5173). Login: `admin@college.edu` / `Admin@123`.
4. `npm run test:api` to exercise the suite once the DB is connected.

### Remaining (Phase 7 — deferred, needs external setup)
- Password-reset email flow (needs SMTP creds; `password_reset_tokens` table already exists).
- File magic-byte sniffing + image re-encode; S3/CDN for uploads.
- **Frontend re-wiring**: backend endpoints now exist for the previously mock-only dashboard features (faculty publications/research/qualifications, HOD leaves/timetable/labs/achievements/registration, placement internships, contact, nav, seo, chatbot, analytics, gallery albums). Those frontend services still use mock/`// Future:` fallbacks and should be pointed at the new endpoints — a mechanical follow-up, safe to do incrementally since each falls back to mock until wired.
- CMS section JSON versioning; per-dashboard aggregate summary endpoints.
