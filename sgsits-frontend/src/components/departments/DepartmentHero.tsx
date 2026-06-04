import React from 'react'
import type { DepartmentSummary } from '../../services/departmentService'

interface DepartmentHeroProps {
  dept: DepartmentSummary
}

const DepartmentHero: React.FC<DepartmentHeroProps> = ({ dept }) => (
  <section className="bg-slate-50 border border-slate-200 rounded p-6 md:p-8 relative">
    <div className="relative space-y-4 max-w-4xl">
      <span className="inline-block px-2.5 py-0.5 bg-slate-200/85 text-slate-800 rounded border border-slate-300 text-xs font-bold uppercase tracking-wider">
        {dept.programsOffered.join(' • ')} Programs
      </span>

      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-slate-900 tracking-tight">
          Department of <span className="font-serif italic font-semibold text-primary">{dept.name}</span>
        </h1>
        <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-sans max-w-2xl font-medium">
          {dept.description || `Fostering engineering breakthroughs, industrial leadership, and comprehensive research in ${dept.shortName} sciences since the establishment.`}
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 border-t border-slate-200 text-xs text-slate-600 font-sans">
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-800">HOD:</span>
          <span>{dept.hodName}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold text-slate-800">Email:</span>
          <a href={`mailto:${dept.hodEmail}`} className="text-accent-blue hover:underline">{dept.hodEmail}</a>
        </div>
        {dept.hodPhone && (
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-800">Phone:</span>
            <span>{dept.hodPhone}</span>
          </div>
        )}
      </div>
    </div>
  </section>
)

export default DepartmentHero
