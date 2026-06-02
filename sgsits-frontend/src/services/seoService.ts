/**
 * SEO Service — Per-page dynamic meta tags
 *
 * Backend: GET/PUT /api/v1/settings/cms/seo
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export interface SeoMeta {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  [key: string]: any
}

const KEY = 'seo'

export const getAllPageSeo = async (): Promise<Record<string, SeoMeta> | null> => {
  return getCmsSection<Record<string, SeoMeta>>(KEY)
}

export const getPageSeo = async (pageKey: string): Promise<SeoMeta | null> => {
  const all = await getAllPageSeo()
  return all?.[pageKey] ?? null
}

export const saveAllPageSeo = async (data: Record<string, SeoMeta>): Promise<void> => {
  await saveCmsSection(KEY, data)
}

export const savePageSeo = async (pageKey: string, seo: SeoMeta): Promise<void> => {
  const all = (await getAllPageSeo()) ?? {}
  all[pageKey] = seo
  await saveCmsSection(KEY, all)
}

export const defaultSeoMeta: SeoMeta                     = {}
export const allSeoDefaults: Record<string, SeoMeta>     = {}

export const seoService = {
  getPageSeo,
  getAllPageSeo,
  savePageSeo,
  saveAllPageSeo,
}

export default seoService
