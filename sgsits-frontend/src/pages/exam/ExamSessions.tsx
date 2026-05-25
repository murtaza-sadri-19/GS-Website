import React, { useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal, Badge, SessionBanner } from '../../components/layout/PortalLayout'
import { getSessions, MONTH_NAMES, type Session } from '../../services/examService'
import { Plus, Trash2, CheckCircle } from 'lucide-react'

const ExamSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions().then(data => { setSessions(data); setLoading(false) })
  }, [])
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({ start_month: '7', start_year: '2026', end_month: '12', end_year: '2026' })
  const [saving, setSaving] = useState(false)

  const currentSession = sessions.find(s => s.is_active)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const sm = +form.start_month, sy = +form.start_year, em = +form.end_month, ey = +form.end_year
    const newSession: Session = {
      id: `s${Date.now()}`,
      label: `${MONTH_NAMES[sm]} ${sy} – ${MONTH_NAMES[em]} ${ey}`,
      start_month: sm, start_year: sy,
      end_month: em, end_year: ey,
      is_active: false,
    }
    setSessions(prev => [newSession, ...prev])
    setSaving(false)
    setIsOpen(false)
  }

  const setActive = (id: string) => {
    setSessions(prev => prev.map(s => ({ ...s, is_active: s.id === id })))
  }

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: MONTH_NAMES[i + 1] }))
  const years  = Array.from({ length: 6  }, (_, i) => 2023 + i)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Session Management"
        subtitle="Create and manage academic sessions"
        action={
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> New Session
          </button>
        }
      />

      {currentSession && <SessionBanner session={currentSession.label} />}

      <PortalCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Session', 'Start', 'End', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessions.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-800">{s.label}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{MONTH_NAMES[s.start_month]} {s.start_year}</td>
                  <td className="px-4 py-3 text-slate-600 text-xs">{MONTH_NAMES[s.end_month]} {s.end_year}</td>
                  <td className="px-4 py-3">
                    <Badge label={s.is_active ? 'Active' : 'Inactive'} variant={s.is_active ? 'success' : 'default'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!s.is_active && (
                        <button
                          onClick={() => setActive(s.id)}
                          className="flex items-center gap-1 text-xs text-[#bfa15f] hover:bg-[#bfa15f]/10 px-2 py-1 rounded border border-[#bfa15f]/30 transition-colors font-medium"
                          title="Set as active session"
                        >
                          <CheckCircle size={12} /> Set Active
                        </button>
                      )}
                      {!s.is_active && (
                        <button
                          onClick={() => deleteSession(s.id)}
                          className="p-1.5 text-slate-400 hover:text-[#0b2545] hover:bg-slate-100 rounded transition-colors"
                          title="Delete session"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PortalCard>

      <PortalModal isOpen={isOpen} title="Create New Session" onClose={() => setIsOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Start Month</label>
              <select value={form.start_month} onChange={e => setForm(f => ({ ...f, start_month: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">Start Year</label>
              <select value={form.start_year} onChange={e => setForm(f => ({ ...f, start_year: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">End Month</label>
              <select value={form.end_month} onChange={e => setForm(f => ({ ...f, end_month: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {months.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block mb-1">End Year</label>
              <select value={form.end_year} onChange={e => setForm(f => ({ ...f, end_year: e.target.value }))}
                className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90 disabled:opacity-60">
              {saving ? '⏳ Creating...' : '+ Create Session'}
            </button>
          </div>
        </form>
      </PortalModal>
    </div>
  )
}

export default ExamSessions
