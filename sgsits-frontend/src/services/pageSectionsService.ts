/**
 * Page Sections Service
 *
 * Backend: GET  /api/v1/page-sections?page_key=:key          (public, active only)
 *          GET  /api/v1/page-sections?page_key=:key&all=1    (admin, all statuses)
 *          POST /api/v1/page-sections                         (CENTRAL_ADMIN)
 *          PUT  /api/v1/page-sections/:id                     (CENTRAL_ADMIN)
 *          PUT  /api/v1/page-sections/reorder                 (CENTRAL_ADMIN)
 *          DELETE /api/v1/page-sections/:id                   (CENTRAL_ADMIN)
 *          GET  /api/v1/page-sections/live-stats              (public)
 */

import apiClient from '../api/client'

export type SectionType =
  | 'hero' | 'stats' | 'cards' | 'nav_children'
  | 'links' | 'downloads' | 'gallery' | 'faq'
  | 'cta' | 'announcements' | 'dynamic_data' | 'html' | 'featured'

export interface PageSection {
  id: number
  page_key: string
  section_key: string
  section_type: SectionType
  title: string | null
  subtitle: string | null
  content: string | null
  settings_json: Record<string, any> | null
  display_order: number
  is_active: boolean
  updated_at: string
}

export interface LiveStats {
  departments:       number
  faculty:           number
  notices:           number
  downloads:         number
  upcomingEvents:    number
  news:              number
  placements:        number
  companies:         number
  yearsOfExcellence: number
}

// ── Read ──────────────────────────────────────────────────────────────────────

export const getPageSections = async (
  pageKey: string,
  { all = false } = {}
): Promise<PageSection[]> => {
  try {
    const params = all ? `page_key=${pageKey}&all=1` : `page_key=${pageKey}`
    const res = await apiClient.get(`/v1/page-sections?${params}`)
    return res.data?.data ?? []
  } catch {
    return []
  }
}

export const getLiveStats = async (): Promise<LiveStats | null> => {
  try {
    const res = await apiClient.get('/v1/page-sections/live-stats')
    return res.data?.data ?? null
  } catch {
    return null
  }
}

// ── Write (admin) ─────────────────────────────────────────────────────────────

export const createPageSection = async (
  data: Partial<PageSection>
): Promise<PageSection> => {
  const res = await apiClient.post('/v1/page-sections', data)
  return res.data.data
}

export const updatePageSection = async (
  id: number,
  data: Partial<PageSection>
): Promise<PageSection> => {
  const res = await apiClient.put(`/v1/page-sections/${id}`, data)
  return res.data.data
}

export const reorderPageSections = async (
  pageKey: string,
  orderedIds: number[]
): Promise<PageSection[]> => {
  const res = await apiClient.put('/v1/page-sections/reorder', {
    page_key: pageKey,
    ordered_ids: orderedIds,
  })
  return res.data.data
}

export const deletePageSection = async (id: number): Promise<void> => {
  await apiClient.delete(`/v1/page-sections/${id}`)
}
