import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, Monitor, Tablet, Smartphone, ExternalLink, Maximize2, AlertTriangle } from 'lucide-react'
import { usePreviewStore, type PreviewDevice } from '../../store/previewStore'

// ── Real public page components ───────────────────────────────────────────────
import AboutInstitute       from '../../pages/about/AboutInstitute'
import Administration       from '../../pages/about/Administration'
import VisionMission        from '../../pages/about/VisionMission'
import DirectorMessage      from '../../pages/about/DirectorMessage'
import GoverningBody        from '../../pages/about/GoverningBody'
import AcademicCouncil      from '../../pages/about/AcademicCouncil'
import Committees           from '../../pages/about/Committees'
import TelephoneDirectory   from '../../pages/about/TelephoneDirectory'
import IQAC                 from '../../pages/about/IQAC'
import Accreditation        from '../../pages/about/Accreditation'
import Infrastructure       from '../../pages/about/Infrastructure'

import UGAdmission  from '../../pages/admission/UGAdmission'
import PGAdmission  from '../../pages/admission/PGAdmission'
import PhDAdmission from '../../pages/admission/PhDAdmission'

import UGCourses  from '../../pages/academics/UGCourses'
import PGCourses  from '../../pages/academics/PGCourses'
import PhDCourses from '../../pages/academics/PhDCourses'

import Activities           from '../../pages/students/Activities'
import NCC                  from '../../pages/students/NCC'
import NSS                  from '../../pages/students/NSS'
import ScholarshipGovt      from '../../pages/students/ScholarshipGovt'
import ScholarshipInstitute from '../../pages/students/ScholarshipInstitute'
import SSS                  from '../../pages/students/SSS'

import DepartmentLanding   from '../../pages/departments/DepartmentLanding'
import PlacementRecordPage from '../../pages/placement/PlacementRecord'

import Library        from '../../pages/facilities/Library'
import BoysHostel     from '../../pages/facilities/BoysHostel'
import GirlsHostel    from '../../pages/facilities/GirlsHostel'
import ComputerCenter from '../../pages/facilities/ComputerCenter'
import GamesSports    from '../../pages/facilities/GamesSports'
import Dispensary     from '../../pages/facilities/Dispensary'
import IDEALab        from '../../pages/facilities/IDEALab'
import Gymnasium      from '../../pages/facilities/Gymnasium'
import Workshop       from '../../pages/facilities/Workshop'
import CIDI           from '../../pages/facilities/CIDI'
import TransitHostel  from '../../pages/facilities/TransitHostel'
import StaffQuarters  from '../../pages/facilities/StaffQuarters'

// ── Device configuration ──────────────────────────────────────────────────────
const DEVICE_CONFIG: Record<PreviewDevice, { width: number; label: string }> = {
  desktop: { width: 1440, label: '1440px' },
  tablet:  { width: 768,  label: '768px'  },
  mobile:  { width: 375,  label: '375px'  },
}

// ── Tab metadata ──────────────────────────────────────────────────────────────
const TAB_PUBLIC_URL: Record<string, string> = {
  about:        '/about',
  departments:  '/departments',
  admissions:   '/admissions',
  placements:   '/placements',
  campus_life:  '/explore',
  facilities:   '/facilities',
  settings:     '/',
  custom_pages: '/pages',
  academics:    '/academics',
}

const TAB_LABEL: Record<string, string> = {
  about:        'About',
  departments:  'Departments',
  admissions:   'Admissions',
  placements:   'Placements',
  campus_life:  'Campus Life',
  facilities:   'Facilities',
  settings:     'Global Settings',
  custom_pages: 'Pages Builder',
  academics:    'Academics',
}

const SECTION_TABS: Record<string, { id: string; label: string }[]> = {
  about: [
    { id: 'overview',            label: 'Overview' },
    { id: 'vision_mission',      label: 'Vision & Mission' },
    { id: 'leadership',          label: 'Leadership' },
    { id: 'governance',          label: 'Governing Body' },
    { id: 'academic_council',    label: 'Academic Council' },
    { id: 'committees',          label: 'Committees' },
    { id: 'administration',      label: 'Administration' },
    { id: 'directory',           label: 'Directory' },
    { id: 'iqac',                label: 'IQAC' },
    { id: 'accreditation_infra', label: 'Accreditation & Infra' },
  ],
  academics: [
    { id: 'ug',  label: 'UG Courses' },
    { id: 'pg',  label: 'PG Courses' },
    { id: 'phd', label: 'PhD Programmes' },
  ],
  admissions: [
    { id: 'ug',  label: 'UG Admission' },
    { id: 'pg',  label: 'PG Admission' },
    { id: 'phd', label: 'PhD Admission' },
  ],
  campus_life: [
    { id: 'activities', label: 'Activities' },
    { id: 'ncc',        label: 'NCC' },
    { id: 'nss',        label: 'NSS' },
    { id: 'sch_govt',   label: 'Govt. Scholarship' },
    { id: 'sch_inst',   label: 'Inst. Scholarship' },
    { id: 'sss',        label: 'Support Services' },
  ],
  facilities: [
    { id: 'library',         label: 'Library' },
    { id: 'boys_hostel',     label: 'Boys Hostel' },
    { id: 'girls_hostel',    label: 'Girls Hostel' },
    { id: 'computer_center', label: 'Computer Center' },
    { id: 'sports',          label: 'Sports' },
    { id: 'dispensary',      label: 'Dispensary' },
    { id: 'idea_lab',        label: 'IDEA Lab' },
    { id: 'gymnasium',       label: 'Gymnasium' },
    { id: 'workshop',        label: 'Workshop' },
    { id: 'cidi',            label: 'CIDI' },
    { id: 'transit_hostel',  label: 'Transit Hostel' },
    { id: 'staff_quarters',  label: 'Staff Quarters' },
  ],
  settings:     [],
  departments:  [{ id: 'list',    label: 'Departments List' }],
  placements:   [{ id: 'records', label: 'Placement Records' }],
  custom_pages: [],
}

// ── Scaled device frame — same as HomePreviewPane ─────────────────────────────
interface FrameProps {
  device: PreviewDevice
  containerW: number
  containerH: number
  children: React.ReactNode
}
const DeviceFrame: React.FC<FrameProps> = ({ device, containerW, containerH, children }) => {
  const { width: deviceW } = DEVICE_CONFIG[device]
  const scale = Math.min(1, containerW / deviceW)
  const innerH = containerH / scale

  return (
    <div style={{ width: containerW, height: containerH, overflow: 'hidden', position: 'relative' }}>
      <div style={{ width: deviceW, transformOrigin: 'top left', transform: `scale(${scale})` }}>
        <div style={{ overflowY: 'auto', overflowX: 'hidden', height: innerH }}>
          <div style={{ backgroundColor: '#fff', minHeight: innerH }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Error boundary for invalid section data ───────────────────────────────────
class SectionErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) {
      return (
        <div className="p-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded m-4">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700">Section render error</p>
            <p className="text-xs text-amber-600 mt-1 font-mono">{this.state.error}</p>
            <p className="text-xs text-amber-500 mt-2">Save valid data in the editor to fix this preview.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Fallback for CRUD-only modules ────────────────────────────────────────────
const CrudModulePreview: React.FC<{ label: string; publicUrl: string }> = ({ label, publicUrl }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8 bg-white">
    <AlertTriangle size={28} className="text-amber-400" />
    <div>
      <p className="font-bold text-sm text-slate-700 mb-1">{label}</p>
      <p className="text-xs text-slate-400 max-w-xs">This module manages records individually. Changes appear live on the public page.</p>
    </div>
    <a href={publicUrl} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-primary">
      <ExternalLink size={12} /> Open Public Page
    </a>
  </div>
)

// ── Content renderer ──────────────────────────────────────────────────────────
function renderContent(tab: string, subTab: string, data: Record<string, any>): React.ReactNode {
  if (tab === 'about') {
    switch (subTab) {
      case 'overview':            return <AboutInstitute     previewData={data.aboutInst} />
      case 'vision_mission':      return <VisionMission      previewData={data.visionMission} />
      case 'leadership':          return <DirectorMessage    previewData={data.directorMessage} />
      case 'governance':          return <GoverningBody      previewData={data.governingBody} />
      case 'academic_council':    return <AcademicCouncil    previewData={data.academicCouncil} />
      case 'committees':          return <Committees         previewData={data.committeesList} />
      case 'administration':      return <Administration     previewData={data.administration} />
      case 'directory':           return <TelephoneDirectory previewData={data.telephoneDirectory} />
      case 'iqac':                return <IQAC               previewData={data.iqac} />
      case 'accreditation_infra': return (
        <div className="space-y-10">
          <Accreditation previewData={data.accreditation} />
          <Infrastructure previewData={data.infrastructure} />
        </div>
      )
      default:                    return <AboutInstitute     previewData={data.aboutInst} />
    }
  }
  if (tab === 'academics') {
    switch (subTab) {
      case 'ug':  return <UGCourses  previewData={data.academicsUg} />
      case 'pg':  return <PGCourses  previewData={data.academicsPg} />
      case 'phd': return <PhDCourses previewData={data.academicsPhd} />
      default:    return <UGCourses  previewData={data.academicsUg} />
    }
  }
  if (tab === 'admissions') {
    switch (subTab) {
      case 'ug':  return <UGAdmission  previewData={data.admissionUg} />
      case 'pg':  return <PGAdmission  previewData={data.admissionPg} />
      case 'phd': return <PhDAdmission previewData={data.admissionPhd} />
      default:    return <UGAdmission  previewData={data.admissionUg} />
    }
  }
  if (tab === 'campus_life') {
    switch (subTab) {
      case 'activities': return <Activities           previewData={data.clActivities} />
      case 'ncc':        return <NCC                  previewData={data.clNCC} />
      case 'nss':        return <NSS                  previewData={data.clNSS} />
      case 'sch_govt':   return <ScholarshipGovt      previewData={data.clSchGovt} />
      case 'sch_inst':   return <ScholarshipInstitute previewData={data.clSchInst} />
      case 'sss':        return <SSS                  previewData={data.clSSS} />
      default:           return <Activities           previewData={data.clActivities} />
    }
  }
  if (tab === 'facilities') {
    switch (subTab) {
      case 'library':         return <Library        previewData={data.facLibrary} />
      case 'boys_hostel':     return <BoysHostel     previewData={data.facBoysHostel} />
      case 'girls_hostel':    return <GirlsHostel    previewData={data.facGirlsHostel} />
      case 'computer_center': return <ComputerCenter previewData={data.facComputerCenter} />
      case 'sports':          return <GamesSports    previewData={data.facGamesSports} />
      case 'dispensary':      return <Dispensary     previewData={data.facDispensary} />
      case 'idea_lab':        return <IDEALab        previewData={data.facIDEALab} />
      case 'gymnasium':       return <Gymnasium      previewData={data.facGymnasium} />
      case 'workshop':        return <Workshop       previewData={data.facWorkshop} />
      case 'cidi':            return <CIDI           previewData={data.facCIDI} />
      case 'transit_hostel':  return <TransitHostel  previewData={data.facTransitHostel} />
      case 'staff_quarters':  return <StaffQuarters  previewData={data.facStaffQuarters} />
      default:                return <Library        previewData={data.facLibrary} />
    }
  }
  if (tab === 'settings') {
    return (
      <div className="p-6 space-y-3 bg-white min-h-full">
        <h2 className="text-xl font-bold text-primary">Global Settings</h2>
        <p className="text-sm text-slate-500">Branding, navigation, chatbot, SEO, and footer settings affect the entire site.</p>
        {data.branding?.fullName && (
          <div className="border border-slate-200 rounded p-4 space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Branding</p>
            <p className="font-bold text-base text-primary">{data.branding.fullName}</p>
            {data.branding.tagline && <p className="text-sm text-slate-600 italic">{data.branding.tagline}</p>}
            {data.branding.logoUrl && <img src={data.branding.logoUrl} alt="Logo" className="h-12 object-contain mt-2" />}
          </div>
        )}
        {data.footerData && (
          <div className="rounded overflow-hidden border border-slate-200">
            <div className="p-4 text-white bg-primary">
              <p className="font-bold">{data.footerData.instituteName || data.branding?.fullName}</p>
              {data.footerData.address && <p className="text-sm opacity-80 mt-1">{data.footerData.address}</p>}
            </div>
            <div className="p-3 space-y-1 text-sm text-slate-600">
              {data.footerData.email && <p>✉ {data.footerData.email}</p>}
              {data.footerData.phone && <p>☎ {data.footerData.phone}</p>}
              {data.footerData.copyright && <p className="text-xs text-slate-400 pt-2 border-t border-slate-100">{data.footerData.copyright}</p>}
            </div>
          </div>
        )}
      </div>
    )
  }
  if (tab === 'custom_pages') {
    const page = data.activeEditPage
    if (page) {
      return (
        <div className="p-6 bg-white min-h-full space-y-4">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">Custom Page</span>
            <h2 className="text-2xl font-bold mt-1 text-primary">{page.title}</h2>
            {page.subtitle && <p className="text-sm text-slate-500 mt-1">{page.subtitle}</p>}
            <p className="text-xs font-mono text-slate-400 mt-2">/pages/{page.slug}</p>
          </div>
          {page.paragraphs && page.paragraphs.split('\n').filter(Boolean).map((p: string, i: number) => (
            <p key={i} className="text-sm text-slate-700 leading-relaxed">{p}</p>
          ))}
        </div>
      )
    }
    const pages = data.customPages ?? []
    return (
      <div className="p-6 bg-white min-h-full space-y-3">
        <h2 className="text-xl font-bold border-b border-slate-200 pb-3 text-primary">Pages Builder</h2>
        {pages.length === 0 ? (
          <p className="text-sm text-slate-400">No custom pages yet. Create one to preview it here.</p>
        ) : pages.map((p: any) => (
          <div key={p.slug} className="border border-slate-200 rounded p-3">
            <p className="font-bold text-sm text-primary">{p.title}</p>
            <p className="text-xs font-mono text-slate-400">/pages/{p.slug}</p>
          </div>
        ))}
      </div>
    )
  }
  if (tab === 'departments') return <DepartmentLanding />
  if (tab === 'placements')  return <PlacementRecordPage />
  return <CrudModulePreview label={TAB_LABEL[tab] ?? tab} publicUrl={TAB_PUBLIC_URL[tab] ?? '/'} />
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export interface CmsLivePreviewPaneProps {
  tab: string
  subTab?: string
  data: Record<string, any>
  onClose: () => void
}

const CmsLivePreviewPane: React.FC<CmsLivePreviewPaneProps> = ({ tab, subTab, data, onClose }) => {
  const { device, setDevice } = usePreviewStore()
  const [fullscreen, setFullscreen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(() => new Date())

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ w: 460, h: 600 })

  const sectionTabs = SECTION_TABS[tab] ?? []
  const [localSubTab, setLocalSubTab] = useState(subTab ?? sectionTabs[0]?.id ?? '')

  useEffect(() => { if (subTab && subTab !== localSubTab) setLocalSubTab(subTab) }, [subTab])
  useEffect(() => { setLastUpdated(new Date()) }, [data, localSubTab])

  // Measure container
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setContainerSize({ w: Math.floor(width), h: Math.floor(height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [fullscreen])

  const publicUrl  = TAB_PUBLIC_URL[tab] ?? '/'
  const tabLabel   = TAB_LABEL[tab] ?? tab
  const openPublic = useCallback(() => window.open(publicUrl, '_blank', 'noopener,noreferrer'), [publicUrl])

  const { width: deviceW } = DEVICE_CONFIG[device]
  const scale = Math.min(1, containerSize.w / deviceW)
  const displayW = Math.round(deviceW * scale)

  const deviceButtons = [
    { id: 'desktop' as PreviewDevice, Icon: Monitor,    label: `Desktop (${DEVICE_CONFIG.desktop.label})` },
    { id: 'tablet'  as PreviewDevice, Icon: Tablet,     label: `Tablet (${DEVICE_CONFIG.tablet.label})`   },
    { id: 'mobile'  as PreviewDevice, Icon: Smartphone, label: `Mobile (${DEVICE_CONFIG.mobile.label})`   },
  ]

  return (
    <div className={`flex flex-col ${fullscreen ? 'fixed inset-0 z-[200] bg-white' : 'h-full'}`}>

      {/* ── Toolbar ── */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-200 bg-slate-50" style={{ minHeight: 44 }}>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-widest whitespace-nowrap">Live Preview</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent truncate">{tabLabel}</span>
        </div>

        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shrink-0">
          {deviceButtons.map(({ id, Icon, label }) => (
            <button key={id} onClick={() => setDevice(id)} title={label}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${device === id ? 'bg-primary text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
              <Icon size={11} />
              <span className="hidden sm:inline">{id}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={() => setFullscreen(f => !f)} title="Fullscreen"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
            <Maximize2 size={13} />
          </button>
          <button onClick={openPublic} title={`Open ${tabLabel} public page`}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded">
            <ExternalLink size={13} />
          </button>
          <button onClick={onClose} title="Close preview"
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* ── Section tabs ── */}
      {sectionTabs.length > 0 && (
        <div className="shrink-0 flex gap-1 px-2 py-1 overflow-x-auto border-b border-slate-100 bg-slate-50" style={{ scrollbarWidth: 'none' }}>
          {sectionTabs.map(({ id, label }) => (
            <button key={id} onClick={() => setLocalSubTab(id)}
              className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border transition-colors whitespace-nowrap ${
                localSubTab === id ? 'bg-primary text-white border-primary' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
              }`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Preview content — fills remaining height, single scrollbar ── */}
      <div ref={containerRef} className="flex-1 min-h-0 bg-slate-200" style={{ overflow: 'hidden' }}>
        <DeviceFrame device={device} containerW={containerSize.w} containerH={containerSize.h}>
          <SectionErrorBoundary>
            {renderContent(tab, localSubTab, data)}
          </SectionErrorBoundary>
        </DeviceFrame>
      </div>

      {/* ── Status bar ── */}
      <div className="shrink-0 flex items-center justify-between px-3 py-1 bg-slate-800 text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-2">
          <span className="text-green-400">● LIVE</span>
          <span>{publicUrl}</span>
          <span className="text-slate-500">· {displayW}px rendered</span>
        </span>
        <span>Updated {lastUpdated.toLocaleTimeString()}</span>
      </div>
    </div>
  )
}

export default CmsLivePreviewPane
