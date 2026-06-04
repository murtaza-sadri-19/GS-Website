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

export const libraryDefault: LibraryData = {
  readingHallFeatures: [
    'Seating capacity for 300+ students simultaneously',
    'Separate section for reference books and periodicals',
    'Competitive exam preparation corner (GATE, UPSC, SSC)',
    'Newspaper reading area with 12 daily subscriptions',
    'Air-conditioned environment with Wi-Fi access',
  ],
  finePolicy: 'Fine for overdue books: ₹1 per book per day',
}

export const boysHostelDefault: HostelData = {
  feeStructure: [
    { label: 'Hostel Rent (Annual)', value: '₹15,000 – ₹20,000' },
    { label: 'Mess Charges', value: '₹2,500 – ₹3,000/month' },
    { label: 'Security Deposit', value: '₹2,000 (refundable)' },
    { label: '*Fee subject to revision by Institute Committee', value: '', note: true },
  ],
}

export const girlsHostelDefault: HostelData = {
  securityRules: [
    'Hostel entry/exit register mandatory for all students',
    'Late night out permission (after 10 PM) requires prior approval from warden',
    'Visitors (including parents) allowed in designated areas only during visitor hours (3–6 PM)',
    'Male visitors not permitted inside hostel wings at any time',
    'Emergency helpline number displayed at all entry points',
  ],
  feeStructure: [
    { label: 'Hostel Rent (Annual)', value: '₹15,000 – ₹20,000' },
    { label: 'Mess Charges', value: '₹2,500 – ₹3,000/month' },
    { label: '*Fee subject to Institute Committee revision', value: '', note: true },
  ],
}

export const computerCenterDefault: ComputerCenterData = {
  heroBadge: 'Central Computing Facility',
  heroTitle: '500+ High-Performance Workstations',
  heroDesc: 'Equipped with state-of-the-art multi-core processing architectures, professional graphics acceleration nodes, and a robust high-speed local LAN backbone structure.',
  keySpecs: [
    { iconName: 'Wifi',     title: 'High-Speed Connectivity',    desc: '1 Gbps dedicated leased fiber line with enterprise-grade campus-wide Wi-Fi networks and secure firewall gateways.' },
    { iconName: 'Clock',    title: 'Extended Operating Hours',   desc: 'Operational from 8:00 AM to 8:00 PM on all working days, with extended 24/7 hours during semester examination phases.' },
    { iconName: 'Database', title: 'Enterprise Server Room',     desc: 'Host to private cloud infrastructure, SGSITS ERP databases, research computing nodes, and uninterrupted UPS power grids.' },
  ],
}

export const gamesSportsDefault: GamesSportsData = {
  indoorGames: [
    'Badminton — 4 courts (indoor sports hall)',
    'Table Tennis — 6 tables in dedicated TT hall',
    'Chess — Competition-grade boards and clocks',
    'Carrom — 10 boards available',
    'Gymnasium — fully equipped fitness center',
    'Squash Court — 1 court (Main building)',
  ],
}

export const dispensaryDefault: DispensaryData         = {}
export const ideaLabDefault: IDEALabData               = {}
export const gymnasiumDefault: GymnasiumData           = {
  accessNotes: [
    'Free access for enrolled students',
    'Nominal fee for staff members',
    'Certified physical trainer available',
  ],
}
export const workshopDefault: WorkshopData             = {}
export const cidiDefault: CIDIData                     = {
  ctaText: 'Submit your innovation proposal to CIDI. Mentors will guide you through the incubation journey.',
  externalUrl: 'https://startupindia.gov.in',
  externalUrlLabel: 'Startup India',
}
export const transitHostelDefault: TransitHostelData   = {
  bookingSteps: [
    'Contact the Registrar Office or Estate Section by phone or email to check availability',
    'Submit a booking request with purpose of visit, dates, and number of persons',
    'Receive confirmation and room allocation from Estate Section',
    'Check-in at the transit hostel gate with identity proof and confirmation letter',
  ],
  priorityNote: 'Priority: Official visitors, visiting faculty, NBA/NAAC inspectors, and parents during admission/exams',
}
export const staffQuartersDefault: StaffQuartersData   = {
  quarterTypes: [
    { type: 'Type D', for: 'Director & Senior Officers',        units: 2,  desc: 'Bungalow-style with garden, multiple bedrooms, servant quarters' },
    { type: 'Type C', for: 'Faculty (Professors/Assoc. Prof.)', units: 24, desc: '3 BHK flats with balcony, parking, drawing room' },
    { type: 'Type B', for: 'Ministerial / Technical Staff',     units: 36, desc: '2 BHK flats with basic amenities and common areas' },
    { type: 'Type A', for: 'Class IV / Support Staff',          units: 48, desc: '1 BHK or studio flats with shared utility areas' },
  ],
  allotmentSteps: [
    'Apply to Estate Section with designation proof',
    'Allotment Committee reviews based on seniority',
    'Allocation letter issued by Registrar',
    'Rent deducted from salary as per Pay Band',
  ],
  allotmentNote: 'Contact Estate Section for current vacancy status',
}

export const facilitiesService = {
  getLibrary, getBoysHostel, getGirlsHostel, getComputerCenter,
  getGamesSports, getDispensary, getIDEALab, getGymnasium,
  getWorkshop, getCIDI, getTransitHostel, getStaffQuarters,
  saveLibrary, saveBoysHostel, saveGirlsHostel, saveComputerCenter,
  saveGamesSports, saveDispensary, saveIDEALab, saveGymnasium,
  saveWorkshop, saveCIDI, saveTransitHostel, saveStaffQuarters,
}

export default facilitiesService
