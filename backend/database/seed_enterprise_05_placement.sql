-- =============================================================================
-- ENTERPRISE SEED — Part 05: Placement — Companies, Drives, Internships,
--                             Year Stats, Placement Records
-- Run AFTER: seed_enterprise_04_content.sql
-- =============================================================================
USE college_website;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Companies ─────────────────────────────────────────────────────────────
INSERT INTO companies (name, sector, website, contact_email, contact_phone, is_active)
VALUES
  ('Tata Consultancy Services', 'Information Technology',    'https://www.tcs.com',        'campus.tcs@tcs.com',        '1800-209-3111', 1),
  ('Infosys Limited',           'Information Technology',    'https://www.infosys.com',     'campus@infosys.com',        '080-41350900',  1),
  ('Wipro Technologies',        'Information Technology',    'https://www.wipro.com',       'campus.wipro@wipro.com',    '080-25505000',  1),
  ('Accenture India',           'IT Consulting & Services',  'https://www.accenture.com',   'accenture.campus@accenture.com', '022-61707000', 1),
  ('Cognizant',                 'Information Technology',    'https://www.cognizant.com',   'campus@cognizant.com',      '044-42099000',  1),
  ('Capgemini India',           'IT Consulting & Services',  'https://www.capgemini.com',   'campus.india@capgemini.com','022-67551000',  1),
  ('HCL Technologies',          'Information Technology',    'https://www.hcltech.com',     'campus@hcltech.com',        '0120-6125000',  1),
  ('Tech Mahindra',             'Telecommunications & IT',   'https://www.techmahindra.com','campushiring@techmahindra.com','020-66010000', 1),
  ('L&T Technology Services',   'Engineering Services',      'https://www.ltts.com',        'campus@ltts.com',           '079-61555000',  1),
  ('KPIT Technologies',         'Automotive & Embedded',     'https://www.kpit.com',        'campus@kpit.com',           '020-67706000',  1),
  ('Mphasis',                   'Information Technology',    'https://www.mphasis.com',     'campus@mphasis.com',        '080-43400000',  1),
  ('Persistent Systems',        'Software Product Services', 'https://www.persistent.com',  'campus@persistent.com',     '020-67226000',  1),
  ('Larsen & Toubro Infotech',  'IT & Engineering',          'https://www.lntinfotech.com', 'campus@lntinfotech.com',    '022-67761700',  1),
  ('Oracle India',              'Software & Cloud',          'https://www.oracle.com/in',   'campus.oracle@oracle.com',  '080-67106000',  1),
  ('Bajaj Auto',                'Automotive Manufacturing',  'https://www.bajajauto.com',   'campus@bajajauto.com',      '020-27472851',  1),
  ('Bharat Heavy Electricals',  'Heavy Electrical Equipment','https://www.bhel.com',        'campus@bhel.in',            '011-26001010',  1),
  ('Byjus (Think & Learn)',     'EdTech',                    'https://byjus.com',           'campus@byjus.com',          '080-41004600',  1),
  ('Zomato',                    'Food Technology',           'https://www.zomato.com',      'campushiring@zomato.com',   '011-49444444',  1)
ON DUPLICATE KEY UPDATE
  sector=VALUES(sector), website=VALUES(website),
  contact_email=VALUES(contact_email), is_active=VALUES(is_active);

-- ─── 2. Placement Drives ──────────────────────────────────────────────────────
INSERT INTO placement_drives
  (company_id, title, job_title, ctc_lpa, eligibility, drive_date, registration_deadline, is_active, created_by)
VALUES
  (
    (SELECT id FROM companies WHERE name='Tata Consultancy Services'),
    'TCS National Qualifier Test — Campus Drive 2025–26',
    'Systems Engineer',
    3.36,
    'B.E./B.Tech. all branches. 60% aggregate throughout academics. No active backlogs at the time of joining. Passed out batch 2025–26.',
    '2025-09-18', '2025-09-12', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Infosys Limited'),
    'Infosys SP/PP/DSE Campus Placement 2025',
    'Systems Engineer / Digital Specialist Engineer',
    3.60,
    'B.E./B.Tech./M.Tech./MCA. 60% aggregate. Maximum 2 years gap. No active backlogs.',
    '2025-10-05', '2025-09-28', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Wipro Technologies'),
    'Wipro Elite NLTH Campus Hiring 2025',
    'Project Engineer',
    3.50,
    'B.E./B.Tech. CS/IT/EC/EE/ME/Civil. 60% throughout. No gap year. No active backlogs.',
    '2025-10-22', '2025-10-15', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Accenture India'),
    'Accenture ASE & Packaged App Associate Drive',
    'Associate Software Engineer',
    4.50,
    'B.E./B.Tech./M.Tech./MCA. 60% aggregate. 2025–26 passout batch. No active standing backlogs.',
    '2025-11-10', '2025-11-03', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Capgemini India'),
    'Capgemini Analyst — Campus Placement 2025',
    'Analyst',
    4.00,
    'B.E./B.Tech. CS/IT/EC/EE/ME. 60% aggregate throughout. No standing backlogs. 2025–26 batch.',
    '2025-11-20', '2025-11-13', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='L&T Technology Services'),
    'L&T Technology Services — GET Recruitment 2025',
    'Graduate Engineer Trainee',
    4.50,
    'B.E./B.Tech. ME/EE/EC/Civil/CE. 65% aggregate. GATE qualified preferred but not mandatory. 2025–26 batch.',
    '2025-09-30', '2025-09-22', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='KPIT Technologies'),
    'KPIT Technologies — Embedded & Automotive Software Drive',
    'Software Engineer — Automotive',
    5.00,
    'B.E./B.Tech. EE/EC/CS/ME with interest in automotive embedded systems. 65% aggregate. 2025–26 batch.',
    '2025-09-25', '2025-09-18', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Oracle India'),
    'Oracle Applications Engineer — Campus 2025',
    'Applications Engineer',
    8.00,
    'B.E./M.Tech. CS/IT/MCA. Strong programming fundamentals (Java/Python/C++). 70% aggregate. 2025–26 batch.',
    '2025-12-05', '2025-11-25', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Bajaj Auto'),
    'Bajaj Auto — GET (Mechanical/Electrical) 2025',
    'Graduate Engineer Trainee',
    4.20,
    'B.E./B.Tech. ME/EE. 65% aggregate throughout. Good academics in manufacturing/thermal subjects. 2025–26 batch.',
    '2025-10-15', '2025-10-08', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  ),
  (
    (SELECT id FROM companies WHERE name='Tech Mahindra'),
    'Tech Mahindra SMART Hiring Drive 2025',
    'Software Engineer',
    3.25,
    'B.E./B.Tech./M.Tech./MCA. 55% aggregate. 2025–26 passout batch. Good communication skills.',
    '2025-11-30', '2025-11-22', 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in')
  )
ON DUPLICATE KEY UPDATE ctc_lpa=VALUES(ctc_lpa), drive_date=VALUES(drive_date);

-- ─── 3. Placement Year Statistics ─────────────────────────────────────────────
INSERT INTO placement_year_stats
  (academic_year, total_students, students_placed, placement_pct, highest_package, average_package, companies_visited)
VALUES
  ('2020-21', 420, 285, 67.86, '12.00 LPA', '4.20 LPA', 28),
  ('2021-22', 435, 320, 73.56, '14.50 LPA', '4.80 LPA', 35),
  ('2022-23', 448, 352, 78.57, '18.00 LPA', '5.20 LPA', 42),
  ('2023-24', 460, 384, 83.48, '22.00 LPA', '5.75 LPA', 48),
  ('2024-25', 472, 406, 86.02, '28.00 LPA', '6.40 LPA', 55)
ON DUPLICATE KEY UPDATE
  students_placed=VALUES(students_placed), placement_pct=VALUES(placement_pct),
  highest_package=VALUES(highest_package), average_package=VALUES(average_package),
  companies_visited=VALUES(companies_visited);

-- ─── 4. Internships ───────────────────────────────────────────────────────────
INSERT INTO internships
  (company_id, student_enrollment_no, student_name, title, duration_months, stipend, start_date, end_date, status, created_by)
VALUES
  ((SELECT id FROM companies WHERE name='Tata Consultancy Services'),
   '0801CE221001', 'Aryan Mehta', 'Software Development Intern', 2, 10000.00, '2025-05-15', '2025-07-14', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Infosys Limited'),
   '0801IT221015', 'Priyanka Jaiswal', 'Data Analytics Intern', 2, 12000.00, '2025-05-20', '2025-07-19', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='KPIT Technologies'),
   '0801EC221023', 'Rahul Patel', 'Embedded Systems Intern', 3, 15000.00, '2025-06-01', '2025-08-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='L&T Technology Services'),
   '0801ME221007', 'Sandeep Verma', 'Mechanical Design Intern', 2, 10000.00, '2025-05-15', '2025-07-14', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Wipro Technologies'),
   '0801CE221042', 'Anjali Sharma', 'Web Development Intern', 2, 8000.00, '2025-06-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Persistent Systems'),
   '0801IT221028', 'Ravi Chouhan', 'Full Stack Developer Intern', 3, 18000.00, '2025-05-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Oracle India'),
   '0801CE221056', 'Neha Agarwal', 'Database Development Intern', 2, 20000.00, '2025-05-15', '2025-07-14', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Capgemini India'),
   '0801IT221019', 'Amit Kumar Singh', 'Cloud Infrastructure Intern', 2, 12000.00, '2025-06-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Bajaj Auto'),
   '0801ME221034', 'Gaurav Mishra', 'Quality Engineering Intern', 2, 8000.00, '2025-05-15', '2025-07-14', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='HCL Technologies'),
   '0801CE231003', 'Divya Tiwari', 'Software Testing Intern', 2, 9000.00, '2025-06-01', '2025-07-31', 'ongoing',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Tech Mahindra'),
   '0801IT231011', 'Shubham Patel', 'Network Administration Intern', 2, 8500.00, '2025-06-15', '2025-08-14', 'ongoing',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ((SELECT id FROM companies WHERE name='Mphasis'),
   '0801CE231027', 'Kavya Sharma', 'AI/ML Research Intern', 3, 15000.00, '2025-07-01', '2025-09-30', 'ongoing',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'))
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- ─── 5. Placement Records (generic notices/reports) ───────────────────────────
INSERT INTO placement_records (title, record_type, company_name, academic_year, file_id, uploaded_by, status)
VALUES
  ('Placement Report 2024–25 — Annual Summary', 'PLACEMENT_RECORD', NULL, '2024-25',
   (SELECT id FROM files WHERE stored_name='seed_placement_brochure_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('TCS NQT Drive September 2025 — Selection List', 'NOTICE', 'TCS', '2025-26',
   NULL, (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Infosys Campus Drive October 2025 — Schedule', 'NOTICE', 'Infosys', '2025-26',
   NULL, (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Pre-Placement Training Schedule — Semester 7 (Aug–Nov 2025)', 'TRAINING_PROGRAM', NULL, '2025-26',
   NULL, (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Placement Statistics 2023–24 — Department-wise Breakdown', 'PLACEMENT_RECORD', NULL, '2023-24',
   NULL, (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE')
ON DUPLICATE KEY UPDATE status=VALUES(status);

SET foreign_key_checks = 1;
