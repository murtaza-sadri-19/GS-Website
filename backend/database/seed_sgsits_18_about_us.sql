-- =============================================================================
-- SGSITS Seed 18: About Us — Complete Content Seed
-- Covers: Normalized Tables + CMS Sections + SEO + Navigation
--
-- Run AFTER: seed_enterprise_01_users.sql, seed_enterprise_02_departments.sql,
--            seed_enterprise_08_cms_global.sql, seed_sgsits_17_navigation.sql
--
-- ALL content is sourced from existing seed files (users, chatbot, site_settings).
-- No placeholder data. Update `directorPhotoUrl` and banner paths after upload.
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin    = (SELECT id FROM users WHERE email = 'admin@college.edu'      LIMIT 1);
SET @director = (SELECT id FROM users WHERE email = 'director@sgsits.ac.in'  LIMIT 1);

-- =============================================================================
-- PART 1: NORMALIZED TABLE SCHEMA (idempotent)
-- =============================================================================

CREATE TABLE IF NOT EXISTS about_pages (
  id            INT          NOT NULL AUTO_INCREMENT,
  section_key   VARCHAR(100) NOT NULL,
  title         VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) NOT NULL,
  subtitle      VARCHAR(300) DEFAULT NULL,
  short_desc    TEXT         DEFAULT NULL,
  banner_image  VARCHAR(500) DEFAULT NULL,
  display_order INT          NOT NULL DEFAULT 0,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  seo_title     VARCHAR(255) DEFAULT NULL,
  seo_desc      TEXT         DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_about_pages_key  (section_key),
  UNIQUE KEY uq_about_pages_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS director_messages (
  id              INT          NOT NULL AUTO_INCREMENT,
  director_name   VARCHAR(150) NOT NULL,
  designation     VARCHAR(150) NOT NULL DEFAULT 'Director',
  qualification   VARCHAR(300) DEFAULT NULL,
  photo_file_id   INT          DEFAULT NULL,
  email           VARCHAR(150) DEFAULT NULL,
  phone           VARCHAR(30)  DEFAULT NULL,
  office_location VARCHAR(300) DEFAULT NULL,
  quote           TEXT         DEFAULT NULL,
  message_html    LONGTEXT     DEFAULT NULL,
  is_active       TINYINT(1)   NOT NULL DEFAULT 1,
  effective_from  DATE         DEFAULT NULL,
  updated_by      INT          DEFAULT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_dm_photo  FOREIGN KEY (photo_file_id) REFERENCES files (id) ON DELETE SET NULL,
  CONSTRAINT fk_dm_editor FOREIGN KEY (updated_by)    REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS about_vision_mission (
  id             INT  NOT NULL DEFAULT 1,
  vision_english TEXT DEFAULT NULL,
  vision_hindi   TEXT DEFAULT NULL,
  updated_by     INT  DEFAULT NULL,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_vm_editor FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS mission_points (
  id         INT        NOT NULL AUTO_INCREMENT,
  num        INT        NOT NULL,
  text       TEXT       NOT NULL,
  sort_order INT        NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS governing_body_members (
  id          INT          NOT NULL AUTO_INCREMENT,
  role        VARCHAR(250) NOT NULL,
  member_name VARCHAR(150) DEFAULT NULL,
  category    ENUM('Government','University','Industry','Regulatory','Faculty','Other') NOT NULL DEFAULT 'Other',
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS administrators (
  id         INT          NOT NULL AUTO_INCREMENT,
  title      VARCHAR(150) NOT NULL,
  name       VARCHAR(150) DEFAULT NULL,
  email      VARCHAR(150) DEFAULT NULL,
  phone      VARCHAR(30)  DEFAULT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS committees (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(200) NOT NULL,
  description TEXT         DEFAULT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS committee_members (
  id           INT          NOT NULL AUTO_INCREMENT,
  committee_id INT          NOT NULL,
  role         VARCHAR(150) NOT NULL,
  member_name  VARCHAR(150) DEFAULT NULL,
  department   VARCHAR(150) DEFAULT NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_cm_committee FOREIGN KEY (committee_id) REFERENCES committees (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS telephone_directory (
  id           INT          NOT NULL AUTO_INCREMENT,
  department   VARCHAR(150) NOT NULL,
  contact_name VARCHAR(150) DEFAULT NULL,
  phone        VARCHAR(30)  NOT NULL,
  ext          VARCHAR(20)  DEFAULT NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS infrastructure_items (
  id                 INT          NOT NULL AUTO_INCREMENT,
  title              VARCHAR(150) NOT NULL,
  description        TEXT         DEFAULT NULL,
  primary_stat_label VARCHAR(100) DEFAULT NULL,
  primary_stat_value VARCHAR(100) DEFAULT NULL,
  sort_order         INT          NOT NULL DEFAULT 0,
  is_active          TINYINT(1)   NOT NULL DEFAULT 1,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS iqac_config (
  id                INT          NOT NULL DEFAULT 1,
  about_text        TEXT         DEFAULT NULL,
  chairperson_name  VARCHAR(150) DEFAULT NULL,
  chairperson_title VARCHAR(150) DEFAULT NULL,
  coordinator_name  VARCHAR(150) DEFAULT NULL,
  coordinator_title VARCHAR(150) DEFAULT NULL,
  updated_by        INT          DEFAULT NULL,
  updated_at        DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_iqac_editor FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS iqac_objectives (
  id         INT        NOT NULL AUTO_INCREMENT,
  objective  TEXT       NOT NULL,
  sort_order INT        NOT NULL DEFAULT 0,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS iqac_activities (
  id            INT          NOT NULL AUTO_INCREMENT,
  title         VARCHAR(200) NOT NULL,
  description   TEXT         DEFAULT NULL,
  activity_date DATE         DEFAULT NULL,
  is_active     TINYINT(1)   NOT NULL DEFAULT 1,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS academic_council_members (
  id          INT          NOT NULL AUTO_INCREMENT,
  sno         INT          NOT NULL,
  designation VARCHAR(250) NOT NULL,
  member_name VARCHAR(150) DEFAULT NULL,
  category    ENUM('Ex-Officio','External','Nominated','Industry') NOT NULL DEFAULT 'Nominated',
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS accreditations (
  id         INT          NOT NULL AUTO_INCREMENT,
  body       VARCHAR(50)  NOT NULL,
  grade      VARCHAR(50)  DEFAULT NULL,
  naac_score VARCHAR(20)  DEFAULT NULL,
  cycle      VARCHAR(100) DEFAULT NULL,
  valid_upto VARCHAR(50)  DEFAULT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_accred_body (body)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nba_programs (
  id           INT          NOT NULL AUTO_INCREMENT,
  program_name VARCHAR(200) NOT NULL,
  sort_order   INT          NOT NULL DEFAULT 0,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nirf_rankings (
  id         INT          NOT NULL AUTO_INCREMENT,
  year       VARCHAR(10)  NOT NULL,
  rank_range VARCHAR(50)  NOT NULL,
  category   VARCHAR(100) DEFAULT NULL,
  sort_order INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- PART 2: CMS SECTION SEEDS (JSON blobs — consumed by existing frontend)
-- Section keys match aboutService.ts exactly.
-- =============================================================================

-- ── 2.1  about.overview ───────────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.overview',
  JSON_OBJECT(
    'narrativeParagraphs', JSON_ARRAY(
      'Shri G.S. Institute of Technology and Science (SGSITS), Indore was established in 1952 by the late Shri Govindram Seksaria (G.S.) Birla, a distinguished industrialist and philanthropist. Named after its founder, the institute stands as a lasting tribute to his vision of advancing technical education in central India. Located at 23, Park Road in the heart of Indore, Madhya Pradesh, SGSITS has grown into one of the most respected autonomous engineering institutes in the country.',
      'The institute is affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal, and approved by the All India Council for Technical Education (AICTE), New Delhi. With autonomous status granted by the Government of Madhya Pradesh, SGSITS designs its own academic curriculum, conducts examinations, and awards degrees in collaboration with RGPV. This autonomy enables the institute to remain continuously responsive to evolving industry needs and global educational standards.',
      'Over its seven-decade legacy, SGSITS has produced more than 25,000 alumni who hold distinguished positions in industry, academia, research, and public service across India and abroad. The institute offers undergraduate (B.E.), postgraduate (M.Tech., MCA, MBA), and doctoral (Ph.D.) programmes. Accredited by the National Assessment and Accreditation Council (NAAC) with Grade A, and with several B.E. programmes accredited by the National Board of Accreditation (NBA), SGSITS continues to uphold the highest standards of technical education.'
    ),
    'highlights', JSON_ARRAY(
      JSON_OBJECT('iconName','Calendar',      'value','72+',     'label','Years of Excellence',     'desc','Founded in 1952 by Shri G.S. Birla — over seven decades of quality technical education'),
      JSON_OBJECT('iconName','Users',         'value','200+',    'label','Expert Faculty',           'desc','Highly qualified faculty including PhDs from IITs, NITs, and reputed universities'),
      JSON_OBJECT('iconName','BookOpen',      'value','12+',     'label','Programmes Offered',       'desc','B.E., M.Tech., MCA, MBA, and Ph.D. across multiple engineering and applied science departments'),
      JSON_OBJECT('iconName','GraduationCap', 'value','25,000+', 'label','Alumni Network',           'desc','Graduates serving in leading industries, academia, and public service globally'),
      JSON_OBJECT('iconName','Trophy',        'value','86%',     'label','Placement Rate 2024–25',   'desc','406 of 472 students placed with top national and global companies at up to 28 LPA'),
      JSON_OBJECT('iconName','FlaskConical',  'value','9',       'label','Research Laboratories',    'desc','State-of-the-art research labs enabling innovation and industry-sponsored research projects')
    ),
    'affiliations', JSON_ARRAY(
      'Affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal',
      'Approved by All India Council for Technical Education (AICTE), New Delhi',
      'NAAC Accredited — Grade A',
      'NBA Accredited Programmes — B.E. Computer Engineering, Information Technology & Mechanical Engineering',
      'Autonomous Institute under Government of Madhya Pradesh',
      'University Grants Commission (UGC) recognized institution'
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.2  about.vision_mission ─────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.vision_mission',
  JSON_OBJECT(
    'visionEnglish', 'To be a premier, globally recognized technical institution that fosters academic excellence, innovation, and ethical leadership to produce competent engineers and technologists who contribute to the sustainable development of society and the nation.',
    'visionHindi',   'एक प्रमुख, विश्व स्तर पर मान्यता प्राप्त तकनीकी संस्था बनना जो शैक्षणिक उत्कृष्टता, नवाचार और नैतिक नेतृत्व को बढ़ावा देती है तथा ऐसे सक्षम अभियंता और प्रौद्योगिकीविद् तैयार करती है जो समाज और राष्ट्र के सतत विकास में योगदान दें।',
    'missionPoints', JSON_ARRAY(
      JSON_OBJECT('num','01','text','To impart quality technical education through a rigorous, industry-relevant curriculum that meets national and international academic standards and is continuously updated to reflect emerging technologies.'),
      JSON_OBJECT('num','02','text','To build a strong research and innovation culture by providing state-of-the-art laboratories, promoting faculty development, and encouraging industry-sponsored and government-funded research projects.'),
      JSON_OBJECT('num','03','text','To develop graduates with sound analytical, design, and problem-solving skills who are well-equipped to excel in competitive professional environments and pursue higher education globally.'),
      JSON_OBJECT('num','04','text','To nurture professional ethics, integrity, social responsibility, and environmental consciousness as core values in all academic, research, and co-curricular activities.'),
      JSON_OBJECT('num','05','text','To establish and strengthen productive partnerships with industry, alumni, and government bodies for internships, training, placement, consultancy, and collaborative research.'),
      JSON_OBJECT('num','06','text','To ensure holistic student development through sports, cultural activities, NSS, NCC, student governance, and entrepreneurship programs that build leadership and life skills.')
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.3  about.leadership (Director Message) ─────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.leadership',
  JSON_OBJECT(
    'directorName',    'Prof. R.K. Pandey',
    'directorPhotoUrl','/uploads/about/director-rk-pandey.jpg',
    'directorEmail',   'director@sgsits.ac.in',
    'directorPhone',   '0731-2431301',
    'directorOffice',  'Director''s Office, Ground Floor, Main Building, SGSITS, Indore — 452 003',
    'quote',           'Education is not merely the acquisition of knowledge; it is the cultivation of character, the sharpening of intellect, and the kindling of the spirit to serve humanity with excellence and integrity.',
    'paragraphs', JSON_ARRAY(
      'Dear Students, Faculty, Staff, and Visitors — Welcome to Shri G.S. Institute of Technology and Science, Indore. It is a matter of immense pride and privilege to lead this distinguished institution that has been shaping the technical landscape of India since 1952.',
      'SGSITS stands as a living testament to the vision of its founder, Late Shri Govindram Seksaria Birla, who believed that quality technical education is the cornerstone of national progress. Over seven decades, this institute has produced engineers, researchers, managers, and thought leaders who have made significant contributions to industry, academia, and public life across India and the world.',
      'Our faculty — many of whom are graduates of IITs, NITs, and reputed international universities — bring deep expertise, research acumen, and a genuine commitment to student success. The institute infrastructure has been continuously modernized to include state-of-the-art laboratories, a well-stocked library with digital access to IEEE Xplore, ScienceDirect, Springer, and NPTEL, and a 100 Mbps smart Wi-Fi campus. Our NBA-accredited programmes and NAAC Grade A accreditation are testaments to the quality we deliver consistently.',
      'I invite all prospective students to join us and be part of a community that values intellectual curiosity, professional excellence, and service to society. Together, we will build a future that honours our heritage while embracing the challenges and opportunities of a rapidly changing world. I look forward to welcoming you to the SGSITS family.'
    )
  ),
  @director
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.4  about.governing_body ─────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.governing_body',
  JSON_OBJECT(
    'description', 'The Board of Governors (Governing Body) of SGSITS is the apex statutory body responsible for policy decisions, financial oversight, and overall governance of the institute. It is constituted as per the provisions of the Madhya Pradesh Technical Education Act and the statutes of Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal.',
    'members', JSON_ARRAY(
      JSON_OBJECT('role','Chairman — Secretary, Technical Education & Skill Development Dept., Govt. of M.P.',   'name','As per Govt. of M.P. Nominee',      'category','Government'),
      JSON_OBJECT('role','Director, SGSITS Indore (Member Secretary & Ex-Officio)',                             'name','Prof. R.K. Pandey',                   'category','Government'),
      JSON_OBJECT('role','Nominee of Vice Chancellor, RGPV Bhopal',                                            'name','As per RGPV Nomination',              'category','University'),
      JSON_OBJECT('role','Joint Director, Directorate of Technical Education, Govt. of M.P.',                  'name','As per DTE Nomination',               'category','Government'),
      JSON_OBJECT('role','Regional Officer, AICTE Regional Office, Bhopal',                                    'name','As per AICTE Nomination',             'category','Regulatory'),
      JSON_OBJECT('role','Representative from Industry / CII / FICCI',                                         'name','As per Industry Nomination',          'category','Industry'),
      JSON_OBJECT('role','Eminent Industrialist, Indore',                                                      'name','As per Industry Nomination',          'category','Industry'),
      JSON_OBJECT('role','Dean (Academics), SGSITS — Ex-Officio Member',                                       'name','Senior Faculty Nominee',              'category','Faculty'),
      JSON_OBJECT('role','Nominee of the Academic Council, SGSITS',                                            'name','Elected Faculty Representative',      'category','Faculty')
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.5  about.administration ─────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.administration',
  JSON_ARRAY(
    JSON_OBJECT('title','Director',                              'name','Prof. R.K. Pandey',          'email','director@sgsits.ac.in',        'phone','0731-2431301'),
    JSON_OBJECT('title','Controller of Examinations',           'name','Dr. Suresh Malviya',         'email','examcontroller@sgsits.ac.in',  'phone','0731-2431308'),
    JSON_OBJECT('title','Training & Placement Officer',         'name','Mr. Vivek Tiwari',           'email','placement@sgsits.ac.in',       'phone','0731-2431320'),
    JSON_OBJECT('title','Finance & Accounts Officer',           'name','—',                          'email','accounts@sgsits.ac.in',        'phone','0731-2431310'),
    JSON_OBJECT('title','HOD — Computer Engineering',           'name','Dr. Ajay Khunteta',          'email','hod.ce@sgsits.ac.in',          'phone','9826002001'),
    JSON_OBJECT('title','HOD — Information Technology',         'name','Dr. Kapil Jain',             'email','hod.it@sgsits.ac.in',          'phone','9826002002'),
    JSON_OBJECT('title','HOD — Mechanical Engineering',         'name','Dr. Pradeep Kasande',        'email','hod.me@sgsits.ac.in',          'phone','9826002003'),
    JSON_OBJECT('title','HOD — Civil Engineering',              'name','Dr. Yogesh Kumar Bajpai',    'email','hod.civil@sgsits.ac.in',       'phone','9826002004'),
    JSON_OBJECT('title','HOD — Electrical Engineering',         'name','Dr. Manoj Kumar Jain',       'email','hod.ee@sgsits.ac.in',          'phone','9826002005'),
    JSON_OBJECT('title','HOD — Electronics & Telecommunication','name','Dr. Shailendra Kumar Singh', 'email','hod.ec@sgsits.ac.in',          'phone','9826002006'),
    JSON_OBJECT('title','HOD — Applied Sciences & Humanities',  'name','Dr. Rekha Pandey',           'email','hod.ash@sgsits.ac.in',         'phone','9826002007'),
    JSON_OBJECT('title','HOD — Master of Computer Applications','name','Dr. Vandana Bhatt',          'email','hod.mca@sgsits.ac.in',         'phone','9826002008'),
    JSON_OBJECT('title','HOD — Management Studies (MBA)',       'name','Dr. Sanjay Sharma',          'email','hod.mba@sgsits.ac.in',         'phone','9826002009')
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.6  about.telephone_directory ───────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.telephone_directory',
  JSON_ARRAY(
    JSON_OBJECT('department','SGSITS — Main Reception',             'name','—',                              'phone','0731-2431300','ext','—'),
    JSON_OBJECT('department','Director''s Office',                   'name','Prof. R.K. Pandey',             'phone','0731-2431301','ext','301'),
    JSON_OBJECT('department','Fax',                                  'name','—',                              'phone','0731-2431302','ext','—'),
    JSON_OBJECT('department','Admissions Office',                    'name','—',                              'phone','0731-2431305','ext','305'),
    JSON_OBJECT('department','Examination Section',                  'name','Dr. Suresh Malviya',            'phone','0731-2431308','ext','308'),
    JSON_OBJECT('department','Finance & Accounts',                   'name','—',                              'phone','0731-2431310','ext','310'),
    JSON_OBJECT('department','IT Cell & Network',                    'name','—',                              'phone','0731-2431315','ext','315'),
    JSON_OBJECT('department','Training & Placement Cell',            'name','Mr. Vivek Tiwari',              'phone','0731-2431320','ext','320'),
    JSON_OBJECT('department','Chief Warden (Hostels)',               'name','—',                              'phone','0731-2431325','ext','325'),
    JSON_OBJECT('department','Computer Engineering',                 'name','Dr. Ajay Khunteta (HOD)',       'phone','9826002001',   'ext','—'),
    JSON_OBJECT('department','Information Technology',               'name','Dr. Kapil Jain (HOD)',          'phone','9826002002',   'ext','—'),
    JSON_OBJECT('department','Mechanical Engineering',               'name','Dr. Pradeep Kasande (HOD)',     'phone','9826002003',   'ext','—'),
    JSON_OBJECT('department','Civil Engineering',                    'name','Dr. Yogesh Kumar Bajpai (HOD)', 'phone','9826002004',   'ext','—'),
    JSON_OBJECT('department','Electrical Engineering',               'name','Dr. Manoj Kumar Jain (HOD)',    'phone','9826002005',   'ext','—'),
    JSON_OBJECT('department','Electronics & Telecommunication',      'name','Dr. Shailendra Kumar Singh (HOD)','phone','9826002006','ext','—'),
    JSON_OBJECT('department','Applied Sciences & Humanities',        'name','Dr. Rekha Pandey (HOD)',        'phone','9826002007',   'ext','—'),
    JSON_OBJECT('department','Master of Computer Applications (MCA)','name','Dr. Vandana Bhatt (HOD)',       'phone','9826002008',   'ext','—'),
    JSON_OBJECT('department','Management Studies (MBA)',             'name','Dr. Sanjay Sharma (HOD)',       'phone','9826002009',   'ext','—')
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.7  about.infrastructure ────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.infrastructure',
  JSON_OBJECT(
    'summary',     'SGSITS provides world-class infrastructure across its campus at 23, Park Road, Indore. The institute continually invests in modernizing academic, research, and residential facilities to create a stimulating and comfortable learning environment. From state-of-the-art laboratories and a fully digitized library to well-maintained hostels and an extensive sports complex, SGSITS infrastructure supports holistic student development.',
    'campusArea',  '23, Park Road, Indore',
    'builtUpArea', 'Multi-Storey Academic Complex',
    'items', JSON_ARRAY(
      JSON_OBJECT('title','Central Library',   'description','Houses over 60,000 books and 150+ national and international journals. Provides digital access to IEEE Xplore, ScienceDirect, Springer, and NPTEL. Open Monday–Saturday 8 AM–9 PM with 40 dedicated e-learning terminals.', 'stats',JSON_ARRAY(JSON_OBJECT('label','Books','value','60,000+'))),
      JSON_OBJECT('title','Laboratories',      'description','State-of-the-art labs equipped with modern instruments and computing resources across all departments, supporting UG, PG, and doctoral research programmes.',                                                                    'stats',JSON_ARRAY(JSON_OBJECT('label','Research Labs','value','9'))),
      JSON_OBJECT('title','Hostels',           'description','Boys Hostel: 3 blocks accommodating 350 students. Girls Hostel: 1 block accommodating 150 students. Priority given to outstation students. Hostel mess serves breakfast, lunch, and dinner.',                               'stats',JSON_ARRAY(JSON_OBJECT('label','Total Seats','value','500'))),
      JSON_OBJECT('title','Sports Complex',    'description','Comprehensive sports facilities including cricket ground, football ground, volleyball court, badminton court, indoor games room, and a fully-equipped gymnasium. Annual Sports Meet is held every January.',                   'stats',JSON_ARRAY(JSON_OBJECT('label','Facilities','value','6+'))),
      JSON_OBJECT('title','Computer Centre',   'description','Centralized computing facility with high-end workstations, licensed software, and dedicated internet access. Available for all students and research scholars throughout the academic day.',                                  'stats',JSON_ARRAY(JSON_OBJECT('label','Internet Speed','value','100 Mbps'))),
      JSON_OBJECT('title','Wi-Fi Campus',      'description','Smart Campus with 100 Mbps Wi-Fi connectivity across all academic blocks, library, hostels, and sports complex. Students connect using their institute credentials. IT Cell: 0731-2431315.',                               'stats',JSON_ARRAY(JSON_OBJECT('label','Coverage','value','Full Campus'))),
      JSON_OBJECT('title','Academic Blocks',   'description','Well-designed academic blocks housing classrooms, tutorial rooms, seminar halls, department offices, and faculty chambers. The Main Building houses central administration and the Director''s office.',                     'stats',JSON_ARRAY(JSON_OBJECT('label','Departments','value','16+'))),
      JSON_OBJECT('title','Auditorium',        'description','Spacious auditorium used for convocation ceremonies, technical symposia, cultural events, guest lectures, and institute-level functions throughout the academic year.',                                                       'stats',JSON_ARRAY(JSON_OBJECT('label','Capacity','value','Large Hall'))),
      JSON_OBJECT('title','Health Centre',     'description','Institute dispensary providing basic medical care for students and staff. Doctor available on scheduled days. Emergency first-aid facility operational throughout campus hours.',                                             'stats',JSON_ARRAY(JSON_OBJECT('label','Type','value','Dispensary')))
    ),
    'additionalFacilities', JSON_ARRAY(
      'Central Canteen (Mon–Sat 8AM–7PM, Sun 9AM–5PM)',
      'Hostel Mess (Breakfast, Lunch & Dinner)',
      'Dispensary / Health Centre',
      'Anti-Ragging Helpline: 1800-180-5522',
      'NSS & NCC Wings',
      'Entrepreneurship & Incubation Cell',
      'TEQIP-funded Research Infrastructure',
      'AICTE IDEA Lab',
      'Staff Quarters & Transit Hostel',
      'Reprographics Centre',
      'ATM Facility on Campus'
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.8  about.iqac ───────────────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.iqac',
  JSON_OBJECT(
    'about', 'The Internal Quality Assurance Cell (IQAC) of SGSITS was established in compliance with the directives of the National Assessment and Accreditation Council (NAAC), New Delhi. The IQAC serves as a nodal agency for channelizing the efforts of the institute towards academic and administrative excellence. It works proactively to plan, guide, and review quality initiatives, ensuring that all academic activities are undertaken with a strong focus on continuous quality improvement.',
    'objectives', JSON_ARRAY(
      'To develop a quality-centric culture in all academic and administrative activities of the institute.',
      'To plan and guide academic activities, ensuring relevance, rigor, and consistency with the institute vision and mission.',
      'To monitor and review teaching-learning processes, including curriculum delivery, assessment, and faculty development.',
      'To promote research, consultancy, and industry-academia interactions that enhance the institutional profile and student employability.',
      'To ensure timely and efficient implementation of decisions of the Academic Council and Board of Governors.',
      'To prepare and submit Annual Quality Assurance Reports (AQAR) to NAAC as per prescribed guidelines.',
      'To document and disseminate best practices in academics, research, and student development across the institute.',
      'To facilitate the use of modern technology in teaching, learning, and administration for enhanced effectiveness.'
    ),
    'chairpersonName',  'Prof. R.K. Pandey',
    'chairpersonTitle', 'Director, SGSITS Indore',
    'coordinatorName',  'Dr. Rekha Pandey',
    'coordinatorTitle', 'HOD, Applied Sciences & Humanities, SGSITS',
    'recentActivities', JSON_ARRAY(
      JSON_OBJECT('title','NAAC Peer Team Visit — 3rd Cycle',                      'description','Successful NAAC accreditation visit resulting in Grade A award. Self-Study Report submitted and accepted by the Peer Team.',                                                             'date','2023'),
      JSON_OBJECT('title','Faculty Development Programme on OBE Implementation',   'description','Workshop conducted for all departments on Outcome-Based Education framework, CO-PO mapping, and attainment computation as per NBA requirements.',                                       'date','2024'),
      JSON_OBJECT('title','Annual IQAC Meeting — Academic Planning 2025–26',       'description','Annual review of academic calendar, curriculum revision, research output, and quality benchmarks for the forthcoming academic session.',                                                'date','2025')
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.9  about.academic_council ───────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.academic_council',
  JSON_OBJECT(
    'description', 'The Academic Council is the principal academic body of SGSITS and is responsible for the maintenance of standards of instruction, education, and examination. It is constituted under the provisions of the RGPV Act and institute statutes, with the Director as Chairperson. The Academic Council prescribes courses of study, conducts examinations, and exercises general supervision over all academic affairs of the institute.',
    'members', JSON_ARRAY(
      JSON_OBJECT('sno',1,  'designation','Director, SGSITS (Chairperson)',                  'name','Prof. R.K. Pandey',           'category','Ex-Officio'),
      JSON_OBJECT('sno',2,  'designation','HOD — Computer Engineering',                     'name','Dr. Ajay Khunteta',            'category','Ex-Officio'),
      JSON_OBJECT('sno',3,  'designation','HOD — Information Technology',                   'name','Dr. Kapil Jain',               'category','Ex-Officio'),
      JSON_OBJECT('sno',4,  'designation','HOD — Mechanical Engineering',                   'name','Dr. Pradeep Kasande',          'category','Ex-Officio'),
      JSON_OBJECT('sno',5,  'designation','HOD — Civil Engineering',                        'name','Dr. Yogesh Kumar Bajpai',      'category','Ex-Officio'),
      JSON_OBJECT('sno',6,  'designation','HOD — Electrical Engineering',                   'name','Dr. Manoj Kumar Jain',         'category','Ex-Officio'),
      JSON_OBJECT('sno',7,  'designation','HOD — Electronics & Telecommunication',          'name','Dr. Shailendra Kumar Singh',   'category','Ex-Officio'),
      JSON_OBJECT('sno',8,  'designation','HOD — Applied Sciences & Humanities',            'name','Dr. Rekha Pandey',             'category','Ex-Officio'),
      JSON_OBJECT('sno',9,  'designation','HOD — Master of Computer Applications',          'name','Dr. Vandana Bhatt',            'category','Ex-Officio'),
      JSON_OBJECT('sno',10, 'designation','HOD — Management Studies (MBA)',                 'name','Dr. Sanjay Sharma',            'category','Ex-Officio'),
      JSON_OBJECT('sno',11, 'designation','Controller of Examinations (Ex-Officio)',        'name','Dr. Suresh Malviya',           'category','Ex-Officio'),
      JSON_OBJECT('sno',12, 'designation','Nominee of Vice Chancellor, RGPV Bhopal',        'name','As per RGPV Nomination',       'category','External'),
      JSON_OBJECT('sno',13, 'designation','Subject Expert from Industry / External Expert', 'name','As per Nomination',            'category','Industry'),
      JSON_OBJECT('sno',14, 'designation','Elected Faculty Representative',                 'name','Dr. Nisha Thakur',             'category','Nominated'),
      JSON_OBJECT('sno',15, 'designation','Elected Faculty Representative',                 'name','Dr. Rakesh Chouksey',          'category','Nominated')
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.10 about.accreditation ─────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.accreditation',
  JSON_OBJECT(
    'about', 'SGSITS Indore has consistently demonstrated commitment to academic quality and institutional excellence through national accreditation and ranking systems. The institute is accredited by the National Assessment and Accreditation Council (NAAC) with Grade A, and several undergraduate programmes are accredited by the National Board of Accreditation (NBA). The institute is approved by AICTE and affiliated to RGPV, Bhopal, and participates in the National Institutional Ranking Framework (NIRF).',
    'records', JSON_ARRAY(
      JSON_OBJECT('body','NAAC', 'grade','A',           'naacScore',NULL, 'cycle','3rd Cycle', 'validUpto','2028'),
      JSON_OBJECT('body','NBA',  'grade','Accredited',  'naacScore',NULL, 'cycle','2023–26',   'validUpto','2026'),
      JSON_OBJECT('body','NIRF', 'grade','Top 50 (MP)', 'naacScore',NULL, 'cycle','2025',      'validUpto','2025')
    ),
    'nbaPrograms', JSON_ARRAY(
      'B.E. Computer Engineering',
      'B.E. Information Technology',
      'B.E. Mechanical Engineering'
    ),
    'nirf', JSON_ARRAY(
      JSON_OBJECT('year','2025','rank','Top 50 (State)','category','Engineering — Madhya Pradesh'),
      JSON_OBJECT('year','2024','rank','Top 50 (State)','category','Engineering — Madhya Pradesh'),
      JSON_OBJECT('year','2023','rank','Top 50 (State)','category','Engineering — Madhya Pradesh')
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.11 about.committees ────────────────────────────────────────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES (
  'about.committees',
  JSON_ARRAY(
    JSON_OBJECT(
      'name','Anti-Ragging Committee',
      'desc','Constituted as per the directives of the Honorable Supreme Court of India and UGC/AICTE anti-ragging regulations. Responsible for preventing, detecting, and taking action on all ragging incidents on campus and in associated hostels.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Chairman',             'name','Prof. R.K. Pandey',         'dept','Director, SGSITS'),
        JSON_OBJECT('role','Faculty Representative','name','Dr. Nisha Thakur',          'dept','Computer Engineering'),
        JSON_OBJECT('role','Faculty Representative','name','Dr. Archana Patel',         'dept','Electrical Engineering'),
        JSON_OBJECT('role','Warden Representative', 'name','Chief Warden Nominee',      'dept','Hostel Administration'),
        JSON_OBJECT('role','Student Representative','name','Student Council President',  'dept','Student Body'),
        JSON_OBJECT('role','External Member',       'name','Local Authority Nominee',    'dept','Civil Administration')
      )
    ),
    JSON_OBJECT(
      'name','Internal Complaints Committee (ICC)',
      'desc','Constituted under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013. Ensures a safe and respectful workplace and academic environment for all women employees and students.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Presiding Officer',          'name','Dr. Rekha Pandey',             'dept','Applied Sciences & Humanities'),
        JSON_OBJECT('role','Faculty Member',             'name','Dr. Vandana Bhatt',            'dept','Master of Computer Applications'),
        JSON_OBJECT('role','Faculty Member',             'name','Dr. Neha Joshi',               'dept','Mechanical Engineering'),
        JSON_OBJECT('role','Non-Teaching Representative','name','Administrative Staff Nominee', 'dept','Administration'),
        JSON_OBJECT('role','External Member',            'name','External NGO/Legal Nominee',   'dept','NGO / Legal')
      )
    ),
    JSON_OBJECT(
      'name','Grievance Redressal Committee',
      'desc','Provides a formal channel for redressal of academic and administrative grievances of students and staff related to examinations, admissions, fee disputes, and general institutional matters.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Chairperson',                'name','Prof. R.K. Pandey',        'dept','Director, SGSITS'),
        JSON_OBJECT('role','Faculty Member',             'name','Dr. Kapil Jain',           'dept','Information Technology'),
        JSON_OBJECT('role','Faculty Member',             'name','Dr. Yogesh Kumar Bajpai',  'dept','Civil Engineering'),
        JSON_OBJECT('role','Administrative Representative','name','Exam Section Nominee',   'dept','Examination Section'),
        JSON_OBJECT('role','Student Representative',     'name','Student Council Nominee',  'dept','Student Body')
      )
    ),
    JSON_OBJECT(
      'name','Placement Advisory Committee',
      'desc','Oversees campus placement activities, industry interactions, and pre-placement training programmes. Coordinates with the Training & Placement Cell to maximise student placement outcomes.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Chairman',                  'name','Prof. R.K. Pandey',       'dept','Director, SGSITS'),
        JSON_OBJECT('role','Placement Coordinator',     'name','Mr. Vivek Tiwari',        'dept','Training & Placement Cell'),
        JSON_OBJECT('role','Faculty Coordinator — CE/IT','name','Dr. Nisha Thakur',       'dept','Computer Engineering'),
        JSON_OBJECT('role','Faculty Coordinator — ME',  'name','Dr. Rakesh Chouksey',     'dept','Mechanical Engineering'),
        JSON_OBJECT('role','Industry Expert',           'name','Industry Nominee',         'dept','Corporate / Industry'),
        JSON_OBJECT('role','Alumni Representative',     'name','Alumni Association Nominee','dept','SGSITS Alumni')
      )
    ),
    JSON_OBJECT(
      'name','Library Advisory Committee',
      'desc','Advises on library development, procurement of books and journals, digital resources, and overall improvement of library services to support the academic and research needs of the institute.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Chairman',               'name','Prof. R.K. Pandey',     'dept','Director, SGSITS'),
        JSON_OBJECT('role','Librarian',              'name','Chief Librarian',        'dept','Central Library'),
        JSON_OBJECT('role','Faculty Representative', 'name','Dr. Ajay Khunteta',     'dept','Computer Engineering'),
        JSON_OBJECT('role','Faculty Representative', 'name','Dr. Sunanda Nagar',     'dept','Applied Sciences & Humanities'),
        JSON_OBJECT('role','Student Representative', 'name','Student Council Nominee','dept','Student Body')
      )
    ),
    JSON_OBJECT(
      'name','Research & Development Committee',
      'desc','Promotes research, innovation, and consultancy across all departments. Coordinates with funding agencies like DST, AICTE, and RGPV for research grants and industry-sponsored collaborative projects.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Chairman',                        'name','Prof. R.K. Pandey',    'dept','Director, SGSITS'),
        JSON_OBJECT('role','Research Coordinator — Engg.',   'name','Dr. Ajay Khunteta',    'dept','Computer Engineering'),
        JSON_OBJECT('role','Research Coordinator — Sciences','name','Dr. Rekha Pandey',      'dept','Applied Sciences & Humanities'),
        JSON_OBJECT('role','Research Coordinator — Mgmt.',   'name','Dr. Sanjay Sharma',     'dept','Management Studies'),
        JSON_OBJECT('role','Industry Liaison',               'name','Industry Expert Nominee','dept','Industry / R&D')
      )
    ),
    JSON_OBJECT(
      'name','SC/ST/OBC & Minority Cell',
      'desc','Ensures implementation of reservation policies and welfare schemes for SC, ST, OBC, EWS, and Minority students. Addresses grievances related to discrimination and facilitates scholarship applications and support services.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Liaison Officer',             'name','Dr. Pratibha Pandey',         'dept','Applied Sciences & Humanities'),
        JSON_OBJECT('role','Faculty Representative',      'name','Dr. Anil Chouhan',             'dept','Applied Sciences & Humanities'),
        JSON_OBJECT('role','Administrative Representative','name','Student Welfare Office Nominee','dept','Student Welfare'),
        JSON_OBJECT('role','Student Representative (SC)', 'name','Student Nominee',              'dept','Student Body'),
        JSON_OBJECT('role','Student Representative (ST)', 'name','Student Nominee',              'dept','Student Body')
      )
    ),
    JSON_OBJECT(
      'name','Curriculum Development Committee',
      'desc','Responsible for periodic review and revision of academic curricula across all programmes, ensuring alignment with NEP 2020, OBE framework, AICTE model curriculum, and industry requirements.',
      'membersList', JSON_ARRAY(
        JSON_OBJECT('role','Chairperson',              'name','Prof. R.K. Pandey',    'dept','Director, SGSITS'),
        JSON_OBJECT('role','Dean Academics / Convener','name','Senior Faculty Nominee','dept','Academic Section'),
        JSON_OBJECT('role','Faculty — CE/IT',          'name','Dr. Kapil Jain',       'dept','Information Technology'),
        JSON_OBJECT('role','Faculty — ME/Civil',       'name','Dr. Pradeep Kasande',  'dept','Mechanical Engineering'),
        JSON_OBJECT('role','Faculty — EE/EC',          'name','Dr. Manoj Kumar Jain', 'dept','Electrical Engineering'),
        JSON_OBJECT('role','Industry Expert',          'name','Industry Nominee',      'dept','Corporate / Industry'),
        JSON_OBJECT('role','RGPV University Nominee',  'name','RGPV Nominee',          'dept','RGPV, Bhopal')
      )
    )
  ),
  @admin
) ON DUPLICATE KEY UPDATE data=VALUES(data), updated_by=VALUES(updated_by);

-- ── 2.12 about.custom_pages (empty — admin populates via CMS) ─────────────────
INSERT INTO cms_sections (section_key, data, updated_by) VALUES ('about.custom_pages', JSON_ARRAY(), @admin)
ON DUPLICATE KEY UPDATE data=data;

-- =============================================================================
-- PART 3: NORMALIZED TABLE DATA SEEDS
-- =============================================================================

-- ── 3.1  about_pages ─────────────────────────────────────────────────────────
INSERT INTO about_pages (section_key, title, slug, subtitle, short_desc, display_order, is_active, seo_title, seo_desc)
VALUES
  ('about.overview',           'About Institute',            'about-institute',        'Shri G.S. Institute of Technology and Science, Indore',                                    'Established 1952, autonomous institute affiliated to RGPV, approved by AICTE, NAAC Grade A.',                                          1,  1, 'About SGSITS Indore — Institute Overview | Established 1952',                 'Learn about Shri G.S. Institute of Technology and Science Indore — established 1952, NAAC A Grade, NBA accredited, RGPV affiliated autonomous institute in MP.'),
  ('about.vision_mission',     'Vision & Mission',           'vision-mission',         'Our guiding principles for academic excellence',                                           'Vision and mission statements defining SGSITS commitment to engineering excellence and ethical leadership.',                             2,  1, 'Vision & Mission — SGSITS Indore',                                           'SGSITS Vision: Premier globally recognized technical institution. Mission: Quality education, research, professional ethics, and industry partnerships.'),
  ('about.leadership',         'Director''s Message',         'director-message',       'A vision statement from our Director',                                                     'Message from Prof. R.K. Pandey, Director, SGSITS Indore.',                                                                               3,  1, 'Director''s Message — SGSITS Indore | Prof. R.K. Pandey',                    'Read the Director''s message from Prof. R.K. Pandey, SGSITS Indore — on academic excellence, research, and student success.'),
  ('about.governing_body',     'Governing Body',             'governing-body',         'Board of Governors — SGSITS Indore',                                                       'The apex statutory body responsible for policy decisions and governance of SGSITS.',                                                      4,  1, 'Governing Body — SGSITS Indore | Board of Governors',                        'Board of Governors of SGSITS Indore — constituted as per RGPV Act with Government, University, Industry, Regulatory, and Faculty representatives.'),
  ('about.administration',     'Administration',             'administration',         'Key administrative positions at SGSITS',                                                   'Director, Exam Controller, Placement Officer, Finance Officer, and all department HODs of SGSITS Indore.',                                5,  1, 'Administration — SGSITS Indore | Director, HODs, Officers',                  'Key administrative officials of SGSITS Indore — Director, Controller of Examinations, Placement Officer, Finance Officer, and all department HODs.'),
  ('about.committees',         'Administrative Committees',  'committees',             'Committees constituted for effective governance',                                          'Statutory and advisory committees of SGSITS including Anti-Ragging, ICC, Grievance Redressal, Placement Advisory, R&D, and more.',        6,  1, 'Administrative Committees — SGSITS Indore | Governance Bodies',              'Administrative committees of SGSITS Indore — Anti-Ragging, ICC, Grievance Redressal, Placement Advisory, Library Advisory, R&D, SC/ST Cell, Curriculum Development.'),
  ('about.telephone_directory','Telephone Directory',        'telephone-directory',    'Department-wise contact numbers',                                                          'Complete telephone directory of SGSITS Indore with department-wise contact numbers and extensions.',                                      7,  1, 'Telephone Directory — SGSITS Indore | Department Contact Numbers',           'Contact numbers for all departments and offices at SGSITS Indore. Director: 0731-2431301. Main: 0731-2431300.'),
  ('about.infrastructure',     'Infrastructure',             'infrastructure',         'World-class facilities for holistic development',                                          'SGSITS campus infrastructure — 60,000+ book library, 9 research labs, 500-seat hostels, sports complex, and smart Wi-Fi campus.',        8,  1, 'Infrastructure — SGSITS Indore | Campus Facilities | Library, Labs, Hostels','Explore SGSITS Indore campus — 60,000+ book library with IEEE/Springer digital access, 100 Mbps Wi-Fi, Boys Hostel (350 seats), Girls Hostel (150 seats), sports facilities.'),
  ('about.iqac',               'IQAC Cell',                  'iqac',                   'Internal Quality Assurance Cell',                                                          'IQAC established under NAAC mandate to drive quality initiatives across academics, research, and administration.',                         9,  1, 'IQAC Cell — SGSITS Indore | Internal Quality Assurance',                    'IQAC of SGSITS Indore — established under NAAC mandate. Chairperson: Prof. R.K. Pandey. Objectives, composition, and recent quality initiatives.'),
  ('about.academic_council',   'Academic Council',           'academic-council',       'Apex academic body of the institute',                                                      'The Academic Council prescribes courses, conducts examinations, and supervises all academic affairs of SGSITS.',                          10, 1, 'Academic Council — SGSITS Indore | Academic Governance',                    'SGSITS Academic Council — presided by Director Prof. R.K. Pandey. Responsible for curriculum, examinations, and academic standards. Composition listed.'),
  ('about.accreditation',      'Accreditation (NBA/NAAC)',   'accreditation',          'NAAC, NBA, and NIRF recognition',                                                          'SGSITS is NAAC Grade A accredited, with NBA-accredited B.E. programmes in Computer Engineering, IT, and Mechanical Engineering.',        11, 1, 'Accreditation — SGSITS Indore | NAAC Grade A | NBA | NIRF',                 'SGSITS Indore — NAAC Grade A accredited, NBA accredited B.E. Computer Engineering, IT & Mechanical Engineering, NIRF ranked Top 50 in Madhya Pradesh.')
ON DUPLICATE KEY UPDATE
  title=VALUES(title), subtitle=VALUES(subtitle), short_desc=VALUES(short_desc),
  display_order=VALUES(display_order), seo_title=VALUES(seo_title), seo_desc=VALUES(seo_desc);

-- ── 3.2  director_messages ────────────────────────────────────────────────────
INSERT INTO director_messages
  (director_name, designation, qualification, email, phone, office_location, quote, message_html, is_active, effective_from, updated_by)
VALUES (
  'Prof. R.K. Pandey',
  'Director',
  'Ph.D. (IIT Delhi)',
  'director@sgsits.ac.in',
  '0731-2431301',
  'Director''s Office, Ground Floor, Main Building, SGSITS, 23 Park Road, Indore — 452 003 (M.P.)',
  'Education is not merely the acquisition of knowledge; it is the cultivation of character, the sharpening of intellect, and the kindling of the spirit to serve humanity with excellence and integrity.',
  '<p>Dear Students, Faculty, Staff, and Visitors — Welcome to Shri G.S. Institute of Technology and Science, Indore. It is a matter of immense pride and privilege to lead this distinguished institution that has been shaping the technical landscape of India since 1952.</p><p>SGSITS stands as a living testament to the vision of its founder, Late Shri Govindram Seksaria Birla, who believed that quality technical education is the cornerstone of national progress. Over seven decades, this institute has produced engineers, researchers, managers, and thought leaders who have made significant contributions to industry, academia, and public life across India and the world.</p><p>Our faculty — many of whom are graduates of IITs, NITs, and reputed international universities — bring deep expertise, research acumen, and a genuine commitment to student success. The institute infrastructure has been continuously modernized to include state-of-the-art laboratories, a well-stocked library with digital access to IEEE Xplore, ScienceDirect, Springer, and NPTEL, and a 100 Mbps smart Wi-Fi campus. Our NBA-accredited programmes and NAAC Grade A accreditation are testaments to the quality we deliver consistently.</p><p>I invite all prospective students to join us and be part of a community that values intellectual curiosity, professional excellence, and service to society. Together, we will build a future that honours our heritage while embracing the challenges and opportunities of a rapidly changing world. I look forward to welcoming you to the SGSITS family.</p>',
  1,
  '2020-01-01',
  @admin
);

-- ── 3.3  about_vision_mission ─────────────────────────────────────────────────
INSERT INTO about_vision_mission (id, vision_english, vision_hindi, updated_by)
VALUES (1,
  'To be a premier, globally recognized technical institution that fosters academic excellence, innovation, and ethical leadership to produce competent engineers and technologists who contribute to the sustainable development of society and the nation.',
  'एक प्रमुख, विश्व स्तर पर मान्यता प्राप्त तकनीकी संस्था बनना जो शैक्षणिक उत्कृष्टता, नवाचार और नैतिक नेतृत्व को बढ़ावा देती है तथा ऐसे सक्षम अभियंता और प्रौद्योगिकीविद् तैयार करती है जो समाज और राष्ट्र के सतत विकास में योगदान दें।',
  @admin
) ON DUPLICATE KEY UPDATE vision_english=VALUES(vision_english), vision_hindi=VALUES(vision_hindi), updated_by=VALUES(updated_by);

-- ── 3.4  mission_points ───────────────────────────────────────────────────────
INSERT INTO mission_points (num, text, sort_order, is_active) VALUES
  (1,'To impart quality technical education through a rigorous, industry-relevant curriculum that meets national and international academic standards and is continuously updated to reflect emerging technologies.',1,1),
  (2,'To build a strong research and innovation culture by providing state-of-the-art laboratories, promoting faculty development, and encouraging industry-sponsored and government-funded research projects.',2,1),
  (3,'To develop graduates with sound analytical, design, and problem-solving skills who are well-equipped to excel in competitive professional environments and pursue higher education globally.',3,1),
  (4,'To nurture professional ethics, integrity, social responsibility, and environmental consciousness as core values in all academic, research, and co-curricular activities.',4,1),
  (5,'To establish and strengthen productive partnerships with industry, alumni, and government bodies for internships, training, placement, consultancy, and collaborative research.',5,1),
  (6,'To ensure holistic student development through sports, cultural activities, NSS, NCC, student governance, and entrepreneurship programs that build leadership and life skills.',6,1);

-- ── 3.5  governing_body_members ───────────────────────────────────────────────
INSERT INTO governing_body_members (role, member_name, category, sort_order, is_active) VALUES
  ('Chairman — Secretary, Technical Education & Skill Development Dept., Govt. of M.P.','As per Govt. of M.P. Nominee',  'Government', 1,1),
  ('Director, SGSITS Indore (Member Secretary & Ex-Officio)',                           'Prof. R.K. Pandey',              'Government', 2,1),
  ('Nominee of Vice Chancellor, RGPV Bhopal',                                           'As per RGPV Nomination',         'University', 3,1),
  ('Joint Director, Directorate of Technical Education, Govt. of M.P.',                 'As per DTE Nomination',          'Government', 4,1),
  ('Regional Officer, AICTE Regional Office, Bhopal',                                   'As per AICTE Nomination',        'Regulatory', 5,1),
  ('Representative from Industry / CII / FICCI',                                        'As per Industry Nomination',     'Industry',   6,1),
  ('Eminent Industrialist, Indore',                                                      'As per Industry Nomination',     'Industry',   7,1),
  ('Dean (Academics), SGSITS — Ex-Officio Member',                                      'Senior Faculty Nominee',         'Faculty',    8,1),
  ('Nominee of the Academic Council, SGSITS',                                            'Elected Faculty Representative', 'Faculty',    9,1);

-- ── 3.6  administrators ───────────────────────────────────────────────────────
INSERT INTO administrators (title, name, email, phone, sort_order, is_active) VALUES
  ('Director',                               'Prof. R.K. Pandey',          'director@sgsits.ac.in',        '0731-2431301', 1, 1),
  ('Controller of Examinations',             'Dr. Suresh Malviya',         'examcontroller@sgsits.ac.in',  '0731-2431308', 2, 1),
  ('Training & Placement Officer',           'Mr. Vivek Tiwari',           'placement@sgsits.ac.in',       '0731-2431320', 3, 1),
  ('Finance & Accounts Officer',             '—',                           'accounts@sgsits.ac.in',        '0731-2431310', 4, 1),
  ('HOD — Computer Engineering',             'Dr. Ajay Khunteta',          'hod.ce@sgsits.ac.in',          '9826002001',   5, 1),
  ('HOD — Information Technology',           'Dr. Kapil Jain',             'hod.it@sgsits.ac.in',          '9826002002',   6, 1),
  ('HOD — Mechanical Engineering',           'Dr. Pradeep Kasande',        'hod.me@sgsits.ac.in',          '9826002003',   7, 1),
  ('HOD — Civil Engineering',                'Dr. Yogesh Kumar Bajpai',    'hod.civil@sgsits.ac.in',       '9826002004',   8, 1),
  ('HOD — Electrical Engineering',           'Dr. Manoj Kumar Jain',       'hod.ee@sgsits.ac.in',          '9826002005',   9, 1),
  ('HOD — Electronics & Telecommunication',  'Dr. Shailendra Kumar Singh', 'hod.ec@sgsits.ac.in',          '9826002006',   10,1),
  ('HOD — Applied Sciences & Humanities',    'Dr. Rekha Pandey',           'hod.ash@sgsits.ac.in',         '9826002007',   11,1),
  ('HOD — Master of Computer Applications',  'Dr. Vandana Bhatt',          'hod.mca@sgsits.ac.in',         '9826002008',   12,1),
  ('HOD — Management Studies (MBA)',         'Dr. Sanjay Sharma',          'hod.mba@sgsits.ac.in',         '9826002009',   13,1);

-- ── 3.7  telephone_directory ─────────────────────────────────────────────────
INSERT INTO telephone_directory (department, contact_name, phone, ext, sort_order, is_active) VALUES
  ('SGSITS — Main Reception',              '—',                               '0731-2431300','—',   1, 1),
  ('Director''s Office',                    'Prof. R.K. Pandey',               '0731-2431301','301', 2, 1),
  ('Fax',                                   '—',                               '0731-2431302','—',   3, 1),
  ('Admissions Office',                     '—',                               '0731-2431305','305', 4, 1),
  ('Examination Section',                   'Dr. Suresh Malviya',              '0731-2431308','308', 5, 1),
  ('Finance & Accounts',                    '—',                               '0731-2431310','310', 6, 1),
  ('IT Cell & Network',                     '—',                               '0731-2431315','315', 7, 1),
  ('Training & Placement Cell',             'Mr. Vivek Tiwari',                '0731-2431320','320', 8, 1),
  ('Chief Warden (Hostels)',                '—',                               '0731-2431325','325', 9, 1),
  ('Computer Engineering',                  'Dr. Ajay Khunteta (HOD)',         '9826002001',  '—',   10,1),
  ('Information Technology',                'Dr. Kapil Jain (HOD)',            '9826002002',  '—',   11,1),
  ('Mechanical Engineering',                'Dr. Pradeep Kasande (HOD)',       '9826002003',  '—',   12,1),
  ('Civil Engineering',                     'Dr. Yogesh Kumar Bajpai (HOD)',   '9826002004',  '—',   13,1),
  ('Electrical Engineering',                'Dr. Manoj Kumar Jain (HOD)',      '9826002005',  '—',   14,1),
  ('Electronics & Telecommunication',       'Dr. Shailendra Kumar Singh (HOD)','9826002006',  '—',   15,1),
  ('Applied Sciences & Humanities',         'Dr. Rekha Pandey (HOD)',          '9826002007',  '—',   16,1),
  ('Master of Computer Applications (MCA)', 'Dr. Vandana Bhatt (HOD)',         '9826002008',  '—',   17,1),
  ('Management Studies (MBA)',              'Dr. Sanjay Sharma (HOD)',         '9826002009',  '—',   18,1);

-- ── 3.8  infrastructure_items ─────────────────────────────────────────────────
INSERT INTO infrastructure_items (title, description, primary_stat_label, primary_stat_value, sort_order, is_active) VALUES
  ('Central Library',   'Houses over 60,000 books and 150+ journals. Digital access to IEEE Xplore, ScienceDirect, Springer, and NPTEL. Open Mon–Sat 8 AM–9 PM with 40 e-learning terminals.',                        'Books',         '60,000+',    1,1),
  ('Laboratories',      'State-of-the-art labs with modern instruments and computing resources across all departments, supporting UG, PG, and doctoral research programmes.',                                           'Research Labs', '9',          2,1),
  ('Hostels',           'Boys Hostel: 3 blocks, 350 seats. Girls Hostel: 1 block, 150 seats. Priority for outstation students. Hostel mess serves breakfast, lunch, and dinner.',                                      'Total Seats',   '500',        3,1),
  ('Sports Complex',    'Cricket ground, football ground, volleyball and badminton courts, indoor games room, and fully-equipped gymnasium. Annual Sports Meet every January.',                                          'Facilities',    '6+',         4,1),
  ('Computer Centre',   'Centralized computing facility with high-end workstations, licensed software, and dedicated internet access for all students and research scholars.',                                          'Internet Speed','100 Mbps',   5,1),
  ('Wi-Fi Campus',      'Smart Campus with 100 Mbps Wi-Fi across all academic blocks, library, hostels, and sports complex. Students connect using institute credentials. IT Cell: 0731-2431315.',                     'Coverage',      'Full Campus', 6,1),
  ('Academic Blocks',   'Multi-storey academic blocks housing classrooms, tutorial rooms, seminar halls, department offices, and faculty chambers. Main Building houses central administration.',                        'Departments',   '16+',        7,1),
  ('Auditorium',        'Spacious auditorium for convocation, technical symposia, cultural events, guest lectures, and institute-level functions.',                                                                      'Capacity',      'Large Hall',  8,1),
  ('Health Centre',     'Institute dispensary providing basic medical care. Doctor available on scheduled days. Emergency first-aid operational round-the-clock.',                                                       'Type',          'Dispensary',  9,1);

-- ── 3.9  iqac_config ─────────────────────────────────────────────────────────
INSERT INTO iqac_config (id, about_text, chairperson_name, chairperson_title, coordinator_name, coordinator_title, updated_by)
VALUES (1,
  'The Internal Quality Assurance Cell (IQAC) of SGSITS was established in compliance with NAAC directives. It serves as a nodal agency channelizing efforts of the institute towards academic and administrative excellence, working proactively to plan, guide, and review quality initiatives.',
  'Prof. R.K. Pandey', 'Director, SGSITS Indore',
  'Dr. Rekha Pandey',  'HOD, Applied Sciences & Humanities, SGSITS',
  @admin
) ON DUPLICATE KEY UPDATE about_text=VALUES(about_text), chairperson_name=VALUES(chairperson_name), coordinator_name=VALUES(coordinator_name), updated_by=VALUES(updated_by);

-- ── 3.10 iqac_objectives ─────────────────────────────────────────────────────
INSERT INTO iqac_objectives (objective, sort_order, is_active) VALUES
  ('To develop a quality-centric culture in all academic and administrative activities of the institute.',1,1),
  ('To plan and guide academic activities, ensuring relevance, rigor, and consistency with institute vision and mission.',2,1),
  ('To monitor and review teaching-learning processes, including curriculum delivery, assessment, and faculty development.',3,1),
  ('To promote research, consultancy, and industry-academia interactions that enhance institutional profile and student employability.',4,1),
  ('To ensure timely and efficient implementation of decisions of the Academic Council and Board of Governors.',5,1),
  ('To prepare and submit Annual Quality Assurance Reports (AQAR) to NAAC as per prescribed guidelines.',6,1),
  ('To document and disseminate best practices in academics, research, and student development across the institute.',7,1),
  ('To facilitate use of modern technology in teaching, learning, and administration for enhanced effectiveness.',8,1);

-- ── 3.11 iqac_activities ─────────────────────────────────────────────────────
INSERT INTO iqac_activities (title, description, activity_date, is_active) VALUES
  ('NAAC Peer Team Visit — 3rd Cycle',                     'Successful NAAC accreditation visit resulting in Grade A award. Self-Study Report submitted and accepted by the Peer Team.',                                          '2023-01-01',1),
  ('Faculty Development Programme on OBE Implementation',  'Workshop for all departments on Outcome-Based Education framework, CO-PO mapping, and attainment computation as per NBA requirements.',                              '2024-03-15',1),
  ('Annual IQAC Meeting — Academic Planning 2025–26',       'Annual review of academic calendar, curriculum revision, research output, and quality benchmarks for the forthcoming academic session.',                              '2025-06-01',1);

-- ── 3.12 academic_council_members ─────────────────────────────────────────────
INSERT INTO academic_council_members (sno, designation, member_name, category, sort_order, is_active) VALUES
  (1, 'Director, SGSITS (Chairperson)',                    'Prof. R.K. Pandey',           'Ex-Officio', 1, 1),
  (2, 'HOD — Computer Engineering',                       'Dr. Ajay Khunteta',            'Ex-Officio', 2, 1),
  (3, 'HOD — Information Technology',                     'Dr. Kapil Jain',               'Ex-Officio', 3, 1),
  (4, 'HOD — Mechanical Engineering',                     'Dr. Pradeep Kasande',          'Ex-Officio', 4, 1),
  (5, 'HOD — Civil Engineering',                          'Dr. Yogesh Kumar Bajpai',      'Ex-Officio', 5, 1),
  (6, 'HOD — Electrical Engineering',                     'Dr. Manoj Kumar Jain',         'Ex-Officio', 6, 1),
  (7, 'HOD — Electronics & Telecommunication',            'Dr. Shailendra Kumar Singh',   'Ex-Officio', 7, 1),
  (8, 'HOD — Applied Sciences & Humanities',              'Dr. Rekha Pandey',             'Ex-Officio', 8, 1),
  (9, 'HOD — Master of Computer Applications',            'Dr. Vandana Bhatt',            'Ex-Officio', 9, 1),
  (10,'HOD — Management Studies (MBA)',                   'Dr. Sanjay Sharma',            'Ex-Officio', 10,1),
  (11,'Controller of Examinations (Ex-Officio)',          'Dr. Suresh Malviya',           'Ex-Officio', 11,1),
  (12,'Nominee of Vice Chancellor, RGPV Bhopal',          'As per RGPV Nomination',       'External',   12,1),
  (13,'Subject Expert from Industry / External Expert',   'As per Nomination',            'Industry',   13,1),
  (14,'Elected Faculty Representative',                   'Dr. Nisha Thakur',             'Nominated',  14,1),
  (15,'Elected Faculty Representative',                   'Dr. Rakesh Chouksey',          'Nominated',  15,1);

-- ── 3.13 accreditations ──────────────────────────────────────────────────────
INSERT INTO accreditations (body, grade, naac_score, cycle, valid_upto, sort_order, is_active) VALUES
  ('NAAC',  'A',           NULL, '3rd Cycle', '2028', 1, 1),
  ('NBA',   'Accredited',  NULL, '2023–26',   '2026', 2, 1),
  ('NIRF',  'Top 50 (MP)', NULL, '2025',      '2025', 3, 1),
  ('AICTE', 'Approved',    NULL, '2025–26',   '2026', 4, 1),
  ('RGPV',  'Affiliated',  NULL, '2025–26',   '2026', 5, 1)
ON DUPLICATE KEY UPDATE grade=VALUES(grade), cycle=VALUES(cycle), valid_upto=VALUES(valid_upto);

-- ── 3.14 nba_programs ────────────────────────────────────────────────────────
INSERT INTO nba_programs (program_name, sort_order, is_active) VALUES
  ('B.E. Computer Engineering',   1, 1),
  ('B.E. Information Technology', 2, 1),
  ('B.E. Mechanical Engineering', 3, 1);

-- ── 3.15 nirf_rankings ───────────────────────────────────────────────────────
INSERT INTO nirf_rankings (year, rank_range, category, sort_order) VALUES
  ('2025', 'Top 50 (State)', 'Engineering — Madhya Pradesh', 1),
  ('2024', 'Top 50 (State)', 'Engineering — Madhya Pradesh', 2),
  ('2023', 'Top 50 (State)', 'Engineering — Madhya Pradesh', 3);

-- ── 3.16 committees (normalized) ─────────────────────────────────────────────
INSERT INTO committees (id, name, description, sort_order, is_active) VALUES
  (1,'Anti-Ragging Committee',         'Constituted per Honorable Supreme Court directives and UGC/AICTE anti-ragging regulations. Responsible for preventing and acting on ragging incidents.',                                    1,1),
  (2,'Internal Complaints Committee',  'Constituted under POSH Act 2013. Ensures a safe and respectful environment for all women employees and students.',                                                                          2,1),
  (3,'Grievance Redressal Committee',  'Formal channel for redressal of academic and administrative grievances of students and staff.',                                                                                              3,1),
  (4,'Placement Advisory Committee',   'Oversees campus placement activities and pre-placement training. Coordinates with the T&P Cell to maximise student outcomes.',                                                              4,1),
  (5,'Library Advisory Committee',     'Advises on library development, procurement, and digital resources to support academic and research needs.',                                                                                 5,1),
  (6,'Research & Development Committee','Promotes research, innovation, and consultancy. Coordinates with DST, AICTE, RGPV for grants and industry-sponsored projects.',                                                           6,1),
  (7,'SC/ST/OBC & Minority Cell',      'Implements reservation policies and welfare schemes for SC, ST, OBC, EWS, and Minority students. Facilitates scholarship applications.',                                                    7,1),
  (8,'Curriculum Development Committee','Periodic review and revision of curricula ensuring alignment with NEP 2020, OBE framework, AICTE model curriculum, and industry requirements.',                                           8,1)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description), sort_order=VALUES(sort_order);

INSERT INTO committee_members (committee_id, role, member_name, department, sort_order) VALUES
  (1,'Chairman',              'Prof. R.K. Pandey',          'Director, SGSITS',                1),
  (1,'Faculty Representative','Dr. Nisha Thakur',           'Computer Engineering',            2),
  (1,'Faculty Representative','Dr. Archana Patel',          'Electrical Engineering',          3),
  (1,'Warden Representative', 'Chief Warden Nominee',       'Hostel Administration',           4),
  (1,'Student Representative','Student Council President',  'Student Body',                    5),
  (1,'External Member',       'Local Authority Nominee',    'Civil Administration',            6),
  (2,'Presiding Officer',     'Dr. Rekha Pandey',           'Applied Sciences & Humanities',   1),
  (2,'Faculty Member',        'Dr. Vandana Bhatt',          'Master of Computer Applications', 2),
  (2,'Faculty Member',        'Dr. Neha Joshi',             'Mechanical Engineering',          3),
  (2,'Non-Teaching Rep.',     'Administrative Staff Nominee','Administration',                 4),
  (2,'External Member',       'External NGO/Legal Nominee', 'NGO / Legal',                     5),
  (3,'Chairperson',           'Prof. R.K. Pandey',          'Director, SGSITS',                1),
  (3,'Faculty Member',        'Dr. Kapil Jain',             'Information Technology',          2),
  (3,'Faculty Member',        'Dr. Yogesh Kumar Bajpai',    'Civil Engineering',               3),
  (3,'Administrative Rep.',   'Exam Section Nominee',       'Examination Section',             4),
  (3,'Student Representative','Student Council Nominee',    'Student Body',                    5),
  (4,'Chairman',              'Prof. R.K. Pandey',          'Director, SGSITS',                1),
  (4,'Placement Coordinator', 'Mr. Vivek Tiwari',           'Training & Placement Cell',       2),
  (4,'Faculty Coord. — CE/IT','Dr. Nisha Thakur',           'Computer Engineering',            3),
  (4,'Faculty Coord. — ME',   'Dr. Rakesh Chouksey',        'Mechanical Engineering',          4),
  (4,'Industry Expert',       'Industry Nominee',           'Corporate / Industry',            5),
  (4,'Alumni Representative', 'Alumni Association Nominee', 'SGSITS Alumni',                   6),
  (5,'Chairman',              'Prof. R.K. Pandey',          'Director, SGSITS',                1),
  (5,'Librarian',             'Chief Librarian',            'Central Library',                 2),
  (5,'Faculty Representative','Dr. Ajay Khunteta',          'Computer Engineering',            3),
  (5,'Faculty Representative','Dr. Sunanda Nagar',          'Applied Sciences & Humanities',   4),
  (5,'Student Representative','Student Council Nominee',    'Student Body',                    5),
  (6,'Chairman',              'Prof. R.K. Pandey',          'Director, SGSITS',                1),
  (6,'Research Coord. — Engg.','Dr. Ajay Khunteta',         'Computer Engineering',            2),
  (6,'Research Coord. — Sci.','Dr. Rekha Pandey',           'Applied Sciences & Humanities',   3),
  (6,'Research Coord. — Mgmt.','Dr. Sanjay Sharma',         'Management Studies',              4),
  (6,'Industry Liaison',      'Industry Expert Nominee',    'Industry / R&D',                  5),
  (7,'Liaison Officer',       'Dr. Pratibha Pandey',        'Applied Sciences & Humanities',   1),
  (7,'Faculty Representative','Dr. Anil Chouhan',           'Applied Sciences & Humanities',   2),
  (7,'Administrative Rep.',   'Student Welfare Office',     'Student Welfare',                 3),
  (7,'Student Rep. (SC)',     'Student Nominee',            'Student Body',                    4),
  (7,'Student Rep. (ST)',     'Student Nominee',            'Student Body',                    5),
  (8,'Chairperson',           'Prof. R.K. Pandey',          'Director, SGSITS',                1),
  (8,'Dean Academics',        'Senior Faculty Nominee',     'Academic Section',                2),
  (8,'Faculty — CE/IT',       'Dr. Kapil Jain',             'Information Technology',          3),
  (8,'Faculty — ME/Civil',    'Dr. Pradeep Kasande',        'Mechanical Engineering',          4),
  (8,'Faculty — EE/EC',       'Dr. Manoj Kumar Jain',       'Electrical Engineering',          5),
  (8,'Industry Expert',       'Industry Nominee',           'Corporate / Industry',            6),
  (8,'RGPV University Nominee','RGPV Nominee',              'RGPV, Bhopal',                    7);

-- =============================================================================
-- PART 4: MEDIA FILE RECORDS (placeholder paths — replace with actual uploads)
-- =============================================================================
INSERT INTO files (original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by)
VALUES
  ('director-rk-pandey.jpg',        'about_director_rk_pandey.jpg',        '/uploads/about/director-rk-pandey.jpg',        'image/jpeg',204800,'LOCAL',@admin),
  ('about-institute-banner.jpg',    'about_institute_banner.jpg',          '/uploads/about/about-institute-banner.jpg',    'image/jpeg',307200,'LOCAL',@admin),
  ('naac-grade-a-certificate.jpg',  'about_naac_grade_a_cert.jpg',         '/uploads/about/naac-grade-a-certificate.jpg',  'image/jpeg',153600,'LOCAL',@admin),
  ('nba-accreditation-ce.jpg',      'about_nba_accred_ce.jpg',             '/uploads/about/nba-accreditation-ce.jpg',      'image/jpeg',153600,'LOCAL',@admin),
  ('nba-accreditation-it.jpg',      'about_nba_accred_it.jpg',             '/uploads/about/nba-accreditation-it.jpg',      'image/jpeg',153600,'LOCAL',@admin),
  ('nba-accreditation-me.jpg',      'about_nba_accred_me.jpg',             '/uploads/about/nba-accreditation-me.jpg',      'image/jpeg',153600,'LOCAL',@admin),
  ('campus-library.jpg',            'about_campus_library.jpg',            '/uploads/about/campus-library.jpg',            'image/jpeg',256000,'LOCAL',@admin),
  ('campus-hostel-boys.jpg',        'about_campus_hostel_boys.jpg',        '/uploads/about/campus-hostel-boys.jpg',        'image/jpeg',256000,'LOCAL',@admin),
  ('campus-sports-complex.jpg',     'about_campus_sports.jpg',             '/uploads/about/campus-sports-complex.jpg',     'image/jpeg',256000,'LOCAL',@admin),
  ('campus-main-building.jpg',      'about_campus_main_building.jpg',      '/uploads/about/campus-main-building.jpg',      'image/jpeg',307200,'LOCAL',@admin)
ON DUPLICATE KEY UPDATE file_url=VALUES(file_url);

-- Link director photo FK
UPDATE director_messages dm
  JOIN files f ON f.stored_name = 'about_director_rk_pandey.jpg'
SET dm.photo_file_id = f.id
WHERE dm.director_name = 'Prof. R.K. Pandey' AND dm.photo_file_id IS NULL;

-- =============================================================================
-- PART 5: SEO METADATA FOR ALL ABOUT PAGES
-- =============================================================================
INSERT INTO seo_metadata (page_key, title, description, og_title, og_description, canonical, robots, updated_by)
VALUES
  ('about/institute',
   'About SGSITS Indore — Established 1952 | NAAC Grade A | Autonomous Engineering Institute',
   'Shri G.S. Institute of Technology and Science, Indore — established 1952 by G.S. Birla. Autonomous engineering institute affiliated to RGPV, approved by AICTE, NAAC Grade A, NBA accredited.',
   'About SGSITS Indore — 72 Years of Engineering Excellence',
   'Learn about SGSITS Indore — one of MP''s premier autonomous engineering institutes. NAAC A Grade, 200+ faculty, 25,000+ alumni, 86% placement rate.',
   'https://www.sgsits.ac.in/about/institute','index,follow',@admin),

  ('about/vision-mission',
   'Vision & Mission — SGSITS Indore | Engineering Excellence & Ethical Leadership',
   'SGSITS Vision and Mission — committed to fostering academic excellence, innovation, and ethical leadership. Building competent engineers contributing to national development.',
   'Vision & Mission — SGSITS Indore',
   'SGSITS Vision: Premier global technical institution. Mission: Quality education, research culture, professional ethics, and industry partnerships.',
   'https://www.sgsits.ac.in/about/vision-mission','index,follow',@admin),

  ('about/director-message',
   'Director''s Message — Prof. R.K. Pandey | SGSITS Indore',
   'Message from Prof. R.K. Pandey, Ph.D. (IIT Delhi), Director of SGSITS Indore. A vision on academic excellence, research, and student success.',
   'Director''s Message — SGSITS Indore | Prof. R.K. Pandey',
   'Read the Director''s message from Prof. R.K. Pandey, SGSITS Indore — inspiring students and faculty towards excellence, innovation, and service to society.',
   'https://www.sgsits.ac.in/about/director-message','index,follow',@admin),

  ('about/governing-body',
   'Governing Body — SGSITS Indore | Board of Governors',
   'Board of Governors of SGSITS Indore. Constituted under RGPV Act with Government, University, Industry, Regulatory, and Faculty representatives.',
   'Board of Governors — SGSITS Indore',
   'SGSITS Governing Body includes nominees from Govt. of MP, RGPV Bhopal, AICTE, Industry, and Faculty. Apex body for institute governance and policy.',
   'https://www.sgsits.ac.in/about/governing-body','index,follow',@admin),

  ('about/administration',
   'Administration — SGSITS Indore | Director, HODs, Officers',
   'Key administrative officials of SGSITS Indore — Director Prof. R.K. Pandey, Controller of Examinations Dr. Suresh Malviya, Placement Officer Mr. Vivek Tiwari, and all HODs.',
   'Administration — SGSITS Indore',
   'Contact SGSITS Indore administration — Director, Exam Controller, Placement Officer, Finance Officer, and department Heads with emails and phone numbers.',
   'https://www.sgsits.ac.in/about/administration','index,follow',@admin),

  ('about/committees',
   'Administrative Committees — SGSITS Indore | Governance Bodies',
   'Administrative committees of SGSITS Indore — Anti-Ragging, ICC, Grievance Redressal, Placement Advisory, Library Advisory, R&D, SC/ST Cell, Curriculum Development.',
   'Administrative Committees — SGSITS Indore',
   'SGSITS statutory and advisory committees with full member details. Click any card to view committee composition.',
   'https://www.sgsits.ac.in/about/committees','index,follow',@admin),

  ('about/telephone-directory',
   'Telephone Directory — SGSITS Indore | Department Contact Numbers',
   'Complete telephone directory of SGSITS Indore. Contact all departments and offices. Main: 0731-2431300. Director: 0731-2431301.',
   'Telephone Directory — SGSITS Indore',
   'Department-wise contact numbers for SGSITS Indore — Director, Admissions, Exam Section, Accounts, Placement, IT Cell, Hostels, and all department HODs.',
   'https://www.sgsits.ac.in/about/telephone-directory','index,follow',@admin),

  ('about/infrastructure',
   'Infrastructure — SGSITS Indore | Library, Labs, Hostels, Sports',
   'SGSITS Indore campus infrastructure — 60,000+ book library, 9 research labs, 500-seat hostels, sports complex, smart Wi-Fi campus, auditorium, dispensary.',
   'Campus Infrastructure — SGSITS Indore',
   'Explore SGSITS Indore campus: 60,000+ book library with IEEE/Springer digital access, 100 Mbps Wi-Fi, Boys Hostel 350 seats, Girls Hostel 150 seats.',
   'https://www.sgsits.ac.in/about/infrastructure','index,follow',@admin),

  ('about/iqac',
   'IQAC Cell — SGSITS Indore | Internal Quality Assurance | NAAC',
   'IQAC of SGSITS Indore established under NAAC mandate. Chairperson: Prof. R.K. Pandey. Objectives, composition, and recent quality initiatives listed.',
   'IQAC Cell — SGSITS Indore | Quality Assurance',
   'SGSITS IQAC drives excellence in academics, research, and administration. NAAC Grade A holder. Annual Quality Assurance Reports submitted to NAAC.',
   'https://www.sgsits.ac.in/about/iqac','index,follow',@admin),

  ('about/academic-council',
   'Academic Council — SGSITS Indore | Apex Academic Body',
   'Academic Council of SGSITS Indore presided by Director Prof. R.K. Pandey. Responsible for curriculum, examinations, OBE/NEP 2020, and academic calendar.',
   'Academic Council — SGSITS Indore',
   'SGSITS Academic Council composition — Director, all HODs, RGPV nominee, external experts, and elected faculty. Governs all academic standards.',
   'https://www.sgsits.ac.in/about/academic-council','index,follow',@admin),

  ('about/accreditation',
   'Accreditation — SGSITS Indore | NAAC Grade A | NBA | NIRF Ranked',
   'SGSITS Indore — NAAC Grade A accredited. NBA-accredited B.E. in Computer Engineering, IT, and Mechanical Engineering. NIRF Top 50 in Madhya Pradesh.',
   'Accreditation — SGSITS Indore | NAAC A, NBA, NIRF',
   'SGSITS Indore accreditations: NAAC Grade A, NBA accredited CE/IT/ME, NIRF Top 50 MP, AICTE approved, RGPV affiliated.',
   'https://www.sgsits.ac.in/about/accreditation','index,follow',@admin)
ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description),
  og_title=VALUES(og_title), og_description=VALUES(og_description),
  canonical=VALUES(canonical), updated_by=VALUES(updated_by);

-- =============================================================================
-- PART 6: NAVIGATION — ABOUT US SUBMENU IN navigation_items
-- Idempotent: removes stale About children and re-seeds.
-- =============================================================================

-- Find existing About parent (may be labelled 'About' or 'About Us')
SET @about_parent_id = (
  SELECT id FROM navigation_items WHERE url = '/about' AND parent_id IS NULL LIMIT 1
);

-- Create parent only if it does not exist
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
SELECT NULL, 'About Us', '/about', 2, '_self', 1
WHERE @about_parent_id IS NULL;

SET @about_parent_id = COALESCE(
  @about_parent_id,
  (SELECT id FROM navigation_items WHERE url = '/about' AND parent_id IS NULL LIMIT 1)
);

-- Remove stale children so re-run is idempotent
DELETE FROM navigation_items WHERE parent_id = @about_parent_id;

-- Seed About submenu children
INSERT INTO navigation_items (parent_id, label, url, sort_order, target, is_active)
VALUES
  (@about_parent_id, 'About Institute',            '/about/institute',           1,  '_self', 1),
  (@about_parent_id, 'Vision & Mission',           '/about/vision-mission',      2,  '_self', 1),
  (@about_parent_id, 'Director''s Message',         '/about/director-message',    3,  '_self', 1),
  (@about_parent_id, 'Governing Body',             '/about/governing-body',      4,  '_self', 1),
  (@about_parent_id, 'Administration',             '/about/administration',      5,  '_self', 1),
  (@about_parent_id, 'Administrative Committees',  '/about/committees',          6,  '_self', 1),
  (@about_parent_id, 'Telephone Directory',        '/about/telephone-directory', 7,  '_self', 1),
  (@about_parent_id, 'Infrastructure',             '/about/infrastructure',      8,  '_self', 1),
  (@about_parent_id, 'IQAC Cell',                  '/about/iqac',                9,  '_self', 1),
  (@about_parent_id, 'Academic Council',           '/about/academic-council',    10, '_self', 1),
  (@about_parent_id, 'Accreditation (NBA/NAAC)',   '/about/accreditation',       11, '_self', 1);

SET foreign_key_checks = 1;

-- =============================================================================
-- ADMIN MODULE MAPPING
-- Each normalized table maps to a CMS admin panel route:
--
--  Table                    → Admin Route (suggested)
--  ─────────────────────────────────────────────────────────────────────
--  about_pages              → /dashboard/central-admin/about/pages
--  director_messages        → /dashboard/central-admin/about/director
--  about_vision_mission     → /dashboard/central-admin/about/vision-mission
--  mission_points           → /dashboard/central-admin/about/vision-mission
--  governing_body_members   → /dashboard/central-admin/about/governing-body
--  administrators           → /dashboard/central-admin/about/administration
--  committees               → /dashboard/central-admin/about/committees
--  committee_members        → /dashboard/central-admin/about/committees (inline)
--  telephone_directory      → /dashboard/central-admin/about/telephone-directory
--  infrastructure_items     → /dashboard/central-admin/about/infrastructure
--  iqac_config              → /dashboard/central-admin/about/iqac
--  iqac_objectives          → /dashboard/central-admin/about/iqac (inline)
--  iqac_activities          → /dashboard/central-admin/about/iqac (inline)
--  academic_council_members → /dashboard/central-admin/about/academic-council
--  accreditations           → /dashboard/central-admin/about/accreditation
--  nba_programs             → /dashboard/central-admin/about/accreditation (inline)
--  nirf_rankings            → /dashboard/central-admin/about/accreditation (inline)
--
-- CMS sections (cms_sections table) are the authoritative source for the
-- existing frontend pages. When admin saves via the panel, both the normalized
-- table AND the corresponding cms_sections row should be updated atomically.
-- =============================================================================
