import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { getScholarshipGovt } from '../../services/studentsService'

const ScholarshipGovt: React.FC = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getScholarshipGovt().then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-8">
      <PageSeo pageKey="students/scholarship-govt" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Government Scholarships</h2>
        <p className="text-sm text-gray-500 mt-1">State and central government scholarship schemes</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {(data.scholarships || []).map((s: any, i: number) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
            <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-primary)' }}>{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{s.description}</p>
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
