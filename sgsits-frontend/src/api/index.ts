/**
 * SGSITS Frontend — API Functions
 *
 * All functions now call the real GS-Website backend.
 * Mock fallback is used only when the backend is unreachable.
 *
 * Backend base URL: VITE_API_BASE_URL (defaults to http://localhost:8000/api)
 * All backend routes are /api/v1/* so apiClient baseURL should be
 *   http://localhost:8000/api  →  apiClient.get('/v1/notices')
 * or
 *   http://localhost:8000  →  apiClient.get('/api/v1/notices')
 *
 * Current setup: VITE_API_BASE_URL=http://localhost:8000/api  (no trailing /v1)
 */

import apiClient from './client'
import type {
  LoginResponse, Notice, NewsItem, Event, Tender, Alert,
  Faculty, GalleryAlbum, PlacementRecord, SiteSettings
} from '../types'

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'SGSITS Indore',
  tagline: 'Shri G.S. Institute of Technology & Science',
  directorName: '',
  contactEmail: 'info@sgsits.ac.in',
  contactPhone: '0731-2582700',
  address: 'Park Road, Indore - 452003, Madhya Pradesh, India',
  marqueeEnabled: true,
  maintenanceMode: false,
  socialLinks: {},
}

// ── Role → Dashboard route map ────────────────────────────────────────────────
const ROLE_ROUTES: Record<string, string> = {
  CENTRAL_ADMIN:     '/dashboard/central-admin/dashboard',
  EXAM_CONTROLLER:   '/dashboard/exam/dashboard',
  PLACEMENT_OFFICER: '/dashboard/placement/dashboard',
  HOD:               '/dashboard/hod/dashboard',
  TEACHER:           '/dashboard/teacher/dashboard',
  // Legacy fallback
  super_admin: '/dashboard/central-admin/dashboard',
  editor:      '/dashboard/central-admin/dashboard',
  faculty:     '/dashboard/teacher/dashboard',
  hod:         '/dashboard/hod/dashboard',
  exam_controller:   '/dashboard/exam/dashboard',
  placement_officer: '/dashboard/placement/dashboard',
}

// ── Shared login — single backend endpoint for ALL roles ──────────────────────
async function singleLogin(email: string, password: string): Promise<LoginResponse & { redirectTo: string }> {
  const res = await apiClient.post('/v1/auth/login', { email, password })
  const { token, user } = res.data.data
  const redirectTo = ROLE_ROUTES[user.role] || '/dashboard/central-admin/dashboard'
  return { token, user, redirectTo }
}

// ═══════════════════════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════════════════════
export const authAPI = {
  /**
   * Single login endpoint for all roles.
   * Backend: POST /api/v1/auth/login
   * Response: { success, data: { token, user: { id, name, email, role, department_id } } }
   */
  adminLogin: async (email: string, password: string): Promise<LoginResponse> => {
    return singleLogin(email, password)
  },

  facultyLogin: async (email: string, password: string): Promise<LoginResponse> => {
    return singleLogin(email, password)
  },

  hodLogin: async (email: string, password: string): Promise<LoginResponse> => {
    return singleLogin(email, password)
  },

  examLogin: async (email: string, password: string): Promise<LoginResponse> => {
    return singleLogin(email, password)
  },

  placementLogin: async (email: string, password: string): Promise<LoginResponse> => {
    return singleLogin(email, password)
  },

  getMe: async (): Promise<LoginResponse['user']> => {
    const res = await apiClient.get('/v1/auth/me')
    return res.data.data
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await apiClient.post('/v1/auth/change-password', { oldPassword, newPassword })
  },

  logout: async (): Promise<void> => {
    try { await apiClient.post('/v1/auth/logout') } catch { /* ignore */ }
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// NOTICES
// ═══════════════════════════════════════════════════════════════════════════

export const noticesAPI = {
  getAll: async (): Promise<Notice[]> => {
    try {
      const res = await apiClient.get('/v1/notices', { params: { pageSize: 100 } })
      return res.data?.data?.notices ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  create: async (data: Omit<Notice, 'id'>): Promise<Notice> => {
    const res = await apiClient.post('/v1/notices', {
      title:       (data as Record<string, unknown>).title,
      description: (data as Record<string, unknown>).description,
      notice_type: (data as Record<string, unknown>).type || 'GENERAL',
      status:      (data as Record<string, unknown>).isActive ? 'PUBLISHED' : 'DRAFT',
    })
    return res.data.data
  },

  update: async (id: string, data: Partial<Notice>): Promise<Notice> => {
    const res = await apiClient.put(`/v1/notices/${id}`, data)
    return res.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/notices/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// NEWS
// ═══════════════════════════════════════════════════════════════════════════

export const newsAPI = {
  getAll: async (): Promise<NewsItem[]> => {
    try {
      const res = await apiClient.get('/v1/news', { params: { pageSize: 50 } })
      return res.data?.data?.articles ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  create: async (data: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
    const res = await apiClient.post('/v1/news', {
      title:   (data as Record<string, unknown>).title,
      excerpt: (data as Record<string, unknown>).excerpt,
      content: (data as Record<string, unknown>).content,
      status:  (data as Record<string, unknown>).isActive ? 'PUBLISHED' : 'DRAFT',
    })
    return res.data.data
  },

  update: async (id: string, data: Partial<NewsItem>): Promise<NewsItem> => {
    const res = await apiClient.put(`/v1/news/${id}`, data)
    return res.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/news/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════════════════════════════════════════

export const eventsAPI = {
  getAll: async (): Promise<Event[]> => {
    try {
      const res = await apiClient.get('/v1/events', { params: { pageSize: 50 } })
      return res.data?.data?.events ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  create: async (data: Omit<Event, 'id'>): Promise<Event> => {
    const res = await apiClient.post('/v1/events', {
      title:      (data as Record<string, unknown>).title,
      description:(data as Record<string, unknown>).description,
      event_date: (data as Record<string, unknown>).date,
      status:     (data as Record<string, unknown>).isActive ? 'PUBLISHED' : 'DRAFT',
    })
    return res.data.data
  },

  update: async (id: string, data: Partial<Event>): Promise<Event> => {
    const res = await apiClient.put(`/v1/events/${id}`, data)
    return res.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/events/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// TENDERS
// ═══════════════════════════════════════════════════════════════════════════

export const tendersAPI = {
  getAll: async (): Promise<Tender[]> => {
    try {
      const res = await apiClient.get('/v1/tenders', { params: { pageSize: 50 } })
      return res.data?.data?.tenders ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  create: async (data: Omit<Tender, 'id'>): Promise<Tender> => {
    const res = await apiClient.post('/v1/tenders', data)
    return res.data.data
  },

  update: async (id: string, data: Partial<Tender>): Promise<Tender> => {
    const res = await apiClient.put(`/v1/tenders/${id}`, data)
    return res.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/tenders/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// ALERTS (Marquee)
// ═══════════════════════════════════════════════════════════════════════════

export const alertsAPI = {
  getAll: async (): Promise<Alert[]> => {
    try {
      const res = await apiClient.get('/v1/alerts')
      return res.data?.data ?? []
    } catch {
      return []
    }
  },

  create: async (data: Omit<Alert, 'id'>): Promise<Alert> => {
    const res = await apiClient.post('/v1/alerts', data)
    return res.data.data
  },

  update: async (id: string, data: Partial<Alert>): Promise<Alert> => {
    const res = await apiClient.put(`/v1/alerts/${id}`, data)
    return res.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/alerts/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// FACULTY
// ═══════════════════════════════════════════════════════════════════════════

export const facultyAPI = {
  getAll: async (): Promise<Faculty[]> => {
    try {
      const res = await apiClient.get('/v1/faculty', { params: { pageSize: 200 } })
      return res.data?.data?.faculty ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  create: async (data: Omit<Faculty, 'id'>): Promise<Faculty> => {
    const res = await apiClient.post('/v1/faculty', data)
    return res.data.data
  },

  update: async (id: string, data: Partial<Faculty>): Promise<Faculty> => {
    const res = await apiClient.put(`/v1/faculty/${id}`, data)
    return res.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/faculty/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════════════════════════════════════════

export const galleryAPI = {
  getAlbums: async (): Promise<GalleryAlbum[]> => {
    try {
      const res = await apiClient.get('/v1/gallery', { params: { pageSize: 50 } })
      return res.data?.data?.images ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  createAlbum: async (data: Omit<GalleryAlbum, 'id'>): Promise<GalleryAlbum> => {
    const res = await apiClient.post('/v1/gallery', data)
    return res.data.data
  },

  updateAlbum: async (id: string, data: Partial<GalleryAlbum>): Promise<GalleryAlbum> => {
    const res = await apiClient.put(`/v1/gallery/${id}`, data)
    return res.data.data
  },

  deleteAlbum: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/gallery/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// PLACEMENT
// ═══════════════════════════════════════════════════════════════════════════

export const placementAPI = {
  getRecords: async (): Promise<PlacementRecord[]> => {
    try {
      const res = await apiClient.get('/v1/placement/records', { params: { pageSize: 100 } })
      return res.data?.data?.records ?? res.data?.data ?? []
    } catch {
      return []
    }
  },

  createRecord: async (data: Omit<PlacementRecord, 'id'>): Promise<PlacementRecord> => {
    const res = await apiClient.post('/v1/placement', data)
    return res.data.data
  },

  updateRecord: async (id: string, data: Partial<PlacementRecord>): Promise<PlacementRecord> => {
    const res = await apiClient.put(`/v1/placement/${id}`, data)
    return res.data.data
  },

  deleteRecord: async (id: string): Promise<void> => {
    await apiClient.delete(`/v1/placement/${id}`)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════════════════════════════════

export const settingsAPI = {
  get: async (): Promise<SiteSettings> => {
    try {
      const res = await apiClient.get('/v1/settings')
      const data = res.data?.data
      if (!data || Object.keys(data).length === 0) {
        return DEFAULT_SETTINGS
      }

      // Parse marqueeEnabled and maintenanceMode to boolean if they are strings
      const marqueeEnabled = data.marqueeEnabled === 'true' || data.marqueeEnabled === true || (data.marqueeEnabled !== 'false' && data.marqueeEnabled !== false && DEFAULT_SETTINGS.marqueeEnabled)
      const maintenanceMode = data.maintenanceMode === 'true' || data.maintenanceMode === true || (data.maintenanceMode !== 'false' && data.maintenanceMode !== false && DEFAULT_SETTINGS.maintenanceMode)

      // Parse socialLinks if it comes back as a string
      let socialLinks = data.socialLinks
      if (typeof socialLinks === 'string') {
        try {
          socialLinks = JSON.parse(socialLinks)
        } catch {
          socialLinks = {}
        }
      }

      return {
        ...DEFAULT_SETTINGS,
        ...data,
        marqueeEnabled,
        maintenanceMode,
        socialLinks: {
          ...DEFAULT_SETTINGS.socialLinks,
          ...(socialLinks || {})
        }
      }
    } catch {
      return DEFAULT_SETTINGS
    }
  },

  update: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    const res = await apiClient.put('/v1/settings', data)
    const returnedData = res.data?.data
    if (!returnedData || Object.keys(returnedData).length === 0) {
      return data as SiteSettings
    }

    let socialLinks = returnedData.socialLinks
    if (typeof socialLinks === 'string') {
      try {
        socialLinks = JSON.parse(socialLinks)
      } catch {
        socialLinks = {}
      }
    }

    return {
      ...DEFAULT_SETTINGS,
      ...returnedData,
      marqueeEnabled: returnedData.marqueeEnabled === 'true' || returnedData.marqueeEnabled === true,
      maintenanceMode: returnedData.maintenanceMode === 'true' || returnedData.maintenanceMode === true,
      socialLinks: {
        ...DEFAULT_SETTINGS.socialLinks,
        ...(socialLinks || {})
      }
    }
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// CMS Sections (Footer, Home, etc.)
// ═══════════════════════════════════════════════════════════════════════════

export const cmsAPI = {
  getSection: async (sectionKey: string): Promise<unknown> => {
    try {
      const res = await apiClient.get(`/v1/settings/cms/${sectionKey}`)
      return res.data?.data
    } catch {
      return null
    }
  },

  saveSection: async (sectionKey: string, data: unknown): Promise<void> => {
    await apiClient.put(`/v1/settings/cms/${sectionKey}`, data)
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE / ATTACHMENT API  (2-step: register attachment → get file_id → pass to resource)
//
// Supports BOTH:
//   A. Real file upload  → POST /v1/files/upload  (multipart/form-data)
//   B. External link     → POST /v1/files/link    (JSON)
//
// Both return a file_id that any module (notices, downloads, events…) uses.
// ═══════════════════════════════════════════════════════════════════════════

export interface AttachmentRecord {
  id: number
  attachment_type: 'FILE' | 'EXTERNAL_LINK'
  original_name: string
  stored_name: string | null
  file_url: string
  external_url: string | null
  thumbnail_url: string | null
  alt_text: string | null
  meta_title: string | null
  meta_description: string | null
  file_type: string | null
  file_size: number | null
  storage_type: 'LOCAL' | 'CLOUDINARY' | 'EXTERNAL'
  uploaded_by: number
  uploader_name: string
  created_at: string
}

export const filesAPI = {
  /**
   * Upload a real binary file.
   * Returns the full AttachmentRecord (use .id as file_id when linking to a resource).
   */
  upload: async (
    file: File,
    usage?: string,
    onProgress?: (pct: number) => void
  ): Promise<AttachmentRecord> => {
    const formData = new FormData()
    formData.append('file', file)
    if (usage) formData.append('usage', usage)

    const res = await apiClient.post('/v1/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (evt) => {
            if (evt.total) onProgress(Math.round((evt.loaded * 100) / evt.total))
          }
        : undefined,
    })
    return res.data.data
  },

  /**
   * Register an external URL as an attachment.
   * Returns the full AttachmentRecord (use .id as file_id when linking to a resource).
   */
  registerLink: async (payload: {
    external_url: string
    original_name?: string
    alt_text?: string
    thumbnail_url?: string
    meta_title?: string
    meta_description?: string
    usage?: string
  }): Promise<AttachmentRecord> => {
    const res = await apiClient.post('/v1/files/link', payload)
    return res.data.data
  },

  /**
   * Update metadata on an existing EXTERNAL_LINK attachment.
   */
  updateLink: async (
    id: number,
    payload: Partial<{
      external_url: string
      original_name: string
      alt_text: string
      thumbnail_url: string
      meta_title: string
      meta_description: string
    }>
  ): Promise<AttachmentRecord> => {
    const res = await apiClient.patch(`/v1/files/link/${id}`, payload)
    return res.data.data
  },

  /**
   * Fetch a single attachment record.
   */
  getOne: async (id: number): Promise<AttachmentRecord> => {
    const res = await apiClient.get(`/v1/files/${id}`)
    return res.data.data
  },

  /**
   * Delete an attachment (owner or CENTRAL_ADMIN only).
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/v1/files/${id}`)
  },
}

// ── Re-export apiClient ────────────────────────────────────────────────────
export { apiClient }
