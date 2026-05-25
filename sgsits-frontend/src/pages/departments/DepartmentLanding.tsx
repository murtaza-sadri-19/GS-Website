import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'

// ─── Service layer — the ONLY data source ────────────────────────────────────
import { departmentService, departmentsDefault } from '../../services/departmentService'
import type { DepartmentSummary } from '../../services/departmentService'

const ENGINEERING_SLUGS = [
  'computer-engineering', 'information-technology', 'civil-engineering', 'mechanical-engineering',
  'electrical-engineering', 'electronics-instrumentation', 'electronics-telecommunication',
  'industrial-production', 'biomedical-engineering',
]
const SCIENCE_SLUGS = ['applied-chemistry', 'applied-mathematics', 'applied-physics', 'humanities']
const OTHER_SLUGS   = ['management-studies', 'pharmacy', 'computer-technology', 'coebg']

const programBadgeColor = (prog: string) => {
  if (prog === 'UG')   return 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20'
  if (prog === 'PG')   return 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
  if (prog === 'PhD')  return 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30'
  if (prog === 'PTDC') return 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40'
  return 'bg-slate-50 text-slate-600 border-slate-200'
}

interface DeptGridProps {
  title: string
  depts: DepartmentSummary[]
}

const DeptGrid: React.FC<DeptGridProps> = ({ title, depts }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      <div className="flex-grow h-px bg-slate-200"></div>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {depts.map((dept) => (
        <Link
          key={dept.slug}
          to={`/departments/${dept.slug}`}
          className="bg-white rounded border border-slate-200 p-5 hover:border-accent/40 hover:shadow-md transition-all duration-200 group flex flex-col"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h4 className="font-bold text-sm text-primary group-hover:text-accent-blue transition-colors leading-snug flex-grow">
              {dept.name}
            </h4>
            <ChevronRight size={16} className="text-slate-400 group-hover:text-accent transition-colors shrink-0 mt-0.5" />
          </div>
          <p className="text-xs text-slate-500 font-medium mb-3">
            <span className="font-semibold text-slate-600">HOD:</span> {dept.hodName}
          </p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
            <div className="flex flex-wrap gap-1">
              {dept.programsOffered.slice(0, 3).map((prog) => (
                <span key={prog} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${programBadgeColor(prog)}`}>
                  {prog}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Users size={12} />
              <span>{dept.facultyCount} Faculty</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
)

const DepartmentLanding: React.FC = () => {
  // Initialize with synchronous defaults to avoid flash
  const [allDepts, setAllDepts] = useState<DepartmentSummary[]>(departmentsDefault)

  useEffect(() => {
    departmentService.getDepartments().then(setAllDepts)
  }, [])

  const engineeringDepts = allDepts.filter(d => d.category === 'engineering' || ENGINEERING_SLUGS.includes(d.slug))
  const scienceDepts     = allDepts.filter(d => d.category === 'science' || SCIENCE_SLUGS.includes(d.slug))
  const otherDepts       = allDepts.filter(d => d.category === 'other' || (!d.category && OTHER_SLUGS.includes(d.slug)))

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8">
      <PageSeo pageKey="departments" />
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Academic Departments</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Departments at SGSITS</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          17 departments offering UG, PG, PhD and PTDC programs in engineering, science, management, and pharmacy
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { value: '17',     label: 'Departments' },
          { value: '200+',   label: 'Faculty Members' },
          { value: '3,000+', label: 'Students' },
          { value: '70+ Years', label: 'of Excellence' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Department Grids */}
      <div className="space-y-10">
        <DeptGrid title="Engineering Departments"        depts={engineeringDepts} />
        <DeptGrid title="Science Departments"            depts={scienceDepts} />
        <DeptGrid title="Management, Pharmacy & Other"   depts={otherDepts} />
      </div>
    </div>
  )
}

export default DepartmentLanding
