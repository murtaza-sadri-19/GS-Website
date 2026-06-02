/**
 * Students Service — Campus life sections (activities, NCC, NSS, scholarships, SSS)
 *
 * Backend: GET/PUT /api/v1/settings/cms/campus.*
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { type CustomPageData, getCustomPage as getCustomPageFromAbout } from './aboutService'

export type ActivitiesData           = Record<string, any>
export type NCCData                  = Record<string, any>
export type NSSData                  = Record<string, any>
export type ScholarshipGovtData      = Record<string, any>
export type ScholarshipInstituteData = Record<string, any>
export type SSSData                  = Record<string, any>

export type { CustomPageData }

const get = async <T>(key: string): Promise<T> =>
  ((await getCmsSection<T>(key)) ?? {}) as T

export const getActivities          = (): Promise<ActivitiesData>           => get('campus.activities')
export const getNCC                 = (): Promise<NCCData>                  => get('campus.ncc')
export const getNSS                 = (): Promise<NSSData>                  => get('campus.nss')
export const getScholarshipGovt     = (): Promise<ScholarshipGovtData>      => get('campus.scholarship_govt')
export const getScholarshipInstitute = (): Promise<ScholarshipInstituteData> => get('campus.scholarship_institute')
export const getSSS                 = (): Promise<SSSData>                  => get('campus.sss')

export const getCustomPage = async (slug: string): Promise<CustomPageData | null> =>
  getCustomPageFromAbout(slug)

export const saveActivities           = (data: ActivitiesData)          => saveCmsSection('campus.activities', data)
export const saveNCC                  = (data: NCCData)                 => saveCmsSection('campus.ncc', data)
export const saveNSS                  = (data: NSSData)                 => saveCmsSection('campus.nss', data)
export const saveScholarshipGovt      = (data: ScholarshipGovtData)     => saveCmsSection('campus.scholarship_govt', data)
export const saveScholarshipInstitute = (data: ScholarshipInstituteData) => saveCmsSection('campus.scholarship_institute', data)
export const saveSSS                  = (data: SSSData)                 => saveCmsSection('campus.sss', data)

export const activitiesDefault: ActivitiesData                  = {}
export const nccDefault: NCCData                                = {}
export const nssDefault: NSSData                                = {}
export const scholarshipGovtDefault: ScholarshipGovtData        = {}
export const scholarshipInstituteDefault: ScholarshipInstituteData = {}
export const sssDefault: SSSData                                = {}

export const studentsService = {
  getActivities, getNCC, getNSS, getScholarshipGovt, getScholarshipInstitute, getSSS,
  getCustomPage,
  saveActivities, saveNCC, saveNSS, saveScholarshipGovt, saveScholarshipInstitute, saveSSS,
}

export default studentsService
