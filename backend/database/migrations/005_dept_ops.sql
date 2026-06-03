-- =============================================================================
-- 005 — Department operations: leaves, timetables, labs, achievements, registration
-- Idempotent. Depends on: users, departments, files (001_core).
-- =============================================================================
USE SGSITS_DB;

-- ── Leave requests (Teacher applies, HOD approves/rejects) ────────────────────
CREATE TABLE IF NOT EXISTS leave_requests (
  id                 INT          NOT NULL AUTO_INCREMENT,
  user_id            INT          NOT NULL,
  department_id      INT          DEFAULT NULL,
  leave_type         ENUM('Casual','Earned','Medical','Duty','Maternity','Other') NOT NULL DEFAULT 'Casual',
  from_date          DATE         NOT NULL,
  to_date            DATE         NOT NULL,
  days_count         INT          DEFAULT NULL,
  reason             TEXT         NOT NULL,
  attachment_file_id INT          DEFAULT NULL,
  status             ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by        INT          DEFAULT NULL,
  review_remarks     TEXT         DEFAULT NULL,
  applied_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_leave_user (user_id),
  KEY idx_leave_dept_status (department_id, status),
  CONSTRAINT fk_leave_user     FOREIGN KEY (user_id)            REFERENCES users       (id) ON DELETE CASCADE,
  CONSTRAINT fk_leave_dept     FOREIGN KEY (department_id)      REFERENCES departments (id) ON DELETE SET NULL,
  CONSTRAINT fk_leave_file     FOREIGN KEY (attachment_file_id) REFERENCES files       (id) ON DELETE SET NULL,
  CONSTRAINT fk_leave_reviewer FOREIGN KEY (reviewed_by)        REFERENCES users       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Timetables + entries ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS timetables (
  id            INT          NOT NULL AUTO_INCREMENT,
  department_id INT          NOT NULL,
  course_id     INT          DEFAULT NULL,
  section_id    INT          DEFAULT NULL,
  semester      INT          DEFAULT NULL,
  academic_year VARCHAR(20)  DEFAULT NULL,
  title         VARCHAR(150) DEFAULT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_by    INT          DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_tt_dept (department_id),
  CONSTRAINT fk_tt_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE,
  CONSTRAINT fk_tt_user FOREIGN KEY (created_by)    REFERENCES users       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS timetable_entries (
  id              INT         NOT NULL AUTO_INCREMENT,
  timetable_id    INT         NOT NULL,
  day_of_week     ENUM('Mon','Tue','Wed','Thu','Fri','Sat') NOT NULL,
  period_no       INT         NOT NULL,
  subject_label   VARCHAR(200) DEFAULT NULL,
  faculty_user_id INT         DEFAULT NULL,
  room            VARCHAR(50) DEFAULT NULL,
  start_time      TIME        DEFAULT NULL,
  end_time        TIME        DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tt_slot (timetable_id, day_of_week, period_no),
  CONSTRAINT fk_tte_tt      FOREIGN KEY (timetable_id)    REFERENCES timetables (id) ON DELETE CASCADE,
  CONSTRAINT fk_tte_faculty FOREIGN KEY (faculty_user_id) REFERENCES users      (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Labs (per department) ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS labs (
  id             INT          NOT NULL AUTO_INCREMENT,
  department_id  INT          NOT NULL,
  name           VARCHAR(200) NOT NULL,
  description    TEXT         DEFAULT NULL,
  equipment_list TEXT         DEFAULT NULL,
  incharge       VARCHAR(150) DEFAULT NULL,
  capacity       INT          DEFAULT NULL,
  image_file_id  INT          DEFAULT NULL,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_by     INT          DEFAULT NULL,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_labs_dept (department_id, is_active),
  CONSTRAINT fk_labs_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE,
  CONSTRAINT fk_labs_file FOREIGN KEY (image_file_id) REFERENCES files       (id) ON DELETE SET NULL,
  CONSTRAINT fk_labs_user FOREIGN KEY (created_by)    REFERENCES users       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Department achievements ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS department_achievements (
  id               INT          NOT NULL AUTO_INCREMENT,
  department_id    INT          NOT NULL,
  title            VARCHAR(500) NOT NULL,
  description      TEXT         DEFAULT NULL,
  achievement_year INT          DEFAULT NULL,
  category         VARCHAR(100) DEFAULT NULL,
  image_file_id    INT          DEFAULT NULL,
  status           ENUM('DRAFT','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'PUBLISHED',
  created_by       INT          DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_achv_dept (department_id, status),
  CONSTRAINT fk_achv_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE,
  CONSTRAINT fk_achv_file FOREIGN KEY (image_file_id) REFERENCES files       (id) ON DELETE SET NULL,
  CONSTRAINT fk_achv_user FOREIGN KEY (created_by)    REFERENCES users       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Registration requests (HOD approval workflow) ─────────────────────────────
CREATE TABLE IF NOT EXISTS registration_requests (
  id                    INT          NOT NULL AUTO_INCREMENT,
  department_id         INT          NOT NULL,
  student_enrollment_no VARCHAR(50)  DEFAULT NULL,
  student_name          VARCHAR(200) DEFAULT NULL,
  subject_label         VARCHAR(200) DEFAULT NULL,
  semester              INT          DEFAULT NULL,
  reason                TEXT         DEFAULT NULL,
  status                ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by           INT          DEFAULT NULL,
  review_remarks        TEXT         DEFAULT NULL,
  created_at            DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_regreq_dept_status (department_id, status),
  CONSTRAINT fk_regreq_dept     FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE,
  CONSTRAINT fk_regreq_reviewer FOREIGN KEY (reviewed_by)   REFERENCES users       (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
