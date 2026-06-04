import { SkeletonPage } from '../../components/ui/Skeleton'
import React, { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { getAboutInstitute } from '../../services/aboutService'
import type { AboutInstituteData } from '../../services/aboutService'
import PageSeo from '../../components/global/PageSeo'

const AboutInstitute: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<AboutInstituteData | null>(null)
  const [loading, setLoading] = useState(!previewData)

  useEffect(() => {
    if (!previewData) {
      getAboutInstitute()
        .then(res => { setFetchedData(res); setLoading(false) })
        .catch(() => { setLoading(false) })
    }
  }, [previewData])

  const data = previewData ?? fetchedData

  if (loading || !data) return <SkeletonPage />

  return (
    <div className="space-y-12">
      <PageSeo pageKey="about/institute" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">{(data.sectionLabel as string) ?? "Institute Overview"}</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
          {(data.pageTitle as string) ?? "ABOUT the INSTITUTE"}
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 font-sans uppercase tracking-wider">
          {(data.instituteName as string) ?? "Shri Govindram Seksaria Institute of Technology & Science, Indore"}
        </p>
      </div>

      {/* Styled Introduction Narrative */}
      <div className="border-l-2 border-accent pl-6">
        <div className="text-slate-600 space-y-4 text-sm leading-relaxed font-sans text-justify">
          {(data.narrativeParagraphs ?? []).map((para, index) => (
            <p 
              key={index} 
              className={index === 0 ? "text-base text-slate-800 leading-relaxed font-medium" : "text-slate-600"}
              dangerouslySetInnerHTML={{ __html: para }}
            />
          ))}
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="space-y-6 pt-2">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">{(data.highlightsSectionLabel as string) ?? "Institutional Strengths"}</span>
          <h3 className="text-xl font-display font-bold text-slate-900">{(data.highlightsSectionTitle as string) ?? "Key Highlights"}</h3>
          <div className="w-12 h-[2px] bg-accent mt-2"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(data.highlights ?? []).map((item, idx) => {
            const Icon = (Icons as any)[item.iconName] || Icons.Building2
            return (
              <div 
                key={idx} 
                className="bg-white rounded border border-slate-200/80 p-5 hover:border-slate-400 transition-colors duration-200 flex flex-col group"
              >
                <div className="w-9 h-9 rounded bg-slate-50 border border-slate-200/60 flex items-center justify-center text-accent-blue mb-4 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-200">
                  <Icon size={16} strokeWidth={1.75} />
                </div>
                <p className="text-3xl font-display font-bold text-primary tracking-tight leading-none">
                  {item.value}
                </p>
                <p className="text-xs font-sans font-bold text-slate-800 mt-3 uppercase tracking-wider">{item.label}</p>
                <p className="text-xs text-slate-500 mt-1 font-sans font-medium leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Affiliations & Certifications Section */}
      <div className="bg-slate-50 rounded border border-slate-200/80 p-6 border-l-2 border-l-primary">
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">{(data.affiliationsSectionLabel as string) ?? "Accreditation & Approvals"}</span>
            <h3 className="text-xl font-display font-bold text-slate-900">{(data.affiliationsSectionTitle as string) ?? "Affiliations & Recognition"}</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans font-medium">{(data.affiliationsSubtitle as string) ?? "Approved and recognized by national regulatory and statutory bodies"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(data.affiliations ?? []).map((text, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-3 p-3 rounded border border-slate-200 bg-white"
              >
                <Icons.CheckCircle2 size={16} className="text-slate-700 shrink-0 mt-0.5" strokeWidth={2} />
                <span className="text-xs font-sans font-semibold text-slate-700 leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutInstitute

