/**
 * Institution Service — institution-wide statistics, timeline, highlights
 * Backend: GET /api/v1/settings/cms/institution.*
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export interface InstitutionStat {
  value: string
  suffix?: string
  label: string
}

export interface InstitutionTimelineEvent {
  year: string
  title: string
  description: string
}

export interface InstitutionHighlight {
  title: string
  description: string
}

export interface DepartmentStats {
  deptCount: string
  facultyCount: string
  studentCount: string
  yearsLegacy: string
}

const get = async <T>(key: string): Promise<T | null> => getCmsSection<T>(key)
const getArr = async <T>(key: string): Promise<T[]> => {
  const data = await getCmsSection<T[]>(key)
  return Array.isArray(data) ? data : []
}
const getObj = async <T>(key: string): Promise<T> =>
  ((await getCmsSection<T>(key)) ?? {}) as T

export const getInstitutionStats     = async (): Promise<InstitutionStat[]>          => {
  const data = await get<{ items: InstitutionStat[] }>('institution.stats')
  return Array.isArray(data?.items) ? data!.items : []
}
export const getInstitutionTimeline  = (): Promise<InstitutionTimelineEvent[]>        => getArr<InstitutionTimelineEvent>('institution.timeline')
export const getInstitutionHighlights= (): Promise<InstitutionHighlight[]>            => getArr<InstitutionHighlight>('institution.highlights')
export const getDepartmentStats      = (): Promise<DepartmentStats>                   => getObj<DepartmentStats>('departments.stats')

export const saveInstitutionStats     = (items: InstitutionStat[])             => saveCmsSection('institution.stats', { items })
export const saveInstitutionTimeline  = (data: InstitutionTimelineEvent[])     => saveCmsSection('institution.timeline', data)
export const saveInstitutionHighlights= (data: InstitutionHighlight[])         => saveCmsSection('institution.highlights', data)
export const saveDepartmentStats      = (data: DepartmentStats)                => saveCmsSection('departments.stats', data)

// ── Defaults ──────────────────────────────────────────────────────────────────

export const institutionStatsDefault: InstitutionStat[] = [
  { value: '70', suffix: '+', label: 'Years of Excellence' },
  { value: '5000', suffix: '+', label: 'Students Enrolled' },
  { value: '17', suffix: '', label: 'Departments' },
  { value: '300', suffix: '+', label: 'Faculty & Staff' },
]

export const institutionTimelineDefault: InstitutionTimelineEvent[] = [
  { year: '1952', title: 'Institute Founded', description: 'SGSITS established as a premier technical institute in Indore, M.P.' },
  { year: '1975', title: 'Campus Expansion', description: '' },
  { year: '1990', title: 'Autonomous Status', description: '' },
  { year: '2000', title: 'NBA Accreditation', description: '' },
  { year: '2015', title: 'NAAC Grading', description: '' },
  { year: '2024', title: 'Innovation Center', description: '' },
]

export const institutionHighlightsDefault: InstitutionHighlight[] = [
  { title: 'Computer Laboratories', description: '1000+ workstations with high-speed internet' },
  { title: 'Central Library', description: '80,000+ books, journals and digital resources' },
  { title: 'Research Labs', description: 'Advanced facilities across all engineering disciplines' },
  { title: 'Sports Complex', description: 'Indoor and outdoor sports facilities' },
  { title: 'Auditorium', description: '2000-seat auditorium for events and seminars' },
  { title: 'Innovation Hub', description: 'AICTE IDEA Lab with 3D printers and IoT kits' },
]

export const departmentStatsDefault: DepartmentStats = {
  deptCount: '17',
  facultyCount: '200+',
  studentCount: '3,000+',
  yearsLegacy: '70+ Years',
}

export const institutionService = {
  getInstitutionStats, saveInstitutionStats,
  getInstitutionTimeline, saveInstitutionTimeline,
  getInstitutionHighlights, saveInstitutionHighlights,
  getDepartmentStats, saveDepartmentStats,
}

export default institutionService
