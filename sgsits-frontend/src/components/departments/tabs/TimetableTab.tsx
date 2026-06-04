import React, { useState, useEffect } from 'react'
import { Eye, Download } from 'lucide-react'
import { getDeptSection } from '../../../services/departmentService'

interface Schedule {
  sem: string
  slot: string
  url: string
}

interface TimetableSection {
  intro?: string
  schedules?: Schedule[]
}

interface TimetableTabProps {
  slug: string
  onOpenPdf: (url: string, title: string) => void
}

const TimetableTab: React.FC<TimetableTabProps> = ({ slug, onOpenPdf }) => {
  const [data, setData] = useState<TimetableSection | null>(null)

  useEffect(() => {
    getDeptSection<TimetableSection>(slug, 'timetables').then(d => { if (d) setData(d) })
  }, [slug])

  const schedules = data?.schedules ?? []

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-slate-200">
        <h2 className="text-xl font-display font-bold text-slate-900">Academic Class Timetables</h2>
      </div>
      <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-sans">
        {data?.intro || 'Select your academic batch to download active schedules, lecture hour splits, and laboratory slot sheets.'}
      </p>

      {schedules.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-8 text-center">No timetables uploaded yet. Contact HOD.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {schedules.map((s, idx) => (
            <div key={idx} className="p-4 bg-white border border-slate-200 rounded space-y-3 flex flex-col justify-between shadow-sm hover:border-slate-350 transition-colors">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">{s.sem}</h4>
                <p className="text-xs text-slate-400 font-sans font-semibold">{s.slot}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenPdf(s.url, `${s.sem} Timetable`)}
                  className="flex-1 py-1.5 bg-slate-50 border border-slate-200 hover:text-primary hover:bg-slate-100 text-slate-600 font-bold text-xs rounded flex items-center justify-center gap-1 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <a
                  href={s.url}
                  download
                  className="p-1.5 bg-slate-50 border border-slate-200 hover:text-primary hover:bg-slate-100 text-slate-600 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimetableTab
