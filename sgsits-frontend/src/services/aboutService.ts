/**
 * About Service — Institute profile, governance, administration
 *
 * MOCK MODE — Returns mock data instantly.
 * When backend is ready, replace return statements with apiClient calls.
 *
 * Components MUST call this service — never import mock data directly.
 */

import { getAboutOverview } from '../cms/about/overview/service'
import { getVisionMission as getVisionMissionCms } from '../cms/about/vision_mission/service'
import { getGoverningBody as getGoverningBodyCms, getAcademicCouncil as getAcademicCouncilCms } from '../cms/about/governance/service'
import { getAdministration as getAdministrationCms, getTelephoneDirectory as getTelephoneDirectoryCms } from '../cms/about/directory/service'
import { getIQAC as getIQACCms } from '../cms/about/iqac/service'
import { getAccreditation as getAccreditationCms, getInfrastructure as getInfrastructureCms } from '../cms/about/accreditation_infra/service'
import { getDirectorMessage as getDirectorMessageCms } from '../cms/about/leadership/service'
import { getCommittees as getCommitteesCms } from '../cms/about/committees/service'

// Import from individual section types
import { type VisionMissionData } from '../cms/about/vision_mission/types'
import { type GoverningBodyData, type GovBodyCategory, type AcademicCouncilData } from '../cms/about/governance/types'
import { type AdminOfficial, type TelephoneEntry } from '../cms/about/directory/types'
import { type IQACData } from '../cms/about/iqac/types'
import { type AccreditationData, type InfrastructureData } from '../cms/about/accreditation_infra/types'
import { type DirectorMessageData } from '../cms/about/leadership/types'
import { type CommitteeData, type CommitteeMember } from '../cms/about/committees/types'
import { type AboutOverviewConfig as AboutInstituteData } from '../cms/about/overview/types'

export type {
  VisionMissionData, GoverningBodyData, GovBodyCategory, AdminOfficial, TelephoneEntry,
  IQACData, AcademicCouncilData, AccreditationData, InfrastructureData,
  DirectorMessageData, CommitteeData, CommitteeMember, AboutInstituteData
}

export const getAboutInstitute = async (): Promise<AboutInstituteData> => {
  return getAboutOverview()
}

export const getVisionMission = async (): Promise<VisionMissionData> => {
  return getVisionMissionCms()
}

export const getGoverningBody = async (): Promise<GoverningBodyData> => {
  return getGoverningBodyCms()
}

export const getAdministration = async (): Promise<AdminOfficial[]> => {
  return getAdministrationCms()
}

export const getTelephoneDirectory = async (): Promise<TelephoneEntry[]> => {
  return getTelephoneDirectoryCms()
}

export const getIQAC = async (): Promise<IQACData> => {
  return getIQACCms()
}

export const getAcademicCouncil = async (): Promise<AcademicCouncilData> => {
  return getAcademicCouncilCms()
}

export const getAccreditation = async (): Promise<AccreditationData> => {
  return getAccreditationCms()
}

export const getInfrastructure = async (): Promise<InfrastructureData> => {
  return getInfrastructureCms()
}

export const getDirectorMessage = async (): Promise<DirectorMessageData> => {
  return getDirectorMessageCms()
}

export const getCommittees = async (): Promise<CommitteeData[]> => {
  return getCommitteesCms()
}

// ─── Defaults (static mock values — no async call at module load) ─────────────
import { defaultVisionMission }        from '../cms/about/vision_mission/mock'
import { defaultGoverningBody, defaultAcademicCouncil } from '../cms/about/governance/mock'
import { defaultAdministration, defaultTelephoneDirectory } from '../cms/about/directory/mock'
import { defaultIQACData }             from '../cms/about/iqac/mock'
import { defaultAccreditation, defaultInfrastructure } from '../cms/about/accreditation_infra/mock'
import { defaultDirectorMessage }      from '../cms/about/leadership/mock'
import { defaultCommittees }           from '../cms/about/committees/mock'
import { defaultAboutOverviewConfig }  from '../cms/about/overview/mock'

export const visionMissionDefault: VisionMissionData      = defaultVisionMission
export const governingBodyDefault: GoverningBodyData      = defaultGoverningBody
export const administrationDefault: AdminOfficial[]       = defaultAdministration
export const telephoneDirectoryDefault: TelephoneEntry[]  = defaultTelephoneDirectory
export const iqacDefault: IQACData                        = defaultIQACData
export const academicCouncilDefault: AcademicCouncilData  = defaultAcademicCouncil
export const accreditationDefault: AccreditationData      = defaultAccreditation
export const infrastructureDefault: InfrastructureData    = defaultInfrastructure
export const directorMessageDefault: DirectorMessageData  = defaultDirectorMessage
export const committeesDefault: CommitteeData[]           = defaultCommittees
export const aboutInstituteDefault: AboutInstituteData    = defaultAboutOverviewConfig

export interface CustomPageData {
  slug: string
  title: string
  subtitle: string
  narrativeParagraphs: string[]
  highlights?: { iconName: string; label: string; value: string; desc: string }[]
  affiliations?: string[]
}

import { getCmsSection, saveCmsSection } from './settingsService'

export const getCustomPages = async (): Promise<CustomPageData[]> => {
  const data = await getCmsSection<CustomPageData[]>('about.custom_pages', [])
  return Array.isArray(data) ? data : []
}

export const getCustomPage = async (slug: string): Promise<CustomPageData | null> => {
  const pages = await getCustomPages()
  return pages.find(p => p.slug === slug) ?? null
}

export const saveCustomPages = async (pages: CustomPageData[]): Promise<void> => {
  await saveCmsSection('about.custom_pages', pages)
}

export const saveCustomPage = async (slug: string, data: Partial<CustomPageData>): Promise<void> => {
  const pages = await getCustomPages()
  const idx = pages.findIndex(p => p.slug === slug)
  if (idx >= 0) {
    pages[idx] = { ...pages[idx], ...data }
  } else {
    pages.push({ slug, title: '', subtitle: '', narrativeParagraphs: [], ...data })
  }
  await saveCmsSection('about.custom_pages', pages)
}

export const aboutService = {
  getAboutInstitute,
  getVisionMission, getGoverningBody, getAdministration, getTelephoneDirectory,
  getIQAC, getAcademicCouncil, getAccreditation, getInfrastructure,
  getDirectorMessage, getCommittees,
  getCustomPages, getCustomPage, saveCustomPages, saveCustomPage,
}

export default aboutService
