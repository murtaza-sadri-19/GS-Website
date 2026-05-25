import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { PageHeader, PortalCard, SessionBanner } from '../../components/layout/PortalLayout'
import {
  getSessions, getSubjects, getMarksRequests, getCorrectionRequests,
  type Session, type Subject, type MarksRequest, type CorrectionRequest,
} from '../../services/examService'
import {
  getHodNotices, type HodNotice,
} from '../../services/hodService'
import { TIMETABLE_PERIODS } from '../../services/hodService'
import apiClient from '../../api/client'
import {
  BookOpen, ClipboardList, FileEdit, CalendarDays, FileCheck2,
  Megaphone, ChevronRight, Clock, AlertTriangle, CheckCircle2,
} from 'lucide-react'

const DAY_CODES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
const TODAY = DAY_CODES[new Date().getDay()]

interface TimetableMeEntry {
  id: string | number
  day_of_week: string
  period_no: number
  subject_label?: string
  room?: string
  department_id?: string | number
  semester?: number
  section_id?: string | number
}

const FacultyDashboard: React.FC = () => {
  const { user } = useAdminStore()

  const [session,      setSession]      = useState<Session | null>(null)
  const [subjects,     setSubjects]     = useState<Subject[]>([])
  const [marksReqs,    setMarksReqs]    = useState<MarksRequest[]>([])
  const [corrections,  setCorrections]  = useState<CorrectionRequest[]>([])
  const [todaySlots,   setTodaySlots]   = useState<TimetableMeEntry[]>([])
  const [myLeaves,     setMyLeaves]     = useState<{ id: string; status: string }[]>([])
  const [notices,      setNotices]      = useState<HodNotice[]>([])

  useEffect(() => {
    const dept = user?.department_id ? String(user.department_id) : undefined

    getSessions().then(data => {
      const active = data.find(s => s.is_active) ?? data[0] ?? null
      setSession(active)
    }).catch(() => {})

    getSubjects(dept).then(setSubjects).catch(() => {})
    getMarksRequests().then(setMarksReqs).catch(() => {})
    getCorrectionRequests().then(setCorrections).catch(() => {})
    getHodNotices(dept).then(data => setNotices(data.filter(n => n.audience === 'All' || n.audience === 'Faculty').slice(0, 4))).catch(() => {})

    apiClient.get('/v1/timetables/me').then(res => {
      const rows: TimetableMeEntry[] = res.data?.data ?? []
      setTodaySlots(rows.filter(r => r.day_of_week === TODAY))
    }).catch(() => {})

    apiClient.get('/v1/leaves/me').then(res => {
      setMyLeaves(res.data?.data ?? [])
    }).catch(() => {})
  }, [user?.department_id])

  const pendingMarks   = marksReqs.filter(r => r.status === 'pending')
  const overdueMarks   = marksReqs.filter(r => r.status === 'overdue')
  const submittedMarks = marksReqs.filter(r => r.status === 'submitted')
  const pendingLeaves  = myLeaves.filter(l => l.status === 'pending')

  const stats = [
    { label: 'Allocated Subjects', value: subjects.length,           icon: BookOpen,      color: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',  link: '/dashboard/teacher/subjects',          desc: 'This session' },
    { label: 'Pending Marks',      value: pendingMarks.length,       icon: ClipboardList, color: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40', link: '/dashboard/teacher/marks-feed',        desc: 'Awaiting your entry' },
    { label: 'Overdue Marks',      value: overdueMarks.length,       icon: AlertTriangle, color: 'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30', link: '/dashboard/teacher/marks-feed',        desc: 'Past due date' },
    { label: 'Submitted Marks',    value: submittedMarks.length,     icon: CheckCircle2,  color: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30', link: '/dashboard/teacher/marks-feed',        desc: 'This session' },
    { label: 'Correction Reqs.',   value: corrections.length,        icon: FileEdit,      color: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25', link: '/dashboard/teacher/correction-request',desc: 'Raised by you' },
    { label: 'Today\'s Classes',   value: todaySlots.length,         icon: CalendarDays,  color: 'bg-[#bfa15f]/5 text-[#bfa15f] border-[#bfa15f]/25',  link: '/dashboard/teacher/timetable',         desc: TODAY },
    { label: 'Leave Applications', value: myLeaves.length,           icon: FileCheck2,    color: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',  link: '/dashboard/teacher/leave',             desc: `${pendingLeaves.length} pending` },
    { label: 'Department Notices', value: notices.length,            icon: Megaphone,     color: 'bg-slate-50 text-slate-600 border-slate-200',         link: '/dashboard/teacher/notices',           desc: 'Recent for faculty' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? 'Faculty Member'}`}
        subtitle={`Faculty · Dept. of ${user?.department ?? '—'}`}
      />

      {session && <SessionBanner session={session.label} />}

      {/* Stat cards */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">My Workload</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.map(card => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                to={card.link}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${card.color}`}>
                    <Icon size={16} />
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                <p className="text-xs font-bold text-slate-600 mt-1">{card.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Two-column: Today's schedule + Pending marks tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Today&rsquo;s Schedule &mdash; {TODAY}</h3>
            <Link to="/dashboard/teacher/timetable" className="text-xs text-[#0b2545] hover:underline font-medium">Full week &rarr;</Link>
          </div>
          {todaySlots.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No classes scheduled today. Enjoy the break.</p>
          ) : (
            <div className="space-y-2.5">
              {[...todaySlots].sort((a, b) => a.period_no - b.period_no).map(slot => (
                <div key={slot.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="shrink-0 w-12 text-center bg-white border border-[#0b2545]/15 rounded px-1 py-1.5">
                    <p className="text-[9px] text-[#0b2545] font-bold uppercase tracking-wider">P{slot.period_no + 1}</p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                      {(TIMETABLE_PERIODS[slot.period_no] ?? '').split(' - ')[0]}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">{slot.subject_label ?? '—'}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sem {slot.semester ?? '—'} · Room {slot.room ?? '—'}
                    </p>
                  </div>
                  <Clock size={13} className="text-slate-400 shrink-0 mt-1.5" />
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Pending Marks Tasks</h3>
            <Link to="/dashboard/teacher/marks-feed" className="text-xs text-[#0b2545] hover:underline font-medium">Open marks feed &rarr;</Link>
          </div>
          {pendingMarks.length + overdueMarks.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">All caught up. No pending marks entries.</p>
          ) : (
            <div className="space-y-2.5">
              {[...overdueMarks, ...pendingMarks].slice(0, 5).map(r => (
                <div key={r.id} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {r.subjectId} &middot; {r.subjectName}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Sem {r.semester} &middot; Section {r.section} &middot; {r.component} / {r.subComponent}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Due {r.dueDate}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 uppercase tracking-wide ${
                    r.status === 'overdue'
                      ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
                      : 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/30'
                  }`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </PortalCard>
      </div>

      {/* Corrections + Notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">My Correction Requests</h3>
            <Link to="/dashboard/teacher/correction-request" className="text-xs text-[#0b2545] hover:underline font-medium">Manage &rarr;</Link>
          </div>
          {corrections.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No correction requests raised.</p>
          ) : (
            <div className="space-y-2.5">
              {corrections.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{c.subjectId} &middot; {c.subjectName}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 uppercase tracking-wide ${
                      c.status === 'approved' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
                      c.status === 'pending'  ? 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40' :
                      c.status === 'rejected' ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                                'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>{c.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {c.component} / {c.subComponent} &middot; {c.affectedEnrollments.length} student{c.affectedEnrollments.length !== 1 ? 's' : ''}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{c.reason}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">Submitted {c.submittedOn}</p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Department Notices</h3>
            <Link to="/dashboard/teacher/notices" className="text-xs text-[#0b2545] hover:underline font-medium">View all &rarr;</Link>
          </div>
          {notices.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent notices.</p>
          ) : (
            <div className="space-y-2.5">
              {notices.map(n => (
                <div key={n.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/10 text-[#0b2545] border border-[#0b2545]/20 shrink-0 uppercase tracking-wide">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{n.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1.5">{n.publish_date}</p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>
      </div>
    </div>
  )
}

export default FacultyDashboard
