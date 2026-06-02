import React, { useEffect, useState } from 'react'
import { Palette, Save, Loader2, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react'
import { themeService, themeDefaults } from '../../services/themeService'
import type { ThemeColors } from '../../services/themeService'

interface ColorFieldProps {
  label: string
  description: string
  value: string
  onChange: (val: string) => void
}

const ColorField: React.FC<ColorFieldProps> = ({ label, description, value, onChange }) => (
  <div className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg">
    <div className="relative shrink-0">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-14 h-14 rounded-lg border border-slate-200 cursor-pointer p-0.5 bg-white"
        aria-label={`Pick ${label} color`}
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      <input
        type="text"
        value={value}
        onChange={e => {
          const v = e.target.value
          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v)
        }}
        className="mt-2 w-28 px-2 py-1 text-xs font-mono border border-slate-200 rounded
          focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy"
        maxLength={7}
        aria-label={`Hex value for ${label}`}
      />
    </div>
    <div
      className="w-16 h-16 rounded-lg border border-slate-200 shadow-sm shrink-0"
      style={{ backgroundColor: value }}
      aria-hidden="true"
    />
  </div>
)

const AdminTheme: React.FC = () => {
  const [colors, setColors] = useState<ThemeColors>(themeDefaults)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    themeService.getThemeColors().then(c => {
      setColors(c)
      setLoading(false)
    })
  }, [])

  const set = (key: keyof ThemeColors) => (val: string) => {
    const updated = { ...colors, [key]: val }
    setColors(updated)
    themeService.applyTheme(updated)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await themeService.saveThemeColors(colors)
      themeService.applyTheme(colors)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save theme colors. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setColors(themeDefaults)
    themeService.applyTheme(themeDefaults)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader2 className="animate-spin mr-3" />Loading theme…
    </div>
  )

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Theme Colors</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control the 3 main colors and text color of the entire website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-accent font-semibold flex items-center gap-1">
              <CheckCircle2 size={16} />Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-sm rounded shadow-sm hover:bg-slate-50 transition-colors"
          >
            <RotateCcw size={14} />Reset
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white font-semibold text-sm rounded shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {saving
              ? <><Loader2 size={14} className="animate-spin" />Saving…</>
              : <><Save size={14} />Save Colors</>}
          </button>
        </div>
      </div>

      {/* Color pickers */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Palette size={16} className="text-accent" />
          <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Brand Colors</h3>
        </div>
        <div className="space-y-3">
          <ColorField
            label="Primary Color"
            description="Navigation bar, buttons, headings, active states"
            value={colors.primary}
            onChange={set('primary')}
          />
          <ColorField
            label="Accent Color"
            description="Highlights, gold borders, CTAs, badges"
            value={colors.accent}
            onChange={set('accent')}
          />
          <ColorField
            label="Background Color"
            description="Alternating section backgrounds, page fill"
            value={colors.background}
            onChange={set('background')}
          />
          <ColorField
            label="Text Color"
            description="Body text and heading text across all pages"
            value={colors.text}
            onChange={set('text')}
          />
        </div>
      </section>

      {/* Preview bar */}
      <section className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-primary uppercase tracking-wider border-b border-slate-100 pb-3">Live Preview</h3>
        <div className="rounded-lg overflow-hidden border border-slate-200">
          {/* Simulated nav */}
          <div className="flex items-center justify-between px-5 py-3" style={{ backgroundColor: colors.primary }}>
            <span className="text-white font-bold text-sm">SGSITS</span>
            <span className="text-xs font-semibold px-3 py-1 rounded" style={{ backgroundColor: colors.accent, color: '#fff' }}>
              Login
            </span>
          </div>
          {/* Simulated section */}
          <div className="px-5 py-4" style={{ backgroundColor: colors.background }}>
            <p className="text-lg font-bold" style={{ color: colors.text }}>Section Heading</p>
            <p className="text-sm mt-1" style={{ color: colors.text, opacity: 0.7 }}>
              This is how body text will look across the website.
            </p>
            <div className="mt-3 flex gap-3">
              <button
                type="button"
                className="px-4 py-1.5 text-sm font-semibold rounded"
                style={{ backgroundColor: colors.primary, color: '#ffffff' }}
              >
                Primary Button
              </button>
              <button
                type="button"
                className="px-4 py-1.5 text-sm font-semibold rounded border-2"
                style={{ borderColor: colors.accent, color: colors.accent, backgroundColor: 'transparent' }}
              >
                Accent Button
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Changes are previewed instantly. Click <strong>Save Colors</strong> to persist them — all visitors will see the updated theme after the next page load.
      </p>
    </form>
  )
}

export default AdminTheme
