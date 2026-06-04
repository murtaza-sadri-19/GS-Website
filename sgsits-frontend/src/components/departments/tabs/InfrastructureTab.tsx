import React, { useState, useEffect } from 'react'
import { getDeptSection } from '../../../services/departmentService'

interface Lab {
  name: string
  desc: string
}

interface InfrastructureSection {
  intro?: string
  labs?: Lab[]
}

interface InfrastructureTabProps {
  slug: string
}

const InfrastructureTab: React.FC<InfrastructureTabProps> = ({ slug }) => {
  const [data, setData] = useState<InfrastructureSection | null>(null)

  useEffect(() => {
    getDeptSection<InfrastructureSection>(slug, 'infrastructure').then(d => { if (d) setData(d) })
  }, [slug])

  const labs = data?.labs ?? []

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Labs & Infrastructure Catalog</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
        {data?.intro || 'Comprehensive directory of laboratory facilities providing experiential learning, technical workshops, and PG research setups.'}
      </p>

      {labs.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-8 text-center">Lab information not configured. Contact HOD.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {labs.map((lab, idx) => (
            <div key={idx} className="p-4 border border-slate-200 rounded space-y-2 bg-white hover:border-slate-400 transition-colors">
              <h4 className="text-xs font-bold text-slate-800">{lab.name}</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">{lab.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default InfrastructureTab
