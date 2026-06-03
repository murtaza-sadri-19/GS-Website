# Database Reference

Engine: InnoDB | Charset: utf8mb4_unicode_ci | All timestamps in UTC (DATETIME)

## Schema Files

| File | Purpose |
|------|---------|
| `database/schema.sql` | Core 14 tables (roles, users, files, departments, …) |
| `database/schema_additions.sql` | Phase-2 tables: exam_*, news, tenders, alerts, site_settings, cms_sections, password_reset_tokens |
| `database/migrations/003_rbac.sql` | Permissions system (role_permissions, permissions) |
| `database/migrations/004_faculty_normalize.sql` | Faculty profile normalization |
| `database/migrations/005_dept_ops.sql` | Department ops: gallery_albums, leaves, timetables |
| `database/migrations/006_placement_structured.sql` | companies, placement_drives, internships, placement_year_stats |
| `database/migrations/007_global_systems.sql` | navigation, seo_metadata, contact_submissions, analytics |
| `database/migrations/008_chatbot.sql` | chatbot_faqs, chatbot_conversations |
| `database/migrations/010_indexes_fulltext.sql` | Full-text search indexes |
| `database/migrations/011_dept_extended.sql` | Extended department metadata |
| `database/migrations/012_dual_attachment_support.sql` | files: attachment_type, external_url, thumbnail_url, alt_text, meta_* |
| `database/migrations/013_files_usage_column.sql` | files: usage column |
| `database/migrations/014_search_index.sql` | search_index table for PDF text |
| `database/migrations/015_placement_student_offers.sql` | placement_offers table |

Run all in order to reach the live schema state.

---

## Core Tables

### `roles`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| role_name | VARCHAR(50) UNIQUE | `SUPER_ADMIN`, `CENTRAL_ADMIN`, `HOD`, `TEACHER`, `EXAM_CONTROLLER`, `PLACEMENT_OFFICER`, … |
| created_at | DATETIME | |

### `users`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| role_id | INT FK→roles | ON DELETE RESTRICT |
| department_id | INT FK→departments | NULL allowed; added via ALTER TABLE after departments |
| name | VARCHAR(150) | |
| email | VARCHAR(150) UNIQUE | Stored lowercase |
| password_hash | VARCHAR(255) | bcrypt, 10 rounds |
| phone | VARCHAR(20) | Nullable |
| status | ENUM('ACTIVE','INACTIVE') | Default ACTIVE |
| created_at | DATETIME | |
| updated_at | DATETIME ON UPDATE | |

Indexes: `idx_users_role (role_id)`, `idx_users_dept (department_id)`

### `files`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| attachment_type | ENUM('FILE','EXTERNAL_LINK') | Added migration 012; COALESCE('FILE') for older rows |
| usage | VARCHAR(100) | Added migration 013; e.g. `gallery`, `notices` |
| original_name | VARCHAR(255) | User-facing filename |
| stored_name | VARCHAR(255) | Disk path relative to `/uploads/` |
| file_url | TEXT | Full URL (APP_URL/uploads/… or Cloudinary URL or external URL) |
| external_url | TEXT | Only for EXTERNAL_LINK type |
| thumbnail_url | TEXT | Optional; for external media |
| alt_text | VARCHAR(255) | Optional; for images |
| meta_title | VARCHAR(255) | Optional |
| meta_description | TEXT | Optional |
| file_type | VARCHAR(100) | MIME type |
| file_size | INT | Bytes; NULL for external links |
| storage_type | ENUM('LOCAL','CLOUDINARY','EXTERNAL') | |
| uploaded_by | INT FK→users | ON DELETE RESTRICT |
| created_at | DATETIME | |

### `departments`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| name | VARCHAR(150) UNIQUE | |
| slug | VARCHAR(150) UNIQUE | URL-safe, e.g. `electronics-communication` |
| short_name | VARCHAR(50) | Nullable |
| description / vision / mission | TEXT | Nullable |
| hod_user_id | INT FK→users | ON DELETE SET NULL |
| image_file_id | INT FK→files | ON DELETE SET NULL |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_at / updated_at | DATETIME | |

Indexes: `idx_departments_status (status)`, unique on `slug`

### `faculty_profiles`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK AUTO_INCREMENT | |
| user_id | INT FK→users UNIQUE | One profile per user; ON DELETE CASCADE |
| department_id | INT FK→departments | ON DELETE RESTRICT |
| designation | VARCHAR(100) | Nullable |
| qualification / specialization / bio / publications / research_work / subjects | TEXT | Nullable |
| experience | VARCHAR(100) | Nullable |
| profile_image_file_id | INT FK→files | ON DELETE SET NULL |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_at / updated_at | DATETIME | |

Indexes: `idx_faculty_dept (department_id)`

### `notices`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| description | TEXT | Nullable |
| notice_type | ENUM('GENERAL','DEPARTMENT','EXAM','PLACEMENT') | |
| department_id | INT FK→departments | NULL for non-DEPARTMENT notices |
| file_id | INT FK→files | ON DELETE SET NULL; Nullable |
| created_by | INT FK→users | ON DELETE RESTRICT |
| publish_date | DATE | |
| status | ENUM('DRAFT','PUBLISHED','ARCHIVED') | |
| created_at / updated_at | DATETIME | |

Indexes: `idx_notices_status_publish (status, publish_date)`, `idx_notices_dept (department_id)`

### `downloads`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| category | VARCHAR(100) | Free-form; e.g. `Forms`, `Syllabus` |
| department_id | INT FK→departments | ON DELETE SET NULL; Nullable |
| file_id | INT FK→files | NOT NULL; ON DELETE RESTRICT |
| uploaded_by | INT FK→users | ON DELETE RESTRICT |
| download_count | INT DEFAULT 0 | Incremented on each GET /:id |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_at / updated_at | DATETIME | |

### `exam_documents`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| document_type | ENUM('NOTICE','TIMETABLE','RESULT','ACADEMIC_CALENDAR') | |
| description | TEXT | Nullable |
| file_id | INT FK→files | ON DELETE RESTRICT |
| uploaded_by | INT FK→users | ON DELETE RESTRICT |
| publish_date | DATE | Nullable |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_at / updated_at | DATETIME | |

Index: `idx_exam_type_status (document_type, status)`

### `placement_records`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| record_type | ENUM('NOTICE','COMPANY_VISIT','PLACEMENT_RECORD','TRAINING_PROGRAM') | |
| company_name | VARCHAR(150) | Required for COMPANY_VISIT |
| academic_year | VARCHAR(20) | Required for COMPANY_VISIT, PLACEMENT_RECORD |
| description | TEXT | Required |
| file_id | INT FK→files | ON DELETE SET NULL; Nullable |
| uploaded_by | INT FK→users | ON DELETE RESTRICT |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_at / updated_at | DATETIME | |

Indexes: `idx_placement_type_status (record_type, status)`, `idx_placement_year (academic_year)`

### `events`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| description | TEXT | Nullable |
| event_date | DATE | Nullable |
| department_id | INT FK→departments | ON DELETE SET NULL |
| cover_image_file_id | INT FK→files | ON DELETE SET NULL |
| created_by | INT FK→users | ON DELETE RESTRICT |
| status | ENUM('DRAFT','PUBLISHED','ARCHIVED') | |
| created_at / updated_at | DATETIME | |

Index: `idx_events_status_date (status, event_date)`

### `gallery`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| description | TEXT | Nullable |
| department_id | INT FK→departments | ON DELETE SET NULL |
| album_id | INT FK→gallery_albums | ON DELETE SET NULL — added in migration 005 |
| file_id | INT FK→files | ON DELETE RESTRICT |
| uploaded_by | INT FK→users | ON DELETE RESTRICT |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_at | DATETIME | |

### `gallery_albums` (migration 005)
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| description | TEXT | |
| cover_file_id | INT FK→files | ON DELETE SET NULL |
| department_id | INT FK→departments | ON DELETE SET NULL |
| event_date | DATE | |
| status | ENUM('ACTIVE','INACTIVE') | |
| created_by | INT FK→users | |
| created_at / updated_at | DATETIME | |

### `pages`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| content | LONGTEXT | HTML/rich text |
| meta_title | VARCHAR(255) | |
| meta_description | TEXT | |
| updated_by | INT FK→users | ON DELETE SET NULL |
| status | ENUM('DRAFT','PUBLISHED') | |
| created_at / updated_at | DATETIME | |

### `audit_logs`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| user_id | INT FK→users | ON DELETE CASCADE |
| action | VARCHAR(100) | `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, … |
| module_name | VARCHAR(100) | `auth`, `notices`, `users`, … |
| record_id | INT | Nullable; the affected row's PK |
| description | TEXT | Human-readable summary |
| ip_address | VARCHAR(100) | Nullable |
| created_at | DATETIME | |

Indexes: `idx_audit_user_time (user_id, created_at)`, `idx_audit_module_time (module_name, created_at)`

---

## Phase-2 Tables (`schema_additions.sql`)

### `news`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| excerpt | TEXT | Short summary |
| content | LONGTEXT | |
| cover_img_url | VARCHAR(500) | **Raw URL — does not use files module** |
| category | VARCHAR(100) DEFAULT 'GENERAL' | |
| author_id | INT FK→users | |
| published_at | DATETIME | |
| status | ENUM('DRAFT','PUBLISHED','ARCHIVED') | |
| created_at / updated_at | DATETIME | |

### `tenders`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| title | VARCHAR(255) | |
| slug | VARCHAR(255) UNIQUE | |
| description | TEXT | |
| file_id | INT FK→files | ON DELETE SET NULL |
| tender_no | VARCHAR(100) | |
| deadline | DATE | |
| created_by | INT FK→users | |
| status | ENUM('DRAFT','PUBLISHED','CLOSED','ARCHIVED') | |
| created_at / updated_at | DATETIME | |

### `alerts`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| message | TEXT | |
| alert_type | ENUM('INFO','WARNING','DANGER','SUCCESS') | |
| link_url | VARCHAR(500) | |
| priority | INT DEFAULT 0 | Higher = shown first |
| is_active | TINYINT(1) DEFAULT 1 | Boolean flag (not an ENUM like other tables) |
| created_by | INT FK→users | |
| expires_at | DATETIME | Nullable |
| created_at / updated_at | DATETIME | |

### `site_settings`
Key-value store for global config.
| Column | Type |
|--------|------|
| key (PK) | VARCHAR(200) |
| value | TEXT |
| updated_by | INT FK→users |
| updated_at | DATETIME ON UPDATE |

### `cms_sections`
JSON blob store for CMS sections.
| Column | Type |
|--------|------|
| section_key (PK) | VARCHAR(200) |
| data | JSON |
| updated_by | INT FK→users |
| updated_at | DATETIME ON UPDATE |

### `password_reset_tokens`
| Column | Type | Notes |
|--------|------|-------|
| id | INT PK | |
| user_id | INT FK→users | ON DELETE CASCADE |
| token | VARCHAR(255) UNIQUE | hex(32) random bytes |
| expires_at | DATETIME | 1 hour TTL |
| used | TINYINT(1) DEFAULT 0 | Marked 1 after use |
| created_at | DATETIME | |

---

## Exam Tables (`schema_additions.sql`)

All exam tables cascade-delete on session removal.

| Table | Key columns |
|-------|------------|
| `exam_sessions` | start_month, start_year, end_month, end_year, is_active |
| `exam_courses` | course_code, course_name, specialization, department_id |
| `exam_sections` | department_id, course_id, section_name |
| `exam_subjects` | session_id, subject_code, subject_name, subject_type ENUM('Regular','Elective','ATKT'), semester, department_id, course_id |
| `exam_students` | session_id, enrollment_no, student_name, department_id, course_id, section_id, semester, status ENUM('regular','sem-back','year-back') |
| `exam_faculty_subjects` | session_id, subject_id, faculty_user_id, assignment_type ENUM('primary','secondary'), section_id |
| `exam_course_outcomes` | session_id, subject_id, faculty_user_id, co_name |
| `exam_test_details` | session_id, subject_id, component_name, sub_component_name, co_name, max_marks |
| `exam_marks` | session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained, status ENUM('saved','submitted','resaved','resubmitted') |
| `exam_atkt_students` | session_id, enrollment_no, student_name, department_id, course_id, subject_id |
| `exam_atkt_test_details` | session_id, subject_id, co_name, max_marks |
| `exam_atkt_marks` | session_id, enrollment_no, subject_id, co_name, marks_obtained, status |
| `exam_elective_data` | session_id, enrollment_no, subject_id |
| `exam_marks_fill_requests` | session_id, faculty_user_id, subject_id, component_name, sub_component_name, last_date, status ENUM('Pending','Submitted','Due') |
| `exam_correction_requests` | session_id, faculty_user_id, subject_id, component_name, sub_component_name, reason, form_status ENUM('Regular','ATKT'), status ENUM('Pending','Approved','Rejected') |
| `exam_correction_request_students` | request_id, enrollment_no |
| `exam_correction_update_logs` | request_id, logged_at |

> **Note:** `enrollment_no` is stored as VARCHAR throughout the exam tables. There is no FK from marks tables back to `exam_students` — referential integrity for enrollment numbers is enforced in application code only.

---

## Migration-Added Tables

| Migration | Tables added |
|-----------|-------------|
| 003_rbac | `permissions`, `role_permissions` |
| 005_dept_ops | `gallery_albums`, `leaves`, `faculty_timetables` (or similar) |
| 006_placement_structured | `companies`, `placement_drives`, `internships`, `placement_year_stats` |
| 007_global_systems | `navigation`, `seo_metadata`, `contact_submissions`, `page_analytics` |
| 008_chatbot | `chatbot_faqs`, `chatbot_conversations` |
| 014_search_index | `search_index` (source_type, source_id, file_id, title, content_text, url, indexed_at) |
| 015_placement_student_offers | `placement_offers` (student_name, enrollment_no, company_name, package_lpa, …) |

---

## Entity Relationship Summary

```
roles ──< users >── departments
                       │
          ┌────────────┼────────────────┐
          │            │                │
     faculty_profiles  │            gallery_albums
          │            │                │
          └── files ───┘                │
               │                       │
               ├── notices              │
               ├── downloads         gallery
               ├── exam_documents
               ├── placement_records
               ├── events
               ├── tenders
               └── gallery_albums

audit_logs ──< users

exam_sessions ──< exam_courses ──< exam_sections
             ──< exam_subjects ──< exam_faculty_subjects
             ──< exam_students
             ──< exam_marks  (no FK to exam_students — enrollment_no is string)
```

---

## Status Enum Reference

| Enum set | Used in |
|----------|---------|
| `ACTIVE` / `INACTIVE` | users, gallery, gallery_albums, downloads, faculty_profiles, placement_records, exam_documents, labs, timetables, achievements |
| `DRAFT` / `PUBLISHED` / `ARCHIVED` | notices, events, news, pages (no ARCHIVED), tenders (+ CLOSED) |
| `saved` / `submitted` / `resaved` / `resubmitted` | exam_marks, exam_atkt_marks — **lowercase** |
| `Pending` / `Submitted` / `Due` | exam_marks_fill_requests — **Title Case** |
| `Pending` / `Approved` / `Rejected` | exam_correction_requests — **Title Case** |
| `Regular` / `Elective` / `ATKT` | exam_subjects.subject_type — **Mixed case** |
| `primary` / `secondary` | exam_faculty_subjects.assignment_type — **lowercase** |
| `regular` / `sem-back` / `year-back` | exam_students.status — **lowercase** |
| `INFO` / `WARNING` / `DANGER` / `SUCCESS` | alerts.alert_type |
| `LOCAL` / `CLOUDINARY` / `EXTERNAL` | files.storage_type |
| `FILE` / `EXTERNAL_LINK` | files.attachment_type |

> The exam_* tables use inconsistent casing compared to the rest of the schema. All other modules use `UPPER_CASE` for enum values.

---

## Seed Files

| File | Contents |
|------|---------|
| `seed_enterprise_01_users.sql` | Base user accounts (CENTRAL_ADMIN, role users) |
| `seed_enterprise_02_departments.sql` | Department records |
| `seed_enterprise_03_faculty.sql` | Faculty profiles |
| `seed_enterprise_04_content.sql` | Sample notices, pages, events |
| `seed_enterprise_05_placement.sql` | Placement records and company data |
| `seed_enterprise_06_exam.sql` | Exam documents |
| `seed_enterprise_07_gallery_labs.sql` | Gallery albums and lab records |
| `seed_enterprise_08_cms_global.sql` | site_settings and cms_sections |
| `seed_enterprise_09_analytics.sql` | Sample analytics data |
| `seed_enterprise_run_all.sql` | Sources all of the above in order |
| `seed_sgsits_10_*` through `seed_sgsits_20_*` | SGSITS-specific real data (HODs, departments, notices, navigation, placement, CMS) |

Run the enterprise seeds first for a working base, then apply SGSITS-specific seeds for production data.
