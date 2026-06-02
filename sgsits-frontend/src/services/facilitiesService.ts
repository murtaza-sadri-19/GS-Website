/**
 * Facilities Service — Library, hostels, computer center, sports, health
 *
 * Backend: GET/PUT /api/v1/settings/cms/facilities.*
 */

import { getCmsSection, saveCmsSection } from './settingsService'

export type LibraryData        = Record<string, any>
export type HostelData         = Record<string, any>
export type ComputerCenterData = Record<string, any>
export type GamesSportsData    = Record<string, any>
export type DispensaryData     = Record<string, any>
export type IDEALabData        = Record<string, any>
export type GymnasiumData      = Record<string, any>
export type WorkshopData       = Record<string, any>
export type CIDIData           = Record<string, any>
export type TransitHostelData  = Record<string, any>
export type StaffQuartersData  = Record<string, any>

const get = async <T>(key: string): Promise<T> =>
  ((await getCmsSection<T>(key)) ?? {}) as T

export const getLibrary        = (): Promise<LibraryData>        => get('facilities.library')
export const getBoysHostel     = (): Promise<HostelData>         => get('facilities.boys_hostel')
export const getGirlsHostel    = (): Promise<HostelData>         => get('facilities.girls_hostel')
export const getComputerCenter = (): Promise<ComputerCenterData> => get('facilities.computer_center')
export const getGamesSports    = (): Promise<GamesSportsData>    => get('facilities.games_sports')
export const getDispensary     = (): Promise<DispensaryData>     => get('facilities.dispensary')
export const getIDEALab        = (): Promise<IDEALabData>        => get('facilities.idea_lab')
export const getGymnasium      = (): Promise<GymnasiumData>      => get('facilities.gymnasium')
export const getWorkshop       = (): Promise<WorkshopData>       => get('facilities.workshop')
export const getCIDI           = (): Promise<CIDIData>           => get('facilities.cidi')
export const getTransitHostel  = (): Promise<TransitHostelData>  => get('facilities.transit_hostel')
export const getStaffQuarters  = (): Promise<StaffQuartersData>  => get('facilities.staff_quarters')

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

export const libraryDefault: LibraryData               = {}
export const boysHostelDefault: HostelData             = {}
export const girlsHostelDefault: HostelData            = {}
export const computerCenterDefault: ComputerCenterData = {}
export const gamesSportsDefault: GamesSportsData       = {}
export const dispensaryDefault: DispensaryData         = {}
export const ideaLabDefault: IDEALabData               = {}
export const gymnasiumDefault: GymnasiumData           = {}
export const workshopDefault: WorkshopData             = {}
export const cidiDefault: CIDIData                     = {}
export const transitHostelDefault: TransitHostelData   = {}
export const staffQuartersDefault: StaffQuartersData   = {}

export const facilitiesService = {
  getLibrary, getBoysHostel, getGirlsHostel, getComputerCenter,
  getGamesSports, getDispensary, getIDEALab, getGymnasium,
  getWorkshop, getCIDI, getTransitHostel, getStaffQuarters,
  saveLibrary, saveBoysHostel, saveGirlsHostel, saveComputerCenter,
  saveGamesSports, saveDispensary, saveIDEALab, saveGymnasium,
  saveWorkshop, saveCIDI, saveTransitHostel, saveStaffQuarters,
}

export default facilitiesService
