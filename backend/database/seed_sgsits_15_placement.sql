-- =============================================================================
-- SGSITS Seed 15: Placement companies, yearly stats, and CMS sections
-- Run AFTER: seed_sgsits_14_teqip_startup.sql
-- =============================================================================
USE SGSITS_DB;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ── 1. Leading Recruiting Companies ──────────────────────────────────────────
INSERT INTO companies (name, sector, website, is_active)
VALUES
  ('Tata Consultancy Services (TCS)',   'IT Services',         'https://www.tcs.com',          1),
  ('Infosys',                           'IT Services',         'https://www.infosys.com',       1),
  ('Wipro',                             'IT Services',         'https://www.wipro.com',         1),
  ('Accenture',                         'Consulting & IT',     'https://www.accenture.com',     1),
  ('Capgemini',                         'IT Services',         'https://www.capgemini.com',     1),
  ('HCL Technologies',                  'IT Services',         'https://www.hcltech.com',       1),
  ('Tech Mahindra',                     'IT Services',         'https://www.techmahindra.com',  1),
  ('Oracle',                            'Technology',          'https://www.oracle.com',        1),
  ('KPIT Technologies',                 'Automotive Tech',     'https://www.kpit.com',          1),
  ('L&T Technology Services',           'Engineering',         'https://www.ltts.com',          1),
  ('BHEL',                              'Engineering/PSU',     'https://www.bhel.com',          1),
  ('NTPC',                              'Energy/PSU',          'https://www.ntpc.co.in',        1),
  ('Mahindra & Mahindra',               'Automotive',          'https://www.mahindra.com',      1),
  ('Tata Motors',                       'Automotive',          'https://www.tatamotors.com',    1),
  ('Amazon',                            'E-Commerce/Tech',     'https://www.amazon.in',         1),
  ('Microsoft',                         'Technology',          'https://www.microsoft.com',     1),
  ('IBM',                               'Technology',          'https://www.ibm.com',           1),
  ('Cognizant',                         'IT Services',         'https://www.cognizant.com',     1),
  ('Persistent Systems',                'IT Services',         'https://www.persistent.com',    1),
  ('Mphasis',                           'IT Services',         'https://www.mphasis.com',       1),
  ('Hexaware Technologies',             'IT Services',         'https://hexaware.com',          1),
  ('Mindtree',                          'IT Services',         'https://www.mindtree.com',      1),
  ('Zensar Technologies',               'IT Services',         'https://www.zensar.com',        1),
  ('Bajaj Auto',                        'Automotive',          'https://www.bajajauto.com',     1),
  ('Hero MotoCorp',                     'Automotive',          'https://www.heromotocorp.com',  1),
  ('Larsen & Toubro',                   'Engineering/Const.',  'https://www.larsentoubro.com',  1),
  ('Bosch',                             'Automotive Tech',     'https://www.bosch.in',          1),
  ('Siemens',                           'Industrial Tech',     'https://www.siemens.com',       1),
  ('ABB India',                         'Power & Automation',  'https://www.abb.com',           1),
  ('Deloitte',                          'Consulting',          'https://www2.deloitte.com',     1)
ON DUPLICATE KEY UPDATE sector=VALUES(sector), is_active=VALUES(is_active);

-- ── 2. Yearly Placement Statistics ───────────────────────────────────────────
INSERT INTO placement_year_stats (academic_year, total_students, students_placed, placement_pct, highest_package, average_package, companies_visited)
VALUES
  ('2023-24', 520, 448, 86.15, '₹45 LPA',  '₹8.20 LPA', 120),
  ('2022-23', 490, 412, 84.08, '₹38 LPA',  '₹7.50 LPA', 105),
  ('2021-22', 460, 385, 83.70, '₹32 LPA',  '₹6.80 LPA',  95),
  ('2020-21', 440, 342, 77.73, '₹28 LPA',  '₹6.20 LPA',  80),
  ('2019-20', 480, 398, 82.92, '₹24 LPA',  '₹5.90 LPA',  98)
ON DUPLICATE KEY UPDATE
  total_students=VALUES(total_students),
  students_placed=VALUES(students_placed),
  placement_pct=VALUES(placement_pct),
  highest_package=VALUES(highest_package),
  average_package=VALUES(average_package),
  companies_visited=VALUES(companies_visited);

-- ── 3. CMS sections for placement pages ──────────────────────────────────────
SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

INSERT INTO cms_sections (section_key, data, updated_by) VALUES
  ('placement.stats_summary', JSON_OBJECT(
    'topPackage',     '₹48 LPA',
    'companyCount',   '180+',
    'currentYear',    '2023-24',
    'placementRate',  '86%',
    'avgPackage',     '₹8.20 LPA',
    'studentsPlaced', '448'
  ), @admin),

  ('placement.tnp_team', JSON_OBJECT(
    'members', JSON_ARRAY(
      JSON_OBJECT('name','Prof. A.K. Singh',   'designation','Training & Placement Officer', 'email','tpo@sgsits.ac.in',       'phone','+91-731-2582105'),
      JSON_OBJECT('name','Dr. P.K. Gupta',     'designation','Faculty Coordinator',          'email','pk.gupta@sgsits.ac.in',  'phone','+91-731-2582106'),
      JSON_OBJECT('name','Ms. Neha Sharma',    'designation','Placement Coordinator',        'email','placement@sgsits.ac.in', 'phone','+91-731-2582107')
    )
  ), @admin),

  ('placement.process', JSON_OBJECT(
    'steps', JSON_ARRAY(
      JSON_OBJECT('step',1,'title','Company Registration',    'description','Companies register through the T&P Cell portal or directly contact the TPO to schedule campus visits.'),
      JSON_OBJECT('step',2,'title','Pre-Placement Talk',      'description','Registered companies conduct PPTs to brief students about their organization, roles, CTC, and selection process.'),
      JSON_OBJECT('step',3,'title','Written Test / Online Assessment','description','Aptitude, technical, or coding rounds conducted on campus or through online platforms.'),
      JSON_OBJECT('step',4,'title','Group Discussion',        'description','GD rounds assess communication, leadership, and teamwork skills.'),
      JSON_OBJECT('step',5,'title','Technical Interview',     'description','Technical rounds to evaluate domain knowledge and problem-solving ability.'),
      JSON_OBJECT('step',6,'title','HR Interview',            'description','Final round assessing cultural fit, communication, and career objectives.'),
      JSON_OBJECT('step',7,'title','Offer Letter',            'description','Selected candidates receive offer letters. The T&P Cell coordinates the acceptance process.')
    )
  ), @admin)

ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

SET foreign_key_checks = 1;
