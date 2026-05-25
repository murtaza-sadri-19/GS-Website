/**
 * Facilities Service — Library, hostels, computer center, sports, health
 *
 * Backend: GET/PUT /api/v1/settings/cms/facilities.*
 * Falls back to mock defaults when backend unreachable.
 */

import { getCmsSection, saveCmsSection } from './settingsService'
import {
  mockLibrary,        type LibraryData,
  mockBoysHostel,     type HostelData,
  mockGirlsHostel,
  mockComputerCenter, type ComputerCenterData,
  mockGamesSports,    type GamesSportsData,
  mockDispensary,     type DispensaryData,
  mockIDEALab,        type IDEALabData,
  mockGymnasium,      type GymnasiumData,
  mockWorkshop,       type WorkshopData,
  mockCIDI,           type CIDIData,
  mockTransitHostel,  type TransitHostelData,
  mockStaffQuarters,  type StaffQuartersData,
} from '../mock/facilities/facilitiesData'

export type {
  LibraryData, HostelData, ComputerCenterData, GamesSportsData,
  DispensaryData, IDEALabData, GymnasiumData, WorkshopData,
  CIDIData, TransitHostelData, StaffQuartersData,
}

// ─── Reads ────────────────────────────────────────────────────────────────────

export const getLibrary = async (): Promise<LibraryData> => {
  const data = await getCmsSection<LibraryData>('facilities.library', mockLibrary)
  return data ?? mockLibrary
}

export const getBoysHostel = async (): Promise<HostelData> => {
  const data = await getCmsSection<HostelData>('facilities.boys_hostel', mockBoysHostel)
  return data ?? mockBoysHostel
}

export const getGirlsHostel = async (): Promise<HostelData> => {
  const data = await getCmsSection<HostelData>('facilities.girls_hostel', mockGirlsHostel)
  return data ?? mockGirlsHostel
}

export const getComputerCenter = async (): Promise<ComputerCenterData> => {
  const data = await getCmsSection<ComputerCenterData>('facilities.computer_center', mockComputerCenter)
  return data ?? mockComputerCenter
}

export const getGamesSports = async (): Promise<GamesSportsData> => {
  const data = await getCmsSection<GamesSportsData>('facilities.games_sports', mockGamesSports)
  return data ?? mockGamesSports
}

export const getDispensary = async (): Promise<DispensaryData> => {
  const data = await getCmsSection<DispensaryData>('facilities.dispensary', mockDispensary)
  return data ?? mockDispensary
}

export const getIDEALab = async (): Promise<IDEALabData> => {
  const data = await getCmsSection<IDEALabData>('facilities.idea_lab', mockIDEALab)
  return data ?? mockIDEALab
}

export const getGymnasium = async (): Promise<GymnasiumData> => {
  const data = await getCmsSection<GymnasiumData>('facilities.gymnasium', mockGymnasium)
  return data ?? mockGymnasium
}

export const getWorkshop = async (): Promise<WorkshopData> => {
  const data = await getCmsSection<WorkshopData>('facilities.workshop', mockWorkshop)
  return data ?? mockWorkshop
}

export const getCIDI = async (): Promise<CIDIData> => {
  const data = await getCmsSection<CIDIData>('facilities.cidi', mockCIDI)
  return data ?? mockCIDI
}

export const getTransitHostel = async (): Promise<TransitHostelData> => {
  const data = await getCmsSection<TransitHostelData>('facilities.transit_hostel', mockTransitHostel)
  return data ?? mockTransitHostel
}

export const getStaffQuarters = async (): Promise<StaffQuartersData> => {
  const data = await getCmsSection<StaffQuartersData>('facilities.staff_quarters', mockStaffQuarters)
  return data ?? mockStaffQuarters
}

// ─── Writes ───────────────────────────────────────────────────────────────────

export const saveLibrary        = (data: LibraryData)        => saveCmsSection('facilities.library', data)
export const saveBoysHostel     = (data: HostelData)         => saveCmsSection('facilities.boys_hostel', data)
export const saveGirlsHostel    = (data: HostelData)         => saveCmsSection('facilities.girls_hostel', data)
export const saveComputerCenter = (data: ComputerCenterData) => saveCmsSection('facilities.computer_center', data)
export const saveGamesSports    = (data: GamesSportsData)    => saveCmsSection('facilities.games_sports', data)
export const saveDispensary     = (data: DispensaryData)     => saveCmsSection('facilities.dispensary', data)
export const saveIDEALab        = (data: IDEALabData)        => saveCmsSection('facilities.idea_lab', data)
export const saveGymnasium      = (data: GymnasiumData)      => saveCmsSection('facilities.gymnasium', data)
export const saveWorkshop       = (data: WorkshopData)       => saveCmsSection('facilities.workshop', data)
export const saveCIDI           = (data: CIDIData)           => saveCmsSection('facilities.cidi', data)
export const saveTransitHostel  = (data: TransitHostelData)  => saveCmsSection('facilities.transit_hostel', data)
export const saveStaffQuarters  = (data: StaffQuartersData)  => saveCmsSection('facilities.staff_quarters', data)

// ─── Defaults ────────────────────────────────────────────────────────────────
export const libraryDefault: LibraryData               = mockLibrary
export const boysHostelDefault: HostelData             = mockBoysHostel
export const girlsHostelDefault: HostelData            = mockGirlsHostel
export const computerCenterDefault: ComputerCenterData = mockComputerCenter
export const gamesSportsDefault: GamesSportsData       = mockGamesSports
export const dispensaryDefault: DispensaryData         = mockDispensary
export const ideaLabDefault: IDEALabData               = mockIDEALab
export const gymnasiumDefault: GymnasiumData           = mockGymnasium
export const workshopDefault: WorkshopData             = mockWorkshop
export const cidiDefault: CIDIData                     = mockCIDI
export const transitHostelDefault: TransitHostelData   = mockTransitHostel
export const staffQuartersDefault: StaffQuartersData   = mockStaffQuarters

export const facilitiesService = {
  getLibrary, getBoysHostel, getGirlsHostel, getComputerCenter,
  getGamesSports, getDispensary, getIDEALab, getGymnasium,
  getWorkshop, getCIDI, getTransitHostel, getStaffQuarters,
  saveLibrary, saveBoysHostel, saveGirlsHostel, saveComputerCenter,
  saveGamesSports, saveDispensary, saveIDEALab, saveGymnasium,
  saveWorkshop, saveCIDI, saveTransitHostel, saveStaffQuarters,
}

export default facilitiesService
