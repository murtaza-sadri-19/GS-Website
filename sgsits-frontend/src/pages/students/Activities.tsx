import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { getActivities } from '../../services/studentsService'

const Activities: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  useEffect(() => { if (!previewData) getActivities().then(setFetchedData) }, [previewData])
  const data = previewData ?? fetchedData
  if (!data) return <SkeletonPage />

  return (
    <div className="space-y-8">
      <PageSeo pageKey="students/activities" />
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Student Activities</h2>
        <p className="text-sm text-slate-500 mt-1">Cultural, technical, and social activities</p>
      </div>

      <p className="text-slate-700 text-sm leading-relaxed">{data.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {(data.activities || []).map((act: any, i: number) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
            <h3 className="font-bold text-sm text-primary">{act.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{act.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities
