import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { DirectorMessageData } from './types'
import { defaultDirectorMessage } from './mock'

const KEY = 'about.leadership'

export const getDirectorMessage = async (): Promise<DirectorMessageData> => {
  const data = await getCmsSection<DirectorMessageData>(KEY, defaultDirectorMessage)
  return { ...defaultDirectorMessage, ...data }
}

export const saveDirectorMessage = async (config: DirectorMessageData): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const directorMessageService = { getDirectorMessage, saveDirectorMessage }
export default directorMessageService
