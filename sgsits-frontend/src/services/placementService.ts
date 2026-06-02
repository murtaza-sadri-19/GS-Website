/**
 * Placement Service — wired to GS-Website backend
 *
 * Backend endpoints:
 *   GET /api/v1/placement/records          — placement records
 *   GET /api/v1/placement/companies        — recruiting companies
 *   GET /api/v1/placement/drives           — placement drives
 *   GET /api/v1/placement/internships      — internships
 *   GET /api/v1/placement/stats            — yearly placement stats
 *   GET /api/v1/placement/training-programs
 *   GET /api/v1/placement/notices
 *   GET /api/v1/placement/company-visits
 *
 * CMS sections (via GET/PUT /api/v1/settings/cms/:key):
 *   placement.tnp_team, placement.cell_info, placement.process,
 *   placement.contacts, placement.office_info
 */

import apiClient from '../api/client'
import { getCmsSection, saveCmsSection } from './settingsService'

export interface PlacementRecord {
  id: string
  title: string
  companyName: string
  academicYear: string
  description: string
  fileUrl?: string
  recordType: string
  status: string
}

export interface DeptPlacementStat {
  dept: string
  placed: number
  total: number
  avg: string
  highest: string
}

export interface TNPTeamMember {
  name: string
  designation?: string
  email?: string
  phone?: string
  photo?: string
  [key: string]: unknown
}

export interface PlacementProcessStep {
  step?: number
  title?: string
  description?: string
  [key: string]: unknown
}

export interface TNPCellInfo {
  aboutText?: string
  [key: string]: unknown
}

export interface LeadingCompany {
  name: string
  logo: string
  sector: string
}

export interface PlacementContactPerson {
  name?: string
  designation?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

export interface PlacementOfficeInfo {
  address?: string
  phone?: string
  email?: string
  [key: string]: unknown
}

export type {
  PlacementRecord, DeptPlacementStat, TNPTeamMember,
  PlacementProcessStep, TNPCellInfo, LeadingCompany,
  PlacementContactPerson, PlacementOfficeInfo,
}

// ─── Year-wise Placement Records ─────────────────────────────────────────────

function mapRecord(r: Record<string, unknown>): PlacementRecord {
  return {
    id:           String(r.id),
    title:        String(r.title || ''),
    companyName:  String(r.company_name || ''),
    academicYear: String(r.academic_year || ''),
    description:  String(r.description || ''),
    fileUrl:      r.file_url ? String(r.file_url) : undefined,
    recordType:   String(r.record_type || 'PLACEMENT_RECORD'),
    status:       String(r.status || 'ACTIVE'),
  }
}

export const getPlacementRecords = async (): Promise<PlacementRecord[]> => {
  try {
    const res = await apiClient.get('/v1/placement/records', { params: { pageSize: 100 } })
    const data = res.data?.data?.records ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map(mapRecord) : []
  } catch {
    return []
  }
}

// ─── Yearly Placement Stats ───────────────────────────────────────────────────

export const getDeptPlacement = async (): Promise<DeptPlacementStat[]> => {
  try {
    const res = await apiClient.get('/v1/placement/stats')
    const data: Record<string, unknown>[] = res.data?.data ?? []
    return Array.isArray(data) ? data.map((s) => ({
      dept:    String(s.department_name || s.dept || ''),
      placed:  Number(s.students_placed || s.placed || 0),
      total:   Number(s.total_students || s.total || 0),
      avg:     String(s.average_package || s.avg || ''),
      highest: String(s.highest_package || s.highest || ''),
    })) : []
  } catch {
    return []
  }
}

// ─── Recruiting Companies ─────────────────────────────────────────────────────

export const getRecruitingPartners = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/v1/placement/companies')
    const data: Record<string, unknown>[] = res.data?.data ?? []
    return Array.isArray(data) ? data.filter((c) => c.is_active !== false).map((c) => String(c.name)) : []
  } catch {
    return []
  }
}

// ─── Training Programs ────────────────────────────────────────────────────────

export const getTrainingPrograms = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/v1/placement/training-programs', { params: { pageSize: 50 } })
    const data: Record<string, unknown>[] = res.data?.data?.records ?? res.data?.data ?? []
    return Array.isArray(data) ? data.map((r) => String(r.title)) : []
  } catch {
    return []
  }
}

// ─── Leading Companies ────────────────────────────────────────────────────────

export const getLeadingCompanies = async (): Promise<LeadingCompany[]> => {
  try {
    const res = await apiClient.get('/v1/placement/companies')
    const data: Record<string, unknown>[] = res.data?.data ?? []
    return Array.isArray(data) ? data.slice(0, 20).map((c) => ({
      name:    String(c.name || ''),
      logo:    c.logo_url ? String(c.logo_url) : '',
      sector:  String(c.sector || ''),
    })) : []
  } catch {
    return []
  }
}

// ─── TNP Team — CMS section ───────────────────────────────────────────────────

export const getTNPTeam = async (): Promise<TNPTeamMember[]> => {
  const data = await getCmsSection<{ members: TNPTeamMember[] }>('placement.tnp_team')
  return Array.isArray(data?.members) ? data.members : []
}

export const saveTNPTeam = async (members: TNPTeamMember[]): Promise<void> => {
  await saveCmsSection('placement.tnp_team', { members })
}

// ─── TNP Cell Info — CMS section ─────────────────────────────────────────────

export const getTNPCellInfo = async (): Promise<TNPCellInfo> => {
  return (await getCmsSection<TNPCellInfo>('placement.cell_info')) ?? {} as TNPCellInfo
}

export const saveTNPCellInfo = async (info: TNPCellInfo): Promise<void> => {
  await saveCmsSection('placement.cell_info', info)
}

// ─── Placement Process Steps — CMS section ───────────────────────────────────

export const getPlacementProcess = async (): Promise<PlacementProcessStep[]> => {
  const data = await getCmsSection<{ steps: PlacementProcessStep[] }>('placement.process')
  return Array.isArray(data?.steps) ? data.steps : []
}

export const savePlacementProcess = async (steps: PlacementProcessStep[]): Promise<void> => {
  await saveCmsSection('placement.process', { steps })
}

// ─── Placement Contacts — CMS section ────────────────────────────────────────

export const getPlacementContacts = async (): Promise<PlacementContactPerson[]> => {
  const data = await getCmsSection<{ contacts: PlacementContactPerson[] }>('placement.contacts')
  return Array.isArray(data?.contacts) ? data.contacts : []
}

export const savePlacementContacts = async (contacts: PlacementContactPerson[]): Promise<void> => {
  await saveCmsSection('placement.contacts', { contacts })
}

// ─── Placement Office Info — CMS section ─────────────────────────────────────

export const getPlacementOfficeInfo = async (): Promise<PlacementOfficeInfo> => {
  return (await getCmsSection<PlacementOfficeInfo>('placement.office_info')) ?? {} as PlacementOfficeInfo
}

export const savePlacementOfficeInfo = async (info: PlacementOfficeInfo): Promise<void> => {
  await saveCmsSection('placement.office_info', info)
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export const createPlacementRecord = async (dto: Record<string, unknown>): Promise<PlacementRecord> => {
  const res = await apiClient.post('/v1/placement/records', dto)
  return mapRecord(res.data.data)
}

export const updatePlacementRecord = async (id: string | number, dto: Record<string, unknown>): Promise<PlacementRecord> => {
  const res = await apiClient.put(`/v1/placement/records/${id}`, dto)
  return mapRecord(res.data.data)
}

export const setPlacementStatus = async (id: string | number, status: string): Promise<PlacementRecord> => {
  const res = await apiClient.patch(`/v1/placement/records/${id}/status`, { status })
  return mapRecord(res.data.data)
}

export const deletePlacementRecord = async (id: string | number): Promise<void> => {
  await apiClient.delete(`/v1/placement/records/${id}`)
}

// ─── Defaults ────────────────────────────────────────────────────────────────
export const placementRecordsDefault: PlacementRecord[]          = []
export const deptPlacementDefault: DeptPlacementStat[]           = []
export const tnpTeamDefault: TNPTeamMember[]                     = []
export const placementProcessDefault: PlacementProcessStep[]     = []
export const trainingProgramsDefault: string[]                   = []
export const recruitingPartnersDefault: string[]                 = []
export const tnpCellInfoDefault: TNPCellInfo                     = {} as TNPCellInfo
export const leadingCompaniesDefault: LeadingCompany[]           = []
export const placementContactsDefault: PlacementContactPerson[]  = []
export const placementOfficeInfoDefault: PlacementOfficeInfo     = {} as PlacementOfficeInfo

export const placementService = {
  getPlacementRecords, getDeptPlacement, getTNPTeam, getPlacementProcess,
  getTrainingPrograms, getRecruitingPartners, getTNPCellInfo, getLeadingCompanies,
  getPlacementContacts, getPlacementOfficeInfo,
  saveTNPTeam, saveTNPCellInfo, savePlacementProcess, savePlacementContacts, savePlacementOfficeInfo,
  createPlacementRecord, updatePlacementRecord, setPlacementStatus, deletePlacementRecord,
}

export default placementService
