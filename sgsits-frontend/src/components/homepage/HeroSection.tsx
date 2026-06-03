import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { C, ICON_MAP, type IconComponent } from './homeConstants'

const SkDark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div aria-hidden="true" className={`animate-pulse rounded skeleton-shimmer bg-white/20 ${className}`} />
)
import type { HeroTileData } from '../../services/contentService'

interface HeroTile extends HeroTileData {
  icon: IconComponent
}

interface HeroSectionProps {
  hero: Record<string, any>
  heroTiles: HeroTile[]
  heroImages: string[]
  slideIndex: number
  onPrev: () => void
  onNext: () => void
  onGoTo: (i: number) => void
  loading: boolean
}

const SkeletonHero: React.FC = () => (
  <>
    <div
      className="sticky top-0 w-full h-[320px] sm:h-[400px] md:h-[500px] z-0"
      style={{ backgroundColor: C.navy }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: C.navy55 }} />
      <div className="relative z-10 h-full flex items-center justify-center px-4 text-center">
        <div className="max-w-5xl w-full space-y-5">
          <SkDark className="h-3 w-40 mx-auto" />
          <SkDark className="h-9 sm:h-12 md:h-14 w-64 sm:w-[420px] mx-auto" />
          <SkDark className="h-7 sm:h-9 w-44 sm:w-56 mx-auto bg-white/30" />
        </div>
      </div>
    </div>
    <div className="relative z-10 mt-[-48px] sm:mt-[-80px] md:mt-[-100px] pb-0 bg-transparent">
      <div className="relative mx-auto max-w-[1400px] px-4 lg:px-12">
        <div
          className="grid grid-cols-2 lg:grid-cols-4 shadow-sm rounded overflow-hidden divide-x"
          style={{ border: `1px solid ${C.navy15}` } as React.CSSProperties}
        >
          {([true, false, false, true] as boolean[]).map((dark, i) => (
            <div
              key={i}
              className="min-h-[100px] sm:h-[110px] md:h-[120px] flex flex-col items-center justify-center text-center px-3 py-4 animate-pulse"
              style={{ backgroundColor: dark ? C.navy : C.white }}
            >
              <div aria-hidden="true" className={`h-2.5 w-20 rounded mb-2 skeleton-shimmer ${dark ? 'bg-white/20' : 'bg-slate-200'}`} />
              <div aria-hidden="true" className={`h-6 w-6 rounded mb-2 skeleton-shimmer ${dark ? 'bg-white/20' : 'bg-slate-200'}`} />
              <div aria-hidden="true" className={`h-2 w-24 rounded skeleton-shimmer ${dark ? 'bg-white/15' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)

const HeroSection: React.FC<HeroSectionProps> = ({
  hero,
  heroTiles,
  heroImages,
  slideIndex,
  onPrev,
  onNext,
  onGoTo,
  loading,
}) => {
  if (loading) return <SkeletonHero />

  return (
    <div className="animate-fade-in">
      {/* ── Crossfade slider ── */}
      <div className="sticky top-0 w-full h-[320px] sm:h-[400px] md:h-[500px] z-0 overflow-hidden">
        {heroImages.length > 0 ? heroImages.map((imgUrl, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${imgUrl})`,
              backgroundPosition: hero.imagePosition || 'center',
              filter: 'brightness(0.9) contrast(1.02) saturate(0.95)',
              opacity: i === slideIndex ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          />
        )) : (
          <div className="absolute inset-0" style={{ backgroundColor: C.navy }} />
        )}

        <div className="absolute inset-0 z-[1]" style={{ backgroundColor: C.navy45 }} />

        <div className="relative z-[2] h-full flex items-center justify-center px-4 text-center">
          <div className="max-w-5xl">
            <p
              className="uppercase tracking-[0.18em] text-[10px] sm:text-xs mb-3 font-semibold font-sans"
              style={{ color: C.white80 }}
            >
              {hero.instituteName}
            </p>
            <h1 className="text-white uppercase font-display font-semibold text-2xl sm:text-4xl md:text-5xl leading-[1.1] tracking-[0.04em] drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
              {hero.welcomeText}<br />
              <span className="font-display font-bold italic" style={{ color: C.gold }}>{hero.accentText}</span>
            </h1>
          </div>
        </div>

        {heroImages.length > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous slide"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-[3] w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.50)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.25)' }}
            >
              <ChevronLeft size={20} color="#fff" strokeWidth={2.5} />
            </button>

            <button
              onClick={onNext}
              aria-label="Next slide"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-[3] w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.50)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.25)' }}
            >
              <ChevronRight size={20} color="#fff" strokeWidth={2.5} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[3] flex items-center gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => onGoTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width:  i === slideIndex ? '20px' : '8px',
                    height: '8px',
                    backgroundColor: i === slideIndex ? C.gold : 'rgba(255,255,255,0.55)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Hero tiles ── */}
      <div className="relative z-10 mt-[-48px] sm:mt-[-80px] md:mt-[-100px] pb-0 bg-transparent">
        <div className="relative mx-auto max-w-[1400px] px-4 lg:px-12">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 shadow-sm rounded overflow-hidden divide-x"
            style={{ border: `1px solid ${C.navy15}`, divideColor: C.navy10 } as React.CSSProperties}
          >
            {heroTiles.map((tile) => {
              const Icon = tile.icon
              const iconColor = tile.dark ? C.gold : C.navy
              return (
                <Link
                  key={tile.title}
                  to={tile.path}
                  className="min-h-[100px] sm:h-[110px] md:h-[120px] flex flex-col items-center justify-center text-center px-3 py-4 sm:px-4 transition-opacity duration-200 hover:opacity-85"
                  style={{ backgroundColor: tile.dark ? C.navy : C.white }}
                >
                  <p
                    className="font-sans font-bold uppercase text-[10px] sm:text-xs tracking-[0.15em] mb-1.5"
                    style={{ color: tile.dark ? C.gold : C.navy }}
                  >
                    {tile.title}
                  </p>
                  <Icon size={24} style={{ color: iconColor }} strokeWidth={1.75} className="mb-2" />
                  <p
                    className="text-[10px] sm:text-xs leading-normal max-w-[210px] font-medium"
                    style={{ color: tile.dark ? C.white60 : C.navy55 }}
                  >
                    {tile.subtitle}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export type { HeroTile }
export default HeroSection
