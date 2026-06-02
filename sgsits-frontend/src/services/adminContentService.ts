/**
 * Admin Content Service — Full async CRUD for the CMS admin panel.
 *
 * All read/write operations go through the real backend via getCmsSection /
 * saveCmsSection (GET|PUT /api/v1/settings/cms/:key) or domain-specific
 * service modules already wired to the backend.
 */

import { getCmsSection, saveCmsSection } from './settingsService'

// ─── Domain services (already wired to backend) ────────────────────────────
import { aboutService }     from './aboutService'
import { academicsService } from './academicsService'

// ─── Home CMS section services (via contentService) ───────────────────────
import {
  getHeroConfig, getHeroTiles, getAboutConfig, getHomeDirectorConfig,
  getAnnouncements, getHomeNewsConfig, getAcademicsConfig,
  getHomeDepartmentsConfig, getHomeStatsConfig, getHomeCampusLifeConfig,
  getHomeFaqsConfig, getHomeGalleryConfig, getHomeSeoConfig,
} from './contentService'

const saveHero            = (cfg: unknown) => saveCmsSection('home.hero', cfg)
const saveAbout           = (d: unknown)   => saveCmsSection('home.about', d)
const saveHomeDirector    = (d: unknown)   => saveCmsSection('home.director', d)
const saveAnnouncements   = (d: unknown)   => saveCmsSection('home.announcements', d)
const saveHomeNews        = (d: unknown)   => saveCmsSection('home.news', d)
const saveAcademics       = (d: unknown)   => saveCmsSection('home.academics', d)
const saveHomeDepartments = (d: unknown)   => saveCmsSection('home.departments', d)
const saveHomeStats       = (d: unknown)   => saveCmsSection('home.stats', d)
const saveHomeCampusLife  = (d: unknown)   => saveCmsSection('home.campus_life', d)
const saveHomeFaqs        = (d: unknown)   => saveCmsSection('home.faqs', d)
const saveHomeGallery     = (d: unknown)   => saveCmsSection('home.gallery', d)
const saveHomeSeo         = (d: unknown)   => saveCmsSection('home.seo', d)

import type { HomePageData } from './contentService'
import type {
  UGCoursesData, PGCoursesData, PhDCoursesData, PTDCCourse,
  AcademicCalendarEvent, OnlineCourseLink,
} from './academicsService'
import type {
  ActivitiesData, NCCData, NSSData, ScholarshipGovtData, ScholarshipInstituteData, SSSData,
} from './studentsService'
import type {
  LibraryData, HostelData, ComputerCenterData, GamesSportsData, DispensaryData,
  IDEALabData, GymnasiumData, WorkshopData, CIDIData, TransitHostelData, StaffQuartersData,
} from './facilitiesService'

export type UGAdmissionData    = Record<string, unknown>
export type PGAdmissionData    = Record<string, unknown>
export type PhDAdmissionData   = Record<string, unknown>
export type ProspectusData     = Record<string, unknown>

export type {
  HomePageData,
  UGAdmissionData, PGAdmissionData, PhDAdmissionData, ProspectusData,
  ActivitiesData, NCCData, NSSData, ScholarshipGovtData, ScholarshipInstituteData, SSSData,
  LibraryData, HostelData, ComputerCenterData, GamesSportsData, DispensaryData,
  IDEALabData, GymnasiumData, WorkshopData, CIDIData, TransitHostelData, StaffQuartersData,
  UGCoursesData, PGCoursesData, PhDCoursesData, PTDCCourse, AcademicCalendarEvent, OnlineCourseLink,
}

export type CmsRecord = Record<string, unknown>
export type CmsArray  = unknown[]

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

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

  const val = <T>(r: PromiseSettledResult<T>): T | null =>
    r.status === 'fulfilled' ? r.value : null

  return {
    meta:               val(seo),
    sections:           [],
    hero:               val(heroConfig),
    heroTiles:          val(heroTiles),
    about:              val(about),
    director:           val(director),
    announcements:      val(announcements),
    newsSection:        val(newsSection),
    academicsSection:   val(academicsSection),
    departmentsSection: val(departmentsSection),
    statsSection:       val(statsSection),
    campusLifeSection:  val(campusLifeSection),
    faqsSection:        val(faqsSection),
    gallerySection:     val(gallerySection),
  } as HomePageData
}

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

export const getAboutInstitute     = () => aboutService.getAboutInstitute()
export const getVisionMission      = () => aboutService.getVisionMission()
export const getGoverningBody      = () => aboutService.getGoverningBody()
export const getAcademicCouncil    = () => aboutService.getAcademicCouncil()
export const getAdministration     = () => aboutService.getAdministration()
export const getTelephoneDirectory = () => aboutService.getTelephoneDirectory()
export const getIQAC               = () => aboutService.getIQAC()
export const getAccreditation      = () => aboutService.getAccreditation()
export const getInfrastructure     = () => aboutService.getInfrastructure()
export const getDirectorMessage    = () => aboutService.getDirectorMessage()
export const getCommittees         = () => aboutService.getCommittees()

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
  const data = await getCmsSection<any>('navigation.nav_tree')
  return Array.isArray(data) ? data : []
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

export const getUGAdmission  = async (): Promise<UGAdmissionData>  => (await getCmsSection<UGAdmissionData>('admission.ug'))  ?? {}
export const getPGAdmission  = async (): Promise<PGAdmissionData>  => (await getCmsSection<PGAdmissionData>('admission.pg'))  ?? {}
export const getPhDAdmission = async (): Promise<PhDAdmissionData> => (await getCmsSection<PhDAdmissionData>('admission.phd')) ?? {}
export const getProspectus   = async (): Promise<ProspectusData>   => (await getCmsSection<ProspectusData>('admission.prospectus')) ?? {}

export const saveUGAdmission  = (data: any) => saveCmsSection('admission.ug', data)
export const savePGAdmission  = (data: any) => saveCmsSection('admission.pg', data)
export const savePhDAdmission = (data: any) => saveCmsSection('admission.phd', data)
export const saveProspectus   = (data: any) => saveCmsSection('admission.prospectus', data)

// ─── CAMPUS LIFE ──────────────────────────────────────────────────────────────

export const getActivities          = async (): Promise<ActivitiesData>           => (await getCmsSection<ActivitiesData>('campus.activities')) ?? {}
export const getNCC                 = async (): Promise<NCCData>                  => (await getCmsSection<NCCData>('campus.ncc')) ?? {}
export const getNSS                 = async (): Promise<NSSData>                  => (await getCmsSection<NSSData>('campus.nss')) ?? {}
export const getScholarshipGovt     = async (): Promise<ScholarshipGovtData>      => (await getCmsSection<ScholarshipGovtData>('campus.scholarship_govt')) ?? {}
export const getScholarshipInstitute = async (): Promise<ScholarshipInstituteData> => (await getCmsSection<ScholarshipInstituteData>('campus.scholarship_institute')) ?? {}
export const getSSS                 = async (): Promise<SSSData>                  => (await getCmsSection<SSSData>('campus.sss')) ?? {}

export const saveActivities           = (data: any) => saveCmsSection('campus.activities', data)
export const saveNCC                  = (data: any) => saveCmsSection('campus.ncc', data)
export const saveNSS                  = (data: any) => saveCmsSection('campus.nss', data)
export const saveScholarshipGovt      = (data: any) => saveCmsSection('campus.scholarship_govt', data)
export const saveScholarshipInstitute = (data: any) => saveCmsSection('campus.scholarship_institute', data)
export const saveSSS                  = (data: any) => saveCmsSection('campus.sss', data)

// ─── FACILITIES ───────────────────────────────────────────────────────────────

export const getLibrary        = async (): Promise<LibraryData>        => (await getCmsSection<LibraryData>('facilities.library')) ?? {}
export const getBoysHostel     = async (): Promise<HostelData>         => (await getCmsSection<HostelData>('facilities.boys_hostel')) ?? {}
export const getGirlsHostel    = async (): Promise<HostelData>         => (await getCmsSection<HostelData>('facilities.girls_hostel')) ?? {}
export const getComputerCenter = async (): Promise<ComputerCenterData> => (await getCmsSection<ComputerCenterData>('facilities.computer_center')) ?? {}
export const getGamesSports    = async (): Promise<GamesSportsData>    => (await getCmsSection<GamesSportsData>('facilities.games_sports')) ?? {}
export const getDispensary     = async (): Promise<DispensaryData>     => (await getCmsSection<DispensaryData>('facilities.dispensary')) ?? {}
export const getIDEALab        = async (): Promise<IDEALabData>        => (await getCmsSection<IDEALabData>('facilities.idea_lab')) ?? {}
export const getGymnasium      = async (): Promise<GymnasiumData>      => (await getCmsSection<GymnasiumData>('facilities.gymnasium')) ?? {}
export const getWorkshop       = async (): Promise<WorkshopData>       => (await getCmsSection<WorkshopData>('facilities.workshop')) ?? {}
export const getCIDI           = async (): Promise<CIDIData>           => (await getCmsSection<CIDIData>('facilities.cidi')) ?? {}
export const getTransitHostel  = async (): Promise<TransitHostelData>  => (await getCmsSection<TransitHostelData>('facilities.transit_hostel')) ?? {}
export const getStaffQuarters  = async (): Promise<StaffQuartersData>  => (await getCmsSection<StaffQuartersData>('facilities.staff_quarters')) ?? {}

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
