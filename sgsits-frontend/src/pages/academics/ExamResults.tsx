import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Calendar, ExternalLink, RefreshCw } from 'lucide-react'

const schedules = [
  { term: 'Mid-Semester Exams', timeline: 'September / February', details: 'Continuous evaluation mid-sem tests conducted in two phases per semester.' },
  { term: 'End-Semester Exams', timeline: 'Nov-Dec / Apr-May', details: 'Comprehensive end-term theory and laboratory examinations.' },
  { term: 'Supplementary Exams', timeline: 'July / August', details: 'Conducted for students seeking clearing backlogs or improvements.' }
]

const ExamResults: React.FC = () => {
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
          <p className="text-[14px] text-slate-650 leading-relaxed font-medium">
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
                <p className="text-xs text-slate-550 font-medium leading-relaxed">
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
          {/* Action 1: ERP */}
          <div className="bg-primary text-white rounded-md p-6 border-l-4 border-accent relative shadow-sm flex flex-col justify-between min-h-[170px]">
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent block">OFFICIAL PORTAL</span>
              <h4 className="text-lg font-bold font-display">SGSITS ERP Portal</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Official institutional ERP to access end-semester grade cards, view SGPA/CGPA tallies, check attendance records, and download hall tickets.
              </p>
            </div>
            <a 
              href="https://erp.sgsitsindore.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-primary px-4 py-2 mt-4 rounded-md text-xs font-extrabold transition-all w-fit"
            >
              Access ERP System
              <ExternalLink size={12} className="stroke-[2.5]" />
            </a>
          </div>

          {/* Action 2: Re-evaluation */}
          <div className="bg-white border border-slate-200 rounded-md p-6 shadow-sm flex flex-col justify-between min-h-[170px]">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">SUPPORT</span>
              <h4 className="text-lg font-extrabold text-primary font-display">Re-evaluation & Retotalling</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Students can apply for online re-evaluation, digital copy inspection, or grade retotalling. Forms must be filled within 15 days of official result declaration.
              </p>
            </div>
            <button 
              onClick={() => alert('Re-evaluation portal will open on next scheduled result date.')}
              className="inline-flex items-center gap-2 bg-white hover:bg-primary hover:text-white border border-slate-200 px-4 py-2 mt-4 rounded-md text-xs font-extrabold transition-all text-slate-850 w-fit active:scale-95 shadow-sm"
            >
              Apply Online
              <RefreshCw size={12} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExamResults
