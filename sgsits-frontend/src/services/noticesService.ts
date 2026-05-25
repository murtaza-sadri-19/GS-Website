/**
 * Notices Service
 *
 * Uses real backend: GET /api/v1/notices
 * Falls back to mock data when backend is unreachable (development safety net).
 */

import apiClient from '../api/client'
import { mockNotices } from '../mock/notices/noticesData'
import { mockHomePageData } from '../mock/home/homeData'
import type { Notice } from '../types'
import type { AnnouncementItem } from '../mock/home/homeData'

// Map backend notice to frontend Notice type
function mapNotice(n: Record<string, unknown>): Notice {
  const typeStr = String(n.notice_type || 'GENERAL').toUpperCase()
  let category = 'general'
  if (typeStr === 'DEPARTMENT') {
    category = 'academic'
  } else if (typeStr === 'EXAM') {
    category = 'exam'
  } else if (typeStr === 'PLACEMENT') {
    category = 'general'
  }

  return {
    id:          String(n.id),
    title:       String(n.title || ''),
    description: String(n.description || ''),
    date:        String(n.publish_date || n.created_at || ''),
    type:        typeStr as Notice['type'],
    category:    category,
    isActive:    n.status === 'PUBLISHED',
    fileUrl:     n.file_url ? String(n.file_url) : undefined,
    fileName:    n.original_name ? String(n.original_name) : undefined,
  }
}

export const getNotices = async (): Promise<Notice[]> => {
  try {
    const res = await apiClient.get('/v1/notices', { params: { status: 'PUBLISHED', pageSize: 100 } })
    const data = res.data?.data?.notices ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map(mapNotice) : []
  } catch {
    return mockNotices.filter(n => n.isActive)
  }
}

export const getHomeAnnouncements = async (): Promise<AnnouncementItem[]> => {
  try {
    const res = await apiClient.get('/v1/notices', { params: { status: 'PUBLISHED', pageSize: 7 } })
    const notices: Record<string, unknown>[] = res.data?.data?.notices ?? res.data?.data ?? []
    return notices.slice(0, 7).map((n) => {
      const rawDate = String(n.publish_date || n.created_at || '');
      let formattedDate = rawDate;
      if (rawDate) {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }
      }
      return {
        id:    String(n.id),
        title: String(n.title),
        date:  formattedDate,
        isNew: false,
        to:    '/notices',
      };
    })
  } catch {
    return [...mockHomePageData.announcements]
  }
}

export const getNoticeById = async (id: string): Promise<Notice | null> => {
  try {
    const res = await apiClient.get(`/v1/notices/${id}`)
    const n = res.data?.data
    return n ? mapNotice(n) : null
  } catch {
    return mockNotices.find(n => n.id === id) ?? null
  }
}

// Admin CRUD
export const createNotice = async (dto: Record<string, unknown>): Promise<Notice> => {
  const res = await apiClient.post('/v1/notices', dto)
  return mapNotice(res.data.data)
}

export const updateNotice = async (id: string | number, dto: Record<string, unknown>): Promise<Notice> => {
  const res = await apiClient.put(`/v1/notices/${id}`, dto)
  return mapNotice(res.data.data)
}

export const setNoticeStatus = async (id: string | number, status: string): Promise<Notice> => {
  const res = await apiClient.patch(`/v1/notices/${id}/status`, { status })
  return mapNotice(res.data.data)
}

export const deleteNotice = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/v1/notices/${id}`)
}

export const noticesDefaults: Notice[] = mockNotices.filter(n => n.isActive)

export const noticesService = {
  getNotices, getHomeAnnouncements, getNoticeById,
  createNotice, updateNotice, setNoticeStatus, deleteNotice,
}

export default noticesService
