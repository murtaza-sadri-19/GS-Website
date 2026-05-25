/**
 * MOCK: About Pages Content
 * Replace with: GET /api/about/*
 *
 * Consumed ONLY through src/services/aboutService.ts
 */

// ─── Vision & Mission ────────────────────────────────────────────────────────

export interface MissionPoint {
  num: string
  text: string
}

export interface VisionMissionData {
  visionEnglish: string
  visionHindi: string
  missionPoints: MissionPoint[]
}

export const mockVisionMission: VisionMissionData = {
  visionEnglish:
    '"To be a centre of excellence in education, research and innovation, creating competent professionals with ethical values who contribute to the development of society and the nation."',
  visionHindi:
    '"शिक्षा, अनुसंधान और नवाचार में उत्कृष्टता का केंद्र बनना, नैतिक मूल्यों के साथ सक्षम पेशेवरों का निर्माण करना जो समाज और राष्ट्र के विकास में योगदान दें।"',
  missionPoints: [
    { num: '1', text: 'Provide high-quality technical education through a meticulously designed curriculum, advanced outcome-based teaching-learning methodologies, and state-of-the-art laboratory infrastructure.' },
    { num: '2', text: 'Foster a vibrant ecosystem for high-impact research, pioneering innovation, and student-led entrepreneurship in collaboration with global scientific institutions.' },
    { num: '3', text: 'Cultivate strong industry-academia synergies to drive technology transfer, consultancies, industrial internships, and exceptional student placement programs.' },
    { num: '4', text: 'Inculcate deep-seated ethical values, professional integrity, a sense of social responsibility, and future-ready leadership capabilities.' },
    { num: '5', text: 'Encourage comprehensive and holistic development through outstanding sports facilities, cultural forums, and active community outreach initiatives.' },
  ],
}

// ─── Governing Body ──────────────────────────────────────────────────────────

export type GovBodyCategory = 'Government' | 'University' | 'Industry' | 'Regulatory' | 'Faculty' | 'Institute'

export interface GoverningBodyMember {
  role: string
  name: string
  category: GovBodyCategory
}

export interface GoverningBodyData {
  description: string
  members: GoverningBodyMember[]
}

export const mockGoverningBody: GoverningBodyData = {
  description:
    'The Governing Body is the highest decision-making authority of the institute. It comprises representatives from the government, affiliated universities, regulatory bodies, industry, and the institute faculty. The body provides strategic direction and oversees the overall administration and academic affairs.',
  members: [
    { role: 'Chairman',             name: 'Nominee of Govt. of Madhya Pradesh',  category: 'Government' },
    { role: 'Member Secretary',     name: 'Director, SGSITS Indore',             category: 'Institute' },
    { role: 'Member',               name: 'Nominee of RGPV, Bhopal',             category: 'University' },
    { role: 'Member',               name: 'Nominee of DAVV, Indore',             category: 'University' },
    { role: 'Member',               name: 'Nominee of AICTE, New Delhi',         category: 'Regulatory' },
    { role: 'Member',               name: 'Nominee of DTE, Madhya Pradesh',      category: 'Government' },
    { role: 'Member',               name: 'Industry Representative – I',          category: 'Industry' },
    { role: 'Member',               name: 'Industry Representative – II',         category: 'Industry' },
    { role: 'Member',               name: 'Senior Professor – I',                 category: 'Faculty' },
    { role: 'Member',               name: 'Senior Professor – II',                category: 'Faculty' },
    { role: 'Member',               name: 'Registrar, SGSITS (Ex-Officio)',       category: 'Institute' },
  ],
}

// ─── Administration ───────────────────────────────────────────────────────────

export interface AdminOfficial {
  title: string
  name: string
  email: string
  phone: string
}

export const mockAdministration: AdminOfficial[] = [
  { title: 'Director',                  name: 'Prof. (Dr.) Rakesh Kumar Bajaj', email: 'director@sgsits.ac.in',        phone: '0731-2582100' },
  { title: 'Deputy Director',           name: 'Prof. S.K. Jain',               email: 'deputydirector@sgsits.ac.in',  phone: '0731-2582102' },
  { title: 'Dean (Academics)',           name: 'Prof. R.K. Pandit',             email: 'deanacademics@sgsits.ac.in',   phone: '0731-2582103' },
  { title: 'Dean (Student Welfare)',     name: 'Prof. M.L. Sharma',             email: 'deansw@sgsits.ac.in',          phone: '0731-2582104' },
  { title: 'Dean (R&D)',                 name: 'Prof. A.K. Tripathi',           email: 'deanrd@sgsits.ac.in',          phone: '0731-2582105' },
  { title: 'Registrar',                  name: 'Shri P.K. Verma',              email: 'registrar@sgsits.ac.in',       phone: '0731-2582124' },
  { title: 'Controller of Examinations', name: 'Prof. V.K. Gupta',             email: 'coe@sgsits.ac.in',             phone: '0731-2582106' },
  { title: 'Chief Warden',               name: 'Prof. N.K. Joshi',             email: 'chiefwarden@sgsits.ac.in',     phone: '0731-2582800' },
  { title: 'Head Librarian',             name: 'Dr. S.P. Singh',               email: 'library@sgsits.ac.in',         phone: '0731-2582700' },
  { title: 'Estate Officer',             name: 'Shri R.S. Patel',              email: 'estate@sgsits.ac.in',          phone: '0731-2582110' },
]

// ─── Telephone Directory ──────────────────────────────────────────────────────

export interface TelephoneEntry {
  department: string
  name: string
  phone: string
  ext: string
}

export const mockTelephoneDirectory: TelephoneEntry[] = [
  { department: 'Director Office',               name: 'Director',        phone: '0731-2582100', ext: '100' },
  { department: 'Registrar Office',              name: 'Registrar',       phone: '0731-2582124', ext: '124' },
  { department: 'Dean Academics',                name: 'Dean (Academics)',phone: '0731-2582103', ext: '103' },
  { department: 'Dean Student Welfare',          name: 'Dean (SW)',       phone: '0731-2582104', ext: '104' },
  { department: 'Computer Engineering',          name: 'HOD',             phone: '0731-2582401', ext: '401' },
  { department: 'Civil Engineering',             name: 'HOD',             phone: '0731-2582301', ext: '301' },
  { department: 'Electrical Engineering',        name: 'HOD',             phone: '0731-2582201', ext: '201' },
  { department: 'Mechanical Engineering',        name: 'HOD',             phone: '0731-2582501', ext: '501' },
  { department: 'Electronics & Telecomm',        name: 'HOD',             phone: '0731-2582601', ext: '601' },
  { department: 'Electronics & Instrumentation', name: 'HOD',             phone: '0731-2582602', ext: '602' },
  { department: 'Information Technology',        name: 'HOD',             phone: '0731-2582403', ext: '403' },
  { department: 'Applied Mathematics',           name: 'HOD',             phone: '0731-2582701', ext: '701' },
  { department: 'Applied Physics',               name: 'HOD',             phone: '0731-2582435', ext: '435' },
  { department: 'Applied Chemistry',             name: 'HOD',             phone: '0731-2582181', ext: '181' },
  { department: 'Biomedical Engineering',        name: 'HOD',             phone: '0731-2582471', ext: '471' },
  { department: 'Industrial & Production',       name: 'HOD',             phone: '0731-2582450', ext: '450' },
  { department: 'Management Studies (MBA)',       name: 'HOD',             phone: '0731-2582801', ext: '801' },
  { department: 'Pharmacy',                      name: 'HOD',             phone: '0731-2582850', ext: '850' },
  { department: 'Humanities & Social Sciences',  name: 'HOD',             phone: '0731-2582750', ext: '750' },
  { department: 'Central Library',               name: 'Librarian',       phone: '0731-2582700', ext: '700' },
  { department: 'Computer Center',               name: 'In-charge',       phone: '0731-2582402', ext: '402' },
  { department: 'Boys Hostel',                   name: 'Warden',          phone: '0731-2582800', ext: '800' },
  { department: 'Girls Hostel',                  name: 'Warden',          phone: '0731-2582802', ext: '802' },
  { department: 'Exam Cell',                     name: 'COE',             phone: '0731-2582106', ext: '106' },
  { department: 'T&P Cell',                      name: 'TPO',             phone: '0731-2582150', ext: '150' },
]

// ─── IQAC ────────────────────────────────────────────────────────────────────

export interface IQACActivity {
  title: string
  description: string
  date: string
}

export interface IQACData {
  about: string
  vision: string
  objectives: string[]
  recentActivities: IQACActivity[]
  chairpersonName: string
  chairpersonTitle: string
  coordinatorName: string
  coordinatorTitle: string
  coordinatorEmail: string
  coordinatorPhone: string
}

export const mockIQAC: IQACData = {
  about:
    'The Internal Quality Assurance Cell (IQAC) of SGSITS was established as per the guidelines of the National Assessment and Accreditation Council (NAAC). It serves as a driving force for planning, guiding, and implementing quality-enhancing and sustaining measures to achieve academic excellence.',
  vision:
    'To develop a system for conscious, consistent and catalytic action to improve the academic and administrative performance of the institution.',
  objectives: [
    'To ensure timely, efficient and progressive performance of academic, administrative and financial tasks.',
    'To promote research and consultancy through optimization of existing infrastructure and resources.',
    'To ensure the adequacy, maintenance and proper allocation of support structure and services.',
    'To ensure timely feedback response, research and its outcome and related activities.',
    'To promote the quality culture through faculty development programmes, workshops and seminars.',
  ],
  recentActivities: [
    { title: 'NAAC Peer Team Visit',         description: 'NAAC peer team conducted a 3-day institutional review for re-accreditation. The institute was awarded A+ grade.',    date: 'November 2025' },
    { title: 'Annual Quality Report (AQAR)', description: 'Submission of the Annual Quality Assurance Report for the academic year 2024-25.',                                   date: 'October 2025'  },
    { title: 'Faculty Development Programme',description: 'Two-day FDP on OBE (Outcome-Based Education) and NEP 2020 implementation.',                                         date: 'August 2025'   },
    { title: 'Student Satisfaction Survey',  description: 'Institute-wide student satisfaction survey conducted across all departments.',                                       date: 'April 2026'    },
  ],
  chairpersonName:   'Prof. (Dr.) Rakesh Kumar Bajaj',
  chairpersonTitle:  'Director, SGSITS',
  coordinatorName:   'Prof. R.K. Pandit',
  coordinatorTitle:  'IQAC Coordinator',
  coordinatorEmail:  'iqac@sgsits.ac.in',
  coordinatorPhone:  '0731-2582103',
}

// ─── Academic Council ─────────────────────────────────────────────────────────

export interface AcademicCouncilMember {
  sno: number
  name: string
  designation: string
  category: string
}

export interface AcademicCouncilData {
  description: string
  members: AcademicCouncilMember[]
}

export const mockAcademicCouncil: AcademicCouncilData = {
  description:
    'The Academic Council is the apex academic body of the institute. It is responsible for the maintenance of standards of teaching, examination and research in the institute. It exercises such other powers and performs such other duties and functions as may be prescribed.',
  members: [
    { sno: 1,  name: 'Director, SGSITS',                designation: 'Ex-Officio Chairman',  category: 'Ex-Officio' },
    { sno: 2,  name: 'Deputy Director, SGSITS',         designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 3,  name: 'Dean (Academics), SGSITS',        designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 4,  name: 'Dean (Student Welfare), SGSITS',  designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 5,  name: 'Dean (R&D), SGSITS',              designation: 'Ex-Officio Member',    category: 'Ex-Officio' },
    { sno: 6,  name: 'All Heads of Departments',        designation: 'Ex-Officio Members',   category: 'Ex-Officio' },
    { sno: 7,  name: 'Nominee of RGPV, Bhopal',         designation: 'University Nominee',   category: 'University' },
    { sno: 8,  name: 'Nominee of DAVV, Indore',         designation: 'University Nominee',   category: 'University' },
    { sno: 9,  name: 'Industry Expert – I',              designation: 'Special Invitee',      category: 'Industry' },
    { sno: 10, name: 'Industry Expert – II',             designation: 'Special Invitee',      category: 'Industry' },
    { sno: 11, name: 'Registrar, SGSITS',               designation: 'Member Secretary',     category: 'Ex-Officio' },
  ],
}

// ─── Accreditation ────────────────────────────────────────────────────────────

export interface AccreditationRecord {
  body: string
  grade: string
  validUpto: string
  cycle?: string
  naacScore?: string
}

export interface AccreditationData {
  about: string
  records: AccreditationRecord[]
  nbaPrograms: string[]
  nirf: { year: string; rank: string; category: string }[]
}

export const mockAccreditation: AccreditationData = {
  about:
    'SGSITS Indore is accredited by the National Assessment and Accreditation Council (NAAC) and several individual B.Tech programs are accredited by the National Board of Accreditation (NBA). The institute is also ranked annually by NIRF (National Institutional Ranking Framework), Ministry of Education, Government of India.',
  records: [
    { body: 'NAAC',  grade: 'A+',                           validUpto: '2030',    cycle: '4th Cycle', naacScore: '3.42/4.00' },
    { body: 'AICTE', grade: 'Approved',                     validUpto: '2025-26', cycle: 'Annual' },
    { body: 'RGPV',  grade: 'Affiliated',                   validUpto: 'Ongoing' },
    { body: 'NBA',   grade: 'Accredited (Multiple Programs)', validUpto: '2026' },
  ],
  nbaPrograms: [
    'B.E. Computer Engineering',
    'B.E. Information Technology',
    'B.E. Electrical Engineering',
    'B.E. Mechanical Engineering',
    'B.E. Civil Engineering',
    'B.E. Electronics & Telecommunication Engineering',
  ],
  nirf: [
    { year: '2025', rank: '#1 in M.P.', category: 'Engineering' },
    { year: '2024', rank: 'Top 100',    category: 'Engineering' },
    { year: '2023', rank: 'Top 150',    category: 'Engineering' },
  ],
}

// ─── Infrastructure ───────────────────────────────────────────────────────────

export interface InfrastructureItem {
  title: string
  description: string
  stats?: { label: string; value: string }[]
}

export interface InfrastructureData {
  summary: string
  campusArea: string
  builtUpArea: string
  items: InfrastructureItem[]
  additionalFacilities: string[]
}

export const mockInfrastructure: InfrastructureData = {
  summary:
    'SGSITS spans a sprawling campus of over 51 acres in the heart of Indore, equipped with state-of-the-art infrastructure to support academic, research, and student welfare activities.',
  campusArea: '51+ Acres',
  builtUpArea: '2,20,000+ sq. ft.',
  additionalFacilities: [
    'Dispensary / Health Center',
    'Auditorium (2000 capacity)',
    'Seminar Halls',
    'Canteen & Cafeteria',
    'ATM on Campus',
    'Solar Power Plant',
    'Rainwater Harvesting',
    'CCTV Surveillance',
    'Parking Facilities',
  ],
  items: [
    { title: 'Academic Blocks',  description: '12 well-equipped academic buildings housing 200+ classrooms, lecture theatres, and departmental offices.', stats: [{ label: 'Blocks', value: '12' }, { label: 'Classrooms', value: '200+' }] },
    { title: 'Laboratories',     description: 'Over 120 modern laboratories across all engineering, science, pharmacy and management disciplines.',       stats: [{ label: 'Labs', value: '120+' }, { label: 'Computers', value: '1500+' }] },
    { title: 'Central Library',  description: 'A fully digitized central library with 1.5 lakh books, 150+ journals, NPTEL, and remote access.',         stats: [{ label: 'Books', value: '1.5 Lakh+' }, { label: 'Journals', value: '150+' }] },
    { title: 'Hostels',          description: 'Separate boys and girls hostels with 1800+ beds, 24×7 security, mess, gym, and recreational facilities.', stats: [{ label: 'Beds', value: '1800+' }, { label: 'Hostels', value: '4 Blocks' }] },
    { title: 'Sports Complex',   description: 'A world-class sports complex with cricket ground, football field, tennis, basketball, gymnasium, and pool.', stats: [{ label: 'Sports Facilities', value: '15+' }] },
    { title: 'Auditorium',       description: 'A 2000-seat main auditorium and multiple seminar halls for academic and cultural events.',                  stats: [{ label: 'Seating Capacity', value: '2000' }] },
    { title: 'Health Centre',    description: 'A 24×7 dispensary with doctors, nurses, and first-aid facilities for students and staff.',                  stats: [{ label: 'Open', value: '24×7' }] },
    { title: 'Computer Centre',  description: 'A centralized computer centre with 300+ high-performance systems with high-speed internet.',               stats: [{ label: 'Systems', value: '300+' }, { label: 'Speed', value: '1 Gbps' }] },
  ],
}

// ─── Director's Message ──────────────────────────────────────────────────────

export interface DirectorMessageData {
  directorName: string
  directorEmail: string
  directorPhone: string
  directorOffice: string
  directorPhotoUrl: string
  quote: string
  paragraphs: string[]
}

export const mockDirectorMessage: DirectorMessageData = {
  directorName: 'Prof. Neetesh Purohit',
  directorEmail: 'director@sgsits.ac.in',
  directorPhone: '0731-2582100',
  directorOffice: "Director's Suite, Main Building",
  directorPhotoUrl: '/director.jpeg',
  quote: 'We strive to cultivate an intellectual ecosystem where technological innovation blends with high ethical values to shape pioneers of engineering excellence who lead globally.',
  paragraphs: [
    'Dear Students, Colleagues, Alumni, and Partners,',
    'It is an absolute honor to welcome you to the web portal of Shri G. S. Institute of Technology & Science (SGSITS), Indore. As one of Central India\'s oldest and most prestigious engineering institutions, our legacy since 1952 is built upon a firm commitment to academic rigour, engineering excellence, and national service.',
    'Under our government-aided autonomous framework, SGSITS enjoys the academic speed to shape curriculum that matches the rapid advancements of Industry 4.0, Artificial Intelligence, and Sustainable Systems. By fully embracing the National Education Policy (NEP) 2020 and implementing thorough **Outcome-Based Education (OBE)**, we ensure our graduates are equipped with deep fundamental knowledge and practical hands-on experience.',
    'We are extremely proud of our research culture, our students\' achievements in hackathons and innovators\' groups, and our close relationships with corporate and industry giants. Our placement statistics stand as a powerful proof of our students\' potential and the trust top companies place in the brand of SGSITS.',
    'Whether you are an aspiring student, a valued alumnus, or an industrial partner, I invite you to explore our state-of-the-art facilities, connect with our world-class faculty, and join us in our journey of transforming education to build a resilient and self-reliant nation.'
  ]
}

// ─── Administrative Committees ───────────────────────────────────────────────

export interface CommitteeMember {
  role: string
  name: string
  dept?: string
}

export interface CommitteeData {
  name: string
  desc: string
  members: string
  membersList: CommitteeMember[]
}

export const mockCommittees: CommitteeData[] = [
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

