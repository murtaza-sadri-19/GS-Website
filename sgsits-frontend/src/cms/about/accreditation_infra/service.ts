import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { AccreditationData, InfrastructureData } from './types'
import { defaultAccreditation, defaultInfrastructure } from './mock'

export const getAccreditation = async (): Promise<AccreditationData> => {
  const data = await getCmsSection<AccreditationData>('about.accreditation', defaultAccreditation)
  return { ...defaultAccreditation, ...data }
}

export const saveAccreditation = async (config: AccreditationData): Promise<void> => {
  await saveCmsSection('about.accreditation', config)
}

export const getInfrastructure = async (): Promise<InfrastructureData> => {
  const data = await getCmsSection<InfrastructureData>('about.infrastructure', defaultInfrastructure)
  return { ...defaultInfrastructure, ...data }
}

export const saveInfrastructure = async (config: InfrastructureData): Promise<void> => {
  await saveCmsSection('about.infrastructure', config)
}

export const accreditationInfraService = { getAccreditation, saveAccreditation, getInfrastructure, saveInfrastructure }
export default accreditationInfraService
