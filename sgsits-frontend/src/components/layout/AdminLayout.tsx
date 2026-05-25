import React, { useEffect, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import {
  LayoutDashboard,
  Users,
  Network,
  Bell,
  Download,
  Calendar,
  Image as ImageIcon,
  FileCode,
  Newspaper,
  FileSpreadsheet,
  AlertOctagon,
  UsersRound,
  Briefcase,
  Settings,
  LogOut,
  ArrowLeft,
  UserCheck,
  PanelBottom,
} from 'lucide-react'

const AdminLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearAuth } = useAdminStore()
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [location.pathname])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from the admin panel?')) {
      clearAuth()
      navigate('/login')
    }
  }

  // Sidebar mirrors the Role-wise Actions doc (Central Admin: dashboard,
  // users, departments, notices, downloads, events, gallery, pages) plus
  // the existing CMS content modules (news, tenders, alerts, faculty
  // directory, placement, settings).
  const menuItems = [
    // ── Per Role-wise Actions doc ──
    { label: 'Dashboard Overview', path: '/dashboard/central-admin/dashboard',   icon: LayoutDashboard },
    { label: 'Users',              path: '/dashboard/central-admin/users',       icon: Users },
    { label: 'Departments',        path: '/dashboard/central-admin/departments', icon: Network },
    { label: 'Global Notices',     path: '/dashboard/central-admin/notices',     icon: Bell },
    { label: 'Downloads',          path: '/dashboard/central-admin/downloads',   icon: Download },
    { label: 'Events',             path: '/dashboard/central-admin/events',      icon: Calendar },
    { label: 'Gallery',            path: '/dashboard/central-admin/gallery',     icon: ImageIcon },
    { label: 'Static Pages',       path: '/dashboard/central-admin/pages',       icon: FileCode },
    // ── Existing CMS content modules ──
    { label: 'News',               path: '/dashboard/central-admin/news',        icon: Newspaper },
    { label: 'Tenders',            path: '/dashboard/central-admin/tenders',     icon: FileSpreadsheet },
    { label: 'Urgent Alerts',      path: '/dashboard/central-admin/alerts',      icon: AlertOctagon },
    { label: 'Faculty Directory',  path: '/dashboard/central-admin/faculty',     icon: UsersRound },
    { label: 'Placement Records',  path: '/dashboard/central-admin/placement',   icon: Briefcase },
    { label: 'Footer Management',  path: '/dashboard/central-admin/footer',      icon: PanelBottom },
    { label: 'System Settings',    path: '/dashboard/central-admin/settings',    icon: Settings },
  ]

  return (
    <div className="h-screen flex bg-slate-50 transition-colors duration-300 overflow-hidden w-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 text-slate-600 flex flex-col justify-between flex-shrink-0 z-30 h-full">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Brand area */}
          <div className="p-5 border-b border-slate-150 flex items-center justify-between shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/image.png?v=2" alt="SGSITS Logo" className="w-8 h-8 object-contain bg-white rounded-full p-0.5 border border-accent/25" />
              <h1 className="font-display font-extrabold text-sm text-primary tracking-wider">
                SGSITS CMS
              </h1>
            </Link>
            <Link
              to="/"
              className="p-1 hover:bg-slate-50 hover:text-primary rounded transition-colors text-slate-400"
              title="Return to Public Site"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* User profile card */}
          <div className="p-4 mx-3 my-4 bg-slate-50 border border-slate-150 rounded-md flex items-center gap-3 shrink-0">
            <div className="p-2 rounded-md bg-white border border-slate-150 text-accent">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-800 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-550 truncate">{user?.role || 'Super Admin'}</p>
            </div>
          </div>

          {/* Navigation link list */}
          <nav className="px-3 space-y-1 flex-1 overflow-y-auto py-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 border-l-4 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-primary/5 text-primary border-accent font-bold'
                      : 'hover:bg-slate-50 hover:text-primary text-slate-650 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions area */}
        <div className="p-4 border-t border-slate-150 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-[#0b2545]/5 hover:text-[#0b2545] text-slate-700 rounded-md text-xs font-bold transition-all border border-slate-200 hover:border-[#0b2545]/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Dashboard Frame */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 transition-colors duration-300 shrink-0">
          <h2 className="font-display font-bold text-slate-800 text-base">
            System Administration Panel
          </h2>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span>Server Time: <strong className="text-slate-800">2026-05-21</strong></span>
            <div className="h-4 w-px bg-slate-200" />
            <span>Mode: <span className="bg-[#bfa15f]/10 text-[#bfa15f] font-bold px-2 py-0.5 rounded-full border border-[#bfa15f]/30">Production</span></span>
          </div>
        </header>

        {/* Core CRUD outlet grid view */}
        <main ref={mainRef} className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
