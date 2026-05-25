/**
 * Home Gallery Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.gallery
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeGalleryConfig } from './types'
import { defaultHomeGalleryConfig } from './mock'

const KEY = 'home.gallery'

export const getHomeGalleryConfig = async (): Promise<HomeGalleryConfig> => {
  const data = await getCmsSection<HomeGalleryConfig>(KEY, defaultHomeGalleryConfig)
  return { ...defaultHomeGalleryConfig, ...data }
}

export const saveHomeGallery = async (config: HomeGalleryConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeGalleryService = { getHomeGalleryConfig, saveHomeGallery }
export default homeGalleryService
