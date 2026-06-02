-- =============================================================================
-- SGSITS Seed 17: Navigation tree + Code of Conduct CMS seed
-- Run AFTER: seed_sgsits_12_cms_branding.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

-- ─── Navigation tree ─────────────────────────────────────────────────────────
-- Seeds navigation.nav_tree into cms_sections so the header nav is populated
-- without requiring manual CMS input. The navService falls back to
-- constants/navItems.ts when this is empty, so this is optional but keeps
-- the CMS in sync with the code defaults.

INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('navigation.nav_tree', JSON_ARRAY(
  JSON_OBJECT('label','Home','path','/'),
  JSON_OBJECT('label','About Us','path','/about','children',JSON_ARRAY(
    JSON_OBJECT('label','About Institute',          'path','/about/institute'),
    JSON_OBJECT('label','Vision & Mission',         'path','/about/vision-mission'),
    JSON_OBJECT('label',"Director's Message",       'path','/about/director-message'),
    JSON_OBJECT('label','Governing Body',           'path','/about/governing-body'),
    JSON_OBJECT('label','Administration',           'path','/about/administration'),
    JSON_OBJECT('label','Administrative Committees','path','/about/committees'),
    JSON_OBJECT('label','Telephone Directory',      'path','/about/telephone-directory'),
    JSON_OBJECT('label','Infrastructure',           'path','/about/infrastructure'),
    JSON_OBJECT('label','IQAC Cell',                'path','/about/iqac'),
    JSON_OBJECT('label','Academic Council',         'path','/about/academic-council'),
    JSON_OBJECT('label','Accreditation (NBA/NAAC)', 'path','/about/accreditation')
  )),
  JSON_OBJECT('label','Academics','path','/academics','children',JSON_ARRAY(
    JSON_OBJECT('label','Academic Calendar',     'path','/academics/calendar'),
    JSON_OBJECT('label','UG Courses',            'path','/academics/courses/ug'),
    JSON_OBJECT('label','PG Courses',            'path','/academics/courses/pg'),
    JSON_OBJECT('label','Ph.D. Programs',        'path','/academics/courses/phd'),
    JSON_OBJECT('label','PTDC Courses',          'path','/academics/courses/ptdc'),
    JSON_OBJECT('label','Online Courses (MOOC)', 'path','/academics/courses/online'),
    JSON_OBJECT('label','First Year Info',       'path','/academics/first-year'),
    JSON_OBJECT('label','Exam & Results',        'path','/academics/exam-results'),
    JSON_OBJECT('label','Ordinances',            'path','/academics/ordinances'),
    JSON_OBJECT('label','Plagiarism Policy',     'path','/academics/plagiarism-policy'),
    JSON_OBJECT('label','Code of Ethics',        'path','/academics/code-of-conduct'),
    JSON_OBJECT('label','OBE & NEP 2020',        'path','/academics/obe-nep-2020')
  )),
  JSON_OBJECT('label','Departments','path','/departments','children',JSON_ARRAY(
    JSON_OBJECT('label','All Departments',               'path','/departments'),
    JSON_OBJECT('label','Applied Chemistry',             'path','/departments/applied-chemistry'),
    JSON_OBJECT('label','Applied Mathematics',           'path','/departments/applied-mathematics'),
    JSON_OBJECT('label','Applied Physics',               'path','/departments/applied-physics'),
    JSON_OBJECT('label','Biomedical Engineering',        'path','/departments/biomedical-engineering'),
    JSON_OBJECT('label','Civil Engineering',             'path','/departments/civil-engineering'),
    JSON_OBJECT('label','Computer Engineering',          'path','/departments/computer-engineering'),
    JSON_OBJECT('label','Computer Tech & Apps (CTA)',    'path','/departments/computer-technology'),
    JSON_OBJECT('label','Electrical Engineering',        'path','/departments/electrical-engineering'),
    JSON_OBJECT('label','Electronics & Instrumentation', 'path','/departments/electronics-instrumentation'),
    JSON_OBJECT('label','Electronics & Telecomm',        'path','/departments/electronics-telecommunication'),
    JSON_OBJECT('label','Humanities & Social Sciences',  'path','/departments/humanities'),
    JSON_OBJECT('label','Industrial & Production',       'path','/departments/industrial-production'),
    JSON_OBJECT('label','Information Technology',        'path','/departments/information-technology'),
    JSON_OBJECT('label','Management Studies (MBA)',      'path','/departments/management-studies'),
    JSON_OBJECT('label','Mechanical Engineering',        'path','/departments/mechanical-engineering'),
    JSON_OBJECT('label','Pharmacy',                      'path','/departments/pharmacy'),
    JSON_OBJECT('label','Centre of Excellence (CoE)',    'path','/departments/coebg')
  )),
  JSON_OBJECT('label','Admissions','path','/admission','children',JSON_ARRAY(
    JSON_OBJECT('label','UG Admissions',         'path','/admission/ug'),
    JSON_OBJECT('label','PG Admissions',         'path','/admission/pg'),
    JSON_OBJECT('label','PhD Admissions',        'path','/admission/phd'),
    JSON_OBJECT('label','Prospectus Download',   'path','/admission/prospectus')
  )),
  JSON_OBJECT('label','Placements','path','/placement','children',JSON_ARRAY(
    JSON_OBJECT('label','T&P Cell Overview', 'path','/placement/tnp-cell'),
    JSON_OBJECT('label','Leading Recruiters','path','/placement/companies'),
    JSON_OBJECT('label','Placement Record',  'path','/placement/record'),
    JSON_OBJECT('label','Placement Contacts','path','/placement/contact')
  )),
  JSON_OBJECT('label','Campus Life','path','/campus-life','id','campus-life','children',JSON_ARRAY(
    JSON_OBJECT('label','Student Activities',     'path','/students/activities'),
    JSON_OBJECT('label','Govt. Scholarships',     'path','/students/scholarship/govt'),
    JSON_OBJECT('label','Institute Scholarships', 'path','/students/scholarship/institute'),
    JSON_OBJECT('label','Sports & Games (SSS)',   'path','/students/sss'),
    JSON_OBJECT('label','NCC Wing',               'path','/students/ncc'),
    JSON_OBJECT('label','NSS Wing',               'path','/students/nss')
  )),
  JSON_OBJECT('label','Facilities','path','/facilities','children',JSON_ARRAY(
    JSON_OBJECT('label','Computer Center',  'path','/facilities/computer-center'),
    JSON_OBJECT('label','Central Library',  'path','/facilities/library'),
    JSON_OBJECT('label','Central Workshop', 'path','/facilities/workshop'),
    JSON_OBJECT('label','Gymnasium',        'path','/facilities/gymnasium'),
    JSON_OBJECT('label','Dispensary',       'path','/facilities/dispensary'),
    JSON_OBJECT('label','CIDI Center',      'path','/facilities/cidi'),
    JSON_OBJECT('label','Sports Complex',   'path','/facilities/sports'),
    JSON_OBJECT('label','Boys Hostel',      'path','/facilities/hostel/boys'),
    JSON_OBJECT('label','Girls Hostel',     'path','/facilities/hostel/girls'),
    JSON_OBJECT('label','Transit Hostel',   'path','/facilities/hostel/transit'),
    JSON_OBJECT('label','Staff Quarters',   'path','/facilities/hostel/staff'),
    JSON_OBJECT('label','AICTE IDEA Lab',   'path','/facilities/idea-lab')
  )),
  JSON_OBJECT('label','More','path','/more','children',JSON_ARRAY(
    JSON_OBJECT('label','Startup & Incubation Cell','path','/startup-cell'),
    JSON_OBJECT('label','TEQIP Portal',             'path','/teqip/about'),
    JSON_OBJECT('label','Latest Notices',           'path','/notices'),
    JSON_OBJECT('label','Campus News',              'path','/news'),
    JSON_OBJECT('label','Upcoming Events',          'path','/events'),
    JSON_OBJECT('label','Procurement Tenders',      'path','/tenders'),
    JSON_OBJECT('label','Contact Us',               'path','/contact')
  ))
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- ─── Code of Conduct PDF URL (admin can update via CMS admin) ─────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('academic.code_of_conduct', JSON_OBJECT(
  'pdfUrl',   NULL,
  'lastUpdated', '2026-06-02',
  'note',     'Set pdfUrl to enable the Download PDF Guide button on the Code of Conduct page.'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

SET foreign_key_checks = 1;
