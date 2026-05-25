import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { getMarksRequests, getSubjects, type MarksRequest, type Subject } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Search, ClipboardList, CheckCircle2, Clock, AlertTriangle, Download } from 'lucide-react'

const HOD_BRANCH = 'CSE'

const HodMarks: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [marksRequests, setMarksRequests] = useState<MarksRequest[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'submitted' | 'overdue'>('all')
  const [semFilter, setSemFilter] = useState<'all' | number>('all')

  useEffect(() => {
    Promise.all([getMarksRequests(hodBranch), getSubjects(hodBranch)]).then(([mr, sub]) => {
      setMarksRequests(mr); setSubjects(sub); setLoading(false)
    })
  }, [hodBranch])

  const branchMarks = useMemo(() => marksRequests.filter(m => m.branch_id === hodBranch), [marksRequests, hodBranch])

  const visible = useMemo(() => branchMarks.filter(m => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false
    if (semFilter !== 'all' && m.semester !== semFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!m.subjectName.toLowerCase().includes(q) && !m.facultyName.toLowerCase().includes(q) && !m.subjectId.toLowerCase().includes(q)) return false
    }
    return true
  }), [branchMarks, statusFilter, semFilter, search])

  const stats = {
    submitted: branchMarks.filter(m => m.status === 'submitted').length,
    pending:   branchMarks.filter(m => m.status === 'pending').length,
    overdue:   branchMarks.filter(m => m.status === 'overdue').length,
    subjects:  subjects.filter(s => s.branch_id === hodBranch).length,
  }

  const exportCsv = () => {
    const head = 'Subject Code,Subject,Branch,Sem,Section,Component,Sub-Component,Faculty,Due Date,Status\n'
    const body = visible.map(m =>
      [m.subjectId, m.subjectName, m.branch_id, m.semester, m.section, m.component, m.subComponent, m.facultyName, m.dueDate, m.status].join(',')
    ).join('\n')
    const blob = new Blob([head + body], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `marks-summary-${HOD_BRANCH}-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Marks Approval Summary"
        subtitle="Read-only branch-wide marks submission status"
        action={
          <button onClick={exportCsv} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 transition-colors">
            <Download size={13} /> Export CSV
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Submitted" icon={CheckCircle2} value={stats.submitted} accent="text-[#bfa15f] bg-[#bfa15f]/10" />
        <Stat label="Pending"   icon={Clock}        value={stats.pending}   accent="text-[#bfa15f] bg-[#bfa15f]/15" />
        <Stat label="Overdue"   icon={AlertTriangle} value={stats.overdue}  accent="text-[#0b2545] bg-[#0b2545]/10" />
        <Stat label="Subjects"  icon={ClipboardList} value={stats.subjects} accent="text-[#0b2545] bg-[#0b2545]/10" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by subject or faculty..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
          <select value={String(semFilter)} onChange={(e) => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 border-b border-slate-200">
              {['Subject', 'Sem', 'Section', 'Component', 'Faculty', 'Due', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {visible.length === 0 ? <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-400">No marks requests match.</td></tr> :
                visible.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2.5">
                      <p className="text-xs font-mono font-bold text-[#0b2545]">{m.subjectId}</p>
                      <p className="text-[11px] text-slate-500">{m.subjectName}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">Sem {m.semester}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{m.section}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{m.component} / {m.subComponent}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600">{m.facultyName}</td>
                    <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{m.dueDate}</td>
                    <td className="px-4 py-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${
                        m.status === 'submitted' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
                        m.status === 'pending'   ? 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40' :
                                                   'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
                      }`}>{m.status}</span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </PortalCard>
    </div>
  )
}

const Stat: React.FC<{ label: string; value: number; icon: React.ComponentType<{ size?: number; className?: string }>; accent: string }> = ({ label, value, icon: Icon, accent }) => (
  <PortalCard className="!p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${accent}`}><Icon size={14} /></div>
    </div>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">{label}</p>
  </PortalCard>
)

export default HodMarks
