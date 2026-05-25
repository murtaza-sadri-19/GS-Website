/**
 * Director CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.director
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeDirectorConfig } from './types'
import { defaultHomeDirectorConfig } from './mock'

const KEY = 'home.director'

export const getHomeDirectorConfig = async (): Promise<HomeDirectorConfig> => {
  const data = await getCmsSection<HomeDirectorConfig>(KEY, defaultHomeDirectorConfig)
  return { ...defaultHomeDirectorConfig, ...data }
}

export const saveHomeDirector = async (config: HomeDirectorConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeDirectorService = { getHomeDirectorConfig, saveHomeDirector }
export default homeDirectorService
