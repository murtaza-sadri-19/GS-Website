-- =============================================================================
-- SGSITS Seed 23: Chatbot — config + SGSITS keyword responses (concise)
-- =============================================================================
USE SGSITS_DB;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ── 1. Bot Config ─────────────────────────────────────────────────────────────
INSERT INTO chatbot_config
  (id, bot_name, avatar_url, welcome_message, input_placeholder, fallback_message, is_active)
VALUES (1,
  'Sara',
  '/assets/image.png',
  'Hi! I''m **Sara**, SGSITS Indore''s AI Assistant. Ask me about admissions, courses, placements, facilities, or anything else about the institute.',
  'Ask Sara about admissions, courses, placements…',
  'I couldn''t find information on that. Please contact us at **+91-731-2582100** or **registrar@sgsits.ac.in**.',
  1
)
ON DUPLICATE KEY UPDATE
  bot_name          = VALUES(bot_name),
  avatar_url        = VALUES(avatar_url),
  welcome_message   = VALUES(welcome_message),
  input_placeholder = VALUES(input_placeholder),
  fallback_message  = VALUES(fallback_message),
  is_active         = VALUES(is_active);

-- ── 2. Keyword Responses ──────────────────────────────────────────────────────
TRUNCATE TABLE chatbot_responses;

INSERT INTO chatbot_responses (category, keywords, reply, display_order, is_active) VALUES

('General',    'hi,hello,hey,namaste,help',
 'Hi! 👋 I''m Sara, your SGSITS assistant. Ask me about admissions, courses, placements, hostel, or contact info!',
 0, 1),

('General',    'thank you,thanks,okay,got it,great',
 'You''re welcome! Feel free to ask anything else about SGSITS. 😊',
 1, 1),

('About',      'about sgsits,history,established,founded,what is sgsits',
 '**SGSITS** (Shri Govindram Seksaria Institute of Technology and Science) was established in **1952** in Indore, MP. It offers UG, PG & PhD programmes across 17 departments. Affiliated to RGPV, approved by AICTE, accredited by NBA & NAAC.',
 2, 1),

('Contact',    'address,location,where,how to reach,directions',
 '📍 **23 Park Road, Indore – 452003, MP**\n~8 km from Indore Railway Station, ~15 km from the airport.\nSearch "SGSITS Indore" on Google Maps.',
 3, 1),

('Contact',    'contact,phone,email,helpline,registrar,telephone',
 '📞 **+91-731-2582100**\n📧 **registrar@sgsits.ac.in**\n📧 Admissions: admissions@sgsits.ac.in\nOffice hours: Mon–Fri, 10 AM – 5 PM.',
 4, 1),

('Admissions', 'admission,apply,how to join,eligibility,how to get admission',
 '**SGSITS Admissions:**\n• **UG (B.E.)** → JEE Main + MP DTE counselling\n• **PG (M.E./MBA)** → GATE/CMAT + MP DTE counselling\n• **PhD** → SGSITS entrance test + interview\n\nAdmissions open June–August. Visit `/admission` for details.',
 5, 1),

('Admissions', 'ug admission,be admission,jee,jee main,undergraduate,bachelor',
 '**UG B.E. Admission:**\n• Eligibility: 10+2 PCM, min 45% (40% SC/ST)\n• Entrance: JEE Main score\n• Counselling: MP DTE portal (dte.mponline.gov.in)\n\nVisit `/admission/ug` for dates and seat details.',
 6, 1),

('Admissions', 'pg admission,me admission,mtech,mba,gate,postgraduate,master',
 '**PG Admission (M.E./MBA):**\n• M.E.: Valid GATE score required\n• MBA: CMAT/MAT/CAT score required\n• Counselling: MP DTE portal\n\nVisit `/admission/pg` for specialisations and seats.',
 7, 1),

('Admissions', 'phd,doctorate,research admission,phd eligibility',
 '**PhD Admission:**\n• Eligibility: M.E./M.Tech with 55%+\n• Process: Entrance test → proposal → interview\n• Admissions twice a year (Jan & July)\n\nContact: registrar@sgsits.ac.in',
 8, 1),

('Admissions', 'fees,fee structure,tuition,cost,how much',
 '**Approximate Fees (per year):**\n• B.E.: ₹50,000–₹80,000 (govt category)\n• M.E.: ₹40,000–₹70,000\n• Hostel: ₹15,000–₹25,000/semester\n\nExact fees in the prospectus at `/admission/prospectus`.',
 9, 1),

('Admissions', 'prospectus,brochure,download',
 'Download the SGSITS Admissions Prospectus at `/admission/prospectus`. It has fee structure, seat matrix, eligibility, and important dates.',
 10, 1),

('Academics',  'departments,courses,branches,programmes',
 'SGSITS has **17 departments** including Computer Engineering, IT, Electronics, Electrical, Mechanical, Civil, Biomedical, MBA, Pharmacy, and more.\n\nVisit `/departments` to explore each one.',
 11, 1),

('Academics',  'academic calendar,semester dates,when does college start,holiday',
 'The academic calendar has Odd Semester (July–Nov) and Even Semester (Dec–April). Download it at `/academics/calendar`.',
 12, 1),

('Academics',  'exam,result,marksheet,timetable exam,atkt,backlog,revaluation',
 'University exams are conducted by RGPV. Check results at rgpv.ac.in using your enrollment number. For ATKT, apply through RGPV portal. See exam notices at `/academics/exam-results`.',
 13, 1),

('Academics',  'ordinance,rules,attendance,minimum attendance,regulations',
 'Minimum **75% attendance** is mandatory for university exams. Full academic ordinances are at `/academics/ordinances`.',
 14, 1),

('Academics',  'scholarship,financial aid,merit scholarship,govt scholarship',
 '**Scholarships available:**\n• Govt: MP Scholarship Portal (SC/ST/OBC/General)\n• Institute: Merit and need-based\n\nApply at scholarshipportal.mp.nic.in. Details at `/students/scholarship/govt`.',
 15, 1),

('Placements', 'placement,job,salary,package,recruiters,companies,campus recruitment,t&p',
 '**T&P Cell highlights:**\n• 500+ students placed annually\n• Top recruiters: TCS, Infosys, L&T, Honeywell, Wipro and more\n• Highest package: 30+ LPA (CS/IT)\n• Average: 5–8 LPA\n\nVisit `/placement` for full records.',
 16, 1),

('Facilities', 'hostel,accommodation,boys hostel,girls hostel,room,mess',
 '**Hostels:** Boys (~800 seats), Girls (~300 seats). 24×7 security, mess, WiFi.\nFee: ~₹15,000–₹25,000/semester.\n\nDetails at `/facilities/hostel/boys` and `/facilities/hostel/girls`.',
 17, 1),

('Facilities', 'library,books,e-resources,reading room',
 '**Central Library:** 1 lakh+ books, journals, IEEE/Springer e-access, digital reading room.\nOpen Mon–Sat, 8 AM – 8 PM. → `/facilities/library`',
 18, 1),

('Facilities', 'computer center,internet,wifi,computer lab',
 'Campus has 500+ terminals, 1 Gbps internet, campus-wide WiFi, and licensed software (MATLAB, AutoCAD, ANSYS). → `/facilities/computer-center`',
 19, 1),

('Facilities', 'sports,games,gym,gymnasium,cricket,football,basketball,sss',
 'Facilities include cricket ground, basketball/volleyball courts, gymnasium, athletics track managed by the Students'' Sports Society (SSS). → `/facilities/sports`',
 20, 1),

('Facilities', 'idea lab,aicte,3d printing,maker space,innovation',
 '**AICTE IDEA Lab** has 3D printers, IoT kits, AR/VR, robotics, and PCB tools — open to all students for projects and prototypes. → `/facilities/idea-lab`',
 21, 1),

('Campus Life', 'ncc,national cadet corps,ncc certificate',
 'NCC (Army Wing) is open to students. Benefits: NCC B/C certificate, parade opportunities, 5% bonus in govt jobs. Register at the start of each academic year. → `/students/ncc`',
 22, 1),

('Campus Life', 'nss,national service scheme,social work,community',
 'NSS activities include blood donation camps, plantation drives, health awareness, and a 7-day special camp. NSS certificate has grace marks benefits. → `/students/nss`',
 23, 1),

('Campus Life', 'startup,incubation,entrepreneurship,cidi',
 '**Startup & Incubation Cell** supports student ventures via CIDI Centre, IDEA Lab, mentoring, and IP support. → `/startup-cell`',
 24, 1),

('Academics',  'teqip,technical education quality improvement',
 'SGSITS participated in TEQIP (World Bank/MHRD) for faculty development, research labs, and industry linkage. → `/teqip/about`',
 25, 1),

('Academics',  'iqac,accreditation,nba,naac,rgpv,aicte,affiliated',
 'SGSITS is **AICTE approved**, **RGPV affiliated**, **NBA accredited** for multiple programmes, and **NAAC assessed**. → `/about/accreditation`',
 26, 1),

('Academics',  'plagiarism,turnitin,similarity,thesis,project report',
 'Plagiarism policy follows UGC 2018 rules: <10% acceptable, 40–60% needs revision, >60% rejected. All theses must pass anti-plagiarism check. → `/academics/plagiarism-policy`',
 27, 1),

('Academics',  'obe,nep,nep 2020,outcome based,new education policy',
 'SGSITS follows OBE and is implementing NEP 2020 with multidisciplinary electives, skill courses, and internship integration. → `/academics/obe-nep-2020`',
 28, 1),

('Updates',    'notice,circular,announcement,latest notice,event,upcoming event,seminar',
 '📢 Latest notices: `/notices` | Campus news: `/news` | Upcoming events: `/events` | Tenders: `/tenders`',
 29, 1),

('Academics',  'download,form,syllabus,question paper,previous year,pdf',
 'Download forms, syllabus, and question papers at `/downloads`. RGPV question papers are at rgpv.ac.in.',
 30, 1),

('About',      'director,principal,leadership,registrar,management',
 'SGSITS is led by a Director appointed by the Governing Body. For the Director''s message → `/about/director-message`. Administration details → `/about/administration`.',
 31, 1);

SET foreign_key_checks = 1;

SELECT 'chatbot_config seeded.' AS step;
SELECT CONCAT('chatbot_responses seeded: ', COUNT(*), ' entries') AS step FROM chatbot_responses;
