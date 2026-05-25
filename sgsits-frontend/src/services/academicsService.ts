/**
 * Academics Service — wired to backend CMS sections
 *
 * Backend: GET/PUT /api/v1/settings/cms/<key>
 *
 * Section keys:
 *   academics.ug_courses        — UG course data
 *   academics.pg_courses        — PG course data
 *   academics.phd_courses       — PhD course data
 *   academics.ptdc_courses      — PTDC diploma courses
 *   academics.academic_calendar — Academic calendar events
 *   academics.online_courses    — Online course links
 *
 * Falls back to mock data when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import {
  mockUGCourses,         type UGCoursesData,
  mockPGCourses,         type PGCoursesData,
  mockPhDCourses,        type PhDCoursesData,
  mockPTDCCourses,       type PTDCCourse,
  mockAcademicCalendar,  type AcademicCalendarEvent,
  mockOnlineCourses,     type OnlineCourseLink,
} from '../mock/academics/academicsData'

export type {
  UGCoursesData, PGCoursesData, PhDCoursesData, PTDCCourse,
  AcademicCalendarEvent, OnlineCourseLink,
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export const getUGCourses = async (): Promise<UGCoursesData> => {
  const data = await getCmsSection<UGCoursesData>('academics.ug_courses', mockUGCourses)
  return data ?? mockUGCourses
}

export const getPGCourses = async (): Promise<PGCoursesData> => {
  const data = await getCmsSection<PGCoursesData>('academics.pg_courses', mockPGCourses)
  return data ?? mockPGCourses
}

export const getPhDCourses = async (): Promise<PhDCoursesData> => {
  const data = await getCmsSection<PhDCoursesData>('academics.phd_courses', mockPhDCourses)
  return data ?? mockPhDCourses
}

export const getPTDCCourses = async (): Promise<PTDCCourse[]> => {
  const data = await getCmsSection<PTDCCourse[]>('academics.ptdc_courses', mockPTDCCourses)
  return Array.isArray(data) ? data : mockPTDCCourses
}

export const getAcademicCalendar = async (): Promise<AcademicCalendarEvent[]> => {
  const data = await getCmsSection<AcademicCalendarEvent[]>('academics.academic_calendar', mockAcademicCalendar)
  return Array.isArray(data) ? data : mockAcademicCalendar
}

export const getOnlineCourses = async (): Promise<OnlineCourseLink[]> => {
  const data = await getCmsSection<OnlineCourseLink[]>('academics.online_courses', mockOnlineCourses)
  return Array.isArray(data) ? data : mockOnlineCourses
}

// ─── Admin writes ─────────────────────────────────────────────────────────────

export const saveUGCourses = async (data: UGCoursesData): Promise<void> => {
  await saveCmsSection('academics.ug_courses', data)
}

export const savePGCourses = async (data: PGCoursesData): Promise<void> => {
  await saveCmsSection('academics.pg_courses', data)
}

export const savePhDCourses = async (data: PhDCoursesData): Promise<void> => {
  await saveCmsSection('academics.phd_courses', data)
}

export const savePTDCCourses = async (data: PTDCCourse[]): Promise<void> => {
  await saveCmsSection('academics.ptdc_courses', data)
}

export const saveAcademicCalendar = async (data: AcademicCalendarEvent[]): Promise<void> => {
  await saveCmsSection('academics.academic_calendar', data)
}

export const saveOnlineCourses = async (data: OnlineCourseLink[]): Promise<void> => {
  await saveCmsSection('academics.online_courses', data)
}

// ─── Sync defaults (no-flash initial render) ──────────────────────────────────
export const ugCoursesDefault: UGCoursesData                 = mockUGCourses
export const pgCoursesDefault: PGCoursesData                 = mockPGCourses
export const phdCoursesDefault: PhDCoursesData               = mockPhDCourses
export const ptdcCoursesDefault: PTDCCourse[]                = mockPTDCCourses
export const academicCalendarDefault: AcademicCalendarEvent[] = mockAcademicCalendar
export const onlineCoursesDefault: OnlineCourseLink[]        = mockOnlineCourses

export const academicsService = {
  getUGCourses,     saveUGCourses,
  getPGCourses,     savePGCourses,
  getPhDCourses,    savePhDCourses,
  getPTDCCourses,   savePTDCCourses,
  getAcademicCalendar, saveAcademicCalendar,
  getOnlineCourses, saveOnlineCourses,
}

export default academicsService
