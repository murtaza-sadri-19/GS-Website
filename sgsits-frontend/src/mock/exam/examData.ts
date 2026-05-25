/**
 * MOCK: Exam Department Data
 * Consolidated from src/data/mockPortalData.ts
 * Replace with real API calls when backend is ready.
 *
 * Consumed ONLY through src/services/examService.ts
 */

// ── Sessions ──────────────────────────────────────────────────────────────────

export interface Session {
  id: string
  label: string
  start_month: number
  start_year: number
  end_month: number
  end_year: number
  is_active: boolean
}

export const mockSessions: Session[] = [
  { id: 's1', label: 'January 2026 – June 2026',  start_month: 1,  start_year: 2026, end_month: 6,  end_year: 2026, is_active: true  },
  { id: 's2', label: 'July 2025 – December 2025', start_month: 7,  start_year: 2025, end_month: 12, end_year: 2025, is_active: false },
  { id: 's3', label: 'January 2025 – June 2025',  start_month: 1,  start_year: 2025, end_month: 6,  end_year: 2025, is_active: false },
  { id: 's4', label: 'July 2024 – December 2024', start_month: 7,  start_year: 2024, end_month: 12, end_year: 2024, is_active: false },
]

export const CURRENT_SESSION = mockSessions[0]

// ── Branches ──────────────────────────────────────────────────────────────────

export interface Branch {
  id: string
  name: string
  shortName: string
  hodName: string
  facultyCount: number
}

export const mockBranches: Branch[] = [
  { id: 'CSE', name: 'Computer Science & Engineering',  shortName: 'CSE', hodName: 'Prof. A. K. Sachan',  facultyCount: 28 },
  { id: 'IT',  name: 'Information Technology',          shortName: 'IT',  hodName: 'Prof. B. L. Verma',   facultyCount: 22 },
  { id: 'ECE', name: 'Electronics & Communication Engg.', shortName: 'ECE', hodName: 'Prof. C. P. Singh', facultyCount: 25 },
  { id: 'EE',  name: 'Electrical Engineering',          shortName: 'EE',  hodName: 'Prof. D. R. Gupta',   facultyCount: 20 },
  { id: 'ME',  name: 'Mechanical Engineering',          shortName: 'ME',  hodName: 'Prof. E. S. Mishra',  facultyCount: 30 },
  { id: 'CE',  name: 'Civil Engineering',               shortName: 'CE',  hodName: 'Prof. F. K. Joshi',   facultyCount: 18 },
  { id: 'CH',  name: 'Chemical Engineering',            shortName: 'CH',  hodName: 'Prof. G. N. Sharma',  facultyCount: 15 },
  { id: 'IPE', name: 'Industrial & Production Engg.',   shortName: 'IPE', hodName: 'Prof. H. V. Patel',   facultyCount: 16 },
]

// ── Courses ───────────────────────────────────────────────────────────────────

export interface Course {
  id: string
  name: string
  branch_id: string
  specialization: string
  semesters: number
}

export const mockCourses: Course[] = [
  { id: 'CSE-BE', name: 'B.E. Computer Science & Engineering', branch_id: 'CSE', specialization: '',                    semesters: 8 },
  { id: 'CSE-ME', name: 'M.E. Computer Science & Engineering', branch_id: 'CSE', specialization: 'Software Engineering', semesters: 4 },
  { id: 'IT-BE',  name: 'B.E. Information Technology',         branch_id: 'IT',  specialization: '',                    semesters: 8 },
  { id: 'ECE-BE', name: 'B.E. Electronics & Communication',    branch_id: 'ECE', specialization: '',                    semesters: 8 },
  { id: 'EE-BE',  name: 'B.E. Electrical Engineering',         branch_id: 'EE',  specialization: '',                    semesters: 8 },
  { id: 'ME-BE',  name: 'B.E. Mechanical Engineering',         branch_id: 'ME',  specialization: '',                    semesters: 8 },
  { id: 'CE-BE',  name: 'B.E. Civil Engineering',              branch_id: 'CE',  specialization: '',                    semesters: 8 },
  { id: 'CH-BE',  name: 'B.E. Chemical Engineering',           branch_id: 'CH',  specialization: '',                    semesters: 8 },
  { id: 'PHD',    name: 'Ph.D. Research Program',              branch_id: 'CSE', specialization: '',                    semesters: 6 },
]

// ── Subjects ──────────────────────────────────────────────────────────────────

export interface Subject {
  id: string
  name: string
  type: 'Theory' | 'Practical' | 'Elective'
  semester: number
  branch_id: string
  credits: number
  facultyId?: string
  facultyName?: string
}

export const mockSubjects: Subject[] = [
  { id: 'CS301', name: 'Data Structures',         type: 'Theory',    semester: 3, branch_id: 'CSE', credits: 4, facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey' },
  { id: 'CS302', name: 'Digital Logic Design',    type: 'Theory',    semester: 3, branch_id: 'CSE', credits: 3, facultyId: 'F002', facultyName: 'Prof. Sunita Gupta' },
  { id: 'CS303', name: 'Data Structures Lab',     type: 'Practical', semester: 3, branch_id: 'CSE', credits: 2, facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey' },
  { id: 'CS401', name: 'Algorithms & Complexity', type: 'Theory',    semester: 4, branch_id: 'CSE', credits: 4, facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey' },
  { id: 'CS402', name: 'Computer Organization',   type: 'Theory',    semester: 4, branch_id: 'CSE', credits: 3, facultyId: 'F003', facultyName: 'Dr. Mahesh Patil' },
  { id: 'CS501', name: 'Operating Systems',        type: 'Theory',    semester: 5, branch_id: 'CSE', credits: 4, facultyId: 'F002', facultyName: 'Prof. Sunita Gupta' },
  { id: 'CS502', name: 'Machine Learning',         type: 'Elective',  semester: 7, branch_id: 'CSE', credits: 3, facultyId: 'F004', facultyName: 'Dr. Priya Saxena' },
  { id: 'CS503', name: 'Cloud Computing',          type: 'Elective',  semester: 7, branch_id: 'CSE', credits: 3, facultyId: 'F005', facultyName: 'Prof. Amit Shukla' },
  { id: 'IT301', name: 'Web Technologies',         type: 'Theory',    semester: 3, branch_id: 'IT',  credits: 3, facultyId: 'F006', facultyName: 'Prof. Rekha Verma' },
  { id: 'EC301', name: 'Signals & Systems',        type: 'Theory',    semester: 3, branch_id: 'ECE', credits: 4, facultyId: 'F007', facultyName: 'Dr. Suresh Nair' },
]

// ── Faculty Members ───────────────────────────────────────────────────────────

export interface FacultyMember {
  id: string
  name: string
  employeeId: string
  designation: string
  branch_id: string
  email: string
  phone: string
  specialization: string
  subjects: string[]
  joinDate: string
  status: 'active' | 'on_leave'
}

export const mockFacultyMembers: FacultyMember[] = [
  { id: 'F001', name: 'Dr. Rajesh Kumar Pandey', employeeId: 'SGS-CS-001', designation: 'Professor',        branch_id: 'CSE', email: 'rkpandey@sgsits.ac.in',  phone: '9876543210', specialization: 'Algorithms & Complexity',  subjects: ['CS301', 'CS303', 'CS401'], joinDate: '2010-07-01', status: 'active' },
  { id: 'F002', name: 'Prof. Sunita Gupta',      employeeId: 'SGS-CS-002', designation: 'Assoc. Professor', branch_id: 'CSE', email: 'sgupta@sgsits.ac.in',    phone: '9876543211', specialization: 'Operating Systems',       subjects: ['CS302', 'CS501'],          joinDate: '2013-01-15', status: 'active' },
  { id: 'F003', name: 'Dr. Mahesh Patil',        employeeId: 'SGS-CS-003', designation: 'Asst. Professor',  branch_id: 'CSE', email: 'mpatil@sgsits.ac.in',    phone: '9876543212', specialization: 'Computer Architecture',   subjects: ['CS402'],                   joinDate: '2015-08-01', status: 'active' },
  { id: 'F004', name: 'Dr. Priya Saxena',        employeeId: 'SGS-CS-004', designation: 'Asst. Professor',  branch_id: 'CSE', email: 'psaxena@sgsits.ac.in',   phone: '9876543213', specialization: 'Machine Learning & AI',   subjects: ['CS502'],                   joinDate: '2018-07-01', status: 'active' },
  { id: 'F005', name: 'Prof. Amit Shukla',       employeeId: 'SGS-CS-005', designation: 'Assoc. Professor', branch_id: 'CSE', email: 'ashukla@sgsits.ac.in',   phone: '9876543214', specialization: 'Cloud & Distributed Sys.',subjects: ['CS503'],                   joinDate: '2014-01-01', status: 'on_leave' },
  { id: 'F006', name: 'Prof. Rekha Verma',       employeeId: 'SGS-IT-001', designation: 'Assoc. Professor', branch_id: 'IT',  email: 'rverma@sgsits.ac.in',    phone: '9876543215', specialization: 'Web & Mobile Computing',  subjects: ['IT301'],                   joinDate: '2016-07-01', status: 'active' },
  { id: 'F007', name: 'Dr. Suresh Nair',         employeeId: 'SGS-EC-001', designation: 'Professor',        branch_id: 'ECE', email: 'snair@sgsits.ac.in',      phone: '9876543216', specialization: 'Signal Processing',       subjects: ['EC301'],                   joinDate: '2008-01-01', status: 'active' },
]

// ── Students ──────────────────────────────────────────────────────────────────

export interface Student {
  enrollment: string
  name: string
  branch_id: string
  semester: number
  section: string
  email: string
  hasATKT: boolean
}

export const mockStudents: Student[] = [
  { enrollment: '0901CS21001', name: 'Aarav Sharma',  branch_id: 'CSE', semester: 5, section: 'A', email: 'aarav.sharma@student.sgsits.ac.in',  hasATKT: false },
  { enrollment: '0901CS21002', name: 'Priya Verma',   branch_id: 'CSE', semester: 5, section: 'A', email: 'priya.verma@student.sgsits.ac.in',   hasATKT: false },
  { enrollment: '0901CS21003', name: 'Rahul Gupta',   branch_id: 'CSE', semester: 5, section: 'B', email: 'rahul.gupta@student.sgsits.ac.in',   hasATKT: true  },
  { enrollment: '0901CS21004', name: 'Sneha Patel',   branch_id: 'CSE', semester: 5, section: 'B', email: 'sneha.patel@student.sgsits.ac.in',   hasATKT: false },
  { enrollment: '0901CS21005', name: 'Vikram Singh',  branch_id: 'CSE', semester: 5, section: 'A', email: 'vikram.singh@student.sgsits.ac.in',  hasATKT: true  },
  { enrollment: '0901CS21006', name: 'Anjali Mishra', branch_id: 'CSE', semester: 5, section: 'B', email: 'anjali.mishra@student.sgsits.ac.in', hasATKT: false },
  { enrollment: '0901CS21007', name: 'Arjun Tiwari',  branch_id: 'CSE', semester: 3, section: 'A', email: 'arjun.tiwari@student.sgsits.ac.in',  hasATKT: false },
  { enrollment: '0901CS21008', name: 'Divya Dubey',   branch_id: 'CSE', semester: 3, section: 'A', email: 'divya.dubey@student.sgsits.ac.in',   hasATKT: false },
  { enrollment: '0901IT21001', name: 'Karan Rathore', branch_id: 'IT',  semester: 5, section: 'A', email: 'karan.rathore@student.sgsits.ac.in', hasATKT: false },
  { enrollment: '0901IT21002', name: 'Pooja Joshi',   branch_id: 'IT',  semester: 5, section: 'A', email: 'pooja.joshi@student.sgsits.ac.in',   hasATKT: true  },
]

// ── Marks Requests ────────────────────────────────────────────────────────────

export interface MarksRequest {
  id: string
  subjectId: string
  subjectName: string
  branch_id: string
  semester: number
  section: string
  component: string
  subComponent: string
  dueDate: string
  status: 'pending' | 'submitted' | 'overdue'
  facultyId: string
  facultyName: string
}

export const mockMarksRequests: MarksRequest[] = [
  { id: 'MR001', subjectId: 'CS301', subjectName: 'Data Structures',     branch_id: 'CSE', semester: 3, section: 'A', component: 'CW',    subComponent: 'MST 1',        dueDate: '2026-06-01', status: 'pending',   facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey' },
  { id: 'MR002', subjectId: 'CS302', subjectName: 'Digital Logic Design', branch_id: 'CSE', semester: 3, section: 'A', component: 'CW',    subComponent: 'MST 2',        dueDate: '2026-06-05', status: 'submitted', facultyId: 'F002', facultyName: 'Prof. Sunita Gupta' },
  { id: 'MR003', subjectId: 'CS401', subjectName: 'Algorithms',           branch_id: 'CSE', semester: 4, section: 'B', component: 'Theory',subComponent: 'Theory Exam',  dueDate: '2026-05-30', status: 'overdue',   facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey' },
  { id: 'MR004', subjectId: 'CS501', subjectName: 'Operating Systems',    branch_id: 'CSE', semester: 5, section: 'A', component: 'CW',    subComponent: 'Assignment 1', dueDate: '2026-06-10', status: 'pending',   facultyId: 'F002', facultyName: 'Prof. Sunita Gupta' },
  { id: 'MR005', subjectId: 'CS302', subjectName: 'Digital Logic Design', branch_id: 'CSE', semester: 3, section: 'B', component: 'CW',    subComponent: 'MST 1',        dueDate: '2026-06-01', status: 'submitted', facultyId: 'F002', facultyName: 'Prof. Sunita Gupta' },
]

// ── Correction Requests ───────────────────────────────────────────────────────

export interface CorrectionRequest {
  id: string
  subjectId: string
  subjectName: string
  component: string
  subComponent: string
  reason: string
  affectedEnrollments: string[]
  status: 'draft' | 'pending' | 'approved' | 'rejected'
  submittedOn: string
  facultyId: string
}

export const mockCorrectionRequests: CorrectionRequest[] = [
  { id: 'CR001', subjectId: 'CS301', subjectName: 'Data Structures', component: 'CW', subComponent: 'MST 1', reason: 'Marks entry error for roll no. 0901CS21003 — should be 18 not 8.', affectedEnrollments: ['0901CS21003'],              status: 'pending',  submittedOn: '2026-05-20', facultyId: 'F001' },
  { id: 'CR002', subjectId: 'CS401', subjectName: 'Algorithms',      component: 'CW', subComponent: 'MST 2', reason: 'Student was absent but marks entered as 0 instead of AB.',          affectedEnrollments: ['0901CS21005', '0901CS21006'], status: 'approved', submittedOn: '2026-05-15', facultyId: 'F001' },
]

// ── Registration Requests ─────────────────────────────────────────────────────

export interface RegistrationRequest {
  id: string
  facultyId: string
  name: string
  designation: string
  email: string
  phone: string
  specialization: string
  branch_id: string
  appliedOn: string
  status: 'pending' | 'approved' | 'rejected'
}

export const mockRegistrationRequests: RegistrationRequest[] = [
  { id: 'RR001', facultyId: 'REG-F-001', name: 'Dr. Neha Bajpai',    designation: 'Asst. Professor',  email: 'nbajpai@sgsits.ac.in',  phone: '9876501001', specialization: 'Database Systems',  branch_id: 'CSE', appliedOn: '2026-05-18', status: 'pending'  },
  { id: 'RR002', facultyId: 'REG-F-002', name: 'Prof. Saurabh Jain', designation: 'Lecturer',         email: 'sjain@sgsits.ac.in',    phone: '9876501002', specialization: 'Computer Networks', branch_id: 'CSE', appliedOn: '2026-05-15', status: 'pending'  },
  { id: 'RR003', facultyId: 'REG-F-003', name: 'Dr. Kavita Rani',    designation: 'Assoc. Professor', email: 'krani@sgsits.ac.in',    phone: '9876501003', specialization: 'Soft Computing',    branch_id: 'CSE', appliedOn: '2026-05-10', status: 'approved' },
  { id: 'RR004', facultyId: 'REG-F-004', name: 'Prof. Vivek Pandey', designation: 'Asst. Professor',  email: 'vpandey@sgsits.ac.in',  phone: '9876501004', specialization: 'Embedded Systems',  branch_id: 'CSE', appliedOn: '2026-05-08', status: 'rejected' },
]

// ── Elective Subjects ─────────────────────────────────────────────────────────

export interface ElectiveSubject {
  id: string
  name: string
  semester: number
  branch_id: string
  uploadStatus: 'pending' | 'uploaded'
  uploadedOn?: string
}

export const mockElectiveSubjects: ElectiveSubject[] = [
  { id: 'CS502', name: 'Machine Learning',            semester: 7, branch_id: 'CSE', uploadStatus: 'uploaded', uploadedOn: '2026-05-10' },
  { id: 'CS503', name: 'Cloud Computing',             semester: 7, branch_id: 'CSE', uploadStatus: 'pending' },
  { id: 'CS504', name: 'Natural Language Processing', semester: 7, branch_id: 'CSE', uploadStatus: 'pending' },
  { id: 'CS505', name: 'Cyber Security',              semester: 7, branch_id: 'CSE', uploadStatus: 'uploaded', uploadedOn: '2026-05-08' },
]

// ── Student Marks (generated helper) ─────────────────────────────────────────

export interface StudentMark {
  enrollment: string
  studentName: string
  marks: number | null
  maxMarks: number
  isAbsent: boolean
}

const MAX_MARKS_MAP: Record<string, number> = {
  'MST 1': 20, 'MST 2': 20,
  'Assignment 1': 10, 'Assignment 2': 10,
  'Theory Exam': 80,
  'Viva 1': 25, 'Viva 2': 25,
  'External Viva': 30, 'External Submission': 20,
}

export function generateMockMarks(subject: Subject, section: string, component: string): StudentMark[] {
  const students = mockStudents.filter(
    s => s.branch_id === subject.branch_id && s.semester === subject.semester && s.section === section,
  )
  const max = MAX_MARKS_MAP[component] ?? 20
  return students.map(s => ({
    enrollment: s.enrollment,
    studentName: s.name,
    marks: null,
    maxMarks: max,
    isAbsent: false,
  }))
}

// ── Helper ────────────────────────────────────────────────────────────────────

export const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
