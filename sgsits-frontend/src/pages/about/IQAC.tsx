import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { CheckCircle } from 'lucide-react'
import { aboutService, iqacDefault, type IQACData } from '../../services/aboutService'

const IQAC: React.FC = () => {
  const [data, setData] = useState<IQACData>(iqacDefault)

  useEffect(() => {
    aboutService.getIQAC().then(setData)
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/iqac" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>IQAC Cell</h2>
        <p className="text-sm text-gray-500 mt-1">Internal Quality Assurance Cell</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.about}</p>

      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Objectives</h3>
        <div className="space-y-3">
          {data.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-3 bg-white rounded-md p-4 border border-slate-200 shadow-sm">
              <CheckCircle size={20} style={{ color: 'var(--color-accent)' }} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>IQAC Composition</h3>
        <p className="text-sm text-gray-600 mb-3">The IQAC comprises the following members:</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>• <strong>Chairperson:</strong> {data.chairpersonName} ({data.chairpersonTitle})</li>
          <li>• <strong>Coordinator:</strong> {data.coordinatorName} ({data.coordinatorTitle})</li>
          <li>• Representatives from all departments</li>
          <li>• External subject experts from industry and academia</li>
          <li>• Administrative staff representatives</li>
          <li>• Student representatives</li>
          <li>• Alumni representative</li>
        </ul>
      </div>

      {data.recentActivities.length > 0 && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Recent Activities</h3>
          <div className="space-y-3">
            {data.recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" style={{ backgroundColor: 'var(--color-accent)' }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{activity.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{activity.date}</p>
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
