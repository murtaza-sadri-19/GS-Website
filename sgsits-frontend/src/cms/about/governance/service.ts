import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { GoverningBodyData, AcademicCouncilData } from './types'
import { defaultGoverningBody, defaultAcademicCouncil } from './mock'

export const getGoverningBody = async (): Promise<GoverningBodyData> => {
  const data = await getCmsSection<GoverningBodyData>('about.governing_body', defaultGoverningBody)
  return { ...defaultGoverningBody, ...data }
}

export const saveGoverningBody = async (config: GoverningBodyData): Promise<void> => {
  await saveCmsSection('about.governing_body', config)
}

export const getAcademicCouncil = async (): Promise<AcademicCouncilData> => {
  const data = await getCmsSection<AcademicCouncilData>('about.academic_council', defaultAcademicCouncil)
  return { ...defaultAcademicCouncil, ...data }
}

export const saveAcademicCouncil = async (config: AcademicCouncilData): Promise<void> => {
  await saveCmsSection('about.academic_council', config)
}

export const governanceService = { getGoverningBody, saveGoverningBody, getAcademicCouncil, saveAcademicCouncil }
export default governanceService
