import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Users, X } from 'lucide-react'
import { aboutService, committeesDefault, type CommitteeData } from '../../services/aboutService'

const Committees: React.FC = () => {
  const [committees, setCommittees] = useState<CommitteeData[]>(committeesDefault)
  const [selectedCommittee, setSelectedCommittee] = useState<CommitteeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    aboutService.getCommittees().then(res => {
      setCommittees(res)
      setLoading(false)
    })
  }, [])

  // Prevent background scroll when modal is open
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
      <PageSeo pageKey="about/committees" />
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>Administrative Committees</h2>
        <p className="text-sm text-gray-500 mt-1">Committees constituted for effective governance — Click any card to view members</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {committees.map((c) => (
          <div
            key={c.name}
            onClick={() => setSelectedCommittee(c)}
            className="bg-white rounded-md border border-gray-200 p-5 hover:border-slate-400 hover:shadow-sm cursor-pointer transition-all duration-200 group flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
                <Users size={18} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[15px]" style={{ color: 'var(--color-primary)' }}>{c.name}</h3>
                <p className="text-sm text-gray-650 mt-1 leading-relaxed">{c.desc}</p>
              </div>
            </div>
            
            <p className="text-xs mt-4 font-medium flex items-center justify-between border-t pt-3" style={{ color: 'var(--color-accent)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <span>{c.membersList?.length || 0} Members</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-primary group-hover:text-accent transition-colors flex items-center gap-0.5">
                View Members &rarr;
              </span>
            </p>
          </div>
        ))}
      </div>

      {/* --- Committee Members Modal Popup --- */}
      {selectedCommittee && (
        <div className="fixed inset-0 z-[120] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="text-white px-6 py-4 flex items-center justify-between shrink-0" style={{ backgroundColor: 'var(--color-primary)' }}>
              <div>
                <h3 className="font-display font-bold text-lg">{selectedCommittee.name}</h3>
                <p className="text-white/70 text-xs mt-0.5 font-medium">Committee Members List</p>
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs text-slate-550 leading-relaxed font-sans border-b pb-3">
                {selectedCommittee.desc}
              </p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">Constituted Members</h4>
                <div className="overflow-hidden border border-slate-200 rounded">
                  <table className="w-full text-xs text-left font-sans border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-2.5">Role</th>
                        <th className="px-4 py-2.5">Name</th>
                        <th className="px-4 py-2.5">Department / Affiliation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
                      {(selectedCommittee.membersList || []).map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-bold text-primary">{m.role}</td>
                          <td className="px-4 py-3 text-slate-800 font-semibold">{m.name}</td>
                          <td className="px-4 py-3 text-slate-500">{m.dept || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-150 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCommittee(null)}
                className="px-4 py-2 bg-white border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded shadow-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Committees
