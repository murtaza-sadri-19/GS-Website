import React from 'react'
import { Link } from 'react-router-dom'
import { C } from './homeConstants'
import { Sk, SkeletonCard } from '../ui/Skeleton'
import type { HomeNewsCard, FeaturedNewsCard } from '../../services/newsService'

interface NewsSectionProps {
  section: Record<string, any>
  newsCards: HomeNewsCard[]
  featuredCards: FeaturedNewsCard[]
  loading: boolean
}

const NewsSection: React.FC<NewsSectionProps> = ({ section, newsCards, featuredCards, loading }) => (
  <section
    className="bg-white py-16 relative z-10"
    style={{ borderBottom: `1px solid ${C.navy10}` }}
  >
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
      <div className="text-center mb-12">
        {loading ? (
          <div className="space-y-3" aria-hidden="true">
            <Sk className="h-2.5 w-24 mx-auto rounded" />
            <Sk className="h-8 w-64 mx-auto rounded" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2"><SkeletonCard className="min-h-[380px]" /></div>
          <SkeletonCard className="min-h-[380px]" />
          <SkeletonCard className="min-h-[380px]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {featuredCards[0] && (
            <Link
              to={featuredCards[0].to}
              className="md:col-span-2 relative overflow-hidden rounded flex flex-col justify-end min-h-[380px] group border"
              style={{ borderColor: C.navy15, backgroundColor: C.white }}
            >
              <img
                src={featuredCards[0].imageUrl || undefined}
                alt="Research at SGSITS"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ filter: 'saturate(0.85) contrast(1.02)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${C.navy} 0%, ${C.navy40} 60%, transparent 100%)` }}
              />
              <div className="relative p-6 md:p-8 z-10">
                <span className="text-[10px] font-bold tracking-widest uppercase mb-2 block" style={{ color: C.gold }}>
                  {featuredCards[0].label}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight">
                  {featuredCards[0].title}
                </h3>
                <p className="text-xs mt-3 font-sans font-medium max-w-xl" style={{ color: C.white80 }}>
                  {featuredCards[0].description}
                </p>
              </div>
            </Link>
          )}

          {newsCards.map((card) => (
            <Link
              key={card.id}
              to={card.to}
              className="bg-white rounded flex flex-col min-h-[380px] group hover:shadow-md transition-all duration-200 border"
              style={{ borderColor: C.navy15 }}
            >
              <div className="h-44 overflow-hidden shrink-0 border-b" style={{ borderColor: C.navy10 }}>
                <img
                  src={card.imageUrl || undefined}
                  alt={card.category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex flex-col grow">
                <span className="text-[9px] font-bold tracking-widest uppercase mb-1.5" style={{ color: C.gold }}>
                  {card.category}
                </span>
                <h3 className="font-display font-bold text-base leading-snug group-hover:underline" style={{ color: C.navy }}>
                  {card.title}
                </h3>
                <p className="text-xs mt-2 line-clamp-3 font-sans font-medium" style={{ color: C.navy60 }}>
                  {card.description}
                </p>
              </div>
            </Link>
          ))}

          {featuredCards[1] && (
            <Link
              to={featuredCards[1].to}
              className="md:col-span-2 relative overflow-hidden rounded flex flex-col justify-end min-h-[380px] group border"
              style={{ borderColor: C.navy15, backgroundColor: C.white }}
            >
              <img
                src={featuredCards[1].imageUrl || undefined}
                alt="Engineering Laboratory"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ filter: 'saturate(0.85) contrast(1.02)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${C.navy} 0%, ${C.navy40} 60%, transparent 100%)` }}
              />
              <div className="relative p-6 md:p-8 z-10">
                <span className="text-[10px] font-bold tracking-widest uppercase mb-2 block" style={{ color: C.gold }}>
                  {featuredCards[1].label}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-display font-bold leading-tight">
                  {featuredCards[1].title}
                </h3>
                <p className="text-xs mt-3 font-sans font-medium max-w-xl" style={{ color: C.white80 }}>
                  {featuredCards[1].description}
                </p>
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  </section>
)

export default NewsSection
