import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Dumbbell, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react'
import { getGymnasium } from '../../services/facilitiesService'

const Gymnasium: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getGymnasium().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/gymnasium" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Gymnasium</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Fitness &amp; Wellness Centre — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(data.stats || []).map((s: any) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Equipment */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Equipment</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Gym Equipment</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.equipment || []).map((item: string) => (
            <div key={item} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <Dumbbell size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Clock size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Timings</h4>
          </div>
          <div className="space-y-2 text-sm font-sans">
            {(data.timings || []).map((t: any, i: number) => (
              <div key={i} className="flex justify-between border-b border-slate-100 pb-1 last:border-0">
                <span className="text-slate-600">{t.slot}</span>
                <span className="font-semibold">{t.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Phone size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Contact</h4>
          </div>
          <div className="space-y-3 text-sm font-sans">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-accent shrink-0" />
              <span className="text-slate-600">{data.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-accent shrink-0" />
              <a href={`mailto:${data.contactEmail}`} className="text-accent-blue hover:underline">{data.contactEmail}</a>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {['Free access for enrolled students', 'Nominal fee for staff members', 'Certified physical trainer available'].map((note, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-slate-600 shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium">{note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Gymnasium
