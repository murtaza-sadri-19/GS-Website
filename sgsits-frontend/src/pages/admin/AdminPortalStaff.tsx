import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Users, GraduationCap, ClipboardList, Briefcase,
  UserMinus, UserCheck, Loader2, AlertTriangle, RefreshCw,
  Mail, Building, Crown, ChevronDown, ChevronRight, Star, FileEdit,
} from 'lucide-react'
import apiClient from '../../api/client'

// ── Types ─────────────────────────────────────────────────────────────────────

interface StaffUser {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  department_id: number | null
  status: 'ACTIVE' | 'INACTIVE'
  created_at: string
}

interface Department {
  id: number
  name: string
}

// ── Role config ───────────────────────────────────────────────────────────────

interface RoleCfg {
  label: string
  plural: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  border: string
  badge: string
  bg: string
  iconBg: string
}

const ROLE_CFG: Record<string, RoleCfg> = {
  SUPER_ADMIN: {
    label: 'Super Administrator',
    plural: 'Super Administrators',
    icon: Star,
    border: 'border-purple-300/60',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    bg: 'bg-purple-50/50',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  CENTRAL_ADMIN: {
    label: 'Central Administrator',
    plural: 'Central Administrators',
    icon: ShieldCheck,
    border: 'border-[#bfa15f]/40',
    badge: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
    bg: 'bg-[#bfa15f]/5',
    iconBg: 'bg-[#bfa15f]/10 text-[#bfa15f]',
  },
  CONTENT_EDITOR: {
    label: 'Content Editor',
    plural: 'Content Editors',
    icon: FileEdit,
    border: 'border-sky-200',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    bg: 'bg-sky-50/50',
    iconBg: 'bg-sky-100 text-sky-600',
  },
  HOD: {
    label: 'Head of Department',
    plural: 'Heads of Department (HODs)',
    icon: Crown,
    border: 'border-[#0b2545]/30',
    badge: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25',
    bg: 'bg-[#0b2545]/5',
    iconBg: 'bg-[#0b2545]/10 text-[#0b2545]',
  },
  TEACHER: {
    label: 'Teacher',
    plural: 'Teachers',
    icon: GraduationCap,
    border: 'border-slate-200',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    bg: 'bg-slate-50/50',
    iconBg: 'bg-slate-100 text-slate-600',
  },
  EXAM_CONTROLLER: {
    label: 'Exam Controller',
    plural: 'Exam Controllers',
    icon: ClipboardList,
    border: 'border-slate-200',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    bg: 'bg-slate-50/50',
    iconBg: 'bg-slate-100 text-slate-600',
  },
  PLACEMENT_OFFICER: {
    label: 'Placement Officer',
    plural: 'Placement Officers',
    icon: Briefcase,
    border: 'border-slate-200',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    bg: 'bg-slate-50/50',
    iconBg: 'bg-slate-100 text-slate-600',
  },
}

// Preferred display order — known roles first, then any unknown roles appended
const ROLE_PRIORITY = ['SUPER_ADMIN', 'CENTRAL_ADMIN', 'CONTENT_EDITOR', 'HOD', 'TEACHER', 'EXAM_CONTROLLER', 'PLACEMENT_OFFICER']

// Fallback config for roles not in ROLE_CFG (future-proofing)
function getRoleCfg(role: string): RoleCfg {
  return ROLE_CFG[role] ?? {
    label: role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    plural: role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + 's',
    icon: Users,
    border: 'border-slate-200',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
    bg: 'bg-slate-50/50',
    iconBg: 'bg-slate-100 text-slate-600',
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

const AdminPortalStaff: React.FC = () => {
  const [users, setUsers] = useState<StaffUser[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')
  const [terminating, setTerminating] = useState<number | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ SUPER_ADMIN: true, CENTRAL_ADMIN: true, HOD: true })

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const [usersRes, deptsRes] = await Promise.all([
        apiClient.get('/v1/users?pageSize=500'),
        apiClient.get('/v1/departments?pageSize=100'),
      ])
      const usersData = (usersRes.data as Record<string, unknown>).data as Record<string, unknown>
      const deptsData = (deptsRes.data as Record<string, unknown>).data as Record<string, unknown>
      setUsers((usersData.users ?? []) as StaffUser[])
      setDepartments((deptsData.departments ?? []) as Department[])
    } catch {
      setApiError('Failed to load staff. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const deptName = (id: number | null) =>
    id ? (departments.find(d => d.id === id)?.name ?? `Dept #${id}`) : null

  const handleTerminate = async (u: StaffUser) => {
    const action = u.status === 'ACTIVE' ? 'Terminate' : 'Reactivate'
    const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    if (!window.confirm(
      u.status === 'ACTIVE'
        ? `Terminate ${u.name}? They will immediately lose portal access.`
        : `Reactivate ${u.name}? They will regain portal access.`
    )) return

    setTerminating(u.id)
    try {
      await apiClient.patch(`/v1/users/${u.id}/status`, { status: newStatus })
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: newStatus } : x))
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      alert(msg ?? `Failed to ${action.toLowerCase()} user.`)
    } finally {
      setTerminating(null)
    }
  }

  const toggleGroup = (role: string) =>
    setExpanded(prev => ({ ...prev, [role]: !prev[role] }))

  // Derive role order dynamically from actual user data so unknown roles still show
  const roleOrder = [
    ...ROLE_PRIORITY.filter(r => users.some(u => u.role === r)),
    ...Array.from(new Set(users.map(u => u.role))).filter(r => !ROLE_PRIORITY.includes(r)).sort(),
  ]

  // Group by role
  const grouped = roleOrder.reduce<Record<string, StaffUser[]>>((acc, role) => {
    acc[role] = users.filter(u => u.role === role)
    return acc
  }, {})

  const activeAdmins = grouped['CENTRAL_ADMIN']?.filter(u => u.status === 'ACTIVE').length ?? 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] gap-3 text-slate-500">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading portal staff…</span>
      </div>
    )
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <AlertTriangle size={24} className="text-amber-500" />
        <p className="text-sm text-slate-600">{apiError}</p>
        <button onClick={fetchAll} className="px-4 py-2 bg-[#0b2545] text-white text-sm font-semibold rounded">Retry</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Portal Staff</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            All portal accounts grouped by role — only visible to Central Administrators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors"
          >
            <RefreshCw size={12} /> Refresh
          </button>
          <Link
            to="/dashboard/central-admin/users"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#0b2545] text-white rounded hover:bg-[#0b2545]/90 transition-colors"
          >
            <Users size={12} /> Full User Manager
          </Link>
        </div>
      </div>

      {/* Role summary cards — dynamic, one per role found in data */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {roleOrder.map(role => {
          const cfg = getRoleCfg(role)
          const Icon = cfg.icon
          const total = grouped[role]?.length ?? 0
          const active = grouped[role]?.filter(u => u.status === 'ACTIVE').length ?? 0
          return (
            <button
              key={role}
              onClick={() => {
                toggleGroup(role)
                setTimeout(() => document.getElementById(`group-${role}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
              }}
              className={`bg-white border ${cfg.border} rounded-lg p-4 text-left shadow-sm hover:shadow-md transition-all group`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${cfg.iconBg}`}>
                <Icon size={15} />
              </div>
              <p className="text-xl font-display font-bold text-slate-800">{active}<span className="text-sm text-slate-400 font-normal">/{total}</span></p>
              <p className="text-[11px] font-bold text-slate-600 mt-0.5">{cfg.plural}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Active / Total</p>
            </button>
          )
        })}
      </div>

      {/* Role groups */}
      <div className="space-y-4">
        {roleOrder.map(role => {
          const cfg = getRoleCfg(role)
          const Icon = cfg.icon
          const list = grouped[role] ?? []
          const isOpen = !!expanded[role]
          if (list.length === 0) return null

          return (
            <div key={role} id={`group-${role}`} className={`bg-white border ${cfg.border} rounded-lg overflow-hidden shadow-sm`}>
              {/* Group header */}
              <button
                onClick={() => toggleGroup(role)}
                className={`w-full flex items-center justify-between px-5 py-3.5 ${cfg.bg} border-b ${isOpen ? cfg.border : 'border-transparent'} transition-colors`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={cfg.iconBg.split(' ')[1]} />
                  <span className="text-sm font-bold text-slate-800">{cfg.plural}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badge}`}>
                    {list.filter(u => u.status === 'ACTIVE').length} active
                  </span>
                  {list.filter(u => u.status === 'INACTIVE').length > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-400 border-slate-200">
                      {list.filter(u => u.status === 'INACTIVE').length} inactive
                    </span>
                  )}
                </div>
                {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
              </button>

              {/* User rows */}
              {isOpen && (
                <div className="divide-y divide-slate-50">
                  {list.map(u => {
                    const dept = deptName(u.department_id)
                    const isActive = u.status === 'ACTIVE'
                    const isSelf = false // could wire useAdminStore here
                    const isLastAdmin = role === 'CENTRAL_ADMIN' && isActive && activeAdmins <= 1

                    return (
                      <div
                        key={u.id}
                        className={`flex items-center justify-between px-5 py-3 gap-4 hover:bg-slate-50/60 transition-colors ${!isActive ? 'opacity-60' : ''}`}
                      >
                        {/* Info */}
                        <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-1 items-center">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                              {!isActive && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-50 text-red-500 border border-red-200 rounded uppercase tracking-wide">
                                  Terminated
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                              <span className="flex items-center gap-1"><Mail size={10} />{u.email}</span>
                              {dept && <span className="flex items-center gap-1"><Building size={10} />{dept}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {isActive ? (
                            <button
                              onClick={() => handleTerminate(u)}
                              disabled={!!terminating || isLastAdmin}
                              title={isLastAdmin ? 'Cannot terminate the last active admin' : 'Terminate portal access'}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:bg-red-50 border border-red-200 px-2.5 py-1.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              {terminating === u.id
                                ? <Loader2 size={11} className="animate-spin" />
                                : <UserMinus size={11} />
                              }
                              Terminate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleTerminate(u)}
                              disabled={!!terminating}
                              title="Restore portal access"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 hover:bg-green-50 border border-green-200 px-2.5 py-1.5 rounded transition-colors disabled:opacity-40"
                            >
                              {terminating === u.id
                                ? <Loader2 size={11} className="animate-spin" />
                                : <UserCheck size={11} />
                              }
                              Reactivate
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AdminPortalStaff
