/**
 * Admin — CMS Content Manager
 * Manage TEQIP, Startup Cell, Institution Stats, Anthem,
 * Campus Map, Video Tour, and First Year Info content.
 */

import React, { useEffect, useState } from 'react'
import { Database, Save, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { saveCmsSection, getCmsSection } from '../../services/settingsService'

interface Section {
  key: string
  label: string
  description: string
}

const CMS_SECTIONS: Section[] = [
  // ── Home Page (use Admin → Home Page for guided editing) ──
  { key: 'home.sections',    label: 'Home — Section Order',      description: 'Enable/disable/reorder home page sections. Better edited via Admin → Home Page.' },
  { key: 'home.hero',        label: 'Home — Hero Banner',        description: 'Hero images, heading text, and 4 hero tiles. Better edited via Admin → Home Page.' },
  { key: 'home.about',       label: 'Home — About Section',      description: 'Institute overview paragraph and CTA buttons.' },
  { key: 'home.director',    label: 'Home — Director Corner',    description: 'Director name, bio, photo URL, and read more link.' },
  { key: 'home.news',        label: 'Home — News Labels',        description: 'News section heading and description text.' },
  { key: 'home.academics',   label: 'Home — Academic Programs',  description: '3 academic programme cards.' },
  { key: 'home.departments', label: 'Home — Departments Grid',   description: 'List of departments shown on the home page.' },
  { key: 'home.stats',       label: 'Home — Stats Banner',       description: 'Parallax stats counter: backgroundImage, items [{val, label}].' },
  { key: 'home.campus_life', label: 'Home — Campus Life',        description: '6 campus facility cards with images and descriptions.' },
  { key: 'home.faqs',        label: 'Home — FAQs',               description: 'FAQ accordion: heading, items [{id, question, answer, contact?}].' },
  { key: 'home.gallery',     label: 'Home — Gallery Config',     description: 'Gallery section heading. Images managed in Gallery module.' },
  { key: 'home.seo',         label: 'Home — SEO',                description: 'Home page meta title, description, OG tags, canonical.' },
  // ── Other pages ──
  { key: 'teqip.overview',   label: 'TEQIP Overview',            description: 'Title, description, contact email/phone for TEQIP page' },
  { key: 'startup.overview', label: 'Startup Cell Overview',     description: 'Title, description, contact for Startup Cell' },
  { key: 'anthem.metadata',  label: 'Anthem Metadata',           description: 'Title, year, duration, raga, composer credits' },
  { key: 'campus.map',       label: 'Campus Map',                description: 'Address, phone, map embed URL, buildings, facts' },
  { key: 'video.tour',       label: 'Video Tour',                description: 'YouTube video ID, channel URL, tour stops' },
  { key: 'institution.stats',label: 'Institution Statistics',    description: 'Key stats shown on About and Departments pages' },
  { key: 'academic.first_year', label: 'First Year Info',        description: 'Welcome text, checklist, subjects, contacts' },
  { key: 'academic.exam_results', label: 'Exam Results',         description: 'Exam schedules, re-evaluation note' },
  { key: 'contact.info',     label: 'Contact Information',       description: 'Main contact details, offices, helplines, officeHours[]' },
  { key: 'academics.calendar_meta', label: 'Academic Calendar Meta', description: 'academicYear, downloadLabel, downloadUrl, semesters[] definitions' },
  { key: 'topbar',           label: 'Top Bar Settings',          description: 'Helpline, registrar email, institute code' },
  { key: 'ui_labels',        label: 'UI Text Labels',            description: 'Homepage headings, button labels, badges across the site.' },
]

const AdminCmsContent: React.FC = () => {
  const [data, setData]     = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved,  setSaved]  = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<string | null>(null)

  const fetchSection = async (key: string) => {
    setLoading(key)
    try {
      const d = await getCmsSection(key)
      setData(prev => ({ ...prev, [key]: JSON.stringify(d, null, 2) }))
    } catch {
      setErrors(prev => ({ ...prev, [key]: 'Failed to load' }))
    } finally {
      setLoading(null)
    }
  }

  const saveSection = async (key: string) => {
    const raw = data[key]
    if (!raw) return
    setSaving(key)
    try {
      const parsed = JSON.parse(raw)
      await saveCmsSection(key, parsed)
      setSaved(key)
      setTimeout(() => setSaved(null), 3000)
    } catch (e) {
      setErrors(prev => ({ ...prev, [key]: e instanceof Error ? e.message : 'Invalid JSON' }))
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Database size={24} className="text-accent" /> CMS Content Manager
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Edit JSON content for all CMS sections. Load a section first, then edit and save.
        </p>
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-sm text-primary">
        <strong>Note:</strong> All fields are stored as JSON. Load the section, make changes, and save.
        Invalid JSON will be rejected.
      </div>

      {CMS_SECTIONS.map((section) => (
        <div key={section.key} className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-800">{section.label}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{section.description}</p>
              <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 mt-1 inline-block">{section.key}</code>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => fetchSection(section.key)}
                disabled={loading === section.key}
                className="px-3 py-1.5 text-xs font-semibold border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors disabled:opacity-60"
              >
                {loading === section.key ? <Loader2 size={12} className="animate-spin inline" /> : 'Load'}
              </button>
              <button
                onClick={() => saveSection(section.key)}
                disabled={saving === section.key || !data[section.key]}
                className="px-3 py-1.5 text-xs font-semibold bg-primary text-white rounded hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-1"
              >
                {saving === section.key
                  ? <><Loader2 size={12} className="animate-spin" />Saving</>
                  : saved === section.key
                  ? <><CheckCircle2 size={12} />Saved!</>
                  : <><Save size={12} />Save</>
                }
              </button>
            </div>
          </div>

          {errors[section.key] && (
            <div className="flex items-center gap-2 text-xs text-red-600">
              <AlertTriangle size={12} /> {errors[section.key]}
            </div>
          )}

          {data[section.key] !== undefined && (
            <textarea
              className="w-full font-mono text-xs border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50 bg-slate-50"
              rows={12}
              value={data[section.key]}
              onChange={e => {
                setData(prev => ({ ...prev, [section.key]: e.target.value }))
                setErrors(prev => ({ ...prev, [section.key]: '' }))
              }}
              spellCheck={false}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default AdminCmsContent
