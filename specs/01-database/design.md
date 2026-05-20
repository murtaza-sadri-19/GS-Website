# Database — Design

MySQL 8. InnoDB engine. utf8mb4 charset, utf8mb4_unicode_ci collation.

All times stored as `DATETIME` (UTC). The application converts to local time for display.

## Table list

| # | Table | Purpose |
| --- | --- | --- |
| 10.1 | `roles` | Fixed role catalog |
| 10.2 | `users` | Login accounts for staff |
| 10.3 | `departments` | College departments |
| 10.4 | `faculty_profiles` | Public teacher profiles |
| 10.5 | `notices` | General / department / exam / placement notices |
| 10.6 | `downloads` | Downloadable forms, syllabus, circulars |
| 10.7 | `exam_documents` | Exam notices, timetables, results, calendar |
| 10.8 | `placement_records` | Placement notices, visits, records, training |
| 10.9 | `events` | College + department events |
| 10.10 | `gallery` | Image gallery |
| 10.11 | `pages` | Editable static pages |
| 10.12 | `files` | Uploaded file metadata |
| 10.13 | `audit_logs` | Dashboard activity log |

---

## 10.1 `roles`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK, AUTO_INCREMENT |
| `role_name` | VARCHAR(50) | UNIQUE. One of: CENTRAL_ADMIN, EXAM_CONTROLLER, PLACEMENT_OFFICER, HOD, TEACHER |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

Relationship: one role → many users.

---

## 10.2 `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK, AUTO_INCREMENT |
| `role_id` | INT | FK → `roles.id`, ON DELETE RESTRICT |
| `department_id` | INT | FK → `departments.id`, NULLABLE, ON DELETE SET NULL |
| `name` | VARCHAR(150) | Full name |
| `email` | VARCHAR(150) | UNIQUE, login email |
| `password_hash` | VARCHAR(255) | bcrypt hash |
| `phone` | VARCHAR(20) | Optional |
| `status` | ENUM('ACTIVE','INACTIVE') | Account status |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| `updated_at` | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

Indexes: `idx_users_email` (unique), `idx_users_role`, `idx_users_dept`.

Relationships:
- many users → 1 role
- many users → 1 department (nullable)
- 1 teacher user → 1 faculty_profile
- 1 user → many audit_logs

---

## 10.3 `departments`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK, AUTO_INCREMENT |
| `name` | VARCHAR(150) | Department name |
| `slug` | VARCHAR(150) | UNIQUE, kebab-case |
| `short_name` | VARCHAR(50) | e.g. CSE, EC, EE |
| `description` | TEXT | Department intro |
| `vision` | TEXT | |
| `mission` | TEXT | |
| `hod_user_id` | INT | FK → `users.id`, NULLABLE, ON DELETE SET NULL |
| `image_file_id` | INT | FK → `files.id`, NULLABLE, ON DELETE SET NULL |
| `status` | ENUM('ACTIVE','INACTIVE') | Visibility |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_departments_slug` (unique), `idx_departments_status`.

---

## 10.4 `faculty_profiles`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK, AUTO_INCREMENT |
| `user_id` | INT | FK → `users.id`, UNIQUE (one profile per teacher), ON DELETE CASCADE |
| `department_id` | INT | FK → `departments.id`, ON DELETE RESTRICT |
| `designation` | VARCHAR(100) | Professor, Assistant Professor, etc. |
| `qualification` | TEXT | |
| `specialization` | TEXT | |
| `experience` | VARCHAR(100) | e.g. "10 years" |
| `bio` | TEXT | |
| `publications` | TEXT | Can be normalized later |
| `research_work` | TEXT | |
| `subjects` | TEXT | |
| `profile_image_file_id` | INT | FK → `files.id`, NULLABLE, ON DELETE SET NULL |
| `status` | ENUM('ACTIVE','INACTIVE') | Public visibility |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_faculty_user` (unique), `idx_faculty_dept`.

---

## 10.5 `notices`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `slug` | VARCHAR(255) | UNIQUE |
| `description` | TEXT | |
| `notice_type` | ENUM('GENERAL','DEPARTMENT','EXAM','PLACEMENT') | |
| `department_id` | INT | FK → `departments.id`, NULLABLE, ON DELETE SET NULL |
| `file_id` | INT | FK → `files.id`, NULLABLE, ON DELETE SET NULL |
| `created_by` | INT | FK → `users.id`, ON DELETE RESTRICT |
| `publish_date` | DATE | |
| `status` | ENUM('DRAFT','PUBLISHED','ARCHIVED') | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_notices_slug` (unique), `idx_notices_status_publish` on `(status, publish_date)`, `idx_notices_dept`.

---

## 10.6 `downloads`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `category` | VARCHAR(100) | Form, Syllabus, Circular, Brochure, ... |
| `department_id` | INT | FK → `departments.id`, NULLABLE, ON DELETE SET NULL |
| `file_id` | INT | FK → `files.id`, ON DELETE RESTRICT (a download MUST have a file) |
| `uploaded_by` | INT | FK → `users.id` |
| `status` | ENUM('ACTIVE','INACTIVE') | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_downloads_status`, `idx_downloads_dept_cat`.

---

## 10.7 `exam_documents`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `document_type` | ENUM('NOTICE','TIMETABLE','RESULT','ACADEMIC_CALENDAR') | |
| `description` | TEXT | Optional |
| `file_id` | INT | FK → `files.id`, ON DELETE RESTRICT |
| `uploaded_by` | INT | FK → `users.id` (the EXAM_CONTROLLER) |
| `publish_date` | DATE | |
| `status` | ENUM('ACTIVE','INACTIVE') | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_exam_type_status` on `(document_type, status)`.

---

## 10.8 `placement_records`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `record_type` | ENUM('NOTICE','COMPANY_VISIT','PLACEMENT_RECORD','TRAINING_PROGRAM') | |
| `company_name` | VARCHAR(150) | NULLABLE |
| `academic_year` | VARCHAR(20) | e.g. "2025-26" |
| `description` | TEXT | |
| `file_id` | INT | FK → `files.id`, NULLABLE, ON DELETE SET NULL |
| `uploaded_by` | INT | FK → `users.id` |
| `status` | ENUM('ACTIVE','INACTIVE') | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_placement_type_status` on `(record_type, status)`, `idx_placement_year`.

---

## 10.9 `events`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `slug` | VARCHAR(255) | UNIQUE |
| `description` | TEXT | |
| `event_date` | DATE | |
| `department_id` | INT | FK → `departments.id`, NULLABLE, ON DELETE SET NULL |
| `cover_image_file_id` | INT | FK → `files.id`, NULLABLE, ON DELETE SET NULL |
| `created_by` | INT | FK → `users.id` |
| `status` | ENUM('DRAFT','PUBLISHED','ARCHIVED') | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_events_slug` (unique), `idx_events_status_date` on `(status, event_date)`.

---

## 10.10 `gallery`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `description` | TEXT | Optional |
| `department_id` | INT | FK → `departments.id`, NULLABLE, ON DELETE SET NULL |
| `file_id` | INT | FK → `files.id`, ON DELETE RESTRICT |
| `uploaded_by` | INT | FK → `users.id` |
| `status` | ENUM('ACTIVE','INACTIVE') | |
| `created_at` | DATETIME | |

Indexes: `idx_gallery_status_dept` on `(status, department_id)`.

---

## 10.11 `pages`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `title` | VARCHAR(255) | |
| `slug` | VARCHAR(255) | UNIQUE: about, contact, administration, ... |
| `content` | LONGTEXT | HTML or markdown — TBD by frontend |
| `meta_title` | VARCHAR(255) | SEO |
| `meta_description` | TEXT | SEO |
| `updated_by` | INT | FK → `users.id` |
| `status` | ENUM('DRAFT','PUBLISHED') | |
| `created_at` | DATETIME | |
| `updated_at` | DATETIME | |

Indexes: `idx_pages_slug` (unique).

---

## 10.12 `files`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `original_name` | VARCHAR(255) | As uploaded |
| `stored_name` | VARCHAR(255) | Filename on disk OR Cloudinary public ID |
| `file_url` | TEXT | Local path OR Cloudinary URL |
| `file_type` | VARCHAR(100) | MIME type |
| `file_size` | INT | Bytes |
| `storage_type` | ENUM('LOCAL','CLOUDINARY') | |
| `uploaded_by` | INT | FK → `users.id` |
| `created_at` | DATETIME | |

Indexes: `idx_files_uploader`.

Notes:
- No `status` column — file metadata stays even if the referencing record is archived. Orphan cleanup is a future cron task, not part of v1.
- File deletion is a separate API and ALSO removes the underlying storage (disk file or Cloudinary asset).

---

## 10.13 `audit_logs`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | INT | PK |
| `user_id` | INT | FK → `users.id`, ON DELETE CASCADE |
| `action` | VARCHAR(100) | CREATE, UPDATE, DELETE, LOGIN |
| `module_name` | VARCHAR(100) | users, notices, departments, ... |
| `record_id` | INT | Affected row's id (NULLABLE for LOGIN) |
| `description` | TEXT | Human-readable |
| `ip_address` | VARCHAR(100) | Optional |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

Indexes: `idx_audit_user_time` on `(user_id, created_at)`, `idx_audit_module_time` on `(module_name, created_at)`.

---

## Relationship summary

```
roles 1 ─── many users
users many ── 1 departments        (nullable)
users 1 ─── 1 faculty_profiles
users 1 ─── many audit_logs
users 1 ─── many created_by columns across modules

departments 1 ─── many faculty_profiles
departments 1 ─── many notices
departments 1 ─── many downloads
departments 1 ─── many events
departments 1 ─── many gallery

files 1 ─── many (notices, downloads, exam_documents, placement_records, events, gallery, departments, faculty_profiles, pages cover etc.)
```

See [`relationships.md`](./relationships.md) for the diagram.

## ON DELETE policy summary

- `RESTRICT` — referenced row should not be deletable (e.g. don't delete a user that owns content).
- `SET NULL` — optional reference; deletion is fine, set FK to NULL (e.g. `department_id` on a notice).
- `CASCADE` — only `audit_logs.user_id` (when a user is genuinely deleted, their logs go too; but in practice we soft-delete users).

In v1 we don't expect to hard-delete users; status flips to `INACTIVE`. The CASCADE on `audit_logs` exists for emergency cleanup only.
