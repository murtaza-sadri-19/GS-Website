-- =============================================================================
-- SGSITS Complete Seed — covers every frontend page
-- Password for ALL users: Admin@123
-- Hash: $2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC
-- Run AFTER: schema.sql, schema_additions.sql, all migrations 003–012
-- =============================================================================

USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @pwd  = '$2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC';
SET @now  = NOW();

-- =============================================================================
-- 1. ROLES
-- =============================================================================
INSERT INTO roles (role_name) VALUES
  ('CENTRAL_ADMIN'), ('EXAM_CONTROLLER'), ('PLACEMENT_OFFICER'), ('HOD'), ('TEACHER')
ON DUPLICATE KEY UPDATE role_name = VALUES(role_name);

-- =============================================================================
-- 2. USERS  (department_id patched in §6 after departments exist)
-- =============================================================================
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  -- Global admins
  ((SELECT id FROM roles WHERE role_name='CENTRAL_ADMIN'),   NULL, 'Central Admin',              'admin@college.edu',               @pwd, '0731-2431300', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='CENTRAL_ADMIN'),   NULL, 'Prof. R.K. Pandey',           'director@sgsits.ac.in',           @pwd, '0731-2431301', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='EXAM_CONTROLLER'), NULL, 'Dr. Suresh Malviya',          'examcontroller@sgsits.ac.in',     @pwd, '9826001003',   'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='PLACEMENT_OFFICER'),NULL,'Mr. Vivek Tiwari',            'placement@sgsits.ac.in',          @pwd, '9826001004',   'ACTIVE'),
  -- HODs (dept linked after dept insert)
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Ajay Khunteta',           'hod.ce@sgsits.ac.in',   @pwd, '9826002001', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Kapil Jain',              'hod.it@sgsits.ac.in',   @pwd, '9826002002', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Pradeep Kasande',         'hod.me@sgsits.ac.in',   @pwd, '9826002003', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Yogesh Kumar Bajpai',     'hod.civil@sgsits.ac.in',@pwd, '9826002004', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Manoj Kumar Jain',        'hod.ee@sgsits.ac.in',   @pwd, '9826002005', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Shailendra Kumar Singh',  'hod.ec@sgsits.ac.in',   @pwd, '9826002006', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Rekha Pandey',            'hod.ash@sgsits.ac.in',  @pwd, '9826002007', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Vandana Bhatt',           'hod.mca@sgsits.ac.in',  @pwd, '9826002008', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Sanjay Sharma',           'hod.mba@sgsits.ac.in',  @pwd, '9826002009', 'ACTIVE'),
  -- CE teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Nisha Thakur',       'nisha.thakur@sgsits.ac.in',   @pwd, '9826003001', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Rohit Sharma',     'rohit.sharma@sgsits.ac.in',   @pwd, '9826003002', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Meena Agarwal',      'meena.agarwal@sgsits.ac.in',  @pwd, '9826003003', 'ACTIVE'),
  -- IT teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Sunita Patel',       'sunita.patel@sgsits.ac.in',   @pwd, '9826003004', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Anil Kumar',       'anil.kumar@sgsits.ac.in',     @pwd, '9826003005', 'ACTIVE'),
  -- ME teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Priya Singh',        'priya.singh@sgsits.ac.in',    @pwd, '9826003006', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Vikas Tiwari',     'vikas.tiwari@sgsits.ac.in',   @pwd, '9826003007', 'ACTIVE'),
  -- Civil teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Anand Mishra',       'anand.mishra@sgsits.ac.in',   @pwd, '9826003008', 'ACTIVE'),
  -- EE teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Deepak Gupta',     'deepak.gupta@sgsits.ac.in',   @pwd, '9826003009', 'ACTIVE'),
  -- EC teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Monika Verma',       'monika.verma@sgsits.ac.in',   @pwd, '9826003010', 'ACTIVE'),
  -- ASH teacher
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Rajesh Pandey',    'rajesh.pandey@sgsits.ac.in',  @pwd, '9826003011', 'ACTIVE'),
  -- MCA teacher
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Swati Joshi',        'swati.joshi@sgsits.ac.in',    @pwd, '9826003012', 'ACTIVE'),
  -- MBA teacher
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Dinesh Chouhan',   'dinesh.chouhan@sgsits.ac.in', @pwd, '9826003013', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), status=VALUES(status);

-- =============================================================================
-- 3. PLACEHOLDER FILES
-- =============================================================================
INSERT INTO files (original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by) VALUES
  ('exam-circular-dec-2025.pdf',    'seed_exam_circ_dec25.pdf',   '/uploads/seed_exam_circ_dec25.pdf',   'application/pdf', 245760,  'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('admit-card-dec-2025.pdf',       'seed_admit_dec25.pdf',       '/uploads/seed_admit_dec25.pdf',       'application/pdf', 189440,  'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('result-may-2025.pdf',           'seed_result_may25.pdf',      '/uploads/seed_result_may25.pdf',      'application/pdf', 512000,  'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('timetable-dec-2025.pdf',        'seed_tt_dec25.pdf',          '/uploads/seed_tt_dec25.pdf',          'application/pdf', 307200,  'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('ug-admission-2025.pdf',         'seed_ug_adm_2025.pdf',       '/uploads/seed_ug_adm_2025.pdf',       'application/pdf', 1024000, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('pg-admission-2025.pdf',         'seed_pg_adm_2025.pdf',       '/uploads/seed_pg_adm_2025.pdf',       'application/pdf', 890000,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('phd-admission-2025.pdf',        'seed_phd_adm_2025.pdf',      '/uploads/seed_phd_adm_2025.pdf',      'application/pdf', 650000,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('placement-brochure-2526.pdf',   'seed_place_broch_2526.pdf',  '/uploads/seed_place_broch_2526.pdf',  'application/pdf', 2048000, 'LOCAL', (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ('fee-structure-2526.pdf',        'seed_fee_2526.pdf',          '/uploads/seed_fee_2526.pdf',          'application/pdf', 307200,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('anti-ragging-policy.pdf',       'seed_anti_ragging.pdf',      '/uploads/seed_anti_ragging.pdf',      'application/pdf', 153600,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('scholarship-2025.pdf',          'seed_scholarship_2025.pdf',  '/uploads/seed_scholarship_2025.pdf',  'application/pdf', 122880,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('ce-sem5-syllabus.pdf',          'seed_ce_sem5_syl.pdf',       '/uploads/seed_ce_sem5_syl.pdf',       'application/pdf', 614400,  'LOCAL', (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
  ('it-sem5-syllabus.pdf',          'seed_it_sem5_syl.pdf',       '/uploads/seed_it_sem5_syl.pdf',       'application/pdf', 614400,  'LOCAL', (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
  ('me-sem5-syllabus.pdf',          'seed_me_sem5_syl.pdf',       '/uploads/seed_me_sem5_syl.pdf',       'application/pdf', 614400,  'LOCAL', (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
  ('academic-calendar-2526.pdf',    'seed_acadcal_2526.pdf',      '/uploads/seed_acadcal_2526.pdf',      'application/pdf', 204800,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('tender-lab-equip-2025.pdf',     'seed_tender_lab_2025.pdf',   '/uploads/seed_tender_lab_2025.pdf',   'application/pdf', 358400,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('tender-civil-work-2025.pdf',    'seed_tender_civil_2025.pdf', '/uploads/seed_tender_civil_2025.pdf', 'application/pdf', 204800,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('technova-2025-banner.jpg',      'seed_technova25.jpg',        '/uploads/seed_technova25.jpg',        'image/jpeg',      204800,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('convocation-2025.jpg',          'seed_convoc25.jpg',          '/uploads/seed_convoc25.jpg',          'image/jpeg',      307200,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('sports-meet-2025.jpg',          'seed_sports25.jpg',          '/uploads/seed_sports25.jpg',          'image/jpeg',      256000,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('hackathon-2025.jpg',            'seed_hackathon25.jpg',       '/uploads/seed_hackathon25.jpg',       'image/jpeg',      204800,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('tcs-drive-2025.jpg',            'seed_tcs_drive25.jpg',       '/uploads/seed_tcs_drive25.jpg',       'image/jpeg',      184320,  'LOCAL', (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ('library-hall.jpg',              'seed_library.jpg',           '/uploads/seed_library.jpg',           'image/jpeg',      230400,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('computer-lab.jpg',              'seed_computer_lab.jpg',      '/uploads/seed_computer_lab.jpg',      'image/jpeg',      215040,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('hostel-block.jpg',              'seed_hostel.jpg',            '/uploads/seed_hostel.jpg',            'image/jpeg',      196608,  'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu'))
ON DUPLICATE KEY UPDATE file_url=VALUES(file_url);

-- =============================================================================
-- 4. DEPARTMENTS
-- =============================================================================
INSERT INTO departments (name, slug, short_name, description, vision, mission, hod_user_id, status, established_year, contact_email, contact_phone) VALUES
  (
    'Computer Engineering', 'computer-engineering', 'CE',
    'The Department of Computer Engineering, established in 1987, is one of the pioneer departments of SGSITS. It offers B.E. and M.Tech. programmes and has state-of-the-art computing laboratories. The department maintains active industry partnerships with TCS, Infosys, and Microsoft.',
    'To be a centre of excellence in computer engineering education and research, producing technically competent, innovative, and ethically responsible engineers.',
    'To impart quality education through industry-aligned curriculum, hands-on laboratory training, research activities, and industry collaboration to prepare students for global challenges.',
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'ACTIVE', 1987, 'ce@sgsits.ac.in', '0731-2431310'
  ),
  (
    'Information Technology', 'information-technology', 'IT',
    'The Department of Information Technology focuses on software development, data science, networking, and cybersecurity. Established in 2001, it has consistently produced top-performing graduates placed in leading IT companies worldwide.',
    'To develop globally competitive IT professionals who can design, build, and manage information systems to serve society.',
    'To provide rigorous IT education integrating theory and practice, fostering innovation, entrepreneurship, and lifelong learning.',
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'), 'ACTIVE', 2001, 'it@sgsits.ac.in', '0731-2431311'
  ),
  (
    'Mechanical Engineering', 'mechanical-engineering', 'ME',
    'One of the oldest departments of SGSITS, Mechanical Engineering has a rich legacy since 1952. The department offers B.E., M.Tech., and Ph.D. programmes with specialisations in thermal, design, manufacturing, and industrial engineering.',
    'To be a nationally recognised centre for mechanical engineering education, applied research, and industry partnership.',
    'To develop competent, creative mechanical engineers through rigorous academic training, industry interaction, and research-driven learning.',
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'), 'ACTIVE', 1952, 'me@sgsits.ac.in', '0731-2431312'
  ),
  (
    'Civil Engineering', 'civil-engineering', 'CVL',
    'Established in 1952, the Department of Civil Engineering offers programmes in structural, geotechnical, environmental, and transportation engineering. The department has well-equipped laboratories and conducts field-based projects across the region.',
    'To emerge as a leading centre for civil engineering education producing capable and socially responsible engineers.',
    'To provide comprehensive civil engineering education through experiential learning, research, and community engagement.',
    (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in'), 'ACTIVE', 1952, 'civil@sgsits.ac.in', '0731-2431313'
  ),
  (
    'Electrical Engineering', 'electrical-engineering', 'EE',
    'The Department of Electrical Engineering offers B.E. and M.Tech. programmes with focus on power systems, control systems, and electrical machines. Its power electronics and drives laboratory is equipped with modern testing equipment.',
    'To nurture innovative electrical engineers capable of solving complex power and energy challenges of the modern world.',
    'To impart high-quality education and research training in electrical engineering with emphasis on sustainability and smart grid technologies.',
    (SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in'), 'ACTIVE', 1952, 'ee@sgsits.ac.in', '0731-2431314'
  ),
  (
    'Electronics & Telecommunication Engineering', 'electronics-telecommunication', 'EC',
    'The Department of Electronics & Telecommunication Engineering offers B.E. and M.Tech. programmes. With specialisations in VLSI, embedded systems, and wireless communications, the department has produced graduates working at ISRO, Intel, and Qualcomm.',
    'To become a premier department in electronics and telecommunication engineering, driving innovation in communication and embedded systems.',
    'To educate and train students in cutting-edge electronics and communication technologies through a blend of theory, experimentation, and research.',
    (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'), 'ACTIVE', 1952, 'ec@sgsits.ac.in', '0731-2431315'
  ),
  (
    'Applied Sciences & Humanities', 'applied-sciences-humanities', 'ASH',
    'The Department of Applied Sciences & Humanities provides the foundational scientific and humanistic education for all engineering branches. It covers mathematics, physics, chemistry, English communication, and management principles.',
    'To build a strong scientific and humanistic foundation that empowers students to become well-rounded engineers and responsible global citizens.',
    'To provide excellent instruction in basic sciences and humanities, enabling students to apply fundamental principles creatively in engineering practice.',
    (SELECT id FROM users WHERE email='hod.ash@sgsits.ac.in'), 'ACTIVE', 1952, 'ash@sgsits.ac.in', '0731-2431316'
  ),
  (
    'Master of Computer Applications', 'master-computer-applications', 'MCA',
    'The MCA Department offers a three-year postgraduate programme that bridges commerce/science backgrounds with advanced computer science. Graduates are placed in top software companies across India and abroad.',
    'To produce high-calibre MCA graduates equipped with deep programming expertise and analytical skills for the IT industry.',
    'To deliver rigorous postgraduate computer education with focus on software engineering, databases, AI, and web technologies.',
    (SELECT id FROM users WHERE email='hod.mca@sgsits.ac.in'), 'ACTIVE', 1995, 'mca@sgsits.ac.in', '0731-2431317'
  ),
  (
    'Master of Business Administration', 'master-business-administration', 'MBA',
    'The MBA Department offers a two-year full-time postgraduate management programme approved by AICTE. The programme covers all major management disciplines including finance, marketing, HR, and operations with strong industry exposure.',
    'To develop transformational business leaders with integrity, analytical prowess, and a global perspective.',
    'To impart management education through case-based learning, industry interaction, and experiential projects that prepare graduates for leadership roles.',
    (SELECT id FROM users WHERE email='hod.mba@sgsits.ac.in'), 'ACTIVE', 1993, 'mba@sgsits.ac.in', '0731-2431318'
  )
ON DUPLICATE KEY UPDATE
  description=VALUES(description), vision=VALUES(vision), mission=VALUES(mission),
  hod_user_id=VALUES(hod_user_id), status=VALUES(status),
  contact_email=VALUES(contact_email), contact_phone=VALUES(contact_phone);

-- =============================================================================
-- 5. PATCH: link HODs and teachers to their departments
-- =============================================================================
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='computer-engineering')
  WHERE email IN ('hod.ce@sgsits.ac.in','nisha.thakur@sgsits.ac.in','rohit.sharma@sgsits.ac.in','meena.agarwal@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='information-technology')
  WHERE email IN ('hod.it@sgsits.ac.in','sunita.patel@sgsits.ac.in','anil.kumar@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='mechanical-engineering')
  WHERE email IN ('hod.me@sgsits.ac.in','priya.singh@sgsits.ac.in','vikas.tiwari@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='civil-engineering')
  WHERE email IN ('hod.civil@sgsits.ac.in','anand.mishra@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electrical-engineering')
  WHERE email IN ('hod.ee@sgsits.ac.in','deepak.gupta@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electronics-telecommunication')
  WHERE email IN ('hod.ec@sgsits.ac.in','monika.verma@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='applied-sciences-humanities')
  WHERE email IN ('hod.ash@sgsits.ac.in','rajesh.pandey@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='master-computer-applications')
  WHERE email IN ('hod.mca@sgsits.ac.in','swati.joshi@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='master-business-administration')
  WHERE email IN ('hod.mba@sgsits.ac.in','dinesh.chouhan@sgsits.ac.in');
-- Also link departments.hod_user_id back
UPDATE departments d JOIN users u ON u.email='hod.ce@sgsits.ac.in'    SET d.hod_user_id=u.id WHERE d.slug='computer-engineering';
UPDATE departments d JOIN users u ON u.email='hod.it@sgsits.ac.in'    SET d.hod_user_id=u.id WHERE d.slug='information-technology';
UPDATE departments d JOIN users u ON u.email='hod.me@sgsits.ac.in'    SET d.hod_user_id=u.id WHERE d.slug='mechanical-engineering';
UPDATE departments d JOIN users u ON u.email='hod.civil@sgsits.ac.in' SET d.hod_user_id=u.id WHERE d.slug='civil-engineering';
UPDATE departments d JOIN users u ON u.email='hod.ee@sgsits.ac.in'    SET d.hod_user_id=u.id WHERE d.slug='electrical-engineering';
UPDATE departments d JOIN users u ON u.email='hod.ec@sgsits.ac.in'    SET d.hod_user_id=u.id WHERE d.slug='electronics-telecommunication';
UPDATE departments d JOIN users u ON u.email='hod.ash@sgsits.ac.in'   SET d.hod_user_id=u.id WHERE d.slug='applied-sciences-humanities';
UPDATE departments d JOIN users u ON u.email='hod.mca@sgsits.ac.in'   SET d.hod_user_id=u.id WHERE d.slug='master-computer-applications';
UPDATE departments d JOIN users u ON u.email='hod.mba@sgsits.ac.in'   SET d.hod_user_id=u.id WHERE d.slug='master-business-administration';

-- =============================================================================
-- 6. FACULTY PROFILES
-- =============================================================================
INSERT INTO faculty_profiles (user_id, department_id, designation, qualification, specialization, experience, bio, publications, research_work, subjects, status) VALUES
  -- CE HOD
  ((SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Professor & HOD', 'Ph.D. (Computer Science, IIT Bombay)', 'Distributed Systems, Cloud Computing', 22,
   'Dr. Ajay Khunteta is a Professor and Head of Computer Engineering. He has 22 years of teaching and research experience. He has supervised 6 Ph.D. scholars and published over 40 research papers in international journals.',
   'Khunteta A. et al., "Adaptive Resource Scheduling in Cloud Environments," IEEE TCC 2023; Khunteta A., "Fog Computing Architectures," IJCA 2022.',
   'Cloud Resource Optimisation (DST funded, ₹24L); IoT-based Smart Campus (AICTE, ₹18L)',
   'Distributed Systems, Cloud Computing, Operating Systems, Data Structures', 'ACTIVE'),
  -- CE Teacher 1
  ((SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Associate Professor', 'Ph.D. (Machine Learning, NIT Bhopal)', 'Machine Learning, Computer Vision', 14,
   'Dr. Nisha Thakur specialises in machine learning and computer vision. She has published 18 papers and received the AICTE Young Faculty Award 2022.',
   'Thakur N., "Deep CNN for Medical Image Segmentation," IEEE Access 2023; Thakur N. et al., "Transfer Learning Benchmarks," IJCV 2022.',
   'Medical Image Analysis using Deep Learning (SERB, ₹15L 2022–25)',
   'Machine Learning, Computer Vision, Python Programming, Algorithms', 'ACTIVE'),
  -- CE Teacher 2
  ((SELECT id FROM users WHERE email='rohit.sharma@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (Software Engineering, RGPV)', 'Web Technologies, Databases', 8,
   'Prof. Rohit Sharma has 8 years of teaching experience with expertise in full-stack web development and database management systems.',
   'Sharma R., "NoSQL vs RDBMS in High-Traffic Apps," IJSE 2021.',
   'Optimised Query Processing for Large-scale Web Applications (Internal Grant)',
   'DBMS, Web Technology, PHP, Node.js', 'ACTIVE'),
  -- IT HOD
  ((SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='information-technology'),
   'Professor & HOD', 'Ph.D. (Information Security, DAVV)', 'Cybersecurity, Network Security', 19,
   'Dr. Kapil Jain is a cybersecurity expert with 19 years of experience. He has consulted for the MP Government on e-governance security and published over 30 papers.',
   'Jain K., "Zero-Trust Architecture for Government Networks," IEEE S&P 2022; Jain K. et al., "Blockchain in E-Governance," IJIS 2023.',
   'Cybersecurity Framework for MP e-Governance (NIC, ₹30L)',
   'Network Security, Cryptography, Ethical Hacking, Information Systems', 'ACTIVE'),
  -- ME HOD
  ((SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Professor & HOD', 'Ph.D. (Thermal Engineering, IIT Indore)', 'Thermal Engineering, CFD', 24,
   'Dr. Pradeep Kasande heads the Mechanical Engineering department with 24 years of experience in thermal sciences and computational fluid dynamics.',
   'Kasande P., "CFD Analysis of Heat Exchangers," IJHT 2023; Kasande P. et al., "Solar Thermal Systems Optimisation," RSER 2022.',
   'Solar Energy Optimisation for Industrial Applications (MNRE, ₹28L)',
   'Thermodynamics, Heat Transfer, Fluid Mechanics, CFD', 'ACTIVE'),
  -- Civil HOD
  ((SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='civil-engineering'),
   'Professor & HOD', 'Ph.D. (Structural Engineering, IIT Delhi)', 'Structural Analysis, Earthquake Engineering', 20,
   'Dr. Yogesh Kumar Bajpai is an expert in structural engineering and earthquake-resistant design with 20 years of experience.',
   'Bajpai Y., "Seismic Performance of RC Frames," IJST 2023.',
   'Earthquake-Resistant Design of Low-Cost Housing (DST, ₹20L)',
   'Structural Analysis, RCC Design, Foundation Engineering, Earthquake Engineering', 'ACTIVE'),
  -- EE HOD
  ((SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='electrical-engineering'),
   'Professor & HOD', 'Ph.D. (Power Systems, NIT Raipur)', 'Power Systems, Smart Grid', 18,
   'Dr. Manoj Kumar Jain specialises in power systems and smart grid technologies with 18 years of teaching and research experience.',
   'Jain M., "Smart Grid Stability Analysis," IEEE PES 2023.',
   'Smart Grid Implementation for Indore City (MPEB, ₹35L)',
   'Power Systems, Electrical Machines, Control Systems, Smart Grid', 'ACTIVE'),
  -- EC HOD
  ((SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   'Professor & HOD', 'Ph.D. (VLSI Design, IIT Kharagpur)', 'VLSI, Embedded Systems', 21,
   'Dr. Shailendra Kumar Singh is a VLSI design expert with 21 years of experience. His research focuses on low-power chip design and embedded systems for IoT.',
   'Singh S., "Low-Power VLSI Design for IoT Sensors," IEEE TVLSI 2023.',
   'Low-Power CMOS Circuit Design (SERB CRG, ₹22L)',
   'VLSI Design, Embedded Systems, Digital Electronics, Microprocessors', 'ACTIVE'),
  -- ASH HOD
  ((SELECT id FROM users WHERE email='hod.ash@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='applied-sciences-humanities'),
   'Professor & HOD', 'Ph.D. (Applied Mathematics, DAVV)', 'Numerical Methods, Operations Research', 16,
   'Dr. Rekha Pandey is a mathematician with expertise in numerical analysis and operations research applied to engineering problems.',
   'Pandey R., "Optimised Finite Element Methods," IJAM 2022.',
   'Mathematical Modelling for Smart City Infrastructure (UGC, ₹12L)',
   'Engineering Mathematics, Numerical Methods, Operations Research, Technical Communication', 'ACTIVE')
ON DUPLICATE KEY UPDATE
  designation=VALUES(designation), qualification=VALUES(qualification),
  specialization=VALUES(specialization), experience=VALUES(experience),
  bio=VALUES(bio), status=VALUES(status);

-- =============================================================================
-- 7. NOTICES  (15 notices across all types)
-- =============================================================================
INSERT INTO notices (title, slug, description, notice_type, department_id, file_id, created_by, publish_date, status) VALUES
  ('End Semester Examination December 2025 — Date Sheet',
   'end-sem-exam-dec-2025-date-sheet',
   'The End Semester Examination for all B.E./M.Tech./MCA/MBA programmes for the session July–December 2025 will commence from 01 December 2025. Students must download admit cards from the examination portal. No student will be allowed in the examination hall without a valid admit card. Roll number slips will be issued from 20 November 2025.',
   'EXAM', NULL,
   (SELECT id FROM files WHERE stored_name='seed_exam_circ_dec25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-11-10', 'PUBLISHED'),
  ('Admit Card Availability — End Semester December 2025',
   'admit-card-dec-2025',
   'Admit cards for End Semester Examination December 2025 can be downloaded from the student portal from 18 November 2025. Students with pending dues should clear fees before collecting admit cards. For discrepancies contact the Examination Section, Room 105, Main Building by 25 November 2025.',
   'EXAM', NULL,
   (SELECT id FROM files WHERE stored_name='seed_admit_dec25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-11-12', 'PUBLISHED'),
  ('Result Declaration — End Semester Examination May 2025',
   'result-end-sem-may-2025',
   'Results for End Semester Examination May 2025 for B.E. (all semesters), M.Tech., MCA, and MBA programmes have been declared. Students may check results on the examination portal. Re-evaluation applications must be submitted within 15 days of result publication.',
   'EXAM', NULL,
   (SELECT id FROM files WHERE stored_name='seed_result_may25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-06-15', 'PUBLISHED'),
  ('Academic Calendar 2025–26 — Published',
   'academic-calendar-2025-26',
   'The Academic Calendar for the session 2025–26 has been published. All students and faculty are advised to note important dates including class commencement, internal assessment schedules, semester break, and end-semester examination dates. Download the calendar from the downloads section.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_acadcal_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-07-01', 'PUBLISHED'),
  ('UG Admission 2025–26 — Counselling Schedule',
   'ug-admission-2025-26-counselling',
   'Counselling for admission to B.E. programmes for the academic year 2025–26 will be conducted through MPDTE online counselling portal. Candidates who have qualified JEE Main 2025 and fulfilled RGPV eligibility criteria are eligible. Candidates must select SGSITS in institute preference during MPDTE counselling.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_ug_adm_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-06-20', 'PUBLISHED'),
  ('PG Admission 2025–26 — M.Tech / MCA / MBA',
   'pg-admission-2025-26',
   'Applications are invited for M.Tech. (Computer Engineering, Electrical Engineering, Mechanical Engineering, Electronics & Telecommunication), MCA, and MBA programmes for the academic year 2025–26. GATE qualified candidates may apply for M.Tech. through CCMT portal. MCA and MBA admissions through DAVV/RGPV counselling.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_pg_adm_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-06-25', 'PUBLISHED'),
  ('Ph.D. Admission 2025–26 — Applications Invited',
   'phd-admission-2025-26',
   'SGSITS invites applications for Ph.D. programmes in Computer Engineering, Mechanical Engineering, Electrical Engineering, Electronics & TC, Civil Engineering, and Applied Sciences for the session 2025–26. Candidates with M.Tech./M.E./M.S. with 55% marks or GATE/NET qualified are eligible.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_phd_adm_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-07-05', 'PUBLISHED'),
  ('TCS Campus Drive — 2025–26 Batch',
   'tcs-campus-drive-2025-26',
   'TCS (Tata Consultancy Services) will be conducting campus recruitment for the batch 2025–26 on 15 November 2025. Eligible branches: CSE, IT, EC, EE, ME, Civil. CGPA cutoff: 6.5. No active backlogs. Students should register through the T&P Cell portal by 10 November 2025.',
   'PLACEMENT', NULL,
   (SELECT id FROM files WHERE stored_name='seed_place_broch_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   '2025-11-01', 'PUBLISHED'),
  ('Infosys InfyTQ Campus Recruitment 2025',
   'infosys-infytq-campus-2025',
   'Infosys will be visiting SGSITS for campus recruitment on 22 November 2025. Eligible branches: All engineering branches and MCA. Package: 3.6 LPA – 9.5 LPA (role-dependent). Students must have cleared InfyTQ certification. Register via T&P Cell portal.',
   'PLACEMENT', NULL, NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   '2025-11-05', 'PUBLISHED'),
  ('Pre-Placement Training — Aptitude & Coding Bootcamp',
   'pre-placement-training-2025',
   'The T&P Cell is organising a 30-day intensive Pre-Placement Training programme from 01 October to 31 October 2025. The training covers quantitative aptitude, logical reasoning, verbal ability, and coding (Python/Java/C++). Attendance is mandatory for all final-year students.',
   'PLACEMENT', NULL, NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   '2025-09-20', 'PUBLISHED'),
  ('National Scholarship Portal — Applications Open',
   'nsp-scholarship-2025-26',
   'Students from SC/ST/OBC and minority communities are advised to apply for scholarships through the National Scholarship Portal (scholarships.gov.in) for the academic year 2025–26. Deadline for fresh applications: 31 October 2025. Students should submit verified applications to the accounts section.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_scholarship_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-09-15', 'PUBLISHED'),
  ('Anti-Ragging Policy — Strict Compliance',
   'anti-ragging-policy-2025',
   'SGSITS strictly prohibits ragging in any form. All students are required to submit anti-ragging affidavits online before 31 July 2025. Any incident of ragging should be reported immediately to the Anti-Ragging Committee or the UGC helpline 1800-180-5522. Severe disciplinary action including expulsion will follow any violation.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_anti_ragging.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-07-10', 'PUBLISHED'),
  ('Computer Engineering — Internal Assessment Schedule Sem V',
   'ce-internal-assessment-sem5-2025',
   'The internal assessment schedule for B.E. Computer Engineering Semester V is as follows: Class Test 1: 15–20 September 2025; Class Test 2: 20–25 October 2025; Viva Voce: 15–20 November 2025. Students must bring admit cards to all assessments. Contact the CE department office for details.',
   'DEPARTMENT',
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   NULL,
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   '2025-09-01', 'PUBLISHED'),
  ('Placement Statistics 2024–25 — Published',
   'placement-stats-2024-25',
   'The T&P Cell is proud to announce that 486 students were placed from the batch 2024–25 with a placement rate of 86.5%. Highest package: ₹42 LPA (TCS iON). Average package: ₹7.2 LPA. 58 companies visited the campus. Detailed statistics are available at the T&P Cell office and on the institute website.',
   'PLACEMENT', NULL, NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   '2025-07-20', 'PUBLISHED'),
  ('Fee Payment Deadline — Odd Semester 2025–26',
   'fee-payment-deadline-odd-sem-2025',
   'Students of all programmes are reminded that the last date for payment of tuition fee, development fee, and other charges for Odd Semester 2025–26 is 31 August 2025. Students with outstanding dues after the deadline will have their attendance withheld. Fee can be paid online through the ERP portal or at the accounts section.',
   'GENERAL', NULL,
   (SELECT id FROM files WHERE stored_name='seed_fee_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-08-01', 'PUBLISHED')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 8. NEWS
-- =============================================================================
INSERT INTO news (title, slug, excerpt, content, cover_img_url, category, author_id, published_at, status) VALUES
  ('SGSITS Students Win National Smart India Hackathon 2025',
   'sgsits-wins-sih-2025',
   'Team CodeCraft from SGSITS bagged the first prize in the Smart India Hackathon 2025 Software Edition in the Healthcare theme, impressing judges with their AI-powered diagnostic tool.',
   '<p>A team of six students from the Computer Engineering and IT departments — collectively named CodeCraft — brought laurels to SGSITS by winning the first prize at Smart India Hackathon (SIH) 2025 Software Edition held at NIT Surat.</p><p>The team developed an AI-powered rural health diagnostic tool that uses a smartphone camera and machine learning to detect early symptoms of anemia, jaundice, and corneal damage without requiring specialised equipment. The solution was built in 36 hours during the grand finale.</p><p>Mentored by Dr. Nisha Thakur, the team expressed gratitude to the institute administration and the Computer Engineering department for providing resources and guidance throughout their preparation. The prize carried a cash award of ₹1 Lakh and a certificate from the Ministry of Education.</p>',
   '/uploads/seed_hackathon25.jpg', 'Achievement',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-09-05 10:00:00', 'PUBLISHED'),
  ('SGSITS Signs MoU with TCS for Industry-Academia Collaboration',
   'sgsits-mou-tcs-2025',
   'SGSITS has entered into a Memorandum of Understanding with Tata Consultancy Services to strengthen industry-academia linkage, offering guest lectures, internships, and joint research opportunities.',
   '<p>Shri G. S. Institute of Technology and Science, Indore, signed a Memorandum of Understanding (MoU) with Tata Consultancy Services (TCS) on 15 August 2025 during the Institute''s Independence Day celebrations.</p><p>The MoU covers curriculum co-design, faculty development programmes, student internships, joint research projects, and preferential campus recruitment by TCS. Under this agreement, TCS will provide industry mentors for final-year projects and sponsor two annual hackathons at SGSITS.</p><p>The signing ceremony was presided over by the Director, Prof. R.K. Pandey, and attended by TCS Regional Head Shri Arun Verma and senior faculty members.</p>',
   NULL, 'Industry',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-08-16 09:30:00', 'PUBLISHED'),
  ('NAAC Peer Team Visit — SGSITS Reaccreditation Process Underway',
   'naac-peer-team-visit-2025',
   'SGSITS successfully hosted the NAAC Peer Team for the fourth cycle of accreditation. The institute has submitted its Self-Study Report targeting an A+ grade.',
   '<p>The National Assessment and Accreditation Council (NAAC) Peer Team visited SGSITS, Indore from 5–7 August 2025 for the fourth cycle of institutional accreditation. The team conducted detailed inspections of academic facilities, laboratories, libraries, administrative processes, and student support services.</p><p>SGSITS had submitted its Self-Study Report (SSR) targeting an A+ grade. The institute has invested significantly in infrastructure upgrades, research output enhancement, and NEP 2020 implementation over the past four years.</p>',
   NULL, 'Research',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-08-08 11:00:00', 'PUBLISHED'),
  ('Dr. Pradeep Kasande Receives AICTE Research Excellence Award',
   'kasande-aicte-award-2025',
   'Prof. Pradeep Kasande of the Mechanical Engineering department has been awarded the AICTE National Research Excellence Award 2025 for his contributions to solar thermal systems research.',
   '<p>Dr. Pradeep Kasande, Professor and Head of the Mechanical Engineering Department, was conferred the AICTE National Research Excellence Award 2025 at a ceremony held in New Delhi on 22 July 2025.</p><p>Dr. Kasande was recognised for his sustained research contributions in solar thermal energy systems and computational fluid dynamics over the past decade. He has published 38 international papers and secured research funding of over ₹85 Lakhs from agencies including MNRE, DST, and SERB.</p>',
   NULL, 'Achievement',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-07-24 08:00:00', 'PUBLISHED'),
  ('TechNova 2025 — SGSITS Annual Technical Festival',
   'technova-2025-annual-fest',
   'TechNova 2025, the annual technical festival of SGSITS, concluded with record participation from 85 colleges across India. The three-day event featured robotics, coding, design, and business plan competitions.',
   '<p>TechNova 2025, the flagship annual technical festival of SGSITS Indore, concluded successfully after three days of intense competitions, workshops, and exhibitions from 14–16 February 2025.</p><p>Over 3,200 students from 85 colleges across Madhya Pradesh, Maharashtra, Gujarat, and Rajasthan participated in 18 technical events including Robowar, CodeStorm, Circuit Design, CAD Challenge, and Business Plan Pitching. The event was inaugurated by the Director and addressed by Dr. Sudha Murthy via video conference.</p>',
   '/uploads/seed_technova25.jpg', 'Event',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-02-17 10:00:00', 'PUBLISHED'),
  ('SGSITS Ranked Among Top 100 Engineering Colleges — NIRF 2025',
   'nirf-ranking-2025',
   'SGSITS has maintained its position among the top 100 engineering institutions in the NIRF India Rankings 2025, reflecting consistent improvement in research output and placement performance.',
   '<p>Shri G. S. Institute of Technology and Science, Indore, has been ranked among the top 100 engineering colleges in India in the NIRF India Rankings 2025 released by the Ministry of Education.</p><p>The ranking reflects the institute''s consistent performance across five parameters: Teaching, Learning & Resources; Research and Professional Practice; Graduation Outcomes; Outreach and Inclusivity; and Perception. The institute showed notable improvement in the Research and Professional Practice category due to increased publications and funded projects.</p>',
   NULL, 'Achievement',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-06-10 09:00:00', 'PUBLISHED'),
  ('New AI & Data Science Lab Inaugurated at SGSITS',
   'ai-data-science-lab-2025',
   'The newly built AI & Data Science Laboratory at SGSITS, equipped with high-performance GPU workstations and licensed software, was inaugurated by the Director on National Science Day.',
   '<p>The state-of-the-art AI & Data Science Laboratory was inaugurated at SGSITS by Director Prof. R.K. Pandey on National Science Day, 28 February 2025. The lab is equipped with 20 high-performance workstations featuring NVIDIA RTX 4090 GPUs, an AI inference server, and licensed software including MATLAB, TensorFlow, and IBM SPSS.</p><p>The lab was established with a grant of ₹45 Lakhs from the Department of Science and Technology (DST) under the FIST scheme. It will support research projects in computer vision, natural language processing, and predictive analytics.</p>',
   NULL, 'Research',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-03-01 10:00:00', 'PUBLISHED'),
  ('Convocation 2025 — 68th Annual Convocation Held',
   'convocation-2025',
   'The 68th Annual Convocation of SGSITS was held on 10 May 2025. A total of 842 degrees were conferred including B.E., M.Tech., MCA, MBA, and Ph.D. degrees.',
   '<p>The 68th Annual Convocation of Shri G. S. Institute of Technology and Science was held on 10 May 2025 at the Institute Auditorium. A total of 842 degrees were conferred including 624 B.E., 142 M.Tech./MCA/MBA, and 76 Ph.D. degrees.</p><p>The Chief Guest, Dr. Anil Kumar Sood, Former Director of IIT Roorkee, delivered an inspiring address urging graduates to embrace lifelong learning and contribute meaningfully to nation-building. Medals for academic excellence were awarded to 24 students across departments.</p>',
   '/uploads/seed_convoc25.jpg', 'Event',
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-05-11 09:00:00', 'PUBLISHED')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 9. EVENTS
-- =============================================================================
INSERT INTO events (title, slug, description, event_date, department_id, cover_image_file_id, created_by, status) VALUES
  ('TechNova 2026 — Annual Technical Festival',
   'technova-2026',
   'TechNova is SGSITS''s flagship annual technical festival. TechNova 2026 will be held from 13–15 February 2026. Register your teams for Robowar, CodeStorm, AI Challenge, Circuit Design, Business Plan Pitch, and 15 more events. Participants from across India are welcome. Prizes worth ₹5 Lakhs.',
   '2026-02-13',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_technova25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Annual Sports Meet 2025',
   'annual-sports-meet-2025',
   'The Annual Sports Meet of SGSITS will be held from 20–22 November 2025 at the institute sports ground. Events include athletics, cricket, football, volleyball, basketball, badminton, table tennis, and chess. All students are encouraged to participate. Registration open through department sports coordinators.',
   '2025-11-20',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_sports25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Industry Expert Lecture — AI in Healthcare by Dr. Amitabh Das (IIT Bombay)',
   'guest-lecture-ai-healthcare-2025',
   'The Computer Engineering and IT departments are jointly organising a guest lecture by Dr. Amitabh Das, Associate Professor at IIT Bombay, on "AI Applications in Healthcare Diagnostics." The lecture will cover deep learning for medical imaging, wearable health sensors, and ethics in AI-driven medicine. Open to all students and faculty.',
   '2025-11-28',
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   NULL,
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'PUBLISHED'),
  ('Two-Week FDP — Machine Learning and Data Analytics',
   'fdp-ml-data-analytics-2025',
   'A Two-Week Faculty Development Programme on "Machine Learning and Data Analytics" will be conducted from 10–21 December 2025 under TEQIP-III funding. The FDP covers Python, NumPy, Pandas, scikit-learn, TensorFlow, and case studies. Open to faculty from AICTE-approved institutions.',
   '2025-12-10',
   (SELECT id FROM departments WHERE slug='information-technology'),
   NULL,
   (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'), 'PUBLISHED'),
  ('Convocation 2026 — 69th Annual Convocation',
   'convocation-2026',
   'The 69th Annual Convocation of SGSITS will be held on 09 May 2026. Degree recipients are requested to collect their academic attire from the examination section from 04 May 2026. Guests are permitted a maximum of two per graduate. Live streaming will be available on the institute YouTube channel.',
   '2026-05-09',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_convoc25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Workshop — VLSI Design using Cadence Tools',
   'workshop-vlsi-cadence-2025',
   'The Department of Electronics & TC is organising a three-day hands-on workshop on VLSI Design using Cadence Virtuoso. Topics include schematic design, layout design, DRC/LVS verification, and post-layout simulation. Limited seats available. Register by 01 December 2025.',
   '2025-12-08',
   (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   NULL,
   (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'), 'PUBLISHED')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 10. DOWNLOADS
-- =============================================================================
INSERT INTO downloads (title, category, department_id, file_id, uploaded_by, status) VALUES
  ('B.E. Computer Engineering Semester V Syllabus 2025–26',
   'Syllabus',
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM files WHERE stored_name='seed_ce_sem5_syl.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'ACTIVE'),
  ('B.E. Information Technology Semester V Syllabus 2025–26',
   'Syllabus',
   (SELECT id FROM departments WHERE slug='information-technology'),
   (SELECT id FROM files WHERE stored_name='seed_it_sem5_syl.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'), 'ACTIVE'),
  ('B.E. Mechanical Engineering Semester V Syllabus 2025–26',
   'Syllabus',
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   (SELECT id FROM files WHERE stored_name='seed_me_sem5_syl.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'), 'ACTIVE'),
  ('Academic Calendar 2025–26',
   'Academic',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_acadcal_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('Fee Structure 2025–26 — All Programmes',
   'Fee Structure',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_fee_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('Anti-Ragging Policy 2025',
   'Policy',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_anti_ragging.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('UG Admission Brochure 2025–26',
   'Admission',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_ug_adm_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('PG Admission Brochure 2025–26',
   'Admission',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_pg_adm_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('Placement Brochure 2025–26',
   'Placement',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_place_broch_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('National Scholarship Information 2025–26',
   'Scholarship',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_scholarship_2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 11. EXAM DOCUMENTS
-- =============================================================================
INSERT INTO exam_documents (title, document_type, description, file_id, uploaded_by, publish_date, status) VALUES
  ('End Semester Exam Timetable December 2025',
   'TIMETABLE',
   'Detailed timetable for End Semester Examination December 2025 for all B.E., M.Tech., MCA and MBA programmes. Examination starts 01 December 2025.',
   (SELECT id FROM files WHERE stored_name='seed_tt_dec25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-11-10', 'ACTIVE'),
  ('Admit Card Notice — End Semester December 2025',
   'NOTICE',
   'Instructions for downloading admit cards for End Semester Examination December 2025.',
   (SELECT id FROM files WHERE stored_name='seed_admit_dec25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-11-12', 'ACTIVE'),
  ('End Semester Examination May 2025 — Results',
   'RESULT',
   'Declared results for all programmes for End Semester Examination May 2025.',
   (SELECT id FROM files WHERE stored_name='seed_result_may25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-06-15', 'ACTIVE'),
  ('Academic Calendar 2025–26',
   'ACADEMIC_CALENDAR',
   'Complete academic calendar for the session 2025–26 including all important dates, holidays, and examination schedules.',
   (SELECT id FROM files WHERE stored_name='seed_acadcal_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-07-01', 'ACTIVE'),
  ('Examination Circular — Rules and Regulations 2025',
   'NOTICE',
   'Comprehensive circular covering examination rules, anti-malpractice policy, and code of conduct for all students appearing in SGSITS examinations.',
   (SELECT id FROM files WHERE stored_name='seed_exam_circ_dec25.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-07-15', 'ACTIVE')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 12. PLACEMENT RECORDS
-- =============================================================================
INSERT INTO placement_records (title, record_type, company_name, academic_year, description, file_id, uploaded_by, status) VALUES
  ('TCS Campus Recruitment 2024–25 — Final Report',
   'PLACEMENT_RECORD', 'Tata Consultancy Services', '2024-25',
   'TCS recruited 78 students from SGSITS during the 2024–25 academic year across roles: System Engineer (₹3.6 LPA), Digital (₹7 LPA), and Prime (₹9.5 LPA). Branches: CSE, IT, EC, EE, ME.',
   (SELECT id FROM files WHERE stored_name='seed_tcs_drive25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Infosys Campus Recruitment 2024–25',
   'PLACEMENT_RECORD', 'Infosys', '2024-25',
   'Infosys recruited 62 students through the InfyTQ pathway. Roles offered: Systems Engineer (₹3.6 LPA) and Digital Specialist Engineer (₹9.5 LPA). Branches: All engineering + MCA.',
   NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Wipro Campus Recruitment 2024–25',
   'PLACEMENT_RECORD', 'Wipro', '2024-25',
   'Wipro selected 48 students for the roles of Project Engineer and Technical Analyst. Average package: ₹3.5 LPA. Branches: CSE, IT, EC, ME.',
   NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('KPIT Technologies Campus Drive 2024–25',
   'COMPANY_VISIT', 'KPIT Technologies', '2024-25',
   'KPIT Technologies visited SGSITS for embedded systems and automotive software roles. Package: ₹6.5–12 LPA. Branches: EC, EE, ME with programming skills. 18 students selected.',
   NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('L&T Technology Services Recruitment 2024–25',
   'PLACEMENT_RECORD', 'L&T Technology Services', '2024-25',
   'L&T Technology Services recruited 22 students for engineering design and development roles. Package: ₹5.5–9 LPA. Branches: ME, EE, Civil, EC.',
   NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Aptitude & Communication Training Programme — 2024–25',
   'TRAINING_PROGRAM', NULL, '2024-25',
   'The T&P Cell conducted a 45-day pre-placement training programme covering quantitative aptitude, logical reasoning, verbal ability, group discussion, and technical interview preparation. 390 final-year students participated.',
   (SELECT id FROM files WHERE stored_name='seed_place_broch_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Placement Brochure 2025–26',
   'NOTICE', NULL, '2025-26',
   'Official placement brochure for the batch 2025–26 containing institute profile, programme details, placement statistics, infrastructure information, and contact details for recruiters.',
   (SELECT id FROM files WHERE stored_name='seed_place_broch_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('Microsoft Internship Programme 2025',
   'TRAINING_PROGRAM', 'Microsoft', '2024-25',
   'Microsoft offered 6-month internships to 4 students from Computer Engineering and IT departments through the MSFT Student Partners programme. Stipend: ₹75,000/month.',
   NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 13. GALLERY
-- =============================================================================
INSERT INTO gallery (title, description, department_id, file_id, uploaded_by, status) VALUES
  ('TechNova 2025 — Opening Ceremony',
   'Inaugural session of TechNova 2025 with the Director, faculty guests, and hundreds of participating students from across India.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_technova25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('68th Annual Convocation — Degree Distribution',
   'Students receiving their degrees at the 68th Annual Convocation of SGSITS, May 2025.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_convoc25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('Annual Sports Meet 2025 — Athletics Track Events',
   'Students competing in 100m, 200m and 400m sprint events at the Annual Sports Meet 2025.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_sports25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('Smart India Hackathon — Team CodeCraft',
   'Team CodeCraft from SGSITS who won the Smart India Hackathon 2025 Software Edition.',
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM files WHERE stored_name='seed_hackathon25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'ACTIVE'),
  ('TCS Campus Drive — Interview Process',
   'Students participating in the TCS campus recruitment drive at SGSITS.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_tcs_drive25.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 'ACTIVE'),
  ('SGSITS Library — Reading Hall',
   'The spacious reading hall of the SGSITS Central Library with over 400 seating capacity.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_library.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE'),
  ('AI & Data Science Laboratory',
   'The newly inaugurated AI & Data Science Laboratory equipped with GPU workstations.',
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM files WHERE stored_name='seed_computer_lab.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'ACTIVE'),
  ('Boys Hostel — Main Block',
   'The main block of the boys hostel at SGSITS campus, Indore.',
   NULL,
   (SELECT id FROM files WHERE stored_name='seed_hostel.jpg' LIMIT 1),
   (SELECT id FROM users WHERE email='admin@college.edu'), 'ACTIVE')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 14. PAGES
-- =============================================================================
INSERT INTO pages (title, slug, content, meta_title, meta_description, updated_by, status) VALUES
  ('About SGSITS', 'about',
   '<p>Shri G. S. Institute of Technology and Science (SGSITS), Indore was established in 1952 by the Late Seth Govindram Seksaria. The institute is one of the premier technical institutions in Central India with NAAC Grade A accreditation.</p>',
   'About SGSITS Indore — Premier Engineering Institute since 1952',
   'Learn about SGSITS Indore — its history, vision, accreditation, and commitment to technical excellence.',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Administration', 'administration',
   '<p>The administration of SGSITS is headed by the Director and supported by the Registrar, Dean Academics, and Heads of all departments.</p>',
   'Administration — SGSITS Indore',
   'Administrative structure of SGSITS Indore including Director, Registrar, Dean, and Department Heads.',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Contact Us', 'contact',
   '<p>Contact SGSITS Indore at 23, Park Road, Indore 452 003 MP. Phone: 0731-2431300. Email: info@sgsits.ac.in.</p>',
   'Contact SGSITS Indore',
   'Get in touch with SGSITS Indore — address, phone numbers, email, and office hours.',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Placements', 'placements',
   '<p>The Training & Placement Cell of SGSITS facilitates campus recruitment. Over 480 students placed in 2024-25 with highest package ₹42 LPA.</p>',
   'Placements at SGSITS Indore',
   'SGSITS placement statistics, recruiting companies, training programmes, and contact details.',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Examinations', 'examinations',
   '<p>The Examination Controller''s Office manages all examinations for B.E., M.Tech., MCA, and MBA programmes. Exam results are available on the student portal.</p>',
   'Examinations — SGSITS Indore',
   'Examination schedules, results, timetables, and re-evaluation details for SGSITS Indore.',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 15. TENDERS
-- =============================================================================
INSERT INTO tenders (title, slug, description, file_id, tender_no, deadline, created_by, status) VALUES
  ('Supply and Installation of Computer Laboratory Equipment',
   'tender-computer-lab-equip-2025',
   'SGSITS invites sealed tenders from reputed firms for supply and installation of 40 high-performance desktop computers with peripherals, UPS systems, and networking equipment for the Computer Engineering laboratory. EMD: ₹50,000. Tender fee: ₹1,000 (non-refundable).',
   (SELECT id FROM files WHERE stored_name='seed_tender_lab_2025.pdf' LIMIT 1),
   'SGSITS/TENDER/2025/CE/001', '2025-12-15',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Civil Maintenance and Repair Work — Administrative Building',
   'tender-civil-maintenance-admin-2025',
   'Sealed tenders are invited from registered contractors for annual civil maintenance and repair work of the Administrative Building and surrounding areas including painting, plumbing, electrical maintenance, and landscaping. Estimated cost: ₹18 Lakhs.',
   (SELECT id FROM files WHERE stored_name='seed_tender_civil_2025.pdf' LIMIT 1),
   'SGSITS/TENDER/2025/CIVIL/002', '2025-12-20',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Annual AMC for Server Room and Network Infrastructure',
   'tender-amc-server-network-2025',
   'SGSITS invites proposals for Annual Maintenance Contract for the server room infrastructure including 3 blade servers, network switches, firewall, and structured cabling for all academic blocks.',
   NULL, 'SGSITS/TENDER/2025/IT/003', '2025-11-30',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'),
  ('Housekeeping Services — 2026 Contract',
   'tender-housekeeping-2026',
   'SGSITS invites tenders from registered agencies for comprehensive housekeeping services for the academic year 2026. Scope includes all academic buildings, hostel common areas, auditorium, and guest house. 30 personnel required.',
   NULL, 'SGSITS/TENDER/2025/ADMIN/004', '2025-12-10',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'CLOSED'),
  ('Printing and Stationery — Annual Supply Contract',
   'tender-printing-stationery-2026',
   'Sealed quotations are invited for supply of printed stationery items including answer books, question paper envelopes, admit card printing, mark sheets, degree certificates, and office stationery for the academic year 2026.',
   NULL, 'SGSITS/TENDER/2025/ADMIN/005', '2025-11-25',
   (SELECT id FROM users WHERE email='admin@college.edu'), 'CLOSED')
ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- 16. ALERTS (marquee / banner)
-- =============================================================================
INSERT INTO alerts (message, alert_type, link_url, priority, is_active, created_by, expires_at) VALUES
  ('End Semester Examination December 2025 commences 01 December. Download your Admit Card from the student portal.', 'WARNING', '/notices/admit-card-dec-2025', 10, 1,
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'), '2025-12-05 23:59:59'),
  ('TCS Campus Drive on 15 November 2025. Register via T&P Cell portal by 10 November. CGPA cutoff 6.5.', 'INFO', '/notices/tcs-campus-drive-2025-26', 8, 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), '2025-11-16 23:59:59'),
  ('Ph.D. Admission 2025–26: Applications invited. Last date to apply: 31 August 2025.', 'INFO', '/admission/phd', 6, 1,
   (SELECT id FROM users WHERE email='admin@college.edu'), '2025-08-31 23:59:59'),
  ('TechNova 2026 registrations are now open! Register your team at technova.sgsits.ac.in', 'SUCCESS', '/events/technova-2026', 5, 1,
   (SELECT id FROM users WHERE email='admin@college.edu'), '2026-02-13 23:59:59')
ON DUPLICATE KEY UPDATE message=VALUES(message), is_active=VALUES(is_active);

-- =============================================================================
-- 17. SITE SETTINGS
-- =============================================================================
INSERT INTO site_settings (`key`, value, updated_by) VALUES
  ('site_name',        'SGSITS Indore',                                                  (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_tagline',     'Excellence in Technical Education since 1952',                  (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_email',       'info@sgsits.ac.in',                                             (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_phone',       '0731-2431300',                                                  (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_fax',         '0731-2431302',                                                  (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_address',     '23, Park Road, Indore — 452 003, Madhya Pradesh, India',        (SELECT id FROM users WHERE email='admin@college.edu')),
  ('established_year', '1952',                                                          (SELECT id FROM users WHERE email='admin@college.edu')),
  ('naac_grade',       'A',                                                             (SELECT id FROM users WHERE email='admin@college.edu')),
  ('nirf_rank',        'Top 100 Engineering — India',                                   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('affiliation',      'RGPV Bhopal & DAVV Indore',                                     (SELECT id FROM users WHERE email='admin@college.edu')),
  ('approval',         'AICTE, New Delhi',                                              (SELECT id FROM users WHERE email='admin@college.edu')),
  ('director_name',    'Prof. R.K. Pandey',                                             (SELECT id FROM users WHERE email='admin@college.edu')),
  ('facebook_url',     'https://www.facebook.com/sgsitsindore',                        (SELECT id FROM users WHERE email='admin@college.edu')),
  ('twitter_url',      'https://twitter.com/sgsitsindore',                             (SELECT id FROM users WHERE email='admin@college.edu')),
  ('linkedin_url',     'https://www.linkedin.com/school/sgsits-indore',                (SELECT id FROM users WHERE email='admin@college.edu')),
  ('youtube_url',      'https://www.youtube.com/c/sgsitsindore',                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('instagram_url',    'https://www.instagram.com/sgsitsindore',                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('maintenance_mode', 'false',                                                         (SELECT id FROM users WHERE email='admin@college.edu')),
  ('marquee_enabled',  'true',                                                          (SELECT id FROM users WHERE email='admin@college.edu'))
ON DUPLICATE KEY UPDATE value=VALUES(value), updated_by=VALUES(updated_by);

-- =============================================================================
-- 18. CMS SECTIONS (JSON blobs)
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES

  -- â”€â”€ Home page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('home_hero', JSON_OBJECT(
    'title',      'Shri G.S. Institute of Technology and Science',
    'subtitle',   'Excellence in Technical Education since 1952',
    'ctaLabel',   'Explore Programmes',
    'ctaLink',    '/academics',
    'bgImageUrl', '/assets/hero-campus.jpg',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label','Years of Excellence','value','72+'),
      JSON_OBJECT('label','Programmes Offered','value','12+'),
      JSON_OBJECT('label','Expert Faculty','value','200+'),
      JSON_OBJECT('label','Alumni Placed','value','25,000+')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_about', JSON_OBJECT(
    'heading',    'About SGSITS',
    'subheading', 'A legacy of engineering excellence',
    'body',       'Established in 1952 by the visionary industrialist Late Shri Ghanshyam Das Birla, SGSITS Indore is one of Madhya Pradesh''s premier autonomous engineering institutes. Affiliated to RGPV and approved by AICTE, the institute is NAAC accredited with ''A'' Grade.',
    'imageUrl',   '/assets/about-building.jpg',
    'points', JSON_ARRAY(
      'NAAC Accredited â€” Grade A',
      'NBA Accredited Programmes',
      'Active Industry Collaborations',
      'Vibrant Research Environment'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_stats', JSON_OBJECT(
    'items', JSON_ARRAY(
      JSON_OBJECT('icon','GraduationCap','value','72+',     'label','Years of Excellence'),
      JSON_OBJECT('icon','Users',        'value','200+',    'label','Expert Faculty'),
      JSON_OBJECT('icon','BookOpen',     'value','12+',     'label','Programmes'),
      JSON_OBJECT('icon','Building2',    'value','25,000+', 'label','Alumni Network'),
      JSON_OBJECT('icon','Trophy',       'value','86%',     'label','Placement Rate 2024-25'),
      JSON_OBJECT('icon','FlaskConical', 'value','9',       'label','Research Labs')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_placement', JSON_OBJECT(
    'heading',    'Placements',
    'subheading', 'Building careers, not just degrees',
    'stats', JSON_OBJECT(
      'placed',     '406',
      'highestPkg', '28 LPA',
      'avgPkg',     '6.40 LPA',
      'companies',  '55+'
    ),
    'topRecruiters', JSON_ARRAY(
      'TCS','Infosys','Wipro','Accenture','Capgemini',
      'HCL','Tech Mahindra','L&T','KPIT','Oracle'
    )
  ), (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('home_news_events', JSON_OBJECT(
    'heading',    'News & Events',
    'subheading', 'Stay updated with the latest from SGSITS'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_notices', JSON_OBJECT(
    'heading',     'Latest Notices',
    'subheading',  'Important announcements from the institute',
    'viewAllLink', '/notices'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_gallery', JSON_OBJECT(
    'heading',     'Campus Life',
    'subheading',  'A glimpse of life at SGSITS',
    'viewAllLink', '/gallery'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_departments', JSON_OBJECT(
    'heading',     'Our Departments',
    'subheading',  'Nine departments shaping tomorrow''s engineers',
    'viewAllLink', '/departments'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ About page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('about_institute', JSON_OBJECT(
    'heading',     'About SGSITS',
    'established', '1952',
    'founder',     'Late Shri Ghanshyam Das Birla',
    'body',        'Shri G.S. Institute of Technology and Science (SGSITS), Indore was established in 1952. It is one of the oldest and most prestigious engineering institutes in Madhya Pradesh. The institute offers undergraduate, postgraduate, and doctoral programmes in engineering and management. It is affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal and Devi Ahilya Vishwavidyalaya (DAVV), Indore and is approved by AICTE, New Delhi.',
    'imageUrl',    '/assets/institute-front.jpg'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about_vision_mission', JSON_OBJECT(
    'vision',  'To be a globally recognised centre of technical excellence, fostering innovation, research, and holistic development of future engineers and managers.',
    'mission', JSON_ARRAY(
      'Deliver quality technical education aligned with industry and society needs.',
      'Promote research, innovation, and entrepreneurship.',
      'Develop ethical, environmentally conscious, and socially responsible professionals.',
      'Strengthen industry-academia partnerships for experiential learning.'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about_director', JSON_OBJECT(
    'name',        'Prof. R.K. Pandey',
    'designation', 'Director',
    'qualification','Ph.D. (IIT Delhi)',
    'message',     'Welcome to SGSITS Indore â€” a premier technical institution with a heritage of over seven decades. Our institute stands as a beacon of quality education, combining theoretical rigour with practical exposure. We are committed to nurturing engineers and managers who are not only technically proficient but also equipped with the values and character needed to lead in a complex world.',
    'imageUrl',    '/assets/director.jpg',
    'email',       'director@sgsits.ac.in',
    'phone',       '0731-2431301'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about_history_timeline', JSON_OBJECT(
    'heading', 'Our Journey',
    'milestones', JSON_ARRAY(
      JSON_OBJECT('year','1952','event','Institute founded by Late Shri G.S. Birla'),
      JSON_OBJECT('year','1974','event','Granted autonomy by UGC'),
      JSON_OBJECT('year','1998','event','M.Tech. programmes introduced'),
      JSON_OBJECT('year','2005','event','NBA accreditation for B.E. programmes'),
      JSON_OBJECT('year','2012','event','NAAC ''A'' Grade accreditation'),
      JSON_OBJECT('year','2018','event','Smart Campus infrastructure deployed'),
      JSON_OBJECT('year','2022','event','Golden Jubilee celebrations'),
      JSON_OBJECT('year','2024','event','Research & Innovation Centre inaugurated')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about_achievements', JSON_OBJECT(
    'heading', 'Achievements & Recognition',
    'items', JSON_ARRAY(
      JSON_OBJECT('icon','Award',  'title','NAAC Grade A',        'desc','National Assessment and Accreditation Council â€” Grade A'),
      JSON_OBJECT('icon','Shield', 'title','NBA Accredited',       'desc','B.E. Computer Engg., IT, and Mechanical Engg.'),
      JSON_OBJECT('icon','Globe',  'title','NIRF Ranked',          'desc','Top 50 Engineering Institutes in Madhya Pradesh'),
      JSON_OBJECT('icon','Star',   'title','Autonomous Institute', 'desc','Autonomous status under RGPV, Bhopal')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Academics page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('academics_overview', JSON_OBJECT(
    'heading',    'Academic Programmes',
    'subheading', 'Shaping careers through rigorous technical education',
    'programmes', JSON_ARRAY(
      JSON_OBJECT(
        'level','Undergraduate','degree','B.E.','duration','4 years',
        'branches', JSON_ARRAY('Computer Engineering','Information Technology','Mechanical Engineering','Civil Engineering','Electrical Engineering','Electronics & Telecommunication')
      ),
      JSON_OBJECT(
        'level','Postgraduate','degree','M.Tech.','duration','2 years',
        'branches', JSON_ARRAY('Computer Science & Engineering','Power Systems','Structural Engineering')
      ),
      JSON_OBJECT(
        'level','Management','degree','MBA','duration','2 years',
        'branches', JSON_ARRAY('Business Administration')
      ),
      JSON_OBJECT(
        'level','MCA','degree','Master of Computer Applications','duration','2 years',
        'branches', JSON_ARRAY('Computer Applications')
      ),
      JSON_OBJECT(
        'level','Doctoral','degree','Ph.D.','duration','3-5 years',
        'branches', JSON_ARRAY('All engineering and management disciplines')
      )
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('academics_intake', JSON_OBJECT(
    'heading', 'Sanctioned Intake 2025-26',
    'table', JSON_ARRAY(
      JSON_OBJECT('programme','B.E. Computer Engineering',   'intake',120),
      JSON_OBJECT('programme','B.E. Information Technology', 'intake',60),
      JSON_OBJECT('programme','B.E. Mechanical Engineering', 'intake',120),
      JSON_OBJECT('programme','B.E. Civil Engineering',      'intake',60),
      JSON_OBJECT('programme','B.E. Electrical Engineering', 'intake',60),
      JSON_OBJECT('programme','B.E. Electronics & TC',       'intake',60),
      JSON_OBJECT('programme','M.Tech. CSE',                 'intake',18),
      JSON_OBJECT('programme','MCA',                         'intake',60),
      JSON_OBJECT('programme','MBA',                         'intake',60)
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('academics_calendar', JSON_OBJECT(
    'heading',       'Academic Calendar 2025-26',
    'downloadLink',  '/downloads',
    'keyDates', JSON_ARRAY(
      JSON_OBJECT('event','Odd Semester Classes Begin',       'date','2025-07-21'),
      JSON_OBJECT('event','MST-1 (Mid Semester Test 1)',      'date','2025-08-25'),
      JSON_OBJECT('event','MST-2 (Mid Semester Test 2)',      'date','2025-10-06'),
      JSON_OBJECT('event','End Semester Exam (Odd Sem)',      'date','2025-12-01'),
      JSON_OBJECT('event','Even Semester Classes Begin',      'date','2026-01-12'),
      JSON_OBJECT('event','End Semester Exam (Even Sem)',     'date','2026-05-04')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Admission page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('admission_ug', JSON_OBJECT(
    'heading',    'UG Admission 2025-26',
    'subheading', 'B.E. Programmes â€” All Branches',
    'eligibility','Passed 10+2 (PCM) with minimum 45% aggregate. JEE Main 2025 qualified.',
    'process', JSON_ARRAY(
      'Register on MPDTE Online Counselling Portal',
      'Select SGSITS in institute preference',
      'Document verification at institute',
      'Fee payment and admission confirmation'
    ),
    'importantDates', JSON_OBJECT(
      'counsellingStart','2025-07-01',
      'classesBegin',    '2025-07-21'
    ),
    'documentsRequired', JSON_ARRAY(
      '10th Mark Sheet & Certificate',
      '12th Mark Sheet & Certificate',
      'JEE Main 2025 Score Card',
      'Domicile Certificate (MP)',
      'Category Certificate if applicable',
      'Passport size photographs (6 nos.)',
      'Aadhaar Card'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_pg', JSON_OBJECT(
    'heading',    'PG Admission 2025-26',
    'programmes', JSON_ARRAY(
      JSON_OBJECT('degree','M.Tech.','eligibility','B.E./B.Tech. in relevant discipline with GATE score','intake',18,'process','GATE score based â€” CCMT counselling'),
      JSON_OBJECT('degree','MCA','eligibility','Bachelor degree with Mathematics at 10+2 or graduation level','intake',60,'process','MP MCA CET / CAP counselling'),
      JSON_OBJECT('degree','MBA','eligibility','Any graduation with minimum 50% marks','intake',60,'process','CAT / MAT / MP MAT score based')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_phd', JSON_OBJECT(
    'heading',     'Ph.D. Admission 2025-26',
    'affiliation', 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
    'eligibility', 'M.Tech./MCA/MBA with minimum 55% marks. NET/GATE qualification preferred.',
    'disciplines', JSON_ARRAY(
      'Computer Engineering','Information Technology','Mechanical Engineering',
      'Civil Engineering','Electrical Engineering','Electronics & TC','Management'
    ),
    'contact', 'research@sgsits.ac.in | 0731-2431300'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_fee_structure', JSON_OBJECT(
    'heading',      'Fee Structure 2025-26',
    'note',         'Fees are approved by Fees Regulatory Committee, Govt. of MP. Subject to revision.',
    'downloadLink', '/downloads'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Placement page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('placement_overview', JSON_OBJECT(
    'heading',    'Training & Placement Cell',
    'subheading', 'Bridging talent with opportunity',
    'body',       'The Training & Placement Cell at SGSITS Indore works tirelessly to ensure every student achieves their career aspirations. With dedicated placement infrastructure, industry partnerships, and year-round training programmes, SGSITS continues to deliver excellent placement outcomes.',
    'officer',    'Placement Officer â€” placement@sgsits.ac.in | 0731-2431320'
  ), (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('placement_stats_2024_25', JSON_OBJECT(
    'year',        '2024-25',
    'eligible',    472,
    'placed',      406,
    'rate',        '86%',
    'highestPkg',  '28 LPA',
    'avgPkg',      '6.40 LPA',
    'medianPkg',   '5.80 LPA',
    'companies',   55,
    'topRecruiters', JSON_ARRAY(
      'Oracle','TCS','Infosys','Wipro','Accenture','Capgemini',
      'KPIT','HCL','Tech Mahindra','L&T Infotech','Persistent Systems','Mphasis'
    )
  ), (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('placement_training', JSON_OBJECT(
    'heading',    'Pre-Placement Training',
    'programmes', JSON_ARRAY(
      JSON_OBJECT('title','Aptitude & Reasoning',    'desc','Quantitative aptitude, logical reasoning, verbal ability â€” 60 hours programme'),
      JSON_OBJECT('title','Technical Skills',         'desc','Core CS/IT, domain-specific technical preparation with mock tests'),
      JSON_OBJECT('title','Soft Skills & GD-PI',     'desc','Communication, group discussion, personal interview coaching'),
      JSON_OBJECT('title','Coding Bootcamp',          'desc','Data structures, algorithms, competitive programming â€” HackerRank platform'),
      JSON_OBJECT('title','Industry Expert Sessions', 'desc','Guest lectures and workshops by industry professionals')
    )
  ), (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  -- â”€â”€ Facilities page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('facilities_overview', JSON_OBJECT(
    'heading',    'Campus Facilities',
    'subheading', 'State-of-the-art infrastructure for holistic learning',
    'facilities', JSON_ARRAY(
      JSON_OBJECT('icon','Library',    'title','Central Library',    'desc','60,000+ books, 150+ journals, digital access to IEEE, Springer, ScienceDirect'),
      JSON_OBJECT('icon','Wifi',       'title','Smart Campus Wi-Fi', 'desc','100 Mbps campus-wide Wi-Fi across all academic blocks, hostels, and sports complex'),
      JSON_OBJECT('icon','Home',       'title','Hostels',            'desc','Boys hostel (350 seats, 3 blocks) and Girls hostel (150 seats) with mess facility'),
      JSON_OBJECT('icon','Utensils',   'title','Canteen & Mess',     'desc','Central canteen and separate hostel mess serving nutritious meals'),
      JSON_OBJECT('icon','Trophy',     'title','Sports Complex',      'desc','Cricket ground, football field, volleyball/badminton courts, gymnasium'),
      JSON_OBJECT('icon','HeartPulse', 'title','Medical Centre',      'desc','On-campus medical facility with full-time nurse and visiting doctor'),
      JSON_OBJECT('icon','Bus',        'title','Transport',           'desc','Institute bus service on major city routes'),
      JSON_OBJECT('icon','Laptop',     'title','Computing Labs',      'desc','500+ nodes across all computing labs with 24x7 internet access')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('facilities_library', JSON_OBJECT(
    'heading',    'Central Library',
    'books',      60000,
    'journals',   150,
    'eDatabases', JSON_ARRAY('IEEE Xplore','ScienceDirect','Springer Link','NPTEL','ACM Digital Library'),
    'timings',    'Mon-Sat: 8:00 AM - 9:00 PM',
    'eTerminals', 40
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('facilities_hostel', JSON_OBJECT(
    'heading', 'Hostel Facilities',
    'boys', JSON_OBJECT(
      'blocks',    3,
      'capacity',  350,
      'amenities', JSON_ARRAY('24-hour hot water','Mess','TV room','Wi-Fi','Laundry','Security')
    ),
    'girls', JSON_OBJECT(
      'blocks',    1,
      'capacity',  150,
      'amenities', JSON_ARRAY('24-hour security','Mess','Common room','Wi-Fi','Warden residence on campus')
    ),
    'allotmentProcess', 'Apply through Chief Warden''s office. Priority given to outstation students.',
    'contact', 'Chief Warden, SGSITS | 0731-2431325'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Campus page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('campus_overview', JSON_OBJECT(
    'heading',   'Our Campus',
    'area',      '25 acres',
    'location',  '23 Park Road, Indore - 452 003, Madhya Pradesh',
    'landmarks', JSON_ARRAY(
      'Main Administrative Building (1952)',
      'Seminar Hall (500-seater)',
      'Research & Innovation Centre',
      'Sports Complex',
      'Student Activity Centre',
      'Central Library Block'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Contact page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('contact_info', JSON_OBJECT(
    'instituteName', 'Shri G.S. Institute of Technology & Science',
    'address',       '23, Park Road, Indore - 452 003, Madhya Pradesh, India',
    'phone',         '0731-2431300',
    'fax',           '0731-2431302',
    'email',         'info@sgsits.ac.in',
    'departments', JSON_ARRAY(
      JSON_OBJECT('dept','Director''s Office',   'phone','0731-2431301','email','director@sgsits.ac.in'),
      JSON_OBJECT('dept','Admissions',           'phone','0731-2431305','email','admissions@sgsits.ac.in'),
      JSON_OBJECT('dept','Examination Section',  'phone','0731-2431308','email','examcontroller@sgsits.ac.in'),
      JSON_OBJECT('dept','Training & Placement', 'phone','0731-2431320','email','placement@sgsits.ac.in'),
      JSON_OBJECT('dept','Accounts',             'phone','0731-2431310','email','accounts@sgsits.ac.in'),
      JSON_OBJECT('dept','Library',              'phone','0731-2431312','email','library@sgsits.ac.in')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Branding â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('branding', JSON_OBJECT(
    'logoUrl',      '/assets/logo.png',
    'logoAlt',      'SGSITS Indore',
    'faviconUrl',   '/assets/favicon.ico',
    'primaryColor', '#1e3a5f',
    'accentColor',  '#e8a000',
    'fontHeading',  'Inter',
    'fontBody',     'Inter'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Footer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('footer_about', JSON_OBJECT(
    'instituteName', 'Shri G.S. Institute of Technology & Science',
    'shortName',     'SGSITS, Indore',
    'address',       '23, Park Road, Indore - 452 003 (M.P.) India',
    'phone',         '0731-2431300',
    'fax',           '0731-2431302',
    'email',         'info@sgsits.ac.in'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_quick_links', JSON_OBJECT(
    'heading', 'Quick Links',
    'links', JSON_ARRAY(
      JSON_OBJECT('label','About Institute',  'url','/about'),
      JSON_OBJECT('label','Departments',       'url','/departments'),
      JSON_OBJECT('label','Admissions',        'url','/admission/ug'),
      JSON_OBJECT('label','Examination',       'url','/exam'),
      JSON_OBJECT('label','Placements',        'url','/placements'),
      JSON_OBJECT('label','Research',          'url','/research'),
      JSON_OBJECT('label','Notices',           'url','/notices'),
      JSON_OBJECT('label','Downloads',         'url','/downloads'),
      JSON_OBJECT('label','Tenders',           'url','/tenders'),
      JSON_OBJECT('label','RTI',               'url','/pages/rti')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_departments', JSON_OBJECT(
    'heading', 'Departments',
    'links', JSON_ARRAY(
      JSON_OBJECT('label','Computer Engineering',   'url','/departments/computer-engineering'),
      JSON_OBJECT('label','Information Technology', 'url','/departments/information-technology'),
      JSON_OBJECT('label','Mechanical Engineering', 'url','/departments/mechanical-engineering'),
      JSON_OBJECT('label','Civil Engineering',      'url','/departments/civil-engineering'),
      JSON_OBJECT('label','Electrical Engineering', 'url','/departments/electrical-engineering'),
      JSON_OBJECT('label','Electronics & TC',       'url','/departments/electronics-telecommunication'),
      JSON_OBJECT('label','Applied Sciences',       'url','/departments/applied-sciences'),
      JSON_OBJECT('label','MCA',                    'url','/departments/master-computer-applications'),
      JSON_OBJECT('label','MBA',                    'url','/departments/master-business-administration')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_social', JSON_OBJECT(
    'facebook',  'https://www.facebook.com/sgsitsindore',
    'twitter',   'https://twitter.com/sgsitsindore',
    'linkedin',  'https://www.linkedin.com/school/sgsits-indore',
    'youtube',   'https://www.youtube.com/c/sgsitsindore',
    'instagram', 'https://www.instagram.com/sgsitsindore'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_copyright', JSON_OBJECT(
    'text',       'Â© 2025 Shri G.S. Institute of Technology & Science, Indore. All rights reserved.',
    'designedBy', 'Designed & Maintained by IT Cell, SGSITS'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ UI Labels â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('ui_labels', JSON_OBJECT(
    'loginBtn',           'Login',
    'logoutBtn',          'Logout',
    'dashboardBtn',       'Dashboard',
    'searchPlaceholder',  'Search notices, events, faculty...',
    'noResultsText',      'No results found.',
    'loadMoreBtn',        'Load More',
    'backBtn',            'Back',
    'submitBtn',          'Submit',
    'cancelBtn',          'Cancel',
    'editBtn',            'Edit',
    'deleteBtn',          'Delete',
    'viewBtn',            'View',
    'downloadBtn',        'Download'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  -- â”€â”€ Chatbot CMS config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  ('chatbot_config_cms', JSON_OBJECT(
    'botName',        'SGSITS Assistant',
    'welcomeMessage', 'Welcome to SGSITS! I can help you with admissions, departments, placements, exam schedules, faculty information, and more. How can I assist you?',
    'suggestedQuestions', JSON_ARRAY(
      'Admission procedure for B.E.?',
      'Who is HOD of CSE?',
      'Placement statistics 2024-25?',
      'Hostel facility details?',
      'Exam timetable December 2025?',
      'Fee structure 2025-26?'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu'))

ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- =============================================================================
-- 19. EXAM DATA
--     Sessions â†’ Courses â†’ Sections â†’ Subjects â†’ Faculty Assignments â†’
--     Course Outcomes â†’ Test Details â†’ Students â†’ Marks â†’ Fill Requests
-- =============================================================================

-- â”€â”€ 19a. Exam Sessions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_sessions (start_month, start_year, end_month, end_year, is_active)
VALUES
  (7,  2024, 11, 2024, 0),
  (1,  2025, 5,  2025, 0),
  (7,  2025, 11, 2025, 1)
ON DUPLICATE KEY UPDATE is_active=VALUES(is_active);

-- â”€â”€ 19b. Exam Courses â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_courses (course_code, course_name, specialization, department_id)
VALUES
  ('BE-CE',  'Bachelor of Engineering', 'Computer Engineering',
   (SELECT id FROM departments WHERE slug='computer-engineering')),
  ('BE-IT',  'Bachelor of Engineering', 'Information Technology',
   (SELECT id FROM departments WHERE slug='information-technology')),
  ('BE-ME',  'Bachelor of Engineering', 'Mechanical Engineering',
   (SELECT id FROM departments WHERE slug='mechanical-engineering')),
  ('BE-CVL', 'Bachelor of Engineering', 'Civil Engineering',
   (SELECT id FROM departments WHERE slug='civil-engineering')),
  ('BE-EE',  'Bachelor of Engineering', 'Electrical Engineering',
   (SELECT id FROM departments WHERE slug='electrical-engineering')),
  ('BE-EC',  'Bachelor of Engineering', 'Electronics & Telecommunication Engineering',
   (SELECT id FROM departments WHERE slug='electronics-telecommunication')),
  ('MCA',    'Master of Computer Applications', 'MCA',
   (SELECT id FROM departments WHERE slug='master-computer-applications')),
  ('MBA',    'Master of Business Administration', 'MBA',
   (SELECT id FROM departments WHERE slug='master-business-administration')),
  ('ME-CSE', 'Master of Technology', 'Computer Science & Engineering',
   (SELECT id FROM departments WHERE slug='computer-engineering'))
ON DUPLICATE KEY UPDATE course_name=VALUES(course_name);

-- â”€â”€ 19c. Exam Sections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_sections (department_id, course_id, section_name)
VALUES
  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-CE'),  'A'),
  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-CE'),  'B'),
  ((SELECT id FROM departments WHERE slug='information-technology'),
   (SELECT id FROM exam_courses WHERE course_code='BE-IT'),  'A'),
  ((SELECT id FROM departments WHERE slug='information-technology'),
   (SELECT id FROM exam_courses WHERE course_code='BE-IT'),  'B'),
  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-ME'),  'A'),
  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-ME'),  'B'),
  ((SELECT id FROM departments WHERE slug='civil-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-CVL'), 'A'),
  ((SELECT id FROM departments WHERE slug='electrical-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-EE'),  'A'),
  ((SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   (SELECT id FROM exam_courses WHERE course_code='BE-EC'),  'A')
ON DUPLICATE KEY UPDATE section_name=VALUES(section_name);

-- â”€â”€ 19d. Exam Subjects (active session Jul-Nov 2025) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SET @sess    = (SELECT id FROM exam_sessions WHERE start_month=7 AND start_year=2025);
SET @ce      = (SELECT id FROM exam_courses WHERE course_code='BE-CE');
SET @it      = (SELECT id FROM exam_courses WHERE course_code='BE-IT');
SET @me      = (SELECT id FROM exam_courses WHERE course_code='BE-ME');
SET @ce_dept = (SELECT id FROM departments WHERE slug='computer-engineering');
SET @it_dept = (SELECT id FROM departments WHERE slug='information-technology');
SET @me_dept = (SELECT id FROM departments WHERE slug='mechanical-engineering');

INSERT INTO exam_subjects
  (session_id, subject_code, subject_name, subject_type, semester, department_id, course_id)
VALUES
  (@sess,'CE501','Design & Analysis of Algorithms',  'Regular', 5,@ce_dept,@ce),
  (@sess,'CE502','Database Management Systems',       'Regular', 5,@ce_dept,@ce),
  (@sess,'CE503','Operating Systems',                 'Regular', 5,@ce_dept,@ce),
  (@sess,'CE504','Computer Networks',                 'Regular', 5,@ce_dept,@ce),
  (@sess,'CE505','Theory of Computation',             'Regular', 5,@ce_dept,@ce),
  (@sess,'CE506','Artificial Intelligence',           'Elective',5,@ce_dept,@ce),
  (@sess,'IT501','Software Engineering',              'Regular', 5,@it_dept,@it),
  (@sess,'IT502','Database Management Systems',       'Regular', 5,@it_dept,@it),
  (@sess,'IT503','Computer Networks',                 'Regular', 5,@it_dept,@it),
  (@sess,'IT504','Operating Systems',                 'Regular', 5,@it_dept,@it),
  (@sess,'IT505','Python Programming',                'Regular', 5,@it_dept,@it),
  (@sess,'IT506','Web Technologies',                  'Elective',5,@it_dept,@it),
  (@sess,'ME501','Heat Transfer',                     'Regular', 5,@me_dept,@me),
  (@sess,'ME502','Machine Design',                    'Regular', 5,@me_dept,@me),
  (@sess,'ME503','Manufacturing Technology II',       'Regular', 5,@me_dept,@me),
  (@sess,'ME504','Industrial Engineering',            'Regular', 5,@me_dept,@me),
  (@sess,'ME505','Fluid Machinery',                   'Regular', 5,@me_dept,@me),
  (@sess,'ME506','Automotive Engineering',            'Elective',5,@me_dept,@me)
ON DUPLICATE KEY UPDATE subject_name=VALUES(subject_name);

-- â”€â”€ 19e. Faculty-Subject Assignments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SET @sec_ce_a = (SELECT id FROM exam_sections WHERE department_id=@ce_dept AND course_id=@ce AND section_name='A');
SET @sec_it_a = (SELECT id FROM exam_sections WHERE department_id=@it_dept AND course_id=@it AND section_name='A');
SET @sec_me_a = (SELECT id FROM exam_sections WHERE department_id=@me_dept AND course_id=@me AND section_name='A');

INSERT INTO exam_faculty_subjects
  (session_id, subject_id, faculty_user_id, assignment_type, section_id)
VALUES
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),         'primary',@sec_ce_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),(SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),  'primary',@sec_ce_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE503'),(SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),        'primary',@sec_ce_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE504'),(SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),    'primary',@sec_ce_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE505'),(SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),  'primary',@sec_ce_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE506'),(SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),     'primary',@sec_ce_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT501'),(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),           'primary',@sec_it_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT502'),(SELECT id FROM users WHERE email='manish.dubey@sgsits.ac.in'),     'primary',@sec_it_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT503'),(SELECT id FROM users WHERE email='manish.dubey@sgsits.ac.in'),     'primary',@sec_it_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT504'),(SELECT id FROM users WHERE email='rajesh.verma.it@sgsits.ac.in'),  'primary',@sec_it_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT505'),(SELECT id FROM users WHERE email='pooja.chouhan@sgsits.ac.in'),    'primary',@sec_it_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT506'),(SELECT id FROM users WHERE email='rajesh.verma.it@sgsits.ac.in'),  'primary',@sec_it_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME501'),(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),           'primary',@sec_me_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME502'),(SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in'),     'primary',@sec_me_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME503'),(SELECT id FROM users WHERE email='rakesh.chouksey@sgsits.ac.in'),  'primary',@sec_me_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME504'),(SELECT id FROM users WHERE email='sanjay.patidar@sgsits.ac.in'),   'primary',@sec_me_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME505'),(SELECT id FROM users WHERE email='neha.joshi.me@sgsits.ac.in'),    'primary',@sec_me_a),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME506'),(SELECT id FROM users WHERE email='devendra.mandloi@sgsits.ac.in'), 'primary',@sec_me_a)
ON DUPLICATE KEY UPDATE assignment_type=VALUES(assignment_type);

-- â”€â”€ 19f. Course Outcomes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_course_outcomes (session_id, subject_id, faculty_user_id, co_name)
VALUES
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),'CO1'),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),'CO2'),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),'CO3'),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),'CO4'),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),(SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CO1'),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),(SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CO2'),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),(SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CO3')
ON DUPLICATE KEY UPDATE co_name=VALUES(co_name);

-- â”€â”€ 19g. Test Details (CE501) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_test_details
  (session_id, subject_id, component_name, sub_component_name, co_name, max_marks)
VALUES
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',10),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q2','CO2',10),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST2','Q1','CO3',10),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST2','Q2','CO4',10),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'Assignment','A1','CO1',5),
  (@sess,(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'Assignment','A2','CO2',5)
ON DUPLICATE KEY UPDATE max_marks=VALUES(max_marks);

-- â”€â”€ 19h. Students â€” CE Sem 5 Section A â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_students
  (session_id, enrollment_no, student_name, department_id, course_id, section_id, semester, status)
VALUES
  (@sess,'0801CE211001','Aarav Sharma',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211002','Abhishek Gupta',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211003','Aditya Kumar',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211004','Akanksha Patel',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211005','Akash Verma',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211006','Amit Yadav',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211007','Amrita Singh',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211008','Ananya Chouhan',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211009','Ankur Malviya',    @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211010','Anshika Tiwari',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211011','Arjun Mishra',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211012','Arnav Dubey',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211013','Ayushi Jain',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211014','Bhavna Rathore',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211015','Chirag Soni',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211016','Deepak Agrawal',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211017','Divya Sharma',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211018','Gaurav Chouksey',  @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211019','Harshita Pandey',  @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211020','Hemant Bhatt',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211021','Ishaan Patidar',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211022','Janhvi Kumari',    @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211023','Kabir Nair',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211024','Kavya Sharma',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211025','Lakshman Rao',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211026','Manav Mehta',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211027','Manya Joshi',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211028','Mohit Rajput',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211029','Nandini Shukla',   @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211030','Navneet Singh',    @ce_dept,@ce,@sec_ce_a,5,'regular')
ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);

-- â”€â”€ 19i. Sample Marks â€” CE501 MST1 Q1 CO1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SET @subj_ce501 = (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501');

INSERT INTO exam_marks
  (session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained, status)
VALUES
  (@sess,'0801CE211001',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211002',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211003',@subj_ce501,'MST1','Q1','CO1', 9,'submitted'),
  (@sess,'0801CE211004',@subj_ce501,'MST1','Q1','CO1', 6,'submitted'),
  (@sess,'0801CE211005',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211006',@subj_ce501,'MST1','Q1','CO1', 5,'submitted'),
  (@sess,'0801CE211007',@subj_ce501,'MST1','Q1','CO1', 9,'submitted'),
  (@sess,'0801CE211008',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211009',@subj_ce501,'MST1','Q1','CO1', 6,'submitted'),
  (@sess,'0801CE211010',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211011',@subj_ce501,'MST1','Q1','CO1',10,'submitted'),
  (@sess,'0801CE211012',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211013',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211014',@subj_ce501,'MST1','Q1','CO1', 4,'submitted'),
  (@sess,'0801CE211015',@subj_ce501,'MST1','Q1','CO1', 9,'submitted'),
  (@sess,'0801CE211016',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211017',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211018',@subj_ce501,'MST1','Q1','CO1', 6,'submitted'),
  (@sess,'0801CE211019',@subj_ce501,'MST1','Q1','CO1', 9,'submitted'),
  (@sess,'0801CE211020',@subj_ce501,'MST1','Q1','CO1', 5,'submitted'),
  (@sess,'0801CE211021',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211022',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211023',@subj_ce501,'MST1','Q1','CO1', 9,'submitted'),
  (@sess,'0801CE211024',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211025',@subj_ce501,'MST1','Q1','CO1', 6,'submitted'),
  (@sess,'0801CE211026',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211027',@subj_ce501,'MST1','Q1','CO1',10,'submitted'),
  (@sess,'0801CE211028',@subj_ce501,'MST1','Q1','CO1', 7,'submitted'),
  (@sess,'0801CE211029',@subj_ce501,'MST1','Q1','CO1', 8,'submitted'),
  (@sess,'0801CE211030',@subj_ce501,'MST1','Q1','CO1', 6,'submitted')
ON DUPLICATE KEY UPDATE marks_obtained=VALUES(marks_obtained), status=VALUES(status);

-- â”€â”€ 19j. Marks Fill Requests â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO exam_marks_fill_requests
  (session_id, faculty_user_id, subject_id, component_name, sub_component_name, last_date, status)
VALUES
  (@sess,
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   @subj_ce501,'MST1','Q1','2025-09-20','Submitted'),
  (@sess,
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   @subj_ce501,'MST1','Q2','2025-09-20','Pending'),
  (@sess,
   (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),
   (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),
   'MST1','Q1','2025-09-20','Pending'),
  (@sess,
   (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
   (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT501'),
   'MST1','Q1','2025-09-20','Pending'),
  (@sess,
   (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
   (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME501'),
   'MST1','Q1','2025-09-20','Pending');

-- =============================================================================
-- 20. NAVIGATION ITEMS
-- =============================================================================

INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
VALUES
  (NULL,'Home',        '/',             1, '_self',1),
  (NULL,'About',       '/about',        2, '_self',1),
  (NULL,'Academics',   '/academics',    3, '_self',1),
  (NULL,'Departments', '/departments',  4, '_self',1),
  (NULL,'Admissions',  '/admission/ug', 5, '_self',1),
  (NULL,'Examination', '/exam',         6, '_self',1),
  (NULL,'Placements',  '/placements',   7, '_self',1),
  (NULL,'Research',    '/research',     8, '_self',1),
  (NULL,'Facilities',  '/facilities',   9, '_self',1),
  (NULL,'Notices',     '/notices',     10, '_self',1),
  (NULL,'Gallery',     '/gallery',     11, '_self',1),
  (NULL,'Contact',     '/contact',     12, '_self',1)
ON DUPLICATE KEY UPDATE sort_order=VALUES(sort_order), is_active=VALUES(is_active);

SET @admissions_id = (SELECT id FROM navigation_items WHERE label='Admissions' AND parent_id IS NULL LIMIT 1);

INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
VALUES
  (@admissions_id,'UG Admission',  '/admission/ug',         1,'_self',1),
  (@admissions_id,'PG Admission',  '/admission/pg',         2,'_self',1),
  (@admissions_id,'PhD Admission', '/admission/phd',        3,'_self',1),
  (@admissions_id,'Prospectus',    '/admission/prospectus', 4,'_self',1),
  (@admissions_id,'Fee Structure', '/downloads',            5,'_self',1)
ON DUPLICATE KEY UPDATE url=VALUES(url), is_active=VALUES(is_active);

SET @about_id = (SELECT id FROM navigation_items WHERE label='About' AND parent_id IS NULL LIMIT 1);

INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
VALUES
  (@about_id,'Institute Profile',   '/about',                1,'_self',1),
  (@about_id,'Director''s Message', '/about/director',       2,'_self',1),
  (@about_id,'Vision & Mission',    '/about/vision',         3,'_self',1),
  (@about_id,'Administration',      '/about/admin',          4,'_self',1),
  (@about_id,'NAAC & Rankings',     '/about/accreditation',  5,'_self',1)
ON DUPLICATE KEY UPDATE url=VALUES(url), is_active=VALUES(is_active);

-- =============================================================================
-- END OF SEED
-- =============================================================================

-- =============================================================================
-- PHASE 2 SEED â€” Part A: Fix site_settings + add missing users
-- =============================================================================

-- â”€â”€ Update site_settings with REAL data from mock/settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO site_settings (`key`, value, updated_by) VALUES
  ('site_name',        'SGSITS Indore',                                          (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_fullname',    'Shri G. S. Institute of Technology & Science',           (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_tagline',     'An Institute of National Standing',                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_email',       'registrar@sgsits.ac.in',                                 (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_phone',       '+91-731-2582100, 2582124',                               (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_fax',         '+91-731-2582190',                                         (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_address',     '23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. - 452003, India', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('established_year', '1952',                                                    (SELECT id FROM users WHERE email='admin@college.edu')),
  ('naac_grade',       'A',                                                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('nirf_rank',        'Top 100 Engineering â€” India',                            (SELECT id FROM users WHERE email='admin@college.edu')),
  ('affiliation',      'RGPV Bhopal & DAVV Indore',                              (SELECT id FROM users WHERE email='admin@college.edu')),
  ('approval',         'AICTE, New Delhi',                                        (SELECT id FROM users WHERE email='admin@college.edu')),
  ('director_name',    'Prof. Neetesh Purohit',                                   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('director_photo',   '/director.jpeg',                                          (SELECT id FROM users WHERE email='admin@college.edu')),
  ('institute_code',   'SGSITS (0801)',                                           (SELECT id FROM users WHERE email='admin@college.edu')),
  ('erp_portal_url',   'https://www.sgsits.ac.in',                               (SELECT id FROM users WHERE email='admin@college.edu')),
  ('facebook_url',     'https://facebook.com/sgsitsindore',                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('twitter_url',      'https://twitter.com/sgsitsindore',                        (SELECT id FROM users WHERE email='admin@college.edu')),
  ('linkedin_url',     'https://linkedin.com/school/sgsitsindore',                (SELECT id FROM users WHERE email='admin@college.edu')),
  ('youtube_url',      'https://youtube.com/@sgsitsindore',                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('instagram_url',    'https://instagram.com/sgsitsindore',                      (SELECT id FROM users WHERE email='admin@college.edu')),
  ('maintenance_mode', 'false',                                                    (SELECT id FROM users WHERE email='admin@college.edu')),
  ('marquee_enabled',  'true',                                                     (SELECT id FROM users WHERE email='admin@college.edu')),
  ('helpline',         '+91-731-2582100',                                          (SELECT id FROM users WHERE email='admin@college.edu')),
  ('registrar_email',  'registrar@sgsits.ac.in',                                   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('short_code',       'SG',                                                       (SELECT id FROM users WHERE email='admin@college.edu')),
  ('campus_area',      '51 acres',                                                 (SELECT id FROM users WHERE email='admin@college.edu'))
ON DUPLICATE KEY UPDATE value=VALUES(value), updated_by=VALUES(updated_by);

-- Update director user record with correct name
UPDATE users SET name='Prof. Neetesh Purohit' WHERE email='director@sgsits.ac.in';

-- =============================================================================
-- PHASE 2 SEED â€” Part B: Add missing teacher users (referenced by exam data)
-- =============================================================================
SET @pwd = '$2b$10$UCUt4jzQmwHyCSC7aeojZuFUIEr9fROuyL2fgWMJpADyx4DxvKgjC';

INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  -- CE additional teachers (used in exam_faculty_subjects)
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Kiran Patel',       'kiran.patel.ce@sgsits.ac.in',   @pwd, '9826004001', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Amit Soni',       'amit.soni@sgsits.ac.in',        @pwd, '9826004002', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Seema Rathore',     'seema.rathore@sgsits.ac.in',    @pwd, '9826004003', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Vivek Sharma',    'vivek.sharma.ce@sgsits.ac.in',  @pwd, '9826004004', 'ACTIVE'),
  -- IT additional teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Manish Dubey',      'manish.dubey@sgsits.ac.in',     @pwd, '9826004005', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Rajesh Verma',    'rajesh.verma.it@sgsits.ac.in',  @pwd, '9826004006', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Pooja Chouhan',     'pooja.chouhan@sgsits.ac.in',    @pwd, '9826004007', 'ACTIVE'),
  -- ME additional teachers
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Anil Agrawal',      'anil.agrawal@sgsits.ac.in',     @pwd, '9826004008', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Rakesh Chouksey', 'rakesh.chouksey@sgsits.ac.in',  @pwd, '9826004009', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Sanjay Patidar',    'sanjay.patidar@sgsits.ac.in',   @pwd, '9826004010', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Dr. Neha Joshi',        'neha.joshi.me@sgsits.ac.in',    @pwd, '9826004011', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='TEACHER'), NULL, 'Prof. Devendra Mandloi','devendra.mandloi@sgsits.ac.in', @pwd, '9826004012', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), status=VALUES(status);

-- Patch dept for the new CE/IT/ME teachers
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='computer-engineering')
  WHERE email IN ('kiran.patel.ce@sgsits.ac.in','amit.soni@sgsits.ac.in','seema.rathore@sgsits.ac.in','vivek.sharma.ce@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='information-technology')
  WHERE email IN ('manish.dubey@sgsits.ac.in','rajesh.verma.it@sgsits.ac.in','pooja.chouhan@sgsits.ac.in');
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='mechanical-engineering')
  WHERE email IN ('anil.agrawal@sgsits.ac.in','rakesh.chouksey@sgsits.ac.in','sanjay.patidar@sgsits.ac.in','neha.joshi.me@sgsits.ac.in','devendra.mandloi@sgsits.ac.in');

-- =============================================================================
-- PHASE 2 SEED â€” Part C: HODs for new departments
-- =============================================================================
INSERT INTO users (role_id, department_id, name, email, password_hash, phone, status) VALUES
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Nitish Gupta',          'hod.chem@sgsits.ac.in',         @pwd, '9826005001', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Smita Verma',           'hod.math@sgsits.ac.in',         @pwd, '9826005002', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Joseph Thomas Andrews', 'hod.phy@sgsits.ac.in',          @pwd, '9826005003', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Ms. Vibha Bhatnagar',       'hod.bme@sgsits.ac.in',          @pwd, '9826005004', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Sunita Varma',          'hod.cta@sgsits.ac.in',          @pwd, '9826005005', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. R.C. Gurjar',           'hod.ei@sgsits.ac.in',           @pwd, '9826005006', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Neeraj Jain',           'hod.humanities@sgsits.ac.in',   @pwd, '9826005007', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Girish Thakar',         'hod.ip@sgsits.ac.in',           @pwd, '9826005008', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. R.C. Gupta',            'hod.mgt@sgsits.ac.in',          @pwd, '9826005009', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Vineet Singh',          'hod.pharmacy@sgsits.ac.in',     @pwd, '9826005010', 'ACTIVE'),
  ((SELECT id FROM roles WHERE role_name='HOD'), NULL, 'Dr. Neeraj Jain',           'hod.coebg@sgsits.ac.in',        @pwd, '9826005011', 'ACTIVE')
ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part D: New departments (matching frontend routes/slugs)
-- =============================================================================
INSERT INTO departments (name, slug, short_name, description, vision, mission,
  hod_user_id, status, established_year, contact_email, contact_phone) VALUES
  (
    'Applied Chemistry & Chemical Technology', 'applied-chemistry', 'Applied Chemistry',
    'The Department of Applied Chemistry & Chemical Technology provides foundational chemistry education to all engineering students and offers specialized PG programmes.',
    'To emerge as a leading centre for chemical sciences, fostering research and innovation in materials, processes, and environment.',
    'To provide quality chemistry education that supports engineering applications, promotes sustainable practices, and advances research.',
    (SELECT id FROM users WHERE email='hod.chem@sgsits.ac.in'), 'ACTIVE', 1952,
    'chem@sgsits.ac.in', '+91-731-2582181'
  ),
  (
    'Applied Mathematics & Computational Science', 'applied-mathematics', 'Applied Mathematics',
    'The Department of Applied Mathematics provides rigorous mathematical training for all engineering disciplines and offers Ph.D. programmes in computational science.',
    'To cultivate mathematical excellence and computational thinking that drives engineering innovation.',
    'To deliver high-quality mathematics instruction with focus on applications in engineering, data science, and optimization.',
    (SELECT id FROM users WHERE email='hod.math@sgsits.ac.in'), 'ACTIVE', 1952,
    'math@sgsits.ac.in', '+91-731-2582435'
  ),
  (
    'Applied Physics & Optoelectronics', 'applied-physics', 'Applied Physics',
    'The Department of Applied Physics provides physics education for engineering students and conducts advanced research in optoelectronics and photonics.',
    'To be a distinguished centre for applied physics research, bridging fundamental science and engineering applications.',
    'To impart high-quality physics education and promote research in optoelectronics, photonics, and material science.',
    (SELECT id FROM users WHERE email='hod.phy@sgsits.ac.in'), 'ACTIVE', 1952,
    'physics@sgsits.ac.in', '+91-731-2582440'
  ),
  (
    'Biomedical Engineering', 'biomedical-engineering', 'Biomedical Engg',
    'The Department of Biomedical Engineering offers B.E. and M.Tech programmes that combine engineering principles with medical and biological sciences.',
    'To become a premier department producing biomedical engineers who bridge the gap between engineering and healthcare.',
    'To educate future biomedical engineers through interdisciplinary curriculum combining electronics, computing, and life sciences.',
    (SELECT id FROM users WHERE email='hod.bme@sgsits.ac.in'), 'ACTIVE', 1992,
    'bme@sgsits.ac.in', '+91-731-2582471'
  ),
  (
    'Computer Technology & Applications', 'computer-technology', 'CTA',
    'The Department of Computer Technology & Applications offers the MCA programme and specialises in software systems, database management, and network applications.',
    'To produce highly skilled software professionals capable of designing and managing complex information systems.',
    'To provide rigorous postgraduate computer education integrating software engineering, AI, and web technologies.',
    (SELECT id FROM users WHERE email='hod.cta@sgsits.ac.in'), 'ACTIVE', 1985,
    'cta@sgsits.ac.in', '+91-731-2582260'
  ),
  (
    'Electronics & Instrumentation Engineering', 'electronics-instrumentation', 'Electronics & Instru',
    'The Department of Electronics & Instrumentation Engineering offers B.E., M.Tech., and Ph.D. programmes with specialisations in VLSI, control systems, and industrial instrumentation.',
    'To become a renowned department in electronics and instrumentation, producing engineers who drive smart industry and automation.',
    'To educate students in electronics, control systems, and instrumentation through a blend of theory, experimentation, and industry exposure.',
    (SELECT id FROM users WHERE email='hod.ei@sgsits.ac.in'), 'ACTIVE', 1966,
    'ei@sgsits.ac.in', '+91-731-2582342'
  ),
  (
    'Humanities & Social Sciences', 'humanities', 'Humanities',
    'The Department of Humanities & Social Sciences offers essential communication, management, and social science courses that complement technical education across all departments.',
    'To nurture well-rounded engineers with strong communication, critical thinking, and ethical sensitivity.',
    'To impart quality humanities education that develops the human and professional dimensions of engineering graduates.',
    (SELECT id FROM users WHERE email='hod.humanities@sgsits.ac.in'), 'ACTIVE', 1952,
    'humanities@sgsits.ac.in', '+91-731-2582320'
  ),
  (
    'Industrial & Production Engineering', 'industrial-production', 'Industrial & Prod',
    'The Department of Industrial & Production Engineering offers B.E., M.Tech., and Ph.D. programmes with focus on manufacturing systems, industrial automation, and supply chain management.',
    'To be a leading centre for industrial engineering education that produces efficient, innovative, and industry-ready engineers.',
    'To deliver comprehensive industrial engineering education through advanced manufacturing exposure, research projects, and industry partnerships.',
    (SELECT id FROM users WHERE email='hod.ip@sgsits.ac.in'), 'ACTIVE', 1968,
    'ip@sgsits.ac.in', '+91-731-2582371'
  ),
  (
    'Management Studies', 'management-studies', 'MBA',
    'The Department of Management Studies offers a two-year MBA programme approved by AICTE with specialisations in Finance, Marketing, HR, and Operations.',
    'To develop transformational business leaders with integrity, analytical prowess, and a global perspective.',
    'To impart management education through case-based learning, industry interaction, and experiential projects.',
    (SELECT id FROM users WHERE email='hod.mgt@sgsits.ac.in'), 'ACTIVE', 1992,
    'mba@sgsits.ac.in', '+91-731-2582651'
  ),
  (
    'Pharmacy', 'pharmacy', 'Pharmacy',
    'The Department of Pharmacy offers B.Pharm and M.Pharm programmes approved by the Pharmacy Council of India. The department has a well-equipped pharmaceutical laboratory.',
    'To create competent pharmaceutical professionals contributing to healthcare and drug discovery.',
    'To provide quality pharmacy education through rigorous training in pharmaceutical sciences, clinical pharmacy, and drug development.',
    (SELECT id FROM users WHERE email='hod.pharmacy@sgsits.ac.in'), 'ACTIVE', 1988,
    'pharmacy@sgsits.ac.in', '+91-731-2582566'
  ),
  (
    'Centre of Excellence for Bhartiya Gyan Parampara', 'coebg', 'Bhartiya Gyan Parampara',
    'The Centre of Excellence for Bhartiya Gyan Parampara promotes the study and preservation of traditional Indian knowledge systems and their integration with modern science.',
    'To bridge India''s ancient knowledge traditions with contemporary scientific inquiry and engineering practice.',
    'To conduct research, documentation, and education that honours and advances Bhartiya intellectual traditions.',
    (SELECT id FROM users WHERE email='hod.coebg@sgsits.ac.in'), 'ACTIVE', 2020,
    'coebg@sgsits.ac.in', '+91-731-2582100'
  )
ON DUPLICATE KEY UPDATE
  name=VALUES(name), description=VALUES(description),
  hod_user_id=VALUES(hod_user_id), status=VALUES(status),
  contact_email=VALUES(contact_email), contact_phone=VALUES(contact_phone);

-- Link new HODs to their departments
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='applied-chemistry')         WHERE email='hod.chem@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='applied-mathematics')       WHERE email='hod.math@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='applied-physics')           WHERE email='hod.phy@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='biomedical-engineering')    WHERE email='hod.bme@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='computer-technology')       WHERE email='hod.cta@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electronics-instrumentation') WHERE email='hod.ei@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='humanities')               WHERE email='hod.humanities@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='industrial-production')     WHERE email='hod.ip@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='management-studies')        WHERE email='hod.mgt@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='pharmacy')                  WHERE email='hod.pharmacy@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='coebg')                     WHERE email='hod.coebg@sgsits.ac.in';

-- =============================================================================
-- PHASE 2 SEED â€” Part E: Faculty profiles for ALL teachers
-- =============================================================================
INSERT INTO faculty_profiles
  (user_id, department_id, designation, qualification, specialization, experience, bio, status)
VALUES
  -- CE Teachers
  ((SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (CS, IIT Roorkee)', 'Machine Learning, Natural Language Processing', 8,
   'Dr. Nisha Thakur specialises in machine learning and NLP. She has published 15 research papers and actively mentors student projects in AI/ML.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='rohit.sharma@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (CS, MANIT Bhopal)', 'Web Technologies, Full Stack Development', 6,
   'Prof. Rohit Sharma teaches web technologies and full stack development. He has hands-on industry experience with several startup projects.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Associate Professor', 'Ph.D. (CS, DAVV Indore)', 'Data Structures, Algorithm Design', 14,
   'Dr. Meena Agarwal is an expert in data structures and algorithms with 14 years of teaching experience and 20+ publications.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (Database Systems)', 'Database Management, Big Data', 7,
   'Dr. Kiran Patel specialises in database management systems and big data analytics with active research in distributed databases.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (Computer Science)', 'Operating Systems, System Programming', 5,
   'Prof. Amit Soni teaches operating systems and system programming. He has worked on Linux kernel contributions and embedded OS projects.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (Networking)', 'Computer Networks, Cybersecurity', 9,
   'Dr. Seema Rathore is a networking and cybersecurity specialist with certifications in CISSP and CEH. She has guided multiple industry projects.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Assistant Professor', 'M.Tech. (Theoretical CS)', 'Theory of Computation, Compiler Design', 6,
   'Prof. Vivek Sharma specialises in formal language theory and compiler design. He actively contributes to curriculum development in theoretical CS.', 'ACTIVE'),

  -- IT Teachers
  ((SELECT id FROM users WHERE email='sunita.patel@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='information-technology'),
   'Associate Professor', 'Ph.D. (IT, Barkatullah University)', 'Cloud Computing, IoT', 12,
   'Dr. Sunita Patel has expertise in cloud computing and Internet of Things. She has published 18 papers and supervised 2 M.Tech. dissertations.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='anil.kumar@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='information-technology'),
   'Assistant Professor', 'M.Tech. (Software Engineering)', 'Software Engineering, Agile Methods', 7,
   'Prof. Anil Kumar teaches software engineering and project management. He has industry experience at Infosys and TCS before joining academia.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='manish.dubey@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='information-technology'),
   'Associate Professor', 'Ph.D. (CS, RGPV)', 'Database Systems, Data Mining', 13,
   'Dr. Manish Dubey has 13 years of teaching experience in databases and data mining. He has guided 3 M.Tech. dissertations and published 22 papers.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='rajesh.verma.it@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='information-technology'),
   'Assistant Professor', 'M.Tech. (IT)', 'Operating Systems, Python Programming', 8,
   'Prof. Rajesh Verma specialises in systems programming and Python. He is a certified Python professional and NPTEL mentor.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='pooja.chouhan@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='information-technology'),
   'Assistant Professor', 'M.Tech. (Web Technologies)', 'Web Development, Mobile Apps', 5,
   'Dr. Pooja Chouhan specialises in full stack web development and mobile application development using React Native and Flutter.', 'ACTIVE'),

  -- ME Teachers
  ((SELECT id FROM users WHERE email='priya.singh@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Assistant Professor', 'M.Tech. (Thermal Engg)', 'Thermodynamics, Heat Transfer', 7,
   'Dr. Priya Singh specialises in thermal engineering with research focus on heat exchangers and renewable energy systems.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='vikas.tiwari@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Assistant Professor', 'M.Tech. (Manufacturing)', 'CAD/CAM, Manufacturing Technology', 6,
   'Prof. Vikas Tiwari teaches CAD/CAM and manufacturing technology. He has industry experience in automotive component manufacturing.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Associate Professor', 'Ph.D. (Machine Design)', 'Machine Design, Vibration Analysis', 15,
   'Dr. Anil Agrawal is an expert in machine design and vibration analysis. He has patented two innovations in vibration dampening.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='rakesh.chouksey@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Assistant Professor', 'M.Tech. (Production Engg)', 'Manufacturing Technology, CNC', 8,
   'Prof. Rakesh Chouksey specialises in advanced manufacturing technology with CNC programming and lean manufacturing expertise.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='sanjay.patidar@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Associate Professor', 'Ph.D. (Industrial Engg)', 'Industrial Engineering, Operations Research', 16,
   'Dr. Sanjay Patidar has 16 years of experience in industrial engineering and operations research with 25+ publications.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='neha.joshi.me@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Assistant Professor', 'M.Tech. (Fluid Mechanics)', 'Fluid Mechanics, CFD', 6,
   'Dr. Neha Joshi specialises in computational fluid dynamics and fluid machinery with active research in turbomachinery.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='devendra.mandloi@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Assistant Professor', 'M.Tech. (Automobile Engg)', 'Automotive Engineering, IC Engines', 7,
   'Prof. Devendra Mandloi teaches automotive engineering and IC engines. He has industry experience with Mahindra and Tata Motors.', 'ACTIVE'),

  -- Civil, EE, EC, ASH, MCA, MBA teachers
  ((SELECT id FROM users WHERE email='anand.mishra@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='civil-engineering'),
   'Associate Professor', 'Ph.D. (Structural Engg)', 'Structural Analysis, RCC Design', 14,
   'Dr. Anand Mishra is a structural engineering specialist with expertise in RCC and steel design. He has worked on major infrastructure projects.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='deepak.gupta@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='electrical-engineering'),
   'Assistant Professor', 'M.Tech. (Power Systems)', 'Power Electronics, Drives', 8,
   'Prof. Deepak Gupta specialises in power electronics and motor drives. He is a certified MATLAB and Simulink professional.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='monika.verma@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   'Associate Professor', 'Ph.D. (VLSI Design)', 'VLSI Design, Embedded Systems', 13,
   'Dr. Monika Verma is an expert in VLSI design and embedded systems. She has published 20 research papers and holds one patent.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='rajesh.pandey@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='applied-sciences-humanities'),
   'Professor', 'Ph.D. (Applied Mathematics)', 'Numerical Methods, Operations Research', 20,
   'Prof. Rajesh Pandey has 20 years of experience teaching applied mathematics. He specialises in numerical methods and computational mathematics.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='swati.joshi@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='master-computer-applications'),
   'Assistant Professor', 'M.Tech. (MCA, RGPV)', 'Java Programming, Web Technologies', 7,
   'Dr. Swati Joshi specialises in Java-based enterprise applications and web technologies. She actively mentors MCA project groups.', 'ACTIVE'),

  ((SELECT id FROM users WHERE email='dinesh.chouhan@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='master-business-administration'),
   'Associate Professor', 'Ph.D. (Management, DAVV)', 'Marketing Management, Consumer Behaviour', 12,
   'Prof. Dinesh Chouhan specialises in marketing management and consumer behaviour research. He has published 16 papers in management journals.', 'ACTIVE')

ON DUPLICATE KEY UPDATE
  designation=VALUES(designation), qualification=VALUES(qualification),
  specialization=VALUES(specialization), bio=VALUES(bio), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part F: Faculty qualifications
-- =============================================================================
INSERT INTO faculty_qualifications (faculty_id, degree, institution, year, specialization)
VALUES
  -- HOD CE
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'Ph.D.', 'IIT Bombay', 2001, 'Distributed Systems'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'M.Tech.', 'IIT Delhi', 1997, 'Computer Science & Engineering'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'B.E.', 'SGSITS Indore', 1995, 'Computer Engineering'),

  -- HOD IT
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
   'Ph.D.', 'DAVV Indore', 2003, 'Information Technology'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
   'M.Tech.', 'RGPV Bhopal', 1998, 'Computer Science'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
   'B.E.', 'SGSITS Indore', 1996, 'Computer Engineering'),

  -- HOD ME
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
   'Ph.D.', 'IIT Indore', 2004, 'Thermal Engineering'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
   'M.Tech.', 'IIT Bombay', 1999, 'Mechanical Engineering'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
   'B.E.', 'SGSITS Indore', 1997, 'Mechanical Engineering'),

  -- CE Teacher - Meena Agarwal
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in')),
   'Ph.D.', 'DAVV Indore', 2012, 'Computer Science'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in')),
   'M.Tech.', 'SGSITS Indore', 2008, 'Computer Science & Engineering'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in')),
   'B.E.', 'SGSITS Indore', 2006, 'Computer Engineering'),

  -- ME Teacher - Anil Agrawal
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in')),
   'Ph.D.', 'IIT Guwahati', 2010, 'Machine Design'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in')),
   'M.Tech.', 'NIT Raipur', 2005, 'Design of Mechanical Systems'),
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in')),
   'B.E.', 'SGSITS Indore', 2003, 'Mechanical Engineering')

ON DUPLICATE KEY UPDATE degree=VALUES(degree), institution=VALUES(institution);

-- =============================================================================
-- PHASE 2 SEED â€” Part G: Faculty publications
-- =============================================================================
INSERT INTO faculty_publications
  (faculty_id, title, venue_type, journal_name, publication_year, authors, link, citations, status)
VALUES
  -- HOD CE publications
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'Adaptive Resource Scheduling in Cloud Environments', 'Journal',
   'IEEE Transactions on Cloud Computing', 2023,
   'Khunteta A., Sharma R., Gupta P.', 'https://doi.org/10.1109/tcc.2023.0456', 42, 'PUBLISHED'),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'Fog Computing Architectures for IoT Applications', 'Journal',
   'International Journal of Computer Applications', 2022,
   'Khunteta A., Singh M.', 'https://doi.org/10.5120/ijca2022.0782', 28, 'PUBLISHED'),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'Edge Intelligence: A Survey of ML at the Network Edge', 'Conference',
   'IEEE International Conference on Cloud Computing', 2024,
   'Khunteta A., Rathore S., Tiwari V.', 'https://doi.org/10.1109/cloud2024.0133', 15, 'PUBLISHED'),

  -- HOD IT publications
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
   'Deep Learning Approaches for Network Intrusion Detection', 'Journal',
   'Journal of Network and Computer Applications', 2023,
   'Jain K., Verma R., Dubey M.', 'https://doi.org/10.1016/jnca.2023.103641', 35, 'PUBLISHED'),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
   'Blockchain-Enabled Secure Data Sharing in Fog Networks', 'Journal',
   'Future Generation Computer Systems', 2022,
   'Jain K., Chouhan P.', 'https://doi.org/10.1016/j.future.2022.01.022', 52, 'PUBLISHED'),

  -- CE Teacher Meena Agarwal publications
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in')),
   'Efficient Approximation for Vertex Cover in Sparse Graphs', 'Journal',
   'IEEE Transactions on Computers', 2024,
   'Agarwal M., Pandey R.K., Saxena P.', 'https://doi.org/10.1109/tc.2024.0123', 28, 'PUBLISHED'),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in')),
   'A Sub-quadratic Algorithm for Maximum Matching in Bipartite Graphs', 'Conference',
   'ACM Symposium on Theory of Computing (STOC)', 2023,
   'Agarwal M., Gupta S.', 'https://doi.org/10.1145/3564246.3585157', 41, 'PUBLISHED'),

  -- HOD ME publication
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
   'Thermal Performance of Micro-Channel Heat Sink: A CFD Study', 'Journal',
   'Applied Thermal Engineering', 2023,
   'Kasande P., Joshi N., Singh P.', 'https://doi.org/10.1016/ate.2023.0451', 19, 'PUBLISHED'),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
   'Optimization of Machining Parameters Using Taguchi Method', 'Conference',
   'International Conference on Advanced Manufacturing', 2022,
   'Kasande P., Chouksey R.', 'https://doi.org/10.1109/icam.2022.0892', 12, 'PUBLISHED')

ON DUPLICATE KEY UPDATE title=VALUES(title), citations=VALUES(citations);

-- =============================================================================
-- PHASE 2 SEED â€” Part H: Faculty research projects
-- =============================================================================
INSERT INTO faculty_research
  (faculty_id, title, research_area, description, start_year, end_year, status,
   funding_agency, funding_amount, created_at)
VALUES
  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'Energy-Efficient ML Inference on Edge Devices', 'Edge Computing & ML',
   'DST-funded 3-year project on hardware-aware inference optimization for IoT edge devices.',
   2025, 2028, 'Ongoing', 'Dept. of Science & Technology', 3800000.00, NOW()),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
   'Adaptive Cloud Resource Management using Deep RL', 'Cloud Computing',
   'Designing a deep reinforcement learning agent for dynamic cloud resource allocation.',
   2023, 2025, 'Ongoing', 'SERB', 1200000.00, NOW()),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
   'Blockchain-Based Secure Academic Records System', 'Blockchain & Security',
   'Developing a tamper-proof academic credential verification system using blockchain.',
   2024, 2026, 'Ongoing', 'AICTE-RPS', 1500000.00, NOW()),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
   'Development of Hybrid Cooling Systems for Electric Vehicles', 'Thermal Engineering',
   'Research on novel cooling technologies for EV battery packs using phase change materials.',
   2024, 2027, 'Ongoing', 'Dept. of Science & Technology', 2800000.00, NOW()),

  ((SELECT id FROM faculty_profiles WHERE user_id=(SELECT id FROM users WHERE email='meena.agarwal@sgsits.ac.in')),
   'Graph Algorithms for Social Network Analysis', 'Graph Theory',
   'Efficient algorithms for community detection and influence maximisation in large social networks.',
   2022, 2024, 'Completed', 'Institute Seed Grant', 500000.00, NOW())

ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part I: Labs (one per major department)
-- =============================================================================
INSERT INTO labs (department_id, name, description, incharge, capacity, is_active, created_by)
VALUES
  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   'AI & Machine Learning Lab',
   'State-of-the-art lab equipped with GPU workstations for deep learning, NLP, and computer vision research. Features NVIDIA A100 GPUs, 40+ workstations, and licensed MATLAB and CUDA toolkits.',
   'Dr. Nisha Thakur', 40,  1, (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   'Computer Networks & Security Lab',
   'Dedicated networking lab with Cisco routers, switches, and firewalls. Supports courses in computer networks, cybersecurity, and ethical hacking.',
   'Dr. Seema Rathore', 30, 1, (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   'Software Engineering Lab',
   'Full-stack development lab with 50 workstations supporting Node.js, React, Python, Java, and cloud deployment tools.',
   'Prof. Rohit Sharma', 50, 1, (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='information-technology'),
   'Database & Big Data Lab',
   'Lab specialised in relational and NoSQL databases, Hadoop ecosystem, Spark, and data warehousing tools.',
   'Dr. Manish Dubey', 40, 1, (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='information-technology'),
   'IoT & Cloud Computing Lab',
   'Modern lab with Raspberry Pi clusters, Arduino boards, AWS/Azure sandboxes, and IoT sensors for hands-on cloud and IoT experimentation.',
   'Dr. Sunita Patel', 35, 1, (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Heat Transfer & Thermodynamics Lab',
   'Equipped with heat exchangers, calorimeters, radiation apparatus, and a digital refrigeration test rig for thermal engineering experiments.',
   'Dr. Neha Joshi', 30, 1, (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'CAD/CAM & Manufacturing Lab',
   'Lab with 20 CAD workstations, CNC lathe machine, CNC milling machine, 3D printer, and CMM for manufacturing technology courses.',
   'Prof. Vikas Tiwari', 25, 1, (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Machine Design & Vibration Lab',
   'Equipped with dynamic balancing machine, vibration analyser, universal testing machine, and fatigue testing equipment.',
   'Dr. Anil Agrawal', 20, 1, (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='civil-engineering'),
   'Structural Engineering Lab',
   'Lab with UTM, impact testing machine, compression testing machine, and structural analysis software (SAP2000, STAAD Pro).',
   'Dr. Anand Mishra', 25, 1, (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='civil-engineering'),
   'Geotechnical Engineering Lab',
   'Well-equipped lab with triaxial apparatus, consolidation test setup, CBR machine, and soil testing equipment.',
   'Dr. Anand Mishra', 20, 1, (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='electrical-engineering'),
   'Power Electronics & Drives Lab',
   'Lab with modern inverters, AC/DC drives, PLC-based automation setups, and power quality analysers.',
   'Prof. Deepak Gupta', 25, 1, (SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   'VLSI & Embedded Systems Lab',
   'Lab with FPGA boards (Xilinx/Intel), ARM-based development kits, oscilloscopes, and IC design software (Cadence, Tanner EDA).',
   'Dr. Monika Verma', 30, 1, (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='electronics-instrumentation'),
   'Process Control & Instrumentation Lab',
   'Lab with PLC-based process control systems, digital signal processors, LabVIEW workstations, and industrial sensors.',
   'Dr. R.C. Gurjar', 25, 1, (SELECT id FROM users WHERE email='hod.ei@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='industrial-production'),
   'Industrial Automation Lab',
   'Equipped with SCADA systems, robotic arms, CNC machining centre, and simulation software for industrial engineering courses.',
   'Dr. Girish Thakar', 20, 1, (SELECT id FROM users WHERE email='hod.ip@sgsits.ac.in'))

ON DUPLICATE KEY UPDATE description=VALUES(description), capacity=VALUES(capacity);

-- =============================================================================
-- PHASE 2 SEED â€” Part J: Department achievements
-- =============================================================================
INSERT INTO department_achievements
  (department_id, title, description, achievement_year, category, status, created_by)
VALUES
  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   'NBA Accreditation for B.E. Computer Engineering', 'B.E. Computer Engineering programme received NBA accreditation for a period of 3 years from 2024-27, recognising academic quality and outcome-based education.',
   2024, 'Accreditation', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   '100% Placement Rate for CE Batch 2023-24', 'All 120 students of the B.E. Computer Engineering batch 2023-24 were placed in reputed companies with average package of 9.8 LPA.',
   2024, 'Placement', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   'Research Grant from DST - Energy-Efficient ML', 'Department secured Rs. 38 Lakh research grant from Department of Science & Technology for edge computing ML project.',
   2025, 'Research', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='information-technology'),
   'Best Paper Award at IEEE Conference 2024', 'Faculty paper on blockchain-based secure data sharing won Best Paper Award at IEEE International Conference on Information Technology 2024.',
   2024, 'Research', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='information-technology'),
   'Smart India Hackathon 2024 Winners', 'IT Department team won 1st prize at Smart India Hackathon 2024 (Software edition) for their AI-based crop disease detection system.',
   2024, 'Student Achievement', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'NBA Accreditation for B.E. Mechanical Engineering', 'B.E. Mechanical Engineering programme received NBA accreditation for 2024-27, continuing a tradition of sustained quality.',
   2024, 'Accreditation', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'DST Research Grant for EV Cooling Systems', 'Department secured Rs. 28 Lakh DST grant for research on hybrid cooling systems for electric vehicle battery packs.',
   2024, 'Research', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='civil-engineering'),
   'Consultation Project with NHAI', 'Civil Engineering department undertook structural audit and design consultation for National Highways Authority of India worth Rs. 12 Lakhs.',
   2024, 'Industry Collaboration', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='electrical-engineering'),
   'MHRD SPARC Project Grant', 'Electrical Engineering received SPARC (Scheme for Promotion of Academic Research and Collaboration) grant for smart grid research in collaboration with IIT Bombay.',
   2023, 'Research', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in')),

  ((SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   'Patent Granted for VLSI Architecture', 'Dr. Monika Verma and team received a patent grant from Indian Patent Office for a novel low-power VLSI architecture for IoT sensors.',
   2024, 'Research', 'PUBLISHED', (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'))

ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part K: Timetable (CE Sem 5 Section A)
-- =============================================================================
INSERT INTO timetables
  (department_id, course_id, section_id, semester, academic_year, title, is_active, created_by)
VALUES (
  (SELECT id FROM departments WHERE slug='computer-engineering'),
  (SELECT id FROM exam_courses WHERE course_code='BE-CE'),
  (SELECT id FROM exam_sections WHERE department_id=(SELECT id FROM departments WHERE slug='computer-engineering')
    AND course_id=(SELECT id FROM exam_courses WHERE course_code='BE-CE') AND section_name='A'),
  5, '2025-26', 'B.E. CE Sem 5 Section A â€” Timetable 2025-26', 1,
  (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
) ON DUPLICATE KEY UPDATE title=VALUES(title), is_active=VALUES(is_active);

SET @tt_id = (SELECT id FROM timetables WHERE title='B.E. CE Sem 5 Section A â€” Timetable 2025-26' LIMIT 1);

INSERT INTO timetable_entries
  (timetable_id, day_of_week, period_no, subject_label, faculty_user_id, room, start_time, end_time)
VALUES
  -- Monday
  (@tt_id,'Mon',1,'CE501 - Design & Analysis of Algorithms', (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),   'CE-301','08:00:00','08:55:00'),
  (@tt_id,'Mon',2,'CE502 - DBMS',                           (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'), 'CE-301','09:00:00','09:55:00'),
  (@tt_id,'Mon',3,'CE503 - Operating Systems',              (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),  'CE-301','10:00:00','10:55:00'),
  (@tt_id,'Mon',4,'CE504 - Computer Networks',              (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),'CE-301','11:00:00','11:55:00'),
  (@tt_id,'Mon',5,'CE501 Lab',                              (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),   'CE-Lab-1','12:00:00','13:55:00'),
  -- Tuesday
  (@tt_id,'Tue',1,'CE505 - Theory of Computation',          (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),'CE-301','08:00:00','08:55:00'),
  (@tt_id,'Tue',2,'CE506 - Artificial Intelligence',        (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),'CE-301','09:00:00','09:55:00'),
  (@tt_id,'Tue',3,'CE501 - Design & Analysis of Algorithms',(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),   'CE-301','10:00:00','10:55:00'),
  (@tt_id,'Tue',4,'CE503 - Operating Systems',              (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),  'CE-301','11:00:00','11:55:00'),
  (@tt_id,'Tue',5,'CE503 Lab',                              (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),  'CE-Lab-2','12:00:00','13:55:00'),
  -- Wednesday
  (@tt_id,'Wed',1,'CE502 - DBMS',                           (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CE-301','08:00:00','08:55:00'),
  (@tt_id,'Wed',2,'CE504 - Computer Networks',              (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),'CE-301','09:00:00','09:55:00'),
  (@tt_id,'Wed',3,'CE505 - Theory of Computation',          (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),'CE-301','10:00:00','10:55:00'),
  (@tt_id,'Wed',4,'CE506 - Artificial Intelligence',        (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),'CE-301','11:00:00','11:55:00'),
  (@tt_id,'Wed',5,'CE502 Lab',                              (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CE-Lab-3','12:00:00','13:55:00'),
  -- Thursday
  (@tt_id,'Thu',1,'CE501 - Design & Analysis of Algorithms',(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),   'CE-301','08:00:00','08:55:00'),
  (@tt_id,'Thu',2,'CE503 - Operating Systems',              (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),  'CE-301','09:00:00','09:55:00'),
  (@tt_id,'Thu',3,'CE502 - DBMS',                           (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CE-301','10:00:00','10:55:00'),
  (@tt_id,'Thu',4,'CE504 - Computer Networks',              (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),'CE-301','11:00:00','11:55:00'),
  (@tt_id,'Thu',5,'CE506 Lab',                              (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),'CE-Lab-1','12:00:00','13:55:00'),
  -- Friday
  (@tt_id,'Fri',1,'CE505 - Theory of Computation',          (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),'CE-301','08:00:00','08:55:00'),
  (@tt_id,'Fri',2,'CE506 - Artificial Intelligence',        (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),'CE-301','09:00:00','09:55:00'),
  (@tt_id,'Fri',3,'CE501 - Design & Analysis of Algorithms',(SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),   'CE-301','10:00:00','10:55:00'),
  (@tt_id,'Fri',4,'CE504 - Computer Networks',              (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),'CE-301','11:00:00','11:55:00'),
  (@tt_id,'Fri',5,'CE504 Lab',                              (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'),'CE-Lab-2','12:00:00','13:55:00'),
  -- Saturday
  (@tt_id,'Sat',1,'CE502 - DBMS',                           (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),'CE-301','08:00:00','08:55:00'),
  (@tt_id,'Sat',2,'CE505 - Theory of Computation',          (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'),'CE-301','09:00:00','09:55:00'),
  (@tt_id,'Sat',3,'Tutorial / Revision',                    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),   'CE-301','10:00:00','10:55:00'),
  (@tt_id,'Sat',4,'Self Study',                             NULL, 'Library','11:00:00','12:55:00')

ON DUPLICATE KEY UPDATE subject_label=VALUES(subject_label), room=VALUES(room);

-- =============================================================================
-- PHASE 2 SEED â€” Part L: Companies (from mockLeadingCompanies)
-- =============================================================================
INSERT INTO companies (name, sector, website, is_active) VALUES
  -- IT Services
  ('TCS',                  'IT',         'https://www.tcs.com',          1),
  ('Infosys',              'IT',         'https://www.infosys.com',       1),
  ('Wipro',                'IT',         'https://www.wipro.com',         1),
  ('Accenture',            'IT',         'https://www.accenture.com',     1),
  ('Cognizant',            'IT',         'https://www.cognizant.com',     1),
  ('HCL Technologies',     'IT',         'https://www.hcltech.com',       1),
  ('Tech Mahindra',        'IT',         'https://www.techmahindra.com',  1),
  ('Capgemini',            'IT',         'https://www.capgemini.com',     1),
  ('Mphasis',              'IT',         'https://www.mphasis.com',       1),
  ('Hexaware',             'IT',         'https://www.hexaware.com',      1),
  ('Zensar Technologies',  'IT',         'https://www.zensar.com',        1),
  ('Persistent Systems',   'IT',         'https://www.persistent.com',    1),
  -- Product / FAANG
  ('Amazon',               'Product',    'https://www.amazon.in',         1),
  ('Microsoft',            'Product',    'https://www.microsoft.com',     1),
  ('Google',               'Product',    'https://www.google.com',        1),
  ('Oracle',               'Product',    'https://www.oracle.com',        1),
  ('SAP',                  'Product',    'https://www.sap.com',           1),
  ('IBM',                  'Product',    'https://www.ibm.com',           1),
  ('Qualcomm',             'Product',    'https://www.qualcomm.com',      1),
  ('Texas Instruments',    'Product',    'https://www.ti.com',            1),
  -- Core Engineering
  ('L&T',                  'Core',       'https://www.larsentoubro.com',  1),
  ('BHEL',                 'Core',       'https://www.bhel.com',          1),
  ('Bosch',                'Core',       'https://www.bosch.in',          1),
  ('Siemens',              'Core',       'https://www.siemens.co.in',     1),
  ('ABB',                  'Core',       'https://new.abb.com/in',        1),
  ('Honeywell',            'Core',       'https://www.honeywell.com',     1),
  ('Emerson',              'Core',       'https://www.emerson.com',       1),
  ('Schneider Electric',   'Core',       'https://www.se.com/in',         1),
  ('Mahindra & Mahindra',  'Core',       'https://www.mahindra.com',      1),
  ('Bajaj Auto',           'Core',       'https://www.bajajauto.com',     1),
  ('Cummins India',        'Core',       'https://www.cumminsindia.com',  1),
  ('John Deere',           'Core',       'https://www.deere.com',         1),
  -- PSU
  ('NTPC',                 'PSU',        'https://www.ntpc.co.in',        1),
  ('ONGC',                 'PSU',        'https://www.ongcindia.com',     1),
  ('ISRO',                 'PSU',        'https://www.isro.gov.in',       1),
  ('DRDO',                 'PSU',        'https://www.drdo.gov.in',       1),
  ('BARC',                 'PSU',        'https://www.barc.gov.in',       1),
  ('HAL',                  'PSU',        'https://www.hal-india.co.in',   1),
  ('BEL',                  'PSU',        'https://www.bel-india.in',      1),
  ('GAIL',                 'PSU',        'https://www.gailonline.com',    1),
  ('IOCL',                 'PSU',        'https://iocl.com',              1),
  -- Consulting
  ('Deloitte',             'Consulting', 'https://www2.deloitte.com',     1),
  ('KPMG',                 'Consulting', 'https://home.kpmg/in',          1),
  ('PwC',                  'Consulting', 'https://www.pwc.in',            1),
  ('EY',                   'Consulting', 'https://www.ey.com/en_in',      1),
  ('ZS Associates',        'Consulting', 'https://www.zs.com',            1),
  ('Aon',                  'Consulting', 'https://www.aon.com',           1),
  -- Startups
  ('PhonePe',              'Startup',    'https://www.phonepe.com',       1),
  ('Razorpay',             'Startup',    'https://razorpay.com',          1),
  ('Flipkart',             'Startup',    'https://www.flipkart.com',      1),
  ('Zomato',               'Startup',    'https://www.zomato.com',        1),
  ('BrowserStack',         'Startup',    'https://www.browserstack.com',  1)
ON DUPLICATE KEY UPDATE sector=VALUES(sector), website=VALUES(website), is_active=VALUES(is_active);

-- =============================================================================
-- PHASE 2 SEED â€” Part M: Placement year stats (from mockPlacementRecords)
-- =============================================================================
INSERT INTO placement_year_stats
  (academic_year, total_students, students_placed, placement_pct, highest_package, average_package, companies_visited)
VALUES
  ('2023-24', 2100, 1820, 86.67, 45.00, 6.80, 245),
  ('2022-23', 2000, 1650, 82.50, 38.00, 5.90, 210),
  ('2021-22', 1900, 1540, 81.05, 32.00, 5.20, 190),
  ('2020-21', 1800, 1380, 76.67, 28.00, 4.80, 165),
  ('2019-20', 1700, 1290, 75.88, 22.00, 4.10, 148)
ON DUPLICATE KEY UPDATE
  students_placed=VALUES(students_placed), placement_pct=VALUES(placement_pct),
  highest_package=VALUES(highest_package), average_package=VALUES(average_package),
  companies_visited=VALUES(companies_visited);

-- =============================================================================
-- PHASE 2 SEED â€” Part N: Placement drives
-- =============================================================================
INSERT INTO placement_drives
  (company_id, title, job_title, ctc_lpa, eligibility, drive_date, registration_deadline, is_active, created_by)
VALUES
  ((SELECT id FROM companies WHERE name='TCS'),
   'TCS National Qualifier Test 2025-26',
   'System Engineer', 3.36,
   'B.E./B.Tech all branches, 60% throughout, 2024/2025 batch',
   '2025-09-15', '2025-09-10', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Infosys'),
   'Infosys On-Campus Drive 2025',
   'Systems Engineer', 3.60,
   'B.E./B.Tech all branches, 65% throughout, 2025 batch',
   '2025-10-02', '2025-09-28', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Wipro'),
   'Wipro NLTH 2025-26',
   'Project Engineer', 3.50,
   'B.E./B.Tech all branches, 60% throughout, backlogs not allowed',
   '2025-10-14', '2025-10-10', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Accenture'),
   'Accenture Campus Hiring 2025',
   'Associate Software Engineer', 4.50,
   'B.E./B.Tech CS/IT/EC, 65% throughout, 2025 batch',
   '2025-10-28', '2025-10-22', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Capgemini'),
   'Capgemini Fresher Drive 2025',
   'Analyst', 3.80,
   'B.E./B.Tech all branches, 60% throughout',
   '2025-11-05', '2025-11-01', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='L&T'),
   'L&T Engineering On-Campus Drive 2025',
   'Graduate Engineer Trainee', 5.50,
   'B.E./B.Tech Mechanical/Civil/Electrical/EC, 65%, GATE qualified preferred',
   '2025-11-20', '2025-11-15', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Oracle'),
   'Oracle India Campus Drive 2025',
   'Applications Engineer', 12.00,
   'B.E./B.Tech CS/IT, 70% throughout, 2025 batch',
   '2025-12-08', '2025-12-03', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Deloitte'),
   'Deloitte USI Campus Drive 2025',
   'Analyst â€“ Technology Consulting', 7.50,
   'B.E./B.Tech CS/IT, 70% throughout, no backlogs',
   '2025-12-15', '2025-12-10', 1,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'))

ON DUPLICATE KEY UPDATE title=VALUES(title), ctc_lpa=VALUES(ctc_lpa), is_active=VALUES(is_active);

-- =============================================================================
-- PHASE 2 SEED â€” Part O: Internships
-- =============================================================================
INSERT INTO internships
  (company_id, student_enrollment_no, student_name, title, duration_months, stipend,
   start_date, end_date, status, created_by)
VALUES
  ((SELECT id FROM companies WHERE name='TCS'),
   '0801CE221001','Aryan Gupta','Software Development Intern',
   2, 10000.00, '2025-05-15', '2025-07-14', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Infosys'),
   '0801CE221002','Priya Sharma','Data Analytics Intern',
   2, 12000.00, '2025-05-20', '2025-07-19', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Microsoft'),
   '0801CE221003','Rahul Verma','Cloud Solutions Intern',
   2, 25000.00, '2025-06-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Wipro'),
   '0801IT221001','Sneha Patel','QA & Testing Intern',
   2, 8000.00, '2025-05-15', '2025-07-14', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='L&T'),
   '0801ME221001','Suraj Yadav','Mechanical Design Intern',
   3, 12000.00, '2025-05-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Bosch'),
   '0801ME221002','Ankit Singh','Automotive Engineering Intern',
   3, 15000.00, '2025-05-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='NTPC'),
   '0801EE221001','Kavita Rathore','Power Systems Intern',
   2, 10000.00, '2025-06-01', '2025-07-31', 'completed',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ((SELECT id FROM companies WHERE name='Qualcomm'),
   '0801EC221001','Meenal Joshi','Embedded Systems Intern',
   2, 20000.00, '2025-06-15', '2025-08-14', 'ongoing',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'))

ON DUPLICATE KEY UPDATE title=VALUES(title), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part P: Gallery albums
-- =============================================================================
INSERT INTO gallery_albums (title, slug, description, department_id, event_date, status, created_by)
VALUES
  ('Annual Convocation 2025',        'convocation-2025',
   'Photographs from the Annual Convocation ceremony 2025 â€” degree conferral, chief guests, and student celebrations.',
   NULL, '2025-04-15', 'ACTIVE', (SELECT id FROM users WHERE email='admin@college.edu')),

  ('TechNova 2025 â€” Annual Tech Fest','technova-2025',
   'Highlights from TechNova 2025, SGSITS annual technical festival featuring competitions, workshops, and cultural events.',
   NULL, '2025-02-14', 'ACTIVE', (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Annual Sports Meet 2025',         'sports-meet-2025',
   'Action shots and highlights from the SGSITS Annual Sports Meet 2025 â€” athletics, team sports, and prize distribution.',
   NULL, '2025-01-25', 'ACTIVE', (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Campus Infrastructure & Labs',    'campus-infrastructure',
   'A photographic tour of the SGSITS campus â€” academic blocks, state-of-the-art laboratories, library, and facilities.',
   NULL, NULL, 'ACTIVE', (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Independence Day 2025',           'independence-day-2025',
   'Celebration of India''s 79th Independence Day at SGSITS â€” flag hoisting, cultural performances, and march past.',
   NULL, '2025-08-15', 'ACTIVE', (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Industry Visit â€” TCS Pune 2025',  'industry-visit-tcs-2025',
   'Industry visit photographs of final year students visiting TCS Pune facility â€” factory tour, networking, and orientation.',
   (SELECT id FROM departments WHERE slug='computer-engineering'), '2025-03-18', 'ACTIVE',
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'))
ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

-- Link existing gallery items to albums
UPDATE gallery SET album_id=(SELECT id FROM gallery_albums WHERE slug='technova-2025')
  WHERE title LIKE '%TechNova%' OR title LIKE '%technova%';

UPDATE gallery SET album_id=(SELECT id FROM gallery_albums WHERE slug='sports-meet-2025')
  WHERE title LIKE '%Sports%' OR title LIKE '%Annual Meet%';

UPDATE gallery SET album_id=(SELECT id FROM gallery_albums WHERE slug='convocation-2025')
  WHERE title LIKE '%Convocation%';

-- =============================================================================
-- PHASE 2 SEED â€” Part Q: Update navigation items (full nav from navItems.ts)
-- =============================================================================

-- Delete old navigation and rebuild from actual frontend navItems.ts
DELETE FROM navigation_items;

INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (NULL,'Home',       '/',             1,'_self',1),
  (NULL,'About Us',   NULL,            2,'_self',1),
  (NULL,'Academics',  NULL,            3,'_self',1),
  (NULL,'Departments','/departments',  4,'_self',1),
  (NULL,'Admissions', NULL,            5,'_self',1),
  (NULL,'Placements', NULL,            6,'_self',1),
  (NULL,'Campus Life',NULL,            7,'_self',1),
  (NULL,'Facilities', NULL,            8,'_self',1),
  (NULL,'More',       NULL,            9,'_self',1);

-- About Us children
SET @about_id = (SELECT id FROM navigation_items WHERE label='About Us' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@about_id,'About Institute',         '/about/institute',          1,'_self',1),
  (@about_id,'Vision & Mission',        '/about/vision-mission',     2,'_self',1),
  (@about_id,'Director''s Message',     '/about/director-message',   3,'_self',1),
  (@about_id,'Governing Body',          '/about/governing-body',     4,'_self',1),
  (@about_id,'Administration',          '/about/administration',     5,'_self',1),
  (@about_id,'Administrative Committees','/about/committees',        6,'_self',1),
  (@about_id,'Telephone Directory',     '/about/telephone-directory',7,'_self',1),
  (@about_id,'Infrastructure',          '/about/infrastructure',     8,'_self',1),
  (@about_id,'IQAC Cell',               '/about/iqac',               9,'_self',1),
  (@about_id,'Academic Council',        '/about/academic-council',  10,'_self',1),
  (@about_id,'Accreditation (NBA/NAAC)','/about/accreditation',     11,'_self',1);

-- Academics children
SET @acad_id = (SELECT id FROM navigation_items WHERE label='Academics' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@acad_id,'Academic Calendar',       '/academics/calendar',          1,'_self',1),
  (@acad_id,'UG Courses',              '/academics/courses/ug',        2,'_self',1),
  (@acad_id,'PG Courses',              '/academics/courses/pg',        3,'_self',1),
  (@acad_id,'Ph.D. Programs',          '/academics/courses/phd',       4,'_self',1),
  (@acad_id,'PTDC Courses',            '/academics/courses/ptdc',      5,'_self',1),
  (@acad_id,'Online Courses (MOOC)',   '/academics/courses/online',    6,'_self',1),
  (@acad_id,'First Year Info',         '/academics/first-year',        7,'_self',1),
  (@acad_id,'Exam & Results',          '/academics/exam-results',      8,'_self',1),
  (@acad_id,'Ordinances',              '/academics/ordinances',        9,'_self',1),
  (@acad_id,'Plagiarism Policy',       '/academics/plagiarism-policy',10,'_self',1),
  (@acad_id,'Code of Ethics',          '/academics/code-of-conduct',  11,'_self',1),
  (@acad_id,'OBE & NEP 2020',          '/academics/obe-nep-2020',     12,'_self',1);

-- Departments children (all 17 from navItems.ts)
SET @dept_id = (SELECT id FROM navigation_items WHERE label='Departments' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@dept_id,'All Departments',              '/departments',                                1,'_self',1),
  (@dept_id,'Applied Chemistry',            '/departments/applied-chemistry',             2,'_self',1),
  (@dept_id,'Applied Mathematics',          '/departments/applied-mathematics',           3,'_self',1),
  (@dept_id,'Applied Physics',              '/departments/applied-physics',               4,'_self',1),
  (@dept_id,'Biomedical Engineering',       '/departments/biomedical-engineering',        5,'_self',1),
  (@dept_id,'Civil Engineering',            '/departments/civil-engineering',             6,'_self',1),
  (@dept_id,'Computer Engineering',         '/departments/computer-engineering',          7,'_self',1),
  (@dept_id,'Computer Tech & Apps (CTA)',   '/departments/computer-technology',           8,'_self',1),
  (@dept_id,'Electrical Engineering',       '/departments/electrical-engineering',        9,'_self',1),
  (@dept_id,'Electronics & Instrumentation','/departments/electronics-instrumentation',  10,'_self',1),
  (@dept_id,'Electronics & Telecomm',       '/departments/electronics-telecommunication',11,'_self',1),
  (@dept_id,'Humanities & Social Sciences', '/departments/humanities',                   12,'_self',1),
  (@dept_id,'Industrial & Production',      '/departments/industrial-production',        13,'_self',1),
  (@dept_id,'Information Technology',       '/departments/information-technology',       14,'_self',1),
  (@dept_id,'Management Studies (MBA)',     '/departments/management-studies',           15,'_self',1),
  (@dept_id,'Mechanical Engineering',       '/departments/mechanical-engineering',       16,'_self',1),
  (@dept_id,'Pharmacy',                     '/departments/pharmacy',                     17,'_self',1),
  (@dept_id,'Centre of Excellence (CoE)',   '/departments/coebg',                        18,'_self',1);

-- Admissions children
SET @adm_id = (SELECT id FROM navigation_items WHERE label='Admissions' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@adm_id,'UG Admissions',        '/admission/ug',          1,'_self',1),
  (@adm_id,'PG Admissions',        '/admission/pg',          2,'_self',1),
  (@adm_id,'PhD Admissions',       '/admission/phd',         3,'_self',1),
  (@adm_id,'Prospectus Download',  '/admission/prospectus',  4,'_self',1);

-- Placements children
SET @place_id = (SELECT id FROM navigation_items WHERE label='Placements' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@place_id,'T&P Cell Overview', '/placement/tnp-cell', 1,'_self',1),
  (@place_id,'Leading Recruiters','/placement/companies', 2,'_self',1),
  (@place_id,'Placement Record',  '/placement/record',   3,'_self',1),
  (@place_id,'Placement Contacts','/placement/contact',  4,'_self',1);

-- Campus Life children
SET @campus_id = (SELECT id FROM navigation_items WHERE label='Campus Life' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@campus_id,'Student Activities',    '/students/activities',           1,'_self',1),
  (@campus_id,'Govt. Scholarships',    '/students/scholarship/govt',     2,'_self',1),
  (@campus_id,'Institute Scholarships','/students/scholarship/institute',3,'_self',1),
  (@campus_id,'Sports & Games (SSS)', '/students/sss',                  4,'_self',1),
  (@campus_id,'NCC Wing',              '/students/ncc',                  5,'_self',1),
  (@campus_id,'NSS Wing',              '/students/nss',                  6,'_self',1);

-- Facilities children
SET @fac_id = (SELECT id FROM navigation_items WHERE label='Facilities' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@fac_id,'Computer Center',  '/facilities/computer-center',  1,'_self',1),
  (@fac_id,'Central Library',  '/facilities/library',          2,'_self',1),
  (@fac_id,'Central Workshop', '/facilities/workshop',         3,'_self',1),
  (@fac_id,'Gymnasium',        '/facilities/gymnasium',        4,'_self',1),
  (@fac_id,'Dispensary',       '/facilities/dispensary',       5,'_self',1),
  (@fac_id,'CIDI Center',      '/facilities/cidi',             6,'_self',1),
  (@fac_id,'Sports Complex',   '/facilities/sports',           7,'_self',1),
  (@fac_id,'Boys Hostel',      '/facilities/hostel/boys',      8,'_self',1),
  (@fac_id,'Girls Hostel',     '/facilities/hostel/girls',     9,'_self',1),
  (@fac_id,'Transit Hostel',   '/facilities/hostel/transit',  10,'_self',1),
  (@fac_id,'Staff Quarters',   '/facilities/hostel/staff',    11,'_self',1),
  (@fac_id,'AICTE IDEA Lab',   '/facilities/idea-lab',        12,'_self',1);

-- More children
SET @more_id = (SELECT id FROM navigation_items WHERE label='More' AND parent_id IS NULL LIMIT 1);
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active) VALUES
  (@more_id,'Startup & Incubation Cell','/startup-cell',   1,'_self',1),
  (@more_id,'TEQIP Portal',             '/teqip/about',    2,'_self',1),
  (@more_id,'Latest Notices',           '/notices',        3,'_self',1),
  (@more_id,'Campus News',              '/news',           4,'_self',1),
  (@more_id,'Upcoming Events',          '/events',         5,'_self',1),
  (@more_id,'Procurement Tenders',      '/tenders',        6,'_self',1),
  (@more_id,'Contact Us',               '/contact',        7,'_self',1),
  (@more_id,'Photo Gallery',            '/explore/gallery',8,'_self',1);

-- =============================================================================
-- PHASE 2 SEED â€” Part R: SEO metadata for all major pages
-- =============================================================================
INSERT INTO seo_metadata
  (page_key, title, description, og_title, og_description, canonical, robots, updated_by)
VALUES
  ('home',
   'SGSITS Indore â€” Shri G.S. Institute of Technology & Science | An Institute of National Standing',
   'SGSITS Indore is a premier autonomous engineering institution offering B.Tech, M.Tech, MBA, MCA and PhD programs. NAAC Accredited, NBA Accredited. Established 1952.',
   'SGSITS Indore â€” Engineering Excellence since 1952',
   'Explore B.Tech, M.Tech, MCA, MBA programmes at SGSITS Indore. An Institute of National Standing with 70+ years of excellence.',
   'https://www.sgsits.ac.in/', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about',
   'About SGSITS Indore | History, Vision, Mission | Premier Engineering Institute MP',
   'About Shri G.S. Institute of Technology & Science Indore â€” established 1952. RGPV affiliated, AICTE approved, NAAC accredited autonomous institute in Madhya Pradesh.',
   'About SGSITS Indore â€” 70+ Years of Excellence',
   'Learn about SGSITS Indore â€” established 1952, NAAC A Grade, 20 departments, 600+ faculty, premier autonomous engineering institute.',
   'https://www.sgsits.ac.in/about/institute', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('departments',
   'Departments â€” SGSITS Indore | Computer, IT, Mechanical, Civil, EE, EC and more',
   'Explore all 20 engineering departments at SGSITS Indore â€” Computer Engineering, IT, Mechanical, Civil, Electrical, Electronics, Pharmacy, MBA, MCA and more.',
   'Departments at SGSITS Indore',
   '20 departments offering B.Tech, M.Tech, MCA, MBA, PhD with experienced faculty and modern labs.',
   'https://www.sgsits.ac.in/departments', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('dept_ce',
   'Computer Engineering Department â€” SGSITS Indore | B.Tech, M.Tech CSE',
   'Computer Engineering Department at SGSITS Indore â€” B.Tech and M.Tech programmes. Expert faculty in AI/ML, networking, security. State-of-the-art labs. NBA Accredited.',
   'Computer Engineering â€” SGSITS Indore',
   'B.Tech Computer Engineering at SGSITS â€” AI/ML lab, networking lab, 22+ faculty, NBA accredited.',
   'https://www.sgsits.ac.in/departments/computer-engineering', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('dept_it',
   'Information Technology Department â€” SGSITS Indore | B.Tech IT',
   'Information Technology Department at SGSITS Indore â€” B.Tech programme. Expert faculty in cloud computing, cybersecurity, data science. Modern IT labs.',
   'Information Technology â€” SGSITS Indore',
   'B.Tech Information Technology at SGSITS â€” IoT lab, cloud computing, 14+ faculty.',
   'https://www.sgsits.ac.in/departments/information-technology', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_ug',
   'UG Admission 2025-26 â€” SGSITS Indore | B.Tech Programmes | JEE Main',
   'B.Tech Admission 2025-26 at SGSITS Indore. Branches: Computer Engg., IT, Mechanical, Civil, EE, EC, Biomedical, Industrial. JEE Main based MPDTE counselling.',
   'B.Tech Admission 2025-26 â€” SGSITS Indore',
   'Apply for B.Tech admission 2025-26 at SGSITS Indore. JEE Main qualified, MPDTE counselling.',
   'https://www.sgsits.ac.in/admission/ug', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_pg',
   'PG Admission 2025-26 â€” SGSITS Indore | M.Tech, MBA, MCA',
   'PG Admission 2025-26 at SGSITS Indore â€” M.Tech (GATE), MBA (CAT/MAT), MCA (MP MCA CET). Apply now.',
   'PG Admission 2025-26 â€” SGSITS Indore',
   'M.Tech, MBA, MCA admissions at SGSITS Indore 2025-26. GATE/CAT/MCA CET based.',
   'https://www.sgsits.ac.in/admission/pg', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('placements',
   'Placements â€” SGSITS Indore | 1820 Students Placed | TCS Infosys Microsoft Oracle',
   'SGSITS Indore Placements 2023-24 â€” 1820 students placed, highest package 45 LPA, 245+ companies. Microsoft, Oracle, TCS, Infosys campus recruiters.',
   'SGSITS Placements â€” 1820 Students Placed 2023-24',
   '1820 students placed in 2023-24 at SGSITS Indore. Highest package 45 LPA. Top recruiters include Microsoft, Oracle, TCS, Infosys.',
   'https://www.sgsits.ac.in/placement/tnp-cell', 'index,follow',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('notices',
   'Notices â€” SGSITS Indore | Exam, Admission, Placement Notices',
   'Latest notices from SGSITS Indore â€” exam date sheets, admission circulars, placement schedules, hostel allotment notices.',
   'Notices â€” SGSITS Indore',
   'Official notices from SGSITS Indore including exam timetables, results, admission and placement updates.',
   'https://www.sgsits.ac.in/notices', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('events',
   'Events â€” SGSITS Indore | Technical Fest, Cultural Events, Sports Meet',
   'Upcoming and past events at SGSITS Indore â€” TechNova technical festival, cultural programs, annual sports meet, seminars, and workshops.',
   'Events at SGSITS Indore',
   'Events calendar for SGSITS Indore â€” technical fest, cultural events, sports meet, and academic seminars.',
   'https://www.sgsits.ac.in/events', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('gallery',
   'Photo Gallery â€” SGSITS Indore | Campus, Events, Sports, Convocation',
   'Photo gallery of SGSITS Indore â€” campus infrastructure, annual convocation, TechNova tech fest, sports meet, and lab visits.',
   'SGSITS Indore Photo Gallery',
   'Explore SGSITS Indore through photos â€” campus, events, sports, convocation, and lab activities.',
   'https://www.sgsits.ac.in/explore/gallery', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('contact',
   'Contact SGSITS Indore | Address, Phone, Email | Park Road, Indore',
   'Contact Shri G.S. Institute of Technology & Science, Indore. Address: 23 Park Road, Indore 452003 MP. Phone: 0731-2582100.',
   'Contact SGSITS Indore',
   'Get in touch with SGSITS Indore â€” admissions, examinations, placements, general enquiry.',
   'https://www.sgsits.ac.in/contact', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('facilities',
   'Facilities â€” SGSITS Indore | Library, Hostel, Sports, Computer Center, IDEA Lab',
   'World-class facilities at SGSITS Indore â€” 50,000+ book library, boys/girls hostels, sports complex, computer center, AICTE IDEA Lab, gymnasium.',
   'Campus Facilities â€” SGSITS Indore',
   'SGSITS Indore campus facilities â€” library with 50,000 books, 800+ bed hostel, sports complex, computer center, IDEA Lab.',
   'https://www.sgsits.ac.in/facilities/library', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('news',
   'Campus News â€” SGSITS Indore | Research, Achievements, Events',
   'Latest campus news from SGSITS Indore â€” research achievements, student awards, faculty publications, industry collaborations.',
   'SGSITS Indore Campus News',
   'Stay updated with the latest from SGSITS Indore â€” research breakthroughs, student achievements, and academic excellence.',
   'https://www.sgsits.ac.in/news', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('tenders',
   'Tenders â€” SGSITS Indore | Procurement Notices',
   'Official tender notices from SGSITS Indore for laboratory equipment, civil works, AMC, and other procurement.',
   'Tenders â€” SGSITS Indore',
   'SGSITS Indore procurement tenders for lab equipment, civil works, and annual maintenance contracts.',
   'https://www.sgsits.ac.in/tenders', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu'))

ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description),
  og_title=VALUES(og_title), canonical=VALUES(canonical), updated_by=VALUES(updated_by);

-- =============================================================================
-- PHASE 2 SEED â€” Part S: Chatbot config + responses (proper tables)
-- =============================================================================
INSERT INTO chatbot_config
  (id, bot_name, welcome_message, input_placeholder, fallback_message, is_active)
VALUES (
  1,
  'SGSITS Assistant',
  'Hello! I''m the **SGSITS Virtual Assistant**.\n\nI can help you with:\nâ€¢ Admissions & Eligibility\nâ€¢ Courses & Departments\nâ€¢ Fee Structure & Scholarships\nâ€¢ Placements & Recruiters\nâ€¢ Hostel & Campus Life\nâ€¢ Contact & Location\n\nWhat would you like to know?',
  'Ask about admissions, fees, placements...',
  'I''m not sure about that. I can help with:\nâ€¢ Admissions & Eligibility\nâ€¢ Fee Structure\nâ€¢ Departments & Courses\nâ€¢ Placements\nâ€¢ Hostel & Campus Life\nâ€¢ Contact Information\n\nTry asking about any of these topics!',
  1
) ON DUPLICATE KEY UPDATE
  bot_name=VALUES(bot_name), welcome_message=VALUES(welcome_message),
  input_placeholder=VALUES(input_placeholder), fallback_message=VALUES(fallback_message),
  is_active=VALUES(is_active);

-- Delete and re-insert chatbot responses with actual content from mock
DELETE FROM chatbot_responses;

INSERT INTO chatbot_responses (category, keywords, reply, display_order, is_active)
VALUES
  ('Admissions',
   'admission,apply,application,eligibility,jee,entrance,btech,b.tech,how to apply',
   'Admissions at SGSITS are conducted through JEE Main (for B.Tech) and state-level counselling (MPDTE). Key points:\nâ€¢ B.Tech: JEE Main + MPDTE counselling\nâ€¢ M.Tech / MBA / MCA: GATE / CAT / MAT / MP PET\nâ€¢ Ph.D: Departmental entrance test\n\nVisit /admission/ug for the latest schedule or call 0731-2582101.',
   1, 1),

  ('Fee Structure',
   'fee,fees,tuition,cost,scholarship,fee structure,how much',
   'Fee Structure 2025-26:\nâ€¢ B.Tech (General): As per FRC norms (approx. Rs. 79,500/year)\nâ€¢ M.Tech: Approx. Rs. 53,000/year\nâ€¢ MBA: Approx. Rs. 68,000/year\n\nScholarships available:\nâ€¢ Government post-matric scholarships (SC/ST/OBC)\nâ€¢ Institute merit scholarships\nâ€¢ GATE fellowship for M.Tech\n\nVisit /admission/ug or contact admission@sgsits.ac.in.',
   2, 1),

  ('Departments',
   'department,branch,courses,program,cse,it,civil,mechanical,electrical,ec',
   'Departments at SGSITS (20 departments):\nâ€¢ Computer Engineering\nâ€¢ Information Technology\nâ€¢ Civil Engineering\nâ€¢ Mechanical Engineering\nâ€¢ Electrical Engineering\nâ€¢ Electronics & Instrumentation\nâ€¢ Electronics & Telecommunication\nâ€¢ Industrial & Production Engineering\nâ€¢ Applied Chemistry, Mathematics, Physics\nâ€¢ Biomedical Engineering\nâ€¢ Pharmacy, MBA, MCA and more\n\nVisit /departments for details on each department.',
   3, 1),

  ('Placements',
   'placement,job,recruit,package,company,campus,salary,lpa,placed',
   'Placements at SGSITS 2023-24:\nâ€¢ Students Placed: 1820 (86.67% rate)\nâ€¢ Highest Package: Rs. 45 LPA (Microsoft)\nâ€¢ Average Package: Rs. 6.80 LPA\nâ€¢ Companies Visited: 245+\n\nTop Recruiters: TCS, Infosys, Wipro, Microsoft, Amazon, L&T, Oracle, Deloitte\n\nContact T&P Cell: tpo@sgsits.ac.in | 0731-2582150',
   4, 1),

  ('Hostel',
   'hostel,accommodation,stay,pg,room,boys hostel,girls hostel',
   'Hostel Facilities at SGSITS:\nâ€¢ Boys Hostel: 4 blocks, 800+ capacity, mess facility\nâ€¢ Girls Hostel: 2 blocks, 400+ capacity, separate warden\nâ€¢ 24/7 security and Wi-Fi connectivity\nâ€¢ Mess with nutritious meals (breakfast, lunch, dinner)\nâ€¢ Recreation rooms and sports facilities\n\nApply through Chief Warden''s office: chiefwarden@sgsits.ac.in | 0731-2582800',
   5, 1),

  ('Contact',
   'contact,phone,email,address,location,how to reach,where,map',
   'Contact SGSITS:\nâ€¢ Address: 23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. â€“ 452003\nâ€¢ Phone: +91-731-2582100, 2582124\nâ€¢ Email: registrar@sgsits.ac.in\nâ€¢ Website: www.sgsits.ac.in\nâ€¢ Timings: Monâ€“Sat, 10:00 AM â€“ 5:00 PM',
   6, 1),

  ('Rankings & Accreditation',
   'naac,rank,rating,accreditation,nirf,nba,rank,graded',
   'Rankings & Accreditation:\nâ€¢ NAAC Accredited â€” Grade A\nâ€¢ NBA Accredited: B.Tech CE, IT, Mechanical\nâ€¢ NIRF Ranking: Consistent presence in top engineering institutes list\nâ€¢ Autonomous Institute under RGPV, Bhopal\nâ€¢ Recognised as an Institute of National Standing\n\nFor latest details visit /about/accreditation.',
   7, 1),

  ('Library',
   'library,books,journals,e-library,digital library,ieee,research',
   'Central Library at SGSITS:\nâ€¢ 50,000+ books and reference volumes\nâ€¢ 10,000+ e-journals\nâ€¢ Access to IEEE Xplore, Elsevier, Springer, DELNET, NPTEL\nâ€¢ Digital library with 6 e-resources\nâ€¢ Timings: Monâ€“Sat: 8:00 AM â€“ 9:00 PM\n\nContact: library@sgsits.ac.in | 0731-2582700',
   8, 1),

  ('Exam & Results',
   'exam,examination,result,marks,timetable,date sheet,admit card,hall ticket',
   'Examination Information:\nâ€¢ Exam Date Sheet: Available at /notices (EXAM category)\nâ€¢ Admit Card: Download from student portal 2 weeks before exam\nâ€¢ Results: Declared on exam portal after result processing\n\nFor exam queries contact:\nExam Controller: coe@sgsits.ac.in | 0731-2582106',
   9, 1),

  ('Greeting',
   'hello,hi,hey,namaste,good morning,good evening',
   'Hello! I''m the SGSITS Virtual Assistant.\n\nI can help you with:\nâ€¢ Admissions & Eligibility\nâ€¢ Courses & Departments\nâ€¢ Fee Structure & Scholarships\nâ€¢ Placements & Recruiters\nâ€¢ Hostel & Campus Life\nâ€¢ Contact & Location\n\nWhat would you like to know?',
   10, 1),

  ('Farewell',
   'thank,thanks,bye,goodbye,ok thanks,thank you',
   'You''re welcome! Feel free to ask anything else about SGSITS. Have a great day!',
   11, 1);

-- =============================================================================
-- PHASE 2 SEED â€” Part T: Update CMS sections with REAL data from mock files
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES

  ('home_hero', JSON_OBJECT(
    'instituteName', 'Shri G. S. Institute of Technology & Science',
    'welcomeText',   'Welcome To SGSITS',
    'accentText',    'Indore',
    'slides', JSON_ARRAY(
      JSON_OBJECT('id',1,'imageUrl','/hero/slide1.jpeg','imagePosition','center 28%','enabled',JSON_VALUE('true',   '$'),'order',1),
      JSON_OBJECT('id',2,'imageUrl','/hero/slide2.jpeg','imagePosition','center center','enabled',JSON_VALUE('true', '$'),'order',2),
      JSON_OBJECT('id',3,'imageUrl','/hero/slide3.jpeg','imagePosition','center 30%','enabled',JSON_VALUE('true',   '$'),'order',3),
      JSON_OBJECT('id',4,'imageUrl','/hero/slide4.jpeg','imagePosition','center center','enabled',JSON_VALUE('true', '$'),'order',4),
      JSON_OBJECT('id',5,'imageUrl','/hero/slide5.jpeg','imagePosition','center 35%','enabled',JSON_VALUE('true',   '$'),'order',5)
    ),
    'tiles', JSON_ARRAY(
      JSON_OBJECT('id',1,'title','Research',        'subtitle','Mapping the Innovations',        'iconName','FlaskConical','dark',0,'path','/about/iqac','enabled',1,'order',1),
      JSON_OBJECT('id',2,'title','Startups',        'subtitle','Success stories of researchers', 'iconName','Rocket',      'dark',1,'path','/startup-cell','enabled',1,'order',2),
      JSON_OBJECT('id',3,'title','News',            'subtitle','Panorama of Events',             'iconName','Newspaper',   'dark',0,'path','/news','enabled',1,'order',3),
      JSON_OBJECT('id',4,'title','SGSITS Outreach', 'subtitle','Innovate. Inspire. Transform.',  'iconName','Landmark',    'dark',1,'path','/about/institute','enabled',1,'order',4)
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_about', JSON_OBJECT(
    'label',          'Introduction',
    'heading',        'ABOUT',
    'accentText',     'SGSITS INDORE',
    'body',           'Shri G. S. Institute of Technology & Science (SGSITS) is one of the premier technical institutions created to be Centres of Excellence for training, research and development in science, engineering and technology in India. Established as College of Engineering in 1952, the Institute was later declared an autonomous Institution of National standing, with powers to decide its own academic policy, conduct its own examinations, and award its own degrees.',
    'primaryButton',  JSON_OBJECT('label','Read More','to','/about/institute'),
    'secondaryButton',JSON_OBJECT('label','Notices','to','/notices')
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_director', JSON_OBJECT(
    'label',        'Leadership Message',
    'heading',      'DIRECTOR''S',
    'accentText',   'CORNER',
    'name',         'Prof. Neetesh Purohit',
    'photo',        '/director.jpeg',
    'bio',          'Prof. Neetesh Purohit has taken over charge as Director, SGSITS Indore with effect from the forenoon of 15th February, 2024. Under his leadership the institute continues to scale new heights in research, placements and academic excellence.',
    'readMoreLabel','Read Message',
    'readMoreTo',   '/about/director-message'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_announcements', JSON_OBJECT(
    'items', JSON_ARRAY(
      JSON_OBJECT('id','ann1','title','Information Bulletin regarding B.Tech Admissions 2025-26','date','New','isNew',1,'to','/notices'),
      JSON_OBJECT('id','ann2','title','Result of MBA (Financial Administration) II Sem Examination','date','May 10, 2025','isNew',0,'to','/notices'),
      JSON_OBJECT('id','ann3','title','Revised Academic Calendar for UG & PG classes 2024-25','date','May 08, 2025','isNew',0,'to','/notices'),
      JSON_OBJECT('id','ann4','title','Schedule of Internal Assessment Tests (Even Semester)','date','May 02, 2025','isNew',0,'to','/notices'),
      JSON_OBJECT('id','ann5','title','Instruction for students regarding uniform and general discipline','date','Apr 28, 2025','isNew',0,'to','/notices'),
      JSON_OBJECT('id','ann6','title','Tender notice for laboratory equipment procurement','date','Apr 20, 2025','isNew',0,'to','/notices'),
      JSON_OBJECT('id','ann7','title','Notice regarding hostel fee payment deadlines for current students','date','Apr 15, 2025','isNew',0,'to','/notices')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_stats', JSON_OBJECT(
    'backgroundImage', '/assets/campus.jpg',
    'items', JSON_ARRAY(
      JSON_OBJECT('val','10,000+','label','Students'),
      JSON_OBJECT('val','600+',  'label','Faculty'),
      JSON_OBJECT('val','700+',  'label','Staff'),
      JSON_OBJECT('val','70+',   'label','Years of Excellence')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_academics', JSON_OBJECT(
    'label',       'Academics',
    'heading',     'ACADEMIC',
    'accentText',  'PROGRAMS',
    'description', 'Rigorous, comprehensive, and outcome-oriented educational journeys designed to cultivate leaders.',
    'programs', JSON_ARRAY(
      JSON_OBJECT('id','prog-ug', 'iconName','BookOpen',       'title','Undergraduate Programs', 'description','Four-year B.Tech and B.Pharm degrees built on core engineering principles, practical lab exposure, and direct industry research.','to','/academics/courses/ug','ctaLabel','Explore UG Degrees'),
      JSON_OBJECT('id','prog-pg', 'iconName','GraduationCap',  'title','Postgraduate Programs',  'description','M.Tech, MBA, and MCA programs designed for deeper industrial expertise, technical leadership, and practical analytical mastery.','to','/academics/courses/pg','ctaLabel','Explore PG Degrees'),
      JSON_OBJECT('id','prog-phd','iconName','Microscope',     'title','Doctoral & Research',    'description','Rigorous Ph.D. programs across technical sciences supported by advanced laboratories and government grants.','to','/academics/courses/phd','ctaLabel','Explore Research Paths')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_departments', JSON_OBJECT(
    'label',      'Departments & Schools',
    'heading',    'ACADEMIC',
    'accentText', 'DEPARTMENTS',
    'showAllLink','/departments',
    'items', JSON_ARRAY(
      JSON_OBJECT('name','Computer Engineering',          'slug','computer-engineering'),
      JSON_OBJECT('name','Information Technology',        'slug','information-technology'),
      JSON_OBJECT('name','Civil Engineering',             'slug','civil-engineering'),
      JSON_OBJECT('name','Mechanical Engineering',        'slug','mechanical-engineering'),
      JSON_OBJECT('name','Electrical Engineering',        'slug','electrical-engineering'),
      JSON_OBJECT('name','Electronics & Instrumentation', 'slug','electronics-instrumentation'),
      JSON_OBJECT('name','Electronics & Telecomm.',       'slug','electronics-telecommunication'),
      JSON_OBJECT('name','Industrial & Production',       'slug','industrial-production'),
      JSON_OBJECT('name','Applied Physics',               'slug','applied-physics'),
      JSON_OBJECT('name','Applied Chemistry',             'slug','applied-chemistry'),
      JSON_OBJECT('name','Applied Mathematics',           'slug','applied-mathematics'),
      JSON_OBJECT('name','Pharmacy',                      'slug','pharmacy')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_campus_life', JSON_OBJECT(
    'label',       'Student Experience',
    'heading',     'CAMPUS',
    'accentText',  'LIFE',
    'description', 'A vibrant community balancing rigorous technical education with diverse cultural and athletic pursuits.',
    'facilities', JSON_ARRAY(
      JSON_OBJECT('id','fac-library',    'title','Central Library',    'description','Over 50,000 volumes, e-journals, and digital resources. Access to IEEE, Elsevier, Springer, DELNET.','iconName','BookOpen', 'imageUrl','/assets/library.jpg',  'to','/facilities/library'),
      JSON_OBJECT('id','fac-computer',   'title','Computer Center',    'description','High-speed internet, 500+ computers, servers, 24x7 network access for students and faculty.','iconName','Microscope','imageUrl','/assets/complab.jpg', 'to','/facilities/computer-center'),
      JSON_OBJECT('id','fac-sports',     'title','Sports Complex',      'description','Cricket, football, basketball, badminton, table tennis, and a fully equipped gymnasium.','iconName','Users',     'imageUrl','/assets/sports.jpg',  'to','/facilities/sports'),
      JSON_OBJECT('id','fac-activities', 'title','Student Activities',  'description','IEEE, Coding Club, Robotics, and literary clubs nurturing talent beyond academics.','iconName','Users',     'imageUrl','/assets/clubs.jpg',  'to','/students/activities'),
      JSON_OBJECT('id','fac-hostel',     'title','Hostel Facilities',   'description','Separate Boys and Girls hostels with Wi-Fi, mess, laundry, common rooms.','iconName','Building',  'imageUrl','/assets/hostel.jpg', 'to','/facilities/hostel/boys'),
      JSON_OBJECT('id','fac-idea-lab',   'title','AICTE IDEA Lab',      'description','3D printers, laser cutters, AR/VR headsets, IoT kits and electronics prototyping.','iconName','FileText',  'imageUrl','/assets/idealab.jpg','to','/facilities/idea-lab')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_faqs', JSON_OBJECT(
    'heading',    'FAQs',
    'subLabel',   'Frequently Asked Questions',
    'viewAllLink','/policy/help',
    'items', JSON_ARRAY(
      JSON_OBJECT('id','faq1','question','What are the eligibility criteria for B.Tech admissions?','answer','Admissions are via JEE Main counselling (MP State). Candidates must have passed 10+2 with PCM and a minimum of 45% marks (40% for SC/ST).','defaultOpen',0),
      JSON_OBJECT('id','faq2','question','Whom to contact for Postgraduate admissions?','answer','Contact the Office of Academics (PG) at pg@sgsits.ac.in or call +91-731-2431234.','defaultOpen',1),
      JSON_OBJECT('id','faq3','question','Whom to contact for Undergraduate admissions?','answer','Contact the Admission Cell at admission@sgsits.ac.in or call +91-731-2582101.','defaultOpen',0),
      JSON_OBJECT('id','faq4','question','Whom to contact for queries related to GATE?','answer','PG Admission queries related to GATE scores are handled by the PG Admission Cell. Email pg@sgsits.ac.in.','defaultOpen',0),
      JSON_OBJECT('id','faq5','question','How to pay fees online?','answer','Fees can be paid via the institute ERP portal using net banking, debit/credit card or UPI. Visit the Student Login portal for instructions.','defaultOpen',0),
      JSON_OBJECT('id','faq6','question','Whom to contact for Faculty Recruitment?','answer','Faculty recruitment queries should be addressed to the Registrar''s office at registrar@sgsits.ac.in.','defaultOpen',0)
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_gallery', JSON_OBJECT(
    'heading',    'Photo',
    'accentText', 'Gallery',
    'subLabel',   'Multi-Hued Reflections',
    'viewAllLink','/explore/gallery'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about_vision_mission', JSON_OBJECT(
    'visionEnglish', '"To be a centre of excellence in education, research and innovation, creating competent professionals with ethical values who contribute to the development of society and the nation."',
    'visionHindi',   '"Shiksha, anusandhan aur navachar mein utkrishtta ka kendra banana, naitik mulyon ke saath saksham peshewaraon ka nirmaan karna jo samaj aur rashtra ke vikas mein yogdaan den."',
    'missionPoints', JSON_ARRAY(
      JSON_OBJECT('num','1','text','Provide high-quality technical education through a meticulously designed curriculum, advanced outcome-based teaching-learning methodologies, and state-of-the-art laboratory infrastructure.'),
      JSON_OBJECT('num','2','text','Foster a vibrant ecosystem for high-impact research, pioneering innovation, and student-led entrepreneurship in collaboration with global scientific institutions.'),
      JSON_OBJECT('num','3','text','Cultivate strong industry-academia synergies to drive technology transfer, consultancies, industrial internships, and exceptional student placement programs.'),
      JSON_OBJECT('num','4','text','Inculcate deep-seated ethical values, professional integrity, a sense of social responsibility, and future-ready leadership capabilities.'),
      JSON_OBJECT('num','5','text','Encourage comprehensive and holistic development through outstanding sports facilities, cultural forums, and active community outreach initiatives.')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about_director', JSON_OBJECT(
    'name',        'Prof. Neetesh Purohit',
    'designation', 'Director',
    'photo',       '/director.jpeg',
    'message',     'Prof. Neetesh Purohit has taken over charge as Director, SGSITS Indore with effect from the forenoon of 15th February, 2024. Under his leadership the institute continues to scale new heights in research, placements and academic excellence. We are committed to imparting value-based, outcome-oriented education that prepares students for leadership roles in industry and society.',
    'email',       'director@sgsits.ac.in',
    'phone',       '0731-2582100',
    'officeHours', 'Mon-Sat: 11:00 AM - 1:00 PM (prior appointment required)'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('contact_info', JSON_OBJECT(
    'instituteName', 'Shri Govindram Seksaria Institute of Technology and Science (SGSITS)',
    'address',       '23 Park Road, Indore',
    'city',          'Indore',
    'state',         'Madhya Pradesh',
    'pincode',       '452003',
    'mainPhone',     '0731-2582100',
    'mainEmail',     'info@sgsits.ac.in',
    'mapEmbedUrl',   'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.3!2d75.8!3d22.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd!2sSGSITS!5e0!3m2!1sen!2sin!4v1',
    'offices', JSON_ARRAY(
      JSON_OBJECT('title','Director',                  'name','Prof. (Dr.) Rakesh Kumar Bajaj','email','director@sgsits.ac.in',        'phone','0731-2582100'),
      JSON_OBJECT('title','Registrar',                 'name','Shri P.K. Verma',               'email','registrar@sgsits.ac.in',       'phone','0731-2582124'),
      JSON_OBJECT('title','Dean (Academics)',           'name','Prof. R.K. Pandit',             'email','deanacademics@sgsits.ac.in',   'phone','0731-2582103'),
      JSON_OBJECT('title','Admission Enquiry',         'name','Admission Cell',                'email','admission@sgsits.ac.in',       'phone','0731-2582101'),
      JSON_OBJECT('title','Training & Placement',      'name','T&P Cell',                      'email','tpo@sgsits.ac.in',             'phone','0731-2582150'),
      JSON_OBJECT('title','Controller of Examinations','name','Prof. V.K. Gupta',              'email','coe@sgsits.ac.in',             'phone','0731-2582106'),
      JSON_OBJECT('title','Library',                   'name','Dr. S.P. Singh',                'email','library@sgsits.ac.in',         'phone','0731-2582700'),
      JSON_OBJECT('title','Hostel (Boys)',              'name','Chief Warden',                  'email','chiefwarden@sgsits.ac.in',     'phone','0731-2582800')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('branding', JSON_OBJECT(
    'shortCode',            'SG',
    'shortName',            'SGSITS INDORE',
    'fullName',             'Shri G. S. Institute of Technology & Science',
    'establishedYear',      '1952',
    'subTagline',           'Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952',
    'tagline',              'An Institute of National Standing',
    'logoUrl',              '/image.png',
    'logoAlt',              'SGSITS Indore Logo',
    'logoSuffix',           'Autonomous Grant-in-Aid Institute',
    'mobileDrawerTitle',    'SGSITS NAVIGATION',
    'mobileDrawerFooter',   'Shri G. S. Institute * Estd. 1952',
    'mobileNavSectionLabel','Section Menu',
    'preloaderEnabled',     1
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_data', JSON_OBJECT(
    'institution', JSON_OBJECT(
      'shortCode',   'SG',
      'name',        'SGSITS INDORE',
      'estYear',     'Est. 1952',
      'tagline',     'An Institute of National Standing',
      'description', 'Shri G. S. Institute of Technology & Science, Indore is a prestigious autonomous engineering institution of national repute.',
      'address',     '23, Park Road (Sir M. Visvesvaraya Marg), Indore, M.P. - 452003, India',
      'phone',       '+91-731-2582100, 2582124',
      'email',       'registrar@sgsits.ac.in'
    ),
    'copyright', 'SGSITS Indore (M.P.), India. All rights reserved.',
    'bottomLinks', JSON_ARRAY(
      JSON_OBJECT('label','Privacy Policy',          'to','/policy/privacy'),
      JSON_OBJECT('label','Terms of Use',            'to','/policy/terms'),
      JSON_OBJECT('label','Disclaimer',              'to','/policy/disclaimer'),
      JSON_OBJECT('label','Accessibility Statement', 'to','/policy/accessibility'),
      JSON_OBJECT('label','Copyright Policy',        'to','/policy/copyright'),
      JSON_OBJECT('label','Hyperlinking Policy',     'to','/policy/hyperlink'),
      JSON_OBJECT('label','Sitemap',                 'to','/policy/sitemap'),
      JSON_OBJECT('label','Feedback & Help',         'to','/contact')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu'))

ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- =============================================================================
-- PHASE 2 SEED â€” Part U: More static pages (about, vision, director, policies)
-- =============================================================================
INSERT INTO pages (title, slug, content, meta_title, meta_description, status, updated_by)
VALUES
  ('About SGSITS Indore', 'about-institute',
   '<h1>About Shri G.S. Institute of Technology & Science</h1><p>Shri G. S. Institute of Technology & Science (SGSITS) is one of the premier technical institutions in India, created to be Centres of Excellence for training, research and development in science, engineering and technology. Established as College of Engineering in 1952, the Institute was later declared an autonomous Institution of National standing.</p><h2>History</h2><p>The institute was established in 1952 and has grown to become one of the most respected engineering institutions in Madhya Pradesh. With over 70 years of academic excellence, SGSITS has produced thousands of engineers and managers who have made significant contributions to industry and society.</p><h2>Accreditation</h2><p>SGSITS is NAAC accredited with Grade A, and several B.Tech programmes are NBA accredited. The institute is affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal and Devi Ahilya Vishwavidyalaya (DAVV), Indore, and is approved by AICTE, New Delhi.</p>',
   'About SGSITS Indore â€” History & Overview', 'Premier autonomous engineering institute in Madhya Pradesh established in 1952.', 'PUBLISHED',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Vision & Mission', 'vision-mission',
   '<h1>Vision & Mission</h1><h2>Vision</h2><p><em>"To be a centre of excellence in education, research and innovation, creating competent professionals with ethical values who contribute to the development of society and the nation."</em></p><h2>Mission</h2><ol><li>Provide high-quality technical education through a meticulously designed curriculum, advanced outcome-based teaching-learning methodologies, and state-of-the-art laboratory infrastructure.</li><li>Foster a vibrant ecosystem for high-impact research, pioneering innovation, and student-led entrepreneurship in collaboration with global scientific institutions.</li><li>Cultivate strong industry-academia synergies to drive technology transfer, consultancies, industrial internships, and exceptional student placement programs.</li><li>Inculcate deep-seated ethical values, professional integrity, a sense of social responsibility, and future-ready leadership capabilities.</li><li>Encourage comprehensive and holistic development through outstanding sports facilities, cultural forums, and active community outreach initiatives.</li></ol>',
   'Vision & Mission â€” SGSITS Indore', 'Vision and Mission of Shri G.S. Institute of Technology & Science, Indore.', 'PUBLISHED',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Director''s Message', 'director-message',
   '<h1>Director''s Message</h1><div class="director-profile"><img src="/director.jpeg" alt="Director SGSITS" /><h2>Prof. Neetesh Purohit</h2><p><strong>Director, SGSITS Indore</strong></p></div><p>Prof. Neetesh Purohit has taken over charge as Director, SGSITS Indore with effect from the forenoon of 15th February, 2024.</p><p>Under his leadership, the institute continues to scale new heights in research, placements and academic excellence. We are committed to imparting value-based, outcome-oriented education that prepares students for leadership roles in industry and society.</p><p>I warmly welcome all prospective students, their parents, and all stakeholders to explore our institute and experience the vibrant academic and social life that SGSITS offers.</p>',
   'Director''s Message â€” SGSITS Indore', 'Message from the Director of SGSITS Indore â€” Prof. Neetesh Purohit.', 'PUBLISHED',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Privacy Policy', 'privacy',
   '<h1>Privacy Policy</h1><p>This privacy policy describes how SGSITS Indore collects, uses, and protects information provided by visitors to this website.</p><h2>Information We Collect</h2><p>We collect information that you provide when contacting us, registering for events, or submitting enquiry forms. This includes name, email address, phone number, and the nature of your enquiry.</p><h2>Use of Information</h2><p>Information collected is used solely for responding to enquiries, processing admissions, and improving our services. We do not sell or share personal information with third parties.</p><h2>Cookies</h2><p>Our website uses cookies to improve user experience. By continuing to use this website, you consent to the use of cookies in accordance with this policy.</p><h2>Contact</h2><p>For privacy-related queries, contact: registrar@sgsits.ac.in</p>',
   'Privacy Policy â€” SGSITS Indore', 'Privacy policy for the SGSITS Indore official website.', 'PUBLISHED',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('Disclaimer', 'disclaimer',
   '<h1>Disclaimer</h1><p>The information on this website is provided in good faith for general information purposes only. SGSITS Indore makes no representations or warranties of any kind regarding the completeness, accuracy, reliability, suitability, or availability of the information.</p><p>Any reliance on such information is strictly at your own risk. SGSITS Indore shall not be liable for any loss or damage arising from use of this website.</p><p>This website may contain links to external sites. These links are provided for convenience only. SGSITS Indore does not endorse or take responsibility for the content of linked websites.</p>',
   'Disclaimer â€” SGSITS Indore', 'Disclaimer for the official SGSITS Indore website.', 'PUBLISHED',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('RTI Information', 'rti',
   '<h1>Right to Information (RTI)</h1><p>SGSITS Indore is committed to transparency and accountability under the Right to Information Act, 2005.</p><h2>Public Information Officer</h2><p>Name: Registrar, SGSITS Indore<br>Email: registrar@sgsits.ac.in<br>Phone: 0731-2582124</p><h2>First Appellate Authority</h2><p>Name: Director, SGSITS Indore<br>Email: director@sgsits.ac.in<br>Phone: 0731-2582100</p><h2>How to File RTI</h2><p>RTI applications can be submitted online via the Central Government RTI portal or by postal correspondence addressed to the Public Information Officer, SGSITS, 23 Park Road, Indore 452003.</p>',
   'RTI â€” SGSITS Indore', 'Right to Information (RTI) details for SGSITS Indore.', 'PUBLISHED',
   (SELECT id FROM users WHERE email='admin@college.edu'))

ON DUPLICATE KEY UPDATE content=VALUES(content), status=VALUES(status), updated_by=VALUES(updated_by);

-- =============================================================================
-- PHASE 2 SEED â€” Part V: More notices from announcements data
-- =============================================================================
INSERT INTO notices (title, slug, description, notice_type, department_id, created_by, publish_date, status)
VALUES
  ('Information Bulletin regarding B.Tech Admissions 2025-26',
   'btech-admissions-bulletin-2025-26',
   'Information bulletin for B.Tech admissions 2025-26. Students who have qualified JEE Main 2025 and wish to seek admission in B.Tech programmes at SGSITS Indore may refer to this bulletin for detailed information on eligibility, seat matrix, fee structure, and counselling process.',
   'GENERAL', NULL,
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-05-15', 'PUBLISHED'),

  ('Result of MBA (Financial Administration) II Sem Examination',
   'result-mba-fin-admin-ii-sem-2025',
   'The results of MBA (Financial Administration) II Semester Examination conducted in April-May 2025 have been declared. Students can access their results through the examination portal.',
   'EXAM', NULL,
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-05-10', 'PUBLISHED'),

  ('Revised Academic Calendar for UG & PG Classes 2024-25',
   'revised-academic-calendar-2024-25',
   'The academic calendar for UG and PG classes for the session 2024-25 has been revised. Students and faculty are requested to take note of the revised schedule for examinations, practical assessments, and semester end examinations.',
   'GENERAL', NULL,
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-05-08', 'PUBLISHED'),

  ('Schedule of Internal Assessment Tests (Even Semester)',
   'iat-schedule-even-sem-2025',
   'The schedule of Internal Assessment Tests (IAT) for the Even Semester 2024-25 is hereby notified. All students are advised to appear in the IATs as per the given schedule.',
   'EXAM', NULL,
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   '2025-05-02', 'PUBLISHED'),

  ('Instruction for Students Regarding Uniform and General Discipline',
   'uniform-discipline-notice-2025',
   'All students are instructed to follow the dress code and general discipline norms as per the institute rules. Students found violating the norms shall be subject to disciplinary action.',
   'GENERAL', NULL,
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-04-28', 'PUBLISHED'),

  ('Notice regarding Hostel Fee Payment Deadlines',
   'hostel-fee-payment-deadline-2025',
   'All hostel residents are hereby informed that the last date for payment of hostel fees for the current semester is notified. Students who fail to pay within the stipulated date will be liable to pay late fine.',
   'GENERAL', NULL,
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-04-15', 'PUBLISHED'),

  ('Microsoft Campus Drive 2025-26 â€” Registration Open',
   'microsoft-campus-drive-2025-26',
   'Microsoft India will be conducting an on-campus recruitment drive at SGSITS. Final year students of B.Tech (CS/IT/EC) are invited to register. Eligibility: 70% throughout, no backlogs. Roles: Software Development Engineer. Package: As per Microsoft norms.',
   'PLACEMENT', NULL,
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   '2025-09-01', 'PUBLISHED'),

  ('GATE 2026 Registration Open â€” Students Encouraged to Appear',
   'gate-2026-registration-notice',
   'GATE 2026 registrations are now open. All final and pre-final year students are encouraged to appear in GATE for M.Tech admissions and PSU recruitment. The institute provides GATE preparation support through faculty and study material.',
   'GENERAL', NULL,
   (SELECT id FROM users WHERE email='admin@college.edu'),
   '2025-09-05', 'PUBLISHED')

ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part W: Visitor stats (historical data)
-- =============================================================================
INSERT INTO visitor_stats (stat_date, page_views, unique_visits) VALUES
  ('2025-05-01', 1250, 420),
  ('2025-05-02', 1180, 390),
  ('2025-05-03', 890,  280),
  ('2025-05-04', 780,  250),
  ('2025-05-05', 1320, 445),
  ('2025-05-06', 1490, 510),
  ('2025-05-07', 1560, 535),
  ('2025-05-08', 1620, 560),
  ('2025-05-09', 1380, 475),
  ('2025-05-10', 870,  295),
  ('2025-05-11', 820,  270),
  ('2025-05-12', 1450, 490),
  ('2025-05-13', 1530, 520),
  ('2025-05-14', 1590, 550),
  ('2025-05-15', 1680, 580),
  ('2025-05-16', 1720, 595),
  ('2025-05-17', 980,  320),
  ('2025-05-18', 940,  310),
  ('2025-05-19', 1640, 565),
  ('2025-05-20', 1700, 588),
  ('2025-05-21', 1760, 610),
  ('2025-05-22', 1800, 625),
  ('2025-05-23', 1850, 640),
  ('2025-05-24', 1020, 340),
  ('2025-05-25', 980,  325),
  ('2025-05-26', 1900, 660),
  ('2025-05-27', 1950, 675),
  ('2025-05-28', 2000, 690),
  ('2025-05-29', 2050, 710)
ON DUPLICATE KEY UPDATE page_views=VALUES(page_views), unique_visits=VALUES(unique_visits);

-- Update visitor total counter
UPDATE visitor_total SET total_count=2485391 WHERE id=1;

-- =============================================================================
-- PHASE 2 SEED â€” Part X: Leave requests (demo data for portal testing)
-- =============================================================================
INSERT INTO leave_requests
  (user_id, department_id, leave_type, from_date, to_date, days_count, reason, status, applied_at)
VALUES
  ((SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Casual', '2025-09-18', '2025-09-19', 2,
   'Personal work â€” bank and passport related matters.', 'approved', '2025-09-12 10:00:00'),

  ((SELECT id FROM users WHERE email='rohit.sharma@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='computer-engineering'),
   'Medical', '2025-10-05', '2025-10-07', 3,
   'Medical treatment and recovery. Doctor''s prescription attached.', 'approved', '2025-10-03 09:30:00'),

  ((SELECT id FROM users WHERE email='priya.singh@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='mechanical-engineering'),
   'Duty', '2025-09-22', '2025-09-23', 2,
   'Attending national conference on Thermal Engineering at IIT Indore.', 'approved', '2025-09-15 11:00:00'),

  ((SELECT id FROM users WHERE email='deepak.gupta@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='electrical-engineering'),
   'Casual', '2025-11-03', '2025-11-03', 1,
   'Personal work.', 'pending', '2025-10-28 10:30:00'),

  ((SELECT id FROM users WHERE email='monika.verma@sgsits.ac.in'),
   (SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   'Earned', '2025-12-22', '2025-12-31', 8,
   'Annual vacation leave for year-end family commitments.', 'pending', '2025-12-01 09:00:00')

ON DUPLICATE KEY UPDATE reason=VALUES(reason), status=VALUES(status);

-- =============================================================================
-- PHASE 2 SEED â€” Part Y: Notifications
-- =============================================================================
INSERT INTO notifications (user_id, title, message, link, is_read)
VALUES
  ((SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   'Marks Fill Request Pending',
   'Dr. Kiran Patel has not yet submitted marks for CE502 MST1 Q1. Last date: 20 September 2025.',
   '/dashboard/hod/marks', 0),

  ((SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'),
   'Marks Fill Request Due',
   'You have a pending marks fill request for CE502 (DBMS) MST1 Q1. Deadline: 20 Sep 2025.',
   '/dashboard/teacher/marks-feed', 0),

  ((SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   'TCS Drive Registration Closed',
   'Registration for TCS NQT 2025-26 has been closed. 145 students registered.',
   '/dashboard/placement/company-visits', 1),

  ((SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   'Correction Request Received',
   'A marks correction request has been submitted by Dr. Neha Joshi for ME505.',
   '/dashboard/exam/requests', 0),

  ((SELECT id FROM users WHERE email='admin@college.edu'),
   'New Tender Published',
   'Tender for Laboratory Equipment Procurement 2025-26 has been published.',
   '/dashboard/central-admin/tenders', 1),

  ((SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
   'Leave Request Pending Review',
   'Prof. Vikas Tiwari has applied for casual leave on 3 November 2025.',
   '/dashboard/hod/leaves', 0)

ON DUPLICATE KEY UPDATE message=VALUES(message), is_read=VALUES(is_read);

