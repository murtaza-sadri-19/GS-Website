import React, { useState, useEffect, useRef } from 'react'
import { contentService } from '../../services/contentService'

const CampusRevealBanner: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false)
  const [preFooter, setPreFooter] = useState({ imageUrl: '', label: '' })
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentService.getHomePage()
      .then(home => {
        if (home.preFooter) setPreFooter(home.preFooter)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsRevealed(entry.isIntersecting),
      { threshold: 0.15 }
    )
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [])

  if (!preFooter.imageUrl) return null

  return (
    <div
      ref={elementRef}
      className="relative w-full h-[180px] sm:h-[240px] md:h-[300px] lg:h-[360px] overflow-hidden border-t border-slate-200"
      style={{
        filter: isRevealed ? 'brightness(1)' : 'brightness(0.85)',
        transition: 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <img
        src={preFooter.imageUrl}
        alt={preFooter.label}
        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out"
        style={{ transform: isRevealed ? 'scale(1)' : 'scale(1.05)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f8fa]/20 via-transparent to-[#ffffff]/20 pointer-events-none" />
      <div className="absolute bottom-4 left-4 lg:left-12 bg-black/40 backdrop-blur-xs text-white px-3 py-1.5 rounded text-xs sm:text-sm font-semibold tracking-wide font-sans select-none pointer-events-none border border-white/10">
        {preFooter.label}
      </div>
    </div>
  )
}

export default CampusRevealBanner
