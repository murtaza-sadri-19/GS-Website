import React, { useState } from 'react'
import { Share2, ChevronUp, ChevronDown, Eye, EyeOff, Trash2, Plus, X } from 'lucide-react'
import footerService, { type FooterSocialMedia, type FooterSocialLink } from '../../../services/footerService'
import { useSectionSave, SectionCard, Card, CardHeading, Field, Inp, Toggle, BackendNote, LoadingSkeleton, uid } from './_shared'

const PLATFORMS = ['facebook', 'twitter', 'youtube', 'linkedin', 'instagram', 'github', 'other'] as const

const FooterSocialMediaEditor: React.FC = () => {
  const { data, setData, loading, saving, saved, handleSave } = useSectionSave<FooterSocialMedia>(
    footerService.getSocialMedia,
    footerService.saveSocialMedia,
  )
  const [editState, setEditState] = useState<FooterSocialLink | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  if (loading) return <LoadingSkeleton />
  if (!data) return null

  const setTop = <K extends keyof FooterSocialMedia>(key: K, val: FooterSocialMedia[K]) =>
    setData(d => d ? { ...d, [key]: val } : d)

  const sorted = [...data.links].sort((a, b) => a.order - b.order)

  const moveUp = (idx: number) => {
    if (idx === 0) return
    const arr = [...sorted]
    const tmp = arr[idx].order
    arr[idx] = { ...arr[idx], order: arr[idx - 1].order }
    arr[idx - 1] = { ...arr[idx - 1], order: tmp }
    setData(d => d ? { ...d, links: arr } : d)
  }
  const moveDown = (idx: number) => {
    if (idx === sorted.length - 1) return
    const arr = [...sorted]
    const tmp = arr[idx].order
    arr[idx] = { ...arr[idx], order: arr[idx + 1].order }
    arr[idx + 1] = { ...arr[idx + 1], order: tmp }
    setData(d => d ? { ...d, links: arr } : d)
  }
  const toggleVisible = (id: string) =>
    setData(d => d ? { ...d, links: d.links.map(l => l.id === id ? { ...l, visible: !l.visible } : l) } : d)
  const deleteLink = (id: string) =>
    setData(d => d ? { ...d, links: d.links.filter(l => l.id !== id) } : d)

  const startAdd = () => {
    setEditState({ id: '', platform: 'facebook', label: '', url: '', order: sorted.length + 1, visible: true })
    setIsAdding(true)
  }
  const startEdit = (l: FooterSocialLink) => { setEditState({ ...l }); setIsAdding(false) }
  const cancel = () => { setEditState(null); setIsAdding(false) }

  const commit = () => {
    if (!editState || !editState.url.trim()) return
    if (isAdding) {
      const nl: FooterSocialLink = { ...editState, id: uid(), label: editState.label || editState.platform }
      setData(d => d ? { ...d, links: [...d.links, nl] } : d)
    } else {
      setData(d => d ? { ...d, links: d.links.map(l => l.id === editState.id ? editState : l) } : d)
    }
    cancel()
  }

  const platformColors: Record<string, string> = {
    facebook: 'bg-blue-600', twitter: 'bg-sky-500', youtube: 'bg-red-600',
    linkedin: 'bg-blue-700', instagram: 'bg-pink-600', github: 'bg-slate-800', other: 'bg-slate-500',
  }

  return (
    <SectionCard
      title="Social Media Links"
      subtitle="Social platform links shown in the footer (currently disabled by default)"
      saving={saving}
      saved={saved}
      onSave={() => handleSave(data)}
    >
      <Card>
        <CardHeading icon={<Share2 size={15} />}>Social Media Widget</CardHeading>
        <div className="space-y-4">
          <Toggle
            checked={data.enabled}
            onChange={v => setTop('enabled', v)}
            label="Show Social Media Links in Footer"
            desc="Enable to display social platform icons/links in the footer"
          />
          <Field label="Section Heading">
            <Inp value={data.heading} onChange={e => setTop('heading', e.target.value)} placeholder="Follow Us" />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <CardHeading>Platform Links</CardHeading>
          <button type="button" onClick={startAdd}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition-colors">
            <Plus size={13} /> Add Platform
          </button>
        </div>

        {sorted.length === 0 && !isAdding && (
          <p className="text-sm text-slate-400 text-center py-4">No platforms added yet.</p>
        )}

        <div className="divide-y divide-slate-100">
          {sorted.map((link, idx) => (
            <div key={link.id} className={`flex items-center gap-3 py-2.5 ${!link.visible ? 'opacity-50' : ''}`}>
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-0.5 text-slate-300 hover:text-primary disabled:opacity-30"><ChevronUp size={13} /></button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === sorted.length - 1} className="p-0.5 text-slate-300 hover:text-primary disabled:opacity-30"><ChevronDown size={13} /></button>
              </div>
              <span className={`w-6 h-6 rounded text-white text-[10px] font-bold flex items-center justify-center uppercase ${platformColors[link.platform] ?? 'bg-slate-500'}`}>
                {link.platform[0]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700">{link.label || link.platform}</p>
                <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => toggleVisible(link.id)} className="p-1 text-slate-400 hover:text-primary">{link.visible ? <Eye size={13} /> : <EyeOff size={13} />}</button>
                <button type="button" onClick={() => startEdit(link)} className="p-1 text-slate-400 hover:text-primary text-xs font-bold">Edit</button>
                <button type="button" onClick={() => deleteLink(link.id)} className="p-1 text-slate-400 hover:red-500"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>

        {editState !== null && (
          <div className="border-t border-accent/30 bg-[#bfa15f]/5 p-4 space-y-3 mt-3">
            <p className="text-[11px] font-bold text-accent uppercase tracking-wider">{isAdding ? '＋ Add Platform' : '✎ Edit Platform'}</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Platform">
                <select value={editState.platform}
                  onChange={e => setEditState(s => s ? { ...s, platform: e.target.value as FooterSocialLink['platform'] } : s)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-primary bg-white">
                  {PLATFORMS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </Field>
              <Field label="Display Label">
                <Inp value={editState.label} onChange={e => setEditState(s => s ? { ...s, label: e.target.value } : s)} placeholder="Facebook" />
              </Field>
              <div className="col-span-2">
                <Field label="Profile URL" required>
                  <Inp type="url" value={editState.url} onChange={e => setEditState(s => s ? { ...s, url: e.target.value } : s)}
                    placeholder="https://facebook.com/sgsitsindore" />
                </Field>
              </div>
              <Field label="Visible">
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={editState.visible} onChange={e => setEditState(s => s ? { ...s, visible: e.target.checked } : s)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-slate-700">Show in footer</span>
                </label>
              </Field>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={commit} className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors">{isAdding ? 'Add' : 'Update'}</button>
              <button type="button" onClick={cancel} className="px-4 py-1.5 border border-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 flex items-center gap-1"><X size={12} /> Cancel</button>
            </div>
          </div>
        )}
      </Card>

      <BackendNote endpoint="PUT /api/cms/footer/social-media" />
    </SectionCard>
  )
}

export default FooterSocialMediaEditor
