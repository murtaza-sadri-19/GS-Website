-- =============================================================================
-- SGSITS Seed 19: Complete Home Page CMS Content
--
-- Covers every CMS section key that Home.tsx reads:
--   home.sections   — section visibility & display order
--   home.hero       — hero banner + slideshow images + 4 hero tiles
--   home.about      — about section text + CTA buttons
--   home.director   — director's corner card
--   home.news       — news section labels (articles come from the news API)
--   home.academics  — academic programs section (3 program cards)
--   home.departments — departments list shown on home grid (17 departments)
--   home.stats      — parallax stats banner (4 statistics)
--   home.campus_life — campus life facilities grid (6 facilities)
--   home.faqs       — FAQ accordion (8 questions)
--   home.gallery    — gallery section config (thumbnails come from gallery API)
--   home.seo        — home page SEO / Open Graph metadata
--   ui_labels       — homepage UI text labels (headings, button labels, badges)
--
-- Run AFTER: seed_sgsits_16_notices_news.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin = (SELECT id FROM users WHERE email = 'admin@college.edu' LIMIT 1);

-- =============================================================================
-- 1. HOME SECTIONS — section visibility and display order
--    Admin can toggle is_enabled and reorder without code changes.
--    Empty array in CMS = all sections visible (fallback behaviour in Home.tsx).
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.sections', JSON_ARRAY(
  JSON_OBJECT('id','hero',         'type','hero',         'enabled',true,  'order',1),
  JSON_OBJECT('id','about',        'type','about',        'enabled',true,  'order',2),
  JSON_OBJECT('id','news',         'type','news',         'enabled',true,  'order',3),
  JSON_OBJECT('id','academics',    'type','academics',    'enabled',true,  'order',4),
  JSON_OBJECT('id','departments',  'type','departments',  'enabled',true,  'order',5),
  JSON_OBJECT('id','stats',        'type','stats',        'enabled',true,  'order',6),
  JSON_OBJECT('id','campus_life',  'type','campus_life',  'enabled',true,  'order',7),
  JSON_OBJECT('id','faqs_gallery', 'type','faqs_gallery', 'enabled',true,  'order',8)
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 2. HOME HERO — banner config, images, and 4 hero tiles
--
-- hero.instituteName → badge text above main headline
-- hero.welcomeText   → first line of main headline
-- hero.accentText    → second line (gold italic) of headline
-- hero.images[]      → slideshow image URLs (admin uploads via Media Manager)
-- hero.imageUrl      → single fallback image if images[] is empty
-- hero.imagePosition → CSS background-position for hero image
-- hero.tiles[]       → 4-tile grid: {iconName, title, subtitle, path, dark}
--   dark=true  → navy background, gold text
--   dark=false → white background, navy text
--   iconName must match ICON_MAP in Home.tsx:
--   FlaskConical|Rocket|Newspaper|Landmark|BookOpen|GraduationCap|Microscope|Users|Building|FileText
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.hero', JSON_OBJECT(
  'instituteName',  'Shri G.S. Institute of Technology & Science, Indore',
  'welcomeText',    'Engineering Excellence',
  'accentText',     'Since 1952',
  'images',         JSON_ARRAY(
    '/assets/image.png'
  ),
  'imageUrl',       '/assets/image.png',
  'imagePosition',  'center',
  'tiles', JSON_ARRAY(
    JSON_OBJECT(
      'iconName', 'BookOpen',
      'title',    'ACADEMIC PROGRAMS',
      'subtitle', 'B.E. · M.Tech. · MCA · MBA · Ph.D.',
      'path',     '/academics',
      'dark',     true
    ),
    JSON_OBJECT(
      'iconName', 'GraduationCap',
      'title',    'ADMISSIONS 2025-26',
      'subtitle', 'JEE Main counselling via MPDTE',
      'path',     '/admission/ug',
      'dark',     false
    ),
    JSON_OBJECT(
      'iconName', 'Rocket',
      'title',    'PLACEMENTS',
      'subtitle', 'Avg 7.5 LPA · 180+ companies · 86% placed',
      'path',     '/placement',
      'dark',     false
    ),
    JSON_OBJECT(
      'iconName', 'FlaskConical',
      'title',    'RESEARCH & LABS',
      'subtitle', 'AICTE IDEA Lab · 9 research facilities',
      'path',     '/facilities',
      'dark',     true
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 3. HOME ABOUT — institute overview section
--
-- about.label            → gold badge text
-- about.heading          → section heading (part 1)
-- about.accentText       → italic serif heading accent (part 2)
-- about.body             → narrative paragraph
-- about.primaryButton    → {label, to}
-- about.secondaryButton  → {label, to}
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.about', JSON_OBJECT(
  'label',       'Institute Overview',
  'heading',     'About the',
  'accentText',  'Institute',
  'body',        'Established in 1952 by the visionary industrialist Late Shri Govindram Seksaria, SGSITS Indore is one of Madhya Pradesh''s premier autonomous engineering institutes. Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) Bhopal and approved by AICTE New Delhi, the institute is NAAC-accredited with Grade ''A'' and holds NBA accreditation for key programmes. With a sprawling 52-acre campus on Park Road, Indore, SGSITS has been nurturing engineers, scientists, and technology professionals for over 70 years — producing graduates who serve in leadership roles across industry, academia, and public service.',
  'primaryButton',   JSON_OBJECT('label', 'About the Institute', 'to', '/about/institute'),
  'secondaryButton', JSON_OBJECT('label', 'Vision & Mission',    'to', '/about/vision-mission')
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 4. HOME DIRECTOR — director's corner card
--
-- director.label        → gold badge text
-- director.heading      → section heading (part 1)
-- director.accentText   → italic serif heading accent (part 2)
-- director.photo        → portrait image URL (admin uploads via Media Manager)
-- director.name         → director's full name and designation
-- director.bio          → quote/message excerpt
-- director.readMoreTo   → link to full message page
-- director.readMoreLabel → link label
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.director', JSON_OBJECT(
  'label',          'Director''s Corner',
  'heading',        'Message from the',
  'accentText',     'Director',
  'photo',          '/assets/image.png',
  'name',           'Director, SGSITS Indore',
  'bio',            'At SGSITS, we are committed to nurturing not just engineers but complete human beings capable of addressing the complex challenges of the modern world through innovation, ethics, and excellence. Our institute has stood the test of time — established in 1952, we continue to be a beacon of quality technical education in Madhya Pradesh, producing graduates who make a difference in industry and society.',
  'readMoreTo',     '/about/director-message',
  'readMoreLabel',  'Read Full Message'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 5. HOME NEWS — campus news section labels
--    Actual news cards come from the news API (GET /api/v1/news?status=PUBLISHED).
--    This section stores display labels only.
--
-- newsSection.label       → gold badge text
-- newsSection.heading     → section heading (part 1)
-- newsSection.accentText  → italic serif heading accent (part 2)
-- newsSection.description → subtitle / description under heading
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.news', JSON_OBJECT(
  'label',       'Campus Updates',
  'heading',     'CAMPUS',
  'accentText',  'NEWS',
  'description', 'Stay updated with the latest achievements, events, research breakthroughs, and announcements from SGSITS Indore.'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 6. HOME ACADEMICS — academic programs section (3 program cards)
--
-- academicsSection.label       → gold badge text
-- academicsSection.heading     → section heading (part 1)
-- academicsSection.accentText  → italic serif heading accent (part 2)
-- academicsSection.description → subtitle under heading
-- academicsSection.programs[]  → 3 program cards:
--   {id, title, description, iconName, to, ctaLabel}
--   iconName must be in Home.tsx ICON_MAP
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.academics', JSON_OBJECT(
  'label',       'Programmes Offered',
  'heading',     'ACADEMIC',
  'accentText',  'PROGRAMS',
  'description', 'SGSITS offers a rich portfolio of UG, PG, and doctoral programmes across engineering, technology, and management disciplines — all affiliated to RGPV and approved by AICTE.',
  'programs', JSON_ARRAY(
    JSON_OBJECT(
      'id',          'ug',
      'iconName',    'GraduationCap',
      'title',       'Undergraduate (B.E.)',
      'description', '4-year Bachelor of Engineering programmes across 9 disciplines: Computer, IT, Mechanical, Civil, Electrical, Electronics & TC, Electronics & Instrumentation, Biomedical, and Industrial & Production Engineering. Intake: ~720 seats. JEE Main + MPDTE counselling.',
      'to',          '/academics/courses/ug',
      'ctaLabel',    'Explore UG Programmes'
    ),
    JSON_OBJECT(
      'id',          'pg',
      'iconName',    'BookOpen',
      'title',       'Postgraduate (M.Tech. / MCA / MBA)',
      'description', '2-year M.Tech. programmes in 6 specializations, MCA (3 years), and MBA (2 years). Admission via GATE score (M.Tech.), MP MCA CET (MCA), and CAT/MAT (MBA). Intake: ~180 seats.',
      'to',          '/academics/courses/pg',
      'ctaLabel',    'Explore PG Programmes'
    ),
    JSON_OBJECT(
      'id',          'phd',
      'iconName',    'Microscope',
      'title',       'Doctoral (Ph.D.)',
      'description', 'Ph.D. programmes in Engineering, Science, and Management disciplines under RGPV Bhopal. Full-time and part-time options available. Research scholars supported through institute and government fellowships.',
      'to',          '/academics/courses/phd',
      'ctaLabel',    'Explore Ph.D. Programmes'
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 7. HOME DEPARTMENTS — department grid shown on home page
--
-- departmentsSection.label    → gold badge text
-- departmentsSection.heading  → section heading (part 1)
-- departmentsSection.accentText → italic serif heading accent (part 2)
-- departmentsSection.showAllLink → "View all" URL
-- departmentsSection.items[]  → dept rows: {name, slug}
--   slug must match the departments.slug column in the departments table
--   and the /departments/{slug} frontend route
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.departments', JSON_OBJECT(
  'label',       'Engineering & Sciences',
  'heading',     'OUR',
  'accentText',  'DEPARTMENTS',
  'showAllLink', '/departments',
  'items', JSON_ARRAY(
    JSON_OBJECT('name', 'Applied Chemistry & Chemical Technology', 'slug', 'applied-chemistry'),
    JSON_OBJECT('name', 'Applied Mathematics & Computational Science', 'slug', 'applied-mathematics'),
    JSON_OBJECT('name', 'Applied Physics & Optoelectronics',       'slug', 'applied-physics'),
    JSON_OBJECT('name', 'Biomedical Engineering',                   'slug', 'biomedical-engineering'),
    JSON_OBJECT('name', 'Civil Engineering',                        'slug', 'civil-engineering'),
    JSON_OBJECT('name', 'Computer Engineering',                     'slug', 'computer-engineering'),
    JSON_OBJECT('name', 'Computer Technology & Applications',       'slug', 'computer-technology'),
    JSON_OBJECT('name', 'Electrical Engineering',                   'slug', 'electrical-engineering'),
    JSON_OBJECT('name', 'Electronics & Instrumentation',            'slug', 'electronics-instrumentation'),
    JSON_OBJECT('name', 'Electronics & Telecommunication',          'slug', 'electronics-telecommunication'),
    JSON_OBJECT('name', 'Humanities & Social Sciences',             'slug', 'humanities'),
    JSON_OBJECT('name', 'Industrial & Production Engineering',      'slug', 'industrial-production'),
    JSON_OBJECT('name', 'Information Technology',                   'slug', 'information-technology'),
    JSON_OBJECT('name', 'Management Studies (MBA)',                  'slug', 'management-studies'),
    JSON_OBJECT('name', 'Mechanical Engineering',                   'slug', 'mechanical-engineering'),
    JSON_OBJECT('name', 'Pharmacy',                                  'slug', 'pharmacy'),
    JSON_OBJECT('name', 'Centre of Excellence (CoE)',               'slug', 'coebg')
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 8. HOME STATS — parallax stats banner (4 counter blocks)
--
-- statsSection.backgroundImage → full-bleed parallax background URL
-- statsSection.fallbackImage   → backup background URL (used in skeleton)
-- statsSection.items[]         → [{val, label}] — displayed as large numbers
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.stats', JSON_OBJECT(
  'backgroundImage', '/assets/image.png',
  'fallbackImage',   '/assets/image.png',
  'items', JSON_ARRAY(
    JSON_OBJECT('val', '70+',    'label', 'Years of Excellence'),
    JSON_OBJECT('val', '5,000+', 'label', 'Students Enrolled'),
    JSON_OBJECT('val', '17',     'label', 'Departments'),
    JSON_OBJECT('val', '300+',   'label', 'Faculty & Staff')
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 9. HOME CAMPUS LIFE — campus life / facilities section (6 facility cards)
--
-- campusLifeSection.label        → gold badge text
-- campusLifeSection.heading      → section heading (part 1)
-- campusLifeSection.accentText   → italic serif heading accent (part 2)
-- campusLifeSection.description  → subtitle under heading
-- campusLifeSection.facilities[] → 6 facility cards:
--   {id, title, description, iconName, to, imageUrl}
--   imageUrl → image shown in card header (admin uploads, replace with real URLs)
--   iconName must be in Home.tsx ICON_MAP
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.campus_life', JSON_OBJECT(
  'label',       'Life at SGSITS',
  'heading',     'CAMPUS',
  'accentText',  'LIFE',
  'description', 'SGSITS offers a vibrant residential campus experience with world-class facilities for academic, sports, cultural, and co-curricular pursuits.',
  'facilities', JSON_ARRAY(
    JSON_OBJECT(
      'id',          'library',
      'iconName',    'BookOpen',
      'title',       'Central Library',
      'description', '80,000+ books, 6,000+ e-journals via INFLIBNET N-LIST, IEEE Xplore, ScienceDirect, and digital reading rooms. Open 8 AM – 8 PM on all working days.',
      'to',          '/facilities/library',
      'imageUrl',    '/assets/image.png'
    ),
    JSON_OBJECT(
      'id',          'sports',
      'iconName',    'Users',
      'title',       'Sports Complex',
      'description', '5-acre sports complex with cricket ground, football field, basketball and volleyball courts, badminton hall, table tennis, and a fully equipped gymnasium.',
      'to',          '/facilities/sports',
      'imageUrl',    '/assets/image.png'
    ),
    JSON_OBJECT(
      'id',          'idea-lab',
      'iconName',    'FlaskConical',
      'title',       'AICTE IDEA Lab',
      'description', 'State-of-the-art innovation lab with 3D printers, laser cutters, IoT development kits, robotics components, AR/VR headsets, and a dedicated maker-space.',
      'to',          '/facilities/idea-lab',
      'imageUrl',    '/assets/image.png'
    ),
    JSON_OBJECT(
      'id',          'hostel',
      'iconName',    'Building',
      'title',       'Student Hostels',
      'description', 'Three boys'' hostels (1,200+ seats) and one girls'' hostel (350+ seats) with 24×7 security, Wi-Fi, mess facilities, and on-campus dispensary.',
      'to',          '/facilities/hostel/boys',
      'imageUrl',    '/assets/image.png'
    ),
    JSON_OBJECT(
      'id',          'computer-center',
      'iconName',    'Landmark',
      'title',       'Computer Center',
      'description', '1,000+ networked workstations across AI/ML, networking, cybersecurity, and general computing labs. High-speed optical fibre internet throughout campus.',
      'to',          '/facilities/computer-center',
      'imageUrl',    '/assets/image.png'
    ),
    JSON_OBJECT(
      'id',          'workshop',
      'iconName',    'Rocket',
      'title',       'Central Workshop',
      'description', 'Fully equipped central workshop for machining, welding, casting, and fabrication practicals. Houses lathe machines, milling machines, and 3D metal printers.',
      'to',          '/facilities/workshop',
      'imageUrl',    '/assets/image.png'
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 10. HOME FAQs — FAQ accordion section (8 questions)
--
-- faqsSection.heading      → section heading text
-- faqsSection.subLabel     → gold badge / sub-label text
-- faqsSection.viewAllLink  → "View All" link URL
-- faqsSection.items[]      → FAQ items:
--   {id, question, answer, defaultOpen?, contact?}
--   contact: {name, phone, email} — shows contact card below answer
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.faqs', JSON_OBJECT(
  'heading',     'Frequently Asked Questions',
  'subLabel',    'Admissions & Campus Life',
  'viewAllLink', '/contact',
  'items', JSON_ARRAY(
    JSON_OBJECT(
      'id',          'faq-1',
      'question',    'What is the admission process for B.E. at SGSITS Indore?',
      'answer',      'B.E. admissions at SGSITS are through the MPDTE (Madhya Pradesh Directorate of Technical Education) online counselling portal, based on JEE Main 2025 scores. Candidates must have passed 10+2 with Physics, Chemistry, and Mathematics (PCM) with a minimum 45% aggregate. SC/ST/OBC reservations apply as per Government of MP norms.',
      'defaultOpen', true
    ),
    JSON_OBJECT(
      'id',          'faq-2',
      'question',    'What courses does SGSITS Indore offer?',
      'answer',      'SGSITS offers: B.E. (8 engineering branches + Biomedical + IPE), M.Tech. (6 specializations), MCA (3 years), MBA (2 years), and Ph.D. programmes in engineering, science, and management. Total intake is approximately 900 students per year across all programmes.'
    ),
    JSON_OBJECT(
      'id',          'faq-3',
      'question',    'What is the placement record at SGSITS?',
      'answer',      'SGSITS consistently achieves 85-90% placement rates for eligible students. For 2024-25, the highest package was ₹45 LPA (Oracle India) and the average package was approximately ₹7.5 LPA. Over 180 companies visit the campus annually including TCS, Infosys, Wipro, Accenture, Microsoft, Goldman Sachs, Amazon, Adobe, and L&T.'
    ),
    JSON_OBJECT(
      'id',          'faq-4',
      'question',    'Is SGSITS Indore NAAC accredited?',
      'answer',      'Yes. SGSITS Indore is NAAC (National Assessment and Accreditation Council) accredited with Grade "A". Additionally, key engineering programmes hold NBA (National Board of Accreditation) accreditation. The institute is affiliated to RGPV Bhopal and approved by AICTE New Delhi.'
    ),
    JSON_OBJECT(
      'id',          'faq-5',
      'question',    'Is hostel accommodation available at SGSITS?',
      'answer',      'Yes. SGSITS has three boys'' hostels with 1,200+ seats and one girls'' hostel with 350+ seats. All hostels have mess facilities, 24×7 security, Wi-Fi connectivity, and access to the on-campus dispensary. Hostel allotment is done at the time of admission on a first-come first-served basis.',
      'contact',     JSON_OBJECT('name', 'Hostel Administration', 'phone', '0731-2582220', 'email', 'hostel@sgsits.ac.in')
    ),
    JSON_OBJECT(
      'id',          'faq-6',
      'question',    'How can I contact the Admissions Office?',
      'answer',      'The Admissions Office at SGSITS is open Monday to Saturday, 10:00 AM – 4:00 PM. For queries about B.E., M.Tech., MCA, and MBA admissions, you can contact us through the details below.',
      'contact',     JSON_OBJECT('name', 'Admissions Office', 'phone', '0731-2582401', 'email', 'admissions@sgsits.ac.in')
    ),
    JSON_OBJECT(
      'id',          'faq-7',
      'question',    'Does SGSITS offer scholarships for students?',
      'answer',      'Yes. SGSITS disburses Government of Madhya Pradesh scholarships (SC/ST/OBC/EWS/Minority), AICTE scholarships, and institute merit-based scholarships. Students with CGPA above 8.5 in the previous semester are eligible for institute scholarships. Applications are accepted at the Student Welfare Office in September each year.'
    ),
    JSON_OBJECT(
      'id',          'faq-8',
      'question',    'What is the anti-ragging policy at SGSITS?',
      'answer',      'SGSITS maintains a strict zero-tolerance anti-ragging policy as per UGC/AICTE regulations. An Anti-Ragging Committee is constituted each academic year. All students must submit anti-ragging affidavits (self and parent) at the time of registration. Violations may result in immediate expulsion.',
      'contact',     JSON_OBJECT('name', 'Anti-Ragging Helpline (24×7)', 'phone', '1800-180-5522', 'email', 'antiranging@sgsits.ac.in')
    )
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 11. HOME GALLERY — gallery section config
--    Gallery thumbnail images come from the gallery API (GET /api/v1/gallery).
--    This section stores display labels only.
--
-- gallerySection.heading     → section heading (part 1)
-- gallerySection.accentText  → gold italic heading accent (part 2)
-- gallerySection.subLabel    → gold sub-badge text
-- gallerySection.viewAllLink → "View All" link URL
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.gallery', JSON_OBJECT(
  'heading',     'PHOTO',
  'accentText',  'GALLERY',
  'subLabel',    'Campus Life & Events',
  'viewAllLink', '/explore/gallery'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 12. HOME SEO — home page meta tags and Open Graph
--    Read by PageSeo component via getCmsSection('home.seo')
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('home.seo', JSON_OBJECT(
  'title',          'SGSITS Indore — Premier Engineering Institute | NAAC ''A'' Grade | RGPV Affiliated',
  'description',    'Shri G.S. Institute of Technology & Science (SGSITS) Indore — Established 1952. Premier autonomous engineering institute in MP. B.E., M.Tech., MCA, MBA, Ph.D. programmes. NAAC Grade ''A'', NBA Accredited, AICTE Approved. Admissions open 2025-26.',
  'og_title',       'SGSITS Indore — Engineering Excellence Since 1952',
  'og_description', 'Explore B.E., M.Tech., MCA, MBA programmes at SGSITS Indore. NAAC ''A'' Grade, 86% placement rate, 180+ campus recruiters, 5,000+ students, 52-acre campus.',
  'og_image',       '/assets/image.png',
  'canonical',      'https://www.sgsits.ac.in/',
  'robots',         'index,follow',
  'keywords',       'SGSITS Indore, SGSITS engineering college, best engineering college MP, B.E. Indore, M.Tech Indore, NAAC A grade college, RGPV affiliated, JEE Main counselling MP'
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 13. UI LABELS — homepage section headings and button labels
--    These strings appear in the JSX as:
--      labels.homepage.announcementsHeading   → "Announcements" panel header
--      labels.homepage.announcementsBadge     → badge in announcements header
--      labels.homepage.viewAllNoticesLabel    → "View all notices →" link
--      labels.homepage.viewAllDepartmentsLabel → "View all departments" link
--      labels.homepage.viewAllFaqsLabel        → "View All" button in FAQs
--      labels.homepage.viewAllGalleryLabel     → "View All" button in gallery
-- =============================================================================
INSERT INTO cms_sections (section_key, data, updated_by) VALUES
('ui_labels', JSON_OBJECT(
  'header', JSON_OBJECT(
    'searchPlaceholder', 'Search pages, departments, facilities…'
  ),
  'homepage', JSON_OBJECT(
    'announcementsHeading',     'Announcements',
    'announcementsBadge',       'Live',
    'viewAllNoticesLabel',      'View all notices',
    'viewAllDepartmentsLabel',  'View all departments',
    'viewAllFaqsLabel',         'View All',
    'viewAllGalleryLabel',      'View All'
  ),
  'breadcrumbs', JSON_OBJECT(
    'homeLabel', 'Home'
  ),
  'accessibility', JSON_OBJECT(
    'skipToContent', 'Skip to main content',
    'increaseFontSize', 'Increase font size',
    'decreaseFontSize', 'Decrease font size',
    'highContrast', 'High contrast mode'
  ),
  'sidebar', JSON_OBJECT(
    'quickLinksHeading', 'Quick Links'
  ),
  'footer', JSON_OBJECT(
    'copyrightLabel', '© 2025 SGSITS Indore. All rights reserved.'
  ),
  'topBar', JSON_OBJECT(
    'helplineLabel',      'Helpline',
    'erpPortalLabel',     'ERP Portal',
    'instituteCodeLabel', 'AICTE Code'
  )
), @admin)
ON DUPLICATE KEY UPDATE data = VALUES(data), updated_by = VALUES(updated_by);

-- =============================================================================
-- 14. GALLERY SEED — initial gallery images for home page thumbnails
--    These appear in the 4×3 grid on the home page gallery section.
--    Admin should replace imageUrl values with real campus photos via
--    the Media Manager (Admin → Media Manager → upload to gallery).
--    The gallery API serves these to getHomeGalleryThumbnails().
--
--    Note: gallery records require a file_id FK → files table.
--    We use the admin user's own user record as uploaded_by.
--    Since no real images are uploaded yet, we register external link
--    attachments pointing to placeholder paths. Admin replaces via UI.
-- =============================================================================
-- Register placeholder file records as EXTERNAL_LINKs for gallery seeds
INSERT INTO files
  (attachment_type, usage, original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by)
VALUES
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Main Building',        NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Central Library',      NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Computer Lab',         NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Sports Complex',       NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS IDEA Lab',             NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Hostel Complex',       NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Auditorium',           NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS TechFest Invictus',    NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Workshop',             NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Institute Day',        NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Graduation Ceremony',  NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin),
  ('EXTERNAL_LINK', 'gallery', 'SGSITS Campus Aerial View',   NULL, '/assets/image.png', 'image/png', NULL, 'EXTERNAL', @admin)
ON DUPLICATE KEY UPDATE file_url = VALUES(file_url);

-- Now create gallery records linked to these file IDs
INSERT INTO gallery (title, description, file_id, uploaded_by, status)
SELECT
  f.original_name                       AS title,
  CONCAT('SGSITS campus photograph — ', f.original_name) AS description,
  f.id                                  AS file_id,
  @admin                                AS uploaded_by,
  'ACTIVE'                              AS status
FROM files f
WHERE f.original_name IN (
  'SGSITS Main Building',
  'SGSITS Central Library',
  'SGSITS Computer Lab',
  'SGSITS Sports Complex',
  'SGSITS IDEA Lab',
  'SGSITS Hostel Complex',
  'SGSITS Auditorium',
  'SGSITS TechFest Invictus',
  'SGSITS Workshop',
  'SGSITS Institute Day',
  'SGSITS Graduation Ceremony',
  'SGSITS Campus Aerial View'
)
  AND f.uploaded_by = @admin
ON DUPLICATE KEY UPDATE status = 'ACTIVE';

-- =============================================================================
-- 15. SEO METADATA TABLE — home page (for the seo_metadata table used by
--    GET /api/v1/seo/home endpoint, separate from the cms_sections home.seo)
-- =============================================================================
INSERT INTO seo_metadata
  (page_key, title, description, og_title, og_description, canonical, robots, updated_by)
VALUES (
  'home',
  'SGSITS Indore — Premier Engineering Institute | NAAC ''A'' Grade | RGPV Affiliated',
  'Shri G.S. Institute of Technology & Science (SGSITS) Indore — Established 1952. Premier autonomous engineering institute in MP. B.E., M.Tech., MCA, MBA, Ph.D. programmes. NAAC Grade ''A'', NBA Accredited, AICTE Approved. Admissions open 2025-26.',
  'SGSITS Indore — Engineering Excellence Since 1952',
  'Explore B.E., M.Tech., MCA, MBA programmes at SGSITS Indore. NAAC ''A'' Grade, 86% placement rate, 180+ campus recruiters, 5,000+ students, 52-acre campus.',
  'https://www.sgsits.ac.in/',
  'index,follow',
  @admin
)
ON DUPLICATE KEY UPDATE
  title          = VALUES(title),
  description    = VALUES(description),
  og_title       = VALUES(og_title),
  og_description = VALUES(og_description),
  canonical      = VALUES(canonical),
  updated_by     = VALUES(updated_by);

SET foreign_key_checks = 1;
