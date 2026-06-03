-- =============================================================================
-- 011 — Department extended fields: established_year, email, phone
--
-- departments.established_year — integer year (e.g. 1997)
-- departments.contact_email    — department-level public email address
-- departments.contact_phone    — department-level public phone
--
-- Idempotent via ADD COLUMN … DEFAULT NULL.
-- HOD contact info (hod_phone) is served by JOINing users; no column needed here.
-- =============================================================================
USE SGSITS_DB;

-- Add established_year
ALTER TABLE departments
  ADD COLUMN established_year SMALLINT UNSIGNED DEFAULT NULL
    COMMENT 'Year the department was established';

-- Add department contact email (separate from HOD user email)
ALTER TABLE departments
  ADD COLUMN contact_email VARCHAR(150) DEFAULT NULL
    COMMENT 'Publicly listed department contact email';

-- Add department contact phone
ALTER TABLE departments
  ADD COLUMN contact_phone VARCHAR(30) DEFAULT NULL
    COMMENT 'Publicly listed department phone number';
