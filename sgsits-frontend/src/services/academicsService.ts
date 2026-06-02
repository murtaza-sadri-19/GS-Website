/**
 * Academics Service — wired to backend CMS sections
 *
 * Backend: GET/PUT /api/v1/settings/cms/<key>
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export type UGCoursesData         = Record<string, any>
export type PGCoursesData         = Record<string, any>
export type PhDCoursesData        = Record<string, any>
export type PTDCCourse            = Record<string, any>
export type AcademicCalendarEvent = Record<string, any>
export type OnlineCourseLink      = Record<string, any>

export interface FirstYearChecklistItem { item: string; when: string }
export interface FirstYearSubject       { code: string; subject: string; credits: number }
export interface FirstYearContact       { label: string; phone?: string; email?: string; note?: string }

export interface FirstYearData {
  welcomeText?: string
  checklist: FirstYearChecklistItem[]
  subjects: FirstYearSubject[]
  contacts: FirstYearContact[]
}

export interface ExamScheduleEntry { type: string; months: string; note?: string }
export interface ExamResultsData {
  reEvaluationNote: string
  schedules: ExamScheduleEntry[]
}

const get = async <T>(key: string): Promise<T> =>
  ((await getCmsSection<T>(key)) ?? {}) as T

const getArr = async <T>(key: string): Promise<T[]> => {
  const data = await getCmsSection<T[]>(key)
  return Array.isArray(data) ? data : []
}

export const getUGCourses        = (): Promise<UGCoursesData>         => get('academics.ug_courses')
export const getPGCourses        = (): Promise<PGCoursesData>         => get('academics.pg_courses')
export const getPhDCourses       = (): Promise<PhDCoursesData>        => get('academics.phd_courses')
export const getPTDCCourses      = (): Promise<PTDCCourse[]>          => getArr('academics.ptdc_courses')
export const getAcademicCalendar = (): Promise<AcademicCalendarEvent[]> => getArr('academics.academic_calendar')
export const getOnlineCourses    = (): Promise<OnlineCourseLink[]>    => getArr('academics.online_courses')

export const getFirstYearInfo = async (): Promise<FirstYearData> => {
  const data = await getCmsSection<FirstYearData>('academic.first_year')
  return data ?? firstYearDefault
}

export const getExamResults = async (): Promise<ExamResultsData> => {
  const data = await getCmsSection<ExamResultsData>('academic.exam_results')
  return data ?? examResultsDefault
}

export const saveUGCourses        = (data: UGCoursesData)         => saveCmsSection('academics.ug_courses', data)
export const savePGCourses        = (data: PGCoursesData)         => saveCmsSection('academics.pg_courses', data)
export const savePhDCourses       = (data: PhDCoursesData)        => saveCmsSection('academics.phd_courses', data)
export const savePTDCCourses      = (data: PTDCCourse[])          => saveCmsSection('academics.ptdc_courses', data)
export const saveAcademicCalendar = (data: AcademicCalendarEvent[]) => saveCmsSection('academics.academic_calendar', data)
export const saveOnlineCourses    = (data: OnlineCourseLink[])    => saveCmsSection('academics.online_courses', data)
export const saveFirstYearInfo    = (data: FirstYearData)         => saveCmsSection('academic.first_year', data)
export const saveExamResults      = (data: ExamResultsData)       => saveCmsSection('academic.exam_results', data)

export const ugCoursesDefault: UGCoursesData                  = {}
export const pgCoursesDefault: PGCoursesData                  = {}
export const phdCoursesDefault: PhDCoursesData                = {}
export const ptdcCoursesDefault: PTDCCourse[]                 = []
export const academicCalendarDefault: AcademicCalendarEvent[] = []
export const onlineCoursesDefault: OnlineCourseLink[]         = []

export const firstYearDefault: FirstYearData = {
  welcomeText: 'Congratulations on your admission to Shri G. S. Institute of Technology & Science.',
  checklist: [
    { item: 'Institute Registration & Fee Payment',          when: 'Day 1–2' },
    { item: 'Student Identity Card collection',               when: 'Day 2' },
    { item: 'Library Card enrollment',                        when: 'Day 3' },
    { item: 'Hostel allotment (if applicable)',               when: 'Day 1–3' },
    { item: 'Anti-ragging affidavit submission (mandatory)',  when: 'Day 1' },
    { item: 'Faculty mentor assignment & first meeting',     when: 'Day 4–5' },
    { item: 'Orientation program attendance',                 when: 'Day 1–3' },
    { item: 'Computer Center registration for email ID',     when: 'Week 1' },
  ],
  subjects: [
    { code: 'MA-101', subject: 'Engineering Mathematics – I',             credits: 4 },
    { code: 'PH-101', subject: 'Engineering Physics',                     credits: 4 },
    { code: 'CH-101', subject: 'Engineering Chemistry',                   credits: 4 },
    { code: 'CS-101', subject: 'Programming Fundamentals (C Language)',   credits: 3 },
    { code: 'ME-101', subject: 'Engineering Graphics & Drawing',          credits: 3 },
    { code: 'BE-101', subject: 'Basic Electrical Engineering',            credits: 3 },
    { code: 'HU-101', subject: 'Communication Skills & Technical Writing',credits: 2 },
    { code: 'ME-102', subject: 'Workshop Practice',                       credits: 2 },
  ],
  contacts: [
    { label: 'Anti-Ragging Helpline',  phone: '1800-180-5522',   email: 'antiranging@sgsits.ac.in', note: '24×7, Toll-Free' },
    { label: 'Dean Student Welfare',   phone: '0731-2582105',    email: 'dsw@sgsits.ac.in' },
    { label: 'Exam Cell',              phone: '0731-2582106',    email: 'examcell@sgsits.ac.in' },
    { label: 'Hostel Administration',  phone: '0731-2582220',    email: 'hostel@sgsits.ac.in' },
    { label: 'Dispensary',             phone: '0731-2582210' },
  ],
}

export const examResultsDefault: ExamResultsData = {
  reEvaluationNote: 'Applications for re-evaluation/re-checking must be submitted within 15 days of official result declaration.',
  schedules: [
    { type: 'Mid-Semester Examination',  months: 'September (Sem 1) / February (Sem 2)',         note: '2 hours duration' },
    { type: 'End-Semester Examination',  months: 'November–December (Sem 1) / April–May (Sem 2)', note: '3 hours duration' },
    { type: 'Supplementary Examination', months: 'July / August',                                  note: 'For students with back-papers' },
  ],
}

export const academicsService = {
  getUGCourses, savePGCourses,
  getPGCourses, saveUGCourses,
  getPhDCourses, savePhDCourses,
  getPTDCCourses, savePTDCCourses,
  getAcademicCalendar, saveAcademicCalendar,
  getOnlineCourses, saveOnlineCourses,
  getFirstYearInfo, saveFirstYearInfo,
  getExamResults, saveExamResults,
}

export default academicsService
