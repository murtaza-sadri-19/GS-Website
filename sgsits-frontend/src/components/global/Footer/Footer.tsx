import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, ExternalLink, Globe } from 'lucide-react'

// ─── Service layer — the ONLY data source ─────────────────────────────────────
import footerService, { footerCmsDefaults } from '../../../services/footerService'
import type { FooterCmsData } from '../../../services/footerService'
import { departmentService } from '../../../services'
import type { DepartmentSummary } from '../../../services/departmentService'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  // Synchronous default → no flash on first paint
  const [data, setData] = useState<FooterCmsData>(footerCmsDefaults)
  const [departments, setDepartments] = useState<DepartmentSummary[]>([])

  useEffect(() => {
    footerService.getFooterCmsData().then(setData)
    departmentService.getDepartments().then(setDepartments)
  }, [])

  const { branding, contact, quickLinks, studentLinks, externalLinks, departments: deptConfig, visitorStats, policyLinks, bottomBar, layout } = data

  // Visible policy links sorted by order
  const visiblePolicy = [...policyLinks].filter(l => l.visible).sort((a, b) => a.order - b.order)

  // Department links to render (auto-sync or manual)
  const visibleDepts = (() => {
    const active = departments.filter(d => d.isActive)
    if (deptConfig.visibleSlugs.length > 0) {
      return active.filter(d => deptConfig.visibleSlugs.includes(d.slug))
    }
    return active
  })().slice(0, deptConfig.maxVisible)

  // Build the middle link columns (2 shown by default; departments replaces one if enabled)
  const midColumns = [
    layout.showQuickLinks   && quickLinks,
    layout.showStudentLinks && studentLinks,
  ].filter(Boolean) as typeof quickLinks[]

  return (
    <footer className="w-full bg-[#0b2545] text-slate-350 border-t-4 border-accent pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ── Column 1: Branding + Contact ───────────────────────────────── */}
        {layout.showBrandingColumn && (
          <div className="space-y-5">
            {/* Logo badge + name */}
            <div className="flex items-center gap-3">
              {branding.logoUrl ? (
                <img
                  src={branding.logoUrl}
                  alt={branding.logoAlt}
                  className="w-9 h-9 object-contain"
                  onError={e => { e.currentTarget.style.display = 'none' }}
                />
              ) : (
                <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center border border-white/20">
                  <span className="text-sm font-serif font-bold text-accent">{branding.shortCode}</span>
                </div>
              )}
              <div>
                <h3 className="font-display font-semibold text-base text-white tracking-wider leading-none">
                  {branding.shortName}
                </h3>
                <span className="text-[10px] text-accent font-serif uppercase tracking-widest block mt-1">
                  {branding.estYear}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
              {branding.description}
            </p>

            {/* Contact details */}
            {contact.visible && (
              <div className="space-y-3 pt-2 text-xs font-sans font-medium">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-slate-300 leading-normal">{contact.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-slate-300">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-slate-300 hover:text-accent hover:underline transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Columns 2 & 3: Internal link columns ──────────────────────── */}
        {midColumns.map(col => (
          <div key={col.id}>
            {col.headingVisible && (
              <h3 className="font-display font-semibold text-[15px] text-white uppercase tracking-wider mb-5 pb-2 border-b border-white/10">
                {col.heading}
              </h3>
            )}
            <ul className="space-y-3 text-xs font-sans font-medium">
              {[...col.links]
                .filter(l => l.visible)
                .sort((a, b) => a.order - b.order)
                .map(link => (
                  <li key={link.id}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="hover:text-accent hover:underline transition-colors block text-slate-400"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-accent hover:underline transition-colors flex items-center gap-1 text-slate-400"
                      >
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </a>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}

        {/* ── Optional: Department links column ─────────────────────────── */}
        {layout.showDepartmentLinks && deptConfig.visible && visibleDepts.length > 0 && (
          <div>
            <h3 className="font-display font-semibold text-[15px] text-white uppercase tracking-wider mb-5 pb-2 border-b border-white/10">
              {deptConfig.heading}
            </h3>
            <ul className="space-y-3 text-xs font-sans font-medium">
              {visibleDepts.map(dept => (
                <li key={dept.slug}>
                  <Link
                    to={`/departments/${dept.slug}`}
                    className="hover:text-accent hover:underline transition-colors block text-slate-400"
                  >
                    {dept.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Column 4: External links + Visitor Stats ───────────────────── */}
        {(layout.showExternalLinks || layout.showVisitorStats) && (
          <div className="space-y-6">
            {layout.showExternalLinks && externalLinks.visible && (
              <div>
                {externalLinks.headingVisible && (
                  <h3 className="font-display font-semibold text-[15px] text-white uppercase tracking-wider mb-5 pb-2 border-b border-white/10">
                    {externalLinks.heading}
                  </h3>
                )}
                <ul className="space-y-3 text-xs font-sans font-medium">
                  {[...externalLinks.links]
                    .filter(l => l.visible)
                    .sort((a, b) => a.order - b.order)
                    .map(link => (
                      <li key={link.id}>
                        <a
                          href={link.href ?? link.to}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noreferrer' : undefined}
                          className="hover:text-accent hover:underline transition-colors flex items-center gap-1 text-slate-400"
                        >
                          <span>{link.label}</span>
                          {link.external && <ExternalLink className="w-3 h-3 text-slate-500" />}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Visitor Stats widget */}
            {layout.showVisitorStats && visitorStats.enabled && (
              <div className="bg-white/5 border border-white/15 rounded p-4 space-y-2">
                <span className="text-[10px] uppercase font-serif text-accent tracking-widest block font-medium">
                  {visitorStats.label}
                </span>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-[17px] font-mono font-bold text-white tracking-widest leading-none">
                    {visitorStats.count}
                  </span>
                </div>
                <p className="text-[9px] text-slate-400 font-sans font-semibold leading-relaxed">
                  {visitorStats.note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Bottom Strip ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-xs text-center text-slate-400 space-y-5">

        {/* Policy links bar */}
        {layout.showPolicyBar && visiblePolicy.length > 0 && (
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2.5 font-sans font-medium text-slate-400">
            {visiblePolicy.map((link, i) => (
              <React.Fragment key={link.id}>
                {i > 0 && <span className="text-white/20">|</span>}
                <Link to={link.to} className="hover:text-accent hover:underline transition-colors">
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Copyright + credit line */}
        {layout.showBottomBar && bottomBar.visible && (
          <p className="max-w-4xl mx-auto text-[10px] text-slate-450 leading-relaxed font-sans font-medium">
            {bottomBar.showCopyrightYear && `© ${currentYear} `}{bottomBar.copyrightOwner}
            {bottomBar.developerCredit && ` ${bottomBar.developerCredit}`}
          </p>
        )}
      </div>
    </footer>
  )
}

export default Footer
