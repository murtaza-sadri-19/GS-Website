import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import {
  BookOpen, Award, Users, Calendar, FileText,
  Building, Image as ImageIcon, Mail, Info, Sparkles,
} from 'lucide-react'
import { departmentService } from '../../services/departmentService'
import type { DepartmentSummary, FacultyMember } from '../../services/departmentService'
import PdfViewerModal      from '../../components/global/PdfViewerModal'
import DepartmentHero      from '../../components/departments/DepartmentHero'
import AboutTab            from '../../components/departments/tabs/AboutTab'
import ObeTab              from '../../components/departments/tabs/ObeTab'
import CurriculumTab       from '../../components/departments/tabs/CurriculumTab'
import FacultyTab          from '../../components/departments/tabs/FacultyTab'
import ResearchTab         from '../../components/departments/tabs/ResearchTab'
import TimetableTab        from '../../components/departments/tabs/TimetableTab'
import AchievementsTab     from '../../components/departments/tabs/AchievementsTab'
import InfrastructureTab   from '../../components/departments/tabs/InfrastructureTab'
import GalleryTab          from '../../components/departments/tabs/GalleryTab'
import ContactTab          from '../../components/departments/tabs/ContactTab'

const PAGE_SIZE = 10

const TABS = [
  { id: 'about',          label: 'About',                     icon: Info },
  { id: 'obe',            label: 'OBE & PEOs',               icon: Sparkles },
  { id: 'curriculum',     label: 'Curriculum & Schemes',      icon: FileText },
  { id: 'faculty',        label: 'Faculty & Staff',           icon: Users },
  { id: 'research',       label: 'Research & Labs',           icon: BookOpen },
  { id: 'timetable',      label: 'Timetables',                icon: Calendar },
  { id: 'achievements',   label: 'Achievements & Placements', icon: Award },
  { id: 'infrastructure', label: 'Labs & Infrastructure',     icon: Building },
  { id: 'gallery',        label: 'Gallery',                   icon: ImageIcon },
  { id: 'contact',        label: 'Contact Us',                icon: Mail },
]

const DepartmentDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()

  const [activeTab, setActiveTab] = useState('about')
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: '', title: '' })
  const [dept, setDept]           = useState<DepartmentSummary | null | undefined>(undefined)

  // Faculty state
  const [faculty, setFaculty]         = useState<FacultyMember[]>([])
  const [facultyTotal, setFacultyTotal] = useState(0)
  const [facultyPage, setFacultyPage]   = useState(1)
  const [facultyLoading, setFacultyLoading] = useState(false)

  // Reset on slug change
  useEffect(() => {
    setFacultyPage(1)
    setFaculty([])
    setFacultyTotal(0)
  }, [slug])

  // Load department
  useEffect(() => {
    if (!slug) { setDept(null); return }
    departmentService.getDepartmentBySlug(slug).then(setDept)
  }, [slug])

  // Load faculty when Faculty tab is opened or page changes
  useEffect(() => {
    if (activeTab !== 'faculty' || !slug) return
    setFacultyLoading(true)
    departmentService.getDeptFaculty(slug, facultyPage, PAGE_SIZE).then(({ faculty: list, total }) => {
      setFaculty(list)
      setFacultyTotal(total)
      setFacultyLoading(false)
    })
  }, [activeTab, slug, facultyPage])

  if (dept === undefined) return null
  if (!dept) return <Navigate to="/departments" replace />

  const openPdf = (url: string, title: string) => setPdfViewer({ isOpen: true, url, title })

  return (
    <div className="space-y-8 bg-white pb-12">
      <DepartmentHero dept={dept} />

      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab navigation sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded border border-slate-200 sticky top-24 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-550 block mb-3 px-2">Section Menu</span>
            <nav className="space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold text-left transition-colors duration-150 ${
                    activeTab === id
                      ? 'bg-slate-50 text-primary border-l-2 border-accent'
                      : 'text-slate-655 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3 bg-white rounded border border-slate-200 p-6 md:p-8 shadow-sm">
          {activeTab === 'about'          && <AboutTab dept={dept} />}
          {activeTab === 'obe'            && <ObeTab dept={dept} />}
          {activeTab === 'curriculum'     && <CurriculumTab onOpenPdf={openPdf} />}
          {activeTab === 'faculty'        && (
            <FacultyTab
              faculty={faculty}
              total={facultyTotal}
              page={facultyPage}
              pageSize={PAGE_SIZE}
              loading={facultyLoading}
              onPage={setFacultyPage}
              hodName={dept.hodName}
            />
          )}
          {activeTab === 'research'       && <ResearchTab />}
          {activeTab === 'timetable'      && <TimetableTab onOpenPdf={openPdf} />}
          {activeTab === 'achievements'   && <AchievementsTab />}
          {activeTab === 'infrastructure' && <InfrastructureTab />}
          {activeTab === 'gallery'        && <GalleryTab />}
          {activeTab === 'contact'        && <ContactTab dept={dept} />}
        </div>
      </section>

      <PdfViewerModal
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer(p => ({ ...p, isOpen: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
    </div>
  )
}

export default DepartmentDetail
