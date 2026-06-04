import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { aboutService, type AcademicCouncilData } from '../../services/aboutService'
import { SkeletonTable, Sk } from '../../components/ui/Skeleton'

const categoryClass = (cat: string): string => {
  if (cat === 'Ex-Officio') return 'border border-primary/30 text-primary bg-white shadow-sm'
  if (cat === 'External')   return 'border border-accent/40 text-accent bg-white shadow-sm'
  if (cat === 'Nominated')  return 'border border-primary/40 text-primary bg-white shadow-sm'
  if (cat === 'Industry')   return 'border border-accent/40 text-accent bg-white shadow-sm'
  return 'border border-accent/50 text-accent bg-white shadow-sm'
}

const AcademicCouncil: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<AcademicCouncilData | null>(null)
  const [loading, setLoading] = useState<boolean>(!previewData)

  useEffect(() => {
    if (!previewData) {
      setLoading(true)
      aboutService.getAcademicCouncil().then(setFetchedData).finally(() => setLoading(false))
    }
  }, [previewData])

  const data: AcademicCouncilData = previewData ?? fetchedData ?? {}

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/academic-council" />
      <div className="border-b border-slate-200 pb-5">
        {loading
          ? <><Sk className="h-8 w-64 rounded mb-2" /><Sk className="h-4 w-48 rounded" /></>
          : <>
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">{data.title ?? 'Academic Council'}</h2>
              <p className="text-sm text-slate-500 mt-1">{data.subtitle ?? ''}</p>
            </>
        }
      </div>

      {loading
        ? <div className="space-y-1.5"><Sk className="h-3.5 w-full rounded" /><Sk className="h-3.5 w-5/6 rounded" /><Sk className="h-3.5 w-4/6 rounded" /></div>
        : <p className="text-slate-700 text-sm leading-relaxed">{data.description}</p>
      }

      <div>
        {loading
          ? <Sk className="h-6 w-48 rounded mb-4" />
          : <h3 className="text-xl font-bold mb-4 text-primary">{data.compositionHeading ?? 'Council Composition'}</h3>
        }
        {loading
          ? <SkeletonTable rows={8} columns={4} hasActions={false} />
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary">
                    <th className="text-left text-white px-4 py-3 font-semibold">#</th>
                    <th className="text-left text-white px-4 py-3 font-semibold">Designation</th>
                    <th className="text-left text-white px-4 py-3 font-semibold">Member</th>
                    <th className="text-left text-white px-4 py-3 font-semibold">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.members ?? []).map((m, i) => (
                    <tr key={i} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                      <td className="px-4 py-3 border-b border-slate-100 text-slate-500">{m.sno}</td>
                      <td className="px-4 py-3 border-b border-slate-100 font-medium text-primary">{m.designation}</td>
                      <td className="px-4 py-3 border-b border-slate-100 text-slate-700">{m.name}</td>
                      <td className="px-4 py-3 border-b border-slate-100">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryClass(m.category)}`}>
                          {m.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        {loading
          ? <><Sk className="h-5 w-36 rounded mb-3" /><div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Sk key={i} className="h-3.5 w-full rounded" />)}</div></>
          : <>
              <h3 className="text-lg font-bold mb-3 text-primary">{data.functionsHeading ?? 'Key Functions'}</h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {(data.keyFunctions ?? []).map((fn, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-accent">•</span> {fn}</li>
                ))}
              </ul>
            </>
        }
      </div>
    </div>
  )
}

export default AcademicCouncil
