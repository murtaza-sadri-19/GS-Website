/**
 * About CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.about
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AboutConfig } from './types'
import { defaultAboutConfig } from './mock'

const KEY = 'home.about'

export const getAboutConfig = async (): Promise<AboutConfig> => {
  const data = await getCmsSection<AboutConfig>(KEY, defaultAboutConfig)
  return { ...defaultAboutConfig, ...data }
}

export const saveAbout = async (config: AboutConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const aboutService = { getAboutConfig, saveAbout }
export default aboutService
