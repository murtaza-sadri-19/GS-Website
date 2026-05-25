/**
 * Admin Content Service — Full async CRUD for the CMS admin panel.
 *
 * All read/write operations go through the real backend via getCmsSection /
 * saveCmsSection (GET|PUT /api/v1/settings/cms/:key) or domain-specific
 * service modules that are already wired to the backend.
 *
 * NO direct mockStore usage.  Mock defaults are imported as static fallback
 * values only (no runtime mock calls).
 */

import { getCmsSection, saveCmsSection } from './settingsService'

// ─── Domain services (already wired to backend) ────────────────────────────
import { aboutService }     from './aboutService'
import { academicsService } from './academicsService'

// ─── Home CMS section services ─────────────────────────────────────────────
import { getHeroConfig, getHeroTiles, saveHero }                     from '../cms/home/hero/service'
import { getAboutConfig, saveAbout }                                  from '../cms/home/about/service'
import { getHomeDirectorConfig, saveHomeDirector }                    from '../cms/home/director/service'
import { getAnnouncements, saveAnnouncements }                        from '../cms/home/announcements/service'
import { getHomeNewsConfig, saveHomeNews }                            from '../cms/home/news/service'
import { getAcademicsConfig, saveAcademics }                          from '../cms/home/academics/service'
import { getHomeDepartmentsConfig, saveHomeDepartments }              from '../cms/home/departments/service'
import { getHomeStatsConfig, saveHomeStats }                          from '../cms/home/stats/service'
import { getHomeCampusLifeConfig, saveHomeCampusLife }                from '../cms/home/campus_life/service'
import { getHomeFaqsConfig, saveHomeFaqs }                            from '../cms/home/faqs/service'
import { getHomeGalleryConfig, saveHomeGallery }                      from '../cms/home/gallery/service'
import { getHomeSeoConfig, saveHomeSeo }                              from '../cms/home/seo/service'

// ─── Mock defaults (static fallbacks — never used for runtime reads) ────────
import { mockHomePageData, type HomePageData }                        from '../mock/home/homeData'
import { mockNavItems }                                               from '../mock/navbar/navData'
import {
  mockUGAdmission,   type UGAdmissionData,
  mockPGAdmission,   type PGAdmissionData,
  mockPhDAdmission,  type PhDAdmissionData,
  mockProspectus,    type ProspectusData,
}                                                                     from '../mock/admission/admissionData'
import {
  mockActivities,           type ActivitiesData,
  mockNCC,                  type NCCData,
  mockNSS,                  type NSSData,
  mockScholarshipGovt,      type ScholarshipGovtData,
  mockScholarshipInstitute, type ScholarshipInstituteData,
  mockSSS,                  type SSSData,
}                                                                     from '../mock/students/studentsData'
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
}                                                                     from '../mock/facilities/facilitiesData'

// ─── Re-export types ────────────────────────────────────────────────────────
export type {
  HomePageData,
  UGAdmissionData, PGAdmissionData, PhDAdmissionData, ProspectusData,
  ActivitiesData, NCCData, NSSData, ScholarshipGovtData, ScholarshipInstituteData, SSSData,
  LibraryData, HostelData, ComputerCenterData, GamesSportsData, DispensaryData,
  IDEALabData, GymnasiumData, WorkshopData, CIDIData, TransitHostelData, StaffQuartersData,
}

export type CmsRecord = Record<string, unknown>
export type CmsArray  = unknown[]

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

/**
 * Assemble full HomePageData from individual CMS section keys.
 * Mirrors what contentService.getHomePage() does but returns the
 * full assembled object needed by the admin editor.
 */
export const getHomePageData = async (): Promise<HomePageData> => {
  const [
    heroConfig, heroTiles, about, director, announcements,
    newsSection, academicsSection, departmentsSection, statsSection,
    campusLifeSection, faqsSection, gallerySection, seo,
  ] = await Promise.allSettled([
    getHeroConfig(),
    getHeroTiles(),
    getAboutConfig(),
    getHomeDirectorConfig(),
    getAnnouncements(),
    getHomeNewsConfig(),
    getAcademicsConfig(),
    getHomeDepartmentsConfig(),
    getHomeStatsConfig(),
    getHomeCampusLifeConfig(),
    getHomeFaqsConfig(),
    getHomeGalleryConfig(),
    getHomeSeoConfig(),
  ])

  const def = mockHomePageData

  const val = <T>(r: PromiseSettledResult<T>, fb: T): T =>
    r.status === 'fulfilled' ? r.value : fb

  return {
    meta:      val(seo, def.meta),
    sections:  def.sections,
    hero:      val(heroConfig, def.hero),
    heroTiles: val(heroTiles, def.heroTiles),
    about:     val(about, def.about),
    director:  val(director, def.director),
    announcements:     val(announcements, def.announcements),
    newsSection:       val(newsSection, def.newsSection),
    academicsSection:  val(academicsSection, def.academicsSection),
    departmentsSection: val(departmentsSection, def.departmentsSection),
    statsSection:      val(statsSection, def.statsSection),
    campusLifeSection: val(campusLifeSection, def.campusLifeSection),
    faqsSection:       val(faqsSection, def.faqsSection),
    gallerySection:    val(gallerySection, def.gallerySection),
  } as HomePageData
}

/**
 * Save HomePageData back to individual CMS section keys.
 */
export const saveHomePageData = async (data: HomePageData): Promise<void> => {
  await Promise.all([
    saveHero(data.hero as any, data.heroTiles as any),
    saveAbout(data.about as any),
    saveHomeDirector(data.director as any),
    saveAnnouncements(data.announcements as any),
    saveHomeNews(data.newsSection as any),
    saveAcademics(data.academicsSection as any),
    saveHomeDepartments(data.departmentsSection as any),
    saveHomeStats(data.statsSection as any),
    saveHomeCampusLife(data.campusLifeSection as any),
    saveHomeFaqs(data.faqsSection as any),
    saveHomeGallery(data.gallerySection as any),
    saveHomeSeo(data.meta as any),
  ])
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

export const getAboutInstitute    = () => aboutService.getAboutInstitute()
export const getVisionMission     = () => aboutService.getVisionMission()
export const getGoverningBody     = () => aboutService.getGoverningBody()
export const getAcademicCouncil   = () => aboutService.getAcademicCouncil()
export const getAdministration    = () => aboutService.getAdministration()
export const getTelephoneDirectory = () => aboutService.getTelephoneDirectory()
export const getIQAC              = () => aboutService.getIQAC()
export const getAccreditation     = () => aboutService.getAccreditation()
export const getInfrastructure    = () => aboutService.getInfrastructure()
export const getDirectorMessage   = () => aboutService.getDirectorMessage()
export const getCommittees        = () => aboutService.getCommittees()

export const saveAboutInstitute     = (data: any) => saveCmsSection('about.overview', data)
export const saveVisionMission      = (data: any) => saveCmsSection('about.vision_mission', data)
export const saveGoverningBody      = (data: any) => saveCmsSection('about.governing_body', data)
export const saveAcademicCouncil    = (data: any) => saveCmsSection('about.academic_council', data)
export const saveAdministration     = (data: any) => saveCmsSection('about.administration', data)
export const saveTelephoneDirectory = (data: any) => saveCmsSection('about.telephone_directory', data)
export const saveIQAC               = (data: any) => saveCmsSection('about.iqac', data)
export const saveAccreditation      = (data: any) => saveCmsSection('about.accreditation', data)
export const saveInfrastructure     = (data: any) => saveCmsSection('about.infrastructure', data)
export const saveDirectorMessage    = (data: any) => saveCmsSection('about.leadership', data)
export const saveCommittees         = (data: any) => saveCmsSection('about.committees', data)

// ─── ACADEMICS ────────────────────────────────────────────────────────────────

export const getUGCourses        = () => academicsService.getUGCourses()
export const getPGCourses        = () => academicsService.getPGCourses()
export const getPhDCourses       = () => academicsService.getPhDCourses()
export const getPTDCCourses      = () => academicsService.getPTDCCourses()
export const getAcademicCalendar = () => academicsService.getAcademicCalendar()
export const getOnlineCourses    = () => academicsService.getOnlineCourses()

export const saveUGCourses        = (data: any) => saveCmsSection('academics.ug_courses', data)
export const savePGCourses        = (data: any) => saveCmsSection('academics.pg_courses', data)
export const savePhDCourses       = (data: any) => saveCmsSection('academics.phd_courses', data)
export const savePTDCCourses      = (data: any) => saveCmsSection('academics.ptdc_courses', data)
export const saveAcademicCalendar = (data: any) => saveCmsSection('academics.academic_calendar', data)
export const saveOnlineCourses    = (data: any) => saveCmsSection('academics.online_courses', data)

// ─── NAVIGATION ───────────────────────────────────────────────────────────────

export const getNavItems = async (): Promise<any> => {
  const data = await getCmsSection<any>('navigation.nav_tree', mockNavItems)
  return Array.isArray(data) ? data : mockNavItems
}

export const saveNavItems = (data: any) => saveCmsSection('navigation.nav_tree', data)

// ─── CUSTOM PAGES ─────────────────────────────────────────────────────────────

export const getCustomPages   = ()                        => aboutService.getCustomPages()
export const saveCustomPages  = (data: any)               => aboutService.saveCustomPages(data)
export const saveCustomPage   = (slug: string, data: any) => aboutService.saveCustomPage(slug, data)
export const addCustomPage    = async (data: any) => {
  const pages = await aboutService.getCustomPages()
  pages.push(data)
  return aboutService.saveCustomPages(pages)
}
export const deleteCustomPage = async (slug: string) => {
  const pages = await aboutService.getCustomPages()
  return aboutService.saveCustomPages(pages.filter(p => p.slug !== slug))
}

// ─── ADMISSIONS ───────────────────────────────────────────────────────────────

export const getUGAdmission = async (): Promise<UGAdmissionData> => {
  const data = await getCmsSection<UGAdmissionData>('admission.ug', mockUGAdmission)
  return data ?? mockUGAdmission
}
export const getPGAdmission = async (): Promise<PGAdmissionData> => {
  const data = await getCmsSection<PGAdmissionData>('admission.pg', mockPGAdmission)
  return data ?? mockPGAdmission
}
export const getPhDAdmission = async (): Promise<PhDAdmissionData> => {
  const data = await getCmsSection<PhDAdmissionData>('admission.phd', mockPhDAdmission)
  return data ?? mockPhDAdmission
}
export const getProspectus = async (): Promise<ProspectusData> => {
  const data = await getCmsSection<ProspectusData>('admission.prospectus', mockProspectus)
  return data ?? mockProspectus
}

export const saveUGAdmission  = (data: any) => saveCmsSection('admission.ug', data)
export const savePGAdmission  = (data: any) => saveCmsSection('admission.pg', data)
export const savePhDAdmission = (data: any) => saveCmsSection('admission.phd', data)
export const saveProspectus   = (data: any) => saveCmsSection('admission.prospectus', data)

// ─── CAMPUS LIFE ──────────────────────────────────────────────────────────────

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

export const saveActivities          = (data: any) => saveCmsSection('campus.activities', data)
export const saveNCC                 = (data: any) => saveCmsSection('campus.ncc', data)
export const saveNSS                 = (data: any) => saveCmsSection('campus.nss', data)
export const saveScholarshipGovt     = (data: any) => saveCmsSection('campus.scholarship_govt', data)
export const saveScholarshipInstitute = (data: any) => saveCmsSection('campus.scholarship_institute', data)
export const saveSSS                 = (data: any) => saveCmsSection('campus.sss', data)

// ─── FACILITIES ───────────────────────────────────────────────────────────────

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

export const saveLibrary        = (data: any) => saveCmsSection('facilities.library', data)
export const saveBoysHostel     = (data: any) => saveCmsSection('facilities.boys_hostel', data)
export const saveGirlsHostel    = (data: any) => saveCmsSection('facilities.girls_hostel', data)
export const saveComputerCenter = (data: any) => saveCmsSection('facilities.computer_center', data)
export const saveGamesSports    = (data: any) => saveCmsSection('facilities.games_sports', data)
export const saveDispensary     = (data: any) => saveCmsSection('facilities.dispensary', data)
export const saveIDEALab        = (data: any) => saveCmsSection('facilities.idea_lab', data)
export const saveGymnasium      = (data: any) => saveCmsSection('facilities.gymnasium', data)
export const saveWorkshop       = (data: any) => saveCmsSection('facilities.workshop', data)
export const saveCIDI           = (data: any) => saveCmsSection('facilities.cidi', data)
export const saveTransitHostel  = (data: any) => saveCmsSection('facilities.transit_hostel', data)
export const saveStaffQuarters  = (data: any) => saveCmsSection('facilities.staff_quarters', data)

// ─── Convenience object ────────────────────────────────────────────────────────

export const adminContentService = {
  // Read
  getHomePageData, getAboutInstitute, getVisionMission, getGoverningBody,
  getAcademicCouncil, getAdministration, getTelephoneDirectory, getIQAC,
  getInfrastructure, getAccreditation, getUGCourses, getPGCourses,
  getPhDCourses, getPTDCCourses, getAcademicCalendar, getOnlineCourses,
  getDirectorMessage, getCommittees, getNavItems, getCustomPages,
  getUGAdmission, getPGAdmission, getPhDAdmission, getProspectus,
  getActivities, getNCC, getNSS, getScholarshipGovt, getScholarshipInstitute,
  getSSS, getLibrary, getBoysHostel, getGirlsHostel, getComputerCenter,
  getGamesSports, getDispensary, getIDEALab, getGymnasium, getWorkshop,
  getCIDI, getTransitHostel, getStaffQuarters,
  // Write
  saveHomePageData, saveAboutInstitute, saveVisionMission, saveGoverningBody,
  saveAcademicCouncil, saveAdministration, saveTelephoneDirectory, saveIQAC,
  saveInfrastructure, saveAccreditation, saveUGCourses, savePGCourses,
  savePhDCourses, savePTDCCourses, saveAcademicCalendar, saveOnlineCourses,
  saveDirectorMessage, saveCommittees, saveNavItems, saveCustomPages,
  saveCustomPage, addCustomPage, deleteCustomPage,
  saveUGAdmission, savePGAdmission, savePhDAdmission, saveProspectus,
  saveActivities, saveNCC, saveNSS, saveScholarshipGovt, saveScholarshipInstitute,
  saveSSS, saveLibrary, saveBoysHostel, saveGirlsHostel, saveComputerCenter,
  saveGamesSports, saveDispensary, saveIDEALab, saveGymnasium, saveWorkshop,
  saveCIDI, saveTransitHostel, saveStaffQuarters,
}

export default adminContentService
