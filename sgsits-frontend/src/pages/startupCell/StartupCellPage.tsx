import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { useGatedLoading } from '../../hooks/useGatedLoading'
import {
  Rocket, Phone, Mail, Award, Users, TrendingUp,
  FlaskConical, Scale, Shield, BookOpen, CheckCircle2,
  ArrowRight, Building2, Wifi, Sprout, Heart
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Sk } from '../../components/ui/Skeleton'
import type {
  StartupStat, StartupPortfolioItem, StartupFacility, StartupApplyStep, StartupOverview,
} from '../../services/startupService'
import startupService, {
  startupOverviewDefault, startupStatsDefault, startupPortfolioDefault,
  startupFacilitiesDefault, startupApplyStepsDefault,
} from '../../services/startupService'

const ICON_MAP: Record<string, LucideIcon> = {
  Rocket, Award, Users, TrendingUp, FlaskConical, Scale, Shield,
  BookOpen, Building2, Wifi, Sprout, Heart, CheckCircle2, Mail, Phone,
}

const SECTOR_COLORS: Record<string, { card: string; badge: string }> = {
  EdTech:     { card: 'bg-primary/5 border-primary/20',     badge: 'bg-primary/10 text-primary' },
  CleanTech:  { card: 'bg-accent/10 border-accent/30',      badge: 'bg-accent/15 text-accent' },
  HealthTech: { card: 'bg-primary/10 border-primary/25',    badge: 'bg-primary/15 text-primary' },
  AgriTech:   { card: 'bg-accent/15 border-accent/40',      badge: 'bg-accent/20 text-accent' },
  FinTech:    { card: 'bg-primary/5 border-primary/20',     badge: 'bg-primary/10 text-primary' },
  MedTech:    { card: 'bg-accent/10 border-accent/30',      badge: 'bg-accent/15 text-accent' },
}

const DEFAULT_SCHEME_LINKS = [
  { name: 'Startup India', url: 'https://startupindia.gov.in', desc: 'Tax exemptions, patent fee waivers, government procurement support, and regulatory compliance assistance.' },
  { name: 'Startup MP', url: 'https://mpstartupcell.mp.gov.in', desc: 'Madhya Pradesh government seed funding, mentorship, and incubation support under the MP Startup Policy 2022.' },
  { name: 'AICTE IDEA Lab', url: 'https://aicte-india.org/ideahub', desc: 'Maker infrastructure, prototyping facilities, and design thinking support for technology-focused student startups.' },
]

const StartupCellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [loading, setLoading]     = useGatedLoading()

  const [overview, setOverview]     = useState<StartupOverview>(startupOverviewDefault)
  const [stats, setStats]           = useState<StartupStat[]>(startupStatsDefault)
  const [portfolio, setPortfolio]   = useState<StartupPortfolioItem[]>(startupPortfolioDefault)
  const [facilities, setFacilities] = useState<StartupFacility[]>(startupFacilitiesDefault)
  const [applySteps, setApplySteps] = useState<StartupApplyStep[]>(startupApplyStepsDefault)
  const [schemeLinks, setSchemeLinks] = useState(DEFAULT_SCHEME_LINKS)

  useEffect(() => {
    const load = async () => {
      const [ov, st, pt, fc, ap] = await Promise.all([
        startupService.getStartupOverview(),
        startupService.getStartupStats(),
        startupService.getStartupPortfolio(),
        startupService.getStartupFacilities(),
        startupService.getStartupApplySteps(),
      ])
      if (ov) {
        setOverview(ov)
        if (Array.isArray(ov.externalLinks) && ov.externalLinks.length > 0) {
          setSchemeLinks(ov.externalLinks.map(l => ({
            name: l.label, url: l.url,
            desc: DEFAULT_SCHEME_LINKS.find(d => d.name === l.label)?.desc ?? ''
          })))
        }
      }
      if (st.length) setStats(st)
      if (pt.length) setPortfolio(pt)
      if (fc.length) setFacilities(fc)
      if (ap.length) setApplySteps(ap)
      setLoading(false)
    }
    load()
  }, [])

  const sectors = ['all', ...Array.from(new Set(portfolio.map(s => s.sector.toLowerCase().replace(/\s/g, ''))))]

  const filteredPortfolio = activeTab === 'all'
    ? portfolio
    : portfolio.filter(s => s.sector.toLowerCase().replace(/\s/g, '') === activeTab)

  const getColors = (sector: string) =>
    SECTOR_COLORS[sector] ?? SECTOR_COLORS.EdTech

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="startup-cell" />

      {/* Hero Banner */}
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-8 bg-accent" />
            <span className="text-xs uppercase font-bold tracking-widest text-accent font-sans">Entrepreneurship & Innovation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            SGSITS Startup &<br />Innovation Cell
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-sans max-w-2xl leading-relaxed mb-8">
            Recognized under <span className="text-accent font-semibold">Startup India</span> and{' '}
            <span className="text-accent font-semibold">Startup MP</span> initiatives,
            we fuel student entrepreneurs from idea to market — with mentorship, funding, and infrastructure.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${overview.contactEmail}`}
              className="inline-flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded font-bold text-sm hover:bg-accent/90 transition-colors shadow-lg"
            >
              Apply for Incubation <Rocket size={15} />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded font-semibold text-sm hover:bg-white/20 transition-colors"
            >
              Learn More <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-accent/10 border-b border-accent/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4">
                  <Sk className="w-12 h-12 rounded-lg" />
                  <div>
                    <Sk className="h-7 w-16 rounded mb-1" />
                    <Sk className="h-3 w-24 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s) => {
                const Icon = ICON_MAP[s.iconName] ?? Rocket
                return (
                  <div key={s.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
                      <p className="text-xs text-slate-600 font-semibold font-sans uppercase tracking-wide">{s.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16" id="about">

        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-2">About the Cell</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-5">
              Fostering the Next Generation of Innovators
            </h2>
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              <p>
                The <strong>SGSITS Startup & Innovation Cell</strong> was established to create a vibrant,
                self-sustaining entrepreneurship ecosystem for students, faculty, and alumni. Operating since 2018,
                the cell has grown into one of the most active innovation hubs in Madhya Pradesh's technical education sector,
                fostering over 15 startups that have collectively created meaningful employment and social impact.
              </p>
              <p>
                The cell provides end-to-end support — from ideation workshops and hackathons to prototype development,
                legal incorporation, investor connect events, and market access programs. It collaborates closely with
                AICTE's IDEA Lab framework, the Madhya Pradesh Startup Policy, and industry mentors from across
                India's leading technology and manufacturing sectors.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Mentors Network', value: '50+', desc: 'Industry experts & VCs' },
              { label: 'Programs Annually', value: '12+', desc: 'Workshops & bootcamps' },
              { label: 'MoUs Signed', value: '8', desc: 'Industry partners' },
              { label: 'Awards Won', value: '5', desc: 'National recognitions' },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <p className="text-2xl font-display font-bold text-primary">{item.value}</p>
                <p className="text-xs font-bold text-slate-700 mt-1 uppercase tracking-wide">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Startup Portfolio */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-2">Portfolio</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Startup Success Stories</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border-2 border-slate-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Sk className="w-10 h-10 rounded-lg" />
                      <div><Sk className="h-5 w-28 rounded mb-1" /><Sk className="h-4 w-16 rounded" /></div>
                    </div>
                    <Sk className="h-7 w-16 rounded" />
                  </div>
                  <Sk className="h-3 w-full rounded mb-1" />
                  <Sk className="h-3 w-full rounded mb-1" />
                  <Sk className="h-3 w-4/5 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-6">
                {sectors.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                      activeTab === tab
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'all' ? 'All Sectors' : tab}
                  </button>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredPortfolio.map((startup) => {
                  const Icon = ICON_MAP[startup.iconName] ?? Rocket
                  const colors = getColors(startup.sector)
                  return (
                    <div key={startup.name} className={`border-2 ${colors.card} rounded-xl p-6 hover:shadow-md transition-shadow`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon size={18} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-primary text-lg">{startup.name}</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>{startup.sector}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-display font-bold text-primary">{startup.funding}</p>
                          <p className="text-xs text-slate-500 font-semibold">{startup.stage}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed font-sans mb-4">{startup.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium border-t border-slate-200 pt-3">
                        <span className="flex items-center gap-1"><Users size={11} /> {startup.founders}</span>
                        <span className="flex items-center gap-1"><Award size={11} /> Founded {startup.year}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Incubation Facilities */}
        {(loading || facilities.length > 0) && (
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-2">Infrastructure</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">Incubation Facilities & Support</h2>
            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="border border-slate-200 rounded-xl p-5">
                    <Sk className="w-10 h-10 rounded-lg mb-3" />
                    <Sk className="h-4 w-32 rounded mb-2" />
                    <Sk className="h-3 w-full rounded mb-1" />
                    <Sk className="h-3 w-4/5 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {facilities.map((f) => {
                  const Icon = ICON_MAP[f.iconName] ?? Building2
                  return (
                    <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-accent/40 hover:shadow-md transition-all group">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                        <Icon size={18} className="text-primary group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-bold text-primary mb-2">{f.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed font-sans">{f.desc}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* How to Apply */}
        {applySteps.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-2">Application Process</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-8">How to Apply for Incubation</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {applySteps.map((s, i) => (
                <div key={s.step} className="relative">
                  {i < applySteps.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-full w-full h-px border-t-2 border-dashed border-slate-300 z-0" style={{ width: 'calc(100% - 2rem)' }} />
                  )}
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-display font-bold text-lg mb-4">
                      {s.step}
                    </div>
                    <h3 className="font-bold text-primary mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-600 font-sans leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Government Schemes */}
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-2">Schemes</span>
          <h2 className="text-2xl font-display font-bold text-primary mb-5">Government Startup Schemes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {schemeLinks.map((scheme) => (
              <a key={scheme.name} href={scheme.url} target="_blank" rel="noreferrer"
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-accent/40 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  <h3 className="font-bold text-primary">{scheme.name}</h3>
                </div>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">{scheme.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary rounded-2xl p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-display font-bold mb-2">Ready to Launch Your Startup?</h3>
            <p className="text-slate-300 text-sm font-sans mb-4">Join SGSITS's growing ecosystem of innovators. Applications open year-round.</p>
            <div className="flex flex-wrap gap-5 text-sm">
              <a href={`tel:${overview.contactPhone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone size={14} className="text-accent" /> {overview.contactPhone}
              </a>
              <a href={`mailto:${overview.contactEmail}`} className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail size={14} className="text-accent" /> {overview.contactEmail}
              </a>
            </div>
          </div>
          <a
            href={`mailto:${overview.contactEmail}`}
            className="shrink-0 inline-flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-lg font-bold text-sm hover:bg-accent/90 transition-colors shadow-lg"
          >
            Apply for Incubation <Rocket size={15} />
          </a>
        </div>

      </div>
    </div>
  )
}

export default StartupCellPage
