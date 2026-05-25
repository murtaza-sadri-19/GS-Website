import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Wrench, CheckCircle2, Clock, Phone, Mail } from 'lucide-react'
import { getWorkshop } from '../../services/facilitiesService'

const Workshop: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getWorkshop().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/workshop" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Central Workshop</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Hands-on Manufacturing &amp; Fabrication Facility — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Workshop Sections */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Workshop Sections</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Shop Sections &amp; Facilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.shops || []).map((shop: any) => (
            <div key={shop.name} className="bg-white border border-slate-200 rounded p-4 flex items-start gap-3 hover:border-slate-400 transition-colors">
              <Wrench size={16} className="text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
              <div>
                <h4 className="font-bold text-sm text-slate-800">{shop.name}</h4>
                <p className="text-[12px] text-slate-500 mt-1 font-medium font-sans leading-relaxed">{shop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Equipment */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Modern &amp; CNC Equipment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(data.modernEquipment || []).map((item: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <CheckCircle2 size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-600 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Timings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Clock size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Timings</h4>
          </div>
          <div className="text-sm space-y-2 font-sans">
            {(data.timings || []).map((t: any, i: number) => (
              <div key={i} className="flex justify-between">
                <span className="text-slate-600">{t.day}</span>
                <span className="font-semibold">{t.hours}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Phone size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Contact</h4>
          </div>
          <div className="space-y-2 text-sm font-sans">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-accent shrink-0" />
              <span className="text-slate-600">{data.contactPhone} (Workshop Incharge)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-accent shrink-0" />
              <a href={`mailto:${data.contactEmail}`} className="text-accent-blue hover:underline">{data.contactEmail}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Workshop
