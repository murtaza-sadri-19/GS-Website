/**
 * Faculty Service — Teacher profile, publications, research, qualifications
 *
 * All methods call the real GS-Website backend when authenticated.
 * Falls back to mock data when backend is unreachable (dev/offline).
 *
 * Backend endpoints:
 *   GET  /v1/faculty/me                    — own profile (TEACHER)
 *   PUT  /v1/faculty/me                    — update own profile (TEACHER)
 *   GET  /v1/faculty/me/publications       — own publications (TEACHER)
 *   POST /v1/faculty/me/publications       — create publication (TEACHER)
 *   PUT  /v1/faculty/me/publications/:id   — update publication (TEACHER)
 *   DELETE /v1/faculty/me/publications/:id — delete publication (TEACHER)
 *   (same pattern for /research and /qualifications)
 *   GET  /v1/faculty                       — public faculty list
 *   GET  /v1/faculty/:id                   — public faculty profile
 *   GET  /v1/faculty/:id/publications      — public profile publications
 *   GET  /v1/faculty/:id/research          — public profile research
 */

import apiClient from '../api/client'
import {
  mockTeacherProfile,         type TeacherProfile,
  mockTeacherPublications,    type Publication,
  mockTeacherResearch,        type ResearchProject,
  mockTeacherQualifications,  type Qualification,
  mockSubjectCOs,             type CourseOutcome,
  mockInstituteProfessors,    type InstituteProfessor,
  getProfessorBySlug,
  CURRENT_TEACHER_ID,
} from '../mock/faculty/facultyData'

export type {
  TeacherProfile, Publication, ResearchProject,
  Qualification, CourseOutcome, InstituteProfessor,
}

export { CURRENT_TEACHER_ID }

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapProfile(d: Record<string, unknown>): TeacherProfile {
  let subjects: string[] = []
  try {
    const raw = d.subjects_taught
    if (Array.isArray(raw)) subjects = raw.map(String)
    else if (typeof raw === 'string' && raw) subjects = JSON.parse(raw)
  } catch { /* ignore */ }
  return {
    faculty_id:          String(d.id || d.user_id || ''),
    name:                String(d.full_name || d.name || ''),
    email:               String(d.email || ''),
    phone:               String(d.phone || ''),
    designation:         String(d.designation || ''),
    qualification:       String(d.qualification || ''),
    experience_years:    Number(d.experience_years || 0),
    specialization:      String(d.specialization || ''),
    subjects_taught:     subjects,
    bio:                 String(d.bio || ''),
    profile_photo:       String(d.profile_photo || d.image_url || mockTeacherProfile.profile_photo),
    office_location:     String(d.office_location || ''),
    linkedin_url:        String(d.linkedin_url || ''),
    google_scholar_url:  String(d.google_scholar_url || ''),
    personal_website:    String(d.personal_website || ''),
    branch_id:           String(d.branch_id || d.department_id || ''),
    status:              (d.status === 'approved' || d.status === 'ACTIVE'
                            ? 'approved' : d.status === 'rejected' ? 'rejected' : 'pending') as TeacherProfile['status'],
    last_submitted:      String(d.updated_at || d.last_submitted || ''),
    approval_note:       d.approval_note ? String(d.approval_note) : undefined,
  }
}

function mapPublication(p: Record<string, unknown>): Publication {
  return {
    id:               String(p.id),
    title:            String(p.title || ''),
    journal_name:     String(p.journal_name || ''),
    publication_year: Number(p.publication_year || 0),
    authors:          String(p.authors || ''),
    publication_link: String(p.link || p.publication_link || ''),
    description:      String(p.description || ''),
    citation_count:   Number(p.citations || p.citation_count || 0),
    venue_type:       (p.venue_type as Publication['venue_type']) || 'Journal',
    status:           (p.status === 'published' ? 'published' : p.status === 'archived' ? 'archived' : 'draft') as Publication['status'],
  }
}

function mapResearch(r: Record<string, unknown>): ResearchProject {
  let collaborators: string[] = []
  try {
    if (Array.isArray(r.collaborators)) collaborators = r.collaborators.map(String)
    else if (typeof r.collaborators === 'string' && r.collaborators) collaborators = JSON.parse(r.collaborators)
  } catch { /* ignore */ }
  return {
    id:                   String(r.id),
    research_title:       String(r.title || ''),
    research_area:        String(r.research_area || r.area || ''),
    description:          String(r.description || ''),
    start_year:           Number(r.start_year || 0),
    end_year:             r.end_year ? Number(r.end_year) : undefined,
    status:               (r.status as ResearchProject['status']) || 'Ongoing',
    funding_agency:       r.funding_agency ? String(r.funding_agency) : undefined,
    funding_amount_lakh:  r.funding_amount ? Number(r.funding_amount) : undefined,
    collaborators,
    publish_status:       (r.publish_status === 'published' ? 'published' : 'draft') as ResearchProject['publish_status'],
  }
}

function mapQualification(q: Record<string, unknown>): Qualification {
  return {
    id:              String(q.id),
    degree:          String(q.degree || ''),
    institution:     String(q.institution || ''),
    year:            Number(q.year || 0),
    specialization:  String(q.specialization || ''),
    grade:           String(q.grade || ''),
    status:          'published' as Qualification['status'],
  }
}

// ─── Teacher Profile ──────────────────────────────────────────────────────────

export const getTeacherProfile = async (): Promise<TeacherProfile> => {
  try {
    const res = await apiClient.get('/v1/faculty/me')
    const d = res.data?.data
    if (!d) return { ...mockTeacherProfile }
    return mapProfile(d as Record<string, unknown>)
  } catch {
    return { ...mockTeacherProfile }
  }
}

export const updateTeacherProfile = async (data: Partial<TeacherProfile>): Promise<TeacherProfile> => {
  const res = await apiClient.put('/v1/faculty/me', data)
  const d = res.data?.data
  return d ? mapProfile(d as Record<string, unknown>) : { ...mockTeacherProfile, ...data }
}

// ─── Publications ──────────────────────────────────────────────────────────────

export const getPublications = async (): Promise<Publication[]> => {
  try {
    const res = await apiClient.get('/v1/faculty/me/publications')
    const raw = res.data?.data ?? []
    if (!Array.isArray(raw) || raw.length === 0) return [...mockTeacherPublications]
    return raw.map(p => mapPublication(p as Record<string, unknown>))
  } catch {
    return [...mockTeacherPublications]
  }
}

export const createPublication = async (data: Omit<Publication, 'id'>): Promise<Publication> => {
  const res = await apiClient.post('/v1/faculty/me/publications', {
    title:            data.title,
    journal_name:     data.journal_name,
    publication_year: data.publication_year,
    authors:          data.authors,
    link:             data.publication_link,
    citations:        data.citation_count,
    venue_type:       data.venue_type,
    status:           data.status,
  })
  return mapPublication(res.data?.data as Record<string, unknown>)
}

export const updatePublication = async (id: string, data: Partial<Publication>): Promise<Publication> => {
  const res = await apiClient.put(`/v1/faculty/me/publications/${id}`, {
    title:            data.title,
    journal_name:     data.journal_name,
    publication_year: data.publication_year,
    authors:          data.authors,
    link:             data.publication_link,
    citations:        data.citation_count,
    venue_type:       data.venue_type,
    status:           data.status,
  })
  return mapPublication(res.data?.data as Record<string, unknown>)
}

export const deletePublication = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/faculty/me/publications/${id}`)
}

// ─── Research Projects ────────────────────────────────────────────────────────

export const getResearchProjects = async (): Promise<ResearchProject[]> => {
  try {
    const res = await apiClient.get('/v1/faculty/me/research')
    const raw = res.data?.data ?? []
    if (!Array.isArray(raw) || raw.length === 0) return [...mockTeacherResearch]
    return raw.map(r => mapResearch(r as Record<string, unknown>))
  } catch {
    return [...mockTeacherResearch]
  }
}

export const createResearchProject = async (data: Omit<ResearchProject, 'id'>): Promise<ResearchProject> => {
  const res = await apiClient.post('/v1/faculty/me/research', {
    title:           data.research_title,
    research_area:   data.research_area,
    description:     data.description,
    start_year:      data.start_year,
    end_year:        data.end_year,
    status:          data.status,
    funding_agency:  data.funding_agency,
    funding_amount:  data.funding_amount_lakh,
  })
  return mapResearch(res.data?.data as Record<string, unknown>)
}

export const updateResearchProject = async (id: string, data: Partial<ResearchProject>): Promise<ResearchProject> => {
  const res = await apiClient.put(`/v1/faculty/me/research/${id}`, {
    title:           data.research_title,
    research_area:   data.research_area,
    description:     data.description,
    start_year:      data.start_year,
    end_year:        data.end_year,
    status:          data.status,
    funding_agency:  data.funding_agency,
    funding_amount:  data.funding_amount_lakh,
  })
  return mapResearch(res.data?.data as Record<string, unknown>)
}

export const deleteResearchProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/faculty/me/research/${id}`)
}

// ─── Qualifications ───────────────────────────────────────────────────────────

export const getQualifications = async (): Promise<Qualification[]> => {
  try {
    const res = await apiClient.get('/v1/faculty/me/qualifications')
    const raw = res.data?.data ?? []
    if (!Array.isArray(raw) || raw.length === 0) return [...mockTeacherQualifications]
    return raw.map(q => mapQualification(q as Record<string, unknown>))
  } catch {
    return [...mockTeacherQualifications]
  }
}

export const createQualification = async (data: Omit<Qualification, 'id'>): Promise<Qualification> => {
  const res = await apiClient.post('/v1/faculty/me/qualifications', {
    degree:         data.degree,
    institution:    data.institution,
    year:           data.year,
    specialization: data.specialization,
  })
  return mapQualification(res.data?.data as Record<string, unknown>)
}

export const updateQualification = async (id: string, data: Partial<Qualification>): Promise<Qualification> => {
  const res = await apiClient.put(`/v1/faculty/me/qualifications/${id}`, {
    degree:         data.degree,
    institution:    data.institution,
    year:           data.year,
    specialization: data.specialization,
  })
  return mapQualification(res.data?.data as Record<string, unknown>)
}

export const deleteQualification = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/faculty/me/qualifications/${id}`)
}

// ─── Course Outcomes (subject-scoped, stored in CMS/academic module) ──────────

export const getCourseOutcomes = async (subjectId: string): Promise<CourseOutcome[]> => {
  return [...(mockSubjectCOs[subjectId] ?? [])]
}

// ─── Institute Professors (public directory) ──────────────────────────────────

export const getInstituteProfessors = async (): Promise<InstituteProfessor[]> => {
  try {
    const res = await apiClient.get('/v1/faculty', { params: { pageSize: 200 } })
    const raw = res.data?.data?.faculty ?? res.data?.data ?? []
    if (!Array.isArray(raw) || raw.length === 0) return [...mockInstituteProfessors]
    return (raw as Record<string, unknown>[]).map(f => ({
      slug:        String(f.slug || f.id || ''),
      name:        String(f.full_name || f.name || ''),
      year:        String(f.joined_year || f.year || ''),
      department:  String(f.department_name || f.department || ''),
      image:       String(f.profile_photo || f.image_url || mockInstituteProfessors[0].image),
      profileText: String(f.bio || ''),
      achievements: [],
    }))
  } catch {
    return [...mockInstituteProfessors]
  }
}

export const getInstituteProfessorBySlug = async (slug: string): Promise<InstituteProfessor | undefined> => {
  try {
    const res = await apiClient.get(`/v1/faculty/${slug}`)
    const d = res.data?.data
    if (!d) return getProfessorBySlug(slug)
    return {
      slug:        String((d as Record<string, unknown>).slug || slug),
      name:        String((d as Record<string, unknown>).full_name || (d as Record<string, unknown>).name || ''),
      year:        String((d as Record<string, unknown>).joined_year || ''),
      department:  String((d as Record<string, unknown>).department_name || ''),
      image:       String((d as Record<string, unknown>).profile_photo || (d as Record<string, unknown>).image_url || ''),
      profileText: String((d as Record<string, unknown>).bio || ''),
      achievements: [],
    }
  } catch {
    return getProfessorBySlug(slug)
  }
}

// ─── Defaults (for no-flash initial render) ───────────────────────────────────

export const teacherProfileDefault: TeacherProfile           = mockTeacherProfile
export const publicationsDefault: Publication[]              = mockTeacherPublications
export const researchProjectsDefault: ResearchProject[]      = mockTeacherResearch
export const qualificationsDefault: Qualification[]          = mockTeacherQualifications
export const instituteProfessorsDefault: InstituteProfessor[] = mockInstituteProfessors

export const facultyService = {
  getTeacherProfile,
  updateTeacherProfile,
  getPublications,
  createPublication,
  updatePublication,
  deletePublication,
  getResearchProjects,
  createResearchProject,
  updateResearchProject,
  deleteResearchProject,
  getQualifications,
  createQualification,
  updateQualification,
  deleteQualification,
  getCourseOutcomes,
  getInstituteProfessors,
  getInstituteProfessorBySlug,
}

export default facultyService
