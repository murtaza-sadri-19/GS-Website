import React from 'react'
import PageSeo from '../../components/global/PageSeo'
import { CheckCircle2, AlertCircle, Phone } from 'lucide-react'

const firstWeekChecklist = [
  { item: 'Institute Registration & Fee Payment', when: 'Day 1–2' },
  { item: 'Student Identity Card collection', when: 'Day 2' },
  { item: 'Library Card enrollment', when: 'Day 3' },
  { item: 'Hostel allotment (if applicable)', when: 'Day 1–3' },
  { item: 'Anti-ragging affidavit submission (mandatory)', when: 'Day 1' },
  { item: 'Faculty mentor assignment & first meeting', when: 'Day 4–5' },
  { item: 'Orientation program attendance', when: 'Day 1–3' },
  { item: 'Computer Center registration for email ID', when: 'Week 1' },
]

const firstYearSubjects = [
  { code: 'MA-101', subject: 'Engineering Mathematics – I', credits: 4 },
  { code: 'PH-101', subject: 'Engineering Physics', credits: 4 },
  { code: 'CH-101', subject: 'Engineering Chemistry', credits: 4 },
  { code: 'CS-101', subject: 'Programming Fundamentals (C Language)', credits: 3 },
  { code: 'ME-101', subject: 'Engineering Graphics & Drawing', credits: 3 },
  { code: 'BE-101', subject: 'Basic Electrical Engineering', credits: 3 },
  { code: 'HU-101', subject: 'Communication Skills & Technical Writing', credits: 2 },
  { code: 'ME-102', subject: 'Workshop Practice', credits: 2 },
]

const FirstYearInfo: React.FC = () => {
  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/first-year" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">First Year Information</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Complete Guide for Incoming B.Tech Students — SGSITS Indore</p>
      </div>

      {/* Welcome Note */}
      <div className="bg-primary text-white rounded p-6">
        <h3 className="font-display font-bold text-lg mb-2">Welcome to SGSITS, Indore!</h3>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          Congratulations on your admission to Shri G. S. Institute of Technology & Science.
          As you begin your engineering journey at one of Central India's most prestigious institutes, this guide
          will help you navigate your first weeks smoothly. All B.Tech students undergo a <strong className="text-white">common first year</strong> before
          branching into their respective departments from the 2nd year.
        </p>
      </div>

      {/* Anti-Ragging Alert */}
      <div className="bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded p-4 flex items-start gap-3">
        <AlertCircle size={20} className="text-[#bfa15f] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-[#0b2545]">Anti-Ragging Policy — Zero Tolerance</p>
          <p className="text-xs text-[#0b2545] font-medium mt-1 leading-relaxed">
            SGSITS strictly prohibits ragging in any form. All students must submit anti-ragging affidavits (self + parent)
            on Day 1. <strong>National Anti-Ragging Helpline: 1800-180-5522</strong> (24×7, toll-free).
            Campus committee: antiranging@sgsits.ac.in
          </p>
        </div>
      </div>

      {/* First Week Checklist */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Checklist</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">First Week Activities Checklist</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Activity</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Timing</th>
              </tr>
            </thead>
            <tbody>
              {firstWeekChecklist.map((row, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-slate-400 shrink-0" />
                      <span className="font-medium text-slate-800">{row.item}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center text-xs font-bold text-accent">{row.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* First Year Curriculum */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Curriculum</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Common First Year Subjects</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Subject Code</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Subject</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Credits</th>
              </tr>
            </thead>
            <tbody>
              {firstYearSubjects.map((sub, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-mono text-xs font-bold text-accent">{sub.code}</td>
                  <td className="px-4 py-3 border-b border-slate-100 font-medium text-slate-800">{sub.subject}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-bold text-primary">{sub.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-2">Note: Laboratory courses and sports are in addition to the above. Total credits: ~30 per semester</p>
      </div>

      {/* Important Contacts */}
      <div className="bg-slate-50 border border-slate-200 rounded p-5">
        <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Important Contacts for Freshers</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-sans">
          <div>
            <p className="font-semibold text-slate-800">Dean Student Welfare</p>
            <div className="flex items-center gap-1.5 mt-1"><Phone size={12} className="text-accent" /><span className="text-slate-600">0731-2582105</span></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Academic / Exam Cell</p>
            <div className="flex items-center gap-1.5 mt-1"><Phone size={12} className="text-accent" /><span className="text-slate-600">0731-2582106</span></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Hostel Administration</p>
            <div className="flex items-center gap-1.5 mt-1"><Phone size={12} className="text-accent" /><span className="text-slate-600">0731-2582220</span></div>
          </div>
          <div>
            <p className="font-semibold text-slate-800">Dispensary (Health)</p>
            <div className="flex items-center gap-1.5 mt-1"><Phone size={12} className="text-accent" /><span className="text-slate-600">0731-2582210</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstYearInfo
