import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { Shield, CheckCircle2, Award, Phone, Mail } from 'lucide-react'
import { getNCC } from '../../services/studentsService'

const NCC: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  useEffect(() => { if (!previewData) getNCC().then(setFetchedData) }, [previewData])
  const data = previewData ?? fetchedData

  if (!data) return <SkeletonPage />

  return (
    <div className="space-y-10">
      <PageSeo pageKey="students/ncc" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Student Welfare</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">NCC Wing</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">{data.unitDetails}</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Key Info */}
      {(data.stats || []).length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {(data.stats as { value: string; label: string }[]).map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
              <p className="text-xl font-display font-bold text-primary">{s.value}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Activities */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Activities</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">NCC Activities &amp; Training</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.activities || []).map((act: string, i: number) => (
            <div key={i} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <Shield size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{act}</span>
            </div>
          ))}
        </div>
      </div>

      {(data.certificates || []).length > 0 && (
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Certification</span>
          <h3 className="text-xl font-display font-bold text-slate-900 mb-4">NCC Certificates &amp; Benefits</h3>
          <div className="space-y-3">
            {(data.certificates as { cert: string; desc: string }[]).map((b) => (
              <div key={b.cert} className="flex items-start gap-3 bg-white border border-slate-200 rounded p-4">
                <Award size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-primary">{b.cert}</h4>
                  <p className="text-sm text-slate-600 font-medium font-sans mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {(data.enrollmentRules || []).length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <CheckCircle2 size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">How to Enroll</h4>
          </div>
          <div className="text-sm text-slate-600 space-y-2 font-sans">
            {(data.enrollmentRules as string[]).map((rule: string, i: number) => (
              <p key={i}>• {rule}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-sans">
            {data.officerContact && (
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-accent" />
                <span className="text-slate-600">{data.officerContact}</span>
              </div>
            )}
            {data.officerEmail && (
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-accent" />
                <a href={`mailto:${data.officerEmail}`} className="text-accent-blue hover:underline">{data.officerEmail}</a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NCC
