import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { aboutService, academicCouncilDefault, type AcademicCouncilData } from '../../services/aboutService'

const categoryClass = (cat: string): string => {
  if (cat === 'Ex-Officio') return 'border border-[#0b2545]/30 text-[#0b2545] bg-white shadow-sm'
  if (cat === 'External')   return 'border border-[#bfa15f]/40 text-[#bfa15f] bg-white shadow-sm'
  if (cat === 'Nominated')  return 'border border-[#0b2545]/40 text-[#0b2545] bg-white shadow-sm'
  if (cat === 'Industry')   return 'border border-[#bfa15f]/40 text-[#bfa15f] bg-white shadow-sm'
  return 'border border-[#bfa15f]/50 text-[#bfa15f] bg-white shadow-sm'
}

const AcademicCouncil: React.FC = () => {
  const [data, setData] = useState<AcademicCouncilData>(academicCouncilDefault)

  useEffect(() => {
    aboutService.getAcademicCouncil().then(setData)
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/academic-council" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Academic Council</h2>
        <p className="text-sm text-gray-500 mt-1">Apex academic body of the institute</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.description}</p>

      <div>
        <h3 className="text-xl font-bold mb-4" style={{ color: 'var(--color-primary)' }}>Council Composition</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">#</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Designation</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Member</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody>
              {data.members.map((m, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                  <td className="px-4 py-3 border-b border-gray-100 text-gray-500">{m.sno}</td>
                  <td className="px-4 py-3 border-b border-gray-100 font-medium" style={{ color: 'var(--color-primary)' }}>{m.designation}</td>
                  <td className="px-4 py-3 border-b border-gray-100 text-gray-700">{m.name}</td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${categoryClass(m.category)}`}>
                      {m.category}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-md p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--color-primary)' }}>Key Functions</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2"><span style={{ color: 'var(--color-accent)' }}>•</span> Approval of new academic programs and courses</li>
          <li className="flex items-start gap-2"><span style={{ color: 'var(--color-accent)' }}>•</span> Curriculum design, revision, and updation</li>
          <li className="flex items-start gap-2"><span style={{ color: 'var(--color-accent)' }}>•</span> Setting examination rules and evaluation standards</li>
          <li className="flex items-start gap-2"><span style={{ color: 'var(--color-accent)' }}>•</span> Academic calendar planning</li>
          <li className="flex items-start gap-2"><span style={{ color: 'var(--color-accent)' }}>•</span> OBE and NEP 2020 implementation oversight</li>
        </ul>
      </div>
    </div>
  )
}

export default AcademicCouncil
