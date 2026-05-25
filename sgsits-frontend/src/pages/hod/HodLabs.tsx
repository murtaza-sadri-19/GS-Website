import React, { useMemo, useState, useEffect } from 'react'
import { PageHeader, PortalCard, PortalModal } from '../../components/layout/PortalLayout'
import { HOD_LABS, type HodLab } from '../../data/mockHodContent'
import { getFacultyMembers, type FacultyMember } from '../../services/examService'
import { useAdminStore } from '../../store/adminStore'
import { Plus, Pencil, Trash2, Search, FlaskConical, X, Send, Archive, User, MapPin, Users as UsersIcon } from 'lucide-react'

const STATUSES: HodLab['status'][] = ['draft', 'published', 'archived']
const HOD_BRANCH = 'CSE'

const EMPTY: Omit<HodLab, 'id'> = {
  lab_name: '', description: '', lab_incharge: '',
  equipment_list: [], capacity: 30, room_no: '', image_url: '', status: 'draft',
}

const HodLabs: React.FC = () => {
  const { user } = useAdminStore()
  const hodBranch = user?.department_id ? String(user.department_id) : HOD_BRANCH
  const [labs, setLabs] = useState<HodLab[]>(HOD_LABS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | HodLab['status']>('all')
  const [editing, setEditing] = useState<HodLab | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<HodLab, 'id'>>(EMPTY)
  const [equipText, setEquipText] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<HodLab | null>(null)
  const [viewing, setViewing] = useState<HodLab | null>(null)
  const [toast, setToast] = useState('')

  const [facultyList, setFacultyList] = useState<FacultyMember[]>([])
  useEffect(() => {
    getFacultyMembers(hodBranch).then(setFacultyList)
  }, [hodBranch])
  const inchargeOptions = useMemo(() => facultyList.filter(f => f.branch_id === hodBranch), [facultyList, hodBranch])

  const visible = useMemo(() => labs.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false
    if (search.trim() && !l.lab_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [labs, statusFilter, search])

  const stats = {
    total: labs.length,
    capacity: labs.reduce((s, l) => s + l.capacity, 0),
    published: labs.filter(l => l.status === 'published').length,
    equipmentItems: labs.reduce((s, l) => s + l.equipment_list.length, 0),
  }

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2400) }
  const openAdd = () => { setEditing(null); setForm(EMPTY); setEquipText(''); setShowForm(true) }
  const openEdit = (l: HodLab) => { setEditing(l); setForm(l); setEquipText(l.equipment_list.join('\n')); setShowForm(true) }

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.lab_name.trim()) return
    const equipment_list = equipText.split('\n').map(x => x.trim()).filter(Boolean)
    const finalForm = { ...form, equipment_list }
    if (editing) {
      setLabs(prev => prev.map(l => l.id === editing.id ? { ...editing, ...finalForm } : l))
      showToast(`Lab "${finalForm.lab_name}" updated.`)
    } else {
      const id = `LAB${String(labs.length + 1).padStart(3, '0')}`
      setLabs(prev => [{ id, ...finalForm }, ...prev])
      showToast(`Lab "${finalForm.lab_name}" added.`)
    }
    setShowForm(false); setEditing(null); setForm(EMPTY); setEquipText('')
  }

  const publish = (id: string) => { setLabs(prev => prev.map(l => l.id === id ? { ...l, status: 'published' } : l)); showToast('Lab published.') }
  const archive = (id: string) => { setLabs(prev => prev.map(l => l.id === id ? { ...l, status: 'archived' } : l)); showToast('Lab archived.') }
  const handleDelete = () => { if (!deleteTarget) return; setLabs(prev => prev.filter(l => l.id !== deleteTarget.id)); showToast(`Deleted "${deleteTarget.lab_name}".`); setDeleteTarget(null) }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Department Labs"
        subtitle="Manage labs, incharge faculty, equipment lists and capacity"
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0b2545] text-white text-xs font-bold rounded-md hover:bg-[#0b2545]/90 transition-colors">
            <Plus size={14} /> Add Lab
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Labs" value={stats.total} accent="text-[#0b2545]" />
        <Stat label="Published" value={stats.published} accent="text-[#bfa15f]" />
        <Stat label="Total Capacity" value={stats.capacity} accent="text-[#0b2545]" />
        <Stat label="Equipment Items" value={stats.equipmentItems} accent="text-[#bfa15f]" />
      </div>

      <PortalCard className="!p-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search labs..." className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-[#0b2545]" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | HodLab['status'])} className="border border-slate-200 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0b2545]">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </PortalCard>

      {visible.length === 0 ? (
        <PortalCard><p className="text-center text-sm text-slate-400 py-12">No labs match the filters.</p></PortalCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map(l => (
            <PortalCard key={l.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-lg bg-[#0b2545]/10 border border-[#0b2545]/20 flex items-center justify-center shrink-0">
                    <FlaskConical size={18} className="text-[#0b2545]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm">{l.lab_name}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{l.description}</p>
                  </div>
                </div>
                <StatusPill status={l.status} />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <Meta icon={User} label="Incharge">{l.lab_incharge}</Meta>
                <Meta icon={MapPin} label="Room">{l.room_no}</Meta>
                <Meta icon={UsersIcon} label="Capacity">{l.capacity}</Meta>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Equipment ({l.equipment_list.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {l.equipment_list.slice(0, 4).map((e, i) => (
                    <span key={i} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">{e}</span>
                  ))}
                  {l.equipment_list.length > 4 && (
                    <button onClick={() => setViewing(l)} className="text-[10px] bg-[#bfa15f]/10 border border-[#bfa15f]/30 text-[#bfa15f] px-2 py-0.5 rounded font-bold hover:bg-[#bfa15f]/20">
                      +{l.equipment_list.length - 4} more
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 mt-3 pt-3 border-t border-slate-100">
                {l.status !== 'published' && <IconBtn title="Publish" onClick={() => publish(l.id)}><Send size={12} /></IconBtn>}
                {l.status !== 'archived' && <IconBtn title="Archive" onClick={() => archive(l.id)}><Archive size={12} /></IconBtn>}
                <IconBtn title="Edit" onClick={() => openEdit(l)}><Pencil size={12} /></IconBtn>
                <IconBtn title="Delete" onClick={() => setDeleteTarget(l)}><Trash2 size={12} /></IconBtn>
                <button onClick={() => setViewing(l)} className="ml-auto text-[11px] text-[#0b2545] font-bold hover:underline">View Details →</button>
              </div>
            </PortalCard>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <PortalModal isOpen={showForm} title={editing ? `Edit Lab — ${editing.id}` : 'Add New Lab'} onClose={() => { setShowForm(false); setEditing(null) }} width="max-w-xl">
        <form onSubmit={save} className="space-y-3">
          <FormField label="Lab Name" required>
            <input required type="text" value={form.lab_name} onChange={(e) => setForm(f => ({ ...f, lab_name: e.target.value }))} className={inputCls} placeholder="e.g. AI / ML Lab" />
          </FormField>
          <FormField label="Description">
            <textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} className={inputCls} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Lab Incharge">
              <select value={form.lab_incharge} onChange={(e) => setForm(f => ({ ...f, lab_incharge: e.target.value }))} className={inputCls}>
                <option value="">— Select Faculty —</option>
                {inchargeOptions.map(f => <option key={f.id} value={f.name}>{f.name} ({f.designation})</option>)}
              </select>
            </FormField>
            <FormField label="Room Number">
              <input type="text" value={form.room_no} onChange={(e) => setForm(f => ({ ...f, room_no: e.target.value }))} className={inputCls} placeholder="e.g. CR-Lab-301" />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Capacity">
              <input type="number" min={1} value={form.capacity} onChange={(e) => setForm(f => ({ ...f, capacity: Number(e.target.value) }))} className={inputCls} />
            </FormField>
            <FormField label="Status">
              <select value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value as HodLab['status'] }))} className={inputCls}>
                {STATUSES.map(s => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Equipment List (one per line)">
            <textarea rows={5} value={equipText} onChange={(e) => setEquipText(e.target.value)} className={`${inputCls} font-mono text-xs`} placeholder={'30 workstations (i7/32GB)\n2x NVIDIA RTX A5000 GPU\nJupyter Hub\nTensorFlow / PyTorch'} />
          </FormField>
          <FormField label="Image URL (optional)">
            <input type="text" value={form.image_url ?? ''} onChange={(e) => setForm(f => ({ ...f, image_url: e.target.value }))} className={inputCls} />
          </FormField>
          <div className="flex gap-2.5 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => { setShowForm(false); setEditing(null) }} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">{editing ? 'Update Lab' : 'Add Lab'}</button>
          </div>
        </form>
      </PortalModal>

      {/* View Details Modal */}
      <PortalModal isOpen={!!viewing} title={viewing?.lab_name ?? ''} onClose={() => setViewing(null)} width="max-w-lg">
        {viewing && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">{viewing.description}</p>
            <div className="grid grid-cols-3 gap-2">
              <Meta icon={User} label="Incharge">{viewing.lab_incharge}</Meta>
              <Meta icon={MapPin} label="Room">{viewing.room_no}</Meta>
              <Meta icon={UsersIcon} label="Capacity">{viewing.capacity}</Meta>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Equipment List ({viewing.equipment_list.length})</p>
              <ul className="space-y-1.5">
                {viewing.equipment_list.map((e, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2"><span className="text-[#bfa15f] mt-1">•</span>{e}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </PortalModal>

      <PortalModal isOpen={!!deleteTarget} title="Confirm Delete" onClose={() => setDeleteTarget(null)} width="max-w-sm">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#0b2545]/10 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 size={20} className="text-[#0b2545]" /></div>
          <p className="text-sm text-slate-700">Delete lab "<strong>{deleteTarget?.lab_name}</strong>"?</p>
          <div className="flex gap-2.5 mt-5">
            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-semibold rounded hover:bg-slate-50">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-2 bg-[#0b2545] text-white text-sm font-bold rounded hover:bg-[#0b2545]/90">Delete</button>
          </div>
        </div>
      </PortalModal>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#bfa15f] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <FlaskConical size={14} /> {toast}
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
const Stat: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <PortalCard className="!p-4"><p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p><p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p></PortalCard>
)
const IconBtn: React.FC<{ title: string; onClick: () => void; children: React.ReactNode }> = ({ title, onClick, children }) => (
  <button onClick={onClick} title={title} className="p-1.5 rounded text-slate-500 hover:bg-slate-100 hover:text-[#0b2545] transition-colors">{children}</button>
)
const Meta: React.FC<{ icon: React.ComponentType<{ size?: number; className?: string }>; label: string; children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
  <div className="bg-slate-50 border border-slate-100 rounded p-2">
    <p className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider"><Icon size={10} className="text-[#bfa15f]" />{label}</p>
    <p className="text-xs text-slate-800 font-semibold mt-0.5 truncate">{children}</p>
  </div>
)
const StatusPill: React.FC<{ status: HodLab['status'] }> = ({ status }) => {
  const cls = status === 'published' ? 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30' :
              status === 'draft'     ? 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25' :
                                       'bg-slate-100 text-slate-500 border-slate-200'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wide ${cls} shrink-0`}>{status}</span>
}

export default HodLabs
