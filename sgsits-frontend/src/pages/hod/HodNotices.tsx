import React, { useMemo, useState } from 'react'
import { PageHeader, PortalCard, PortalTable, PortalModal } from '../../components/layout/PortalLayout'
import { HOD_NOTICES, type HodNotice } from '../../data/mockHodContent'
import { Plus, Pencil, Trash2, Search, Pin, Archive, Send, Megaphone, X } from 'lucide-react'

const CATEGORIES: HodNotice['category'][] = ['Academic', 'Administrative', 'Examination', 'Event', 'General']
const AUDIENCES: HodNotice['audience'][] = ['All', 'Faculty', 'Students']
const STATUSES: HodNotice['status'][] = ['draft', 'published', 'archived']

const EMPTY: Omit<HodNotice, 'id'> = {
  title: '', description: '', category: 'General', audience: 'All',
  file_url: '', publish_date: new Date().toISOString().slice(0, 10),
  expiry_date: '', status: 'draft', pinned: false, created_by: 'HOD Office',
}

const HodNotices: React.FC = () => {
  const [notices, setNotices] = useState<HodNotice[]>(HOD_NOTICES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | HodNotice['status']>('all')
  const [catFilter, setCatFilter] = useState<'all' | HodNotice['category']>('all')
  const [editing, setEditing] = useState<HodNotice | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HodNotice, 'id'>>(EMPTY)
  const [deleteTarget, setDeleteTarget] = useState<HodNotice | null>(null)
  const [toast, setToast] = useState('')

  const visible = useMemo(() => {
    return notices.filter(n => {
      if (statusFilter !== 'all' && n.status !== statusFilter) return false
      if (catFilter !== 'all' && n.category !== catFilter) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        if (!n.title.toLowerCase().includes(q) && !n.description.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [notices, search, statusFilter, catFilter])

  const stats = {
    published: notices.filter(n => n.status === 'published').length,
    draft: notices.filter(n => n.status === 'draft').length,
    archived: notices.filter(n => n.status === 'archived').length,
    pinned: notices.filter(n => n.pinned).length,
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowForm(true) }
  const openEdit = (n: HodNotice) => {
    setEditing(n)
    setForm({ ...n })
    setShowForm(true)
  }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return
    if (editing) {
      setNotices(prev => prev.map(n => n.id === editing.id ? { ...editing, ...form } : n))
      showToast(`Notice "${form.title}" updated.`)
    } else {
      const id = `HN${String(notices.length + 1).padStart(3, '0')}`
      setNotices(prev => [{ id, ...form }, ...prev])
      showToast(`Notice "${form.title}" added as ${form.status}.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY)
  }

  const togglePin = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }
  const publish = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, status: 'published' } : n))
    showToast('Notice published.')
  }
  const archive = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, status: 'archived' } : n))
    showToast('Notice archived.')
  }
  const handleDelete = () => {
    if (!deleteTarget) return
    setNotices(prev => prev.filter(n => n.id !== deleteTarget.id))
    showToast(`Notice "${deleteTarget.title}" deleted.`)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Notices"
        subtitle="Publish notices visible to branch faculty and students"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors">
            <Plus size={14} /> Add Notice
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Published" value={stats.published} accent="text-[#bfa15f]" />
        <Stat label="Drafts"    value={stats.draft}     accent="text-[#0b2545]" />
        <Stat label="Archived"  value={stats.archived}  accent="text-slate-500" />
        <Stat label="Pinned"    value={stats.pinned}    accent="text-[#bfa15f]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | HodNotice['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as 'all' | HodNotice['category'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </PortalCard>

      <PortalCard className="!p-0 overflow-hidden">
        <PortalTable
          headers={['Title', 'Category', 'Audience', 'Publish Date', 'Status', 'Actions']}
          rows={visible}
          empty="No notices match the filters."
          renderRow={(n) => (
            <tr key={n.id} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-4 py-2.5">
                <div className="flex items-start gap-2">
                  {n.pinned && <Pin size={11} className="text-[#bfa15f] shrink-0 mt-1" />}
                  <div>
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{n.description}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0b2545]/5 text-[#0b2545] border border-[#0b2545]/15 uppercase tracking-wide">
                  {n.category}
                </span>
              </td>
              <td className="px-4 py-2.5 text-xs text-slate-600">{n.audience}</td>
              <td className="px-4 py-2.5 text-xs text-slate-600">{n.publish_date}</td>
              <td className="px-4 py-2.5">
                <StatusPill status={n.status} />
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-1">
                  <IconBtn title={n.pinned ? 'Unpin' : 'Pin'} onClick={() => togglePin(n.id)} active={n.pinned}><Pin size={13} /></IconBtn>
                  {n.status !== 'published' && (
                    <IconBtn title="Publish" onClick={() => publish(n.id)}><Send size={13} /></IconBtn>
                  )}
                  {n.status !== 'archived' && (
                    <IconBtn title="Archive" onClick={() => archive(n.id)}><Archive size={13} /></IconBtn>
                  )}
                  <IconBtn title="Edit" onClick={() => openEdit(n)}><Pencil size={13} /></IconBtn>
                  <IconBtn title="Delete" onClick={() => setDeleteTarget(n)}><Trash2 size={13} /></IconBtn>
                </div>
              </td>
            </tr>
          )}
        />
      </PortalCard>

      {/* Add / Edit Modal */}
      <PortalModal
        isOpen={showForm}
        title={editing ? `Edit Notice — ${editing.id}` : 'Add Department Notice'}
        onClose={() => { setShowForm(false); setEditing(null) }}
        width="max-w-xl"
      >
        <form onSubmit={save} className="space-y-3">
          <FormField label="Title" required>
            <input required type="text" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} className={inputCls} />
          </FormField>
          <FormField label="Description" required>
            <textarea required rows={3} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Category">
              <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value as HodNotice['category'] }))} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="Audience">
              <select value={form.audience} onChange={(e) => setForm(f => ({ ...f, audience: e.target.value as HodNotice['audience'] }))} className={inputCls}>
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Attachment URL (optional)">
            <input type="text" value={form.file_url ?? ''} onChange={(e) => setForm(f => ({ ...f, file_url: e.target.value }))} className={inputCls} placeholder="/files/notice.pdf" />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Publish Date">
              <input type="date" value={form.publish_date} onChange={(e) => setForm(f => ({ ...f, publish_date: e.target.value }))} className={inputCls} />
            </FormField>
            <FormField label="Expiry Date (optional)">
              <input type="date" value={form.expiry_date ?? ''} onChange={(e) => setForm(f => ({ ...f, expiry_date: e.target.value }))} className={inputCls} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as HodNotice['status'] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
            <FormField label="Pin to Top">
              <label className="flex items-center gap-2 py-2 cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={(e) => setForm(f => ({ ...f, pinned: e.target.checked }))} className="w-4 h-4 accent-[#bfa15f]" />
                <span className="text-sm text-slate-700">Pinned</span>
              </label>
            </FormField>
          </div>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">
              {editing ? 'Update Notice' : 'Add Notice'}
            </button>
          </div>
        </form>
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trash2 size={20} className="text-[#0b2545]" />
          </div>
          <p className="text-sm text-slate-700">Delete "<strong>{deleteTarget?.title}</strong>"?</p>
          <p className="text-[11px] text-slate-500 mt-1">This action cannot be undone.</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Megaphone size={14} /> {toast}
          <button onClick={() => setToast('')} className="ml-1"><X size={13} /></button>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white'

const FormField: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({ label, required, children }) => (
  <label className="block">
    <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1">
      {label} {required && <span className="text-[#bfa15f]">*</span>}
    </span>
    {children}
  </label>
)

const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4">
    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
  </PortalCard>
)

const IconBtn: React.FC<{ title: string; onClick: () => void; active?: boolean; children: React.ReactNode }> = ({ title, onClick, active, children }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded transition-colors ${active ? 'text-[#bfa15f] bg-[#bfa15f]/10' : 'text-slate-500 hover:bg-slate-100 hover:text-[#0b2545]'}`}
  >
    {children}
  </button>
)

const StatusPill: React.FC<{ status: HodNotice['status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
              status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls}`}>{status}</span>
}

export default HodNotices
