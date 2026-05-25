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
 *
 * Falls back to mock defaults when backend unreachable.
 */

import apiClient from '../api/client'
import { getCmsSection, saveCmsSection } from './settingsService'
import {
  mockPlacementRecords,
  mockDeptPlacement,
  mockTNPTeam,
  mockPlacementProcess,
  mockTrainingPrograms,
  mockRecruitingPartners,
  mockPlacementContacts,
  mockPlacementOfficeInfo,
  mockTNPCellInfo,
  mockLeadingCompanies,
  type PlacementRecord,
  type DeptPlacementStat,
  type TNPTeamMember,
  type PlacementProcessStep,
  type TNPCellInfo,
  type LeadingCompany,
  type PlacementContactPerson,
  type PlacementOfficeInfo,
} from '../mock/placement/placementData'

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
    return mockPlacementRecords
  }
}

// ─── Yearly Placement Stats ───────────────────────────────────────────────────

export const getDeptPlacement = async (): Promise<DeptPlacementStat[]> => {
  try {
    const res = await apiClient.get('/v1/placement/stats')
    const data: Record<string, unknown>[] = res.data?.data ?? []
    if (!Array.isArray(data) || data.length === 0) return mockDeptPlacement
    return data.map((s) => ({
      dept:    String(s.department_name || s.dept || ''),
      placed:  Number(s.students_placed || s.placed || 0),
      total:   Number(s.total_students || s.total || 0),
      avg:     String(s.average_package || s.avg || ''),
      highest: String(s.highest_package || s.highest || ''),
    }))
  } catch {
    return mockDeptPlacement
  }
}

// ─── Recruiting Companies ─────────────────────────────────────────────────────

export const getRecruitingPartners = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/v1/placement/companies')
    const data: Record<string, unknown>[] = res.data?.data ?? []
    if (Array.isArray(data) && data.length > 0) {
      return data.filter((c) => c.is_active !== false).map((c) => String(c.name))
    }
    return mockRecruitingPartners
  } catch {
    return mockRecruitingPartners
  }
}

// ─── Training Programs ────────────────────────────────────────────────────────

export const getTrainingPrograms = async (): Promise<string[]> => {
  try {
    const res = await apiClient.get('/v1/placement/training-programs', { params: { pageSize: 50 } })
    const data: Record<string, unknown>[] = res.data?.data?.records ?? res.data?.data ?? []
    if (Array.isArray(data) && data.length > 0) return data.map((r) => String(r.title))
    return mockTrainingPrograms
  } catch {
    return mockTrainingPrograms
  }
}

// ─── Leading Companies ────────────────────────────────────────────────────────

export const getLeadingCompanies = async (): Promise<LeadingCompany[]> => {
  try {
    const res = await apiClient.get('/v1/placement/companies')
    const data: Record<string, unknown>[] = res.data?.data ?? []
    if (Array.isArray(data) && data.length > 0) {
      return data.slice(0, 20).map((c) => ({
        name:    String(c.name || ''),
        logo:    c.logo_url ? String(c.logo_url) : '',
        sector:  String(c.sector || ''),
      }))
    }
    return mockLeadingCompanies
  } catch {
    return mockLeadingCompanies
  }
}

// ─── TNP Team — CMS section ───────────────────────────────────────────────────

export const getTNPTeam = async (): Promise<TNPTeamMember[]> => {
  const data = await getCmsSection<{ members: TNPTeamMember[] }>('placement.tnp_team', { members: mockTNPTeam })
  return Array.isArray(data?.members) && data.members.length > 0 ? data.members : mockTNPTeam
}

export const saveTNPTeam = async (members: TNPTeamMember[]): Promise<void> => {
  await saveCmsSection('placement.tnp_team', { members })
}

// ─── TNP Cell Info — CMS section ─────────────────────────────────────────────

export const getTNPCellInfo = async (): Promise<TNPCellInfo> => {
  const data = await getCmsSection<TNPCellInfo>('placement.cell_info', mockTNPCellInfo)
  return (data && data.aboutText) ? data : mockTNPCellInfo
}

export const saveTNPCellInfo = async (info: TNPCellInfo): Promise<void> => {
  await saveCmsSection('placement.cell_info', info)
}

// ─── Placement Process Steps — CMS section ───────────────────────────────────

export const getPlacementProcess = async (): Promise<PlacementProcessStep[]> => {
  const data = await getCmsSection<{ steps: PlacementProcessStep[] }>('placement.process', { steps: mockPlacementProcess })
  return Array.isArray(data?.steps) && data.steps.length > 0 ? data.steps : mockPlacementProcess
}

export const savePlacementProcess = async (steps: PlacementProcessStep[]): Promise<void> => {
  await saveCmsSection('placement.process', { steps })
}

// ─── Placement Contacts — CMS section ────────────────────────────────────────

export const getPlacementContacts = async (): Promise<PlacementContactPerson[]> => {
  const data = await getCmsSection<{ contacts: PlacementContactPerson[] }>('placement.contacts', { contacts: mockPlacementContacts })
  return Array.isArray(data?.contacts) && data.contacts.length > 0 ? data.contacts : mockPlacementContacts
}

export const savePlacementContacts = async (contacts: PlacementContactPerson[]): Promise<void> => {
  await saveCmsSection('placement.contacts', { contacts })
}

// ─── Placement Office Info — CMS section ─────────────────────────────────────

export const getPlacementOfficeInfo = async (): Promise<PlacementOfficeInfo> => {
  const data = await getCmsSection<PlacementOfficeInfo>('placement.office_info', mockPlacementOfficeInfo)
  return (data && data.address) ? data : mockPlacementOfficeInfo
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
export const placementRecordsDefault: PlacementRecord[]          = mockPlacementRecords
export const deptPlacementDefault: DeptPlacementStat[]           = mockDeptPlacement
export const tnpTeamDefault: TNPTeamMember[]                     = mockTNPTeam
export const placementProcessDefault: PlacementProcessStep[]     = mockPlacementProcess
export const trainingProgramsDefault: string[]                   = mockTrainingPrograms
export const recruitingPartnersDefault: string[]                 = mockRecruitingPartners
export const tnpCellInfoDefault: TNPCellInfo                     = mockTNPCellInfo
export const leadingCompaniesDefault: LeadingCompany[]           = mockLeadingCompanies
export const placementContactsDefault: PlacementContactPerson[]  = mockPlacementContacts
export const placementOfficeInfoDefault: PlacementOfficeInfo     = mockPlacementOfficeInfo

export const placementService = {
  getPlacementRecords, getDeptPlacement, getTNPTeam, getPlacementProcess,
  getTrainingPrograms, getRecruitingPartners, getTNPCellInfo, getLeadingCompanies,
  getPlacementContacts, getPlacementOfficeInfo,
  saveTNPTeam, saveTNPCellInfo, savePlacementProcess, savePlacementContacts, savePlacementOfficeInfo,
  createPlacementRecord, updatePlacementRecord, setPlacementStatus, deletePlacementRecord,
}

export default placementService
