import React from 'react'
import type { DepartmentSummary } from '../../../services/departmentService'

interface AboutTabProps {
  dept: DepartmentSummary
}

const AboutTab: React.FC<AboutTabProps> = ({ dept }) => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Overview & Academic Mission</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {dept.aboutParagraphs && dept.aboutParagraphs.length > 0 ? (
          dept.aboutParagraphs.map((para, i) => (
            <p key={i} className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify" dangerouslySetInnerHTML={{ __html: para }} />
          ))
        ) : (
          <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify">
            The Department of <strong>{dept.name}</strong> at Shri G. S. Institute of Technology & Science remains a cornerstone of scholastic excellence. The division offers premium engineering tracks coupled with robust research infrastructure, ensuring that graduating students possess elite design skills, theoretical expertise, and practical insight.
          </p>
        )}
      </div>
      <div className="md:col-span-1">
        <div className="rounded border border-slate-200 overflow-hidden shadow-xs bg-slate-50">
          <div className="aspect-[4/3] bg-slate-100 relative">
            <img
              src={dept.imageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'}
              alt={`${dept.name} Representative Image`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-3 bg-white text-center border-t border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Branch Representative</span>
          </div>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div className="p-5 bg-white rounded border border-slate-200/80 space-y-3 flex flex-col hover:border-slate-350 transition-colors duration-200">
        <h3 className="text-xs font-bold text-accent uppercase tracking-wider">Infrastructure Highlights</h3>
        <ul className="text-xs text-slate-500 space-y-2 font-sans font-medium">
          {dept.infraHighlights && dept.infraHighlights.length > 0 ? (
            dept.infraHighlights.map((hl, i) => <li key={i} className="flex items-start gap-1.5">• {hl}</li>)
          ) : (
            <>
              <li className="flex items-start gap-1.5">• Dedicated Department Computer Center</li>
              <li className="flex items-start gap-1.5">• Advanced Hardware / Research Laboratories</li>
              <li className="flex items-start gap-1.5">• Comprehensive Reference Library with 5000+ volumes</li>
              <li className="flex items-start gap-1.5">• High-Speed Wi-Fi & LAN connectivity (10 Gbps backbone)</li>
            </>
          )}
        </ul>
      </div>
      <div className="p-5 bg-white rounded border border-slate-200/80 space-y-3 flex flex-col hover:border-slate-350 transition-colors duration-200">
        <h3 className="text-xs font-bold text-accent uppercase tracking-wider">Offered Programs & Intake</h3>
        <ul className="text-xs text-slate-500 space-y-2 font-sans font-medium">
          {dept.programsIntake && dept.programsIntake.length > 0 ? (
            dept.programsIntake.map((pi, i) => <li key={i} className="flex items-start gap-1.5">• {pi}</li>)
          ) : (
            <>
              <li className="flex items-start gap-1.5">• B.Tech / B.Pharma (4-Year Degree) - {dept.programsOffered.includes('UG') ? '120 Intake' : 'N/A'}</li>
              <li className="flex items-start gap-1.5">• M.Tech / M.Pharma / MBA (2-Year Degree) - {dept.programsOffered.includes('PG') ? '18-25 Intake' : 'N/A'}</li>
              <li className="flex items-start gap-1.5">• Ph.D (Doctoral Research) - {dept.programsOffered.includes('PhD') ? 'Active Scholars' : 'N/A'}</li>
              <li className="flex items-start gap-1.5">• Part-Time Degree Courses (PTDC) - {dept.programsOffered.includes('PTDC') ? 'Active Schemes' : 'N/A'}</li>
            </>
          )}
        </ul>
      </div>
    </div>
  </div>
)

export default AboutTab
