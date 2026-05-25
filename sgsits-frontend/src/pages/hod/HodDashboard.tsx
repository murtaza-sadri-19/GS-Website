import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { PageHeader, PortalCard, SessionBanner } from '../../components/layout/PortalLayout'
import {
  BookOpen, Users, GraduationCap, ClipboardList, FileEdit, UserPlus,
  FileCheck2, Megaphone, ChevronRight,
} from 'lucide-react'

// Services
import {
  getSessions,
  getBranches,
  getSubjects,
  getFacultyMembers,
  getStudents,
  getMarksRequests,
  getCorrectionRequests,
  getRegistrationRequests,
  type Session, type Branch, type Subject,
  type FacultyMember, type Student, type MarksRequest,
  type CorrectionRequest, type RegistrationRequest,
} from '../../services/examService'
import { getLeaveApplications, getHodNotices, type LeaveApplication, type HodNotice } from '../../services/hodService'

const HodDashboard: React.FC = () => {
  const { user } = useAdminStore()

  // ── State ──────────────────────────────────────────────────────────────
  const [sessions,        setSessions]        = useState<Session[]>([])
  const [branches,        setBranches]        = useState<Branch[]>([])
  const [subjects,        setSubjects]        = useState<Subject[]>([])
  const [faculty,         setFaculty]         = useState<FacultyMember[]>([])
  const [students,        setStudents]        = useState<Student[]>([])
  const [marksRequests,   setMarksRequests]   = useState<MarksRequest[]>([])
  const [corrections,     setCorrections]     = useState<CorrectionRequest[]>([])
  const [registrations,   setRegistrations]   = useState<RegistrationRequest[]>([])
  const [leaves,          setLeaves]          = useState<LeaveApplication[]>([])
  const [notices,         setNotices]         = useState<HodNotice[]>([])
  const [loading,         setLoading]         = useState(true)

  // department_id from the JWT user — used as filter for all dept-scoped calls
  const deptId = user?.department_id ? String(user.department_id) : undefined

  // ── Load data ─────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true

    const load = async () => {
      setLoading(true)
      try {
        const [
          sess, brs, subs, fac, studs,
          markReqs, corrReqs, regReqs,
          lvs, notcs,
        ] = await Promise.all([
          getSessions(),
          getBranches(),
          getSubjects(deptId),
          getFacultyMembers(deptId),
          getStudents(deptId),
          getMarksRequests(deptId),
          getCorrectionRequests(),
          getRegistrationRequests(deptId),
          getLeaveApplications(),
          getHodNotices(user?.department_id),
        ])
        if (!alive) return
        setSessions(sess)
        setBranches(brs)
        setSubjects(subs)
        setFaculty(fac)
        setStudents(studs)
        setMarksRequests(markReqs)
        setCorrections(corrReqs)
        setRegistrations(regReqs)
        setLeaves(lvs)
        setNotices(notcs)
      } catch (err) {
        console.error('[HodDashboard] load error', err)
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => { alive = false }
  }, [deptId, user?.department_id])

  // ── Derived stats ──────────────────────────────────────────────────────
  const currentSession = sessions.find(s => s.is_active)
  const branch = deptId
    ? branches.find(b => b.branch_id === deptId || b.id === deptId)
    : undefined

  const pendingMarks   = marksRequests.filter(r => r.status !== 'submitted')
  const pendingCorrect = corrections.filter(c => c.status === 'pending')
  const pendingReg     = registrations.filter(r => r.status === 'pending')
  const pendingLeaves  = leaves.filter(l => l.status === 'pending')
  const pinnedNotices  = notices.filter(n => n.pinned)

  const stats = [
    { label: 'Subjects',           value: subjects.length,       icon: BookOpen,         color: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',  link: '/dashboard/hod/subjects',     desc: 'All semester subjects' },
    { label: 'Faculty Members',    value: faculty.length,        icon: Users,            color: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30', link: '/dashboard/hod/teachers',     desc: 'Active department faculty' },
    { label: 'Students',           value: students.length,       icon: GraduationCap,    color: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25', link: '/dashboard/hod/students',     desc: 'Enrolled in department' },
    { label: 'Pending Marks',      value: pendingMarks.length,   icon: ClipboardList,    color: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40', link: '/dashboard/hod/marks',        desc: 'Awaiting faculty entry' },
    { label: 'Correction Requests',value: pendingCorrect.length, icon: FileEdit,         color: 'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30', link: '/dashboard/hod/corrections',  desc: 'Faculty mark corrections' },
    { label: 'Registration Reqs.', value: pendingReg.length,     icon: UserPlus,         color: 'bg-[#bfa15f]/5 text-[#bfa15f] border-[#bfa15f]/25',  link: '/dashboard/hod/registration', desc: 'New faculty onboarding' },
    { label: 'Leave Applications', value: pendingLeaves.length,  icon: FileCheck2,       color: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',  link: '/dashboard/hod/leaves',       desc: 'Awaiting your approval' },
    { label: 'Pinned Notices',     value: pinnedNotices.length,  icon: Megaphone,        color: 'bg-slate-50 text-slate-600 border-slate-200',         link: '/dashboard/hod/notices',      desc: 'Currently pinned' },
  ]

  const deptLabel = branch?.branch_name ?? user?.name ?? 'Your Department'

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Department of ${deptLabel}`}
        subtitle={`Welcome back, ${user?.name ?? 'HOD'} — ${user?.role?.replace(/_/g, ' ') ?? 'HOD'}`}
      />

      {currentSession && <SessionBanner session={currentSession.label} />}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400 text-sm">
          Loading department data…
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div>
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Department Overview</h3>
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
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-550 transition-colors" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                    <p className="text-xs font-bold text-slate-600 mt-1">{card.label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Two-column: Pending Leaves + Exam Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PortalCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700">Pending Leave Approvals</h3>
                <Link to="/dashboard/hod/leaves" className="text-xs text-[#0b2545] hover:underline font-medium">View all →</Link>
              </div>
              {pendingLeaves.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No pending leave applications.</p>
              ) : (
                <div className="space-y-2.5">
                  {pendingLeaves.slice(0, 4).map(lv => (
                    <div key={lv.id} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{lv.facultyName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {lv.leaveType} · {lv.days} day{lv.days > 1 ? 's' : ''} · {lv.fromDate} → {lv.toDate}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#bfa15f]/15 text-[#bfa15f] border border-[#bfa15f]/30 shrink-0 uppercase tracking-wide">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </PortalCard>

            <PortalCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-700">Exam Activity</h3>
                <Link to="/dashboard/hod/marks" className="text-xs text-[#0b2545] hover:underline font-medium">View all →</Link>
              </div>
              <div className="space-y-3">
                {[
                  {
                    label: 'Overdue Marks Entries',
                    desc: 'Marks not submitted past due date.',
                    value: pendingMarks.filter(r => r.status === 'overdue').length,
                    color: 'text-[#0b2545]',
                  },
                  {
                    label: 'Pending Marks Entries',
                    desc: 'Awaiting faculty entry.',
                    value: pendingMarks.filter(r => r.status === 'pending').length,
                    color: 'text-[#bfa15f]',
                  },
                  {
                    label: 'Correction Requests',
                    desc: 'Faculty mark-correction approvals.',
                    value: pendingCorrect.length,
                    color: 'text-[#0b2545]',
                  },
                  {
                    label: 'Faculty Registrations',
                    desc: 'New faculty awaiting your approval.',
                    value: pendingReg.length,
                    color: 'text-[#bfa15f]',
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-700">{item.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </PortalCard>
          </div>

          {/* Notices */}
          <PortalCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Pinned Department Notices</h3>
              <Link to="/dashboard/hod/notices" className="text-xs text-[#0b2545] hover:underline font-medium">Manage →</Link>
            </div>
            {pinnedNotices.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No pinned notices.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pinnedNotices.map(n => (
                  <div key={n.id} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{n.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/10 text-[#0b2545] border border-[#0b2545]/20 shrink-0 uppercase tracking-wide">
                          {n.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{n.body}</p>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-semibold uppercase tracking-wider">
                      <span>Audience: {n.audience}</span>
                      <span>Posted {n.publishedOn}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </PortalCard>
        </>
      )}
    </div>
  )
}

export default HodDashboard
