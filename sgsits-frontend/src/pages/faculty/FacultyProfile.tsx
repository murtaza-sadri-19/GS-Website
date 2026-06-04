import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  User, GraduationCap, BookOpen, FileText, Bookmark, Award,
  Mail, Phone, Building, ArrowLeft, ChevronRight, ExternalLink,
  Flame, Globe, Loader2,
} from 'lucide-react'
import {
  getPublicFacultyProfile,
  getPublicFacultyPublications,
  getPublicFacultyResearch,
  getPublicFacultyQualifications,
  type PublicFacultyProfile,
  type PublicPublication,
  type PublicResearch,
  type PublicQualification,
} from '../../services/facultyService'

// ── Section menu ──────────────────────────────────────────────────────────────

const CV_SECTIONS = [
  { id: 'biography',     label: 'Biography & Contact',    icon: User         },
  { id: 'education',     label: 'Qualifications',         icon: GraduationCap },
  { id: 'research-focus',label: 'Research Areas',         icon: Flame        },
  { id: 'publications',  label: 'Journal Publications',   icon: FileText     },
  { id: 'projects',      label: 'Funded Projects',        icon: BookOpen     },
  { id: 'guidance',      label: 'Ph.D & PG Guidance',     icon: GraduationCap },
  { id: 'teaching',      label: 'Courses Taught',         icon: Bookmark     },
  { id: 'governance',    label: 'Administration Roles',   icon: Award        },
  { id: 'affiliations',  label: 'Memberships',            icon: Globe        },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionCard({ id, title, icon: Icon, children }: {
  id: string; title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div id={id} className="bg-white border border-slate-200 rounded p-6 md:p-8 space-y-4 text-left scroll-mt-24 shadow-sm">
      <h3 className="text-lg font-display font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
        <Icon className="w-5 h-5 text-accent-blue" />
        {title}
      </h3>
      {children}
    </div>
  )
}

function Empty({ msg = 'No information available.' }) {
  return <p className="text-sm text-slate-400 py-4">{msg}</p>
}

// ── Main page ─────────────────────────────────────────────────────────────────

const FacultyProfile: React.FC = () => {
  const { facultyId }     = useParams<{ facultyId: string }>()
  const id                = parseInt(facultyId || '0')

  const [profile,        setProfile]        = useState<PublicFacultyProfile | null>(null)
  const [publications,   setPublications]   = useState<PublicPublication[]>([])
  const [research,       setResearch]       = useState<PublicResearch[]>([])
  const [qualifications, setQualifications] = useState<PublicQualification[]>([])
  const [loading,        setLoading]        = useState(true)
  const [notFound,       setNotFound]       = useState(false)
  const [activeSection,  setActiveSection]  = useState('biography')

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return }
    setLoading(true)
    Promise.all([
      getPublicFacultyProfile(id),
      getPublicFacultyPublications(id),
      getPublicFacultyResearch(id),
      getPublicFacultyQualifications(id),
    ]).then(([prof, pubs, res, quals]) => {
      if (!prof) { setNotFound(true); return }
      setProfile(prof)
      setPublications(pubs)
      setResearch(res)
      setQualifications(quals)
    }).finally(() => setLoading(false))
  }, [id])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="text-sm font-medium">Loading faculty profile…</span>
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-4">
        <User className="w-12 h-12 opacity-30" />
        <p className="text-sm font-medium">Faculty profile not found.</p>
        <Link to="/departments" className="text-xs text-primary font-bold hover:underline">
          Back to Departments
        </Link>
      </div>
    )
  }

  // Derived data
  const subjects = profile.subjects
    ? profile.subjects.split(',').map(s => s.trim()).filter(Boolean)
    : []
  const researchAreas   = research.filter(r => r.research_area)
  const fundedProjects  = research.filter(r => r.funding_agency)
  const publishedPubs   = publications.filter(p => p.status === 'PUBLISHED')

  return (
    <div className="space-y-8 bg-white pb-12">
      {/* Back nav */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <Link
          to="/departments"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Academic Departments
        </Link>
        <span className="text-xs font-bold bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">
          {profile.department_name}
        </span>
      </div>

      {/* ── Profile header ── */}
      <section className="bg-white border border-slate-200 rounded p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
        {/* Photo */}
        <div className="w-32 h-32 md:w-36 md:h-36 rounded overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0 mx-auto">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt={profile.teacher_name}
              className="w-full h-full object-cover filter saturate-[0.8]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-12 h-12 text-slate-300" />
            </div>
          )}
        </div>

        {/* Core info */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="space-y-1">
            <span className="inline-block px-2 py-0.5 bg-slate-50 text-slate-600 rounded border border-slate-200 text-xs font-bold uppercase tracking-wider">
              {profile.department_name} Department
            </span>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              {profile.teacher_name}
            </h1>
            {profile.designation && (
              <p className="text-xs md:text-sm text-primary font-bold uppercase tracking-widest mt-0.5">
                {profile.designation}
              </p>
            )}
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-500 font-sans border-y border-slate-100 py-3">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {profile.teacher_email}
            </span>
            {profile.teacher_phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {profile.teacher_phone}
                {profile.phone_ext && ` (Ext. ${profile.phone_ext})`}
              </span>
            )}
            {profile.office_location && (
              <span className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" />
                {profile.office_location}
              </span>
            )}
          </div>

          {/* Research metrics */}
          {(profile.orcid_id || profile.scopus_h_index != null || profile.total_citations != null) && (
            <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs font-bold">
              {profile.orcid_id && (
                <a
                  href={`https://orcid.org/${profile.orcid_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  ORCID: {profile.orcid_id}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {profile.scopus_h_index != null && (
                <span className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                  Scopus h-index: {profile.scopus_h_index}
                </span>
              )}
              {profile.total_citations != null && (
                <span className="bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                  Citations: {profile.total_citations.toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* External links */}
          {(profile.linkedin_url || profile.google_scholar_url || profile.personal_website) && (
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs">
              {profile.linkedin_url && (
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline">
                  LinkedIn <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {profile.google_scholar_url && (
                <a href={profile.google_scholar_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline">
                  Google Scholar <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {profile.personal_website && (
                <a href={profile.personal_website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline">
                  Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Layout grid ── */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky sidebar nav */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded border border-slate-200 sticky top-24 space-y-3 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block mb-3 px-2">
              Portfolio Contents
            </span>
            <nav className="space-y-1">
              {CV_SECTIONS.map(({ id: secId, label, icon: Icon }) => (
                <button
                  key={secId}
                  onClick={() => scrollToSection(secId)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-bold text-left transition-colors ${
                    activeSection === secId
                      ? 'bg-primary text-white border-l-2 border-accent'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* CV content panels */}
        <div className="lg:col-span-3 space-y-10">

          {/* Biography */}
          <SectionCard id="biography" title="Biography & Core Competencies" icon={User}>
            {profile.bio ? (
              profile.bio.split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i} className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans text-justify">
                  {para}
                </p>
              ))
            ) : (
              <Empty msg="Biography not provided." />
            )}
            {profile.specialization && (
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialization</p>
                <p className="text-xs text-slate-700">{profile.specialization}</p>
              </div>
            )}
            {profile.experience && (
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience</p>
                <p className="text-xs text-slate-700">{profile.experience} years</p>
              </div>
            )}
          </SectionCard>

          {/* Qualifications */}
          <SectionCard id="education" title="Academic Qualifications" icon={GraduationCap}>
            {qualifications.length === 0 ? (
              <Empty msg="No qualifications listed." />
            ) : (
              <div className="relative border-l border-slate-200 ml-3 pl-6 space-y-6 text-xs font-sans">
                {[...qualifications].sort((a, b) => (b.year ?? 0) - (a.year ?? 0)).map(q => (
                  <div key={q.id} className="relative">
                    <span className="absolute -left-[30px] top-0 w-3 h-3 rounded-full bg-primary border border-white" />
                    {q.year && <span className="text-xs font-bold text-slate-400">{q.year}</span>}
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{q.degree}</h4>
                    <p className="text-slate-500 mt-0.5">{q.institution}</p>
                    {q.specialization && <p className="text-slate-400 text-xs">{q.specialization}</p>}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Research Areas */}
          <SectionCard id="research-focus" title="Primary Research Areas" icon={Flame}>
            {researchAreas.length === 0 ? (
              <Empty msg="No research areas listed." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                {researchAreas.map(r => (
                  <div key={r.id} className="p-4 bg-slate-50 border border-slate-200 rounded hover:border-slate-400 transition-colors">
                    <h4 className="font-bold text-slate-800">{r.research_area}</h4>
                    {r.description && (
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{r.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Publications */}
          <SectionCard id="publications" title="Recent Journal Publications" icon={FileText}>
            {publishedPubs.length === 0 ? (
              <Empty msg="No publications listed." />
            ) : (
              <div className="space-y-4 text-xs font-sans">
                {publishedPubs.slice(0, 10).map(pub => (
                  <div key={pub.id} className="p-4 border-l-2 border-primary bg-white rounded-r space-y-1 border border-y-slate-200 border-r-slate-200 shadow-sm">
                    <h4 className="font-bold text-slate-800 leading-snug">
                      {pub.link ? (
                        <a href={pub.link} target="_blank" rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-1">
                          {pub.title} <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : pub.title}
                    </h4>
                    <p className="text-slate-500 text-xs">
                      {pub.journal_name && <em>{pub.journal_name}</em>}
                      {pub.publication_year && ` • ${pub.publication_year}`}
                      {pub.authors && ` • ${pub.authors}`}
                    </p>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">{pub.venue_type}</span>
                      {pub.citations > 0 && (
                        <span className="text-xs text-slate-400">{pub.citations} citations</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Funded Projects */}
          <SectionCard id="projects" title="Funded Research & Consultation Projects" icon={BookOpen}>
            {fundedProjects.length === 0 ? (
              <Empty msg="No funded projects listed." />
            ) : (
              <div className="space-y-3 text-xs font-sans">
                {fundedProjects.map(proj => {
                  const isActive = proj.status === 'Ongoing' || proj.status === 'Proposed'
                  return (
                    <div key={proj.id} className="p-4 border border-slate-200 rounded flex items-start justify-between gap-4 hover:border-slate-400 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{proj.title}</h4>
                        {proj.funding_agency && (
                          <p className="text-xs text-slate-500 mt-1">Sponsoring Agency: {proj.funding_agency}</p>
                        )}
                        <p className="text-xs font-bold mt-1" style={{ color: isActive ? '#bfa15f' : '#64748b' }}>
                          {proj.funding_amount != null && `₹${proj.funding_amount.toLocaleString()} • `}
                          {proj.status}
                          {(proj.start_year || proj.end_year) && ` (${proj.start_year ?? '?'}${proj.end_year ? `–${proj.end_year}` : '–Present'})`}
                        </p>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold uppercase border ${
                        isActive
                          ? 'bg-accent/10 text-accent border-accent/30'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}>
                        {isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>

          {/* Ph.D & PG Guidance */}
          <SectionCard id="guidance" title="Doctoral & Postgraduate Guidance" icon={GraduationCap}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-sans text-xs">
              <div className="p-4 border border-slate-200 bg-slate-50 rounded space-y-1">
                <p className="text-2xl font-bold text-slate-800">{profile.phd_guided}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Ph.D Dissertations Guided</p>
              </div>
              <div className="p-4 border border-slate-200 bg-slate-50 rounded space-y-1">
                <p className="text-2xl font-bold text-slate-800">{profile.phd_ongoing}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Active Doctoral Scholars</p>
              </div>
              <div className="p-4 border border-slate-200 bg-slate-50 rounded space-y-1">
                <p className="text-2xl font-bold text-slate-800">{profile.pg_guided > 0 ? `${profile.pg_guided}+` : profile.pg_guided}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">M.Tech / PG Guided</p>
              </div>
            </div>
          </SectionCard>

          {/* Courses Taught */}
          <SectionCard id="teaching" title="Courses Taught (UG & PG Level)" icon={Bookmark}>
            {subjects.length === 0 ? (
              <Empty msg="No courses listed." />
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-655 font-sans">
                {subjects.map((s, i) => (
                  <li key={i} className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded hover:border-slate-400 transition-colors">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Administration Roles */}
          <SectionCard id="governance" title="Administrative Duties & Governance" icon={Award}>
            {!profile.admin_roles?.length ? (
              <Empty msg="No administrative roles listed." />
            ) : (
              <ul className="text-xs text-slate-600 space-y-3.5 font-sans leading-relaxed">
                {profile.admin_roles.map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div>
                      <strong>{r.role} ({r.period}):</strong>{' '}
                      {r.description}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          {/* Memberships */}
          <SectionCard id="affiliations" title="Professional Memberships & Affiliations" icon={Globe}>
            {!profile.memberships?.length ? (
              <Empty msg="No memberships listed." />
            ) : (
              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                {profile.memberships.map((m, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                    {m}
                  </span>
                ))}
              </div>
            )}
          </SectionCard>

        </div>
      </section>
    </div>
  )
}

export default FacultyProfile
