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

SELECT 'Enterprise seed data loaded successfully.' AS status;
