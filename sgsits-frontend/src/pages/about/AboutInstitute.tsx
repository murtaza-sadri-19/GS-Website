import React, { useState, useEffect } from 'react'
import * as Icons from 'lucide-react'
import { getAboutInstitute } from '../../services/aboutService'
import type { AboutInstituteData } from '../../services/aboutService'
import PageSeo from '../../components/global/PageSeo'

const AboutInstitute: React.FC = () => {
  const [data, setData] = useState<AboutInstituteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAboutInstitute()
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching about institute data:', err)
        setLoading(false)
      })
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-12 bg-white">
      <PageSeo pageKey="about/institute" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Institute Overview</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
          ABOUT the <span className="font-serif italic font-semibold text-primary">INSTITUTE</span>
        </h2>
        <p className="text-xs font-semibold text-slate-500 mt-1 font-sans uppercase tracking-wider">
          Shri Govindram Seksaria Institute of Technology & Science, Indore
        </p>
      </div>

      {/* Styled Introduction Narrative */}
      <div className="border-l-2 border-accent pl-6">
        <div className="text-slate-650 space-y-4 text-sm leading-relaxed font-sans text-justify">
          {data.narrativeParagraphs.map((para, index) => (
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
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Institutional Strengths</span>
          <h3 className="text-xl font-display font-bold text-slate-900">Key Highlights</h3>
          <div className="w-12 h-[2px] bg-accent mt-2"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.highlights.map((item, idx) => {
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
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Accreditation & Approvals</span>
            <h3 className="text-xl font-display font-bold text-slate-900">Affiliations & Recognition</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans font-medium">Approved and recognized by national regulatory and statutory bodies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.affiliations.map((text, idx) => (
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

