/**
 * Settings Service — wired to GS-Website backend
 * Backend: GET/PUT /api/v1/settings, GET/PUT /api/v1/settings/cms/:section
 * Falls back to mock data when backend unreachable.
 */

import apiClient from '../api/client'
import {
  mockSiteSettings,
  mockFooterData,
  mockTopBarData,
  type FooterData,
  type TopBarData,
} from '../mock/settings/settingsData'
import type { SiteSettings } from '../types'

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const res = await apiClient.get('/v1/settings')
    return res.data?.data ?? mockSiteSettings
  } catch {
    return mockSiteSettings
  }
}

export const saveSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  await apiClient.put('/v1/settings', data)
}

export const getFooterData = async (): Promise<FooterData> => {
  try {
    const res = await apiClient.get('/v1/settings/cms/footer.legacy')
    return res.data?.data ?? mockFooterData
  } catch {
    return mockFooterData
  }
}

export const saveFooterData = async (data: FooterData): Promise<void> => {
  await apiClient.put('/v1/settings/cms/footer.legacy', data)
}

export const getTopBarData = async (): Promise<TopBarData> => {
  try {
    const res = await apiClient.get('/v1/settings/cms/topbar')
    return res.data?.data ?? mockTopBarData
  } catch {
    return mockTopBarData
  }
}

export const saveTopBarData = async (data: TopBarData): Promise<void> => {
  await apiClient.put('/v1/settings/cms/topbar', data)
}

export const getAlerts = async (): Promise<unknown[]> => {
  try {
    const res = await apiClient.get('/v1/alerts')
    return res.data?.data ?? []
  } catch {
    return []
  }
}

// ─── Generic CMS section get/put ─────────────────────────────────────────────

export const getCmsSection = async <T>(sectionKey: string, fallback: T): Promise<T> => {
  try {
    const res = await apiClient.get(`/v1/settings/cms/${sectionKey}`)
    return res.data?.data ?? fallback
  } catch {
    return fallback
  }
}

export const saveCmsSection = async (sectionKey: string, data: unknown): Promise<void> => {
  await apiClient.put(`/v1/settings/cms/${sectionKey}`, data)
}

// ─── Synchronous defaults for no-flash initial render ────────────────────────
export const siteSettingsDefaults: SiteSettings = mockSiteSettings
export const footerDefaults: FooterData         = mockFooterData
export const topBarDefaults: TopBarData         = mockTopBarData

export const settingsService = {
  getSiteSettings, saveSiteSettings,
  getFooterData, saveFooterData,
  getTopBarData, saveTopBarData,
  getAlerts,
  getCmsSection, saveCmsSection,
}

export default settingsService
