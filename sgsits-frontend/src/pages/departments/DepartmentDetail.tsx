import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import {
  BookOpen, Award, Users, Calendar, FileText,
  Building, Image as ImageIcon, Mail, Info, Sparkles,
} from 'lucide-react'
import { departmentService } from '../../services/departmentService'
import type { DepartmentSummary } from '../../services/departmentService'
import PdfViewerModal from '../../components/global/PdfViewerModal'
import DepartmentHero from '../../components/departments/DepartmentHero'
import AboutTab        from '../../components/departments/tabs/AboutTab'
import ObeTab          from '../../components/departments/tabs/ObeTab'
import CurriculumTab   from '../../components/departments/tabs/CurriculumTab'
import FacultyTab      from '../../components/departments/tabs/FacultyTab'
import ResearchTab     from '../../components/departments/tabs/ResearchTab'
import TimetableTab    from '../../components/departments/tabs/TimetableTab'
import AchievementsTab from '../../components/departments/tabs/AchievementsTab'
import InfrastructureTab from '../../components/departments/tabs/InfrastructureTab'
import GalleryTab      from '../../components/departments/tabs/GalleryTab'
import ContactTab      from '../../components/departments/tabs/ContactTab'

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

const buildMockFaculty = (dept: DepartmentSummary) => {
  const names = [
    'Dr. Smita Verma', 'Dr. Nitish Gupta', 'Dr. Joseph Thomas Andrews', 'Dr. Urjita Thakar',
    'Dr. R.K. Khare', 'Dr. Satish Jain', 'Dr. H.K. Verma', 'Dr. R.C. Gurjar',
    'Dr. Vineet Singh', 'Dr. Sunita Varma', 'Ms. Vibha Bhatnagar', 'Dr. Girish Thakar',
  ]
  const credentials  = ['Ph.D (IIT Bombay)', 'Ph.D (IIT Roorkee)', 'Ph.D (IISc Bangalore)', 'Ph.D (SGSITS Indore)']
  const designations = ['Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor']

  return Array.from({ length: Math.max(dept.facultyCount, 28) }).map((_, idx) => {
    const isHod = idx === 0
    const name  = isHod ? dept.hodName : names[(idx + 4) % names.length]
    const isFemale = /Smita|Urjita|Sunita|Vibha/.test(name)
    const femaleImgs = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    ]
    const maleImgs = [
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop',
    ]
    return {
      id:           `${dept.shortName.toLowerCase().replace(' ', '-')}-fac-${idx + 1}`,
      name,
      designation:  isHod ? designations[0] : designations[(idx % 3) + 1],
      credential:   isHod ? credentials[0]  : credentials[(idx + 2) % credentials.length],
      email:        isHod ? dept.hodEmail   : `${names[(idx + 4) % names.length].toLowerCase().replace(/dr\.\s|ms\.\s/, '').replace(/\s/g, '.')}@sgsits.ac.in`,
      researchArea: ['Machine Learning, IoT', 'Structural Engineering', 'Power Systems', 'Synthetic Chemistry'][idx % 4],
      imageUrl:     (isFemale ? femaleImgs : maleImgs)[idx % 4],
    }
  })
}

const DepartmentDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab]   = useState('about')
  const [facultyPage, setFacultyPage] = useState(1)
  const [pdfViewer, setPdfViewer]   = useState({ isOpen: false, url: '', title: '' })
  const [dept, setDept]             = useState<DepartmentSummary | null | undefined>(undefined)

  useEffect(() => { setFacultyPage(1) }, [slug])

  useEffect(() => {
    if (!slug) { setDept(null); return }
    departmentService.getDepartmentBySlug(slug).then(setDept)
  }, [slug])

  if (dept === undefined) return null
  if (!dept) return <Navigate to="/departments" replace />

  const mockFaculty = buildMockFaculty(dept)
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
          {activeTab === 'faculty'        && <FacultyTab mockFaculty={mockFaculty} facultyPage={facultyPage} setFacultyPage={setFacultyPage} />}
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
