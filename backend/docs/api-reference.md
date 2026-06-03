# API Reference

Base URL: `http://localhost:8000/api/v1`

All responses use the envelope:
```json
{ "success": true,  "message": "...", "data": { ... } }
{ "success": false, "message": "...", "detail": "..." }
```

Paginated list responses include:
```json
{
  "data": {
    "items": [...],
    "pagination": { "total": 120, "page": 1, "pageSize": 20, "totalPages": 6 }
  }
}
```

**Auth header** (all protected routes): `Authorization: Bearer <jwt>`

**Rate limits:**
- Global: 1 000 req / 15 min
- Auth endpoints: 10 req / 15 min
- Public write (contact): 20 req / 1 min

---

## Health

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | None | Returns `{ status: "ok", timestamp }` |

---

## Auth — `/auth`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/auth/login` | None | — | Log in. Body: `{ email, password }`. Returns `{ token, user }` |
| POST | `/auth/logout` | JWT | Any | Stateless logout — client discards token |
| GET | `/auth/me` | JWT | Any | Returns current user profile |
| POST | `/auth/change-password` | JWT | Any | Body: `{ oldPassword, newPassword }` |
| POST | `/auth/forgot-password` | None | — | Body: `{ email }`. Sends reset email. Always 200 |
| POST | `/auth/reset-password` | None | — | Body: `{ token, newPassword }`. Token valid 1 hour |

**Login response:**
```json
{
  "token": "eyJ...",
  "user": { "id": 1, "name": "Admin", "email": "admin@sgsits.ac.in", "role": "CENTRAL_ADMIN", "department_id": null }
}
```

---

## Users — `/users`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/users/roles` | JWT | Any | List all assignable roles |
| GET | `/users` | JWT | CENTRAL_ADMIN, HOD | List users. Query: `?role=TEACHER&department_id=3&status=ACTIVE&q=name&page=1&pageSize=20` |
| GET | `/users/:id` | JWT | CENTRAL_ADMIN | Get single user |
| POST | `/users` | JWT | CENTRAL_ADMIN, HOD | Create user. Body: `{ name, email, phone?, role_id, department_id? }`. Returns user + `initial_password` |
| PUT | `/users/:id` | JWT | CENTRAL_ADMIN | Update user. Body: any subset of `{ name, phone, role_id, department_id }` |
| PATCH | `/users/:id/status` | JWT | CENTRAL_ADMIN, HOD | Body: `{ status: "ACTIVE" | "INACTIVE" }` |
| DELETE | `/users/:id` | JWT | CENTRAL_ADMIN | Soft-delete (sets INACTIVE) |

**HOD restrictions** (enforced in service):
- Can list/create/update only TEACHER users in their own department
- Cannot deactivate other HODs or CENTRAL_ADMINs

---

## Departments — `/departments`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/departments` | None | — | List active departments. Query: `?status=ACTIVE&q=name` |
| GET | `/departments/:id` | None | — | Get department by ID |
| GET | `/departments/slug/:slug` | None | — | Get department by slug |
| POST | `/departments` | JWT | CENTRAL_ADMIN | Create. Body: `{ name, short_name?, description?, vision?, mission?, hod_user_id?, image_file_id? }` |
| PUT | `/departments/:id` | JWT | CENTRAL_ADMIN | Update |
| PATCH | `/departments/:id/status` | JWT | CENTRAL_ADMIN | Body: `{ status }` |
| DELETE | `/departments/:id` | JWT | CENTRAL_ADMIN | Soft-delete |

---

## Files — `/files`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/files/upload` | JWT | Any | Upload single file. `multipart/form-data`, field `file`, query `?usage=gallery`. Returns file record |
| POST | `/files/upload-multiple` | JWT | Any | Upload up to 20 files. Field `files`, query `?usage=gallery` |
| POST | `/files/link` | JWT | Any | Register external URL. Body: `{ external_url, original_name?, alt_text?, thumbnail_url?, usage? }` |
| PATCH | `/files/link/:id` | JWT | Owner or CENTRAL_ADMIN | Update external link metadata |
| GET | `/files` | JWT | CENTRAL_ADMIN | List all attachments. Query: `?attachment_type=FILE&usage=gallery&q=name&page=1&pageSize=20` |
| GET | `/files/:id` | JWT | Owner or CENTRAL_ADMIN | Get file metadata |
| DELETE | `/files/:id` | JWT | Owner or CENTRAL_ADMIN | Delete file (safe-delete: rejected if referenced by another table) |

**Valid `usage` values:** `gallery`, `faculty`, `events`, `departments`, `users`, `notices`, `exam`, `placement`, `downloads`, `tenders`, `admission`, `homepage`, `labs`, `achievements`, `research`, `cms`, `chatbot`, `pages`, `settings`

---

## Faculty — `/faculty`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/faculty` | None | — | List published faculty profiles. Query: `?department_id=1&q=name&page=1&pageSize=20` |
| GET | `/faculty/:id` | None | — | Get faculty profile |
| POST | `/faculty` | JWT | CENTRAL_ADMIN, HOD | Create profile. Body: `{ user_id, department_id, designation?, qualification?, specialization?, experience?, bio?, profile_image_file_id? }` |
| PUT | `/faculty/:id` | JWT | CENTRAL_ADMIN, HOD, TEACHER (own) | Update profile |
| DELETE | `/faculty/:id` | JWT | CENTRAL_ADMIN, HOD | Soft-delete |
| GET | `/faculty/:id/content` | None | — | Get faculty-managed content (publications, subjects, research) |
| PUT | `/faculty/:id/content` | JWT | TEACHER (own), HOD, CENTRAL_ADMIN | Update faculty content |

---

## Notices — `/notices`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/notices` | None | — | List published notices. Query: `?notice_type=GENERAL&department_id=1&q=text&page=1&pageSize=20` |
| GET | `/notices/:id` | None | — | Get single published notice |
| POST | `/notices` | JWT | CENTRAL_ADMIN, HOD, EXAM_CONTROLLER, PLACEMENT_OFFICER | Create. Body: `{ title, notice_type, description?, file_id?, department_id?, publish_date, status? }` |
| PUT | `/notices/:id` | JWT | Owner role | Update |
| PATCH | `/notices/:id/status` | JWT | Owner role | Body: `{ status: "DRAFT" | "PUBLISHED" | "ARCHIVED" }` |
| DELETE | `/notices/:id` | JWT | Owner role | Archives (soft-delete) |

**notice_type values:** `GENERAL`, `DEPARTMENT`, `EXAM`, `PLACEMENT`

**Role × notice_type rules:**
- HOD → DEPARTMENT only (own department)
- EXAM_CONTROLLER → EXAM only
- PLACEMENT_OFFICER → PLACEMENT only
- CENTRAL_ADMIN → any type

---

## Downloads — `/downloads`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/downloads` | None | — | List active downloads. Query: `?category=Forms&department_id=1&q=text&page=1&pageSize=20` |
| GET | `/downloads/:id` | None | — | Get download, increment counter |
| POST | `/downloads` | JWT | CENTRAL_ADMIN, HOD | Create. Body: `{ title, category, file_id, department_id? }` |
| PUT | `/downloads/:id` | JWT | CENTRAL_ADMIN, HOD | Update |
| PATCH | `/downloads/:id/status` | JWT | CENTRAL_ADMIN, HOD | Body: `{ status }` |
| DELETE | `/downloads/:id` | JWT | CENTRAL_ADMIN, HOD | Soft-delete |

---

## Events — `/events`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/events` | None | — | List published events. Query: `?department_id=1&upcoming=true&page=1&pageSize=20` |
| GET | `/events/:id` | None | — | Get single event |
| GET | `/events/slug/:slug` | None | — | Get event by slug |
| POST | `/events` | JWT | CENTRAL_ADMIN, HOD | Create. Body: `{ title, description?, event_date?, department_id?, cover_image_file_id?, status? }` |
| PUT | `/events/:id` | JWT | CENTRAL_ADMIN, HOD | Update |
| PATCH | `/events/:id/status` | JWT | CENTRAL_ADMIN, HOD | Body: `{ status: "DRAFT" | "PUBLISHED" | "ARCHIVED" }` |
| DELETE | `/events/:id` | JWT | CENTRAL_ADMIN, HOD | Archive |

---

## Gallery — `/gallery`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/gallery/albums` | None | — | List active albums. Query: `?department_id=1` |
| GET | `/gallery/albums/:slug` | None | — | Get album with all images |
| POST | `/gallery/albums` | JWT | CENTRAL_ADMIN, HOD | Create album. Body: `{ title, description?, cover_file_id?, department_id?, event_date?, status? }` |
| PUT | `/gallery/albums/:id` | JWT | CENTRAL_ADMIN, HOD | Update album |
| DELETE | `/gallery/albums/:id` | JWT | CENTRAL_ADMIN, HOD | Deactivate album |
| GET | `/gallery` | None | — | List active images. Query: `?department_id=1&album_id=2&page=1&pageSize=20` |
| POST | `/gallery` | JWT | CENTRAL_ADMIN, HOD | Add image. Body: `{ title, file_id, department_id?, album_id? }` |
| PUT | `/gallery/:id` | JWT | CENTRAL_ADMIN, HOD | Update image |
| DELETE | `/gallery/:id` | JWT | CENTRAL_ADMIN, HOD | Soft-delete |

---

## Pages — `/pages`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/pages` | None | — | List published pages |
| GET | `/pages/:slug` | None | — | Get page by slug |
| POST | `/pages` | JWT | CENTRAL_ADMIN | Create. Body: `{ title, slug?, content?, meta_title?, meta_description?, status? }` |
| PUT | `/pages/:id` | JWT | CENTRAL_ADMIN | Update |
| PATCH | `/pages/:id/status` | JWT | CENTRAL_ADMIN | Body: `{ status: "DRAFT" | "PUBLISHED" }` |
| DELETE | `/pages/:id` | JWT | CENTRAL_ADMIN | Delete |

---

## Exam Documents — `/exam`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/exam` | None | — | List active exam docs. Query: `?document_type=TIMETABLE&page=1&pageSize=20` |
| GET | `/exam/:id` | None | — | Get single document |
| POST | `/exam` | JWT | CENTRAL_ADMIN, EXAM_CONTROLLER | Create. Body: `{ title, document_type, file_id, description?, publish_date? }` |
| PUT | `/exam/:id` | JWT | CENTRAL_ADMIN, EXAM_CONTROLLER | Update |
| PATCH | `/exam/:id/status` | JWT | CENTRAL_ADMIN, EXAM_CONTROLLER | Body: `{ status: "ACTIVE" | "INACTIVE" }` |
| DELETE | `/exam/:id` | JWT | CENTRAL_ADMIN, EXAM_CONTROLLER | Soft-delete |

**document_type values:** `NOTICE`, `TIMETABLE`, `RESULT`, `ACADEMIC_CALENDAR`

---

## Placement — `/placement`

### Public listing

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/placement/notices` | None | Placement notices. Query: `?q=&page=&pageSize=` |
| GET | `/placement/company-visits` | None | Company visit records |
| GET | `/placement/records` | None | Placement results |
| GET | `/placement/training-programs` | None | Training programs |
| GET | `/placement/records/:id` | None | Single record |
| GET | `/placement/companies` | None | Company registry |
| GET | `/placement/drives` | None | Placement drives |
| GET | `/placement/internships` | None | Internship records |
| GET | `/placement/stats` | None | Yearly placement statistics |

### Admin write

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/placement/records` | JWT | PLACEMENT_OFFICER | Create record. Body: `{ title, record_type, description, company_name?, academic_year?, file_id? }` |
| PUT | `/placement/records/:id` | JWT | PLACEMENT_OFFICER | Update |
| PATCH | `/placement/records/:id/status` | JWT | PLACEMENT_OFFICER | Body: `{ status: "ACTIVE" | "INACTIVE" }` |
| DELETE | `/placement/records/:id` | JWT | PLACEMENT_OFFICER | Soft-delete |
| POST | `/placement/companies` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Create company |
| PUT | `/placement/companies/:id` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Update company |
| DELETE | `/placement/companies/:id` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Delete |
| POST/PUT/DELETE | `/placement/drives/:id` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Drive CRUD |
| POST/PUT/DELETE | `/placement/internships/:id` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Internship CRUD |
| POST | `/placement/stats` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Upsert yearly stats |

### Student offers

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/placement/offers` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | List student placement offers |
| POST | `/placement/offers` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Create offer. Body: `{ student_name, enrollment_no, company_name, package_lpa, ... }` |
| DELETE | `/placement/offers/:id` | JWT | PLACEMENT_OFFICER, CENTRAL_ADMIN | Delete offer |

**record_type values:** `NOTICE`, `COMPANY_VISIT`, `PLACEMENT_RECORD`, `TRAINING_PROGRAM`

---

## News — `/news`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/news` | None | — | List published news. Query: `?category=GENERAL&q=text&page=1&pageSize=20` |
| GET | `/news/:slug` | None | — | Get article by slug |
| POST | `/news` | JWT | CENTRAL_ADMIN | Create. Body: `{ title, excerpt?, content?, category?, cover_img_url?, status? }` |
| PUT | `/news/:id` | JWT | CENTRAL_ADMIN | Update |
| PATCH | `/news/:id/status` | JWT | CENTRAL_ADMIN | Body: `{ status }` |
| DELETE | `/news/:id` | JWT | CENTRAL_ADMIN | Archive |

---

## Tenders — `/tenders`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/tenders` | None | — | List published tenders. Query: `?q=&page=&pageSize=` |
| GET | `/tenders/:slug` | None | — | Get tender by slug |
| POST | `/tenders` | JWT | CENTRAL_ADMIN | Create. Body: `{ title, description?, file_id?, tender_no?, deadline?, status? }` |
| PUT | `/tenders/:id` | JWT | CENTRAL_ADMIN | Update |
| PATCH | `/tenders/:id/status` | JWT | CENTRAL_ADMIN | Body: `{ status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED" }` |
| DELETE | `/tenders/:id` | JWT | CENTRAL_ADMIN | Archive |

---

## Alerts — `/alerts`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/alerts` | None | — | List active alerts ordered by priority |
| POST | `/alerts` | JWT | CENTRAL_ADMIN | Create. Body: `{ message, alert_type?, link_url?, priority?, expires_at? }` |
| PUT | `/alerts/:id` | JWT | CENTRAL_ADMIN | Update |
| DELETE | `/alerts/:id` | JWT | CENTRAL_ADMIN | Delete |

**alert_type values:** `INFO`, `WARNING`, `DANGER`, `SUCCESS`

---

## Settings — `/settings`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/settings` | None | — | Get all site settings |
| GET | `/settings/:key` | None | — | Get single setting by key |
| PUT | `/settings/:key` | JWT | CENTRAL_ADMIN | Upsert setting. Body: `{ value }` |
| GET | `/settings/cms/:section` | None | — | Get CMS section JSON by key |
| PUT | `/settings/cms/:section` | JWT | CENTRAL_ADMIN | Upsert CMS section JSON |

---

## Academic — `/academic`

All routes require JWT. Role restrictions listed per route.

### Sessions

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/sessions` | Any | List all sessions |
| GET | `/academic/sessions/latest` | Any | Get latest session |
| GET | `/academic/sessions/download` | CENTRAL_ADMIN, EXAM_CONTROLLER, HOD | Download session data as CSV |
| POST | `/academic/sessions` | CENTRAL_ADMIN, EXAM_CONTROLLER | Create session. Body: `{ start_month, start_year, end_month, end_year }` |
| PATCH | `/academic/sessions/:id/active` | CENTRAL_ADMIN, EXAM_CONTROLLER | Set as active session |

### Courses & Sections

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/courses` | Any | List courses. Query: `?department_id=1` |
| POST | `/academic/courses` | CENTRAL_ADMIN, EXAM_CONTROLLER | Create course |
| GET | `/academic/sections` | Any | List sections. Query: `?department_id=1&course_id=2` |
| POST | `/academic/sections` | CENTRAL_ADMIN, HOD | Create sections. Body: `{ department_id, course_id, count }` |

### Subjects

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/subjects` | Any | List subjects. Query: `?session_id=1&department_id=1&course_id=2&subject_type=Regular` |
| POST | `/academic/subjects` | CENTRAL_ADMIN, EXAM_CONTROLLER, HOD | Create subject |
| GET | `/academic/electives` | Any | List elective subjects for current session |
| POST | `/academic/electives/upload` | HOD, EXAM_CONTROLLER | Upload elective enrollment CSV or JSON body `{ subject_id, enrollment_nos[] }` |

### Students

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/students` | Any | List students. Query: `?session_id=1&department_id=1&course_id=2&semester=3` |
| POST | `/academic/students/upload` | CENTRAL_ADMIN, EXAM_CONTROLLER | Upload students CSV |

### Faculty Assignment

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/faculty` | CENTRAL_ADMIN, HOD, EXAM_CONTROLLER | List faculty in department |
| POST | `/academic/faculty/assign` | HOD | Assign faculty to subject. Body: `{ session_id, subject_id, faculty_user_ids[], section_id? }` |
| GET | `/academic/course-outcomes` | TEACHER, HOD | Get COs. Query: `?subject_id=&session_id=` |
| POST | `/academic/course-outcomes` | TEACHER | Save COs. Body: `{ subject_id, session_id, co_names[] }` |

### Marks

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/marks/test-details` | TEACHER, EXAM_CONTROLLER | Get max marks per CO. Query: `?subject_id=&component_name=&sub_component_name=` |
| POST | `/academic/marks/test-details` | TEACHER | Save test details |
| DELETE | `/academic/marks/test-details` | TEACHER | Delete test details |
| GET | `/academic/marks` | TEACHER | Get saved/submitted marks. Query: `?subject_id=&component_name=&sub_component_name=` |
| POST | `/academic/marks/save` | TEACHER | Save marks draft. Body: `{ data: [{ enrollment_no, subject_id, component_name, sub_component_name, co_marks: {} }] }` |
| POST | `/academic/marks/submit` | TEACHER | Submit marks (final) |
| GET | `/academic/marks/fill-requests` | EXAM_CONTROLLER, TEACHER | List marks fill requests |
| POST | `/academic/marks/fill-requests` | EXAM_CONTROLLER | Create fill request |

### ATKT

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/atkt/students` | TEACHER, EXAM_CONTROLLER | List ATKT students for subject |
| POST | `/academic/atkt/students/upload` | EXAM_CONTROLLER | Upload ATKT students CSV |
| GET | `/academic/atkt/test-details` | TEACHER, EXAM_CONTROLLER | Get ATKT max marks |
| POST | `/academic/atkt/test-details` | TEACHER | Save ATKT test details |
| GET | `/academic/atkt/marks` | TEACHER | Get ATKT saved/submitted marks |
| POST | `/academic/atkt/marks/save` | TEACHER | Save ATKT marks draft |
| POST | `/academic/atkt/marks/submit` | TEACHER | Submit ATKT marks |

### Correction Requests

| Method | Path | Roles | Description |
|--------|------|-------|-------------|
| GET | `/academic/correction-requests` | TEACHER, EXAM_CONTROLLER | List requests |
| POST | `/academic/correction-requests` | TEACHER | Submit request |
| PATCH | `/academic/correction-requests/:id/status` | EXAM_CONTROLLER | Approve/Reject |
| DELETE | `/academic/correction-requests/:id` | TEACHER | Withdraw (pending only) |
| GET | `/academic/correction-requests/:id/marks` | TEACHER, EXAM_CONTROLLER | Get marks for approved request |
| POST | `/academic/correction-requests/resubmit` | TEACHER | Resubmit corrected marks |

---

## Leaves — `/leaves`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/leaves` | JWT | Any | List leave requests (HOD sees dept, TEACHER sees own) |
| POST | `/leaves` | JWT | TEACHER | Apply for leave |
| PATCH | `/leaves/:id/status` | JWT | HOD | Approve/Reject. Body: `{ status }` |
| DELETE | `/leaves/:id` | JWT | TEACHER | Cancel pending leave |

---

## Timetables — `/timetables`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/timetables` | None | — | List published timetables. Query: `?department_id=1` |
| POST | `/timetables` | JWT | HOD, CENTRAL_ADMIN | Create. Body: `{ title, file_id, department_id, semester? }` |
| PUT | `/timetables/:id` | JWT | HOD, CENTRAL_ADMIN | Update |
| DELETE | `/timetables/:id` | JWT | HOD, CENTRAL_ADMIN | Delete |

---

## Labs — `/labs`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/labs` | None | — | List labs. Query: `?department_id=1` |
| POST | `/labs` | JWT | HOD, CENTRAL_ADMIN | Create lab record |
| PUT | `/labs/:id` | JWT | HOD, CENTRAL_ADMIN | Update |
| DELETE | `/labs/:id` | JWT | HOD, CENTRAL_ADMIN | Delete |

---

## Achievements — `/achievements`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/achievements` | None | — | List achievements. Query: `?department_id=1&type=FACULTY` |
| POST | `/achievements` | JWT | HOD, CENTRAL_ADMIN | Create |
| PUT | `/achievements/:id` | JWT | HOD, CENTRAL_ADMIN | Update |
| DELETE | `/achievements/:id` | JWT | HOD, CENTRAL_ADMIN | Delete |

---

## Registration Requests — `/registration-requests`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/registration-requests` | JWT | HOD, CENTRAL_ADMIN | List requests |
| POST | `/registration-requests` | JWT | TEACHER | Submit registration request |
| PATCH | `/registration-requests/:id/status` | JWT | HOD | Approve/Reject |

---

## Navigation — `/navigation`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/navigation` | None | Get full navigation tree |
| GET | `/navigation/:role` | JWT | Get role-specific sidebar |
| PUT | `/navigation` | JWT (CENTRAL_ADMIN) | Update navigation structure |

---

## SEO — `/seo`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/seo` | None | Get all SEO metadata |
| GET | `/seo/:page` | None | Get SEO for specific page |
| PUT | `/seo/:page` | JWT (CENTRAL_ADMIN) | Update page SEO |

---

## Contact — `/contact`

| Method | Path | Auth | Rate limit | Description |
|--------|------|------|------------|-------------|
| POST | `/contact` | None | 20 req/min | Submit contact form. Body: `{ name, email, phone?, subject, message }` |
| GET | `/contact` | JWT (CENTRAL_ADMIN) | — | List contact submissions |

---

## Analytics — `/analytics`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/analytics/pageview` | None | Record page view. Body: `{ page, referrer? }` |
| GET | `/analytics/summary` | JWT (CENTRAL_ADMIN) | Summary stats |
| GET | `/analytics/pages` | JWT (CENTRAL_ADMIN) | Top pages by views |

---

## Notifications — `/notifications`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/notifications` | JWT | List notifications for current user |
| PATCH | `/notifications/:id/read` | JWT | Mark as read |
| PATCH | `/notifications/read-all` | JWT | Mark all as read |

---

## Chatbot — `/chatbot`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chatbot` | None | Rule-based chatbot. Body: `{ message }` |
| GET | `/chatbot/faq` | None | List FAQ entries |
| POST | `/chatbot/faq` | JWT (CENTRAL_ADMIN) | Create FAQ |
| PUT | `/chatbot/faq/:id` | JWT (CENTRAL_ADMIN) | Update FAQ |
| DELETE | `/chatbot/faq/:id` | JWT (CENTRAL_ADMIN) | Delete FAQ |

---

## Chat (RAG) — `/chat`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/chat` | None | AI assistant (Sara). Body: `{ question, history?: [{ role, content }] }` |

**Response:**
```json
{
  "answer": "The next exam is on...",
  "has_context": true,
  "latency_ms": 1240
}
```

---

## Search — `/search`

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/search?q=exam&limit=20` | None | Full-text search across all content types |

**Response:**
```json
{
  "query": "exam",
  "total": 47,
  "results": {
    "notices":       [...],
    "announcements": [...],
    "news":          [...],
    "events":        [...],
    "documents":     [...],
    "faculty":       [...],
    "departments":   [...],
    "pages":         [...],
    "placements":    [...]
  }
}
```

---

## Audit Logs — `/audit-logs`

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/audit-logs` | JWT | CENTRAL_ADMIN | List logs. Query: `?user_id=1&action=LOGIN&module=auth&from=2026-01-01&to=2026-12-31&page=1&pageSize=20` |
| GET | `/audit-logs/:id` | JWT | CENTRAL_ADMIN | Get single log entry |

**action values:** `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `PASSWORD_RESET_REQUEST`, `PASSWORD_RESET_COMPLETE`, `REACTIVATE`

---

## Common Error Codes

| Status | Meaning |
|--------|---------|
| 400 | Bad request — validation failure or invalid field value |
| 401 | Unauthenticated — missing or invalid JWT |
| 403 | Forbidden — authenticated but insufficient role/ownership |
| 404 | Record not found |
| 409 | Conflict — duplicate email, active admin last, file still referenced |
| 422 | Zod validation failure — includes field-level errors |
| 429 | Rate limit exceeded |
| 500 | Internal server error — details hidden in production |
