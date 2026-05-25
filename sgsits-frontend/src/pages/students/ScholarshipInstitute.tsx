import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { getScholarshipInstitute } from '../../services/studentsService'

const ScholarshipInstitute: React.FC = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getScholarshipInstitute().then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-8">
      <PageSeo pageKey="students/scholarship-institute" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Institute Scholarships</h2>
        <p className="text-sm text-gray-500 mt-1">Merit and need-based scholarships by SGSITS</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {(data.scholarships || []).map((s: any, i: number) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
            <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-primary)' }}>{s.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{s.description}</p>
            {s.criteria && (
              <p className="text-xs text-slate-500 mt-1 font-semibold">Criteria: {s.criteria}</p>
            )}
            {s.amount && (
              <p className="text-xs font-bold text-green-700 mt-1">Amount: {s.amount}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScholarshipInstitute
