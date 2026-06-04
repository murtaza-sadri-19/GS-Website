import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Award, Star, TrendingUp, CheckCircle, BookOpen } from 'lucide-react'
import { aboutService, type AccreditationData } from '../../services/aboutService'
import { Sk } from '../../components/ui/Skeleton'

// Icon & colour maps — UI concerns, not backend data
const BODY_ICON: Record<string, React.ElementType> = {
  NAAC:  Award,
  NBA:   Star,
  NIRF:  TrendingUp,
  AICTE: CheckCircle,
  RGPV:  BookOpen,
}
const BODY_COLOR: Record<string, string> = {
  NAAC:  '#0b2545',
  NBA:   '#bfa15f',
  NIRF:  '#0b2545',
  AICTE: '#bfa15f',
  RGPV:  '#0b2545',
}
const DEFAULT_ICON  = Award
const DEFAULT_COLOR = '#0b2545'

const LABELS = {
  scorePrefix:    'Score: ',
  validTillPrefix: 'Valid till: ',
  nirfYear:       'Year',
  nirfRank:       'Rank',
  nirfCategory:   'Category',
} as const

const Accreditation: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<AccreditationData | null>(null)

  useEffect(() => {
    if (!previewData) aboutService.getAccreditation().then(setFetchedData)
  }, [previewData])

  const loading = !previewData && fetchedData === null
  const data: AccreditationData = (previewData ?? fetchedData ?? {}) as AccreditationData

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/accreditation" />
      <div className="border-b border-slate-200 pb-5">
        {loading ? (
          <>
            <Sk className="h-8 w-56 rounded mb-2" />
            <Sk className="h-4 w-72 rounded" />
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">
              {(data.title as string) ?? 'Accreditation'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {(data.subtitle as string) ?? 'NAAC, NBA, and NIRF recognition'}
            </p>
          </>
        )}
      </div>

      {loading ? (
        <Sk className="h-4 w-full rounded" />
      ) : (
        <p className="text-slate-700 text-sm leading-relaxed">{data.about as string}</p>
      )}

      {/* Accreditation Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {loading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border border-slate-200 overflow-hidden">
            <Sk className="h-8 w-full rounded-none" />
            <div className="p-6 text-center bg-white space-y-3">
              <Sk className="w-10 h-10 rounded-full mx-auto" />
              <Sk className="h-5 w-24 rounded mx-auto" />
              <Sk className="h-9 w-16 rounded mx-auto" />
              <Sk className="h-3 w-28 rounded mx-auto" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {(data.records ?? []).map((rec) => {
          const Icon  = BODY_ICON[rec.body]  ?? DEFAULT_ICON
          const color = BODY_COLOR[rec.body] ?? DEFAULT_COLOR
          return (
            <div key={rec.body} className="rounded-md border overflow-hidden hover:border-slate-400 transition-colors" style={{ borderColor: color }}>
              <div className="p-2 text-center text-white text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: color }}>
                {rec.cycle ?? rec.validUpto}
              </div>
              <div className="p-6 text-center bg-white">
                <Icon size={40} style={{ color }} className="mx-auto mb-3" />
                <h3 className="font-bold text-lg text-primary">{rec.body}</h3>
                <p className="text-3xl font-extrabold mt-2" style={{ color }}>{rec.grade}</p>
                {rec.naacScore && (
                  <p className="text-sm font-semibold mt-1" style={{ color }}>Score: {rec.naacScore}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">Valid till: {rec.validUpto}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* NBA Programs */}
      {(data.nbaPrograms ?? []).length > 0 && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-primary">NBA Accredited Programs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(data.nbaPrograms ?? []).map((prog) => (
              <div key={prog} className="flex items-center gap-3 bg-white rounded-md p-3 border border-slate-200 shadow-sm">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-accent)' }} />
                <span className="text-sm font-medium text-slate-700">{prog}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* NIRF Rankings */}
      {(data.nirf ?? []).length > 0 && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-primary">NIRF Rankings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary">
                  <th className="text-left text-white px-4 py-3 font-semibold">Year</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Rank</th>
                  <th className="text-left text-white px-4 py-3 font-semibold">Category</th>
                </tr>
              </thead>
              <tbody>
                {(data.nirf ?? []).map((n, i) => (
                  <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 border-b border-slate-100 font-medium text-primary">{n.year}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-700">{n.rank}</td>
                    <td className="px-4 py-3 border-b border-slate-100 text-slate-500">{n.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Accreditation
