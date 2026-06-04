-- =============================================================================
-- SGSITS Seed 21: navigation_items table — full site nav tree
--
-- Seeds the relational navigation_items table (used by GET /api/v1/navigation).
-- Mirrors the structure in seed_sgsits_17_navigation.sql (cms_sections) so
-- both nav systems stay in sync.
--
-- Run AFTER: seed_sgsits_17_navigation.sql
-- =============================================================================
USE SGSITS_DB;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- Wipe existing rows so re-runs are idempotent (CASCADE handles children)
DELETE FROM navigation_items WHERE parent_id IS NULL;

-- ── Root items ────────────────────────────────────────────────────────────────
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (NULL, 'Home',        '/',             0, '_self', 1),
  (NULL, 'About Us',    '/about',        1, '_self', 1),
  (NULL, 'Academics',   '/academics',    2, '_self', 1),
  (NULL, 'Departments', '/departments',  3, '_self', 1),
  (NULL, 'Admissions',  '/admission',    4, '_self', 1),
  (NULL, 'Placements',  '/placement',    5, '_self', 1),
  (NULL, 'Campus Life', '/campus-life',  6, '_self', 1),
  (NULL, 'Facilities',  '/facilities',   7, '_self', 1),
  (NULL, 'More',        '/more',         8, '_self', 1);

-- ── About Us children ─────────────────────────────────────────────────────────
SET @about = (SELECT id FROM navigation_items WHERE url = '/about' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@about, 'About Institute',           '/about/institute',            0, '_self', 1),
  (@about, 'Vision & Mission',          '/about/vision-mission',       1, '_self', 1),
  (@about, 'Director''s Message',       '/about/director-message',     2, '_self', 1),
  (@about, 'Governing Body',            '/about/governing-body',       3, '_self', 1),
  (@about, 'Administration',            '/about/administration',       4, '_self', 1),
  (@about, 'Administrative Committees', '/about/committees',           5, '_self', 1),
  (@about, 'Telephone Directory',       '/about/telephone-directory',  6, '_self', 1),
  (@about, 'Infrastructure',            '/about/infrastructure',       7, '_self', 1),
  (@about, 'IQAC Cell',                 '/about/iqac',                 8, '_self', 1),
  (@about, 'Academic Council',          '/about/academic-council',     9, '_self', 1),
  (@about, 'Accreditation (NBA/NAAC)',  '/about/accreditation',       10, '_self', 1);

-- ── Academics children ────────────────────────────────────────────────────────
SET @acad = (SELECT id FROM navigation_items WHERE url = '/academics' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@acad, 'Academic Calendar',     '/academics/calendar',           0, '_self', 1),
  (@acad, 'UG Courses',            '/academics/courses/ug',         1, '_self', 1),
  (@acad, 'PG Courses',            '/academics/courses/pg',         2, '_self', 1),
  (@acad, 'Ph.D. Programs',        '/academics/courses/phd',        3, '_self', 1),
  (@acad, 'PTDC Courses',          '/academics/courses/ptdc',       4, '_self', 1),
  (@acad, 'Online Courses (MOOC)', '/academics/courses/online',     5, '_self', 1),
  (@acad, 'First Year Info',       '/academics/first-year',         6, '_self', 1),
  (@acad, 'Exam & Results',        '/academics/exam-results',       7, '_self', 1),
  (@acad, 'Ordinances',            '/academics/ordinances',         8, '_self', 1),
  (@acad, 'Plagiarism Policy',     '/academics/plagiarism-policy',  9, '_self', 1),
  (@acad, 'Code of Ethics',        '/academics/code-of-conduct',   10, '_self', 1),
  (@acad, 'OBE & NEP 2020',        '/academics/obe-nep-2020',      11, '_self', 1);

-- ── Departments children ──────────────────────────────────────────────────────
SET @dept = (SELECT id FROM navigation_items WHERE url = '/departments' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@dept, 'All Departments',                '/departments',                               0, '_self', 1),
  (@dept, 'Applied Chemistry',              '/departments/applied-chemistry',             1, '_self', 1),
  (@dept, 'Applied Mathematics',            '/departments/applied-mathematics',           2, '_self', 1),
  (@dept, 'Applied Physics',                '/departments/applied-physics',               3, '_self', 1),
  (@dept, 'Biomedical Engineering',         '/departments/biomedical-engineering',        4, '_self', 1),
  (@dept, 'Civil Engineering',              '/departments/civil-engineering',             5, '_self', 1),
  (@dept, 'Computer Engineering',           '/departments/computer-engineering',          6, '_self', 1),
  (@dept, 'Computer Tech & Apps (CTA)',     '/departments/computer-technology',           7, '_self', 1),
  (@dept, 'Electrical Engineering',         '/departments/electrical-engineering',        8, '_self', 1),
  (@dept, 'Electronics & Instrumentation',  '/departments/electronics-instrumentation',   9, '_self', 1),
  (@dept, 'Electronics & Telecomm',         '/departments/electronics-telecommunication',10, '_self', 1),
  (@dept, 'Humanities & Social Sciences',   '/departments/humanities',                   11, '_self', 1),
  (@dept, 'Industrial & Production',        '/departments/industrial-production',        12, '_self', 1),
  (@dept, 'Information Technology',         '/departments/information-technology',       13, '_self', 1),
  (@dept, 'Management Studies (MBA)',       '/departments/management-studies',           14, '_self', 1),
  (@dept, 'Mechanical Engineering',         '/departments/mechanical-engineering',       15, '_self', 1),
  (@dept, 'Pharmacy',                       '/departments/pharmacy',                     16, '_self', 1),
  (@dept, 'Centre of Excellence (CoE)',     '/departments/coebg',                        17, '_self', 1);

-- ── Admissions children ───────────────────────────────────────────────────────
SET @adm = (SELECT id FROM navigation_items WHERE url = '/admission' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@adm, 'UG Admissions',       '/admission/ug',         0, '_self', 1),
  (@adm, 'PG Admissions',       '/admission/pg',         1, '_self', 1),
  (@adm, 'PhD Admissions',      '/admission/phd',        2, '_self', 1),
  (@adm, 'Prospectus Download', '/admission/prospectus', 3, '_self', 1);

-- ── Placements children ───────────────────────────────────────────────────────
SET @place = (SELECT id FROM navigation_items WHERE url = '/placement' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@place, 'T&P Cell Overview',  '/placement/tnp-cell',  0, '_self', 1),
  (@place, 'Leading Recruiters', '/placement/companies', 1, '_self', 1),
  (@place, 'Placement Record',   '/placement/record',    2, '_self', 1),
  (@place, 'Placement Contacts', '/placement/contact',   3, '_self', 1);

-- ── Campus Life children ──────────────────────────────────────────────────────
SET @campus = (SELECT id FROM navigation_items WHERE url = '/campus-life' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@campus, 'Student Activities',     '/students/activities',             0, '_self', 1),
  (@campus, 'Govt. Scholarships',     '/students/scholarship/govt',       1, '_self', 1),
  (@campus, 'Institute Scholarships', '/students/scholarship/institute',  2, '_self', 1),
  (@campus, 'Sports & Games (SSS)',   '/students/sss',                    3, '_self', 1),
  (@campus, 'NCC Wing',               '/students/ncc',                    4, '_self', 1),
  (@campus, 'NSS Wing',               '/students/nss',                    5, '_self', 1);

-- ── Facilities children ───────────────────────────────────────────────────────
SET @fac = (SELECT id FROM navigation_items WHERE url = '/facilities' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@fac, 'Computer Center',  '/facilities/computer-center',  0, '_self', 1),
  (@fac, 'Central Library',  '/facilities/library',           1, '_self', 1),
  (@fac, 'Central Workshop', '/facilities/workshop',          2, '_self', 1),
  (@fac, 'Gymnasium',        '/facilities/gymnasium',         3, '_self', 1),
  (@fac, 'Dispensary',       '/facilities/dispensary',        4, '_self', 1),
  (@fac, 'CIDI Center',      '/facilities/cidi',              5, '_self', 1),
  (@fac, 'Sports Complex',   '/facilities/sports',            6, '_self', 1),
  (@fac, 'Boys Hostel',      '/facilities/hostel/boys',       7, '_self', 1),
  (@fac, 'Girls Hostel',     '/facilities/hostel/girls',      8, '_self', 1),
  (@fac, 'Transit Hostel',   '/facilities/hostel/transit',    9, '_self', 1),
  (@fac, 'Staff Quarters',   '/facilities/hostel/staff',     10, '_self', 1),
  (@fac, 'AICTE IDEA Lab',   '/facilities/idea-lab',         11, '_self', 1);

-- ── More children ─────────────────────────────────────────────────────────────
SET @more = (SELECT id FROM navigation_items WHERE url = '/more' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@more, 'Startup & Incubation Cell', '/startup-cell',  0, '_self', 1),
  (@more, 'TEQIP Portal',              '/teqip/about',   1, '_self', 1),
  (@more, 'Latest Notices',            '/notices',       2, '_self', 1),
  (@more, 'Campus News',               '/news',          3, '_self', 1),
  (@more, 'Upcoming Events',           '/events',        4, '_self', 1),
  (@more, 'Procurement Tenders',       '/tenders',       5, '_self', 1),
  (@more, 'Contact Us',                '/contact',       6, '_self', 1);

SET foreign_key_checks = 1;

SELECT 'navigation_items seeded.' AS status;
