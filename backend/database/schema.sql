-- =============================================================================
-- Dynamic College Website — Database Schema
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- All timestamps stored as DATETIME (UTC).
--
-- Run order matters — circular FK between users ↔ departments is resolved
-- by adding users.department_id as a deferred ALTER TABLE at the end.
-- =============================================================================

CREATE DATABASE IF NOT EXISTS college_website
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE college_website;

-- =============================================================================
-- 10.1  roles
-- =============================================================================
CREATE TABLE IF NOT EXISTS roles (
  id         INT          NOT NULL AUTO_INCREMENT,
  role_name  VARCHAR(50)  NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.2  users  (department_id FK added via ALTER TABLE after departments exists)
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
  id            INT          NOT NULL AUTO_INCREMENT,
  role_id       INT          NOT NULL,
  department_id INT          DEFAULT NULL,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(20)  DEFAULT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role_id),
  KEY idx_users_dept (department_id),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.12 files  (uploaded_by → users)
-- =============================================================================
CREATE TABLE IF NOT EXISTS files (
  id            INT          NOT NULL AUTO_INCREMENT,
  original_name VARCHAR(255) NOT NULL,
  stored_name   VARCHAR(255) NOT NULL,
  file_url      TEXT         NOT NULL,
  file_type     VARCHAR(100) NOT NULL,
  file_size     INT          NOT NULL,
  storage_type  ENUM('LOCAL','CLOUDINARY') NOT NULL DEFAULT 'LOCAL',
  uploaded_by   INT          NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_files_uploader (uploaded_by),
  CONSTRAINT fk_files_user FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.3  departments  (hod_user_id → users, image_file_id → files)
-- =============================================================================
CREATE TABLE IF NOT EXISTS departments (
  id             INT          NOT NULL AUTO_INCREMENT,
  name           VARCHAR(150) NOT NULL,
  slug           VARCHAR(150) NOT NULL,
  short_name     VARCHAR(50)  DEFAULT NULL,
  description    TEXT         DEFAULT NULL,
  vision         TEXT         DEFAULT NULL,
  mission        TEXT         DEFAULT NULL,
  hod_user_id    INT          DEFAULT NULL,
  image_file_id  INT          DEFAULT NULL,
  status         ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_departments_slug (slug),
  KEY idx_departments_status (status),
  CONSTRAINT fk_departments_hod   FOREIGN KEY (hod_user_id)   REFERENCES users  (id) ON DELETE SET NULL,
  CONSTRAINT fk_departments_image FOREIGN KEY (image_file_id) REFERENCES files  (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- Resolve circular FK: users.department_id → departments
-- =============================================================================
ALTER TABLE users
  ADD CONSTRAINT fk_users_dept
  FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL;

-- =============================================================================
-- 10.4  faculty_profiles
-- =============================================================================
CREATE TABLE IF NOT EXISTS faculty_profiles (
  id                     INT          NOT NULL AUTO_INCREMENT,
  user_id                INT          NOT NULL,
  department_id          INT          NOT NULL,
  designation            VARCHAR(100) DEFAULT NULL,
  qualification          TEXT         DEFAULT NULL,
  specialization         TEXT         DEFAULT NULL,
  experience             VARCHAR(100) DEFAULT NULL,
  bio                    TEXT         DEFAULT NULL,
  publications           TEXT         DEFAULT NULL,
  research_work          TEXT         DEFAULT NULL,
  subjects               TEXT         DEFAULT NULL,
  profile_image_file_id  INT          DEFAULT NULL,
  status                 ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at             DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at             DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_faculty_user (user_id),
  KEY idx_faculty_dept (department_id),
  CONSTRAINT fk_faculty_user    FOREIGN KEY (user_id)               REFERENCES users       (id) ON DELETE CASCADE,
  CONSTRAINT fk_faculty_dept    FOREIGN KEY (department_id)         REFERENCES departments (id) ON DELETE RESTRICT,
  CONSTRAINT fk_faculty_image   FOREIGN KEY (profile_image_file_id) REFERENCES files       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.5  notices
-- =============================================================================
CREATE TABLE IF NOT EXISTS notices (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL,
  description   TEXT         DEFAULT NULL,
  notice_type   ENUM('GENERAL','DEPARTMENT','EXAM','PLACEMENT') NOT NULL DEFAULT 'GENERAL',
  department_id INT          DEFAULT NULL,
  file_id       INT          DEFAULT NULL,
  created_by    INT          NOT NULL,
  publish_date  DATE         DEFAULT NULL,
  status        ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_notices_slug (slug),
  KEY idx_notices_status_publish (status, publish_date),
  KEY idx_notices_dept (department_id),
  CONSTRAINT fk_notices_dept       FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
  CONSTRAINT fk_notices_file       FOREIGN KEY (file_id)       REFERENCES files       (id) ON DELETE SET NULL,
  CONSTRAINT fk_notices_created_by FOREIGN KEY (created_by)    REFERENCES users       (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.6  downloads
-- =============================================================================
CREATE TABLE IF NOT EXISTS downloads (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  category      VARCHAR(100) NOT NULL,
  department_id INT          DEFAULT NULL,
  file_id        INT          NOT NULL,
  uploaded_by    INT          NOT NULL,
  download_count INT          NOT NULL DEFAULT 0,
  status         ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_downloads_status (status),
  KEY idx_downloads_dept_cat (department_id, category),
  CONSTRAINT fk_downloads_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
  CONSTRAINT fk_downloads_file FOREIGN KEY (file_id)       REFERENCES files       (id) ON DELETE RESTRICT,
  CONSTRAINT fk_downloads_user FOREIGN KEY (uploaded_by)   REFERENCES users       (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.7  exam_documents
-- =============================================================================
CREATE TABLE IF NOT EXISTS exam_documents (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  document_type ENUM('NOTICE','TIMETABLE','RESULT','ACADEMIC_CALENDAR') NOT NULL,
  description   TEXT         DEFAULT NULL,
  file_id       INT          NOT NULL,
  uploaded_by   INT          NOT NULL,
  publish_date  DATE         DEFAULT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_exam_type_status (document_type, status),
  CONSTRAINT fk_exam_file FOREIGN KEY (file_id)     REFERENCES files (id) ON DELETE RESTRICT,
  CONSTRAINT fk_exam_user FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.8  placement_records
-- =============================================================================
CREATE TABLE IF NOT EXISTS placement_records (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  record_type   ENUM('NOTICE','COMPANY_VISIT','PLACEMENT_RECORD','TRAINING_PROGRAM') NOT NULL,
  company_name  VARCHAR(150) DEFAULT NULL,
  academic_year VARCHAR(20)  DEFAULT NULL,
  description   TEXT         DEFAULT NULL,
  file_id       INT          DEFAULT NULL,
  uploaded_by   INT          NOT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_placement_type_status (record_type, status),
  KEY idx_placement_year (academic_year),
  CONSTRAINT fk_placement_file FOREIGN KEY (file_id)     REFERENCES files (id) ON DELETE SET NULL,
  CONSTRAINT fk_placement_user FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.9  events
-- =============================================================================
CREATE TABLE IF NOT EXISTS events (
  id                    INT          NOT NULL AUTO_INCREMENT,
  title                 VARCHAR(255) NOT NULL,
  slug                  VARCHAR(255) NOT NULL,
  description           TEXT         DEFAULT NULL,
  event_date            DATE         DEFAULT NULL,
  department_id         INT          DEFAULT NULL,
  cover_image_file_id   INT          DEFAULT NULL,
  created_by            INT          NOT NULL,
  status                ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_events_slug (slug),
  KEY idx_events_status_date (status, event_date),
  CONSTRAINT fk_events_dept       FOREIGN KEY (department_id)       REFERENCES departments (id) ON DELETE SET NULL,
  CONSTRAINT fk_events_cover      FOREIGN KEY (cover_image_file_id) REFERENCES files       (id) ON DELETE SET NULL,
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by)          REFERENCES users       (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.10 gallery
-- =============================================================================
CREATE TABLE IF NOT EXISTS gallery (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255) NOT NULL,
  description   TEXT         DEFAULT NULL,
  department_id INT          DEFAULT NULL,
  file_id       INT          NOT NULL,
  uploaded_by   INT          NOT NULL,
  status        ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_status_dept (status, department_id),
  CONSTRAINT fk_gallery_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL,
  CONSTRAINT fk_gallery_file FOREIGN KEY (file_id)       REFERENCES files       (id) ON DELETE RESTRICT,
  CONSTRAINT fk_gallery_user FOREIGN KEY (uploaded_by)   REFERENCES users       (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.11 pages
-- =============================================================================
CREATE TABLE IF NOT EXISTS pages (
  id               INT          NOT NULL AUTO_INCREMENT,
  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL,
  content          LONGTEXT     DEFAULT NULL,
  meta_title       VARCHAR(255) DEFAULT NULL,
  meta_description TEXT         DEFAULT NULL,
  updated_by       INT          DEFAULT NULL,
  status           ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pages_slug (slug),
  CONSTRAINT fk_pages_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10.13 audit_logs
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id          INT          NOT NULL AUTO_INCREMENT,
  user_id     INT          NOT NULL,
  action      VARCHAR(100) NOT NULL,
  module_name VARCHAR(100) NOT NULL,
  record_id   INT          DEFAULT NULL,
  description TEXT         DEFAULT NULL,
  ip_address  VARCHAR(100) DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_user_time   (user_id, created_at),
  KEY idx_audit_module_time (module_name, created_at),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
