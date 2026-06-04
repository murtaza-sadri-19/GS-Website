import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Accessibility, LayoutDashboard, LogOut, User, ChevronDown, Bell } from 'lucide-react'
import SearchBar from '../global/Header/SearchBar'
import { useAdminStore } from '../../store/adminStore'
import type { TopBarData } from '../../services/settingsService'

const ROLE_DASHBOARD: Record<string, string> = {
  SUPER_ADMIN:       '/dashboard/central-admin/dashboard',
  CENTRAL_ADMIN:     '/dashboard/central-admin/dashboard',
  CONTENT_EDITOR:    '/dashboard/central-admin/dashboard',
  super_admin:       '/dashboard/central-admin/dashboard',
  central_admin:     '/dashboard/central-admin/dashboard',
  editor:            '/dashboard/central-admin/dashboard',
  HOD:               '/dashboard/hod/dashboard',
  hod:               '/dashboard/hod/dashboard',
  TEACHER:           '/dashboard/teacher/dashboard',
  teacher:           '/dashboard/teacher/dashboard',
  faculty:           '/dashboard/teacher/dashboard',
  EXAM_CONTROLLER:   '/dashboard/exam/dashboard',
  exam_controller:   '/dashboard/exam/dashboard',
  PLACEMENT_OFFICER: '/dashboard/placement/dashboard',
  placement_officer: '/dashboard/placement/dashboard',
}

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin', CENTRAL_ADMIN: 'Central Admin', CONTENT_EDITOR: 'Content Editor',
  super_admin: 'Super Admin', central_admin: 'Central Admin', editor: 'Editor',
  HOD: 'Head of Department', hod: 'Head of Department',
  TEACHER: 'Faculty', teacher: 'Faculty', faculty: 'Faculty',
  EXAM_CONTROLLER: 'Exam Controller', exam_controller: 'Exam Controller',
  PLACEMENT_OFFICER: 'Placement Officer', placement_officer: 'Placement Officer',
  student: 'Student',
}

interface TopBarProps {
  topBar: TopBarData
  quickLinks: { label: string; to: string }[]
  loginLabel: string
}

const TopBar: React.FC<TopBarProps> = ({ topBar, quickLinks, loginLabel }) => {
  const navigate = useNavigate()
  const token     = useAdminStore((s) => s.token)
  const user      = useAdminStore((s) => s.user)
  const clearAuth = useAdminStore((s) => s.clearAuth)
  const isAuthenticated = !!token

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const dashboardPath = (user?.role && ROLE_DASHBOARD[user.role]) ?? '/dashboard/central-admin/dashboard'
  const dashboardBase = dashboardPath.substring(0, dashboardPath.lastIndexOf('/'))
  const roleLabel     = (user?.role && ROLE_LABEL[user.role]) ?? 'Staff'
  const userInitials  = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U'

  const handleLogout = () => {
    clearAuth()
    setDropdownOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="bg-primary text-white/80 text-xs md:text-sm py-2 border-b border-white/10 w-full relative z-[80] font-sans font-medium">
      <div className="w-full px-4 lg:px-12 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between sm:items-center">
        {/* Left: quick links + helpline */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:gap-x-6">
          {quickLinks.map((ql) => (
            <Link key={ql.to} to={ql.to} className="hover:text-white transition-colors">
              {ql.label}
            </Link>
          ))}
          {topBar.helpline && (
            <span className="hidden lg:inline text-white/50">| Helpline: {topBar.helpline}</span>
          )}
        </div>

        {/* Right: search + accessibility + auth */}
        <div className="flex items-center justify-between gap-2 sm:justify-end sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <SearchBar dark />
            <button className="flex items-center hover:text-white transition-colors">
              <Accessibility size={14} className="sm:mr-1 text-white/50" />
              <span className="hidden sm:inline">A- / A / A+</span>
            </button>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-1.5">
              {/* Dashboard shortcut */}
              <Link
                to={dashboardPath}
                className="flex items-center gap-1.5 bg-transparent hover:bg-white/10 border border-accent text-accent px-3 py-1.5 rounded-full font-semibold text-xs transition-all shrink-0"
              >
                <LayoutDashboard size={13} />
                <span>Dashboard</span>
              </Link>

              {/* Notification bell */}
              <button
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={14} />
              </button>

              {/* Avatar + dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-1 hover:bg-white/10 px-1.5 py-1 rounded-full transition-colors"
                  aria-label="Account menu"
                  aria-expanded={dropdownOpen}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover border border-accent/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center select-none">
                      {userInitials}
                    </div>
                  )}
                  <ChevronDown
                    size={12}
                    className={`text-white/60 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-[90]">
                    {/* Identity */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 select-none">
                            {userInitials}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{user?.name ?? 'User'}</p>
                          <p className="text-xs text-slate-500 truncate">{roleLabel}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to={dashboardPath}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>
                      <Link
                        to={`${dashboardBase}/profile`}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Profile
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 bg-transparent hover:bg-white/10 border border-accent text-accent px-3 py-1.5 rounded-full font-semibold text-xs transition-all shrink-0"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              <span>{loginLabel}</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar
