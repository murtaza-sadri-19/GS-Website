/**
 * HOD-specific mock data.
 * Leave applications, timetable slots, department notices, attendance.
 * Backend replacement points are documented inline.
 */

// ── Leave Applications (faculty → HOD) ────────────────────────────────
export interface LeaveApplication {
  id: string
  facultyId: string
  facultyName: string
  designation: string
  leaveType: 'Casual' | 'Earned' | 'Medical' | 'Duty' | 'Maternity'
  fromDate: string
  toDate: string
  days: number
  reason: string
  appliedOn: string
  status: 'pending' | 'approved' | 'rejected'
  attachmentUrl?: string
  remarks?: string
}

export const LEAVE_APPLICATIONS: LeaveApplication[] = [
  { id: 'LV001', facultyId: 'F002', facultyName: 'Prof. Sunita Gupta',       designation: 'Assoc. Professor', leaveType: 'Casual',   fromDate: '2026-06-02', toDate: '2026-06-03', days: 2, reason: 'Personal family event in hometown.',                  appliedOn: '2026-05-22', status: 'pending'  },
  { id: 'LV002', facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey',  designation: 'Professor',        leaveType: 'Duty',     fromDate: '2026-06-10', toDate: '2026-06-12', days: 3, reason: 'Paper presentation at NIT Trichy conference.',          appliedOn: '2026-05-20', status: 'pending'  },
  { id: 'LV003', facultyId: 'F004', facultyName: 'Dr. Priya Saxena',         designation: 'Asst. Professor',  leaveType: 'Medical',  fromDate: '2026-05-18', toDate: '2026-05-20', days: 3, reason: 'Viral fever (medical certificate attached).',           appliedOn: '2026-05-17', status: 'approved', attachmentUrl: '#', remarks: 'Approved with medical certificate verification.' },
  { id: 'LV004', facultyId: 'F003', facultyName: 'Dr. Mahesh Patil',         designation: 'Asst. Professor',  leaveType: 'Earned',   fromDate: '2026-04-25', toDate: '2026-04-30', days: 6, reason: 'Annual vacation.',                                       appliedOn: '2026-04-15', status: 'approved' },
  { id: 'LV005', facultyId: 'F006', facultyName: 'Prof. Rekha Verma',        designation: 'Assoc. Professor', leaveType: 'Casual',   fromDate: '2026-03-12', toDate: '2026-03-12', days: 1, reason: 'Doctor consultation appointment.',                       appliedOn: '2026-03-11', status: 'rejected', remarks: 'Mid-semester exam invigilation duty.' },
]

// ── Timetable Slots ───────────────────────────────────────────────────
export type TimetableDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
export const TIMETABLE_DAYS: TimetableDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const TIMETABLE_PERIODS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00',
]

export interface TimetableSlot {
  id: string
  day: TimetableDay
  period: number          // 0..5 index into TIMETABLE_PERIODS
  branch_id: string
  semester: number
  section: string
  subjectId: string
  subjectName: string
  facultyId: string
  facultyName: string
  room: string
}

export const TIMETABLE_SLOTS: TimetableSlot[] = [
  { id: 'TT001', day: 'Mon', period: 0, branch_id: 'CSE', semester: 5, section: 'A', subjectId: 'CS501', subjectName: 'Operating Systems', facultyId: 'F002', facultyName: 'Prof. Sunita Gupta',       room: 'CR-301' },
  { id: 'TT002', day: 'Mon', period: 1, branch_id: 'CSE', semester: 5, section: 'A', subjectId: 'CS502', subjectName: 'Machine Learning',  facultyId: 'F004', facultyName: 'Dr. Priya Saxena',         room: 'CR-301' },
  { id: 'TT003', day: 'Tue', period: 0, branch_id: 'CSE', semester: 5, section: 'A', subjectId: 'CS503', subjectName: 'Cloud Computing',    facultyId: 'F005', facultyName: 'Prof. Amit Shukla',        room: 'CR-302' },
  { id: 'TT004', day: 'Wed', period: 2, branch_id: 'CSE', semester: 5, section: 'A', subjectId: 'CS501', subjectName: 'Operating Systems',  facultyId: 'F002', facultyName: 'Prof. Sunita Gupta',       room: 'CR-301' },
  { id: 'TT005', day: 'Thu', period: 1, branch_id: 'CSE', semester: 5, section: 'A', subjectId: 'CS502', subjectName: 'Machine Learning',   facultyId: 'F004', facultyName: 'Dr. Priya Saxena',         room: 'Lab-2' },
  { id: 'TT006', day: 'Fri', period: 0, branch_id: 'CSE', semester: 3, section: 'A', subjectId: 'CS301', subjectName: 'Data Structures',    facultyId: 'F001', facultyName: 'Dr. Rajesh Kumar Pandey',  room: 'CR-201' },
  { id: 'TT007', day: 'Fri', period: 1, branch_id: 'CSE', semester: 3, section: 'A', subjectId: 'CS302', subjectName: 'Digital Logic',      facultyId: 'F002', facultyName: 'Prof. Sunita Gupta',       room: 'CR-201' },
]

// ── Department Notices ────────────────────────────────────────────────
export interface DeptNotice {
  id: string
  title: string
  body: string
  category: 'Academic' | 'Administrative' | 'Examination' | 'Event' | 'General'
  audience: 'All' | 'Faculty' | 'Students'
  pinned: boolean
  publishedOn: string
  publishedBy: string
}

export const DEPT_NOTICES: DeptNotice[] = [
  { id: 'DN001', title: 'Semester End Exam Invigilation Duty — Sem V',              body: 'All faculty members are requested to check the invigilation roster pinned on the department notice board. Any swap requests should be raised with the HOD office by 28 May 2026.', category: 'Examination',    audience: 'Faculty',  pinned: true,  publishedOn: '2026-05-21', publishedBy: 'HOD Office' },
  { id: 'DN002', title: 'Elective Subject Allocation Sheet — Sem VII',              body: 'Sem VII students are required to fill the elective preference form by 30 May 2026. Forms available at the department office. Allocation will be released by 5 June 2026.', category: 'Academic',       audience: 'Students', pinned: true,  publishedOn: '2026-05-18', publishedBy: 'HOD Office' },
  { id: 'DN003', title: 'Faculty Development Programme — AI/ML',                    body: 'A 5-day FDP on Applied Machine Learning is scheduled from 10 June 2026. Interested faculty may register by 1 June 2026 with the department coordinator.',                category: 'Event',          audience: 'Faculty',  pinned: false, publishedOn: '2026-05-15', publishedBy: 'HOD Office' },
  { id: 'DN004', title: 'Syllabus Revision Committee Meeting',                       body: 'A committee meeting for revision of B.E. Sem III–IV syllabus is scheduled on 30 May 2026, 11:00 AM, HOD Chamber. Concerned faculty please remain present.',                  category: 'Administrative', audience: 'Faculty',  pinned: false, publishedOn: '2026-05-12', publishedBy: 'HOD Office' },
  { id: 'DN005', title: 'Department Library — New Arrivals',                         body: 'New arrivals: 28 reference titles in AI, Compilers and Distributed Systems. Catalogue is available in the department reading room.',                                       category: 'General',        audience: 'All',      pinned: false, publishedOn: '2026-05-08', publishedBy: 'HOD Office' },
]

// ── Attendance Summary (per branch+sem snapshot) ─────────────────────
export interface AttendanceSummary {
  branch_id: string
  semester: number
  section: string
  total_students: number
  avg_attendance_pct: number
  below_75: number     // count of students below 75% attendance
  defaulters: { enrollment: string; name: string; pct: number }[]
}

export const ATTENDANCE_SUMMARY: AttendanceSummary[] = [
  {
    branch_id: 'CSE', semester: 5, section: 'A',
    total_students: 62, avg_attendance_pct: 84, below_75: 6,
    defaulters: [
      { enrollment: '0901CS21005', name: 'Vikram Singh',  pct: 62 },
      { enrollment: '0901CS21011', name: 'Rohit Verma',   pct: 68 },
      { enrollment: '0901CS21014', name: 'Mohit Sharma',  pct: 71 },
    ],
  },
  {
    branch_id: 'CSE', semester: 5, section: 'B',
    total_students: 60, avg_attendance_pct: 82, below_75: 8,
    defaulters: [
      { enrollment: '0901CS21003', name: 'Rahul Gupta',   pct: 58 },
      { enrollment: '0901CS21009', name: 'Sunny Tiwari',  pct: 64 },
    ],
  },
  {
    branch_id: 'CSE', semester: 3, section: 'A',
    total_students: 65, avg_attendance_pct: 88, below_75: 3,
    defaulters: [
      { enrollment: '0901CS21008', name: 'Divya Dubey',   pct: 73 },
    ],
  },
]

// ── Department Result Summary ─────────────────────────────────────────
export interface DeptResultSummary {
  branch_id: string
  semester: number
  section: string
  totalStudents: number
  passed: number
  failed: number
  passPct: number
  topper: { name: string; sgpa: number }
}

export const DEPT_RESULT_SUMMARY: DeptResultSummary[] = [
  { branch_id: 'CSE', semester: 4, section: 'A', totalStudents: 62, passed: 58, failed: 4, passPct: 93.5, topper: { name: 'Aarav Sharma',  sgpa: 9.8 } },
  { branch_id: 'CSE', semester: 4, section: 'B', totalStudents: 60, passed: 54, failed: 6, passPct: 90.0, topper: { name: 'Anjali Mishra', sgpa: 9.6 } },
  { branch_id: 'CSE', semester: 2, section: 'A', totalStudents: 65, passed: 62, failed: 3, passPct: 95.3, topper: { name: 'Arjun Tiwari',  sgpa: 9.7 } },
]
