import React from 'react'
import { C } from './homeConstants'

const SkDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`animate-pulse rounded skeleton-shimmer bg-white/20 ${className}`} />
)

interface StatsSectionProps {
  section: Record<string, any>
  loading: boolean
}

const SkeletonStats: React.FC<{ backgroundImage: string; fallbackImage: string }> = ({
  backgroundImage,
  fallbackImage,
}) => (
  <div className="relative z-10 overflow-hidden" style={{ height: '280px' }}>
    <div
      className="absolute inset-0 w-full h-full"
      style={{
        backgroundImage: `url(${backgroundImage}), url(${fallbackImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundAttachment: 'fixed',
        filter: 'brightness(0.45)',
      }}
    />
    <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />
    <div className="relative z-10 h-full flex items-center justify-center">
      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 text-center">
          {Array.from({ length: 4 }).map((_, i, arr) => (
            <div
              key={i}
              className="px-4 py-4 flex flex-col items-center gap-3 animate-pulse"
              style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}
            >
              <SkDark className="h-10 md:h-14 w-28 bg-white/25" />
              <SkDark className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

const StatsSection: React.FC<StatsSectionProps> = ({ section, loading }) => {
  if (loading) return (
    <SkeletonStats
      backgroundImage={section.backgroundImage ?? ''}
      fallbackImage={section.fallbackImage ?? ''}
    />
  )

  return (
    <section className="relative z-10 overflow-hidden animate-fade-in" style={{ height: '280px' }}>
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${section.backgroundImage}), url(${section.fallbackImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          backgroundAttachment: 'fixed',
          filter: 'brightness(0.45)',
        }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 text-center">
            {(section.items ?? []).map((s: Record<string, any>, i: number, arr: any[]) => (
              <div
                key={s.label}
                className="px-4 py-4"
                style={{ borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}
              >
                <div className="text-3xl md:text-5xl font-display font-extrabold tracking-tight" style={{ color: C.gold }}>
                  {s.val}
                </div>
                <div
                  className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.2em] mt-2"
                  style={{ color: C.white70 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default StatsSection
