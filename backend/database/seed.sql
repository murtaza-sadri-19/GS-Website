-- =============================================================================
-- Seed — roles + first CENTRAL_ADMIN user
--
-- Password for admin@college.edu is: Admin@123
-- Hash generated with bcrypt, cost factor 10.
-- Run this AFTER schema.sql.
-- =============================================================================

USE SGSITS_DB;

-- ── Roles ─────────────────────────────────────────────────────────────────────
INSERT INTO roles (role_name) VALUES
  ('CENTRAL_ADMIN'),
  ('EXAM_CONTROLLER'),
  ('PLACEMENT_OFFICER'),
  ('HOD'),
  ('TEACHER')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- ── First CENTRAL_ADMIN user ──────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status)
VALUES (
  (SELECT id FROM roles WHERE role_name = 'CENTRAL_ADMIN'),
  NULL,
  'Central Admin',
  'admin@college.edu',
  '$2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC',
  NULL,
  'ACTIVE'
)
ON DUPLICATE KEY UPDATE
  name          = VALUES(name),
  password_hash = VALUES(password_hash),
  status        = VALUES(status);

-- ── Seed pages ────────────────────────────────────────────────────────────────
INSERT INTO pages (title, slug, content, meta_title, meta_description, updated_by, status)
VALUES
  (
    'About',
    'about',
    NULL,
    NULL,
    NULL,
    (SELECT id FROM users WHERE email = 'admin@college.edu'),
    'DRAFT'
  ),
  (
    'Administration',
    'administration',
    NULL,
    NULL,
    NULL,
    (SELECT id FROM users WHERE email = 'admin@college.edu'),
    'DRAFT'
  ),
  (
    'Contact',
    'contact',
    NULL,
    NULL,
    NULL,
    (SELECT id FROM users WHERE email = 'admin@college.edu'),
    'DRAFT'
  )
ON DUPLICATE KEY UPDATE
  title      = VALUES(title),
  updated_by = VALUES(updated_by);
