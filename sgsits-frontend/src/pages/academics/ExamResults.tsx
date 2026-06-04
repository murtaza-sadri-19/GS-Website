import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Calendar, ExternalLink, RefreshCw } from 'lucide-react'
import { getExamResults, examResultsDefault, type ExamResultsData } from '../../services/academicsService'

const ExamResults: React.FC = () => {
  const [examData, setExamData] = useState<ExamResultsData>(examResultsDefault)

  useEffect(() => {
    getExamResults().then(setExamData)
  }, [])

  const schedules = examData.schedules.map(s => ({
    term: s.type, timeline: s.months, details: s.note ?? ''
  }))

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/exam-results" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-accent">Academics</span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-primary font-display">
          Examinations & Results
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-semibold">
          Autonomous examination systems, schedules, and official portals
        </p>
      </div>

      {/* Autonomous continuous evaluation model intro */}
      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        <div className="space-y-3 max-w-3xl">
          <span className="bg-primary/5 text-primary border border-primary/10 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block">
            Evaluation Model
          </span>
          <h3 className="text-lg font-bold text-primary font-display">
            Autonomous Continuous Evaluation System
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            As an autonomous institute, SGSITS designs its own examination systems and declares results independently. The academic evaluation follows a rigorous **continuous evaluation model**, which is split into continuous internal assessments, mid-semester exams, laboratory evaluation, and comprehensive end-semester examination sheets.
          </p>
        </div>
      </div>

      {/* Schedules & Timeline */}
      <div className="space-y-5">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent">Active Windows</span>
          <h3 className="text-xl font-bold text-primary font-display">Examination Timelines</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedules.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-md p-5 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-accent">
                  <Calendar size={18} className="stroke-[2.25]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider">{item.term}</span>
                </div>
                <h4 className="text-base font-extrabold text-primary font-display">
                  {item.timeline}
                </h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action ERP Link Widgets */}
      <div className="space-y-5">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent">Digital Services</span>
          <h3 className="text-xl font-bold text-primary font-display">Student Portals & Results Access</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Re-evaluation */}
          <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm flex flex-col justify-between min-h-[170px]">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400 block">SUPPORT</span>
              <h4 className="text-lg font-extrabold text-primary font-display">Re-evaluation & Retotalling</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Students can apply for online re-evaluation, digital copy inspection, or grade retotalling. Forms must be filled within 15 days of official result declaration.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-4 py-2 mt-4 rounded text-xs font-bold text-slate-400 w-fit cursor-not-allowed select-none">
              Portal Opens During Result Window
              <RefreshCw size={12} className="stroke-[2.5]" />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamResults
