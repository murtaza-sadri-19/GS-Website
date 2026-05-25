/**
 * SEO Service — Per-page dynamic meta tags
 *
 * Backend: GET/PUT /api/v1/settings/cms/seo
 * Falls back to mock defaults when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { mockSeoData, mockDefaultSeoMeta, type SeoMeta } from '../mock/seo/seoData'

const KEY = 'seo'

export const getAllPageSeo = async (): Promise<Record<string, SeoMeta>> => {
  const data = await getCmsSection<Record<string, SeoMeta>>(KEY, mockSeoData)
  return (data && typeof data === 'object' && !Array.isArray(data)) ? data : mockSeoData
}

export const getPageSeo = async (pageKey: string): Promise<SeoMeta> => {
  const all = await getAllPageSeo()
  return all[pageKey] ?? mockDefaultSeoMeta
}

export const saveAllPageSeo = async (data: Record<string, SeoMeta>): Promise<void> => {
  await saveCmsSection(KEY, data)
}

export const savePageSeo = async (pageKey: string, seo: SeoMeta): Promise<void> => {
  const all = await getAllPageSeo()
  all[pageKey] = seo
  await saveCmsSection(KEY, all)
}

/** Synchronous defaults — no-flash initial render */
export const defaultSeoMeta: SeoMeta              = mockDefaultSeoMeta
export const allSeoDefaults: Record<string, SeoMeta> = mockSeoData

export type { SeoMeta }

export const seoService = {
  getPageSeo,
  getAllPageSeo,
  savePageSeo,
  saveAllPageSeo,
}

export default seoService
