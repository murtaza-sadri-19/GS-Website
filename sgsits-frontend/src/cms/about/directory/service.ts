import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AdminOfficial, TelephoneEntry } from './types'
import { defaultAdministration, defaultTelephoneDirectory } from './mock'

export const getAdministration = async (): Promise<AdminOfficial[]> => {
  const data = await getCmsSection<AdminOfficial[]>('about.administration', defaultAdministration)
  return Array.isArray(data) ? data : defaultAdministration
}

export const saveAdministration = async (config: AdminOfficial[]): Promise<void> => {
  await saveCmsSection('about.administration', config)
}

export const getTelephoneDirectory = async (): Promise<TelephoneEntry[]> => {
  const data = await getCmsSection<TelephoneEntry[]>('about.telephone_directory', defaultTelephoneDirectory)
  return Array.isArray(data) ? data : defaultTelephoneDirectory
}

export const saveTelephoneDirectory = async (config: TelephoneEntry[]): Promise<void> => {
  await saveCmsSection('about.telephone_directory', config)
}

export const directoryService = { getAdministration, saveAdministration, getTelephoneDirectory, saveTelephoneDirectory }
export default directoryService
