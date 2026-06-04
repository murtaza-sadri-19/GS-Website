import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Building, Monitor, BookOpen, Dumbbell, Home, Wifi, FlaskConical, Theater, Cpu } from 'lucide-react'
import { aboutService, type InfrastructureData } from '../../services/aboutService'
import { Sk, SkeletonSimpleStat } from '../../components/ui/Skeleton'

const ITEM_ICON: Record<string, React.ElementType> = {
  'Academic Blocks':  Building,
  'Laboratories':     FlaskConical,
  'Central Library':  BookOpen,
  'Hostels':          Home,
  'Sports Complex':   Dumbbell,
  'Auditorium':       Theater,
  'Health Centre':    Cpu,
  'Computer Centre':  Monitor,
  'Wi-Fi Campus':     Wifi,
}
const DEFAULT_ICON = Building

const Infrastructure: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<InfrastructureData | null>(null)
  const [loading, setLoading] = useState<boolean>(!previewData)

  useEffect(() => {
    if (!previewData) {
      setLoading(true)
      aboutService.getInfrastructure().then(d => {
        setFetchedData(d)
        setLoading(false)
      })
    }
  }, [previewData])

  const data = (previewData ?? fetchedData ?? {}) as InfrastructureData

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/infrastructure" />
      <div className="border-b border-slate-200 pb-5">
        {loading ? (
          <>
            <Sk className="h-8 w-64 rounded mb-2" />
            <Sk className="h-4 w-80 rounded" />
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">
              {(data as any).pageTitle ?? 'Infrastructure'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {(data as any).pageSubtitle ?? ''}
            </p>
          </>
        )}
      </div>

      {loading ? (
        <Sk className="h-4 w-full rounded" />
      ) : (
        <p className="text-slate-700 text-sm leading-relaxed">{data.summary as string}</p>
      )}

      <div className="flex flex-wrap gap-4">
        {loading ? (
          <>
            <SkeletonSimpleStat />
            <SkeletonSimpleStat />
          </>
        ) : (
          <>
            <div className="bg-white rounded-md border border-slate-200 px-5 py-3 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                {(data as any).campusAreaLabel ?? 'Campus Area'}
              </p>
              <p className="text-xl font-extrabold mt-0.5 text-primary">{data.campusArea as string}</p>
            </div>
            <div className="bg-white rounded-md border border-slate-200 px-5 py-3 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                {(data as any).builtUpAreaLabel ?? 'Built-up Area'}
              </p>
              <p className="text-xl font-extrabold mt-0.5 text-accent">{data.builtUpArea as string}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-md border border-slate-200 p-5 shadow-sm" aria-hidden="true">
              <div className="flex items-start gap-4">
                <Sk className="w-12 h-12 rounded-md flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Sk className="h-4 w-32 rounded" />
                  <Sk className="h-5 w-40 rounded" />
                  <Sk className="h-3 w-full rounded" />
                  <Sk className="h-3 w-5/6 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : (
          ((data.items ?? []) as any[]).map((item: any) => {
            const Icon = ITEM_ICON[item.iconName ?? item.title] ?? DEFAULT_ICON
            const primaryStat = item.stats?.[0]
            return (
              <div key={item.title} className="bg-white rounded-md border border-slate-200 p-5 hover:border-slate-400 transition-colors shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 bg-primary">
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-primary">{item.title}</h3>
                    {primaryStat && (
                      <p className="text-lg font-bold mt-0.5 text-accent">
                        {primaryStat.label}: {primaryStat.value}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {!loading && ((data.additionalFacilities ?? []) as any[]).length > 0 && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-3 text-primary">
            {(data as any).additionalFacilitiesHeading ?? 'Additional Facilities'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-700">
            {((data.additionalFacilities ?? []) as string[]).map((fac) => (
              <div key={fac} className="flex items-center gap-2">
                <span className="text-accent">✓</span> {fac}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm" aria-hidden="true">
          <Sk className="h-5 w-48 rounded mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Sk key={i} className="h-4 w-full rounded" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Infrastructure
