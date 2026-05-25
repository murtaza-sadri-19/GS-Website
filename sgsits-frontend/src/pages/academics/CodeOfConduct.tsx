import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { GraduationCap, Users, Building2, Scale, AlertTriangle, FileText, ArrowUpRight } from 'lucide-react'

const guidelines = [
  {
    icon: GraduationCap,
    title: 'Academic Integrity',
    desc: 'Uphold the highest standards of scholarship. Submit strictly original work, ensure proper citation of research and literature, and maintain absolute transparency during exams and projects.'
  },
  {
    icon: Users,
    title: 'Campus Behavior',
    desc: 'Foster respect and inclusivity. SGSITS enforces a strict zero-tolerance policy towards ragging, harassment, or discrimination of any form. Treat all members of our community with dignity.'
  },
  {
    icon: Building2,
    title: 'Use of Facilities',
    desc: 'Engage with college resources responsibly. Take care of advanced laboratory apparatus, server rooms, libraries, and sports infrastructure. Any deliberate damage is subject to disciplinary action.'
  },
  {
    icon: Scale,
    title: 'Disciplinary Process',
    desc: 'Be accountable. Code infractions are referred to the high-level Institute Discipline Committee. Consequences may include formal warnings, record suspension, or permanent expulsion.'
  }
]

const CodeOfConduct: React.FC = () => {
  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/code-of-conduct" />
      {/* Page Header */}
      <div className="border-b border-gray-100 dark:border-slate-800 pb-5">
        <span className="text-xs uppercase font-extrabold tracking-widest text-accent">Student Policies</span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-primary dark:text-white font-display">
          Code of Conduct
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-semibold">
          Student ethical standards, academic integrity, and behavior guidelines
        </p>
      </div>

      {/* Critical Zero Tolerance Alert Banner */}
      <div className="bg-[#bfa15f]/10 dark:bg-[#bfa15f]/15 border-l-4 border-[#bfa15f] rounded-lg p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded bg-[#bfa15f]/20 flex items-center justify-center text-[#0b2545] dark:text-[#bfa15f] shrink-0">
          <AlertTriangle size={20} className="stroke-[2.5]" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[14px] text-[#0b2545] dark:text-[#bfa15f]">
            Strict Zero-Tolerance Anti-Ragging Regulation
          </h4>
          <p className="text-xs text-[#0b2545] dark:text-slate-300 font-medium leading-relaxed">
            Ragging in any form is a severe criminal offense under State and Central legislation. Any student found guilty of ragging on or off-campus is liable to face immediate police arrest, immediate expulsion from the institute, and a permanent academic ban.
          </p>
        </div>
      </div>

      {/* Grid Cards of Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guidelines.map((item, idx) => {
          const Icon = item.icon
          return (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-900 p-5 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-sm flex items-center justify-center text-primary dark:text-accent">
                  <Icon size={18} className="stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-primary dark:text-white">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* PDF Download Widget */}
      <div className="bg-[#0b2545] dark:bg-slate-850 text-white rounded-lg p-5 border-l-4 border-accent shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-accent shrink-0">
            <FileText size={20} className="stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Comprehensive Rules & Handbook</h4>
            <p className="text-xs text-slate-350 mt-0.5">Official guide detailing academic codes, dress codes, and institutional regulations</p>
          </div>
        </div>

        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); alert('Conduct Handbook PDF will open in a new tab.'); }}
          className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary px-4 py-2.5 rounded text-xs font-bold transition-colors shrink-0"
        >
          Download PDF Guide
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  )
}

export default CodeOfConduct
