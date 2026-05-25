import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { HOD_EVENTS, type HodEvent } from '../../data/mockHodContent'
import { Plus, Pencil, Trash2, Search, Calendar, MapPin, User, Send, Archive, X } from 'lucide-react'

const TYPES: HodEvent['event_type'][] = ['Workshop', 'FDP', 'Guest Lecture', 'Conference', 'Hackathon', 'Industrial Visit', 'Cultural']
const STATUSES: HodEvent['status'][] = ['draft', 'published', 'archived']
const AUDIENCES: HodEvent['audience'][] = ['All', 'Faculty', 'Students', 'External']

const EMPTY: Omit<HodEvent, 'id'> = {
  title: '', description: '', event_type: 'Workshop',
  venue: '', start_date: new Date().toISOString().slice(0, 10), end_date: new Date().toISOString().slice(0, 10),
  organizer: '', poster_url: '', status: 'draft', audience: 'Students',
}

const HodEvents: React.FC = () => {
  const [events, setEvents] = useState<HodEvent[]>(HOD_EVENTS)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | HodEvent['event_type']>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | HodEvent['status']>('all')
  const [editing, setEditing] = useState<HodEvent | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HodEvent, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<HodEvent | null>(null)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  const [toast, setToast] = useState('')

  const today = new Date().toISOString().slice(0, 10)
  const visible = useMemo(() => events.filter(e => {
    if (typeFilter !== 'all' && e.event_type !== typeFilter) return false
    if (statusFilter !== 'all' && e.status !== statusFilter) return false
    if (search.trim() && !e.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }).sort((a, b) => a.start_date.localeCompare(b.start_date)), [events, typeFilter, statusFilter, search])

  const stats = {
    upcoming: events.filter(e => e.start_date >= today).length,
    past: events.filter(e => e.end_date < today).length,
    drafts: events.filter(e => e.status === 'draft').length,
    total: events.length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (e: HodEvent) => { setEditing(e); setForm(e); setShowForm(true) }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      setEvents(prev => prev.map(ev => ev.id === editing.id ? { ...editing, ...form } : ev))
      showToast(`Event "${form.title}" updated.`)
    } else {
      const id = `EV${String(events.length + 1).padStart(3, '0')}`
      setEvents(prev => [{ id, ...form }, ...prev])
      showToast(`Event "${form.title}" created.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }

  const publish = (id: string) => { setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'published' } : e)); showToast('Event published.') }
  const archive = (id: string) => { setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'archived' } : e)); showToast('Event archived.') }
  const handleDelete = () => { if (!deleteTarget) return; setEvents(prev => prev.filter(e => e.id !== deleteTarget.id)); showToast(`Deleted "${deleteTarget.title}".`); setDeleteTarget(null) }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Events"
        subtitle="Workshops, FDPs, guest lectures, hackathons and visits"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors">
            <Plus size={14} /> Add Event
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Upcoming" value={stats.upcoming} accent="text-[#bfa15f]" />
        <Stat label="Past" value={stats.past} accent="text-slate-500" />
        <Stat label="Drafts" value={stats.drafts} accent="text-[#0b2545]" />
        <Stat label="Total" value={stats.total} accent="text-[#0b2545]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by event title..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as 'all' | HodEvent['event_type'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Types</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | HodEvent['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
          <div className="inline-flex border border-slate-200 rounded overflow-hidden">
            <button onClick={() => setView('grid')} className={`px-3 py-2 text-xs font-bold ${view === 'grid' ? 'bg-[#0b2545] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Grid</button>
            <button onClick={() => setView('table')} className={`px-3 py-2 text-xs font-bold ${view === 'table' ? 'bg-[#0b2545] text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Table</button>
          </div>
        </div>
      </PortalCard>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.length === 0 ? (
            <PortalCard className="col-span-full"><p className="text-center text-sm text-slate-400 py-8">No events match the filters.</p></PortalCard>
          ) : visible.map(ev => (
            <PortalCard key={ev.id} className="!p-0 overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-[#0b2545] to-[#0b2545]/70 relative flex items-end p-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/15 text-white border border-white/20 uppercase tracking-wide">{ev.event_type}</span>
                <div className="absolute top-2 right-2"><StatusPill status={ev.status} light /></div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="text-sm font-bold text-slate-800 line-clamp-2">{ev.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{ev.description}</p>
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <Meta icon={Calendar}>{ev.start_date}{ev.start_date !== ev.end_date && ` — ${ev.end_date}`}</Meta>
                  <Meta icon={MapPin}>{ev.venue}</Meta>
                  <Meta icon={User}>{ev.organizer}</Meta>
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-slate-100">
                  {ev.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(ev.id)}><Send size={12} /></IconBtn>}
                  {ev.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(ev.id)}><Archive size={12} /></IconBtn>}
                  <IconBtn title="Edit" onClick={() => openEdit(ev)}><Pencil size={12} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => setDeleteTarget(ev)}><Trash2 size={12} /></IconBtn>
                  <span className="ml-auto text-[10px] text-slate-400 uppercase">{ev.audience}</span>
                </div>
              </div>
            </PortalCard>
          ))}
        </div>
      ) : (
        <PortalCard className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                {['Event', 'Type', 'Dates', 'Venue', 'Organizer', 'Audience', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {visible.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-400">No events match.</td></tr> :
                  visible.map(ev => (
                    <tr key={ev.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-2.5"><p className="text-sm font-semibold text-slate-800">{ev.title}</p><p className="text-[11px] text-slate-500 line-clamp-1">{ev.description}</p></td>
                      <td className="px-4 py-2.5"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">{ev.event_type}</span></td>
                      <td className="px-4 py-2.5 text-xs text-slate-600 whitespace-nowrap">{ev.start_date}{ev.start_date !== ev.end_date && ` → ${ev.end_date}`}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{ev.venue}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{ev.organizer}</td>
                      <td className="px-4 py-2.5 text-xs text-slate-600">{ev.audience}</td>
                      <td className="px-4 py-2.5"><StatusPill status={ev.status} /></td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-1">
                          {ev.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(ev.id)}><Send size={13} /></IconBtn>}
                          {ev.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(ev.id)}><Archive size={13} /></IconBtn>}
                          <IconBtn title="Edit" onClick={() => openEdit(ev)}><Pencil size={13} /></IconBtn>
                          <IconBtn title="Delete" onClick={() => setDeleteTarget(ev)}><Trash2 size={13} /></IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </PortalCard>
      )}

      <PortalModal isOpen={showForm} title={editing ? `Edit Event — ${editing.id}` : 'Create Department Event'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-xl">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Title" required>
            <input required type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Description">
            <textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Event Type">
              <select value={form.event_type} onChange={(e) => setForm(f => ({ ...f, event_type: e.target.value as HodEvent['event_type'] }))} className={inputCls}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Audience">
              <select value={form.audience} onChange={(e) => setForm(f => ({ ...f, audience: e.target.value as HodEvent['audience'] }))} className={inputCls}>
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Venue"><input type="text" value={form.venue} onChange={(e) => setForm(f => ({ ...f, venue: e.target.value }))} className={inputCls} /></FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date" required>
              <input required type="date" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="End Date" required>
              <input required type="date" value={form.end_date} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Organizer"><input type="text" value={form.organizer} onChange={(e) => setForm(f => ({ ...f, organizer: e.target.value }))} className={inputCls} /></FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as HodEvent['status'] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Poster URL (optional)"><input type="text" value={form.poster_url ?? ''} onChange={(e) => setForm(f => ({ ...f, poster_url: e.target.value }))} className={inputCls} /></FormField>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-[#0b2545]" /></div>
          <p className="text-sm text-slate-700">Delete event "<strong>{deleteTarget?.title}</strong>"?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Calendar size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white'
const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block"><span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">{label} {required && <span className="text-[#bfa15f]">*</span>}</span>{children}</label>
)
const Stat: React.FC<{ label: string; value: number | string; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-colors">{children}</button>
)
const Meta: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }> = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-1.5 text-[11px] text-slate-600"><Icon size={11} className="text-[#bfa15f]" />{children}</p>
)
const StatusPill: React.FC<{ status: HodEvent['status']; light?: boolean }> = ({ status, light }) => {
  const cls = light
    ? 'bg-white/20 text-white border-white/30'
    : status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30'
    : status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25'
    :                          'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default HodEvents
