/**
 * Settings Service — wired to GS-Website backend
 * Backend: GET/PUT /api/v1/settings, GET/PUT /api/v1/settings/cms/:section
 * Falls back to mock data when backend unreachable.
 */

import apiClient from '../api/client'
import type { SiteSettings } from '../types'

export interface FooterData {
  [key: string]: any
}

export interface TopBarData {
  helpline:       string
  email:          string
  instituteCode:  string
  [key: string]: any
}

export const getSiteSettings = async (): Promise<SiteSettings> => {
  try {
    const res = await apiClient.get('/v1/settings')
    return res.data?.data ?? siteSettingsDefaults
  } catch {
    return siteSettingsDefaults
  }
}

export const saveSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  await apiClient.put('/v1/settings', data)
}

export const getFooterData = async (): Promise<FooterData> => {
  try {
    const res = await apiClient.get('/v1/settings/cms/footer.legacy')
    return res.data?.data ?? footerDefaults
  } catch {
    return footerDefaults
  }
}

export const saveFooterData = async (data: FooterData): Promise<void> => {
  await apiClient.put('/v1/settings/cms/footer.legacy', data)
}

export const getTopBarData = async (): Promise<TopBarData> => {
  try {
    const res = await apiClient.get('/v1/settings/cms/topbar')
    return res.data?.data ?? topBarDefaults
  } catch {
    return topBarDefaults
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

export const getCmsSection = async <T>(sectionKey: string, _fallback?: T): Promise<T | null> => {
  try {
    const res = await apiClient.get(`/v1/settings/cms/${sectionKey}`)
    return res.data?.data ?? null
  } catch {
    return null
  }
}

export const saveCmsSection = async (sectionKey: string, data: unknown): Promise<void> => {
  await apiClient.put(`/v1/settings/cms/${sectionKey}`, data)
}

// ─── Synchronous defaults for no-flash initial render ────────────────────────
export const siteSettingsDefaults: SiteSettings    = {} as SiteSettings
export const footerDefaults: FooterData            = { columns: [], portals: { links: [] }, bottomLinks: [], institution: {}, visitorStats: null }
export const topBarDefaults: TopBarData            = {
  helpline:       '+91-731-2582100',
  email:          'registrar@sgsits.ac.in',
  instituteCode:  '1752',
}

export const settingsService = {
  getSiteSettings, saveSiteSettings,
  getFooterData, saveFooterData,
  getTopBarData, saveTopBarData,
  getAlerts,
  getCmsSection, saveCmsSection,
}

export default settingsService
