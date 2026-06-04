import React, {
  useState, useRef, useEffect, useCallback, useMemo
} from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Search, X, FileText, BookOpen, Bell, Newspaper, Calendar,
  Building2, GraduationCap, Briefcase, ChevronRight, Loader2,
  Image as ImageIcon
} from 'lucide-react'
import apiClient from '../../../api/client'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiResult {
  id: number
  title: string
  description?: string
  type: string
  url: string
  category?: string
  date?: string
  score?: number
  isPDF?: boolean
  filename?: string
  fileUrl?: string
  snippet?: string
}

interface GroupedResults {
  announcements?: ApiResult[]
  notices?: ApiResult[]
  news?: ApiResult[]
  events?: ApiResult[]
  documents?: ApiResult[]
  faculty?: ApiResult[]
  departments?: ApiResult[]
  pages?: ApiResult[]
  placements?: ApiResult[]
}

// ── Icons per type ────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  page:         BookOpen,
  department:   Building2,
  faculty:      GraduationCap,
  notice:       Bell,
  announcement: Bell,
  news:         Newspaper,
  event:        Calendar,
  document:     FileText,
  pdf:          FileText,
  tender:       FileText,
  placement:    Briefcase,
  gallery:      ImageIcon,
}

const GROUP_LABEL: Record<string, string> = {
  announcements: 'Announcements',
  notices:       'Notices',
  news:          'News',
  events:        'Events',
  documents:     'Documents & PDFs',
  faculty:       'Faculty',
  departments:   'Departments',
  pages:         'Pages',
  placements:    'Placements',
}

// Priority order — most relevant at top
const GROUP_ORDER = [
  'announcements', 'notices', 'events', 'news',
  'documents', 'faculty', 'departments', 'pages', 'placements',
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function totalCount(g: GroupedResults) {
  return Object.values(g).reduce((s, a) => s + (a?.length ?? 0), 0)
}

function allFlat(g: GroupedResults): ApiResult[] {
  return GROUP_ORDER.flatMap(k => (g as any)[k] ?? [])
}

// ── Component ─────────────────────────────────────────────────────────────────

const SearchBar: React.FC<{ dark?: boolean }> = ({ dark = false }) => {
  const navigate  = useNavigate()
  const [query,    setQuery]    = useState('')
  const [open,     setOpen]     = useState(false)
  const [results,  setResults]  = useState<GroupedResults | null>(null)
  const [loading,  setLoading]  = useState(false)
  const [mobile,   setMobile]   = useState(false)   // fullscreen on mobile
  const [active,   setActive]   = useState(-1)
  const inputRef  = useRef<HTMLInputElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── API / fallback search ─────────────────────────────────────────────────

  const doSearch = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) { setResults(null); setActive(-1); return }
    setLoading(true)
    try {
      const res  = await apiClient.get(`/search?q=${encodeURIComponent(trimmed)}&limit=10`)
      const data = res.data?.data
      // Use API results whenever the call succeeds — even total=0 (show empty state)
      // Only fall back to Fuse.js on network/HTTP error
      if (data?.results) {
        setResults(data.results as GroupedResults)
      } else {
        setResults({})
      }
    } catch {
      setResults({})
    } finally {
      setLoading(false)
      setActive(-1)
    }
  }, [])

  // Debounce 280ms
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (query.trim().length < 2) { setResults(null); setLoading(false); return }
    setLoading(true)
    timerRef.current = setTimeout(() => doSearch(query), 280)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [query, doSearch])

  // ── Body scroll lock when side panel is open ────────────────────────────
  // Sets overflow on both <html> and <body> — required for iOS Safari.

  useEffect(() => {
    if (!mobile) return
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [mobile])

  // ── Close on outside click ────────────────────────────────────────────────

  useEffect(() => {
    const h = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', h)
    return () => document.removeEventListener('pointerdown', h)
  }, [])

  // ── Navigate to result ────────────────────────────────────────────────────

  const goTo = useCallback((url: string) => {
    if (!url) return
    if (url.startsWith('http')) {
      window.open(url, '_blank', 'noreferrer')
    } else {
      navigate(url)
    }
    setOpen(false)
    setMobile(false)
    setQuery('')
    setResults(null)
  }, [navigate])

  // ── Side panel close helper ───────────────────────────────────────────────

  const closeSide = useCallback(() => {
    setMobile(false); setQuery(''); setResults(null); setActive(-1)
  }, [])

  // ── Keyboard navigation ───────────────────────────────────────────────────

  const flat = useMemo(() => results ? allFlat(results) : [], [results])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); closeSide(); return }
    if (!results || flat.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); goTo(flat[active].url) }
  }

  // ── Render helpers ────────────────────────────────────────────────────────

  const renderResult = (item: ApiResult, idx: number) => {
    const Icon = TYPE_ICON[item.type] ?? FileText
    const isActive = idx === active
    const hasPDF = item.isPDF || item.type === 'pdf'
    const fileUrl = item.fileUrl || (item.isPDF ? item.url : null)
    const displayDesc = item.description || item.filename || item.snippet

    return (
      <div
        key={`${item.type}-${item.id}-${idx}`}
        className="px-3 py-2 rounded-lg transition-colors"
        style={isActive ? { backgroundColor: 'rgba(11,37,69,0.05)' } : undefined}
        onMouseEnter={() => setActive(idx)}
      >
        <button
          onClick={() => goTo(item.url)}
          className="w-full text-left flex items-start gap-3"
        >
          <Icon size={15} className="shrink-0 mt-0.5 opacity-50 text-primary" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold truncate text-primary">
                {item.title}
              </p>
              {hasPDF && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: 'rgba(191,161,95,0.15)', color: 'var(--color-accent)', border: '1px solid rgba(191,161,95,0.3)' }}
                >
                  📄 PDF
                </span>
              )}
            </div>
            {displayDesc && (
              <p className="text-xs text-slate-500 truncate mt-0.5 leading-relaxed">{displayDesc}</p>
            )}
            {item.filename && item.filename !== item.title && (
              <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">{item.filename}</p>
            )}
            {item.date && (
              <p className="text-xs text-slate-400 mt-0.5">
                {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
          <ChevronRight size={12} className="shrink-0 mt-1 text-slate-300" />
        </button>

        {/* PDF action row */}
        {hasPDF && fileUrl && (
          <div className="flex items-center gap-3 mt-1.5 ml-6">
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-xs font-semibold flex items-center gap-1 transition-colors hover:opacity-80"
              >
              📎 View PDF
            </a>
            <a
              href={fileUrl}
              download
              onClick={e => e.stopPropagation()}
              className="text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              ↓ Download
            </a>
          </div>
        )}
      </div>
    )
  }

  const renderGrouped = () => {
    if (!results) return null
    let flatIdx = 0
    const sections: React.ReactNode[] = []

    for (const key of GROUP_ORDER) {
      const items: ApiResult[] | undefined = (results as any)[key]
      if (!items || items.length === 0) continue
      const startIdx = flatIdx
      flatIdx += items.length

      sections.push(
        <div key={key} className="mb-1">
          <div className="px-4 py-1.5 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {GROUP_LABEL[key]}
            </span>
            <span
              className="text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(191,161,95,0.15)', color: 'var(--color-accent)' }}
            >
              {items.length}
            </span>
          </div>
          {items.map((item, i) => renderResult(item, startIdx + i))}
        </div>
      )
    }
    return sections
  }

  // ── Input field (shared desktop + mobile) ─────────────────────────────────

  const inputField = (autoFocus = false) => (
    <div className="flex items-center gap-2 px-3 py-2"
         style={{ borderBottom: '1px solid rgba(11,37,69,0.08)' }}>
      {loading
        ? <Loader2 size={15} className="shrink-0 animate-spin text-accent" />
        : <Search size={15} className="shrink-0 text-accent" />
      }
      <input
        ref={autoFocus ? inputRef : undefined}
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search pages, faculty, documents…"
        className="flex-1 text-sm bg-transparent focus:outline-none placeholder-slate-400 text-primary"
        autoComplete="off"
        spellCheck={false}
        autoFocus={autoFocus}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <button
          onClick={() => { setQuery(''); setResults(null); inputRef.current?.focus() }}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )

  // ── Dropdown panel ────────────────────────────────────────────────────────

  const dropdownPanel = (
    <div
      className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-2xl z-[9999] overflow-hidden"
      style={{
        border: '1px solid rgba(11,37,69,0.1)',
        borderTop: '3px solid var(--color-accent)',
        maxHeight: '70vh',
      }}
    >
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(70vh - 4px)' }}>
        {results && totalCount(results) > 0 && (
          <div className="py-1 px-1">{renderGrouped()}</div>
        )}

        {results && totalCount(results) === 0 && query.trim().length >= 2 && !loading && (
          <div className="px-6 py-8 text-center">
            <p className="text-sm font-semibold text-primary">
              No results for "<span className="italic">{query}</span>"
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Try checking your spelling, using broader keywords,<br />
              or browsing the navigation menu above.
            </p>
          </div>
        )}

        {query.trim().length < 2 && !loading && (
          <div className="px-4 py-4 text-xs text-slate-400 text-center">
            Type at least 2 characters to search across all content
          </div>
        )}
      </div>
    </div>
  )

  // ── Slide-in side panel — rendered via portal to escape stacking contexts ──

  const sidePanel = mobile && createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[99988] bg-black/40 backdrop-blur-[2px]"
        onClick={closeSide}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-screen z-[99989] flex flex-col bg-white shadow-2xl"
        style={{
          width: 'min(400px, 100vw)',
          borderLeft: '3px solid var(--color-accent)',
          animation: 'slideInRight 0.22s cubic-bezier(0.22,1,0.36,1)',
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Panel header */}
        <div
          className="flex items-center gap-3 px-4 py-3.5 shrink-0"
          style={{ borderBottom: '1px solid rgba(11,37,69,0.1)', background: 'var(--color-primary)' }}
        >
          {loading
            ? <Loader2 size={16} className="shrink-0 animate-spin text-white/60" />
            : <Search size={16} className="shrink-0 text-white/70" />
          }
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search pages, faculty, documents…"
            className="flex-1 text-sm bg-transparent focus:outline-none text-white placeholder-white/40 font-medium"
            autoComplete="off"
            spellCheck={false}
          />
          {query
            ? <button onClick={() => { setQuery(''); setResults(null); inputRef.current?.focus() }} className="text-white/60 hover:text-white transition-colors shrink-0"><X size={15} /></button>
            : <button onClick={closeSide} className="text-white/60 hover:text-white transition-colors shrink-0"><X size={15} /></button>
          }
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {results && totalCount(results) > 0 && (
            <div className="py-2 px-1">{renderGrouped()}</div>
          )}
          {results && totalCount(results) === 0 && query.trim().length >= 2 && !loading && (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Search size={32} className="text-slate-200 mb-3" />
              <p className="text-sm font-semibold text-primary">
                No results for "{query}"
              </p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Check your spelling, try broader keywords,<br />or browse the navigation menu.
              </p>
            </div>
          )}
          {!query && (
            <div className="px-6 py-10 text-center">
              <Search size={36} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm text-slate-400 leading-relaxed">
                Search across pages, faculty, notices,<br />documents, events, and more.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>,
    document.body
  )

  // ── Dark top-bar variant — trigger button + side panel ───────────────────

  if (dark) return (
    <>
      {sidePanel}
      <button
        onClick={() => setMobile(true)}
        className="flex items-center gap-1.5 hover:text-white text-white/70 transition-colors"
        aria-label="Open search"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline text-xs font-medium">Search</span>
      </button>
    </>
  )

  // ── Desktop inline expanding search ──────────────────────────────────────

  return (
    <div
      ref={wrapRef}
      className="relative hidden lg:block"
      style={{ minWidth: open ? 320 : 220, transition: 'min-width 0.2s ease' }}
    >
      <div
        className="flex items-center rounded-lg overflow-hidden transition-all"
        style={{
          border: open
            ? '1.5px solid var(--color-accent)'
            : '1.5px solid rgba(11,37,69,0.15)',
          backgroundColor: '#f8f9fb',
        }}
      >
        {loading
          ? <Loader2 size={15} className="ml-3 shrink-0 animate-spin text-accent" />
          : <Search size={15} className="ml-3 shrink-0" style={{ color: open ? 'var(--color-accent)' : '#94a3b8' }} />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search…"
          className="flex-1 text-sm bg-transparent px-2.5 py-2 focus:outline-none placeholder-slate-400 text-primary"
          autoComplete="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults(null); inputRef.current?.focus() }}
            className="mr-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {open && (query.length >= 2 || results) && dropdownPanel}
    </div>
  )
}

export default SearchBar
