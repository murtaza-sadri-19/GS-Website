import React, { useState, useEffect } from 'react'
import { Award } from 'lucide-react'
import { getDeptSection } from '../../../services/departmentService'

interface StatCard {
  label: string
  value: string
}

interface AchievementsSection {
  intro?: string
  stats?: StatCard[]
  highlights?: string[]
}

interface AchievementsTabProps {
  slug: string
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ slug }) => {
  const [data, setData] = useState<AchievementsSection | null>(null)

  useEffect(() => {
    getDeptSection<AchievementsSection>(slug, 'achievements').then(d => { if (d) setData(d) })
  }, [slug])

  const stats      = data?.stats      ?? []
  const highlights = data?.highlights ?? []
  const hasContent = data && (stats.length > 0 || highlights.length > 0 || data.intro)

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Placements & Achievements</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
        {data?.intro || 'Highlights of top department graduates, GATE score accomplishments, and placement logs.'}
      </p>

      {!hasContent ? (
        <p className="text-xs text-slate-400 italic py-8 text-center">Achievement data not configured. Contact HOD.</p>
      ) : (
        <>
          {stats.length > 0 && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" strokeWidth={1.5} />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Statistics</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                {stats.map((s, i) => (
                  <div key={i} className="p-3 bg-white border border-slate-200 rounded">
                    <p className="font-bold text-primary text-base">{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {highlights.length > 0 && (
            <ul className="space-y-2">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                  <span className="text-accent font-bold shrink-0">•</span> {h}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

export default AchievementsTab
