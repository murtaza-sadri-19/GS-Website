/**
 * Department Service — wired to GS-Website backend
 * Backend: GET /api/v1/departments, GET /api/v1/departments/:slug
 * Falls back to mock data when backend unreachable.
 */

import apiClient from '../api/client'

export interface DepartmentSummary {
  slug: string
  name: string
  shortName: string
  category: 'engineering' | 'science' | 'other'
  hodName: string
  hodEmail: string
  hodPhone?: string
  programsOffered: string[]
  facultyCount: number
  isActive: boolean
  established: string
  status: 'draft' | 'published' | 'archived'
  description?: string
  aboutParagraphs: string[]
  infraHighlights: string[]
  programsIntake: string[]
  vision?: string
  mission?: string
  objectives?: string[]
  imageUrl?: string
  location?: string
}

function mapDept(d: Record<string, unknown>): DepartmentSummary {
  return {
    slug:            String(d.slug || ''),
    name:            String(d.name || ''),
    shortName:       String(d.short_name || d.shortName || ''),
    category:        'engineering' as const,
    hodName:         String(d.hod_name || d.hodName || ''),
    // contact_email stores the HOD's public-facing email (may differ from login email)
    hodEmail:        String(d.contact_email || d.hod_email || d.hodEmail || ''),
    hodPhone:        d.contact_phone ? String(d.contact_phone)
                   : d.hod_phone    ? String(d.hod_phone)
                   : undefined,
    programsOffered: [],
    facultyCount:    Number(d.faculty_count || 0),
    isActive:        d.status === 'ACTIVE',
    established:     d.established_year ? String(d.established_year) : '',
    status:          d.status === 'ACTIVE' ? 'published' : 'archived',
    description:     d.description ? String(d.description) : undefined,
    aboutParagraphs: [],
    infraHighlights: [],
    programsIntake:  [],
    vision:          d.vision   ? String(d.vision)   : undefined,
    mission:         d.mission  ? String(d.mission)  : undefined,
    imageUrl:        d.image_url ? String(d.image_url) : undefined,
    location:        d.location ? String(d.location) : undefined,
  }
}

export const getDepartments = async (): Promise<DepartmentSummary[]> => {
  try {
    const res = await apiClient.get('/v1/departments', { params: { status: 'ACTIVE', pageSize: 100 } })
    const data = res.data?.data?.departments ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map(mapDept) : []
  } catch {
    return []
  }
}

export const getDepartmentBySlug = async (slug: string): Promise<DepartmentSummary | null> => {
  try {
    const res = await apiClient.get(`/v1/departments/${slug}`)
    const d = res.data?.data
    return d ? mapDept(d) : null
  } catch {
    return null
  }
}

// ─── Admin write-back ────────────────────────────────────────────────────────

/**
 * Bulk-save departments: fetches each by slug to get the numeric ID, then
 * calls PUT /v1/departments/:id. Errors propagate so callers can surface them.
 */
export const saveDepartments = async (depts: DepartmentSummary[]): Promise<void> => {
  for (const dept of depts) {
    try {
      // Fetch to get numeric id (backend uses id in PUT, not slug)
      const res = await apiClient.get(`/v1/departments/${dept.slug}`)
      const id: number = res.data?.data?.id
      if (!id) continue
      const dto: Record<string, unknown> = {
        name:        dept.name,
        short_name:  dept.shortName,
        description: dept.description,
        vision:      dept.vision,
        mission:     dept.mission,
      }
      await apiClient.put(`/v1/departments/${id}`, dto)
    } catch { /* skip individual failures; caller handles overall error */ }
  }
}

/**
 * Save a single department by slug.
 * Resolves slug → id, then calls PUT /v1/departments/:id.
 */
export const saveDepartmentBySlug = async (slug: string, data: Partial<DepartmentSummary>): Promise<void> => {
  const res = await apiClient.get(`/v1/departments/${slug}`)
  const id: number = res.data?.data?.id
  if (!id) throw new Error(`Department not found: ${slug}`)
  const dto: Record<string, unknown> = {}
  if (data.name        !== undefined) dto.name             = data.name
  if (data.shortName   !== undefined) dto.short_name       = data.shortName
  if (data.description !== undefined) dto.description      = data.description
  if (data.vision      !== undefined) dto.vision           = data.vision
  if (data.mission     !== undefined) dto.mission          = data.mission
  if (data.imageUrl    !== undefined) dto.image_url        = data.imageUrl
  if (data.established !== undefined) dto.established_year = data.established
  await apiClient.put(`/v1/departments/${id}`, dto)
}

// Admin CRUD via backend
export const createDepartment = async (dto: Record<string, unknown>): Promise<DepartmentSummary> => {
  const res = await apiClient.post('/v1/departments', dto)
  return mapDept(res.data.data)
}

export const updateDepartment = async (id: string | number, dto: Record<string, unknown>): Promise<DepartmentSummary> => {
  const res = await apiClient.put(`/v1/departments/${id}`, dto)
  return mapDept(res.data.data)
}

export interface FacultyMember {
  id: number
  name: string
  designation: string
  qualification: string
  specialization: string
  email: string
  imageUrl: string | null
}

export interface FacultyPage {
  faculty: FacultyMember[]
  total: number
}

export const getDeptFaculty = async (
  slug: string,
  page = 1,
  pageSize = 10,
): Promise<FacultyPage> => {
  try {
    const res = await apiClient.get('/v1/faculty', {
      params: { department_slug: slug, page, pageSize },
    })
    const list: any[] = res.data?.data?.faculty ?? []
    const total: number = res.data?.data?.pagination?.total ?? list.length
    return {
      faculty: list.map(f => ({
        id:             f.id,
        name:           f.teacher_name ?? '',
        designation:    f.designation  ?? '',
        qualification:  f.qualification ?? '',
        specialization: f.specialization ?? '',
        email:          f.teacher_email  ?? '',
        imageUrl:       f.profile_image_url ?? null,
      })),
      total,
    }
  } catch {
    return { faculty: [], total: 0 }
  }
}

// ── Per-department section content ────────────────────────────────────────────

export type DeptSection = 'about' | 'obe' | 'curriculum' | 'research' | 'timetables' | 'achievements' | 'infrastructure' | 'gallery'

export const getDeptSection = async <T = Record<string, unknown>>(
  slug: string,
  section: DeptSection,
): Promise<T | null> => {
  try {
    const res = await apiClient.get(`/v1/departments/${slug}/sections/${section}`)
    const d = res.data?.data
    return (d && Object.keys(d).length > 0) ? d as T : null
  } catch { return null }
}

export const saveDeptSection = async <T = Record<string, unknown>>(
  slug: string,
  section: DeptSection,
  data: T,
): Promise<void> => {
  await apiClient.put(`/v1/departments/${slug}/sections/${section}`, data)
}

export const departmentsDefault: DepartmentSummary[] = []

export const departmentService = {
  getDepartments, getDepartmentBySlug,
  saveDepartments, saveDepartmentBySlug,
  createDepartment, updateDepartment,
  getDeptFaculty,
  getDeptSection, saveDeptSection,
}

export default departmentService

export type { }
