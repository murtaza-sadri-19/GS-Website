/**
 * Admin Footer Management — CMS hub for all footer sections.
 *
 * Each section is independently editable with its own save state.
 * Route: /dashboard/central-admin/footer
 */
import React, { useState } from 'react'
import {
  Building2,
  Phone,
  Link2,
  GraduationCap,
  Network,
  Globe,
  Scale,
  AlignCenter,
  BarChart3,
  Share2,
  Search,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react'

// Section editors
import FooterBrandingEditor       from './footer/FooterBranding'
import FooterContactEditor        from './footer/FooterContact'
import FooterQuickLinksEditor     from './footer/FooterQuickLinks'
import FooterStudentLinksEditor   from './footer/FooterStudentLinks'
import FooterDepartmentsEditor    from './footer/FooterDepartments'
import FooterExternalLinksEditor  from './footer/FooterExternalLinks'
import FooterPolicyLinksEditor    from './footer/FooterPolicyLinks'
import FooterBottomBarEditor      from './footer/FooterBottomBar'
import FooterVisitorStatsEditor   from './footer/FooterVisitorStats'
import FooterSocialMediaEditor    from './footer/FooterSocialMedia'
import FooterSeoEditor            from './footer/FooterSeo'
import FooterLayoutEditor         from './footer/FooterLayout'

// ─── Tab definition ───────────────────────────────────────────────────────────

interface Tab {
  id: string
  label: string
  shortLabel: string
  icon: React.FC<{ size?: number; className?: string }>
  component: React.FC
  group: 'identity' | 'content' | 'config'
}

const TABS: Tab[] = [
  // ── Identity ──
  { id: 'branding',     label: 'Branding & Logo',       shortLabel: 'Branding',   icon: Building2,      component: FooterBrandingEditor,      group: 'identity' },
  { id: 'contact',      label: 'Contact Information',    shortLabel: 'Contact',    icon: Phone,          component: FooterContactEditor,        group: 'identity' },
  // ── Content ──
  { id: 'quick-links',  label: 'Quick Links',            shortLabel: 'Quick Links',icon: Link2,          component: FooterQuickLinksEditor,     group: 'content' },
  { id: 'student-links',label: 'Student Links',          shortLabel: 'Student',    icon: GraduationCap,  component: FooterStudentLinksEditor,   group: 'content' },
  { id: 'departments',  label: 'Department Links',       shortLabel: 'Depts',      icon: Network,        component: FooterDepartmentsEditor,    group: 'content' },
  { id: 'ext-links',    label: 'Important Links',        shortLabel: 'Ext. Links', icon: Globe,          component: FooterExternalLinksEditor,  group: 'content' },
  { id: 'policy-links', label: 'Policies & Legal',       shortLabel: 'Policy',     icon: Scale,          component: FooterPolicyLinksEditor,    group: 'content' },
  // ── Configuration ──
  { id: 'bottom-bar',   label: 'Bottom Bar',             shortLabel: 'Bottom Bar', icon: AlignCenter,    component: FooterBottomBarEditor,      group: 'config' },
  { id: 'visitor-stats',label: 'Visitor Statistics',     shortLabel: 'Visitors',   icon: BarChart3,      component: FooterVisitorStatsEditor,   group: 'config' },
  { id: 'social-media', label: 'Social Media',           shortLabel: 'Social',     icon: Share2,         component: FooterSocialMediaEditor,    group: 'config' },
  { id: 'seo',          label: 'SEO / Metadata',         shortLabel: 'SEO',        icon: Search,         component: FooterSeoEditor,            group: 'config' },
  { id: 'layout',       label: 'Layout & Visibility',    shortLabel: 'Layout',     icon: LayoutDashboard,component: FooterLayoutEditor,         group: 'config' },
]

const GROUP_LABELS: Record<string, string> = {
  identity: 'Identity',
  content:  'Content',
  config:   'Configuration',
}

// ─── Component ────────────────────────────────────────────────────────────────

const AdminFooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id)

  const active = TABS.find(t => t.id === activeTab) ?? TABS[0]
  const ActiveComponent = active.component

  // Group tabs for sidebar rendering
  const grouped = (Object.keys(GROUP_LABELS) as Array<keyof typeof GROUP_LABELS>).map(g => ({
    label: GROUP_LABELS[g],
    tabs: TABS.filter(t => t.group === g),
  }))

  return (
    <div className="space-y-0">
      {/* Page header */}
      <div className="flex items-start justify-between pb-5 border-b border-slate-200">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-800">Footer Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise CMS — every footer section is independently editable and backend-ready
          </p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-primary border border-primary/20 rounded hover:bg-primary/5 transition-colors"
        >
          <ExternalLink size={13} />
          Preview Footer
        </a>
      </div>

      {/* Two-column layout: sidebar tabs + content */}
      <div className="flex gap-6 pt-5">

        {/* ── Left sidebar: tab navigation ── */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-4">
            {grouped.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-1.5">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.tabs.map(tab => {
                    const Icon = tab.icon
                    const isActive = tab.id === activeTab
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-xs font-semibold tracking-wide transition-all text-left border-l-2 ${
                          isActive
                            ? 'bg-primary/8 text-primary border-accent font-bold bg-[#0b2545]/8'
                            : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-primary'
                        }`}
                      >
                        <Icon size={14} className={isActive ? 'text-accent' : 'text-slate-400'} />
                        <span>{tab.shortLabel}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Separator */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="bg-[#0b2545]/5 border border-[#0b2545]/10 rounded-lg p-3">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">12 Sections</p>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Each section saves independently. Changes persist to localStorage until the backend API is wired.
              </p>
            </div>
          </div>
        </aside>

        {/* ── Right content: active section editor ── */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb trail */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-5 pb-3 border-b border-slate-100">
            <span className="font-medium text-slate-600">Footer</span>
            <span>›</span>
            <span className="font-semibold text-primary">{active.label}</span>
          </div>

          {/* Render the active section editor */}
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}

export default AdminFooter
