-- Seed navigation tree into CMS
USE college_website;

INSERT INTO cms_sections (section_key, data) VALUES (
  'navigation.nav_tree',
  JSON_ARRAY(
    JSON_OBJECT('label','Home','path','/'),
    JSON_OBJECT('label','About Us','children',JSON_ARRAY(
      JSON_OBJECT('label','About Institute','path','/about/institute'),
      JSON_OBJECT('label','Vision & Mission','path','/about/vision-mission'),
      JSON_OBJECT('label','Director Message','path','/about/director-message'),
      JSON_OBJECT('label','Governing Body','path','/about/governing-body'),
      JSON_OBJECT('label','Administration','path','/about/administration'),
      JSON_OBJECT('label','Administrative Committees','path','/about/committees'),
      JSON_OBJECT('label','Telephone Directory','path','/about/telephone-directory'),
      JSON_OBJECT('label','Infrastructure','path','/about/infrastructure'),
      JSON_OBJECT('label','IQAC Cell','path','/about/iqac'),
      JSON_OBJECT('label','Academic Council','path','/about/academic-council'),
      JSON_OBJECT('label','Accreditation NBA/NAAC','path','/about/accreditation')
    )),
    JSON_OBJECT('label','Academics','children',JSON_ARRAY(
      JSON_OBJECT('label','Academic Calendar','path','/academics/calendar'),
      JSON_OBJECT('label','UG Courses','path','/academics/courses/ug'),
      JSON_OBJECT('label','PG Courses','path','/academics/courses/pg'),
      JSON_OBJECT('label','Ph.D. Programs','path','/academics/courses/phd'),
      JSON_OBJECT('label','PTDC Courses','path','/academics/courses/ptdc'),
      JSON_OBJECT('label','Online Courses MOOC','path','/academics/courses/online'),
      JSON_OBJECT('label','Exam & Results','path','/academics/exam-results'),
      JSON_OBJECT('label','OBE & NEP 2020','path','/academics/obe-nep-2020')
    )),
    JSON_OBJECT('label','Departments','children',JSON_ARRAY(
      JSON_OBJECT('label','All Departments','path','/departments'),
      JSON_OBJECT('label','Civil Engineering','path','/departments/civil-engineering'),
      JSON_OBJECT('label','Computer Engineering','path','/departments/computer-engineering'),
      JSON_OBJECT('label','Electrical Engineering','path','/departments/electrical-engineering'),
      JSON_OBJECT('label','Electronics & Telecomm','path','/departments/electronics-telecommunication'),
      JSON_OBJECT('label','Information Technology','path','/departments/information-technology'),
      JSON_OBJECT('label','Mechanical Engineering','path','/departments/mechanical-engineering'),
      JSON_OBJECT('label','Applied Sciences & Humanities','path','/departments/applied-sciences-humanities'),
      JSON_OBJECT('label','MCA','path','/departments/master-computer-applications'),
      JSON_OBJECT('label','MBA','path','/departments/master-business-administration')
    )),
    JSON_OBJECT('label','Admissions','children',JSON_ARRAY(
      JSON_OBJECT('label','UG Admissions','path','/admission/ug'),
      JSON_OBJECT('label','PG Admissions','path','/admission/pg'),
      JSON_OBJECT('label','PhD Admissions','path','/admission/phd'),
      JSON_OBJECT('label','Prospectus','path','/admission/prospectus')
    )),
    JSON_OBJECT('label','Placements','children',JSON_ARRAY(
      JSON_OBJECT('label','T&P Cell Overview','path','/placement/tnp-cell'),
      JSON_OBJECT('label','Leading Recruiters','path','/placement/companies'),
      JSON_OBJECT('label','Placement Record','path','/placement/record'),
      JSON_OBJECT('label','Placement Contacts','path','/placement/contact')
    )),
    JSON_OBJECT('id','campus-life','label','Campus Life','children',JSON_ARRAY(
      JSON_OBJECT('label','Student Activities','path','/students/activities'),
      JSON_OBJECT('label','Govt. Scholarships','path','/students/scholarship/govt'),
      JSON_OBJECT('label','Institute Scholarships','path','/students/scholarship/institute'),
      JSON_OBJECT('label','Sports & Games','path','/students/sss'),
      JSON_OBJECT('label','NCC Wing','path','/students/ncc'),
      JSON_OBJECT('label','NSS Wing','path','/students/nss')
    )),
    JSON_OBJECT('label','Facilities','children',JSON_ARRAY(
      JSON_OBJECT('label','Computer Center','path','/facilities/computer-center'),
      JSON_OBJECT('label','Central Library','path','/facilities/library'),
      JSON_OBJECT('label','Gymnasium','path','/facilities/gymnasium'),
      JSON_OBJECT('label','Dispensary','path','/facilities/dispensary'),
      JSON_OBJECT('label','Boys Hostel','path','/facilities/hostel/boys'),
      JSON_OBJECT('label','Girls Hostel','path','/facilities/hostel/girls'),
      JSON_OBJECT('label','AICTE IDEA Lab','path','/facilities/idea-lab')
    )),
    JSON_OBJECT('label','More','children',JSON_ARRAY(
      JSON_OBJECT('label','Latest Notices','path','/notices'),
      JSON_OBJECT('label','Campus News','path','/news'),
      JSON_OBJECT('label','Upcoming Events','path','/events'),
      JSON_OBJECT('label','Tenders','path','/tenders'),
      JSON_OBJECT('label','Contact Us','path','/contact')
    ))
  )
)
ON DUPLICATE KEY UPDATE data = VALUES(data);

SELECT 'Navigation tree seeded.' AS status;
