import React from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { C, ICON_MAP } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface AcademicProgramsSectionProps {
  section: Record<string, any>
  loading: boolean
}

const SkeletonAcademics: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8" aria-hidden="true">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-6 bg-white rounded flex flex-col border" style={{ borderColor: C.navy15 }}>
        <Sk className="w-10 h-10 rounded mb-6" />
        <Sk className="h-5 w-3/4 rounded mb-3" />
        <div className="space-y-1.5 mb-6">
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
          <Sk className="h-3 w-4/6 rounded" />
        </div>
        <Sk className="h-3 w-28 rounded mt-auto" />
      </div>
    ))}
  </div>
)

const AcademicProgramsSection: React.FC<AcademicProgramsSectionProps> = ({ section, loading }) => (
  <section
    className="bg-white py-14 relative z-10"
    style={{ borderBottom: `1px solid ${C.navy10}` }}
  >
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
            <span className="text-[10px] uppercase font-bold tracking-widest block mb-1" style={{ color: C.gold }}>
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
        <SkeletonAcademics />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
          {(section.programs ?? []).map((prog: Record<string, any>) => {
            const Icon = ICON_MAP[prog.iconName] ?? BookOpen
            return (
              <div
                key={prog.id}
                className="p-6 bg-white rounded flex flex-col group hover:shadow-md transition-all duration-200 border"
                style={{ borderColor: C.navy15 }}
              >
                <div
                  className="w-10 h-10 flex items-center justify-center rounded mb-6 transition-colors duration-200 border"
                  style={{ backgroundColor: C.white, borderColor: C.navy15, color: C.navy }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.backgroundColor = C.navy
                    el.style.borderColor = C.navy
                    el.style.color = C.white
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.backgroundColor = C.white
                    el.style.borderColor = C.navy15
                    el.style.color = C.navy
                  }}
                >
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-display font-bold mb-3 group-hover:underline" style={{ color: C.navy }}>
                  {prog.title}
                </h3>
                <p className="text-xs leading-relaxed mb-6 font-sans font-medium" style={{ color: C.navy60 }}>
                  {prog.description}
                </p>
                <Link
                  to={prog.to ?? '#'}
                  className="font-bold text-[11px] uppercase tracking-wider mt-auto flex items-center hover:underline"
                  style={{ color: C.navy }}
                >
                  {prog.ctaLabel} <ChevronRight size={12} className="ml-1" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  </section>
)

export default AcademicProgramsSection
