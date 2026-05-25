/**
 * Navigation Service — wired to GS-Website backend
 *
 * Backend: GET  /api/v1/navigation  — fetch nav tree
 *          PUT  /api/v1/navigation  — replace nav tree (admin only)
 *
 * Section banners and sidebar links are stored in CMS sections:
 *   GET/PUT /api/v1/settings/cms/navigation.sidebar
 *   GET/PUT /api/v1/settings/cms/navigation.banners
 *
 * Falls back to mock data when backend unreachable.
 */

import apiClient from '../api/client'
import { getCmsSection, saveCmsSection } from './settingsService'
import {
  mockSidebarLinks,
  mockSectionBanners,
  mockDefaultSectionBanner,
  type SidebarLink,
  type SectionBanner,
} from '../mock/sidebar/sidebarData'
import { mockUiLabels } from '../mock/uilabels/uiLabelsData'

// ─── Sidebar Links ────────────────────────────────────────────────────────────

export const getAllSidebarLinks = async (): Promise<Record<string, SidebarLink[]>> => {
  const data = await getCmsSection<Record<string, SidebarLink[]>>(
    'navigation.sidebar',
    mockSidebarLinks
  )
  return data && typeof data === 'object' ? data : mockSidebarLinks
}

export const getSidebarLinks = async (section: string): Promise<SidebarLink[]> => {
  const all = await getAllSidebarLinks()
  return all[section] ?? mockSidebarLinks[section] ?? []
}

export const saveSidebarLinks = async (section: string, links: SidebarLink[]): Promise<void> => {
  const all = await getAllSidebarLinks()
  await saveCmsSection('navigation.sidebar', { ...all, [section]: links })
}

export const saveAllSidebarLinks = async (data: Record<string, SidebarLink[]>): Promise<void> => {
  await saveCmsSection('navigation.sidebar', data)
}

// ─── Section Banners ──────────────────────────────────────────────────────────

export const getAllSectionBanners = async (): Promise<Record<string, SectionBanner>> => {
  const data = await getCmsSection<Record<string, SectionBanner>>(
    'navigation.banners',
    mockSectionBanners
  )
  return data && typeof data === 'object' ? data : mockSectionBanners
}

export const getSectionBanner = async (section: string): Promise<SectionBanner> => {
  const all = await getAllSectionBanners()
  return all[section] ?? mockSectionBanners[section] ?? mockDefaultSectionBanner
}

export const saveSectionBanner = async (section: string, banner: SectionBanner): Promise<void> => {
  const all = await getAllSectionBanners()
  await saveCmsSection('navigation.banners', { ...all, [section]: banner })
}

// ─── Main Navigation Tree ────────────────────────────────────────────────────

export interface NavItem {
  id?: number | string
  label: string
  url?: string
  children?: NavItem[]
  is_external?: boolean
  display_order?: number
}

export const getNavTree = async (): Promise<NavItem[]> => {
  try {
    const res = await apiClient.get('/v1/navigation')
    const data = res.data?.data
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export const saveNavTree = async (items: NavItem[]): Promise<void> => {
  await apiClient.put('/v1/navigation', { items })
}

// ─── Quick Links ──────────────────────────────────────────────────────────────

export const getQuickLinks = async (): Promise<{ label: string; to: string }[]> => {
  try {
    const data = await getCmsSection<{ topBarQuickLinks?: { label: string; to: string }[] }>(
      'navigation.quick_links',
      { topBarQuickLinks: mockUiLabels.topBarQuickLinks }
    )
    return data?.topBarQuickLinks ?? mockUiLabels.topBarQuickLinks
  } catch {
    return mockUiLabels.topBarQuickLinks
  }
}

// ─── Sync defaults ────────────────────────────────────────────────────────────
export const sidebarLinksDefaults: Record<string, SidebarLink[]> = mockSidebarLinks
export const sectionBannersDefaults: Record<string, SectionBanner> = mockSectionBanners
export const defaultSectionBanner: SectionBanner = mockDefaultSectionBanner
export const quickLinksDefaults: { label: string; to: string }[] = mockUiLabels.topBarQuickLinks

export type { SidebarLink, SectionBanner }

export const navigationService = {
  getSidebarLinks,
  getAllSidebarLinks,
  saveSidebarLinks,
  saveAllSidebarLinks,
  getSectionBanner,
  getAllSectionBanners,
  saveSectionBanner,
  getNavTree,
  saveNavTree,
  getQuickLinks,
}

export default navigationService
