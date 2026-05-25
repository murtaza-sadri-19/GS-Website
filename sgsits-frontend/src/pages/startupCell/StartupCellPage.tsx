import React, { useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import {
  Rocket, Phone, Mail, Award, Users, TrendingUp,
  FlaskConical, Scale, Shield, BookOpen, CheckCircle2,
  ArrowRight, Building2, Wifi, Sprout, Heart
} from 'lucide-react'

const stats = [
  { value: '15', label: 'Startups Incubated', icon: Rocket },
  { value: '₹12 Cr', label: 'Funding Raised', icon: TrendingUp },
  { value: '80+', label: 'Jobs Created', icon: Users },
  { value: '3', label: 'Patents Filed', icon: Award },
]

const startups = [
  {
    name: 'EduTrack AI',
    sector: 'EdTech',
    year: '2022',
    funding: '₹1.5 Cr',
    stage: 'Seed',
    founders: 'Rohan Sharma & Priya Mishra (SGSITS Alumni)',
    description: 'AI-powered learning management system that personalizes study paths for engineering students using adaptive algorithms. Currently serving 15,000+ students across 8 colleges in Madhya Pradesh.',
    icon: BookOpen,
    color: 'bg-[#0b2545]/5 border-[#0b2545]/20',
    badge: 'bg-[#0b2545]/10 text-[#0b2545]',
  },
  {
    name: 'GreenGrid Solutions',
    sector: 'CleanTech',
    year: '2023',
    funding: '₹2.8 Cr',
    stage: 'Pre-Series A',
    founders: 'Ankit Joshi & Team (SGSITS E&I)',
    description: 'Smart energy management platform for industries and commercial buildings. Uses IoT sensors and ML to reduce energy wastage by up to 35%. Deployed in 20+ manufacturing units across central India.',
    icon: Wifi,
    color: 'bg-[#bfa15f]/10 border-[#bfa15f]/30',
    badge: 'bg-[#bfa15f]/15 text-[#bfa15f]',
  },
  {
    name: 'MediScan Pro',
    sector: 'HealthTech',
    year: '2021',
    funding: '₹3.2 Cr',
    stage: 'Series A',
    founders: 'Dr. Kavya Tiwari & Saurabh Patel (SGSITS CS)',
    description: 'Medical imaging AI platform that assists radiologists in detecting abnormalities in X-rays and MRI scans with 94.7% accuracy. Integrated with 12 hospitals across Indore, Bhopal, and Jabalpur.',
    icon: Heart,
    color: 'bg-[#0b2545]/10 border-[#0b2545]/25',
    badge: 'bg-[#0b2545]/15 text-[#0b2545]',
  },
  {
    name: 'AgroSense',
    sector: 'AgriTech',
    year: '2024',
    funding: '₹80 L',
    stage: 'Pre-Seed',
    founders: 'Vivek Kumar & Neha Singh (SGSITS EC)',
    description: 'IoT-based precision agriculture solution providing real-time soil health monitoring, weather alerts, and crop advisory for small farmers. Pilot deployed across 400 acres in Malwa region.',
    icon: Sprout,
    color: 'bg-[#bfa15f]/15 border-[#bfa15f]/40',
    badge: 'bg-[#bfa15f]/20 text-[#bfa15f]',
  },
]

const facilities = [
  { icon: Building2, title: 'Co-working Space', desc: '5,000 sq ft of dedicated co-working infrastructure with high-speed internet, meeting rooms, and 24×7 access for incubated startups.' },
  { icon: Users, title: 'Expert Mentorship', desc: 'Access to 50+ mentors including serial entrepreneurs, VCs, industry veterans, and SGSITS faculty with domain expertise.' },
  { icon: TrendingUp, title: 'Seed Funding', desc: 'Selected startups can access seed grants up to ₹5 Lakhs from SGSITS Startup Fund and facilitated connections to angel investors and Startup MP.' },
  { icon: Scale, title: 'Legal Support', desc: 'Free legal advisory for company incorporation, term sheet review, trademark registration, and compliance with startup-specific regulations.' },
  { icon: Shield, title: 'IP & Patent Support', desc: 'End-to-end patent filing assistance with faculty advisors and SGSITS Technology Transfer Office. Filing fee subsidized up to 70%.' },
  { icon: FlaskConical, title: 'Lab Access', desc: 'Access to departmental labs for prototyping — electronics, mechanical, chemistry, and computing labs with equipment support.' },
]

const applySteps = [
  { step: '01', title: 'Submit Application', desc: 'Fill the online Startup Incubation Application form at startup.sgsits.ac.in or collect a physical form from the Startup Cell office.' },
  { step: '02', title: 'Screening & Review', desc: 'The Startup Cell committee evaluates your application for innovation potential, feasibility, and social or commercial impact within 7 working days.' },
  { step: '03', title: 'Pitch Presentation', desc: 'Shortlisted applicants present their idea to a panel of mentors, faculty, and external investors in a 15-minute pitch session.' },
  { step: '04', title: 'Onboarding', desc: 'Selected startups sign an incubation agreement, receive their co-working space allocation, and are assigned a dedicated mentor for the 6-month program.' },
]

const StartupCellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'edtech' | 'cleantech' | 'healthtech' | 'agritech'>('all')

  const filteredStartups = activeTab === 'all'
    ? startups
    : startups.filter(s => s.sector.toLowerCase().replace(/\s/g, '') === activeTab)

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
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent font-sans">Entrepreneurship & Innovation</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            SGSITS Startup &<br />Innovation Cell
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-sans max-w-2xl leading-relaxed mb-8">
            Recognized under <span className="text-accent font-semibold">Startup India</span> and <span className="text-accent font-semibold">Startup MP</span> initiatives,
            we fuel student entrepreneurs from idea to market — with mentorship, funding, and infrastructure.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="mailto:startup@sgsits.ac.in"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                  <s.icon size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
                  <p className="text-xs text-slate-600 font-semibold font-sans uppercase tracking-wide">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16" id="about">

        {/* About Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">About the Cell</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-5">
              Fostering the Next Generation of Innovators
            </h2>
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              <p>
                The <strong>SGSITS Startup & Innovation Cell</strong> was established to create a vibrant, self-sustaining
                entrepreneurship ecosystem for students, faculty, and alumni. Operating since 2018, the cell has grown into
                one of the most active innovation hubs in Madhya Pradesh's technical education sector, fostering over
                15 startups that have collectively created meaningful employment and social impact.
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
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div>
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Portfolio</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Startup Success Stories</h2>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'edtech', 'cleantech', 'healthtech', 'agritech'] as const).map((tab) => (
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
            {filteredStartups.map((startup) => (
              <div key={startup.name} className={`border-2 ${startup.color} rounded-xl p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <startup.icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-primary text-lg">{startup.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${startup.badge}`}>{startup.sector}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-display font-bold text-primary">{startup.funding}</p>
                    <p className="text-[10px] text-slate-500 font-semibold">{startup.stage}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-sans mb-4">{startup.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 font-medium border-t border-current/10 pt-3">
                  <span className="flex items-center gap-1"><Users size={11} /> {startup.founders}</span>
                  <span className="flex items-center gap-1"><Award size={11} /> Founded {startup.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Incubation Facilities */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Infrastructure</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">Incubation Facilities & Support</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {facilities.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-accent/40 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-primary/8 rounded-lg flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                  <f.icon size={18} className="text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-sans">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Apply */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Application Process</span>
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

        {/* Government Schemes */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Schemes</span>
          <h2 className="text-2xl font-display font-bold text-primary mb-5">Government Startup Schemes</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: 'Startup India', url: 'https://startupindia.gov.in', desc: 'Tax exemptions, patent fee waivers, government procurement support, and regulatory compliance assistance.' },
              { name: 'Startup MP', url: 'https://mpstartupcell.mp.gov.in', desc: 'Madhya Pradesh government seed funding, mentorship, and incubation support under the MP Startup Policy 2022.' },
              { name: 'AICTE IDEA Lab', url: 'https://www.aicte-india.org/ideahub', desc: 'Maker infrastructure, prototyping facilities, and design thinking support for technology-focused student startups.' },
            ].map((scheme) => (
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
              <a href="tel:+917312431300" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone size={14} className="text-accent" />
                +91-731-2431300
              </a>
              <a href="mailto:startup@sgsits.ac.in" className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail size={14} className="text-accent" />
                startup@sgsits.ac.in
              </a>
            </div>
          </div>
          <a
            href="mailto:startup@sgsits.ac.in"
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
