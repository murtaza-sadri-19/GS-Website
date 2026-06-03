-- =============================================================================
-- ENTERPRISE SEED — Part 06: Exam — Sessions, Courses, Sections, Subjects,
--                             Students, Faculty-Subject mapping, COs, Marks
-- Run AFTER: seed_enterprise_03_faculty.sql
-- =============================================================================
USE SGSITS_DB;

SET NAMES utf8mb4;
SET foreign_key_checks = 0;

-- ─── 1. Exam Sessions ────────────────────────────────────────────────────────
INSERT INTO exam_sessions (start_month, start_year, end_month, end_year, is_active)
VALUES
  (7, 2024, 11, 2024, 0),
  (1, 2025, 5,      2025, 0),
  (7, 2025, 11, 2025, 1)
ON DUPLICATE KEY UPDATE is_active=VALUES(is_active);

-- ─── 2. Exam Courses ──────────────────────────────────────────────────────────
INSERT INTO exam_courses (course_code, course_name, specialization, department_id)
VALUES
  ('BE-CE',  'Bachelor of Engineering', 'Computer Engineering',
   (SELECT id FROM departments WHERE slug='computer-engineering')),
  ('BE-IT',  'Bachelor of Engineering', 'Information Technology',
   (SELECT id FROM departments WHERE slug='information-technology')),
  ('BE-ME',  'Bachelor of Engineering', 'Mechanical Engineering',
   (SELECT id FROM departments WHERE slug='mechanical-engineering')),
  ('BE-CVL', 'Bachelor of Engineering', 'Civil Engineering',
   (SELECT id FROM departments WHERE slug='civil-engineering')),
  ('BE-EE',  'Bachelor of Engineering', 'Electrical Engineering',
   (SELECT id FROM departments WHERE slug='electrical-engineering')),
  ('BE-EC',  'Bachelor of Engineering', 'Electronics & Telecommunication Engineering',
   (SELECT id FROM departments WHERE slug='electronics-telecommunication')),
  ('MCA',    'Master of Computer Applications', 'MCA',
   (SELECT id FROM departments WHERE slug='master-computer-applications')),
  ('MBA',    'Master of Business Administration', 'MBA',
   (SELECT id FROM departments WHERE slug='master-business-administration')),
  ('ME-CSE', 'Master of Technology', 'Computer Science & Engineering',
   (SELECT id FROM departments WHERE slug='computer-engineering'))
ON DUPLICATE KEY UPDATE course_name=VALUES(course_name);

-- ─── 3. Exam Sections ────────────────────────────────────────────────────────
INSERT INTO exam_sections (department_id, course_id, section_name)
VALUES
  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-CE'), 'A'),
  ((SELECT id FROM departments WHERE slug='computer-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-CE'), 'B'),
  ((SELECT id FROM departments WHERE slug='information-technology'),
   (SELECT id FROM exam_courses WHERE course_code='BE-IT'), 'A'),
  ((SELECT id FROM departments WHERE slug='information-technology'),
   (SELECT id FROM exam_courses WHERE course_code='BE-IT'), 'B'),
  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-ME'), 'A'),
  ((SELECT id FROM departments WHERE slug='mechanical-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-ME'), 'B'),
  ((SELECT id FROM departments WHERE slug='civil-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-CVL'), 'A'),
  ((SELECT id FROM departments WHERE slug='electrical-engineering'),
   (SELECT id FROM exam_courses WHERE course_code='BE-EE'), 'A'),
  ((SELECT id FROM departments WHERE slug='electronics-telecommunication'),
   (SELECT id FROM exam_courses WHERE course_code='BE-EC'), 'A')
ON DUPLICATE KEY UPDATE section_name=VALUES(section_name);

-- ─── 4. Exam Subjects — BE CE Semester 5 (Active session) ────────────────────
SET @sess = (SELECT id FROM exam_sessions WHERE start_month=7 AND start_year=2025);
SET @ce   = (SELECT id FROM exam_courses WHERE course_code='BE-CE');
SET @it   = (SELECT id FROM exam_courses WHERE course_code='BE-IT');
SET @me   = (SELECT id FROM exam_courses WHERE course_code='BE-ME');
SET @ce_dept = (SELECT id FROM departments WHERE slug='computer-engineering');
SET @it_dept = (SELECT id FROM departments WHERE slug='information-technology');
SET @me_dept = (SELECT id FROM departments WHERE slug='mechanical-engineering');

INSERT INTO exam_subjects
  (session_id, subject_code, subject_name, subject_type, semester, department_id, course_id)
VALUES
  -- CE Sem 5
  (@sess, 'CE501', 'Design & Analysis of Algorithms',  'Regular', 5, @ce_dept, @ce),
  (@sess, 'CE502', 'Database Management Systems',       'Regular', 5, @ce_dept, @ce),
  (@sess, 'CE503', 'Operating Systems',                 'Regular', 5, @ce_dept, @ce),
  (@sess, 'CE504', 'Computer Networks',                 'Regular', 5, @ce_dept, @ce),
  (@sess, 'CE505', 'Theory of Computation',             'Regular', 5, @ce_dept, @ce),
  (@sess, 'CE506', 'Artificial Intelligence',           'Elective', 5, @ce_dept, @ce),
  -- IT Sem 5
  (@sess, 'IT501', 'Software Engineering',              'Regular', 5, @it_dept, @it),
  (@sess, 'IT502', 'Database Management Systems',       'Regular', 5, @it_dept, @it),
  (@sess, 'IT503', 'Computer Networks',                 'Regular', 5, @it_dept, @it),
  (@sess, 'IT504', 'Operating Systems',                 'Regular', 5, @it_dept, @it),
  (@sess, 'IT505', 'Python Programming',                'Regular', 5, @it_dept, @it),
  (@sess, 'IT506', 'Web Technologies',                  'Elective', 5, @it_dept, @it),
  -- ME Sem 5
  (@sess, 'ME501', 'Heat Transfer',                     'Regular', 5, @me_dept, @me),
  (@sess, 'ME502', 'Machine Design',                    'Regular', 5, @me_dept, @me),
  (@sess, 'ME503', 'Manufacturing Technology II',       'Regular', 5, @me_dept, @me),
  (@sess, 'ME504', 'Industrial Engineering',            'Regular', 5, @me_dept, @me),
  (@sess, 'ME505', 'Fluid Machinery',                   'Regular', 5, @me_dept, @me),
  (@sess, 'ME506', 'Automotive Engineering',            'Elective', 5, @me_dept, @me)
ON DUPLICATE KEY UPDATE subject_name=VALUES(subject_name);

-- ─── 5. Faculty-Subject Assignments ──────────────────────────────────────────
SET @sec_ce_a = (SELECT id FROM exam_sections
  WHERE department_id=@ce_dept AND course_id=@ce AND section_name='A');
SET @sec_it_a = (SELECT id FROM exam_sections
  WHERE department_id=@it_dept AND course_id=@it AND section_name='A');
SET @sec_me_a = (SELECT id FROM exam_sections
  WHERE department_id=@me_dept AND course_id=@me AND section_name='A');

INSERT INTO exam_faculty_subjects
  (session_id, subject_id, faculty_user_id, assignment_type, section_id)
VALUES
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'primary', @sec_ce_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),
   (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'), 'primary', @sec_ce_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE503'),
   (SELECT id FROM users WHERE email='amit.soni@sgsits.ac.in'), 'primary', @sec_ce_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE504'),
   (SELECT id FROM users WHERE email='seema.rathore@sgsits.ac.in'), 'primary', @sec_ce_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE505'),
   (SELECT id FROM users WHERE email='vivek.sharma.ce@sgsits.ac.in'), 'primary', @sec_ce_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE506'),
   (SELECT id FROM users WHERE email='nisha.thakur@sgsits.ac.in'), 'primary', @sec_ce_a),

  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT501'),
   (SELECT id FROM users WHERE email='hod.it@sgsits.ac.in'), 'primary', @sec_it_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT502'),
   (SELECT id FROM users WHERE email='manish.dubey@sgsits.ac.in'), 'primary', @sec_it_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT503'),
   (SELECT id FROM users WHERE email='manish.dubey@sgsits.ac.in'), 'primary', @sec_it_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT504'),
   (SELECT id FROM users WHERE email='rajesh.verma.it@sgsits.ac.in'), 'primary', @sec_it_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT505'),
   (SELECT id FROM users WHERE email='pooja.chouhan@sgsits.ac.in'), 'primary', @sec_it_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='IT506'),
   (SELECT id FROM users WHERE email='rajesh.verma.it@sgsits.ac.in'), 'primary', @sec_it_a),

  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME501'),
   (SELECT id FROM users WHERE email='hod.me@sgsits.ac.in'), 'primary', @sec_me_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME502'),
   (SELECT id FROM users WHERE email='anil.agrawal@sgsits.ac.in'), 'primary', @sec_me_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME503'),
   (SELECT id FROM users WHERE email='rakesh.chouksey@sgsits.ac.in'), 'primary', @sec_me_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME504'),
   (SELECT id FROM users WHERE email='sanjay.patidar@sgsits.ac.in'), 'primary', @sec_me_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME505'),
   (SELECT id FROM users WHERE email='neha.joshi.me@sgsits.ac.in'), 'primary', @sec_me_a),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='ME506'),
   (SELECT id FROM users WHERE email='devendra.mandloi@sgsits.ac.in'), 'primary', @sec_me_a)
ON DUPLICATE KEY UPDATE assignment_type=VALUES(assignment_type);

-- ─── 6. Course Outcomes (CE501 example — full CO set) ────────────────────────
INSERT INTO exam_course_outcomes
  (session_id, subject_id, faculty_user_id, co_name)
VALUES
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'CO1'),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'CO2'),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'CO3'),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   (SELECT id FROM users WHERE email='hod.ce@sgsits.ac.in'), 'CO4'),

  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),
   (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'), 'CO1'),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),
   (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'), 'CO2'),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE502'),
   (SELECT id FROM users WHERE email='kiran.patel.ce@sgsits.ac.in'), 'CO3')
ON DUPLICATE KEY UPDATE co_name=VALUES(co_name);

-- ─── 7. Test Details (CE501) ─────────────────────────────────────────────────
INSERT INTO exam_test_details
  (session_id, subject_id, component_name, sub_component_name, co_name, max_marks)
VALUES
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   'MST1', 'Q1', 'CO1', 10),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   'MST1', 'Q2', 'CO2', 10),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   'MST2', 'Q1', 'CO3', 10),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   'MST2', 'Q2', 'CO4', 10),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   'Assignment', 'A1', 'CO1', 5),
  (@sess, (SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),
   'Assignment', 'A2', 'CO2', 5)
ON DUPLICATE KEY UPDATE max_marks=VALUES(max_marks);

-- ─── 8. Students — CE Sem 5 Section A ────────────────────────────────────────
INSERT INTO exam_students
  (session_id, enrollment_no, student_name, department_id, course_id, section_id, semester, status)
VALUES
  (@sess,'0801CE211001','Aarav Sharma',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211002','Abhishek Gupta',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211003','Aditya Kumar',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211004','Akanksha Patel',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211005','Akash Verma',        @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211006','Amit Yadav',         @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211007','Amrita Singh',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211008','Ananya Chouhan',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211009','Ankur Malviya',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211010','Anshika Tiwari',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211011','Arjun Mishra',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211012','Arnav Dubey',        @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211013','Ayushi Jain',        @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211014','Bhavna Rathore',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211015','Chirag Soni',        @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211016','Deepak Agrawal',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211017','Divya Sharma',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211018','Gaurav Chouksey',    @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211019','Harshita Pandey',    @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211020','Hemant Bhatt',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211021','Ishaan Patidar',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211022','Janhvi Kumari',      @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211023','Kabir Nair',         @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211024','Kavya Sharma',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211025','Lakshman Rao',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211026','Manav Mehta',        @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211027','Manya Joshi',        @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211028','Mohit Rajput',       @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211029','Nandini Shukla',     @ce_dept,@ce,@sec_ce_a,5,'regular'),
  (@sess,'0801CE211030','Navneet Singh',      @ce_dept,@ce,@sec_ce_a,5,'regular')
ON DUPLICATE KEY UPDATE student_name=VALUES(student_name);

-- ─── 9. Sample Marks — CE501 MST1 Q1 (all 30 students) ──────────────────────
INSERT INTO exam_marks
  (session_id, enrollment_no, subject_id, component_name, sub_component_name, co_name, marks_obtained, status)
VALUES
  (@sess,'0801CE211001',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211002',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211003',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',9,'submitted'),
  (@sess,'0801CE211004',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',6,'submitted'),
  (@sess,'0801CE211005',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211006',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',5,'submitted'),
  (@sess,'0801CE211007',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',9,'submitted'),
  (@sess,'0801CE211008',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211009',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',6,'submitted'),
  (@sess,'0801CE211010',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211011',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',10,'submitted'),
  (@sess,'0801CE211012',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211013',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211014',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',4,'submitted'),
  (@sess,'0801CE211015',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',9,'submitted'),
  (@sess,'0801CE211016',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211017',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211018',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',6,'submitted'),
  (@sess,'0801CE211019',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',9,'submitted'),
  (@sess,'0801CE211020',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',5,'submitted'),
  (@sess,'0801CE211021',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211022',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211023',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',9,'submitted'),
  (@sess,'0801CE211024',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211025',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',6,'submitted'),
  (@sess,'0801CE211026',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211027',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',10,'submitted'),
  (@sess,'0801CE211028',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',7,'submitted'),
  (@sess,'0801CE211029',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',8,'submitted'),
  (@sess,'0801CE211030',(SELECT id FROM exam_subjects WHERE session_id=@sess AND subject_code='CE501'),'MST1','Q1','CO1',6,'submitted')
ON DUPLICATE KEY UPDATE marks_obtained=VALUES(marks_obtained), status=VALUES(status);

-- ─── 10. Exam Documents ───────────────────────────────────────────────────────
INSERT INTO exam_documents
  (title, document_type, file_id, uploaded_by, status)
VALUES
  ('Date Sheet — End Semester Exam December 2025', 'TIMETABLE',
   (SELECT id FROM files WHERE stored_name='seed_exam_circular_dec2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'), 'ACTIVE'),
  ('Result — End Semester Exam May 2025', 'RESULT',
   (SELECT id FROM files WHERE stored_name='seed_result_may2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'), 'ACTIVE'),
  ('Academic Calendar 2025–26', 'ACADEMIC_CALENDAR',
   (SELECT id FROM files WHERE stored_name='seed_academic_calendar_2526.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'), 'ACTIVE'),
  ('Exam Notice — Admit Card December 2025', 'NOTICE',
   (SELECT id FROM files WHERE stored_name='seed_admit_card_dec2025.pdf' LIMIT 1),
   (SELECT id FROM users WHERE email='examcontroller@sgsits.ac.in'), 'ACTIVE')
ON DUPLICATE KEY UPDATE status=VALUES(status);

SET foreign_key_checks = 1;
