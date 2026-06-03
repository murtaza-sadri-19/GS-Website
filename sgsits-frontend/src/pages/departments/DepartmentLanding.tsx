import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom'
import { ChevronRight, Users } from 'lucide-react'
import { useGatedLoading } from '../../hooks/useGatedLoading'
import { departmentService } from '../../services/departmentService'
import type { DepartmentSummary } from '../../services/departmentService'
import { SkeletonDeptGrid, SkeletonSimpleStat } from '../../components/ui/Skeleton'
import { institutionService, departmentStatsDefault } from '../../services/institutionService'

// ── Brand 3-theme cycle ───────────────────────────────────────────────────────
const NAVY = '#0b2545'
const GOLD = '#bfa15f'
const THEMES = [
  { bg: `${NAVY}14`, border: `${NAVY}30`, iconBg: `${NAVY}20`, color: NAVY },
  { bg: `${GOLD}14`, border: `${GOLD}35`, iconBg: `${GOLD}22`, color: GOLD },
  { bg: '#ffffff',   border: `${NAVY}20`, iconBg: `${NAVY}10`, color: NAVY },
]

const ENGINEERING_SLUGS = [
  'computer-engineering', 'information-technology', 'civil-engineering', 'mechanical-engineering',
  'electrical-engineering', 'electronics-instrumentation', 'electronics-telecommunication',
  'industrial-production', 'biomedical-engineering',
]
const SCIENCE_SLUGS = ['applied-chemistry', 'applied-mathematics', 'applied-physics', 'humanities']
const OTHER_SLUGS   = ['management-studies', 'pharmacy', 'computer-technology', 'coebg']

const programBadgeColor = (prog: string, themeColor: string) => {
  if (prog === 'UG')   return { background: `${themeColor}18`, color: themeColor, border: `${themeColor}35` }
  if (prog === 'PG')   return { background: `${themeColor}25`, color: themeColor, border: `${themeColor}45` }
  if (prog === 'PhD')  return { background: `${GOLD}18`,      color: GOLD,       border: `${GOLD}35`       }
  if (prog === 'PTDC') return { background: `${GOLD}25`,      color: GOLD,       border: `${GOLD}45`       }
  return { background: '#f1f5f9', color: '#64748b', border: '#cbd5e1' }
}

interface DeptGridProps {
  title: string
  depts: DepartmentSummary[]
  themeOffset?: number   // shift which theme starts first in this grid
}

const DeptGrid: React.FC<DeptGridProps> = ({ title, depts, themeOffset = 0 }) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      <div className="flex-grow h-px bg-slate-200" />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {depts.map((dept, idx) => {
        const t = THEMES[(idx + themeOffset) % THEMES.length]
        return (
          <Link
            key={dept.slug}
            to={`/departments/${dept.slug}`}
            className="rounded border p-5 hover:shadow-md transition-all duration-200 group flex flex-col"
            style={{ background: t.bg, borderColor: t.border }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h4 className="font-bold text-sm text-primary group-hover:opacity-80 transition-opacity leading-snug flex-grow">
                {dept.name}
              </h4>
              <ChevronRight
                size={16}
                className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5"
                style={{ color: t.color }}
              />
            </div>

            <p className="text-xs text-slate-500 font-medium mb-3">
              <span className="font-semibold text-slate-600">HOD:</span> {dept.hodName}
            </p>

            <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
              <div className="flex flex-wrap gap-1">
                {dept.programsOffered.slice(0, 3).map((prog) => {
                  const s = programBadgeColor(prog, t.color)
                  return (
                    <span
                      key={prog}
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider"
                      style={s}
                    >
                      {prog}
                    </span>
                  )
                })}
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={12} />
                <span>{dept.facultyCount} Faculty</span>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  </div>
)

const FOUNDED_YEAR = 1952

const DepartmentLanding: React.FC = () => {
  const [allDepts, setAllDepts] = useState<DepartmentSummary[]>([])
  const [loading, setLoading]   = useGatedLoading()
  const [studentCount, setStudentCount] = useState(departmentStatsDefault.studentCount)

  useEffect(() => {
    Promise.all([
      departmentService.getDepartments(),
      institutionService.getDepartmentStats(),
    ]).then(([depts, stats]) => {
      setAllDepts(depts)
      // Only keep studentCount from CMS — the rest are computed from live data
      setStudentCount(stats.studentCount ?? departmentStatsDefault.studentCount)
      setLoading(false)
    })
  }, [])

  const engineeringDepts = allDepts.filter(d => d.category === 'engineering' || ENGINEERING_SLUGS.includes(d.slug))
  const scienceDepts     = allDepts.filter(d => d.category === 'science'     || SCIENCE_SLUGS.includes(d.slug))
  const otherDepts       = allDepts.filter(d => d.category === 'other'       || (!d.category && OTHER_SLUGS.includes(d.slug)))

  // Compute stats from real data
  const totalFaculty = allDepts.reduce((sum, d) => sum + (d.facultyCount ?? 0), 0)
  const yearsLegacy  = `${new Date().getFullYear() - FOUNDED_YEAR}+ Years`

  const STAT_DATA = [
    { value: String(allDepts.length || departmentStatsDefault.deptCount), label: 'Departments',    theme: 0 },
    { value: totalFaculty > 0 ? String(totalFaculty) + '+' : departmentStatsDefault.facultyCount,  label: 'Faculty Members', theme: 1 },
    { value: studentCount,                                                                          label: 'Students',        theme: 0 },
    { value: yearsLegacy,                                                                           label: 'of Excellence',   theme: 1 },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8">
      <PageSeo pageKey="departments" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-slate-200 pb-6 mb-8">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Academic Departments</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Departments at SGSITS</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          {allDepts.length > 0 ? allDepts.length : 17} departments offering UG, PG, PhD and PTDC programs in engineering, science, management, and pharmacy
        </p>
      </div>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonSimpleStat key={i} />)
          : STAT_DATA.map((s) => {
              const t = THEMES[s.theme]
              return (
                <div key={s.label} className="rounded border p-4 text-center shadow-sm" style={{ background: t.bg, borderColor: t.border }}>
                  <p className="text-2xl font-display font-bold" style={{ color: t.color }}>{s.value}</p>
                  <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
                </div>
              )
            })
        }
      </div>

      {/* ── Department Grids ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-10">
          <SkeletonDeptGrid title="Engineering Departments"      count={6} />
          <SkeletonDeptGrid title="Science Departments"          count={4} />
          <SkeletonDeptGrid title="Management, Pharmacy & Other" count={3} />
        </div>
      ) : (
        <div className="space-y-10 animate-fade-in">
          <DeptGrid title="Engineering Departments"        depts={engineeringDepts} themeOffset={0} />
          <DeptGrid title="Science Departments"            depts={scienceDepts}     themeOffset={1} />
          <DeptGrid title="Management, Pharmacy & Other"  depts={otherDepts}       themeOffset={2} />
        </div>
      )}
    </div>
  )
}

export default DepartmentLanding
