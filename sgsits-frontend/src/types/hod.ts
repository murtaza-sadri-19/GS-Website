export type ContentStatus = 'draft' | 'published' | 'archived'

export interface DepartmentProfile {
  branch_id: string
  department_name: string
  short_name: string
  about: string
  vision: string
  mission: string
  hod_message: string
  hod_name: string
  email: string
  phone: string
  established: string
  image_url: string
  status: ContentStatus
  updated_at: string
}

export interface HodNotice {
  id: string
  title: string
  description: string
  category: 'Academic' | 'Administrative' | 'Examination' | 'Event' | 'General'
  audience: 'All' | 'Faculty' | 'Students'
  file_url?: string
  publish_date: string
  expiry_date?: string
  status: ContentStatus
  pinned: boolean
  created_by: string
}

export interface HodDownload {
  id: string
  title: string
  description: string
  category: 'Syllabus' | 'Lab Manual' | 'Assignment' | 'Question Paper' | 'Reference' | 'Form'
  semester?: number
  file_url: string
  file_size_kb: number
  uploaded_on: string
  uploaded_by: string
  status: ContentStatus
}

export interface HodEvent {
  id: string
  title: string
  description: string
  event_type: 'Workshop' | 'FDP' | 'Guest Lecture' | 'Conference' | 'Hackathon' | 'Industrial Visit' | 'Cultural'
  venue: string
  start_date: string
  end_date: string
  organizer: string
  poster_url?: string
  status: ContentStatus
  audience: 'All' | 'Faculty' | 'Students' | 'External'
}

export interface HodGalleryAlbum {
  id: string
  title: string
  description: string
  cover_url: string
  image_count: number
  created_on: string
  category: 'Event' | 'Lab' | 'Convocation' | 'Cultural' | 'Industrial Visit' | 'Other'
  status: ContentStatus
}

export interface HodLab {
  id: string
  lab_name: string
  description: string
  lab_incharge: string
  equipment_list: string[]
  capacity: number
  room_no: string
  image_url?: string
  status: ContentStatus
}

export interface HodAchievement {
  id: string
  title: string
  description: string
  achievement_date: string
  category: 'Student' | 'Faculty' | 'Department' | 'Alumni' | 'Research'
  image_url?: string
  link_url?: string
  status: ContentStatus
}

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

export type TimetableDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'

export interface TimetableSlot {
  id: string
  day: TimetableDay
  period: number
  branch_id: string
  semester: number
  section: string
  subjectId: string
  subjectName: string
  facultyId: string
  facultyName: string
  room: string
}

export interface AttendanceSummary {
  branch_id: string
  semester: number
  section: string
  total_students: number
  avg_attendance_pct: number
  below_75: number
  defaulters: { enrollment: string; name: string; pct: number }[]
}

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
