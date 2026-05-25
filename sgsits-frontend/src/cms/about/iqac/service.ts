import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { IQACData } from './types'
import { defaultIQACData } from './mock'

const KEY = 'about.iqac'

export const getIQAC = async (): Promise<IQACData> => {
  const data = await getCmsSection<IQACData>(KEY, defaultIQACData)
  return { ...defaultIQACData, ...data }
}

export const saveIQAC = async (config: IQACData): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const iqacService = { getIQAC, saveIQAC }
export default iqacService
