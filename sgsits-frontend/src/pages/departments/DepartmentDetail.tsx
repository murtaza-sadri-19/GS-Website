import React, { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
// ─── Service layer — the ONLY data source ────────────────────────────────────
import { departmentService } from '../../services/departmentService'
import type { DepartmentSummary } from '../../services/departmentService'
import {
  BookOpen,
  Award,
  Users,
  Calendar,
  FileText,
  Building,
  Image as ImageIcon,
  Mail,
  Phone,
  Info,
  Sparkles,
  Link as LinkIcon,
  Eye
} from 'lucide-react'
import PdfViewerModal from '../../components/global/PdfViewerModal'

const TABS = [
  { id: 'about', label: 'About', icon: Info },
  { id: 'obe', label: 'OBE & PEOs', icon: Sparkles },
  { id: 'curriculum', label: 'Curriculum & Schemes', icon: FileText },
  { id: 'faculty', label: 'Faculty & Staff', icon: Users },
  { id: 'research', label: 'Research & Labs', icon: BookOpen },
  { id: 'timetable', label: 'Timetables', icon: Calendar },
  { id: 'achievements', label: 'Achievements & Placements', icon: Award },
  { id: 'infrastructure', label: 'Labs & Infrastructure', icon: Building },
  { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  { id: 'contact', label: 'Contact Us', icon: Mail }
]

const DepartmentDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [activeTab, setActiveTab] = useState('about')
  const [facultyPage, setFacultyPage] = useState(1)
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean
    url: string
    title: string
  }>({
    isOpen: false,
    url: '',
    title: ''
  })
  // Department data loaded through the service layer
  const [dept, setDept] = useState<DepartmentSummary | null | undefined>(undefined)

  // Reset faculty page to 1 on department changes
  useEffect(() => {
    setFacultyPage(1)
  }, [slug])

  // Load department via service on slug change
  useEffect(() => {
    if (!slug) { setDept(null); return }
    departmentService.getDepartmentBySlug(slug).then(setDept)
    // REAL: departmentService.getDepartmentBySlug(slug).then(setDept)
  }, [slug])

  // Loading state — show nothing until service resolves
  if (dept === undefined) return null

  if (!dept) {
    return <Navigate to="/departments" replace />
  }

  // Curate Mock Faculty List for the Department
  const mockFaculty = Array.from({ length: Math.max(dept.facultyCount, 28) }).map((_, idx) => {
    const names = [
      'Dr. Smita Verma', 'Dr. Nitish Gupta', 'Dr. Joseph Thomas Andrews', 'Dr. Urjita Thakar', 
      'Dr. R.K. Khare', 'Dr. Satish Jain', 'Dr. H.K. Verma', 'Dr. R.C. Gurjar',
      'Dr. Vineet Singh', 'Dr. Sunita Varma', 'Ms. Vibha Bhatnagar', 'Dr. Girish Thakar'
    ]
    const credentials = ['Ph.D (IIT Bombay)', 'Ph.D (IIT Roorkee)', 'Ph.D (IISc Bangalore)', 'Ph.D (SGSITS Indore)']
    const designations = ['Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor']
    
    const isHod = idx === 0
    const name = isHod ? dept.hodName : names[(idx + 4) % names.length]
    const isFemale = name.includes('Smita') || name.includes('Urjita') || name.includes('Sunita') || name.includes('Vibha')
    const imageUrl = isFemale 
      ? [
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop'
        ][idx % 4]
      : [
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop'
        ][idx % 4]

    return {
      id: `${dept.shortName.toLowerCase().replace(' ', '-')}-fac-${idx + 1}`,
      name,
      designation: isHod ? designations[0] : designations[(idx % 3) + 1],
      credential: isHod ? credentials[0] : credentials[(idx + 2) % credentials.length],
      email: isHod ? dept.hodEmail : `${names[(idx + 4) % names.length].toLowerCase().replace(/dr\.\s|ms\.\s/, '').replace(/\s/g, '.')}@sgsits.ac.in`,
      researchArea: ['Machine Learning, IoT', 'Structural Engineering, Seismic Analysis', 'Power Systems, Renewable Energy', 'Synthetic Chemistry'][idx % 4],
      imageUrl
    }
  })

  return (
    <div className="space-y-8 bg-white pb-12">
      {/* ── DEPARTMENT HERO BANNER ── */}
      <section className="bg-slate-50 border border-slate-200 rounded p-6 md:p-8 relative">
        <div className="relative space-y-4 max-w-4xl">
          <span className="inline-block px-2.5 py-0.5 bg-slate-200/85 text-slate-800 rounded border border-slate-300 text-[9px] font-bold uppercase tracking-wider">
            {dept.programsOffered.join(' • ')} Programs
          </span>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">
              Department of <span className="font-serif italic font-semibold text-primary">{dept.name}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-550 leading-relaxed font-sans max-w-2xl font-medium">
              {dept.description || `Fostering engineering breakthroughs, industrial leadership, and comprehensive research in ${dept.shortName} sciences since the establishment.`}
            </p>
          </div>

          {/* Quick HOD details bar */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-slate-200 text-xs text-slate-600 font-sans">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800">HOD:</span>
              <span>{dept.hodName}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-800">Email:</span>
              <a href={`mailto:${dept.hodEmail}`} className="text-accent-blue hover:underline">
                {dept.hodEmail}
              </a>
            </div>
            {dept.hodPhone && (
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-800">Phone:</span>
                <span>{dept.hodPhone}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── TAB LAYOUT ── */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side Tab Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded border border-slate-200 sticky top-24 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-550 block mb-3 px-2">
              Section Menu
            </span>
            <nav className="space-y-1">
              {TABS.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold text-left transition-colors duration-150 ${
                      activeTab === tab.id
                        ? 'bg-slate-50 text-primary border-l-2 border-accent'
                        : 'text-slate-655 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Right Side Content Sheet */}
        <div className="lg:col-span-3 bg-white rounded border border-slate-200 p-6 md:p-8 shadow-sm">
          {/* ── ABOUT TAB ── */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Overview & Academic Mission
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {dept.aboutParagraphs && dept.aboutParagraphs.length > 0 ? (
                    dept.aboutParagraphs.map((para, i) => (
                      <p key={i} className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify" dangerouslySetInnerHTML={{ __html: para }} />
                    ))
                  ) : (
                    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify">
                      The Department of <strong>{dept.name}</strong> at Shri G. S. Institute of Technology & Science remains a cornerstone of scholastic excellence. The division offers premium engineering tracks coupled with robust research infrastructure, ensuring that graduating students possess elite design skills, theoretical expertise, and practical insight.
                    </p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <div className="rounded border border-slate-200 overflow-hidden shadow-xs bg-slate-50">
                    <div className="aspect-[4/3] bg-slate-100 relative">
                      <img
                        src={dept.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop"}
                        alt={`${dept.name} Representative Image`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white text-center border-t border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                        Branch Representative
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="p-5 bg-white rounded border border-slate-200/80 space-y-3 flex flex-col hover:border-slate-350 transition-colors duration-200">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider">
                    Infrastructure Highlights
                  </h3>
                  <ul className="text-xs text-slate-500 space-y-2 font-sans font-medium">
                    {dept.infraHighlights && dept.infraHighlights.length > 0 ? (
                      dept.infraHighlights.map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">• {hl}</li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-1.5">• Dedicated Department Computer Center</li>
                        <li className="flex items-start gap-1.5">• Advanced Hardware / Research Laboratories</li>
                        <li className="flex items-start gap-1.5">• Comprehensive Reference Library with 5000+ volumes</li>
                        <li className="flex items-start gap-1.5">• High-Speed Wi-Fi & LAN connectivity (10 Gbps backbone)</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="p-5 bg-white rounded border border-slate-200/80 space-y-3 flex flex-col hover:border-slate-350 transition-colors duration-200">
                  <h3 className="text-xs font-bold text-accent uppercase tracking-wider">
                    Offered Programs & Intake
                  </h3>
                  <ul className="text-xs text-slate-500 space-y-2 font-sans font-medium">
                    {dept.programsIntake && dept.programsIntake.length > 0 ? (
                      dept.programsIntake.map((pi, i) => (
                        <li key={i} className="flex items-start gap-1.5">• {pi}</li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-1.5">• B.Tech / B.Pharma (4-Year Degree) - {dept.programsOffered.includes('UG') ? '120 Intake' : 'N/A'}</li>
                        <li className="flex items-start gap-1.5">• M.Tech / M.Pharma / MBA (2-Year Degree) - {dept.programsOffered.includes('PG') ? '18-25 Intake' : 'N/A'}</li>
                        <li className="flex items-start gap-1.5">• Ph.D (Doctoral Research) - {dept.programsOffered.includes('PhD') ? 'Active Scholars' : 'N/A'}</li>
                        <li className="flex items-start gap-1.5">• Part-Time Degree Courses (PTDC) - {dept.programsOffered.includes('PTDC') ? 'Active Schemes' : 'N/A'}</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── OBE TAB ── */}
          {activeTab === 'obe' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Outcome Based Education (OBE)
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify">
                Adhering to National Board of Accreditation (NBA) standards and the NEP 2020 layout, the department implements a structured Outcome-Based Education model. Program Outcomes (PEOs / POs) and course metrics are continuously tracked to improve technical training.
              </p>
              <div className="space-y-4 pt-4">
                <div className="p-4 bg-slate-50 rounded border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Departmental Vision
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify font-medium">
                    "{dept.vision || `To emerge as a premier center of technical education and research in ${dept.shortName} sciences, creating ethically sound professionals equipped to handle global industrial demands.`}"
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Departmental Mission
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify font-medium">
                    "{dept.mission || `Providing rich academic environments through advanced labs and Outcome-Based curriculums, fostering collaborative industrial projects, and instilling technical values conducive to social prosperity.`}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── CURRICULUM TAB ── */}
          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Syllabi & Credit Schemes
                </h2>
                <span className="text-[10px] font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">
                  NEP 2020 Ready
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans">
                Download the official PDF schemes and syllabus booklets ratified by the Academic Council for respective academic batches.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {[
                  { title: 'B.Tech Scheme & Syllabus (1st Year Batch 2025-26)', size: '2.4 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                  { title: 'B.Tech Core Scheme & Electives (2nd to 4th Year)', size: '4.8 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                  { title: 'M.Tech / PGCourses Scheme (All Branches 2025-26)', size: '1.9 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                  { title: 'List of Open Electives & Audit Courses (NEP 2020)', size: '1.2 MB', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-slate-200 rounded flex items-center justify-between hover:border-slate-350 hover:bg-slate-50/50 transition-colors duration-200 shadow-sm"
                  >
                    <div className="flex items-start gap-3 w-[80%]">
                      <FileText className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-1">
                          {doc.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium font-sans">
                          PDF Booklet • {doc.size}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPdfViewer({ isOpen: true, url: doc.url, title: doc.title })}
                      className="p-2 bg-white border border-slate-200 rounded hover:text-primary hover:border-slate-350 text-slate-500 hover:shadow-sm transition-colors duration-200"
                      title="View PDF inline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FACULTY TAB ── */}
          {activeTab === 'faculty' && (() => {
            const ITEMS_PER_PAGE = 10
            const totalFacultyPages = Math.ceil(mockFaculty.length / ITEMS_PER_PAGE)
            const paginatedFaculty = mockFaculty.slice(
              (facultyPage - 1) * ITEMS_PER_PAGE,
              facultyPage * ITEMS_PER_PAGE
            )

            const scrollToFacultyHeader = () => {
              setTimeout(() => {
                document.getElementById('faculty-tab-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }, 50)
            }

            return (
              <div id="faculty-tab-header" className="space-y-6 scroll-mt-24">
                <div className="pb-3 border-b border-slate-200">
                  <h2 className="text-xl font-display font-bold text-slate-900">
                    Department Faculty Directories
                  </h2>
                </div>
                <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
                  Meet our core team of expert educators, researchers, and lab specialists guiding the technical department. Showing {(facultyPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(facultyPage * ITEMS_PER_PAGE, mockFaculty.length)} of {mockFaculty.length} members.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {paginatedFaculty.map((fac) => (
                    <div
                      key={fac.id}
                      className="p-4 bg-white border border-slate-200 rounded flex flex-col justify-between space-y-4 hover:border-slate-400 shadow-sm transition-all duration-200"
                    >
                      <div className="flex gap-4 items-start">
                        {/* Faculty Profile Image */}
                        <div className="w-16 h-16 rounded overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                          <img
                            src={fac.imageUrl}
                            alt={fac.name}
                            className="w-full h-full object-cover filter saturate-[0.85]"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-800 truncate">
                                {fac.name}
                              </h4>
                              <p className="text-[10px] text-accent font-bold uppercase tracking-wider mt-0.5">
                                {fac.designation}
                              </p>
                            </div>
                            <span className="text-[9px] bg-slate-50 text-slate-600 border border-slate-250 px-2 py-0.5 rounded font-semibold font-sans whitespace-nowrap shrink-0">
                              {fac.credential}
                            </span>
                          </div>
                          
                          <div className="text-[11px] text-slate-550 space-y-1 font-sans font-medium">
                            <p className="line-clamp-1"><strong>Research Area:</strong> {fac.researchArea}</p>
                            <p className="flex items-center gap-1 text-slate-500 truncate">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              {fac.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Link
                        to={`/faculty/${fac.id}`}
                        className="inline-flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] rounded hover:bg-slate-100 hover:text-primary hover:border-slate-350 transition-all duration-200"
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        View Portfolio Dashboard
                      </Link>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalFacultyPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        if (facultyPage > 1) {
                          setFacultyPage(facultyPage - 1)
                          scrollToFacultyHeader()
                        }
                      }}
                      disabled={facultyPage === 1}
                      className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalFacultyPages }).map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setFacultyPage(pageNum)
                            scrollToFacultyHeader()
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                            facultyPage === pageNum
                              ? 'bg-primary text-white font-bold'
                              : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (facultyPage < totalFacultyPages) {
                          setFacultyPage(facultyPage + 1)
                          scrollToFacultyHeader()
                        }
                      }}
                      disabled={facultyPage === totalFacultyPages}
                      className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )
          })()}

          {/* ── RESEARCH TAB ── */}
          {activeTab === 'research' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Research Journals & Core Labs
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify">
                The department remains highly active in technical publications (IEEE, Springer, ScienceDirect), industrial consultation works, and central research projects sponsored by government bodies.
              </p>

              <div className="space-y-4 pt-4">
                <div className="p-5 border border-slate-200 rounded space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-accent-blue" strokeWidth={1.75} />
                    Sponsored Research Grants
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Ongoing research projects funded by DST (Department of Science & Technology), AICTE, and state councils totaling over ₹1.2 Crores in active instrumentation grants.
                  </p>
                </div>
                <div className="p-5 border border-slate-200 rounded space-y-3 bg-white">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-accent-blue" strokeWidth={1.75} />
                    Core Research Laboratories
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    State-of-the-art computational infrastructure featuring CAD/CAM modeling systems, hardware accelerators, VLSI emulation suites, and specialized chemical instrumentation centers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── TIMETABLE TAB ── */}
          {activeTab === 'timetable' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Academic Class Timetables
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
                Select your academic batch to download active schedules, lecture hour splits, and laboratory slot sheets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                  { sem: 'B.Tech III / V Semester', slot: 'Class Lectures & Labs', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                  { sem: 'B.Tech VII Semester', slot: 'Project Work Schedule', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
                  { sem: 'M.Tech / PG Modules', slot: 'Lecture Slots & Seminars', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
                ].map((sched, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-slate-200 rounded space-y-3 flex flex-col justify-between shadow-sm hover:border-slate-350 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">
                        {sched.sem}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-sans font-semibold">
                        {sched.slot}
                      </p>
                    </div>
                    <button 
                      onClick={() => setPdfViewer({ isOpen: true, url: sched.url, title: `${sched.sem} Timetable` })}
                      className="w-full py-1.5 bg-slate-50 border border-slate-200 hover:text-primary hover:bg-slate-100 hover:border-slate-350 text-slate-600 font-bold text-[10px] rounded flex items-center justify-center gap-1 shadow-sm transition-all duration-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Timetable
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ACHIEVEMENTS TAB ── */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Placements & National Rank Lists
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
                Highlights of top department graduates, GATE score accomplishments, and placement logs from our Training & Placement (T&P) portal alignment.
              </p>
              
              <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-4 pt-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" strokeWidth={1.5} />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Recent Placements Spotlights
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <p className="font-bold text-primary text-base">₹18.5 LPA</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Highest Package Secured</p>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded">
                    <p className="font-bold text-primary text-base">92.4%</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Overall Branch Placement Log</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── INFRASTRUCTURE TAB ── */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Labs & Infrastructure Catalog
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
                Comprehensive directory of laboratory facilities providing experiential learning, technical workshops, and PG research setups.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {[
                  { name: 'VLSI & Signal Processing Lab', desc: 'Features advanced MATLAB, Xilinx, Cadence tooling, and emulation development boards.' },
                  { name: 'Central Machine Hall', desc: 'Houses micro-precision grinders, digital milling devices, and high-temperature furnace blocks.' },
                  { name: 'Applied Optoelectronics Cell', desc: 'Specialized lab supporting laser alignment setups, optical fiber emulators, and spectrometer units.' },
                  { name: 'Outcome Computing Lab', desc: 'Hosts 40 workstation hubs with specialized Unix and Python scripting clusters.' }
                ].map((lab, idx) => (
                  <div
                    key={idx}
                    className="p-4 border border-slate-200 rounded space-y-2 bg-white"
                  >
                    <h4 className="text-xs font-bold text-slate-800">
                      {lab.name}
                    </h4>
                    <p className="text-[11px] text-slate-550 leading-relaxed font-sans font-medium">
                      {lab.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── GALLERY TAB ── */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Department Photo Logs
                </h2>
              </div>
              <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
                Highlights of industrial visits, conference presentations, and technical seminars.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {[
                  'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=300&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=300&auto=format&fit=crop'
                ].map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <img src={img} alt="Dept Event" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CONTACT TAB ── */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="pb-3 border-b border-slate-200">
                <h2 className="text-xl font-display font-bold text-slate-900">
                  Administrative Contacts
                </h2>
              </div>
              
              <div className="p-6 bg-slate-50 border border-slate-200 rounded space-y-6 max-w-xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white border border-slate-200 text-accent-blue rounded">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Academic Office Email
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
                      {dept.hodEmail} (HOD Inquiry Desk)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-sans font-medium">
                      office.{dept.slug.replace('-', '')}@sgsits.ac.in (Main Desk)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white border border-slate-200 text-accent-blue rounded">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Departmental Extension
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 font-sans font-medium">
                      {dept.hodPhone || '+91-731-2582100 (Ext. 401)'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white border border-slate-200 text-accent-blue rounded">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Physical Location
                    </h4>
                    <p className="text-xs text-slate-550 mt-1 leading-relaxed font-sans font-medium text-justify">
                      SGSITS Central Campus, {dept.shortName} Wing Blocks, 23 Park Road, Indore - 452003 (M.P.), India
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <PdfViewerModal
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer(prev => ({ ...prev, isOpen: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
    </div>
  )
}

export default DepartmentDetail
