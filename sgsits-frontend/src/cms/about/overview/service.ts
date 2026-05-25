import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AboutOverviewConfig } from './types'
import { defaultAboutOverviewConfig } from './mock'

const KEY = 'about.overview'

export const getAboutOverview = async (): Promise<AboutOverviewConfig> => {
  const data = await getCmsSection<AboutOverviewConfig>(KEY, defaultAboutOverviewConfig)
  return { ...defaultAboutOverviewConfig, ...data }
}

export const saveAboutOverview = async (config: AboutOverviewConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const aboutOverviewService = { getAboutOverview, saveAboutOverview }
export default aboutOverviewService
