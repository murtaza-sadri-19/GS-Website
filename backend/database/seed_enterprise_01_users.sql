-- =============================================================================
-- ENTERPRISE SEED — Part 01: Roles & Users
-- All passwords = Admin@123  (bcrypt cost 10)
-- Hash: $2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC
-- Run AFTER: schema.sql, schema_additions.sql, all migrations 003–011
-- Run BEFORE: seed_enterprise_02_departments.sql
-- =============================================================================
USE SGSITS_DB;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Roles (idempotent) ────────────────────────────────────────────────────
INSERT INTO roles (role_name) VALUES
  ('CENTRAL_ADMIN'), ('EXAM_CONTROLLER'), ('PLACEMENT_OFFICER'),
  ('HOD'), ('TEACHER'), ('SUPER_ADMIN'), ('CONTENT_EDITOR')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- ─── 2. Users ─────────────────────────────────────────────────────────────────
-- Stored password hash for "Admin@123" (bcrypt, cost 10)
SET @pwd = '$2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC';

-- ── System / global admins (no department yet — set after dept insert) ─────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='CENTRAL_ADMIN'), NULL,
   'Central Admin', 'admin@college.edu', @pwd, '0731-2431300', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='SUPER_ADMIN'), NULL,
   'Prof. R.K. Pandey', 'director@sgsits.ac.in', @pwd, '0731-2431301', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='CONTENT_EDITOR'), NULL,
   'Priya Sharma', 'priya.sharma@sgsits.ac.in', @pwd, '9826001001', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='CONTENT_EDITOR'), NULL,
   'Rahul Gupta', 'rahul.gupta@sgsits.ac.in', @pwd, '9826001002', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='EXAM_CONTROLLER'), NULL,
   'Dr. Suresh Malviya', 'examcontroller@sgsits.ac.in', @pwd, '9826001003', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='PLACEMENT_OFFICER'), NULL,
   'Mr. Vivek Tiwari', 'placement@sgsits.ac.in', @pwd, '9826001004', 'ACTIVE')
ON DUPLICATE KEY UPDATE
  name=VALUES(name), phone=VALUES(phone), status=VALUES(status);

-- ── HODs (department_id patched in Part 02) ───────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Ajay Khunteta', 'hod.ce@sgsits.ac.in', @pwd, '9826002001', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Kapil Jain', 'hod.it@sgsits.ac.in', @pwd, '9826002002', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Pradeep Kasande', 'hod.me@sgsits.ac.in', @pwd, '9826002003', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Yogesh Kumar Bajpai', 'hod.civil@sgsits.ac.in', @pwd, '9826002004', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Manoj Kumar Jain', 'hod.ee@sgsits.ac.in', @pwd, '9826002005', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Shailendra Kumar Singh', 'hod.ec@sgsits.ac.in', @pwd, '9826002006', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Rekha Pandey', 'hod.ash@sgsits.ac.in', @pwd, '9826002007', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Vandana Bhatt', 'hod.mca@sgsits.ac.in', @pwd, '9826002008', 'ACTIVE'),

  ((SELECT id FROM roles WHERE role_name='HOD'), NULL,
   'Dr. Sanjay Sharma', 'hod.mba@sgsits.ac.in', @pwd, '9826002009', 'ACTIVE')
ON DUPLICATE KEY UPDATE
  name=VALUES(name), phone=VALUES(phone), status=VALUES(status);

-- ── CE Faculty ────────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Nisha Thakur', 'nisha.thakur@sgsits.ac.in', @pwd, '9826003001', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Amit Soni', 'amit.soni@sgsits.ac.in', @pwd, '9826003002', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Seema Rathore', 'seema.rathore@sgsits.ac.in', @pwd, '9826003003', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Vivek Sharma', 'vivek.sharma.ce@sgsits.ac.in', @pwd, '9826003004', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Kiran Patel', 'kiran.patel.ce@sgsits.ac.in', @pwd, '9826003005', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── IT Faculty ────────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Pooja Chouhan', 'pooja.chouhan@sgsits.ac.in', @pwd, '9826003006', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Rajesh Verma', 'rajesh.verma.it@sgsits.ac.in', @pwd, '9826003007', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Anjali Singh', 'anjali.singh.it@sgsits.ac.in', @pwd, '9826003008', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Manish Dubey', 'manish.dubey@sgsits.ac.in', @pwd, '9826003009', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Sneha Tiwari', 'sneha.tiwari@sgsits.ac.in', @pwd, '9826003010', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── ME Faculty ────────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Rakesh Chouksey', 'rakesh.chouksey@sgsits.ac.in', @pwd, '9826003011', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Anil Kumar Agrawal', 'anil.agrawal@sgsits.ac.in', @pwd, '9826003012', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Neha Joshi', 'neha.joshi.me@sgsits.ac.in', @pwd, '9826003013', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Sanjay Patidar', 'sanjay.patidar@sgsits.ac.in', @pwd, '9826003014', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Devendra Mandloi', 'devendra.mandloi@sgsits.ac.in', @pwd, '9826003015', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── Civil Faculty ─────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Meena Agrawal', 'meena.agrawal@sgsits.ac.in', @pwd, '9826003016', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Dinesh Kumar Shukla', 'dinesh.shukla@sgsits.ac.in', @pwd, '9826003017', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Sunita Rawat', 'sunita.rawat@sgsits.ac.in', @pwd, '9826003018', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Pavan Kumar', 'pavan.kumar.civil@sgsits.ac.in', @pwd, '9826003019', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Hemant Vishwakarma', 'hemant.vishwakarma@sgsits.ac.in', @pwd, '9826003020', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── EE Faculty ────────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Archana Patel', 'archana.patel.ee@sgsits.ac.in', @pwd, '9826003021', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Naveen Mishra', 'naveen.mishra@sgsits.ac.in', @pwd, '9826003022', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Leena Dadhich', 'leena.dadhich@sgsits.ac.in', @pwd, '9826003023', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Rupesh Kumar', 'rupesh.kumar.ee@sgsits.ac.in', @pwd, '9826003024', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Shivam Upadhyay', 'shivam.upadhyay@sgsits.ac.in', @pwd, '9826003025', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── EC Faculty ────────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Deepak Bhatt', 'deepak.bhatt@sgsits.ac.in', @pwd, '9826003026', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Ravi Shankar Dixit', 'ravi.dixit@sgsits.ac.in', @pwd, '9826003027', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Shweta Mehta', 'shweta.mehta.ec@sgsits.ac.in', @pwd, '9826003028', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Anupam Shukla', 'anupam.shukla@sgsits.ac.in', @pwd, '9826003029', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Monika Yadav', 'monika.yadav.ec@sgsits.ac.in', @pwd, '9826003030', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── ASH Faculty ───────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Sunanda Nagar', 'sunanda.nagar@sgsits.ac.in', @pwd, '9826003031', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Anil Chouhan', 'anil.chouhan.ash@sgsits.ac.in', @pwd, '9826003032', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Pratibha Pandey', 'pratibha.pandey@sgsits.ac.in', @pwd, '9826003033', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── MCA Faculty ───────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Deepika Saxena', 'deepika.saxena@sgsits.ac.in', @pwd, '9826003034', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Shailesh Khatri', 'shailesh.khatri@sgsits.ac.in', @pwd, '9826003035', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Asha Gour', 'asha.gour@sgsits.ac.in', @pwd, '9826003036', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

-- ── MBA Faculty ───────────────────────────────────────────────────────────────
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Sangeeta Jain', 'sangeeta.jain@sgsits.ac.in', @pwd, '9826003037', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Prof. Pankaj Singhal', 'pankaj.singhal@sgsits.ac.in', @pwd, '9826003038', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL,
   'Dr. Ritu Agrawal', 'ritu.agrawal.mba@sgsits.ac.in', @pwd, '9826003039', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), status=VALUES(status);

SET foreign_key_checks = 1;
