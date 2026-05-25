import React from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import {
  Megaphone, Building2, GraduationCap, Briefcase,
  ChevronRight, TrendingUp, Calendar, IndianRupee, Users,
} from 'lucide-react'

// Mock KPIs until backend is wired.
const MOCK_KPIS = {
  totalPlaced: 482,
  ongoingDrives: 6,
  scheduledVisits: 3,
  activeTrainings: 2,
  openInternships: 9,
  highestPackage: 42,
  avgPackage: 7.8,
}

const MOCK_UPCOMING_VISITS = [
  { id: 'CV001', company: 'Infosys',     role: 'System Engineer Trainee', date: '2026-06-04', pkg: 5.5, branches: ['CSE', 'IT', 'ECE'] },
  { id: 'CV002', company: 'TCS Digital', role: 'Digital Specialist',      date: '2026-06-10', pkg: 9.0, branches: ['CSE', 'IT'] },
  { id: 'CV003', company: 'Capgemini',   role: 'Software Analyst',        date: '2026-06-15', pkg: 6.5, branches: ['CSE', 'IT', 'ECE', 'EE'] },
]

const MOCK_RECENT_PLACEMENTS = [
  { name: 'Aarav Sharma',  branch: 'CSE', company: 'Microsoft IDC',     pkg: 42,  type: 'Full-time' },
  { name: 'Priya Verma',   branch: 'CSE', company: 'Goldman Sachs',     pkg: 28,  type: 'Full-time' },
  { name: 'Karan Rathore', branch: 'IT',  company: 'Amazon',            pkg: 24,  type: 'Full-time' },
  { name: 'Rahul Gupta',   branch: 'CSE', company: 'Adobe',             pkg: 18,  type: 'Full-time' },
  { name: 'Sneha Patel',   branch: 'CSE', company: 'Walmart Labs',      pkg: 16,  type: 'Full-time' },
]

const PlacementDashboard: React.FC = () => {
  const { user } = useAdminStore()

  const stats = [
    { label: 'Students Placed',      value: MOCK_KPIS.totalPlaced,       icon: Users,         color: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25', link: '/dashboard/placement/records',           desc: 'Academic year so far' },
    { label: 'Ongoing Drives',       value: MOCK_KPIS.ongoingDrives,     icon: Building2,     color: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40', link: '/dashboard/placement/company-visits',    desc: 'Open applications' },
    { label: 'Scheduled Visits',     value: MOCK_KPIS.scheduledVisits,   icon: Calendar,      color: 'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30', link: '/dashboard/placement/company-visits',    desc: 'Next 30 days' },
    { label: 'Active Trainings',     value: MOCK_KPIS.activeTrainings,   icon: GraduationCap, color: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30', link: '/dashboard/placement/training-programs', desc: 'Workshops & bootcamps' },
    { label: 'Open Internships',     value: MOCK_KPIS.openInternships,   icon: Briefcase,     color: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',  link: '/dashboard/placement/internships',       desc: 'Currently accepting' },
    { label: 'Highest Package',      value: `${MOCK_KPIS.highestPackage} LPA`, icon: IndianRupee, color: 'bg-[#bfa15f]/20 text-[#bfa15f] border-[#bfa15f]/40', link: '/dashboard/placement/records',           desc: 'Single offer' },
    { label: 'Average Package',      value: `${MOCK_KPIS.avgPackage} LPA`,    icon: TrendingUp, color: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/20', link: '/dashboard/placement/records',           desc: 'Across all branches' },
    { label: 'Notices Published',    value: 14,                          icon: Megaphone,     color: 'bg-slate-50 text-slate-600 border-slate-200',         link: '/dashboard/placement/notices',           desc: 'This semester' },
  ]

  const quickLinks = [
    { label: 'Post Placement Notice',  path: '/dashboard/placement/notices',            desc: 'Push a new circular to T&P notice board' },
    { label: 'Add Company Visit',      path: '/dashboard/placement/company-visits',     desc: 'Schedule a recruiter campus drive' },
    { label: 'Import Placement Record',path: '/dashboard/placement/records',            desc: 'Bulk-add via CSV after a drive concludes' },
    { label: 'Schedule Training',      path: '/dashboard/placement/training-programs',  desc: 'Aptitude / soft-skills / technical bootcamp' },
    { label: 'Open Internship',        path: '/dashboard/placement/internships',        desc: 'Publish a summer / winter internship opening' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? 'Placement Officer'}`}
        subtitle={`${user?.department ?? 'Training & Placement Cell'} · Academic Year 2025-26`}
      />

      {/* Stats grid */}
      <div>
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Placement Pulse</h3>
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

      {/* Quick actions */}
      <PortalCard>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 hover:border-[#0b2545]/40 hover:bg-[#0b2545]/5 transition-all group"
            >
              <div className="mt-0.5 w-5 h-5 rounded bg-[#0b2545]/10 flex items-center justify-center shrink-0">
                <ChevronRight size={10} className="text-[#0b2545]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-[#0b2545] transition-colors">{link.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </PortalCard>

      {/* Upcoming visits + Recent placements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Upcoming Company Visits</h3>
            <Link to="/dashboard/placement/company-visits" className="text-xs text-[#0b2545] hover:underline font-medium">Manage &rarr;</Link>
          </div>
          <div className="space-y-2.5">
            {MOCK_UPCOMING_VISITS.map(v => (
              <div key={v.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{v.company}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{v.role}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#bfa15f]/10 text-[#bfa15f] border border-[#bfa15f]/30 uppercase tracking-wide">
                    {v.pkg} LPA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  {v.branches.map(b => (
                    <span key={b} className="text-[10px] bg-white border border-[#0b2545]/15 text-[#0b2545] px-1.5 py-0.5 rounded font-medium">{b}</span>
                  ))}
                  <span className="text-[10px] text-slate-400 ml-auto">{v.date}</span>
                </div>
              </div>
            ))}
          </div>
        </PortalCard>

        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Recent High-Value Placements</h3>
            <Link to="/dashboard/placement/records" className="text-xs text-[#0b2545] hover:underline font-medium">View all &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Branch</th>
                  <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="text-right px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">CTC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_RECENT_PLACEMENTS.map(p => (
                  <tr key={`${p.name}-${p.company}`} className="hover:bg-slate-50/60">
                    <td className="px-2 py-2 text-xs font-medium text-slate-800">{p.name}</td>
                    <td className="px-2 py-2 text-xs text-slate-600">{p.branch}</td>
                    <td className="px-2 py-2 text-xs text-slate-600">{p.company}</td>
                    <td className="px-2 py-2 text-xs text-right font-bold text-[#bfa15f]">{p.pkg} LPA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PortalCard>
      </div>
    </div>
  )
}

export default PlacementDashboard
