import React from 'react'
import { PageHeader, PortalCard } from '../../components/layout/PortalLayout'
import { BarChart3, Clock } from 'lucide-react'

const HodResults: React.FC = () => {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Result Summary"
        subtitle="Branch-wide pass / fail summary and toppers"
      />
      <PortalCard>
        <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center">
            <BarChart3 size={24} className="text-slate-400" />
          </div>
          <div>
            <p className="font-bold text-slate-700 text-base">Result Summary Not Yet Available</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">
              The result summary report requires marks to be submitted and published by faculty and approved by the Exam Controller.
              This view will populate once results are finalised.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5">
            <Clock size={13} />
            <span>Available after Exam Controller publishes results</span>
          </div>
        </div>
      </PortalCard>
    </div>
  )
}

export default HodResults
