/**
 * Home Stats Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.stats
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeStatsConfig } from './types'
import { defaultHomeStatsConfig } from './mock'

const KEY = 'home.stats'

export const getHomeStatsConfig = async (): Promise<HomeStatsConfig> => {
  const data = await getCmsSection<HomeStatsConfig>(KEY, defaultHomeStatsConfig)
  return { ...defaultHomeStatsConfig, ...data }
}

export const saveHomeStats = async (config: HomeStatsConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeStatsService = { getHomeStatsConfig, saveHomeStats }
export default homeStatsService
