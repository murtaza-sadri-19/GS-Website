-- =============================================================================
-- SGSITS Seed 14: TEQIP and Startup Cell CMS content
-- Run AFTER: seed_sgsits_13_policies.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

INSERT INTO cms_sections (section_key, data, updated_by) VALUES

-- ── TEQIP Section ─────────────────────────────────────────────────────────────
('teqip.overview', JSON_OBJECT(
  'title',          'TEQIP-III at SGSITS Indore',
  'subtitle',       'Technical Education Quality Improvement Programme',
  'about',          'SGSITS Indore was selected as a beneficiary institution under TEQIP-III, funded by the World Bank and the Government of India. The programme, spanning 2017–2021, focused on improving quality of technical education through laboratory upgradation, faculty development, industry interaction, and research promotion.',
  'contactEmail',   'teqip@sgsits.ac.in',
  'contactPhone',   '0731-2431234 Extn. 210'
), @admin),

('teqip.stats', JSON_ARRAY(
  JSON_OBJECT(
    'iconName',  'FlaskConical',
    'title',     'Laboratories Upgraded',
    'value',     '18',
    'desc',      '18 state-of-the-art laboratories upgraded across departments including Electronics, Computer Science, Mechanical, and Civil Engineering with world-class equipment.',
    'color',     'bg-[#0b2545]/5 border-[#0b2545]/20 text-[#0b2545]'
  ),
  JSON_OBJECT(
    'iconName',  'GraduationCap',
    'title',     'Students Trained',
    'value',     '2,400+',
    'desc',      'Over 2,400 students received specialized training through bridge courses, remedial programs, and industry-skill enhancement workshops.',
    'color',     'bg-[#bfa15f]/10 border-[#bfa15f]/30 text-[#bfa15f]'
  ),
  JSON_OBJECT(
    'iconName',  'Users',
    'title',     'Faculty Development',
    'value',     '215',
    'desc',      '215 faculty members attended Faculty Development Programs (FDPs), Short-Term Training Programs (STTPs), and international workshops.',
    'color',     'bg-[#0b2545]/10 border-[#0b2545]/25 text-[#0b2545]'
  ),
  JSON_OBJECT(
    'iconName',  'TrendingUp',
    'title',     'Research Grants',
    'value',     '₹3.8 Cr',
    'desc',      '₹3.8 Crores in sponsored research grants secured from DST, SERB, DBT, and industry partners under TEQIP funding facilitation.',
    'color',     'bg-[#bfa15f]/15 border-[#bfa15f]/40 text-[#bfa15f]'
  ),
  JSON_OBJECT(
    'iconName',  'Building2',
    'title',     'Placement Improvement',
    'value',     '+38%',
    'desc',      'Placement rates improved by 38% during the TEQIP period, with 45+ new industry MoUs signed for internships, placements, and research collaboration.',
    'color',     'bg-[#0b2545]/15 border-[#0b2545]/30 text-[#0b2545]'
  )
), @admin),

('teqip.milestones', JSON_ARRAY(
  JSON_OBJECT('year','2017','event','SGSITS selected as TEQIP-III beneficiary institution',                                 'type','milestone'),
  JSON_OBJECT('year','2017','event','Sanction of ₹14 Crores from World Bank & Govt. of India',                             'type','funding'),
  JSON_OBJECT('year','2018','event','Launch of 6 new upgraded laboratories — Electronics & IT blocks',                     'type','infra'),
  JSON_OBJECT('year','2018','event','First batch of 40 faculty complete FDPs at IIT Bombay, IIT Delhi',                    'type','academic'),
  JSON_OBJECT('year','2019','event','3 undergraduate programs receive NBA accreditation',                                   'type','milestone'),
  JSON_OBJECT('year','2019','event','First Annual Industry-Academia Conclave held — 50+ companies participated',            'type','academic'),
  JSON_OBJECT('year','2020','event','Transition to online STTP and workshops during COVID-19 pandemic',                    'type','academic'),
  JSON_OBJECT('year','2020','event','Research output: 85 publications in Scopus-indexed journals',                          'type','milestone'),
  JSON_OBJECT('year','2021','event','TEQIP-III project period concluded with successful audit',                             'type','milestone'),
  JSON_OBJECT('year','2021','event','Final utilization certificate submitted — 98.7% funds utilized',                       'type','funding')
), @admin),

('teqip.activities', JSON_ARRAY(
  JSON_OBJECT('category','Industry Interaction', 'items', JSON_ARRAY(
    'Annual Industry-Academia Conclave with 80+ companies',
    'Expert lectures by industry professionals (200+ sessions)',
    'MoU signing with TCS, Infosys, L&T, BHEL, NTPC, and others',
    'Industrial visits for students across all semesters',
    'Internship facilitation with stipend support'
  )),
  JSON_OBJECT('category','Short-Term Training Programs (SSTPs)', 'items', JSON_ARRAY(
    'Advanced VLSI Design (1 week) — 45 faculty participants',
    'Machine Learning & Deep Learning — 3-day intensive',
    'Green Building Technologies — 5-day program',
    'Research Methodology & Technical Writing — Annual',
    'Outcome-Based Education (OBE) Implementation — For all HODs'
  )),
  JSON_OBJECT('category','Workshops', 'items', JSON_ARRAY(
    'National Workshop on Additive Manufacturing (3D Printing)',
    'IoT and Embedded Systems for Industry 4.0',
    'Renewable Energy Systems — Solar & Wind',
    'Entrepreneurship Development Program (EDP)',
    'Competitive Examination Guidance for GATE/PSUs'
  )),
  JSON_OBJECT('category','Bridge & Remedial Courses', 'items', JSON_ARRAY(
    'Mathematics Bridge Course for lateral entry students',
    'Communication Skills & Technical English',
    'Computer Programming Fundamentals',
    'Engineering Drawing and CAD basics',
    'Soft skills and personality development modules'
  ))
), @admin),

('teqip.downloads', JSON_ARRAY(
  JSON_OBJECT('title','TEQIP-III Institutional Development Plan (IDP)',   'size','2.4 MB','type','PDF','url',NULL),
  JSON_OBJECT('title','TEQIP-III Final Report — SGSITS Indore',           'size','5.1 MB','type','PDF','url',NULL),
  JSON_OBJECT('title','TEQIP Lab Upgradation Details',                     'size','1.8 MB','type','PDF','url',NULL),
  JSON_OBJECT('title','Faculty Development Activities Report',              'size','3.2 MB','type','PDF','url',NULL),
  JSON_OBJECT('title','Student Training Programs Summary',                  'size','1.1 MB','type','PDF','url',NULL),
  JSON_OBJECT('title','Procurement Reports & Audited Statements',           'size','4.7 MB','type','PDF','url',NULL)
), @admin),

-- ── Startup Cell Section ──────────────────────────────────────────────────────
('startup.overview', JSON_OBJECT(
  'title',          'SGSITS Startup & Innovation Cell',
  'subtitle',       'Entrepreneurship & Innovation',
  'description',    'Recognized under Startup India and Startup MP initiatives, we fuel student entrepreneurs from idea to market — with mentorship, funding, and infrastructure.',
  'contactEmail',   'startup@sgsits.ac.in',
  'contactPhone',   '+91-731-2431300',
  'applicationUrl', 'startup.sgsits.ac.in',
  'externalLinks', JSON_ARRAY(
    JSON_OBJECT('label','Startup India',   'url','https://www.startupindia.gov.in'),
    JSON_OBJECT('label','Startup MP',      'url','https://www.mpstartupcell.mp.gov.in'),
    JSON_OBJECT('label','AICTE IDEA Hub',  'url','https://aicte-india.org/ideahub')
  )
), @admin),

('startup.stats', JSON_ARRAY(
  JSON_OBJECT('value','15',      'label','Startups Incubated', 'iconName','Rocket'),
  JSON_OBJECT('value','₹12 Cr', 'label','Funding Raised',     'iconName','TrendingUp'),
  JSON_OBJECT('value','80+',     'label','Jobs Created',       'iconName','Users'),
  JSON_OBJECT('value','3',       'label','Patents Filed',      'iconName','Award')
), @admin),

('startup.portfolio', JSON_ARRAY(
  JSON_OBJECT(
    'name',       'EduTrack AI',
    'sector',     'EdTech',
    'year',       '2022',
    'funding',    '₹1.5 Cr',
    'stage',      'Seed',
    'founders',   'Rohan Sharma & Priya Mishra (SGSITS Alumni)',
    'description','AI-powered learning management system that personalizes study paths for engineering students using adaptive algorithms. Currently serving 15,000+ students across 8 colleges in Madhya Pradesh.',
    'iconName',   'BookOpen'
  ),
  JSON_OBJECT(
    'name',       'GreenGrid Solutions',
    'sector',     'CleanTech',
    'year',       '2023',
    'funding',    '₹2.8 Cr',
    'stage',      'Pre-Series A',
    'founders',   'Ankit Joshi & Team (SGSITS E&I)',
    'description','Smart energy management platform for industries and commercial buildings. Uses IoT sensors and ML to reduce energy wastage by up to 35%. Deployed in 20+ manufacturing units across central India.',
    'iconName',   'Wifi'
  ),
  JSON_OBJECT(
    'name',       'MediScan Pro',
    'sector',     'HealthTech',
    'year',       '2021',
    'funding',    '₹3.2 Cr',
    'stage',      'Series A',
    'founders',   'Dr. Kavya Tiwari & Saurabh Patel (SGSITS CS)',
    'description','Medical imaging AI platform that assists radiologists in detecting abnormalities in X-rays and MRI scans with 94.7% accuracy. Integrated with 12 hospitals across Indore, Bhopal, and Jabalpur.',
    'iconName',   'Heart'
  ),
  JSON_OBJECT(
    'name',       'AgroSense',
    'sector',     'AgriTech',
    'year',       '2024',
    'funding',    '₹80 L',
    'stage',      'Pre-Seed',
    'founders',   'Vivek Kumar & Neha Singh (SGSITS EC)',
    'description','IoT-based precision agriculture solution providing real-time soil health monitoring, weather alerts, and crop advisory for small farmers. Pilot deployed across 400 acres in Malwa region.',
    'iconName',   'Sprout'
  )
), @admin),

('startup.facilities', JSON_ARRAY(
  JSON_OBJECT('iconName','Building2',   'title','Co-working Space',     'desc','5,000 sq ft of dedicated co-working infrastructure with high-speed internet, meeting rooms, and 24×7 access for incubated startups.'),
  JSON_OBJECT('iconName','Users',       'title','Expert Mentorship',    'desc','Access to 50+ mentors including serial entrepreneurs, VCs, industry veterans, and SGSITS faculty with domain expertise.'),
  JSON_OBJECT('iconName','TrendingUp',  'title','Seed Funding',         'desc','Selected startups can access seed grants up to ₹5 Lakhs from SGSITS Startup Fund and facilitated connections to angel investors and Startup MP.'),
  JSON_OBJECT('iconName','Scale',       'title','Legal Support',        'desc','Free legal advisory for company incorporation, term sheet review, trademark registration, and compliance with startup-specific regulations.'),
  JSON_OBJECT('iconName','Shield',      'title','IP & Patent Support',  'desc','End-to-end patent filing assistance with faculty advisors and SGSITS Technology Transfer Office. Filing fee subsidized up to 70%.'),
  JSON_OBJECT('iconName','FlaskConical','title','Lab Access',            'desc','Access to departmental labs for prototyping — electronics, mechanical, chemistry, and computing labs with equipment support.')
), @admin),

('startup.apply_steps', JSON_ARRAY(
  JSON_OBJECT('step','01','title','Submit Application','desc','Fill the online Startup Incubation Application form at startup.sgsits.ac.in or collect a physical form from the Startup Cell office.'),
  JSON_OBJECT('step','02','title','Screening & Review','desc','The Startup Cell committee evaluates your application for innovation potential, feasibility, and social or commercial impact within 7 working days.'),
  JSON_OBJECT('step','03','title','Pitch Presentation','desc','Shortlisted applicants present their idea to a panel of mentors, faculty, and external investors in a 15-minute pitch session.'),
  JSON_OBJECT('step','04','title','Onboarding',        'desc','Selected startups sign an incubation agreement, receive their co-working space allocation, and are assigned a dedicated mentor for the 6-month program.')
), @admin)

ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

SET foreign_key_checks = 1;
