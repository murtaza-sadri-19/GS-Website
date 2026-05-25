import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { aboutService, governingBodyDefault, type GoverningBodyData, type GovBodyCategory } from '../../services/aboutService'

const categoryBadgeClass = (category: GovBodyCategory): string => {
  if (category === 'Government') return 'border border-[#0b2545]/30 text-[#0b2545] bg-white'
  if (category === 'University') return 'border border-[#0b2545]/40 text-[#0b2545] bg-white'
  if (category === 'Industry')   return 'border border-[#bfa15f]/40 text-[#bfa15f] bg-white'
  if (category === 'Regulatory') return 'border border-[#bfa15f]/50 text-[#bfa15f] bg-white'
  if (category === 'Faculty')    return 'border border-slate-300 text-slate-700 bg-white'
  return 'border border-slate-200 text-gray-700 bg-white'
}

const GoverningBody: React.FC = () => {
  const [data, setData] = useState<GoverningBodyData>(governingBodyDefault)

  useEffect(() => {
    aboutService.getGoverningBody().then(setData)
  }, [])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/governing-body" />
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Governing Body</h2>
        <p className="text-sm text-gray-500 mt-1">Board of Governors — SGSITS Indore</p>
      </div>

      <p className="text-gray-700 text-[15px] leading-relaxed">{data.description}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-primary)' }}>
              <th className="text-left text-white px-4 py-3 font-semibold">#</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Designation / Role</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Representative</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Category</th>
            </tr>
          </thead>
          <tbody>
            {data.members.map((m, i) => (
              <tr key={i} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                <td className="px-4 py-3 border-b border-gray-100 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 border-b border-gray-100 font-medium" style={{ color: 'var(--color-primary)' }}>{m.role}</td>
                <td className="px-4 py-3 border-b border-gray-100 text-gray-700">{m.name}</td>
                <td className="px-4 py-3 border-b border-gray-100">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${categoryBadgeClass(m.category)}`}>
                    {m.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GoverningBody
