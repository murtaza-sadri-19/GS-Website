/**
 * Home Departments Section CMS Service — Backend-driven
 * Reads/writes via GET/PUT /api/v1/settings/cms/home.departments
 */
import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { HomeDepartmentsConfig } from './types'
import { defaultHomeDepartmentsConfig } from './mock'

const KEY = 'home.departments'

export const getHomeDepartmentsConfig = async (): Promise<HomeDepartmentsConfig> => {
  const data = await getCmsSection<HomeDepartmentsConfig>(KEY, defaultHomeDepartmentsConfig)
  return { ...defaultHomeDepartmentsConfig, ...data }
}

export const saveHomeDepartments = async (config: HomeDepartmentsConfig): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const homeDepartmentsService = { getHomeDepartmentsConfig, saveHomeDepartments }
export default homeDepartmentsService
