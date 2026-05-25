import React, { useEffect, useState } from 'react'
import { settingsAPI } from '../../api'
import type { SiteSettings } from '../../types'
import { FormField, Input } from '../../components/admin/CrudPage'
import { Settings, Globe, Save, Loader2, CheckCircle2 } from 'lucide-react'

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { settingsAPI.get().then(setSettings).finally(() => setLoading(false)) }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    try {
      const updated = await settingsAPI.update(settings)
      setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally { setSaving(false) }
  }

  const set = (key: keyof SiteSettings, val: unknown) => {
    setSettings(s => s ? { ...s, [key]: val } : s)
  }
  const setSocial = (key: string, val: string) => {
    setSettings(s => s ? { ...s, socialLinks: { ...s.socialLinks, [key]: val } } : s)
  }

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-400"><Loader2 className="animate-spin mr-3" />Loading settings...</div>
  if (!settings) return null

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure site-wide settings and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-[#bfa15f] font-semibold flex items-center gap-1">
              <CheckCircle2 size={16} />Saved!
            </span>
          )}
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white font-semibold text-sm rounded shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60">
            {saving ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save Settings</>}
          </button>
        </div>
      </div>

      {/* Site Identity */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Settings size={16} className="text-accent" />
          <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Site Identity</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Site Name" required><Input required value={settings.siteName} onChange={e => set('siteName', e.target.value)} /></FormField>
          <FormField label="Tagline"><Input value={settings.tagline} onChange={e => set('tagline', e.target.value)} /></FormField>
          <FormField label="Director Name" required><Input required value={settings.directorName} onChange={e => set('directorName', e.target.value)} /></FormField>
          <FormField label="Director Photo URL" hint="Optional"><Input type="url" placeholder="https://..." value={settings.directorPhoto ?? ''} onChange={e => set('directorPhoto', e.target.value || undefined)} /></FormField>
        </div>
      </section>

      {/* Contact Info */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Contact Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Contact Email" required><Input type="email" required value={settings.contactEmail} onChange={e => set('contactEmail', e.target.value)} /></FormField>
          <FormField label="Contact Phone" required><Input required value={settings.contactPhone} onChange={e => set('contactPhone', e.target.value)} /></FormField>
          <div className="sm:col-span-2">
            <FormField label="Address" required><Input required value={settings.address} onChange={e => set('address', e.target.value)} /></FormField>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe size={16} className="text-accent" />
          <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Social Media Links</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['facebook', 'twitter', 'youtube', 'linkedin', 'instagram'] as const).map(platform => (
            <FormField key={platform} label={platform.charAt(0).toUpperCase() + platform.slice(1)} hint="Optional URL">
              <Input type="url" placeholder={`https://${platform}.com/sgsitsindore`}
                value={settings.socialLinks[platform] ?? ''} onChange={e => setSocial(platform, e.target.value)} />
            </FormField>
          ))}
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-100 pb-3">Feature Toggles</h3>
        <div className="space-y-3">
          {[
            { key: 'marqueeEnabled', label: 'Marquee Announcements', desc: 'Show scrolling alerts bar below main navigation' },
            { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Show maintenance page to all public visitors (admin access still works)' },
          ].map(item => (
            <label key={item.key} className="flex items-start gap-3 cursor-pointer p-3 border border-slate-100 rounded hover:bg-slate-50 transition-colors">
              <input type="checkbox"
                checked={settings[item.key as keyof SiteSettings] as boolean}
                onChange={e => set(item.key as keyof SiteSettings, e.target.checked)}
                className="w-4 h-4 accent-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* API Info */}
      <div className="bg-[#bfa15f]/10 border border-[#bfa15f]/30 rounded-lg p-4 text-xs text-[#0b2545]">
        <p className="font-bold mb-1">Backend Integration Note</p>
        <p>Settings changes currently apply to mock state only. When backend is ready, this form calls <code className="font-mono bg-[#bfa15f]/20 px-1 rounded">PUT /api/settings</code> and saves to the database.</p>
      </div>
    </form>
  )
}

export default AdminSettings
