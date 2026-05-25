import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { mockStore } from '../../data/mockStore'
import { type DepartmentSummary } from '../../services/departmentService'
import { Modal, FormField, Input } from '../../components/admin/CrudPage'
import { ExternalLink, Pencil, Users, Mail, Trash2, Plus, Award, Building } from 'lucide-react'

type EditTab = 'hod' | 'page' | 'obe'

const AdminDepartments: React.FC = () => {
  const [search, setSearch] = useState('')
  const [depts, setDepts] = useState<DepartmentSummary[]>([])
  const [loading, setLoading] = useState(true)
  
  // Modals state
  const [editDept, setEditDept] = useState<DepartmentSummary | null>(null)
  const [activeEditTab, setActiveEditTab] = useState<EditTab>('hod')
  const [showAddModal, setShowAddModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  // Form states
  const [form, setForm] = useState({
    name: '',
    shortName: '',
    slug: '',
    category: 'engineering' as DepartmentSummary['category'],
    hodName: '',
    hodEmail: '',
    hodPhone: '',
    established: '1952',
    status: 'published' as DepartmentSummary['status'],
    imageUrl: '',
    description: '',
    aboutText: '',
    infraText: '',
    intakeText: '',
    vision: '',
    mission: '',
  })

  // Add form states
  const [addForm, setAddForm] = useState({
    name: '',
    shortName: '',
    slug: '',
    category: 'engineering' as DepartmentSummary['category'],
  })

  const loadDepartments = async () => {
    try {
      setLoading(true)
      const list = await mockStore.getDepartments()
      setDepts(list)
    } catch (err) {
      console.error('Failed to load departments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const openEdit = (dept: DepartmentSummary) => {
    setEditDept(dept)
    setActiveEditTab('hod')
    setForm({
      name: dept.name,
      shortName: dept.shortName,
      slug: dept.slug,
      category: dept.category,
      hodName: dept.hodName,
      hodEmail: dept.hodEmail,
      hodPhone: dept.hodPhone || '',
      established: dept.established || '1952',
      status: dept.status || 'published',
      imageUrl: dept.imageUrl || '',
      description: dept.description || '',
      aboutText: (dept.aboutParagraphs || []).join('\n\n'),
      infraText: (dept.infraHighlights || []).join('\n'),
      intakeText: (dept.programsIntake || []).join('\n'),
      vision: dept.vision || '',
      mission: dept.mission || '',
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editDept) return
    setSaving(true)

    // Assemble dynamic arrays
    const resolvedAbout = form.aboutText
      .split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 0)
    
    const resolvedInfra = form.infraText
      .split('\n')
      .map(line => line.replace(/^•\s*/, '').trim())
      .filter(line => line.length > 0)
    
    const resolvedIntake = form.intakeText
      .split('\n')
      .map(line => line.replace(/^•\s*/, '').trim())
      .filter(line => line.length > 0)

    const updated: DepartmentSummary = {
      ...editDept,
      name: form.name,
      shortName: form.shortName,
      category: form.category,
      hodName: form.hodName,
      hodEmail: form.hodEmail,
      hodPhone: form.hodPhone || undefined,
      established: form.established,
      status: form.status,
      imageUrl: form.imageUrl || undefined,
      description: form.description || undefined,
      aboutParagraphs: resolvedAbout,
      infraHighlights: resolvedInfra,
      programsIntake: resolvedIntake,
      vision: form.vision || undefined,
      mission: form.mission || undefined,
    }

    try {
      await mockStore.saveDepartmentBySlug(editDept.slug, updated)
      setToast(`Department ${updated.shortName} updated successfully.`)
      setTimeout(() => setToast(''), 3000)
      setEditDept(null)
      loadDepartments()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm.slug || !addForm.name) return
    setSaving(true)

    const newSlug = addForm.slug.toLowerCase().trim().replace(/\s+/g, '-')
    
    // Create new department with rich default fallbacks
    const newDept: DepartmentSummary = {
      slug: newSlug,
      name: addForm.name,
      shortName: addForm.shortName || addForm.name.slice(0, 5).toUpperCase(),
      category: addForm.category,
      hodName: 'Acting Representative',
      hodEmail: `hod.${newSlug.replace('-', '')}@sgsits.ac.in`,
      hodPhone: '',
      programsOffered: ['UG', 'PG'],
      facultyCount: 8,
      isActive: true,
      established: new Date().getFullYear().toString(),
      status: 'published',
      description: `Academic hub for research, engineering workflows, and Outcome-Based courses in ${addForm.shortName || addForm.name} sciences.`,
      aboutParagraphs: [
        `The Department of ${addForm.name} was recently established to address the expanding requirements of the modern industrial ecosystem.`
      ],
      infraHighlights: [
        'Dedicated Department Computer Center',
        'State-of-the-Art Research Laboratories'
      ],
      programsIntake: [
        'B.Tech / B.Pharma (4-Year Degree) - 60 Intake',
        'M.Tech / MBA (2-Year Degree) - 18 Intake'
      ],
      vision: `To be a centre of excellence in ${addForm.name} education and research, developing ethically sound professionals who lead globally.`,
      mission: 'Providing modern environments that combine fundamental knowledge with hands-on practice, fostering industry collaborative schemes.',
      imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop'
    }

    try {
      const currentList = await mockStore.getDepartments()
      await mockStore.saveDepartments([...currentList, newDept])
      setToast(`Department ${newDept.shortName} added successfully.`)
      setTimeout(() => setToast(''), 3000)
      setShowAddModal(false)
      setAddForm({ name: '', shortName: '', slug: '', category: 'engineering' })
      loadDepartments()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string, shortName: string) => {
    if (!window.confirm(`Are you absolutely sure you want to delete the Department of ${shortName}? This action cannot be undone.`)) {
      return
    }
    
    try {
      const currentList = await mockStore.getDepartments()
      const updatedList = currentList.filter((d: any) => d.slug !== slug)
      await mockStore.saveDepartments(updatedList)
      setToast(`Department ${shortName} deleted successfully.`)
      setTimeout(() => setToast(''), 3000)
      loadDepartments()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = depts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.shortName.toLowerCase().includes(search.toLowerCase()) ||
    d.hodName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-800">Departments & Branches</h2>
            <p className="text-xs text-slate-500 mt-0.5">Control the entire SGSITS branches directory and HOD profiles dynamically — {filtered.length} active branches</p>
          </div>
          <div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0b2545] border border-[#bfa15f]/20 hover:bg-primary/95 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-sm"
            >
              <Plus size={14} className="text-[#bfa15f]" /> Add Department
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search branches, abbreviations, HODs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm border border-slate-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-primary"
        />

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          /* Table */
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Department', 'Category', 'Programs', 'HOD & Contact', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length > 0 ? (
                  filtered.map(dept => (
                    <tr key={dept.slug} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 text-sm">{dept.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{dept.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          dept.category === 'engineering' 
                            ? 'bg-[#0b2545]/5 text-[#0b2545] border-[#0b2545]/20'
                            : dept.category === 'science'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-slate-50 text-slate-700 border-slate-250'
                        }`}>
                          {dept.category || 'other'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {dept.programsOffered.map(p => (
                            <span key={p} className="text-[9px] bg-slate-50 text-slate-700 border border-slate-250 px-1.5 py-0.5 rounded font-bold uppercase">{p}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                          <Users size={10} />
                          <span>{dept.facultyCount} active faculty</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-700">{dept.hodName}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Mail size={10} className="text-slate-400" />
                          <span>{dept.hodEmail}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(dept)}
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/5 rounded transition-colors"
                            title="Edit Department Profile & Lists"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.slug, dept.shortName)}
                            className="p-1.5 text-slate-500 hover:text-red-650 hover:bg-red-50 rounded transition-colors"
                            title="Delete Department"
                          >
                            <Trash2 size={14} />
                          </button>
                          <Link
                            to={`/departments/${dept.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-accent-blue hover:bg-slate-100 rounded transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-xs text-slate-400 font-semibold bg-slate-50/50">
                      No departments match your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD DEPARTMENT MODAL */}
      <Modal isOpen={showAddModal} title="Add New Academic Branch" onClose={() => setShowAddModal(false)} width="max-w-md">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded p-3 text-xs text-[#0b2545]">
            💡 Adding a branch automatically seeds dynamic content, hooks it to category lists, and hydates details in real-time.
          </div>
          <FormField label="Department Title" required>
            <Input required placeholder="e.g. Chemical Technology & Engineering" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} />
          </FormField>
          <FormField label="Short Name / Abbreviation" required>
            <Input required placeholder="e.g. CTE" value={addForm.shortName} onChange={e => setAddForm({ ...addForm, shortName: e.target.value })} />
          </FormField>
          <FormField label="Branch Slug (URL Segment)" required>
            <Input required placeholder="e.g. chemical-tech" value={addForm.slug} onChange={e => setAddForm({ ...addForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} />
          </FormField>
          <FormField label="Category Grouping" required>
            <select
              value={addForm.category}
              onChange={e => setAddForm({ ...addForm, category: e.target.value as DepartmentSummary['category'] })}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
            >
              <option value="engineering">Engineering Stream</option>
              <option value="science">Applied Sciences & Humanities</option>
              <option value="other">Management, Pharmacy & Other</option>
            </select>
          </FormField>
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-sm hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-[#0b2545] text-white rounded font-semibold text-sm hover:opacity-90 disabled:opacity-60">{saving ? 'Adding...' : '✓ Add Branch'}</button>
          </div>
        </form>
      </Modal>

      {/* UPDATE DEPARTMENT MODAL */}
      <Modal isOpen={!!editDept} title={`Update Branch Profile — ${editDept?.name}`} onClose={() => setEditDept(null)} width="max-w-2xl">
        <form onSubmit={handleUpdate} className="space-y-5">
          {/* Modal Tabs Header */}
          <div className="flex border-b border-slate-200 gap-2 bg-slate-50 p-1.5 rounded-t-md">
            {[
              { id: 'hod', label: 'HOD Contacts', icon: Mail },
              { id: 'page', label: 'Narrative & Cover', icon: Building },
              { id: 'obe', label: 'OBE & Highlights', icon: Award }
            ].map(tab => {
              const Icon = tab.icon
              const isActive = activeEditTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveEditTab(tab.id as EditTab)}
                  className={`flex-1 py-1.5 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded border transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#0b2545] border-[#0b2545] text-white'
                      : 'bg-white border-slate-200 text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={12} className={isActive ? 'text-[#bfa15f]' : 'text-slate-400'} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* TAB 1: HOD CONTACTS */}
          {activeEditTab === 'hod' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="HOD Name" required>
                  <Input required value={form.hodName} onChange={e => setForm({ ...form, hodName: e.target.value })} />
                </FormField>
                <FormField label="HOD Email Address" required>
                  <Input type="email" required value={form.hodEmail} onChange={e => setForm({ ...form, hodEmail: e.target.value })} />
                </FormField>
                <FormField label="HOD Extension Phone">
                  <Input value={form.hodPhone} onChange={e => setForm({ ...form, hodPhone: e.target.value })} />
                </FormField>
                <FormField label="Established Year" required>
                  <Input required value={form.established} onChange={e => setForm({ ...form, established: e.target.value })} />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Status" required>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value as DepartmentSummary['status'] })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </FormField>
                <FormField label="Category Grouping" required>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value as DepartmentSummary['category'] })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0b2545] bg-white font-semibold"
                  >
                    <option value="engineering">Engineering Stream</option>
                    <option value="science">Applied Sciences & Humanities</option>
                    <option value="other">Management, Pharmacy & Other</option>
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {/* TAB 2: NARRATIVE & COVER IMAGE */}
          {activeEditTab === 'page' && (
            <div className="space-y-4">
              <FormField label="Branch Cover Image URL">
                <Input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://image-path..." />
              </FormField>
              <FormField label="Short Description Sub-Header">
                <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Fostering engineering breakthroughs..." />
              </FormField>
              <FormField label="Detailed Narrative Overview (Double Enter to separate paragraphs)">
                <textarea
                  rows={6}
                  value={form.aboutText}
                  onChange={e => setForm({ ...form, aboutText: e.target.value })}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0b2545] bg-white"
                  placeholder="Overview paragraphs..."
                />
              </FormField>
            </div>
          )}

          {/* TAB 3: OBE VISION & STRATEGIC HIGHLIGHTS */}
          {activeEditTab === 'obe' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Departmental OBE Vision">
                  <textarea
                    rows={3}
                    value={form.vision}
                    onChange={e => setForm({ ...form, vision: e.target.value })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0b2545] bg-white"
                    placeholder="Vision statement..."
                  />
                </FormField>
                <FormField label="Departmental OBE Mission">
                  <textarea
                    rows={3}
                    value={form.mission}
                    onChange={e => setForm({ ...form, mission: e.target.value })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0b2545] bg-white"
                    placeholder="Mission statement..."
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Infrastructure Highlights (One per line)">
                  <textarea
                    rows={4}
                    value={form.infraText}
                    onChange={e => setForm({ ...form, infraText: e.target.value })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0b2545] bg-white"
                    placeholder="e.g. Dedicated computer center"
                  />
                </FormField>
                <FormField label="Offered Programs & Intake Details (One per line)">
                  <textarea
                    rows={4}
                    value={form.intakeText}
                    onChange={e => setForm({ ...form, intakeText: e.target.value })}
                    className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-[#0b2545] bg-white"
                    placeholder="e.g. B.Tech - 120 Intake"
                  />
                </FormField>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setEditDept(null)} className="flex-1 py-2 border border-slate-200 text-slate-700 rounded font-semibold text-xs hover:bg-slate-50 uppercase tracking-wider">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-[#0b2545] text-white hover:opacity-95 rounded font-semibold text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider">{saving ? '⏳ Updating...' : '✓ Save branch profile'}</button>
          </div>
        </form>
      </Modal>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] border border-[#bfa15f]/30 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium">
          <Building size={14} className="text-[#bfa15f]" /> {toast}
        </div>
      )}
    </>
  )
}

export default AdminDepartments
