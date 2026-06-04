import React, { useState, useEffect } from 'react'
import { BookOpen, Building } from 'lucide-react'
import { getDeptSection } from '../../../services/departmentService'

interface ResearchCard {
  title: string
  desc: string
}

interface ResearchSection {
  intro?: string
  grants?: ResearchCard[]
  labs?: ResearchCard[]
}

interface ResearchTabProps {
  slug: string
}

const ResearchTab: React.FC<ResearchTabProps> = ({ slug }) => {
  const [data, setData] = useState<ResearchSection | null>(null)

  useEffect(() => {
    getDeptSection<ResearchSection>(slug, 'research').then(d => { if (d) setData(d) })
  }, [slug])

  const grants = data?.grants ?? []
  const labs   = data?.labs   ?? []
  const hasContent = data && (grants.length > 0 || labs.length > 0 || data.intro)

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Research Journals & Core Labs</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans text-justify">
        {data?.intro || 'Research and lab information will be updated by the department.'}
      </p>

      {!hasContent ? (
        <p className="text-xs text-slate-400 italic py-8 text-center">Research content not configured. Contact HOD.</p>
      ) : (
        <div className="space-y-4 pt-4">
          {grants.map((g, i) => (
            <div key={i} className="p-5 border border-slate-200 rounded space-y-3 bg-white">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent-blue" strokeWidth={1.75} />{g.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">{g.desc}</p>
            </div>
          ))}
          {labs.map((lab, i) => (
            <div key={i} className="p-5 border border-slate-200 rounded space-y-3 bg-white">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-accent-blue" strokeWidth={1.75} />{lab.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">{lab.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResearchTab
