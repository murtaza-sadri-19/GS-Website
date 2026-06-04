import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'
// â"€â"€ Service layer: ONLY interface to CMS data â€" no direct mockStore access â"€â"€
import { adminContentService as cms } from '../../services/adminContentService'
import PlacementCms from '../placementOfficer/PlacementCms'
import AdminDepartments from './AdminDepartments'
import AdminAcademicsCms from './AdminAcademicsCms'
import AdminFacilities from './AdminFacilities'
import AdminCampusLife from './AdminCampusLife'
import { brandingService, brandingDefaults, type BrandingConfig } from '../../services/brandingService'
import { chatbotService, chatbotDefaults, type ChatbotConfig, type ChatbotResponseItem } from '../../services/chatbotService'
import { seoService, allSeoDefaults, type SeoMeta } from '../../services/seoService'
import { uiLabelsService, uiLabelsDefaults, type UiLabelsConfig } from '../../services/uiLabelsService'
import { settingsService, topBarDefaults } from '../../services/settingsService'
import { institutionService } from '../../services/institutionService'
import CmsLivePreviewPane from '../../components/admin/CmsLivePreviewPane'
import HomePreviewPane    from '../../components/admin/HomePreviewPane'
import PageSectionsBuilder from '../../components/admin/PageSectionsBuilder'

type TabType = 'home' | 'about' | 'departments' | 'admissions' | 'placements' | 'campus_life' | 'facilities' | 'settings' | 'custom_pages' | 'academics'

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-primary border border-accent/40 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-sm font-semibold animate-bounce">
      <Icons.CheckCircle2 className="text-accent shrink-0" size={16} />
      <span>{message}</span>
      <button onClick={onClose} className="hover:text-slate-200 ml-2"><Icons.X size={14} /></button>
    </div>
  )
}

export default function AdminStaticPages() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [homeSubTab, setHomeSubTab] = useState<'hero' | 'announcements' | 'about_preview' | 'director_preview' | 'news' | 'academics_shortcut' | 'departments' | 'stats' | 'campus_life' | 'gallery' | 'faqs' | 'seo' | 'prefooter'>('hero')
  const [aboutSubTab, setAboutSubTab] = useState<'overview' | 'vision_mission' | 'leadership' | 'governance' | 'committees' | 'administration' | 'directory' | 'iqac' | 'accreditation_infra' | 'seo'>('overview')
  const [settingsSubTab, setSettingsSubTab] = useState<'branding' | 'navigation' | 'chatbot' | 'seo' | 'ui_labels' | 'footer'>('branding')
  const [admSubTab, setAdmSubTab] = useState<'ug' | 'pg' | 'phd' | 'prospectus'>('ug')
  const [toast, setToast] = useState('')

  // â"€â"€â"€ Data States â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const [homepage, setHomepage] = useState<any>(null)
  const [aboutInst, setAboutInst] = useState<any>(null)
  const [visionMission, setVisionMission] = useState<any>(null)
  const [governingBody, setGoverningBody] = useState<any>(null)
  const [academicCouncil, setAcademicCouncil] = useState<any>(null)
  const [administration, setAdministration] = useState<any>(null)
  const [telephoneDirectory, setTelephoneDirectory] = useState<any>(null)
  const [iqac, setIqac] = useState<any>(null)
  const [infrastructure, setInfrastructure] = useState<any>(null)
  const [accreditation, setAccreditation] = useState<any>(null)
  const [academicsUg, setAcademicsUg] = useState<any>(null)
  const [academicsPg, setAcademicsPg] = useState<any>(null)
  const [academicsPhd, setAcademicsPhd] = useState<any>(null)
  const [academicsPtdc, setAcademicsPtdc] = useState<any>(null)
  const [academicsCalendar, setAcademicsCalendar] = useState<any>(null)
  const [academicsOnline, setAcademicsOnline] = useState<any>(null)
  const [directorMessage, setDirectorMessage] = useState<any>(null)
  const [committeesList, setCommitteesList] = useState<any>(null)
  const [timeline, setTimeline] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [navigationItems, setNavigationItems] = useState<any>(null)
  const [admissionUg, setAdmissionUg] = useState<any>(null)
  const [admissionPg, setAdmissionPg] = useState<any>(null)
  const [admissionPhd, setAdmissionPhd] = useState<any>(null)
  const [admissionProspectus, setAdmissionProspectus] = useState<any>(null)

  // Campus Life States
  const [clActivities, setClActivities] = useState<any>(null)
  const [clNCC, setClNCC] = useState<any>(null)
  const [clNSS, setClNSS] = useState<any>(null)
  const [clSchGovt, setClSchGovt] = useState<any>(null)
  const [clSchInst, setClSchInst] = useState<any>(null)
  const [clSSS, setClSSS] = useState<any>(null)
  const [clSubTab, setClSubTab] = useState<'activities'|'ncc'|'nss'|'sch_govt'|'sch_inst'|'sss'>('activities')

  // Facilities States
  const [facLibrary, setFacLibrary] = useState<any>(null)
  const [facBoysHostel, setFacBoysHostel] = useState<any>(null)
  const [facGirlsHostel, setFacGirlsHostel] = useState<any>(null)
  const [facComputerCenter, setFacComputerCenter] = useState<any>(null)
  const [facGamesSports, setFacGamesSports] = useState<any>(null)
  const [facDispensary, setFacDispensary] = useState<any>(null)
  const [facIDEALab, setFacIDEALab] = useState<any>(null)
  const [facGymnasium, setFacGymnasium] = useState<any>(null)
  const [facWorkshop, setFacWorkshop] = useState<any>(null)
  const [facCIDI, setFacCIDI] = useState<any>(null)
  const [facTransitHostel, setFacTransitHostel] = useState<any>(null)
  const [facStaffQuarters, setFacStaffQuarters] = useState<any>(null)
  const [facSubTab, setFacSubTab] = useState<'library'|'boys_hostel'|'girls_hostel'|'computer_center'|'sports'|'dispensary'|'idea_lab'|'gymnasium'|'workshop'|'cidi'|'transit_hostel'|'staff_quarters'>('library')

  // ─── Branding / Chatbot / SEO / UI-Labels States ─────────────────────────
  const [branding, setBranding] = useState<BrandingConfig>(brandingDefaults)
  const [topBarData, setTopBarData] = useState(topBarDefaults ?? {})
  const [chatbot, setChatbot] = useState<ChatbotConfig>(chatbotDefaults)
  const [allSeo, setAllSeo] = useState<Record<string, SeoMeta>>(allSeoDefaults)
  const [activeSeoKey, setActiveSeoKey] = useState<string>(Object.keys(allSeoDefaults)[0] ?? 'home')
  const [uiLabels, setUiLabels] = useState<UiLabelsConfig>(uiLabelsDefaults)
  const [footerData, setFooterData] = useState<any>(null)
  // Chatbot response editor state
  const [editingResponseIdx, setEditingResponseIdx] = useState<number | null>(null)

  // ─── Custom Dynamic Pages States ─────────────────────────────────────────
  const [customPages, setCustomPages] = useState<any[]>([])
  const [activeEditPage, setActiveEditPage] = useState<any | null>(null)
  const [showAddPageModal, setShowAddPageModal] = useState(false)
  const [pageForm, setPageForm] = useState({
    title: '',
    subtitle: '',
    paragraphs: '',
    highlightsText: '',
    affiliationsText: ''
  })
  const [addPageForm, setAddPageForm] = useState({
    slug: '',
    title: '',
    subtitle: '',
    menu: 'about' as 'about' | 'admission' | 'placement' | 'campus-life'
  })

  // â"€â"€â"€ Fetch CMS Data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€
  const refreshAll = async () => {
    const deep = <T,>(v: T): T => JSON.parse(JSON.stringify(v))

    const [
      hp, ai, vm, gb, ac, adm, tel, iq, infra, accr,
      ugC, pgC, phdC, ptdcC, cal, onl,
      dm, cmts, nav, cpages,
      admUg, admPg, admPhd, admPros,
      clAct, clNcc, clNss, clSchG, clSchI, clSss,
      facLib, facBH, facGH, facCC, facGS, facDis,
      facID, facGym, facWs, facCidi, facTH, facSQ,
      brd, topBar, cbt, seoAll, uil, ftr,
    ] = await Promise.allSettled([
      cms.getHomePageData(),
      cms.getAboutInstitute(),
      cms.getVisionMission(),
      cms.getGoverningBody(),
      cms.getAcademicCouncil(),
      cms.getAdministration(),
      cms.getTelephoneDirectory(),
      cms.getIQAC(),
      cms.getInfrastructure(),
      cms.getAccreditation(),
      cms.getUGCourses(),
      cms.getPGCourses(),
      cms.getPhDCourses(),
      cms.getPTDCCourses(),
      cms.getAcademicCalendar(),
      cms.getOnlineCourses(),
      cms.getDirectorMessage(),
      cms.getCommittees(),
      cms.getNavItems(),
      cms.getCustomPages(),
      cms.getUGAdmission(),
      cms.getPGAdmission(),
      cms.getPhDAdmission(),
      cms.getProspectus(),
      cms.getActivities(),
      cms.getNCC(),
      cms.getNSS(),
      cms.getScholarshipGovt(),
      cms.getScholarshipInstitute(),
      cms.getSSS(),
      cms.getLibrary(),
      cms.getBoysHostel(),
      cms.getGirlsHostel(),
      cms.getComputerCenter(),
      cms.getGamesSports(),
      cms.getDispensary(),
      cms.getIDEALab(),
      cms.getGymnasium(),
      cms.getWorkshop(),
      cms.getCIDI(),
      cms.getTransitHostel(),
      cms.getStaffQuarters(),
      brandingService.getBranding(),
      settingsService.getTopBarData(),
      chatbotService.getChatbotConfig(),
      seoService.getAllPageSeo(),
      uiLabelsService.getUiLabels(),
      settingsService.getFooterData(),
    ])

    const val = <T,>(r: PromiseSettledResult<T>, fb: T): T =>
      r.status === 'fulfilled' ? r.value : fb

    setHomepage(deep(val(hp, null)))
    setAboutInst(deep(val(ai, null)))
    setVisionMission(deep(val(vm, null)))
    setGoverningBody(deep(val(gb, null)))
    setAcademicCouncil(deep(val(ac, null)))
    setAdministration(deep(val(adm, null)))
    setTelephoneDirectory(deep(val(tel, null)))
    setIqac(deep(val(iq, null)))
    setInfrastructure(deep(val(infra, null)))
    setAccreditation(deep(val(accr, null)))
    setAcademicsUg(deep(val(ugC, null)))
    setAcademicsPg(deep(val(pgC, null)))
    setAcademicsPhd(deep(val(phdC, null)))
    setAcademicsPtdc(deep(val(ptdcC, null)))
    setAcademicsCalendar(deep(val(cal, null)))
    setAcademicsOnline(deep(val(onl, null)))
    setDirectorMessage(deep(val(dm, null)))
    setCommitteesList(deep(val(cmts, null)))
    setNavigationItems(deep(val(nav, null)))
    setCustomPages(deep(val(cpages, [])))
    setAdmissionUg(deep(val(admUg, null)))
    setAdmissionPg(deep(val(admPg, null)))
    setAdmissionPhd(deep(val(admPhd, null)))
    setAdmissionProspectus(deep(val(admPros, null)))
    setClActivities(deep(val(clAct, null)))
    setClNCC(deep(val(clNcc, null)))
    setClNSS(deep(val(clNss, null)))
    setClSchGovt(deep(val(clSchG, null)))
    setClSchInst(deep(val(clSchI, null)))
    setClSSS(deep(val(clSss, null)))
    setFacLibrary(deep(val(facLib, null)))
    setFacBoysHostel(deep(val(facBH, null)))
    setFacGirlsHostel(deep(val(facGH, null)))
    setFacComputerCenter(deep(val(facCC, null)))
    setFacGamesSports(deep(val(facGS, null)))
    setFacDispensary(deep(val(facDis, null)))
    setFacIDEALab(deep(val(facID, null)))
    setFacGymnasium(deep(val(facGym, null)))
    setFacWorkshop(deep(val(facWs, null)))
    setFacCIDI(deep(val(facCidi, null)))
    setFacTransitHostel(deep(val(facTH, null)))
    setFacStaffQuarters(deep(val(facSQ, null)))
    setBranding(deep(val(brd, brandingDefaults)))
    setTopBarData(deep(val(topBar, topBarDefaults ?? {})))
    setChatbot(deep(val(cbt, chatbotDefaults)))
    setAllSeo(deep(val(seoAll, allSeoDefaults) ?? allSeoDefaults))
    setUiLabels(deep(val(uil, uiLabelsDefaults)))
    setFooterData(deep(val(ftr, null)))
    const tl = await institutionService.getInstitutionTimeline()
    setTimeline(deep(Array.isArray(tl) ? tl : []))
  }

  useEffect(() => {
    refreshAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const triggerSave = async (key: string, data: any, msg = 'Section updated successfully!') => {
    switch (key) {
      case 'home':
        await cms.saveHomePageData(data)
        break
      case 'about_institute':
        await cms.saveAboutInstitute(data)
        break
      case 'vision_mission':
        await cms.saveVisionMission(data)
        break
      case 'governing_body':
        await cms.saveGoverningBody(data)
        break
      case 'academic_council':
        await cms.saveAcademicCouncil(data)
        break
      case 'administration':
        await cms.saveAdministration(data)
        break
      case 'timeline':
        await institutionService.saveInstitutionTimeline(data)
        break
      case 'telephone':
        await cms.saveTelephoneDirectory(data)
        break
      case 'iqac':
        await cms.saveIQAC(data)
        break
      case 'infrastructure':
        await cms.saveInfrastructure(data)
        break
      case 'accreditation':
        await cms.saveAccreditation(data)
        break
      case 'ug':
        await cms.saveUGCourses(data)
        break
      case 'pg':
        await cms.savePGCourses(data)
        break
      case 'phd':
        await cms.savePhDCourses(data)
        break
      case 'ptdc':
        await cms.savePTDCCourses(data)
        break
      case 'calendar':
        await cms.saveAcademicCalendar(data)
        break
      case 'online':
        await cms.saveOnlineCourses(data)
        break
      case 'director_message':
        await cms.saveDirectorMessage(data)
        break
      case 'committees':
        await cms.saveCommittees(data)
        break
      case 'navigation':
        await cms.saveNavItems(data)
        break
      case 'admission_ug':
        await cms.saveUGAdmission(data)
        break
      case 'admission_pg':
        await cms.savePGAdmission(data)
        break
      case 'admission_phd':
        await cms.savePhDAdmission(data)
        break
      case 'admission_prospectus':
        await cms.saveProspectus(data)
        break
      case 'campus_activities':
        await cms.saveActivities(data)
        break
      case 'campus_ncc':
        await cms.saveNCC(data)
        break
      case 'campus_nss':
        await cms.saveNSS(data)
        break
      case 'campus_sch_govt':
        await cms.saveScholarshipGovt(data)
        break
      case 'campus_sch_inst':
        await cms.saveScholarshipInstitute(data)
        break
      case 'campus_sss':
        await cms.saveSSS(data)
        break
      case 'fac_library':
        await cms.saveLibrary(data)
        break
      case 'fac_boys_hostel':
        await cms.saveBoysHostel(data)
        break
      case 'fac_girls_hostel':
        await cms.saveGirlsHostel(data)
        break
      case 'fac_computer_center':
        await cms.saveComputerCenter(data)
        break
      case 'fac_games_sports':
        await cms.saveGamesSports(data)
        break
      case 'fac_dispensary':
        await cms.saveDispensary(data)
        break
      case 'fac_idea_lab':
        await cms.saveIDEALab(data)
        break
      case 'fac_gymnasium':
        await cms.saveGymnasium(data)
        break
      case 'fac_workshop':
        await cms.saveWorkshop(data)
        break
      case 'fac_cidi':
        await cms.saveCIDI(data)
        break
      case 'fac_transit_hostel':
        await cms.saveTransitHostel(data)
        break
      case 'fac_staff_quarters':
        await cms.saveStaffQuarters(data)
        break
      case 'footer':
        await settingsService.saveFooterData(data)
        break
    }
    setToast(msg)
    await refreshAll()
  }

  if (!homepage || !aboutInst || !visionMission || !governingBody || !academicCouncil || !administration || !telephoneDirectory || !iqac || !infrastructure || !accreditation || !academicsUg || !academicsPg || !academicsPhd || !academicsPtdc || !academicsCalendar || !academicsOnline || !directorMessage || !committeesList || !navigationItems || !admissionUg || !admissionPg || !admissionPhd || !admissionProspectus || !facLibrary || !facBoysHostel || !facGirlsHostel || !facComputerCenter || !facGamesSports || !facDispensary || !facIDEALab || !facGymnasium || !facWorkshop || !facCIDI || !facTransitHostel || !facStaffQuarters || !footerData || !timeline) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <Icons.Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm font-semibold text-slate-500">Loading Central CMS Repository...</p>
        </div>
      </div>
    )
  }

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'home', label: 'Home CMS', icon: Icons.Home },
    { id: 'about', label: 'About CMS', icon: Icons.Building2 },
    { id: 'departments', label: 'Departments CMS', icon: Icons.Building },
    { id: 'admissions', label: 'Admissions CMS', icon: Icons.Sparkles },
    { id: 'placements', label: 'Placements CMS', icon: Icons.Briefcase },
    { id: 'campus_life', label: 'Campus Life CMS', icon: Icons.Users },
    { id: 'facilities', label: 'Facilities CMS', icon: Icons.Building2 },
    { id: 'settings', label: 'Global Settings', icon: Icons.Settings },
    { id: 'custom_pages', label: 'Pages Builder', icon: Icons.FilePlus },
    { id: 'academics', label: 'Academics CMS', icon: Icons.GraduationCap },
  ]

  const activeSubTab = activeTab === 'about'       ? aboutSubTab
                     : activeTab === 'home'        ? homeSubTab
                     : activeTab === 'admissions'  ? admSubTab
                     : activeTab === 'settings'    ? settingsSubTab
                     : ''

  const previewData = {
    aboutInst, visionMission, directorMessage, governingBody, academicCouncil,
    committeesList, administration, telephoneDirectory, iqac, accreditation, infrastructure,
    academicsUg, academicsPg, academicsPhd,
    admissionUg, admissionPg, admissionPhd,
    clActivities, clNCC, clNSS, clSchGovt, clSchInst, clSSS,
    facLibrary, facBoysHostel, facGirlsHostel, facComputerCenter, facGamesSports,
    facDispensary, facIDEALab, facGymnasium, facWorkshop, facCIDI, facTransitHostel, facStaffQuarters,
    branding, footerData, customPages,
  }

  return (
    <div className={`flex gap-0 ${showPreview ? 'items-stretch' : ''}`}>
    {/* ── Editor panel ── */}
    <div className={`space-y-6 min-w-0 ${showPreview ? 'flex-1 overflow-y-auto' : 'w-full'}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Central CMS Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">Control, update, and manage all public content blocks dynamically with real-time propagation</p>
        </div>
        <button
          onClick={() => setShowPreview(p => !p)}
          className={`shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 ${
            showPreview
              ? 'bg-primary text-white border-primary shadow-md'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-primary/40'
          }`}
        >
          <Icons.Eye size={14} className={showPreview ? 'text-accent' : 'text-slate-400'} />
          {showPreview ? 'Hide Preview' : 'Live Preview'}
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 bg-slate-50 p-2 rounded-t-lg">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md border transition-all duration-200 shrink-0 ${
                isActive
                  ? 'bg-primary border-primary text-white shadow-md'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-350'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-accent' : 'text-slate-400'} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Panel Context */}
      <div className="bg-white border border-slate-200 rounded-b-lg shadow-sm p-6 space-y-8">

        {/* â"€â"€â"€ HOME TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {activeTab === 'home' && (

          <div className="space-y-6">
            {/* Home sub-navigation */}
            <div className="flex flex-wrap border-b border-slate-200 gap-2 bg-slate-50 p-1.5 rounded-t-lg mb-6">
              {[
                { id: 'hero', label: 'Hero Banner & Tiles', icon: Icons.Image },
                { id: 'announcements', label: 'Announcements', icon: Icons.AlertCircle },
                { id: 'about_preview', label: 'About Preview', icon: Icons.FileText },
                { id: 'director_preview', label: 'Director Corner', icon: Icons.User },
                { id: 'news', label: 'News Section', icon: Icons.Newspaper },
                { id: 'academics_shortcut', label: 'Academic Programs', icon: Icons.GraduationCap },
                { id: 'departments', label: 'Departments Section', icon: Icons.Building2 },
                { id: 'stats', label: 'Stats Section', icon: Icons.BarChart3 },
                { id: 'campus_life', label: 'Campus Life', icon: Icons.Users },
                { id: 'gallery', label: 'Gallery Headers', icon: Icons.Camera },
                { id: 'faqs', label: 'FAQs Accordion', icon: Icons.HelpCircle },
                { id: 'seo', label: 'SEO Config', icon: Icons.Search },
                { id: 'prefooter', label: 'Pre-Footer Banner', icon: Icons.Image },
              ].map(sub => {
                const SubIcon = sub.icon
                const isSubActive = homeSubTab === sub.id
                return (
                  <button
                    key={sub.id}
                    onClick={() => setHomeSubTab(sub.id as any)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all duration-200 shrink-0 ${
                      isSubActive
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <SubIcon size={12} className={isSubActive ? 'text-accent' : 'text-slate-400'} />
                    {sub.label}
                  </button>
                )
              })}
            </div>

            {/* Sub-tab panels */}
            {homeSubTab === 'hero' && (
              <div className="space-y-8 divide-y divide-slate-100">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Home size={18} className="text-accent" />
                1 Â· Hero Welcome Banner
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Institute Name</label>
                  <input
                    type="text"
                    value={homepage.hero.instituteName}
                    onChange={e => setHomepage({ ...homepage, hero: { ...homepage.hero, instituteName: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Hero Welcome Tagline</label>
                  <input
                    type="text"
                    value={homepage.hero.welcomeText}
                    onChange={e => setHomepage({ ...homepage, hero: { ...homepage.hero, welcomeText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Hero Accent (Gold) Text</label>
                  <input
                    type="text"
                    value={homepage.hero.accentText}
                    onChange={e => setHomepage({ ...homepage, hero: { ...homepage.hero, accentText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
                {/* ── Multi-image slider manager ── */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-2 mt-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">
                      Hero Slider Images
                    </label>
                    <span className="text-xs text-slate-400">First image = default. Auto-slides every 5 s when multiple.</span>
                  </div>
                  {(() => {
                    const currentImages: string[] =
                      homepage?.hero?.images && homepage.hero.images.length > 0
                        ? homepage.hero.images
                        : homepage?.hero?.imageUrl
                        ? [homepage.hero.imageUrl]
                        : ['']
                    const setImages = (imgs: string[]) =>
                      setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, images: imgs, imageUrl: imgs[0] ?? '' },
                      })
                    return (
                      <div className="space-y-2">
                        {currentImages.map((img: string, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            {/* Thumbnail preview */}
                            <div className="w-14 h-9 shrink-0 rounded overflow-hidden border border-slate-200 bg-slate-100">
                              {img && (
                                <img
                                  src={img}
                                  alt={`Slide ${i + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                                />
                              )}
                            </div>
                            <span className="text-xs font-bold text-slate-400 font-mono shrink-0">#{i + 1}</span>
                            <input
                              type="text"
                              value={img}
                              onChange={e => {
                                const next = [...currentImages]
                                next[i] = e.target.value
                                setImages(next)
                              }}
                              placeholder="https://example.com/hero-image.jpg"
                              className="flex-1 border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary font-mono"
                            />
                            <button
                              type="button"
                              disabled={currentImages.length <= 1}
                              onClick={() => setImages(currentImages.filter((_, j) => j !== i))}
                              className="p-1.5 text-slate-300 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
                              title="Remove image"
                            >
                              <Icons.Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => setImages([...currentImages, ''])}
                          className="flex items-center gap-1.5 text-xs font-bold text-accent hover:opacity-75 transition-opacity mt-1"
                        >
                          <Icons.Plus size={13} /> Add Another Slide Image
                        </button>
                      </div>
                    )
                  })()}
                </div>
              </div>
            </div>
                <div className="pt-6">
                  <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
                <Icons.Grid size={18} className="text-accent" />
                Hero Shortcut Tiles (Maximum 4 displayed)
              </h3>
              {/* ── Empty state ── */}
              {((homepage?.heroTiles ?? []) || []).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <Icons.Grid size={28} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-400 mb-1">No tiles yet</p>
                  <p className="text-xs text-slate-400 mb-4">Add up to 4 shortcut tiles for the hero section.</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {((homepage?.heroTiles ?? []) || []).map((tile: any, idx: number) => (
                  <div key={tile.id || idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50/40 space-y-3 relative">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-xs font-bold text-slate-400 font-mono">TILE #{idx + 1}</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-primary"
                            checked={tile.enabled}
                            onChange={e => {
                              const list = [...(homepage?.heroTiles ?? [])]
                              list[idx].enabled = e.target.checked
                              setHomepage({ ...homepage, heroTiles: list })
                            }}
                          />
                          Enabled
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const list = (homepage?.heroTiles ?? []).filter((_: any, i: number) => i !== idx)
                            setHomepage({ ...homepage, heroTiles: list })
                          }}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                          title="Remove tile"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                        <input
                          type="text"
                          value={tile.title}
                          onChange={e => {
                            const list = [...(homepage?.heroTiles ?? [])]
                            list[idx].title = e.target.value
                            setHomepage({ ...homepage, heroTiles: list })
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-bold text-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Subtitle</label>
                        <input
                          type="text"
                          value={tile.subtitle}
                          onChange={e => {
                            const list = [...(homepage?.heroTiles ?? [])]
                            list[idx].subtitle = e.target.value
                            setHomepage({ ...homepage, heroTiles: list })
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none text-slate-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-400 uppercase">Path</label>
                        <input
                          type="text"
                          value={tile.path}
                          onChange={e => {
                            const list = [...(homepage?.heroTiles ?? [])]
                            list[idx].path = e.target.value
                            setHomepage({ ...homepage, heroTiles: list })
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase text-center block">Order</label>
                        <input
                          type="number"
                          value={tile.order}
                          onChange={e => {
                            const list = [...(homepage?.heroTiles ?? [])]
                            list[idx].order = parseInt(e.target.value) || 0
                            setHomepage({ ...homepage, heroTiles: list })
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none text-center font-bold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Icon Name</label>
                        <input
                          type="text"
                          value={tile.iconName}
                          onChange={e => {
                            const list = [...(homepage?.heroTiles ?? [])]
                            list[idx].iconName = e.target.value
                            setHomepage({ ...homepage, heroTiles: list })
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-mono text-slate-600"
                        />
                      </div>
                      <div className="flex items-center pt-3 pl-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-slate-300 text-primary"
                            checked={tile.dark}
                            onChange={e => {
                              const list = [...(homepage?.heroTiles ?? [])]
                              list[idx].dark = e.target.checked
                              setHomepage({ ...homepage, heroTiles: list })
                            }}
                          />
                          Dark BG (Navy)
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Add Tile button (max 4) ── */}
              {((homepage?.heroTiles ?? []) || []).length < 4 && (
                <button
                  type="button"
                  onClick={() => {
                    const newTile = {
                      id: 'tile-' + Date.now(),
                      title: 'New Tile',
                      subtitle: 'Brief description here',
                      path: '/',
                      iconName: 'BookOpen',
                      dark: false,
                      order: ((homepage?.heroTiles ?? [])?.length ?? 0) + 1,
                      enabled: true,
                    }
                    setHomepage({ ...homepage, heroTiles: [...((homepage?.heroTiles ?? []) || []), newTile] })
                  }}
                  className="mt-2 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-accent/50 text-accent hover:border-accent hover:bg-accent/5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors w-full justify-center"
                >
                  <Icons.Plus size={14} />
                  Add Tile ({((homepage?.heroTiles ?? []) || []).length}/4)
                </button>
              )}
            </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Hero Banner & Tiles saved successfully!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Hero Config
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'about_preview' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.FileText size={18} className="text-accent" />
                2b Â· About SGSITS Introduction Block
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Block Label</label>
                  <input
                    type="text"
                    value={homepage.about.label}
                    onChange={e => setHomepage({ ...homepage, about: { ...homepage.about, label: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary Heading</label>
                  <input
                    type="text"
                    value={homepage.about.heading}
                    onChange={e => setHomepage({ ...homepage, about: { ...homepage.about, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Accent Heading (Gold)</label>
                  <input
                    type="text"
                    value={homepage.about.accentText}
                    onChange={e => setHomepage({ ...homepage, about: { ...homepage.about, accentText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Narrative Body Text</label>
                  <textarea
                    rows={5}
                    value={homepage.about.body}
                    onChange={e => setHomepage({ ...homepage, about: { ...homepage.about, body: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-sans text-xs leading-relaxed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary CTA Label</label>
                  <input
                    type="text"
                    value={homepage?.about?.primaryButton?.label ?? ''}
                    onChange={e => setHomepage({ ...homepage, about: { ...homepage.about, primaryButton: { ...(homepage.about.primaryButton ?? {}), label: e.target.value } } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary CTA Link</label>
                  <input
                    type="text"
                    value={homepage?.about?.primaryButton?.to ?? ''}
                    onChange={e => setHomepage({ ...homepage, about: { ...homepage.about, primaryButton: { ...(homepage.about.primaryButton ?? {}), to: e.target.value } } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage About Preview saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save About Preview
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'director_preview' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.User size={18} className="text-accent" />
                2 Â· Director's Message Corner
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Director Name</label>
                  <input
                    type="text"
                    value={homepage.director.name}
                    onChange={e => setHomepage({ ...homepage, director: { ...homepage.director, name: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Director Image URL</label>
                  <input
                    type="text"
                    value={homepage.director.photo}
                    onChange={e => setHomepage({ ...homepage, director: { ...homepage.director, photo: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary text-xs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Director Message Statement</label>
                  <textarea
                    rows={4}
                    value={homepage.director.bio}
                    onChange={e => setHomepage({ ...homepage, director: { ...homepage.director, bio: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage Director corner saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Director Corner Preview
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'announcements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Icons.AlertCircle size={18} className="text-accent" />
                    Homepage Announcements Roster
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newAnn = [...((homepage?.announcements ?? []) || []), { id: 'ann' + Date.now(), title: 'New Announcement Link Notice', date: 'New', isNew: true, to: '/notices' }]
                      setHomepage({ ...homepage, announcements: newAnn })
                    }}
                    className="px-3 py-1.5 border border-dashed border-slate-350 hover:border-slate-500 text-slate-655 text-xs font-semibold rounded-lg flex items-center gap-1 bg-white shadow-3xs"
                  >
                    <Icons.Plus size={14} className="text-accent" /> Add Announcement
                  </button>
                </div>

                <div className="space-y-3">
                  {((homepage?.announcements ?? []) || []).map((ann: any, idx: number) => (
                    <div key={ann.id || idx} className="border border-slate-200 p-4 rounded bg-slate-50/20 shadow-xs space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const newAnn = (homepage?.announcements ?? []).filter((_: any, i: number) => i !== idx)
                          setHomepage({ ...homepage, announcements: newAnn })
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Icons.Trash2 size={14} />
                      </button>
                      <span className="text-xs font-bold text-slate-400 block font-mono">RECORD #{idx + 1}</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Announcement Text</label>
                          <input
                            type="text"
                            value={ann.title}
                            onChange={e => {
                              const list = [...(homepage?.announcements ?? [])]
                              list[idx].title = e.target.value
                              setHomepage({ ...homepage, announcements: list })
                            }}
                            className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Link / Action Path</label>
                          <input
                            type="text"
                            value={ann.to}
                            onChange={e => {
                              const list = [...(homepage?.announcements ?? [])]
                              list[idx].to = e.target.value
                              setHomepage({ ...homepage, announcements: list })
                            }}
                            className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Date / Label (e.g. May 10, 2025)</label>
                          <input
                            type="text"
                            value={ann.date}
                            onChange={e => {
                              const list = [...(homepage?.announcements ?? [])]
                              list[idx].date = e.target.value
                              setHomepage({ ...homepage, announcements: list })
                            }}
                            className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                          />
                        </div>
                        <div className="flex items-center pt-5 pl-2">
                          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-655 uppercase cursor-pointer">
                            <input
                              type="checkbox"
                              checked={ann.isNew}
                              onChange={e => {
                                const list = [...(homepage?.announcements ?? [])]
                                list[idx].isNew = e.target.checked
                                setHomepage({ ...homepage, announcements: list })
                              }}
                              className="rounded border-slate-350 text-primary"
                            />
                            Show "NEW" Badge
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage Announcements saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Announcements Roster
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'news' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Newspaper size={18} className="text-accent" />
                4 Â· Campus News Section Header
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Section Tag/Label</label>
                  <input
                    type="text"
                    value={homepage.newsSection.label}
                    onChange={e => setHomepage({ ...homepage, newsSection: { ...homepage.newsSection, label: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary Title</label>
                  <input
                    type="text"
                    value={homepage.newsSection.heading}
                    onChange={e => setHomepage({ ...homepage, newsSection: { ...homepage.newsSection, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Accent Title (Italic)</label>
                  <input
                    type="text"
                    value={homepage.newsSection.accentText}
                    onChange={e => setHomepage({ ...homepage, newsSection: { ...homepage.newsSection, accentText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description Subtitle</label>
                  <input
                    type="text"
                    value={homepage.newsSection.description}
                    onChange={e => setHomepage({ ...homepage, newsSection: { ...homepage.newsSection, description: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage News config saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save News Headers
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'academics_shortcut' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.GraduationCap size={18} className="text-accent" />
                5 Â· Academic Programs Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Section Tag/Label</label>
                  <input
                    type="text"
                    value={homepage.academicsSection.label}
                    onChange={e => setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, label: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary Title</label>
                  <input
                    type="text"
                    value={homepage.academicsSection.heading}
                    onChange={e => setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Accent Title (Italic)</label>
                  <input
                    type="text"
                    value={homepage.academicsSection.accentText}
                    onChange={e => setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, accentText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description Subtitle</label>
                  <input
                    type="text"
                    value={homepage.academicsSection.description}
                    onChange={e => setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, description: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Programs Cards */}
              <div className="space-y-4 mt-4">
                <label className="text-xs font-bold text-slate-500 uppercase block">Program Cards (UG, PG, PhD)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(homepage?.academicsSection?.programs ?? []).map((prog: any, idx: number) => (
                    <div key={prog.id || idx} className="border border-slate-200 p-4 rounded-lg bg-white shadow-xs space-y-3">
                      <span className="text-xs font-bold text-slate-400 block font-mono">PROGRAM CARD #{idx + 1}</span>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Program Title</label>
                        <input
                          type="text"
                          value={prog.title}
                          onChange={e => {
                            const newProgs = [...(homepage?.academicsSection?.programs ?? [])]
                            newProgs[idx].title = e.target.value
                            setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, programs: newProgs } })
                          }}
                          className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                        <textarea
                          rows={3}
                          value={prog.description}
                          onChange={e => {
                            const newProgs = [...(homepage?.academicsSection?.programs ?? [])]
                            newProgs[idx].description = e.target.value
                            setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, programs: newProgs } })
                          }}
                          className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">CTA Label</label>
                          <input
                            type="text"
                            value={prog.ctaLabel}
                            onChange={e => {
                              const newProgs = [...(homepage?.academicsSection?.programs ?? [])]
                              newProgs[idx].ctaLabel = e.target.value
                              setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, programs: newProgs } })
                            }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Icon Name</label>
                          <input
                            type="text"
                            value={prog.iconName}
                            onChange={e => {
                              const newProgs = [...(homepage?.academicsSection?.programs ?? [])]
                              newProgs[idx].iconName = e.target.value
                              setHomepage({ ...homepage, academicsSection: { ...homepage.academicsSection, programs: newProgs } })
                            }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage Academics Shortcuts saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Academics Shortcut
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'departments' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Building2 size={18} className="text-accent" />
                2c Â· Homepage Shortcut Departments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Heading Title</label>
                  <input
                    type="text"
                    value={homepage.departmentsSection.heading}
                    onChange={e => setHomepage({ ...homepage, departmentsSection: { ...homepage.departmentsSection, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">View All Link Path</label>
                  <input
                    type="text"
                    value={homepage.departmentsSection.showAllLink}
                    onChange={e => setHomepage({ ...homepage, departmentsSection: { ...homepage.departmentsSection, showAllLink: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-mono text-xs"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Shortcut Departments Items List</label>
                <table className="w-full text-xs text-left border border-slate-250 rounded-lg overflow-hidden">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 text-slate-600 font-bold">Department Title Name</th>
                      <th className="px-3 py-2 text-slate-600 font-bold">Branch URL Slug</th>
                      <th className="px-3 py-2 text-right text-slate-600 font-bold w-12">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(homepage?.departmentsSection?.items ?? []).map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={e => {
                              const list = [...(homepage?.departmentsSection?.items ?? [])]
                              list[idx].name = e.target.value
                              setHomepage({ ...homepage, departmentsSection: { ...homepage.departmentsSection, items: list } })
                            }}
                            className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none font-semibold text-primary"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={item.slug}
                            onChange={e => {
                              const list = [...(homepage?.departmentsSection?.items ?? [])]
                              list[idx].slug = e.target.value
                              setHomepage({ ...homepage, departmentsSection: { ...homepage.departmentsSection, items: list } })
                            }}
                            className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none font-mono"
                          />
                        </td>
                        <td className="px-3 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const list = (homepage.departmentsSection?.items ?? []).filter((_: any, i: number) => i !== idx)
                              setHomepage({ ...homepage, departmentsSection: { ...homepage.departmentsSection, items: list } })
                            }}
                            className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded"
                          >
                            <Icons.Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex justify-start">
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(homepage?.departmentsSection?.items ?? []), { name: 'Computer Science & Engineering', slug: 'computer-engineering' }]
                      setHomepage({ ...homepage, departmentsSection: { ...homepage.departmentsSection, items: list } })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-300 hover:border-slate-500 text-slate-655 text-xs font-semibold rounded-md flex items-center gap-1.5"
                  >
                    <Icons.Plus size={12} /> Add Department Shortcut
                  </button>
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage Departments list saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Departments Shortcut
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'stats' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.BarChart3 size={18} className="text-accent" />
                3 Â· Key Campus Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(homepage?.statsSection?.items ?? []).map((stat: any, idx: number) => (
                  <div key={idx} className="border border-slate-200 p-3 rounded bg-slate-50/50">
                    <span className="text-xs font-bold text-slate-400 block mb-1 font-mono">Stat Card #{idx + 1}</span>
                    <input
                      type="text"
                      value={stat.val}
                      placeholder="e.g. 10,000+"
                      onChange={e => {
                        const newItems = [...(homepage?.statsSection?.items ?? [])]
                        newItems[idx].val = e.target.value
                        setHomepage({ ...homepage, statsSection: { ...homepage.statsSection, items: newItems } })
                      }}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary mb-2 font-bold text-primary"
                    />
                    <input
                      type="text"
                      value={stat.label}
                      placeholder="e.g. Students"
                      onChange={e => {
                        const newItems = [...(homepage?.statsSection?.items ?? [])]
                        newItems[idx].label = e.target.value
                        setHomepage({ ...homepage, statsSection: { ...homepage.statsSection, items: newItems } })
                      }}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary text-slate-600"
                    />
                  </div>
                ))}
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage statistics saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Campus Statistics
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'campus_life' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Compass size={18} className="text-accent" />
                6 Â· Campus Life Section
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Section Tag/Label</label>
                  <input
                    type="text"
                    value={homepage.campusLifeSection.label}
                    onChange={e => setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, label: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary Title</label>
                  <input
                    type="text"
                    value={homepage.campusLifeSection.heading}
                    onChange={e => setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Accent Title (Italic)</label>
                  <input
                    type="text"
                    value={homepage.campusLifeSection.accentText}
                    onChange={e => setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, accentText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Description Subtitle</label>
                  <input
                    type="text"
                    value={homepage.campusLifeSection.description}
                    onChange={e => setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, description: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Facilities Grid */}
              <div className="space-y-4 mt-4">
                <label className="text-xs font-bold text-slate-500 uppercase block">Facilities & Assets Cards</label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(homepage?.campusLifeSection?.facilities ?? []).map((fac: any, idx: number) => (
                    <div key={fac.id || idx} className="border border-slate-200 p-4 rounded-lg bg-white shadow-xs space-y-3 relative">
                      <button
                        onClick={() => {
                          const newFacs = (homepage.campusLifeSection?.facilities ?? []).filter((_: any, i: number) => i !== idx)
                          setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-650 transition-colors"
                      >
                        <Icons.Trash2 size={14} />
                      </button>
                      <span className="text-xs font-bold text-slate-400 block font-mono">FACILITY CARD #{idx + 1}</span>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Facility Title</label>
                        <input
                          type="text"
                          value={fac.title}
                          onChange={e => {
                            const newFacs = [...(homepage?.campusLifeSection?.facilities ?? [])]
                            newFacs[idx].title = e.target.value
                            setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                          }}
                          className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={fac.description}
                          onChange={e => {
                            const newFacs = [...(homepage?.campusLifeSection?.facilities ?? [])]
                            newFacs[idx].description = e.target.value
                            setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                          }}
                          className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Image URL</label>
                        <input
                          type="text"
                          value={fac.imageUrl}
                          onChange={e => {
                            const newFacs = [...(homepage?.campusLifeSection?.facilities ?? [])]
                            newFacs[idx].imageUrl = e.target.value
                            setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                          }}
                          className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-sans"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Navigation Path</label>
                          <input
                            type="text"
                            value={fac.to}
                            onChange={e => {
                              const newFacs = [...(homepage?.campusLifeSection?.facilities ?? [])]
                              newFacs[idx].to = e.target.value
                              setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                            }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase">Icon Name</label>
                          <input
                            type="text"
                            value={fac.iconName}
                            onChange={e => {
                              const newFacs = [...(homepage?.campusLifeSection?.facilities ?? [])]
                              newFacs[idx].iconName = e.target.value
                              setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                            }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      const newFacs = [...(homepage?.campusLifeSection?.facilities ?? []), { id: 'fac-' + Math.random().toString(36).slice(2, 6), title: 'New Facility', description: 'Brief descriptions', iconName: 'Building', imageUrl: 'https://picsum.photos/seed/sgslib/600/400', to: '#' }]
                      setHomepage({ ...homepage, campusLifeSection: { ...homepage.campusLifeSection, facilities: newFacs } })
                    }}
                    className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1.5"
                  >
                    <Icons.Plus size={12} /> Add Campus Asset
                  </button>
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage Campus Life saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Campus Life Preview
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'gallery' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Image size={18} className="text-accent" />
                8 Â· Photo Gallery Headers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Section Tag/Label</label>
                  <input
                    type="text"
                    value={homepage.gallerySection.subLabel}
                    onChange={e => setHomepage({ ...homepage, gallerySection: { ...homepage.gallerySection, subLabel: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary Title</label>
                  <input
                    type="text"
                    value={homepage.gallerySection.heading}
                    onChange={e => setHomepage({ ...homepage, gallerySection: { ...homepage.gallerySection, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Accent Title (Gold)</label>
                  <input
                    type="text"
                    value={homepage.gallerySection.accentText}
                    onChange={e => setHomepage({ ...homepage, gallerySection: { ...homepage.gallerySection, accentText: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">View All Path</label>
                  <input
                    type="text"
                    value={homepage.gallerySection.viewAllLink}
                    onChange={e => setHomepage({ ...homepage, gallerySection: { ...homepage.gallerySection, viewAllLink: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-6 flex justify-end">
              <button
                onClick={() => triggerSave('home', homepage, 'All Homepage CMS sections saved successfully!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" />
                Save All Homepage Sections
              </button>
            </div>
          
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage Photo Gallery saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Gallery Headers
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'faqs' && (
              <div className="space-y-6">
                <div className="space-y-4 pt-6">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.HelpCircle size={18} className="text-accent" />
                7 Â· Frequently Asked Questions (FAQs)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Section Tag/Label</label>
                  <input
                    type="text"
                    value={homepage.faqsSection.subLabel}
                    onChange={e => setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, subLabel: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Primary Title</label>
                  <input
                    type="text"
                    value={homepage.faqsSection.heading}
                    onChange={e => setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, heading: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">View All Path</label>
                  <input
                    type="text"
                    value={homepage.faqsSection.viewAllLink}
                    onChange={e => setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, viewAllLink: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* FAQs Accordions list */}
              <div className="space-y-4 mt-4">
                <label className="text-xs font-bold text-slate-500 uppercase block">Q&A list</label>
                <div className="space-y-4">
                  {(homepage?.faqsSection?.items ?? []).map((faq: any, idx: number) => (
                    <div key={faq.id || idx} className="border border-slate-200 p-4 rounded-lg bg-white shadow-xs space-y-3 relative">
                      <button
                        onClick={() => {
                          const newFaqs = (homepage.faqsSection?.items ?? []).filter((_: any, i: number) => i !== idx)
                          setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                        }}
                        className="absolute top-2 right-2 text-slate-400 hover:text-red-650 transition-colors"
                      >
                        <Icons.Trash2 size={14} />
                      </button>
                      <span className="text-xs font-bold text-slate-400 block font-mono">FAQ ITEM #{idx + 1}</span>
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Question Text</label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={e => {
                            const newFaqs = [...(homepage?.faqsSection?.items ?? [])]
                            newFaqs[idx].question = e.target.value
                            setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                          }}
                          className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs focus:outline-none font-semibold text-primary"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Direct Answer Text (Optional)</label>
                          <textarea
                            rows={3}
                            value={faq.answer || ''}
                            onChange={e => {
                              const newFaqs = [...(homepage?.faqsSection?.items ?? [])]
                              newFaqs[idx].answer = e.target.value || null
                              setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                            }}
                            className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-sans"
                            placeholder="Direct answer to show when expanded..."
                          />
                        </div>
                        <div className="border border-slate-100 p-3 rounded-md bg-slate-50/50 space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase block">Contact Person (Optional)</label>
                          <div className="grid grid-cols-1 gap-1.5">
                            <input
                              type="text"
                              value={faq.contact?.name || ''}
                              placeholder="Contact Name (e.g. Office of Academics)"
                              onChange={e => {
                                const newFaqs = [...(homepage?.faqsSection?.items ?? [])]
                                const updatedContact = faq.contact ? { ...faq.contact, name: e.target.value } : { name: e.target.value, phone: '', email: '' }
                                newFaqs[idx].contact = updatedContact.name || updatedContact.phone || updatedContact.email ? updatedContact : null
                                setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                              }}
                              className="w-full border border-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none"
                            />
                            <input
                              type="text"
                              value={faq.contact?.phone || ''}
                              placeholder="Phone Number (e.g. +91-731-2431234)"
                              onChange={e => {
                                const newFaqs = [...(homepage?.faqsSection?.items ?? [])]
                                const updatedContact = faq.contact ? { ...faq.contact, phone: e.target.value } : { name: '', phone: e.target.value, email: '' }
                                newFaqs[idx].contact = updatedContact.name || updatedContact.phone || updatedContact.email ? updatedContact : null
                                setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                              }}
                              className="w-full border border-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none font-mono"
                            />
                            <input
                              type="email"
                              value={faq.contact?.email || ''}
                              placeholder="Email Address (e.g. info@sgsits.ac.in)"
                              onChange={e => {
                                const newFaqs = [...(homepage?.faqsSection?.items ?? [])]
                                const updatedContact = faq.contact ? { ...faq.contact, email: e.target.value } : { name: '', phone: '', email: e.target.value }
                                newFaqs[idx].contact = updatedContact.name || updatedContact.phone || updatedContact.email ? updatedContact : null
                                setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                              }}
                              className="w-full border border-slate-200 rounded px-2 py-0.5 text-xs focus:outline-none font-sans"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      const newFaqs = [...(homepage?.faqsSection?.items ?? []), { id: 'faq-' + Math.random().toString(36).slice(2, 6), question: 'New Question Text?', answer: 'Answer details go here.', contact: null, defaultOpen: false }]
                      setHomepage({ ...homepage, faqsSection: { ...homepage.faqsSection, items: newFaqs } })
                    }}
                    className="px-3 py-1.5 border border-dashed border-slate-350 hover:border-slate-500 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-md flex items-center gap-1.5"
                  >
                    <Icons.Plus size={12} /> Add Q&A Accordion
                  </button>
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage FAQs saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save FAQs Section
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'seo' && (
              <div className="space-y-6">
                <div className="space-y-4">
              <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Shield size={18} className="text-accent" />
                SEO Meta & Keywords
              </h3>
              <div className="grid grid-cols-1 gap-4 bg-slate-50 p-4 rounded border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Meta Title Tag</label>
                  <input
                    type="text"
                    value={homepage.meta?.title || ''}
                    onChange={e => setHomepage({ ...homepage, meta: { ...homepage.meta, title: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Meta Description</label>
                  <textarea
                    rows={2}
                    value={homepage.meta?.description || ''}
                    onChange={e => setHomepage({ ...homepage, meta: { ...homepage.meta, description: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Keywords (Comma Separated)</label>
                  <input
                    type="text"
                    value={homepage.meta?.keywords || ''}
                    onChange={e => setHomepage({ ...homepage, meta: { ...homepage.meta, keywords: e.target.value } })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
              </div>
            </div>
                
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Homepage SEO Config saved!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Home SEO Meta
                  </button>
                </div>
    
              </div>
            )}

            {homeSubTab === 'prefooter' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Icons.Image size={18} className="text-accent" />
                    Pre-Footer Campus Panorama Banner
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Configure the wide panorama image and floating label displayed directly above the site footer on the homepage.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded border border-slate-200 font-sans">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Banner Image URL</label>
                      <input
                        type="text"
                        value={homepage.preFooter?.imageUrl || ''}
                        onChange={e => setHomepage({
                          ...homepage,
                          preFooter: { ...(homepage.preFooter || {}), imageUrl: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-mono text-xs focus:border-primary"
                        placeholder="/assets/campus-panorama.png"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Floating Image Label / Caption</label>
                      <input
                        type="text"
                        value={homepage.preFooter?.label || ''}
                        onChange={e => setHomepage({
                          ...homepage,
                          preFooter: { ...(homepage.preFooter || {}), label: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none bg-white font-semibold focus:border-primary"
                        placeholder="SGSITS Campus Sunset Panorama"
                      />
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="mt-4 border border-slate-200 rounded p-4 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400 block mb-2 uppercase tracking-wider">Live Preview</span>
                    <div className="relative w-full h-[180px] overflow-hidden rounded border border-slate-200 shadow-inner">
                      <img
                        src={homepage.preFooter?.imageUrl || '/assets/campus-panorama.png'}
                        alt={homepage.preFooter?.label || 'SGSITS Campus Sunset Panorama'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://picsum.photos/seed/sgsits/1200/400';
                        }}
                      />
                      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-xs text-white px-3 py-1.5 rounded text-xs font-semibold tracking-wide border border-white/10 select-none pointer-events-none font-sans">
                        {homepage.preFooter?.label || 'SGSITS Campus Sunset Panorama'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('home', homepage, 'Pre-Footer Image Banner saved successfully!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Pre-Footer Config
                  </button>
                </div>
              </div>
            )}
          </div>

        )}

        {/* â"€â"€â"€ ABOUT INSTITUTE TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {activeTab === 'about' && (

          <div className="space-y-6">
            {/* About sub-navigation */}
            <div className="flex flex-wrap border-b border-slate-200 gap-2 bg-slate-50 p-1.5 rounded-t-lg mb-6">
              {[
                { id: 'overview', label: 'Institute Overview', icon: Icons.Building2 },
                { id: 'vision_mission', label: 'Vision & Mission', icon: Icons.Target },
                { id: 'leadership', label: 'Leadership Message', icon: Icons.User },
                { id: 'governance', label: 'Governance & Council', icon: Icons.Shield },
                { id: 'committees', label: 'Committees Roster', icon: Icons.Briefcase },
                { id: 'administration', label: 'Administration', icon: Icons.Users },
                { id: 'directory', label: 'Telephone Directory', icon: Icons.Phone },
                { id: 'iqac', label: 'IQAC Quality', icon: Icons.Award },
                { id: 'accreditation_infra', label: 'Accreditation & Campus', icon: Icons.MapPin },
                { id: 'seo', label: 'SEO Config', icon: Icons.Search },
              ].map(sub => {
                const SubIcon = sub.icon
                const isSubActive = aboutSubTab === sub.id
                return (
                  <button
                    key={sub.id}
                    onClick={() => setAboutSubTab(sub.id as any)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all duration-200 shrink-0 ${
                      isSubActive
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <SubIcon size={12} className={isSubActive ? 'text-accent' : 'text-slate-400'} />
                    {sub.label}
                  </button>
                )
              })}
            </div>

            {/* Sub-tab panels */}
            {aboutSubTab === 'overview' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Narrative Story paragraphs</h3>
            <p className="text-xs text-slate-400 leading-normal">Write paragraphs below. Separate each paragraph by a full double blank line (i.e. click Enter twice). Standard HTML tags like &lt;strong&gt;&lt;/strong&gt; are supported.</p>
            <textarea
              rows={8}
              value={(aboutInst?.narrativeParagraphs ?? []).join('\n\n')}
              onChange={e => setAboutInst({ ...aboutInst, narrativeParagraphs: e.target.value.split('\n\n') })}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-sans leading-relaxed text-justify"
            />

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Institute highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(aboutInst?.highlights ?? []).map((item: any, idx: number) => (
                <div key={idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 flex flex-col gap-2 relative">
                  <button
                    onClick={() => {
                      const newList = (aboutInst?.highlights ?? []).filter((_: any, i: number) => i !== idx)
                      setAboutInst({ ...aboutInst, highlights: newList })
                    }}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Icons.Trash2 size={14} />
                  </button>
                  <span className="text-xs font-bold text-slate-400 block">HIGHLIGHT #{idx + 1}</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Value</label>
                      <input
                        type="text"
                        value={item.value}
                        onChange={e => {
                          const list = [...(aboutInst?.highlights ?? [])]
                          list[idx].value = e.target.value
                          setAboutInst({ ...aboutInst, highlights: list })
                        }}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => {
                          const list = [...(aboutInst?.highlights ?? [])]
                          list[idx].label = e.target.value
                          setAboutInst({ ...aboutInst, highlights: list })
                        }}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Description</label>
                    <input
                      type="text"
                      value={item.desc}
                      onChange={e => {
                        const list = [...(aboutInst?.highlights ?? [])]
                        list[idx].desc = e.target.value
                        setAboutInst({ ...aboutInst, highlights: list })
                      }}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Lucide Icon Name</label>
                    <input
                      type="text"
                      value={item.iconName}
                      onChange={e => {
                        const list = [...(aboutInst?.highlights ?? [])]
                        list[idx].iconName = e.target.value
                        setAboutInst({ ...aboutInst, highlights: list })
                      }}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => {
                  const newList = [...(aboutInst?.highlights ?? []), { iconName: 'Building2', label: 'New Highlight', value: '100+', desc: 'Short details description' }]
                  setAboutInst({ ...aboutInst, highlights: newList })
                }}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Icons.Plus size={14} /> Add New Highlight
              </button>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Affiliations & Recognition Bulletins</h3>
            <div className="space-y-2">
              {(aboutInst?.affiliations ?? []).map((aff: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={aff}
                    onChange={e => {
                      const list = [...(aboutInst?.affiliations ?? [])]
                      list[idx] = e.target.value
                      setAboutInst({ ...aboutInst, affiliations: list })
                    }}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={() => {
                      const list = (aboutInst?.affiliations ?? []).filter((_: any, i: number) => i !== idx)
                      setAboutInst({ ...aboutInst, affiliations: list })
                    }}
                    className="p-1.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Icons.Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => {
                  const list = [...(aboutInst?.affiliations ?? []), 'Affiliation and approvals point text']
                  setAboutInst({ ...aboutInst, affiliations: list })
                }}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Icons.Plus size={14} /> Add Affiliation Point
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('about_institute', aboutInst, 'About Profile CMS details updated!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" />
                Save About Profile
              </button>
            </div>

            {/* ── Journey Timeline ─────────────────────────────── */}
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-6">Our Journey — Timeline Events</h3>
            <p className="text-xs text-slate-400">Each entry appears as a milestone card on the About page. Add up to any number of events in chronological order.</p>
            <div className="space-y-3">
              {timeline.map((event: any, idx: number) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 relative">
                  <button
                    onClick={() => setTimeline(timeline.filter((_: any, i: number) => i !== idx))}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  ><Icons.Trash2 size={13} /></button>
                  <span className="text-xs font-bold text-slate-400 block mb-2">EVENT #{idx + 1}</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Year</label>
                      <input
                        type="text"
                        value={event.year}
                        onChange={e => { const list = [...timeline]; list[idx] = { ...list[idx], year: e.target.value }; setTimeline(list) }}
                        className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary font-bold"
                        placeholder="e.g. 1952"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Title</label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={e => { const list = [...timeline]; list[idx] = { ...list[idx], title: e.target.value }; setTimeline(list) }}
                        className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-primary"
                        placeholder="e.g. Institute Founded"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={event.description}
                        onChange={e => { const list = [...timeline]; list[idx] = { ...list[idx], description: e.target.value }; setTimeline(list) }}
                        className="w-full border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary font-sans leading-relaxed resize-none"
                        placeholder="Short description of this milestone..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setTimeline([...timeline, { year: String(new Date().getFullYear()), title: 'New Milestone', description: '' }])}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              ><Icons.Plus size={13} /> Add Milestone</button>
              <button
                onClick={() => triggerSave('timeline', timeline, 'Journey timeline saved!')}
                className="px-5 py-2 bg-primary text-white hover:bg-primary/95 text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 border border-accent/20 shadow-sm"
              ><Icons.Save size={12} className="text-accent" /> Save Timeline</button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'vision_mission' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Institutional Vision Statements</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Vision (English)</label>
                <textarea
                  rows={3}
                  value={visionMission.visionEnglish}
                  onChange={e => setVisionMission({ ...visionMission, visionEnglish: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-medium italic"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase font-sans">Vision (Hindi - à¤…à¤¨à¥à¤µà¤¾à¤¦)</label>
                <textarea
                  rows={3}
                  value={visionMission.visionHindi}
                  onChange={e => setVisionMission({ ...visionMission, visionHindi: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-medium text-slate-800"
                />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Mission points</h3>
            <div className="space-y-3">
              {(visionMission?.missionPoints ?? []).map((item: any, idx: number) => (
                <div key={idx} className="flex gap-2 items-start bg-slate-50/50 p-2 border border-slate-200 rounded">
                  <input
                    type="text"
                    value={item.num}
                    onChange={e => {
                      const list = [...(visionMission?.missionPoints ?? [])]
                      list[idx].num = e.target.value
                      setVisionMission({ ...visionMission, missionPoints: list })
                    }}
                    className="w-12 border border-slate-200 rounded px-2 py-1 text-xs text-center font-bold"
                  />
                  <textarea
                    rows={2}
                    value={item.text}
                    onChange={e => {
                      const list = [...(visionMission?.missionPoints ?? [])]
                      list[idx].text = e.target.value
                      setVisionMission({ ...visionMission, missionPoints: list })
                    }}
                    className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const list = (visionMission?.missionPoints ?? []).filter((_: any, i: number) => i !== idx)
                      setVisionMission({ ...visionMission, missionPoints: list })
                    }}
                    className="p-1.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded self-center"
                  >
                    <Icons.Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => {
                  const list = [...((visionMission?.missionPoints ?? []) || []), { num: String(((visionMission?.missionPoints ?? []) || []).length + 1), text: 'New institutional mission points description.' }]
                  setVisionMission({ ...visionMission, missionPoints: list })
                }}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 hover:text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Icons.Plus size={14} /> Add Mission Point
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('vision_mission', visionMission, 'Vision & Mission values saved!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" />
                Save Vision & Mission
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'leadership' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Director's Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Director Name</label>
                <input
                  type="text"
                  value={directorMessage.directorName}
                  onChange={e => setDirectorMessage({ ...directorMessage, directorName: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-bold text-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Director Image URL</label>
                <input
                  type="text"
                  value={directorMessage.directorPhotoUrl}
                  onChange={e => setDirectorMessage({ ...directorMessage, directorPhotoUrl: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Director Email</label>
                <input
                  type="email"
                  value={directorMessage.directorEmail}
                  onChange={e => setDirectorMessage({ ...directorMessage, directorEmail: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Director Phone</label>
                <input
                  type="text"
                  value={directorMessage.directorPhone}
                  onChange={e => setDirectorMessage({ ...directorMessage, directorPhone: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Director's Office Location</label>
                <input
                  type="text"
                  value={directorMessage.directorOffice}
                  onChange={e => setDirectorMessage({ ...directorMessage, directorOffice: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold text-slate-700"
                />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Clean Editorial Quote Block</h3>
            <div>
              <textarea
                rows={3}
                value={directorMessage.quote}
                onChange={e => setDirectorMessage({ ...directorMessage, quote: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-medium italic text-slate-800"
              />
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Director's Written Message Paragraphs</h3>
            <p className="text-xs text-slate-400 leading-normal">Write paragraphs below. Separate each paragraph by a full double blank line (i.e. click Enter twice).</p>
            <textarea
              rows={12}
              value={(directorMessage?.paragraphs ?? []).join('\n\n')}
              onChange={e => setDirectorMessage({ ...directorMessage, paragraphs: e.target.value.split('\n\n') })}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-sans leading-relaxed text-justify text-slate-750"
            />

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('director_message', directorMessage, 'Director\'s Message updated!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" />
                Save Director's Message
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'governance' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-primary border-b border-primary/10 pb-2">1 Â· Governing Body Board</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Board description</label>
              <textarea
                rows={3}
                value={governingBody.description}
                onChange={e => setGoverningBody({ ...governingBody, description: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Governing Members list</label>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-slate-600 font-bold">Role</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Name / Organization</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Category</th>
                    <th className="px-3 py-2 text-right text-slate-600 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(governingBody?.members ?? []).map((member: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.role}
                          onChange={e => {
                            const list = [...(governingBody?.members ?? [])]
                            list[idx].role = e.target.value
                            setGoverningBody({ ...governingBody, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={e => {
                            const list = [...(governingBody?.members ?? [])]
                            list[idx].name = e.target.value
                            setGoverningBody({ ...governingBody, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={member.category}
                          onChange={e => {
                            const list = [...(governingBody?.members ?? [])]
                            list[idx].category = e.target.value as any
                            setGoverningBody({ ...governingBody, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 bg-white focus:outline-none"
                        >
                          <option value="Government">Government</option>
                          <option value="University">University</option>
                          <option value="Industry">Industry</option>
                          <option value="Regulatory">Regulatory</option>
                          <option value="Faculty">Faculty</option>
                          <option value="Institute">Institute</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => {
                            const list = (governingBody?.members ?? []).filter((_: any, i: number) => i !== idx)
                            setGoverningBody({ ...governingBody, members: list })
                          }}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-start">
                <button
                  onClick={() => {
                    const list = [...(governingBody?.members ?? []), { role: 'Member', name: 'Nominee Name', category: 'Government' }]
                    setGoverningBody({ ...governingBody, members: list })
                  }}
                  className="px-3 py-1 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} /> Add Governing Member
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => triggerSave('governing_body', governingBody, 'Governing Body board saved!')}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/95 text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 border border-accent/20 shadow-sm"
              >
                <Icons.Save size={12} className="text-accent" /> Save Governing Body
              </button>
            </div>

            {/* Academic Council Section */}
            <h2 className="font-display text-xl font-bold text-primary border-b border-primary/10 pb-2 pt-6">2 Â· Academic Council Board</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">Academic Council Description</label>
              <textarea
                rows={3}
                value={academicCouncil.description}
                onChange={e => setAcademicCouncil({ ...academicCouncil, description: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Council Members list</label>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-slate-600 font-bold w-16">S.No.</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Member Name</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Designation</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Category</th>
                    <th className="px-3 py-2 text-right text-slate-600 font-bold w-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(academicCouncil?.members ?? []).map((member: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          value={member.sno}
                          onChange={e => {
                            const list = [...(academicCouncil?.members ?? [])]
                            list[idx].sno = Number(e.target.value)
                            setAcademicCouncil({ ...academicCouncil, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={e => {
                            const list = [...(academicCouncil?.members ?? [])]
                            list[idx].name = e.target.value
                            setAcademicCouncil({ ...academicCouncil, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.designation}
                          onChange={e => {
                            const list = [...(academicCouncil?.members ?? [])]
                            list[idx].designation = e.target.value
                            setAcademicCouncil({ ...academicCouncil, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.category}
                          onChange={e => {
                            const list = [...(academicCouncil?.members ?? [])]
                            list[idx].category = e.target.value
                            setAcademicCouncil({ ...academicCouncil, members: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => {
                            const list = (academicCouncil?.members ?? []).filter((_: any, i: number) => i !== idx)
                            setAcademicCouncil({ ...academicCouncil, members: list })
                          }}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-start">
                <button
                  onClick={() => {
                    const list = [...((academicCouncil?.members ?? []) || []), { sno: ((academicCouncil?.members ?? []) || []).length + 1, name: 'Council Nominee', designation: 'Invitee Member', category: 'Ex-Officio' }]
                    setAcademicCouncil({ ...academicCouncil, members: list })
                  }}
                  className="px-3 py-1 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} /> Add Council Member
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => triggerSave('academic_council', academicCouncil, 'Academic Council board saved!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" /> Save Academic Council
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'committees' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display text-lg font-bold text-slate-800">Administrative Committees</h3>
              <button
                onClick={() => {
                  const newList = [...committeesList, { name: 'New Committee', desc: 'Constituted for specific oversight purposes.', members: '0', membersList: [] }]
                  setCommitteesList(newList)
                }}
                className="px-3 py-1.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded flex items-center gap-1.5 border border-accent/20"
              >
                <Icons.Plus size={14} className="text-accent" /> Add New Committee
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {(committeesList ?? []).map((comm: any, idx: number) => (
                <div key={idx} className="border border-slate-200 p-5 rounded-lg bg-slate-50/30 flex flex-col gap-4 relative shadow-sm hover:border-slate-350 transition-all duration-200">
                  <button
                    onClick={() => {
                      const newList = (committeesList ?? []).filter((_: any, i: number) => i !== idx)
                      setCommitteesList(newList)
                    }}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors p-1 hover:bg-slate-100 rounded"
                    title="Delete Committee"
                  >
                    <Icons.Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Committee Name</label>
                      <input
                        type="text"
                        value={comm.name}
                        onChange={e => {
                          const newList = [...committeesList]
                          newList[idx].name = e.target.value
                          setCommitteesList(newList)
                        }}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-bold text-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Short Description</label>
                      <input
                        type="text"
                        value={comm.desc}
                        onChange={e => {
                          const newList = [...committeesList]
                          newList[idx].desc = e.target.value
                          setCommitteesList(newList)
                        }}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Members Sub-Table CRUD */}
                  <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Constituted Members ({comm.membersList?.length || 0})</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...committeesList]
                          newList[idx].membersList = [...(newList[idx].membersList || []), { role: 'Member', name: 'Dr. John Doe', dept: 'Department' }]
                          setCommitteesList(newList)
                        }}
                        className="px-2.5 py-1 border border-slate-250 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-bold uppercase rounded flex items-center gap-1 bg-white shadow-xs"
                      >
                        <Icons.UserPlus size={12} className="text-accent" /> Add Member
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                          <tr>
                            <th className="px-3 py-2">Role / Capacity</th>
                            <th className="px-3 py-2">Member Name</th>
                            <th className="px-3 py-2">Department / Affiliation</th>
                            <th className="px-3 py-2 text-right w-12">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                          {(comm.membersList || []).map((m: any, mIdx: number) => (
                            <tr key={mIdx} className="hover:bg-slate-50/50">
                              <td className="px-3 py-1.5">
                                <input
                                  type="text"
                                  value={m.role}
                                  onChange={e => {
                                    const newList = [...committeesList]
                                    newList[idx].membersList[mIdx].role = e.target.value
                                    setCommitteesList(newList)
                                  }}
                                  className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-primary"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="text"
                                  value={m.name}
                                  onChange={e => {
                                    const newList = [...committeesList]
                                    newList[idx].membersList[mIdx].name = e.target.value
                                    setCommitteesList(newList)
                                  }}
                                  className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                                />
                              </td>
                              <td className="px-3 py-1.5">
                                <input
                                  type="text"
                                  value={m.dept || ''}
                                  placeholder="e.g. Mechanical Engg"
                                  onChange={e => {
                                    const newList = [...committeesList]
                                    newList[idx].membersList[mIdx].dept = e.target.value
                                    setCommitteesList(newList)
                                  }}
                                  className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs"
                                />
                              </td>
                              <td className="px-3 py-1.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newList = [...committeesList]
                                    newList[idx].membersList = newList[idx].membersList.filter((_: any, i: number) => i !== mIdx)
                                    setCommitteesList(newList)
                                  }}
                                  className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded"
                                >
                                  <Icons.Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(comm.membersList || []).length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">No members added to this committee. Click "Add Member" to construct the roster.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('committees', committeesList, 'Administrative Committees roster saved!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" />
                Save All Committees
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'administration' && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-primary border-b border-primary/10 pb-2">Administration Officials Roster</h2>
                <p className="text-xs text-slate-400">These entries appear on the public Administration page. Add Directors, HODs, Officers and other key officials here.</p>
                <div className="space-y-2">
                  <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2 text-slate-600 font-bold">Role / Title</th>
                        <th className="px-3 py-2 text-slate-600 font-bold">Official Name</th>
                        <th className="px-3 py-2 text-slate-600 font-bold">Email</th>
                        <th className="px-3 py-2 text-slate-600 font-bold">Phone No.</th>
                        <th className="px-3 py-2 text-right text-slate-600 font-bold w-12">Del</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(administration ?? []).map((official: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-3 py-2">
                            <input type="text" value={official.title}
                              onChange={e => { const list = [...administration]; list[idx].title = e.target.value; setAdministration(list) }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none font-bold text-primary" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={official.name}
                              onChange={e => { const list = [...administration]; list[idx].name = e.target.value; setAdministration(list) }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="email" value={official.email}
                              onChange={e => { const list = [...administration]; list[idx].email = e.target.value; setAdministration(list) }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none font-mono" />
                          </td>
                          <td className="px-3 py-2">
                            <input type="text" value={official.phone}
                              onChange={e => { const list = [...administration]; list[idx].phone = e.target.value; setAdministration(list) }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none" />
                          </td>
                          <td className="px-3 py-2 text-right">
                            <button onClick={() => setAdministration((administration ?? []).filter((_: any, i: number) => i !== idx))}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded">
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setAdministration([...administration, { title: 'New Position', name: 'Dr. Officer', email: 'officer@sgsits.ac.in', phone: '0731-2431xxx' }])}
                      className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    ><Icons.Plus size={12} /> Add Official</button>
                    <button
                      onClick={() => triggerSave('administration', administration, 'Administration list saved!')}
                      className="px-4 py-2 bg-primary text-white hover:bg-primary/95 text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 border border-accent/20 shadow-sm"
                    ><Icons.Save size={12} className="text-accent" /> Save Administration</button>
                  </div>
                </div>
              </div>
            )}

            {aboutSubTab === 'directory' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-primary border-b border-primary/10 pb-2">Telephone Intercom Directory</h2>
            <div className="space-y-2">
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-slate-600 font-bold">Department</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Contact Name</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Phone No.</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Intercom Ext</th>
                    <th className="px-3 py-2 text-right text-slate-600 font-bold w-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(telephoneDirectory ?? []).map((entry: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.department}
                          onChange={e => {
                            const list = [...telephoneDirectory]
                            list[idx].department = e.target.value
                            setTelephoneDirectory(list)
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.name}
                          onChange={e => {
                            const list = [...telephoneDirectory]
                            list[idx].name = e.target.value
                            setTelephoneDirectory(list)
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none font-bold"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.phone}
                          onChange={e => {
                            const list = [...telephoneDirectory]
                            list[idx].phone = e.target.value
                            setTelephoneDirectory(list)
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={entry.ext}
                          onChange={e => {
                            const list = [...telephoneDirectory]
                            list[idx].ext = e.target.value
                            setTelephoneDirectory(list)
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-20 bg-white focus:outline-none text-center"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => {
                            const list = (telephoneDirectory ?? []).filter((_: any, i: number) => i !== idx)
                            setTelephoneDirectory(list)
                          }}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-start">
                <button
                  onClick={() => {
                    const list = [...telephoneDirectory, { department: 'New Department', name: 'HOD', phone: '0731-2582xxx', ext: '100' }]
                    setTelephoneDirectory(list)
                  }}
                  className="px-3 py-1 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} /> Add Telephone Roster entry
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('telephone', telephoneDirectory, 'Telephone directory CMS records saved!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" /> Save Telephone Directory
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'iqac' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">About IQAC cell</h3>
            <textarea
              rows={4}
              value={iqac.about}
              onChange={e => setIqac({ ...iqac, about: e.target.value })}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
            />

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-2">IQAC Strategic Vision</h3>
            <textarea
              rows={3}
              value={iqac.vision}
              onChange={e => setIqac({ ...iqac, vision: e.target.value })}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
            />

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-2">IQAC Committee Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Chairperson Name</label>
                <input
                  type="text"
                  value={iqac.chairpersonName}
                  onChange={e => setIqac({ ...iqac, chairpersonName: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Chairperson Title</label>
                <input
                  type="text"
                  value={iqac.chairpersonTitle}
                  onChange={e => setIqac({ ...iqac, chairpersonTitle: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Coordinator Name</label>
                <input
                  type="text"
                  value={iqac.coordinatorName}
                  onChange={e => setIqac({ ...iqac, coordinatorName: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Coordinator Email</label>
                <input
                  type="email"
                  value={iqac.coordinatorEmail}
                  onChange={e => setIqac({ ...iqac, coordinatorEmail: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none font-mono"
                />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Primary quality objectives</h3>
            <div className="space-y-2">
              {(iqac?.objectives ?? []).map((obj: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <span className="font-bold text-xs text-slate-400 self-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={obj}
                    onChange={e => {
                      const list = [...(iqac?.objectives ?? [])]
                      list[idx] = e.target.value
                      setIqac({ ...iqac, objectives: list })
                    }}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      const list = (iqac?.objectives ?? []).filter((_: any, i: number) => i !== idx)
                      setIqac({ ...iqac, objectives: list })
                    }}
                    className="p-1.5 border border-slate-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                  >
                    <Icons.Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-start">
              <button
                onClick={() => {
                  const list = [...(iqac?.objectives ?? []), 'New quality improvement parameter and metrics directive.']
                  setIqac({ ...iqac, objectives: list })
                }}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-655 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Icons.Plus size={14} /> Add IQAC Objective
              </button>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Recent IQAC Activities</h3>
            <div className="space-y-4">
              {(iqac.recentActivities || []).map((act: any, idx: number) => (
                <div key={idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 flex flex-col gap-2 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newList = iqac.recentActivities.filter((_: any, i: number) => i !== idx)
                      setIqac({ ...iqac, recentActivities: newList })
                    }}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-650 transition-colors"
                  >
                    <Icons.Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Activity Title</label>
                      <input
                        type="text"
                        value={act.title}
                        onChange={e => {
                          const list = [...iqac.recentActivities]
                          list[idx].title = e.target.value
                          setIqac({ ...iqac, recentActivities: list })
                        }}
                        className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Date / Timeline</label>
                      <input
                        type="text"
                        value={act.date}
                        onChange={e => {
                          const list = [...iqac.recentActivities]
                          list[idx].date = e.target.value
                          setIqac({ ...iqac, recentActivities: list })
                        }}
                        className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none font-semibold text-accent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Description / Achievement Summary</label>
                    <textarea
                      rows={2}
                      value={act.description}
                      onChange={e => {
                        const list = [...iqac.recentActivities]
                        list[idx].description = e.target.value
                        setIqac({ ...iqac, recentActivities: list })
                      }}
                      className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-start">
              <button
                type="button"
                onClick={() => {
                  const newList = [...(iqac.recentActivities || []), { title: 'New IQAC Event', description: 'Brief description of the quality audit/seminar.', date: 'May 2026' }]
                  setIqac({ ...iqac, recentActivities: newList })
                }}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-655 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Icons.Plus size={14} /> Add Recent Activity
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('iqac', iqac, 'IQAC Quality policies and contacts updated!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" /> Save IQAC Settings
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'accreditation_infra' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <h2 className="font-display text-xl font-bold text-primary border-b border-primary/10 pb-2">1 Â· Institutional Accreditation</h2>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">About Accreditations</label>
              <textarea
                rows={3}
                value={accreditation.about}
                onChange={e => setAccreditation({ ...accreditation, about: e.target.value })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Accreditation Audit Records</label>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-slate-600 font-bold">Body</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Grade/Status</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Valid Upto</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Audit Cycle</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">NAAC Score</th>
                    <th className="px-3 py-2 text-right text-slate-600 font-bold w-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(accreditation?.records ?? []).map((rec: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-bold text-primary">
                        <input
                          type="text"
                          value={rec.body}
                          onChange={e => {
                            const list = [...(accreditation?.records ?? [])]
                            list[idx].body = e.target.value
                            setAccreditation({ ...accreditation, records: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={rec.grade}
                          onChange={e => {
                            const list = [...(accreditation?.records ?? [])]
                            list[idx].grade = e.target.value
                            setAccreditation({ ...accreditation, records: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={rec.validUpto}
                          onChange={e => {
                            const list = [...(accreditation?.records ?? [])]
                            list[idx].validUpto = e.target.value
                            setAccreditation({ ...accreditation, records: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={rec.cycle || ''}
                          onChange={e => {
                            const list = [...(accreditation?.records ?? [])]
                            list[idx].cycle = e.target.value
                            setAccreditation({ ...accreditation, records: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-center"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={rec.naacScore || ''}
                          onChange={e => {
                            const list = [...(accreditation?.records ?? [])]
                            list[idx].naacScore = e.target.value
                            setAccreditation({ ...accreditation, records: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-center font-mono"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => {
                            const list = (accreditation?.records ?? []).filter((_: any, i: number) => i !== idx)
                            setAccreditation({ ...accreditation, records: list })
                          }}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-start">
                <button
                  onClick={() => {
                    const list = [...(accreditation?.records ?? []), { body: 'New Audit', grade: 'Approved', validUpto: '2028', cycle: 'Annual', naacScore: '' }]
                    setAccreditation({ ...accreditation, records: list })
                  }}
                  className="px-3 py-1 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} /> Add Accreditation Record
                </button>
              </div>
            </div>

            {/* NBA Programs Editor */}
            <div className="pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Accredited NBA Programs (One per line)</label>
              <textarea
                rows={4}
                value={(accreditation.nbaPrograms || []).join('\n')}
                onChange={e => setAccreditation({ ...accreditation, nbaPrograms: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
                placeholder="e.g. B.E. Computer Engineering"
              />
            </div>

            {/* NIRF Rankings Editor */}
            <div className="space-y-2 pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">NIRF National Rankings</label>
              <table className="w-full text-xs text-left border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 text-slate-600 font-bold">Year</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Rank / Achievement</th>
                    <th className="px-3 py-2 text-slate-600 font-bold">Category</th>
                    <th className="px-3 py-2 text-right text-slate-600 font-bold w-12">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(accreditation.nirf || []).map((n: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={n.year}
                          onChange={e => {
                            const list = [...accreditation.nirf]
                            list[idx].year = e.target.value
                            setAccreditation({ ...accreditation, nirf: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={n.rank}
                          onChange={e => {
                            const list = [...accreditation.nirf]
                            list[idx].rank = e.target.value
                            setAccreditation({ ...accreditation, nirf: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none font-semibold"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={n.category}
                          onChange={e => {
                            const list = [...accreditation.nirf]
                            list[idx].category = e.target.value
                            setAccreditation({ ...accreditation, nirf: list })
                          }}
                          className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const list = accreditation.nirf.filter((_: any, i: number) => i !== idx)
                            setAccreditation({ ...accreditation, nirf: list })
                          }}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => {
                    const list = [...(accreditation.nirf || []), { year: '2026', rank: 'Top 100', category: 'Engineering' }]
                    setAccreditation({ ...accreditation, nirf: list })
                  }}
                  className="px-3 py-1 border border-dashed border-slate-300 hover:border-slate-500 text-slate-600 text-xs font-semibold rounded-md flex items-center gap-1.5"
                >
                  <Icons.Plus size={12} /> Add NIRF Entry
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => triggerSave('accreditation', accreditation, 'Accreditations saved!')}
                className="px-4 py-2 bg-primary text-white hover:bg-primary/95 text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5 border border-accent/20 shadow-sm"
              >
                <Icons.Save size={12} className="text-accent" /> Save Accreditations
              </button>
            </div>

            {/* Infrastructure Section */}
            <h2 className="font-display text-xl font-bold text-primary border-b border-primary/10 pb-2 pt-6">2 Â· Campus Infrastructure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Campus Area (e.g. 51+ Acres)</label>
                <input
                  type="text"
                  value={infrastructure.campusArea}
                  onChange={e => setInfrastructure({ ...infrastructure, campusArea: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Built-Up Area</label>
                <input
                  type="text"
                  value={infrastructure.builtUpArea}
                  onChange={e => setInfrastructure({ ...infrastructure, builtUpArea: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Infrastructure Summary narrative</label>
                <textarea
                  rows={3}
                  value={infrastructure.summary}
                  onChange={e => setInfrastructure({ ...infrastructure, summary: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>

            <h3 className="font-display text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 pt-4">Campus Blocks & Buildings</h3>
            <div className="grid grid-cols-1 gap-4">
              {(infrastructure?.items ?? []).map((block: any, idx: number) => (
                <div key={idx} className="border border-slate-200 p-4 rounded-lg bg-slate-50/50 flex flex-col gap-2 relative">
                  <button
                    onClick={() => {
                      const newList = (infrastructure?.items ?? []).filter((_: any, i: number) => i !== idx)
                      setInfrastructure({ ...infrastructure, items: newList })
                    }}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Icons.Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Block/Facility Title</label>
                      <input
                        type="text"
                        value={block.title}
                        onChange={e => {
                          const list = [...(infrastructure?.items ?? [])]
                          list[idx].title = e.target.value
                          setInfrastructure({ ...infrastructure, items: list })
                        }}
                        className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                    <textarea
                      rows={2}
                      value={block.description}
                      onChange={e => {
                        const list = [...(infrastructure?.items ?? [])]
                        list[idx].description = e.target.value
                        setInfrastructure({ ...infrastructure, items: list })
                      }}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-start">
              <button
                onClick={() => {
                  const newList = [...(infrastructure?.items ?? []), { title: 'New Facility Block', description: 'Classrooms, high tech laboratories, and seminar halls.' }]
                  setInfrastructure({ ...infrastructure, items: newList })
                }}
                className="px-3 py-1.5 border border-dashed border-slate-300 hover:border-slate-500 text-slate-655 text-xs font-semibold rounded-lg flex items-center gap-1.5"
              >
                <Icons.Plus size={14} /> Add Campus Block
              </button>
            </div>

            {/* Additional Facilities Editor */}
            <div className="pt-4">
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Additional Facilities (One per line)</label>
              <textarea
                rows={4}
                value={(infrastructure.additionalFacilities || []).join('\n')}
                onChange={e => setInfrastructure({ ...infrastructure, additionalFacilities: e.target.value.split('\n').map(l => l.trim()).filter(Boolean) })}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none"
                placeholder="e.g. Solar Power Plant"
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('infrastructure', infrastructure, 'Campus Infrastructure parameters saved!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" /> Save Campus Details
              </button>
            </div>
          </div>
              </div>
            )}

            {aboutSubTab === 'seo' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Icons.Search size={18} className="text-accent" /> About Page SEO Metadata
                  </h3>
                  <button
                    onClick={() => { seoService.savePageSeo('about', allSeo['about']); setToast('About SEO Meta updated!') }}
                    className="px-5 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
                  >
                    <Icons.Save size={13} className="text-accent" /> Save SEO Config
                  </button>
                </div>
                {allSeo['about'] && (
                  <div className="space-y-4">
                    {([
                      ['pageTitle', 'Page Title (HTML <title>)', false],
                      ['metaDescription', 'Meta Description', true],
                      ['keywords', 'Meta Keywords (comma-separated)', false],
                      ['ogTitle', 'Open Graph Title', false],
                      ['ogDescription', 'OG Description', true],
                      ['ogImage', 'OG Image URL', false],
                      ['canonicalUrl', 'Canonical URL', false],
                    ] as [keyof SeoMeta, string, boolean][]).map(([field, label, multiline]) => (
                      <div key={field}>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                        {multiline ? (
                          <textarea
                            rows={3}
                            value={(allSeo['about'][field] ?? '') as string}
                            onChange={e => setAllSeo(prev => ({ ...prev, about: { ...prev.about, [field]: e.target.value } }))}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          />
                        ) : (
                          <input
                            type="text"
                            value={(allSeo['about'][field] ?? '') as string}
                            onChange={e => setAllSeo(prev => ({ ...prev, about: { ...prev.about, [field]: e.target.value } }))}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                          />
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Twitter Card Type</label>
                      <select
                        value={allSeo['about'].twitterCard ?? 'summary_large_image'}
                        onChange={e => setAllSeo(prev => ({ ...prev, about: { ...prev.about, twitterCard: e.target.value as any } }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="summary">summary</option>
                        <option value="summary_large_image">summary_large_image</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        )}

        {/* â"€â"€â"€ VISION & MISSION TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ GOVERNANCE & COUNCIL TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ ADMIN & DIRECTORY TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ QUALITY & IQAC TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ ACCREDITATION & INFRASTRUCTURE TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* --- ACADEMICS & COURSES TAB ------------------------------------------ */}
        {activeTab === 'academics' && (
          <div><AdminAcademicsCms /><PageSectionsBuilder pageKey="academics" /></div>
        )}

        {/* â"€â"€â"€ DIRECTOR'S MESSAGE TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ ADMINISTRATIVE COMMITTEES TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ SITE NAVIGATION & DROPDOWNS TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {}

        {/* â"€â"€â"€ DYNAMIC PAGES BUILDER TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {activeTab === 'departments' && (
          <div><AdminDepartments /><PageSectionsBuilder pageKey="departments" /></div>
        )}

        {activeTab === 'custom_pages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">Dynamic Section Pages Builder</h3>
                <p className="text-xs text-slate-500 mt-0.5">Build and manage custom sub-pages under either the About Us or Admissions dropdown sections. Created pages mount automatically.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPageModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary border border-accent/20 hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-wider rounded-md"
              >
                <Icons.Plus size={13} className="text-accent" /> Create Page
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customPages.map((p: any) => {
                const parentMenu = p.menu || 'about'
                return (
                  <div key={p.slug} className="border border-slate-200 p-5 rounded-lg bg-white shadow-2xs space-y-3 flex flex-col justify-between hover:border-slate-350 transition-colors">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-accent uppercase tracking-wider font-mono">
                          {parentMenu === 'about' ? 'About Us' : parentMenu === 'admission' ? 'Admissions' : parentMenu === 'placement' ? 'Placements' : 'Campus Life'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 font-display text-sm leading-snug mt-1">{p.title}</h4>
                      <p className="text-xs font-mono text-slate-400 mt-1">/{parentMenu === 'campus-life' ? 'students' : parentMenu}/{p.slug}</p>
                      <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">{p.subtitle || 'Custom dynamic page'}</p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-slate-100 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveEditPage(p)
                          setPageForm({
                            title: p.title,
                            subtitle: p.subtitle || '',
                            paragraphs: (p.narrativeParagraphs || []).join('\n\n'),
                            highlightsText: (p.highlights || []).map((h: any) => `${h.iconName}|${h.label}|${h.value}|${h.desc}`).join('\n'),
                            affiliationsText: (p.affiliations || []).join('\n')
                          })
                        }}
                        className="flex-1 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs uppercase rounded hover:bg-slate-100 flex items-center justify-center gap-1"
                      >
                        <Icons.Pencil size={11} /> Edit Content
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          // delete confirmed via button click — proceed
                          if (false) {
                            return
                          }
                          const current = cms.getCustomPages()
                          const filteredPages = current.filter((x: any) => x.slug !== p.slug)
                          cms.saveCustomPages(filteredPages)

                          // Remove from navigation menu
                          const navs = cms.getNavItems()
                          const parentNav = navs.find((n: any) => n.id === parentMenu)
                          if (parentNav && parentNav.children) {
                            const path = parentMenu === 'campus-life'
                              ? `/students/${p.slug}`
                              : `/${parentMenu}/${p.slug}`
                            parentNav.children = parentNav.children.filter((c: any) => c.path !== path)
                            cms.saveNavItems(navs)
                          }

                          setToast(`Dynamic Page ${p.title} deleted.`)
                          refreshAll()
                        }}
                        className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                        title="Delete Page"
                      >
                        <Icons.Trash2 size={12} />
                      </button>
                      <Link
                        to={`/${parentMenu === 'campus-life' ? 'students' : parentMenu}/${p.slug}`}
                        target="_blank"
                        className="p-1.5 border border-slate-200 text-slate-500 hover:text-accent-blue rounded hover:bg-slate-50"
                        title="Preview Public Page"
                      >
                        <Icons.ExternalLink size={12} />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CREATE PAGE MODAL */}
            {showAddPageModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddPageModal(false)} />
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    if (!addPageForm.slug || !addPageForm.title) return
                    const cleanSlug = addPageForm.slug.toLowerCase().trim().replace(/\s+/g, '-')
                    const newPage = {
                      slug: cleanSlug,
                      menu: addPageForm.menu,
                      title: addPageForm.title,
                      subtitle: addPageForm.subtitle,
                      narrativeParagraphs: ['This is a freshly drafted dynamic page. You can customize paragraphs, highlights, and affiliations easily.'],
                      highlights: [{ iconName: 'Award', label: 'Recognition', value: 'New Cycle', desc: 'Accredited dynamic content' }],
                      affiliations: ['AICTE Approved', 'State Ratified']
                    }

                    const current = await cms.getCustomPages()
                    await cms.saveCustomPages([...(current ?? []), newPage])

                    // Add page to navigation menus so it's instantly accessible
                    const navs = await cms.getNavItems()
                    const parentMenu = (navs ?? []).find((n: any) => n.id === addPageForm.menu)
                    if (parentMenu && parentMenu.children) {
                      const path = addPageForm.menu === 'campus-life'
                        ? `/students/${cleanSlug}`
                        : `/${addPageForm.menu}/${cleanSlug}`
                      const exists = parentMenu.children.some((c: any) => c.path === path)
                      if (!exists) {
                        parentMenu.children.push({ label: addPageForm.title, path })
                        await cms.saveNavItems(navs)
                      }
                    }

                    setToast(`Dynamic Page ${newPage.title} created and registered in Nav Menu.`)
                    setShowAddPageModal(false)
                    setAddPageForm({ slug: '', title: '', subtitle: '', menu: 'about' })
                    refreshAll()
                  }} className="space-y-4">
                    <h3 className="font-bold text-slate-800 font-display text-sm uppercase tracking-wider border-b border-slate-200 pb-2">Draft Custom dynamic subpage</h3>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Parent Dropdown Menu Section</label>
                      <select
                        value={addPageForm.menu}
                        onChange={e => setAddPageForm({ ...addPageForm, menu: e.target.value as 'about' | 'admission' | 'placement' | 'campus-life' })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-bold text-slate-800 bg-white"
                      >
                        <option value="about">About Us Dropdown</option>
                        <option value="admission">Admissions Dropdown</option>
                        <option value="placement">Placements Dropdown</option>
                        <option value="campus-life">Campus Life Dropdown</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Page Title Name</label>
                      <input
                        type="text"
                        required
                        value={addPageForm.title}
                        onChange={e => setAddPageForm({ ...addPageForm, title: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                        placeholder="e.g. Research & Development Legacy"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Page URL Slug Segment</label>
                      <input
                        type="text"
                        required
                        value={addPageForm.slug}
                        onChange={e => setAddPageForm({ ...addPageForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                        placeholder="e.g. research-legacy"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase">Page Subtitle / Academic Tag</label>
                      <input
                        type="text"
                        value={addPageForm.subtitle}
                        onChange={e => setAddPageForm({ ...addPageForm, subtitle: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                        placeholder="e.g. Driving innovation hubs across Central India"
                      />
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setShowAddPageModal(false)} className="flex-grow py-2 border border-slate-200 text-slate-700 rounded font-semibold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="flex-grow py-2 bg-primary text-white rounded font-semibold text-xs uppercase tracking-wider hover:opacity-90">âœ" Draft Page</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* EDIT PAGE MODAL */}
            {activeEditPage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setActiveEditPage(null)} />
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 z-10">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    if (!activeEditPage) return

                    const resolvedParas = pageForm.paragraphs.split('\n\n').map(p => p.trim()).filter(Boolean)
                    const resolvedHl = pageForm.highlightsText.split('\n').map(line => {
                      const parts = line.split('|')
                      return {
                        iconName: parts[0] || 'Award',
                        label: parts[1] || 'Highlight',
                        value: parts[2] || 'New',
                        desc: parts[3] || ''
                      }
                    }).filter(h => h.label)
                    const resolvedAff = pageForm.affiliationsText.split('\n').map(l => l.trim()).filter(Boolean)

                    const updatedPage = {
                      slug: activeEditPage.slug,
                      title: pageForm.title,
                      subtitle: pageForm.subtitle,
                      narrativeParagraphs: resolvedParas,
                      highlights: resolvedHl,
                      affiliations: resolvedAff
                    }

                    cms.saveCustomPage(activeEditPage.slug, updatedPage)
                    setToast(`Dynamic Page ${updatedPage.title} saved successfully.`)
                    setActiveEditPage(null)
                    refreshAll()
                  }} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h3 className="font-bold text-slate-800 font-display text-sm uppercase tracking-wider">Edit Content â€" {activeEditPage.title}</h3>
                      <button type="button" onClick={() => setActiveEditPage(null)} className="text-slate-400 hover:text-slate-600"><Icons.X size={18} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Title Name</label>
                        <input
                          type="text"
                          required
                          value={pageForm.title}
                          onChange={e => setPageForm({ ...pageForm, title: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs mt-1 focus:outline-none focus:border-primary font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Page Subtitle</label>
                        <input
                          type="text"
                          value={pageForm.subtitle}
                          onChange={e => setPageForm({ ...pageForm, subtitle: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs mt-1 focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase font-sans">Narrative Paragraphs (Double Enter to separate paragraphs)</label>
                      <textarea
                        rows={6}
                        value={pageForm.paragraphs}
                        onChange={e => setPageForm({ ...pageForm, paragraphs: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs mt-1 focus:outline-none font-sans leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Key highlights markers (Format: Icon|Label|Value|Description)</label>
                        <textarea
                          rows={4}
                          value={pageForm.highlightsText}
                          onChange={e => setPageForm({ ...pageForm, highlightsText: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none font-mono text-xs leading-normal"
                          placeholder="e.g. Award|Legacy|70+ Years|Innovation since 1952"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Affiliations / Recognitions (One per line)</label>
                        <textarea
                          rows={4}
                          value={pageForm.affiliationsText}
                          onChange={e => setPageForm({ ...pageForm, affiliationsText: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none font-sans leading-normal"
                          placeholder="e.g. Approved by AICTE, New Delhi"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setActiveEditPage(null)} className="flex-grow py-2 border border-slate-200 text-slate-700 rounded font-semibold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="flex-grow py-2 bg-primary text-white rounded font-semibold text-xs uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1.5"><Icons.Save size={13} className="text-accent" /> Save page changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* â"€â"€â"€ ADMISSIONS CMS TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {activeTab === 'admissions' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">Dynamic Admissions CMS</h3>
                <p className="text-xs text-slate-500 mt-0.5">Control the titles, descriptions, fee matrices, timelines, document checklists, and eligibility guidelines across all admissions portals.</p>
              </div>
            </div>

            {/* Admissions Sub-tabs */}
            <div className="flex border-b border-slate-200 gap-4 text-xs font-bold uppercase tracking-wider">
              {[
                { id: 'ug', label: 'UG Admissions' },
                { id: 'pg', label: 'PG Admissions' },
                { id: 'phd', label: 'PhD Admissions' },
                { id: 'prospectus', label: 'Prospectus Download' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setAdmSubTab(sub.id as any)}
                  className={`pb-2 px-1 border-b-2 transition-all ${
                    admSubTab === sub.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* â"€â"€â"€ UG ADMISSIONS CMS SUBTAB â"€â"€â"€ */}
            {admSubTab === 'ug' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">UG Header Title</label>
                    <input
                      type="text"
                      value={admissionUg.title || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, title: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Apply Link URL</label>
                    <input
                      type="text"
                      value={admissionUg.applyUrl || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, applyUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">UG Description Statement</label>
                    <textarea
                      rows={2}
                      value={admissionUg.description || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, description: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">MPDTE Counselling URL</label>
                    <input
                      type="text"
                      value={admissionUg.mpdteUrl || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, mpdteUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Prospectus Page URL</label>
                    <input
                      type="text"
                      value={admissionUg.prospectusUrl || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, prospectusUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Admission Cell Email</label>
                    <input
                      type="text"
                      value={admissionUg.admissionEmail || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, admissionEmail: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Admission Cell Phone</label>
                    <input
                      type="text"
                      value={admissionUg.admissionPhone || ''}
                      onChange={e => setAdmissionUg({ ...admissionUg, admissionPhone: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary text-xs"
                    />
                  </div>
                </div>

                {/* Programs Grid */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Undergraduate Offered Programs Matrix</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Program Name</th>
                        <th className="px-3 py-2 text-center w-24">Intake Seats</th>
                        <th className="px-3 py-2">Eligibility Criteria</th>
                        <th className="px-3 py-2">Counselling Basis</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionUg?.programs ?? []).map((p: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.name}
                              onChange={e => {
                                const list = [...(admissionUg?.programs ?? [])]
                                list[idx].name = e.target.value
                                setAdmissionUg({ ...admissionUg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="number"
                              value={p.seats}
                              onChange={e => {
                                const list = [...(admissionUg?.programs ?? [])]
                                list[idx].seats = parseInt(e.target.value) || 0
                                setAdmissionUg({ ...admissionUg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-accent"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.eligibility}
                              onChange={e => {
                                const list = [...(admissionUg?.programs ?? [])]
                                list[idx].eligibility = e.target.value
                                setAdmissionUg({ ...admissionUg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.basis}
                              onChange={e => {
                                const list = [...(admissionUg?.programs ?? [])]
                                list[idx].basis = e.target.value
                                setAdmissionUg({ ...admissionUg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-655"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionUg?.programs ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionUg({ ...admissionUg, programs: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionUg?.programs ?? []), { name: 'B.Tech Smart Systems', seats: 60, eligibility: '10+2 with PCM (min 45%)', basis: 'JEE Main / MPDTE' }]
                      setAdmissionUg({ ...admissionUg, programs: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Program Row
                  </button>
                </div>

                {/* Counselling keyDates */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Admission & Counselling Timeline Calendar</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Event Milestone</th>
                        <th className="px-3 py-2">Milestone Schedule Date</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionUg?.keyDates ?? []).map((d: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={d.event}
                              onChange={e => {
                                const list = [...(admissionUg?.keyDates ?? [])]
                                list[idx].event = e.target.value
                                setAdmissionUg({ ...admissionUg, keyDates: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={d.date}
                              onChange={e => {
                                const list = [...(admissionUg?.keyDates ?? [])]
                                list[idx].date = e.target.value
                                setAdmissionUg({ ...admissionUg, keyDates: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionUg?.keyDates ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionUg({ ...admissionUg, keyDates: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionUg?.keyDates ?? []), { event: 'Allotment Letter Issued', date: 'August 2025' }]
                      setAdmissionUg({ ...admissionUg, keyDates: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Date Event
                  </button>
                </div>

                {/* Tuition fees */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Tuition Fees Structure</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Quota Category</th>
                        <th className="px-3 py-2 text-center">Tuition Fee</th>
                        <th className="px-3 py-2 text-center">Other Miscellaneous Fees</th>
                        <th className="px-3 py-2 text-center">Total / Year</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionUg?.fees ?? []).map((f: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.category}
                              onChange={e => {
                                const list = [...(admissionUg?.fees ?? [])]
                                list[idx].category = e.target.value
                                setAdmissionUg({ ...admissionUg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.tuition}
                              onChange={e => {
                                const list = [...(admissionUg?.fees ?? [])]
                                list[idx].tuition = e.target.value
                                setAdmissionUg({ ...admissionUg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.other}
                              onChange={e => {
                                const list = [...(admissionUg?.fees ?? [])]
                                list[idx].other = e.target.value
                                setAdmissionUg({ ...admissionUg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-mono"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.total}
                              onChange={e => {
                                const list = [...(admissionUg?.fees ?? [])]
                                list[idx].total = e.target.value
                                setAdmissionUg({ ...admissionUg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-primary"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionUg?.fees ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionUg({ ...admissionUg, fees: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionUg?.fees ?? []), { category: 'TFW (Tuition Fee Waiver)', tuition: 'â‚¹0', other: 'â‚¹12,500', total: 'â‚¹12,500' }]
                      setAdmissionUg({ ...admissionUg, fees: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Fee Tier Row
                  </button>
                </div>

                {/* Documents list */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Documents Checklist Required (One per line)</label>
                  <textarea
                    rows={6}
                    value={(admissionUg?.documents ?? []).join('\n')}
                    onChange={e => setAdmissionUg({ ...admissionUg, documents: e.target.value.split('\n').filter(Boolean) })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none leading-relaxed font-sans"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => triggerSave('admission_ug', admissionUg, 'Undergraduate admissions successfully updated!')}
                    className="px-6 py-2 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" /> Save UG Changes
                  </button>
                </div>
              </div>
            )}

            {/* â"€â"€â"€ PG ADMISSIONS CMS SUBTAB â"€â"€â"€ */}
            {admSubTab === 'pg' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">PG Header Title</label>
                    <input
                      type="text"
                      value={admissionPg.title || ''}
                      onChange={e => setAdmissionPg({ ...admissionPg, title: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Apply Link URL</label>
                    <input
                      type="text"
                      value={admissionPg.applyUrl || ''}
                      onChange={e => setAdmissionPg({ ...admissionPg, applyUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">PG Description Statement</label>
                    <textarea
                      rows={2}
                      value={admissionPg.description || ''}
                      onChange={e => setAdmissionPg({ ...admissionPg, description: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                    />
                  </div>
                </div>

                {/* PG programs Offered */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">PG Offered Programs Seats Directory</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Program Title</th>
                        <th className="px-3 py-2">Parent Department</th>
                        <th className="px-3 py-2 text-center w-24">Intake Seats</th>
                        <th className="px-3 py-2">Eligibility Criteria</th>
                        <th className="px-3 py-2">Admission Basis</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionPg?.programs ?? []).map((p: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.name}
                              onChange={e => {
                                const list = [...(admissionPg?.programs ?? [])]
                                list[idx].name = e.target.value
                                setAdmissionPg({ ...admissionPg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.dept}
                              onChange={e => {
                                const list = [...(admissionPg?.programs ?? [])]
                                list[idx].dept = e.target.value
                                setAdmissionPg({ ...admissionPg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="number"
                              value={p.seats}
                              onChange={e => {
                                const list = [...(admissionPg?.programs ?? [])]
                                list[idx].seats = parseInt(e.target.value) || 0
                                setAdmissionPg({ ...admissionPg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-accent"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.eligibility}
                              onChange={e => {
                                const list = [...(admissionPg?.programs ?? [])]
                                list[idx].eligibility = e.target.value
                                setAdmissionPg({ ...admissionPg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={p.basis}
                              onChange={e => {
                                const list = [...(admissionPg?.programs ?? [])]
                                list[idx].basis = e.target.value
                                setAdmissionPg({ ...admissionPg, programs: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionPg?.programs ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionPg({ ...admissionPg, programs: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionPg?.programs ?? []), { name: 'M.Tech Data Science', dept: 'Computer Engineering', seats: 18, eligibility: 'B.Tech CSE/IT (min 60%)', basis: 'GATE CS' }]
                      setAdmissionPg({ ...admissionPg, programs: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add PG Course Row
                  </button>
                </div>

                {/* PG Tuition fees */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">PG Fee Tiers Structure</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Program Scope</th>
                        <th className="px-3 py-2 text-center">Tuition Fee</th>
                        <th className="px-3 py-2 text-center">Other Miscellaneous Fees</th>
                        <th className="px-3 py-2 text-center">Total / Year</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionPg?.fees ?? []).map((f: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.program}
                              onChange={e => {
                                const list = [...(admissionPg?.fees ?? [])]
                                list[idx].program = e.target.value
                                setAdmissionPg({ ...admissionPg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.tuition}
                              onChange={e => {
                                const list = [...(admissionPg?.fees ?? [])]
                                list[idx].tuition = e.target.value
                                setAdmissionPg({ ...admissionPg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.other}
                              onChange={e => {
                                const list = [...(admissionPg?.fees ?? [])]
                                list[idx].other = e.target.value
                                setAdmissionPg({ ...admissionPg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-mono"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={f.total}
                              onChange={e => {
                                const list = [...(admissionPg?.fees ?? [])]
                                list[idx].total = e.target.value
                                setAdmissionPg({ ...admissionPg, fees: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-primary"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionPg?.fees ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionPg({ ...admissionPg, fees: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionPg?.fees ?? []), { program: 'M.Pharm (All branches)', tuition: 'â‚¹48,000', other: 'â‚¹12,000', total: 'â‚¹60,000' }]
                      setAdmissionPg({ ...admissionPg, fees: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add PG Fee Row
                  </button>
                </div>

                {/* PG Scholarships */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">PG Scholarships & Stipends</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2 w-44">Scholarship Name</th>
                        <th className="px-3 py-2 w-32">Stipend Amount</th>
                        <th className="px-3 py-2">Short Description</th>
                        <th className="px-3 py-2">Fellowship Eligibility</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionPg?.scholarships ?? []).map((s: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={s.title}
                              onChange={e => {
                                const list = [...(admissionPg?.scholarships ?? [])]
                                list[idx].title = e.target.value
                                setAdmissionPg({ ...admissionPg, scholarships: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={s.amount}
                              onChange={e => {
                                const list = [...(admissionPg?.scholarships ?? [])]
                                list[idx].amount = e.target.value
                                setAdmissionPg({ ...admissionPg, scholarships: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-extrabold text-accent"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={s.desc}
                              onChange={e => {
                                const list = [...(admissionPg?.scholarships ?? [])]
                                list[idx].desc = e.target.value
                                setAdmissionPg({ ...admissionPg, scholarships: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={s.eligibility}
                              onChange={e => {
                                const list = [...(admissionPg?.scholarships ?? [])]
                                list[idx].eligibility = e.target.value
                                setAdmissionPg({ ...admissionPg, scholarships: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-500"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionPg?.scholarships ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionPg({ ...admissionPg, scholarships: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionPg?.scholarships ?? []), { title: 'Non-GATE Scholarship', amount: 'â‚¹8,000/month', desc: 'AICTE fellowship for PG candidates of accredited courses.', eligibility: 'Valid score / entrance' }]
                      setAdmissionPg({ ...admissionPg, scholarships: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Scholarship Card
                  </button>
                </div>

                {/* PG Contacts */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">PG Admission Contacts & Coordinators</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2">Role Name</th>
                        <th className="px-3 py-2">Officer Name</th>
                        <th className="px-3 py-2">Affiliation Department</th>
                        <th className="px-3 py-2">Office Phone</th>
                        <th className="px-3 py-2">Inquiry Email</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionPg?.contacts ?? []).map((c: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={c.role}
                              onChange={e => {
                                const list = [...(admissionPg?.contacts ?? [])]
                                list[idx].role = e.target.value
                                setAdmissionPg({ ...admissionPg, contacts: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={c.name}
                              onChange={e => {
                                const list = [...(admissionPg?.contacts ?? [])]
                                list[idx].name = e.target.value
                                setAdmissionPg({ ...admissionPg, contacts: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-700"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={c.dept}
                              onChange={e => {
                                const list = [...(admissionPg?.contacts ?? [])]
                                list[idx].dept = e.target.value
                                setAdmissionPg({ ...admissionPg, contacts: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={c.phone}
                              onChange={e => {
                                const list = [...(admissionPg?.contacts ?? [])]
                                list[idx].phone = e.target.value
                                setAdmissionPg({ ...admissionPg, contacts: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-mono"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={c.email}
                              onChange={e => {
                                const list = [...(admissionPg?.contacts ?? [])]
                                list[idx].email = e.target.value
                                setAdmissionPg({ ...admissionPg, contacts: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-mono text-slate-500"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionPg?.contacts ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionPg({ ...admissionPg, contacts: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionPg?.contacts ?? []), { role: 'PG Officer', name: 'Dr. John Doe', dept: 'Applied Sciences', phone: '+91-731-2570-5726', email: 'office@sgsits.ac.in' }]
                      setAdmissionPg({ ...admissionPg, contacts: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Coordinator Contact
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => triggerSave('admission_pg', admissionPg, 'Postgraduate admissions successfully updated!')}
                    className="px-6 py-2 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" /> Save PG Changes
                  </button>
                </div>
              </div>
            )}

            {/* â"€â"€â"€ PHD ADMISSIONS CMS SUBTAB â"€â"€â"€ */}
            {admSubTab === 'phd' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">PhD Header Title</label>
                    <input
                      type="text"
                      value={admissionPhd.title || ''}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, title: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Apply Link URL</label>
                    <input
                      type="text"
                      value={admissionPhd.applyUrl || ''}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, applyUrl: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">PhD Description Statement</label>
                    <textarea
                      rows={2}
                      value={admissionPhd.description || ''}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, description: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AttachmentUpload
                      usage="admission"
                      label="Download Brochure File / Link"
                      onAttached={(record) => {
                        setAdmissionPhd({ ...admissionPhd, brochureUrl: record.file_url })
                      }}
                      onClear={() => {
                        setAdmissionPhd({ ...admissionPhd, brochureUrl: '' })
                      }}
                      initialValue={admissionPhd.brochureUrl ? {
                        id: 0,
                        attachment_type: 'EXTERNAL_LINK',
                        original_name: 'Brochure',
                        stored_name: null,
                        file_url: admissionPhd.brochureUrl,
                        external_url: admissionPhd.brochureUrl,
                        thumbnail_url: null,
                        alt_text: null,
                        meta_title: null,
                        meta_description: null,
                        file_type: null,
                        file_size: null,
                        storage_type: 'EXTERNAL',
                        uploaded_by: 0,
                        uploader_name: '',
                        created_at: ''
                      } : null}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AttachmentUpload
                      usage="admission"
                      label="Proposal Guidelines File / Link"
                      onAttached={(record) => {
                        setAdmissionPhd({ ...admissionPhd, guidelinesUrl: record.file_url })
                      }}
                      onClear={() => {
                        setAdmissionPhd({ ...admissionPhd, guidelinesUrl: '' })
                      }}
                      initialValue={admissionPhd.guidelinesUrl ? {
                        id: 0,
                        attachment_type: 'EXTERNAL_LINK',
                        original_name: 'Guidelines',
                        stored_name: null,
                        file_url: admissionPhd.guidelinesUrl,
                        external_url: admissionPhd.guidelinesUrl,
                        thumbnail_url: null,
                        alt_text: null,
                        meta_title: null,
                        meta_description: null,
                        file_type: null,
                        file_size: null,
                        storage_type: 'EXTERNAL',
                        uploaded_by: 0,
                        uploader_name: '',
                        created_at: ''
                      } : null}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded border border-slate-200">
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Research & Development (R&D) Cell Details</h4>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Dean (R&D) Address Text</label>
                    <input
                      type="text"
                      value={admissionPhd.rdAddress || ''}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, rdAddress: e.target.value })}
                      className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none bg-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">R&D Cell Telephone</label>
                    <input
                      type="text"
                      value={admissionPhd.rdPhone || ''}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, rdPhone: e.target.value })}
                      className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none bg-white font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">R&D Inquiry Email</label>
                    <input
                      type="text"
                      value={admissionPhd.rdEmail || ''}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, rdEmail: e.target.value })}
                      className="w-full border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none bg-white font-mono text-slate-500"
                    />
                  </div>
                </div>

                {/* Eligibility criteria */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Academic Qualification Criteria (One per line)</label>
                    <textarea
                      rows={4}
                      value={(admissionPhd?.eligibilityQualifications ?? []).join('\n')}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, eligibilityQualifications: e.target.value.split('\n').filter(Boolean) })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none leading-relaxed font-sans"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Fellowship & Stipend Criteria (One per line)</label>
                    <textarea
                      rows={4}
                      value={(admissionPhd?.eligibilityFellowships ?? []).join('\n')}
                      onChange={e => setAdmissionPhd({ ...admissionPhd, eligibilityFellowships: e.target.value.split('\n').filter(Boolean) })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {/* PhD Vacancies Table */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Departmental PhD Vacancy matrix</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2 w-48">Department Name</th>
                        <th className="px-3 py-2 text-center w-24">Open Seats</th>
                        <th className="px-3 py-2 w-60">Supervisors Available</th>
                        <th className="px-3 py-2">Specialization Fields</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionPhd?.vacancies ?? []).map((v: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={v.dept}
                              onChange={e => {
                                const list = [...(admissionPhd?.vacancies ?? [])]
                                list[idx].dept = e.target.value
                                setAdmissionPhd({ ...admissionPhd, vacancies: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="number"
                              value={v.vacancies}
                              onChange={e => {
                                const list = [...(admissionPhd?.vacancies ?? [])]
                                list[idx].vacancies = parseInt(e.target.value) || 0
                                setAdmissionPhd({ ...admissionPhd, vacancies: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-accent"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={v.supervisors}
                              onChange={e => {
                                const list = [...(admissionPhd?.vacancies ?? [])]
                                list[idx].supervisors = e.target.value
                                setAdmissionPhd({ ...admissionPhd, vacancies: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-655"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={v.area}
                              onChange={e => {
                                const list = [...(admissionPhd?.vacancies ?? [])]
                                list[idx].area = e.target.value
                                setAdmissionPhd({ ...admissionPhd, vacancies: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionPhd?.vacancies ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionPhd({ ...admissionPhd, vacancies: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionPhd?.vacancies ?? []), { dept: 'Applied Chemistry', vacancies: 2, supervisors: 'Dr. R. Pandey', area: 'Polymer Nano-composites' }]
                      setAdmissionPhd({ ...admissionPhd, vacancies: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Vacancy Row
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => triggerSave('admission_phd', admissionPhd, 'PhD admissions successfully updated!')}
                    className="px-6 py-2 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" /> Save PhD Changes
                  </button>
                </div>
              </div>
            )}

            {/* â"€â"€â"€ PROSPECTUS CMS SUBTAB â"€â"€â"€ */}
            {admSubTab === 'prospectus' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Prospectus Header Title</label>
                    <input
                      type="text"
                      value={admissionProspectus.title || ''}
                      onChange={e => setAdmissionProspectus({ ...admissionProspectus, title: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Published Date Tag</label>
                    <input
                      type="text"
                      value={admissionProspectus.publishedDate || ''}
                      onChange={e => setAdmissionProspectus({ ...admissionProspectus, publishedDate: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Prospectus Description Statement</label>
                    <textarea
                      rows={2}
                      value={admissionProspectus.description || ''}
                      onChange={e => setAdmissionProspectus({ ...admissionProspectus, description: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AttachmentUpload
                      usage="admission"
                      label="English Brochure File / Link"
                      onAttached={(record) => {
                        setAdmissionProspectus({ ...admissionProspectus, englishUrl: record.file_url })
                      }}
                      onClear={() => {
                        setAdmissionProspectus({ ...admissionProspectus, englishUrl: '' })
                      }}
                      initialValue={admissionProspectus.englishUrl ? {
                        id: 0,
                        attachment_type: 'EXTERNAL_LINK',
                        original_name: 'English Brochure',
                        stored_name: null,
                        file_url: admissionProspectus.englishUrl,
                        external_url: admissionProspectus.englishUrl,
                        thumbnail_url: null,
                        alt_text: null,
                        meta_title: null,
                        meta_description: null,
                        file_type: null,
                        file_size: null,
                        storage_type: 'EXTERNAL',
                        uploaded_by: 0,
                        uploader_name: '',
                        created_at: ''
                      } : null}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <AttachmentUpload
                      usage="admission"
                      label="Hindi Brochure File / Link"
                      onAttached={(record) => {
                        setAdmissionProspectus({ ...admissionProspectus, hindiUrl: record.file_url })
                      }}
                      onClear={() => {
                        setAdmissionProspectus({ ...admissionProspectus, hindiUrl: '' })
                      }}
                      initialValue={admissionProspectus.hindiUrl ? {
                        id: 0,
                        attachment_type: 'EXTERNAL_LINK',
                        original_name: 'Hindi Brochure',
                        stored_name: null,
                        file_url: admissionProspectus.hindiUrl,
                        external_url: admissionProspectus.hindiUrl,
                        thumbnail_url: null,
                        alt_text: null,
                        meta_title: null,
                        meta_description: null,
                        file_type: null,
                        file_size: null,
                        storage_type: 'EXTERNAL',
                        uploaded_by: 0,
                        uploader_name: '',
                        created_at: ''
                      } : null}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">File Details String (size, format, etc.)</label>
                    <input
                      type="text"
                      value={admissionProspectus.fileDetails || ''}
                      onChange={e => setAdmissionProspectus({ ...admissionProspectus, fileDetails: e.target.value })}
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Historical editions */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Previous Archived Editions</label>
                  <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                      <tr>
                        <th className="px-3 py-2 w-52">Academic Session Year</th>
                        <th className="px-3 py-2">Brochure File Target Path</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {(admissionProspectus?.archive ?? []).map((a: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={a.year}
                              onChange={e => {
                                const list = [...(admissionProspectus?.archive ?? [])]
                                list[idx].year = e.target.value
                                setAdmissionProspectus({ ...admissionProspectus, archive: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={a.fileUrl}
                              onChange={e => {
                                const list = [...(admissionProspectus?.archive ?? [])]
                                list[idx].fileUrl = e.target.value
                                setAdmissionProspectus({ ...admissionProspectus, archive: list })
                              }}
                              className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-mono text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const list = (admissionProspectus?.archive ?? []).filter((_: any, i: number) => i !== idx)
                                setAdmissionProspectus({ ...admissionProspectus, archive: list })
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(admissionProspectus?.archive ?? []), { year: '2020â€"21', fileUrl: '#' }]
                      setAdmissionProspectus({ ...admissionProspectus, archive: list })
                    }}
                    className="px-3 py-1 border border-dashed border-slate-350 hover:border-slate-500 rounded text-xs font-semibold text-slate-655 flex items-center gap-1.5 bg-white"
                  >
                    <Icons.Plus size={12} /> Add Archive Edition Row
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => triggerSave('admission_prospectus', admissionProspectus, 'Prospectus download information successfully updated!')}
                    className="px-6 py-2 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" /> Save Prospectus Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* â"€â"€â"€ PLACEMENTS CMS TAB â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€ */}
        {activeTab === 'placements' && (
          <div><PlacementCms /><PageSectionsBuilder pageKey="placements" /></div>
        )}

        {/* --- CAMPUS LIFE CMS TAB ------------------------------------------------ */}
        {activeTab === 'campus_life' && (
          <div><AdminCampusLife /><PageSectionsBuilder pageKey="campus-life" /></div>
        )}

        {/* --- FACILITIES CMS TAB ------------------------------------------------- */}
        {activeTab === 'facilities' && (
          <div><AdminFacilities /><PageSectionsBuilder pageKey="facilities" /></div>
        )}

        {/* ─── PAGE SECTIONS BUILDERS (about + admissions standalone) ─────────── */}
        {activeTab === 'about'      && <PageSectionsBuilder pageKey="about" />}
        {activeTab === 'admissions' && <PageSectionsBuilder pageKey="admissions" />}
        {activeTab === 'home'       && <PageSectionsBuilder pageKey="home" />}

        {/* ─── BRANDING TAB ─────────────────────────────────────────────────────── */}
        {activeTab === 'settings' && (

          <div className="space-y-6">
            {/* Settings sub-navigation */}
            <div className="flex flex-wrap border-b border-slate-200 gap-2 bg-slate-50 p-1.5 rounded-t-lg mb-6">
              {[
                { id: 'branding', label: 'Branding', icon: Icons.BadgeInfo },
                { id: 'navigation', label: 'Navigation Menu', icon: Icons.Menu },
                { id: 'chatbot', label: 'Chatbot FAQ Responses', icon: Icons.Bot },
                { id: 'seo', label: 'Per-Page SEO Manager', icon: Icons.Search },
                { id: 'ui_labels', label: 'UI Labels', icon: Icons.Globe },
                { id: 'footer', label: 'Footer Manager', icon: Icons.LayoutTemplate },
              ].map(sub => {
                const SubIcon = sub.icon
                const isSubActive = settingsSubTab === sub.id
                return (
                  <button
                    key={sub.id}
                    onClick={() => setSettingsSubTab(sub.id as any)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded border transition-all duration-200 shrink-0 ${
                      isSubActive
                        ? 'bg-primary border-primary text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <SubIcon size={12} className={isSubActive ? 'text-accent' : 'text-slate-400'} />
                    {sub.label}
                  </button>
                )
              })}
            </div>

            {/* Sub-tab panels */}
            {settingsSubTab === 'branding' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Palette size={18} className="text-accent" /> Branding &amp; Institute Identity
              </h2>
              <button
                onClick={() => { brandingService.saveBranding(branding); setToast('Branding saved!') }}
                className="px-5 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
              >
                <Icons.Save size={13} className="text-accent" /> Save Branding
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ['shortCode', 'Short Code (e.g. SGS)'],
                ['shortName', 'Short Name (e.g. SGSITS)'],
                ['fullName', 'Full Institute Name'],
                ['establishedYear', 'Established Year'],
                ['tagline', 'Primary Tagline'],
                ['subTagline', 'Sub-Tagline (header bar)'],
                ['logoUrl', 'Logo URL'],
                ['logoAlt', 'Logo Alt Text'],
                ['logoSuffix', 'Logo Suffix Label'],
                ['mobileDrawerTitle', 'Mobile Drawer Title'],
                ['mobileDrawerFooter', 'Mobile Drawer Footer'],
                ['mobileNavSectionLabel', 'Mobile Nav Section Label'],
              ] as [keyof BrandingConfig, string][]).map(([field, label]) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                  <input
                    type="text"
                    value={branding[field] ?? ''}
                    onChange={e => setBranding(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 select-none">
              <input
                type="checkbox"
                id="preloaderEnabled"
                checked={!!branding.preloaderEnabled}
                onChange={e => setBranding(prev => ({ ...prev, preloaderEnabled: e.target.checked }))}
                className="w-4 h-4 text-primary border-slate-350 rounded focus:ring-primary cursor-pointer"
              />
              <label htmlFor="preloaderEnabled" className="text-xs font-bold text-slate-600 uppercase cursor-pointer">
                Enable Website Preloader Overlay (Shown only once per browser session)
              </label>
            </div>

            {branding.logoUrl && (
              <div className="flex items-center gap-4 mt-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                <img src={branding.logoUrl} alt={branding.logoAlt} className="w-16 h-16 object-contain rounded-full border border-slate-200" onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.3' }} />
                <div>
                  <p className="font-bold text-primary text-sm">{branding.shortName || branding.fullName}</p>
                  <p className="text-xs text-slate-500">{branding.subTagline}</p>
                  <p className="text-xs text-accent font-semibold mt-0.5">Estd. {branding.establishedYear} • {branding.logoSuffix}</p>
                </div>
              </div>
            )}

            {/* ── Top Bar Info ─────────────────────────────────────────────── */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                    <Icons.Phone size={15} className="text-accent" />
                    Top Bar Info
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Helpline number, email, institute code and ERP portal link shown in the dark top bar.</p>
                </div>
                <button
                  onClick={async () => { await settingsService.saveTopBarData(topBarData); setToast('Top Bar saved!') }}
                  className="px-4 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
                >
                  <Icons.Save size={13} className="text-accent" /> Save Top Bar
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  ['helpline',       'Helpline Number(s)',         'tel',  '+91-731-2582100'],
                  ['email',          'Official Email',             'email','registrar@sgsits.ac.in'],
                  ['instituteCode',  'Institute Code',             'text', '1752'],
                  ['erpPortalLabel', 'ERP Portal Button Label',    'text', 'ERP Portal'],
                  ['erpPortalUrl',   'ERP Portal URL',             'url',  'https://www.sgsits.ac.in'],
                ] as [string, string, string, string][]).map(([field, label, type, placeholder]) => (
                  <div key={field} className={field === 'erpPortalUrl' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                    <input
                      type={type}
                      value={(topBarData as any)[field] ?? ''}
                      onChange={e => setTopBarData((prev: any) => ({ ...prev, [field]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
              {/* Live preview */}
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200 text-xs">
                <div className="bg-slate-900 text-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <span><strong className="text-accent">Helpline:</strong> {(topBarData as any).helpline || '—'}</span>
                    <span className="hidden sm:inline"><strong className="text-accent">Email:</strong> {(topBarData as any).email || '—'}</span>
                    <span><strong className="text-accent">Code:</strong> {(topBarData as any).instituteCode || '—'}</span>
                  </div>
                  <span className="text-accent font-bold">{(topBarData as any).erpPortalLabel || 'ERP Portal'} ↗</span>
                </div>
              </div>
            </div>
          </div>
              </div>
            )}

            {settingsSubTab === 'navigation' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">Dynamic Menu Navigation Builder</h3>
                <p className="text-xs text-slate-500 mt-0.5">Add, edit, reorder, or delete main categories and drop-down submenu link lists in real-time.</p>
              </div>
              <button
                onClick={() => {
                  const newList = [...navigationItems, { label: 'New Menu', path: '/new-link', children: undefined }]
                  setNavigationItems(newList)
                }}
                className="px-3 py-1.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded flex items-center gap-1.5 border border-accent/20"
              >
                <Icons.Plus size={14} className="text-accent" /> Add Main Category
              </button>
            </div>

            <div className="space-y-6">
              {navigationItems.map((item: any, idx: number) => {
                const hasChildren = item.children && Array.isArray(item.children)
                return (
                  <div key={idx} className="border border-slate-200 p-5 rounded-lg bg-slate-50/20 flex flex-col gap-4 relative shadow-sm hover:border-slate-350 transition-all duration-200">
                    
                    {/* Header: Label, Reorder, Delete controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-slate-400 bg-slate-100 px-2 py-1 rounded font-mono">CATEGORY #{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              const newList = [...navigationItems]
                              const temp = newList[idx]
                              newList[idx] = newList[idx - 1]
                              newList[idx - 1] = temp
                              setNavigationItems(newList)
                            }}
                            className="p-1 border border-slate-200 rounded hover:bg-white text-slate-600 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Category Up"
                          >
                            <Icons.ChevronUp size={14} />
                          </button>
                          <button
                            disabled={idx === navigationItems.length - 1}
                            onClick={() => {
                              const newList = [...navigationItems]
                              const temp = newList[idx]
                              newList[idx] = newList[idx + 1]
                              newList[idx + 1] = temp
                              setNavigationItems(newList)
                            }}
                            className="p-1 border border-slate-200 rounded hover:bg-white text-slate-600 disabled:opacity-30 disabled:pointer-events-none"
                            title="Move Category Down"
                          >
                            <Icons.ChevronDown size={14} />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          const newList = navigationItems.filter((_: any, i: number) => i !== idx)
                          setNavigationItems(newList)
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete Category"
                      >
                        <Icons.Trash2 size={16} />
                      </button>
                    </div>

                    {/* Main input controls */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Category Label</label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => {
                            const newList = [...navigationItems]
                            newList[idx].label = e.target.value
                            setNavigationItems(newList)
                          }}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-bold text-primary"
                        />
                      </div>
                      
                      <div className="flex flex-col justify-end pb-1.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={hasChildren}
                            onChange={e => {
                              const newList = [...navigationItems]
                              if (e.target.checked) {
                                newList[idx].children = []
                                delete newList[idx].path
                              } else {
                                newList[idx].path = '/'
                                delete newList[idx].children
                              }
                              setNavigationItems(newList)
                            }}
                            className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
                          />
                          <span className="text-xs font-bold text-slate-600 uppercase">Has Submenu Dropdown</span>
                        </label>
                      </div>

                      {!hasChildren && (
                        <div>
                          <label className="text-xs font-bold text-slate-500 uppercase">Direct Target Path</label>
                          <input
                            type="text"
                            value={item.path || ''}
                            onChange={e => {
                              const newList = [...navigationItems]
                              newList[idx].path = e.target.value
                              setNavigationItems(newList)
                            }}
                            className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* Submenu Children CRUD */}
                    {hasChildren && (
                      <div className="border border-slate-200 rounded-md overflow-hidden bg-white mt-2">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Dropdown Sub-Items ({(item.children || []).length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              const newList = [...navigationItems]
                              newList[idx].children = [...(newList[idx].children || []), { label: 'New Dropdown Link', path: '#' }]
                              setNavigationItems(newList)
                            }}
                            className="px-2.5 py-1 border border-slate-250 hover:bg-slate-100 text-slate-700 hover:text-slate-950 text-xs font-bold uppercase rounded flex items-center gap-1 bg-white shadow-3xs"
                          >
                            <Icons.Plus size={12} className="text-accent" /> Add Dropdown Link
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-xs text-slate-500">
                              <tr>
                                <th className="px-3 py-2 w-16 text-center">Order</th>
                                <th className="px-3 py-2">Link Label</th>
                                <th className="px-3 py-2">Redirect Path</th>
                                <th className="px-3 py-2 text-right w-12">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                              {(item.children || []).map((child: any, cIdx: number) => (
                                <tr key={cIdx} className="hover:bg-slate-50/50">
                                  <td className="px-3 py-1.5 text-center">
                                    <div className="flex items-center justify-center gap-0.5">
                                      <button
                                        disabled={cIdx === 0}
                                        onClick={() => {
                                          const newList = [...navigationItems]
                                          const children = [...(newList[idx].children || [])]
                                          const temp = children[cIdx]
                                          children[cIdx] = children[cIdx - 1]
                                          children[cIdx - 1] = temp
                                          newList[idx].children = children
                                          setNavigationItems(newList)
                                        }}
                                        className="p-0.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-20"
                                      >
                                        <Icons.ChevronUp size={11} />
                                      </button>
                                      <button
                                        disabled={cIdx === (item.children || []).length - 1}
                                        onClick={() => {
                                          const newList = [...navigationItems]
                                          const children = [...(newList[idx].children || [])]
                                          const temp = children[cIdx]
                                          children[cIdx] = children[cIdx + 1]
                                          children[cIdx + 1] = temp
                                          newList[idx].children = children
                                          setNavigationItems(newList)
                                        }}
                                        className="p-0.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-20"
                                      >
                                        <Icons.ChevronDown size={11} />
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-3 py-1.5">
                                    <input
                                      type="text"
                                      value={child.label}
                                      onChange={e => {
                                        const newList = [...navigationItems]
                                        newList[idx].children[cIdx].label = e.target.value
                                        setNavigationItems(newList)
                                      }}
                                      className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                                    />
                                  </td>
                                  <td className="px-3 py-1.5">
                                    <input
                                      type="text"
                                      value={child.path}
                                      onChange={e => {
                                        const newList = [...navigationItems]
                                        newList[idx].children[cIdx].path = e.target.value
                                        setNavigationItems(newList)
                                      }}
                                      className="border border-slate-200 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-mono"
                                    />
                                  </td>
                                  <td className="px-3 py-1.5 text-right">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newList = [...navigationItems]
                                        newList[idx].children = (newList[idx].children || []).filter((_: any, i: number) => i !== cIdx)
                                        setNavigationItems(newList)
                                      }}
                                      className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded"
                                    >
                                      <Icons.Trash2 size={13} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              {(!item.children || item.children.length === 0) && (
                                <tr>
                                  <td colSpan={4} className="px-4 py-4 text-center text-slate-400 italic">No submenus configured. Click "Add Dropdown Link" to insert routes.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('navigation', navigationItems, 'Site Navigation Menus updated successfully!')}
                className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
              >
                <Icons.Save size={14} className="text-accent" />
                Save Navigation Tree
              </button>
            </div>
          </div>
              </div>
            )}

            {settingsSubTab === 'chatbot' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Bot size={18} className="text-accent" /> Chatbot Configuration
              </h2>
              <button
                onClick={() => { chatbotService.saveChatbotConfig(chatbot); setToast('Chatbot config saved!') }}
                className="px-5 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
              >
                <Icons.Save size={13} className="text-accent" /> Save Config
              </button>
            </div>
            {/* Core settings */}
            <div className="grid sm:grid-cols-2 gap-4">
              {([
                ['botName', 'Bot Name'],
                ['avatarUrl', 'Avatar URL'],
                ['welcomeMessage', 'Welcome Message'],
                ['inputPlaceholder', 'Input Placeholder'],
                ['fallbackMessage', 'Fallback / No-match Reply'],
              ] as [keyof ChatbotConfig, string][]).filter(([k]) => typeof chatbot[k] === 'string').map(([field, label]) => (
                <div key={field} className={field === 'welcomeMessage' || field === 'fallbackMessage' ? 'sm:col-span-2' : ''}>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                  {field === 'welcomeMessage' || field === 'fallbackMessage' ? (
                    <textarea
                      rows={3}
                      value={chatbot[field] as string}
                      onChange={e => setChatbot(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <input
                      type="text"
                      value={chatbot[field] as string}
                      onChange={e => setChatbot(prev => ({ ...prev, [field]: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Quick Prompts */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Quick Prompts (one per line)</label>
              <textarea
                rows={4}
                value={(chatbot?.quickPrompts ?? []).join('\n')}
                onChange={e => setChatbot(prev => ({ ...prev, quickPrompts: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            {/* Response Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Response Categories ({chatbot.responses.length})</h3>
                <button
                  onClick={() => setChatbot(prev => ({ ...prev, responses: [...prev.responses, { id: Date.now().toString(), category: 'New Category', keywords: [], reply: '' }] }))}
                  className="text-xs px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent font-bold rounded-lg"
                >
                  + Add Response
                </button>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {(chatbot?.responses ?? []).map((resp: ChatbotResponseItem, idx: number) => (
                  <div key={resp.id || idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-primary uppercase">{resp.category}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingResponseIdx(editingResponseIdx === idx ? null : idx)}
                          className="text-xs px-2 py-1 bg-primary/10 rounded text-primary font-semibold"
                        >
                          {editingResponseIdx === idx ? 'Done' : 'Edit'}
                        </button>
                        <button
                          onClick={() => setChatbot(prev => ({ ...prev, responses: prev.responses.filter((_, i) => i !== idx) }))}
                          className="text-xs px-2 py-1 bg-red-50 border border-red-200 rounded text-red-500 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {editingResponseIdx === idx && (
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-bold uppercase text-slate-500">Category Name</label>
                          <input type="text" value={resp.category}
                            onChange={e => { const r = [...chatbot.responses]; r[idx] = { ...r[idx], category: e.target.value }; setChatbot(p => ({ ...p, responses: r })) }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-slate-500">Keywords (comma-separated)</label>
                          <input type="text" value={(resp.keywords ?? []).join(', ')}
                            onChange={e => { const r = [...chatbot.responses]; r[idx] = { ...r[idx], keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) }; setChatbot(p => ({ ...p, responses: r })) }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase text-slate-500">Reply Text</label>
                          <textarea rows={3} value={resp.reply}
                            onChange={e => { const r = [...chatbot.responses]; r[idx] = { ...r[idx], reply: e.target.value }; setChatbot(p => ({ ...p, responses: r })) }}
                            className="w-full border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-primary" />
                        </div>
                      </div>
                    )}
                    {editingResponseIdx !== idx && (
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Keywords:</span> {(resp.keywords ?? []).join(', ') || '—'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
              </div>
            )}

            {settingsSubTab === 'seo' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Search size={18} className="text-accent" /> Per-Page SEO Manager
              </h2>
              <button
                onClick={() => { seoService.savePageSeo(activeSeoKey, (allSeo ?? {})[activeSeoKey]); setToast(`SEO saved for "${activeSeoKey}"!`) }}
                className="px-5 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
              >
                <Icons.Save size={13} className="text-accent" /> Save Page SEO
              </button>
            </div>
            <div className="flex gap-4">
              {/* Page selector */}
              <div className="w-56 shrink-0">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Page</label>
                <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
                  {Object.keys(allSeo ?? {}).map(key => (
                    <button
                      key={key}
                      onClick={() => setActiveSeoKey(key)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium border-b border-slate-100 last:border-0 transition-colors ${activeSeoKey === key ? 'bg-primary text-white font-bold' : 'bg-white hover:bg-slate-50 text-slate-700'}`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              {/* SEO fields */}
              {allSeo[activeSeoKey] && (
                <div className="flex-1 space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <p className="text-xs font-bold uppercase text-slate-500">Editing: <span className="text-primary">{activeSeoKey}</span></p>
                  </div>
                  {([
                    ['pageTitle', 'Page Title (HTML <title>)', false],
                    ['metaDescription', 'Meta Description', true],
                    ['keywords', 'Meta Keywords (comma-separated)', false],
                    ['ogTitle', 'Open Graph Title', false],
                    ['ogDescription', 'OG Description', true],
                    ['ogImage', 'OG Image URL', false],
                    ['canonicalUrl', 'Canonical URL', false],
                  ] as [keyof SeoMeta, string, boolean][]).map(([field, label, multiline]) => (
                    <div key={field}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
                      {multiline ? (
                        <textarea
                          rows={3}
                          value={(allSeo[activeSeoKey][field] ?? '') as string}
                          onChange={e => setAllSeo(prev => ({ ...prev, [activeSeoKey]: { ...prev[activeSeoKey], [field]: e.target.value } }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      ) : (
                        <input
                          type="text"
                          value={(allSeo[activeSeoKey][field] ?? '') as string}
                          onChange={e => setAllSeo(prev => ({ ...prev, [activeSeoKey]: { ...prev[activeSeoKey], [field]: e.target.value } }))}
                          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                      )}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Twitter Card Type</label>
                    <select
                      value={allSeo[activeSeoKey].twitterCard ?? 'summary_large_image'}
                      onChange={e => setAllSeo(prev => ({ ...prev, [activeSeoKey]: { ...prev[activeSeoKey], twitterCard: e.target.value as 'summary' | 'summary_large_image' } }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white"
                    >
                      <option value="summary">summary</option>
                      <option value="summary_large_image">summary_large_image</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
              </div>
            )}

            {settingsSubTab === 'ui_labels' && (
              <div className="space-y-6">
                <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                <Icons.Type size={18} className="text-accent" /> Global UI Labels
              </h2>
              <button
                onClick={() => { uiLabelsService.saveUiLabels(uiLabels); setToast('UI Labels saved!') }}
                className="px-5 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
              >
                <Icons.Save size={13} className="text-accent" /> Save Labels
              </button>
            </div>
            {/* Sections editor */}
            {(Object.entries(uiLabels) as [string, Record<string, unknown>][])
              .filter(([, v]) => typeof v === 'object' && v !== null && !Array.isArray(v))
              .map(([section, fields]) => (
              <div key={section} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5">
                  <h3 className="font-bold text-xs text-primary uppercase tracking-wider">{section.replace(/([A-Z])/g, ' $1').trim()}</h3>
                </div>
                <div className="p-4 grid sm:grid-cols-2 gap-3">
                  {(Object.entries(fields) as [string, unknown][])
                    .filter(([, v]) => typeof v === 'string')
                    .map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <input
                        type="text"
                        value={value as string}
                        onChange={e => setUiLabels(prev => ({
                          ...prev,
                          [section]: { ...(prev as any)[section], [key]: e.target.value }
                        }))}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* Quick Links (array section) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Top Bar Quick Links</h3>
                <button
                  onClick={() => setUiLabels(prev => ({ ...prev, topBarQuickLinks: [...prev.topBarQuickLinks, { label: '', to: '' }] }))}
                  className="text-xs px-3 py-1 bg-accent/10 border border-accent/30 text-accent font-bold rounded"
                >
                  + Add Link
                </button>
              </div>
              <div className="p-4 space-y-3">
                {(uiLabels?.topBarQuickLinks ?? []).map((ql, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Label"
                      value={ql.label}
                      onChange={e => {
                        const links = [...uiLabels.topBarQuickLinks]; links[idx] = { ...links[idx], label: e.target.value };
                        setUiLabels(prev => ({ ...prev, topBarQuickLinks: links }))
                      }}
                      className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Path (e.g. /notices)"
                      value={ql.to}
                      onChange={e => {
                        const links = [...uiLabels.topBarQuickLinks]; links[idx] = { ...links[idx], to: e.target.value };
                        setUiLabels(prev => ({ ...prev, topBarQuickLinks: links }))
                      }}
                      className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-primary"
                    />
                    <button
                      onClick={() => setUiLabels(prev => ({ ...prev, topBarQuickLinks: prev.topBarQuickLinks.filter((_, i) => i !== idx) }))}
                      className="text-xs px-2 py-1.5 bg-red-50 border border-red-200 text-red-500 font-semibold rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
              </div>
            )}

            {settingsSubTab === 'footer' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h2 className="font-display text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Icons.LayoutTemplate size={18} className="text-accent" /> Footer Manager
                  </h2>
                  <button
                    onClick={() => triggerSave('footer', footerData, 'Footer configuration saved successfully!')}
                    className="px-5 py-2 bg-primary text-white font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/30 shadow"
                  >
                    <Icons.Save size={13} className="text-accent" /> Save Footer Settings
                  </button>
                </div>

                {/* 1. Institution Details */}
                <div className="border border-slate-200 rounded-lg overflow-hidden font-sans">
                  <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5">
                    <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Institution Details</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Full Institution Name</label>
                      <input
                        type="text"
                        value={footerData.institution?.name || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          institution: { ...footerData.institution, name: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary font-semibold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Short Code (Badge)</label>
                        <input
                          type="text"
                          value={footerData.institution?.shortCode || ''}
                          onChange={e => setFooterData({
                            ...footerData,
                            institution: { ...footerData.institution, shortCode: e.target.value }
                          })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary text-center font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Est. Year</label>
                        <input
                          type="text"
                          value={footerData.institution?.estYear || ''}
                          onChange={e => setFooterData({
                            ...footerData,
                            institution: { ...footerData.institution, estYear: e.target.value }
                          })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary text-center font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tagline</label>
                      <input
                        type="text"
                        value={footerData.institution?.tagline || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          institution: { ...footerData.institution, tagline: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Brief Description</label>
                      <input
                        type="text"
                        value={footerData.institution?.description || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          institution: { ...footerData.institution, description: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Contact Email</label>
                      <input
                        type="text"
                        value={footerData.institution?.email || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          institution: { ...footerData.institution, email: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Helpline Phone(s)</label>
                      <input
                        type="text"
                        value={footerData.institution?.phone || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          institution: { ...footerData.institution, phone: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Postal Address</label>
                      <input
                        type="text"
                        value={footerData.institution?.address || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          institution: { ...footerData.institution, address: e.target.value }
                        })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Link Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  {footerData.columns.map((col: any, colIdx: number) => (
                    <div key={colIdx} className="border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                      <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                        <input
                          type="text"
                          value={col.heading}
                          onChange={e => {
                            const newCols = [...footerData.columns]
                            newCols[colIdx].heading = e.target.value
                            setFooterData({ ...footerData, columns: newCols })
                          }}
                          className="bg-transparent border-b border-transparent hover:border-slate-350 focus:border-primary focus:outline-none font-bold text-xs text-primary uppercase tracking-wider w-56 px-1 py-0.5"
                        />
                        <button
                          onClick={() => {
                            const newCols = [...footerData.columns]
                            newCols[colIdx].links.push({ label: 'New Link', to: '/' })
                            setFooterData({ ...footerData, columns: newCols })
                          }}
                          className="text-xs font-bold px-2 py-1 bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 rounded"
                        >
                          + Add Link
                        </button>
                      </div>
                      <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[350px]">
                        {col.links.map((link: any, linkIdx: number) => (
                          <div key={linkIdx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="Label"
                              value={link.label}
                              onChange={e => {
                                const newCols = [...footerData.columns]
                                newCols[colIdx].links[linkIdx].label = e.target.value
                                setFooterData({ ...footerData, columns: newCols })
                              }}
                              className="flex-1 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary font-semibold"
                            />
                            <input
                              type="text"
                              placeholder="Route / Path"
                              value={link.to || ''}
                              onChange={e => {
                                const newCols = [...footerData.columns]
                                newCols[colIdx].links[linkIdx].to = e.target.value
                                setFooterData({ ...footerData, columns: newCols })
                              }}
                              className="flex-1 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary font-mono text-xs"
                            />
                            <button
                              onClick={() => {
                                const newCols = [...footerData.columns]
                                newCols[colIdx].links = newCols[colIdx].links.filter((_: any, i: number) => i !== linkIdx)
                                setFooterData({ ...footerData, columns: newCols })
                              }}
                              className="p-1 px-2 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded text-xs"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                        {(!col.links || col.links.length === 0) && (
                          <p className="text-xs text-slate-400 text-center py-6">No links defined in this column.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. Portals & Resources */}
                <div className="border border-slate-200 rounded-lg overflow-hidden font-sans">
                  <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Section Heading</span>
                      <input
                        type="text"
                        value={footerData.portals?.heading || ''}
                        onChange={e => setFooterData({
                          ...footerData,
                          portals: { ...(footerData.portals || {}), heading: e.target.value }
                        })}
                        className="bg-white border border-slate-200 focus:border-primary focus:outline-none font-bold text-xs text-primary uppercase tracking-wider px-2.5 py-1 rounded"
                      />
                    </div>
                    <button
                      onClick={() => {
                        const links = [...(footerData.portals?.links || [])]
                        links.push({ label: 'New Portal', href: 'https://', external: true })
                        setFooterData({
                          ...footerData,
                          portals: { ...(footerData.portals || {}), links }
                        })
                      }}
                      className="text-xs font-bold px-2 py-1 bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 rounded"
                    >
                      + Add Portal Link
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {(footerData.portals?.links || []).map((portal: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Portal Name"
                          value={portal.label}
                          onChange={e => {
                            const links = [...footerData.portals.links]
                            links[idx].label = e.target.value
                            setFooterData({ ...footerData, portals: { ...footerData.portals, links } })
                          }}
                          className="w-1/3 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="URL (e.g. https://...)"
                          value={portal.href || ''}
                          onChange={e => {
                            const links = [...footerData.portals.links]
                            links[idx].href = e.target.value
                            setFooterData({ ...footerData, portals: { ...footerData.portals, links } })
                          }}
                          className="flex-1 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary font-mono text-xs"
                        />
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-655 uppercase cursor-pointer pl-2">
                          <input
                            type="checkbox"
                            className="rounded border-slate-350 text-primary"
                            checked={!!portal.external}
                            onChange={e => {
                              const links = [...footerData.portals.links]
                              links[idx].external = e.target.checked
                              setFooterData({ ...footerData, portals: { ...footerData.portals, links } })
                            }}
                          />
                          External
                        </label>
                        <button
                          onClick={() => {
                            const links = footerData.portals.links.filter((_: any, i: number) => i !== idx)
                            setFooterData({ ...footerData, portals: { ...footerData.portals, links } })
                          }}
                          className="p-1 px-2 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(footerData.portals?.links || []).length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No portals defined.</p>
                    )}
                  </div>
                </div>

                {/* 4. Bottom Links */}
                <div className="border border-slate-200 rounded-lg overflow-hidden font-sans">
                  <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                    <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Bottom Footer Strip Links</h3>
                    <button
                      onClick={() => {
                        const links = [...(footerData.bottomLinks || [])]
                        links.push({ label: 'New Policy', to: '/policy' })
                        setFooterData({ ...footerData, bottomLinks: links })
                      }}
                      className="text-xs font-bold px-2 py-1 bg-accent/15 text-accent hover:bg-accent/25 border border-accent/30 rounded"
                    >
                      + Add Bottom Link
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {(footerData.bottomLinks || []).map((bLink: any, idx: number) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Link Label"
                          value={bLink.label}
                          onChange={e => {
                            const links = [...footerData.bottomLinks]
                            links[idx].label = e.target.value
                            setFooterData({ ...footerData, bottomLinks: links })
                          }}
                          className="flex-1 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary font-semibold"
                        />
                        <input
                          type="text"
                          placeholder="Route (e.g. /policy/privacy)"
                          value={bLink.to || ''}
                          onChange={e => {
                            const links = [...footerData.bottomLinks]
                            links[idx].to = e.target.value
                            setFooterData({ ...footerData, bottomLinks: links })
                          }}
                          className="flex-1 border border-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary font-mono text-xs"
                        />
                        <button
                          onClick={() => {
                            const links = footerData.bottomLinks.filter((_: any, i: number) => i !== idx)
                            setFooterData({ ...footerData, bottomLinks: links })
                          }}
                          className="p-1 px-2 border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 rounded text-xs ml-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {(footerData.bottomLinks || []).length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No bottom links defined.</p>
                    )}
                  </div>
                </div>

                {/* 5. Statistics, Copyright & Settings */}
                <div className="border border-slate-200 rounded-lg overflow-hidden font-sans">
                  <div className="bg-primary/5 border-b border-slate-200 px-4 py-2.5">
                    <h3 className="font-bold text-xs text-primary uppercase tracking-wider">Visitor Statistics & Copyright</h3>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Visitor Stats Label</label>
                        <input
                          type="text"
                          value={footerData.visitorStats?.label || ''}
                          onChange={e => setFooterData({
                            ...footerData,
                            visitorStats: { ...footerData.visitorStats, label: e.target.value }
                          })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Visitor Count (Static/Mock)</label>
                        <input
                          type="text"
                          value={footerData.visitorStats?.count || ''}
                          onChange={e => setFooterData({
                            ...footerData,
                            visitorStats: { ...footerData.visitorStats, count: e.target.value }
                          })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary text-center font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Visitor Stats Note</label>
                        <input
                          type="text"
                          value={footerData.visitorStats?.note || ''}
                          onChange={e => setFooterData({
                            ...footerData,
                            visitorStats: { ...footerData.visitorStats, note: e.target.value }
                          })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Copyright Note (Bottom Strip)</label>
                      <textarea
                        rows={2}
                        value={footerData.copyright || ''}
                        onChange={e => setFooterData({ ...footerData, copyright: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-primary leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                {/* Save actions at the bottom */}
                <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                  <button
                    onClick={() => triggerSave('footer', footerData, 'Footer configuration saved successfully!')}
                    className="px-6 py-2.5 bg-primary text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-accent/20 shadow-md"
                  >
                    <Icons.Save size={14} className="text-accent" />
                    Save Footer Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── CHATBOT TAB ──────────────────────────────────────────────────────── */}
        {}

        {/* ─── SEO MANAGER TAB ──────────────────────────────────────────────────── */}
        {}

        {/* ─── UI LABELS TAB ────────────────────────────────────────────────────── */}
        {}

      </div>

      {/* Toast Notice */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>

    {/* ── Live Preview side panel ── */}
    {showPreview && (
      <div className="w-[480px] shrink-0 sticky top-0 h-screen border-l border-slate-200 overflow-hidden flex flex-col bg-slate-50">
        {activeTab === 'home' ? (
          <HomePreviewPane
            data={homepage}
            onClose={() => setShowPreview(false)}
          />
        ) : (
          <CmsLivePreviewPane
            tab={activeTab}
            subTab={activeSubTab}
            data={previewData}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    )}
    </div>
  )
}

