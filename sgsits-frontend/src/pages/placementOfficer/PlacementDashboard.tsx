import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import {
  Megaphone, Building2, GraduationCap, Briefcase,
  ChevronRight, TrendingUp, Calendar, IndianRupee, Users,
} from 'lucide-react'
import { apiClient } from '../../api/client'

interface Stats {
  totalPlaced: number
  highestPackage: string
  averagePackage: string
  companiesVisited: number
}

interface CompanyVisitRecord {
  id: number
  title: string
  company_name: string | null
  description: string | null
  created_at: string
}

interface PlacementOffer {
  id: number
  student_name: string
  branch: string | null
  company_name: string
  ctc_lpa: number | null
}

const PlacementDashboard: React.FC = () => {
  const { user } = useAdminStore()
  const [stats, setStats]     = useState<Stats | null>(null)
  const [visits, setVisits]   = useState<CompanyVisitRecord[]>([])
  const [recent, setRecent]   = useState<PlacementOffer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiClient.get('/v1/placement/stats').catch(() => null),
      apiClient.get('/v1/placement/company-visits', { params: { pageSize: 5 } }).catch(() => null),
      apiClient.get('/v1/placement/offers', { params: { pageSize: 5 } }).catch(() => null),
    ]).then(([statsRes, visitsRes, offersRes]) => {
      if (statsRes?.data?.data) {
        const s = Array.isArray(statsRes.data.data) ? statsRes.data.data[0] : statsRes.data.data
        if (s) setStats({
          totalPlaced: s.students_placed ?? 0,
          highestPackage: s.highest_package ?? '—',
          averagePackage: s.average_package ?? '—',
          companiesVisited: s.companies_visited ?? 0,
        })
      }
      setVisits(visitsRes?.data?.data?.records ?? [])
      setRecent(offersRes?.data?.data?.offers ?? [])
      setLoading(false)
    })
  }, [])

  const kpiCards = [
    { label: 'Students Placed',   value: stats?.totalPlaced ?? '—',        icon: Users,       color: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25', link: '/dashboard/placement/records', desc: 'Academic year so far' },
    { label: 'Companies Visited', value: stats?.companiesVisited ?? '—',   icon: Building2,   color: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40', link: '/dashboard/placement/company-visits', desc: 'This academic year' },
    { label: 'Highest Package',   value: stats?.highestPackage ?? '—',     icon: IndianRupee, color: 'bg-[#bfa15f]/20 text-[#bfa15f] border-[#bfa15f]/40', link: '/dashboard/placement/records', desc: 'Best offer this year' },
    { label: 'Average Package',   value: stats?.averagePackage ?? '—',     icon: TrendingUp,  color: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/20', link: '/dashboard/placement/records', desc: 'Across all branches' },
    { label: 'Company Visits',    value: visits.length || '—',             icon: Calendar,    color: 'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30', link: '/dashboard/placement/company-visits', desc: 'Logged in system' },
    { label: 'Internships',       value: '—',                              icon: Briefcase,   color: 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/15',  link: '/dashboard/placement/internships', desc: 'Recorded' },
    { label: 'Training Programs', value: '—',                              icon: GraduationCap, color: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30', link: '/dashboard/placement/training-programs', desc: 'Organized' },
    { label: 'Notices',           value: '—',                              icon: Megaphone,   color: 'bg-slate-50 text-slate-600 border-slate-200', link: '/dashboard/placement/notices', desc: 'Published' },
  ]

  const quickLinks = [
    { label: 'Post Placement Notice',   path: '/dashboard/placement/notices',           desc: 'Push a new circular to T&P notice board' },
    { label: 'Add Company Visit',       path: '/dashboard/placement/company-visits',    desc: 'Schedule a recruiter campus drive' },
    { label: 'Add Placement Record',    path: '/dashboard/placement/records',           desc: 'Log individual student offer' },
    { label: 'Schedule Training',       path: '/dashboard/placement/training-programs', desc: 'Aptitude / soft-skills bootcamp' },
    { label: 'Add Internship',          path: '/dashboard/placement/internships',       desc: 'Record student internship' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user?.name ?? 'Placement Officer'}`}
        subtitle={`Training & Placement Cell · Academic Year 2025-26`}
      />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div>
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Placement Pulse</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {kpiCards.map(card => {
              const Icon = card.icon
              return (
                <Link key={card.label} to={card.link}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${card.color}`}>
                      <Icon size={16}/>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors"/>
                  </div>
                  <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                  <p className="text-xs font-bold text-slate-600 mt-1">{card.label}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <PortalCard>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickLinks.map(link => (
            <Link key={link.path} to={link.path}
              className="flex items-start gap-2 p-3 rounded-lg border border-slate-200 hover:border-[#0b2545]/40 hover:bg-[#0b2545]/5 transition-all group">
              <div className="mt-0.5 w-5 h-5 rounded bg-[#0b2545]/10 flex items-center justify-center shrink-0">
                <ChevronRight size={10} className="text-[#0b2545]"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-[#0b2545] transition-colors">{link.label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </PortalCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Recent Company Visits</h3>
            <Link to="/dashboard/placement/company-visits" className="text-xs text-[#0b2545] hover:underline font-medium">Manage &rarr;</Link>
          </div>
          {visits.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No company visits recorded yet.</p>
          ) : (
            <div className="space-y-2.5">
              {visits.slice(0, 3).map(v => (
                <div key={v.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{v.title}</p>
                  {v.company_name && <p className="text-[11px] text-slate-500 mt-0.5">{v.company_name}</p>}
                  <p className="text-[10px] text-slate-400 mt-1">{v.created_at?.slice(0, 10)}</p>
                </div>
              ))}
            </div>
          )}
        </PortalCard>

        <PortalCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-700">Recent Placements</h3>
            <Link to="/dashboard/placement/records" className="text-xs text-[#0b2545] hover:underline font-medium">View all &rarr;</Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No placement records yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-500 uppercase">Student</th>
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-500 uppercase">Branch</th>
                    <th className="text-left px-2 py-2 text-[10px] font-bold text-slate-500 uppercase">Company</th>
                    <th className="text-right px-2 py-2 text-[10px] font-bold text-slate-500 uppercase">CTC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/60">
                      <td className="px-2 py-2 text-xs font-medium text-slate-800">{p.student_name}</td>
                      <td className="px-2 py-2 text-xs text-slate-600">{p.branch ?? '—'}</td>
                      <td className="px-2 py-2 text-xs text-slate-600">{p.company_name}</td>
                      <td className="px-2 py-2 text-xs text-right font-bold text-[#bfa15f]">
                        {p.ctc_lpa ? `${p.ctc_lpa} LPA` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PortalCard>
      </div>
    </div>
  )
}

export default PlacementDashboard
