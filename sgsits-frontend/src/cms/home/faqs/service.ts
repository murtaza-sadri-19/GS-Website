/**
 * FAQs Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.faqs
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeFaqsConfig } from './types'
import { defaultHomeFaqsConfig } from './mock'

const KEY = 'home.faqs'

export const getHomeFaqsConfig = async (): Promise<HomeFaqsConfig> => {
  const data = await getCmsSection<HomeFaqsConfig>(KEY, defaultHomeFaqsConfig)
  return { ...defaultHomeFaqsConfig, ...data }
}

export const saveHomeFaqs = async (config: HomeFaqsConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeFaqsService = { getHomeFaqsConfig, saveHomeFaqs }
export default homeFaqsService
