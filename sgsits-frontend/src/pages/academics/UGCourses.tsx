import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { GraduationCap } from 'lucide-react'
import { academicsService, ugCoursesDefault } from '../../services/academicsService'
import type { UGCoursesData } from '../../services/academicsService'

const UGCourses: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<UGCoursesData | null>(null)

  useEffect(() => {
    if (!previewData) {
      academicsService.getUGCourses().then(setFetchedData).catch(() => {})
    }
  }, [previewData])

  const ugData: UGCoursesData = (previewData ?? fetchedData ?? ugCoursesDefault) as UGCoursesData

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/courses/ug" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">Undergraduate Programs</h2>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{ugData.intro}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(ugData.stats ?? []).map((stat, idx) => (
          <div key={idx} className="bg-white rounded-md p-4 text-center border border-slate-200 shadow-sm">
            <p className="text-2xl font-bold" style={{ color: idx % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)' }}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-white px-4 py-3 font-semibold w-12">#</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Code</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Intake</th>
            </tr>
          </thead>
          <tbody>
            {(ugData.courses ?? []).map((c, i) => (
              <tr key={c.code || i} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                <td className="px-4 py-3 border-b border-slate-100 text-slate-500">{i + 1}</td>
                <td className="px-4 py-3 border-b border-slate-100 font-medium flex items-center gap-2">
                  <GraduationCap size={16} className="text-accent" />
                  <span className="text-primary">{c.name}</span>
                </td>
                <td className="px-4 py-3 border-b border-slate-100 text-slate-500 font-mono">{c.code}</td>
                <td className="px-4 py-3 border-b border-slate-100 font-semibold text-primary">{c.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(ugData.eligibility || ugData.admissionProcess || ugData.feeNote) && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-3 text-primary">Eligibility & Admission</h3>
          <ul className="space-y-2 text-sm text-slate-700">
            {ugData.eligibility && (
              <li><span className="text-accent">•</span> <strong>Eligibility:</strong> {ugData.eligibility}</li>
            )}
            {ugData.admissionProcess && (
              <li><span className="text-accent">•</span> <strong>Admission:</strong> {ugData.admissionProcess}</li>
            )}
            {ugData.feeNote && (
              <li><span className="text-accent">•</span> <strong>Fee Structure:</strong> {ugData.feeNote}</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UGCourses
