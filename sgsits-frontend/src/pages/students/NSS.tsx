import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Heart, CheckCircle2, Award, Phone, Mail } from 'lucide-react'
import { getNSS } from '../../services/studentsService'

const NSS: React.FC = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    getNSS().then(setData)
  }, [])

  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="students/nss" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Student Welfare</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">NSS Wing</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">{data.unitDetails}</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: '2', label: 'NSS Units' },
          { value: `${data.enrolledVolunteers}+`, label: 'Active Volunteers' },
          { value: '500+', label: 'Blood Units/Year' },
          { value: '1000+', label: 'Trees Planted' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Activities */}
      <div className="space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block">Activities</span>
        <h3 className="text-xl font-display font-bold text-slate-900 -mt-2">NSS Activities &amp; Programs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.activities || []).map((act: string, i: number) => (
            <div key={i} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <Heart size={13} className="text-accent shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      {(data.achievements || []).length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Award size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Achievements</h4>
          </div>
          <div className="space-y-2">
            {(data.achievements || []).map((a: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-accent font-bold shrink-0">🏆</span>
                <span className="text-slate-700 font-medium font-sans">{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How to Join */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Award size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">NSS Benefits</h4>
          </div>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <p>• NSS Certificate awarded after 2 years of active service</p>
            <p>• Grace marks in university examinations (as per RGPV/DAVV norms)</p>
            <p>• Priority in hostel allotment for active NSS volunteers</p>
            <p>• Award certificates at state and national level for outstanding volunteers</p>
            <p>• Eligibility for NSS Republic Day Camp (National Level)</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">How to Join NSS</h4>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <p>• Open to all UG/PG students of SGSITS</p>
            <p>• Registration at beginning of academic year through DSW office</p>
            <p>• Minimum 120 hours of service per year required for certificate</p>
            <p>• No prior experience required — training provided</p>
          </div>
          <div className="mt-4 space-y-2 text-sm font-sans">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-accent" />
              <span className="text-slate-600">{data.programOfficerContact}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-accent" />
              <a href={`mailto:${data.programOfficerContact}`} className="text-accent-blue hover:underline">{data.programOfficerContact}</a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 text-sm">
        <CheckCircle2 size={13} className="text-slate-400 shrink-0 mt-0.5" />
        <span className="text-slate-600 font-medium">NSS Program Officer: {data.programOfficerName}</span>
      </div>
    </div>
  )
}

export default NSS
