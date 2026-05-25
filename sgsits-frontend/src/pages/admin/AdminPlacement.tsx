import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, TrendingUp } from 'lucide-react'
import { mockStore } from '../../data/mockStore'
import type { PlacementRecord } from '../../data/mockStore'

const EMPTY: PlacementRecord = {
  year: '',
  studentsPlaced: 0,
  companies: 0,
  highestPackage: '',
  averagePackage: '',
  topRecruiters: [],
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminPlacement() {
  const [records, setRecords] = useState<PlacementRecord[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<PlacementRecord | null>(null)
  const [form, setForm] = useState<PlacementRecord>(EMPTY)
  const [recruitersText, setRecruitersText] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<PlacementRecord | null>(null)
  const [toast, setToast] = useState('')

  useEffect(() => { setRecords(mockStore.getPlacement()) }, [])

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setRecruitersText(''); setShowModal(true) }
  const openEdit = (r: PlacementRecord) => {
    setEditItem(r)
    setForm({ ...r })
    setRecruitersText(r.topRecruiters.join(', '))
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditItem(null) }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const recruiters = recruitersText.split(',').map(s => s.trim()).filter(Boolean)
    const payload = { ...form, topRecruiters: recruiters }
    mockStore.updatePlacementYear(payload.year, payload)
    setRecords(mockStore.getPlacement())
    setToast(editItem ? 'Placement record updated!' : 'Placement record added!')
    closeModal()
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    mockStore.deletePlacementYear(deleteTarget.year)
    setRecords(mockStore.getPlacement())
    setDeleteTarget(null)
    setToast('Placement record deleted.')
  }

  const f = <K extends keyof PlacementRecord>(key: K, val: PlacementRecord[K]) =>
    setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Placement Records</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage year-wise placement statistics and top recruiters</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Year Record
        </button>
      </div>

      {/* Summary Stats */}
      {records.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Best Year', value: records.reduce((best, r) => r.studentsPlaced > best.studentsPlaced ? r : best, records[0]).year },
            { label: 'Max Placed', value: Math.max(...records.map(r => r.studentsPlaced)).toLocaleString() },
            { label: 'Highest Package', value: records[0]?.highestPackage || '—' },
            { label: 'Companies (Latest)', value: records[0]?.companies.toString() || '—' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
              <p className="text-xl font-bold text-primary mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Year</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Students Placed</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Companies</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Highest Pkg</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Average Pkg</th>
              <th className="text-left px-4 py-3 font-semibold text-slate-600">Top Recruiters</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.map(r => (
              <tr key={r.year} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={14} className="text-accent" />
                    <span className="font-bold text-slate-800">{r.year}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-[#bfa15f]">{r.studentsPlaced.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{r.companies}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{r.highestPackage}</td>
                <td className="px-4 py-3 text-slate-600">{r.averagePackage}</td>
                <td className="px-4 py-3 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {r.topRecruiters.slice(0, 4).map(rec => (
                      <span key={rec} className="px-1.5 py-0.5 bg-[#0b2545]/10 text-[#0b2545] rounded text-xs">{rec}</span>
                    ))}
                    {r.topRecruiters.length > 4 && (
                      <span className="text-xs text-slate-400">+{r.topRecruiters.length - 4}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545] transition-colors"><Pencil size={14} /></button>
                    <button onClick={() => setDeleteTarget(r)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && <div className="text-center py-12 text-slate-400">No placement records found.</div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h2 className="font-display text-lg font-bold text-primary">{editItem ? `Edit ${editItem.year}` : 'Add Placement Record'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Academic Year <span className="text-[#bfa15f]">*</span></label>
                <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.year} onChange={e => f('year', e.target.value)} placeholder="2025-26" disabled={!!editItem} />
                {editItem && <p className="text-xs text-slate-400 mt-1">Year cannot be changed after creation</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Students Placed <span className="text-[#bfa15f]">*</span></label>
                  <input type="number" min={0} required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.studentsPlaced} onChange={e => f('studentsPlaced', parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Companies <span className="text-[#bfa15f]">*</span></label>
                  <input type="number" min={0} required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.companies} onChange={e => f('companies', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Highest Package <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.highestPackage} onChange={e => f('highestPackage', e.target.value)} placeholder="₹48 LPA" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Average Package <span className="text-[#bfa15f]">*</span></label>
                  <input required className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.averagePackage} onChange={e => f('averagePackage', e.target.value)} placeholder="₹7.2 LPA" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Top Recruiters <span className="text-slate-400">(comma-separated)</span></label>
                <textarea rows={3} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" value={recruitersText} onChange={e => setRecruitersText(e.target.value)} placeholder="TCS, Infosys, Wipro, L&T, Amazon" />
                <p className="text-xs text-slate-400 mt-1">{recruitersText.split(',').filter(s => s.trim()).length} recruiter(s)</p>
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">{editItem ? '✓ Update Record' : '+ Add Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-[#0b2545]" /></div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Placement Record?</h3>
            <p className="text-slate-500 text-sm mb-5">Academic Year: <strong>{deleteTarget.year}</strong></p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:bg-[#0b2545]/90">Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}
