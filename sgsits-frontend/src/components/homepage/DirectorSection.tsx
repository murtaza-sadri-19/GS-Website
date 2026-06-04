import React from 'react'
import { Link } from 'react-router-dom'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface DirectorSectionProps {
  director: Record<string, any>
  loading: boolean
}

const SkeletonDirector: React.FC = () => (
  <div aria-hidden="true">
    <Sk className="h-2.5 w-36 mb-2 rounded" />
    <Sk className="h-7 w-64 mb-1 rounded" />
    <div className="w-12 h-[2px] mb-5 bg-slate-200 rounded" />
    <Sk className="w-full h-[340px] rounded" />
    <div className="mt-4 space-y-2">
      <Sk className="h-4 w-40 rounded" />
      <Sk className="h-3 w-full rounded" />
      <Sk className="h-3 w-5/6 rounded" />
      <Sk className="h-3 w-4/5 rounded" />
      <Sk className="h-7 w-36 mt-3 rounded" />
    </div>
  </div>
)

const DirectorSection: React.FC<DirectorSectionProps> = ({ director, loading }) => {
  if (loading) return <SkeletonDirector />

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <span
        className="text-xs uppercase font-bold tracking-widest block mb-1"
        style={{ color: C.gold }}
      >
        Leadership Message
      </span>
      <h2
        className="text-lg md:text-xl font-display font-bold tracking-tight uppercase mb-2"
        style={{ color: C.navy }}
      >
        Director's{' '}
        <span className="font-serif italic font-semibold">Corner</span>
      </h2>
      <div className="w-12 h-[2px] mb-5" style={{ backgroundColor: C.gold }} />

      {/* Large full-width photo */}
      <div className="w-full overflow-hidden rounded" style={{ border: `1px solid ${C.navy15}` }}>
        <img
          src={director.photo || undefined}
          alt={`Director ${director.name}`}
          className="w-full object-cover object-top"
          style={{ maxHeight: '400px' }}
        />
      </div>

      {/* Name + bio below image */}
      <div className="mt-5">
        <h3
          className="font-sans font-bold text-base mb-1"
          style={{ color: C.navy }}
        >
          {director.name}
        </h3>
        {director.designation && (
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: C.gold }}
          >
            {director.designation}
          </p>
        )}
        <p
          className="text-sm leading-relaxed text-justify font-serif mb-4"
          style={{ color: C.navy70 }}
        >
          {director.bio}
        </p>
        {director.readMoreTo && (
          <Link
            to={director.readMoreTo}
            className="px-4 py-2 border rounded inline-block text-xs font-semibold font-sans transition-colors hover:opacity-80"
            style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
          >
            {director.readMoreLabel || 'Read Full Message'}
          </Link>
        )}
      </div>
    </div>
  )
}

export default DirectorSection
