-- =============================================================================
-- SGSITS Seed 20: navigation.sidebar + navigation.banners + ui_labels patch
--
-- Fixes the missing left sidebar on all About/Academics/Placement/etc. pages.
-- The LeftSidebar component reads navigation.sidebar[section] to build its
-- link list, and returns null (invisible) when the array is empty.
--
-- Run AFTER: seed_sgsits_17_navigation.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

-- ── 1. navigation.sidebar ─────────────────────────────────────────────────────
--    Matches constants/sidebarLinks.ts exactly.
--    Key  = section name passed as prop to <LeftSidebar section="about" />
--    Value = array of { label, path } link objects
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('navigation.sidebar', JSON_OBJECT(

  'about', JSON_ARRAY(
    JSON_OBJECT('label','About Institute',          'path','/about/institute'),
    JSON_OBJECT('label','Vision & Mission',         'path','/about/vision-mission'),
    JSON_OBJECT('label','Director''s Message',      'path','/about/director-message'),
    JSON_OBJECT('label','Governing Body',           'path','/about/governing-body'),
    JSON_OBJECT('label','Administration',           'path','/about/administration'),
    JSON_OBJECT('label','Administrative Committees','path','/about/committees'),
    JSON_OBJECT('label','Telephone Directory',      'path','/about/telephone-directory'),
    JSON_OBJECT('label','Infrastructure',           'path','/about/infrastructure'),
    JSON_OBJECT('label','IQAC Cell',                'path','/about/iqac'),
    JSON_OBJECT('label','Academic Council',         'path','/about/academic-council'),
    JSON_OBJECT('label','Accreditation (NBA/NAAC)', 'path','/about/accreditation')
  ),

  'academics', JSON_ARRAY(
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
  ),

  'admission', JSON_ARRAY(
    JSON_OBJECT('label','UG Admission',         'path','/admission/ug'),
    JSON_OBJECT('label','PG Admission',         'path','/admission/pg'),
    JSON_OBJECT('label','PhD Admission',        'path','/admission/phd'),
    JSON_OBJECT('label','Prospectus Download',  'path','/admission/prospectus')
  ),

  'placement', JSON_ARRAY(
    JSON_OBJECT('label','T&P Cell Overview',  'path','/placement/tnp-cell'),
    JSON_OBJECT('label','Leading Recruiters', 'path','/placement/companies'),
    JSON_OBJECT('label','Placement Record',   'path','/placement/record'),
    JSON_OBJECT('label','Placement Contacts', 'path','/placement/contact')
  ),

  'students', JSON_ARRAY(
    JSON_OBJECT('label','Student Activities',     'path','/students/activities'),
    JSON_OBJECT('label','Govt. Scholarships',     'path','/students/scholarship/govt'),
    JSON_OBJECT('label','Institute Scholarships', 'path','/students/scholarship/institute'),
    JSON_OBJECT('label','Sports & Games (SSS)',   'path','/students/sss'),
    JSON_OBJECT('label','NCC Wing',               'path','/students/ncc'),
    JSON_OBJECT('label','NSS Wing',               'path','/students/nss')
  ),

  'facilities', JSON_ARRAY(
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
  ),

  'explore', JSON_ARRAY(
    JSON_OBJECT('label','Campus Map',    'path','/explore/campus-map'),
    JSON_OBJECT('label','Photo Gallery', 'path','/explore/gallery'),
    JSON_OBJECT('label','Video Tour',    'path','/explore/video-tour'),
    JSON_OBJECT('label','SGSITS Anthem', 'path','/explore/anthem')
  ),

  'teqip', JSON_ARRAY(
    JSON_OBJECT('label','About TEQIP',          'path','/teqip/about'),
    JSON_OBJECT('label','Objectives',           'path','/teqip/objectives'),
    JSON_OBJECT('label','Financial Allocation', 'path','/teqip/financial'),
    JSON_OBJECT('label','Equity Action Plan',   'path','/teqip/equity'),
    JSON_OBJECT('label','Board of Governors',   'path','/teqip/bog'),
    JSON_OBJECT('label','Twinning Arrangement', 'path','/teqip/twinning'),
    JSON_OBJECT('label','Expenditures List',    'path','/teqip/expenditures'),
    JSON_OBJECT('label','Vouchers & Forms',     'path','/teqip/vouchers')
  ),

  'news', JSON_ARRAY(
    JSON_OBJECT('label','Campus News',    'path','/news'),
    JSON_OBJECT('label','Latest Notices', 'path','/notices'),
    JSON_OBJECT('label','Upcoming Events','path','/events'),
    JSON_OBJECT('label','Active Tenders', 'path','/tenders')
  ),

  'notices', JSON_ARRAY(
    JSON_OBJECT('label','Campus News',    'path','/news'),
    JSON_OBJECT('label','Latest Notices', 'path','/notices'),
    JSON_OBJECT('label','Upcoming Events','path','/events'),
    JSON_OBJECT('label','Active Tenders', 'path','/tenders')
  ),

  'events', JSON_ARRAY(
    JSON_OBJECT('label','Campus News',    'path','/news'),
    JSON_OBJECT('label','Latest Notices', 'path','/notices'),
    JSON_OBJECT('label','Upcoming Events','path','/events'),
    JSON_OBJECT('label','Active Tenders', 'path','/tenders')
  ),

  'tenders', JSON_ARRAY(
    JSON_OBJECT('label','Campus News',    'path','/news'),
    JSON_OBJECT('label','Latest Notices', 'path','/notices'),
    JSON_OBJECT('label','Upcoming Events','path','/events'),
    JSON_OBJECT('label','Active Tenders', 'path','/tenders')
  )

), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- ── 2. navigation.banners ─────────────────────────────────────────────────────
--    sectionLabel → shown as the bold section heading in the sidebar
--    (e.g. "ABOUT US", "ACADEMICS", "PLACEMENTS")
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('navigation.banners', JSON_OBJECT(

  'about', JSON_OBJECT(
    'section','about', 'sectionLabel','ABOUT US',
    'title','About SGSITS', 'subtitle','Institute Overview',
    'iconName','BookOpen'
  ),
  'academics', JSON_OBJECT(
    'section','academics', 'sectionLabel','ACADEMICS',
    'title','Academics', 'subtitle','Programmes & Curriculum',
    'iconName','GraduationCap'
  ),
  'admission', JSON_OBJECT(
    'section','admission', 'sectionLabel','ADMISSIONS',
    'title','Admissions', 'subtitle','How to Join SGSITS',
    'iconName','FileText'
  ),
  'placement', JSON_OBJECT(
    'section','placement', 'sectionLabel','PLACEMENTS',
    'title','Placements', 'subtitle','Training & Placement Cell',
    'iconName','Rocket'
  ),
  'students', JSON_OBJECT(
    'section','students', 'sectionLabel','CAMPUS LIFE',
    'title','Campus Life', 'subtitle','Student Activities & Welfare',
    'iconName','Users'
  ),
  'facilities', JSON_OBJECT(
    'section','facilities', 'sectionLabel','FACILITIES',
    'title','Facilities', 'subtitle','Campus Infrastructure',
    'iconName','Building'
  ),
  'explore', JSON_OBJECT(
    'section','explore', 'sectionLabel','EXPLORE',
    'title','Explore SGSITS', 'subtitle','Gallery, Tour & Anthem',
    'iconName','Landmark'
  ),
  'teqip', JSON_OBJECT(
    'section','teqip', 'sectionLabel','TEQIP',
    'title','TEQIP', 'subtitle','Technical Education Quality',
    'iconName','FlaskConical'
  ),
  'news', JSON_OBJECT(
    'section','news', 'sectionLabel','UPDATES',
    'title','News & Updates', 'subtitle','Latest from SGSITS',
    'iconName','Newspaper'
  ),
  'notices', JSON_OBJECT(
    'section','notices', 'sectionLabel','UPDATES',
    'title','Notices', 'subtitle','Official Announcements',
    'iconName','Newspaper'
  ),
  'events', JSON_OBJECT(
    'section','events', 'sectionLabel','UPDATES',
    'title','Events', 'subtitle','Upcoming at SGSITS',
    'iconName','Newspaper'
  ),
  'tenders', JSON_OBJECT(
    'section','tenders', 'sectionLabel','UPDATES',
    'title','Tenders', 'subtitle','Procurement Notices',
    'iconName','FileText'
  )

), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- ── 3. ui_labels — add sidebar.sectionMenuLabel ───────────────────────────────
UPDATE cms_sections
SET data = JSON_MERGE_PATCH(data, JSON_OBJECT(
  'sidebar', JSON_OBJECT('sectionMenuLabel','Section Menu')
)),
updated_by = @admin
WHERE section_key = 'ui_labels';

SET foreign_key_checks = 1;

SELECT 'navigation.sidebar ✓' AS step;
SELECT 'navigation.banners ✓' AS step;
SELECT 'ui_labels sidebar ✓' AS step;
