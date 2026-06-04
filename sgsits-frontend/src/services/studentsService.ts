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
export const nccDefault: NCCData = {
  stats: [
    { value: '120+', label: 'Cadets Strength' },
    { value: 'Army Wing', label: 'Wing Type' },
    { value: '1960s', label: 'Established' },
  ],
  certificates: [
    { cert: 'A Certificate', desc: 'After 1st year — basic eligibility for government benefits' },
    { cert: 'B Certificate', desc: 'After 2nd year with camp — provides bonus marks in IPS/IFS selection, entry to PSBs' },
    { cert: 'C Certificate', desc: 'After 3rd year — direct entry into armed forces (officer level), bonus in government exams' },
  ],
  enrollmentRules: [
    'Open to all 1st and 2nd year students (UG only)',
    'Physical fitness test and interview conducted at beginning of academic year',
    'Weekly parade scheduled on Wednesday & Friday (5:00 PM – 7:00 PM)',
    'Uniform provided by NCC. Stipend and allowances during camps as per Govt. norms',
  ],
}
export const nssDefault: NSSData = {
  stats: [
    { value: '2', label: 'NSS Units' },
    { value: '200+', label: 'Active Volunteers' },
    { value: '500+', label: 'Blood Units/Year' },
    { value: '1000+', label: 'Trees Planted' },
  ],
  benefits: [
    'NSS Certificate awarded after 2 years of active service',
    'Grace marks in university examinations (as per RGPV/DAVV norms)',
    'Priority in hostel allotment for active NSS volunteers',
    'Award certificates at state and national level for outstanding volunteers',
    'Eligibility for NSS Republic Day Camp (National Level)',
  ],
  joinSteps: [
    'Open to all UG/PG students of SGSITS',
    'Registration at beginning of academic year through DSW office',
    'Minimum 120 hours of service per year required for certificate',
    'No prior experience required — training provided',
  ],
}
export const scholarshipGovtDefault: ScholarshipGovtData        = {}
export const scholarshipInstituteDefault: ScholarshipInstituteData = {}
export const sssDefault: SSSData                                = {}

export const studentsService = {
  getActivities, getNCC, getNSS, getScholarshipGovt, getScholarshipInstitute, getSSS,
  getCustomPage,
  saveActivities, saveNCC, saveNSS, saveScholarshipGovt, saveScholarshipInstitute, saveSSS,
}

export default studentsService
