import React from 'react'
import { Link } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import type { FooterData } from '../../services/settingsService'
import type { SiteSettings } from '../../types'
import type { DepartmentSummary } from '../../services/departmentService'

interface FooterProps {
  footerData: FooterData
  settings: SiteSettings
  depts: DepartmentSummary[]
}

const Footer: React.FC<FooterProps> = ({ footerData, settings, depts }) => (
  <>
    {/* Weather & Social Bar */}
    <div className="bg-white py-3 lg:px-12 px-4 shadow-sm border-t border-gray-250 border-b relative z-10 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="flex items-center text-slate-800 font-bold mb-3 md:mb-0">
          <span className="mr-2">On Campus:</span>
          <Cloud size={20} className="mx-2 text-slate-600" />
          <span>35°C | Scattered clouds</span>
        </div>
        <div className="flex space-x-5 text-slate-600">
          {settings.socialLinks?.facebook && (
            <a href={settings.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
          )}
          {settings.socialLinks?.linkedin && (
            <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
            </a>
          )}
          {settings.socialLinks?.twitter && (
            <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
            </a>
          )}
          {settings.socialLinks?.instagram && (
            <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
          )}
          {settings.socialLinks?.youtube && (
            <a href={settings.socialLinks.youtube} target="_blank" rel="noreferrer" className="hover:text-accent text-primary transition-colors">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon fill="white" points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
            </a>
          )}
        </div>
      </div>
    </div>

    <footer className="bg-primary text-slate-300 pt-8 pb-6 relative z-10 font-sans border-t-4 border-accent">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-12">
        {/* Top links row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-semibold pb-5 border-b border-white/10 text-sm">
          {footerData.columns[0]?.links.map((link, idx) => (
            link.to ? (
              <Link key={idx} to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
            ) : (
              <a key={idx} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined} className="hover:text-white transition-colors">{link.label}</a>
            )
          ))}
        </div>

        {/* Category links row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-semibold py-5 border-b border-white/10 text-sm">
          {footerData.columns[1]?.links.map((link, idx) => (
            link.to ? (
              <Link key={idx} to={link.to} className="flex items-center hover:text-white transition-colors">{link.label}</Link>
            ) : (
              <a key={idx} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined} className="flex items-center hover:text-white transition-colors">{link.label}</a>
            )
          ))}
        </div>

        {/* Departments */}
        <div className="py-8 border-b border-white/10">
          <h3 className="font-bold text-white text-lg mb-6 tracking-wide">Departments</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-y-5 gap-x-6 text-sm font-medium">
            {depts.map((dept) => (
              <Link key={dept.slug} to={`/departments/${dept.slug}`} className="hover:text-white transition-colors">
                {dept.shortName}
              </Link>
            ))}
          </div>
        </div>

        {/* Portals / Policies */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 font-bold text-white py-6 border-b border-white/10 text-sm">
          {footerData.portals.links.map((link, idx) => (
            <a key={idx} href={link.href} target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors">
              {link.label}
            </a>
          ))}
          {footerData.visitorStats && (
            <span className="ml-auto text-xs text-slate-400 font-normal">
              {footerData.visitorStats.label}: <strong className="text-white font-bold">{footerData.visitorStats.count}</strong> ({footerData.visitorStats.note})
            </span>
          )}
        </div>

        {/* Brand identity */}
        <div className="py-6 border-b border-white/10 flex items-center">
          <div className="w-[60px] h-[60px] bg-white rounded-full p-1.5 shrink-0 mr-4 flex items-center justify-center border border-slate-200">
            <img src="/assets/image.png" alt="SGSITS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="font-sans">
            <h2 className="text-white font-bold text-lg leading-tight">
              श्री गोविंदराम सेकसरिया प्रौद्योगिकी एवं विज्ञान संस्थान
            </h2>
            <p className="text-white font-medium text-xs mt-0.5 tracking-wide">
              {footerData.institution.name}
            </p>
          </div>
        </div>

        {/* Base footer */}
        <div className="pt-6 pb-2 flex flex-col md:flex-row justify-between items-start text-xs text-slate-400 space-y-4 md:space-y-0 relative">
          <div>
            <div className="space-x-2 mb-1.5">
              {footerData.bottomLinks.map((link, idx) => (
                <React.Fragment key={idx}>
                  <Link to={link.to} className="hover:text-white transition-colors">{link.label}</Link>
                  {idx < footerData.bottomLinks.length - 1 && ' | '}
                </React.Fragment>
              ))}
            </div>
            <p>© {new Date().getFullYear()} {footerData.institution.shortCode}SITS - All rights reserved</p>
          </div>
          <div className="text-left md:text-right">
            <p className="mb-0">Powered by<br className="hidden md:block" /> <span className="text-white font-medium">SGSITS Developers</span></p>
            <p className="mt-1">Website last updated on: 2026-04-10 20:00:02 PM</p>
          </div>
        </div>
      </div>
    </footer>
  </>
)

export default Footer
