import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { aboutService, directorMessageDefault, type DirectorMessageData } from '../../services/aboutService'
import PageSeo from '../../components/global/PageSeo'

const DirectorMessage: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<DirectorMessageData | null>(null)

  useEffect(() => {
    if (!previewData) aboutService.getDirectorMessage().then(setFetchedData)
  }, [previewData])

  const data: DirectorMessageData = (previewData ?? fetchedData ?? directorMessageDefault) as DirectorMessageData

  return (
    <div className="space-y-10">
      <PageSeo pageKey="about/director-message" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-accent">{(data.pageBadge as string) ?? 'Leadership'}</span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-primary font-display">
          {(data.pageTitle as string) ?? "Director's Message"}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-semibold">
          {(data.pageSubtitle as string) ?? 'A vision statement from our Director'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Director Photo & Info Card */}
        <div className="w-full lg:w-96 shrink-0 mx-auto max-w-sm lg:max-w-none lg:sticky lg:top-24">
          <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
            {/* Clean elegant academic image container */}
            <div className="bg-white flex items-center justify-center p-4 border-b border-slate-200">
              <div className="w-full aspect-[3/2] overflow-hidden rounded border border-slate-200">
                <img 
                  src={data.directorPhotoUrl} 
                  alt={data.directorName} 
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/image.png";
                  }}
                />
              </div>
            </div>

            {/* Profile Info Details */}
            <div className="p-5 text-center space-y-4">
              <div>
                <h3 className="font-bold text-lg text-primary">
                  {data.directorName}
                </h3>
                <p className="text-xs uppercase tracking-wider font-bold text-accent mt-1">{(data.directorTitle as string) ?? 'Director'}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{(data.institutionShortName as string) ?? 'SGSITS Indore'}</p>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2 text-xs font-semibold text-slate-600">
                <a 
                  href={`mailto:${data.directorEmail}`} 
                  className="flex items-center justify-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail size={13} className="text-accent shrink-0 stroke-[2.5]" /> 
                  {data.directorEmail}
                </a>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={13} className="text-accent shrink-0 stroke-[2.5]" /> 
                  {data.directorPhone}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={13} className="text-accent shrink-0 stroke-[2.5]" /> 
                  {data.directorOffice}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Director's Written Message */}
        <div className="flex-1 space-y-6">
          {/* Clean editorial quote block */}
          {data.quote && (
            <div className="bg-white rounded-md p-5 border border-slate-200 border-l-4 border-l-accent shadow-sm">
              <p className="text-slate-800 text-sm font-semibold italic leading-relaxed">
                "{data.quote}"
              </p>
            </div>
          )}

          <div className="prose max-w-none text-slate-700 space-y-4 text-sm leading-relaxed">
            {(data.paragraphs ?? []).map((para, idx) => (
              <p 
                key={idx} 
                className={idx === 0 ? "font-semibold text-primary text-sm" : ""}
                dangerouslySetInnerHTML={{ __html: para }} 
              />
            ))}
            
            <div className="pt-6 border-t border-slate-200 space-y-1">
              <p className="font-bold text-sm text-primary">
                {data.directorName as string}
              </p>
              <p className="text-xs font-semibold text-accent">{(data.signatureTitle as string) ?? 'Director, SGSITS Indore'}</p>
              <p className="text-xs text-slate-500 font-medium">{(data.institutionFullName as string) ?? 'Shri G. S. Institute of Technology & Science'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectorMessage
