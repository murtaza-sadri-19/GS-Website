/**
 * HOD Service — All department portal features wired to real backend APIs
 *
 * Backend endpoints used:
 *   GET  /api/v1/departments/:id          — department profile
 *   GET  /api/v1/leaves                   — leave review queue (HOD scoped)
 *   PUT  /api/v1/leaves/:id/approve       — approve leave
 *   PUT  /api/v1/leaves/:id/reject        — reject leave
 *   GET  /api/v1/timetables               — timetables (HOD scoped by dept)
 *   GET  /api/v1/timetables/:id           — timetable with entries
 *   PUT  /api/v1/timetables/:id/entries   — replace timetable entries
 *   GET  /api/v1/notices                  — department notices
 *   GET  /api/v1/events                   — department events
 *   GET  /api/v1/gallery                  — department gallery
 *   GET  /api/v1/downloads                — department downloads
 *   GET  /api/v1/labs                     — department labs
 *   GET  /api/v1/achievements             — department achievements
 */

import apiClient from '../api/client'
import type {
  LeaveApplication, TimetableSlot, TimetableDay,
  AttendanceSummary, DeptResultSummary,
  DepartmentProfile, HodNotice, HodDownload, HodEvent,
  HodGalleryAlbum, HodLab, HodAchievement,
} from '../types/hod'

export type {
  DepartmentProfile, LeaveApplication, TimetableSlot, TimetableDay, HodNotice,
  AttendanceSummary, DeptResultSummary, HodDownload, HodEvent,
  HodGalleryAlbum, HodLab, HodAchievement,
}

export const TIMETABLE_DAYS: TimetableDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const TIMETABLE_PERIODS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:15 - 12:15',
  '12:15 - 01:15',
  '02:00 - 03:00',
  '03:00 - 04:00',
]

// ─── Mappers ──────────────────────────────────────────────────────────────────

function mapLeave(r: Record<string, unknown>): LeaveApplication {
  return {
    id:           String(r.id),
    facultyId:    String(r.user_id || ''),
    facultyName:  String(r.applicant_name || r.user_name || ''),
    designation:  String(r.designation || ''),
    leaveType:    (String(r.leave_type || 'Casual')) as LeaveApplication['leaveType'],
    fromDate:     String(r.from_date || ''),
    toDate:       String(r.to_date || ''),
    days:         Number(r.days_count || 1),
    reason:       String(r.reason || ''),
    appliedOn:    String(r.applied_at || r.created_at || ''),
    status:       (String(r.status || 'pending')) as LeaveApplication['status'],
    attachmentUrl: r.attachment_file_id ? `/uploads/${r.attachment_file_id}` : undefined,
    remarks:      r.review_remarks ? String(r.review_remarks) : undefined,
  }
}

function mapTimetableEntries(tt: Record<string, unknown>): TimetableSlot[] {
  const entries = Array.isArray(tt.entries) ? tt.entries as Record<string, unknown>[] : []
  return entries.map((e, idx) => ({
    id:          String(e.id || `tt-${tt.id}-${idx}`),
    day:         (String(e.day_of_week || 'Mon')) as TimetableSlot['day'],
    period:      Number(e.period_no ?? 0),
    branch_id:   String(tt.department_id || ''),
    semester:    Number(tt.semester || 1),
    section:     String(tt.section_id || ''),
    subjectId:   String(e.subject_label || ''),
    subjectName: String(e.subject_label || ''),
    facultyId:   String(e.faculty_user_id || ''),
    facultyName: String(e.faculty_name || ''),
    room:        String(e.room || ''),
  }))
}

function mapDownload(r: Record<string, unknown>): HodDownload {
  return {
    id:           String(r.id),
    title:        String(r.title || ''),
    description:  String(r.description || ''),
    category:     (String(r.category || 'Reference')) as HodDownload['category'],
    semester:     r.semester ? Number(r.semester) : undefined,
    file_url:     String(r.file_url || r.file_id || ''),
    file_size_kb: Number(r.file_size_kb || r.file_size || 0),
    uploaded_on:  String(r.created_at || r.uploaded_on || ''),
    uploaded_by:  String(r.uploader_name || r.uploaded_by || ''),
    status:       (r.status === 'ACTIVE' || r.status === 'published' ? 'published' : 'draft') as HodDownload['status'],
  }
}

function mapLab(r: Record<string, unknown>): HodLab {
  let equipmentList: string[] = []
  if (Array.isArray(r.equipment_list)) {
    equipmentList = r.equipment_list.map(String)
  } else if (typeof r.equipment_list === 'string') {
    try { equipmentList = JSON.parse(r.equipment_list) } catch { equipmentList = [r.equipment_list] }
  }
  return {
    id:           String(r.id),
    lab_name:     String(r.name || r.lab_name || ''),
    description:  String(r.description || ''),
    lab_incharge: String(r.lab_incharge || r.incharge_name || ''),
    equipment_list: equipmentList,
    capacity:     Number(r.capacity || 0),
    room_no:      String(r.room_no || r.location || ''),
    image_url:    r.image_url ? String(r.image_url) : undefined,
    status:       (r.status === 'ACTIVE' || r.status === 'published' ? 'published' : 'draft') as HodLab['status'],
  }
}

function mapAchievement(r: Record<string, unknown>): HodAchievement {
  return {
    id:               String(r.id),
    title:            String(r.title || ''),
    description:      String(r.description || ''),
    achievement_date: String(r.awarded_date || r.achievement_date || r.created_at || ''),
    category:         (String(r.category || 'Student')) as HodAchievement['category'],
    image_url:        r.image_url ? String(r.image_url) : undefined,
    link_url:         r.link_url ? String(r.link_url) : undefined,
    status:           (r.status === 'PUBLISHED' || r.status === 'published' ? 'published' : 'draft') as HodAchievement['status'],
  }
}

// ─── Department Profile ───────────────────────────────────────────────────────

export const getDeptProfile = async (departmentId?: string | number): Promise<DepartmentProfile | null> => {
  if (!departmentId) return null
  try {
    const res = await apiClient.get(`/v1/departments/${departmentId}`)
    const d = res.data?.data
    if (!d) return null
    return {
      branch_id:       String(d.slug || d.id),
      department_name: String(d.name),
      short_name:      String(d.short_name || d.name),
      about:           String(d.description || ''),
      vision:          String(d.vision || ''),
      mission:         String(d.mission || ''),
      hod_message:     String(d.hod_message || ''),
      hod_name:        String(d.hod_name || ''),
      email:           String(d.email || ''),
      phone:           String(d.phone || ''),
      established:     String(d.established || ''),
      image_url:       String(d.image_url || ''),
      status:          (d.status?.toLowerCase() === 'published' || d.status === 'ACTIVE' ? 'published' : 'draft') as DepartmentProfile['status'],
      updated_at:      String(d.updated_at || ''),
    }
  } catch {
    return null
  }
}

// ─── Leave Applications ───────────────────────────────────────────────────────

export const getLeaveApplications = async (departmentId?: string | number): Promise<LeaveApplication[]> => {
  try {
    const params: Record<string, string | number> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/leaves', { params })
    const raw = res.data?.data ?? []
    return Array.isArray(raw) ? raw.map(mapLeave) : []
  } catch {
    return []
  }
}

export const approveLeave = async (id: string): Promise<void> => {
  await apiClient.put(`/v1/leaves/${id}/approve`)
}

export const rejectLeave = async (id: string, remarks?: string): Promise<void> => {
  await apiClient.put(`/v1/leaves/${id}/reject`, { remarks })
}

// ─── Timetable ────────────────────────────────────────────────────────────────

export const getTimetableSlots = async (departmentId?: string | number): Promise<TimetableSlot[]> => {
  try {
    const params: Record<string, string | number> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/timetables', { params })
    const timetables = res.data?.data ?? []
    if (!Array.isArray(timetables) || timetables.length === 0) return []

    const firstTt = timetables[0] as Record<string, unknown>
    if (firstTt.id) {
      const detailRes = await apiClient.get(`/v1/timetables/${firstTt.id}`)
      const detailed = detailRes.data?.data
      if (detailed && Array.isArray(detailed.entries) && detailed.entries.length > 0) {
        return mapTimetableEntries(detailed)
      }
    }
    return []
  } catch {
    return []
  }
}

export const saveTimetableEntries = async (
  timetableId: string | number,
  entries: Array<{
    day_of_week: string; period_no: number; subject_label?: string;
    faculty_user_id?: number; room?: string; start_time?: string; end_time?: string
  }>
): Promise<void> => {
  await apiClient.put(`/v1/timetables/${timetableId}/entries`, { entries })
}

// ─── Department Notices ───────────────────────────────────────────────────────

export const getHodNotices = async (departmentId?: string | number): Promise<HodNotice[]> => {
  try {
    const params: Record<string, string | number> = { pageSize: 50 }
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/notices', { params })
    const raw = res.data?.data?.notices ?? res.data?.data ?? []
    return Array.isArray(raw) ? raw.map((n: Record<string, unknown>) => ({
      id:           String(n.id),
      title:        String(n.title || ''),
      description:  String(n.description || n.body || ''),
      category:     String(n.notice_type || n.category || 'General') as HodNotice['category'],
      audience:     String(n.audience || 'All') as HodNotice['audience'],
      file_url:     n.file_url ? String(n.file_url) : undefined,
      publish_date: String(n.publish_date || n.created_at || ''),
      expiry_date:  n.expiry_date ? String(n.expiry_date) : undefined,
      status:       (n.status === 'PUBLISHED' ? 'published' : n.status === 'ARCHIVED' ? 'archived' : 'draft') as HodNotice['status'],
      pinned:       Boolean(n.pinned || false),
      created_by:   String(n.created_by_name || n.created_by || 'HOD Office'),
    })) : []
  } catch {
    return []
  }
}

// ─── Attendance Summary — no backend endpoint yet ─────────────────────────────

export const getAttendanceSummary = async (): Promise<AttendanceSummary[]> => {
  return []
}

// ─── Department Result Summary — no backend endpoint yet ─────────────────────

export const getDeptResultSummary = async (_departmentId?: string | number): Promise<DeptResultSummary[]> => {
  return []
}

// ─── Downloads ───────────────────────────────────────────────────────────────

export const getHodDownloads = async (departmentId?: string | number): Promise<HodDownload[]> => {
  try {
    const params: Record<string, string | number> = { pageSize: 50, status: 'ACTIVE' }
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/downloads', { params })
    const raw = res.data?.data?.downloads ?? res.data?.data ?? []
    return Array.isArray(raw) ? raw.map(mapDownload) : []
  } catch {
    return []
  }
}

// ─── Department Events ────────────────────────────────────────────────────────

export const getHodEvents = async (departmentId?: string | number): Promise<HodEvent[]> => {
  try {
    const params: Record<string, string | number> = { pageSize: 30 }
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/events', { params })
    const raw = res.data?.data?.events ?? res.data?.data ?? []
    return Array.isArray(raw) ? raw.map((e: Record<string, unknown>) => ({
      id:           String(e.id),
      title:        String(e.title || ''),
      description:  String(e.description || ''),
      event_type:   String(e.event_type || 'Workshop') as HodEvent['event_type'],
      venue:        String(e.venue || ''),
      start_date:   String(e.event_date || e.start_date || ''),
      end_date:     String(e.end_date || e.event_date || ''),
      organizer:    String(e.organizer || ''),
      poster_url:   e.image_url ? String(e.image_url) : undefined,
      status:       (e.status === 'PUBLISHED' ? 'published' : e.status === 'ARCHIVED' ? 'archived' : 'draft') as HodEvent['status'],
      audience:     String(e.audience || 'All') as HodEvent['audience'],
    })) : []
  } catch {
    return []
  }
}

// ─── Department Gallery ───────────────────────────────────────────────────────

export const getHodGallery = async (departmentId?: string | number): Promise<HodGalleryAlbum[]> => {
  try {
    const params: Record<string, string | number> = { pageSize: 30 }
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/gallery', { params })
    const raw = res.data?.data?.images ?? res.data?.data ?? []
    if (!Array.isArray(raw)) return []
    const map: Record<string, HodGalleryAlbum> = {}
    ;(raw as Record<string, unknown>[]).forEach((img) => {
      const cat = String(img.category || 'Other')
      if (!map[cat]) {
        map[cat] = {
          id:          `album-${cat}`,
          title:       cat,
          description: '',
          cover_url:   String(img.file_url || img.image_url || ''),
          image_count: 0,
          created_on:  String(img.created_at || ''),
          category:    'Other' as HodGalleryAlbum['category'],
          status:      'published',
        }
      }
      map[cat].image_count += 1
    })
    return Object.values(map)
  } catch {
    return []
  }
}

// ─── Labs ─────────────────────────────────────────────────────────────────────

export const getHodLabs = async (departmentId?: string | number): Promise<HodLab[]> => {
  try {
    const params: Record<string, string | number> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/labs', { params })
    const raw = res.data?.data ?? []
    return Array.isArray(raw) ? raw.map(mapLab) : []
  } catch {
    return []
  }
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const getHodAchievements = async (departmentId?: string | number): Promise<HodAchievement[]> => {
  try {
    const params: Record<string, string | number> = {}
    if (departmentId) params.department_id = departmentId
    const res = await apiClient.get('/v1/achievements', { params })
    const raw = res.data?.data ?? []
    return Array.isArray(raw) ? raw.map(mapAchievement) : []
  } catch {
    return []
  }
}

// ─── Notices CRUD ────────────────────────────────────────────────────────────

export const createHodNotice = async (data: Omit<HodNotice, 'id'>): Promise<HodNotice> => {
  const res = await apiClient.post('/v1/notices', {
    title: data.title, description: data.description, notice_type: data.category,
    audience: data.audience, file_url: data.file_url, publish_date: data.publish_date,
    expiry_date: data.expiry_date, status: data.status === 'published' ? 'PUBLISHED' : 'DRAFT',
    pinned: data.pinned,
  })
  const n = res.data?.data as Record<string, unknown>
  return { id: String(n.id), title: String(n.title || ''), description: String(n.description || ''),
    category: String(n.notice_type || n.category || 'General') as HodNotice['category'],
    audience: String(n.audience || 'All') as HodNotice['audience'],
    file_url: n.file_url ? String(n.file_url) : undefined,
    publish_date: String(n.publish_date || n.created_at || ''),
    expiry_date: n.expiry_date ? String(n.expiry_date) : undefined,
    status: (n.status === 'PUBLISHED' ? 'published' : n.status === 'ARCHIVED' ? 'archived' : 'draft') as HodNotice['status'],
    pinned: Boolean(n.pinned), created_by: String(n.created_by_name || 'HOD Office') }
}

export const updateHodNotice = async (id: string, data: Partial<HodNotice>): Promise<void> => {
  await apiClient.put(`/v1/notices/${id}`, {
    title: data.title, description: data.description, notice_type: data.category,
    audience: data.audience, file_url: data.file_url, publish_date: data.publish_date,
    expiry_date: data.expiry_date,
    status: data.status === 'published' ? 'PUBLISHED' : data.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
    pinned: data.pinned,
  })
}

export const deleteHodNotice = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/notices/${id}`)
}

// ─── Downloads CRUD ───────────────────────────────────────────────────────────

export const createHodDownload = async (data: Omit<HodDownload, 'id'>): Promise<HodDownload> => {
  const res = await apiClient.post('/v1/downloads', {
    title: data.title, description: data.description, category: data.category,
    semester: data.semester, file_url: data.file_url, file_size_kb: data.file_size_kb,
    status: data.status === 'published' ? 'ACTIVE' : 'DRAFT',
  })
  return mapDownload(res.data?.data as Record<string, unknown>)
}

export const updateHodDownload = async (id: string, data: Partial<HodDownload>): Promise<void> => {
  await apiClient.put(`/v1/downloads/${id}`, {
    title: data.title, description: data.description, category: data.category,
    semester: data.semester, file_url: data.file_url, file_size_kb: data.file_size_kb,
    status: data.status === 'published' ? 'ACTIVE' : data.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
  })
}

export const deleteHodDownload = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/downloads/${id}`)
}

// ─── Events CRUD ─────────────────────────────────────────────────────────────

export const createHodEvent = async (data: Omit<HodEvent, 'id'>): Promise<HodEvent> => {
  const res = await apiClient.post('/v1/events', {
    title: data.title, description: data.description, event_type: data.event_type,
    venue: data.venue, event_date: data.start_date, end_date: data.end_date,
    organizer: data.organizer, image_url: data.poster_url, audience: data.audience,
    status: data.status === 'published' ? 'PUBLISHED' : 'DRAFT',
  })
  const e = res.data?.data as Record<string, unknown>
  return { id: String(e.id), title: String(e.title || ''), description: String(e.description || ''),
    event_type: String(e.event_type || 'Workshop') as HodEvent['event_type'],
    venue: String(e.venue || ''), start_date: String(e.event_date || e.start_date || ''),
    end_date: String(e.end_date || ''), organizer: String(e.organizer || ''),
    poster_url: e.image_url ? String(e.image_url) : undefined,
    status: (e.status === 'PUBLISHED' ? 'published' : e.status === 'ARCHIVED' ? 'archived' : 'draft') as HodEvent['status'],
    audience: String(e.audience || 'All') as HodEvent['audience'] }
}

export const updateHodEvent = async (id: string, data: Partial<HodEvent>): Promise<void> => {
  await apiClient.put(`/v1/events/${id}`, {
    title: data.title, description: data.description, event_type: data.event_type,
    venue: data.venue, event_date: data.start_date, end_date: data.end_date,
    organizer: data.organizer, image_url: data.poster_url, audience: data.audience,
    status: data.status === 'published' ? 'PUBLISHED' : data.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
  })
}

export const deleteHodEvent = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/events/${id}`)
}

// ─── Gallery CRUD ─────────────────────────────────────────────────────────────

export const createHodGalleryAlbum = async (data: Omit<HodGalleryAlbum, 'id'>): Promise<HodGalleryAlbum> => {
  const res = await apiClient.post('/v1/gallery/albums', {
    title: data.title, description: data.description, cover_url: data.cover_url,
    category: data.category, status: data.status === 'published' ? 'PUBLISHED' : 'DRAFT',
  })
  const a = res.data?.data as Record<string, unknown>
  return { id: String(a.id), title: String(a.title || ''), description: String(a.description || ''),
    cover_url: String(a.cover_url || ''), image_count: Number(a.image_count || 0),
    created_on: String(a.created_at || ''),
    category: String(a.category || 'Other') as HodGalleryAlbum['category'],
    status: (a.status === 'PUBLISHED' ? 'published' : 'draft') as HodGalleryAlbum['status'] }
}

export const updateHodGalleryAlbum = async (id: string, data: Partial<HodGalleryAlbum>): Promise<void> => {
  await apiClient.put(`/v1/gallery/albums/${id}`, {
    title: data.title, description: data.description, cover_url: data.cover_url,
    category: data.category,
    status: data.status === 'published' ? 'PUBLISHED' : data.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
  })
}

export const deleteHodGalleryAlbum = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/gallery/albums/${id}`)
}

// ─── Labs CRUD ────────────────────────────────────────────────────────────────

export const createHodLab = async (data: Omit<HodLab, 'id'>): Promise<HodLab> => {
  const res = await apiClient.post('/v1/labs', {
    name: data.lab_name, description: data.description, lab_incharge: data.lab_incharge,
    equipment_list: data.equipment_list, capacity: data.capacity, room_no: data.room_no,
    image_url: data.image_url, status: data.status === 'published' ? 'ACTIVE' : 'DRAFT',
  })
  return mapLab(res.data?.data as Record<string, unknown>)
}

export const updateHodLab = async (id: string, data: Partial<HodLab>): Promise<void> => {
  await apiClient.put(`/v1/labs/${id}`, {
    name: data.lab_name, description: data.description, lab_incharge: data.lab_incharge,
    equipment_list: data.equipment_list, capacity: data.capacity, room_no: data.room_no,
    image_url: data.image_url,
    status: data.status === 'published' ? 'ACTIVE' : data.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
  })
}

export const deleteHodLab = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/labs/${id}`)
}

// ─── Achievements CRUD ────────────────────────────────────────────────────────

export const createHodAchievement = async (data: Omit<HodAchievement, 'id'>): Promise<HodAchievement> => {
  const res = await apiClient.post('/v1/achievements', {
    title: data.title, description: data.description, awarded_date: data.achievement_date,
    category: data.category, image_url: data.image_url, link_url: data.link_url,
    status: data.status === 'published' ? 'PUBLISHED' : 'DRAFT',
  })
  return mapAchievement(res.data?.data as Record<string, unknown>)
}

export const updateHodAchievement = async (id: string, data: Partial<HodAchievement>): Promise<void> => {
  await apiClient.put(`/v1/achievements/${id}`, {
    title: data.title, description: data.description, awarded_date: data.achievement_date,
    category: data.category, image_url: data.image_url, link_url: data.link_url,
    status: data.status === 'published' ? 'PUBLISHED' : data.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
  })
}

export const deleteHodAchievement = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/achievements/${id}`)
}

// ─── Defaults ────────────────────────────────────────────────────────────────
export const deptProfileDefault: DepartmentProfile | null   = null
export const leaveApplicationsDefault: LeaveApplication[]   = []
export const timetableSlotsDefault: TimetableSlot[]          = []
export const hodNoticesDefault: HodNotice[]                  = []
export const attendanceSummaryDefault: AttendanceSummary[]   = []
export const deptResultSummaryDefault: DeptResultSummary[]   = []
export const hodDownloadsDefault: HodDownload[]              = []
export const hodEventsDefault: HodEvent[]                    = []
export const hodGalleryDefault: HodGalleryAlbum[]            = []
export const hodLabsDefault: HodLab[]                        = []
export const hodAchievementsDefault: HodAchievement[]        = []

export const hodService = {
  getDeptProfile, getLeaveApplications, approveLeave, rejectLeave,
  getTimetableSlots, saveTimetableEntries,
  getHodNotices, createHodNotice, updateHodNotice, deleteHodNotice,
  getAttendanceSummary, getDeptResultSummary,
  getHodDownloads, createHodDownload, updateHodDownload, deleteHodDownload,
  getHodEvents, createHodEvent, updateHodEvent, deleteHodEvent,
  getHodGallery, createHodGalleryAlbum, updateHodGalleryAlbum, deleteHodGalleryAlbum,
  getHodLabs, createHodLab, updateHodLab, deleteHodLab,
  getHodAchievements, createHodAchievement, updateHodAchievement, deleteHodAchievement,
}

export default hodService
