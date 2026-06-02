-- =============================================================================
-- SGSITS Seed 19: Complete Home Page CMS — All sections that drive Home.tsx
--
-- This seed makes the Home page 100% backend-driven by populating every
-- CMS section key read by contentService.ts / settingsService.ts.
--
-- Section keys (dot-notation, as the frontend reads them via getCmsSection):
--   home.sections       — section visibility & display order
--   home.hero           — hero banner, slider images, tiles
--   home.about          — about-the-institute panel
--   home.director       — director's corner card
--   home.news           — campus news section heading/config
--   home.academics      — academic programmes (3 cards)
--   home.departments    — all 17 department quick-links
--   home.stats          — parallax statistics banner
--   home.campus_life    — campus facilities (3 cards)
--   home.faqs           — FAQ accordion items
--   home.gallery        — gallery section heading/config
--   home.seo            — SEO for the home page (read by home.seo key)
--   seo                 — global SEO map (read by PageSeo via seoService)
--   ui_labels           — global UI text labels (announcements heading, badges…)
--
-- Run AFTER:
--   schema.sql, migrations 001-015, seed_sgsits_11_departments.sql,
--   seed_sgsits_12_cms_branding.sql, seed_enterprise_08_cms_global.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

-- =============================================================================
-- 1. home.sections — Controls which sections render and in what order.
--    Matches the type strings checked by isSectionEnabled() in Home.tsx.
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.sections', JSON_ARRAY(
  JSON_OBJECT('id', 'hero',         'type', 'hero',         'enabled', TRUE,  'order', 1),
  JSON_OBJECT('id', 'about',        'type', 'about',        'enabled', TRUE,  'order', 2),
  JSON_OBJECT('id', 'news',         'type', 'news',         'enabled', TRUE,  'order', 3),
  JSON_OBJECT('id', 'academics',    'type', 'academics',    'enabled', TRUE,  'order', 4),
  JSON_OBJECT('id', 'departments',  'type', 'departments',  'enabled', TRUE,  'order', 5),
  JSON_OBJECT('id', 'stats',        'type', 'stats',        'enabled', TRUE,  'order', 6),
  JSON_OBJECT('id', 'campus_life',  'type', 'campus_life',  'enabled', TRUE,  'order', 7),
  JSON_OBJECT('id', 'faqs_gallery', 'type', 'faqs_gallery', 'enabled', TRUE,  'order', 8)
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 2. home.hero — Slider images, overlay text, and the 4 hero tiles.
--
--   hero.instituteName  → small uppercase label above title
--   hero.welcomeText    → first line of <h1>
--   hero.accentText     → second line of <h1> in gold italic
--   hero.images[]       → slider image URLs (first used if array; else imageUrl)
--   hero.imagePosition  → CSS background-position value
--   hero.tiles[]        → 4 quick-nav tiles shown below hero
--       tile.iconName   → one of: FlaskConical Rocket Newspaper Landmark
--                         BookOpen GraduationCap Microscope Users Building FileText
--       tile.title      → tile heading (bold uppercase)
--       tile.subtitle   → tile description line
--       tile.dark       → true = navy bg + gold icon; false = white bg + navy icon
--       tile.path       → Link destination
--       tile.enabled    → admin can hide a tile without deleting it
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.hero', JSON_OBJECT(
  'instituteName',  'Government-Aided Autonomous Institute · Indore, M.P.',
  'welcomeText',    'Engineering',
  'accentText',     'Excellence & Innovation',
  'imageUrl',       '/assets/hero.png',
  'images',         JSON_ARRAY(
    '/assets/hero.png'
  ),
  'imagePosition',  'center 30%',
  'tiles', JSON_ARRAY(
    JSON_OBJECT(
      'id',       'tile-academics',
      'iconName', 'GraduationCap',
      'title',    'Academic Programmes',
      'subtitle', 'B.E. · M.Tech. · MCA · MBA · Ph.D.',
      'dark',     TRUE,
      'path',     '/academics',
      'enabled',  TRUE
    ),
    JSON_OBJECT(
      'id',       'tile-research',
      'iconName', 'FlaskConical',
      'title',    'Research & Labs',
      'subtitle', 'AICTE IDEA Lab · 9 Research Labs · Innovation Hub',
      'dark',     FALSE,
      'path',     '/facilities/idea-lab',
      'enabled',  TRUE
    ),
    JSON_OBJECT(
      'id',       'tile-placements',
      'iconName', 'Rocket',
      'title',    'Placements 2024-25',
      'subtitle', '86% Placement Rate · 406 Placed · 28 LPA Highest',
      'dark',     FALSE,
      'path',     '/placements',
      'enabled',  TRUE
    ),
    JSON_OBJECT(
      'id',       'tile-campus',
      'iconName', 'Users',
      'title',    'Campus Life',
      'subtitle', 'Hostels · Library · Sports · NCC · NSS',
      'dark',     TRUE,
      'path',     '/students/activities',
      'enabled',  TRUE
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 3. home.about — The "About the Institute" panel.
--
--   about.label            → small gold label above heading
--   about.heading          → section <h2> text
--   about.accentText       → italic accent word appended to heading
--   about.body             → paragraph text
--   about.primaryButton    → { label, to }
--   about.secondaryButton  → { label, to }
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.about', JSON_OBJECT(
  'label',      'About the Institute',
  'heading',    'Shri G.S. Institute of',
  'accentText', 'Technology & Science',
  'body',       'Established in 1952 by the visionary industrialist Late Shri Govindram Seksaria, SGSITS Indore is one of Madhya Pradesh''s premier autonomous engineering institutes. Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) and approved by AICTE, the institute is NAAC-accredited with Grade ''A'' and holds NBA accreditation for key programmes. Spread over a 52-acre campus in the heart of Indore, SGSITS offers B.E., M.Tech., MCA, MBA, and Ph.D. programmes across 17 departments, serving over 5,000 students and supported by more than 200 experienced faculty members. The institute is committed to academic excellence, research, innovation, and holistic development of its students.',
  'primaryButton',   JSON_OBJECT('label', 'About the Institute', 'to', '/about/institute'),
  'secondaryButton', JSON_OBJECT('label', 'Academic Programmes', 'to', '/academics')
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 4. home.director — Director's Corner card.
--
--   director.label        → small gold label above heading
--   director.heading      → section <h2> text
--   director.accentText   → italic accent word
--   director.photo        → image URL for director's photo
--   director.name         → director's full name shown as <h3>
--   director.bio          → excerpt of the director's message
--   director.readMoreTo   → link for "Read Full Message" button
--   director.readMoreLabel → button label text
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.director', JSON_OBJECT(
  'label',         'Director''s Corner',
  'heading',       'Message from the',
  'accentText',    'Director',
  'photo',         '/assets/director.jpg',
  'name',          'Prof. R. K. Pandey',
  'bio',           'At SGSITS, we are committed to nurturing not just engineers but complete human beings capable of addressing the complex challenges of the modern world through innovation, ethics, and excellence. Our institution stands as a beacon of quality technical education, blending rigorous academics with practical exposure, research opportunities, and industry collaborations. I invite students, researchers, and industry partners to join us in our journey towards a better tomorrow.',
  'readMoreTo',    '/about/director-message',
  'readMoreLabel', 'Read Full Message'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 5. home.news — Campus News section heading and description.
--    Actual news cards come from GET /api/v1/news (live database rows).
--
--   newsSection.label       → small gold label
--   newsSection.heading     → section <h2>
--   newsSection.accentText  → italic accent word
--   newsSection.description → sub-heading paragraph
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.news', JSON_OBJECT(
  'label',       'Campus Updates',
  'heading',     'Latest',
  'accentText',  'News & Achievements',
  'description', 'Stay informed about the latest research breakthroughs, student achievements, institutional developments, and campus activities at SGSITS Indore.'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 6. home.academics — Academic Programmes section (3 programme cards).
--
--   academicsSection.label       → small gold label
--   academicsSection.heading     → section <h2>
--   academicsSection.accentText  → italic accent
--   academicsSection.description → section sub-heading
--   academicsSection.programs[]  → array of programme card objects
--       prog.id          → unique key
--       prog.iconName    → icon from ICON_MAP
--       prog.title       → programme card heading
--       prog.description → programme card body text
--       prog.to          → link URL
--       prog.ctaLabel    → "Learn More" style link text
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.academics', JSON_OBJECT(
  'label',       'Our Programmes',
  'heading',     'Academic',
  'accentText',  'Excellence',
  'description', 'Discover world-class engineering, management, and science programmes taught by experienced faculty in state-of-the-art facilities.',
  'programs', JSON_ARRAY(
    JSON_OBJECT(
      'id',          'ug',
      'iconName',    'GraduationCap',
      'title',       'Under Graduate (B.E.)',
      'description', 'Four-year Bachelor of Engineering programmes across Computer Engineering, IT, Mechanical, Civil, Electrical, Electronics & TC, Industrial & Production Engineering, Biomedical Engineering, and Electronics & Instrumentation. JEE Main based admission through MPDTE.',
      'to',          '/academics/courses/ug',
      'ctaLabel',    'Explore UG Programmes'
    ),
    JSON_OBJECT(
      'id',          'pg',
      'iconName',    'BookOpen',
      'title',       'Post Graduate (M.Tech. / MCA / MBA)',
      'description', 'Two-year postgraduate programmes: M.Tech. (GATE-based) across multiple specialisations, MCA via MP MCA CET, and MBA with Finance, Marketing, HR, and Operations specialisations.',
      'to',          '/academics/courses/pg',
      'ctaLabel',    'Explore PG Programmes'
    ),
    JSON_OBJECT(
      'id',          'phd',
      'iconName',    'Microscope',
      'title',       'Doctoral Research (Ph.D.)',
      'description', 'Research-focused doctoral programmes across all engineering and management departments. Candidates with M.Tech./MCA/MBA and NET/GATE scores are eligible. RGPV registered.',
      'to',          '/academics/courses/phd',
      'ctaLabel',    'Explore Ph.D. Programmes'
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 7. home.departments — Department quick-link grid (all 17 SGSITS departments).
--
--   departmentsSection.label       → small gold label
--   departmentsSection.heading     → section <h2>
--   departmentsSection.accentText  → italic accent
--   departmentsSection.showAllLink → "All Departments" link URL
--   departmentsSection.items[]     → { name, slug }
--       slug is used to build the URL: /departments/{slug}
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.departments', JSON_OBJECT(
  'label',       'Academic Departments',
  'heading',     'Our',
  'accentText',  'Departments',
  'showAllLink', '/departments',
  'items', JSON_ARRAY(
    JSON_OBJECT('name', 'Computer Engineering',                      'slug', 'computer-engineering'),
    JSON_OBJECT('name', 'Information Technology',                    'slug', 'information-technology'),
    JSON_OBJECT('name', 'Mechanical Engineering',                    'slug', 'mechanical-engineering'),
    JSON_OBJECT('name', 'Civil Engineering & Applied Mechanics',     'slug', 'civil-engineering'),
    JSON_OBJECT('name', 'Electrical Engineering',                    'slug', 'electrical-engineering'),
    JSON_OBJECT('name', 'Electronics & Telecommunication',           'slug', 'electronics-telecommunication'),
    JSON_OBJECT('name', 'Electronics & Instrumentation',            'slug', 'electronics-instrumentation'),
    JSON_OBJECT('name', 'Industrial & Production Engineering',       'slug', 'industrial-production'),
    JSON_OBJECT('name', 'Biomedical Engineering',                    'slug', 'biomedical-engineering'),
    JSON_OBJECT('name', 'Computer Technology & Applications (MCA)', 'slug', 'computer-technology'),
    JSON_OBJECT('name', 'Management Studies (MBA)',                  'slug', 'management-studies'),
    JSON_OBJECT('name', 'Applied Mathematics',                       'slug', 'applied-mathematics'),
    JSON_OBJECT('name', 'Applied Physics & Optoelectronics',        'slug', 'applied-physics'),
    JSON_OBJECT('name', 'Applied Chemistry & Chemical Technology',   'slug', 'applied-chemistry'),
    JSON_OBJECT('name', 'Humanities & Social Sciences',              'slug', 'humanities'),
    JSON_OBJECT('name', 'Pharmacy',                                  'slug', 'pharmacy'),
    JSON_OBJECT('name', 'Bhartiya Gyan Parampara',                  'slug', 'coebg')
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 8. home.stats — Parallax statistics banner (4 counters shown in a 2×2/4-col grid).
--
--   statsSection.backgroundImage → primary parallax background URL
--   statsSection.fallbackImage   → fallback if primary fails
--   statsSection.items[]         → { val, label } — shown as large number + caption
--       Only 4 items fit the 2×2/4-col layout. Add more if you widen to 6-col.
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.stats', JSON_OBJECT(
  'backgroundImage', '/assets/hero.png',
  'fallbackImage',   '/assets/hero.png',
  'items', JSON_ARRAY(
    JSON_OBJECT('val', '70+',      'label', 'Years of Excellence'),
    JSON_OBJECT('val', '5,000+',   'label', 'Students Enrolled'),
    JSON_OBJECT('val', '200+',     'label', 'Expert Faculty'),
    JSON_OBJECT('val', '25,000+',  'label', 'Alumni Network')
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 9. home.campus_life — Campus Life section (3 facility cards).
--
--   campusLifeSection.label         → small gold label
--   campusLifeSection.heading       → section <h2>
--   campusLifeSection.accentText    → italic accent
--   campusLifeSection.description   → section sub-heading paragraph
--   campusLifeSection.facilities[]  → facility card objects
--       facility.id        → unique key
--       facility.iconName  → icon from ICON_MAP
--       facility.title     → card heading (also alt text for image)
--       facility.description → card body text
--       facility.imageUrl  → card image URL (192px tall)
--       facility.to        → link URL
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.campus_life', JSON_OBJECT(
  'label',       'Life at SGSITS',
  'heading',     'Campus',
  'accentText',  'Highlights',
  'description', 'Experience a vibrant campus life with world-class facilities, diverse student activities, and opportunities that shape you beyond the classroom.',
  'facilities', JSON_ARRAY(
    JSON_OBJECT(
      'id',          'library',
      'iconName',    'BookOpen',
      'title',       'Central Library',
      'description', 'Home to 80,000+ books, 150+ journals, and digital access to IEEE Xplore, ScienceDirect, and Springer. Open Monday–Saturday, 8 AM–9 PM with 40 e-learning terminals.',
      'imageUrl',    '/assets/campus/library.jpg',
      'to',          '/facilities/library'
    ),
    JSON_OBJECT(
      'id',          'idea-lab',
      'iconName',    'FlaskConical',
      'title',       'AICTE IDEA Lab & Innovation Hub',
      'description', 'State-of-the-art innovation lab with 3D printers, IoT kits, robotics workspace, and a maker-space for student innovators and startup incubation.',
      'imageUrl',    '/assets/campus/idea-lab.jpg',
      'to',          '/facilities/idea-lab'
    ),
    JSON_OBJECT(
      'id',          'sports',
      'iconName',    'Users',
      'title',       'Sports Complex & Hostels',
      'description', 'Comprehensive 5-acre sports complex with cricket ground, football field, badminton, basketball, and gymnasium. Hostel accommodation for 1,200+ students.',
      'imageUrl',    '/assets/campus/sports.jpg',
      'to',          '/students/sss'
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 10. home.faqs — FAQ accordion (left column of the FAQs + Gallery section).
--
--   faqsSection.heading     → section <h2>
--   faqsSection.subLabel    → small gold label below heading
--   faqsSection.viewAllLink → "View All" link URL
--   faqsSection.enabled     → boolean (section shows only if true)
--   faqsSection.items[]     → FAQ objects
--       faq.id           → unique string key
--       faq.question     → accordion trigger text
--       faq.answer       → answer paragraph (optional if contact given)
--       faq.contact      → { name, phone, email } contact block (optional)
--       faq.defaultOpen  → first FAQ is open by default
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.faqs', JSON_OBJECT(
  'heading',     'Frequently Asked',
  'subLabel',    'Questions',
  'viewAllLink', '/contact',
  'enabled',     TRUE,
  'order',       8,
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'id',          'faq-admission-ug',
      'question',    'How do I apply for B.E. (Under Graduate) admission at SGSITS?',
      'answer',      'UG admissions at SGSITS are based on JEE Main scores through MPDTE (MP Directorate of Technical Education) online counselling. Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics (PCM) with minimum 45% aggregate. Register on the MPDTE counselling portal, select SGSITS Indore in institute preference, complete document verification, and pay the fee to confirm admission.',
      'contact',     NULL,
      'defaultOpen', TRUE
    ),
    JSON_OBJECT(
      'id',          'faq-hostel',
      'question',    'Is hostel facility available at SGSITS? How to apply?',
      'answer',      'SGSITS provides hostel accommodation for outstation students. Boys'' Hostel: 3 blocks with 350 seats. Girls'' Hostel: 1 block with 150 seats. Priority is given to students from outside Indore. Apply through the Chief Warden''s office at the time of admission. Fee structure available at /downloads.',
      'contact',     JSON_OBJECT('name', 'Hostel Administration', 'phone', '0731-2582220', 'email', 'hostel@sgsits.ac.in'),
      'defaultOpen', FALSE
    ),
    JSON_OBJECT(
      'id',          'faq-placement',
      'question',    'What are the placement statistics for SGSITS 2024-25?',
      'answer',      'SGSITS Placement Highlights 2024-25: 406 students placed out of 472 eligible graduates (86% placement rate). Highest Package: 28 LPA (Oracle). Average Package: 6.40 LPA. Total companies visited: 55+. Top recruiters include TCS, Oracle, KPIT, Capgemini, Infosys, Wipro, L&T, and HCL.',
      'contact',     JSON_OBJECT('name', 'Training & Placement Cell', 'phone', '+91-731-2582105', 'email', 'tpo@sgsits.ac.in'),
      'defaultOpen', FALSE
    ),
    JSON_OBJECT(
      'id',          'faq-wifi',
      'question',    'Is Wi-Fi available across the SGSITS campus?',
      'answer',      'Yes. SGSITS Smart Campus provides high-speed Wi-Fi (100 Mbps) across all academic blocks, the central library, hostels, and sports complex. Students can connect using their institute credentials. For access issues, contact the IT Cell at 0731-2431315.',
      'contact',     NULL,
      'defaultOpen', FALSE
    ),
    JSON_OBJECT(
      'id',          'faq-scholarship',
      'question',    'What scholarships are available for SGSITS students?',
      'answer',      'Multiple scholarship schemes are available: (1) MP Government Scholarships for SC/ST/OBC/Minority students via scholarshipportal.mp.nic.in. (2) Institute merit scholarships for toppers. (3) National Scholarships from GOI. Required documents include income certificate, caste certificate, domicile, and marksheets. Contact the Student Welfare Office for guidance.',
      'contact',     JSON_OBJECT('name', 'Dean Student Welfare', 'phone', '0731-2582105', 'email', 'dsw@sgsits.ac.in'),
      'defaultOpen', FALSE
    ),
    JSON_OBJECT(
      'id',          'faq-exam',
      'question',    'Where can I find the exam timetable and results?',
      'answer',      'Exam timetables (date sheets) and results are available on the SGSITS ERP Portal at https://erp.sgsitsindore.in. Official notices about examinations are also published in the Notices section on this website. For re-evaluation applications, contact the Examination Cell within 15 days of result declaration.',
      'contact',     JSON_OBJECT('name', 'Examination Cell', 'phone', '0731-2582106', 'email', 'examcell@sgsits.ac.in'),
      'defaultOpen', FALSE
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 11. home.gallery — Gallery section heading config (right column next to FAQs).
--    Actual thumbnails come from GET /api/v1/gallery (live gallery records).
--
--   gallerySection.heading     → section <h2>
--   gallerySection.accentText  → italic accent word in gold
--   gallerySection.subLabel    → small gold label below heading
--   gallerySection.viewAllLink → "View All" link URL
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.gallery', JSON_OBJECT(
  'heading',     'Campus',
  'accentText',  'Gallery',
  'subLabel',    'Moments from SGSITS',
  'viewAllLink', '/explore/gallery'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 12. home.seo — SEO metadata read via contentService.getHomeSeoConfig()
--    (accessed as getCmsSection('home.seo') from the home page assembler)
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.seo', JSON_OBJECT(
  'title',         'SGSITS Indore — Premier Engineering Institute | NAAC A Grade',
  'description',   'Shri G. S. Institute of Technology & Science Indore — Premier autonomous engineering institute in MP. B.E., M.Tech., MCA, MBA programmes. NAAC A Grade, NBA Accredited. Admissions open 2025-26.',
  'keywords',      'SGSITS, SGSITS Indore, engineering college Indore, NAAC A Grade, B.E. admission, M.Tech., MCA, MBA, RGPV, AICTE, autonomous institute MP',
  'ogTitle',       'SGSITS Indore — Engineering Excellence since 1952',
  'ogDescription', 'Explore B.E., M.Tech., MCA, MBA programmes at SGSITS Indore — NAAC A Grade, 86% placement rate, 200+ faculty, 17 departments.',
  'ogImage',       '/assets/hero.png'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 13. seo — Global SEO map read by PageSeo.tsx via seoService.getPageSeo(pageKey).
--    Structure: { [pageKey]: { title, description, keywords, ogTitle,
--                              ogDescription, ogImage } }
--    The section key is literally 'seo' (no dot prefix).
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('seo', JSON_OBJECT(
  'home', JSON_OBJECT(
    'title',         'SGSITS Indore — Premier Engineering Institute | NAAC A Grade',
    'description',   'Shri G. S. Institute of Technology & Science Indore — Premier autonomous engineering institute in MP. B.E., M.Tech., MCA, MBA programmes. NAAC A Grade, NBA Accredited. Admissions open 2025-26.',
    'keywords',      'SGSITS, SGSITS Indore, engineering college Indore, NAAC A Grade, B.E. admission, M.Tech., MCA, MBA, RGPV, AICTE, autonomous institute MP',
    'ogTitle',       'SGSITS Indore — Engineering Excellence since 1952',
    'ogDescription', 'Explore B.E., M.Tech., MCA, MBA programmes at SGSITS Indore — NAAC A Grade, 86% placement rate, 200+ faculty, 17 departments.',
    'ogImage',       '/assets/hero.png'
  ),
  'about', JSON_OBJECT(
    'title',         'About SGSITS Indore | History, Vision & Mission | Est. 1952',
    'description',   'About Shri G. S. Institute of Technology & Science Indore — established 1952, RGPV affiliated, AICTE approved, NAAC A Grade autonomous institute in Madhya Pradesh.',
    'keywords',      'about SGSITS, SGSITS history, SGSITS vision mission, autonomous institute Indore',
    'ogTitle',       'About SGSITS Indore',
    'ogDescription', '72 years of engineering excellence — NAAC A Grade, 17 departments, 200+ faculty, 5,000+ students.'
  ),
  'academics', JSON_OBJECT(
    'title',         'Academics at SGSITS Indore | B.E. M.Tech. MCA MBA PhD',
    'description',   'Academic programmes at SGSITS Indore — B.E. (all branches), M.Tech., MCA, MBA, Ph.D. Affiliated to RGPV, AICTE approved.',
    'keywords',      'SGSITS academics, B.E. programmes, M.Tech., MCA, MBA, RGPV programmes, engineering courses'
  ),
  'departments', JSON_OBJECT(
    'title',         'Departments — SGSITS Indore | 17 Engineering & Science Depts',
    'description',   'All 17 departments at SGSITS Indore including Computer Engineering, IT, Mechanical, Civil, Electrical, Electronics, Biomedical, Pharmacy, and more.',
    'keywords',      'SGSITS departments, computer engineering Indore, IT department, mechanical engineering'
  ),
  'notices', JSON_OBJECT(
    'title',         'Notices — SGSITS Indore | Exam, Admission, Placement Circulars',
    'description',   'Latest official notices from SGSITS Indore — exam date sheets, admission circulars, placement schedules, hostel allotment notices.',
    'keywords',      'SGSITS notices, exam timetable, admission circular, placement notice'
  ),
  'placements', JSON_OBJECT(
    'title',         'Placements — SGSITS Indore | 86% Rate | TCS Oracle KPIT',
    'description',   'SGSITS Indore Placements 2024-25: 86% placement rate, highest package 28 LPA, 406 students placed, 55+ companies.',
    'keywords',      'SGSITS placements, placement record, highest package SGSITS, campus recruitment'
  ),
  'contact', JSON_OBJECT(
    'title',         'Contact SGSITS Indore | Address, Phone, Email',
    'description',   'Contact SGSITS Indore — 23, Park Road, Indore 452003 MP. Phone: 0731-2541370. Email: info@sgsits.ac.in.',
    'keywords',      'SGSITS contact, SGSITS address, SGSITS phone, how to reach SGSITS'
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 14. ui_labels — Global UI text strings used by the Home page and other
--    components. The homepage sub-key holds all labels accessed in Home.tsx.
--
--   labels.homepage.announcementsHeading  → announcements panel header text
--   labels.homepage.announcementsBadge    → "Live" badge on announcements header
--   labels.homepage.viewAllNoticesLabel   → footer link of announcements panel
--   labels.homepage.viewAllDepartmentsLabel → departments section "See All" link
--   labels.homepage.viewAllFaqsLabel      → FAQs "View All" button
--   labels.homepage.viewAllGalleryLabel   → Gallery "View All" button
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('ui_labels', JSON_OBJECT(
  'header', JSON_OBJECT(
    'searchPlaceholder', 'Search SGSITS...',
    'mobileMenuLabel',   'Navigation Menu'
  ),
  'homepage', JSON_OBJECT(
    'announcementsHeading',      'Announcements',
    'announcementsBadge',        'Live',
    'viewAllNoticesLabel',       'View All Notices',
    'viewAllDepartmentsLabel',   'All Departments',
    'viewAllFaqsLabel',          'View All',
    'viewAllGalleryLabel',       'View All'
  ),
  'breadcrumbs', JSON_OBJECT(
    'homeLabel', 'Home'
  ),
  'accessibility', JSON_OBJECT(
    'skipToContent',   'Skip to main content',
    'increaseFontSize','Increase font size',
    'decreaseFontSize','Decrease font size',
    'highContrast',    'Toggle high contrast'
  ),
  'sidebar', JSON_OBJECT(
    'relatedLinks', 'Related Links'
  ),
  'footer', JSON_OBJECT(
    'allRightsReserved', 'All rights reserved.'
  ),
  'topBar', JSON_OBJECT(
    'helplineLabel',      'Helpline',
    'instituteCodeLabel', 'Institute Code',
    'portalLabel',        'ERP Portal'
  ),
  'topBarQuickLinks', JSON_ARRAY(
    JSON_OBJECT('label', 'ERP Portal',        'url', 'https://erp.sgsitsindore.in'),
    JSON_OBJECT('label', 'Anti-Ragging',      'url', 'https://antiragging.in'),
    JSON_OBJECT('label', 'RGPV',              'url', 'https://www.rgpv.ac.in'),
    JSON_OBJECT('label', 'AICTE',             'url', 'https://www.aicte-india.org'),
    JSON_OBJECT('label', 'NIRF',              'url', 'https://www.nirfindia.org'),
    JSON_OBJECT('label', 'NAAC',              'url', 'https://www.naac.gov.in')
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 15. seo_metadata table — Upsert the home page SEO row (this table is the
--    canonical store queried by the backend's /api/v1/seo endpoint alongside
--    the cms_sections seo blob above).
-- =============================================================================
INSERT INTO seo_metadata
  (page_key, title, description, og_title, og_description, canonical, robots, updated_by)
VALUES
  ('home',
   'SGSITS Indore — Premier Engineering Institute | NAAC A Grade',
   'Shri G. S. Institute of Technology & Science Indore — Premier autonomous engineering institute in MP. B.E., M.Tech., MCA, MBA programmes. NAAC A Grade, NBA Accredited. Admissions open 2025-26.',
   'SGSITS Indore — Engineering Excellence since 1952',
   'Explore B.E., M.Tech., MCA, MBA at SGSITS Indore — NAAC A Grade, 86% placement rate, 200+ faculty, 17 departments.',
   'https://www.sgsits.ac.in/', 'index,follow',
   @admin)
ON DUPLICATE KEY UPDATE
  title           = VALUES(title),
  description     = VALUES(description),
  og_title        = VALUES(og_title),
  og_description  = VALUES(og_description),
  canonical       = VALUES(canonical),
  updated_by      = VALUES(updated_by);

SET foreign_key_checks = 1;

SELECT CONCAT(
  'Home CMS seed complete. ',
  (SELECT COUNT(*) FROM cms_sections WHERE section_key LIKE 'home.%' OR section_key IN ('seo','ui_labels')),
  ' home-related CMS sections populated.'
) AS status;
