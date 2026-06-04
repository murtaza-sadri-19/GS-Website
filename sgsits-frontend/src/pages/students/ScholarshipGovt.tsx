import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { getScholarshipGovt } from '../../services/studentsService'

const ScholarshipGovt: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  useEffect(() => { if (!previewData) getScholarshipGovt().then(setFetchedData) }, [previewData])
  const data = previewData ?? fetchedData
  if (!data) return <SkeletonPage />

  return (
    <div className="space-y-8">
      <PageSeo pageKey="students/scholarship-govt" />
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Government Scholarships</h2>
        <p className="text-sm text-slate-500 mt-1">State and central government scholarship schemes</p>
      </div>

      <p className="text-slate-700 text-sm leading-relaxed">{data.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {(data.scholarships || []).map((s: any, i: number) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
            <h3 className="font-bold text-sm text-primary">{s.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.description}</p>
            {s.eligibility && (
              <p className="text-xs text-slate-500 mt-1 font-semibold">Eligibility: {s.eligibility}</p>
            )}
            {s.portalUrl && (
              <a href={s.portalUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mt-1 block">Apply: {s.portalUrl}</a>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-slate-600 flex flex-wrap gap-4">
        {data.contactEmail && <span>📧 {data.contactEmail}</span>}
        {data.contactPhone && <span>📞 {data.contactPhone}</span>}
      </div>
    </div>
  )
}

export default ScholarshipGovt
