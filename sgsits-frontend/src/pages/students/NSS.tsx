import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { Heart, CheckCircle2, Award, Phone, Mail } from 'lucide-react'
import { getNSS } from '../../services/studentsService'

const NSS: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  useEffect(() => { if (!previewData) getNSS().then(setFetchedData) }, [previewData])
  const data = previewData ?? fetchedData
  if (!data) return <SkeletonPage />

  return (
    <div className="space-y-10">
      <PageSeo pageKey="students/nss" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Student Welfare</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">NSS Wing</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">{data.unitDetails}</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {(data.stats || []).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(data.stats as { value: string; label: string }[]).map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
              <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Activities */}
      <div className="space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block">Activities</span>
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
        {(data.benefits || []).length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded p-5">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
              <Award size={16} className="text-accent" />
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider">NSS Benefits</h4>
            </div>
            <div className="space-y-2 text-sm text-slate-600 font-sans">
              {(data.benefits as string[]).map((b: string, i: number) => (
                <p key={i}>• {b}</p>
              ))}
            </div>
          </div>
        )}
        {(data.joinSteps || []).length > 0 && (
          <div className="bg-white border border-slate-200 rounded p-5">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">How to Join NSS</h4>
            <div className="space-y-2 text-sm text-slate-600 font-sans">
              {(data.joinSteps as string[]).map((step: string, i: number) => (
                <p key={i}>• {step}</p>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm font-sans">
              {data.programOfficerContact && (
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-accent" />
                  <span className="text-slate-600">{data.programOfficerContact}</span>
                </div>
              )}
              {data.programOfficerEmail && (
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-accent" />
                  <a href={`mailto:${data.programOfficerEmail}`} className="text-accent-blue hover:underline">{data.programOfficerEmail}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 text-sm">
        <CheckCircle2 size={13} className="text-slate-400 shrink-0 mt-0.5" />
        <span className="text-slate-600 font-medium">NSS Program Officer: {data.programOfficerName}</span>
      </div>
    </div>
  )
}

export default NSS
