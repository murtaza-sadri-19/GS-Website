import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Activity, Loader2, CheckCircle2, XCircle, AlertTriangle,
  RefreshCw, Globe, Server, FileText, Camera, Download,
  ChevronDown, ChevronRight, Wifi, Search, TrendingUp,
  AlertOctagon, Database, Shield, Zap, Wrench,
  Layout, GitBranch, BarChart2, Map,
  ArrowRight, Info,
} from 'lucide-react'
import apiClient from '../../api/client'

// ── Types ────────────────────────────────────────────────────────────────────

type Severity = 'ok' | 'warning' | 'critical' | 'info' | 'loading'
type TabId =
  | 'overview' | 'infra' | 'database' | 'api' | 'pages'
  | 'sync' | 'cms' | 'images' | 'seo' | 'security'
  | 'performance' | 'routes' | 'fixes'

interface CheckItem {
  id: string
  label: string
  detail: string
  severity: Severity
  value?: string | number
  timing?: number
  endpoint?: string
  fixLink?: string
  fixLabel?: string
  recommendation?: string
}

interface Category {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  items: CheckItem[]
  loading: boolean
  tab: TabId
}

interface Recommendation {
  id: string
  severity: 'critical' | 'warning'
  category: string
  problem: string
  fix: string
  fixLink?: string
  fixLabel?: string
}

interface DataStore {
  backendUp: boolean
  settings: Record<string, unknown> | null
  timings: Record<string, number>
  apiData: Record<string, Record<string, unknown> | undefined>
  responseHeaders: Record<string, string>
}

// ── Constants ─────────────────────────────────────────────────────────────────

const APP_BASE = (import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8000/api').replace('/api', '')

const CMS_KEYS: { key: string; label: string }[] = [
  { key: 'home.hero',          label: 'Hero / Slider Section' },
  { key: 'home.about',         label: 'About Section' },
  { key: 'home.director',      label: "Director's Message" },
  { key: 'home.announcements', label: 'Announcements Banner' },
  { key: 'home.news',          label: 'News Section' },
  { key: 'home.academics',     label: 'Academics Section' },
  { key: 'home.departments',   label: 'Departments Section' },
  { key: 'home.stats',         label: 'Statistics Block' },
  { key: 'home.campus_life',   label: 'Campus Life Section' },
  { key: 'home.faqs',          label: 'FAQs Section' },
  { key: 'home.gallery',       label: 'Gallery Section' },
  { key: 'home.seo',           label: 'Homepage SEO Meta' },
  { key: 'footer',             label: 'Footer Content' },
]

const DATA_ENDPOINTS = [
  { id: 'notices',     label: 'Notices',          endpoint: '/v1/notices?pageSize=50',          dataKey: 'notices',     minCount: 1, fixLink: '/dashboard/central-admin/notices' },
  { id: 'news',        label: 'News Articles',    endpoint: '/v1/news?pageSize=50',             dataKey: 'articles',    minCount: 0, fixLink: '/dashboard/central-admin/news' },
  { id: 'events',      label: 'Events',           endpoint: '/v1/events?pageSize=50',           dataKey: 'events',      minCount: 0, fixLink: '/dashboard/central-admin/events' },
  { id: 'tenders',     label: 'Tenders',          endpoint: '/v1/tenders?pageSize=20',          dataKey: 'tenders',     minCount: 0, fixLink: '/dashboard/central-admin/tenders' },
  { id: 'alerts',      label: 'Alerts',           endpoint: '/v1/alerts',                       dataKey: null,          minCount: 0, fixLink: '/dashboard/central-admin/alerts' },
  { id: 'faculty',     label: 'Faculty',          endpoint: '/v1/faculty?pageSize=200',         dataKey: 'faculty',     minCount: 1, fixLink: '/dashboard/central-admin/faculty' },
  { id: 'departments', label: 'Departments',      endpoint: '/v1/departments?pageSize=30',      dataKey: 'departments', minCount: 1, fixLink: '/dashboard/central-admin/departments' },
  { id: 'gallery',     label: 'Gallery Albums',   endpoint: '/v1/gallery/albums',               dataKey: null,          minCount: 0, fixLink: '/dashboard/central-admin/gallery' },
  { id: 'downloads',   label: 'Downloads',        endpoint: '/v1/downloads?pageSize=20',        dataKey: 'downloads',   minCount: 0, fixLink: '/dashboard/central-admin/downloads' },
  { id: 'placement',   label: 'Placement',        endpoint: '/v1/placement/records?pageSize=10',dataKey: 'records',     minCount: 0, fixLink: '/dashboard/central-admin/placement' },
  { id: 'users',       label: 'Users',            endpoint: '/v1/users?pageSize=10',            dataKey: null,          minCount: 1, fixLink: '/dashboard/central-admin/users' },
] as const

const PAGE_ROUTES = [
  { id: 'home',         path: '/',                          label: 'Homepage',            requiredApis: ['notices','news','gallery','departments'] },
  { id: 'about',        path: '/about/institute',           label: 'About Institute',     requiredApis: [] },
  { id: 'director',     path: '/about/director-message',    label: "Director's Message",  requiredApis: [] },
  { id: 'departments',  path: '/departments',               label: 'Departments Listing', requiredApis: ['departments'] },
  { id: 'dept-detail',  path: '/departments/:slug',         label: 'Department Detail',   requiredApis: ['departments','faculty'] },
  { id: 'faculty-prof', path: '/faculty/:id',               label: 'Faculty Profile',     requiredApis: ['faculty'] },
  { id: 'notices',      path: '/notices',                   label: 'Notices',             requiredApis: ['notices'] },
  { id: 'news',         path: '/news',                      label: 'News',                requiredApis: ['news'] },
  { id: 'news-detail',  path: '/news/:id',                  label: 'News Detail',         requiredApis: ['news'] },
  { id: 'events',       path: '/events',                    label: 'Events',              requiredApis: ['events'] },
  { id: 'tenders',      path: '/tenders',                   label: 'Tenders',             requiredApis: ['tenders'] },
  { id: 'gallery',      path: '/explore/gallery',           label: 'Photo Gallery',       requiredApis: ['gallery'] },
  { id: 'placement',    path: '/placement/tnp-cell',        label: 'T&P Cell',            requiredApis: ['placement'] },
  { id: 'contact',      path: '/contact',                   label: 'Contact Us',          requiredApis: [] },
  { id: 'admission',    path: '/admission/ug',              label: 'UG Admission',        requiredApis: [] },
]

const SYNC_ITEMS = [
  { id: 'sync-notices',     label: 'Notices',         apiId: 'notices',     dataKey: 'notices' },
  { id: 'sync-news',        label: 'News Articles',   apiId: 'news',        dataKey: 'articles' },
  { id: 'sync-events',      label: 'Events',          apiId: 'events',      dataKey: 'events' },
  { id: 'sync-faculty',     label: 'Faculty',         apiId: 'faculty',     dataKey: 'faculty' },
  { id: 'sync-departments', label: 'Departments',     apiId: 'departments', dataKey: 'departments' },
  { id: 'sync-gallery',     label: 'Gallery Albums',  apiId: 'gallery',     dataKey: null },
]

// ── Utilities ─────────────────────────────────────────────────────────────────

async function timedGet(endpoint: string): Promise<{ data: Record<string, unknown>; timing: number; headers: Record<string, string> }> {
  const t0 = performance.now()
  const res = await apiClient.get(endpoint)
  return {
    data: res.data as Record<string, unknown>,
    timing: Math.round(performance.now() - t0),
    headers: res.headers as Record<string, string>,
  }
}

function extractArray(data: Record<string, unknown>, dataKey: string | null): Record<string, unknown>[] {
  if (!data) return []
  const inner = data.data
  if (!inner) return []
  if (Array.isArray(inner)) return inner as Record<string, unknown>[]
  if (typeof inner !== 'object' || inner === null) return []
  const obj = inner as Record<string, unknown>
  if (dataKey && Array.isArray(obj[dataKey])) return obj[dataKey] as Record<string, unknown>[]
  return []
}

function extractTotal(data: Record<string, unknown>, dataKey: string | null): number | undefined {
  if (!data) return undefined
  const inner = data.data
  if (!inner || typeof inner !== 'object') return undefined
  const obj = inner as Record<string, unknown>
  if (typeof obj.total === 'number') return obj.total
  if (typeof obj.count === 'number') return obj.count
  if (dataKey && Array.isArray(obj[dataKey])) return (obj[dataKey] as unknown[]).length
  if (Array.isArray(inner)) return (inner as unknown[]).length
  return undefined
}

function timingCls(ms: number): string {
  if (ms < 250) return 'text-green-600'
  if (ms < 500) return 'text-emerald-600'
  if (ms < 1000) return 'text-amber-600'
  return 'text-red-600'
}

function timingSev(ms: number): Severity {
  if (ms < 500) return 'ok'
  if (ms < 1000) return 'warning'
  return 'critical'
}

function normalizeImageUrl(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  if (url.startsWith('/')) return `${APP_BASE}${url}`
  return null
}

function extractImageUrls(rows: Record<string, unknown>[]): string[] {
  const keys = ['photo_url', 'cover_image', 'image_url', 'cover_img_url', 'thumbnail_url', 'banner_url', 'logo_url']
  const urls: string[] = []
  for (const row of rows) {
    for (const key of keys) {
      const url = normalizeImageUrl(row[key])
      if (url) urls.push(url)
    }
  }
  return [...new Set(urls)]
}

async function checkImageLoad(url: string, timeout = 5000): Promise<boolean> {
  return new Promise(resolve => {
    const img = new Image()
    const t = setTimeout(() => { img.src = ''; resolve(false) }, timeout)
    img.onload = () => { clearTimeout(t); resolve(true) }
    img.onerror = () => { clearTimeout(t); resolve(false) }
    img.src = url
  })
}

function mkLoadingItems(prefix: string, count: number): CheckItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i}`,
    label: 'Checking…',
    detail: '',
    severity: 'loading' as Severity,
  }))
}

// ── Score helpers ─────────────────────────────────────────────────────────────

function scoreFromItems(items: CheckItem[]): number {
  const done = items.filter(i => i.severity !== 'loading')
  if (done.length === 0) return 100
  const earned = done.reduce((acc, i) => {
    if (i.severity === 'ok' || i.severity === 'info') return acc + 10
    if (i.severity === 'warning') return acc + 5
    return acc
  }, 0)
  return Math.round((earned / (done.length * 10)) * 100)
}

function calcOverall(cats: Category[]): number {
  const all = cats.flatMap(c => c.items)
  return scoreFromItems(all)
}

function gradeInfo(score: number): { grade: string; color: string; ring: string; bg: string } {
  if (score >= 95) return { grade: 'A+', color: 'text-green-600',   ring: 'border-green-400',   bg: 'bg-green-50' }
  if (score >= 85) return { grade: 'A',  color: 'text-green-600',   ring: 'border-green-400',   bg: 'bg-green-50' }
  if (score >= 75) return { grade: 'B',  color: 'text-emerald-600', ring: 'border-emerald-400', bg: 'bg-emerald-50' }
  if (score >= 65) return { grade: 'C',  color: 'text-amber-600',   ring: 'border-amber-400',   bg: 'bg-amber-50' }
  if (score >= 50) return { grade: 'D',  color: 'text-orange-600',  ring: 'border-orange-400',  bg: 'bg-orange-50' }
  return             { grade: 'F',  color: 'text-red-600',     ring: 'border-red-400',     bg: 'bg-red-50' }
}

function domainScore(cats: Category[], catIds: string[]): number {
  const items = cats.filter(c => catIds.includes(c.id)).flatMap(c => c.items)
  return scoreFromItems(items)
}

// ── Recommendation engine ─────────────────────────────────────────────────────

function generateRecommendations(cats: Category[]): Recommendation[] {
  const recs: Recommendation[] = []
  for (const cat of cats) {
    for (const item of cat.items) {
      if (item.severity === 'critical' || item.severity === 'warning') {
        recs.push({
          id: item.id,
          severity: item.severity,
          category: cat.label,
          problem: item.label,
          fix: item.recommendation ?? item.detail,
          fixLink: item.fixLink,
          fixLabel: item.fixLabel,
        })
      }
    }
  }
  return recs
}

// ── Sub-components ────────────────────────────────────────────────────────────

const SevIcon: React.FC<{ sev: Severity }> = ({ sev }) => {
  if (sev === 'loading')  return <Loader2 size={14} className="animate-spin text-slate-400 shrink-0" />
  if (sev === 'ok')       return <CheckCircle2 size={14} className="text-green-500 shrink-0" />
  if (sev === 'info')     return <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
  if (sev === 'warning')  return <AlertTriangle size={14} className="text-amber-500 shrink-0" />
  return                         <XCircle size={14} className="text-red-500 shrink-0" />
}

const SevBadge: React.FC<{ sev: Severity }> = ({ sev }) => {
  const map: Record<Severity, [string, string]> = {
    loading:  ['bg-slate-100 text-slate-500', '…'],
    ok:       ['bg-green-100 text-green-700', 'OK'],
    info:     ['bg-blue-100 text-blue-700',   'Info'],
    warning:  ['bg-amber-100 text-amber-700', 'Warning'],
    critical: ['bg-red-100 text-red-700',     'Critical'],
  }
  const [cls, lbl] = map[sev]
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${cls}`}>
      {lbl}
    </span>
  )
}

const CheckRow: React.FC<{ item: CheckItem }> = ({ item }) => (
  <div className={`flex items-start gap-3 px-5 py-3 transition-colors ${
    item.severity === 'critical' ? 'bg-red-50/50' :
    item.severity === 'warning'  ? 'bg-amber-50/30' : ''
  }`}>
    <div className="mt-0.5"><SevIcon sev={item.severity} /></div>
    <div className="flex-1 min-w-0">
      <p className={`text-[13px] font-semibold ${item.severity === 'loading' ? 'text-slate-400' : 'text-slate-700'}`}>
        {item.label}
      </p>
      {item.severity !== 'loading' && (
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
      )}
      {item.endpoint && (
        <code className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded mt-1 inline-block">
          {item.endpoint}
        </code>
      )}
    </div>
    <div className="flex items-center gap-2 shrink-0 ml-2">
      {typeof item.timing === 'number' && (
        <span className={`text-[11px] font-bold tabular-nums ${timingCls(item.timing)}`}>
          {item.timing}ms
        </span>
      )}
      {typeof item.value === 'number' && (
        <span className="text-[11px] text-slate-400 font-medium tabular-nums">
          {(item.value as number).toLocaleString()}
        </span>
      )}
      <SevBadge sev={item.severity} />
      {item.fixLink && item.severity !== 'ok' && item.severity !== 'loading' && (
        <Link
          to={item.fixLink}
          className="text-[11px] font-bold text-primary underline underline-offset-2 hover:text-accent transition-colors"
        >
          {item.fixLabel ?? 'Fix →'}
        </Link>
      )}
    </div>
  </div>
)

const CategoryPanel: React.FC<{
  cat: Category
  open: boolean
  onToggle: () => void
}> = ({ cat, open, onToggle }) => {
  const CatIcon = cat.icon
  const crit = cat.items.filter(i => i.severity === 'critical').length
  const warn = cat.items.filter(i => i.severity === 'warning').length
  const done = cat.items.filter(i => i.severity !== 'loading').length

  const sumLabel = cat.loading ? 'Scanning…' : crit > 0 ? `${crit} Critical` : warn > 0 ? `${warn} Warning${warn > 1 ? 's' : ''}` : 'All OK'
  const sumCls   = cat.loading ? 'bg-slate-100 text-slate-500' : crit > 0 ? 'bg-red-100 text-red-700' : warn > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50/70 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            crit > 0 ? 'bg-red-100 text-red-600' :
            warn > 0 ? 'bg-amber-100 text-amber-600' :
            cat.loading ? 'bg-slate-100 text-slate-400' :
            'bg-green-100 text-green-600'
          }`}>
            <CatIcon size={15} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">{cat.label}</p>
            <p className="text-[11px] text-slate-400">{done}/{cat.items.length} checks done</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${sumCls}`}>{sumLabel}</span>
          {open ? <ChevronDown size={15} className="text-slate-400" /> : <ChevronRight size={15} className="text-slate-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {cat.items.map(item => <CheckRow key={item.id} item={item} />)}
        </div>
      )}
    </div>
  )
}

interface DomainCard { label: string; icon: React.ComponentType<{size?: number; className?: string}>; catIds: string[] }

const DOMAIN_CARDS: DomainCard[] = [
  { label: 'Infrastructure', icon: Server,    catIds: ['infra', 'database'] },
  { label: 'APIs',           icon: Wifi,      catIds: ['api'] },
  { label: 'CMS',            icon: Globe,     catIds: ['cms', 'sync'] },
  { label: 'Pages',          icon: Layout,    catIds: ['pages', 'routes'] },
  { label: 'Content',        icon: FileText,  catIds: ['images'] },
  { label: 'SEO',            icon: Search,    catIds: ['seo'] },
  { label: 'Security',       icon: Shield,    catIds: ['security'] },
  { label: 'Performance',    icon: Zap,       catIds: ['performance'] },
]

// ── Initial state ─────────────────────────────────────────────────────────────

function initialCategories(): Category[] {
  return [
    { id: 'infra',       label: 'Infrastructure',           icon: Server,    tab: 'infra',       loading: true, items: mkLoadingItems('infra', 4) },
    { id: 'database',    label: 'Database Tables',          icon: Database,  tab: 'database',    loading: true, items: mkLoadingItems('db', 13) },
    { id: 'api',         label: 'API Endpoints',            icon: Wifi,      tab: 'api',         loading: true, items: mkLoadingItems('api', 11) },
    { id: 'pages',       label: 'Page Health',              icon: Layout,    tab: 'pages',       loading: true, items: mkLoadingItems('page', 15) },
    { id: 'sync',        label: 'Frontend ↔ Backend Sync', icon: GitBranch, tab: 'sync',        loading: true, items: mkLoadingItems('sync', 6) },
    { id: 'cms',         label: 'CMS Sections',             icon: Globe,     tab: 'cms',         loading: true, items: mkLoadingItems('cms', 13) },
    { id: 'images',      label: 'Broken Image Detection',   icon: Camera,    tab: 'images',      loading: true, items: mkLoadingItems('img', 5) },
    { id: 'seo',         label: 'SEO Health',               icon: Search,    tab: 'seo',         loading: true, items: mkLoadingItems('seo', 8) },
    { id: 'security',    label: 'Security Health',          icon: Shield,    tab: 'security',    loading: true, items: mkLoadingItems('sec', 7) },
    { id: 'performance', label: 'Performance Health',       icon: Zap,       tab: 'performance', loading: true, items: mkLoadingItems('perf', 6) },
    { id: 'routes',      label: 'Route Integrity',          icon: Map,       tab: 'routes',      loading: true, items: mkLoadingItems('route', 8) },
  ]
}

// ── Download helper ───────────────────────────────────────────────────────────

function downloadReport(cats: Category[], score: number, lastRun: Date | null) {
  const lines = [
    '═══════════════════════════════════════════════════════════════',
    '   SGSITS WEBSITE OPERATIONS CENTER — FULL DIAGNOSTIC REPORT',
    '═══════════════════════════════════════════════════════════════',
    `Generated   : ${lastRun?.toLocaleString() ?? 'N/A'}`,
    `Health Score: ${score}/100 (${gradeInfo(score).grade})`,
    '',
    ...cats.flatMap(cat => [
      `┌─ ${cat.label.toUpperCase()} ${'─'.repeat(Math.max(0, 50 - cat.label.length))}`,
      ...cat.items.map(i =>
        `│  [${i.severity.toUpperCase().padEnd(8)}] ${i.label.padEnd(40)} ${i.detail}`
      ),
      '',
    ]),
    '═══════════════════════════════════════════════════════════════',
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `sgsits-ops-report-${new Date().toISOString().slice(0, 10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminCmsHealth: React.FC = () => {
  const [running, setRunning]     = useState(false)
  const [progress, setProgress]   = useState('')
  const [lastRun, setLastRun]     = useState<Date | null>(null)
  const [cats, setCats]           = useState<Category[]>(initialCategories)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [recs, setRecs]           = useState<Recommendation[]>([])

  const setItems = (id: string, items: CheckItem[]) =>
    setCats(prev => prev.map(c => c.id === id ? { ...c, items, loading: false } : c))

  const toggle = (id: string) =>
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))

  // ── Run health check ──────────────────────────────────────────────────────

  const runHealthCheck = async () => {
    setRunning(true)
    setRecs([])
    setCats(initialCategories())

    const store: DataStore = {
      backendUp: false,
      settings: null,
      timings: {},
      apiData: {},
      responseHeaders: {},
    }

    // ── Phase 1: Infrastructure ───────────────────────────────────────────
    setProgress('Checking infrastructure…')
    try {
      const { data, timing, headers } = await timedGet('/v1/settings')
      store.backendUp = true
      store.settings = (data.data as Record<string, unknown>) ?? null
      store.timings['settings'] = timing
      store.apiData['settings'] = data
      Object.assign(store.responseHeaders, headers)

      setItems('infra', [
        {
          id: 'db',
          label: 'MySQL Database Connection',
          detail: `Database online — query responded in ${timing}ms`,
          severity: 'ok',
          timing,
          endpoint: 'GET /v1/settings',
        },
        {
          id: 'api-server',
          label: 'Backend API Server',
          detail: timing > 1000
            ? `Server responding slowly (${timing}ms) — check server load or network`
            : `API server operational (${timing}ms round-trip)`,
          severity: timing > 1000 ? 'warning' : 'ok',
          timing,
          recommendation: 'Restart the Express server or check CPU/memory usage on the host',
        },
        {
          id: 'storage',
          label: 'File Upload System',
          detail: 'Disk storage active — uploads served from backend/uploads/{usage}/',
          severity: 'info',
        },
        {
          id: 'env',
          label: 'Environment Configuration',
          detail: `API base: ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'} · App origin: ${APP_BASE}`,
          severity: 'info',
        },
      ])
    } catch {
      store.backendUp = false
      const errItem = (label: string, detail: string): CheckItem => ({
        id: label.toLowerCase().replace(/\s/g, '-'),
        label, detail, severity: 'critical',
        recommendation: 'Ensure the Express backend is running on port 8000 and MySQL is connected',
      })
      setItems('infra', [
        errItem('MySQL Database Connection', 'Cannot reach backend — verify MySQL is running and DB credentials in .env are correct'),
        errItem('Backend API Server', 'Backend unreachable — ensure the Express server is started (npm start / node index.js)'),
        errItem('File Upload System', 'Cannot verify — backend is down'),
        errItem('Environment Configuration', 'Cannot verify — backend is down'),
      ])
      // Mark all other categories as critical
      for (const id of ['database','api','pages','sync','cms','images','seo','security','performance','routes']) {
        setItems(id, [{
          id: `${id}-backend-down`,
          label: 'Backend Unreachable',
          detail: 'Cannot perform checks — start the backend server and re-run the scan',
          severity: 'critical',
        }])
      }
      setRunning(false)
      setProgress('')
      return
    }

    // ── Phase 2: API + DB + CMS in parallel ──────────────────────────────
    setProgress('Scanning API endpoints, database tables, and CMS…')

    await Promise.all([
      // API + DB combined scan
      (async () => {
        const settled = await Promise.allSettled(
          DATA_ENDPOINTS.map(async ep => {
            const { data, timing } = await timedGet(ep.endpoint)
            store.timings[ep.id] = timing
            store.apiData[ep.id] = data
            return { ep, data, timing }
          })
        )

        // API tab items
        const apiItems: CheckItem[] = settled.map((r, i) => {
          const ep = DATA_ENDPOINTS[i]
          if (r.status === 'rejected') {
            return {
              id: ep.id, label: ep.label, endpoint: ep.endpoint,
              severity: 'critical' as Severity,
              detail: `${ep.label} endpoint not responding — check backend module`,
              fixLink: ep.fixLink, fixLabel: `Manage ${ep.label}`,
              recommendation: `Verify the backend route for ${ep.endpoint} exists and the module is enabled`,
            }
          }
          const { data, timing } = r.value
          const total = extractTotal(data, ep.dataKey)
          const arr = extractArray(data, ep.dataKey)
          const slow = timing > 800
          const empty = (total === 0 || arr.length === 0) && ep.minCount > 0
          const sev: Severity = empty ? 'warning' : slow ? 'warning' : 'ok'
          return {
            id: ep.id, label: ep.label, endpoint: ep.endpoint, timing,
            severity: sev,
            detail: total !== undefined
              ? `${total} record${total !== 1 ? 's' : ''} in DB · ${arr.length} returned · ${timing}ms`
              : `Responding — ${timing}ms`,
            value: total,
            fixLink: ep.fixLink, fixLabel: `Manage ${ep.label}`,
            recommendation: empty ? `Add ${ep.label} content via the admin panel` : slow ? `Optimize the /v1${ep.endpoint.slice(ep.endpoint.indexOf('/'))} query — check for missing indexes` : undefined,
          }
        })
        setItems('api', apiItems)

        // DB tab — same data, table-centric view
        const dbItems: CheckItem[] = settled.map((r, i) => {
          const ep = DATA_ENDPOINTS[i]
          if (r.status === 'rejected') {
            return {
              id: `db-${ep.id}`, label: ep.label + ' table',
              severity: 'critical' as Severity,
              detail: 'Table unreachable — migration may be missing',
              recommendation: `Run database migrations and check that the ${ep.label.toLowerCase()} table exists in MySQL`,
            }
          }
          const { data } = r.value
          const total = extractTotal(data, ep.dataKey)
          const hasData = total !== undefined && total >= 0
          return {
            id: `db-${ep.id}`, label: ep.label + ' table',
            severity: hasData ? 'ok' : 'info',
            detail: hasData ? `Table accessible · ${total} total record${total !== 1 ? 's' : ''}` : 'Table accessible · count not available',
            value: total,
          }
        })
        // Add cms_sections check
        try {
          const { data } = await timedGet('/v1/settings/cms/home.hero')
          dbItems.push({
            id: 'db-cms', label: 'cms_sections table',
            severity: 'ok',
            detail: `Table accessible · CMS data found`,
          })
          store.apiData['cms-hero'] = data
        } catch {
          dbItems.push({
            id: 'db-cms', label: 'cms_sections table',
            severity: 'warning',
            detail: 'CMS sections table not responding — run migrations',
            recommendation: 'Run the database migration that creates the cms_sections table',
          })
        }
        setItems('database', dbItems)
      })(),

      // CMS sections scan
      (async () => {
        const settled = await Promise.allSettled(
          CMS_KEYS.map(async ({ key }) => {
            const res = await apiClient.get(`/v1/settings/cms/${key}`)
            return { key, data: (res.data as Record<string, unknown>).data }
          })
        )
        setItems('cms', CMS_KEYS.map(({ key, label }, i) => {
          const r = settled[i]
          if (r.status === 'rejected') {
            return {
              id: key, label, endpoint: `/v1/settings/cms/${key}`,
              severity: 'critical' as Severity,
              detail: 'Section failed to load — backend settings module error',
              fixLink: '/dashboard/central-admin/home-cms', fixLabel: 'Open CMS Editor',
              recommendation: 'Check the backend /v1/settings/cms route and verify the cms_sections table',
            }
          }
          const populated = r.value.data != null &&
            typeof r.value.data === 'object' &&
            Object.keys(r.value.data as object).length > 0
          return {
            id: key, label, endpoint: `/v1/settings/cms/${key}`,
            severity: populated ? 'ok' as Severity : 'warning' as Severity,
            detail: populated ? 'Configured — custom data is live on website' : 'Empty — website shows built-in fallback defaults',
            fixLink: '/dashboard/central-admin/home-cms', fixLabel: 'Edit in CMS',
            recommendation: populated ? undefined : `Open the CMS editor and fill in the "${label}" section content`,
          }
        }))
      })(),
    ])

    // ── Phase 3: Data-dependent checks ───────────────────────────────────
    setProgress('Analyzing pages, sync, images, SEO, security, performance…')

    await Promise.all([

      // Page Health
      (async () => {
        const apiStatus: Record<string, boolean> = {}
        for (const ep of DATA_ENDPOINTS) {
          apiStatus[ep.id] = !!store.apiData[ep.id]
        }
        // Also check settings
        apiStatus['settings'] = store.settings !== null

        const pageItems: CheckItem[] = PAGE_ROUTES.map(route => {
          const failedApis = route.requiredApis.filter(a => !apiStatus[a])
          const allOk = failedApis.length === 0
          const timing = route.requiredApis.length > 0
            ? Math.max(...route.requiredApis.map(a => store.timings[a] ?? 0))
            : 0

          return {
            id: route.id,
            label: route.label,
            detail: route.requiredApis.length === 0
              ? `${route.path} — Static page, no API dependencies`
              : allOk
                ? `${route.path} — All ${route.requiredApis.length} data source${route.requiredApis.length > 1 ? 's' : ''} responding (max ${timing}ms)`
                : `${route.path} — ${failedApis.length} failed API${failedApis.length > 1 ? 's' : ''}: ${failedApis.join(', ')}`,
            severity: allOk ? 'ok' : 'critical',
            timing: timing > 0 ? timing : undefined,
            endpoint: route.path,
            recommendation: !allOk ? `Fix the failing APIs: ${failedApis.join(', ')} — this page won't load data correctly` : undefined,
          }
        })
        setItems('pages', pageItems)
      })(),

      // Frontend ↔ Backend Sync
      (async () => {
        const syncItems: CheckItem[] = SYNC_ITEMS.map(s => {
          const data = store.apiData[s.apiId]
          if (!data) {
            return {
              id: s.id, label: s.label,
              severity: 'critical' as Severity,
              detail: 'Cannot check — API did not respond',
            }
          }
          const arr = extractArray(data, s.dataKey)
          const total = extractTotal(data, s.dataKey)
          const shown = arr.length
          const dbTotal = total ?? shown
          const synced = dbTotal === shown || (dbTotal > shown && shown > 0)
          const sev: Severity = dbTotal === shown ? 'ok' : (shown === 0 && dbTotal > 0) ? 'warning' : 'ok'

          return {
            id: s.id,
            label: s.label,
            severity: sev,
            detail: dbTotal === shown
              ? `Database: ${dbTotal} · API: ${shown} · Frontend: ${shown} — Synced ✓`
              : shown === 0 && dbTotal > 0
                ? `Database: ${dbTotal} · API returned: 0 — Sync mismatch! Data may be filtered or hidden`
                : `Database: ${dbTotal} total · API page: ${shown} — Paginated (normal)`,
            value: dbTotal,
            recommendation: sev === 'warning' ? `Check if records have PUBLISHED status. Database has ${dbTotal} records but API returned 0.` : undefined,
            fixLink: DATA_ENDPOINTS.find(ep => ep.id === s.apiId)?.fixLink,
            fixLabel: `Manage ${s.label}`,
          }
        })

        // Add CMS sync check
        const hasCmsData = !!store.apiData['cms-hero']
        syncItems.push({
          id: 'sync-cms',
          label: 'CMS Configuration',
          severity: hasCmsData ? 'ok' : 'info',
          detail: hasCmsData ? 'CMS sections accessible from API · Frontend using configured content' : 'CMS sections empty · Frontend using built-in defaults',
          recommendation: hasCmsData ? undefined : 'Fill in CMS sections via the Home CMS editor for custom website content',
        })

        setItems('sync', syncItems)
      })(),

      // Broken Image Detection
      (async () => {
        const facultyArr = extractArray(store.apiData['faculty'] ?? {}, 'faculty')
        const deptArr    = extractArray(store.apiData['departments'] ?? {}, 'departments')
        const newsArr    = extractArray(store.apiData['news'] ?? {}, 'articles')
        const galleryArr = extractArray(store.apiData['gallery'] ?? {}, null)

        // Faculty photos
        const facultyUrls = extractImageUrls(facultyArr).slice(0, 30)
        let facultyBroken = 0
        if (facultyUrls.length > 0) {
          const results = await Promise.all(facultyUrls.map(url => checkImageLoad(url, 4000)))
          facultyBroken = results.filter(ok => !ok).length
        }
        const facultyNoUrl = facultyArr.filter(f =>
          !f.photo_url && !f.image_url && !f.file_id && !f.photo_file_id
        ).length

        // Department images
        const deptUrls = extractImageUrls(deptArr).slice(0, 20)
        let deptBroken = 0
        if (deptUrls.length > 0) {
          const results = await Promise.all(deptUrls.map(url => checkImageLoad(url, 4000)))
          deptBroken = results.filter(ok => !ok).length
        }
        const deptNoUrl = deptArr.filter(d =>
          !d.cover_image && !d.image_url && !d.cover_file_id
        ).length

        // News cover images
        const newsUrls = extractImageUrls(newsArr).slice(0, 20)
        let newsBroken = 0
        if (newsUrls.length > 0) {
          const results = await Promise.all(newsUrls.map(url => checkImageLoad(url, 4000)))
          newsBroken = results.filter(ok => !ok).length
        }
        const newsNoUrl = newsArr.filter(n =>
          !n.cover_img_url && !n.image_url && !n.cover_image
        ).length

        // Gallery covers
        const galleryUrls = extractImageUrls(galleryArr).slice(0, 15)
        let galleryBroken = 0
        if (galleryUrls.length > 0) {
          const results = await Promise.all(galleryUrls.map(url => checkImageLoad(url, 4000)))
          galleryBroken = results.filter(ok => !ok).length
        }
        const galleryNoCover = galleryArr.filter(a =>
          !a.cover_image && !a.cover_file_id && !a.thumbnail_url
        ).length

        const totalChecked = facultyUrls.length + deptUrls.length + newsUrls.length + galleryUrls.length
        const totalBroken  = facultyBroken + deptBroken + newsBroken + galleryBroken
        const totalMissing = facultyNoUrl + deptNoUrl + newsNoUrl + galleryNoCover

        setItems('images', [
          {
            id: 'img-faculty',
            label: 'Faculty Profile Photos',
            severity: facultyNoUrl > 5 ? 'warning' : facultyBroken > 0 ? 'warning' : 'ok',
            detail: facultyArr.length === 0
              ? 'No faculty records to check'
              : `${facultyUrls.length} URLs checked · ${facultyBroken} broken · ${facultyNoUrl} missing profile photos out of ${facultyArr.length} faculty`,
            value: facultyBroken + facultyNoUrl,
            fixLink: '/dashboard/central-admin/faculty', fixLabel: 'Update Faculty Photos',
            recommendation: facultyNoUrl > 0 ? `Upload profile images for ${facultyNoUrl} faculty member${facultyNoUrl > 1 ? 's' : ''} via Faculty CMS` : undefined,
          },
          {
            id: 'img-dept',
            label: 'Department Cover Images',
            severity: deptNoUrl > 0 ? 'warning' : deptBroken > 0 ? 'warning' : 'ok',
            detail: deptArr.length === 0
              ? 'No department records to check'
              : `${deptUrls.length} URLs checked · ${deptBroken} broken · ${deptNoUrl} departments missing cover images out of ${deptArr.length}`,
            value: deptBroken + deptNoUrl,
            fixLink: '/dashboard/central-admin/departments', fixLabel: 'Update Departments',
            recommendation: deptNoUrl > 0 ? `Upload cover images for ${deptNoUrl} department${deptNoUrl > 1 ? 's' : ''} via Departments CMS` : undefined,
          },
          {
            id: 'img-news',
            label: 'News Article Cover Images',
            severity: newsNoUrl > 3 ? 'info' : newsBroken > 0 ? 'warning' : 'ok',
            detail: newsArr.length === 0
              ? 'No news articles to check'
              : `${newsUrls.length} URLs checked · ${newsBroken} broken · ${newsNoUrl} articles missing cover images out of ${newsArr.length}`,
            value: newsBroken + newsNoUrl,
            fixLink: '/dashboard/central-admin/news', fixLabel: 'Edit News',
            recommendation: newsNoUrl > 0 ? `Add cover images to ${newsNoUrl} news article${newsNoUrl > 1 ? 's' : ''} for better visual presentation` : undefined,
          },
          {
            id: 'img-gallery',
            label: 'Gallery Album Covers',
            severity: galleryNoCover > 0 ? 'info' : galleryBroken > 0 ? 'warning' : 'ok',
            detail: galleryArr.length === 0
              ? 'No gallery albums to check'
              : `${galleryUrls.length} URLs checked · ${galleryBroken} broken · ${galleryNoCover} albums missing covers out of ${galleryArr.length}`,
            value: galleryBroken + galleryNoCover,
            fixLink: '/dashboard/central-admin/gallery', fixLabel: 'Manage Gallery',
          },
          {
            id: 'img-summary',
            label: 'Image Health Summary',
            severity: totalBroken > 0 ? 'warning' : totalMissing > 10 ? 'warning' : 'ok',
            detail: totalChecked === 0
              ? 'No image URLs found in API responses to probe'
              : `${totalChecked} images probed · ${totalBroken} broken URLs · ${totalMissing} missing (no URL set)`,
            value: totalBroken,
          },
        ])
      })(),

      // SEO Health
      (async () => {
        const s = store.settings ?? {}
        const siteName    = s.siteName as string | undefined
        const tagline     = s.tagline as string | undefined
        const contactEmail = s.contactEmail as string | undefined
        const contactPhone = s.contactPhone as string | undefined
        const dirName     = s.directorName as string | undefined
        const socialLinks = s.socialLinks as Record<string, unknown> | undefined
        const socialCount = socialLinks ? Object.values(socialLinks).filter(Boolean).length : 0
        const maintenanceMode = !!s.maintenanceMode

        // Check homepage SEO CMS key
        let homeSeoData: Record<string, unknown> | null = null
        try {
          const res = await apiClient.get('/v1/settings/cms/home.seo')
          homeSeoData = ((res.data as Record<string, unknown>).data as Record<string, unknown>) ?? null
        } catch { /* ignore */ }

        const hasHomeSeo = homeSeoData && Object.keys(homeSeoData).length > 0

        setItems('seo', [
          {
            id: 'seo-sitename',
            label: 'Site Name',
            severity: siteName ? 'ok' : 'warning',
            detail: siteName
              ? `"${siteName}" — shown in browser title and meta tags across all pages`
              : 'Site name not configured — affects all page titles and SEO',
            fixLink: '/dashboard/central-admin/settings', fixLabel: 'Update Settings',
            recommendation: 'Set the site name in Admin Settings for proper SEO and branding',
          },
          {
            id: 'seo-tagline',
            label: 'Site Tagline / Description',
            severity: tagline ? 'ok' : 'warning',
            detail: tagline
              ? `"${tagline}" — used as meta description on homepage`
              : 'Tagline not configured — homepage meta description will be blank',
            fixLink: '/dashboard/central-admin/settings', fixLabel: 'Update Settings',
            recommendation: 'Add a 150–160 character tagline that describes the institute for search engines',
          },
          {
            id: 'seo-homepage',
            label: 'Homepage SEO Meta (CMS)',
            severity: hasHomeSeo ? 'ok' : 'warning',
            detail: hasHomeSeo
              ? 'Homepage SEO section configured in CMS — custom title, description, and OG tags active'
              : 'Homepage SEO not configured in CMS — search engines see empty meta tags',
            fixLink: '/dashboard/central-admin/home-cms', fixLabel: 'Edit Homepage CMS',
            recommendation: 'Open Homepage CMS → SEO section and fill in title, description, and Open Graph tags',
          },
          {
            id: 'seo-contact',
            label: 'Contact Information',
            severity: contactEmail && contactPhone ? 'ok' : contactEmail ? 'info' : 'warning',
            detail: contactEmail
              ? `Email: ${contactEmail} · Phone: ${contactPhone || 'not set'} — used on Contact page`
              : 'Contact email not set — Contact Us page will show blank',
            fixLink: '/dashboard/central-admin/settings', fixLabel: 'Update Settings',
            recommendation: 'Add contact email and phone in Admin Settings for the Contact Us page',
          },
          {
            id: 'seo-director',
            label: 'Director Information',
            severity: dirName ? 'ok' : 'info',
            detail: dirName
              ? `Director: ${dirName} — appears on Director's Message page`
              : "Director name not set — Director's Message will show placeholder",
            fixLink: '/dashboard/central-admin/settings', fixLabel: 'Update Settings',
          },
          {
            id: 'seo-social',
            label: 'Social Media Links',
            severity: socialCount >= 3 ? 'ok' : socialCount > 0 ? 'info' : 'warning',
            detail: socialCount > 0
              ? `${socialCount} social platform${socialCount !== 1 ? 's' : ''} linked — shown in footer and Open Graph`
              : 'No social media links configured — affects social sharing previews',
            fixLink: '/dashboard/central-admin/settings', fixLabel: 'Add Social Links',
            recommendation: 'Add Facebook, Twitter/X, and LinkedIn links in Admin Settings for better SEO signals',
          },
          {
            id: 'seo-maintenance',
            label: 'Maintenance Mode',
            severity: maintenanceMode ? 'critical' : 'ok',
            detail: maintenanceMode
              ? 'MAINTENANCE MODE IS ON — website is inaccessible to public visitors!'
              : 'Site is publicly accessible — maintenance mode off',
            fixLink: '/dashboard/central-admin/settings', fixLabel: 'Disable Maintenance',
            recommendation: maintenanceMode ? 'Turn off maintenance mode in Admin Settings immediately to restore public access' : undefined,
          },
          {
            id: 'seo-structured',
            label: 'Structured Data (Schema.org)',
            severity: 'info',
            detail: 'Structured data is rendered server-side. Verify using Google Rich Results Test for Organization and BreadcrumbList schemas.',
          },
        ])
      })(),

      // Security Health
      (async () => {
        const secItems: CheckItem[] = []

        // JWT presence
        let hasToken = false
        try {
          const stored = localStorage.getItem('sgsits-admin-auth')
          if (stored) {
            const parsed = JSON.parse(stored)
            hasToken = !!(parsed?.state?.token)
          }
        } catch { /* ignore */ }

        secItems.push({
          id: 'sec-jwt',
          label: 'Admin JWT Token',
          severity: hasToken ? 'ok' : 'warning',
          detail: hasToken
            ? 'JWT token present in localStorage — admin session active'
            : 'No JWT token found — you may not be logged in or session expired',
          recommendation: hasToken ? undefined : 'Log out and log back in to refresh the admin session token',
        })

        // Test unauthenticated access to protected endpoint
        try {
          const rawAxios = axios.create({
            baseURL: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8000/api',
            timeout: 5000,
          })
          const res = await rawAxios.get('/v1/users', { validateStatus: () => true })
          secItems.push({
            id: 'sec-auth',
            label: 'Admin Route Protection',
            severity: res.status === 401 ? 'ok' : 'critical',
            detail: res.status === 401
              ? 'Protected routes correctly return 401 for unauthenticated requests'
              : `Protected endpoint returned ${res.status} without auth — routes may be unprotected!`,
            endpoint: 'GET /v1/users (no auth)',
            recommendation: res.status !== 401 ? 'Apply auth.middleware to all admin API routes in the Express router' : undefined,
          })
        } catch {
          secItems.push({
            id: 'sec-auth',
            label: 'Admin Route Protection',
            severity: 'info',
            detail: 'Could not test unauthenticated access — backend may have strict CORS blocking cross-origin tests',
          })
        }

        // CORS headers check
        const corsOrigin = store.responseHeaders['access-control-allow-origin']
        secItems.push({
          id: 'sec-cors',
          label: 'CORS Configuration',
          severity: corsOrigin ? (corsOrigin === '*' ? 'warning' : 'ok') : 'info',
          detail: corsOrigin
            ? corsOrigin === '*'
              ? 'CORS allows all origins (*) — consider restricting to your frontend domain in production'
              : `CORS restricted to: ${corsOrigin}`
            : 'CORS header not detected — verify CORS is configured in Express',
          recommendation: corsOrigin === '*' ? 'In backend .env, set CORS_ORIGIN to your production domain instead of wildcard *' : undefined,
        })

        // Security response headers
        const xct = store.responseHeaders['x-content-type-options']
        const xframe = store.responseHeaders['x-frame-options']
        secItems.push({
          id: 'sec-headers',
          label: 'Security Response Headers',
          severity: xct && xframe ? 'ok' : 'warning',
          detail: [
            `X-Content-Type-Options: ${xct || 'missing'}`,
            `X-Frame-Options: ${xframe || 'missing'}`,
          ].join(' · '),
          recommendation: !xct || !xframe ? 'Add helmet.js to Express: npm install helmet && app.use(helmet()) for automatic security headers' : undefined,
        })

        // Maintenance mode security
        const maintenanceMode = !!(store.settings?.maintenanceMode)
        secItems.push({
          id: 'sec-maintenance',
          label: 'Public Access Status',
          severity: maintenanceMode ? 'critical' : 'ok',
          detail: maintenanceMode
            ? 'Site is in MAINTENANCE MODE — all public routes are blocked!'
            : 'Website is publicly accessible',
          fixLink: '/dashboard/central-admin/settings', fixLabel: 'Manage Settings',
        })

        // HTTPS check
        const isHttps = window.location.protocol === 'https:'
        secItems.push({
          id: 'sec-https',
          label: 'Secure Transport (HTTPS)',
          severity: isHttps ? 'ok' : 'info',
          detail: isHttps
            ? 'Running over HTTPS — data in transit is encrypted'
            : 'Running over HTTP — use HTTPS in production for security and SEO',
          recommendation: !isHttps ? 'Configure SSL certificate (Let\'s Encrypt is free) and enable HTTPS on your server for production' : undefined,
        })

        // File upload validation check (informational)
        secItems.push({
          id: 'sec-uploads',
          label: 'File Upload Validation',
          severity: 'info',
          detail: 'Backend uses Multer with file type filtering. Verify allowedMimeTypes and maxFileSize in upload middleware configuration.',
        })

        setItems('security', secItems)
      })(),

      // Performance Health
      (async () => {
        const allTimings = Object.entries(store.timings)
          .filter(([, ms]) => ms > 0)
          .sort(([, a], [, b]) => b - a)

        if (allTimings.length === 0) {
          setItems('performance', [{
            id: 'perf-no-data',
            label: 'No timing data',
            detail: 'Performance metrics unavailable — run the scan with backend connected',
            severity: 'info',
          }])
          return
        }

        const avgMs = Math.round(allTimings.reduce((s, [,ms]) => s + ms, 0) / allTimings.length)
        const slowApis = allTimings.filter(([, ms]) => ms > 500)
        const critApis = allTimings.filter(([, ms]) => ms > 1000)
        const [fastestId, fastestMs] = allTimings[allTimings.length - 1]
        const [slowestId, slowestMs] = allTimings[0]

        setItems('performance', [
          {
            id: 'perf-avg',
            label: 'Average API Response Time',
            severity: avgMs < 300 ? 'ok' : avgMs < 700 ? 'warning' : 'critical',
            detail: `${avgMs}ms average across ${allTimings.length} API calls`,
            timing: avgMs,
          },
          {
            id: 'perf-fastest',
            label: 'Fastest Endpoint',
            severity: 'ok',
            detail: `${fastestId} responded in ${fastestMs}ms`,
            timing: fastestMs,
          },
          {
            id: 'perf-slowest',
            label: 'Slowest Endpoint',
            severity: timingSev(slowestMs),
            detail: `${slowestId} responded in ${slowestMs}ms ${slowestMs > 1000 ? '— investigate query performance' : ''}`,
            timing: slowestMs,
            recommendation: slowestMs > 1000 ? `Add MySQL index on the ${slowestId} table's common query columns, or add pagination` : undefined,
          },
          {
            id: 'perf-slow-count',
            label: 'Slow APIs (> 500ms)',
            severity: critApis.length > 0 ? 'critical' : slowApis.length > 2 ? 'warning' : slowApis.length > 0 ? 'info' : 'ok',
            detail: slowApis.length === 0
              ? 'All APIs responding under 500ms — excellent performance'
              : `${slowApis.length} API${slowApis.length > 1 ? 's' : ''} over 500ms: ${slowApis.map(([id]) => id).join(', ')}`,
            value: slowApis.length,
            recommendation: slowApis.length > 0 ? 'Add database indexes, use LIMIT in queries, and consider Redis caching for slow endpoints' : undefined,
          },
          {
            id: 'perf-critical',
            label: 'Critical APIs (> 1000ms)',
            severity: critApis.length > 0 ? 'critical' : 'ok',
            detail: critApis.length === 0
              ? 'No APIs exceeding 1 second threshold'
              : `${critApis.length} API${critApis.length > 1 ? 's' : ''} critically slow: ${critApis.map(([id, ms]) => `${id}(${ms}ms)`).join(', ')}`,
            value: critApis.length,
            recommendation: critApis.length > 0 ? 'These endpoints will cause page timeouts. Add EXPLAIN to slow MySQL queries and optimize.' : undefined,
          },
          {
            id: 'perf-overview',
            label: 'Performance Rating',
            severity: avgMs < 200 ? 'ok' : avgMs < 500 ? 'info' : avgMs < 800 ? 'warning' : 'critical',
            detail: avgMs < 200 ? 'Excellent — all APIs blazing fast'
              : avgMs < 500 ? 'Good — API responses within acceptable range'
              : avgMs < 800 ? 'Fair — some APIs slow, consider optimizing'
              : 'Poor — significant performance issues detected',
            timing: avgMs,
          },
        ])
      })(),

      // Route Integrity
      (async () => {
        const deptArr    = extractArray(store.apiData['departments'] ?? {}, 'departments')
        const newsArr    = extractArray(store.apiData['news'] ?? {}, 'articles')
        const galleryArr = extractArray(store.apiData['gallery'] ?? {}, null)
        const facultyArr = extractArray(store.apiData['faculty'] ?? {}, 'faculty')

        const routeItems: CheckItem[] = []

        // Departments slug check
        const deptSlugs = deptArr.map(d => d.slug as string).filter(Boolean)
        const uniqueSlugs = new Set(deptSlugs)
        const deptMissingSlug = deptArr.filter(d => !d.slug).length
        const deptDupSlugs = deptSlugs.length - uniqueSlugs.size

        routeItems.push({
          id: 'route-dept-slugs',
          label: 'Department Slugs',
          severity: deptMissingSlug > 0 ? 'critical' : deptDupSlugs > 0 ? 'warning' : 'ok',
          detail: deptArr.length === 0
            ? 'No departments found — add departments to enable /departments/:slug routes'
            : deptMissingSlug > 0
              ? `${deptMissingSlug} department${deptMissingSlug > 1 ? 's' : ''} missing slug — /departments/:slug routes will 404`
              : deptDupSlugs > 0
                ? `${deptDupSlugs} duplicate slug${deptDupSlugs > 1 ? 's' : ''} found — routing conflicts possible`
                : `${deptArr.length} departments with unique slugs — all /departments/:slug routes valid`,
          value: deptArr.length,
          fixLink: '/dashboard/central-admin/departments', fixLabel: 'Fix Department Slugs',
          recommendation: deptMissingSlug > 0 ? 'Edit each department in Departments CMS and add a URL-safe slug (e.g., computer-science)' : undefined,
        })

        // News ID check
        const newsWithIds = newsArr.filter(n => n.id || n._id).length
        routeItems.push({
          id: 'route-news-ids',
          label: 'News Article Routes',
          severity: newsArr.length > 0 && newsWithIds < newsArr.length ? 'warning' : 'ok',
          detail: newsArr.length === 0
            ? 'No news articles — /news/:id routes have no content'
            : `${newsWithIds} of ${newsArr.length} news articles have IDs — /news/:id routes accessible`,
          value: newsArr.length,
          fixLink: '/dashboard/central-admin/news', fixLabel: 'Manage News',
        })

        // Gallery slug check
        routeItems.push({
          id: 'route-gallery',
          label: 'Gallery Album Routes',
          severity: 'ok',
          detail: galleryArr.length === 0
            ? 'No gallery albums — /explore/gallery/:albumSlug routes have no content'
            : `${galleryArr.length} album${galleryArr.length !== 1 ? 's' : ''} with accessible routes`,
          value: galleryArr.length,
          fixLink: '/dashboard/central-admin/gallery', fixLabel: 'Manage Gallery',
        })

        // Faculty profile routes
        const facultyWithIds = facultyArr.filter(f => f.id || f._id || f.user_id).length
        routeItems.push({
          id: 'route-faculty',
          label: 'Faculty Profile Routes',
          severity: facultyArr.length > 0 && facultyWithIds < facultyArr.length ? 'warning' : 'ok',
          detail: facultyArr.length === 0
            ? 'No faculty records — /faculty/:id routes have no content'
            : `${facultyWithIds} of ${facultyArr.length} faculty have IDs — profile routes accessible`,
          value: facultyArr.length,
        })

        // Check for URL-safe slugs (no spaces, special chars)
        const badSlugs = deptSlugs.filter(s => /[^a-z0-9-_]/.test(s))
        routeItems.push({
          id: 'route-slug-format',
          label: 'Slug Format Validation',
          severity: badSlugs.length > 0 ? 'warning' : 'ok',
          detail: badSlugs.length > 0
            ? `${badSlugs.length} slug${badSlugs.length > 1 ? 's' : ''} contain invalid characters: ${badSlugs.slice(0,3).join(', ')}`
            : 'All department slugs use valid URL-safe format (lowercase, hyphens)',
          recommendation: badSlugs.length > 0 ? 'Slugs should only contain lowercase letters, numbers, and hyphens (e.g., computer-science)' : undefined,
        })

        // 404 route check (static routes from router)
        routeItems.push({
          id: 'route-404',
          label: '404 Error Page',
          severity: 'ok',
          detail: 'Custom 404 page (NotFound component) is configured in the router — invalid routes show branded error page',
        })

        // Static pages availability
        const staticOk = store.backendUp
        routeItems.push({
          id: 'route-static',
          label: 'Static Content Pages',
          severity: staticOk ? 'ok' : 'warning',
          detail: staticOk
            ? 'Static pages (Facilities, Students, Policy) accessible — no API dependency'
            : 'Backend down — static pages may partially fail if they load dynamic data',
        })

        // Dynamic fallback routes
        routeItems.push({
          id: 'route-custom',
          label: 'CMS Custom Page Routes',
          severity: 'info',
          detail: 'Custom CMS pages (/about/:customPath, /admission/:customPath) fall through to CMS page renderer — verify each custom page has content in Static Pages CMS',
          fixLink: '/dashboard/central-admin/pages', fixLabel: 'Manage Static Pages',
        })

        setItems('routes', routeItems)
      })(),

    ])

    setProgress('')
    setRunning(false)
    setLastRun(new Date())
  }

  useEffect(() => { runHealthCheck() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Regenerate recommendations whenever the scan finishes
  useEffect(() => {
    if (!running) setRecs(generateRecommendations(cats))
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived state ─────────────────────────────────────────────────────────
  const score      = calcOverall(cats)
  const { grade, color: gradeColor, ring: gradeRing } = gradeInfo(score)
  const allItems   = cats.flatMap(c => c.items)
  const loadingAny = allItems.some(i => i.severity === 'loading')
  const critCount  = allItems.filter(i => i.severity === 'critical').length
  const warnCount  = allItems.filter(i => i.severity === 'warning').length
  const okCount    = allItems.filter(i => i.severity === 'ok' || i.severity === 'info').length
  const totalDone  = allItems.filter(i => i.severity !== 'loading').length
  const overallOk  = !loadingAny && critCount === 0 && warnCount === 0
  const progressPct = loadingAny ? Math.round((totalDone / allItems.length) * 100) : 100

  const tabCats = (tab: TabId) => cats.filter(c => c.tab === tab)

  // ── Tabs config ───────────────────────────────────────────────────────────
  const TABS: { id: TabId; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'overview',     label: 'Overview',       icon: BarChart2 },
    { id: 'infra',        label: 'Infrastructure', icon: Server    },
    { id: 'database',     label: 'Database',       icon: Database  },
    { id: 'api',          label: 'APIs',           icon: Wifi      },
    { id: 'pages',        label: 'Pages',          icon: Layout    },
    { id: 'sync',         label: 'Sync',           icon: GitBranch },
    { id: 'cms',          label: 'CMS',            icon: Globe     },
    { id: 'images',       label: 'Images',         icon: Camera    },
    { id: 'seo',          label: 'SEO',            icon: Search    },
    { id: 'security',     label: 'Security',       icon: Shield    },
    { id: 'performance',  label: 'Performance',    icon: Zap       },
    { id: 'routes',       label: 'Routes',         icon: Map       },
    { id: 'fixes',        label: 'Fix Guide',      icon: Wrench    },
  ]

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-10">

      {/* ── Title Bar ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            <h2 className="font-display text-2xl font-bold text-slate-800">Website Operations Center</h2>
            {!loadingAny && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ml-1 ${
                overallOk ? 'bg-green-50 border-green-300 text-green-700' :
                critCount > 0 ? 'bg-red-50 border-red-300 text-red-700' :
                'bg-amber-50 border-amber-300 text-amber-700'
              }`}>
                {overallOk ? 'ALL SYSTEMS HEALTHY' : critCount > 0 ? 'CRITICAL ISSUES' : 'WARNINGS DETECTED'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Full-stack integrity check — Infrastructure · Database · APIs · Pages · CMS · Images · SEO · Security · Performance · Routes
            {lastRun && (
              <span className="ml-2 text-slate-400">
                Last scan: {lastRun.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!running && lastRun && (
            <button
              onClick={() => downloadReport(cats, score, lastRun)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded hover:bg-slate-100 transition-colors"
            >
              <Download size={13} />Export
            </button>
          )}
          <button
            onClick={runHealthCheck}
            disabled={running}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded shadow-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {running
              ? <><Loader2 size={14} className="animate-spin" />Scanning…</>
              : <><RefreshCw size={14} />Run Full Scan</>}
          </button>
        </div>
      </div>

      {/* ── Score Banner ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-6">
          <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${gradeRing}`}>
            <span className={`text-2xl font-extrabold leading-none ${gradeColor}`}>{score}</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest">/ 100</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 mb-2">
              <span className={`text-4xl font-display font-black ${gradeColor}`}>{grade}</span>
              <span className="text-sm font-medium text-slate-500">
                {score >= 90 ? 'Excellent' : score >= 75 ? 'Good' : score >= 60 ? 'Fair' : score >= 40 ? 'Poor' : 'Critical'}
              </span>
              <span className="text-xs text-slate-400">{totalDone} checks completed</span>
            </div>
            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  score >= 85 ? 'bg-green-500' : score >= 65 ? 'bg-amber-400' : 'bg-red-500'
                }`}
                style={{ width: `${loadingAny ? 0 : score}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">{score}% of checks passing</p>
          </div>
          <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
            {[
              { label: 'Critical', count: critCount, cls: 'bg-red-50 border-red-200 text-red-700' },
              { label: 'Warnings', count: warnCount, cls: 'bg-amber-50 border-amber-200 text-amber-700' },
              { label: 'Passing',  count: okCount,   cls: 'bg-green-50 border-green-200 text-green-700' },
            ].map(({ label, count, cls }) => (
              <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${cls}`}>
                <span className="text-base font-extrabold w-6 text-right">{count}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {running && (
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Loader2 size={12} className="animate-spin" />{progress}
              </span>
              <span className="font-bold">{progressPct}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* ── Overall status banner ──────────────────────────────────────── */}
      {!loadingAny && (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-lg border text-sm font-semibold ${
          overallOk ? 'bg-green-50 border-green-200 text-green-800' :
          critCount > 0 ? 'bg-red-50 border-red-200 text-red-800' :
          'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {overallOk
            ? <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            : critCount > 0
              ? <AlertOctagon size={18} className="text-red-600 shrink-0" />
              : <AlertTriangle size={18} className="text-amber-600 shrink-0" />}
          {overallOk
            ? 'All systems healthy — website is operating at full capacity.'
            : critCount > 0
              ? `${critCount} critical issue${critCount > 1 ? 's' : ''} detected${warnCount > 0 ? ` + ${warnCount} warning${warnCount > 1 ? 's' : ''}` : ''} — review tabs below.`
              : `${warnCount} warning${warnCount > 1 ? 's' : ''} detected — review tabs below for details.`}
          {!overallOk && (
            <button
              onClick={() => setActiveTab('fixes')}
              className="ml-auto flex items-center gap-1 text-xs font-bold underline underline-offset-2"
            >
              View Fix Guide <ArrowRight size={12} />
            </button>
          )}
        </div>
      )}

      {/* ── Tab navigation ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(tab => {
          const TabIcon = tab.icon
          const tabCriticals = tabCats(tab.id).flatMap(c => c.items).filter(i => i.severity === 'critical').length
          const tabWarnings  = tabCats(tab.id).flatMap(c => c.items).filter(i => i.severity === 'warning').length
          const tabLoading   = tabCats(tab.id).some(c => c.loading)
          const isActive     = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <TabIcon size={12} />
              {tab.label}
              {tab.id !== 'overview' && tab.id !== 'fixes' && (
                tabLoading ? <Loader2 size={10} className="animate-spin opacity-60" /> :
                tabCriticals > 0 ? <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">{tabCriticals}</span> :
                tabWarnings  > 0 ? <span className="w-4 h-4 rounded-full bg-amber-400 text-white text-[9px] font-black flex items-center justify-center">{tabWarnings}</span> :
                !tabLoading ? <span className="w-3 h-3 rounded-full bg-green-400" /> : null
              )}
              {tab.id === 'fixes' && recs.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">{recs.length}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── OVERVIEW TAB ──────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Domain score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DOMAIN_CARDS.map(domain => {
              const DomainIcon = domain.icon
              const s = domainScore(cats, domain.catIds)
              const { grade: dg, color: dc, bg: dbg } = gradeInfo(s)
              const dLoading = cats.filter(c => domain.catIds.includes(c.id)).some(c => c.loading)
              const dCrit = cats.filter(c => domain.catIds.includes(c.id)).flatMap(c => c.items).filter(i => i.severity === 'critical').length
              const dWarn = cats.filter(c => domain.catIds.includes(c.id)).flatMap(c => c.items).filter(i => i.severity === 'warning').length
              return (
                <div key={domain.label} className={`${dbg} border border-slate-200 rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <DomainIcon size={14} className="text-slate-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">{domain.label}</span>
                  </div>
                  {dLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin text-slate-400" />
                      <span className="text-xs text-slate-400">Scanning…</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-2xl font-extrabold ${dc}`}>{s}</span>
                        <span className="text-xs text-slate-400">/100</span>
                        <span className={`text-sm font-bold ml-auto ${dc}`}>{dg}</span>
                      </div>
                      {(dCrit > 0 || dWarn > 0) ? (
                        <p className="text-[10px] mt-1 text-slate-500">
                          {dCrit > 0 && <span className="text-red-600 font-bold">{dCrit} critical </span>}
                          {dWarn > 0 && <span className="text-amber-600 font-bold">{dWarn} warning{dWarn > 1 ? 's' : ''}</span>}
                        </p>
                      ) : (
                        <p className="text-[10px] mt-1 text-green-600 font-semibold">All OK</p>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* Top issues */}
          {!loadingAny && (critCount > 0 || warnCount > 0) && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <AlertOctagon size={14} className="text-red-500" />
                <span className="text-sm font-bold text-slate-700">Top Issues Requiring Attention</span>
              </div>
              <div className="divide-y divide-slate-50">
                {allItems
                  .filter(i => i.severity === 'critical' || i.severity === 'warning')
                  .slice(0, 10)
                  .map(item => (
                    <div key={item.id} className="flex items-start gap-3 px-5 py-3">
                      <SevIcon sev={item.severity} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-slate-700">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{item.detail}</p>
                      </div>
                      {item.fixLink && (
                        <Link to={item.fixLink} className="text-[11px] font-bold text-primary underline underline-offset-2 shrink-0">
                          {item.fixLabel ?? 'Fix →'}
                        </Link>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* All-green banner */}
          {!loadingAny && overallOk && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-green-800 font-bold text-lg">All {totalDone} checks passed</p>
              <p className="text-green-600 text-sm mt-1">The SGSITS website platform is operating at full capacity.</p>
            </div>
          )}

          {/* Architecture diagram */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-accent" />
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Data Flow Architecture</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 flex-wrap">
              {['MySQL Database', 'Express API', 'CMS Settings', 'React Frontend', 'Public Users'].map((node, i, arr) => (
                <React.Fragment key={node}>
                  <span className="bg-white border border-slate-200 rounded px-2 py-1 text-xs">{node}</span>
                  {i < arr.length - 1 && <ArrowRight size={14} className="text-slate-400 shrink-0" />}
                </React.Fragment>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-4 text-xs text-slate-500">
              <p>CMS content stored as JSON in <code className="bg-slate-200 px-1 rounded">cms_sections</code> MySQL table.</p>
              <p>Files served from <code className="bg-slate-200 px-1 rounded">backend/uploads/&#123;usage&#125;/&#123;filename&#125;</code></p>
              <p>JWT auth: token stored in localStorage, expires per <code className="bg-slate-200 px-1 rounded">JWT_EXPIRES_IN</code></p>
              <p>Public APIs return only <code className="bg-slate-200 px-1 rounded">PUBLISHED/ACTIVE</code> records — never drafts.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── CATEGORY TABS (infra, database, api, pages, sync, cms, images, seo, security, performance, routes) ── */}
      {activeTab !== 'overview' && activeTab !== 'fixes' && (
        <div className="space-y-4">
          {tabCats(activeTab).map(cat => (
            <CategoryPanel
              key={cat.id}
              cat={cat}
              open={!collapsed[cat.id]}
              onToggle={() => toggle(cat.id)}
            />
          ))}
          {tabCats(activeTab).length === 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
              <Info size={24} className="mx-auto mb-2" />
              <p className="text-sm">No checks in this tab yet. Run a scan first.</p>
            </div>
          )}
        </div>
      )}

      {/* ── FIX GUIDE TAB ─────────────────────────────────────────────── */}
      {activeTab === 'fixes' && (
        <div className="space-y-4">
          {recs.length === 0 && !loadingAny ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2" />
              <p className="text-green-800 font-bold text-lg">No issues found!</p>
              <p className="text-green-600 text-sm mt-1">All checks passed. Nothing to fix.</p>
            </div>
          ) : loadingAny ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto mb-2" />
              <p className="text-sm">Scan in progress — Fix Guide will appear when complete.</p>
            </div>
          ) : (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Wrench size={16} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Auto-Fix Recommendations</p>
                  <p className="text-xs text-amber-700 mt-0.5">{recs.length} issue{recs.length !== 1 ? 's' : ''} detected — prioritize critical issues first, then warnings.</p>
                </div>
              </div>

              {/* Critical fixes */}
              {recs.filter(r => r.severity === 'critical').length > 0 && (
                <div className="bg-white border border-red-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
                    <XCircle size={14} className="text-red-600" />
                    <span className="text-sm font-bold text-red-800">
                      Critical ({recs.filter(r => r.severity === 'critical').length})
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {recs.filter(r => r.severity === 'critical').map(rec => (
                      <div key={rec.id} className="px-5 py-4 bg-red-50/30">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-slate-800">{rec.problem}</p>
                            <p className="text-[11px] text-red-600 font-semibold mt-0.5">{rec.category}</p>
                            <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg">
                              <p className="text-xs font-bold text-slate-600 mb-1">Fix:</p>
                              <p className="text-xs text-slate-700 leading-relaxed">{rec.fix}</p>
                            </div>
                          </div>
                          {rec.fixLink && (
                            <Link
                              to={rec.fixLink}
                              className="shrink-0 inline-flex items-center gap-1 px-3 py-2 bg-primary text-white text-xs font-bold rounded hover:bg-primary/90 transition-colors"
                            >
                              {rec.fixLabel ?? 'Fix →'}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning fixes */}
              {recs.filter(r => r.severity === 'warning').length > 0 && (
                <div className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="px-5 py-3 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
                    <AlertTriangle size={14} className="text-amber-600" />
                    <span className="text-sm font-bold text-amber-800">
                      Warnings ({recs.filter(r => r.severity === 'warning').length})
                    </span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {recs.filter(r => r.severity === 'warning').map(rec => (
                      <div key={rec.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-bold text-slate-800">{rec.problem}</p>
                            <p className="text-[11px] text-amber-600 font-semibold mt-0.5">{rec.category}</p>
                            <div className="mt-2 p-3 bg-amber-50/50 border border-amber-100 rounded-lg">
                              <p className="text-xs font-bold text-slate-600 mb-1">Fix:</p>
                              <p className="text-xs text-slate-700 leading-relaxed">{rec.fix}</p>
                            </div>
                          </div>
                          {rec.fixLink && (
                            <Link
                              to={rec.fixLink}
                              className="shrink-0 inline-flex items-center gap-1 px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded hover:bg-amber-600 transition-colors"
                            >
                              {rec.fixLabel ?? 'Fix →'}
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Legend ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
        {([
          { sev: 'ok'       as Severity, label: 'OK' },
          { sev: 'warning'  as Severity, label: 'Warning' },
          { sev: 'critical' as Severity, label: 'Critical' },
          { sev: 'info'     as Severity, label: 'Info' },
        ]).map(({ sev, label }) => (
          <div key={sev} className="flex items-center gap-1.5">
            <SevIcon sev={sev} />
            <span className="text-[11px] text-slate-500">{label}</span>
          </div>
        ))}
        <span className="ml-auto text-[10px] text-slate-400">SGSITS Website Operations Center v2</span>
      </div>
    </div>
  )
}

export default AdminCmsHealth
