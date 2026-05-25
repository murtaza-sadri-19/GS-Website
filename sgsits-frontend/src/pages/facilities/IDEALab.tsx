import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Zap, CheckCircle2, Phone, Mail, ExternalLink } from 'lucide-react'
import { getIDEALab } from '../../services/facilitiesService'

const IDEALab: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getIDEALab().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/idea-lab" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">IDEA Lab</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Innovation, Design, Entrepreneurship &amp; Allied Activities Laboratory — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(data.stats || []).map((s: any) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Equipment */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Equipment</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Equipment &amp; Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.equipment || []).map((item: string) => (
            <div key={item} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <CheckCircle2 size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Focus Areas</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Lab Focus Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.focusAreas || []).map((area: any) => (
            <div key={area.title} className="bg-white border border-slate-200 rounded p-4 hover:border-slate-400 transition-colors">
              <div className="flex items-start gap-2 mb-2">
                <Zap size={15} className="text-accent shrink-0" />
                <h4 className="font-bold text-sm text-slate-800">{area.title}</h4>
              </div>
              <p className="text-[12px] text-slate-500 font-medium font-sans leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-primary text-white rounded p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold font-display text-base">Visit the IDEA Lab</h4>
          <p className="text-sm text-slate-300 mt-1">Registered students can access the lab during working hours with faculty permission.</p>
          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-accent" />
              <span>{data.contactPhone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-accent" />
              <a href={`mailto:${data.contactEmail}`} className="hover:underline">{data.contactEmail}</a>
            </div>
          </div>
        </div>
        <a
          href="https://sgsits.ac.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded text-xs font-bold hover:bg-accent/90 transition-colors shrink-0"
        >
          IDEA Lab Portal <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

export default IDEALab
