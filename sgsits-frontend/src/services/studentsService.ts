/**
 * Students Service — Campus life sections (activities, NCC, NSS, scholarships, SSS)
 *
 * Backend: GET/PUT /api/v1/settings/cms/campus.*
 * Falls back to mock defaults when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import { type CustomPageData, getCustomPage as getCustomPageFromAbout } from './aboutService'
import {
  mockActivities,           type ActivitiesData,
  mockNCC,                  type NCCData,
  mockNSS,                  type NSSData,
  mockScholarshipGovt,      type ScholarshipGovtData,
  mockScholarshipInstitute, type ScholarshipInstituteData,
  mockSSS,                  type SSSData,
} from '../mock/students/studentsData'

export type {
  ActivitiesData, NCCData, NSSData,
  ScholarshipGovtData, ScholarshipInstituteData, SSSData,
  CustomPageData,
}

export const getActivities = async (): Promise<ActivitiesData> => {
  const data = await getCmsSection<ActivitiesData>('campus.activities', mockActivities)
  return data ?? mockActivities
}

export const getNCC = async (): Promise<NCCData> => {
  const data = await getCmsSection<NCCData>('campus.ncc', mockNCC)
  return data ?? mockNCC
}

export const getNSS = async (): Promise<NSSData> => {
  const data = await getCmsSection<NSSData>('campus.nss', mockNSS)
  return data ?? mockNSS
}

export const getScholarshipGovt = async (): Promise<ScholarshipGovtData> => {
  const data = await getCmsSection<ScholarshipGovtData>('campus.scholarship_govt', mockScholarshipGovt)
  return data ?? mockScholarshipGovt
}

export const getScholarshipInstitute = async (): Promise<ScholarshipInstituteData> => {
  const data = await getCmsSection<ScholarshipInstituteData>('campus.scholarship_institute', mockScholarshipInstitute)
  return data ?? mockScholarshipInstitute
}

export const getSSS = async (): Promise<SSSData> => {
  const data = await getCmsSection<SSSData>('campus.sss', mockSSS)
  return data ?? mockSSS
}

/** Delegate custom-page lookup to aboutService (single source of truth) */
export const getCustomPage = async (slug: string): Promise<CustomPageData | null> => {
  return getCustomPageFromAbout(slug)
}

// ─── Write operations ─────────────────────────────────────────────────────────
export const saveActivities          = (data: ActivitiesData)          => saveCmsSection('campus.activities', data)
export const saveNCC                 = (data: NCCData)                 => saveCmsSection('campus.ncc', data)
export const saveNSS                 = (data: NSSData)                 => saveCmsSection('campus.nss', data)
export const saveScholarshipGovt     = (data: ScholarshipGovtData)     => saveCmsSection('campus.scholarship_govt', data)
export const saveScholarshipInstitute = (data: ScholarshipInstituteData) => saveCmsSection('campus.scholarship_institute', data)
export const saveSSS                 = (data: SSSData)                 => saveCmsSection('campus.sss', data)

// ─── Defaults ────────────────────────────────────────────────────────────────
export const activitiesDefault: ActivitiesData                = mockActivities
export const nccDefault: NCCData                              = mockNCC
export const nssDefault: NSSData                              = mockNSS
export const scholarshipGovtDefault: ScholarshipGovtData      = mockScholarshipGovt
export const scholarshipInstituteDefault: ScholarshipInstituteData = mockScholarshipInstitute
export const sssDefault: SSSData                              = mockSSS

export const studentsService = {
  getActivities, getNCC, getNSS, getScholarshipGovt, getScholarshipInstitute, getSSS,
  getCustomPage,
  saveActivities, saveNCC, saveNSS, saveScholarshipGovt, saveScholarshipInstitute, saveSSS,
}

export default studentsService
