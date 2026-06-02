/**
 * Admin — Policies Editor
 * Manage all 6 policy documents: Privacy, Terms, Disclaimer,
 * Accessibility, Copyright, Hyperlink + Security policies.
 */

import React, { useEffect, useState } from 'react'
import { FileText, Save, Loader2, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react'
import { getPolicyContent, savePolicyContent, type PolicyContent } from '../../services/policyService'

const POLICY_KEYS = ['privacy', 'terms', 'disclaimer', 'accessibility', 'copyright', 'hyperlink', 'security'] as const
type PolicyKey = typeof POLICY_KEYS[number]

const POLICY_LABELS: Record<PolicyKey, string> = {
  privacy:       'Privacy Policy',
  terms:         'Terms of Use',
  disclaimer:    'Disclaimer',
  accessibility: 'Accessibility Statement',
  copyright:     'Copyright Policy',
  hyperlink:     'Hyperlink Policy',
  security:      'Security Policy',
}

const AdminPolicies: React.FC = () => {
  const [policies, setPolicies] = useState<Partial<Record<PolicyKey, PolicyContent>>>({})
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<PolicyKey | null>(null)
  const [saved, setSaved]       = useState<PolicyKey | null>(null)
  const [expanded, setExpanded] = useState<PolicyKey | null>('privacy')

  useEffect(() => {
    const load = async () => {
      const results = await Promise.all(
        POLICY_KEYS.map(key => getPolicyContent(key).then(d => ({ key, d })))
      )
      const obj: Partial<Record<PolicyKey, PolicyContent>> = {}
      for (const { key, d } of results) obj[key] = d
      setPolicies(obj)
      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async (key: PolicyKey) => {
    const policy = policies[key]
    if (!policy) return
    setSaving(key)
    try {
      await savePolicyContent(key, policy)
      setSaved(key)
      setTimeout(() => setSaved(null), 3000)
    } catch (err) {
      console.error('Failed to save policy', err)
    } finally {
      setSaving(null)
    }
  }

  const update = (key: PolicyKey, field: keyof PolicyContent, value: string) => {
    setPolicies(prev => ({
      ...prev,
      [key]: { ...prev[key]!, [field]: value },
    }))
  }

  const updateSection = (key: PolicyKey, idx: number, field: string, value: string) => {
    setPolicies(prev => {
      const policy = prev[key]
      if (!policy) return prev
      const sections = [...(policy.sections ?? [])]
      sections[idx] = { ...sections[idx], [field]: value }
      return { ...prev, [key]: { ...policy, sections } }
    })
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-400">
      <Loader2 className="animate-spin mr-3" /> Loading policies...
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h2 className="font-display text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FileText size={24} className="text-accent" /> Policy Documents
        </h2>
        <p className="text-xs text-slate-500 mt-1">Edit all public-facing legal and policy documents.</p>
      </div>

      {POLICY_KEYS.map((key) => {
        const policy = policies[key]
        const isExpanded = expanded === key
        if (!policy) return null
        return (
          <div key={key} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : key)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-accent" />
                <span className="font-semibold text-slate-800">{POLICY_LABELS[key]}</span>
                {saved === key && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                    <CheckCircle2 size={12} /> Saved
                  </span>
                )}
              </div>
              {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Page Title</label>
                    <input
                      className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50"
                      value={policy.title}
                      onChange={e => update(key, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Contact Email</label>
                    <input
                      className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50"
                      value={policy.contact ?? ''}
                      onChange={e => update(key, 'contact', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Last Updated</label>
                    <input
                      className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50"
                      value={policy.lastUpdated}
                      onChange={e => update(key, 'lastUpdated', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Effective Date</label>
                    <input
                      className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50"
                      value={policy.effectiveDate}
                      onChange={e => update(key, 'effectiveDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Introduction</label>
                  <textarea
                    rows={3}
                    className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50"
                    value={policy.intro}
                    onChange={e => update(key, 'intro', e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sections</label>
                  {policy.sections?.map((section, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 space-y-2">
                      <input
                        className="w-full text-sm font-semibold border border-slate-200 rounded px-3 py-1.5 focus:outline-none focus:border-accent/50"
                        value={section.title}
                        onChange={e => updateSection(key, idx, 'title', e.target.value)}
                        placeholder="Section title"
                      />
                      <textarea
                        rows={4}
                        className="w-full text-sm border border-slate-200 rounded px-3 py-2 focus:outline-none focus:border-accent/50"
                        value={section.content}
                        onChange={e => updateSection(key, idx, 'content', e.target.value)}
                        placeholder="Section content"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleSave(key)}
                    disabled={saving === key}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {saving === key ? <><Loader2 size={14} className="animate-spin" />Saving...</> : <><Save size={14} />Save {POLICY_LABELS[key]}</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default AdminPolicies
