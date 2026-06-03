-- =============================================================================
-- 006 — Structured placement: companies, drives, internships, yearly stats
-- Idempotent. Depends on: users, files (001_core).
-- The generic placement_records table (10.8) stays for notices/visits/records/
-- training-programs; these add the structured entities the dashboards need.
-- =============================================================================
USE SGSITS_DB;

CREATE TABLE IF NOT EXISTS companies (
  id            INT          NOT NULL AUTO_INCREMENT,
  name          VARCHAR(200) NOT NULL,
  sector        VARCHAR(100) DEFAULT NULL,
  website       VARCHAR(300) DEFAULT NULL,
  logo_file_id  INT          DEFAULT NULL,
  contact_email VARCHAR(150) DEFAULT NULL,
  contact_phone VARCHAR(30)  DEFAULT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_companies_name (name),
  CONSTRAINT fk_companies_logo FOREIGN KEY (logo_file_id) REFERENCES files (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS placement_drives (
  id                   INT          NOT NULL AUTO_INCREMENT,
  company_id           INT          DEFAULT NULL,
  title                VARCHAR(255) NOT NULL,
  job_title            VARCHAR(255) DEFAULT NULL,
  ctc_lpa              DECIMAL(10,2) DEFAULT NULL,
  eligibility          TEXT         DEFAULT NULL,
  drive_date           DATE         DEFAULT NULL,
  registration_deadline DATE        DEFAULT NULL,
  is_active            TINYINT(1)   NOT NULL DEFAULT 1,
  created_by           INT          DEFAULT NULL,
  created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_drives_company (company_id),
  CONSTRAINT fk_drives_company FOREIGN KEY (company_id) REFERENCES companies (id) ON DELETE SET NULL,
  CONSTRAINT fk_drives_user    FOREIGN KEY (created_by) REFERENCES users     (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS internships (
  id                    INT          NOT NULL AUTO_INCREMENT,
  company_id            INT          DEFAULT NULL,
  student_enrollment_no VARCHAR(50)  DEFAULT NULL,
  student_name          VARCHAR(200) DEFAULT NULL,
  title                 VARCHAR(255) NOT NULL,
  duration_months       INT          DEFAULT NULL,
  stipend               DECIMAL(10,2) DEFAULT NULL,
  start_date            DATE         DEFAULT NULL,
  end_date              DATE         DEFAULT NULL,
  status                VARCHAR(50)  DEFAULT 'ongoing',
  report_file_id        INT          DEFAULT NULL,
  created_by            INT          DEFAULT NULL,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_intern_company (company_id),
  CONSTRAINT fk_intern_company FOREIGN KEY (company_id)     REFERENCES companies (id) ON DELETE SET NULL,
  CONSTRAINT fk_intern_report  FOREIGN KEY (report_file_id) REFERENCES files     (id) ON DELETE SET NULL,
  CONSTRAINT fk_intern_user    FOREIGN KEY (created_by)     REFERENCES users     (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS placement_year_stats (
  id               INT          NOT NULL AUTO_INCREMENT,
  academic_year    VARCHAR(20)  NOT NULL,
  total_students   INT          DEFAULT NULL,
  students_placed  INT          DEFAULT NULL,
  placement_pct    DECIMAL(5,2) DEFAULT NULL,
  highest_package  VARCHAR(50)  DEFAULT NULL,
  average_package  VARCHAR(50)  DEFAULT NULL,
  companies_visited INT         DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pys_year (academic_year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
