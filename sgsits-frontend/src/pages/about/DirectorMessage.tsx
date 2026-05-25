import React, { useState, useEffect } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { aboutService, directorMessageDefault, type DirectorMessageData } from '../../services/aboutService'
import PageSeo from '../../components/global/PageSeo'

const DirectorMessage: React.FC = () => {
  const [data, setData] = useState<DirectorMessageData>(directorMessageDefault)

  useEffect(() => {
    aboutService.getDirectorMessage().then(setData)
  }, [])

  return (
    <div className="space-y-10">
      <PageSeo pageKey="about/director-message" />
      {/* Page Header */}
      <div className="border-b border-gray-100 pb-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-accent">Leadership</span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-primary font-display">
          Director's Message
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-semibold">
          A vision statement from our Director
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Director Photo & Info Card */}
        <div className="w-full lg:w-96 shrink-0 mx-auto max-w-sm lg:max-w-none lg:sticky lg:top-24">
          <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
            {/* Clean elegant academic image container */}
            <div className="bg-white flex items-center justify-center p-4 border-b border-gray-150">
              <div className="w-full aspect-[3/2] overflow-hidden rounded border border-gray-200">
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
                <p className="text-xs uppercase tracking-wider font-bold text-accent mt-1">Director</p>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">SGSITS Indore</p>
              </div>

              <div className="border-t border-gray-150 pt-4 space-y-2 text-xs font-semibold text-slate-600">
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

          <div className="prose max-w-none text-slate-700 space-y-4 text-[14.5px] leading-relaxed">
            {data.paragraphs.map((para, idx) => (
              <p 
                key={idx} 
                className={idx === 0 ? "font-semibold text-primary text-[15px]" : ""}
                dangerouslySetInnerHTML={{ __html: para }} 
              />
            ))}
            
            <div className="pt-6 border-t border-gray-150 space-y-1">
              <p className="font-bold text-[15px] text-primary">
                {data.directorName}
              </p>
              <p className="text-xs font-semibold text-accent">Director, SGSITS Indore</p>
              <p className="text-[11px] text-slate-500 font-medium">Shri G. S. Institute of Technology & Science</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectorMessage
