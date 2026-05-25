# SGSITS Backend — Untested & Partially Tested APIs Report

**Date:** 2026-05-25  
**Total API Endpoints (all routes):** ~120  
**Tested Endpoints:** ~57  
**Untested Endpoints:** **63**  
**Overall Endpoint Coverage:** ~47.5%

> **Note:** 389/389 tests pass. But those 389 tests cover only ~57 of ~120 distinct API endpoints.  
> This report lists every endpoint that has **zero test coverage** and every endpoint with **partial coverage gaps**.

---

## Summary by Module

| Module | Total Endpoints | Tested | Untested | Coverage |
|--------|:-:|:-:|:-:|:-:|
| Auth | 6 | 4 | **2** | 67% |
| Users | 6 | 6 | 0 | 100% |
| Departments | 7 | 6 | **1** | 86% |
| Files | 6 | 5 | **1** | 83% |
| Faculty | 20 | 14 | **6** | 70% |
| Notices | 6 | 6 | 0 | 100% |
| Downloads | 7 | 6 | **1** | 86% |
| Events | 6 | 6 | 0 | 100% |
| Gallery | 11 | 6 | **5** | 55% |
| Pages | 6 | 6 | 0 | 100% |
| Exam | 10 | 10 | 0 | 100% |
| Placement Core | 5 | 5 | 0 | 100% |
| **Placement Extra** | **14** | **0** | **14** | **0%** |
| News | 7 | 7 | 0 | 100% |
| Tenders | 6 | 6 | 0 | 100% |
| Alerts | 6 | 6 | 0 | 100% |
| Settings + CMS | 7 | 7 | 0 | 100% |
| Academic Basic | 10 | 10 | 0 | 100% |
| **Academic Marks + ATKT** | **22** | **0** | **22** | **0%** |
| Audit Logs | 3 | 3 | 0 | 100% |
| Leaves | 5 | 4 | **1** | 80% |
| Timetables | 7 | 7 | 0 | 100% |
| Labs | 5 | 5 | 0 | 100% |
| Achievements | 6 | 5 | **1** | 83% |
| Registration Requests | 4 | 3 | **1** | 75% |
| Navigation | 2 | 2 | 0 | 100% |
| SEO | 3 | 3 | 0 | 100% |
| Contact | 4 | 4 | 0 | 100% |
| Analytics | 2 | 2 | 0 | 100% |
| Notifications | 5 | 5 | 0 | 100% |
| Chatbot Config | 6 | 6 | 0 | 100% |
| Chat RAG | 1 | 1 | 0 | 100% |
| Search | 1 | 1 | 0 | 100% |

---

## Section 1 — Authentication (2 untested)

### ❌ `POST /api/v1/auth/forgot-password`
**Risk: HIGH — Critical security flow**  
**What it does:** Accepts `{email}`, generates a time-limited reset token, sends an email with a reset link.  
**Why untested:** Requires email delivery infrastructure (SMTP/Mailtrap) to verify the email was sent; token generation logic is untested.  
**What to test:**
- Valid email that exists → 200, token generated
- Unknown email → 200 (should not leak user existence) or 404
- Invalid email format → 400/422
- Rate limiting after many requests
- Token expiry (integration test)

---

### ❌ `POST /api/v1/auth/reset-password`
**Risk: HIGH — Critical security flow**  
**What it does:** Accepts `{token, newPassword}`, validates the token, updates the password.  
**Why untested:** Depends on a valid token from `forgot-password`; end-to-end flow requires two requests.  
**What to test:**
- Valid token + valid password → 200
- Expired/invalid token → 400/401
- Token already used (replay attack) → 400
- Weak password (below policy) → 400/422
- Missing fields → 422

---

## Section 2 — Departments (1 untested)

### ❌ `DELETE /api/v1/departments/:id`
**Risk: HIGH — Destructive, cascades to faculty, notices, downloads**  
**Allowed roles:** CENTRAL_ADMIN  
**What it does:** Soft-deletes or hard-deletes a department record.  
**Why untested:** Risky to delete in integration tests because it cascades to all department-scoped data (faculty, notices, events, gallery).  
**What to test:**
- Admin deletes department → 200
- Delete department that still has active faculty → 400/409 or cascade?
- Non-admin cannot delete → 403
- Delete non-existent department → 404

---

## Section 3 — Files (1 untested)

### ❌ `PATCH /api/v1/files/link/:id`
**Risk: LOW**  
**Allowed roles:** Owner or CENTRAL_ADMIN  
**What it does:** Updates metadata of an external-link attachment (title, description, url, etc.) without re-creating the record.  
**What to test:**
- Owner updates link metadata → 200
- Non-owner updates → 403
- Update with SSRF URL (private IP) → 400
- Update non-existent link → 404

---

## Section 4 — Faculty (6 untested)

### ❌ `PUT /api/v1/faculty/me/research/:itemId` (TEACHER)
**Risk: LOW**  
**What it does:** Updates a specific research project owned by the authenticated teacher.  
**What to test:**
- Teacher updates own research title/type → 200
- Teacher updates another teacher's research → 403
- Invalid itemId → 404

---

### ❌ `PUT /api/v1/faculty/me/qualifications/:itemId` (TEACHER)
**Risk: LOW**  
**What it does:** Updates a specific qualification entry owned by the authenticated teacher.  
**What to test:**
- Teacher updates own qualification → 200
- Non-existent itemId → 404

---

### ❌ `GET /api/v1/faculty/:id/research` (PUBLIC)
**Risk: LOW**  
**What it does:** Returns the public research list for a specific faculty member.  
**What to test:**
- Valid faculty ID with research records → 200, array
- Faculty ID with no research → 200, empty array
- Invalid faculty ID → 404

---

### ❌ `GET /api/v1/faculty/:id/qualifications` (PUBLIC)
**Risk: LOW**  
**What it does:** Returns the public qualifications list for a specific faculty member.  
**What to test:**
- Valid faculty ID → 200, array with degree/institution/year fields
- Invalid faculty ID → 404

---

### ❌ `DELETE /api/v1/faculty/:id`
**Risk: MEDIUM — Removes faculty profile from public listing**  
**Allowed roles:** CENTRAL_ADMIN, HOD (own dept)  
**What it does:** Soft-deletes a faculty profile.  
**What to test:**
- HOD deletes faculty in own dept → 200
- HOD deletes faculty in different dept → 403
- TEACHER cannot delete → 403
- Delete with valid id → 200 (profile disappears from public GET)

---

## Section 5 — Downloads (1 untested)

### ❌ `PATCH /api/v1/downloads/:id/increment-count`
**Risk: LOW — Analytics only**  
**Allowed:** Public (no auth required)  
**What it does:** Increments the download counter each time a file is downloaded by a visitor.  
**Why important:** This is called by the frontend every time someone clicks a download link.  
**What to test:**
- PATCH with valid ID → 200, count increased
- PATCH with non-existent ID → 404
- Multiple PATCHes → count increments each time

---

## Section 6 — Gallery Albums (5 untested — entire sub-resource)

### ❌ `GET /api/v1/gallery/albums`
### ❌ `GET /api/v1/gallery/albums/:slug`
### ❌ `POST /api/v1/gallery/albums`
### ❌ `PUT /api/v1/gallery/albums/:id`
### ❌ `DELETE /api/v1/gallery/albums/:id`

**Risk: MEDIUM — Gallery is a public-facing feature**  
**Allowed:** GET = public; POST/PUT/DELETE = CENTRAL_ADMIN or HOD  
**What they do:** Albums are named containers for gallery photos (e.g., "Annual Day 2025", "Convocation 2024"). Currently gallery tests only test flat photo items without albums.  
**What to test for each:**
- POST album (admin) → 201 with slug auto-generated
- GET albums (public) → 200 list
- GET album by slug → correct album with photos
- PUT album → updates name/description
- DELETE album → 200 (photos become album-less or cascade?)
- HOD album in own dept → 200; different dept → 403
- TEACHER cannot create albums → 403

---

## Section 7 — Placement Extra Resources (14 untested — entire section is 0% covered)

This is the largest untested area. The `placement.extra.controller` provides structured entities that are distinct from the legacy `placement.records` (NOTICE/COMPANY_VISIT/PLACEMENT_RECORD types).

### ❌ `GET /api/v1/placement/companies`
### ❌ `POST /api/v1/placement/companies`
### ❌ `PUT /api/v1/placement/companies/:id`
### ❌ `DELETE /api/v1/placement/companies/:id`

**What they do:** Manage a dedicated companies table (company name, website, package offered, sector).  
**Risk: MEDIUM** — Frontend placement page likely uses these for company cards.

---

### ❌ `GET /api/v1/placement/drives`
### ❌ `POST /api/v1/placement/drives`
### ❌ `PUT /api/v1/placement/drives/:id`
### ❌ `DELETE /api/v1/placement/drives/:id`

**What they do:** Manage placement drives (date, company, roles, package, eligible branches).  
**Risk: MEDIUM** — Core placement workflow endpoint.

---

### ❌ `GET /api/v1/placement/internships`
### ❌ `POST /api/v1/placement/internships`
### ❌ `PUT /api/v1/placement/internships/:id`
### ❌ `DELETE /api/v1/placement/internships/:id`

**What they do:** Manage internship opportunities (company, duration, stipend, domain).  
**Risk: MEDIUM** — Student-facing resource.

---

### ❌ `GET /api/v1/placement/stats`
### ❌ `POST /api/v1/placement/stats`

**What they do:** Store and retrieve yearly placement statistics (total placed, avg package, highest package, per-branch breakdown).  
**Risk: HIGH** — This is prominently displayed on the homepage/placement page. Incorrect data here is highly visible.  
**What to test:**
- POST stats (year, total_placed, avg_package, highest_package) → 200 upserted
- GET stats → array with yearly breakdown
- Invalid year format → 400/422
- Only PLACEMENT_OFFICER/CENTRAL_ADMIN can write → 403 for others

---

## Section 8 — Academic (22 untested — entire marks + ATKT + correction workflow)

This is the second-largest gap. The academic marks workflow (data entry for student marks by teachers) is completely untested.

### ❌ `GET /academic/sessions/download`
**Allowed:** CENTRAL_ADMIN, EXAM_CONTROLLER, HOD  
**What it does:** Exports session data (students + subjects) as CSV.  
**Risk: MEDIUM** — Data export used for official records.

---

### ❌ `PATCH /academic/sessions/:id/active`
**Allowed:** CENTRAL_ADMIN, EXAM_CONTROLLER  
**What it does:** Sets a session as the active/current academic session.  
**Risk: HIGH** — Setting wrong session as active affects all marks entry.  
**What to test:**
- Set session active → 200, previous session deactivated
- Non-exam role cannot set active → 403

---

### ❌ `GET /academic/faculty`
### ❌ `POST /academic/faculty/assign`
**Allowed:** GET: CENTRAL_ADMIN, HOD, EXAM_CONTROLLER; POST: HOD only  
**What it does:** Lists faculty assigned to department; assigns a teacher to a subject section.  
**Risk: HIGH** — Faculty assignment is prerequisite for marks entry.

---

### ❌ `GET /academic/course-outcomes`
### ❌ `POST /academic/course-outcomes`
**Allowed:** TEACHER, HOD  
**What it does:** Teachers submit course learning outcomes for each subject.

---

### ❌ `GET /academic/electives`
### ❌ `POST /academic/electives/upload`
**Allowed:** GET: any authenticated; POST: HOD, EXAM_CONTROLLER  
**What it does:** Bulk uploads student elective subject choices.

---

### ❌ `GET /academic/marks/test-details`
### ❌ `POST /academic/marks/test-details`
### ❌ `DELETE /academic/marks/test-details`
**Allowed:** TEACHER, EXAM_CONTROLLER  
**What they do:** Manage internal test/assignment structure (test name, max marks, weightage) before marks entry.  
**Risk: HIGH** — Test structure must exist before marks can be saved.

---

### ❌ `GET /academic/marks`
**Allowed:** TEACHER  
**What it does:** Fetches the marks entry grid for the authenticated teacher's assigned subjects.

---

### ❌ `POST /academic/marks/save`
### ❌ `POST /academic/marks/submit`
**Allowed:** TEACHER  
**What they do:**  
- `save` — persists marks as DRAFT (editable)  
- `submit` — locks marks and sends for EXAM_CONTROLLER review  
**Risk: CRITICAL** — Core data entry workflow. Bugs here corrupt student academic records.

---

### ❌ `GET /academic/marks/fill-requests`
### ❌ `POST /academic/marks/fill-requests`
**Allowed:** EXAM_CONTROLLER, TEACHER  
**What they do:** EXAM_CONTROLLER creates fill-requests to open a marks entry window; teachers list open requests.

---

### ❌ `GET /academic/atkt/students`
### ❌ `POST /academic/atkt/students/upload`
**Allowed:** TEACHER, EXAM_CONTROLLER  
**What they do:** ATKT (allowed to keep terms) = students who failed and need re-examination. Upload bulk student list.

---

### ❌ `GET /academic/atkt/test-details`
### ❌ `POST /academic/atkt/test-details`
### ❌ `GET /academic/atkt/marks`
### ❌ `POST /academic/atkt/marks/save`
### ❌ `POST /academic/atkt/marks/submit`
**What they do:** Same marks workflow as regular marks but specifically for ATKT students.  
**Risk: HIGH** — ATKT results determine if students progress to next semester.

---

### ❌ `GET /academic/correction-requests`
### ❌ `POST /academic/correction-requests`
### ❌ `PATCH /academic/correction-requests/:id/status`
### ❌ `DELETE /academic/correction-requests/:id`
### ❌ `GET /academic/correction-requests/:id/marks`
### ❌ `POST /academic/correction-requests/resubmit`
**What they do:** Correction request workflow — teachers submit requests to re-enter marks after submission; EXAM_CONTROLLER approves/rejects; teacher resubmits corrected marks.  
**Risk: HIGH** — Affects final student marks if approved corrections are lost.

---

### ❌ `POST /academic/students/upload`
**Allowed:** CENTRAL_ADMIN, EXAM_CONTROLLER  
**What it does:** Bulk imports student enrollment data from CSV.  
**Risk: HIGH** — Bad CSV import can corrupt entire semester's student roster.

---

## Section 9 — Leaves (1 untested)

### ❌ `PUT /api/v1/leaves/:id/reject`
**Risk: LOW**  
**Allowed:** HOD, CENTRAL_ADMIN  
**What it does:** Rejects a leave request (changes status to REJECTED, sets review_remarks).  
**Contrast:** `approve` IS tested (34.7). Reject is the symmetric case.  
**What to test:**
- HOD rejects leave → 200, status=REJECTED
- HOD cannot reject leaves from another dept → 403
- Cannot reject already-approved leave → 400 or still 200?

---

## Section 10 — Achievements (1 untested)

### ❌ `PATCH /api/v1/achievements/:id/status`
**Risk: LOW**  
**Allowed:** HOD, CENTRAL_ADMIN  
**What it does:** Toggles achievement visibility (ACTIVE/INACTIVE) without deleting.  
**What to test:**
- Admin patches status INACTIVE → achievement hidden from public list
- Patch back to ACTIVE → reappears
- Non-admin cannot patch → 403

---

## Section 11 — Registration Requests (1 untested)

### ❌ `PUT /api/v1/registration-requests/:id/reject`
**Risk: LOW**  
**Allowed:** HOD, CENTRAL_ADMIN  
**What it does:** Rejects a registration request (symmetric to `approve`).  
**Contrast:** `approve` IS tested (36.7). Reject is not.  
**What to test:**
- Admin rejects request → 200
- Cannot reject already-approved request → 400?

---

## Section 12 — Partially Tested Endpoints (not untested, but coverage gaps)

These endpoints ARE tested, but important scenarios are missing:

### `POST /auth/login` — Missing coverage:
- Account locked after N failed attempts (rate limiter behavior)
- Deactivated/INACTIVE user login → should return 401 or 403

### `GET /notices` — Missing coverage:
- `?notice_type=EXAM` filter
- `?notice_type=PLACEMENT` filter
- `?department_id=X` filter (department-scoped view)
- Pagination (`?page=2&limit=5`)

### `GET /users` — Missing coverage:
- Pagination (`?page=2`)
- `?status=INACTIVE` filter
- `?search=email_keyword`

### `GET /faculty` — Missing coverage:
- `?status=INACTIVE` filter
- Pagination

### `GET /downloads` — Missing coverage:
- `?department_id=X` filter
- `?category=X` filter
- Pagination

### `POST /files/upload` — Missing coverage:
- Upload file > max size → 413
- Upload with wrong MIME for notices usage (only PDF allowed)
- Unauthenticated upload → 401

### `GET /audit-logs` — Missing coverage:
- Date range filter (`?from=&to=`)
- Pagination
- `?module_name=downloads` etc.

### `PUT /registration-requests/:id/approve` — Missing coverage:
- Approve already-approved request → idempotent or 400?
- HOD approves request from different dept → 403?

### `DELETE /faculty/:id` — Entirely untested (listed above)

### Gallery — `GET /gallery` — Missing coverage:
- `?department_id=X` filter
- `?album_id=X` filter
- Pagination

---

## Section 13 — Endpoints That Do Not Exist (Frontend May Expect)

These are patterns the frontend might call based on standard REST conventions, but the backend does NOT implement them:

| Expected Endpoint | Status | Notes |
|---|---|---|
| `GET /navigation/:id` | ❌ DOES NOT EXIST | Navigation uses replace-all (`PUT /navigation`); no per-item GET |
| `POST /navigation` | ❌ DOES NOT EXIST | Only `PUT /navigation` (replace-all) exists |
| `DELETE /navigation/:id` | ❌ DOES NOT EXIST | Must use replace-all to remove an item |
| `GET /settings/cms/:section` returning array | ⚠️ RETURNS SINGLE OBJECT | Returns one section blob, not array |
| `DELETE /notices` (bulk delete) | ❌ DOES NOT EXIST | Only single DELETE /:id |
| `PATCH /academic/sessions/:id` (update fields) | ❌ DOES NOT EXIST | Only `PATCH /:id/active` exists |
| `GET /placement/records?type=COMPANY_VISIT` | ⚠️ SEPARATE ENDPOINTS | Each type has its own GET route (`/company-visits`, `/notices`, etc.) |
| `DELETE /audit-logs/:id` | ❌ DOES NOT EXIST | Audit logs are immutable; no delete |

---

## Priority Ranking: What to Test Next

| Priority | Endpoint(s) | Reason |
|---|---|---|
| 🔴 P0 — Critical | `POST /auth/forgot-password` + `reset-password` | Security flow, password reset is user-facing |
| 🔴 P0 — Critical | `POST /academic/marks/save` + `submit` | Core data workflow; bugs corrupt academic records |
| 🔴 P0 — Critical | `POST /academic/marks/fill-requests` | Required before marks entry opens |
| 🔴 P0 — Critical | `PATCH /academic/sessions/:id/active` | Wrong active session = all marks go to wrong semester |
| 🟠 P1 — High | `POST /academic/atkt/marks/save` + `submit` | ATKT marks critical for student progression |
| 🟠 P1 — High | `GET/POST /placement/stats` | Homepage stat display |
| 🟠 P1 — High | `POST /academic/faculty/assign` | Prerequisite for marks entry workflow |
| 🟠 P1 — High | `POST /academic/correction-requests` | Error-correction safety net |
| 🟡 P2 — Medium | Gallery albums (5 endpoints) | Public-facing photo organization |
| 🟡 P2 — Medium | `DELETE /departments/:id` | Cascade risk |
| 🟡 P2 — Medium | Placement companies/drives/internships (12 endpoints) | Placement portal completeness |
| 🟡 P2 — Medium | `PATCH /downloads/:id/increment-count` | Analytics accuracy |
| 🟢 P3 — Low | `PUT /faculty/me/research/:itemId` | Update scenarios |
| 🟢 P3 — Low | `PUT /faculty/me/qualifications/:itemId` | Update scenarios |
| 🟢 P3 — Low | `PUT /leaves/:id/reject` | Symmetric to approve |
| 🟢 P3 — Low | `PUT /registration-requests/:id/reject` | Symmetric to approve |
| 🟢 P3 — Low | `PATCH /achievements/:id/status` | Status toggle |
| 🟢 P3 — Low | `PATCH /files/link/:id` | Metadata update |
| 🟢 P3 — Low | `GET /faculty/:id/research` + `qualifications` | Public profile reads |
| 🟢 P3 — Low | `DELETE /faculty/:id` | Low-frequency admin action |
| 🟢 P3 — Low | `POST /academic/students/upload` | Bulk import (CSV setup needed) |

---

## Test Files to Create

| New Test File | Phase | Endpoints to Cover |
|---|---|---|
| `auth-password-reset.test.js` | Phase 1B | forgot-password, reset-password (mocked email) |
| `placement-extra.test.js` | Phase 12B | companies, drives, internships, stats (14 endpoints) |
| `academic-marks.test.js` | Phase 33B | marks test-details, marks save/submit, fill-requests |
| `academic-atkt.test.js` | Phase 33C | ATKT students, test-details, marks save/submit |
| `academic-corrections.test.js` | Phase 33D | correction requests full flow |
| `academic-workflow.test.js` | Phase 33E | faculty assign, session activate, session download |
| `gallery-albums.test.js` | Phase 9B | album CRUD + slug access |
| `faculty-delete.test.js` | Phase 5B | DELETE /faculty/:id, PUT research/qualifications updates |
| `misc-gaps.test.js` | Phase 40 | downloads increment-count, leaves reject, registration reject, achievements status, files link update |

---

*Report generated 2026-05-25 — based on complete route inspection of 31 route files across all backend modules.*
