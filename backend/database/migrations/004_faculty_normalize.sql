-- =============================================================================
-- 004 — Normalize faculty sub-resources (were TEXT blobs in faculty_profiles)
-- Idempotent. Depends on: faculty_profiles (001_core).
-- The legacy TEXT columns (publications, research_work, subjects) remain for
-- backward-compat; new structured tables are the source of truth going forward.
-- =============================================================================
USE SGSITS_DB;

CREATE TABLE IF NOT EXISTS faculty_publications (
  id               INT          NOT NULL AUTO_INCREMENT,
  faculty_id       INT          NOT NULL,
  title            VARCHAR(500) NOT NULL,
  venue_type       ENUM('Journal','Conference','Book Chapter','Patent','Other') NOT NULL DEFAULT 'Journal',
  journal_name     VARCHAR(255) DEFAULT NULL,
  publication_year INT          DEFAULT NULL,
  authors          TEXT         DEFAULT NULL,
  link             VARCHAR(500) DEFAULT NULL,
  citations        INT          NOT NULL DEFAULT 0,
  status           ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fpub_faculty (faculty_id),
  CONSTRAINT fk_fpub_faculty FOREIGN KEY (faculty_id) REFERENCES faculty_profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faculty_research (
  id             INT          NOT NULL AUTO_INCREMENT,
  faculty_id     INT          NOT NULL,
  title          VARCHAR(500) NOT NULL,
  research_area  VARCHAR(255) DEFAULT NULL,
  description    TEXT         DEFAULT NULL,
  start_year     INT          DEFAULT NULL,
  end_year       INT          DEFAULT NULL,
  status         ENUM('Proposed','Ongoing','Completed','On Hold') NOT NULL DEFAULT 'Ongoing',
  funding_agency VARCHAR(255) DEFAULT NULL,
  funding_amount DECIMAL(12,2) DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fres_faculty (faculty_id),
  CONSTRAINT fk_fres_faculty FOREIGN KEY (faculty_id) REFERENCES faculty_profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faculty_qualifications (
  id             INT          NOT NULL AUTO_INCREMENT,
  faculty_id     INT          NOT NULL,
  degree         VARCHAR(150) NOT NULL,
  institution    VARCHAR(255) NOT NULL,
  year           INT          DEFAULT NULL,
  specialization VARCHAR(255) DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_fqual_faculty (faculty_id),
  CONSTRAINT fk_fqual_faculty FOREIGN KEY (faculty_id) REFERENCES faculty_profiles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
