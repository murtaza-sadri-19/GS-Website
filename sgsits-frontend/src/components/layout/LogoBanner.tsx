import React from 'react'
import { Menu, X } from 'lucide-react'
import type { SiteSettings } from '../../types'
import type { BrandingConfig } from '../../services/brandingService'

interface LogoBannerProps {
  onMobileToggle: () => void
  mobileOpen: boolean
  settings: SiteSettings
  branding: BrandingConfig
  mobileMenuOpenLabel: string
  mobileMenuCloseLabel: string
}

const LogoBanner: React.FC<LogoBannerProps> = ({
  onMobileToggle,
  mobileOpen,
  settings,
  branding,
  mobileMenuOpenLabel,
  mobileMenuCloseLabel,
}) => (
  <div className="w-full border-b sticky top-0 z-50 lg:static lg:z-20 bg-white border-slate-100 shadow-sm">
    <div className="w-full px-4 lg:px-12 py-3 flex items-center justify-between gap-3 sm:gap-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-5">
        <div className="shrink-0 rounded-full flex items-center justify-center w-[58px] h-[58px] sm:w-[80px] sm:h-[80px]">
          {branding.logoUrl && (
            <img src={branding.logoUrl} alt={branding.logoAlt} className="w-full h-full object-contain" />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="font-bold text-[13px] leading-[1.2] tracking-tight sm:text-[22px] lg:text-[25px] text-primary font-display">
            {branding.fullName.includes('Technology') ? (
              <>
                {branding.fullName.split('Technology')[0]}Technology
                <span className="block sm:inline"> & Science</span>
              </>
            ) : (
              branding.fullName
            )}
          </h1>
          <p className="font-bold text-[10px] sm:text-xs mt-1 uppercase tracking-[0.03em] hidden md:block text-slate-500">
            {branding.subTagline}
          </p>
        </div>
      </div>
      <div className="hidden lg:flex items-center space-x-6 shrink-0">
        <div className="border border-accent/30 px-4 py-1.5 text-accent font-bold text-[12px] bg-accent/5 hidden xl:block uppercase tracking-wider rounded-sm">
          {settings.tagline}
        </div>
      </div>
      <button
        className="lg:hidden p-2 rounded transition-colors shrink-0 text-primary hover:bg-gray-100"
        onClick={onMobileToggle}
        aria-label={mobileOpen ? mobileMenuCloseLabel : mobileMenuOpenLabel}
      >
        {mobileOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
      </button>
    </div>
  </div>
)

export default LogoBanner
