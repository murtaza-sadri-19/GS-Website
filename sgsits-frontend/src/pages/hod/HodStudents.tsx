import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalTable, Badge } from '../../components/layout/PortalLayout'
import { getStudents, type Student } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Search, GraduationCap, Mail } from 'lucide-react'

const HOD_BRANCH = 'CSE'

const HodStudents: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [semFilter, setSemFilter] = useState<'all' | number>('all')
  const [sectionFilter, setSectionFilter] = useState<'all' | string>('all')
  const [atktOnly, setAtktOnly] = useState(false)

  useEffect(() => {
    getStudents(hodBranch).then(s => { setAllStudents(s); setLoading(false) })
  }, [hodBranch])

  const branchStudents = useMemo(
    () => allStudents.filter(s => s.branch_id === hodBranch),
    [allStudents, hodBranch]
  )

  const visible = useMemo(() => {
    return branchStudents.filter(s => {
      if (semFilter !== 'all' && s.semester !== semFilter) return false
      if (sectionFilter !== 'all' && s.section !== sectionFilter) return false
      if (atktOnly && !s.hasATKT) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!s.student_name.toLowerCase().includes(q) && !s.enrollment_no.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [branchStudents, search, semFilter, sectionFilter, atktOnly])

  const stats = {
    total: branchStudents.length,
    atkt: branchStudents.filter(s => s.hasATKT).length,
    sections: new Set(branchStudents.map(s => `${s.semester}-${s.section ?? ''}`)).size,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Students"
        subtitle="View enrolled students by semester and section"
      />

      <div className="grid grid-cols-3 gap-3">
        <PortalCard className="!p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Students</p>
              <p className="text-2xl font-bold text-[#0b2545] mt-1">{stats.total}</p>
            </div>
            <GraduationCap size={20} className="text-[#0b2545]" />
          </div>
        </PortalCard>
        <PortalCard className="!p-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Sections</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{stats.sections}</p>
        </PortalCard>
        <PortalCard className="!p-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">ATKT Students</p>
          <p className="text-2xl font-bold text-[#bfa15f] mt-1">{stats.atkt}</p>
        </PortalCard>
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or enrollment..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545] bg-white"
            />
          </div>
          <select
            value={String(semFilter)}
            onChange={(e) => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]"
          >
            <option value="all">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
          </select>
          <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded text-sm bg-white cursor-pointer">
            <input
              type="checkbox"
              checked={atktOnly}
              onChange={(e) => setAtktOnly(e.target.checked)}
              className="accent-[#0b2545]"
            />
            <span className="text-slate-700">ATKT only</span>
          </label>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Enrollment', 'Name', 'Semester', 'Section', 'Email', 'Status']}
          rows={visible}
          empty="No students match the filters."
          renderRow={(s) => (
            <tr key={s.enrollment_no} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-2.5 text-xs font-mono font-bold text-[#0b2545]">{s.enrollment_no}</td>
              <td className="px-4 py-2.5 text-sm font-medium text-slate-800">{s.student_name}</td>
              <td className="px-4 py-2.5 text-sm text-slate-600">Sem {s.semester}</td>
              <td className="px-4 py-2.5 text-sm text-slate-600">Section {s.section ?? '—'}</td>
              <td className="px-4 py-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail size={11} className="text-slate-400" />
                  <span>—</span>
                </div>
              </td>
              <td className="px-4 py-2.5">
                {s.hasATKT
                  ? <Badge label="ATKT" variant="warning" />
                  : <Badge label="Regular" variant="default" />
                }
              </td>
            </tr>
          )}
        />
      </PortalCard>
    </div>
  )
}

export default HodStudents
