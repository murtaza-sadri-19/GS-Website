import React, { useState, useEffect } from 'react'
import { Pencil, Trash2, Plus, X, ArrowUp, ArrowDown, Link as LinkIcon } from 'lucide-react'
import { alertsAPI } from '../../api/index'

// ── Local shape used by the UI form (priority is integer for ordering) ──────
interface LocalAlert {
  id: string
  text: string
  isActive: boolean
  priority: number
  link: string
}

// Map backend priority string → integer (lower number = higher priority)
function prioToNum(p: unknown): number {
  if (typeof p === 'number') return p
  const map: Record<string, number> = { urgent: 1, high: 2, normal: 3, low: 4 }
  return map[String(p).toLowerCase()] ?? 3
}

// Map integer priority → backend string
function numToPrio(n: number): string {
  if (n <= 1) return 'urgent'
  if (n === 2) return 'high'
  if (n === 3) return 'normal'
  return 'low'
}

function mapFromApi(a: Record<string, unknown>): LocalAlert {
  return {
    id:       String(a.id ?? ''),
    text:     String(a.text ?? a.message ?? ''),
    isActive: a.is_active !== false && a.isActive !== false && a.status !== 'INACTIVE',
    priority: prioToNum(a.priority),
    link:     String(a.link ?? a.url ?? ''),
  }
}

const EMPTY: Omit<LocalAlert, 'id'> = {
  text:     '',
  isActive: true,
  priority: 1,
  link:     '',
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium">
      {message}<button onClick={onClose}><X size={14} /></button>
    </div>
  )
}

export default function AdminAlerts() {
  const [alerts, setAlerts] = useState<LocalAlert[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<LocalAlert | null>(null)
  const [form, setForm] = useState<Omit<LocalAlert, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<LocalAlert | null>(null)
  const [toast, setToast] = useState('')

  const load = async () => {
    try {
      const items = await alertsAPI.getAll()
      const mapped = items.map(i => mapFromApi(i as unknown as Record<string, unknown>))
      setAlerts([...mapped].sort((a, b) => a.priority - b.priority))
    } catch {
      setAlerts([])
    }
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditItem(null)
    const maxPriority = alerts.reduce((m, a) => Math.max(m, a.priority), 0)
    setForm({ ...EMPTY, priority: maxPriority + 1 })
    setShowModal(true)
  }
  const openEdit = (a: LocalAlert) => {
    setEditItem(a)
    setForm({ text: a.text, isActive: a.isActive, priority: a.priority, link: a.link })
    setShowModal(true)
  }
  const closeModal = () => { setShowModal(false); setEditItem(null) }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      text:     form.text,
      link:     form.link || undefined,
      priority: numToPrio(form.priority),
      isActive: form.isActive,
    }
    try {
      if (editItem) {
        await alertsAPI.update(editItem.id, payload as any)
        setToast('Alert updated!')
      } else {
        await alertsAPI.create(payload as any)
        setToast('Alert added!')
      }
      await load()
    } catch {
      setToast('Failed to save alert.')
    }
    closeModal()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await alertsAPI.delete(deleteTarget.id)
      setToast('Alert deleted.')
      await load()
    } catch {
      setToast('Failed to delete alert.')
    }
    setDeleteTarget(null)
  }

  const toggleActive = async (id: string, cur: boolean) => {
    try {
      await alertsAPI.update(id, { isActive: !cur } as any)
      await load()
    } catch { /* ignore */ }
  }

  const movePriority = async (id: string, dir: 'up' | 'down') => {
    const sorted = [...alerts].sort((a, b) => a.priority - b.priority)
    const idx = sorted.findIndex(a => a.id === id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const p1 = sorted[idx].priority
    const p2 = sorted[swapIdx].priority
    try {
      await Promise.all([
        alertsAPI.update(sorted[idx].id,    { priority: numToPrio(p2) } as any),
        alertsAPI.update(sorted[swapIdx].id, { priority: numToPrio(p1) } as any),
      ])
      await load()
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary">Marquee Alerts</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage scrolling announcement alerts shown in the site header</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
          <Plus size={16} /> Add Alert
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
          {alerts.filter(a => a.isActive).length} active alert(s) — use arrows to reorder priority
        </div>
        <div className="divide-y divide-slate-100">
          {alerts.map((alert, idx) => (
            <div key={alert.id} className={`flex items-start gap-4 px-4 py-4 hover:bg-slate-50 transition-colors ${!alert.isActive ? 'opacity-50' : ''}`}>
              {/* Priority controls */}
              <div className="flex flex-col gap-0.5 flex-shrink-0 mt-0.5">
                <button onClick={() => movePriority(alert.id, 'up')} disabled={idx === 0} className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowUp size={13} />
                </button>
                <span className="text-xs text-center font-bold text-slate-400">{alert.priority}</span>
                <button onClick={() => movePriority(alert.id, 'down')} disabled={idx === alerts.length - 1} className="p-0.5 rounded hover:bg-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed">
                  <ArrowDown size={13} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 leading-snug">{alert.text}</p>
                {alert.link && (
                  <p className="text-xs text-[#0b2545] mt-0.5 flex items-center gap-1 truncate">
                    <LinkIcon size={10} />{alert.link}
                  </p>
                )}
              </div>

              {/* Toggle + Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only" checked={alert.isActive} onChange={() => toggleActive(alert.id, alert.isActive)} />
                  <div className={`w-10 h-5 rounded-full transition-colors ${alert.isActive ? 'bg-[#bfa15f]' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full shadow mt-0.5 ml-0.5 transition-transform ${alert.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </label>
                <span className={`text-xs font-medium ${alert.isActive ? 'text-[#bfa15f]' : 'text-slate-400'}`}>
                  {alert.isActive ? 'Active' : 'Off'}
                </span>
                <button onClick={() => openEdit(alert)} className="p-1.5 rounded hover:bg-[#0b2545]/5 text-[#0b2545]"><Pencil size={13} /></button>
                <button onClick={() => setDeleteTarget(alert)} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
          {alerts.length === 0 && <div className="text-center py-12 text-slate-400">No alerts configured.</div>}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-display text-lg font-bold text-primary">{editItem ? 'Edit Alert' : 'Add New Alert'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Alert Text <span className="text-[#bfa15f]">*</span></label>
                <textarea required rows={3} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} placeholder="Alert message text shown in marquee..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Priority (lower = higher priority)</label>
                  <input type="number" min={1} className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: parseInt(e.target.value) || 1 }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Link URL (optional)</label>
                  <input className="border border-slate-300 rounded px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium text-slate-700">Active (show in marquee)</span>
              </label>
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button type="button" onClick={closeModal} className="flex-1 py-2 border border-slate-300 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded font-semibold text-sm hover:bg-primary/90">{editItem ? '✓ Update Alert' : '+ Add Alert'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={22} className="text-[#0b2545]" /></div>
            <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Alert?</h3>
            <p className="text-slate-500 text-sm mb-5 line-clamp-2">"{deleteTarget.text.slice(0, 60)}..."</p>
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
