/**
 * Campus Life Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.campus_life
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeCampusLifeConfig } from './types'
import { defaultHomeCampusLifeConfig } from './mock'

const KEY = 'home.campus_life'

export const getHomeCampusLifeConfig = async (): Promise<HomeCampusLifeConfig> => {
  const data = await getCmsSection<HomeCampusLifeConfig>(KEY, defaultHomeCampusLifeConfig)
  return { ...defaultHomeCampusLifeConfig, ...data }
}

export const saveHomeCampusLife = async (config: HomeCampusLifeConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeCampusLifeService = { getHomeCampusLifeConfig, saveHomeCampusLife }
export default homeCampusLifeService
