/**
 * Home SEO CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.seo
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeSeoConfig } from './types'
import { defaultHomeSeoConfig } from './mock'

const KEY = 'home.seo'

export const getHomeSeoConfig = async (): Promise<HomeSeoConfig> => {
  const data = await getCmsSection<HomeSeoConfig>(KEY, defaultHomeSeoConfig)
  return { ...defaultHomeSeoConfig, ...data }
}

export const saveHomeSeo = async (config: HomeSeoConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeSeoService = { getHomeSeoConfig, saveHomeSeo }
export default homeSeoService
