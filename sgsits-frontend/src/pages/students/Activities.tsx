import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { getActivities } from '../../services/studentsService'

const Activities: React.FC = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getActivities().then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-8">
      <PageSeo pageKey="students/activities" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Student Activities</h2>
        <p className="text-sm text-gray-500 mt-1">Cultural, technical, and social activities</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.intro}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {(data.activities || []).map((act: any, i: number) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
            <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-primary)' }}>{act.title}</h3>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{act.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Activities
