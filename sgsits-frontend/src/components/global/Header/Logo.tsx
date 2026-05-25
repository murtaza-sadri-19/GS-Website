/**
 * Logo — Institute branding mark shown in the Header.
 *
 * ALL text content and image path are loaded from brandingService.
 * Nothing in this component is hardcoded — admin can change:
 *   • Logo image URL
 *   • Short name ("SGSITS INDORE")
 *   • Full name ("Shri G. S. Institute of Technology & Science")
 *   • Logo suffix ("Autonomous Grant-in-Aid Institute")
 *   • Establishment year badge ("1952")
 */

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { brandingService, brandingDefaults, type BrandingConfig } from '../../../services/brandingService'

const Logo: React.FC = () => {
  // ── Initialize with synchronous defaults — no flash ───────────────────────
  const [branding, setBranding] = useState<BrandingConfig>(brandingDefaults)

  useEffect(() => {
    brandingService.getBranding().then(setBranding)
  }, [])

  return (
    <Link to="/" className="flex items-center gap-3 group focus:outline-none">
      {/* Logo emblem — uses dynamic image from branding service */}
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-full shadow-md border border-[#bfa15f]/40 p-0.5 overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <img
          src={branding.logoUrl ? `${branding.logoUrl}?v=2` : ''}
          alt={branding.logoAlt}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback to SVG emblem if image fails to load
            const target = e.currentTarget as HTMLImageElement
            target.style.display = 'none'
            const parent = target.parentElement
            if (parent && !parent.querySelector('svg')) {
              const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
              svg.setAttribute('viewBox', '0 0 100 100')
              svg.setAttribute('class', 'w-8 h-8 fill-none stroke-brand-gold')
              svg.setAttribute('stroke-width', '4')
              svg.setAttribute('stroke-linecap', 'round')
              svg.setAttribute('stroke-linejoin', 'round')
              parent.appendChild(svg)
            }
          }}
        />
        {/* Establishment year badge — dynamic from branding */}
        <span className="absolute bottom-0 right-0 text-[7px] bg-[#bfa15f] text-slate-900 font-extrabold px-1 py-0.2 rounded-full border border-white shadow">
          {branding.establishedYear}
        </span>
      </div>

      {/* Typography — all values from branding service */}
      <div className="flex flex-col">
        <h1 className="font-display font-semibold text-base sm:text-lg leading-tight tracking-tight text-slate-900 group-hover:text-brand-burgundy transition-colors duration-200">
          {branding.shortName}
        </h1>
        <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-none mt-0.5 max-w-[280px] sm:max-w-md line-clamp-1">
          {branding.fullName}
        </p>
        <span className="text-[9px] text-brand-burgundy font-bold tracking-wider uppercase leading-none mt-1">
          Estd. {branding.establishedYear} • {branding.logoSuffix}
        </span>
      </div>
    </Link>
  )
}

export default Logo
