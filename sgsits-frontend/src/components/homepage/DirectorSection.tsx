import React from 'react'
import { Link } from 'react-router-dom'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface DirectorSectionProps {
  director: Record<string, any>
  loading: boolean
}

const SkeletonDirector: React.FC = () => (
  <div className="bg-white p-6 lg:p-7 rounded shadow-sm border" style={{ borderColor: C.navy15 }} aria-hidden="true">
    <Sk className="h-2.5 w-28 mb-2 rounded" />
    <Sk className="h-6 w-64 mb-1 rounded" />
    <Sk className="h-6 w-44 mb-2 rounded" />
    <div className="w-12 h-[2px] mb-5 bg-slate-200 rounded" />
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      <Sk className="w-64 sm:w-80 h-[150px] sm:h-[190px] shrink-0 rounded" />
      <div className="flex-grow space-y-2 w-full">
        <Sk className="h-4 w-48 rounded" />
        <div className="space-y-1.5 mt-2">
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
          <Sk className="h-3 w-4/5 rounded" />
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-3/4 rounded" />
        </div>
        <Sk className="h-7 w-28 mt-3 rounded" />
      </div>
    </div>
  </div>
)

const DirectorSection: React.FC<DirectorSectionProps> = ({ director, loading }) => {
  if (loading) return <SkeletonDirector />

  return (
    <div
      className="bg-white p-6 lg:p-7 rounded shadow-sm relative border animate-fade-in"
      style={{ borderColor: C.navy15 }}
    >
      <span
        className="text-[10px] uppercase font-bold tracking-widest block mb-1"
        style={{ color: C.gold }}
      >
        {director.label}
      </span>
      <h2
        className="text-lg md:text-xl font-display font-bold tracking-tight uppercase mb-2"
        style={{ color: C.navy }}
      >
        {director.heading}{' '}
        <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
          {director.accentText}
        </span>
      </h2>
      <div className="w-12 h-[2px] mb-5" style={{ backgroundColor: C.gold }} />

      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div
          className="w-64 sm:w-80 h-[150px] sm:h-[190px] shrink-0 bg-white rounded overflow-hidden shadow-sm border"
          style={{ borderColor: C.navy15 }}
        >
          <img
            src={director.photo || undefined}
            alt={`Director ${director.name}`}
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="text-sm leading-relaxed font-serif" style={{ color: C.navy70 }}>
          <h3 className="font-sans font-bold text-base mb-1.5" style={{ color: C.navy }}>
            {director.name}
          </h3>
          <p className="mb-4 text-justify leading-relaxed">
            {director.bio}
          </p>
          {director.readMoreTo && (
            <Link
              to={director.readMoreTo}
              className="px-3.5 py-1.5 border rounded inline-block text-xs font-semibold font-sans transition-colors hover:opacity-80"
              style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
            >
              {director.readMoreLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default DirectorSection
