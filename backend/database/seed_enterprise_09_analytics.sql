-- =============================================================================
-- ENTERPRISE SEED — Part 09: Visitor Stats, Audit Logs, Notifications,
--                             Leave Requests (sample), Timetables (sample)
-- Run AFTER: seed_enterprise_07_gallery_labs.sql
-- =============================================================================
USE SGSITS_DB;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Visitor Total (singleton) ────────────────────────────────────────────
INSERT INTO visitor_total (id, total_count) VALUES (1, 284750)
ON DUPLICATE KEY UPDATE total_count=284750;

-- ─── 2. Daily Visitor Stats — last 30 days ───────────────────────────────────
INSERT INTO visitor_stats (stat_date, page_views, unique_visits) VALUES
  ('2025-04-25', 1842, 624),
  ('2025-04-26', 1207, 418),
  ('2025-04-27', 893,  302),
  ('2025-04-28', 2105, 712),
  ('2025-04-29', 2340, 801),
  ('2025-04-30', 2218, 753),
  ('2025-05-01', 3102, 1043),
  ('2025-05-02', 2876, 968),
  ('2025-05-03', 1654, 558),
  ('2025-05-04', 1122, 380),
  ('2025-05-05', 2987, 1012),
  ('2025-05-06', 3241, 1098),
  ('2025-05-07', 3087, 1045),
  ('2025-05-08', 2754, 930),
  ('2025-05-09', 2432, 823),
  ('2025-05-10', 1543, 521),
  ('2025-05-11', 1387, 469),
  ('2025-05-12', 2856, 967),
  ('2025-05-13', 3102, 1050),
  ('2025-05-14', 3456, 1170),
  ('2025-05-15', 4123, 1397),
  ('2025-05-16', 3876, 1314),
  ('2025-05-17', 2987, 1014),
  ('2025-05-18', 1765, 598),
  ('2025-05-19', 2103, 712),
  ('2025-05-20', 3241, 1098),
  ('2025-05-21', 3567, 1210),
  ('2025-05-22', 3234, 1098),
  ('2025-05-23', 2876, 978),
  ('2025-05-24', 2654, 901)
ON DUPLICATE KEY UPDATE page_views=VALUES(page_views), unique_visits=VALUES(unique_visits);

-- ─── 3. Audit Logs — sample activity ─────────────────────────────────────────
INSERT INTO audit_logs (user_id, action, module_name, record_id, description, ip_address)
VALUES
  ((SELECT id FROM users WHERE email='admin@college.edu'),
   'CREATE', 'notices', 1, 'Created notice: End Semester Examination December 2025 Date Sheet', '192.168.1.10'),

  ((SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   'CREATE', 'placement_drives', 1, 'Created placement drive: TCS National Qualifier Test 2025-26', '192.168.1.25'),

  ((SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   'CREATE', 'exam_sessions', 1, 'Created exam session: July 2025 - November 2025 (Active)', '192.168.1.30'),

  ((SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   'UPDATE', 'departments', 1, 'Updated CE department description and vision statement', '10.0.0.15'),

  ((SELECT id FROM users WHERE email='admin@college.edu'),
   'CREATE', 'alerts', 1, 'Created site alert: End Semester Exam December 2025', '192.168.1.10'),

  ((SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   'UPDATE', 'placement_year_stats', 5, 'Updated placement stats for academic year 2024-25', '192.168.1.25'),

  ((SELECT id FROM users WHERE email='rahul.gupta@sgsits.ac.in'),
   'CREATE', 'news', 1, 'Published news: SGSITS Students Bag 15 Offers in TCS NQT 2025', '192.168.1.12'),

  ((SELECT id FROM users WHERE email='admin@college.edu'),
   'UPDATE', 'cms_sections', NULL, 'Updated CMS section: home_hero', '192.168.1.10'),

  ((SELECT id FROM users WHERE email='hod.ec@sgsits.ac.in'),
   'CREATE', 'department_achievements', 5, 'Added achievement: DST-SERB Grant for EC Department', '10.0.0.20'),

  ((SELECT id FROM users WHERE email='admin@college.edu'),
   'CREATE', 'tenders', 1, 'Published tender: Supply of Computer Laboratory Equipment', '192.168.1.10');

-- ─── 4. Notifications ────────────────────────────────────────────────────────
INSERT INTO notifications (user_id, title, message, link, is_read)
VALUES
  ((SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
   'New Leave Request', 'Prof. Amit Soni has submitted a leave request for 18-19 Sep 2025.',
   '/dashboard/hod/leaves', 0),

  ((SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
   'Faculty Profile Update', 'Dr. Pooja Chouhan has updated her faculty profile with new publications.',
   '/dashboard/hod/faculty', 0),

  ((SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'),
   'Marks Submission Pending', 'CE501 marks for MST1 Q2 are pending submission from Dr. Ajay Khunteta.',
   '/dashboard/exam/requests', 0),

  ((SELECT id FROM users WHERE email='placement@sgsits.ac.in'),
   'Company Registration', 'Persistent Systems has registered for campus placement 2025-26.',
   '/dashboard/placement/drives', 0),

  ((SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'),
   'Marks Approval Required', 'Your submitted marks for CE506 AI are pending HOD approval.',
   '/dashboard/faculty/marks', 1),

  ((SELECT id FROM users WHERE email='admin@college.edu'),
   'New Contact Submission', 'New enquiry received from Ramesh Verma regarding UG admission 2025-26.',
   '/dashboard/admin/contact', 0),

  ((SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
   'Achievement Published', 'Dr. Pradeep Kasande RGPV Best Teacher Award achievement has been published.',
   '/dashboard/hod/achievements', 1);

-- ─── 5. Sample Leave Requests ─────────────────────────────────────────────────
INSERT INTO leave_requests
  (user_id, department_id, leave_type, from_date, to_date, days_count, reason, status, reviewed_by, review_remarks)
VALUES
  (
    (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    'Casual', '2025-09-18', '2025-09-19', 2,
    'Need to attend marriage ceremony of a close relative in Bhopal. Classes will be rescheduled with mutual consent of students.',
    'approved',
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'),
    'Approved. Please ensure make-up classes are conducted within a week.'
  ),
  (
    (SELECT id FROM users WHERE email='pooja.chouhan@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Duty', '2025-10-12', '2025-10-14', 3,
    'Invited as session chair and paper presenter at International Conference on Machine Learning in Healthcare, Pune.',
    'approved',
    (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'),
    'Duty leave sanctioned. Please submit conference proceedings on return.'
  ),
  (
    (SELECT id FROM users WHERE email='rakesh.chouksey@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='mechanical-engineering'),
    'Medical', '2025-08-05', '2025-08-09', 5,
    'Undergoing surgical procedure requiring 5 days hospitalisation and recuperation.',
    'approved',
    (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'),
    'Medical leave sanctioned with sympathies. Please provide medical certificate.'
  ),
  (
    (SELECT id FROM users WHERE email='sneha.tiwari@sgsits.ac.in'),
    (SELECT id FROM departments WHERE slug='information-technology'),
    'Earned', '2025-12-22', '2025-12-27', 6,
    'Annual family vacation during semester break period.',
    'pending',
    NULL, NULL
  )
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- ─── 6. Sample Timetable ──────────────────────────────────────────────────────
INSERT INTO timetables
  (department_id, course_id, section_id, semester, academic_year, title, is_active, created_by)
VALUES
  (
    (SELECT id FROM departments WHERE slug='computer-engineering'),
    (SELECT id FROM exam_courses WHERE course_code='BE-CE'),
    (SELECT id FROM exam_sections WHERE department_id=(SELECT id FROM departments WHERE slug='computer-engineering')
      AND course_id=(SELECT id FROM exam_courses WHERE course_code='BE-CE') AND section_name='A'),
    5, '2025-26',
    'BE CE Sem 5 Section A — Timetable July–Nov 2025',
    1,
    (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in')
  )
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Sample timetable entries (CE Sem 5 Section A)
SET @tt = (SELECT id FROM timetables WHERE title='BE CE Sem 5 Section A — Timetable July–Nov 2025' LIMIT 1);
SET @ce501_faculty = (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in');
SET @ce502_faculty = (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in');
SET @ce503_faculty = (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in');
SET @ce504_faculty = (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in');
SET @ce505_faculty = (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in');
SET @ce506_faculty = (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in');

INSERT INTO timetable_entries
  (timetable_id, day_of_week, period_no, subject_label, faculty_user_id, room, start_time, end_time)
VALUES
  (@tt,'Mon',1,'Design & Analysis of Algorithms (CE501)',@ce501_faculty,'Room 301','09:00','10:00'),
  (@tt,'Mon',2,'Database Management Systems (CE502)',    @ce502_faculty,'Room 301','10:00','11:00'),
  (@tt,'Mon',3,'Operating Systems (CE503)',              @ce503_faculty,'Room 301','11:15','12:15'),
  (@tt,'Mon',4,'Computer Networks (CE504)',              @ce504_faculty,'Room 301','12:15','01:15'),
  (@tt,'Tue',1,'Theory of Computation (CE505)',          @ce505_faculty,'Room 302','09:00','10:00'),
  (@tt,'Tue',2,'Artificial Intelligence (CE506)',        @ce506_faculty,'Room 302','10:00','11:00'),
  (@tt,'Tue',3,'Design & Analysis of Algorithms (CE501)',@ce501_faculty,'Room 302','11:15','12:15'),
  (@tt,'Tue',4,'DBMS Lab',                              @ce502_faculty,'PL Lab 2','12:15','02:15'),
  (@tt,'Wed',1,'Computer Networks (CE504)',              @ce504_faculty,'Room 301','09:00','10:00'),
  (@tt,'Wed',2,'Operating Systems (CE503)',              @ce503_faculty,'Room 301','10:00','11:00'),
  (@tt,'Wed',3,'AI Lab',                                @ce506_faculty,'AI/ML Lab','11:15','01:15'),
  (@tt,'Thu',1,'Database Management Systems (CE502)',    @ce502_faculty,'Room 303','09:00','10:00'),
  (@tt,'Thu',2,'Theory of Computation (CE505)',          @ce505_faculty,'Room 303','10:00','11:00'),
  (@tt,'Thu',3,'Networks Lab',                          @ce504_faculty,'Net Lab','11:15','01:15'),
  (@tt,'Fri',1,'Design & Analysis of Algorithms (CE501)',@ce501_faculty,'Room 301','09:00','10:00'),
  (@tt,'Fri',2,'Artificial Intelligence (CE506)',        @ce506_faculty,'Room 301','10:00','11:00'),
  (@tt,'Fri',3,'Operating Systems (CE503)',              @ce503_faculty,'Room 301','11:15','12:15'),
  (@tt,'Fri',4,'Theory of Computation (CE505)',          @ce505_faculty,'Room 301','12:15','01:15'),
  (@tt,'Sat',1,'Tutorial — DAA',                        @ce501_faculty,'Room 302','09:00','10:00'),
  (@tt,'Sat',2,'Tutorial — DBMS',                       @ce502_faculty,'Room 302','10:00','11:00');

-- ─── 7. Contact Form Submissions (demo) ───────────────────────────────────────
INSERT INTO contact_submissions (name, email, phone, subject, message, ip_address, is_read)
VALUES
  ('Ramesh Verma', 'ramesh.verma.jbp@gmail.com', '9425112233',
   'UG Admission Enquiry 2025-26',
   'I am a JEE Main qualified candidate (Rank 45000) from Jabalpur. I want to know if I can get Computer Engineering at SGSITS. What is the closing rank for CE in previous years? Do you have hostel facility for boys?',
   '103.22.45.67', 0),
  ('Priya Nair', 'priya.nair.kochi@gmail.com', '9876543210',
   'M.Tech. Admission — CS',
   'I have GATE CS score 650 and want to apply for M.Tech. at SGSITS. What is the intake and GATE cutoff for M.Tech. CSE? Are GATE qualified students entitled to stipend?',
   '117.239.28.54', 0),
  ('Ankit Sharma', 'ankit.sharma23@gmail.com', '9111222333',
   'Placement Statistics Request',
   'I am a parent of a B.E. student at SGSITS. Can you share the detailed placement data for the 2024-25 batch by branch? I am trying to compare with other institutes for my son''s branch choice.',
   '49.204.67.112', 1),
  ('Suresh Malhotra', 'hr.sgt@zensar.com', '9922334455',
   'Campus Recruitment Partnership',
   'I represent Zensar Technologies HR team. We are looking to participate in campus recruitment at SGSITS this year for B.E. CS/IT final year students. Please share the placement calendar and contact details of the placement officer.',
   '103.47.156.23', 0)
ON DUPLICATE KEY UPDATE is_read=VALUES(is_read);

SET foreign_key_checks = 1;
