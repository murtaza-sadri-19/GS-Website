/**
 * Exam Service — wired to GS-Website academic backend
 *
 * Public endpoints (no auth): /api/v1/exam/* — exam documents, notices, timetables
 * Protected endpoints (auth):  /api/v1/academic/* — sessions, marks, ATKT, etc.
 */

import apiClient from '../api/client'

export interface Session {
  id: string
  start_month: number
  start_year: number
  end_month: number
  end_year: number
  is_active: boolean
  label: string
}

export interface RegistrationRequest {
  id: string
  student_name: string
  enrollment_no: string
  branch_id: string
  semester: number
  course_id: string
  status: string
  requested_on: string
}

export interface StudentMark {
  enrollment_no: string
  student_name: string
  co_name: string
  marks_obtained: number
}

export const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export interface Branch {
  id: string
  branch_id: string
  branch_name: string
}

export interface Course {
  id: string
  course_id: string
  course_name: string
  specialization: string
  branch_id: string
}

export interface Subject {
  id: string        // subject_code (display identifier)
  db_id: number     // numeric primary key in exam_subjects (use for API calls)
  name: string
  type: 'Theory' | 'Practical' | 'Elective' | 'Lab'
  db_type: 'Regular' | 'Elective' | 'ATKT'  // actual DB enum value
  semester: number
  branch_id: string
  credits: number
  facultyId?: string
  facultyName?: string
}

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

export interface Student {
  id: string
  enrollment_no: string
  student_name: string
  semester: number
  branch_id: string
  course_id: string
  section?: string
  status: string
}

export interface MarksRequest {
  id: string
  subject_id: string
  component_name: string
  sub_component_name: string
  faculty_name: string
  branch_id: string
  last_date: string
  status: string
}

export interface CorrectionRequest {
  id: string
  subject_id: string
  subject_name: string
  component_name: string
  sub_component_name: string
  reason: string
  form_status: string
  status: string
  faculty_name: string
  enrollment_nos: string[]
}

export interface ElectiveSubject {
  id: string
  db_id?: number        // numeric primary key for API calls
  subject_id: string
  subject_name: string
  subject_type: 'Elective'
  semester: number
  branch_id: string
  course_id: string
  uploadStatus?: 'uploaded' | 'pending'
  uploadedOn?: string
  name: string          // alias for subject_name (used in UI)
}


// ─── Sessions ────────────────────────────────────────────────────────────────

export const getSessions = async (): Promise<Session[]> => {
  try {
    const res = await apiClient.get('/v1/academic/sessions')
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((s: Record<string, unknown>) => ({
      id:          String(s.id),
      start_month: Number(s.start_month),
      start_year:  Number(s.start_year),
      end_month:   Number(s.end_month),
      end_year:    Number(s.end_year),
      is_active:   Boolean(s.is_active),
      label:       `${MONTH_NAMES[Number(s.start_month)-1]} ${s.start_year} – ${MONTH_NAMES[Number(s.end_month)-1]} ${s.end_year}`,
    })) : []
  } catch {
    return []
  }
}

export const getActiveSession = async (): Promise<Session | undefined> => {
  try {
    const res = await apiClient.get('/v1/academic/sessions/latest')
    const s = res.data?.data
    if (!s) return undefined
    return {
      id:          String(s.id),
      start_month: Number(s.start_month),
      start_year:  Number(s.start_year),
      end_month:   Number(s.end_month),
      end_year:    Number(s.end_year),
      is_active:   Boolean(s.is_active),
      label:       `${MONTH_NAMES[Number(s.start_month)-1]} ${s.start_year} – ${MONTH_NAMES[Number(s.end_month)-1]} ${s.end_year}`,
    }
  } catch {
    return undefined
  }
}

// ─── Branches / Courses ───────────────────────────────────────────────────────

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const res = await apiClient.get('/v1/departments', { params: { status: 'ACTIVE', pageSize: 50 } })
    const data = res.data?.data?.departments ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map((d: Record<string, unknown>) => ({
      id:         String(d.id),
      branch_id:  String(d.slug || d.id),
      branch_name: String(d.name),
    })) : []
  } catch {
    return []
  }
}

export const getCourses = async (): Promise<Course[]> => {
  try {
    const res = await apiClient.get('/v1/academic/courses')
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((c: Record<string, unknown>) => ({
      id:             String(c.id),
      course_id:      String(c.course_code || c.id),
      course_name:    String(c.course_name),
      specialization: String(c.specialization || ''),
      branch_id:      String(c.department_id),
    })) : []
  } catch {
    return []
  }
}

// ─── Subjects ────────────────────────────────────────────────────────────────

export const getSubjects = async (departmentId?: string): Promise<Subject[]> => {
  try {
    const params: Record<string, string> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/academic/subjects', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((s: Record<string, unknown>) => {
      const rawType = String(s.subject_type || 'Regular') as Subject['db_type']
      const displayType: Subject['type'] =
        rawType === 'Elective' ? 'Elective' :
        rawType === 'ATKT'     ? 'Theory'   : 'Theory'
      return {
        id:        String(s.subject_code || s.id),
        db_id:     Number(s.id),
        name:      String(s.subject_name),
        type:      displayType,
        db_type:   rawType,
        semester:  Number(s.semester),
        branch_id: String(s.department_id),
        credits:   Number(s.credits ?? 0),
        facultyId:   s.faculty_user_id ? String(s.faculty_user_id) : undefined,
        facultyName: s.faculty_name    ? String(s.faculty_name)    : undefined,
      }
    }) : []
  } catch {
    return []
  }
}

// ─── Faculty ─────────────────────────────────────────────────────────────────

export const getFacultyMembers = async (departmentId?: string): Promise<FacultyMember[]> => {
  try {
    const params: Record<string, string> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/academic/faculty', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((f: Record<string, unknown>) => ({
      id:             String(f.id),
      name:           String(f.name),
      employeeId:     String(f.employee_id || f.id),
      designation:    String(f.designation || ''),
      branch_id:      String(f.department_id),
      email:          String(f.email),
      phone:          String(f.phone || ''),
      specialization: String(f.specialization || ''),
      subjects:       Array.isArray(f.subjects) ? f.subjects.map(String) : [],
      joinDate:       String(f.join_date || f.created_at || ''),
      status:         (f.status === 'on_leave' ? 'on_leave' : 'active') as FacultyMember['status'],
    })) : []
  } catch {
    return []
  }
}

// ─── Students ────────────────────────────────────────────────────────────────

export const getStudents = async (departmentId?: string): Promise<Student[]> => {
  try {
    const params: Record<string, string> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/academic/students', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((s: Record<string, unknown>) => ({
      id:            String(s.id),
      enrollment_no: String(s.enrollment_no),
      student_name:  String(s.student_name),
      semester:      Number(s.semester),
      branch_id:     String(s.department_id),
      course_id:     String(s.course_id),
      section:       s.section_id ? String(s.section_id) : undefined,
      status:        String(s.status || 'regular'),
    })) : []
  } catch {
    return []
  }
}

// ─── Marks Requests ──────────────────────────────────────────────────────────

export const getMarksRequests = async (departmentId?: string): Promise<MarksRequest[]> => {
  try {
    const res = await apiClient.get('/v1/academic/marks/fill-requests')
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((r: Record<string, unknown>) => ({
      id:                 String(r.id),
      subject_id:         String(r.subject_id),
      component_name:     String(r.component_name),
      sub_component_name: String(r.sub_component_name),
      faculty_name:       String(r.faculty_name || ''),
      branch_id:          String(r.department_id || departmentId || ''),
      last_date:          String(r.last_date || ''),
      status:             String(r.status || 'Pending'),
    })) : []
  } catch {
    return []
  }
}

// ─── Correction Requests ─────────────────────────────────────────────────────

export const getCorrectionRequests = async (): Promise<CorrectionRequest[]> => {
  try {
    const res = await apiClient.get('/v1/academic/correction-requests')
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((r: Record<string, unknown>) => ({
      id:                 String(r.id),
      subject_id:         String(r.subject_id),
      subject_name:       String(r.subject_name || ''),
      component_name:     String(r.component_name || ''),
      sub_component_name: String(r.sub_component_name || ''),
      reason:             String(r.reason || ''),
      form_status:        String(r.form_status || 'Regular'),
      status:             String(r.status || 'Pending'),
      faculty_name:       String(r.faculty_name || ''),
      enrollment_nos:     Array.isArray(r.enrollment_nos) ? r.enrollment_nos.map(String) : [],
    })) : []
  } catch {
    return []
  }
}

// ─── Registration Requests ───────────────────────────────────────────────────

export const getRegistrationRequests = async (_departmentId?: string): Promise<RegistrationRequest[]> => {
  try {
    const res = await apiClient.get('/v1/academic/registration-requests')
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// ─── Elective Subjects ───────────────────────────────────────────────────────

export const getElectiveSubjects = async (departmentId?: string): Promise<ElectiveSubject[]> => {
  try {
    const params: Record<string, string> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/academic/electives', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((e: Record<string, unknown>) => ({
      id:            String(e.subject_code || e.id),
      db_id:         Number(e.id),
      subject_id:    String(e.subject_code || e.id),
      subject_name:  String(e.subject_name),
      name:          String(e.subject_name),
      subject_type:  'Elective' as const,
      semester:      Number(e.semester),
      branch_id:     String(e.department_id || departmentId || ''),
      course_id:     String(e.course_id),
      uploadStatus:  'pending' as const,
    })) : []
  } catch {
    return []
  }
}

// ─── Marks Data ──────────────────────────────────────────────────────────────

export const getMarksForSubject = async (
  subjectId: string, section: string, component: string,
): Promise<StudentMark[]> => {
  try {
    const res = await apiClient.get('/v1/academic/marks', {
      params: { subject_id: subjectId, component_name: component, sub_component_name: section }
    })
    const data = res.data?.data?.saved_marks ?? []
    return Array.isArray(data) ? data.map((m: Record<string, unknown>) => ({
      enrollment_no:  String(m.enrollment_no),
      student_name:   String(m.student_name || ''),
      co_name:        String(m.co_name),
      marks_obtained: Number(m.marks_obtained),
    })) : []
  } catch {
    return []
  }
}

// ─── Exam Documents (public — existing endpoint) ──────────────────────────────

export const getExamDocuments = async (document_type?: string) => {
  try {
    const params: Record<string, string> = {}
    if (document_type) params.document_type = document_type
    const res = await apiClient.get('/v1/exam/documents', { params })
    return res.data?.data?.documents ?? []
  } catch {
    return []
  }
}

// ─── Faculty Assignment (HOD only) ───────────────────────────────────────────

export const assignFacultyToSubject = async (
  subjectId: string | number,
  facultyUserIds: number[],
  options?: { sessionId?: string; sectionId?: string }
): Promise<void> => {
  await apiClient.post('/v1/academic/faculty/assign', {
    subject_id:      subjectId,
    faculty_user_ids: facultyUserIds,
    ...(options?.sessionId && { session_id: options.sessionId }),
    ...(options?.sectionId && { section_id: options.sectionId }),
  })
}

// ─── Defaults ────────────────────────────────────────────────────────────────
export const sessionsDefault: Session[]                     = []
export const branchesDefault: Branch[]                      = []
export const coursesDefault: Course[]                       = []
export const subjectsDefault: Subject[]                     = []
export const facultyMembersDefault: FacultyMember[]         = []
export const studentsDefault: Student[]                     = []
export const marksRequestsDefault: MarksRequest[]           = []
export const correctionRequestsDefault: CorrectionRequest[] = []
export const registrationRequestsDefault: RegistrationRequest[] = []
export const electiveSubjectsDefault: ElectiveSubject[]     = []
