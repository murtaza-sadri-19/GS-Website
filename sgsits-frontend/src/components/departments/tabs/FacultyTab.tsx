import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Crown, Link as LinkIcon } from 'lucide-react'

interface FacultyMember {
  id: string
  name: string
  designation: string
  credential: string
  email: string
  researchArea: string
  imageUrl: string
}

interface FacultyTabProps {
  mockFaculty: FacultyMember[]
  facultyPage: number
  setFacultyPage: (page: number) => void
}

const ITEMS_PER_PAGE = 10

const FacultyTab: React.FC<FacultyTabProps> = ({ mockFaculty, facultyPage, setFacultyPage }) => {
  const totalPages = Math.ceil(mockFaculty.length / ITEMS_PER_PAGE)
  const paged = mockFaculty.slice((facultyPage - 1) * ITEMS_PER_PAGE, facultyPage * ITEMS_PER_PAGE)

  const scrollToTop = () => {
    setTimeout(() => document.getElementById('faculty-tab-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const hodCard = facultyPage === 1 ? paged[0] : null
  const rest = facultyPage === 1 ? paged.slice(1) : paged

  return (
    <div id="faculty-tab-header" className="space-y-6 scroll-mt-24">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Department Faculty Directories</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
        Showing {(facultyPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(facultyPage * ITEMS_PER_PAGE, mockFaculty.length)} of {mockFaculty.length} members.
      </p>

      {hodCard && (
        <div className="pt-2">
          <p className="text-[10px] font-bold text-[#bfa15f] uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" /> Head of Department
          </p>
          <div className="p-5 bg-white border-2 border-[#bfa15f]/40 rounded flex flex-col sm:flex-row gap-5 items-start shadow-sm hover:border-[#bfa15f]/70 transition-all duration-200">
            <div className="w-20 h-20 rounded overflow-hidden bg-slate-50 border-2 border-[#bfa15f]/30 flex-shrink-0">
              <img src={hodCard.imageUrl} alt={hodCard.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 space-y-2.5">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-bold text-slate-900">{hodCard.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[9px] bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider whitespace-nowrap">
                      <Crown className="w-2.5 h-2.5" /> HOD
                    </span>
                  </div>
                  <p className="text-[11px] text-accent font-bold uppercase tracking-wider mt-0.5">{hodCard.designation}</p>
                </div>
                <span className="text-[9px] bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-semibold font-sans whitespace-nowrap shrink-0">
                  {hodCard.credential}
                </span>
              </div>
              <div className="text-[11px] text-slate-550 space-y-1 font-sans font-medium">
                <p className="line-clamp-1"><strong>Research Area:</strong> {hodCard.researchArea}</p>
                <p className="flex items-center gap-1 text-slate-500"><Mail className="w-3 h-3 flex-shrink-0" />{hodCard.email}</p>
              </div>
              <Link
                to={`/faculty/${hodCard.id}`}
                className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-[#bfa15f]/5 border border-[#bfa15f]/25 text-[#bfa15f] font-bold text-[10px] rounded hover:bg-[#bfa15f]/10 hover:border-[#bfa15f]/50 transition-all duration-200"
              >
                <LinkIcon className="w-3.5 h-3.5" />View HOD Portfolio
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rest.map((fac) => (
          <div key={fac.id} className="p-4 bg-white border border-slate-200 rounded flex flex-col justify-between space-y-4 hover:border-slate-400 shadow-sm transition-all duration-200">
            <div className="flex gap-4 items-start">
              <div className="w-16 h-16 rounded overflow-hidden bg-slate-50 border border-slate-200 flex-shrink-0">
                <img src={fac.imageUrl} alt={fac.name} className="w-full h-full object-cover filter saturate-[0.85]" />
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{fac.name}</h4>
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider mt-0.5">{fac.designation}</p>
                  </div>
                  <span className="text-[9px] bg-slate-50 text-slate-600 border border-slate-250 px-2 py-0.5 rounded font-semibold font-sans whitespace-nowrap shrink-0">
                    {fac.credential}
                  </span>
                </div>
                <div className="text-[11px] text-slate-550 space-y-1 font-sans font-medium">
                  <p className="line-clamp-1"><strong>Research Area:</strong> {fac.researchArea}</p>
                  <p className="flex items-center gap-1 text-slate-500 truncate"><Mail className="w-3 h-3 flex-shrink-0" />{fac.email}</p>
                </div>
              </div>
            </div>
            <Link
              to={`/faculty/${fac.id}`}
              className="inline-flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] rounded hover:bg-slate-100 hover:text-primary hover:border-slate-350 transition-all duration-200"
            >
              <LinkIcon className="w-3.5 h-3.5" />View Portfolio Dashboard
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={() => { if (facultyPage > 1) { setFacultyPage(facultyPage - 1); scrollToTop() } }}
            disabled={facultyPage === 1}
            className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1
            return (
              <button
                key={p}
                type="button"
                onClick={() => { setFacultyPage(p); scrollToTop() }}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  facultyPage === p ? 'bg-primary text-white font-bold' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => { if (facultyPage < totalPages) { setFacultyPage(facultyPage + 1); scrollToTop() } }}
            disabled={facultyPage === totalPages}
            className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default FacultyTab
