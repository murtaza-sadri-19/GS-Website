-- =============================================================================
-- ENTERPRISE SEED — Part 02: Departments + patch HOD/dept linkage
-- Run AFTER: seed_enterprise_01_users.sql
-- Run BEFORE: seed_enterprise_03_faculty.sql
-- =============================================================================
USE SGSITS_DB;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Departments ───────────────────────────────────────────────────────────
INSERT INTO departments
  (name, slug, short_name, description, vision, mission,
   hod_user_id, status, established_year, contact_email, contact_phone)
VALUES
  (
    'Computer Engineering',
    'computer-engineering', 'CE',
    'The Department of Computer Engineering was established in 1987 and is one of the pioneer departments of SGSITS. The department offers B.E. and M.Tech. programmes and has state-of-the-art computing laboratories equipped with high-performance workstations and modern software.',
    'To be a centre of excellence in computer engineering education and research, producing technically competent, innovative, and ethically responsible engineers.',
    'To impart quality education in computer engineering through industry-aligned curriculum, hands-on laboratory training, research activities, and industry collaboration to prepare students for global challenges.',
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
    'ACTIVE', 1987, 'ce@sgsits.ac.in', '0731-2431310'
  ),
  (
    'Information Technology',
    'information-technology', 'IT',
    'The Department of Information Technology focuses on software development, data science, networking, and cybersecurity. Established in 2001, it has consistently produced top-performing graduates placed in leading IT companies.',
    'To develop globally competitive IT professionals who can design, build, and manage information systems to serve society.',
    'To provide rigorous IT education integrating theory and practice, fostering innovation, entrepreneurship, and lifelong learning.',
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
    'ACTIVE', 2001, 'it@sgsits.ac.in', '0731-2431311'
  ),
  (
    'Mechanical Engineering',
    'mechanical-engineering', 'ME',
    'One of the oldest and largest departments of SGSITS, Mechanical Engineering has a rich legacy since 1952. The department offers B.E., M.Tech., and Ph.D. programmes with specialisations in thermal, design, manufacturing, and industrial engineering.',
    'To be a nationally recognised centre for mechanical engineering education, applied research, and industry partnership.',
    'To develop competent, creative mechanical engineers through rigorous academic training, industry interaction, and research-driven learning.',
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
    'ACTIVE', 1952, 'me@sgsits.ac.in', '0731-2431312'
  ),
  (
    'Civil Engineering',
    'civil-engineering', 'CVL',
    'The Department of Civil Engineering, established in 1952, offers programmes in structural, geotechnical, environmental, and transportation engineering. The department has well-equipped laboratories and conducts field-based projects.',
    'To emerge as a leading centre for civil engineering education producing capable and socially responsible engineers.',
    'To provide comprehensive civil engineering education through experiential learning, research, and community engagement.',
    (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in'),
    'ACTIVE', 1952, 'civil@sgsits.ac.in', '0731-2431313'
  ),
  (
    'Electrical Engineering',
    'electrical-engineering', 'EE',
    'The Department of Electrical Engineering offers B.E. and M.Tech. programmes with focus on power systems, control systems, and electrical machines. Its power electronics and drives laboratory is equipped with modern testing equipment.',
    'To nurture innovative electrical engineers capable of solving complex power and energy challenges of the modern world.',
    'To impart high-quality education and research training in electrical engineering with emphasis on sustainability and smart grid technologies.',
    (SELECT id FROM users WHERE email='hod.ee@sgsits.ac.in'),
    'ACTIVE', 1952, 'ee@sgsits.ac.in', '0731-2431314'
  ),
  (
    'Electronics & Telecommunication Engineering',
    'electronics-telecommunication', 'EC',
    'The Department of Electronics & Telecommunication Engineering provides education in VLSI design, embedded systems, signal processing, and wireless communications. The department has active industry tie-ups with Texas Instruments and Qualcomm.',
    'To produce world-class electronics and communication engineers who are innovators and leaders in their fields.',
    'To deliver cutting-edge education in electronics and telecommunications through modern labs, research initiatives, and industry partnerships.',
    (SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'),
    'ACTIVE', 1970, 'ec@sgsits.ac.in', '0731-2431315'
  ),
  (
    'Applied Sciences & Humanities',
    'applied-sciences-humanities', 'ASH',
    'The Department of Applied Sciences & Humanities provides foundational science and language education to first-year engineering students across all branches. It covers Mathematics, Physics, Chemistry, and Communication Skills.',
    'To build a strong scientific and humanistic foundation for engineering students enabling them to excel in their technical disciplines.',
    'To deliver high-quality basic science and language education with emphasis on analytical thinking, effective communication, and professional ethics.',
    (SELECT id FROM users WHERE email='hod.ash@sgsits.ac.in'),
    'ACTIVE', 1952, 'ash@sgsits.ac.in', '0731-2431316'
  ),
  (
    'Master of Computer Applications',
    'master-computer-applications', 'MCA',
    'The MCA Department offers a three-year postgraduate programme in computer applications with emphasis on software engineering, database management, web technologies, and artificial intelligence.',
    'To be a premier MCA programme that produces versatile software professionals capable of solving real-world problems.',
    'To provide comprehensive postgraduate computer education integrating modern tools, research aptitude, and industry preparedness.',
    (SELECT id FROM users WHERE email='hod.mca@sgsits.ac.in'),
    'ACTIVE', 1995, 'mca@sgsits.ac.in', '0731-2431317'
  ),
  (
    'Master of Business Administration',
    'master-business-administration', 'MBA',
    'The MBA Department at SGSITS provides a two-year management programme with specialisations in Finance, Marketing, Human Resources, and Operations. The programme includes live projects, case studies, and industry visits.',
    'To develop ethical and effective business leaders equipped with managerial competencies for global organisations.',
    'To deliver management education blending theoretical frameworks with practical industry exposure, producing capable and responsible business professionals.',
    (SELECT id FROM users WHERE email='hod.mba@sgsits.ac.in'),
    'ACTIVE', 2000, 'mba@sgsits.ac.in', '0731-2431318'
  )
ON DUPLICATE KEY UPDATE
  description=VALUES(description), vision=VALUES(vision), mission=VALUES(mission),
  hod_user_id=VALUES(hod_user_id), status=VALUES(status),
  contact_email=VALUES(contact_email), contact_phone=VALUES(contact_phone);

-- ─── 2. Patch users.department_id for HODs ────────────────────────────────────
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='computer-engineering')
  WHERE email='hod.ce@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='information-technology')
  WHERE email='hod.it@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='mechanical-engineering')
  WHERE email='hod.me@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='civil-engineering')
  WHERE email='hod.civil@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electrical-engineering')
  WHERE email='hod.ee@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electronics-telecommunication')
  WHERE email='hod.ec@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='applied-sciences-humanities')
  WHERE email='hod.ash@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='master-computer-applications')
  WHERE email='hod.mca@sgsits.ac.in';
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='master-business-administration')
  WHERE email='hod.mba@sgsits.ac.in';

-- ─── 3. Patch department_id for CE faculty ────────────────────────────────────
UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='computer-engineering')
  WHERE email IN (
    'nisha.thakur@sgsits.ac.in','amit.soni@sgsits.ac.in','seema.rathore@sgsits.ac.in',
    'vivek.sharma.ce@sgsits.ac.in','kiran.patel.ce@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='information-technology')
  WHERE email IN (
    'pooja.chouhan@sgsits.ac.in','rajesh.verma.it@sgsits.ac.in','anjali.singh.it@sgsits.ac.in',
    'manish.dubey@sgsits.ac.in','sneha.tiwari@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='mechanical-engineering')
  WHERE email IN (
    'rakesh.chouksey@sgsits.ac.in','anil.agrawal@sgsits.ac.in','neha.joshi.me@sgsits.ac.in',
    'sanjay.patidar@sgsits.ac.in','devendra.mandloi@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='civil-engineering')
  WHERE email IN (
    'meena.agrawal@sgsits.ac.in','dinesh.shukla@sgsits.ac.in','sunita.rawat@sgsits.ac.in',
    'pavan.kumar.civil@sgsits.ac.in','hemant.vishwakarma@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electrical-engineering')
  WHERE email IN (
    'archana.patel.ee@sgsits.ac.in','naveen.mishra@sgsits.ac.in','leena.dadhich@sgsits.ac.in',
    'rupesh.kumar.ee@sgsits.ac.in','shivam.upadhyay@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='electronics-telecommunication')
  WHERE email IN (
    'deepak.bhatt@sgsits.ac.in','ravi.dixit@sgsits.ac.in','shweta.mehta.ec@sgsits.ac.in',
    'anupam.shukla@sgsits.ac.in','monika.yadav.ec@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='applied-sciences-humanities')
  WHERE email IN (
    'sunanda.nagar@sgsits.ac.in','anil.chouhan.ash@sgsits.ac.in','pratibha.pandey@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='master-computer-applications')
  WHERE email IN (
    'deepika.saxena@sgsits.ac.in','shailesh.khatri@sgsits.ac.in','asha.gour@sgsits.ac.in'
  );

UPDATE users SET department_id=(SELECT id FROM departments WHERE slug='master-business-administration')
  WHERE email IN (
    'sangeeta.jain@sgsits.ac.in','pankaj.singhal@sgsits.ac.in','ritu.agrawal.mba@sgsits.ac.in'
  );

SET foreign_key_checks = 1;
