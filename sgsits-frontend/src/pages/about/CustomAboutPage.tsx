import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { aboutService, type CustomPageData } from '../../services/aboutService'

const CustomAboutPage: React.FC = () => {
  const { customPath } = useParams<{ customPath: string }>()
  const [data, setData] = useState<CustomPageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!customPath) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    aboutService.getCustomPage(customPath)
      .then(res => {
        setData(res)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching custom page:', err)
        setData(null)
        setLoading(false)
      })
  }, [customPath])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Fallback view when a path doesn't have drafted content yet
  if (!data) {
    return (
      <div className="space-y-8 bg-white py-12 text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-200 text-slate-400">
          <Icons.FileQuestion size={28} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-slate-800">Page Content Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This route has been registered in the navigation tree, but its page content has not been drafted inside the Central CMS workspace yet.
          </p>
        </div>
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 bg-[#0b2545] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm hover:opacity-90"
          >
            Go to Homepage
          </Link>
          <Link
            to="/dashboard/central-admin/pages"
            className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-md hover:bg-slate-50"
          >
            Open Central CMS
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 bg-white">
      {/* Dynamic Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Institute Profile</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="text-xs font-semibold text-slate-500 mt-1 font-sans uppercase tracking-wider leading-relaxed">
            {data.subtitle}
          </p>
        )}
      </div>

      {/* Narrative Paragraphs */}
      {data.narrativeParagraphs && data.narrativeParagraphs.length > 0 && (
        <div className="border-l-2 border-accent pl-6">
          <div className="text-slate-650 space-y-4 text-sm leading-relaxed font-sans text-justify">
            {data.narrativeParagraphs.map((para, index) => (
              <p
                key={index}
                className={index === 0 ? "text-base text-slate-800 leading-relaxed font-medium" : "text-slate-650"}
                dangerouslySetInnerHTML={{ __html: para }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Highlights Grid */}
      {data.highlights && data.highlights.length > 0 && (
        <div className="space-y-6 pt-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Highlights</span>
            <h3 className="text-xl font-display font-bold text-slate-900">Key Markers</h3>
            <div className="w-12 h-[2px] bg-accent mt-2"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.highlights.map((item, idx) => {
              const Icon = (Icons as any)[item.iconName] || Icons.FileText
              return (
                <div
                  key={idx}
                  className="bg-white rounded border border-slate-200/80 p-5 hover:border-slate-400 transition-colors duration-200 flex flex-col group shadow-2xs"
                >
                  <div className="w-9 h-9 rounded bg-slate-50 border border-slate-200/60 flex items-center justify-center text-[#bfa15f] mb-4 group-hover:bg-[#0b2545] group-hover:border-[#0b2545] group-hover:text-white transition-all duration-200">
                    <Icon size={16} strokeWidth={1.75} />
                  </div>
                  <p className="text-3xl font-display font-bold text-[#0b2545] tracking-tight leading-none">
                    {item.value}
                  </p>
                  <p className="text-xs font-sans font-bold text-slate-800 mt-3 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-1 font-sans font-medium leading-relaxed">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Affiliations Section */}
      {data.affiliations && data.affiliations.length > 0 && (
        <div className="bg-slate-50 rounded border border-slate-200/80 p-6 border-l-2 border-l-[#0b2545]">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Governance & Recognitions</span>
              <h3 className="text-xl font-display font-bold text-slate-900">Accreditation & Approvals</h3>
              <p className="text-xs text-slate-500 mt-1 font-sans font-medium">Approved and recognized by national regulatory bodies</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.affiliations.map((text, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded border border-slate-200 bg-white"
                >
                  <Icons.CheckCircle2 size={16} className="text-[#0b2545] shrink-0 mt-0.5" strokeWidth={2} />
                  <span className="text-xs font-sans font-semibold text-slate-700 leading-relaxed">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomAboutPage
