/**
 * Home News Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.news
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeNewsConfig } from './types'
import { defaultHomeNewsConfig } from './mock'

const KEY = 'home.news'

export const getHomeNewsConfig = async (): Promise<HomeNewsConfig> => {
  const data = await getCmsSection<HomeNewsConfig>(KEY, defaultHomeNewsConfig)
  return { ...defaultHomeNewsConfig, ...data }
}

export const saveHomeNews = async (config: HomeNewsConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeNewsService = { getHomeNewsConfig, saveHomeNews }
export default homeNewsService
