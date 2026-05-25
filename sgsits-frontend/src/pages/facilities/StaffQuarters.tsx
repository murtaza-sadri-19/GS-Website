import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Home, CheckCircle2, Phone, Mail } from 'lucide-react'
import { getStaffQuarters } from '../../services/facilitiesService'

const quarterTypes = [
  { type: 'Type D', for: 'Director & Senior Officers', units: 2, desc: 'Bungalow-style with garden, multiple bedrooms, servant quarters' },
  { type: 'Type C', for: 'Faculty (Professors/Assoc. Prof.)', units: 24, desc: '3 BHK flats with balcony, parking, drawing room' },
  { type: 'Type B', for: 'Ministerial / Technical Staff', units: 36, desc: '2 BHK flats with basic amenities and common areas' },
  { type: 'Type A', for: 'Class IV / Support Staff', units: 48, desc: '1 BHK or studio flats with shared utility areas' },
]

const StaffQuarters: React.FC = () => {
  const [data, setData] = useState<any>(null)
  useEffect(() => { getStaffQuarters().then(setData) }, [])
  if (!data) return null

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/staff-quarters" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Staff Quarters</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">On-Campus Residential Quarters for Faculty &amp; Staff — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.about}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(data.stats || []).map((s: any) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quarter Types */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-accent block mb-1">Quarter Types</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Classification of Quarters</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)' }}>
                <th className="text-left text-white px-4 py-3 font-semibold">Type</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Eligible For</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Units</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {quarterTypes.map((row, i) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-bold text-primary">{row.type}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-700 font-medium">{row.for}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center text-slate-600">{row.units}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-500 text-xs">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amenities & Allotment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Home size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Common Amenities</h4>
          </div>
          <div className="space-y-2">
            {(data.amenities || []).map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={14} className="text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-600 font-medium font-sans">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded p-5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-3">
            <Home size={16} className="text-accent" />
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider">Allotment Process</h4>
          </div>
          <div className="space-y-2 text-sm text-slate-600 font-sans">
            <p>1. Apply to Estate Section with designation proof</p>
            <p>2. Allotment Committee reviews based on seniority</p>
            <p>3. Allocation letter issued by Registrar</p>
            <p>4. Rent deducted from salary as per Pay Band</p>
            <p className="text-[11px] text-slate-400 italic mt-3">Contact Estate Section for current vacancy status</p>
          </div>
          <div className="mt-4 space-y-2 text-sm font-sans">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-accent" />
              <span className="text-slate-600">{data.contactPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-accent" />
              <a href={`mailto:${data.contactEmail}`} className="text-accent-blue hover:underline">{data.contactEmail}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffQuarters
