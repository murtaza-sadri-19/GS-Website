import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AboutSeoConfig } from './types'
import { defaultAboutSeoConfig } from './mock'

const KEY = 'seo.about'

export const getAboutSeoConfig = async (): Promise<AboutSeoConfig> => {
  const data = await getCmsSection<AboutSeoConfig>(KEY, defaultAboutSeoConfig)
  return { ...defaultAboutSeoConfig, ...data }
}

export const saveAboutSeo = async (config: AboutSeoConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const aboutSeoService = {
  getAboutSeoConfig,
  saveAboutSeo,
}

export default aboutSeoService
