-- =============================================================================
-- ENTERPRISE SEED — Part 08: CMS Sections, Navigation, SEO, Site Settings,
--                             Chatbot Config & Responses
-- Run AFTER: seed_enterprise_02_departments.sql
-- =============================================================================
USE college_website;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Site Settings ─────────────────────────────────────────────────────────
INSERT INTO site_settings (`key`, value, updated_by)
VALUES
  ('site_name',        'SGSITS Indore',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_tagline',     'Excellence in Technical Education since 1952',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_email',       'info@sgsits.ac.in',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_phone',       '0731-2431300',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_address',     '23, Park Road, Indore — 452 003, Madhya Pradesh, India',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('site_fax',         '0731-2431302',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('facebook_url',     'https://www.facebook.com/sgsitsindore',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('twitter_url',      'https://twitter.com/sgsitsindore',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('linkedin_url',     'https://www.linkedin.com/school/sgsits-indore',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('youtube_url',      'https://www.youtube.com/c/sgsitsindore',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('instagram_url',    'https://www.instagram.com/sgsitsindore',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('established_year', '1952',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('naac_grade',       'A',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('nirf_rank',        'Top 50 Engineering — MP',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('affiliation',      'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
   (SELECT id FROM users WHERE email='admin@college.edu')),
  ('approval',         'AICTE, New Delhi',
   (SELECT id FROM users WHERE email='admin@college.edu'))
ON DUPLICATE KEY UPDATE value=VALUES(value), updated_by=VALUES(updated_by);

-- ─── 2. CMS Sections (JSON blobs for homepage and key pages) ─────────────────
INSERT INTO cms_sections (section_key, data, updated_by)
VALUES
  ('home_hero', JSON_OBJECT(
    'title', 'Shri G.S. Institute of Technology and Science',
    'subtitle', 'Excellence in Technical Education since 1952',
    'ctaLabel', 'Explore Programmes',
    'ctaLink', '/academics',
    'bgImageUrl', '/assets/hero-campus.jpg',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Years of Excellence', 'value', '72+'),
      JSON_OBJECT('label', 'Programmes Offered', 'value', '12+'),
      JSON_OBJECT('label', 'Faculty Strength', 'value', '200+'),
      JSON_OBJECT('label', 'Alumni Placed', 'value', '25,000+')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_about', JSON_OBJECT(
    'heading', 'About SGSITS',
    'subheading', 'A legacy of engineering excellence',
    'body', 'Established in 1952 by the visionary industrialist Late Shri Ghanshyam Das Birla, SGSITS Indore is one of Madhya Pradesh''s premier autonomous engineering institutes. Affiliated to RGPV and approved by AICTE, the institute is NAAC accredited with ''A'' Grade.',
    'imageUrl', '/assets/about-building.jpg',
    'points', JSON_ARRAY(
      'NAAC Accredited — Grade A',
      'NBA Accredited Programmes',
      'Active Industry Collaborations',
      'Vibrant Research Environment'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_stats', JSON_OBJECT(
    'items', JSON_ARRAY(
      JSON_OBJECT('icon', 'GraduationCap', 'value', '72+',    'label', 'Years of Excellence'),
      JSON_OBJECT('icon', 'Users',         'value', '200+',   'label', 'Expert Faculty'),
      JSON_OBJECT('icon', 'BookOpen',      'value', '12+',    'label', 'Programmes'),
      JSON_OBJECT('icon', 'Building2',     'value', '25,000+','label', 'Alumni Network'),
      JSON_OBJECT('icon', 'Trophy',        'value', '86%',    'label', 'Placement Rate 2024-25'),
      JSON_OBJECT('icon', 'FlaskConical',  'value', '9',      'label', 'Research Labs')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('home_placement', JSON_OBJECT(
    'heading', 'Placements',
    'subheading', 'Building careers, not just degrees',
    'stats', JSON_OBJECT(
      'placed',     '406',
      'highestPkg', '28 LPA',
      'avgPkg',     '6.40 LPA',
      'companies',  '55+'
    ),
    'topRecruiters', JSON_ARRAY(
      'TCS', 'Infosys', 'Wipro', 'Accenture', 'Capgemini',
      'HCL', 'Tech Mahindra', 'L&T', 'KPIT', 'Oracle'
    )
  ), (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('home_news_events', JSON_OBJECT(
    'heading', 'News & Events',
    'subheading', 'Stay updated with the latest from SGSITS'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_about', JSON_OBJECT(
    'instituteName', 'Shri G.S. Institute of Technology & Science',
    'shortName', 'SGSITS, Indore',
    'address', '23, Park Road, Indore — 452 003 (M.P.) India',
    'phone', '0731-2431300',
    'fax', '0731-2431302',
    'email', 'info@sgsits.ac.in',
    'mapLink', 'https://maps.app.goo.gl/sgsits'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_quick_links', JSON_OBJECT(
    'heading', 'Quick Links',
    'links', JSON_ARRAY(
      JSON_OBJECT('label', 'About Institute',   'url', '/about'),
      JSON_OBJECT('label', 'Departments',        'url', '/departments'),
      JSON_OBJECT('label', 'Admissions',         'url', '/admission/ug'),
      JSON_OBJECT('label', 'Examination',        'url', '/exam'),
      JSON_OBJECT('label', 'Placements',         'url', '/placements'),
      JSON_OBJECT('label', 'Research',           'url', '/research'),
      JSON_OBJECT('label', 'Notices',            'url', '/notices'),
      JSON_OBJECT('label', 'Downloads',          'url', '/downloads')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_departments', JSON_OBJECT(
    'heading', 'Departments',
    'links', JSON_ARRAY(
      JSON_OBJECT('label', 'Computer Engineering',   'url', '/departments/computer-engineering'),
      JSON_OBJECT('label', 'Information Technology', 'url', '/departments/information-technology'),
      JSON_OBJECT('label', 'Mechanical Engineering', 'url', '/departments/mechanical-engineering'),
      JSON_OBJECT('label', 'Civil Engineering',      'url', '/departments/civil-engineering'),
      JSON_OBJECT('label', 'Electrical Engineering', 'url', '/departments/electrical-engineering'),
      JSON_OBJECT('label', 'Electronics & TC',       'url', '/departments/electronics-telecommunication'),
      JSON_OBJECT('label', 'MCA',                    'url', '/departments/master-computer-applications'),
      JSON_OBJECT('label', 'MBA',                    'url', '/departments/master-business-administration')
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('footer_social', JSON_OBJECT(
    'facebook',  'https://www.facebook.com/sgsitsindore',
    'twitter',   'https://twitter.com/sgsitsindore',
    'linkedin',  'https://www.linkedin.com/school/sgsits-indore',
    'youtube',   'https://www.youtube.com/c/sgsitsindore',
    'instagram', 'https://www.instagram.com/sgsitsindore'
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_ug', JSON_OBJECT(
    'heading', 'UG Admission 2025–26',
    'subheading', 'B.E. Programmes — All Branches',
    'eligibility', 'Passed 10+2 (PCM) with minimum 45% aggregate. JEE Main 2025 qualified. Indian nationals and OCI/PIO card holders.',
    'process', JSON_ARRAY(
      'Register on MPDTE Online Counselling Portal',
      'Select SGSITS in institute preference',
      'Document verification at institute',
      'Fee payment and admission confirmation'
    ),
    'importantDates', JSON_OBJECT(
      'counsellingStart', '2025-07-01',
      'classesBegin', '2025-07-21'
    )
  ), (SELECT id FROM users WHERE email='admin@college.edu')),

  ('chatbot_config_cms', JSON_OBJECT(
    'botName', 'SGSITS Assistant',
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

-- ─── 3. Navigation Items ──────────────────────────────────────────────────────
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
VALUES
  (NULL, 'Home',           '/',                    1,  '_self', 1),
  (NULL, 'About',          '/about',               2,  '_self', 1),
  (NULL, 'Academics',      '/academics',           3,  '_self', 1),
  (NULL, 'Departments',    '/departments',         4,  '_self', 1),
  (NULL, 'Admissions',     '/admission/ug',        5,  '_self', 1),
  (NULL, 'Examination',    '/exam',                6,  '_self', 1),
  (NULL, 'Placements',     '/placements',          7,  '_self', 1),
  (NULL, 'Research',       '/research',            8,  '_self', 1),
  (NULL, 'Facilities',     '/facilities',          9,  '_self', 1),
  (NULL, 'Notices',        '/notices',             10, '_self', 1),
  (NULL, 'Gallery',        '/gallery',             11, '_self', 1),
  (NULL, 'Contact',        '/contact',             12, '_self', 1)
ON DUPLICATE KEY UPDATE sort_order=VALUES(sort_order), is_active=VALUES(is_active);

-- Sub-navigation: Admissions children
SET @admissions_id = (SELECT id FROM navigation_items WHERE label='Admissions' AND parent_id IS NULL LIMIT 1);

INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
VALUES
  (@admissions_id, 'UG Admission', '/admission/ug', 1, '_self', 1),
  (@admissions_id, 'PG Admission', '/admission/pg', 2, '_self', 1),
  (@admissions_id, 'PhD Admission', '/admission/phd', 3, '_self', 1),
  (@admissions_id, 'Prospectus',   '/admission/prospectus', 4, '_self', 1),
  (@admissions_id, 'Fee Structure', '/downloads', 5, '_self', 1)
ON DUPLICATE KEY UPDATE url=VALUES(url), is_active=VALUES(is_active);

-- ─── 4. SEO Metadata ──────────────────────────────────────────────────────────
INSERT INTO seo_metadata
  (page_key, title, description, og_title, og_description, canonical, robots, updated_by)
VALUES
  ('home',
   'SGSITS Indore — Premier Engineering Institute | NAAC A Grade',
   'Shri G.S. Institute of Technology & Science Indore — Premier autonomous engineering institute in MP. B.E., M.Tech., MCA, MBA programmes. NAAC A Grade, NBA Accredited. Admissions open 2025-26.',
   'SGSITS Indore — Engineering Excellence since 1952',
   'Explore B.E., M.Tech., MCA, MBA programmes at SGSITS Indore — NAAC A Grade, 86% placement rate, 200+ faculty.',
   'https://www.sgsits.ac.in/', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('about',
   'About SGSITS Indore | History, Vision, Mission | Engineering Institute MP',
   'About Shri G.S. Institute of Technology & Science Indore — established 1952 by G.S. Birla. RGPV affiliated, AICTE approved, NAAC A Grade autonomous institute in Madhya Pradesh.',
   'About SGSITS Indore',
   'Learn about SGSITS Indore — 72 years of engineering excellence, NAAC A Grade, 9 departments, 200+ faculty.',
   'https://www.sgsits.ac.in/about', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('departments',
   'Departments — SGSITS Indore | Computer, IT, Mechanical, Civil, EE, EC',
   'Explore all engineering departments at SGSITS Indore — Computer Engineering, IT, Mechanical, Civil, Electrical, Electronics & TC, Applied Sciences, MCA, MBA.',
   'Departments at SGSITS Indore',
   'Nine departments offering B.E., M.Tech., MCA, MBA with experienced faculty and modern labs.',
   'https://www.sgsits.ac.in/departments', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('dept_ce',
   'Computer Engineering Department — SGSITS Indore | B.E., M.Tech. CSE',
   'Computer Engineering Department at SGSITS Indore — B.E. and M.Tech. programmes. Expert faculty in AI/ML, networking, security. State-of-the-art labs.',
   'Computer Engineering — SGSITS Indore',
   'Computer Engineering at SGSITS — AI/ML lab, networking lab, 28+ faculty, NBA accredited.',
   'https://www.sgsits.ac.in/departments/computer-engineering', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('admission_ug',
   'UG Admission 2025-26 — SGSITS Indore | B.E. Programmes',
   'B.E. Admission 2025-26 at SGSITS Indore. Branches: Computer Engg., IT, Mechanical, Civil, EE, EC. JEE Main based counselling via MPDTE.',
   'B.E. Admission 2025-26 — SGSITS Indore',
   'Apply for B.E. admission 2025-26 at SGSITS Indore. JEE Main qualified, MPDTE counselling.',
   'https://www.sgsits.ac.in/admission/ug', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('placements',
   'Placements — SGSITS Indore | 86% Placement Rate | TCS Infosys Wipro Oracle',
   'SGSITS Indore Placements 2024-25 — 86% placement rate, highest package 28 LPA, 55+ companies. TCS, Infosys, Wipro, Oracle, KPIT, Capgemini campus recruiters.',
   'SGSITS Placements — 86% Placement Rate 2024-25',
   '406 students placed in 2024-25. Highest package 28 LPA. Top recruiters include Oracle, KPIT, TCS, Infosys.',
   'https://www.sgsits.ac.in/placements', 'index,follow',
   (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),

  ('notices',
   'Notices — SGSITS Indore | Exam, Admission, Placement Notices',
   'Latest notices from SGSITS Indore — exam date sheets, admission circulars, placement schedules, hostel allotment notices.',
   'Notices — SGSITS Indore',
   'Official notices from SGSITS Indore including exam timetables, results, admission and placement updates.',
   'https://www.sgsits.ac.in/notices', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu')),

  ('contact',
   'Contact SGSITS Indore | Address, Phone, Email',
   'Contact Shri G.S. Institute of Technology & Science, Indore. Address: 23 Park Road, Indore 452003 MP. Phone: 0731-2431300.',
   'Contact SGSITS Indore',
   'Get in touch with SGSITS Indore — admissions, examinations, placements, general enquiry.',
   'https://www.sgsits.ac.in/contact', 'index,follow',
   (SELECT id FROM users WHERE email='admin@college.edu'))
ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description),
  og_title=VALUES(og_title), canonical=VALUES(canonical);

-- ─── 5. Chatbot Config ────────────────────────────────────────────────────────
INSERT INTO chatbot_config
  (id, bot_name, welcome_message, input_placeholder, fallback_message, is_active)
VALUES
  (1,
   'SGSITS Assistant',
   'Hello! Welcome to SGSITS Indore. I can help you with admissions, departments, faculty, placements, exam schedules, hostel information, and more. What would you like to know?',
   'Ask me anything about SGSITS...',
   'I''m sorry, I didn''t quite understand that. You can ask me about admissions, departments, faculty, placements, exams, hostels, or contact information. Would you like to speak with a staff member?',
   1)
ON DUPLICATE KEY UPDATE
  bot_name=VALUES(bot_name), welcome_message=VALUES(welcome_message),
  is_active=VALUES(is_active);

-- ─── 6. Chatbot Responses ─────────────────────────────────────────────────────
INSERT INTO chatbot_responses
  (category, keywords, reply, display_order, is_active)
VALUES
  -- Admissions
  ('Admissions', 'admission,admissions,ug,be,btech,how to apply,apply,jee,counselling,mpdte,undergraduate',
   'UG Admissions at SGSITS are based on JEE Main scores through MPDTE (MP Directorate of Technical Education) online counselling. Branches available: Computer Engineering, IT, Mechanical, Civil, Electrical, and Electronics & TC. For 2025-26, counselling begins July 2025. Visit /admission/ug for details or call Admissions Office: 0731-2431305.',
   1, 1),

  ('Admissions', 'mtech,m.tech,pg,postgraduate,gate,masters,mca,mba',
   'PG Admissions: M.Tech. (GATE based), MCA (MP MCA CET), MBA (CAT/MAT/MP MAT). For details visit /admission/pg or contact Admissions: admissions@sgsits.ac.in | 0731-2431305.',
   2, 1),

  ('Admissions', 'phd,research,doctorate,fellowship',
   'PhD admissions at SGSITS are offered through RGPV. Candidates with M.Tech./MCA/MBA and NET/GATE scores are eligible. Contact hod of respective department or research@sgsits.ac.in.',
   3, 1),

  -- Departments / HOD
  ('Departments', 'hod,head of department,who is hod,hod cse,hod computer,hod ce',
   'HOD of Computer Engineering: Dr. Ajay Khunteta | Email: hod.ce@sgsits.ac.in | Phone: 9826002001.',
   4, 1),

  ('Departments', 'hod it,hod information technology,information technology head',
   'HOD of Information Technology: Dr. Kapil Jain | Email: hod.it@sgsits.ac.in | Phone: 9826002002.',
   5, 1),

  ('Departments', 'hod me,hod mechanical,mechanical head,head mechanical',
   'HOD of Mechanical Engineering: Dr. Pradeep Kasande | Email: hod.me@sgsits.ac.in | Phone: 9826002003.',
   6, 1),

  ('Departments', 'hod civil,hod civil engineering,civil head',
   'HOD of Civil Engineering: Dr. Yogesh Kumar Bajpai | Email: hod.civil@sgsits.ac.in | Phone: 9826002004.',
   7, 1),

  ('Departments', 'hod ee,hod electrical,electrical head',
   'HOD of Electrical Engineering: Dr. Manoj Kumar Jain | Email: hod.ee@sgsits.ac.in | Phone: 9826002005.',
   8, 1),

  ('Departments', 'hod ec,hod electronics,electronics head,hod ete',
   'HOD of Electronics & Telecommunication: Dr. Shailendra Kumar Singh | Email: hod.ec@sgsits.ac.in | Phone: 9826002006.',
   9, 1),

  ('Departments', 'hod mca,mca head,hod master computer',
   'HOD of MCA: Dr. Vandana Bhatt | Email: hod.mca@sgsits.ac.in | Phone: 9826002008.',
   10, 1),

  ('Departments', 'hod mba,mba head',
   'HOD of MBA: Dr. Sanjay Sharma | Email: hod.mba@sgsits.ac.in | Phone: 9826002009.',
   11, 1),

  -- Placements
  ('Placements', 'placement,placements,placement statistics,placement rate,placed,companies,package',
   'SGSITS Placement 2024-25 Highlights:\n• Students Placed: 406 out of 472 (86% rate)\n• Highest Package: 28 LPA (Oracle)\n• Average Package: 6.40 LPA\n• Companies Visited: 55+\nTop Recruiters: TCS, Oracle, KPIT, Capgemini, Infosys, Wipro, L&T, HCL\nContact: placement@sgsits.ac.in | 0731-2431320',
   12, 1),

  ('Placements', 'tcs,infosys,wipro,accenture,oracle,kpit,capgemini,hcl,drive,campus drive',
   'SGSITS hosts placements from top companies. Active drives for 2025-26 include TCS (Sept 25), Infosys (Oct 25), Wipro (Oct 25), Accenture (Nov 25), Oracle (Dec 25). Register on the Placement Portal or contact: placement@sgsits.ac.in.',
   13, 1),

  -- Examinations
  ('Examinations', 'exam,examination,exam timetable,date sheet,exam schedule,exam december,exam may',
   'Exam Date Sheet for End Semester December 2025 has been released. Download from /downloads or Notices section. For exam queries, contact Examination Section: examcontroller@sgsits.ac.in | 0731-2431308.',
   14, 1),

  ('Examinations', 'result,results,marks,grade,marksheet',
   'Results for End Semester May 2025 have been declared. Check on the examination portal. For re-evaluation, apply to Exam Section within 15 days of result. Contact: examcontroller@sgsits.ac.in.',
   15, 1),

  ('Examinations', 'admit card,hall ticket,roll number',
   'Admit cards for End Semester December 2025 are available for download from 18 November 2025 on the student portal. For discrepancies, contact Exam Section by 25 November 2025.',
   16, 1),

  -- Fees
  ('Fees', 'fee,fees,fee structure,tuition fee,cost,charges',
   'Fee structure for 2025-26 is available for download at /downloads. For detailed information, contact Accounts Section: accounts@sgsits.ac.in | 0731-2431310. Online fee payment available through ERP portal.',
   17, 1),

  ('Fees', 'hostel fee,hostel charges,hostel cost',
   'Hostel fee structure 2025-26:\n• Boys Hostel: Available for download at /downloads\n• Girls Hostel: Contact Warden''s office\nFor allotment, contact: Chief Warden, SGSITS | 0731-2431325.',
   18, 1),

  ('Fees', 'scholarship,sc,st,obc,mp scholarship',
   'MP Scholarship portal (scholarshipportal.mp.nic.in) is open for 2025-26. SC/ST/OBC/Minority students are eligible. Required documents: income certificate, caste certificate, domicile, marksheets. Contact Student Welfare Office for assistance.',
   19, 1),

  -- Syllabus
  ('Academics', 'syllabus,curriculum,subjects,ce sem 5,sem 5,semester 5,5th semester,computer engineering syllabus',
   'CE Semester 5 subjects include: Design & Analysis of Algorithms, Database Management Systems, Operating Systems, Computer Networks, Theory of Computation, and Elective (AI). Download syllabus PDF from /downloads → Syllabus section.',
   20, 1),

  ('Academics', 'it syllabus,it sem 5,information technology syllabus,it subjects',
   'IT Semester 5 subjects: Software Engineering, DBMS, Computer Networks, Operating Systems, Python Programming, and Elective (Web Technologies). Download from /downloads.',
   21, 1),

  ('Academics', 'academic calendar,calendar,holidays,schedule,semester dates',
   'Academic Calendar 2025-26 is available for download at /downloads. Classes for July 2025 semester commenced 21 July 2025. End Semester Exam: December 2025. For details, visit /downloads.',
   22, 1),

  -- Facilities
  ('Facilities', 'hostel,hostel facility,boys hostel,girls hostel,accommodation',
   'SGSITS provides hostel facility for outstation students:\n• Boys Hostel: 3 blocks, 350 seats\n• Girls Hostel: 1 block, 150 seats\nPriority given to students from outside Indore. Apply through Chief Warden''s office. Fee structure available at /downloads.',
   23, 1),

  ('Facilities', 'library,books,journals,digital library,e-library',
   'The SGSITS Library is open Mon–Sat, 8AM–9PM. It houses 60,000+ books, 150+ journals, and provides access to IEEE Xplore, ScienceDirect, Springer, NPTEL. The digital library section has 40 e-learning terminals.',
   24, 1),

  ('Facilities', 'canteen,cafeteria,food,mess',
   'SGSITS has a central canteen (Main Building Ground Floor) open Mon–Sat 8AM–7PM and Sun 9AM–5PM. Hostel mess serves breakfast, lunch, and dinner. Menu and charges available at /facilities.',
   25, 1),

  ('Facilities', 'gym,gymnasium,sports,playground,cricket,football',
   'SGSITS has excellent sports infrastructure: cricket ground, football ground, volleyball and badminton courts, indoor games room, and a fully-equipped gymnasium. Annual Sports Meet is held every January.',
   26, 1),

  ('Facilities', 'wifi,internet,connectivity,network',
   'SGSITS Smart Campus provides Wi-Fi across all academic blocks, library, hostels, and sports complex at 100 Mbps. Students can connect using their institute credentials. Contact IT Cell for access issues: 0731-2431315.',
   27, 1),

  -- Contact
  ('Contact', 'contact,address,location,phone,email,how to reach',
   'SGSITS Indore\nAddress: 23, Park Road, Indore — 452 003 (MP)\nPhone: 0731-2431300 | Fax: 0731-2431302\nEmail: info@sgsits.ac.in\nTimings: Mon–Sat, 10AM–5PM\nNearest landmark: Near Central Jail, Indore.',
   28, 1),

  -- Director
  ('About', 'director,principal,head of institute,vice chancellor,vc',
   'Director, SGSITS Indore: Prof. R.K. Pandey, Ph.D. (IIT Delhi)\nPhone: 0731-2431301 | Email: director@sgsits.ac.in\nOffice Hours: Mon–Sat, 11AM–1PM (prior appointment required)',
   29, 1),

  -- NAAC/Ranking
  ('About', 'naac,ranking,accreditation,nirf,nba,rank',
   'SGSITS Achievements:\n• NAAC Accredited: Grade A\n• NBA Accredited Programmes: B.E. CE, IT, ME\n• NIRF Ranking: Top 50 Engineering Institutes in MP (2025)\n• Autonomous Institute under RGPV, Bhopal',
   30, 1)
ON DUPLICATE KEY UPDATE reply=VALUES(reply), is_active=VALUES(is_active);

SET foreign_key_checks = 1;
