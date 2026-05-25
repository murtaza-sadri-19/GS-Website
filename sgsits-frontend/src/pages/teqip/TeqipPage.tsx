import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { useParams } from 'react-router-dom'
import {
  CheckCircle2, Download, Mail, FlaskConical, GraduationCap,
  Users, BookOpen, TrendingUp, Building2, Calendar, FileText
} from 'lucide-react'

const achievements = [
  {
    icon: FlaskConical,
    title: 'Laboratories Upgraded',
    value: '18',
    desc: '18 state-of-the-art laboratories upgraded across departments including Electronics, Computer Science, Mechanical, and Civil Engineering with world-class equipment.',
    color: 'bg-[#0b2545]/5 border-[#0b2545]/20 text-[#0b2545]',
  },
  {
    icon: GraduationCap,
    title: 'Students Trained',
    value: '2,400+',
    desc: 'Over 2,400 students received specialized training through bridge courses, remedial programs, and industry-skill enhancement workshops.',
    color: 'bg-[#bfa15f]/10 border-[#bfa15f]/30 text-[#bfa15f]',
  },
  {
    icon: Users,
    title: 'Faculty Development',
    value: '215',
    desc: '215 faculty members attended Faculty Development Programs (FDPs), Short-Term Training Programs (STTPs), and international workshops.',
    color: 'bg-[#0b2545]/10 border-[#0b2545]/25 text-[#0b2545]',
  },
  {
    icon: TrendingUp,
    title: 'Research Grants',
    value: '₹3.8 Cr',
    desc: '₹3.8 Crores in sponsored research grants secured from DST, SERB, DBT, and industry partners under TEQIP funding facilitation.',
    color: 'bg-[#bfa15f]/15 border-[#bfa15f]/40 text-[#bfa15f]',
  },
  {
    icon: Building2,
    title: 'Placement Improvement',
    value: '+38%',
    desc: 'Placement rates improved by 38% during the TEQIP period, with 45+ new industry MoUs signed for internships, placements, and research collaboration.',
    color: 'bg-[#0b2545]/15 border-[#0b2545]/30 text-[#0b2545]',
  },
]

const activities = [
  {
    category: 'Industry Interaction',
    items: [
      'Annual Industry-Academia Conclave with 80+ companies',
      'Expert lectures by industry professionals (200+ sessions)',
      'MoU signing with TCS, Infosys, L&T, BHEL, NTPC, and others',
      'Industrial visits for students across all semesters',
      'Internship facilitation with stipend support',
    ],
  },
  {
    category: 'Short-Term Training Programs (SSTPs)',
    items: [
      'Advanced VLSI Design (1 week) — 45 faculty participants',
      'Machine Learning & Deep Learning — 3-day intensive',
      'Green Building Technologies — 5-day program',
      'Research Methodology & Technical Writing — Annual',
      'Outcome-Based Education (OBE) Implementation — For all HODs',
    ],
  },
  {
    category: 'Workshops',
    items: [
      'National Workshop on Additive Manufacturing (3D Printing)',
      'IoT and Embedded Systems for Industry 4.0',
      'Renewable Energy Systems — Solar & Wind',
      'Entrepreneurship Development Program (EDP)',
      'Competitive Examination Guidance for GATE/PSUs',
    ],
  },
  {
    category: 'Bridge & Remedial Courses',
    items: [
      'Mathematics Bridge Course for lateral entry students',
      'Communication Skills & Technical English',
      'Computer Programming Fundamentals',
      'Engineering Drawing and CAD basics',
      'Soft skills and personality development modules',
    ],
  },
]

const milestones = [
  { year: '2017', event: 'SGSITS selected as TEQIP-III beneficiary institution', type: 'milestone' },
  { year: '2017', event: 'Sanction of ₹14 Crores from World Bank & Govt. of India', type: 'funding' },
  { year: '2018', event: 'Launch of 6 new upgraded laboratories — Electronics & IT blocks', type: 'infra' },
  { year: '2018', event: 'First batch of 40 faculty complete FDPs at IIT Bombay, IIT Delhi', type: 'academic' },
  { year: '2019', event: '3 undergraduate programs receive NBA accreditation', type: 'milestone' },
  { year: '2019', event: 'First Annual Industry-Academia Conclave held — 50+ companies participated', type: 'academic' },
  { year: '2020', event: 'Transition to online STTP and workshops during COVID-19 pandemic', type: 'academic' },
  { year: '2020', event: 'Research output: 85 publications in Scopus-indexed journals', type: 'milestone' },
  { year: '2021', event: 'TEQIP-III project period concluded with successful audit', type: 'milestone' },
  { year: '2021', event: 'Final utilization certificate submitted — 98.7% funds utilized', type: 'funding' },
]

const downloads = [
  { title: 'TEQIP-III Institutional Development Plan (IDP)', size: '2.4 MB', type: 'PDF' },
  { title: 'TEQIP-III Final Report — SGSITS Indore', size: '5.1 MB', type: 'PDF' },
  { title: 'TEQIP Lab Upgradation Details', size: '1.8 MB', type: 'PDF' },
  { title: 'Faculty Development Activities Report', size: '3.2 MB', type: 'PDF' },
  { title: 'Student Training Programs Summary', size: '1.1 MB', type: 'PDF' },
  { title: 'Procurement Reports & Audited Statements', size: '4.7 MB', type: 'PDF' },
]

const TeqipPage: React.FC = () => {
  const { subpage: _subpage } = useParams<{ subpage: string }>()
  // subpage is accepted but ignored — we render a comprehensive TEQIP page

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="teqip" />

      {/* Hero */}
      <div className="relative bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-accent rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-accent" />
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent font-sans">World Bank Funded Initiative</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
            Technical Education Quality<br />Improvement Programme (TEQIP)
          </h1>
          <p className="text-slate-300 text-base font-sans max-w-2xl leading-relaxed">
            SGSITS Indore was selected as a beneficiary institution under <span className="text-accent font-semibold">TEQIP Phase-III</span>,
            funded jointly by the <span className="text-accent font-semibold">World Bank</span> and the <span className="text-accent font-semibold">Government of India</span>,
            receiving ₹14 Crores for transformative academic and infrastructure improvements.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-accent/10 border-b border-accent/20">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '₹14 Cr', label: 'Grant Received' },
              { value: 'Phase III', label: 'TEQIP Phase' },
              { value: '2017–21', label: 'Project Period' },
              { value: '200+', label: 'Faculty Trained' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* About TEQIP */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">About the Programme</span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-5">What is TEQIP-III?</h2>
            <div className="space-y-4 text-sm text-slate-700 leading-relaxed font-sans">
              <p>
                The <strong>Technical Education Quality Improvement Programme (TEQIP)</strong> is a collaborative initiative
                of the Ministry of Education, Government of India, and the World Bank aimed at strengthening the quality,
                relevance, and efficiency of technical education in selected public engineering institutions.
              </p>
              <p>
                TEQIP Phase-III (2017–2021) focused on <strong>Outcome-Based Education (OBE)</strong> implementation,
                institutional performance improvements, equity measures for underrepresented students, industry linkages,
                faculty development, and research promotion. SGSITS Indore was one of 75 institutions selected nationwide.
              </p>
            </div>
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Key Objectives</span>
            <div className="space-y-3">
              {[
                'Implement Outcome-Based Education across all UG programs',
                'Achieve NBA accreditation for 6+ undergraduate programs',
                'Increase sponsored research and peer-reviewed publications',
                'Provide scholarships and coaching for SC/ST/OBC students',
                'Build sustainable faculty development systems',
                'Strengthen industry-institute collaboration and MoUs',
              ].map((obj) => (
                <div key={obj} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 font-medium font-sans">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Achievements */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Impact</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">Key Achievements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((a) => (
              <div key={a.title} className={`border-2 ${a.color} rounded-xl p-5`}>
                <div className="flex items-center gap-3 mb-3">
                  <a.icon size={20} />
                  <h3 className="font-bold text-slate-800 text-sm">{a.title}</h3>
                </div>
                <p className="text-3xl font-display font-bold text-primary mb-3">{a.value}</p>
                <p className="text-sm text-slate-600 font-sans leading-relaxed">{a.desc}</p>
              </div>
            ))}
            {/* Filler card for grid alignment */}
            <div className="bg-primary rounded-xl p-5 text-white flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-accent mb-2">Overall Outcome</h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans">
                  SGSITS successfully achieved all key performance indicators set under TEQIP-III with 98.7% funds utilized
                  before project closure in 2021. The institute received a commendable audit rating from the World Bank.
                </p>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-display font-bold text-accent">98.7%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Fund Utilization</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Programs</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">Activities & Programs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {activities.map((activity) => (
              <div key={activity.category} className="bg-white border border-slate-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-accent" />
                  <h3 className="font-display font-bold text-primary">{activity.category}</h3>
                </div>
                <ul className="space-y-2">
                  {activity.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-600 font-sans">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">History</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">Key Milestones Timeline</h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-5 pl-14 relative">
                  <div className="absolute left-0 flex items-center">
                    <div className="w-12 text-right text-xs font-bold text-slate-500 font-sans">{m.year}</div>
                    <div className={`w-3 h-3 rounded-full border-2 ml-3 shrink-0 ${
                      m.type === 'funding' ? 'bg-accent border-accent' :
                      m.type === 'infra' ? 'bg-[#0b2545] border-[#0b2545]' :
                      m.type === 'academic' ? 'bg-[#bfa15f] border-[#bfa15f]' :
                      'bg-primary border-primary'
                    }`} />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex-1">
                    <p className="text-sm text-slate-700 font-medium font-sans">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-5">
            {[
              { color: 'bg-primary', label: 'Milestone' },
              { color: 'bg-accent', label: 'Funding' },
              { color: 'bg-[#0b2545]', label: 'Infrastructure' },
              { color: 'bg-[#bfa15f]', label: 'Academic' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                <div className={`w-3 h-3 rounded-full ${l.color}`} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        {/* Downloads */}
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-accent block mb-2">Resources</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-6">Documents & Downloads</h2>
          <div className="space-y-3">
            {downloads.map((doc) => (
              <div key={doc.title} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-slate-400 hover:shadow-sm transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-[#bfa15f]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.type} · {doc.size}</p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1.5 text-xs font-bold text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-colors shrink-0"
                  onClick={(e) => e.preventDefault()}
                >
                  <Download size={12} /> Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-primary text-lg mb-1">TEQIP Coordinator — SGSITS Indore</h3>
            <p className="text-sm text-slate-600 font-sans mb-3">For queries related to TEQIP activities, documentation, and reports:</p>
            <div className="flex flex-wrap gap-5 text-sm">
              <a href="mailto:teqip@sgsits.ac.in" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
                <Mail size={14} className="text-accent" /> teqip@sgsits.ac.in
              </a>
              <a href="tel:07312431234" className="flex items-center gap-2 text-primary hover:text-accent transition-colors">
                <Calendar size={14} className="text-accent" /> 0731-2431234 (Extn. 210)
              </a>
            </div>
          </div>
          <div className="bg-primary text-white rounded-lg px-5 py-3 text-center shrink-0">
            <p className="text-xs text-slate-300 font-semibold uppercase tracking-wide">Project Period</p>
            <p className="text-lg font-display font-bold text-accent">2017 — 2021</p>
            <p className="text-xs text-slate-400">TEQIP Phase III</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default TeqipPage
