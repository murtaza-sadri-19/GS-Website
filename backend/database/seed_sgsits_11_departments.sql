-- =============================================================================
-- SGSITS Seed 11: All 17 SGSITS departments with HOD linkage
-- Slugs match frontend constants/departmentsList.ts exactly
-- Run AFTER: seed_sgsits_10_hod_users.sql
-- =============================================================================
USE SGSITS_DB;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ── 1. Insert all 17 SGSITS departments ──────────────────────────────────────
-- contact_email = HOD's publicly-listed email (audit source)
-- contact_phone = HOD's publicly-listed phone (audit source)

INSERT INTO departments
  (name, slug, short_name, description, vision, mission,
   hod_user_id, status, established_year, contact_email, contact_phone)
VALUES

-- 1. Applied Chemistry & Chemical Technology
(
  'Applied Chemistry & Chemical Technology',
  'applied-chemistry', 'Applied Chemistry',
  'The Department of Applied Chemistry & Chemical Technology offers interdisciplinary programmes combining chemistry with chemical process technology, materials science, and environmental engineering.',
  'To be a leading centre for chemical sciences education and applied research that bridges theory with industrial practice.',
  'To impart quality education in applied chemistry and chemical technology through industry-oriented curriculum, research activities, and modern laboratory training.',
  (SELECT id FROM users WHERE email = 'hod.applied-chemistry@sgsits.ac.in'),
  'ACTIVE', 1952, 'nitish.nidhi75@gmail.com', '+91-731-2582181'
),

-- 2. Applied Mathematics
(
  'Applied Mathematics & Computational Science',
  'applied-mathematics', 'Applied Mathematics',
  'The Department of Applied Mathematics provides foundational and advanced mathematical education essential for engineering and computational sciences, including calculus, linear algebra, numerical methods, and data analysis.',
  'To be a premier department for mathematical sciences that enhances engineering competencies through rigorous analytical training.',
  'To deliver high-quality mathematics education integrating computational tools and interdisciplinary applications across all engineering disciplines.',
  (SELECT id FROM users WHERE email = 'hod.applied-mathematics@sgsits.ac.in'),
  'ACTIVE', 1952, 'yvsmita@gmail.com', NULL
),

-- 3. Applied Physics
(
  'Applied Physics & Optoelectronics',
  'applied-physics', 'Applied Physics',
  'The Department of Applied Physics focuses on modern physics, optoelectronics, laser technology, and solid-state physics with applications in engineering and technology.',
  'To be a centre of excellence in applied physics and optoelectronics providing a strong scientific foundation for engineering students.',
  'To develop scientific thinking and experimental skills through quality education in applied physics, optics, and modern measurement techniques.',
  (SELECT id FROM users WHERE email = 'hod.applied-physics@sgsits.ac.in'),
  'ACTIVE', 1952, 'jtandrews@gmail.com', '+91-731-2582435'
),

-- 4. Biomedical Engineering
(
  'Biomedical Engineering',
  'biomedical-engineering', 'Biomedical Engg',
  'The Department of Biomedical Engineering integrates engineering principles with medical sciences to develop diagnostic devices, prosthetics, and healthcare technologies.',
  'To be a nationally recognized centre for biomedical engineering education producing innovative healthcare technologists.',
  'To provide comprehensive biomedical engineering education combining life sciences and engineering for advancement of healthcare solutions.',
  (SELECT id FROM users WHERE email = 'hod.biomedical-engineering@sgsits.ac.in'),
  'ACTIVE', 2003, 'vbhatnagar@sgsits.ac.in', '+91-731-2582471'
),

-- 5. Civil Engineering
(
  'Civil Engineering & Applied Mechanics',
  'civil-engineering', 'Civil Engg',
  'The Department of Civil Engineering, one of the oldest at SGSITS, offers programmes covering structural, geotechnical, environmental, and transportation engineering with modern surveying and CAD facilities.',
  'To emerge as a leading centre for civil engineering education producing capable and socially responsible engineers.',
  'To provide comprehensive civil engineering education through experiential learning, research collaboration, and community engagement.',
  (SELECT id FROM users WHERE email = 'hod.civil-engineering@sgsits.ac.in'),
  'ACTIVE', 1952, 'rakeshkhare@hotmail.com', '9425053428'
),

-- 6. Computer Engineering
(
  'Computer Engineering',
  'computer-engineering', 'Computer Engg',
  'The Department of Computer Engineering, established in 1987, is one of the premier departments of SGSITS offering B.E. and M.Tech. programmes with state-of-the-art computing laboratories in AI/ML, networking, and cybersecurity.',
  'To be a centre of excellence in computer engineering education and research producing technically competent, innovative, and ethically responsible engineers.',
  'To impart quality education in computer engineering through industry-aligned curriculum, hands-on laboratory training, and research activities to prepare students for global challenges.',
  (SELECT id FROM users WHERE email = 'hod.computer-engineering@sgsits.ac.in'),
  'ACTIVE', 1987, 'thakarurjita@gmail.com', '0731-2582401'
),

-- 7. Computer Technology & Applications
(
  'Computer Technology & Applications',
  'computer-technology', 'CTA',
  'The Department of Computer Technology & Applications offers postgraduate programmes focused on software development, database systems, and information systems management.',
  'To be a leading postgraduate programme in computing that bridges the gap between computer science theory and industrial application.',
  'To provide rigorous postgraduate education in computer technology integrating modern software engineering practices and research aptitude.',
  (SELECT id FROM users WHERE email = 'hod.computer-technology@sgsits.ac.in'),
  'ACTIVE', 1995, 'svarma1@sgsits.ac.in', NULL
),

-- 8. Electrical Engineering
(
  'Electrical Engineering',
  'electrical-engineering', 'Electrical Engg',
  'The Department of Electrical Engineering offers programmes in power systems, control systems, electric machines, and power electronics with modern testing laboratories.',
  'To nurture innovative electrical engineers capable of solving complex power and energy challenges of the modern world.',
  'To impart high-quality education and research in electrical engineering with emphasis on sustainability, smart grid technologies, and renewable energy.',
  (SELECT id FROM users WHERE email = 'hod.electrical-engineering@sgsits.ac.in'),
  'ACTIVE', 1952, 'hverma@sgsits.ac.in', NULL
),

-- 9. Electronics & Instrumentation Engineering
(
  'Electronics & Instrumentation Engineering',
  'electronics-instrumentation', 'Electronics & Instru',
  'The Department of Electronics & Instrumentation Engineering offers programmes in process control, measurement systems, VLSI design, and embedded systems with industry-integrated laboratories.',
  'To produce world-class electronics and instrumentation engineers who are innovators in precision measurement and control systems.',
  'To deliver cutting-edge education in electronics and instrumentation through modern labs, industry partnerships, and applied research.',
  (SELECT id FROM users WHERE email = 'hod.electronics-instrumentation@sgsits.ac.in'),
  'ACTIVE', 1968, 'rcgurjar94@gmail.com', NULL
),

-- 10. Electronics & Telecommunication Engineering
(
  'Electronics & Telecommunication Engineering',
  'electronics-telecommunication', 'Electronics & Telecomm',
  'The Department of Electronics & Telecommunication Engineering provides education in VLSI design, embedded systems, signal processing, and wireless communications with active industry tie-ups.',
  'To produce world-class electronics and communication engineers who are innovators and leaders in their fields.',
  'To deliver cutting-edge education in electronics and telecommunications through modern labs, research initiatives, and industry partnerships.',
  (SELECT id FROM users WHERE email = 'hod.electronics-telecommunication@sgsits.ac.in'),
  'ACTIVE', 1970, 'satishjain.jain@gmail.com', '+91-731-2582451'
),

-- 11. Humanities & Social Sciences
(
  'Humanities & Social Sciences',
  'humanities', 'Humanities',
  'The Department of Humanities & Social Sciences provides communication skills, technical writing, economics, and social science education to engineering students across all branches.',
  'To build well-rounded engineering graduates with strong communication, ethical reasoning, and social awareness.',
  'To deliver quality education in language, communication, and social sciences enabling engineering students to become effective professionals.',
  (SELECT id FROM users WHERE email = 'hod.humanities@sgsits.ac.in'),
  'ACTIVE', 1952, 'Asaus343@gmail.com', NULL
),

-- 12. Industrial & Production Engineering
(
  'Industrial & Production Engineering',
  'industrial-production', 'Industrial & Prod',
  'The Department of Industrial & Production Engineering offers programmes covering manufacturing, quality, operations research, ergonomics, and lean management with state-of-the-art production labs.',
  'To be a nationally recognized centre for industrial and production engineering education and applied research.',
  'To develop competent industrial engineers through rigorous academic training, industry collaboration, and research-driven learning.',
  (SELECT id FROM users WHERE email = 'hod.industrial-production@sgsits.ac.in'),
  'ACTIVE', 1960, 'thakargirish@yahoo.com', '+91-731-2582371'
),

-- 13. Information Technology
(
  'Information Technology',
  'information-technology', 'Information Tech',
  'The Department of Information Technology focuses on software engineering, data science, networking, web technologies, and cybersecurity, consistently producing top-performing graduates.',
  'To develop globally competitive IT professionals who can design, build, and manage information systems to serve society.',
  'To provide rigorous IT education integrating theory and practice, fostering innovation, entrepreneurship, and lifelong learning.',
  (SELECT id FROM users WHERE email = 'hod.information-technology@sgsits.ac.in'),
  'ACTIVE', 2001, 'kkssgs@gmail.com', '0731-2582260'
),

-- 14. Management Studies (MBA)
(
  'Management Studies (MBA)',
  'management-studies', 'MBA',
  'The Department of Management Studies provides a two-year MBA programme with specialisations in Finance, Marketing, Human Resources, and Operations, including live projects and industry visits.',
  'To develop ethical and effective business leaders equipped with managerial competencies for global organisations.',
  'To deliver management education blending theoretical frameworks with practical industry exposure, producing capable and responsible business professionals.',
  (SELECT id FROM users WHERE email = 'hod.management-studies@sgsits.ac.in'),
  'ACTIVE', 1987, 'rcgupta.indore@gmail.com', '+91-731-2582651'
),

-- 15. Mechanical Engineering
(
  'Mechanical Engineering',
  'mechanical-engineering', 'Mechanical Engg',
  'One of the oldest and largest departments at SGSITS, Mechanical Engineering has a rich legacy since 1952. The department covers thermal, design, manufacturing, and industrial engineering with comprehensive workshops.',
  'To be a nationally recognised centre for mechanical engineering education, applied research, and industry partnership.',
  'To develop competent, creative mechanical engineers through rigorous academic training, industry interaction, and research-driven learning.',
  (SELECT id FROM users WHERE email = 'hod.mechanical-engineering@sgsits.ac.in'),
  'ACTIVE', 1952, 'brrawal@gmail.com', NULL
),

-- 16. Pharmacy
(
  'Pharmacy',
  'pharmacy', 'Pharmacy',
  'The Department of Pharmacy offers B.Pharm, M.Pharm, and Ph.D. programmes covering pharmaceutical sciences, pharmacology, drug design, and clinical pharmacy.',
  'To be a centre of excellence in pharmaceutical education producing highly skilled pharmacists for healthcare and industry.',
  'To impart quality pharmaceutical education integrating research, clinical practice, and ethical drug development.',
  (SELECT id FROM users WHERE email = 'hod.pharmacy@sgsits.ac.in'),
  'ACTIVE', 2000, 'vchauhan@sgsits.ac.in', NULL
),

-- 17. Centre of Excellence for Bhartiya Gyan Parampara
(
  'Centre of Excellence for Bhartiya Gyan Parampara',
  'coebg', 'Bhartiya Gyan Parampara',
  'The Centre of Excellence for Bhartiya Gyan Parampara promotes research and education in traditional Indian knowledge systems, integrating ancient wisdom with modern engineering education.',
  'To bridge ancient Indian knowledge systems with contemporary engineering through research and education.',
  'To promote and preserve Bhartiya Gyan Parampara by integrating traditional knowledge with modern engineering curriculum and research.',
  (SELECT id FROM users WHERE email = 'hod.coebg@sgsits.ac.in'),
  'ACTIVE', 2020, 'Asaus343@gmail.com', NULL
)

ON DUPLICATE KEY UPDATE
  name=VALUES(name),
  description=VALUES(description),
  vision=VALUES(vision),
  mission=VALUES(mission),
  hod_user_id=VALUES(hod_user_id),
  status=VALUES(status),
  established_year=VALUES(established_year),
  contact_email=VALUES(contact_email),
  contact_phone=VALUES(contact_phone);

-- ── 2. Patch each HOD user's department_id ────────────────────────────────────
UPDATE users u
  INNER JOIN departments d ON d.slug = 'applied-chemistry'
  SET u.department_id = d.id
  WHERE u.email = 'hod.applied-chemistry@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'applied-mathematics'
  SET u.department_id = d.id
  WHERE u.email = 'hod.applied-mathematics@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'applied-physics'
  SET u.department_id = d.id
  WHERE u.email = 'hod.applied-physics@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'biomedical-engineering'
  SET u.department_id = d.id
  WHERE u.email = 'hod.biomedical-engineering@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'civil-engineering'
  SET u.department_id = d.id
  WHERE u.email = 'hod.civil-engineering@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'computer-engineering'
  SET u.department_id = d.id
  WHERE u.email = 'hod.computer-engineering@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'computer-technology'
  SET u.department_id = d.id
  WHERE u.email = 'hod.computer-technology@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'electrical-engineering'
  SET u.department_id = d.id
  WHERE u.email = 'hod.electrical-engineering@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'electronics-instrumentation'
  SET u.department_id = d.id
  WHERE u.email = 'hod.electronics-instrumentation@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'electronics-telecommunication'
  SET u.department_id = d.id
  WHERE u.email = 'hod.electronics-telecommunication@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'humanities'
  SET u.department_id = d.id
  WHERE u.email = 'hod.humanities@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'industrial-production'
  SET u.department_id = d.id
  WHERE u.email = 'hod.industrial-production@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'information-technology'
  SET u.department_id = d.id
  WHERE u.email = 'hod.information-technology@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'management-studies'
  SET u.department_id = d.id
  WHERE u.email = 'hod.management-studies@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'mechanical-engineering'
  SET u.department_id = d.id
  WHERE u.email = 'hod.mechanical-engineering@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'pharmacy'
  SET u.department_id = d.id
  WHERE u.email = 'hod.pharmacy@sgsits.ac.in';

UPDATE users u
  INNER JOIN departments d ON d.slug = 'coebg'
  SET u.department_id = d.id
  WHERE u.email = 'hod.coebg@sgsits.ac.in';

SET foreign_key_checks = 1;
