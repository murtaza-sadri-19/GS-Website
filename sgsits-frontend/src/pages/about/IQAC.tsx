import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { CheckCircle } from 'lucide-react'
import { aboutService, iqacDefault, type IQACData } from '../../services/aboutService'

const IQAC: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<IQACData | null>(null)

  useEffect(() => {
    if (!previewData) aboutService.getIQAC().then(setFetchedData)
  }, [previewData])

  const data: IQACData = (previewData ?? fetchedData ?? iqacDefault) as IQACData

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/iqac" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">{(data.title as string) ?? 'IQAC Cell'}</h2>
        <p className="text-sm text-slate-500 mt-1">{(data.subtitle as string) ?? 'Internal Quality Assurance Cell'}</p>
      </div>

      <p className="text-slate-700 text-sm leading-relaxed">{data.about}</p>

      <div>
        <h3 className="text-xl font-bold mb-4 text-primary">{(data.objectivesHeading as string) ?? 'Objectives'}</h3>
        <div className="space-y-3">
          {(data.objectives ?? []).map((obj, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-md p-4 border border-slate-200 shadow-sm">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5 text-accent" />
              <p className="text-sm text-slate-700 leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-3 text-primary">{(data.compositionHeading as string) ?? 'IQAC Composition'}</h3>
        <p className="text-sm text-slate-600 mb-3">{(data.compositionIntro as string) ?? 'The IQAC comprises the following members:'}</p>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>• <strong>Chairperson:</strong> {data.chairpersonName as string} ({data.chairpersonTitle as string})</li>
          <li>• <strong>Coordinator:</strong> {data.coordinatorName as string} ({data.coordinatorTitle as string})</li>
          {((data.compositionStaticItems as string[]) ?? [
            'Representatives from all departments',
            'External subject experts from industry and academia',
            'Administrative staff representatives',
            'Student representatives',
            'Alumni representative',
          ]).map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>
      </div>

      {(data.recentActivities ?? []).length > 0 && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4 text-primary">{(data.recentActivitiesHeading as string) ?? 'Recent Activities'}</h3>
          <div className="space-y-3">
            {(data.recentActivities ?? []).map((activity, i) => (
              <div key={i} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" style={{ backgroundColor: 'var(--color-accent)' }} />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default IQAC
