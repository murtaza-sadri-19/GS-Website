import React from 'react'
import { Link } from 'react-router-dom'
import { C } from './homeConstants'
import { Sk } from '../ui/Skeleton'

interface AboutSectionProps {
  about: Record<string, any>
  loading: boolean
}

const SkeletonAboutText: React.FC = () => (
  <div aria-hidden="true">
    <Sk className="h-2.5 w-24 mb-2 rounded" />
    <Sk className="h-6 w-72 mb-1 rounded" />
    <Sk className="h-6 w-52 mb-2 rounded" />
    <div className="w-12 h-[2px] mb-5 bg-slate-200 rounded" />
    <div className="space-y-2 mb-6">
      <Sk className="h-3.5 w-full rounded" />
      <Sk className="h-3.5 w-full rounded" />
      <Sk className="h-3.5 w-5/6 rounded" />
      <Sk className="h-3.5 w-4/5 rounded" />
      <Sk className="h-3.5 w-full rounded" />
      <Sk className="h-3.5 w-3/4 rounded" />
    </div>
    <div className="flex gap-3">
      <Sk className="h-8 w-32 rounded" />
      <Sk className="h-8 w-36 rounded" />
    </div>
  </div>
)

const AboutSection: React.FC<AboutSectionProps> = ({ about, loading }) => {
  if (loading) return <SkeletonAboutText />

  return (
    <div className="animate-fade-in">
      <span
        className="text-[10px] uppercase font-bold tracking-widest block mb-1"
        style={{ color: C.gold }}
      >
        {about.label}
      </span>
      <h2
        className="text-lg md:text-xl font-display font-bold tracking-tight uppercase mb-2"
        style={{ color: C.navy }}
      >
        {about.heading}{' '}
        <span className="font-serif italic font-semibold" style={{ color: C.navy }}>
          {about.accentText}
        </span>
      </h2>
      <div className="w-12 h-[2px] mb-5" style={{ backgroundColor: C.gold }} />

      <p
        className="leading-relaxed text-sm mb-6 text-justify font-sans"
        style={{ color: C.navy70 }}
      >
        {about.body}
      </p>

      <div className="flex flex-wrap gap-3">
        {about.primaryButton?.to && (
          <Link
            to={about.primaryButton.to}
            className="px-4 py-2 text-xs font-semibold border rounded transition-colors hover:opacity-80"
            style={{ borderColor: C.navy15, color: C.navy, backgroundColor: C.white }}
          >
            {about.primaryButton.label}
          </Link>
        )}
        {about.secondaryButton?.to && (
          <Link
            to={about.secondaryButton.to}
            className="px-4 py-2 text-xs font-semibold rounded shadow-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: C.navy, color: C.white }}
          >
            {about.secondaryButton.label}
          </Link>
        )}
      </div>
    </div>
  )
}

export default AboutSection
