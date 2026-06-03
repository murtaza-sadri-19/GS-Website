import React from 'react'
import { Award } from 'lucide-react'

const AchievementsTab: React.FC = () => (
  <div className="space-y-6">
    <div className="pb-3 border-b border-slate-200">
      <h2 className="text-xl font-display font-bold text-slate-900">Placements & National Rank Lists</h2>
    </div>
    <p className="text-xs md:text-sm text-slate-655 leading-relaxed font-sans">
      Highlights of top department graduates, GATE score accomplishments, and placement logs from our Training & Placement (T&P) portal alignment.
    </p>
    <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-4 pt-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Award className="w-5 h-5 text-accent" strokeWidth={1.5} />
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Recent Placements Spotlights</h4>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs font-sans">
        <div className="p-3 bg-white border border-slate-200 rounded">
          <p className="font-bold text-primary text-base">₹18.5 LPA</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Highest Package Secured</p>
        </div>
        <div className="p-3 bg-white border border-slate-200 rounded">
          <p className="font-bold text-primary text-base">92.4%</p>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Overall Branch Placement Log</p>
        </div>
      </div>
    </div>
  </div>
)

export default AchievementsTab
