import React, { useState, useEffect } from 'react'
import type { DepartmentSummary } from '../../../services/departmentService'
import { getDeptSection } from '../../../services/departmentService'

interface ObeSection {
  description?: string
  peos?: string[]
  pos?: string[]
  vision?: string
  mission?: string
}

interface ObeTabProps {
  dept: DepartmentSummary
  slug: string
}

const ObeTab: React.FC<ObeTabProps> = ({ dept, slug }) => {
  const [data, setData] = useState<ObeSection | null>(null)

  useEffect(() => {
    getDeptSection<ObeSection>(slug, 'obe').then(d => { if (d) setData(d) })
  }, [slug])

  const vision  = data?.vision  ?? dept.vision
  const mission = data?.mission ?? dept.mission

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Outcome Based Education (OBE)</h2>
      </div>

      {data?.description ? (
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans text-justify">{data.description}</p>
      ) : (
        <p className="text-xs md:text-sm text-slate-400 italic">OBE overview not configured. Contact HOD.</p>
      )}

      <div className="space-y-4 pt-4">
        <div className="p-4 bg-slate-50 rounded border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Departmental Vision</h4>
          {vision ? (
            <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify font-medium">"{vision}"</p>
          ) : (
            <p className="text-xs text-slate-400 italic">Vision not set.</p>
          )}
        </div>
        <div className="p-4 bg-slate-50 rounded border border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Departmental Mission</h4>
          {mission ? (
            <p className="text-xs text-slate-600 leading-relaxed font-sans text-justify font-medium">"{mission}"</p>
          ) : (
            <p className="text-xs text-slate-400 italic">Mission not set.</p>
          )}
        </div>
      </div>

      {data?.peos && data.peos.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Program Educational Objectives (PEOs)</h4>
          <ul className="space-y-2">
            {data.peos.map((peo, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                <span className="font-bold text-primary shrink-0">PEO {i + 1}:</span> {peo}
              </li>
            ))}
          </ul>
        </div>
      )}

      {data?.pos && data.pos.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Program Outcomes (POs)</h4>
          <ul className="space-y-2">
            {data.pos.map((po, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                <span className="font-bold text-primary shrink-0">PO {i + 1}:</span> {po}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default ObeTab
