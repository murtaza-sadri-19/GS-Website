import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { GraduationCap } from 'lucide-react'
import { academicsService, ugCoursesDefault } from '../../services/academicsService'
import type { UGCoursesData } from '../../services/academicsService'

const UGCourses: React.FC = () => {
  const [ugData, setUgData] = useState<UGCoursesData>(ugCoursesDefault)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await academicsService.getUGCourses()
        setUgData(data)
      } catch (error) {
        console.error('Failed to load UG courses:', error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="academics/courses/ug" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Undergraduate Programs</h2>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">{ugData.intro}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {ugData.stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-md p-4 text-center border border-slate-200 shadow-sm">
            <p className="text-2xl font-bold" style={{ color: idx % 2 === 0 ? 'var(--color-primary)' : 'var(--color-accent)' }}>
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-primary)' }}>
              <th className="text-left text-white px-4 py-3 font-semibold w-12">#</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Program</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Code</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Intake</th>
            </tr>
          </thead>
          <tbody>
            {ugData.courses.map((c, i) => (
              <tr key={c.code || i} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                <td className="px-4 py-3 border-b border-gray-100 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 border-b border-gray-100 font-medium flex items-center gap-2">
                  <GraduationCap size={16} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ color: 'var(--color-primary)' }}>{c.name}</span>
                </td>
                <td className="px-4 py-3 border-b border-gray-100 text-gray-500 font-mono">{c.code}</td>
                <td className="px-4 py-3 border-b border-gray-100 font-semibold" style={{ color: 'var(--color-primary)' }}>{c.seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Eligibility & Admission</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li><span style={{ color: 'var(--color-accent)' }}>•</span> <strong>Eligibility:</strong> 10+2 with Physics, Chemistry, Mathematics (minimum 45% marks)</li>
          <li><span style={{ color: 'var(--color-accent)' }}>•</span> <strong>Admission:</strong> Through JEE Main score + MP DTE Online Counseling</li>
          <li><span style={{ color: 'var(--color-accent)' }}>•</span> <strong>Fee Structure:</strong> Approx. ₹45,000 – ₹55,000 per year (subject to revision)</li>
        </ul>
      </div>
    </div>
  )
}

export default UGCourses
