import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Heart, Clock, Phone, Mail, CheckCircle2 } from 'lucide-react'
import { getDispensary } from '../../services/facilitiesService'

const Dispensary: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getDispensary().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/dispensary" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Dispensary &amp; Health Centre</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Campus Medical Facility — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Services */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Services</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Medical Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.services || []).map((item: string) => (
            <div key={item} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <Heart size={14} className="text-accent shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specialist Visits */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Specialist Doctor Visits</h4>
        <div className="space-y-2">
          {(data.specialists || []).map((s: any, i: number) => (
            <div key={i} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
              <span className="font-medium text-slate-700">{s.specialty}</span>
              <span className="text-xs font-semibold text-slate-500">{s.schedule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* First Aid */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Emergency</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">First Aid &amp; Emergency Response</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.firstAidFacilities || []).map((item: string) => (
            <div key={item} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <CheckCircle2 size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timing & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Clock size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">OPD Timings</h4>
          </div>
          <div className="text-sm space-y-2 font-sans">
            <div className="flex justify-between">
              <span className="text-slate-600">OPD Hours</span>
              <span className="font-semibold">{data.opdHours}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Emergency</span>
              <span className="font-semibold">{data.emergencyHours}</span>
            </div>
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
              <span className="text-slate-600">{data.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-accent shrink-0" />
              <a href={`mailto:${data.email}`} className="text-accent-blue hover:underline">{data.email}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dispensary
