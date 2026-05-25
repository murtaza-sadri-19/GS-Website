/**
 * Exam Service — wired to GS-Website academic backend
 *
 * Public endpoints (no auth): /api/v1/exam/* — exam documents, notices, timetables
 * Protected endpoints (auth):  /api/v1/academic/* — sessions, marks, ATKT, etc.
 *
 * Falls back to mock data when backend unreachable.
 */

import apiClient from '../api/client'
import {
  mockSessions,             type Session,
  mockBranches,             type Branch,
  mockCourses,              type Course,
  mockSubjects,             type Subject,
  mockFacultyMembers,       type FacultyMember,
  mockStudents,             type Student,
  mockMarksRequests,        type MarksRequest,
  mockCorrectionRequests,   type CorrectionRequest,
  mockRegistrationRequests, type RegistrationRequest,
  mockElectiveSubjects,     type ElectiveSubject,
  mockStudents as _students,
  generateMockMarks,        type StudentMark,
  CURRENT_SESSION,
  MONTH_NAMES,
} from '../mock/exam/examData'

export type {
  Session, Branch, Course, Subject, FacultyMember, Student,
  MarksRequest, CorrectionRequest, RegistrationRequest, ElectiveSubject, StudentMark,
}

export { MONTH_NAMES }

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
    return [...mockSessions]
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
    return mockSessions.find(s => s.is_active)
  }
}

// ─── Branches / Courses ───────────────────────────────────────────────────────

export const getBranches = async (): Promise<Branch[]> => {
  try {
    // Departments serve as branches in GS-Website
    const res = await apiClient.get('/v1/departments', { params: { status: 'ACTIVE', pageSize: 50 } })
    const data = res.data?.data?.departments ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map((d: Record<string, unknown>) => ({
      id:         String(d.id),
      branch_id:  String(d.slug || d.id),
      branch_name: String(d.name),
    })) : []
  } catch {
    return [...mockBranches]
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
    return [...mockCourses]
  }
}

// ─── Subjects ────────────────────────────────────────────────────────────────

export const getSubjects = async (departmentId?: string): Promise<Subject[]> => {
  try {
    const params: Record<string, string> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/academic/subjects', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((s: Record<string, unknown>) => ({
      id:        String(s.subject_code || s.id),   // use subject_code as the primary identifier
      name:      String(s.subject_name),
      type:      (String(s.subject_type || 'Theory')) as Subject['type'],
      semester:  Number(s.semester),
      branch_id: String(s.department_id),
      credits:   Number(s.credits ?? 0),
    })) : []
  } catch {
    const subjects = [...mockSubjects]
    return departmentId ? subjects.filter(s => s.branch_id === departmentId) : subjects
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
    const members = [...mockFacultyMembers]
    return departmentId ? members.filter(f => f.branch_id === departmentId) : members
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
    const students = [..._students]
    return departmentId ? students.filter(s => s.branch_id === departmentId) : students
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
    const requests = [...mockMarksRequests]
    return departmentId ? requests.filter(r => r.branch_id === departmentId) : requests
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
    return [...mockCorrectionRequests]
  }
}

// ─── Registration Requests ───────────────────────────────────────────────────

export const getRegistrationRequests = async (departmentId?: string): Promise<RegistrationRequest[]> => {
  // Not yet in backend — use mock
  const requests = [...mockRegistrationRequests]
  return departmentId ? requests.filter(r => r.branch_id === departmentId) : requests
}

// ─── Elective Subjects ───────────────────────────────────────────────────────

export const getElectiveSubjects = async (departmentId?: string): Promise<ElectiveSubject[]> => {
  try {
    const params: Record<string, string> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/academic/electives', { params })
    const data = res.data?.data ?? []
    return Array.isArray(data) ? data.map((e: Record<string, unknown>) => ({
      id:            String(e.id),
      subject_id:    String(e.subject_code || e.id),
      subject_name:  String(e.subject_name),
      subject_type:  'Elective' as const,
      semester:      Number(e.semester),
      branch_id:     String(e.department_id || departmentId || ''),
      course_id:     String(e.course_id),
    })) : []
  } catch {
    const electives = [...mockElectiveSubjects]
    return departmentId ? electives.filter(e => e.branch_id === departmentId) : electives
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
    const subject = mockSubjects.find(s => s.id === subjectId)
    if (!subject) return []
    return generateMockMarks(subject, section, component)
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
export const sessionsDefault: Session[]                     = mockSessions
export const branchesDefault: Branch[]                      = mockBranches
export const coursesDefault: Course[]                       = mockCourses
export const subjectsDefault: Subject[]                     = mockSubjects
export const facultyMembersDefault: FacultyMember[]         = mockFacultyMembers
export const studentsDefault: Student[]                     = mockStudents
export const marksRequestsDefault: MarksRequest[]           = mockMarksRequests
export const correctionRequestsDefault: CorrectionRequest[] = mockCorrectionRequests
export const registrationRequestsDefault: RegistrationRequest[] = mockRegistrationRequests
export const electiveSubjectsDefault: ElectiveSubject[]     = mockElectiveSubjects
export { CURRENT_SESSION }

export const examService = {
  getSessions, getActiveSession, getBranches, getCourses, getSubjects,
  getFacultyMembers, getStudents, getMarksRequests, getCorrectionRequests,
  getRegistrationRequests, getElectiveSubjects, getMarksForSubject,
  getExamDocuments, assignFacultyToSubject,
}

export default examService
