import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { CheckCircle2, Phone, Mail } from 'lucide-react'
import { getSSS } from '../../services/studentsService'

const SSS: React.FC = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getSSS().then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="students/sss" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Student Welfare</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Students' Support Services (SSS)</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Student Support — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Services */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Services</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Support Services Offered</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.services || []).map((svc: any, i: number) => (
            <div key={i} className="bg-white border border-slate-200 rounded p-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                <CheckCircle2 size={14} className="text-accent shrink-0" />
                <h4 className="font-bold text-sm text-primary">{svc.title}</h4>
              </div>
              <p className="text-sm text-slate-600 font-sans">{svc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Contact SSS</h4>
        <div className="flex flex-wrap gap-4 text-sm font-sans">
          <div className="flex items-center gap-2">
            <Phone size={13} className="text-accent" />
            <span className="text-slate-600">{data.contactPhone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-accent" />
            <a href={`mailto:${data.contactEmail}`} className="text-accent-blue hover:underline">{data.contactEmail}</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SSS
