import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as Icons from 'lucide-react'
import * as placementService from '../../services/placementService'
import { getCustomPages } from '../../services/aboutService'

// Simple local Toast component for saving notifications
interface ToastProps {
  message: string
  onClose: () => void
}
const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#0b2545] text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-semibold border border-[#bfa15f]/30">
      <Icons.CheckCircle2 size={16} className="text-[#bfa15f]" />
      <span>{message}</span>
      <button onClick={onClose} className="hover:text-slate-300 ml-2">
        <Icons.X size={14} />
      </button>
    </div>
  )
}

const PlacementCms: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'process' | 'stats' | 'contacts' | 'pages'>('overview')
  const [toast, setToast] = useState('')

  // ─── STORES STATE ──────────────────────────────────────────────────────────
  const [cellInfo, setCellInfo] = useState<any>({ aboutText: '', phone: '', email: '', ctaLabel: '', ctaEmail: '' })
  const [team, setTeam] = useState<any[]>([])
  const [process, setProcess] = useState<any[]>([])
  const [trainings, setTrainings] = useState<string[]>([])
  const [partners, setPartners] = useState<string[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [deptStats, setDeptStats] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  const [office, setOffice] = useState<any>({ address: '', mondayFridayHours: '', saturdayHours: '', sundayStatus: '' })
  
  // Custom pages sub-states
  const [customPages, setCustomPages] = useState<any[]>([])
  const [showAddPageModal, setShowAddPageModal] = useState(false)
  const [addPageForm, setAddPageForm] = useState({ slug: '', title: '', subtitle: '' })
  const [activeEditPage, setActiveEditPage] = useState<any | null>(null)
  const [pageForm, setPageForm] = useState({
    title: '',
    subtitle: '',
    paragraphs: '',
    highlightsText: '',
    affiliationsText: ''
  })

  // Hydrate all data on mount
  const refreshAll = async () => {
    const [ci, team, proc, train, part, recs, depts, cos, cts, off, pages] = await Promise.allSettled([
      placementService.getTNPCellInfo(),
      placementService.getTNPTeam(),
      placementService.getPlacementProcess(),
      placementService.getTrainingPrograms(),
      placementService.getRecruitingPartners(),
      placementService.getPlacementRecords(),
      placementService.getDeptPlacement(),
      placementService.getLeadingCompanies(),
      placementService.getPlacementContacts(),
      placementService.getPlacementOfficeInfo(),
      getCustomPages(),
    ])
    const val = <T,>(r: PromiseSettledResult<T>, fb: T) => r.status === 'fulfilled' ? r.value : fb
    setCellInfo(val(ci, null))
    setTeam(val(team, []))
    setProcess(val(proc, []))
    setTrainings(val(train, []))
    setPartners(val(part, []))
    setRecords(val(recs, []))
    setDeptStats(val(depts, []))
    setCompanies(val(cos, []))
    setContacts(val(cts, []))
    setOffice(val(off, null))
    const allPages = val(pages, []) as any[]
    setCustomPages(allPages.filter((p: any) => p.menu === 'placement'))
  }

  useEffect(() => {
    refreshAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Helper trigger to save values reactively
  const triggerSave = async (storeKey: string, payload: any, msg: string) => {
    if (storeKey === 'cell_info') await placementService.saveTNPCellInfo(payload)
    else if (storeKey === 'team') await placementService.saveTNPTeam(payload)
    else if (storeKey === 'process') await placementService.savePlacementProcess(payload)
    else if (storeKey === 'contacts') await placementService.savePlacementContacts(payload)
    else if (storeKey === 'office') await placementService.savePlacementOfficeInfo(payload)
    // read-only fallbacks (no save endpoints for training/partners/records in CMS)

    setToast(msg)
    await refreshAll()
  }

  return (
    <div className="space-y-6 bg-slate-50/50 p-1 rounded-xl">
      {/* Title banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-800 flex items-center gap-2">
            <Icons.Briefcase className="text-[#bfa15f]" size={20} />
            <span>Placements CMS & Dynamic Sub-Pages workspace</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic content administration dashboard. Alter stats, guidelines, recruiting sectors, team members, or build dynamic placement sub-pages.
          </p>
        </div>
      </div>

      {/* Main Tab selectors */}
      <div className="flex flex-wrap border-b border-slate-200 gap-2 text-xs font-bold uppercase tracking-wider bg-white p-3 rounded-lg border border-slate-200 shadow-3xs">
        {[
          { id: 'overview', label: 'T&P Cell Overview', icon: Icons.FileText },
          { id: 'team', label: 'T&P Team', icon: Icons.Users },
          { id: 'process', label: 'Process & Trainings', icon: Icons.GitMerge },
          { id: 'stats', label: 'Stats & Records', icon: Icons.BarChart3 },
          { id: 'contacts', label: 'Contacts & Hours', icon: Icons.PhoneCall },
          { id: 'pages', label: 'Placements custom subpages', icon: Icons.Sparkles }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-md border transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0b2545] border-[#0b2545] text-white shadow-2xs'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon size={12} className={activeTab === tab.id ? 'text-[#bfa15f]' : 'text-slate-400'} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Inner Panels */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm min-h-[450px]">
        {/* ─── OVERVIEW PANEL ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">T&P Cell Description & Recruiting Partners</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">T&P Cell Description Text</label>
                <textarea
                  rows={5}
                  value={cellInfo.aboutText || ''}
                  onChange={e => setCellInfo({ ...cellInfo, aboutText: e.target.value })}
                  className="w-full border border-slate-250 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-sans leading-relaxed text-slate-700"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Cell Phone Number</label>
                  <input
                    type="text"
                    value={cellInfo.phone || ''}
                    onChange={e => setCellInfo({ ...cellInfo, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Cell Email Address</label>
                  <input
                    type="text"
                    value={cellInfo.email || ''}
                    onChange={e => setCellInfo({ ...cellInfo, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">CTA Button Text Label</label>
                  <input
                    type="text"
                    value={cellInfo.ctaLabel || ''}
                    onChange={e => setCellInfo({ ...cellInfo, ctaLabel: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">CTA Button Inquiry Email</label>
                  <input
                    type="text"
                    value={cellInfo.ctaEmail || ''}
                    onChange={e => setCellInfo({ ...cellInfo, ctaEmail: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                  />
                </div>
              </div>

              {/* Recruiting partners string block */}
              <div className="border-t border-slate-100 pt-5 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Recruiting Partners List (Comma-separated)</label>
                <textarea
                  rows={2}
                  value={partners.join(', ')}
                  onChange={e => setPartners(e.target.value.split(',').map(p => p.trim()).filter(Boolean))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none leading-relaxed font-sans text-slate-800"
                />
              </div>

              {/* Leading Recruiters Grid Editor */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block">Leading Recruiting Partners Grid</label>
                    <p className="text-[10px] text-slate-400">Configure partner company names, industry sectors, and highlights shown on the public Leading Recruiters page.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newCompany = { name: 'New Recruiter', sector: 'IT', highlight: false }
                      setCompanies([...companies, newCompany])
                    }}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-750 text-[10px] font-bold uppercase rounded border border-slate-250 flex items-center gap-1 bg-white"
                  >
                    <Icons.Plus size={12} className="text-[#bfa15f]" /> Add Recruiter Company
                  </button>
                </div>

                <div className="max-h-[300px] overflow-y-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-xs border-collapse text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500 sticky top-0 z-10">
                      <tr>
                        <th className="px-3 py-2">Company Name</th>
                        <th className="px-3 py-2 w-36">Industry Sector</th>
                        <th className="px-3 py-2 text-center w-24">Highlight</th>
                        <th className="px-3 py-2 text-right w-12">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {companies.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-3 py-1.5">
                            <input
                              type="text"
                              value={c.name}
                              onChange={e => {
                                const list = [...companies]
                                list[idx].name = e.target.value
                                setCompanies(list)
                              }}
                              className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-semibold text-slate-800"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <select
                              value={c.sector}
                              onChange={e => {
                                const list = [...companies]
                                list[idx].sector = e.target.value
                                setCompanies(list)
                              }}
                              className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-700"
                            >
                              <option value="IT">IT</option>
                              <option value="Product">Product</option>
                              <option value="Core">Core</option>
                              <option value="PSU">PSU</option>
                              <option value="Consulting">Consulting</option>
                              <option value="Startup">Startup</option>
                            </select>
                          </td>
                          <td className="px-3 py-1.5 text-center">
                            <input
                              type="checkbox"
                              checked={!!c.highlight}
                              onChange={e => {
                                const list = [...companies]
                                list[idx].highlight = e.target.checked
                                setCompanies(list)
                              }}
                              className="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-slate-350 cursor-pointer"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setCompanies(companies.filter((_, i) => i !== idx))
                              }}
                              className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                            >
                              <Icons.Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {companies.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-450 italic bg-slate-50/30">No recruiting companies added.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  triggerSave('partners', partners, 'Recruiting partners updated.')
                  triggerSave('companies', companies, 'Leading recruiter partners list successfully updated!')
                  triggerSave('cell_info', cellInfo, 'T&P Cell Overview details successfully updated!')
                }}
                className="px-6 py-2.5 bg-[#0b2545] text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-[#bfa15f]/20 shadow-md"
              >
                <Icons.Save size={14} className="text-[#bfa15f]" /> Save Overview Changes
              </button>
            </div>
          </div>
        )}

        {/* ─── TEAM PANEL ─── */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-display text-base font-bold text-slate-800">T&P Coordinator & Officer Team</h3>
              <button
                onClick={() => {
                  const newList = [...team, { name: 'New Team Member', title: 'Coordinator', dept: 'T&P Cell', phone: '0731-2582150', email: 'office@sgsits.ac.in', img: 'https://picsum.photos/seed/tp_new/200/200', exp: '5 years' }]
                  setTeam(newList)
                }}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded-md border border-slate-250 flex items-center gap-1 bg-white"
              >
                <Icons.Plus size={12} className="text-[#bfa15f]" /> Add Team Member
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                  <tr>
                    <th className="px-3 py-2.5 w-16 text-center">Order</th>
                    <th className="px-3 py-2.5">Name</th>
                    <th className="px-3 py-2.5">Designation Title</th>
                    <th className="px-3 py-2.5">Department</th>
                    <th className="px-3 py-2.5">Inquiry Contacts</th>
                    <th className="px-3 py-2.5">Experience</th>
                    <th className="px-3 py-2.5 text-right w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {team.map((member, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <button
                            disabled={idx === 0}
                            onClick={() => {
                              const list = [...team]
                              const temp = list[idx]
                              list[idx] = list[idx - 1]
                              list[idx - 1] = temp
                              setTeam(list)
                            }}
                            className="p-0.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-20 bg-white"
                          >
                            <Icons.ChevronUp size={11} />
                          </button>
                          <button
                            disabled={idx === team.length - 1}
                            onClick={() => {
                              const list = [...team]
                              const temp = list[idx]
                              list[idx] = list[idx + 1]
                              list[idx + 1] = temp
                              setTeam(list)
                            }}
                            className="p-0.5 border border-slate-200 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-20 bg-white"
                          >
                            <Icons.ChevronDown size={11} />
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.name}
                          onChange={e => {
                            const list = [...team]
                            list[idx].name = e.target.value
                            setTeam(list)
                          }}
                          className="border border-slate-150 rounded px-2 py-1 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.title}
                          onChange={e => {
                            const list = [...team]
                            list[idx].title = e.target.value
                            setTeam(list)
                          }}
                          className="border border-slate-150 rounded px-2 py-1 w-full bg-white focus:outline-none text-xs text-accent font-semibold"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={member.dept}
                          onChange={e => {
                            const list = [...team]
                            list[idx].dept = e.target.value
                            setTeam(list)
                          }}
                          className="border border-slate-150 rounded px-2 py-1 w-full bg-white focus:outline-none text-xs text-slate-600"
                        />
                      </td>
                      <td className="px-3 py-2 space-y-1">
                        <input
                          type="text"
                          placeholder="Phone"
                          value={member.phone}
                          onChange={e => {
                            const list = [...team]
                            list[idx].phone = e.target.value
                            setTeam(list)
                          }}
                          className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-[10px] font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Email"
                          value={member.email}
                          onChange={e => {
                            const list = [...team]
                            list[idx].email = e.target.value
                            setTeam(list)
                          }}
                          className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-[10px] font-mono text-slate-500"
                        />
                      </td>
                      <td className="px-3 py-2 w-24">
                        <input
                          type="text"
                          value={member.exp}
                          onChange={e => {
                            const list = [...team]
                            list[idx].exp = e.target.value
                            setTeam(list)
                          }}
                          className="border border-slate-150 rounded px-2 py-1 w-full bg-white focus:outline-none text-xs text-slate-600 text-center font-bold"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${member.name} from T&P Cell team?`)) {
                              setTeam(team.filter((_, i) => i !== idx))
                            }
                          }}
                          className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded"
                        >
                          <Icons.Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {team.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-450 italic bg-slate-50/30">No team members added. Click "Add Team Member" to insert rows.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerSave('team', team, 'T&P Cell officer team list updated successfully!')}
                className="px-6 py-2.5 bg-[#0b2545] text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-[#bfa15f]/20 shadow-md"
              >
                <Icons.Save size={14} className="text-[#bfa15f]" /> Save Team list
              </button>
            </div>
          </div>
        )}

        {/* ─── PROCESS & TRAINING PANEL ─── */}
        {activeTab === 'process' && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Recruitment Process Steps & Year-Round Training Programs</h3>

            <div className="space-y-6">
              {/* Process steps CRUD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase">6-Step Campus Recruitment Process</label>
                  <button
                    onClick={() => {
                      const newList = [...process, { num: String(process.length + 1).padStart(2, '0'), title: 'New Recruitment Step', desc: 'Assess candidates.' }]
                      setProcess(newList)
                    }}
                    className="px-2 py-0.5 border border-slate-200 text-[#0b2545] text-[10px] font-bold uppercase rounded hover:bg-slate-50 flex items-center bg-white"
                  >
                    + Add Step Card
                  </button>
                </div>
                <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    <tr>
                      <th className="px-3 py-2 w-16 text-center">Step No</th>
                      <th className="px-3 py-2 w-52">Milestone Title</th>
                      <th className="px-3 py-2">Workflow Description</th>
                      <th className="px-3 py-2 text-right w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {process.map((step, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={step.num}
                            onChange={e => {
                              const list = [...process]
                              list[idx].num = e.target.value
                              setProcess(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-slate-700"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={step.title}
                            onChange={e => {
                              const list = [...process]
                              list[idx].title = e.target.value
                              setProcess(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={step.desc}
                            onChange={e => {
                              const list = [...process]
                              list[idx].desc = e.target.value
                              setProcess(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => setProcess(process.filter((_, i) => i !== idx))}
                            className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                          >
                            <Icons.Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Training list checklist */}
              <div className="border-t border-slate-100 pt-5">
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Year-Round Training Programs Curriculums (One per line)</label>
                <textarea
                  rows={6}
                  value={trainings.join('\n')}
                  onChange={e => setTrainings(e.target.value.split('\n').filter(Boolean))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none leading-relaxed font-sans"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  triggerSave('process', process, 'Recruitment process steps updated.')
                  triggerSave('training', trainings, 'Training programs checklist successfully updated!')
                }}
                className="px-6 py-2.5 bg-[#0b2545] text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-[#bfa15f]/20 shadow-md"
              >
                <Icons.Save size={14} className="text-[#bfa15f]" /> Save Process & Trainings
              </button>
            </div>
          </div>
        )}

        {/* ─── STATS & RECORDS PANEL ─── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Placement Records Statistics & Department Rates</h3>

            <div className="space-y-6">
              {/* Year-wise stats CRUD */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase">Year-Wise Placement statistics</label>
                  <button
                    onClick={() => {
                      const newList = [{ year: '2024-25', studentsPlaced: 1500, companies: 200, highestPackage: '₹40 LPA', averagePackage: '₹6.0 LPA', topRecruiters: ['TCS', 'Infosys'] }, ...records]
                      setRecords(newList)
                    }}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded border border-slate-250 flex items-center bg-white"
                  >
                    + Add Academic Session Year
                  </button>
                </div>
                <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    <tr>
                      <th className="px-3 py-2 w-32">Academic Session</th>
                      <th className="px-3 py-2 text-center w-32">Students Placed</th>
                      <th className="px-3 py-2 text-center w-24">Companies</th>
                      <th className="px-3 py-2 text-center">Highest Package</th>
                      <th className="px-3 py-2 text-center">Average Package</th>
                      <th className="px-3 py-2">Top Recruiters (Comma Separated)</th>
                      <th className="px-3 py-2 text-right w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {records.map((r, idx) => (
                      <tr key={idx} className={idx === 0 ? "bg-[#bfa15f]/5" : ""}>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={r.year}
                            onChange={e => {
                              const list = [...records]
                              list[idx].year = e.target.value
                              setRecords(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            value={r.studentsPlaced}
                            onChange={e => {
                              const list = [...records]
                              list[idx].studentsPlaced = parseInt(e.target.value) || 0
                              setRecords(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-extrabold text-primary"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            value={r.companies}
                            onChange={e => {
                              const list = [...records]
                              list[idx].companies = parseInt(e.target.value) || 0
                              setRecords(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-slate-700"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={r.highestPackage}
                            onChange={e => {
                              const list = [...records]
                              list[idx].highestPackage = e.target.value
                              setRecords(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-accent"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={r.averagePackage}
                            onChange={e => {
                              const list = [...records]
                              list[idx].averagePackage = e.target.value
                              setRecords(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-slate-600"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={r.topRecruiters.join(', ')}
                            onChange={e => {
                              const list = [...records]
                              list[idx].topRecruiters = e.target.value.split(',').map(x => x.trim()).filter(Boolean)
                              setRecords(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-800"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete academic session ${r.year} statistics?`)) {
                                setRecords(records.filter((_, i) => i !== idx))
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                          >
                            <Icons.Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Department rates CRUD */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Branch-Wise Placement rate matrix</label>
                <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Department Name</th>
                      <th className="px-3 py-2 text-center w-28">Placed Candidates</th>
                      <th className="px-3 py-2 text-center w-28">Total Intake Candidates</th>
                      <th className="px-3 py-2 text-center w-32">Average Package</th>
                      <th className="px-3 py-2 text-center w-32">Highest Package</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {deptStats.map((d, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3 py-1.5 text-slate-800 font-semibold">{d.dept}</td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            value={d.placed}
                            onChange={e => {
                              const list = [...deptStats]
                              list[idx].placed = parseInt(e.target.value) || 0
                              setDeptStats(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-[#bfa15f]"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="number"
                            value={d.total}
                            onChange={e => {
                              const list = [...deptStats]
                              list[idx].total = parseInt(e.target.value) || 0
                              setDeptStats(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-semibold text-slate-655"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={d.avg}
                            onChange={e => {
                              const list = [...deptStats]
                              list[idx].avg = e.target.value
                              setDeptStats(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-semibold text-slate-800"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={d.highest}
                            onChange={e => {
                              const list = [...deptStats]
                              list[idx].highest = e.target.value
                              setDeptStats(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-center font-bold text-[#0b2545]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  triggerSave('records', records, 'Aggregate yearly placement statistics updated.')
                  triggerSave('dept_stats', deptStats, 'Departmental placement rates successfully updated!')
                }}
                className="px-6 py-2.5 bg-[#0b2545] text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-[#bfa15f]/20 shadow-md"
              >
                <Icons.Save size={14} className="text-[#bfa15f]" /> Save Records & Stats
              </button>
            </div>
          </div>
        )}

        {/* ─── CONTACTS & HOURS PANEL ─── */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <h3 className="font-display text-base font-bold text-slate-800 border-b border-slate-100 pb-2">Office Locations, Hours & Coordinators</h3>

            <div className="space-y-6">
              {/* Office hours & timings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-200">
                <div className="md:col-span-2">
                  <h4 className="text-xs font-bold text-[#0b2545] uppercase tracking-wider">Office Details & Locations</h4>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Office Address Block</label>
                  <input
                    type="text"
                    value={office.address || ''}
                    onChange={e => setOffice({ ...office, address: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none bg-white font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Monday – Friday Timing</label>
                  <input
                    type="text"
                    value={office.mondayFridayHours || ''}
                    onChange={e => setOffice({ ...office, mondayFridayHours: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Saturday Timing</label>
                  <input
                    type="text"
                    value={office.saturdayHours || ''}
                    onChange={e => setOffice({ ...office, saturdayHours: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none bg-white font-semibold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Sunday Status</label>
                  <input
                    type="text"
                    value={office.sundayStatus || ''}
                    onChange={e => setOffice({ ...office, sundayStatus: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none bg-white font-bold text-primary"
                  />
                </div>
              </div>

              {/* Personnel Contacts list */}
              <div className="space-y-2 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Inquiry Coordinators Personnel</label>
                  <button
                    onClick={() => {
                      const newList = [...contacts, { name: 'Assistant Coordinator', designation: 'Coordinator', dept: 'T&P Cell', phone: '0731-2582150', email: 'tpo@sgsits.ac.in', role: 'secondary' }]
                      setContacts(newList)
                    }}
                    className="px-2 py-0.5 border border-slate-200 text-[#0b2545] text-[10px] font-bold uppercase rounded hover:bg-slate-50 flex items-center bg-white"
                  >
                    + Add Officer Contact
                  </button>
                </div>
                <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    <tr>
                      <th className="px-3 py-2 w-44">Officer Name</th>
                      <th className="px-3 py-2 w-44">Designation</th>
                      <th className="px-3 py-2 w-32">Department</th>
                      <th className="px-3 py-2">Office Phone</th>
                      <th className="px-3 py-2">Inquiry Email</th>
                      <th className="px-3 py-2 text-center w-28">Type role</th>
                      <th className="px-3 py-2 text-right w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {contacts.map((c, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={c.name}
                            onChange={e => {
                              const list = [...contacts]
                              list[idx].name = e.target.value
                              setContacts(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-bold text-slate-800"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={c.designation}
                            onChange={e => {
                              const list = [...contacts]
                              list[idx].designation = e.target.value
                              setContacts(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-accent font-semibold"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={c.dept}
                            onChange={e => {
                              const list = [...contacts]
                              list[idx].dept = e.target.value
                              setContacts(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-600"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={c.phone}
                            onChange={e => {
                              const list = [...contacts]
                              list[idx].phone = e.target.value
                              setContacts(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-mono"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <input
                            type="text"
                            value={c.email}
                            onChange={e => {
                              const list = [...contacts]
                              list[idx].email = e.target.value
                              setContacts(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs font-mono text-slate-500"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <select
                            value={c.role}
                            onChange={e => {
                              const list = [...contacts]
                              list[idx].role = e.target.value as 'primary' | 'secondary'
                              setContacts(list)
                            }}
                            className="border border-slate-150 rounded px-2 py-0.5 w-full bg-white focus:outline-none text-xs text-slate-700 font-bold"
                          >
                            <option value="primary">Primary Lead</option>
                            <option value="secondary">Secondary</option>
                          </select>
                        </td>
                        <td className="px-3 py-1.5 text-right">
                          <button
                            type="button"
                            onClick={() => setContacts(contacts.filter((_, i) => i !== idx))}
                            className="p-1 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                          >
                            <Icons.Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  triggerSave('office', office, 'Placement office hour details updated.')
                  triggerSave('contacts', contacts, 'Placement coordinators personnel contact list successfully saved!')
                }}
                className="px-6 py-2.5 bg-[#0b2545] text-white hover:bg-primary/95 font-semibold text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 border border-[#bfa15f]/20 shadow-md"
              >
                <Icons.Save size={14} className="text-[#bfa15f]" /> Save Contacts & Timing
              </button>
            </div>
          </div>
        )}

        {/* ─── CUSTOM PAGES BUILDER PANEL ─── */}
        {activeTab === 'pages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display text-base font-bold text-slate-800">Dynamic Placements Dropdown Subpages Builder</h3>
                <p className="text-xs text-slate-500 mt-0.5">Build and manage dynamic sub-pages specifically under the Placements category dropdown, mounting links instantly.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPageModal(true)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0b2545] border border-[#bfa15f]/20 hover:bg-[#bfa15f] hover:text-primary text-white text-xs font-bold uppercase tracking-wider rounded-md"
              >
                <Icons.Plus size={13} className="text-[#bfa15f]" /> Create Placement Page
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customPages.map((p: any) => (
                <div key={p.slug} className="border border-slate-200 p-5 rounded-lg bg-white shadow-2xs space-y-3 flex flex-col justify-between hover:border-slate-350 transition-colors">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#bfa15f] uppercase tracking-wider font-mono">
                        Placements Sub-Page
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 font-display text-sm leading-snug mt-1">{p.title}</h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-1">/placement/{p.slug}</p>
                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">{p.subtitle || 'Custom dynamic subpage'}</p>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveEditPage(p)
                        setPageForm({
                          title: p.title,
                          subtitle: p.subtitle || '',
                          paragraphs: (p.narrativeParagraphs || []).join('\n\n'),
                          highlightsText: (p.highlights || []).map((h: any) => `${h.iconName}|${h.label}|${h.value}|${h.desc}`).join('\n'),
                          affiliationsText: (p.affiliations || []).join('\n')
                        })
                      }}
                      className="flex-1 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase rounded hover:bg-slate-100 flex items-center justify-center gap-1 bg-white shadow-3xs"
                    >
                      <Icons.Pencil size={11} /> Edit Content
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!window.confirm(`Are you sure you want to delete the dynamic subpage: "${p.title}"? This will also remove it from navigation menus.`)) {
                          return
                        }
                        const current = mockStore.getCustomPages()
                        const filteredPages = current.filter((x: any) => x.slug !== p.slug)
                        mockStore.saveCustomPages(filteredPages)

                        // Remove from navigation menu dropdown
                        const navs = mockStore.getNavItems()
                        const parentNav = navs.find((n: any) => n.id === 'placement')
                        if (parentNav && parentNav.children) {
                          parentNav.children = parentNav.children.filter((c: any) => c.path !== `/placement/${p.slug}`)
                          mockStore.saveNavItems(navs)
                        }

                        setToast(`Dynamic Page ${p.title} deleted.`)
                        refreshAll()
                      }}
                      className="p-1.5 border border-slate-200 text-slate-400 hover:text-red-650 hover:bg-red-50 rounded"
                      title="Delete Page"
                    >
                      <Icons.Trash2 size={12} />
                    </button>
                    <Link
                      to={`/placement/${p.slug}`}
                      target="_blank"
                      className="p-1.5 border border-slate-200 text-slate-500 hover:text-accent rounded hover:bg-slate-50"
                      title="Preview Public Page"
                    >
                      <Icons.ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              ))}
              {customPages.length === 0 && (
                <div className="col-span-full border border-dashed border-slate-300 p-8 text-center text-slate-450 italic bg-white rounded-lg">
                  No custom subpages added under Placements dropdown yet. Click "Create Placement Page" to mount dynamic contents.
                </div>
              )}
            </div>

            {/* CREATE PLACEMENTS PAGE MODAL */}
            {showAddPageModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddPageModal(false)} />
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-10">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    if (!addPageForm.slug || !addPageForm.title) return
                    const cleanSlug = addPageForm.slug.toLowerCase().trim().replace(/\s+/g, '-')
                    const newPage = {
                      slug: cleanSlug,
                      menu: 'placement',
                      title: addPageForm.title,
                      subtitle: addPageForm.subtitle,
                      narrativeParagraphs: ['This is a freshly drafted dynamic placement subpage. You can customize paragraphs, highlights, and guidelines easily.'],
                      highlights: [{ iconName: 'Award', label: 'Recognition', value: 'New Drive', desc: 'Accredited dynamic content' }],
                      affiliations: ['Placement Guidelines Approved', 'TPO Ratified']
                    }

                    const current = mockStore.getCustomPages()
                    mockStore.saveCustomPages([...current, newPage])
                    
                    // Add page to navigation menus so it's instantly accessible!
                    const navs = mockStore.getNavItems()
                    const parentMenu = navs.find((n: any) => n.id === 'placement')
                    if (parentMenu && parentMenu.children) {
                      const path = `/placement/${cleanSlug}`
                      const exists = parentMenu.children.some((c: any) => c.path === path)
                      if (!exists) {
                        parentMenu.children.push({
                          label: addPageForm.title,
                          path
                        })
                        mockStore.saveNavItems(navs)
                      }
                    }

                    setToast(`Dynamic page ${newPage.title} created and registered in Placements dropdown.`)
                    setShowAddPageModal(false)
                    setAddPageForm({ slug: '', title: '', subtitle: '' })
                    refreshAll()
                  }} className="space-y-4">
                    <h3 className="font-bold text-slate-850 font-display text-sm uppercase tracking-wider border-b border-slate-150 pb-2">Draft Custom Placements subpage</h3>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Page Title Name</label>
                      <input
                        type="text"
                        required
                        value={addPageForm.title}
                        onChange={e => setAddPageForm({ ...addPageForm, title: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-semibold"
                        placeholder="e.g. Placement Guidelines 2026-27"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Page URL Slug Segment</label>
                      <input
                        type="text"
                        required
                        value={addPageForm.slug}
                        onChange={e => setAddPageForm({ ...addPageForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary font-mono text-xs"
                        placeholder="e.g. recruitment-guidelines"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Page Subtitle / Academic Tag</label>
                      <input
                        type="text"
                        value={addPageForm.subtitle}
                        onChange={e => setAddPageForm({ ...addPageForm, subtitle: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-sm mt-1 focus:outline-none focus:border-primary"
                        placeholder="e.g. Core protocols for on-campus drives"
                      />
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setShowAddPageModal(false)} className="flex-grow py-2 border border-slate-200 text-slate-700 rounded font-semibold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="flex-grow py-2 bg-[#0b2545] text-white rounded font-semibold text-xs uppercase tracking-wider hover:opacity-90">✓ Draft Page</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* EDIT DYNAMIC PAGE CONTENT MODAL */}
            {activeEditPage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50" onClick={() => setActiveEditPage(null)} />
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4 z-10">
                  <form onSubmit={(e) => {
                    e.preventDefault()
                    if (!activeEditPage) return

                    const resolvedParas = pageForm.paragraphs.split('\n\n').map(p => p.trim()).filter(Boolean)
                    const resolvedHl = pageForm.highlightsText.split('\n').map(line => {
                      const parts = line.split('|')
                      return {
                        iconName: parts[0] || 'Award',
                        label: parts[1] || 'Highlight',
                        value: parts[2] || 'New',
                        desc: parts[3] || ''
                      }
                    }).filter(h => h.label)
                    const resolvedAff = pageForm.affiliationsText.split('\n').map(l => l.trim()).filter(Boolean)

                    const updatedPage = {
                      slug: activeEditPage.slug,
                      title: pageForm.title,
                      subtitle: pageForm.subtitle,
                      narrativeParagraphs: resolvedParas,
                      highlights: resolvedHl,
                      affiliations: resolvedAff
                    }

                    mockStore.saveCustomPage(activeEditPage.slug, updatedPage)
                    setToast(`Dynamic Page ${updatedPage.title} saved successfully.`)
                    setActiveEditPage(null)
                    refreshAll()
                  }} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-2">
                      <h3 className="font-bold text-slate-850 font-display text-sm uppercase tracking-wider">Edit Content — {activeEditPage.title}</h3>
                      <button type="button" onClick={() => setActiveEditPage(null)} className="text-slate-400 hover:text-slate-600"><Icons.X size={18} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Title Name</label>
                        <input
                          type="text"
                          required
                          value={pageForm.title}
                          onChange={e => setPageForm({ ...pageForm, title: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs mt-1 focus:outline-none focus:border-primary font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Page Subtitle</label>
                        <input
                          type="text"
                          value={pageForm.subtitle}
                          onChange={e => setPageForm({ ...pageForm, subtitle: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-1.5 text-xs mt-1 focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase font-sans">Narrative Paragraphs (Double Enter to separate paragraphs)</label>
                      <textarea
                        rows={6}
                        value={pageForm.paragraphs}
                        onChange={e => setPageForm({ ...pageForm, paragraphs: e.target.value })}
                        className="w-full border border-slate-200 rounded px-3 py-2 text-xs mt-1 focus:outline-none font-sans leading-relaxed text-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Key highlights markers (Format: Icon|Label|Value|Description)</label>
                        <textarea
                          rows={4}
                          value={pageForm.highlightsText}
                          onChange={e => setPageForm({ ...pageForm, highlightsText: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none font-mono text-[10px] leading-normal"
                          placeholder="e.g. Award|Legacy|70+ Years|Innovation since 1952"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Guidelines / Protocols (One per line)</label>
                        <textarea
                          rows={4}
                          value={pageForm.affiliationsText}
                          onChange={e => setPageForm({ ...pageForm, affiliationsText: e.target.value })}
                          className="w-full border border-slate-200 rounded px-3 py-2 text-xs focus:outline-none font-sans leading-normal"
                          placeholder="e.g. Standard 60% CGPA criteria applies"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2 border-t border-slate-100">
                      <button type="button" onClick={() => setActiveEditPage(null)} className="flex-grow py-2 border border-slate-200 text-slate-700 rounded font-semibold text-xs uppercase tracking-wider hover:bg-slate-50">Cancel</button>
                      <button type="submit" className="flex-grow py-2 bg-[#0b2545] text-white rounded font-semibold text-xs uppercase tracking-wider hover:opacity-90 flex items-center justify-center gap-1.5"><Icons.Save size={13} className="text-[#bfa15f]" /> Save page changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  )
}

export default PlacementCms
