/**
 * Footer CMS Service
 *
 * Backend integration: GET/PUT /api/v1/settings/cms/footer.{section}
 *
 * Read falls back to in-memory defaults when backend is unreachable so the
 * editors always have something to render. Save still requires the backend.
 */

import apiClient from '../api/client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FooterLink {
  id: string
  label: string
  to?: string
  href?: string
  external?: boolean
  order: number
  visible: boolean
}

export interface FooterBranding {
  shortCode: string
  estYear: string
  instituteName: string
  shortName: string
  tagline: string
  subTagline: string
  description: string
  logoUrl: string
  logoAlt: string
  [key: string]: any
}

export interface FooterContact {
  address: string
  city: string
  phone: string
  fax: string
  email: string
  website: string
  [key: string]: any
}

export interface FooterSection {
  heading: string
  visible: boolean
  links: FooterLink[]
  [key: string]: any
}

export interface FooterDepartmentConfig {
  heading: string
  visible: boolean
  visibleSlugs: string[]
  maxVisible: number
  [key: string]: any
}

export interface FooterPolicyLink {
  id: string
  label: string
  to: string
  visible: boolean
  order: number
  [key: string]: any
}

export interface FooterBottomBar {
  copyrightText: string
  developerText: string
  showYear: boolean
  [key: string]: any
}

export interface FooterVisitorStats {
  enabled: boolean
  label: string
  count: number
  [key: string]: any
}

export interface FooterSocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  visible: boolean
}

export interface FooterSocialMedia {
  enabled: boolean
  links: FooterSocialLink[]
  [key: string]: any
}

export interface FooterSeoMeta {
  title: string
  description: string
  keywords: string
  ogImage: string
  footerMetaDescription: string
  schemaOrgEnabled: boolean
  openGraphEnabled: boolean
  [key: string]: any
}

export interface FooterLayoutConfig {
  showBrandingColumn: boolean
  showQuickLinks: boolean
  showStudentLinks: boolean
  showDepartmentLinks: boolean
  showExternalLinks: boolean
  showVisitorStats: boolean
  showSocialMedia: boolean
  showPolicyBar: boolean
  showBottomBar: boolean
  [key: string]: any
}

export interface FooterCmsData {
  branding: FooterBranding
  contact: FooterContact
  quickLinks: FooterSection
  studentLinks: FooterSection
  departments: FooterDepartmentConfig
  externalLinks: FooterSection
  policyLinks: FooterPolicyLink[]
  bottomBar: FooterBottomBar
  visitorStats: FooterVisitorStats
  socialMedia: FooterSocialMedia
  seo: FooterSeoMeta
  layout: FooterLayoutConfig
}

// ─── Per-section defaults (editors render from these when backend is down) ────

const D = {
  branding: {
    shortCode: 'SG',
    estYear: 'Est. 1952',
    instituteName: 'Shri G. S. Institute of Technology & Science',
    shortName: 'SGSITS INDORE',
    tagline: 'An Institute of National Standing',
    subTagline: 'Govt. Aided Autonomous Institute, Indore (M.P.) - Estd. 1952',
    description: '',
    logoUrl: '/assets/image.png',
    logoAlt: 'SGSITS Indore Logo',
  } as FooterBranding,

  contact: {
    address: '23, Park Road, Indore (M.P.) - 452003',
    city: 'Indore',
    phone: '0731-2541370',
    fax: '0731-2541370',
    email: 'info@sgsits.ac.in',
    website: 'www.sgsits.ac.in',
  } as FooterContact,

  quickLinks: {
    heading: 'Administration',
    visible: true,
    links: [],
  } as FooterSection,

  studentLinks: {
    heading: 'Student Zone',
    visible: true,
    links: [],
  } as FooterSection,

  departments: {
    heading: 'Departments',
    visible: false,
    visibleSlugs: [],
    maxVisible: 20,
  } as FooterDepartmentConfig,

  externalLinks: {
    heading: 'External Portals',
    visible: true,
    links: [],
  } as FooterSection,

  policyLinks: [] as FooterPolicyLink[],

  bottomBar: {
    copyrightText: '© 2025 SGSITS Indore. All rights reserved.',
    developerText: '',
    showYear: true,
  } as FooterBottomBar,

  visitorStats: {
    enabled: true,
    label: 'Visitors',
    count: 0,
  } as FooterVisitorStats,

  socialMedia: {
    enabled: false,
    links: [],
  } as FooterSocialMedia,

  seo: {
    title: 'SGSITS Indore — An Institute of National Standing',
    description: '',
    keywords: '',
    ogImage: '',
    footerMetaDescription: '',
    schemaOrgEnabled: false,
    openGraphEnabled: false,
  } as FooterSeoMeta,

  layout: {
    showBrandingColumn: true,
    showQuickLinks: true,
    showStudentLinks: true,
    showDepartmentLinks: false,
    showExternalLinks: true,
    showVisitorStats: true,
    showSocialMedia: false,
    showPolicyBar: true,
    showBottomBar: true,
  } as FooterLayoutConfig,
}

export const footerCmsDefaults: FooterCmsData = {
  branding:     D.branding,
  contact:      D.contact,
  quickLinks:   D.quickLinks,
  studentLinks: D.studentLinks,
  departments:  D.departments,
  externalLinks: D.externalLinks,
  policyLinks:  D.policyLinks,
  bottomBar:    D.bottomBar,
  visitorStats: D.visitorStats,
  socialMedia:  D.socialMedia,
  seo:          D.seo,
  layout:       D.layout,
}

// ─── Backend helpers ──────────────────────────────────────────────────────────

async function cmsGet<T>(section: string, fallback: T): Promise<T> {
  try {
    const res = await apiClient.get(`/v1/settings/cms/footer.${section}`)
    const data = res.data?.data
    return (data != null && typeof data === 'object')
      ? { ...fallback, ...data }
      : fallback
  } catch {
    return fallback
  }
}

async function cmsPut<K extends keyof FooterCmsData>(section: K, data: FooterCmsData[K]): Promise<void> {
  await apiClient.put(`/v1/settings/cms/footer.${String(section)}`, data)
}

// ─── Full footer data ─────────────────────────────────────────────────────────

export async function getFooterCmsData(): Promise<FooterCmsData> {
  try {
    const res = await apiClient.get('/v1/settings/cms/footer')
    const data = res.data?.data
    return (data && typeof data === 'object')
      ? { ...footerCmsDefaults, ...data } as FooterCmsData
      : footerCmsDefaults
  } catch {
    return footerCmsDefaults
  }
}

// ─── Per-section get/save ─────────────────────────────────────────────────────

export async function getBranding(): Promise<FooterBranding>         { return cmsGet('branding',      D.branding) }
export async function saveBranding(d: FooterBranding): Promise<void> { await cmsPut('branding', d) }

export async function getContact(): Promise<FooterContact>           { return cmsGet('contact',       D.contact) }
export async function saveContact(d: FooterContact): Promise<void>   { await cmsPut('contact', d) }

export async function getQuickLinks(): Promise<FooterSection>              { return cmsGet('quickLinks',   D.quickLinks) }
export async function saveQuickLinks(d: FooterSection): Promise<void>      { await cmsPut('quickLinks', d) }

export async function getStudentLinks(): Promise<FooterSection>            { return cmsGet('studentLinks', D.studentLinks) }
export async function saveStudentLinks(d: FooterSection): Promise<void>    { await cmsPut('studentLinks', d) }

export async function getDepartmentConfig(): Promise<FooterDepartmentConfig>        { return cmsGet('departments',  D.departments) }
export async function saveDepartmentConfig(d: FooterDepartmentConfig): Promise<void> { await cmsPut('departments', d) }

export async function getExternalLinks(): Promise<FooterSection>           { return cmsGet('externalLinks', D.externalLinks) }
export async function saveExternalLinks(d: FooterSection): Promise<void>   { await cmsPut('externalLinks', d) }

export async function getPolicyLinks(): Promise<FooterPolicyLink[]>         { return cmsGet('policyLinks',  D.policyLinks) }
export async function savePolicyLinks(d: FooterPolicyLink[]): Promise<void> { await cmsPut('policyLinks', d) }

export async function getBottomBar(): Promise<FooterBottomBar>             { return cmsGet('bottomBar',    D.bottomBar) }
export async function saveBottomBar(d: FooterBottomBar): Promise<void>     { await cmsPut('bottomBar', d) }

export async function getVisitorStats(): Promise<FooterVisitorStats>           { return cmsGet('visitorStats', D.visitorStats) }
export async function saveVisitorStats(d: FooterVisitorStats): Promise<void>   { await cmsPut('visitorStats', d) }

export async function getSocialMedia(): Promise<FooterSocialMedia>         { return cmsGet('socialMedia',  D.socialMedia) }
export async function saveSocialMedia(d: FooterSocialMedia): Promise<void> { await cmsPut('socialMedia', d) }

export async function getSeoMeta(): Promise<FooterSeoMeta>             { return cmsGet('seo',    D.seo) }
export async function saveSeoMeta(d: FooterSeoMeta): Promise<void>     { await cmsPut('seo', d) }

export async function getLayoutConfig(): Promise<FooterLayoutConfig>           { return cmsGet('layout',   D.layout) }
export async function saveLayoutConfig(d: FooterLayoutConfig): Promise<void>   { await cmsPut('layout', d) }

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
