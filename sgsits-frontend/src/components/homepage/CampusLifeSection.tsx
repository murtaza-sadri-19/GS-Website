import React from 'react'
import { Link } from 'react-router-dom'
import { Building } from 'lucide-react'
import { C, ICON_MAP } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface CampusLifeSectionProps {
  section: Record<string, any>
  loading: boolean
}

const SkeletonCampusLife: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-hidden="true">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-white rounded overflow-hidden flex flex-col border" style={{ borderColor: C.navy15 }}>
        <Sk className="h-48 w-full rounded-none" />
        <div className="p-5 flex flex-col grow space-y-2">
          <div className="flex items-center gap-2">
            <Sk className="w-4 h-4 rounded shrink-0" />
            <Sk className="h-4 w-40 rounded" />
          </div>
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
          <Sk className="h-3 w-4/6 rounded" />
        </div>
      </div>
    ))}
  </div>
)

const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({ section, loading }) => (
  <section className="py-16 bg-white relative z-10">
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
      <div className="text-center mb-12">
        {loading ? (
          <div className="space-y-3" aria-hidden="true">
            <Sk className="h-2.5 w-28 mx-auto rounded" />
            <Sk className="h-8 w-72 mx-auto rounded" />
            <div className="w-12 h-[2px] mx-auto bg-slate-200 rounded" />
            <Sk className="h-3.5 w-80 mx-auto rounded" />
          </div>
        ) : (
          <div className="animate-fade-in">
            <span className="text-xs uppercase font-bold tracking-widest block mb-1" style={{ color: C.gold }}>
              {section.label}
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight uppercase mb-2" style={{ color: C.navy }}>
              {section.heading}{' '}
              <span className="font-serif italic font-semibold" style={{ color: C.navy }}>{section.accentText}</span>
            </h2>
            <div className="w-12 h-[2px] mx-auto mb-4" style={{ backgroundColor: C.gold }} />
            <p className="text-sm max-w-xl mx-auto font-sans" style={{ color: C.navy60 }}>
              {section.description}
            </p>
          </div>
        )}
      </div>

      {loading ? (
        <SkeletonCampusLife />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {(section.facilities ?? []).map((facility: Record<string, any>) => {
            const FacIcon = ICON_MAP[facility.iconName] ?? Building
            return (
              <Link
                key={facility.id}
                to={facility.to ?? '#'}
                className="bg-white rounded overflow-hidden group hover:shadow-md transition-all duration-200 flex flex-col border"
                style={{ borderColor: C.navy15 }}
              >
                <div className="h-48 overflow-hidden relative border-b" style={{ borderColor: C.navy10 }}>
                  <img
                    src={facility.imageUrl || undefined}
                    alt={facility.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 transition-all duration-300 group-hover:opacity-0"
                    style={{ backgroundColor: C.navy15 }}
                  />
                </div>
                <div className="p-5 flex flex-col grow">
                  <h3
                    className="text-base font-display font-bold mb-2 flex items-center group-hover:underline"
                    style={{ color: C.navy }}
                  >
                    <FacIcon size={16} className="mr-2 shrink-0" style={{ color: C.gold }} strokeWidth={1.75} />
                    {facility.title}
                  </h3>
                  <p className="text-xs leading-relaxed font-sans font-medium" style={{ color: C.navy60 }}>
                    {facility.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  </section>
)

export default CampusLifeSection
