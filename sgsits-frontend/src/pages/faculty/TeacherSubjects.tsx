import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { getSubjects, getStudents, getMarksRequests, type Subject, type Student, type MarksRequest } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { BookOpen, Users, ClipboardList, Search, ChevronRight, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

const TeacherSubjects: React.FC = () => {
  const { user } = useAdminStore()
  const teacherId = String(user?.id ?? user?.employeeId ?? '')

  const [allSubjects, setAllSubjects] = useState<Subject[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([])
  const [allMarksRequests, setAllMarksRequests] = useState<MarksRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSubjects(), getStudents(), getMarksRequests()]).then(([subs, studs, mrs]) => {
      setAllSubjects(subs)
      setAllStudents(studs)
      setAllMarksRequests(mrs)
      setLoading(false)
    })
  }, [])

  const [search, setSearch] = useState('')
  const [semFilter, setSemFilter] = useState<'all' | number>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'Theory' | 'Practical' | 'Elective'>('all')

  const mine = useMemo(() => allSubjects.filter(s => s.facultyId === teacherId), [allSubjects, teacherId])

  const visible = useMemo(() => mine.filter(s => {
    if (semFilter !== 'all' && s.semester !== semFilter) return false
    if (typeFilter !== 'all' && s.type !== typeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      if (!s.id.toLowerCase().includes(q) && !s.name.toLowerCase().includes(q)) return false
    }
    return true
  }), [mine, semFilter, typeFilter, search])

  const studentCount = (branch: string, semester: number) =>
    allStudents.filter(s => s.branch_id === branch && s.semester === semester).length

  const marksStatus = (subjectId: string) => {
    const reqs = allMarksRequests.filter(r => r.subjectId === subjectId && r.facultyId === teacherId)
    return {
      total: reqs.length,
      submitted: reqs.filter(r => r.status === 'submitted').length,
      pending: reqs.filter(r => r.status === 'pending').length,
      overdue: reqs.filter(r => r.status === 'overdue').length,
    }
  }

  const stats = {
    total: mine.length,
    theory: mine.filter(s => s.type === 'Theory').length,
    practical: mine.filter(s => s.type === 'Practical').length,
    elective: mine.filter(s => s.type === 'Elective').length,
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="My Subjects"
        subtitle="Subjects allocated to you by the HOD for the active session"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} accent="text-primary" />
        <Stat label="Theory" value={stats.theory} accent="text-accent" />
        <Stat label="Practical" value={stats.practical} accent="text-primary" />
        <Stat label="Elective" value={stats.elective} accent="text-accent" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by code or name..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary" />
          </div>
          <select value={String(semFilter)} onChange={(e) => setSemFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary">
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary">
            <option value="all">All Types</option>
            <option value="Theory">Theory</option>
            <option value="Practical">Practical</option>
            <option value="Elective">Elective</option>
          </select>
        </div>
      </PortalCard>

      {visible.length === 0
        ? <PortalCard><p className="text-center text-sm text-slate-400 py-12">No subjects match the filters.</p></PortalCard>
        : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visible.map(s => {
              const ms = marksStatus(s.id)
              const cos: { co_name: string; max_marks: number }[] = []
              return (
                <PortalCard key={s.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <BookOpen size={18} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-primary">{s.id}</p>
                        <h4 className="text-sm font-bold text-slate-800 truncate">{s.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{s.branch_id} · Sem {s.semester} · {s.credits} credits</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/5 text-primary border border-primary/15 uppercase tracking-wide shrink-0">{s.type}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Mini icon={Users} label="Students">{studentCount(s.branch_id, s.semester)}</Mini>
                    <Mini icon={ClipboardList} label="Components">{ms.total}</Mini>
                    <Mini icon={BookOpen} label="COs">{cos.length}</Mini>
                  </div>

                  {ms.total > 0 && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                      <Pill icon={CheckCircle2} value={ms.submitted} label="Submitted" cls="bg-accent/10 text-accent border-accent/30" />
                      <Pill icon={Clock} value={ms.pending} label="Pending" cls="bg-accent/15 text-accent border-accent/40" />
                      <Pill icon={AlertTriangle} value={ms.overdue} label="Overdue" cls="bg-primary/10 text-primary border-primary/25" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <Link to="/dashboard/teacher/marks-feed" className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90">
                      Enter Marks <ChevronRight size={11} />
                    </Link>
                    <Link to="/dashboard/teacher/correction-request" className="px-3 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50">
                      Raise Correction
                    </Link>
                  </div>
                </PortalCard>
              )
            })}
          </div>
        )
      }
    </div>
  )
}

const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const Mini: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; label: string; children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2">
    <p className="flex items-center gap-1 text-xs font-bold text-slate-500 uppercase tracking-wider"><Icon size={10} className="text-accent" />{label}</p>
    <p className="text-sm font-bold text-slate-800 mt-0.5">{children}</p>
  </div>
)
const Pill: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; value: number; label: string; cls: string }> = ({ icon: Icon, value, label, cls }) => (
  <span className={`text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide inline-flex items-center gap-1 ${cls}`}>
    <Icon size={10} /> {value} {label}
  </span>
)

export default TeacherSubjects
