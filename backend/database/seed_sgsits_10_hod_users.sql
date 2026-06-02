-- =============================================================================
-- SGSITS Seed 10: HOD Users for all 17 SGSITS departments
-- Password for all accounts: Admin@123
-- Hash: $2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC
-- Run AFTER: schema.sql, schema_additions.sql, seed.sql, all migrations 003–012
-- Run BEFORE: seed_sgsits_11_departments.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @pwd = '$2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC';

-- Ensure HOD role exists
INSERT INTO roles (role_name) VALUES ('HOD')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- ── HOD Users for all 17 SGSITS departments ───────────────────────────────────
-- Institutional email for login; actual public email stored in departments.contact_email
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Nitish Gupta',          'hod.applied-chemistry@sgsits.ac.in',  @pwd, '+91-731-2582181', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Smita Verma',           'hod.applied-mathematics@sgsits.ac.in', @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Joseph Thomas Andrews', 'hod.applied-physics@sgsits.ac.in',    @pwd, '+91-731-2582435', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Ms. Vibha Bhatnagar',       'hod.biomedical-engineering@sgsits.ac.in', @pwd, '+91-731-2582471', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. R.K. Khare',            'hod.civil-engineering@sgsits.ac.in',  @pwd, '9425053428', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Urjita Thakar',         'hod.computer-engineering@sgsits.ac.in', @pwd, '0731-2582401', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Sunita Varma',          'hod.computer-technology@sgsits.ac.in', @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. H.K. Verma',            'hod.electrical-engineering@sgsits.ac.in', @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. R.C. Gurjar',           'hod.electronics-instrumentation@sgsits.ac.in', @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Satish Jain',           'hod.electronics-telecommunication@sgsits.ac.in', @pwd, '+91-731-2582451', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Neeraj Jain',           'hod.humanities@sgsits.ac.in',         @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Girish Thakar',         'hod.industrial-production@sgsits.ac.in', @pwd, '+91-731-2582371', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. K.K. Sharma',           'hod.information-technology@sgsits.ac.in', @pwd, '0731-2582260', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. R.C. Gupta',            'hod.management-studies@sgsits.ac.in', @pwd, '+91-731-2582651', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. B.R. Rawal',            'hod.mechanical-engineering@sgsits.ac.in', @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Vineet Singh',          'hod.pharmacy@sgsits.ac.in',           @pwd, NULL, 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Neeraj Jain',           'hod.coebg@sgsits.ac.in',              @pwd, NULL, 'ACTIVE')
ON DUPLICATE KEY UPDATE
  name=VALUES(name), phone=VALUES(phone), status=VALUES(status);

SET foreign_key_checks = 1;
