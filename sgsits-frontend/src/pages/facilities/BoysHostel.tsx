import React, { useEffect, useState } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { CheckCircle2, Phone, Mail } from 'lucide-react'
import { getBoysHostel } from '../../services/facilitiesService'

const BoysHostel: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)
  useEffect(() => { if (!previewData) getBoysHostel().then(setFetchedData) }, [previewData])
  const data = previewData ?? fetchedData
  if (!data) return <SkeletonPage />

  return (
    <div className="space-y-10">
      <PageSeo pageKey="facilities/boys-hostel" />
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Facilities</span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">Boys Hostel</h2>
        <p className="text-sm text-slate-500 mt-1 font-medium">Residential Facilities for Male Students — SGSITS Indore</p>
      </div>

      <div className="border-l-2 border-accent pl-5">
        <p className="text-sm text-slate-700 leading-relaxed font-sans">{data.intro}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(data.stats || []).map((s: any) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded p-4 text-center shadow-sm">
            <p className="text-2xl font-display font-bold text-primary">{s.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider font-sans mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Hostel Details */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Hostel Blocks</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Hostel Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-primary">
                <th className="text-left text-white px-4 py-3 font-semibold">Hostel</th>
                <th className="text-center text-white px-4 py-3 font-semibold">Capacity</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Room Type</th>
                <th className="text-left text-white px-4 py-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody>
              {(data.blocks || []).map((h: any, i: number) => (
                <tr key={i} className="bg-white hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 border-b border-slate-100 font-bold text-primary">{h.name}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-center font-medium">{h.capacity}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-600">{h.rooms}</td>
                  <td className="px-4 py-3 border-b border-slate-100 text-slate-500 text-xs">{h.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-accent block mb-1">Amenities</span>
        <h3 className="text-xl font-display font-bold text-slate-900 mb-4">Hostel Amenities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(data.amenities || []).map((item: string) => (
            <div key={item} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded p-3 text-sm">
              <CheckCircle2 size={14} className="text-slate-600 shrink-0 mt-0.5" />
              <span className="text-slate-700 font-medium font-sans">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(data.feeStructure || []).length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded p-5">
            <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Fee Structure</h4>
            <div className="text-sm space-y-2 font-sans">
              {(data.feeStructure as { label: string; value: string; note?: boolean }[]).map((row, i) =>
                row.note
                  ? <p key={i} className="text-xs text-slate-400 mt-2 italic">{row.value}</p>
                  : (
                    <div key={i} className="flex justify-between">
                      <span className="text-slate-600">{row.label}</span>
                      <span className="font-semibold">{row.value}</span>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
        <div className="bg-white border border-slate-200 rounded p-5">
          <h4 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-200 pb-2 mb-3">Contact — Hostel Administration</h4>
          <div className="space-y-2 text-sm font-sans">
            <div className="flex items-center gap-2">
              <Phone size={13} className="text-accent shrink-0" />
              <span className="text-slate-600">{data.wardenPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={13} className="text-accent shrink-0" />
              <a href={`mailto:${data.wardenEmail}`} className="text-accent-blue hover:underline">{data.wardenEmail}</a>
            </div>
            <p className="text-xs text-slate-500 mt-2">Warden: {data.wardenName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BoysHostel
