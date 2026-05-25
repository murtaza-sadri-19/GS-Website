import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Building, Monitor, BookOpen, Dumbbell, Home, Wifi, FlaskConical, Theater, Cpu } from 'lucide-react'
import { aboutService, infrastructureDefault, type InfrastructureData } from '../../services/aboutService'

// Icon map — UI concern, not backend data
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

const Infrastructure: React.FC = () => {
  const [data, setData] = useState<InfrastructureData>(infrastructureDefault)

  useEffect(() => {
    aboutService.getInfrastructure().then(setData)
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/infrastructure" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Infrastructure</h2>
        <p className="text-sm text-gray-500 mt-1">World-class facilities for holistic development</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.summary}</p>

      {/* Campus stats */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-white rounded-md border border-slate-200 px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Campus Area</p>
          <p className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--color-primary)' }}>{data.campusArea}</p>
        </div>
        <div className="bg-white rounded-md border border-slate-200 px-5 py-3 shadow-sm">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Built-up Area</p>
          <p className="text-xl font-extrabold mt-0.5" style={{ color: 'var(--color-accent)' }}>{data.builtUpArea}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {data.items.map((item) => {
          const Icon = ITEM_ICON[item.title] ?? DEFAULT_ICON
          const primaryStat = item.stats?.[0]
          return (
            <div key={item.title} className="bg-white rounded-md border border-slate-200 p-5 hover:border-slate-400 transition-colors shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-primary)' }}>{item.title}</h3>
                  {primaryStat && (
                    <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--color-accent)' }}>
                      {primaryStat.label}: {primaryStat.value}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {data.additionalFacilities.length > 0 && (
        <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Additional Facilities</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700">
            {data.additionalFacilities.map((fac) => (
              <div key={fac} className="flex items-center gap-2">
                <span style={{ color: 'var(--color-accent)' }}>✓</span> {fac}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Infrastructure
