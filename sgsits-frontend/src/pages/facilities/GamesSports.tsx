import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Award, CheckCircle2, Phone, Mail } from 'lucide-react'
import { getGamesSports } from '../../services/facilitiesService'

const GamesSports: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getGamesSports().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/games-sports" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Games &amp; Sports</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Sports Complex &amp; Recreation Centre — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.intro}</p>
      </div>

      {/* Sports Facilities */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Sports Facilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Sport / Facility</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {(data.sportsFacilities || []).map((row: any, i: number) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-bold text-primary">{row.name}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-600 font-medium">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
          <Award size={16} className="text-accent" />
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Notable Achievements</h4>
        </div>
        <div className="space-y-2">
          {(data.achievements || []).map((ach: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-accent font-bold shrink-0">🏆</span>
              <span className="text-slate-700 font-medium font-sans">{ach}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Indoor quick list */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Indoor</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Indoor Games &amp; Gymnasium</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Badminton — 4 courts (indoor sports hall)', 'Table Tennis — 6 tables in dedicated TT hall', 'Chess — Competition-grade boards and clocks', 'Carrom — 10 boards available', 'Gymnasium — fully equipped fitness center', 'Squash Court — 1 court (Main building)'].map((item) => (
            <div key={item} className="flex items-center gap-2.5 bg-white border border-slate-200 rounded px-3 py-2.5 text-sm">
              <CheckCircle2 size={14} className="text-slate-600 shrink-0" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white border border-slate-200 rounded p-5">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Sports Committee Contact</h4>
        <div className="flex flex-wrap gap-6 text-sm font-sans">
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-accent" />
            <span className="text-slate-600">{data.contactPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-accent" />
            <a href={`mailto:${data.contactEmail}`} className="text-accent-blue hover:underline">{data.contactEmail}</a>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-3">{data.contactName}</p>
      </div>
    </div>
  )
}

export default GamesSports
