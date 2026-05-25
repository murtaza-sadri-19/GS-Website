/**
 * Footer CMS Service
 *
 * Backend integration: GET/PUT /api/v1/settings/cms/footer.{section}
 *   e.g. GET /api/v1/settings/cms/footer.branding
 *        PUT /api/v1/settings/cms/footer.branding
 *
 * Write strategy: backend first — errors propagate so callers can show feedback.
 * Local in-memory cache is updated only after a successful backend write.
 * Read falls back to in-memory cache → localStorage snapshot → mock defaults.
 */

import apiClient from '../api/client'
import {
  mockFooterCmsData,
  type FooterCmsData,
  type FooterBranding,
  type FooterContact,
  type FooterSection,
  type FooterDepartmentConfig,
  type FooterPolicyLink,
  type FooterBottomBar,
  type FooterVisitorStats,
  type FooterSocialMedia,
  type FooterSeoMeta,
  type FooterLayoutConfig,
} from '../mock/footer/footerData'

// ─── localStorage read-cache (populated on first successful backend fetch) ────

const STORAGE_KEY = 'sgsits_footer_cms'

function loadLocalSnapshot(): FooterCmsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...mockFooterCmsData, ...JSON.parse(raw) }
  } catch { /* ignore corrupt data */ }
  return { ...mockFooterCmsData }
}

function persistLocalSnapshot(data: FooterCmsData): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* quota exceeded, ignore */ }
}

let _cache: FooterCmsData | null = null

function getCache(): FooterCmsData {
  if (!_cache) _cache = loadLocalSnapshot()
  return _cache
}

function updateCache(updater: (d: FooterCmsData) => FooterCmsData): void {
  _cache = updater({ ...getCache() })
  persistLocalSnapshot(_cache)
}

// ─── Backend helpers ──────────────────────────────────────────────────────────

/**
 * Read a single footer section from backend.
 * Falls back to cached value silently (read failures are non-fatal).
 */
async function cmsGet<T>(section: string, fallback: T): Promise<T> {
  try {
    const res = await apiClient.get(`/v1/settings/cms/footer.${section}`)
    return (res.data?.data ?? fallback) as T
  } catch {
    return fallback
  }
}

/**
 * Write a footer section to the backend.
 * Errors are NOT swallowed — callers must handle/display them.
 * Cache is updated only after a successful write.
 */
async function cmsPut<K extends keyof FooterCmsData>(section: K, data: FooterCmsData[K]): Promise<void> {
  await apiClient.put(`/v1/settings/cms/footer.${String(section)}`, data)
  updateCache(d => ({ ...d, [section]: data }))
}

// ─── Full footer data ─────────────────────────────────────────────────────────

export async function getFooterCmsData(): Promise<FooterCmsData> {
  try {
    const res = await apiClient.get('/v1/settings/cms/footer')
    const data = res.data?.data
    if (data && typeof data === 'object') {
      _cache = { ...mockFooterCmsData, ...data } as FooterCmsData
      persistLocalSnapshot(_cache)
      return _cache
    }
  } catch { /* fall through to cache */ }
  return getCache()
}

// ─── Per-section get/save ─────────────────────────────────────────────────────

export async function getBranding(): Promise<FooterBranding> {
  return cmsGet('branding', getCache().branding)
}
export async function saveBranding(data: FooterBranding): Promise<void> {
  await cmsPut('branding', data)
}

export async function getContact(): Promise<FooterContact> {
  return cmsGet('contact', getCache().contact)
}
export async function saveContact(data: FooterContact): Promise<void> {
  await cmsPut('contact', data)
}

export async function getQuickLinks(): Promise<FooterSection> {
  return cmsGet('quickLinks', getCache().quickLinks)
}
export async function saveQuickLinks(data: FooterSection): Promise<void> {
  await cmsPut('quickLinks', data)
}

export async function getStudentLinks(): Promise<FooterSection> {
  return cmsGet('studentLinks', getCache().studentLinks)
}
export async function saveStudentLinks(data: FooterSection): Promise<void> {
  await cmsPut('studentLinks', data)
}

export async function getDepartmentConfig(): Promise<FooterDepartmentConfig> {
  return cmsGet('departments', getCache().departments)
}
export async function saveDepartmentConfig(data: FooterDepartmentConfig): Promise<void> {
  await cmsPut('departments', data)
}

export async function getExternalLinks(): Promise<FooterSection> {
  return cmsGet('externalLinks', getCache().externalLinks)
}
export async function saveExternalLinks(data: FooterSection): Promise<void> {
  await cmsPut('externalLinks', data)
}

export async function getPolicyLinks(): Promise<FooterPolicyLink[]> {
  return cmsGet('policyLinks', getCache().policyLinks)
}
export async function savePolicyLinks(data: FooterPolicyLink[]): Promise<void> {
  await cmsPut('policyLinks', data)
}

export async function getBottomBar(): Promise<FooterBottomBar> {
  return cmsGet('bottomBar', getCache().bottomBar)
}
export async function saveBottomBar(data: FooterBottomBar): Promise<void> {
  await cmsPut('bottomBar', data)
}

export async function getVisitorStats(): Promise<FooterVisitorStats> {
  return cmsGet('visitorStats', getCache().visitorStats)
}
export async function saveVisitorStats(data: FooterVisitorStats): Promise<void> {
  await cmsPut('visitorStats', data)
}

export async function getSocialMedia(): Promise<FooterSocialMedia> {
  return cmsGet('socialMedia', getCache().socialMedia)
}
export async function saveSocialMedia(data: FooterSocialMedia): Promise<void> {
  await cmsPut('socialMedia', data)
}

export async function getSeoMeta(): Promise<FooterSeoMeta> {
  return cmsGet('seo', getCache().seo)
}
export async function saveSeoMeta(data: FooterSeoMeta): Promise<void> {
  await cmsPut('seo', data)
}

export async function getLayoutConfig(): Promise<FooterLayoutConfig> {
  return cmsGet('layout', getCache().layout)
}
export async function saveLayoutConfig(data: FooterLayoutConfig): Promise<void> {
  await cmsPut('layout', data)
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
export const footerCmsDefaults: FooterCmsData = mockFooterCmsData

// ─── Namespaced export ────────────────────────────────────────────────────────
export const footerService = {
  getFooterCmsData,
  getBranding,         saveBranding,
  getContact,          saveContact,
  getQuickLinks,       saveQuickLinks,
  getStudentLinks,     saveStudentLinks,
  getDepartmentConfig, saveDepartmentConfig,
  getExternalLinks,    saveExternalLinks,
  getPolicyLinks,      savePolicyLinks,
  getBottomBar,        saveBottomBar,
  getVisitorStats,     saveVisitorStats,
  getSocialMedia,      saveSocialMedia,
  getSeoMeta,          saveSeoMeta,
  getLayoutConfig,     saveLayoutConfig,
}

export default footerService

// Re-export types for consumers
export type {
  FooterCmsData,
  FooterBranding,
  FooterContact,
  FooterSection,
  FooterLink,
  FooterDepartmentConfig,
  FooterPolicyLink,
  FooterBottomBar,
  FooterVisitorStats,
  FooterSocialMedia,
  FooterSocialLink,
  FooterSeoMeta,
  FooterLayoutConfig,
} from '../mock/footer/footerData'
