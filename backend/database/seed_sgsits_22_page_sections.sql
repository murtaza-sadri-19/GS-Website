-- =============================================================================
-- SGSITS Seed 22: page_sections — default sections for all 8 landing pages
--
-- section_type reference:
--   hero         — page header (title, subtitle, breadcrumb, CTA)
--   nav_children — cards auto-pulled from navigation.nav_tree children
--                  settings_json.navLabel = matching label in nav tree
--                  settings_json.descriptions = { title → description } map
--   stats        — stat counters (static or live from DB)
--   dynamic_data — single live DB metric
--   html         — rich HTML content block
--   cta          — call-to-action banner
--   announcements— pull latest notices/news for this section's tags
--   links        — list of quick links
--
-- Run AFTER: seed_sgsits_17_navigation.sql (nav tree must exist)
-- The CREATE TABLE guard below makes this seed safe to run even if migration
-- 022_page_sections.sql has not been applied yet (idempotent).
-- =============================================================================
USE SGSITS_DB;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ── Ensure table exists (guard — migration 022 is the canonical DDL) ──────────
CREATE TABLE IF NOT EXISTS page_sections (
  id            INT          NOT NULL AUTO_INCREMENT,
  page_key      VARCHAR(100) NOT NULL,
  section_key   VARCHAR(100) NOT NULL,
  section_type  ENUM(
    'hero','stats','cards','nav_children',
    'links','downloads','gallery','faq',
    'cta','announcements','dynamic_data','html','featured'
  ) NOT NULL DEFAULT 'html',
  title         VARCHAR(255)  DEFAULT NULL,
  subtitle      VARCHAR(1000) DEFAULT NULL,
  content       LONGTEXT      DEFAULT NULL,
  settings_json JSON          DEFAULT NULL,
  display_order INT           NOT NULL DEFAULT 0,
  is_active     TINYINT(1)    NOT NULL DEFAULT 1,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE  KEY uq_page_section (page_key, section_key),
  KEY idx_page_sections_lookup (page_key, is_active, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ABOUT US ─────────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('about', 'hero', 'hero',
 'About the Institute',
 'Explore the institute''s history, leadership, governance, accreditation, infrastructure, and vision.',
 JSON_OBJECT(
   'breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','About Us')),
   'primaryCta',  JSON_OBJECT('label','Explore Sections','anchor','#sections'),
   'secondaryCta',JSON_OBJECT('label','Our History','path','/about/institute')
 ), 0),

('about', 'stats', 'dynamic_data',
 'Institute at a Glance', NULL,
 JSON_OBJECT(
   'items', JSON_ARRAY(
     JSON_OBJECT('label','Years of Excellence','metric','yearsOfExcellence','suffix','+'),
     JSON_OBJECT('label','Departments',        'metric','departments',      'suffix','+'),
     JSON_OBJECT('label','Faculty Members',    'metric','faculty',          'suffix','+'),
     JSON_OBJECT('label','Active Notices',     'metric','notices',          'suffix','')
   )
 ), 1),

('about', 'quick_access', 'nav_children',
 'Explore About SGSITS', NULL,
 JSON_OBJECT(
   'navLabel', 'About Us',
   'descriptions', JSON_OBJECT(
     'About Institute',           'History, legacy, and milestones of SGSITS.',
     'Vision & Mission',          'Guiding principles and strategic direction.',
     'Director''s Message',       'Inspiring words from the Director of SGSITS.',
     'Administration',            'Key administrative officers and contacts.',
     'Governing Body',            'Distinguished members overseeing the institute.',
     'Administrative Committees', 'Administrative committees and responsibilities.',
     'Telephone Directory',       'Official directory of departments and offices.',
     'Infrastructure',            'Labs, buildings and campus facilities.',
     'Academic Council',          'Academic governance body of the institute.',
     'Accreditation (NBA/NAAC)',  'NBA and NAAC accreditation status and reports.',
     'IQAC Cell',                 'Internal Quality Assurance Cell and its initiatives.'
   )
 ), 2),

('about', 'cta', 'cta',
 'Continue Exploring SGSITS', 'Discover academics, placements, campus life, and more.',
 JSON_OBJECT(
   'links', JSON_ARRAY(
     JSON_OBJECT('label','Academics',   'path','/academics'),
     JSON_OBJECT('label','Admissions',  'path','/admission'),
     JSON_OBJECT('label','Placements',  'path','/placement'),
     JSON_OBJECT('label','Campus Life', 'path','/campus-life')
   )
 ), 3)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── ACADEMICS ────────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('academics', 'hero', 'hero',
 'Academics',
 'Programmes, calendar, examination, research, and quality initiatives at SGSITS Indore.',
 JSON_OBJECT(
   'breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','Academics')),
   'primaryCta',  JSON_OBJECT('label','View Programmes','path','/academics/courses/ug'),
   'secondaryCta',JSON_OBJECT('label','Academic Calendar','path','/academics/calendar')
 ), 0),

('academics', 'stats', 'dynamic_data',
 'Academics at a Glance', NULL,
 JSON_OBJECT(
   'items', JSON_ARRAY(
     JSON_OBJECT('label','UG Programmes','metric','departments','suffix','+'),
     JSON_OBJECT('label','Faculty Members','metric','faculty','suffix','+'),
     JSON_OBJECT('label','Years of Excellence','metric','yearsOfExcellence','suffix','+'),
     JSON_OBJECT('label','Active Downloads','metric','downloads','suffix','')
   )
 ), 1),

('academics', 'quick_access', 'nav_children',
 'Academic Sections', NULL,
 JSON_OBJECT(
   'navLabel', 'Academics',
   'descriptions', JSON_OBJECT(
     'Academic Calendar',     'Semester-wise schedule of academic activities.',
     'UG Courses',            'Bachelor of Engineering programmes offered at SGSITS.',
     'PG Courses',            'Master of Engineering and MBA programmes.',
     'Ph.D. Programs',        'Doctoral research programmes across departments.',
     'PTDC Courses',          'Part-time degree courses for working professionals.',
     'Online Courses (MOOC)', 'SWAYAM, NPTEL and other online learning resources.',
     'First Year Info',       'Orientation and information for first-year students.',
     'Exam & Results',        'Examination schedules, results and marksheets.',
     'Ordinances',            'Academic rules, regulations, and ordinances.',
     'Plagiarism Policy',     'Institute''s academic integrity and plagiarism guidelines.',
     'Code of Ethics',        'Professional and academic code of conduct.',
     'OBE & NEP 2020',        'Outcome-Based Education and NEP 2020 implementation.'
   )
 ), 2),

('academics', 'announcements', 'announcements',
 'Academic Notices', NULL,
 JSON_OBJECT('tags', JSON_ARRAY('academic','exam','result'), 'limit', 5),
 3)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('departments', 'hero', 'hero',
 'Departments',
 'Explore all engineering, science, and management departments at SGSITS Indore.',
 JSON_OBJECT('breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','Departments'))), 0),

('departments', 'stats', 'dynamic_data',
 NULL, NULL,
 JSON_OBJECT(
   'items', JSON_ARRAY(
     JSON_OBJECT('label','Departments',    'metric','departments',      'suffix',''),
     JSON_OBJECT('label','Faculty Members','metric','faculty',          'suffix','+'),
     JSON_OBJECT('label','Years Old',      'metric','yearsOfExcellence','suffix','+')
   )
 ), 1),

-- dept cards come from the live departments table (handled by DepartmentLanding)
('departments', 'info', 'html',
 'Live Department Directory',
 'Department cards are automatically pulled from the departments database. Creating or updating a department instantly reflects here.',
 NULL, 2)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── ADMISSIONS ───────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('admissions', 'hero', 'hero',
 'Admissions',
 'Join SGSITS Indore — explore UG, PG, and Ph.D. admission processes, eligibility and downloads.',
 JSON_OBJECT(
   'breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','Admissions')),
   'primaryCta',  JSON_OBJECT('label','UG Admissions','path','/admission/ug'),
   'secondaryCta',JSON_OBJECT('label','Download Prospectus','path','/admission/prospectus')
 ), 0),

('admissions', 'quick_access', 'nav_children',
 'Admission Programmes', NULL,
 JSON_OBJECT(
   'navLabel', 'Admissions',
   'descriptions', JSON_OBJECT(
     'UG Admissions', 'Bachelor of Engineering — admission process, eligibility and key dates.',
     'PG Admissions', 'M.E. / MBA — admission criteria and application procedure.',
     'PhD Admissions','Doctoral research admission — eligibility and interview process.',
     'Prospectus Download','Download the official SGSITS admissions prospectus.'
   )
 ), 1),

('admissions', 'announcements', 'announcements',
 'Admission Notices', NULL,
 JSON_OBJECT('tags', JSON_ARRAY('admission','counselling'), 'limit', 5),
 2),

('admissions', 'cta', 'cta',
 'Need Help with Admissions?',
 'Contact the admissions office or visit the FAQ section for guidance.',
 JSON_OBJECT(
   'links', JSON_ARRAY(
     JSON_OBJECT('label','Contact Us','path','/contact'),
     JSON_OBJECT('label','Downloads', 'path','/downloads')
   )
 ), 3)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── PLACEMENTS ───────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('placements', 'hero', 'hero',
 'Training & Placements',
 'Excellence in industry connect — placement records, leading recruiters, internships and T&P Cell.',
 JSON_OBJECT(
   'breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','Placements')),
   'primaryCta',  JSON_OBJECT('label','Placement Record','path','/placement/record'),
   'secondaryCta',JSON_OBJECT('label','Leading Recruiters','path','/placement/companies')
 ), 0),

('placements', 'stats', 'dynamic_data',
 'Placement Highlights', NULL,
 JSON_OBJECT(
   'items', JSON_ARRAY(
     JSON_OBJECT('label','Placement Drives','metric','placements','suffix','+'),
     JSON_OBJECT('label','Companies',       'metric','companies', 'suffix','+'),
     JSON_OBJECT('label','Faculty Members', 'metric','faculty',   'suffix','+'),
     JSON_OBJECT('label','Years of Legacy', 'metric','yearsOfExcellence','suffix','+')
   )
 ), 1),

('placements', 'quick_access', 'nav_children',
 'T&P Cell', NULL,
 JSON_OBJECT(
   'navLabel', 'Placements',
   'descriptions', JSON_OBJECT(
     'T&P Cell Overview', 'About the Training and Placement Cell at SGSITS.',
     'Leading Recruiters','Top companies that recruit from SGSITS every year.',
     'Placement Record',  'Year-wise placement statistics and package details.',
     'Placement Contacts','Contact the T&P Cell team for recruitment queries.'
   )
 ), 2),

('placements', 'announcements', 'announcements',
 'Placement Notices', NULL,
 JSON_OBJECT('tags', JSON_ARRAY('placement','internship'), 'limit', 4),
 3)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── CAMPUS LIFE ──────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('campus-life', 'hero', 'hero',
 'Campus Life',
 'Student activities, sports, NCC, NSS, scholarships, and welfare programmes at SGSITS.',
 JSON_OBJECT(
   'breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','Campus Life')),
   'primaryCta',  JSON_OBJECT('label','Student Activities','path','/students/activities'),
   'secondaryCta',JSON_OBJECT('label','Scholarships','path','/students/scholarship/govt')
 ), 0),

('campus-life', 'quick_access', 'nav_children',
 'Student Sections', NULL,
 JSON_OBJECT(
   'navLabel', 'Campus Life',
   'descriptions', JSON_OBJECT(
     'Student Activities',    'Cultural fests, technical events, and extra-curricular activities.',
     'Govt. Scholarships',    'Central and state government scholarship schemes for students.',
     'Institute Scholarships','Merit and need-based scholarships offered by the institute.',
     'Sports & Games (SSS)',  'Sports and games facilities managed by the Students'' Sports Society.',
     'NCC Wing',              'National Cadet Corps — discipline, leadership and national service.',
     'NSS Wing',              'National Service Scheme — community service and social outreach.'
   )
 ), 1),

('campus-life', 'announcements', 'announcements',
 'Campus Announcements', NULL,
 JSON_OBJECT('tags', JSON_ARRAY('students','scholarship','ncc','nss'), 'limit', 4),
 2)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── FACILITIES ───────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('facilities', 'hero', 'hero',
 'Campus Facilities',
 'World-class facilities including labs, library, hostels, sports complex, and innovation centers.',
 JSON_OBJECT(
   'breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','Facilities')),
   'primaryCta',  JSON_OBJECT('label','Central Library','path','/facilities/library'),
   'secondaryCta',JSON_OBJECT('label','Computer Center','path','/facilities/computer-center')
 ), 0),

('facilities', 'quick_access', 'nav_children',
 'Explore Facilities', NULL,
 JSON_OBJECT(
   'navLabel', 'Facilities',
   'descriptions', JSON_OBJECT(
     'Computer Center',  'High-speed internet and modern workstations across campus labs.',
     'Central Library',  'A vast collection of books, journals, e-resources and reading rooms.',
     'Central Workshop', 'Practical training in machining, welding, and fabrication.',
     'Gymnasium',        'Modern gymnasium with professional equipment for fitness and wellness.',
     'Dispensary',       'On-campus health dispensary for first aid and basic medical care.',
     'CIDI Center',      'Centre for Innovation, Design and Incubation fostering entrepreneurship.',
     'Sports Complex',   'Outdoor and indoor sports facilities including courts, tracks and grounds.',
     'Boys Hostel',      'Comfortable and secure hostel with mess facilities for male students.',
     'Girls Hostel',     'Safe and well-equipped hostel with mess facilities for female students.',
     'Transit Hostel',   'Short-stay accommodation for visiting faculty, guests, and candidates.',
     'Staff Quarters',   'Residential quarters for faculty and non-teaching staff on campus.',
     'AICTE IDEA Lab',   'Innovation lab with 3D printers, IoT kits and maker-space resources.'
   )
 ), 1)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

-- ─── MORE ─────────────────────────────────────────────────────────────────────
INSERT INTO page_sections
  (page_key, section_key, section_type, title, subtitle, settings_json, display_order)
VALUES
('more', 'hero', 'hero',
 'More from SGSITS',
 'Startup cell, TEQIP, latest notices, campus news, events, tenders and contact information.',
 JSON_OBJECT('breadcrumbs', JSON_ARRAY(JSON_OBJECT('label','More'))), 0),

('more', 'quick_access', 'nav_children',
 'Quick Links', NULL,
 JSON_OBJECT(
   'navLabel', 'More',
   'descriptions', JSON_OBJECT(
     'Startup & Incubation Cell','Pre-incubation and incubation support for student startups.',
     'TEQIP Portal',             'Technical Education Quality Improvement Programme activities.',
     'Latest Notices',           'Official notices and announcements from the institute.',
     'Campus News',              'Recent news stories and updates from SGSITS.',
     'Upcoming Events',          'Conferences, workshops, cultural fests, and college events.',
     'Procurement Tenders',      'Active procurement tenders and e-tender notices.',
     'Contact Us',               'Address, phone numbers, and contact form for enquiries.'
   )
 ), 1),

('more', 'announcements', 'announcements',
 'Latest from SGSITS', NULL,
 JSON_OBJECT('tags', JSON_ARRAY(), 'limit', 5),
 2)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle),
  settings_json=VALUES(settings_json), display_order=VALUES(display_order);

SET foreign_key_checks = 1;

SELECT 'page_sections seeded for all 8 landing pages.' AS status;
