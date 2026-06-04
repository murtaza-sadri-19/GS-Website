import React, { useState, useEffect } from 'react'
import { Eye, Target, Quote } from 'lucide-react'
import { aboutService, visionMissionDefault, type VisionMissionData } from '../../services/aboutService'
import PageSeo from '../../components/global/PageSeo'

const VisionMission: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<VisionMissionData | null>(null)

  useEffect(() => {
    if (!previewData) aboutService.getVisionMission().then(setFetchedData)
  }, [previewData])

  const data: VisionMissionData = (previewData ?? fetchedData ?? visionMissionDefault) as VisionMissionData

  return (
    <div className="space-y-10">
      <PageSeo pageKey="about/vision-mission" />
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-accent">{data.pageBadge ?? 'Core Values'}</span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1 text-primary font-display">
          {data.pageTitle ?? 'Vision & Mission'}
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-semibold">
          {data.pageSubtitle ?? 'Our guiding principles for academic excellence & future-ready engineering leadership'}
        </p>
      </div>

      {/* Vision Section */}
      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center text-accent">
              <Eye size={20} className="stroke-[2]" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">{data.visionEyebrow ?? 'Where we stand'}</span>
              <h3 className="text-lg font-bold text-primary">{data.visionHeading ?? 'Our Vision'}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* English Vision */}
            <div className="bg-white rounded-md p-5 border border-slate-200 shadow-sm relative flex flex-col min-h-[120px]">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="text-xs uppercase font-bold text-accent">{data.visionEnglishLabel ?? 'English Version'}</span>
                <Quote size={14} className="text-accent/30" />
              </div>
              <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                {data.visionEnglish}
              </p>
            </div>

            {/* Hindi Vision */}
            <div className="bg-white rounded-md p-5 border border-slate-200 shadow-sm relative flex flex-col min-h-[120px]">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <span className="text-xs uppercase font-bold text-accent">{data.visionHindiLabel ?? 'Hindi Version'}</span>
                <Quote size={14} className="text-accent/30" />
              </div>
              <p className="text-slate-700 text-sm font-medium leading-relaxed italic">
                {data.visionHindi}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
            <Target size={20} className="stroke-[2]" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">{data.missionEyebrow ?? 'Our pathways'}</span>
            <h3 className="text-lg font-bold text-primary">{data.missionHeading ?? 'Our Mission'}</h3>
          </div>
        </div>

        <div className="space-y-3">
          {(data.missionPoints ?? []).map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-md bg-white border border-slate-200 shadow-sm"
            >
              <div className="w-8 h-8 rounded bg-white text-primary font-extrabold flex items-center justify-center shrink-0 border border-slate-200 text-sm shadow-sm">
                {item.num}
              </div>
              <div className="flex-grow pt-0.5">
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VisionMission
