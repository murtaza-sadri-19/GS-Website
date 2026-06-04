import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { GraduationCap, CheckCircle2, ExternalLink, AlertCircle } from 'lucide-react'
import { academicsService, pgCoursesDefault } from '../../services/academicsService'
import type { PGCoursesData } from '../../services/academicsService'

const PGCourses: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<PGCoursesData | null>(null)

  useEffect(() => {
    if (!previewData) {
      academicsService.getPGCourses().then(setFetchedData).catch(() => {})
    }
  }, [previewData])

  const pgData: PGCoursesData = (previewData ?? fetchedData ?? pgCoursesDefault) as PGCoursesData

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/courses/pg" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Postgraduate Programs</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium font-sans">M.Tech / M.Pharm / MBA / MCA Programs — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
          {pgData.intro}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(pgData.stats ?? []).map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Programs Table */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Programs Offered</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Complete Program List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary">
                <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Department</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Intake</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {(pgData.programs ?? []).map((prog, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-medium text-primary">{prog.program}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-600">{prog.dept}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-slate-700">{prog.intake}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-500 text-xs">{prog.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eligibility & Fee */}
      {((pgData.eligibilityItems?.length > 0) || (pgData.feeRows?.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pgData.eligibilityItems?.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded p-5">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
                <GraduationCap size={16} className="text-accent" />
                <h4 className="font-bold text-sm text-primary uppercase tracking-wider font-display">General Eligibility</h4>
              </div>
              <div className="space-y-2 text-sm text-slate-600 font-sans">
                {(pgData.eligibilityItems as string[]).map((item: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-slate-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {pgData.feeRows?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded p-5">
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3 font-display">Fee Structure</h4>
              <div className="text-sm space-y-2 font-sans text-slate-600">
                {(pgData.feeRows as { label: string; value: string; accent?: boolean }[]).map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{row.label}</span>
                    <span className={`font-semibold ${row.accent ? 'text-accent' : 'text-slate-800'}`}>{row.value}</span>
                  </div>
                ))}
                {pgData.feeNote && (
                  <p className="text-xs text-slate-400 mt-2 italic font-sans">{pgData.feeNote}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admission Portal */}
      {pgData.ccmtPortalUrl && (
        <div className="bg-primary text-white rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold font-display text-base">{pgData.ccmtPortalTitle}</h4>
            <p className="text-sm text-slate-300 mt-1 font-sans">{pgData.ccmtPortalDesc}</p>
          </div>
          <a href={pgData.ccmtPortalUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded text-xs font-bold hover:bg-accent/90 transition-colors shrink-0 font-sans">
            CCMT Portal <ExternalLink size={12} />
          </a>
        </div>
      )}
    </div>
  )
}

export default PGCourses
