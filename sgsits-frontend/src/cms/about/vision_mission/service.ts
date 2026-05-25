import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { VisionMissionData } from './types'
import { defaultVisionMission } from './mock'

const KEY = 'about.vision_mission'

export const getVisionMission = async (): Promise<VisionMissionData> => {
  const data = await getCmsSection<VisionMissionData>(KEY, defaultVisionMission)
  return { ...defaultVisionMission, ...data }
}

export const saveVisionMission = async (config: VisionMissionData): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const visionMissionService = { getVisionMission, saveVisionMission }
export default visionMissionService
