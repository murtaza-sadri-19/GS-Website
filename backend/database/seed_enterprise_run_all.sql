-- =============================================================================
-- ENTERPRISE SEED — Master Runner
-- Executes all enterprise seed files in dependency order.
--
-- Usage:
--   mysql -u root -p college_website < seed_enterprise_run_all.sql
--
-- OR inside MySQL CLI:
--   USE college_website;
--   SOURCE /absolute/path/to/database/seed_enterprise_run_all.sql
--
-- Prerequisites:
--   1. schema.sql has been run
--   2. schema_additions.sql has been run
--   3. All migrations/ (003 through 011) have been run
--   4. The original seed.sql has been run (creates admin@college.edu)
--
-- All test accounts use password: Admin@123
-- =============================================================================

USE college_website;

-- Step 1: Roles + Users (57 users total)
SOURCE seed_enterprise_01_users.sql

-- Step 2: Departments (9 depts) + patch HOD/dept linkages
SOURCE seed_enterprise_02_departments.sql

-- Step 3: Faculty profiles, qualifications, publications, research
SOURCE seed_enterprise_03_faculty.sql

-- Step 4: Files, Notices, News, Events, Downloads, Pages, Alerts, Tenders
SOURCE seed_enterprise_04_content.sql

-- Step 5: Placement — Companies, Drives, Internships, Year Stats
SOURCE seed_enterprise_05_placement.sql

-- Step 6: Exam — Sessions, Courses, Sections, Subjects, Students, Marks
SOURCE seed_enterprise_06_exam.sql

-- Step 7: Gallery Albums, Items, Labs, Achievements
SOURCE seed_enterprise_07_gallery_labs.sql

-- Step 8: CMS Sections, Navigation, SEO, Site Settings, Chatbot
SOURCE seed_enterprise_08_cms_global.sql

-- Step 9: Visitor Stats, Audit Logs, Notifications, Leaves, Timetables
SOURCE seed_enterprise_09_analytics.sql

-- SGSITS-specific seeds (run after enterprise base)
SOURCE seed_sgsits_10_hod_users.sql
SOURCE seed_sgsits_11_departments.sql
SOURCE seed_sgsits_12_cms_branding.sql
SOURCE seed_sgsits_13_policies.sql
SOURCE seed_sgsits_14_teqip_startup.sql
SOURCE seed_sgsits_15_placement.sql
SOURCE seed_sgsits_16_notices_news.sql
SOURCE seed_sgsits_17_navigation.sql

-- Step 18: About Us — Normalized tables + CMS sections + SEO + Navigation
SOURCE seed_sgsits_18_about_us.sql

-- Step 19: Home Page CMS — All sections that drive Home.tsx (hero, about,
--          director, news, academics, departments, stats, campus_life,
--          faqs, gallery, seo, ui_labels, section ordering)
SOURCE seed_sgsits_19_home_cms.sql

-- Step 20: Sidebar navigation — navigation.sidebar + navigation.banners
--          Fixes the left sidebar on About, Academics, Placement, etc. pages
SOURCE seed_sgsits_20_navigation_sidebar.sql

SELECT 'All seed data loaded successfully.' AS status;
