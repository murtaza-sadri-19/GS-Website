import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Search, Phone } from 'lucide-react'
import { aboutService, telephoneDirectoryDefault, type TelephoneEntry } from '../../services/aboutService'
import { getCmsSection } from '../../services/settingsService'

const TelephoneDirectory: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<TelephoneEntry[] | null>(null)
  const [pageMeta, setPageMeta] = useState<Record<string, unknown>>({})
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!previewData) aboutService.getTelephoneDirectory().then(setFetchedData)
  }, [previewData])

  useEffect(() => {
    getCmsSection<Record<string, unknown>>('about.telephone_directory_meta').then(meta => {
      if (meta) setPageMeta(meta)
    })
  }, [])

  const directory: TelephoneEntry[] = (previewData ?? fetchedData ?? telephoneDirectoryDefault) as TelephoneEntry[]

  const filtered = directory.filter(d =>
    d.department.toLowerCase().includes(search.toLowerCase()) ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search),
  )

  return (
    <div className="space-y-6">
      <PageSeo pageKey="about/telephone-directory" />
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">{(pageMeta.pageTitle as string) ?? 'Telephone Directory'}</h2>
        <p className="text-sm text-slate-500 mt-1">{(pageMeta.pageSubtitle as string) ?? 'Department-wise contact numbers'}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by department, name, or phone number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent"
          style={{ '--tw-ring-color': 'var(--color-accent)' } as React.CSSProperties}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary">
              <th className="text-left text-white px-4 py-3 font-semibold">#</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Department</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Contact Person</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Phone</th>
              <th className="text-left text-white px-4 py-3 font-semibold">Extension</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry, i) => (
              <tr key={i} className="bg-white hover:bg-slate-50 transition-colors duration-150">
                <td className="px-4 py-3 border-b border-slate-100 text-slate-500">{i + 1}</td>
                <td className="px-4 py-3 border-b border-slate-100 font-medium text-primary">{entry.department}</td>
                <td className="px-4 py-3 border-b border-slate-100 text-slate-700">{entry.name}</td>
                <td className="px-4 py-3 border-b border-slate-100 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-accent" />
                    {entry.phone}
                  </div>
                </td>
                <td className="px-4 py-3 border-b border-slate-100 text-slate-500">{entry.ext}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TelephoneDirectory
