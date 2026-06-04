-- =============================================================================
-- 020 — Dynamic Leave Management System
-- Creates leave_types, leave_policies, adds leave_type_id to leave_requests.
-- Idempotent. Depends on: leave_requests (schema.sql), users, departments.
-- =============================================================================
USE SGSITS_DB;

-- ── Leave Types ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leave_types (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  code        VARCHAR(30)  NOT NULL,
  description TEXT         DEFAULT NULL,
  color       VARCHAR(20)  NOT NULL DEFAULT '#0b2545',
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_leave_type_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Leave Policies ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leave_policies (
  id                       INT         NOT NULL AUTO_INCREMENT,
  leave_type_id            INT         NOT NULL,
  role                     ENUM('TEACHER','HOD','CENTRAL_ADMIN','EXAM_CONTROLLER','PLACEMENT_OFFICER')
                                        NOT NULL DEFAULT 'TEACHER',
  department_id            INT         DEFAULT NULL,
  academic_year            VARCHAR(10) NOT NULL DEFAULT '2026-27',
  max_days                 INT         NOT NULL DEFAULT 0,
  carry_forward            TINYINT(1)  NOT NULL DEFAULT 0,
  requires_attachment      TINYINT(1)  NOT NULL DEFAULT 0,
  requires_hod_approval    TINYINT(1)  NOT NULL DEFAULT 1,
  requires_principal_approval TINYINT(1) NOT NULL DEFAULT 0,
  created_at               DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at               DATETIME    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_policy (leave_type_id, role, department_id, academic_year),
  KEY idx_policy_year (academic_year),
  CONSTRAINT fk_policy_leave_type FOREIGN KEY (leave_type_id) REFERENCES leave_types (id) ON DELETE CASCADE,
  CONSTRAINT fk_policy_dept FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Extend leave_requests: add leave_type_id FK (nullable for backward compat) ──
ALTER TABLE leave_requests
  ADD COLUMN IF NOT EXISTS leave_type_id INT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS academic_year VARCHAR(10) DEFAULT NULL;

-- Add FK only if it doesn't exist
SET @exists = (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'leave_requests'
    AND CONSTRAINT_NAME = 'fk_lr_leave_type'
);
SET @sql = IF(@exists = 0,
  'ALTER TABLE leave_requests ADD CONSTRAINT fk_lr_leave_type FOREIGN KEY (leave_type_id) REFERENCES leave_types (id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ── Seed standard leave types ─────────────────────────────────────────────────
INSERT INTO leave_types (name, code, description, color) VALUES
  ('Casual Leave',       'CL',  'For personal/family reasons',                  '#0b2545'),
  ('Medical Leave',      'ML',  'For illness or medical treatment',              '#ef4444'),
  ('Duty Leave',         'DL',  'For official duties, conferences, inspections', '#bfa15f'),
  ('Earned Leave',       'EL',  'Accumulated earned leave',                      '#8b5cf6'),
  ('Maternity Leave',    'MTL', 'For maternity purposes',                        '#ec4899'),
  ('Paternity Leave',    'PTL', 'For paternity purposes',                        '#06b6d4'),
  ('Compensatory Leave', 'COL', 'In lieu of extra duty performed',               '#10b981'),
  ('Study Leave',        'STL', 'For academic/research purposes',                '#f59e0b'),
  ('Special Leave',      'SPL', 'Special circumstances by Principal approval',   '#6366f1')
ON DUPLICATE KEY UPDATE name = VALUES(name), description = VALUES(description), color = VALUES(color);

-- ── Seed default policies for TEACHER role ────────────────────────────────────
INSERT INTO leave_policies (leave_type_id, role, department_id, academic_year, max_days, requires_attachment) VALUES
  ((SELECT id FROM leave_types WHERE code='CL'),  'TEACHER', NULL, '2026-27', 12, 0),
  ((SELECT id FROM leave_types WHERE code='ML'),  'TEACHER', NULL, '2026-27', 10, 1),
  ((SELECT id FROM leave_types WHERE code='DL'),  'TEACHER', NULL, '2026-27', 15, 1),
  ((SELECT id FROM leave_types WHERE code='EL'),  'TEACHER', NULL, '2026-27', 30, 0),
  ((SELECT id FROM leave_types WHERE code='MTL'), 'TEACHER', NULL, '2026-27', 180, 1),
  ((SELECT id FROM leave_types WHERE code='PTL'), 'TEACHER', NULL, '2026-27', 15, 1),
  ((SELECT id FROM leave_types WHERE code='COL'), 'TEACHER', NULL, '2026-27', 10, 0),
  ((SELECT id FROM leave_types WHERE code='STL'), 'TEACHER', NULL, '2026-27', 365, 1),
  ((SELECT id FROM leave_types WHERE code='SPL'), 'TEACHER', NULL, '2026-27', 7, 1)
ON DUPLICATE KEY UPDATE max_days = VALUES(max_days);

-- Seed HOD policies (slightly higher limits)
INSERT INTO leave_policies (leave_type_id, role, department_id, academic_year, max_days, requires_attachment) VALUES
  ((SELECT id FROM leave_types WHERE code='CL'),  'HOD', NULL, '2026-27', 15, 0),
  ((SELECT id FROM leave_types WHERE code='ML'),  'HOD', NULL, '2026-27', 12, 1),
  ((SELECT id FROM leave_types WHERE code='DL'),  'HOD', NULL, '2026-27', 20, 1),
  ((SELECT id FROM leave_types WHERE code='EL'),  'HOD', NULL, '2026-27', 30, 0),
  ((SELECT id FROM leave_types WHERE code='COL'), 'HOD', NULL, '2026-27', 10, 0)
ON DUPLICATE KEY UPDATE max_days = VALUES(max_days);

-- Backfill leave_type_id for existing leave_requests where possible
UPDATE leave_requests lr
JOIN leave_types lt ON lt.name = lr.leave_type
SET lr.leave_type_id = lt.id
WHERE lr.leave_type_id IS NULL;

-- Backfill academic_year for existing records
UPDATE leave_requests
SET academic_year = CONCAT(YEAR(from_date), '-', RIGHT(YEAR(from_date)+1, 2))
WHERE academic_year IS NULL AND from_date IS NOT NULL;
