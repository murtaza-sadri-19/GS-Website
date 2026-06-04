import React, { useState, useEffect } from 'react'
import { Sk } from '../../components/ui/Skeleton'
import PageSeo from '../../components/global/PageSeo'
import { Users, X } from 'lucide-react'
import { aboutService, type CommitteeData } from '../../services/aboutService'

const LABELS = {
  pageTitle: 'Administrative Committees',
  pageSubtitle: 'Committees constituted for effective governance — Click any card to view members',
  membersCount: (n: number) => `${n} Members`,
  viewMembers: 'View Members →',
  modalSubHeader: 'Committee Members List',
  membersHeading: 'Constituted Members',
  colRole: 'Role',
  colName: 'Name',
  colDept: 'Department / Affiliation',
  noDept: 'N/A',
  close: 'Close',
  fetchErrorMessage: 'Could not load committees. Please try again later.',
}

const SkeletonCommitteeCard: React.FC = () => (
  <div className="bg-white rounded-md border border-slate-200 p-5 flex flex-col justify-between" aria-hidden="true">
    <div className="flex items-start gap-3">
      <Sk className="w-10 h-10 rounded-md shrink-0" />
      <div className="flex-1 space-y-2">
        <Sk className="h-3.5 w-3/4 rounded" />
        <Sk className="h-3 w-full rounded" />
        <Sk className="h-3 w-5/6 rounded" />
      </div>
    </div>
    <div className="flex items-center justify-between border-t mt-4 pt-3" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
      <Sk className="h-3 w-20 rounded" />
      <Sk className="h-3 w-28 rounded" />
    </div>
  </div>
)

const Committees: React.FC<{ previewData?: any }> = ({ previewData }) => {
  const [fetchedData, setFetchedData] = useState<CommitteeData[] | null>(null)
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeData | null>(null)
  const [loading, setLoading] = useState(!previewData)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    if (!previewData) {
      aboutService.getCommittees()
        .then(res => { setFetchedData(res); setLoading(false) })
        .catch(() => { setFetchError(true); setLoading(false) })
    }
  }, [previewData])

  const committees: CommitteeData[] = (previewData ?? fetchedData ?? []) as CommitteeData[]

  useEffect(() => {
    if (selectedCommittee) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedCommittee])

  return (
    <div className="space-y-8">
      <PageSeo pageKey="about/committees" />
      <div className="border-b border-slate-200 pb-5">
        {loading ? (
          <>
            <Sk className="h-7 w-64 rounded mb-2" />
            <Sk className="h-4 w-96 max-w-full rounded" />
          </>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-display">
              {LABELS.pageTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{LABELS.pageSubtitle}</p>
          </>
        )}
      </div>

      {fetchError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {LABELS.fetchErrorMessage}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCommitteeCard key={i} />)
          : committees.map((c) => (
              <div
                key={c.name as string}
                onClick={() => setSelectedCommittee(c)}
                className="bg-white rounded-md border border-slate-200 p-5 hover:border-slate-400 hover:shadow-sm cursor-pointer transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 bg-primary">
                    <Users size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-primary">{c.name as string}</h3>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{c.desc as string}</p>
                  </div>
                </div>

                <p className="text-xs mt-4 font-medium flex items-center justify-between border-t pt-3" style={{ color: 'var(--color-accent)', borderColor: 'rgba(0,0,0,0.06)' }}>
                  <span>{LABELS.membersCount((c.membersList as unknown[])?.length || 0)}</span>
                  <span className="text-xs uppercase font-bold tracking-wider text-primary group-hover:text-accent transition-colors flex items-center gap-0.5">
                    {LABELS.viewMembers}
                  </span>
                </p>
              </div>
            ))
        }
      </div>

      {selectedCommittee && (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="text-white px-6 py-4 flex items-center justify-between shrink-0 bg-primary">
              <div>
                <h3 className="font-display font-bold text-lg">{selectedCommittee.name as string}</h3>
                <p className="text-white/70 text-xs mt-0.5 font-medium">{LABELS.modalSubHeader}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCommittee(null)}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed font-sans border-b pb-3">
                {selectedCommittee.desc as string}
              </p>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">{LABELS.membersHeading}</h4>
                <div className="overflow-hidden border border-slate-200 rounded">
                  <table className="w-full text-xs text-left font-sans border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-4 py-2.5">{LABELS.colRole}</th>
                        <th className="px-4 py-2.5">{LABELS.colName}</th>
                        <th className="px-4 py-2.5">{LABELS.colDept}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                      {((selectedCommittee.membersList as Record<string, unknown>[]) || []).map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-primary">{m.role as string}</td>
                          <td className="px-4 py-3 text-slate-800 font-semibold">{m.name as string}</td>
                          <td className="px-4 py-3 text-slate-500">{(m.dept as string) || LABELS.noDept}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCommittee(null)}
                className="px-4 py-2 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded shadow-xs transition-colors"
              >
                {LABELS.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Committees
