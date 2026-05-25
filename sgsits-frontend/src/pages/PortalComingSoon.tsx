import React from 'react'
import PageSeo from '../components/global/PageSeo'
import { Link, useLocation } from 'react-router-dom'
import { PageHeader, PortalCard } from '../components/layout/PortalLayout'
import { Construction, ArrowLeft } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description?: string
  backTo?: string
}

const PortalComingSoon: React.FC<ComingSoonProps> = ({ title, description, backTo }) => {
  const location = useLocation()
  const p = location.pathname
  const fallbackBack =
    backTo ??
    (p.startsWith('/dashboard/central-admin') ? '/dashboard/central-admin/dashboard' :
     p.startsWith('/dashboard/hod')           ? '/dashboard/hod/dashboard' :
     p.startsWith('/dashboard/teacher')       ? '/dashboard/teacher/dashboard' :
     p.startsWith('/dashboard/exam')          ? '/dashboard/exam/dashboard' :
     p.startsWith('/dashboard/placement')     ? '/dashboard/placement/dashboard' :
     '/')

  return (
    <div className="space-y-5">
      <PageSeo pageKey="portal-coming-soon" />
      <PageHeader title={title} subtitle="Module under development" />
      <PortalCard>
        <div className="py-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#bfa15f]/15 border border-[#bfa15f]/30 rounded-full flex items-center justify-center mb-4">
            <Construction size={22} className="text-[#bfa15f]" />
          </div>
          <h3 className="font-display text-lg font-bold text-[#0b2545]">
            {title} &mdash; Coming Soon
          </h3>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            {description ??
              'This portal section is being built. The page will go live once the backend endpoints are wired and the workflow is integrated.'}
          </p>
          <Link
            to={fallbackBack}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-[#0b2545] hover:underline"
          >
            <ArrowLeft size={13} /> Back to dashboard
          </Link>
        </div>
      </PortalCard>
    </div>
  )
}

export default PortalComingSoon
