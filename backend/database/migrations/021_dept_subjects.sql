-- =============================================================================
-- 021 — Department Subjects (HOD-owned, independent from exam system)
-- HOD has full CRUD. Not linked to exam_sessions or exam_courses.
-- Idempotent. Depends on: departments, users.
-- =============================================================================
USE SGSITS_DB;

CREATE TABLE IF NOT EXISTS dept_subjects (
  id              INT           NOT NULL AUTO_INCREMENT,
  department_id   INT           NOT NULL,
  subject_code    VARCHAR(30)   NOT NULL,
  subject_name    VARCHAR(255)  NOT NULL,
  subject_type    ENUM('Theory','Practical','Lab','Elective','Project','Seminar') NOT NULL DEFAULT 'Theory',
  semester        TINYINT       NOT NULL DEFAULT 1,
  credits         TINYINT       NOT NULL DEFAULT 3,
  program         VARCHAR(50)   NOT NULL DEFAULT 'B.Tech',
  academic_year   VARCHAR(10)   NOT NULL DEFAULT '2026-27',
  description     TEXT          DEFAULT NULL,
  faculty_user_id INT           DEFAULT NULL,
  is_active       TINYINT(1)    NOT NULL DEFAULT 1,
  created_by      INT           NOT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_dept_subj_code (department_id, subject_code, academic_year),
  KEY idx_ds_dept (department_id),
  KEY idx_ds_sem (semester),
  KEY idx_ds_faculty (faculty_user_id),
  CONSTRAINT fk_ds_dept    FOREIGN KEY (department_id)   REFERENCES departments (id) ON DELETE CASCADE,
  CONSTRAINT fk_ds_faculty FOREIGN KEY (faculty_user_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT fk_ds_creator FOREIGN KEY (created_by)      REFERENCES users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
