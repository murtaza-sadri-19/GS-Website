/**
 * Academics Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.academics
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AcademicsSectionConfig } from './types'
import { defaultAcademicsConfig } from './mock'

const KEY = 'home.academics'

export const getAcademicsConfig = async (): Promise<AcademicsSectionConfig> => {
  const data = await getCmsSection<AcademicsSectionConfig>(KEY, defaultAcademicsConfig)
  return { ...defaultAcademicsConfig, ...data }
}

export const saveAcademics = async (config: AcademicsSectionConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeAcademicsService = { getAcademicsConfig, saveAcademics }
export default homeAcademicsService
