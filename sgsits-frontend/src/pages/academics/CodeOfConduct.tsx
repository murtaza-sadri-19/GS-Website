import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { GraduationCap, Users, Building2, Scale, AlertTriangle, FileText, ArrowUpRight } from 'lucide-react'
import { getCodeOfEthics, codeOfEthicsDefault, type CodeOfEthicsData } from '../../services/academicsService'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'Academic Integrity':   GraduationCap,
  'Campus Behavior':      Users,
  'Use of Facilities':    Building2,
  'Disciplinary Process': Scale,
}
const DEFAULT_ICON = GraduationCap

const CodeOfConduct: React.FC = () => {
  const [data, setData] = useState<CodeOfEthicsData>(codeOfEthicsDefault)

  useEffect(() => {
    getCodeOfEthics().then(d => { if (d && Object.keys(d).length > 0) setData(d) }).catch(() => {})
  }, [])

  const guidelines  = data.guidelines       ?? codeOfEthicsDefault.guidelines       ?? []
  const pdfUrl      = data.pdfUrl           ?? codeOfEthicsDefault.pdfUrl
  const antiRagging = data.antiRaggingAlert ?? codeOfEthicsDefault.antiRaggingAlert ?? ''

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/code-of-conduct" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Student Policies</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
          Code of Conduct
        </h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">
          Student ethical standards, academic integrity, and behavior guidelines
        </p>
      </div>

      {/* Zero Tolerance Alert Banner */}
      {antiRagging && (
        <div className="bg-accent/10 border-l-4 border-accent rounded p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-accent/20 flex items-center justify-center text-primary shrink-0">
            <AlertTriangle size={20} className="stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-primary">Strict Zero-Tolerance Anti-Ragging Regulation</h4>
            <p className="text-xs text-primary font-medium leading-relaxed">{antiRagging}</p>
          </div>
        </div>
      )}

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {guidelines.map((item, idx) => {
          const Icon = ICON_MAP[item.title] ?? DEFAULT_ICON
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded border border-slate-200 shadow-sm flex flex-col"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded bg-white border border-slate-200 shadow-sm flex items-center justify-center text-primary">
                  <Icon size={18} className="stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-primary">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* PDF Download */}
      <div className="bg-primary text-white rounded p-5 border-l-4 border-accent shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-accent shrink-0">
            <FileText size={20} className="stroke-[2]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Comprehensive Rules & Handbook</h4>
            <p className="text-xs text-slate-300 mt-0.5">Official guide detailing academic codes, dress codes, and institutional regulations</p>
          </div>
        </div>
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-primary px-4 py-2.5 rounded text-xs font-bold transition-colors shrink-0"
          >
            Download PDF Guide
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/50 px-4 py-2.5 rounded text-xs font-bold shrink-0 cursor-not-allowed">
            PDF Not Available
          </span>
        )}
      </div>
    </div>
  )
}

export default CodeOfConduct
