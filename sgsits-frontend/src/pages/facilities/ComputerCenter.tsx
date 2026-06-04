import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { Cpu, Wifi, Clock, Database, Terminal } from 'lucide-react'
import { getComputerCenter } from '../../services/facilitiesService'

const SPEC_ICON: Record<string, React.ElementType> = { Wifi, Clock, Database, Terminal, Cpu }

const ComputerCenter: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  useEffect(() => { if (!previewData) getComputerCenter().then(setFetchedData) }, [previewData])
  const data = previewData ?? fetchedData
  if (!data) return <SkeletonPage />

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/computer-center" />
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-accent">Facilities</span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-primary dark:text-white font-display">
          Computer Center
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">
          {data.intro}
        </p>
      </div>

      {/* Main Core Highlight Card */}
      <div className="bg-primary text-white rounded-lg p-6 md:p-8 border-l-4 border-accent relative shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl relative z-10">
          {data.heroBadge && (
            <span className="bg-accent/15 text-accent border border-accent/20 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Cpu size={12} />
              {data.heroBadge}
            </span>
          )}
          {data.heroTitle && (
            <h3 className="text-xl md:text-3xl font-bold font-display leading-tight">{data.heroTitle}</h3>
          )}
          {data.heroDesc && (
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">{data.heroDesc}</p>
          )}
        </div>

        <div className="flex gap-4 shrink-0 bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 md:p-6 relative z-10 w-full md:w-auto justify-around">
          {(data.stats || []).slice(0,3).map((s: any, i: number) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-accent font-display">{s.value}</p>
              <p className="text-xs uppercase font-bold text-slate-300 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {(data.keySpecs || []).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.keySpecs as { iconName?: string; title: string; desc: string }[]).map((item, idx) => {
            const Icon = (item.iconName && SPEC_ICON[item.iconName]) ? SPEC_ICON[item.iconName] : Database
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-lg shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-accent">
                    <Icon size={20} className="stroke-[2]" />
                  </div>
                  <h4 className="text-base font-extrabold text-primary dark:text-white font-display">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Software stack section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-accent/10 dark:bg-accent/15 flex items-center justify-center text-accent">
            <Terminal size={20} className="stroke-[2]" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Fully Licensed Tools</span>
            <h3 className="text-lg font-bold text-primary dark:text-white font-display">Software &amp; Services</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {(data.software || []).map((item: string, key: number) => (
            <span
              key={key}
              className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-400 cursor-default shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComputerCenter
