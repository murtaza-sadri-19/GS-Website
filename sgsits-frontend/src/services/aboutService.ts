/**
 * About Service — Institute profile, governance, administration
 *
 * All reads/writes call the backend CMS API directly via getCmsSection/saveCmsSection.
 */

import { getCmsSection, saveCmsSection } from './settingsService'

// ─── Types ────────────────────────────────────────────────────────────────────

export type VisionMissionData     = Record<string, unknown>
export type GoverningBodyData     = Record<string, unknown>
export type GovBodyCategory       = Record<string, unknown>
export type AcademicCouncilData   = Record<string, unknown>
export type AdminOfficial         = Record<string, unknown>
export type TelephoneEntry        = Record<string, unknown>
export type IQACData              = Record<string, unknown>
export type AccreditationData     = Record<string, unknown>
export type InfrastructureData    = Record<string, unknown>
export type DirectorMessageData   = Record<string, unknown>
export type CommitteeData         = Record<string, unknown>
export type CommitteeMember       = Record<string, unknown>
export type AboutInstituteData    = Record<string, unknown>

export type {
  VisionMissionData, GoverningBodyData, GovBodyCategory, AdminOfficial, TelephoneEntry,
  IQACData, AcademicCouncilData, AccreditationData, InfrastructureData,
  DirectorMessageData, CommitteeData, CommitteeMember, AboutInstituteData
}

// ─── Section fetchers ─────────────────────────────────────────────────────────

const s = <T>(key: string): Promise<T> =>
  getCmsSection<T>(key).then(d => d ?? ({} as T))

const arr = <T>(key: string): Promise<T[]> =>
  getCmsSection<T[]>(key).then(d => Array.isArray(d) ? d : [])

export const getAboutInstitute     = (): Promise<AboutInstituteData>  => s('about.overview')
export const getVisionMission      = (): Promise<VisionMissionData>   => s('about.vision_mission')
export const getGoverningBody      = (): Promise<GoverningBodyData>   => s('about.governing_body')
export const getAcademicCouncil    = (): Promise<AcademicCouncilData> => s('about.academic_council')
export const getAdministration     = (): Promise<AdminOfficial[]>     => arr('about.administration')
export const getTelephoneDirectory = (): Promise<TelephoneEntry[]>    => arr('about.telephone_directory')
export const getIQAC               = (): Promise<IQACData>            => s('about.iqac')
export const getAccreditation      = (): Promise<AccreditationData>   => s('about.accreditation')
export const getInfrastructure     = (): Promise<InfrastructureData>  => s('about.infrastructure')
export const getDirectorMessage    = (): Promise<DirectorMessageData> => s('about.leadership')
export const getCommittees         = (): Promise<CommitteeData[]>     => arr('about.committees')

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const visionMissionDefault:      VisionMissionData    = {}
export const governingBodyDefault:      GoverningBodyData    = {}
export const administrationDefault:     AdminOfficial[]      = []
export const telephoneDirectoryDefault: TelephoneEntry[]     = []
export const iqacDefault:               IQACData             = {}
export const academicCouncilDefault:    AcademicCouncilData  = {}
export const accreditationDefault:      AccreditationData    = {}
export const infrastructureDefault:     InfrastructureData   = {}
export const directorMessageDefault:    DirectorMessageData  = {}
export const committeesDefault:         CommitteeData[]      = []
export const aboutInstituteDefault:     AboutInstituteData   = {}

// ─── Custom pages ─────────────────────────────────────────────────────────────

export interface CustomPageData {
  slug: string
  title: string
  subtitle: string
  narrativeParagraphs: string[]
  highlights?: { iconName: string; label: string; value: string; desc: string }[]
  affiliations?: string[]
}

export const getCustomPages = async (): Promise<CustomPageData[]> => {
  const data = await getCmsSection<CustomPageData[]>('about.custom_pages')
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
