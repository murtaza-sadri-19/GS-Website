import { getCmsSection, saveCmsSection } from '../../../services/settingsService'
import type { CommitteeData } from './types'
import { defaultCommittees } from './mock'

const KEY = 'about.committees'

export const getCommittees = async (): Promise<CommitteeData[]> => {
  const data = await getCmsSection<CommitteeData[]>(KEY, defaultCommittees)
  return Array.isArray(data) ? data : defaultCommittees
}

export const saveCommittees = async (config: CommitteeData[]): Promise<void> => {
  await saveCmsSection(KEY, config)
}

export const committeesService = { getCommittees, saveCommittees }
export default committeesService
