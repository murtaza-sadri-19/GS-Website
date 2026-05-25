import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Lightbulb, Rocket, CheckCircle2, ExternalLink, Phone, Mail } from 'lucide-react'
import { getCIDI } from '../../services/facilitiesService'

const CIDI: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getCIDI().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/cidi" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">CIDI — Centre for Innovation, Design &amp; Incubation</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Student Startup &amp; Innovation Ecosystem — SGSITS Indore</p>
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

      {/* Facilities */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Infrastructure</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Facilities Available</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.facilities || []).map((item: string) => (
            <div key={item} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <CheckCircle2 size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Programs */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Programs</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Innovation Programs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.programs || []).map((prog: any) => (
            <div key={prog.title} className="bg-white border border-slate-200 rounded p-4 hover:border-slate-400 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Rocket size={15} className="text-accent shrink-0" />
                  <h4 className="font-bold text-sm text-slate-800">{prog.title}</h4>
                </div>
                <span className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-semibold">{prog.freq}</span>
              </div>
              <p className="text-[12px] text-slate-500 font-medium font-sans leading-relaxed">{prog.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-primary text-white rounded p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lightbulb size={18} className="text-accent" />
            <h4 className="font-bold font-display text-base">Want to Incubate Your Idea?</h4>
          </div>
          <p className="text-sm text-slate-300 font-sans">Submit your innovation proposal to CIDI. Mentors will guide you through the incubation journey.</p>
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
          href="https://startupindia.gov.in"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded text-xs font-bold hover:bg-accent/90 transition-colors shrink-0"
        >
          Startup India <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

export default CIDI
