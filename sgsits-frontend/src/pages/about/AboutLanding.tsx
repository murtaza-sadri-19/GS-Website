/**
 * AboutLanding — Premium About section landing page
 * Brand palette only: white · navy (#0b2545) · gold (#bfa15f)
 * Cards cycle through 3 tinted themes at 10-15% opacity.
 */

import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { SkeletonNavCard, SkeletonSimpleStat } from '../../components/ui/Skeleton'
import { Sk } from '../../components/ui/Skeleton'
import {
  Landmark, Target, MessageSquare, Building2, Users, ClipboardList,
  Phone, Cpu, GraduationCap, Award, ShieldCheck,
  ArrowRight, ChevronRight, Home, BookOpen, Trophy,
  Library, Dumbbell, FlaskConical, Microscope,
} from 'lucide-react'
import {
  institutionService,
  institutionStatsDefault, institutionTimelineDefault, institutionHighlightsDefault,
  type InstitutionStat, type InstitutionTimelineEvent, type InstitutionHighlight,
} from '../../services/institutionService'

// ── 3-theme cycle — uses CSS variables so admin theme changes apply live ──────
const THEMES = [
  {
    bg:     'rgba(var(--color-primary-rgb), 0.08)',
    border: 'rgba(var(--color-primary-rgb), 0.19)',
    iconBg: 'rgba(var(--color-primary-rgb), 0.13)',
    color:  'var(--color-primary)',
  },
  {
    bg:     'rgba(var(--color-accent-rgb), 0.08)',
    border: 'rgba(var(--color-accent-rgb), 0.21)',
    iconBg: 'rgba(var(--color-accent-rgb), 0.13)',
    color:  'var(--color-accent)',
  },
  {
    bg:     '#ffffff',
    border: 'rgba(var(--color-primary-rgb), 0.13)',
    iconBg: 'rgba(var(--color-primary-rgb), 0.06)',
    color:  'var(--color-primary)',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = (d = 0.06) => ({ hidden: {}, show: { transition: { staggerChildren: d } } })

function useCountUp(end: number, inView: boolean, duration = 1.4) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const s = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - s) / (duration * 1000), 1)
      setV(Math.floor((1 - Math.pow(1 - t, 3)) * end))
      if (t < 1) requestAnimationFrame(tick); else setV(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end, duration])
  return v
}

// ── Data ─────────────────────────────────────────────────────────────────────

const QUICK_CARDS = [
  { Icon: Landmark,      title: 'About Institute',          desc: 'History, legacy, and milestones of SGSITS.',            path: '/about/institute'          },
  { Icon: Target,        title: 'Vision & Mission',         desc: 'Guiding principles and strategic direction.',           path: '/about/vision-mission'     },
  { Icon: MessageSquare, title: "Director's Message",       desc: 'Inspiring words from the Director of SGSITS.',         path: '/about/director-message'   },
  { Icon: Building2,     title: 'Administration',           desc: 'Key administrative officers and contacts.',             path: '/about/administration'     },
  { Icon: Users,         title: 'Governing Body',           desc: 'Distinguished members overseeing the institute.',       path: '/about/governing-body'     },
  { Icon: ClipboardList, title: 'Committees',               desc: 'Administrative committees and responsibilities.',       path: '/about/committees'         },
  { Icon: Phone,         title: 'Telephone Directory',      desc: 'Official directory of departments and offices.',        path: '/about/telephone-directory'},
  { Icon: Cpu,           title: 'Infrastructure',           desc: 'Labs, buildings and campus facilities.',                path: '/about/infrastructure'     },
  { Icon: GraduationCap, title: 'Academic Council',         desc: 'Academic governance body of the institute.',            path: '/about/academic-council'   },
  { Icon: Award,         title: 'Accreditation (NBA/NAAC)', desc: 'NBA and NAAC accreditation status and reports.',        path: '/about/accreditation'      },
  { Icon: ShieldCheck,   title: 'IQAC Cell',                desc: 'Internal Quality Assurance Cell and its initiatives.', path: '/about/iqac'               },
]

// Stats: alternating navy / gold
const STATS = [
  { value: 70,   suffix: '+', label: 'Years of Excellence', theme: 0 },
  { value: 5000, suffix: '+', label: 'Students Enrolled',   theme: 1 },
  { value: 20,   suffix: '+', label: 'Departments',         theme: 0 },
  { value: 300,  suffix: '+', label: 'Faculty & Staff',     theme: 1 },
]

const TIMELINE = [
  { year: '1952', theme: 0, title: 'Institute Founded', desc: 'SGSITS established as a premier technical institute in Indore, M.P.'   },
  { year: '1975', theme: 1, title: 'Campus Expansion',  desc: 'Major infrastructure expansion to accommodate growing student intake.'  },
  { year: '1990', theme: 0, title: 'Autonomous Status', desc: 'Autonomous status granted, enabling independent curriculum design.'     },
  { year: '2000', theme: 1, title: 'NBA Accreditation', desc: 'Multiple engineering programmes received NBA accreditation.'            },
  { year: '2015', theme: 0, title: 'NAAC Grading',      desc: 'SGSITS received NAAC accreditation affirming quality standards.'        },
  { year: '2024', theme: 1, title: 'Innovation Center', desc: 'AICTE IDEA Lab and Innovation Center launched on campus.'              },
]

const HIGHLIGHTS = [
  { Icon: Cpu,          theme: 0, title: 'Computer Laboratories', desc: '1000+ workstations with high-speed internet'            },
  { Icon: Library,      theme: 1, title: 'Central Library',       desc: '80,000+ books, journals and digital resources'          },
  { Icon: FlaskConical, theme: 0, title: 'Research Labs',         desc: 'Advanced facilities across all engineering disciplines' },
  { Icon: Dumbbell,     theme: 1, title: 'Sports Complex',        desc: 'Indoor and outdoor sports facilities'                   },
  { Icon: Trophy,       theme: 0, title: 'Auditorium',            desc: '2000-seat auditorium for events and seminars'           },
  { Icon: Microscope,   theme: 1, title: 'Innovation Hub',        desc: 'AICTE IDEA Lab with 3D printers and IoT kits'          },
]

const EXPLORE = [
  { Icon: BookOpen, theme: 0, title: 'Academics',   desc: 'Programmes, calendar, and ordinances',  path: '/academics'   },
  { Icon: Users,    theme: 1, title: 'Admissions',  desc: 'UG, PG and Ph.D. admission process',    path: '/admission'   },
  { Icon: Trophy,   theme: 0, title: 'Placements',  desc: 'Recruiters, records, and T&P Cell',     path: '/placement'   },
  { Icon: Landmark, theme: 1, title: 'Campus Life', desc: 'Activities, NCC, NSS and scholarships', path: '/campus-life' },
]

// ── Reusable colour card ─────────────────────────────────────────────────────

const Card: React.FC<{ themeIdx: number; Icon: React.ElementType; title: string; desc: string; path: string }> =
  ({ themeIdx, Icon, title, desc, path }) => {
    const t = THEMES[themeIdx % THEMES.length]
    return (
      <Link
        to={path}
        className="rounded border p-5 hover:shadow-md transition-all duration-200 group flex flex-col h-full"
        style={{ background: t.bg, borderColor: t.border }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 shrink-0 group-hover:scale-110 transition-transform duration-200"
          style={{ background: t.iconBg, border: `1px solid ${t.border}` }}
        >
          <Icon size={16} style={{ color: t.color }} />
        </div>
        <h3 className="font-bold text-sm text-primary leading-snug mb-1.5">{title}</h3>
        <p className="text-xs text-slate-600 font-medium leading-relaxed flex-1">{desc}</p>
        <div className="mt-3 pt-3 flex justify-end" style={{ borderTop: `1px solid ${t.border}` }}>
          <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" style={{ color: t.color }} />
        </div>
      </Link>
    )
  }

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-3 mb-6">
    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{label}</h2>
    <div className="flex-grow h-px bg-slate-200" />
  </div>
)

// ── Page Header ───────────────────────────────────────────────────────────────

const PageHeader: React.FC = () => (
  <motion.div
    className="max-w-[1400px] mx-auto px-4 lg:px-12 pt-8 pb-6 border-b border-slate-200"
    initial="hidden" animate="show" variants={stagger(0.08)}
  >
    <motion.nav variants={fadeUp} className="flex items-center gap-1 text-xs text-slate-400 font-medium mb-4 flex-wrap">
      <Link to="/" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
        <Home className="w-3 h-3" />Home
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <span className="text-slate-600">About Us</span>
    </motion.nav>
    <motion.span variants={fadeUp} className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1.5">About SGSITS</motion.span>
    <motion.h1 variants={fadeUp} className="text-2xl md:text-3xl font-display font-bold text-primary">About the Institute</motion.h1>
    <motion.p variants={fadeUp} className="text-sm text-slate-500 mt-1.5 font-medium max-w-2xl">
      Explore the institute's history, leadership, governance, accreditation, infrastructure, and vision.
    </motion.p>
    <motion.div variants={fadeUp} className="mt-5 flex flex-wrap gap-3">
      <a href="#sections" className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors">
        Explore Sections <ChevronRight className="w-3.5 h-3.5" />
      </a>
      <Link to="/about/institute" className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-semibold text-primary border border-slate-200 hover:border-primary/40 hover:bg-slate-50 transition-all">
        Our History <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  </motion.div>
)

// ── Stats ─────────────────────────────────────────────────────────────────────

// Separate component so useCountUp is called at the top level (not inside .map)
const StatItem: React.FC<{ s: typeof STATS[0]; inView: boolean }> = ({ s, inView }) => {
  const t     = THEMES[s.theme]
  const count = useCountUp(s.value, inView)
  return (
    <div className="rounded border p-4 text-center shadow-sm" style={{ background: t.bg, borderColor: t.border }}>
      <p className="text-2xl font-display font-bold" style={{ color: t.color }}>{count}{s.suffix}</p>
      <p className="text-[11px] text-slate-600 font-bold uppercase tracking-wider mt-1">{s.label}</p>
    </div>
  )
}

const StatsSection: React.FC<{ ready: boolean; stats: InstitutionStat[] }> = ({ ready, stats }) => {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const adaptedStats = stats.map((s, i) => ({
    value:  parseInt(s.value.replace(/[^\d]/g, '')) || 0,
    suffix: s.suffix ?? '+',
    label:  s.label,
    theme:  i % 2,
  }))

  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8" ref={ref}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {!ready
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonSimpleStat key={i} />)
          : adaptedStats.map((s) => <StatItem key={s.label} s={s} inView={inView} />)
        }
      </div>
    </div>
  )
}

// ── Quick Access ──────────────────────────────────────────────────────────────

const QuickAccessCards: React.FC<{ ready: boolean }> = ({ ready }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div id="sections" className="bg-brand-light py-10 px-4 lg:px-12" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel label="Explore About SGSITS" />
        {!ready ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 11 }).map((_, i) => <SkeletonNavCard key={i} />)}
          </div>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={stagger(0.055)} initial="hidden" animate={inView ? 'show' : 'hidden'}
          >
            {QUICK_CARDS.map((c, i) => (
              <motion.div key={c.path} variants={fadeUp}>
                <Card themeIdx={i} Icon={c.Icon} title={c.title} desc={c.desc} path={c.path} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ── Featured Content ──────────────────────────────────────────────────────────

const FeaturedContent: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-10" ref={ref}>
      <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger(0.08)} className="grid lg:grid-cols-2 gap-8 items-start">
        <div>
          <motion.div variants={fadeUp}><SectionLabel label="Institute Overview" /></motion.div>
          <motion.p variants={fadeUp} className="text-slate-600 text-sm leading-relaxed">
            Shri G.S. Institute of Technology and Science (SGSITS), Indore, is one of India's most reputed
            technical institutions. Established in 1952, it has shaped the careers of thousands of engineers
            and scientists who lead industries globally.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-3 text-slate-600 text-sm leading-relaxed">
            Recognised by AICTE and affiliated to RGPV, SGSITS offers UG, PG and doctoral programmes across
            17+ disciplines, maintaining a tradition of academic rigor and industry relevance.
          </motion.p>
          <motion.blockquote variants={fadeUp} className="mt-5 pl-4 border-l-2 py-0.5" style={{ borderColor: 'var(--color-accent)' }}>
            <p className="text-slate-600 text-sm italic leading-relaxed font-display">
              "Our mission is to produce not just competent engineers, but responsible leaders who drive
              progress and innovation for the nation."
            </p>
            <footer className="mt-2 text-xs font-bold text-primary">— Director, SGSITS Indore</footer>
          </motion.blockquote>
          <motion.div variants={fadeUp} className="mt-5">
            <Link to="/about/institute" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/70 transition-colors">
              Read Full Overview <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="rounded border border-slate-200 p-6 shadow-sm bg-white">
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-3">Our Mission</span>
          <p className="text-primary text-sm leading-relaxed font-display font-medium">
            "To impart quality technical education that cultivates innovation, integrity, and leadership,
            enabling graduates to excel in a globally competitive environment."
          </p>
          <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
            {[
              { label: 'NBA Accredited',  sub: 'Multiple Programmes', t: 0 },
              { label: 'NAAC Accredited', sub: 'Grade A',             t: 1 },
              { label: 'AICTE Approved',  sub: 'All Programmes',      t: 0 },
              { label: 'RGPV Affiliated', sub: 'University',          t: 1 },
            ].map(({ label, sub, t }) => {
              const theme = THEMES[t]
              return (
                <div key={label} className="rounded p-2.5" style={{ background: theme.bg, border: `1px solid ${theme.border}` }}>
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.color }}>{label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{sub}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4">
            <Link to="/about/accreditation" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/70 transition-colors">
              View Accreditation Details <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

// ── Timeline ──────────────────────────────────────────────────────────────────

const TimelineSection: React.FC<{ ready: boolean; timeline: InstitutionTimelineEvent[] }> = ({ ready, timeline }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div className="bg-brand-light py-10 px-4 lg:px-12" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel label="Our Journey" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {!ready
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded border border-slate-200 bg-white p-5 shadow-sm space-y-2" aria-hidden="true">
                  <Sk className="h-6 w-16 rounded" />
                  <Sk className="h-4 w-3/4 rounded" />
                  <Sk className="h-3 w-full rounded" />
                  <Sk className="h-3 w-5/6 rounded" />
                </div>
              ))
            : timeline.map(({ year, title, description }, i) => {
                const t = THEMES[i % 2]
                return (
                  <motion.div key={year} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: i * 0.07 }}
                    className="rounded border p-5 shadow-sm" style={{ background: t.bg, borderColor: t.border }}>
                    <span className="text-xl font-display font-bold block mb-1" style={{ color: t.color }}>{year}</span>
                    <h3 className="font-bold text-sm text-primary mb-1.5">{title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>
                  </motion.div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

// ── Campus Highlights ─────────────────────────────────────────────────────────

const HIGHLIGHT_ICONS = [Cpu, Library, FlaskConical, Dumbbell, Trophy, Microscope]

const CampusHighlights: React.FC<{ ready: boolean; highlights: InstitutionHighlight[] }> = ({ ready, highlights }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-10" ref={ref}>
      <SectionLabel label="Campus Facilities" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!ready
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded border border-slate-200 bg-white p-5 shadow-sm space-y-2" aria-hidden="true">
                <Sk className="w-9 h-9 rounded-lg mb-3" />
                <Sk className="h-4 w-3/4 rounded" />
                <Sk className="h-3 w-full rounded" />
                <Sk className="h-3 w-5/6 rounded" />
              </div>
            ))
          : highlights.map(({ title, description }, i) => {
              const t    = THEMES[i % 2]
              const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]
              return (
                <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: i * 0.07 }}
                  className="rounded border p-5 shadow-sm hover:shadow-md transition-all group" style={{ background: t.bg, borderColor: t.border }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200"
                    style={{ background: t.iconBg, border: `1px solid ${t.border}` }}>
                    <Icon size={16} style={{ color: t.color }} />
                  </div>
                  <h3 className="font-bold text-sm text-primary mb-1.5">{title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{description}</p>
                </motion.div>
              )
            })
        }
      </div>
      <div className="mt-5">
        <Link to="/about/infrastructure" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/70 transition-colors">
          View Full Infrastructure Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}

// ── Explore More ──────────────────────────────────────────────────────────────

const ExploreMore: React.FC<{ ready: boolean }> = ({ ready }) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <div className="bg-brand-light py-10 px-4 lg:px-12" ref={ref}>
      <div className="max-w-[1400px] mx-auto">
        <SectionLabel label="Continue Exploring" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {!ready
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonNavCard key={i} />)
            : EXPLORE.map(({ Icon, theme, title, desc, path }, i) => (
                <motion.div key={path} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.45, delay: i * 0.07 }}>
                  <Card themeIdx={theme} Icon={Icon} title={title} desc={desc} path={path} />
                </motion.div>
              ))
          }
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

const AboutLanding: React.FC = () => {
  const [ready, setReady]           = useState(false)
  const [stats, setStats]           = useState<InstitutionStat[]>(institutionStatsDefault)
  const [timeline, setTimeline]     = useState<InstitutionTimelineEvent[]>(institutionTimelineDefault)
  const [highlights, setHighlights] = useState<InstitutionHighlight[]>(institutionHighlightsDefault)

  useEffect(() => {
    Promise.all([
      institutionService.getInstitutionStats(),
      institutionService.getInstitutionTimeline(),
      institutionService.getInstitutionHighlights(),
    ]).then(([s, t, h]) => {
      if (s.length) setStats(s)
      if (t.length) setTimeline(t)
      if (h.length) setHighlights(h)
      setReady(true)
    })
  }, [])

  return (
    <div className="w-full">
      <PageHeader />
      <StatsSection ready={ready} stats={stats} />
      <QuickAccessCards ready={ready} />
      <FeaturedContent />
      <TimelineSection ready={ready} timeline={timeline} />
      <CampusHighlights ready={ready} highlights={highlights} />
      <ExploreMore ready={ready} />
    </div>
  )
}

export default AboutLanding
