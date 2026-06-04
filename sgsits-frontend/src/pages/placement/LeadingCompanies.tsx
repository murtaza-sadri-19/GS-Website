import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Search, ExternalLink } from 'lucide-react'
import {
  placementService,
  leadingCompaniesDefault, placementOfficeInfoDefault, type LeadingCompany,
} from '../../services/placementService'
import { getCmsSection } from '../../services/settingsService'
import { Sk } from '../../components/ui/Skeleton'

type Sector = 'All' | 'IT' | 'Core' | 'PSU' | 'Consulting' | 'Product' | 'Startup'

const sectorConfig: Record<string, { color: string; bg: string; border: string; badge: string }> = {
  IT:         { color: 'text-primary',   bg: 'bg-primary/5',    border: 'border-primary/20',   badge: 'bg-primary/10 text-primary' },
  Product:    { color: 'text-primary',   bg: 'bg-primary/10',   border: 'border-primary/25',   badge: 'bg-primary/15 text-primary' },
  Core:       { color: 'text-accent',    bg: 'bg-accent/10',    border: 'border-accent/30',    badge: 'bg-accent/15 text-accent' },
  PSU:        { color: 'text-slate-700', bg: 'bg-slate-50',     border: 'border-slate-300',    badge: 'bg-slate-200 text-slate-700' },
  Consulting: { color: 'text-accent',    bg: 'bg-accent/5',     border: 'border-accent/25',    badge: 'bg-accent/10 text-accent' },
  Startup:    { color: 'text-accent',    bg: 'bg-accent/15',    border: 'border-accent/40',    badge: 'bg-accent/20 text-accent' },
}

const SECTORS: Sector[] = ['All', 'IT', 'Product', 'Core', 'PSU', 'Consulting', 'Startup']

interface StatsSummary { topPackage: string; companyCount: string }

const LeadingCompanies: React.FC = () => {
  const [companies,     setCompanies]     = useState<LeadingCompany[]>(leadingCompaniesDefault)
  const [activeSector,  setActiveSector]  = useState<Sector>('All')
  const [search,        setSearch]        = useState('')
  const [loading,       setLoading]       = useState(true)
  const [stats,         setStats]         = useState<StatsSummary>({ topPackage: '₹48 LPA', companyCount: '180+' })
  const [tpoEmail,      setTpoEmail]      = useState('tpo@sgsits.ac.in')

  useEffect(() => {
    Promise.all([
      placementService.getLeadingCompanies(),
      getCmsSection<StatsSummary>('placement.stats_summary'),
      placementService.getPlacementOfficeInfo(),
    ]).then(([comps, s, office]) => {
      setCompanies(comps)
      if (s?.topPackage) setStats({ topPackage: s.topPackage, companyCount: s.companyCount ?? '180+' })
      if (office?.email) setTpoEmail(office.email)
      setLoading(false)
    })
  }, [])

  const filtered = companies.filter(c => {
    const matchSector = activeSector === 'All' || c.sector === activeSector
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchSector && matchSearch
  })

  const uniqueSectors = Array.from(new Set(companies.map(c => c.sector)))

  return (
    <div className="space-y-8">
      <PageSeo pageKey="placement/leading-companies" />
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1.5">Placements</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary">Leading Recruiters</h2>
        <div className="w-16 h-0.5 bg-accent mt-2 mb-3" />
        <p className="text-sm text-slate-500 font-medium font-sans">
          Top companies across IT, Core Engineering, PSU, Consulting, and Product sectors that recruit SGSITS graduates.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm">
              <Sk className="h-7 w-16 rounded mx-auto mb-2" />
              <Sk className="h-3 w-24 rounded mx-auto" />
            </div>
          ))
        ) : [
          { value: `${companies.length}+`, label: 'Recruiting Companies' },
          { value: `${uniqueSectors.length}`, label: 'Industry Sectors' },
          { value: stats.topPackage, label: 'Highest Package' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-sm hover:shadow-md transition-all">
            <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Intro */}
      <div className="border-l-4 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">
          Over <strong>{stats.companyCount} companies</strong> visit SGSITS campus annually for on-campus placement drives and pre-placement offers (PPOs).
          Our graduates are hired across IT, core engineering, consulting, PSU, and high-growth startups —
          establishing SGSITS as one of central India's most sought-after engineering campuses.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-accent/50 font-sans"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {SECTORS.map(sector => (
            <button
              key={sector}
              onClick={() => setActiveSector(sector)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeSector === sector
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : `border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary`
              }`}
            >
              {sector}
            </button>
          ))}
          <span className="text-xs text-slate-400 font-medium ml-1">{filtered.length} results</span>
        </div>
      </div>

      {/* Company Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4 text-center">
              <Sk className="w-10 h-10 rounded-xl mx-auto mb-2.5" />
              <Sk className="h-3 w-full rounded mb-2" />
              <Sk className="h-4 w-14 rounded mx-auto" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <ExternalLink size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-sm">No companies found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map((company) => {
            const cfg = sectorConfig[company.sector] ?? sectorConfig['IT']
            return (
              <div
                key={company.name}
                className={`rounded-xl border p-4 text-center transition-all duration-200 hover:shadow-md cursor-pointer group ${
                  company.highlight
                    ? `${cfg.bg} ${cfg.border} shadow-sm`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl mx-auto mb-2.5 flex items-center justify-center font-display font-black text-sm ${
                  company.highlight ? `bg-white ${cfg.color} shadow-sm` : 'bg-primary/5 text-primary'
                }`}>
                  {company.name.charAt(0)}
                </div>
                <p className={`text-xs font-bold font-sans leading-tight ${company.highlight ? cfg.color : 'text-slate-700'}`}>
                  {company.name}
                </p>
                <span className={`inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  {company.sector}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Sector Legend */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        <h4 className="font-display font-bold text-primary text-sm mb-3">Sector Legend</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.entries(sectorConfig).map(([sector, cfg]) => (
            <div key={sector} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${cfg.bg} border ${cfg.border}`} />
              <span className="text-xs font-medium text-slate-600">{sector}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-primary rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-bold text-white text-base">Is your company not listed?</h4>
          <p className="text-slate-300 text-sm font-sans mt-1">Reach out to our T&P Cell to schedule your campus recruitment drive at SGSITS.</p>
        </div>
        <a
          href={`mailto:${tpoEmail}`}
          className="inline-flex items-center gap-2 bg-accent text-primary px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-accent/90 transition-colors shrink-0"
        >
          Contact T&P Cell
        </a>
      </div>
    </div>
  )
}

export default LeadingCompanies
