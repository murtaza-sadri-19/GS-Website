import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  User,
  GraduationCap,
  BookOpen,
  FileText,
  Bookmark,
  Award,
  Mail,
  Phone,
  Building,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Flame,
  Globe
} from 'lucide-react'

interface CVSection {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const CV_SECTIONS: CVSection[] = [
  { id: 'biography', label: 'Biography & Contact', icon: User },
  { id: 'education', label: 'Qualifications', icon: GraduationCap },
  { id: 'research-focus', label: 'Research Areas', icon: Flame },
  { id: 'publications', label: 'Journal Publications', icon: FileText },
  { id: 'projects', label: 'Funded Projects', icon: BookOpen },
  { id: 'guidance', label: 'Ph.D & PG Guidance', icon: GraduationCap },
  { id: 'teaching', label: 'Courses Taught', icon: Bookmark },
  { id: 'governance', label: 'Administration Roles', icon: Award },
  { id: 'affiliations', label: 'Memberships', icon: Globe }
]

const FacultyProfile: React.FC = () => {
  const { facultyId } = useParams<{ facultyId: string }>()
  const [activeSection, setActiveSection] = useState('biography')

  // Derive mock profile name from slug/id
  const cleanId = facultyId || 'smita-verma'
  const nameParts = cleanId.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1))
  const isDoctor = !cleanId.startsWith('vibha')
  const prefix = isDoctor ? 'Dr. ' : 'Ms. '
  const facultyName = `${prefix}${nameParts.join(' ')}`
  const deptName = cleanId.includes('smita') ? 'Applied Mathematics' : 
                   cleanId.includes('nitish') ? 'Applied Chemistry' :
                   cleanId.includes('joseph') ? 'Applied Physics' :
                   cleanId.includes('urjita') ? 'Computer Engineering' : 'Engineering Sciences'

  // Scroll handler for anchors
  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-8 bg-white pb-12">
      {/* Back navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          to="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-550 hover:text-primary transition-colors duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Academic Departments
        </Link>
        <span className="text-[10px] font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
          Faculty ID: {cleanId}
        </span>
      </div>

      {/* ── FACULTY HEAD / HEADER CARD ── */}
      <section className="bg-white border border-slate-200 rounded p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        {/* Photo Container */}
        <div className="w-32 h-32 md:w-36 md:h-36 rounded overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 mx-auto">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
            alt={facultyName}
            className="w-full h-full object-cover filter saturate-[0.8]"
          />
        </div>

        {/* Core Metadata */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="space-y-1">
            <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200 text-[9px] font-bold uppercase tracking-wider">
              {deptName} Department
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              {facultyName}
            </h1>
            <p className="text-xs md:text-sm text-primary font-bold uppercase tracking-widest mt-0.5">
              Professor & Dean Academics
            </p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-500 font-sans border-y border-slate-100 py-3">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-accent-blue" />
              {cleanId.replace('-', '')}@sgsits.ac.in
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent-blue" />
              +91-731-2582401 (Ext. 201)
            </span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-accent-blue" />
              Academic Block B, Room 204
            </span>
          </div>

          {/* Research Metrics Badges */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 text-[10px] font-bold">
            <a 
              href="https://orcid.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 hover:border-slate-400 transition-colors"
            >
              ORCID ID: 0000-0002-9834-291X
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
            <span className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
              Scopus h-index: 12
            </span>
            <span className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
              Citations: 540+
            </span>
          </div>
        </div>
      </section>

      {/* ── PROFILE LAYOUT GRID ── */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky Anchor Menu */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded border border-slate-200 sticky top-24 space-y-3 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-550 block mb-3 px-2">
              Portfolio Contents
            </span>
            <nav className="space-y-1">
              {CV_SECTIONS.map((sec) => {
                const Icon = sec.icon
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold text-left transition-colors duration-150 ${
                      activeSection === sec.id
                        ? 'bg-primary text-white border-l-2 border-accent'
                        : 'text-slate-650 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{sec.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Complete CV Content Panels */}
        <div className="lg:col-span-3 space-y-10">
          {/* Biography */}
          <div id="biography" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-accent-blue" />
              Biography & Core Competencies
            </h3>
            <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans text-justify">
              {facultyName} serves as a senior Academic Dean and core researcher in {deptName} at Shri G. S. Institute of Technology & Science (SGSITS). With over 22 years of active pedagogical engagement and post-doctoral research coordinates, she guides advanced computing clusters and publishes regularly in top-tier national journals.
            </p>
            <p className="text-xs md:text-sm text-slate-650 leading-relaxed font-sans text-justify">
              Her primary academic mission centers around outcome-oriented systems, collaborating on ISRO and DST grants, and mentoring Ph.D doctoral cohorts to transition novel computational theories into industrial models.
            </p>
          </div>

          {/* Education */}
          <div id="education" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent-blue" />
              Academic Qualifications
            </h3>
            <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-6 text-xs font-sans">
              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-3 h-3 rounded-full bg-primary border border-white"></span>
                <span className="text-[10px] font-bold text-slate-400">2005 - 2009</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Ph.D in Applied Computational Sciences</h4>
                <p className="text-slate-500 mt-0.5">Indian Institute of Technology, Roorkee (IIT Roorkee)</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-3 h-3 rounded-full bg-slate-350 border border-white"></span>
                <span className="text-[10px] font-bold text-slate-400">2001 - 2003</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Master of Technology (M.Tech / M.Sc)</h4>
                <p className="text-slate-500 mt-0.5">SGSITS College, Indore (Gold Medalist)</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[30px] top-0 w-3 h-3 rounded-full bg-slate-350 border border-white"></span>
                <span className="text-[10px] font-bold text-slate-400">1997 - 2001</span>
                <h4 className="font-bold text-slate-900 text-sm mt-0.5">Bachelor of Engineering (B.E / B.Tech)</h4>
                <p className="text-slate-500 mt-0.5">Government Engineering College, Jabalpur</p>
              </div>
            </div>
          </div>

          {/* Research Focus */}
          <div id="research-focus" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent-blue" />
              Primary Research Areas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              {[
                { field: 'Advanced Computational Models', desc: 'Predictive neural frameworks, seismic data matrices, and simulation metrics.' },
                { field: 'Numerical Matrix Methods', desc: 'Boundary element methods and high-performance algorithms for engineering materials.' },
                { field: 'Applied Optoelectronic Systems', desc: 'Sensing models and optical instrumentation for sub-surface data captures.' },
                { field: 'NEP outcome optimization', desc: 'Adaptive learning frameworks for outcome metrics and credits.' }
              ].map((res, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-slate-400 transition-colors">
                  <h4 className="font-bold text-slate-800">{res.field}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{res.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Publications */}
          <div id="publications" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent-blue" />
              Recent Journal Publications
            </h3>
            <div className="space-y-4 text-xs font-sans">
              {[
                { title: 'An Adaptive Neural Framework for Seismic Structural Integrity Analytics', journal: 'IEEE Transactions on Geoscience & Remote Sensing', year: '2025', volume: 'Vol. 14, pp. 240-256' },
                { title: 'Boundary Element Emulations of Thermoelastic Wave Propagation in Anisotropic Materials', journal: 'Journal of Computational Physics (Elsevier)', year: '2024', volume: 'Vol. 398, pp. 112-124' },
                { title: 'Design and Development of AI-Driven Optoelectronic Sensors for Real-Time Pipeline Monitoring', journal: 'Springer Optoelectronics Research Reviews', year: '2023', volume: 'Vol. 42, pp. 88-102' }
              ].map((pub, idx) => (
                <div key={idx} className="p-4 border-l-2 border-primary bg-white rounded-r space-y-1 border border-y-slate-200 border-r-slate-200 shadow-sm">
                  <h4 className="font-bold text-slate-800 leading-snug">{pub.title}</h4>
                  <p className="text-slate-550 text-[11px]">
                    <em>{pub.journal}</em> • {pub.year} • {pub.volume}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div id="projects" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent-blue" />
              Funded Research & Consultation Projects
            </h3>
            <div className="space-y-3 text-xs font-sans">
              <div className="p-4 border border-slate-200 rounded flex items-center justify-between hover:border-slate-400 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-800">Seismic Wave Modeling and Alert Handshakes</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Sponsoring Agency: DST (Department of Science & Technology)</p>
                  <p className="text-[10px] text-primary font-bold mt-1">Budget: ₹42 Lakhs • Ongoing (2024-27)</p>
                </div>
                <span className="px-2 py-0.5 bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 rounded text-[9px] font-bold uppercase">Active</span>
              </div>
              <div className="p-4 border border-slate-200 rounded flex items-center justify-between hover:border-slate-400 transition-colors">
                <div>
                  <h4 className="font-bold text-slate-800">Emulation of Advanced Micro-Grid Controllers</h4>
                  <p className="text-[11px] text-slate-500 mt-1">Sponsoring Agency: AICTE Research Promotion Scheme (RPS)</p>
                  <p className="text-[10px] text-slate-550 font-bold mt-1">Budget: ₹18.5 Lakhs • Completed (2021-24)</p>
                </div>
                <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-500 rounded text-[9px] font-bold uppercase">Closed</span>
              </div>
            </div>
          </div>

          {/* Ph.D & PG Guidance */}
          <div id="guidance" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent-blue" />
              Doctoral & Postgraduate Guidance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-sans text-xs">
              <div className="p-4 border border-slate-200 bg-slate-50 rounded space-y-1">
                <p className="text-2xl font-bold text-slate-800">6</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Ph.D Dissertations Guided</p>
              </div>
              <div className="p-4 border border-slate-200 bg-slate-50 rounded space-y-1">
                <p className="text-2xl font-bold text-slate-800">4</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Doctoral Scholars</p>
              </div>
              <div className="p-4 border border-slate-200 bg-slate-50 rounded space-y-1">
                <p className="text-2xl font-bold text-slate-800">28+</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">M.Tech / M.Pharma Guided</p>
              </div>
            </div>
          </div>

          {/* Teaching */}
          <div id="teaching" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-accent-blue" />
              Courses Taught (UG & PG Level)
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-655 font-sans">
              <li className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded hover:border-slate-400 transition-colors">
                <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                Advanced Mathematical Methods (PG - M.Tech Course)
              </li>
              <li className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded hover:border-slate-400 transition-colors">
                <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                Numerical Integration & Computations (UG - B.Tech Course)
              </li>
              <li className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded hover:border-slate-400 transition-colors">
                <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                Machine Learning and Boundary Value Analysis (PG elective)
              </li>
              <li className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded hover:border-slate-400 transition-colors">
                <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                Finite Element Analysis in Engineering Sciences (UG Core)
              </li>
            </ul>
          </div>

          {/* Governance */}
          <div id="governance" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-blue" />
              Administrative Duties & Governance
            </h3>
            <ul className="text-xs text-slate-650 space-y-3.5 font-sans leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></span>
                <div>
                  <strong>Dean of Academic Affairs (2024 - Present):</strong> Manages institute curriculum schemes, Outcome-Based Education audits, and NEP 2020 alignments across all 17 branches.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></span>
                <div>
                  <strong>Member of Academic Council (2021 - Present):</strong> Ratifies ordinances, semester schemes, timetable updates, and credit standards.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0"></span>
                <div>
                  <strong>Senior Coordinator (TEQIP Phase-III):</strong> Supervised procurement, lab installations, and faculty development coordinates.
                </div>
              </li>
            </ul>
          </div>

          {/* Affiliations */}
          <div id="affiliations" className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent-blue" />
              Professional Memberships & Affiliations
            </h3>
            <div className="flex flex-wrap gap-3 text-xs font-semibold">
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                Senior Member, IEEE (USA)
              </span>
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                Life Member, Indian Society for Technical Education (ISTE)
              </span>
              <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                Fellow Member, IAENG (International Association of Engineers)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FacultyProfile
