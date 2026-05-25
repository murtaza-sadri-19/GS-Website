import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { academicsService, phdCoursesDefault } from '../../services/academicsService'
import type { PhDCoursesData } from '../../services/academicsService'

const PhDCourses: React.FC = () => {
  const [phdData, setPhdData] = useState<PhDCoursesData>(phdCoursesDefault)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await academicsService.getPhDCourses()
        setPhdData(data)
      } catch (error) {
        console.error('Failed to load PhD courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="space-y-10">
      <PageSeo pageKey="academics/courses/phd" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Academics</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Ph.D. Programs</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium font-sans">Doctoral Research Programs — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans font-medium">
          {phdData.intro}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {phdData.stats.map((s, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Departments & Research Areas */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Research</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Departments & Research Areas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Department</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Key Research Areas</th>
              </tr>
            </thead>
            <tbody>
              {phdData.departments.map((dept, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-medium text-primary">{dept.dept}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-600 text-xs font-sans">{dept.areas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <BookOpen size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider font-display">Eligibility Criteria</h4>
          </div>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            {[
              'M.Tech/ME with 55% marks (50% for SC/ST)',
              'M.Sc./MCA/MBA with 55% for respective departments',
              'GATE/NET qualified candidates may be exempt from written test',
              'Full-time and Part-time (sponsored) PhD options available',
              'Industry professionals with 5+ years experience eligible for Part-time',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 size={13} className="text-slate-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Clock size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider font-display">Fellowship & Funding</h4>
          </div>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>GATE/NET Scholars (Full-time)</span>
              <span className="font-semibold text-[#bfa15f]">₹12,400/month</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span>Sponsored/Industry Scholars</span>
              <span className="font-semibold text-slate-700">Employer Funded</span>
            </div>
            <div className="flex justify-between py-1">
              <span>DST/SERB Project Scholars</span>
              <span className="font-semibold text-slate-700">As per project grant</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-sans">SGSITS also offers fee waivers for sponsored students</p>
          </div>
        </div>
      </div>

      {/* Admission Process */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Admission</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Admission Process</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {phdData.processSteps.map((s, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded p-4 shadow-sm">
              <span className="text-2xl font-display font-bold text-accent/30">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="font-bold text-sm text-primary mt-1 font-display">{s.step}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PhDCourses
