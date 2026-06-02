-- =============================================================================
-- SGSITS Seed 12: Core CMS — branding, contact, topbar, institution stats,
--                  about content, landing page content, navigation, SEO
-- Run AFTER: seed_sgsits_11_departments.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

-- ─── 1. Site Settings ─────────────────────────────────────────────────────────
INSERT INTO site_settings (`key`, value, updated_by) VALUES
  ('helpline',           '+91-731-2582100',                         @admin),
  ('registrar_email',    'registrar@sgsits.ac.in',                  @admin),
  ('institute_code',     '1752',                                    @admin),
  ('erp_portal_url',     'https://erp.sgsitsindore.in',             @admin),
  ('erp_portal_label',   'ERP Portal',                              @admin),
  ('youtube_channel',    'https://www.youtube.com/@sgsitsindore',   @admin),
  ('maps_embed_url',     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.0!2d75.8702!3d22.7142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd89febd0d8b%3A0xa69c58cb03d87d08!2sSGSITS%2C%20Indore!5e0!3m2!1sen!2sin!4v1701000000000!5m2!1sen!2sin', @admin),
  ('maps_link',          'https://maps.google.com/?q=SGSITS+Indore+Park+Road+452003', @admin),
  ('anti_ragging_helpline', '1800-180-5522',                        @admin),
  ('anti_ragging_email', 'antiranging@sgsits.ac.in',               @admin),
  ('dean_sw_phone',      '0731-2582105',                            @admin),
  ('exam_cell_phone',    '0731-2582106',                            @admin),
  ('hostel_admin_phone', '0731-2582220',                            @admin),
  ('dispensary_phone',   '0731-2582210',                            @admin),
  ('tpo_email',          'tpo@sgsits.ac.in',                       @admin),
  ('purchase_email',     'purchase@sgsits.ac.in',                   @admin),
  ('purchase_phone',     '0731-2582115',                            @admin),
  ('teqip_email',        'teqip@sgsits.ac.in',                     @admin),
  ('teqip_phone',        '0731-2431234 Extn. 210',                  @admin),
  ('startup_email',      'startup@sgsits.ac.in',                    @admin),
  ('startup_phone',      '+91-731-2431300',                         @admin),
  ('video_tour_id',      'SGSITSVideoTourID',                       @admin)
ON DUPLICATE KEY UPDATE value=VALUES(value), updated_by=VALUES(updated_by);

-- ─── 2. CMS Sections ──────────────────────────────────────────────────────────

-- Footer branding
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
  ('footer.branding', JSON_OBJECT(
    'shortCode',    'SG',
    'estYear',      'Est. 1952',
    'instituteName','Shri G. S. Institute of Technology & Science',
    'shortName',    'SGSITS INDORE',
    'tagline',      'An Institute of National Standing',
    'subTagline',   'Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952',
    'description',  'Shri G. S. Institute of Technology & Science (SGSITS) Indore is a premier autonomous engineering institute established in 1952, affiliated to RGPV and approved by AICTE, NAAC accredited with ''A'' grade.',
    'logoUrl',      '/assets/image.png',
    'logoAlt',      'SGSITS Indore Logo',
    'website',      'www.sgsits.ac.in',
    'copyrightText','© 2025 SGSITS Indore. All rights reserved.'
  ), @admin),

  ('footer.contact', JSON_OBJECT(
    'address', '23, Park Road, Indore (M.P.) - 452003',
    'city',    'Indore',
    'state',   'Madhya Pradesh',
    'pincode', '452003',
    'phone',   '0731-2541370',
    'fax',     '0731-2541370',
    'email',   'info@sgsits.ac.in',
    'website', 'www.sgsits.ac.in'
  ), @admin),

  -- Topbar (headerbar) settings
  ('topbar', JSON_OBJECT(
    'helpline',      '+91-731-2582100',
    'email',         'registrar@sgsits.ac.in',
    'instituteCode', '1752',
    'erpPortalUrl',  'https://erp.sgsitsindore.in',
    'erpPortalLabel','ERP Portal'
  ), @admin),

  -- Contact info for contactService.getContactData()
  ('contact.info', JSON_OBJECT(
    'address',    '23, Park Road, Indore (M.P.) - 452003',
    'phone',      '0731-2541370',
    'email',      'info@sgsits.ac.in',
    'fax',        '0731-2541370',
    'website',    'www.sgsits.ac.in',
    'mapEmbedUrl','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.0!2d75.8702!3d22.7142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd89febd0d8b%3A0xa69c58cb03d87d08!2sSGSITS%2C%20Indore!5e0!3m2!1sen!2sin!4v1701000000000!5m2!1sen!2sin',
    'offices', JSON_ARRAY(
      JSON_OBJECT(
        'name',    'Main Office',
        'address', '23, Park Road, Indore (M.P.) - 452003',
        'phone',   '0731-2541370',
        'email',   'info@sgsits.ac.in',
        'hours',   'Monday – Saturday: 10:00 AM – 5:00 PM'
      ),
      JSON_OBJECT(
        'name',    'Admissions Office',
        'address', 'Academic Block, Ground Floor',
        'phone',   '0731-2582401',
        'email',   'admissions@sgsits.ac.in',
        'hours',   'Monday – Saturday: 10:00 AM – 4:00 PM'
      ),
      JSON_OBJECT(
        'name',    'Examination Cell',
        'phone',   '0731-2582106',
        'email',   'examcell@sgsits.ac.in',
        'hours',   'Monday – Saturday: 10:00 AM – 4:00 PM'
      ),
      JSON_OBJECT(
        'name',    'Training & Placement Office',
        'phone',   '0731-2582105',
        'email',   'tpo@sgsits.ac.in',
        'hours',   'Monday – Friday: 10:00 AM – 5:00 PM'
      ),
      JSON_OBJECT(
        'name',    'Registrar Office',
        'phone',   '+91-731-2582100',
        'email',   'registrar@sgsits.ac.in',
        'hours',   'Monday – Saturday: 10:00 AM – 5:00 PM'
      ),
      JSON_OBJECT(
        'name',    'Anti-Ragging Helpline',
        'phone',   '1800-180-5522',
        'email',   'antiranging@sgsits.ac.in',
        'hours',   '24x7 (Toll-Free)'
      ),
      JSON_OBJECT(
        'name',    'Dean Student Welfare',
        'phone',   '0731-2582105',
        'email',   'dsw@sgsits.ac.in'
      ),
      JSON_OBJECT(
        'name',    'Hostel Administration',
        'phone',   '0731-2582220',
        'email',   'hostel@sgsits.ac.in'
      ),
      JSON_OBJECT(
        'name',    'Dispensary',
        'phone',   '0731-2582210'
      ),
      JSON_OBJECT(
        'name',    'Purchase / Tender Office',
        'phone',   '0731-2582115',
        'email',   'purchase@sgsits.ac.in'
      ),
      JSON_OBJECT(
        'name',    'TEQIP Cell',
        'phone',   '0731-2431234 Extn. 210',
        'email',   'teqip@sgsits.ac.in'
      ),
      JSON_OBJECT(
        'name',    'Startup & Innovation Cell',
        'phone',   '+91-731-2431300',
        'email',   'startup@sgsits.ac.in'
      )
    )
  ), @admin),

  -- Institution statistics
  ('institution.stats', JSON_OBJECT(
    'items', JSON_ARRAY(
      JSON_OBJECT('value', '70',   'suffix', '+', 'label', 'Years of Excellence'),
      JSON_OBJECT('value', '5000', 'suffix', '+', 'label', 'Students Enrolled'),
      JSON_OBJECT('value', '17',   'suffix', '',  'label', 'Departments'),
      JSON_OBJECT('value', '300',  'suffix', '+', 'label', 'Faculty & Staff')
    )
  ), @admin),

  -- Department overview stats (for DepartmentLanding.tsx)
  ('departments.stats', JSON_OBJECT(
    'deptCount',    '17',
    'facultyCount', '200+',
    'studentCount', '3,000+',
    'yearsLegacy',  '70+ Years'
  ), @admin),

  -- Institution timeline (AboutLanding.tsx)
  ('institution.timeline', JSON_ARRAY(
    JSON_OBJECT('year', '1952', 'title', 'Institute Founded',
      'description', 'SGSITS established as a premier technical institute in Indore, M.P., with initial departments of Civil, Mechanical, and Electrical Engineering.'),
    JSON_OBJECT('year', '1975', 'title', 'Campus Expansion',
      'description', 'Major infrastructure expansion including new academic blocks, laboratories, and hostel facilities to accommodate growing student strength.'),
    JSON_OBJECT('year', '1990', 'title', 'Autonomous Status',
      'description', 'SGSITS granted autonomous institute status by RGPV, enabling academic flexibility and curriculum innovation.'),
    JSON_OBJECT('year', '2000', 'title', 'NBA Accreditation',
      'description', 'National Board of Accreditation (NBA) accorded accreditation to key engineering programmes, recognising quality standards.'),
    JSON_OBJECT('year', '2015', 'title', 'NAAC Grading',
      'description', 'National Assessment and Accreditation Council (NAAC) awarded SGSITS an ''A'' grade, reflecting excellence in teaching, research, and governance.'),
    JSON_OBJECT('year', '2024', 'title', 'Innovation Center',
      'description', 'Inauguration of the AICTE IDEA Lab and Startup & Innovation Cell, fostering entrepreneurship and cutting-edge research.')
  ), @admin),

  -- Institution highlights (AboutLanding.tsx)
  ('institution.highlights', JSON_ARRAY(
    JSON_OBJECT('title', 'Computer Laboratories',
      'description', '1000+ workstations with high-speed internet across computing labs in AI/ML, networking, and cybersecurity.'),
    JSON_OBJECT('title', 'Central Library',
      'description', '80,000+ books, journals, and digital resources including IEEE Xplore and ScienceDirect access.'),
    JSON_OBJECT('title', 'Research Labs',
      'description', 'Advanced research facilities across all engineering disciplines including materials, biomedical, and renewable energy labs.'),
    JSON_OBJECT('title', 'Sports Complex',
      'description', 'Indoor and outdoor sports facilities including cricket ground, football field, basketball, badminton, and gymnasium.'),
    JSON_OBJECT('title', 'Auditorium',
      'description', '2000-seat auditorium for convocations, seminars, cultural events, and institute day celebrations.'),
    JSON_OBJECT('title', 'Innovation Hub',
      'description', 'AICTE IDEA Lab with 3D printers, IoT kits, robotics workspace, and maker-space resources for student innovators.')
  ), @admin),

  -- About overview (founding narrative)
  ('about.overview', JSON_OBJECT(
    'instituteName',     'Shri Govindram Seksaria Institute of Technology & Science, Indore',
    'shortName',         'SGSITS Indore',
    'foundedYear',       1952,
    'affiliation',       'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
    'approval',          'AICTE, New Delhi',
    'naacGrade',         'A',
    'status',            'Government-Aided Autonomous Institute',
    'campus',            '52 Acres, Park Road, Indore – 452003, Madhya Pradesh',
    'narrative',         'Established in 1952 by the visionary industrialist Late Shri Govindram Seksaria, SGSITS Indore is one of Madhya Pradesh''s premier autonomous engineering institutes. Affiliated to RGPV and approved by AICTE, the institute is NAAC-accredited with Grade ''A'' and holds NBA accreditation for key programmes.',
    'directorQuote',     'At SGSITS, we are committed to nurturing not just engineers but complete human beings capable of addressing the complex challenges of the modern world through innovation, ethics, and excellence.',
    'mission',           'To impart quality technical education enabling students to become competent, responsible, and innovative engineers committed to serving society.',
    'vision',            'To be a globally recognized institute of technology and science that fosters excellence in education, research, and innovation.'
  ), @admin),

  -- About mission/vision
  ('about.vision_mission', JSON_OBJECT(
    'vision',  'To be a globally recognized institute of technology and science that fosters excellence in education, research, and innovation.',
    'mission', 'To impart quality technical education enabling students to become competent, responsible, and innovative engineers committed to serving society.',
    'coreValues', JSON_ARRAY(
      'Excellence in Teaching and Research',
      'Integrity and Ethical Practice',
      'Innovation and Entrepreneurship',
      'Inclusivity and Social Responsibility',
      'Industry Collaboration and Continuous Improvement'
    )
  ), @admin),

  -- Landing page hero/card content
  ('landing.about', JSON_OBJECT(
    'heroTitle',    'About the Institute',
    'heroSubtitle', 'Explore the institute''s history, leadership, governance, and infrastructure.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','About Institute',       'path','/about/institute',          'badge',NULL),
      JSON_OBJECT('title','Vision & Mission',      'path','/about/vision-mission',     'badge',NULL),
      JSON_OBJECT('title','Director''s Message',   'path','/about/director-message',   'badge',NULL),
      JSON_OBJECT('title','Administration',        'path','/about/administration',     'badge',NULL),
      JSON_OBJECT('title','Governing Body',        'path','/about/governing-body',     'badge',NULL),
      JSON_OBJECT('title','Committees',            'path','/about/committees',         'badge',NULL),
      JSON_OBJECT('title','Telephone Directory',   'path','/about/telephone-directory','badge',NULL),
      JSON_OBJECT('title','Infrastructure',        'path','/about/infrastructure',     'badge',NULL),
      JSON_OBJECT('title','Academic Council',      'path','/about/academic-council',   'badge',NULL),
      JSON_OBJECT('title','Accreditation (NBA/NAAC)','path','/about/accreditation',   'badge',NULL),
      JSON_OBJECT('title','IQAC Cell',             'path','/about/iqac',               'badge',NULL)
    )
  ), @admin),

  ('landing.academics', JSON_OBJECT(
    'heroTitle',    'Academics at SGSITS',
    'heroSubtitle', 'Explore academic programmes, calendars, examination policies, and more.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','Academic Calendar',   'path','/academics/calendar',         'badge',NULL),
      JSON_OBJECT('title','UG Courses',          'path','/academics/courses/ug',       'badge',NULL),
      JSON_OBJECT('title','PG Courses',          'path','/academics/courses/pg',       'badge',NULL),
      JSON_OBJECT('title','Ph.D. Programs',      'path','/academics/courses/phd',      'badge',NULL),
      JSON_OBJECT('title','PTDC Courses',        'path','/academics/courses/ptdc',     'badge',NULL),
      JSON_OBJECT('title','Online Courses (MOOC)','path','/academics/courses/online',  'badge',NULL),
      JSON_OBJECT('title','First Year Info',     'path','/academics/first-year',       'badge','New Students'),
      JSON_OBJECT('title','Exam & Results',      'path','/academics/exam-results',     'badge',NULL),
      JSON_OBJECT('title','Ordinances',          'path','/academics/ordinances',       'badge',NULL),
      JSON_OBJECT('title','Plagiarism Policy',   'path','/academics/plagiarism-policy','badge',NULL),
      JSON_OBJECT('title','Code of Ethics',      'path','/academics/code-of-conduct',  'badge',NULL),
      JSON_OBJECT('title','OBE & NEP 2020',      'path','/academics/obe-nep-2020',     'badge',NULL)
    )
  ), @admin),

  ('landing.admissions', JSON_OBJECT(
    'heroTitle',    'Admissions at SGSITS',
    'heroSubtitle', 'Find eligibility criteria, admission processes, and programme details.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','UG Admissions',        'path','/admission/ug',        'badge','JEE Mains'),
      JSON_OBJECT('title','PG Admissions',        'path','/admission/pg',        'badge','GATE / MAT'),
      JSON_OBJECT('title','Ph.D. Admissions',     'path','/admission/phd',       'badge',NULL),
      JSON_OBJECT('title','Prospectus Download',  'path','/admission/prospectus','badge','PDF')
    )
  ), @admin),

  ('landing.placements', JSON_OBJECT(
    'heroTitle',    'Placements at SGSITS',
    'heroSubtitle', 'Explore placement records, leading recruiters, and T&P cell information.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','T&P Cell Overview', 'path','/placement/tnp-cell',  'badge',NULL),
      JSON_OBJECT('title','Leading Recruiters','path','/placement/companies', 'badge',NULL),
      JSON_OBJECT('title','Placement Record',  'path','/placement/record',    'badge',NULL),
      JSON_OBJECT('title','Placement Contacts','path','/placement/contact',   'badge',NULL)
    )
  ), @admin),

  ('landing.campus_life', JSON_OBJECT(
    'heroTitle',    'Campus Life at SGSITS',
    'heroSubtitle', 'Experience a vibrant campus with student activities, clubs, and opportunities.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','Student Activities',      'description','Clubs, technical fests, cultural events, and co-curricular activities.',                                'path','/students/activities'),
      JSON_OBJECT('title','Govt. Scholarships',      'description','Government scholarships, financial aid schemes, and eligibility criteria.',                            'path','/students/scholarship/govt'),
      JSON_OBJECT('title','Institute Scholarships',  'description','Merit-based and need-based scholarships for enrolled SGSITS students.',                               'path','/students/scholarship/institute'),
      JSON_OBJECT('title','Sports & Games (SSS)',    'description','Sports & Student Services facilities, teams, achievements and annual events.',                        'path','/students/sss'),
      JSON_OBJECT('title','NCC Wing',                'description','National Cadet Corps — develop leadership, discipline and patriotic values.',                          'path','/students/ncc'),
      JSON_OBJECT('title','NSS Wing',                'description','Community service, health camps, and social initiatives through the NSS.',                           'path','/students/nss')
    )
  ), @admin),

  ('landing.facilities', JSON_OBJECT(
    'heroTitle',    'Campus Facilities',
    'heroSubtitle', 'Explore world-class facilities including labs, library, hostels, and sports complex.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','Computer Center',   'description','High-speed internet and modern workstations across campus labs.',                                'path','/facilities/computer-center','badge',NULL),
      JSON_OBJECT('title','Central Library',   'description','A vast collection of books, journals, e-resources and reading rooms.',                         'path','/facilities/library','badge',NULL),
      JSON_OBJECT('title','Central Workshop',  'description','Practical training in machining, welding, and fabrication.',                                   'path','/facilities/workshop','badge',NULL),
      JSON_OBJECT('title','Gymnasium',         'description','Modern gymnasium with professional equipment for fitness and wellness.',                        'path','/facilities/gymnasium','badge',NULL),
      JSON_OBJECT('title','Dispensary',        'description','On-campus health dispensary for first aid and basic medical care.',                            'path','/facilities/dispensary','badge',NULL),
      JSON_OBJECT('title','CIDI Center',       'description','Centre for Innovation, Design and Incubation fostering entrepreneurship.',                     'path','/facilities/cidi','badge',NULL),
      JSON_OBJECT('title','Sports Complex',    'description','Outdoor and indoor sports facilities including courts, tracks and grounds.',                   'path','/facilities/sports','badge',NULL),
      JSON_OBJECT('title','Boys Hostel',       'description','Comfortable and secure hostel with mess facilities for male students.',                        'path','/facilities/hostel/boys','badge',NULL),
      JSON_OBJECT('title','Girls Hostel',      'description','Safe and well-equipped hostel with mess facilities for female students.',                      'path','/facilities/hostel/girls','badge',NULL),
      JSON_OBJECT('title','Transit Hostel',    'description','Short-stay accommodation for visiting faculty, guests, and candidates.',                       'path','/facilities/hostel/transit','badge',NULL),
      JSON_OBJECT('title','Staff Quarters',    'description','Residential quarters for faculty and non-teaching staff on campus.',                           'path','/facilities/hostel/staff','badge',NULL),
      JSON_OBJECT('title','AICTE IDEA Lab',    'description','Innovation lab with 3D printers, IoT kits and maker-space resources.',                        'path','/facilities/idea-lab','badge','AICTE')
    )
  ), @admin),

  ('landing.more', JSON_OBJECT(
    'heroTitle',    'More from SGSITS',
    'heroSubtitle', 'Access notices, news, events, tenders, the startup cell, TEQIP portal, and more.',
    'cards', JSON_ARRAY(
      JSON_OBJECT('title','Startup & Incubation Cell','description','Startup ecosystem, incubation support and entrepreneurship programmes.','path','/startup-cell','badge',NULL),
      JSON_OBJECT('title','TEQIP Portal',             'description','Technical Education Quality Improvement Programme initiatives.',        'path','/teqip/about','badge',NULL),
      JSON_OBJECT('title','Latest Notices',           'description','Official notices, circulars, and announcements from the institute.',    'path','/notices','badge','Live'),
      JSON_OBJECT('title','Campus News',              'description','Latest news, achievements, awards, and events across the SGSITS campus.','path','/news','badge',NULL),
      JSON_OBJECT('title','Upcoming Events',          'description','Seminars, workshops, technical fests and cultural programmes on campus.','path','/events','badge',NULL),
      JSON_OBJECT('title','Procurement Tenders',      'description','Active procurement tenders and official vendor notices from the institute.','path','/tenders','badge',NULL),
      JSON_OBJECT('title','Contact Us',               'description','Reach out via phone, email, or visit us at our campus in Indore, M.P.','path','/contact','badge',NULL)
    )
  ), @admin),

  -- Academic first-year info
  ('academic.first_year', JSON_OBJECT(
    'welcomeText', 'Congratulations on your admission to Shri G. S. Institute of Technology & Science. All B.Tech students undergo a common first year before branching into their respective departments from the 2nd year.',
    'checklist', JSON_ARRAY(
      JSON_OBJECT('item','Institute Registration & Fee Payment',                  'when','Day 1–2'),
      JSON_OBJECT('item','Student Identity Card collection',                       'when','Day 2'),
      JSON_OBJECT('item','Library Card enrollment',                                'when','Day 3'),
      JSON_OBJECT('item','Hostel allotment (if applicable)',                       'when','Day 1–3'),
      JSON_OBJECT('item','Anti-ragging affidavit submission (mandatory)',           'when','Day 1'),
      JSON_OBJECT('item','Faculty mentor assignment & first meeting',              'when','Day 4–5'),
      JSON_OBJECT('item','Orientation program attendance',                         'when','Day 1–3'),
      JSON_OBJECT('item','Computer Center registration for email ID',             'when','Week 1')
    ),
    'subjects', JSON_ARRAY(
      JSON_OBJECT('code','MA-101','subject','Engineering Mathematics – I',              'credits',4),
      JSON_OBJECT('code','PH-101','subject','Engineering Physics',                      'credits',4),
      JSON_OBJECT('code','CH-101','subject','Engineering Chemistry',                    'credits',4),
      JSON_OBJECT('code','CS-101','subject','Programming Fundamentals (C Language)',    'credits',3),
      JSON_OBJECT('code','ME-101','subject','Engineering Graphics & Drawing',           'credits',3),
      JSON_OBJECT('code','BE-101','subject','Basic Electrical Engineering',             'credits',3),
      JSON_OBJECT('code','HU-101','subject','Communication Skills & Technical Writing', 'credits',2),
      JSON_OBJECT('code','ME-102','subject','Workshop Practice',                        'credits',2)
    ),
    'contacts', JSON_ARRAY(
      JSON_OBJECT('label','Anti-Ragging Helpline','phone','1800-180-5522',   'email','antiranging@sgsits.ac.in','note','24×7, Toll-Free'),
      JSON_OBJECT('label','Dean Student Welfare', 'phone','0731-2582105',    'email','dsw@sgsits.ac.in'),
      JSON_OBJECT('label','Exam Cell',             'phone','0731-2582106',   'email','examcell@sgsits.ac.in'),
      JSON_OBJECT('label','Hostel Administration', 'phone','0731-2582220',   'email','hostel@sgsits.ac.in'),
      JSON_OBJECT('label','Dispensary',            'phone','0731-2582210',   'email',NULL)
    )
  ), @admin),

  -- Exam results / schedules
  ('academic.exam_results', JSON_OBJECT(
    'erpPortalUrl',      'https://erp.sgsitsindore.in',
    'reEvaluationNote',  'Applications for re-evaluation/re-checking must be submitted within 15 days of official result declaration.',
    'schedules', JSON_ARRAY(
      JSON_OBJECT('type','Mid-Semester Examination','months','September (Sem 1) / February (Sem 2)','note','2 hours duration'),
      JSON_OBJECT('type','End-Semester Examination', 'months','November–December (Sem 1) / April–May (Sem 2)','note','3 hours duration'),
      JSON_OBJECT('type','Supplementary Examination','months','July / August','note','For students with back-papers')
    )
  ), @admin),

  -- Campus map data
  ('campus.map', JSON_OBJECT(
    'address',  '23 Park Road Indore 452003',
    'phone',    '+91-731-2431000',
    'altPhone', '+91-731-2431234',
    'email',    'info@sgsits.ac.in',
    'mapsLink', 'https://maps.google.com/?q=SGSITS+Indore',
    'mapsEmbed','https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3681.0!2d75.8702!3d22.7142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd89febd0d8b%3A0xa69c58cb03d87d08!2sSGSITS%2C%20Indore!5e0!3m2!1sen!2sin!4v1701000000000!5m2!1sen!2sin',
    'campusFacts', JSON_ARRAY(
      JSON_OBJECT('label','Campus Area',      'value','52 Acres'),
      JSON_OBJECT('label','Established',      'value','1952'),
      JSON_OBJECT('label','Academic Blocks',  'value','15+'),
      JSON_OBJECT('label','Hostel Blocks',    'value','7')
    ),
    'buildings', JSON_ARRAY(
      JSON_OBJECT('name','Main Building',      'description','Administrative offices, principal''s office, conference halls, and main auditorium with 2000-seat capacity.','specs','Built 1952 | 4 Floors'),
      JSON_OBJECT('name','Computer Science Block','description','Modern computing facility with AI/ML lab, cybersecurity lab, networking lab, and 1000+ workstations.','specs','Area: 8,000 sq ft'),
      JSON_OBJECT('name','Central Library',    'description','Home to 80,000+ volumes including books, journals, e-resources, and digital access to IEEE Xplore, ScienceDirect.','specs','80,000+ books'),
      JSON_OBJECT('name','Engineering Workshops','description','Fully equipped central workshop for mechanical, civil, and electrical practical training and manufacturing.','specs','Area: 12,000 sq ft'),
      JSON_OBJECT('name','Sports Complex',     'description','Comprehensive sports infrastructure including cricket ground, football field, basketball courts, and indoor gymnasium.','specs','Area: 5 Acres'),
      JSON_OBJECT('name','Student Hostels',    'description','Three boys'' hostels accommodating 1,200+ students and one girls'' hostel with 350+ seats, all with mess facilities.','specs','1,200+ students')
    )
  ), @admin),

  -- Video tour config
  ('video.tour', JSON_OBJECT(
    'youtubeVideoId',  'SGSITSCampusTourVideo',
    'youtubeChannel',  'https://www.youtube.com/@sgsitsindore',
    'tourStops', JSON_ARRAY(
      JSON_OBJECT('title','Main Entrance & Administrative Block','description','The iconic main entrance with the administrative block housing principal''s office, registrar, and finance offices.','imageUrl','/assets/campus/main-entrance.jpg'),
      JSON_OBJECT('title','Central Library',                    'description','Our state-of-the-art central library with 80,000+ books, e-journals, and 24-hour digital access zones.','imageUrl','/assets/campus/library.jpg'),
      JSON_OBJECT('title','Engineering Workshops',              'description','Fully equipped central workshop complex for practical training in machining, welding, and fabrication.','imageUrl','/assets/campus/workshop.jpg'),
      JSON_OBJECT('title','Sports Facilities',                  'description','Expansive 5-acre sports complex with cricket ground, football field, indoor gymnasium, and courts.','imageUrl','/assets/campus/sports.jpg')
    )
  ), @admin),

  -- Anthem metadata
  ('anthem.metadata', JSON_OBJECT(
    'title',          'SGSITS Kulgeet',
    'subtitle',       'Official Anthem of SGSITS Indore',
    'year',           'Composed in 2001',
    'duration',       '3:42',
    'raga',           'Yaman Kalyan',
    'lyrics',         JSON_OBJECT('name','Dr. R.K. Sharma',            'department','Humanities Department, SGSITS'),
    'composition',    JSON_OBJECT('name','Pt. Ravi Shankar Das',        'role','Classical Musician'),
    'vocals',         JSON_OBJECT('name','Smt. Kavita Krishnamurthy',  'role','Padma Shri Awardee, Bollywood Playback Singer'),
    'audioUrl',       NULL
  ), @admin),

  -- Placement T&P cell info
  ('placement.cell_info', JSON_OBJECT(
    'aboutText',   'The Training & Placement Cell at SGSITS Indore has been instrumental in connecting students with leading organizations across sectors. With a dedicated team of placement coordinators and strong industry relationships, the cell ensures maximum placement opportunities for graduating students.',
    'subtitle',    'Career Development & Campus Recruitment — SGSITS Indore',
    'topPackage',  '₹48 LPA',
    'companyCount','Over 180+ companies visit SGSITS campus annually'
  ), @admin),

  ('placement.office_info', JSON_OBJECT(
    'address', 'Training & Placement Cell, Ground Floor, Main Building, SGSITS, 23 Park Road, Indore – 452003',
    'phone',   '+91-731-2582105',
    'email',   'tpo@sgsits.ac.in',
    'hours',   'Monday – Friday: 10:00 AM – 5:00 PM'
  ), @admin),

  ('placement.contacts', JSON_OBJECT(
    'contacts', JSON_ARRAY(
      JSON_OBJECT('name','Training & Placement Officer','designation','T&P Officer','email','tpo@sgsits.ac.in','phone','+91-731-2582105'),
      JSON_OBJECT('name','Placement Coordinator',       'designation','Coordinator','email','placement@sgsits.ac.in','phone','+91-731-2582106')
    )
  ), @admin),

  -- Admission CMS
  ('admissions.ug', JSON_OBJECT(
    'heading',    'UG Admissions',
    'eligibility','Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics (PCM) with minimum 45% aggregate marks. JEE Main 2025 qualified. Indian nationals and OCI/PIO card holders.',
    'process', JSON_ARRAY(
      'Register on MPDTE Online Counselling Portal',
      'Select SGSITS Indore in institute preference',
      'Document verification at institute',
      'Fee payment and admission confirmation'
    ),
    'reservationNote','SC/ST/OBC/EWS reservations as per Government norms of Madhya Pradesh.',
    'feeNote','Fees as approved by the Fee Regulatory Committee, Govt. of Madhya Pradesh.',
    'academicYear','2025–26'
  ), @admin),

  ('admissions.pg', JSON_OBJECT(
    'heading','PG Admissions',
    'programmes', JSON_ARRAY('M.Tech (GATE-based)','MCA (MP MCA CET)','MBA (CAT/MAT/MP MAT)'),
    'eligibility','B.E./B.Tech. with minimum 55% marks for M.Tech. GATE qualified preferred. For MBA, any graduate with minimum 50% marks.'
  ), @admin),

  ('admissions.phd', JSON_OBJECT(
    'heading','Ph.D. Admissions',
    'eligibility','M.Tech./M.E./MCA/MBA with minimum 55% marks. NET/GATE qualified candidates preferred. Research proposals evaluated by departmental committee.',
    'note','Ph.D. admissions are through RGPV. Candidates must register at RGPV and indicate SGSITS as affiliated institution.'
  ), @admin)

ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

SET foreign_key_checks = 1;
