import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { GraduationCap, CheckCircle2, ExternalLink } from 'lucide-react'
import { academicsService, pgCoursesDefault } from '../../services/academicsService'
import type { PGCoursesData } from '../../services/academicsService'

const PGCourses: React.FC = () => {
  const [pgData, setPgData] = useState<PGCoursesData>(pgCoursesDefault)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await academicsService.getPGCourses()
        setPgData(data)
      } catch (error) {
        console.error('Failed to load PG courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/courses/pg" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Postgraduate Programs</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium font-sans">M.Tech / M.Pharm / MBA / MCA Programs — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
          {pgData.intro}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {pgData.stats.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Programs Table */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Programs Offered</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Complete Program List</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Department</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Intake</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {pgData.programs.map((prog, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-medium text-primary">{prog.program}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-600">{prog.dept}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-slate-700">{prog.intake}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-500 text-xs">{prog.eligibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eligibility & Fee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <GraduationCap size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider font-display">General Eligibility</h4>
          </div>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            {[
              'M.Tech: Relevant B.E./B.Tech degree with GATE score',
              'M.Pharm: B.Pharm with GPAT score',
              'MBA: Any graduate with MAT/CAT score ≥60 percentile',
              'MCA: B.Sc. with Mathematics, NIMCET / MP PET',
              'Minimum 55% marks in qualifying degree (50% for SC/ST)',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-slate-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3 font-display">Fee Structure</h4>
          <div className="text-sm space-y-2 font-sans text-slate-600">
            <div className="flex justify-between">
              <span>M.Tech Annual Fee</span>
              <span className="font-semibold text-slate-800">₹30,000 – ₹40,000</span>
            </div>
            <div className="flex justify-between">
              <span>MBA Annual Fee</span>
              <span className="font-semibold text-slate-800">₹50,000 – ₹70,000</span>
            </div>
            <div className="flex justify-between">
              <span>GATE Scholars (Full-time)</span>
              <span className="font-semibold text-[#bfa15f]">₹12,400/month stipend</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 italic font-sans">*Fee subject to SFRC revision</p>
          </div>
        </div>
      </div>

      {/* Admission Portal */}
      <div className="bg-primary text-white rounded p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold font-display text-base">CCMT — Centralized Counselling for M.Tech</h4>
          <p className="text-sm text-slate-300 mt-1 font-sans">M.Tech admissions at SGSITS are through CCMT portal</p>
        </div>
        <a href="https://ccmt.admissions.nic.in" target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded text-xs font-bold hover:bg-accent/90 transition-colors shrink-0 font-sans">
          CCMT Portal <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}

export default PGCourses
