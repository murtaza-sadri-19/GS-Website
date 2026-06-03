-- =============================================================================
-- ENTERPRISE SEED — Part 04: Files, Notices, News, Events, Downloads,
--                            Pages, Alerts, Tenders
-- Run AFTER: seed_enterprise_02_departments.sql
-- =============================================================================
USE SGSITS_DB;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Placeholder File Records ─────────────────────────────────────────────
-- Real uploads happen via API; these records anchor FK references in seed data.
-- storage_type LOCAL with relative path under /uploads/
INSERT INTO files (original_name, stored_name, file_url, file_type, file_size, storage_type, uploaded_by)
VALUES
  -- Notices / circulars
  ('exam-circular-dec-2025.pdf',      'seed_exam_circular_dec2025.pdf',      '/uploads/seed_exam_circular_dec2025.pdf',      'application/pdf', 245760, 'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('admit-card-notice-dec-2025.pdf',  'seed_admit_card_dec2025.pdf',         '/uploads/seed_admit_card_dec2025.pdf',         'application/pdf', 189440, 'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('result-may-2025.pdf',             'seed_result_may2025.pdf',             '/uploads/seed_result_may2025.pdf',             'application/pdf', 512000, 'LOCAL', (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in')),
  ('ugadmission-brochure-2025.pdf',   'seed_ug_admission_2025.pdf',          '/uploads/seed_ug_admission_2025.pdf',          'application/pdf', 1024000,'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('pgadmission-brochure-2025.pdf',   'seed_pg_admission_2025.pdf',          '/uploads/seed_pg_admission_2025.pdf',          'application/pdf', 890000, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('placement-brochure-2025-26.pdf',  'seed_placement_brochure_2526.pdf',    '/uploads/seed_placement_brochure_2526.pdf',    'application/pdf', 2048000,'LOCAL', (SELECT id FROM users WHERE email='placement@sgsits.ac.in')),
  ('anti-ragging-policy-2025.pdf',    'seed_anti_ragging_policy_2025.pdf',   '/uploads/seed_anti_ragging_policy_2025.pdf',   'application/pdf', 153600, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('fee-structure-2025-26.pdf',       'seed_fee_structure_2526.pdf',         '/uploads/seed_fee_structure_2526.pdf',         'application/pdf', 307200, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('ce-sem5-syllabus-2025.pdf',       'seed_ce_sem5_syllabus_2025.pdf',      '/uploads/seed_ce_sem5_syllabus_2025.pdf',      'application/pdf', 614400, 'LOCAL', (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')),
  ('it-sem5-syllabus-2025.pdf',       'seed_it_sem5_syllabus_2025.pdf',      '/uploads/seed_it_sem5_syllabus_2025.pdf',      'application/pdf', 614400, 'LOCAL', (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in')),
  ('me-sem5-syllabus-2025.pdf',       'seed_me_sem5_syllabus_2025.pdf',      '/uploads/seed_me_sem5_syllabus_2025.pdf',      'application/pdf', 614400, 'LOCAL', (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in')),
  ('academic-calendar-2025-26.pdf',   'seed_academic_calendar_2526.pdf',     '/uploads/seed_academic_calendar_2526.pdf',     'application/pdf', 204800, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('hostel-fee-structure-2025.pdf',   'seed_hostel_fee_2025.pdf',            '/uploads/seed_hostel_fee_2025.pdf',            'application/pdf', 102400, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('tender-lab-equipment-2025.pdf',   'seed_tender_lab_equip_2025.pdf',      '/uploads/seed_tender_lab_equip_2025.pdf',      'application/pdf', 358400, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('scholarship-notice-2025.pdf',     'seed_scholarship_2025.pdf',           '/uploads/seed_scholarship_2025.pdf',           'application/pdf', 122880, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  -- Event covers (images)
  ('technova-2025-banner.jpg',        'seed_technova2025.jpg',               '/uploads/seed_technova2025.jpg',               'image/jpeg', 204800, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('convocation-2025.jpg',            'seed_convocation2025.jpg',            '/uploads/seed_convocation2025.jpg',            'image/jpeg', 307200, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('sports-meet-2025.jpg',            'seed_sports2025.jpg',                 '/uploads/seed_sports2025.jpg',                 'image/jpeg', 256000, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('hackathon-2025.jpg',              'seed_hackathon2025.jpg',              '/uploads/seed_hackathon2025.jpg',              'image/jpeg', 204800, 'LOCAL', (SELECT id FROM users WHERE email='admin@college.edu')),
  ('placement-drive-tcs-2025.jpg',    'seed_tcs_drive2025.jpg',              '/uploads/seed_tcs_drive2025.jpg',              'image/jpeg', 184320, 'LOCAL', (SELECT id FROM users WHERE email='placement@sgsits.ac.in'))
ON DUPLICATE KEY UPDATE file_url=VALUES(file_url);

-- ─── 2. Notices ───────────────────────────────────────────────────────────────
INSERT INTO notices (title, slug, description, notice_type, department_id, file_id, created_by, status)
VALUES
  (
    'End Semester Examination December 2025 — Date Sheet',
    'end-sem-exam-dec-2025-date-sheet',
    'The End Semester Examination for all B.E./M.Tech./MCA/MBA programmes for the session July–December 2025 will commence from 01 December 2025. Students are advised to download their admit cards from the examination portal. No student will be allowed in the examination hall without a valid admit card. Roll number slips will be issued by respective department offices from 20 November 2025.',
    'EXAM', NULL,
    (SELECT id FROM files WHERE stored_name='seed_exam_circular_dec2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'Admit Card Availability — End Semester Exam December 2025',
    'admit-card-availability-dec-2025',
    'Students of all programmes can download their admit cards for End Semester Examination December 2025 from the student portal from 18 November 2025. Students with pending dues are advised to clear fees at the accounts section before collecting admit cards. For any discrepancy in admit card details, contact the Examination Section (Room 105, Main Building) by 25 November 2025.',
    'EXAM', NULL,
    (SELECT id FROM files WHERE stored_name='seed_admit_card_dec2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'Declaration of Results — End Semester Examination May 2025',
    'results-end-sem-may-2025',
    'The results for End Semester Examination May 2025 for B.E. (all semesters), M.Tech., MCA, and MBA programmes have been declared. Students can check their results on the examination portal. Students who wish to apply for re-evaluation should submit applications to the Examination Section within 15 days of result publication along with prescribed fee. Applications for mark sheet and degree certificate can be submitted from 10 June 2025.',
    'EXAM', NULL,
    (SELECT id FROM files WHERE stored_name='seed_result_may2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'UG Admission 2025–26 — Counselling Schedule',
    'ug-admission-2025-26-counselling',
    'Counselling for admission to B.E. programmes (Computer Engineering, IT, Mechanical Engineering, Civil Engineering, Electrical Engineering, Electronics & Telecommunication) for the academic year 2025–26 will be conducted as per the schedule published in the official prospectus. Candidates who have qualified JEE Main 2025 and fulfilled RGPV eligibility criteria are eligible. Institute preference for SGSITS should be selected through MPDTE online counselling portal.',
    'GENERAL', NULL,
    (SELECT id FROM files WHERE stored_name='seed_ce_sem5_syllabus_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'PG Admission 2025–26 — M.Tech. / MCA / MBA',
    'pg-admission-2025-26',
    'Applications are invited for admission to M.Tech., MCA, and MBA programmes for the academic year 2025–26. Eligibility and selection criteria are as per RGPV norms and MPDTE guidelines. For M.Tech., GATE qualified candidates will receive stipend as per AICTE norms. MCA admissions are based on MP MCA Entrance Test (MP MCA CET 2025). MBA admissions are through MP MAT or CAT/MAT scores.',
    'GENERAL', NULL,
    (SELECT id FROM files WHERE stored_name='seed_anti_ragging_policy_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'Placement Season 2025–26 — Registration Open for Final Year Students',
    'placement-registration-2025-26',
    'The Training & Placement Cell is pleased to announce the opening of Placement Season 2025–26. Final year students of B.E., M.Tech., MCA, and MBA are requested to register on the placement portal by 30 August 2025. Students must ensure their resume is updated and all backlogs are cleared. Companies including TCS, Infosys, Wipro, Capgemini, and Cognizant have confirmed participation. Pre-placement Training (PPT) sessions will commence from 01 August 2025.',
    'PLACEMENT', NULL,
    (SELECT id FROM files WHERE stored_name='seed_ug_admission_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'Anti-Ragging Policy 2025–26 — Mandatory Compliance',
    'anti-ragging-policy-2025-26',
    'In compliance with the Hon''ble Supreme Court directives and UGC/AICTE anti-ragging regulations, all students must submit online anti-ragging undertaking at the time of admission. The anti-ragging committee of SGSITS has been reconstituted for the academic year 2025–26. Any incident of ragging should be reported to the Anti-Ragging Helpline (1800-180-5522) or directly to the committee. Strict action will be taken against violators including rustication.',
    'GENERAL', NULL,
    (SELECT id FROM files WHERE stored_name='seed_placement_brochure_2526.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'Fee Structure 2025–26 — B.E. / M.Tech. / MCA / MBA',
    'fee-structure-2025-26',
    'The revised fee structure for all programmes for the academic year 2025–26 as approved by the MP Fee Regulatory Committee is now available. Students are advised to pay semester fees before the last date to avoid late fee surcharge. Online payment is available through the college ERP portal. Fee concession applications for SC/ST/OBC-NCL students should be submitted to the accounts section with supporting documents.',
    'GENERAL', NULL,
    (SELECT id FROM files WHERE stored_name='seed_technova2025.jpg' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'Academic Calendar 2025–26 Published',
    'academic-calendar-2025-26',
    'The Academic Calendar for the year 2025–26 has been published. It includes schedule of examinations, semester break, holidays, and important academic events. All departments are requested to plan their academic activities accordingly. The calendar has been prepared in consultation with RGPV Bhopal and is effective from 01 July 2025.',
    'GENERAL', NULL,
    (SELECT id FROM files WHERE stored_name='seed_convocation2025.jpg' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'MP Scholarship Portal — Last Date for Application 2025–26',
    'mp-scholarship-last-date-2025-26',
    'Students eligible for MP Scholarship (SC/ST/OBC and General category minority scholarships) for the academic year 2025–26 must apply on the MP Scholarship Portal (scholarshipportal.mp.nic.in) before the prescribed last date. Certificates required include income certificate, caste certificate, domicile certificate, and previous year marksheet. Students must get their applications verified by the college before submission.',
    'GENERAL', NULL,
    (SELECT id FROM files WHERE stored_name='seed_sports2025.jpg' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'Notice — Hostel Allotment 2025–26 (Boys & Girls)',
    'hostel-allotment-2025-26',
    'Applications for hostel accommodation for the academic year 2025–26 are invited from all students. Priority will be given to students from outside Indore district. Applications should be submitted to the Chief Warden''s office along with the prescribed fee receipt. Allotment will be done on merit-cum-distance basis. Boys Hostel capacity: 350 seats; Girls Hostel capacity: 150 seats.',
    'GENERAL', NULL, NULL,
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'CE Department — Notice: B.E. 5th Semester Sessional Examination',
    'ce-5th-sem-sessional-notice',
    'Students of B.E. 5th Semester (Computer Engineering) are informed that the first sessional examination will be held from 10 to 14 September 2025. The time table for sessional examinations has been put up on the department notice board. Subjects covered: Design & Analysis of Algorithms, Database Management Systems, Operating Systems, Computer Networks, and Theory of Computation. Students must bring their college ID cards.',
    'DEPARTMENT',
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    NULL,
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'IT Department — Seminar on Cybersecurity Trends',
    'it-seminar-cybersecurity-2025',
    'The Department of Information Technology is organising a one-day seminar on "Emerging Trends in Cybersecurity" on 22 October 2025. Invited speakers include Mr. Pradeep Singh (CISO, Infosys Bhopal) and Mr. Animesh Sahay (IPS, Cyber Cell Indore). Registration is free for all SGSITS students and faculty. Participants will receive a certificate of participation.',
    'DEPARTMENT',
    (SELECT id FROM departments WHERE slug='information-technology'),
    NULL,
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
    'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE
  description=VALUES(description), status=VALUES(status);

-- ─── 3. News ──────────────────────────────────────────────────────────────────
INSERT INTO news (title, slug, excerpt, content, category, author_id, published_at, status)
VALUES
  (
    'SGSITS Students Bag 15 Offers in TCS National Qualifier Test 2025',
    'sgsits-tcs-nqt-2025',
    'Fifteen students from B.E. final year programmes received placement offers from TCS following the National Qualifier Test held on campus in September 2025.',
    '<p>Fifteen students from B.E. Computer Engineering, Information Technology, and Mechanical Engineering branches received placement offers from Tata Consultancy Services (TCS) following the TCS National Qualifier Test (NQT) held on the SGSITS campus on 18 September 2025.</p><p>The selected students will join TCS as Systems Engineers with a package of Rs. 3.36 LPA. The Training & Placement Cell, led by Mr. Vivek Tiwari, coordinated the entire drive, which saw over 120 students participating from the final year batch.</p><p>"This is a significant achievement for our students. TCS''s presence on campus reflects the quality of talent we nurture at SGSITS," said Prof. R.K. Pandey, Director.</p>',
    'Placement',
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
    '2025-09-25 10:00:00', 'PUBLISHED'
  ),
  (
    'SGSITS Ranked Among Top 50 Engineering Institutes in MP — NIRF 2025',
    'sgsits-nirf-ranking-2025',
    'SGSITS has secured a commendable position in the NIRF (National Institutional Ranking Framework) 2025 rankings, reaffirming its status as a premier technical institution in Madhya Pradesh.',
    '<p>Shri G.S. Institute of Technology and Science (SGSITS), Indore has been ranked among the Top 50 Engineering Institutes in Madhya Pradesh in the NIRF 2025 rankings released by the Ministry of Education, Government of India.</p><p>The institute scored particularly high on Teaching, Learning & Resources (TLR) and Research & Professional Practice (RP) parameters. The institute''s research output has grown by 35% over the past two years, with faculty publishing in IEEE, Elsevier, and Springer journals.</p><p>"This ranking is a testament to the relentless efforts of our faculty, staff, and students. We aim to break into the top 200 nationally within the next two years," said Director Prof. R.K. Pandey.</p>',
    'Achievements',
    (SELECT id FROM users WHERE email='priya.sharma@sgsits.ac.in'),
    '2025-08-05 09:00:00', 'PUBLISHED'
  ),
  (
    'Technova 2025 — Annual Technical Festival Concludes with Record Participation',
    'technova-2025-annual-fest',
    'The 18th edition of Technova, SGSITS''s annual technical festival, concluded with participation from over 2,500 students across 45 colleges from central India.',
    '<p>The 18th edition of <strong>Technova</strong>, SGSITS''s flagship annual technical festival, concluded on 15 March 2025 after three days of intensive technical competitions, workshops, and lectures.</p><p>The festival saw participation from over 2,500 students representing 45 colleges across Madhya Pradesh, Rajasthan, and Chhattisgarh. Key highlights included the 24-hour Hackathon "Code Storm" won by Team Syntax Error from CE Department, the Robo-Wars competition, and a competitive coding contest on HackerEarth.</p><p>Chief Guest Dr. Ashok Kumar (DG, NIC India) delivered a keynote on "India''s Digital Public Infrastructure." Best College Award went to MANIT Bhopal.</p>',
    'Events',
    (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'),
    '2025-03-16 12:00:00', 'PUBLISHED'
  ),
  (
    'DST Grant of Rs. 32 Lakh Awarded to EC Department for FPGA Security Research',
    'dst-grant-ec-fpga-2025',
    'The Department of Electronics & Telecommunication has received a research grant of Rs. 32 lakhs from DST-SERB for a project on hardware security and post-quantum cryptography.',
    '<p>The Department of Electronics & Telecommunication Engineering has been awarded a research grant of Rs. 32,00,000 (Thirty-Two Lakhs) by the Department of Science and Technology — Science and Engineering Research Board (DST-SERB) under the Core Research Grant (CRG) scheme.</p><p>The project titled "FPGA Implementation of Post-Quantum Cryptographic Algorithms for Secure Embedded Systems" will be led by Dr. Shailendra Kumar Singh (Head of Department) in collaboration with Dr. Deepak Bhatt. The project will run for three years (2023–2026).</p><p>The grant will be utilised to procure advanced FPGA development kits, EDA software licences, and fund two full-time Ph.D. scholars.</p>',
    'Research',
    (SELECT id FROM users WHERE email='priya.sharma@sgsits.ac.in'),
    '2025-01-10 11:00:00', 'PUBLISHED'
  ),
  (
    'SGSITS Hosts IEEE MP Section Student Branch Congress 2025',
    'ieee-mp-section-congress-2025',
    'SGSITS hosted the IEEE Madhya Pradesh Section Student Branch Annual Congress 2025, bringing together over 300 student members from 18 engineering colleges.',
    '<p>SGSITS Indore had the honour of hosting the <strong>IEEE Madhya Pradesh Section Student Branch Annual Congress 2025</strong> on 12–13 April 2025. The event, organised by the SGSITS IEEE Student Branch, attracted over 300 student members from 18 engineering colleges across Madhya Pradesh.</p><p>The congress featured paper presentations, a quiz competition, technical panel discussions on "AI in the Next Decade," and leadership training workshops. Mr. Saurabh Agrawal, Chair of IEEE MP Section, inaugurated the event and appreciated SGSITS''s vibrant technical community.</p><p>The SGSITS IEEE Student Branch was also felicitated with the "Most Active Branch Award" for the second consecutive year.</p>',
    'Events',
    (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'),
    '2025-04-14 14:00:00', 'PUBLISHED'
  ),
  (
    'Infosys Campus Connect Programme — 200 Students Certified',
    'infosys-campus-connect-2025',
    'The Infosys Campus Connect Programme concluded at SGSITS with 200 students from CE, IT, and MCA branches receiving digital certifications in programming foundations.',
    '<p>The <strong>Infosys Campus Connect Programme</strong>, a six-month industry training initiative conducted in partnership with Infosys Foundation, concluded successfully with 200 students from Computer Engineering, Information Technology, and MCA branches receiving Infosys digital certifications in Programming Fundamentals, Data Structures, and Problem Solving.</p><p>The programme, which ran from February to July 2025, was conducted by Infosys-trained faculty under the guidance of the Training & Placement Cell. Students participated in online assessment modules on the InfyTQ platform and qualifying students are now directly eligible for the Infosys campus placement process without appearing for the online test.</p>',
    'Placement',
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
    '2025-07-28 10:00:00', 'PUBLISHED'
  ),
  (
    'SGSITS Smart Campus Initiative — Wi-Fi Coverage Expanded to All Hostels',
    'smart-campus-wifi-hostels-2025',
    'The SGSITS Smart Campus project has completed Phase 2, extending high-speed Wi-Fi (100 Mbps) to all hostel blocks and the sports complex.',
    '<p>SGSITS has successfully completed Phase 2 of its <strong>Smart Campus Initiative</strong> with the extension of high-speed Wi-Fi connectivity to all hostel blocks (Boys Hostel A, B, C and Girls Hostel) and the sports complex.</p><p>The expanded network provides 100 Mbps symmetric broadband, benefiting over 500 resident students. The project was funded under the AICTE Modernisation and Removal of Obsolescence (MODROB) scheme at a cost of Rs. 28 lakhs.</p><p>Phase 3, which will cover the gymnasium, transit hostel, and administrative block, is expected to be completed by December 2025.</p>',
    'Infrastructure',
    (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'),
    '2025-05-20 09:30:00', 'PUBLISHED'
  ),
  (
    'Annual Sports Meet 2025 — Closing Ceremony and Prize Distribution',
    'annual-sports-meet-2025',
    'The Annual Sports Meet 2025 concluded with an energetic closing ceremony. CE Department won the overall championship trophy for the third consecutive year.',
    '<p>The <strong>SGSITS Annual Sports Meet 2025</strong> concluded with a grand closing ceremony and prize distribution on 5 February 2025. The three-day event saw participation from all departments in 18 sports disciplines including cricket, football, volleyball, badminton, athletics, and chess.</p><p>The Computer Engineering department won the coveted <strong>Overall Championship Trophy</strong> for the third consecutive year, narrowly beating the Mechanical Engineering team. The sports committee, chaired by Prof. Devendra Mandloi, announced that three SGSITS athletes have been selected for the RGPV Inter-University games.</p><p>Best Athlete of the tournament was awarded to Rohan Verma (B.E. 6th Sem, CE) who set a new institute record in the 100m sprint.</p>',
    'Sports',
    (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'),
    '2025-02-07 11:00:00', 'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE
  excerpt=VALUES(excerpt), content=VALUES(content), status=VALUES(status);

-- ─── 4. Events ────────────────────────────────────────────────────────────────
INSERT INTO events (title, slug, description, event_date, department_id, cover_image_file_id, created_by, status)
VALUES
  (
    'Technova 2026 — Annual Technical Festival',
    'technova-2026',
    'SGSITS invites all engineering and management students for Technova 2026 — the 19th edition of our flagship annual technical festival. Events include Hackathon, Robo-Wars, Circuit Design Competition, Paper Presentation, Technical Quiz, Code Sprint, and cultural programmes. Cash prizes worth Rs. 2 Lakhs. Registration open for all colleges.',
    '2026-03-12 09:00:00',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_ce_sem5_syllabus_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    '38th Annual Convocation Ceremony 2025',
    'convocation-2025',
    'The 38th Annual Convocation Ceremony of SGSITS will be held on 15 November 2025. Degrees will be conferred on the graduating batch of 2024. The Chief Guest will be Dr. Krishnaswamy VijayRaghavan, Former Principal Scientific Adviser to the Government of India. Students who have completed their programme requirements are required to register for the convocation through the student portal by 31 October 2025.',
    '2025-11-15 10:00:00',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_it_sem5_syllabus_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'Smart India Hackathon 2025 — Internal Round',
    'sih-2025-internal',
    'SGSITS will conduct the internal round of Smart India Hackathon 2025 on 5–6 October 2025. Teams of 6 students must register with their team name, problem statement preference, and a brief abstract. Selected teams will represent SGSITS at the national SIH 2025 organised by AICTE and Ministry of Education. Problem statements cover Smart Automation, Healthcare, Agriculture, Education, and Smart Cities domains.',
    '2025-10-05 09:00:00',
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    (SELECT id FROM files WHERE stored_name='seed_me_sem5_syllabus_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'Workshop on Machine Learning with Python — 3-Day Hands-On',
    'workshop-ml-python-2025',
    'The Department of Computer Engineering is conducting a 3-day hands-on workshop on "Machine Learning with Python" from 18–20 November 2025. Topics: NumPy, Pandas, Scikit-Learn, Regression, Classification, Clustering, Neural Networks using Keras. Resource persons are alumni working at Google Bangalore and Microsoft Hyderabad. Registration fee: Rs. 300 (includes study material and lunch). Limited seats: 60.',
    '2025-11-18 09:30:00',
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    NULL,
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'National Seminar on Sustainable Civil Engineering',
    'seminar-sustainable-civil-2025',
    'The Department of Civil Engineering is organising a one-day National Seminar on "Sustainable Materials and Practices in Civil Engineering" on 8 December 2025. Invited keynote speakers include Prof. B.K. Raghuprasad (IISc Bangalore) and Dr. M.C. Natarajan (NIT Trichy). Call for papers is open. Best paper awards: 1st Rs. 5000, 2nd Rs. 3000. Registration deadline: 20 November 2025.',
    '2025-12-08 09:00:00',
    (SELECT id FROM departments WHERE slug='civil-engineering'),
    NULL,
    (SELECT id FROM users WHERE email='hod.civil@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'Industry Interaction Session — KPIT Technologies',
    'industry-session-kpit-2025',
    'KPIT Technologies, Pune will conduct an Industry Interaction Session for B.E. final year students of Mechanical, Electrical, and EC branches on 25 September 2025. Topics include Electric Vehicle Drivetrain Technologies, AUTOSAR, and Embedded Software for Automotive. The session will also include a pre-placement briefing. Students are advised to carry their updated resumes.',
    '2025-09-25 02:00:00',
    NULL,
    NULL,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
    'PUBLISHED'
  ),
  (
    'Fresher''s Orientation Programme 2025–26',
    'freshers-orientation-2025',
    'The Fresher''s Orientation Programme for newly admitted students of B.E., MCA, and MBA (Academic Year 2025–26) will be held from 21–22 July 2025. The programme includes address by the Director, introduction to institute facilities, anti-ragging pledge, introduction of HODs and Class Teachers, library orientation, and a cultural welcome by senior students.',
    '2025-07-21 09:00:00',
    NULL,
    NULL,
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  ),
  (
    'Annual Sports Meet 2025–26',
    'annual-sports-meet-2025-26',
    'The Annual Sports Meet 2025–26 is scheduled for 28–30 January 2026. Events include cricket, football, volleyball, badminton, table tennis, chess, athletics, and tug of war. All students are encouraged to participate. Registration through class teachers from 10–20 January 2026. RGPV Inter-University selection trials will also be held during the sports meet.',
    '2026-01-28 08:00:00',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_academic_calendar_2526.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'),
    'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE
  description=VALUES(description), event_date=VALUES(event_date), status=VALUES(status);

-- ─── 5. Downloads ─────────────────────────────────────────────────────────────
INSERT INTO downloads (title, category, department_id, file_id, uploaded_by, download_count, status)
VALUES
  ('CE Semester 5 Syllabus 2025', 'Syllabus',
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    (SELECT id FROM files WHERE stored_name='seed_fee_structure_2526.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 247, 'ACTIVE'),

  ('IT Semester 5 Syllabus 2025', 'Syllabus',
    (SELECT id FROM departments WHERE slug='information-technology'),
    (SELECT id FROM files WHERE stored_name='seed_hostel_fee_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'), 189, 'ACTIVE'),

  ('ME Semester 5 Syllabus 2025', 'Syllabus',
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    (SELECT id FROM files WHERE stored_name='seed_ug_admission_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'), 203, 'ACTIVE'),

  ('Academic Calendar 2025–26', 'Academic',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_pg_admission_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'), 892, 'ACTIVE'),

  ('Fee Structure 2025–26', 'Administrative',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_scholarship_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'), 1204, 'ACTIVE'),

  ('Hostel Fee Structure 2025–26', 'Administrative',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_placement_brochure_2526.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'), 567, 'ACTIVE'),

  ('UG Admission Prospectus 2025–26', 'Admission',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_tender_lab_equip_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'), 3421, 'ACTIVE'),

  ('PG Admission Prospectus 2025–26', 'Admission',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_pg_admission_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'), 1876, 'ACTIVE'),

  ('Placement Brochure 2025–26', 'Placement',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_placement_brochure_2526.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), 2103, 'ACTIVE'),

  ('Anti-Ragging Policy 2025–26', 'Administrative',
    NULL,
    (SELECT id FROM files WHERE stored_name='seed_anti_ragging_policy_2025.pdf' LIMIT 1),
    (SELECT id FROM users WHERE email='admin@college.edu'), 342, 'ACTIVE')
ON DUPLICATE KEY UPDATE download_count=VALUES(download_count), status=VALUES(status);

-- ─── 6. Alerts (site-wide banners) ───────────────────────────────────────────
INSERT INTO alerts (message, alert_type, link_url, priority, is_active, created_by, expires_at)
VALUES
  (
    'End Semester Examination December 2025 — Date Sheet Released. Download now.',
    'INFO', '/notices/end-sem-exam-dec-2025-date-sheet', 1, 1,
    (SELECT id FROM users WHERE email='admin@college.edu'), '2025-12-31 23:59:59'
  ),
  (
    'Placement Season 2025–26 Open — Final Year Students Register on Placement Portal by 30 Aug 2025.',
    'SUCCESS', '/notices/placement-registration-2025-26', 2, 1,
    (SELECT id FROM users WHERE email='placement@sgsits.ac.in'), '2025-08-31 23:59:59'
  ),
  (
    'UG Counselling 2025–26 — Refer official schedule in Admissions section.',
    'WARNING', '/admission/ug', 3, 1,
    (SELECT id FROM users WHERE email='admin@college.edu'), '2025-09-30 23:59:59'
  )
ON DUPLICATE KEY UPDATE message=VALUES(message);

-- ─── 7. Tenders ───────────────────────────────────────────────────────────────
INSERT INTO tenders (title, slug, description, file_id, tender_no, deadline, created_by, status)
VALUES
  (
    'Supply of Computer Laboratory Equipment (Desktops & Accessories)',
    'tender-computer-lab-equipment-2025',
    'SGSITS Indore invites sealed tenders from reputed firms for the supply and installation of 60 desktop computers (i7 12th Gen, 16GB RAM, 512GB SSD) along with networking accessories for the Computer Engineering and IT Department laboratories. Tender documents available from the institute office on payment of Rs. 500/- (non-refundable).',
    (SELECT id FROM files WHERE stored_name='seed_tender_lab_equip_2025.pdf' LIMIT 1),
    'SGSITS/EQUIP/2025-26/001', '2025-10-15',
    (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'
  ),
  (
    'Annual Maintenance Contract for HVAC Systems',
    'tender-hvac-amc-2025',
    'SGSITS invites tenders from authorised HVAC service providers for Annual Maintenance Contract for air conditioning units installed in Main Building, Administrative Block, and Computer Centre. The AMC covers preventive maintenance, breakdown service, and replacement of consumables.',
    NULL, 'SGSITS/AMC/2025-26/002', '2025-09-30',
    (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'
  ),
  (
    'Construction of Additional Floor in Boys Hostel Block B',
    'tender-hostel-construction-2025',
    'SGSITS invites bids from Class-B and above MPPWD registered contractors for the construction of an additional floor (10 rooms) in Boys Hostel Block B. Estimated cost: Rs. 45 Lakhs. Work completion period: 6 months. Tender documents and drawings available at the Civil Engineering Department.',
    NULL, 'SGSITS/CIVIL/2025-26/003', '2025-11-01',
    (SELECT id FROM users WHERE email='admin@college.edu'), 'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE description=VALUES(description), status=VALUES(status);

-- ─── 8. Pages (CMS Static Pages) ─────────────────────────────────────────────
UPDATE pages SET
  content = '<h2>About SGSITS</h2><p>Shri G.S. Institute of Technology and Science, Indore, is one of the premier autonomous engineering institutes of Madhya Pradesh. Established in 1952 by the visionary industrialist Late Shri Ghanshyam Das Birla, the institute has been imparting quality technical education for over seven decades.</p><p>SGSITS is an autonomous institute affiliated to Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal and approved by AICTE, New Delhi. The institute is accredited by NAAC with ''A'' Grade and several programmes are NBA-accredited.</p><p>The institute offers B.E. programmes in Computer Engineering, Information Technology, Mechanical Engineering, Civil Engineering, Electrical Engineering, and Electronics & Telecommunication Engineering, along with postgraduate programmes M.Tech., MCA, and MBA.</p><h3>Vision</h3><p>To be a globally recognised centre of excellence in technical education, research, and innovation.</p><h3>Mission</h3><p>To impart quality technical education, foster research and innovation, and develop ethical and socially responsible professionals who contribute to the development of the nation.</p>',
  meta_title = 'About SGSITS Indore — Premier Engineering Institute',
  meta_description = 'Learn about SGSITS Indore — one of MP''s leading autonomous engineering institutes established in 1952 by Shri G.S. Birla. NAAC ''A'' Grade accredited, NBA-approved.',
  status = 'PUBLISHED'
WHERE slug = 'about';

UPDATE pages SET
  content = '<h2>Administration</h2><p>SGSITS is governed by a Board of Governors chaired by a distinguished industrialist appointed by the state government. The Director is the academic and administrative head of the institute.</p><h3>Director</h3><p>Prof. R.K. Pandey, Ph.D. (IIT Delhi) — Director, SGSITS Indore</p><h3>Registrar</h3><p>Dr. P.K. Agrawal — Registrar, SGSITS Indore</p><h3>Deans</h3><ul><li>Dean Academics: Prof. A.K. Chouhan</li><li>Dean Research: Dr. Manoj Kumar Jain</li><li>Dean Student Welfare: Dr. Pradeep Kasande</li><li>Dean Infrastructure: Prof. Y.K. Bajpai</li></ul>',
  meta_title = 'Administration — SGSITS Indore',
  meta_description = 'SGSITS administration: Director, Registrar, Deans, and Board of Governors details for Shri G.S. Institute of Technology & Science, Indore.',
  status = 'PUBLISHED'
WHERE slug = 'administration';

UPDATE pages SET
  content = '<h2>Contact Us</h2><p>Shri G.S. Institute of Technology and Science<br>23, Park Road, Indore — 452 003 (M.P.) India</p><h3>General Enquiry</h3><p>Phone: 0731-2431300<br>Fax: 0731-2431302<br>Email: info@sgsits.ac.in</p><h3>Admissions Office</h3><p>Phone: 0731-2431305<br>Email: admissions@sgsits.ac.in<br>Timing: Mon–Sat, 10:00 AM – 5:00 PM</p><h3>Examination Section</h3><p>Phone: 0731-2431308<br>Email: examcontroller@sgsits.ac.in</p><h3>Training & Placement Cell</h3><p>Phone: 0731-2431320<br>Email: placement@sgsits.ac.in</p>',
  meta_title = 'Contact SGSITS Indore — Address, Phone & Email',
  meta_description = 'Get in touch with SGSITS Indore. Address: 23, Park Road, Indore-452003 MP. Phone: 0731-2431300. Email: info@sgsits.ac.in.',
  status = 'PUBLISHED'
WHERE slug = 'contact';

SET foreign_key_checks = 1;
