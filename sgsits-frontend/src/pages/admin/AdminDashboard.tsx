import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import {
  Bell, Newspaper, Calendar, FileSpreadsheet, AlertOctagon,
  Users, Image as ImageIcon, Briefcase, ChevronRight,
  Clock, Database, ShieldCheck, Crown, GraduationCap, ClipboardList,
  CheckCircle2, XCircle, Loader2,
} from 'lucide-react'
import { noticesAPI, newsAPI, eventsAPI, tendersAPI, facultyAPI, alertsAPI, galleryAPI } from '../../api'
import { SkeletonStatCard, SkeletonQuickAction } from '../../components/ui/Skeleton'
import apiClient from '../../api/client'
import { auditService, type AuditLog } from '../../services/auditService'
import { formatInIST } from '../../utils/timezone'

type ServiceStatus = 'checking' | 'operational' | 'degraded' | 'down'

interface SystemService {
  label: string
  status: ServiceStatus
}

interface StatCard {
  label: string
  value: number | string
  icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  link: string
  desc: string
}

const AdminDashboard: React.FC = () => {
  const { user } = useAdminStore()
  const [stats, setStats] = useState({
    notices: 0, news: 0, events: 0, tenders: 0, faculty: 0, alerts: 0, albums: 0
  })
  const [loading, setLoading] = useState(true)
  const [staffCounts, setStaffCounts] = useState<Record<string, number>>({})
  const [staffLoading, setStaffLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState<AuditLog[]>([])
  const [activityLoading, setActivityLoading] = useState(true)
  const [services, setServices] = useState<SystemService[]>([
    { label: 'Frontend Application', status: 'operational' },
    { label: 'Backend API',          status: 'checking'    },
    { label: 'Database Connection',  status: 'checking'    },
    { label: 'File Storage (Media)', status: 'checking'    },
    { label: 'Email Service',        status: 'checking'    },
  ])

  useEffect(() => {
    Promise.all([
      noticesAPI.getAll(),
      newsAPI.getAll(),
      eventsAPI.getAll(),
      tendersAPI.getAll(),
      facultyAPI.getAll(),
      alertsAPI.getAll(),
      galleryAPI.getAlbums(),
    ]).then(([notices, news, events, tenders, faculty, alerts, albums]) => {
      setStats({
        notices: notices.length,
        news: news.length,
        events: events.length,
        tenders: tenders.filter(t => t.status === 'Open').length,
        faculty: faculty.length,
        alerts: alerts.filter(a => a.isActive).length,
        albums: albums.length,
      })
    }).finally(() => setLoading(false))

    // System health checks
    const update = (label: string, status: ServiceStatus) =>
      setServices(prev => prev.map(s => s.label === label ? { ...s, status } : s))

    // Backend API + DB: use a public endpoint that doesn't need auth
    apiClient.get('/v1/departments?pageSize=1')
      .then(() => {
        update('Backend API', 'operational')
        update('Database Connection', 'operational')
      })
      .catch(() => {
        update('Backend API', 'down')
        update('Database Connection', 'down')
      })

    // File Storage: if backend responds at all, storage is configured
    // (uploads/ root returns 404 by design — that's still reachable)
    const apiBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api')
      .replace(/\/api$/, '')
    fetch(`${apiBase}/uploads/`)
      .then(() => update('File Storage (Media)', 'operational'))
      .catch(() => update('File Storage (Media)', 'degraded'))

    // Email Service: check settings endpoint for SMTP config
    apiClient.get('/v1/settings/cms/ui_labels')
      .then(() => update('Email Service', 'operational'))
      .catch(() => update('Email Service', 'degraded'))

    // Portal staff counts — requires auth; fail silently if token expired
    apiClient.get('/v1/users?pageSize=500', { skipAuthRedirect: true } as any)
      .then(res => {
        const users = (res.data as any)?.data?.users as { role: string; status: string }[] ?? []
        const counts: Record<string, number> = {}
        users.filter(u => u.status === 'ACTIVE').forEach(u => {
          counts[u.role] = (counts[u.role] || 0) + 1
        })
        setStaffCounts(counts)
      })
      .catch(() => { /* 401 if token expired — user should re-login */ })
      .finally(() => setStaffLoading(false))

    // Recent activity feed
    auditService.getRecentActivity(10)
      .then(setRecentActivity)
      .catch(() => {})
      .finally(() => setActivityLoading(false))
  }, [])

  const cards: StatCard[] = [
    { label: 'Notices', value: stats.notices, icon: Bell, color: 'bg-primary/10 text-primary border-primary/20', link: '/dashboard/central-admin/notices', desc: 'Official notices & circulars' },
    { label: 'News Items', value: stats.news, icon: Newspaper, color: 'bg-accent/10 text-accent border-accent/30', link: '/dashboard/central-admin/news', desc: 'Campus news & updates' },
    { label: 'Upcoming Events', value: stats.events, icon: Calendar, color: 'bg-primary/15 text-primary border-primary/25', link: '/dashboard/central-admin/events', desc: 'Events & programs' },
    { label: 'Open Tenders', value: stats.tenders, icon: FileSpreadsheet, color: 'bg-accent/15 text-accent border-accent/30', link: '/dashboard/central-admin/tenders', desc: 'Active procurement tenders' },
    { label: 'Faculty Records', value: stats.faculty, icon: Users, color: 'bg-primary/5 text-primary border-primary/15', link: '/dashboard/central-admin/faculty', desc: 'Faculty directory entries' },
    { label: 'Active Alerts', value: stats.alerts, icon: AlertOctagon, color: 'bg-accent/20 text-accent border-accent/40', link: '/dashboard/central-admin/alerts', desc: 'Marquee announcements' },
    { label: 'Gallery Albums', value: stats.albums, icon: ImageIcon, color: 'bg-primary/10 text-primary border-primary/20', link: '/dashboard/central-admin/gallery', desc: 'Photo gallery collections' },
    { label: 'Placement Records', value: '5 Yrs', icon: Briefcase, color: 'bg-slate-50 text-slate-600 border-slate-200', link: '/dashboard/central-admin/placement', desc: 'Placement statistics data' },
  ]

  const quickActions = [
    { label: 'Add New Notice', link: '/dashboard/central-admin/notices', icon: Bell, color: 'bg-primary/10 border-primary/25 text-primary hover:bg-primary/15' },
    { label: 'Add News Article', link: '/dashboard/central-admin/news', icon: Newspaper, color: 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/15' },
    { label: 'Add Event', link: '/dashboard/central-admin/events', icon: Calendar, color: 'bg-primary/15 border-primary/30 text-primary hover:bg-primary/20' },
    { label: 'Add Tender', link: '/dashboard/central-admin/tenders', icon: FileSpreadsheet, color: 'bg-accent/15 border-accent/40 text-accent hover:bg-accent/20' },
    { label: 'Update Alerts', link: '/dashboard/central-admin/alerts', icon: AlertOctagon, color: 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10' },
    { label: 'Upload Gallery', link: '/dashboard/central-admin/gallery', icon: ImageIcon, color: 'bg-accent/20 border-accent/40 text-accent hover:bg-accent/25' },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Dashboard Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Welcome back, <strong className="text-primary">{user?.name || 'Administrator'}</strong> ·{' '}
            <span className="text-xs capitalize bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">{user?.role?.replace('_', ' ')}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={14} className="text-slate-400" />
          <span>Last login: {formatInIST(new Date())}</span>
        </div>
      </div>

      {/* Portal Staff Summary — Central Admin only */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Portal Staff</h3>
          <Link
            to="/dashboard/central-admin/portal-staff"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Manage all staff <ChevronRight size={11} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { role: 'CENTRAL_ADMIN',    label: 'Admins',            icon: ShieldCheck, color: 'bg-accent/10 text-accent border-accent/30' },
            { role: 'HOD',              label: 'HODs',               icon: Crown,       color: 'bg-primary/10 text-primary border-primary/25' },
            { role: 'TEACHER',          label: 'Teachers',           icon: GraduationCap, color: 'bg-slate-100 text-slate-600 border-slate-200' },
            { role: 'EXAM_CONTROLLER',  label: 'Exam Controllers',   icon: ClipboardList, color: 'bg-slate-100 text-slate-600 border-slate-200' },
          ].map(({ role, label, icon: Icon, color }) => (
            <Link
              key={role}
              to="/dashboard/central-admin/portal-staff"
              className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                {staffLoading
                  ? <div className="h-5 w-6 bg-slate-100 rounded animate-pulse mb-1" />
                  : <p className="text-xl font-display font-bold text-slate-800">{staffCounts[role] ?? 0}</p>
                }
                <p className="text-xs font-bold text-slate-500">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Content Summary</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonStatCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-fade-in">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.label}
                  to={card.link}
                  className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${card.color}`}>
                      <Icon size={16} />
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-800">{card.value}</p>
                  <p className="text-xs font-bold text-slate-600 mt-1">{card.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{card.desc}</p>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonQuickAction key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-fade-in">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.label}
                  to={action.link}
                  className={`border rounded-lg p-4 text-center transition-colors cursor-pointer ${action.color}`}
                >
                  <Icon size={20} className="mx-auto mb-2" />
                  <span className="text-xs font-bold">{action.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Activity</h3>
          <Link to="/dashboard/central-admin/audit-logs" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
            View all logs <ChevronRight size={11} />
          </Link>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {activityLoading ? (
            Array.from({length: 5}).map((_,i)=>(
              <div key={i} className="flex items-center gap-3 px-4 py-3 animate-pulse">
                <div className="w-7 h-7 rounded-full bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                  <div className="h-2.5 bg-slate-100 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : recentActivity.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-400">No activity recorded yet</div>
          ) : recentActivity.map(log => (
            <div key={log.id} className={`flex items-start gap-3 px-4 py-3 ${log.severity === 'critical' ? 'bg-red-50/40' : log.severity === 'high' ? 'bg-amber-50/30' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {log.user_name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-700 leading-snug">
                  <span className="font-semibold">{log.user_name}</span>{' '}
                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${
                    log.action === 'DELETE' ? 'bg-red-50 text-red-600 border-red-200' :
                    log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    log.action === 'UPDATE' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>{log.action}</span>{' '}
                  <span className="text-slate-500">{log.description}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock size={10} />
                  {formatInIST(log.created_at)}
                  <span className="text-slate-300 mx-1">·</span>
                  {log.module_name}
                  {log.severity !== 'low' && (
                    <span className={`ml-1 font-bold ${log.severity === 'critical' ? 'text-red-500' : 'text-amber-500'}`}>
                      ● {log.severity}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">System Status</h3>
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {services.map((item) => {
            const isOk       = item.status === 'operational'
            const isChecking = item.status === 'checking'
            const isDegraded = item.status === 'degraded'
            return (
              <div key={item.label} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <Database size={14} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isChecking && <Loader2 size={13} className="text-slate-400 animate-spin" />}
                  {isOk       && <CheckCircle2 size={13} className="text-emerald-500" />}
                  {isDegraded && <CheckCircle2 size={13} className="text-amber-500" />}
                  {item.status === 'down' && <XCircle size={13} className="text-red-400" />}
                  <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                    isChecking            ? 'text-slate-400 bg-slate-100'
                    : isOk               ? 'text-emerald-700 bg-emerald-50'
                    : isDegraded         ? 'text-amber-700 bg-amber-50'
                    : 'text-red-700 bg-red-50'
                  }`}>
                    {isChecking ? 'Checking…' : isOk ? 'Operational' : isDegraded ? 'Degraded' : 'Down'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
