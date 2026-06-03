import React from 'react'
import { BookOpen, Building } from 'lucide-react'

const ResearchTab: React.FC = () => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Research Journals & Core Labs</h2>
    </div>
    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans text-justify">
      The department remains highly active in technical publications (IEEE, Springer, ScienceDirect), industrial consultation works, and central research projects sponsored by government bodies.
    </p>
    <div className="space-y-4 pt-4">
      <div className="p-5 border border-slate-200 rounded space-y-3 bg-white">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent-blue" strokeWidth={1.75} />Sponsored Research Grants
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
          Ongoing research projects funded by DST (Department of Science & Technology), AICTE, and state councils totaling over ₹1.2 Crores in active instrumentation grants.
        </p>
      </div>
      <div className="p-5 border border-slate-200 rounded space-y-3 bg-white">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-accent-blue" strokeWidth={1.75} />Core Research Laboratories
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
          State-of-the-art computational infrastructure featuring CAD/CAM modeling systems, hardware accelerators, VLSI emulation suites, and specialized chemical instrumentation centers.
        </p>
      </div>
    </div>
  </div>
)

export default ResearchTab
