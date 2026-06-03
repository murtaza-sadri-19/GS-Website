-- =============================================================================
-- Schema Additions — Phase 2 / Exam Office Integration
-- Run this AFTER schema.sql
-- =============================================================================

USE SGSITS_DB;

-- ──────────────────────────────────────────────────────────────────────────────
-- News Articles
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL,
  excerpt       TEXT         DEFAULT NULL,
  content       LONGTEXT     DEFAULT NULL,
  cover_img_url VARCHAR(500) DEFAULT NULL,
  category      VARCHAR(100) NOT NULL DEFAULT 'GENERAL',
  author_id     INT          NOT NULL,
  published_at  DATETIME     DEFAULT NULL,
  status        ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_news_slug (slug),
  KEY idx_news_status_pub (status, published_at),
  CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Tenders
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tenders (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL,
  description   TEXT         DEFAULT NULL,
  file_id       INT          DEFAULT NULL,
  tender_no     VARCHAR(100) DEFAULT NULL,
  deadline      DATE         DEFAULT NULL,
  created_by    INT          NOT NULL,
  status        ENUM('DRAFT','PUBLISHED','CLOSED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tenders_slug (slug),
  KEY idx_tenders_status (status, deadline),
  CONSTRAINT fk_tenders_file FOREIGN KEY (file_id)   REFERENCES files (id) ON DELETE SET NULL,
  CONSTRAINT fk_tenders_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Urgent Alerts / Marquee
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS alerts (
  id          INT          NOT NULL AUTO_INCREMENT,
  message     TEXT         NOT NULL,
  alert_type  ENUM('INFO','WARNING','DANGER','SUCCESS') NOT NULL DEFAULT 'INFO',
  link_url    VARCHAR(500) DEFAULT NULL,
  priority    INT          NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_by  INT          NOT NULL,
  expires_at  DATETIME     DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_alerts_active_priority (is_active, priority),
  CONSTRAINT fk_alerts_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Site Settings (key-value) + CMS Sections (JSON blobs)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  `key`       VARCHAR(200) NOT NULL,
  `value`     TEXT         DEFAULT NULL,
  updated_by  INT          DEFAULT NULL,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`),
  CONSTRAINT fk_settings_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cms_sections (
  section_key VARCHAR(200) NOT NULL,
  data        JSON         DEFAULT NULL,
  updated_by  INT          DEFAULT NULL,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (section_key),
  CONSTRAINT fk_cms_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Password Reset Tokens
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id         INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  token      VARCHAR(255) NOT NULL,
  expires_at DATETIME     NOT NULL,
  used       TINYINT(1)   NOT NULL DEFAULT 0,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reset_token (token),
  KEY idx_reset_user (user_id),
  CONSTRAINT fk_reset_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Academic Sessions (ported from exam-office)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_sessions (
  id          INT  NOT NULL AUTO_INCREMENT,
  start_month INT  NOT NULL COMMENT '1=Jan…12=Dec',
  start_year  INT  NOT NULL,
  end_month   INT  NOT NULL,
  end_year    INT  NOT NULL,
  is_active   TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_session (start_month, start_year, end_month, end_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Academic Branches / Courses / Sections / Semesters
-- (Using GS-Website department IDs as branch references)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_courses (
  id             INT          NOT NULL AUTO_INCREMENT,
  course_code    VARCHAR(50)  NOT NULL,
  course_name    VARCHAR(150) NOT NULL,
  specialization VARCHAR(100) NOT NULL DEFAULT '',
  department_id  INT          NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_course (department_id, course_code, specialization),
  CONSTRAINT fk_ecourse_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_sections (
  id             INT         NOT NULL AUTO_INCREMENT,
  department_id  INT         NOT NULL,
  course_id      INT         NOT NULL,
  section_name   VARCHAR(10) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_section (department_id, course_id, section_name),
  CONSTRAINT fk_esect_dept   FOREIGN KEY (department_id) REFERENCES departments  (id) ON DELETE CASCADE,
  CONSTRAINT fk_esect_course FOREIGN KEY (course_id)     REFERENCES exam_courses (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Subjects (per session+course)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_subjects (
  id            INT          NOT NULL AUTO_INCREMENT,
  session_id    INT          NOT NULL,
  subject_code  VARCHAR(50)  NOT NULL,
  subject_name  VARCHAR(200) NOT NULL,
  subject_type  ENUM('Regular','Elective','ATKT') NOT NULL DEFAULT 'Regular',
  semester      INT          NOT NULL,
  department_id INT          NOT NULL,
  course_id     INT          NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_subject (session_id, subject_code, subject_type),
  KEY idx_esubj_sess_dept (session_id, department_id),
  CONSTRAINT fk_esubj_sess  FOREIGN KEY (session_id)   REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_esubj_dept  FOREIGN KEY (department_id) REFERENCES departments  (id) ON DELETE CASCADE,
  CONSTRAINT fk_esubj_course FOREIGN KEY (course_id)   REFERENCES exam_courses  (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Students (per session)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_students (
  id            INT          NOT NULL AUTO_INCREMENT,
  session_id    INT          NOT NULL,
  enrollment_no VARCHAR(50)  NOT NULL,
  student_name  VARCHAR(200) NOT NULL,
  department_id INT          NOT NULL,
  course_id     INT          NOT NULL,
  section_id    INT          DEFAULT NULL,
  semester      INT          NOT NULL,
  status        ENUM('regular','sem-back','year-back') NOT NULL DEFAULT 'regular',
  PRIMARY KEY (id),
  UNIQUE KEY uq_student (session_id, enrollment_no),
  KEY idx_estud_dept_course (department_id, course_id),
  CONSTRAINT fk_estud_sess   FOREIGN KEY (session_id)   REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_estud_dept   FOREIGN KEY (department_id) REFERENCES departments  (id) ON DELETE RESTRICT,
  CONSTRAINT fk_estud_course FOREIGN KEY (course_id)    REFERENCES exam_courses  (id) ON DELETE RESTRICT,
  CONSTRAINT fk_estud_sect   FOREIGN KEY (section_id)   REFERENCES exam_sections (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Faculty ↔ Subject Assignments
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_faculty_subjects (
  id              INT         NOT NULL AUTO_INCREMENT,
  session_id      INT         NOT NULL,
  subject_id      INT         NOT NULL,
  faculty_user_id INT         NOT NULL,
  assignment_type ENUM('primary','secondary') NOT NULL DEFAULT 'primary',
  section_id      INT         DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_fsubj (session_id, subject_id, faculty_user_id, section_id),
  CONSTRAINT fk_efsubj_sess    FOREIGN KEY (session_id)      REFERENCES exam_sessions  (id) ON DELETE CASCADE,
  CONSTRAINT fk_efsubj_subj    FOREIGN KEY (subject_id)      REFERENCES exam_subjects  (id) ON DELETE CASCADE,
  CONSTRAINT fk_efsubj_faculty FOREIGN KEY (faculty_user_id) REFERENCES users          (id) ON DELETE CASCADE,
  CONSTRAINT fk_efsubj_sect    FOREIGN KEY (section_id)      REFERENCES exam_sections  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Course Outcomes
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_course_outcomes (
  id              INT         NOT NULL AUTO_INCREMENT,
  session_id      INT         NOT NULL,
  subject_id      INT         NOT NULL,
  faculty_user_id INT         NOT NULL,
  co_name         VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_co (session_id, subject_id, co_name),
  CONSTRAINT fk_eco_sess    FOREIGN KEY (session_id)      REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_eco_subj    FOREIGN KEY (subject_id)      REFERENCES exam_subjects (id) ON DELETE CASCADE,
  CONSTRAINT fk_eco_faculty FOREIGN KEY (faculty_user_id) REFERENCES users         (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Test Details (max marks per component/CO)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_test_details (
  id                 INT         NOT NULL AUTO_INCREMENT,
  session_id         INT         NOT NULL,
  subject_id         INT         NOT NULL,
  component_name     VARCHAR(100) NOT NULL,
  sub_component_name VARCHAR(100) NOT NULL,
  co_name            VARCHAR(50) NOT NULL,
  max_marks          INT         NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_testdet (session_id, subject_id, component_name, sub_component_name, co_name),
  CONSTRAINT fk_etestdet_sess  FOREIGN KEY (session_id) REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_etestdet_subj  FOREIGN KEY (subject_id) REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Marks (regular assessment)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_marks (
  id                 INT         NOT NULL AUTO_INCREMENT,
  session_id         INT         NOT NULL,
  enrollment_no      VARCHAR(50) NOT NULL,
  subject_id         INT         NOT NULL,
  component_name     VARCHAR(100) NOT NULL,
  sub_component_name VARCHAR(100) NOT NULL,
  co_name            VARCHAR(50) NOT NULL,
  marks_obtained     DECIMAL(5,2) DEFAULT NULL,
  status             ENUM('saved','submitted','resaved','resubmitted') NOT NULL DEFAULT 'saved',
  PRIMARY KEY (id),
  UNIQUE KEY uq_marks (session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name),
  KEY idx_emarks_sess_subj (session_id, subject_id),
  CONSTRAINT fk_emarks_sess FOREIGN KEY (session_id) REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_emarks_subj FOREIGN KEY (subject_id) REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- ATKT Students
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_atkt_students (
  id               INT         NOT NULL AUTO_INCREMENT,
  session_id       INT         NOT NULL,
  enrollment_no    VARCHAR(50) NOT NULL,
  student_name     VARCHAR(200) NOT NULL,
  department_id    INT         NOT NULL,
  course_id        INT         NOT NULL,
  subject_id       INT         NOT NULL,
  subject_session  INT         NOT NULL COMMENT 'session_id of the original subject',
  PRIMARY KEY (id),
  UNIQUE KEY uq_atkt_stud (session_id, enrollment_no, subject_id),
  CONSTRAINT fk_eatkt_sess   FOREIGN KEY (session_id)   REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_eatkt_subj   FOREIGN KEY (subject_id)   REFERENCES exam_subjects (id) ON DELETE CASCADE,
  CONSTRAINT fk_eatkt_dept   FOREIGN KEY (department_id) REFERENCES departments  (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- ATKT Test Details
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_atkt_test_details (
  id            INT         NOT NULL AUTO_INCREMENT,
  session_id    INT         NOT NULL,
  subject_id    INT         NOT NULL,
  co_name       VARCHAR(50) NOT NULL,
  max_marks     INT         NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_atkt_testdet (session_id, subject_id, co_name),
  CONSTRAINT fk_eatktdet_sess FOREIGN KEY (session_id) REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_eatktdet_subj FOREIGN KEY (subject_id) REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- ATKT Marks
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_atkt_marks (
  id            INT         NOT NULL AUTO_INCREMENT,
  session_id    INT         NOT NULL,
  enrollment_no VARCHAR(50) NOT NULL,
  subject_id    INT         NOT NULL,
  co_name       VARCHAR(50) NOT NULL,
  marks_obtained DECIMAL(5,2) DEFAULT NULL,
  status        ENUM('saved','submitted','resaved','resubmitted') NOT NULL DEFAULT 'saved',
  PRIMARY KEY (id),
  UNIQUE KEY uq_atkt_marks (session_id, enrollment_no, subject_id, co_name),
  CONSTRAINT fk_eatktmarks_sess FOREIGN KEY (session_id) REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_eatktmarks_subj FOREIGN KEY (subject_id) REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Elective Data
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_elective_data (
  id            INT         NOT NULL AUTO_INCREMENT,
  session_id    INT         NOT NULL,
  enrollment_no VARCHAR(50) NOT NULL,
  subject_id    INT         NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_elective (session_id, enrollment_no, subject_id),
  CONSTRAINT fk_eeelect_sess FOREIGN KEY (session_id) REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_eeelect_subj FOREIGN KEY (subject_id) REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Marks Fill Requests (EXAM_CONTROLLER → TEACHER)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_marks_fill_requests (
  id                 INT         NOT NULL AUTO_INCREMENT,
  session_id         INT         NOT NULL,
  faculty_user_id    INT         NOT NULL,
  subject_id         INT         NOT NULL,
  component_name     VARCHAR(100) NOT NULL,
  sub_component_name VARCHAR(100) NOT NULL,
  last_date          DATE        NOT NULL,
  status             ENUM('Pending','Submitted','Due') NOT NULL DEFAULT 'Pending',
  assigned_at        DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_emfr_sess    FOREIGN KEY (session_id)      REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_emfr_faculty FOREIGN KEY (faculty_user_id) REFERENCES users         (id) ON DELETE CASCADE,
  CONSTRAINT fk_emfr_subj    FOREIGN KEY (subject_id)      REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ──────────────────────────────────────────────────────────────────────────────
-- Marks Correction Requests (TEACHER → EXAM_CONTROLLER)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exam_correction_requests (
  id                 INT         NOT NULL AUTO_INCREMENT,
  session_id         INT         NOT NULL,
  faculty_user_id    INT         NOT NULL,
  subject_id         INT         NOT NULL,
  component_name     VARCHAR(100) DEFAULT NULL,
  sub_component_name VARCHAR(100) DEFAULT NULL,
  reason             TEXT        NOT NULL,
  form_status        ENUM('Regular','ATKT') NOT NULL DEFAULT 'Regular',
  status             ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  created_at         DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ecorr_sess_fac (session_id, faculty_user_id),
  CONSTRAINT fk_ecorr_sess    FOREIGN KEY (session_id)      REFERENCES exam_sessions (id) ON DELETE CASCADE,
  CONSTRAINT fk_ecorr_faculty FOREIGN KEY (faculty_user_id) REFERENCES users         (id) ON DELETE CASCADE,
  CONSTRAINT fk_ecorr_subj    FOREIGN KEY (subject_id)      REFERENCES exam_subjects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_correction_request_students (
  request_id    INT         NOT NULL,
  enrollment_no VARCHAR(50) NOT NULL,
  PRIMARY KEY (request_id, enrollment_no),
  CONSTRAINT fk_ecrs_req FOREIGN KEY (request_id) REFERENCES exam_correction_requests (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS exam_correction_update_logs (
  id         INT      NOT NULL AUTO_INCREMENT,
  request_id INT      NOT NULL,
  logged_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_ecul_req FOREIGN KEY (request_id) REFERENCES exam_correction_requests (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
