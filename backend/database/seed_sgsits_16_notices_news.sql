-- =============================================================================
-- SGSITS Seed 16: Notices, News, Events, Tenders, Alerts from mockStore.ts
-- All content previously hardcoded in the frontend data store
-- Run AFTER: seed_sgsits_15_placement.sql
-- =============================================================================
USE college_website;
SET NAMES utf8mb4;
SET foreign_key_checks = 0;

SET @admin    = (SELECT id FROM users WHERE email = 'admin@college.edu'       LIMIT 1);
SET @exam     = (SELECT id FROM users WHERE email = 'examcontroller@sgsits.ac.in' LIMIT 1);
SET @placement= (SELECT id FROM users WHERE email = 'placement@sgsits.ac.in'  LIMIT 1);

-- Fall back to admin if specialized users don't exist yet
SET @exam      = COALESCE(@exam, @admin);
SET @placement = COALESCE(@placement, @admin);

-- ── 1. Notices ────────────────────────────────────────────────────────────────
INSERT INTO notices (title, slug, description, notice_type, created_by, publish_date, status)
VALUES
  ('B.Tech 2025 Admission Notice — JEE Main Counselling Schedule',
   'btech-2025-admission-notice-jee-main-counselling',
   'SGSITS Indore invites applications from JEE Main 2025 qualified candidates for B.Tech admissions through MPDTE online counselling. Registration begins July 1, 2025. Branches: Computer, IT, Mechanical, Civil, Electrical, Electronics. Contact admissions@sgsits.ac.in for details.',
   'GENERAL', @admin, '2025-06-01', 'PUBLISHED'),

  ('End Semester Examination Results — November/December 2024',
   'end-semester-results-nov-dec-2024',
   'Results for End Semester Examination (November/December 2024) have been declared. Students can access their results through the ERP portal at erp.sgsitsindore.in. For re-evaluation queries, contact the Examination Cell.',
   'EXAM', @exam, '2025-01-20', 'PUBLISHED'),

  ('NAAC Peer Team Visit — February 2025',
   'naac-peer-team-visit-february-2025',
   'The National Assessment and Accreditation Council (NAAC) Peer Team will be visiting SGSITS Indore from February 18–20, 2025, for accreditation assessment. All departments are requested to ensure readiness.',
   'GENERAL', @admin, '2025-01-15', 'PUBLISHED'),

  ('Anti-Ragging Committee Formation — 2025-26',
   'anti-ragging-committee-formation-2025-26',
   'In accordance with UGC regulations, the Anti-Ragging Committee for 2025-26 has been constituted. All students must submit anti-ragging affidavits (self and parent) during registration. National Anti-Ragging Helpline: 1800-180-5522.',
   'GENERAL', @admin, '2025-07-01', 'PUBLISHED'),

  ('Merit Scholarship Applications Open — 2024-25',
   'merit-scholarship-applications-open-2024-25',
   'Applications for institute merit scholarships for the academic year 2024-25 are open. Students with CGPA above 8.5 in the previous semester are eligible. Last date to apply: September 30, 2025. Submit applications to the Student Welfare Office.',
   'GENERAL', @admin, '2025-09-01', 'PUBLISHED'),

  ('Industrial Visit — Bosch Manufacturing Plant, Bangalore',
   'industrial-visit-bosch-manufacturing-plant',
   'The Department of Mechanical Engineering is organizing an industrial visit to Bosch Manufacturing Plant, Bangalore, from March 15–18, 2025. B.Tech 6th semester ME students are invited to register. Contact hod.mechanical-engineering@sgsits.ac.in.',
   'DEPARTMENT', @admin, '2025-02-20', 'PUBLISHED'),

  ('Campus Recruitment Drive — TCS Digital',
   'campus-recruitment-drive-tcs-digital-2025',
   'Tata Consultancy Services (TCS) will be conducting campus recruitment for TCS Digital and TCS NQT profiles. Eligible: B.Tech 7th/8th semester students with minimum 60% throughout. Registration deadline: October 15, 2025.',
   'PLACEMENT', @placement, '2025-10-01', 'PUBLISHED'),

  ('Mid-Semester Examination Schedule — September 2025',
   'mid-semester-examination-schedule-september-2025',
   'Mid-Semester Examinations for Odd Semester 2025-26 are scheduled from September 22–27, 2025. Date sheets have been circulated to all departments. Students should contact their respective department offices for subject-specific schedules.',
   'EXAM', @exam, '2025-09-10', 'PUBLISHED'),

  ('Workshop on AI & Machine Learning — SGSITS',
   'workshop-ai-machine-learning-sgsits-2025',
   'The Department of Computer Engineering in association with NASSCOM is organizing a 5-day workshop on Artificial Intelligence and Machine Learning from October 7–11, 2025. Open to all B.Tech and M.Tech students. Register at ce@sgsits.ac.in.',
   'GENERAL', @admin, '2025-09-25', 'PUBLISHED'),

  ('Hostel Allotment 2025-26 — Final List',
   'hostel-allotment-2025-26-final-list',
   'The final hostel allotment list for 2025-26 has been published. Students are required to report to the Chief Warden''s Office by August 10, 2025, along with original documents and initial fees. Boys: 3 blocks, 350 seats. Girls: 150 seats.',
   'GENERAL', @admin, '2025-07-25', 'PUBLISHED'),

  ('E-Resources Access Renewal — INFLIBNET N-LIST',
   'e-resources-access-renewal-inflibnet-nlist-2025',
   'SGSITS Library has renewed access to INFLIBNET N-LIST databases for 2025-26, providing 6,000+ e-journals and 97,000+ e-books. Access is available on-campus from all IP addresses. Students can also register for off-campus access.',
   'GENERAL', @admin, '2025-08-01', 'PUBLISHED'),

  ('Procurement Tender — Laboratory Equipment 2025-26',
   'procurement-tender-laboratory-equipment-2025-26',
   'SGSITS Indore invites sealed tenders from reputed suppliers for supply of scientific laboratory equipment for the academic year 2025-26. Tender forms available at the Purchase Office. Last date: October 25, 2025. Estimated value: ₹12 Lakhs.',
   'GENERAL', @admin, '2025-10-01', 'PUBLISHED'),

  ('DST-SERB Research Grant — Dr. A.K. Singh, Civil Engineering',
   'dst-serb-research-grant-ak-singh-civil-2025',
   'Dr. A.K. Singh, Associate Professor, Department of Civil Engineering, SGSITS, has been awarded a research grant of ₹18.5 Lakhs by DST-SERB for the project "Sustainable Construction Materials Using Industrial By-products". Project duration: 3 years.',
   'GENERAL', @admin, '2025-06-15', 'PUBLISHED'),

  ('GATE 2026 Registration — Important Dates',
   'gate-2026-registration-important-dates',
   'Registration for GATE 2026 is open from August 28, 2025. Last date for regular registration: October 3, 2025. Students aspiring for M.Tech admissions and PSU recruitment are encouraged to register. SGSITS GATE Coaching begins October 2025.',
   'GENERAL', @admin, '2025-09-01', 'PUBLISHED')

ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description), status=VALUES(status);

-- ── 2. News Articles ──────────────────────────────────────────────────────────
INSERT INTO news (title, slug, excerpt, content, category, author_id, published_at, status)
VALUES
  (
    'SGSITS Tops MP Engineering Institutes in NIRF 2025 Rankings',
    'sgsits-tops-mp-engineering-institutes-nirf-2025',
    'SGSITS Indore has secured the top position among engineering institutes in Madhya Pradesh in the NIRF 2025 rankings, achieving an overall score of 52.34.',
    'Shri G.S. Institute of Technology & Science (SGSITS), Indore, has secured the top position among engineering institutes in Madhya Pradesh in the National Institutional Ranking Framework (NIRF) 2025. With an overall score of 52.34, SGSITS emerged as the highest-ranked engineering institution in MP. The ranking considers parameters including Teaching, Learning & Resources; Research & Professional Practice; Graduation Outcomes; Outreach & Inclusivity; and Perception. Director Prof. R.K. Pandey stated: "This ranking reflects our faculty''s dedication, students'' brilliance, and the trust of our stakeholders."',
    'ACHIEVEMENT', @admin, '2025-06-10 10:00:00', 'PUBLISHED'
  ),
  (
    'SGSITS Alumni Lands ₹45 LPA Package at Oracle',
    'sgsits-alumni-lands-45-lpa-package-oracle',
    'Rahul Sharma, a 2025 B.Tech Computer Engineering graduate from SGSITS Indore, has been placed at Oracle India with a package of ₹45 LPA, the highest placement offer in the institute''s 2024-25 season.',
    'In a proud moment for SGSITS Indore, Rahul Sharma, a 2025 B.Tech Computer Engineering graduate, has been placed at Oracle India with a package of ₹45 LPA — the highest placement offer recorded in the 2024-25 placement season. Rahul, who specialized in AI and distributed systems, cleared multiple rounds of technical and HR interviews. "SGSITS gave me the foundation — the labs, the faculty guidance, and the placement cell support made all the difference," said Rahul. The T&P Cell reported a 86% overall placement rate for 2024-25.',
    'PLACEMENT', @placement, '2025-05-20 12:00:00', 'PUBLISHED'
  ),
  (
    'DST-SERB Research Grant of ₹38 Lakhs to SGSITS Faculty',
    'dst-serb-research-grant-38-lakhs-sgsits-faculty',
    'Dr. Priya Saxena from the Department of Computer Engineering has been awarded a DST-SERB research grant of ₹38 Lakhs for a project on federated learning for healthcare privacy preservation.',
    'Dr. Priya Saxena, Associate Professor, Department of Computer Engineering, SGSITS Indore, has been awarded a prestigious research grant of ₹38 Lakhs by the Department of Science & Technology (DST) under the Science and Engineering Research Board (SERB) scheme. The project titled "Privacy-Preserving Federated Learning for Healthcare Data" will run for 3 years and involves collaboration with IIT Bombay and AIIMS Bhopal. "This grant validates our research direction in health informatics and AI," said Dr. Saxena.',
    'RESEARCH', @admin, '2025-04-15 09:00:00', 'PUBLISHED'
  ),
  (
    'Tata Technologies MoU Signed for Skill Development',
    'tata-technologies-mou-signed-skill-development',
    'SGSITS Indore and Tata Technologies signed an MoU for skill development initiatives covering embedded systems, automotive engineering, and Industry 4.0 technologies.',
    'SGSITS Indore and Tata Technologies Limited signed a Memorandum of Understanding (MoU) for comprehensive skill development and industry partnership. The MoU covers embedded systems training, automotive engineering programmes, Industry 4.0 technologies, and placement opportunities for SGSITS students. Director Prof. R.K. Pandey and Tata Technologies VP Mr. Rajeev Goyal signed the agreement in a ceremony attended by faculty and students. Under this MoU, Tata Technologies will provide 50 internships annually and conduct joint workshops on digital engineering.',
    'PARTNERSHIP', @admin, '2025-03-22 11:00:00', 'PUBLISHED'
  ),
  (
    'Smart India Hackathon 2024 — SGSITS Team Wins National Award',
    'smart-india-hackathon-2024-sgsits-wins-national',
    'Team EduSpark from SGSITS Computer Engineering department won 1st prize at Smart India Hackathon 2024 in the Education Technology category, receiving a cash prize of ₹1 Lakh.',
    'A team of six students from the Department of Computer Engineering, SGSITS Indore, has won 1st prize at the Smart India Hackathon (SIH) 2024 in the Education Technology category. Team EduSpark, mentored by Dr. Anita Singh, developed an AI-based adaptive assessment platform that personalizes question papers based on student learning patterns. The team received a cash prize of ₹1 Lakh from the Ministry of Education. "SIH is a platform that challenges you to build for real-world impact, and winning it is deeply satisfying," said team leader Aditya Sharma.',
    'ACHIEVEMENT', @admin, '2024-12-20 14:00:00', 'PUBLISHED'
  ),
  (
    'NAAC Accreditation Renewed — SGSITS Retains Grade A',
    'naac-accreditation-renewed-sgsits-retains-grade-a',
    'SGSITS Indore has successfully retained its NAAC Grade "A" accreditation following the peer team visit in February 2025, recognizing excellence in teaching, research, and governance.',
    'Shri G.S. Institute of Technology & Science (SGSITS), Indore, has successfully retained its National Assessment and Accreditation Council (NAAC) Grade "A" accreditation. The NAAC Peer Team visit conducted in February 2025 assessed SGSITS across seven criteria: Curricular Aspects, Teaching-Learning & Evaluation, Research & Innovation, Infrastructure & Learning Resources, Student Support & Progression, Governance & Leadership, and Institutional Values. The renewed accreditation acknowledges SGSITS'' consistent commitment to academic excellence.',
    'ACHIEVEMENT', @admin, '2025-03-10 10:00:00', 'PUBLISHED'
  ),
  (
    'Institute Day 2025 Celebrates 73 Years of Excellence',
    'institute-day-2025-celebrates-73-years-excellence',
    'SGSITS Indore''s Institute Day 2025 was celebrated on August 25 with the presentation of annual awards, cultural performances, and a convocation for the graduating batch of 2025.',
    'SGSITS Indore celebrated its 73rd Institute Day on August 25, 2025, with great enthusiasm. The event featured the annual award ceremony honouring meritorious students, outstanding faculty, and distinguished alumni. Chief Guest Mr. Satish Mahana, Minister of Technical Education, Government of Madhya Pradesh, presented certificates to 342 graduating students. The Director''s Annual Report highlighted key achievements including the NIRF top ranking in MP, 86% placement rate, ₹38 Lakh DST-SERB research grant, and SIH 2024 victory.',
    'EVENT', @admin, '2025-08-25 18:00:00', 'PUBLISHED'
  ),
  (
    'AICTE IDEA Lab Inaugurated — Fostering Innovation',
    'aicte-idea-lab-inaugurated-fostering-innovation',
    'SGSITS Indore inaugurated its AICTE-funded IDEA Lab equipped with 3D printers, IoT kits, robotics components, and maker-space infrastructure to promote student innovation.',
    'SGSITS Indore inaugurated the AICTE IDEA (Innovation, Design, and Entrepreneurship for All) Lab with a state-of-the-art facility featuring 3D printers, laser cutters, CNC machines, IoT development kits, robotics components, AR/VR headsets, and a dedicated maker-space. The lab, funded with ₹32 Lakhs under the AICTE scheme, was inaugurated by the Director in presence of all HODs and students. "This lab will be the epicentre of innovation at SGSITS, breaking barriers between learning and creating," said Director Prof. R.K. Pandey.',
    'INFRASTRUCTURE', @admin, '2025-02-15 11:00:00', 'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE
  title=VALUES(title), excerpt=VALUES(excerpt), status=VALUES(status);

-- ── 3. Events ─────────────────────────────────────────────────────────────────
INSERT INTO events (title, slug, description, event_date, created_by, status)
VALUES
  (
    'Institute Day 2025 — 73rd Founding Anniversary',
    'institute-day-2025-73rd-founding-anniversary',
    'SGSITS Indore''s annual Institute Day celebrating 73 years of academic excellence. Features award ceremony, cultural performances, convocation for the 2025 graduating batch, and address by Chief Guest. All students, faculty, and alumni are cordially invited.',
    '2025-08-25', @admin, 'PUBLISHED'
  ),
  (
    'TechFest Invictus 2025 — National Level Tech Fest',
    'techfest-invictus-2025-national-level-tech-fest',
    'Invictus 2025, SGSITS'' flagship national-level technical festival, features 20+ events including hackathons, robotics, paper presentation, project expos, and coding competitions. Over 3,000 students from 50+ colleges expected to participate.',
    '2025-11-14', @admin, 'PUBLISHED'
  ),
  (
    'Research Symposium — Emerging Technologies 2025',
    'research-symposium-emerging-technologies-2025',
    'Annual research symposium featuring paper presentations by faculty and students on AI/ML, IoT, renewable energy, smart materials, and healthcare technology. Keynote by Dr. Vijay Bhatkar, Padma Shri awardee and founder of C-DAC.',
    '2025-10-05', @admin, 'PUBLISHED'
  ),
  (
    'GATE 2026 Preparation Workshop',
    'gate-2026-preparation-workshop-sgsits',
    'Comprehensive 3-day workshop on GATE 2026 preparation covering General Aptitude, Engineering Mathematics, and subject-specific topics for CSE, EE, ME, and CE branches. Conducted by GATE 2025 rank holders and SGSITS faculty.',
    '2025-10-18', @admin, 'PUBLISHED'
  ),
  (
    'Faculty Development Program — Machine Learning in Engineering',
    'fdp-machine-learning-engineering-sgsits',
    'One-week Faculty Development Program on "Machine Learning Applications in Engineering" sponsored by ISTE. Open to faculty members from across MP. Certificates issued by SGSITS and ISTE upon completion.',
    '2025-12-01', @admin, 'PUBLISHED'
  ),
  (
    'Annual Sports Meet — Spandan 2026',
    'annual-sports-meet-spandan-2026',
    'SGSITS Annual Sports Meet "Spandan 2026" featuring intercollegiate competitions in cricket, football, volleyball, basketball, badminton, athletics, and indoor games. Registration open for teams from engineering colleges across Indore.',
    '2026-01-20', @admin, 'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description), status=VALUES(status);

-- ── 4. Tenders ────────────────────────────────────────────────────────────────
INSERT INTO tenders (title, slug, description, tender_no, deadline, created_by, status)
VALUES
  (
    'Supply of Scientific Laboratory Equipment — 2025-26',
    'supply-scientific-laboratory-equipment-2025-26',
    'SGSITS Indore invites sealed tenders from reputed manufacturers/suppliers for supply, installation, and commissioning of scientific laboratory equipment including electronics measurement instruments, chemistry analyzers, and materials testing equipment. Estimated value: ₹12 Lakhs.',
    'SGSITS/PUR/LAB/2025-26/001', '2025-10-25', @admin, 'PUBLISHED'
  ),
  (
    'Mess Catering Contract — Hostel Complex 2025-26',
    'mess-catering-contract-hostel-complex-2025-26',
    'Applications are invited from registered catering contractors for running the hostel mess facility at SGSITS Boys'' and Girls'' Hostels for the academic year 2025-26. The contract covers breakfast, lunch, and dinner for approximately 500 residential students. Estimated value: ₹38 Lakhs per annum.',
    'SGSITS/PUR/MESS/2025-26/002', '2025-09-15', @admin, 'PUBLISHED'
  ),
  (
    'Civil Renovation Works — Main Building Extension',
    'civil-renovation-works-main-building-extension',
    'SGSITS invites tenders for civil renovation and extension works in the Main Building including construction of seminar halls, renovation of administrative offices, and provision of accessibility ramps as per PWD specifications. Estimated value: ₹75 Lakhs.',
    'SGSITS/WORKS/CIVIL/2025-26/001', '2025-11-01', @admin, 'PUBLISHED'
  ),
  (
    'IT Infrastructure Upgrade — Networking Equipment',
    'it-infrastructure-upgrade-networking-equipment-2025',
    'SGSITS IT Cell invites quotations for supply of networking equipment including managed switches, access points, fiber optic cables, and network management software for Smart Campus Wi-Fi expansion. Estimated value: ₹8.5 Lakhs.',
    'SGSITS/IT/NET/2025-26/001', '2025-10-10', @admin, 'PUBLISHED'
  ),
  (
    'Annual Maintenance Contract — Air Conditioning Systems',
    'amc-air-conditioning-systems-2025-26',
    'Quotations invited from authorized HVAC service providers for Annual Maintenance Contract (AMC) for split ACs and centralized air conditioning systems in computer labs, administrative offices, and conference halls. 85 units approx.',
    'SGSITS/AMC/HVAC/2025-26/001', '2025-09-30', @admin, 'PUBLISHED'
  )
ON DUPLICATE KEY UPDATE
  title=VALUES(title), description=VALUES(description), status=VALUES(status);

-- ── 5. Alerts ─────────────────────────────────────────────────────────────────
INSERT INTO alerts (message, alert_type, link_url, priority, is_active, created_by)
VALUES
  ('B.Tech 2025-26 Admissions are now open! Register on MPDTE portal.',
   'INFO', '/admission/ug', 10, 1, @admin),
  ('Campus Recruitment Drive — TCS Digital on October 20, 2025. Register Now!',
   'SUCCESS', '/notices', 9, 1, @admin),
  ('End Semester Exam Date Sheet for November 2025 released. Download from Notices.',
   'WARNING', '/notices', 8, 1, @admin),
  ('TechFest Invictus 2025 — November 14–16. Register your teams now!',
   'INFO', '/events', 7, 1, @admin)
ON DUPLICATE KEY UPDATE message=VALUES(message), is_active=VALUES(is_active);

SET foreign_key_checks = 1;
