import type { CommitteeData } from './types'

export const defaultCommittees: CommitteeData[] = [
  {
    name: 'Academic Council',
    desc: 'Oversees academic policies, curriculum design, and examination standards.',
    members: '30+',
    membersList: [
      { role: 'Chairman', name: 'Director, SGSITS' },
      { role: 'Member Secretary', name: 'Dean (Academics)' },
      { role: 'Member', name: 'Deputy Director' },
      { role: 'Member', name: 'Dean (R&D)' },
      { role: 'Member', name: 'All Heads of Departments' },
      { role: 'Member', name: 'Controller of Examinations' },
      { role: 'Member', name: 'Registrar' },
      { role: 'Member', name: 'Dr. Smita Verma', dept: 'Applied Mathematics' },
      { role: 'Member', name: 'Dr. Urjita Thakar', dept: 'Computer Engineering' },
      { role: 'Member', name: 'Three Senior Professors (Nominated)' }
    ]
  },
  {
    name: 'Board of Governors',
    desc: 'Strategic governance and major institutional decisions.',
    members: '11',
    membersList: [
      { role: 'Chairman', name: 'Nominee of Govt. of Madhya Pradesh' },
      { role: 'Member Secretary', name: 'Director, SGSITS Indore' },
      { role: 'Member', name: 'Nominee of RGPV, Bhopal' },
      { role: 'Member', name: 'Nominee of DAVV, Indore' },
      { role: 'Member', name: 'Nominee of AICTE, New Delhi' },
      { role: 'Member', name: 'Nominee of DTE, Madhya Pradesh' },
      { role: 'Member', name: 'Industry Representative – I' },
      { role: 'Member', name: 'Industry Representative – II' },
      { role: 'Member', name: 'Senior Professor – I' },
      { role: 'Member', name: 'Senior Professor – II' }
    ]
  },
  {
    name: 'IQAC (Internal Quality Assurance Cell)',
    desc: 'Quality enhancement, academic audits, and best practices.',
    members: '15',
    membersList: [
      { role: 'Chairperson', name: 'Director, SGSITS' },
      { role: 'Coordinator', name: 'Dr. Smita Verma', dept: 'Applied Mathematics' },
      { role: 'Member (Teacher)', name: 'Dr. Nitish Gupta', dept: 'Applied Chemistry' },
      { role: 'Member (Teacher)', name: 'Dr. Urjita Thakar', dept: 'Computer Engineering' },
      { role: 'Member (Teacher)', name: 'Dr. R.K. Khare', dept: 'Civil Engineering' },
      { role: 'Member (Admin)', name: 'Registrar, SGSITS' },
      { role: 'Member (Industry)', name: 'Mr. Alok Sethi', dept: 'Tata Consultancy Services' },
      { role: 'Member (Alumni)', name: 'Er. Sanjay Sharma', dept: 'Alumni Association' }
    ]
  },
  {
    name: 'Anti-Ragging Committee',
    desc: 'Ensures a ragging-free campus environment and addresses complaints.',
    members: '12',
    membersList: [
      { role: 'Chairman', name: 'Director, SGSITS' },
      { role: 'Member (Faculty)', name: 'Prof. S.K. Jain', dept: 'Applied Physics' },
      { role: 'Member (Faculty)', name: 'Dr. Sunita Varma', dept: 'CTA' },
      { role: 'Member (Warden)', name: 'Boys Hostel Warden' },
      { role: 'Member (Warden)', name: 'Girls Hostel Warden' },
      { role: 'Member (Civil Admin)', name: 'Sub-Divisional Magistrate, Indore' },
      { role: 'Member (Police)', name: 'Station House Officer, MG Road Police Station' },
      { role: 'Student Representative', name: 'Rahul Sharma', dept: 'B.Tech IV Year' },
      { role: 'Student Representative', name: 'Ananya Vyas', dept: 'B.Tech II Year' }
    ]
  },
  {
    name: 'ICC (Internal Complaint Committee)',
    desc: 'Addresses complaints related to sexual harassment and workplace safety.',
    members: '8',
    membersList: [
      { role: 'Presiding Officer', name: 'Dr. Urjita Thakar', dept: 'Computer Engineering' },
      { role: 'Member (Faculty)', name: 'Ms. Vibha Bhatnagar', dept: 'Biomedical Engg' },
      { role: 'Member (Faculty)', name: 'Dr. Sunita Varma', dept: 'CTA' },
      { role: 'Member (Staff)', name: 'Smt. Rekha Tiwari', dept: 'Establishment Section' },
      { role: 'Member (NGO)', name: 'Mrs. Shobha Shah', dept: 'Social Welfare Society' },
      { role: 'Student Representative (PG)', name: 'Megha Patidar', dept: 'M.Tech II Year' }
    ]
  },
  {
    name: 'Institute Discipline Committee',
    desc: 'Maintains discipline and handles violations of the code of conduct.',
    members: '10',
    membersList: [
      { role: 'Chairman', name: 'Dean (Student Welfare)' },
      { role: 'Co-Chairman', name: 'Dr. R.K. Khare', dept: 'Civil Engineering' },
      { role: 'Member (Faculty)', name: 'Dr. Satish Jain', dept: 'Electronics & Telecomm' },
      { role: 'Member (Faculty)', name: 'Dr. H.K. Verma', dept: 'Electrical Engineering' },
      { role: 'Member (Warden)', name: 'Chief Warden (Boys)' },
      { role: 'Member (Warden)', name: 'Chief Warden (Girls)' }
    ]
  },
  {
    name: 'Examination Committee',
    desc: 'Manages examination schedules, question paper moderation, and result processing.',
    members: '12',
    membersList: [
      { role: 'Chairman', name: 'Director, SGSITS' },
      { role: 'Controller', name: 'Prof. S.K. Jain', dept: 'Exam Office' },
      { role: 'Member (Faculty)', name: 'Dr. R.C. Gurjar', dept: 'Electronics & Instru' },
      { role: 'Member (Faculty)', name: 'Dr. Nitish Gupta', dept: 'Applied Chemistry' },
      { role: 'Member (Faculty)', name: 'Dr. Vineet Singh', dept: 'Pharmacy' }
    ]
  },
  {
    name: 'Library Committee',
    desc: 'Acquisition of books and journals, digital resource management.',
    members: '8',
    membersList: [
      { role: 'Chairman', name: 'Dean (Academics)' },
      { role: 'Member Secretary', name: 'Librarian, SGSITS' },
      { role: 'Member (Faculty)', name: 'Dr. Joseph Thomas Andrews', dept: 'Applied Physics' },
      { role: 'Member (Faculty)', name: 'Dr. Girish Thakar', dept: 'Industrial & Prod' },
      { role: 'Member (Faculty)', name: 'Dr. K.K. Sharma', dept: 'Information Tech' }
    ]
  },
  {
    name: 'Sports Committee',
    desc: 'Organization of sports events, inter-college tournaments, and athletics.',
    members: '6',
    membersList: [
      { role: 'Chairman', name: 'Dean (Student Welfare)' },
      { role: 'Secretary', name: 'Director of Physical Education' },
      { role: 'Member (Faculty)', name: 'Dr. R.C. Gupta', dept: 'MBA' },
      { role: 'Member (Faculty)', name: 'Dr. B.R. Rawal', dept: 'Mechanical Engineering' }
    ]
  },
  {
    name: 'Student Grievance Redressal',
    desc: 'Addresses academic and administrative grievances of students.',
    members: '8',
    membersList: [
      { role: 'Chairman', name: 'Director, SGSITS' },
      { role: 'Ombudsman', name: 'Retired High Court Judge (External)' },
      { role: 'Member (Faculty)', name: 'Dean (Student Welfare)' },
      { role: 'Member (Faculty)', name: 'Dr. Urjita Thakar', dept: 'Computer Engineering' },
      { role: 'Special Invitee (Student)', name: 'Student Council President' }
    ]
  },
  {
    name: 'Website Committee',
    desc: 'Management and updation of the institute website and digital presence.',
    members: '5',
    membersList: [
      { role: 'Coordinator', name: 'Dr. K.K. Sharma', dept: 'Information Tech' },
      { role: 'Member (Faculty)', name: 'Dr. Nitish Gupta', dept: 'Applied Chemistry' },
      { role: 'System Analyst', name: 'Shri G.S. Solanki', dept: 'Computer Center' },
      { role: 'Web Developer', name: 'Shri Amit Kumar', dept: 'Information Tech' }
    ]
  },
  {
    name: 'Training & Placement Committee',
    desc: 'Coordinates campus placements, internships, and industry interactions.',
    members: '10',
    membersList: [
      { role: 'Chairman', name: 'Director, SGSITS' },
      { role: 'T&P Officer', name: 'Dr. Devendra S. Mehta', dept: 'T&P Cell' },
      { role: 'Faculty Coordinator', name: 'Dr. Girish Thakar', dept: 'Industrial & Prod' },
      { role: 'Faculty Coordinator', name: 'Dr. Urjita Thakar', dept: 'Computer Engineering' },
      { role: 'Faculty Coordinator', name: 'Dr. K.K. Sharma', dept: 'Information Tech' }
    ]
  }
]

export default defaultCommittees
