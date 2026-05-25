import React, { useState, useMemo, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { getNotices } from '../../services/noticesService'
import { Search, FileText, ChevronLeft, ChevronRight, Tag, Eye } from 'lucide-react'
import PdfViewerModal from '../../components/global/PdfViewerModal'

type CategoryFilter = 'all' | 'academic' | 'administrative' | 'exam' | 'tender' | 'general'

const categoryLabels: Record<CategoryFilter, string> = {
  all: 'All',
  academic: 'Academic',
  administrative: 'Administrative',
  exam: 'Exam',
  tender: 'Tender',
  general: 'General',
}

const categoryColors: Record<string, string> = {
  academic: 'bg-[#0b2545]/10 text-[#0b2545] border-[#0b2545]/25',
  administrative: 'bg-[#0b2545]/15 text-[#0b2545] border-[#0b2545]/30',
  exam: 'bg-[#bfa15f]/15 text-[#bfa15f] border-[#bfa15f]/40',
  tender: 'bg-[#bfa15f]/20 text-[#bfa15f] border-[#bfa15f]/45',
  general: 'bg-[#bfa15f]/10 text-[#bfa15f] border-[#bfa15f]/30',
}

const ITEMS_PER_PAGE = 10

const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([])
  useEffect(() => { getNotices().then(setNotices).catch(() => setNotices([])) }, [])
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pdfViewer, setPdfViewer] = useState<{
    isOpen: boolean
    url: string
    title: string
  }>({
    isOpen: false,
    url: '',
    title: ''
  })

  const filtered = useMemo(() => {
    let result = notices
    if (activeTab !== 'all') result = result.filter(n => n.category === activeTab)
    if (search.trim()) result = result.filter(n => n.title.toLowerCase().includes(search.toLowerCase()))
    return result
  }, [notices, activeTab, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleTabChange = (tab: CategoryFilter) => { setActiveTab(tab); setPage(1) }
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => { setSearch(e.target.value); setPage(1) }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-white">
      <PageSeo pageKey="notices" />
      {/* Hero */}
      <div className="bg-primary">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-8 bg-accent" />
            <span className="text-[11px] uppercase font-bold tracking-widest text-accent font-sans">Official Communications</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Official Notices & Circulars</h1>
          <p className="text-slate-300 text-sm font-sans">Stay updated with the latest official notices, academic circulars, and administrative orders from SGSITS Indore.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search Box */}
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search notices by title..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            />
          </div>
          {/* Result count */}
          <span className="text-sm text-slate-500 font-medium shrink-0">
            {filtered.length} notice{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(categoryLabels) as CategoryFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {categoryLabels[tab]}
              {tab !== 'all' && (
                <span className="ml-1.5 opacity-70">
                  ({notices.filter(n => n.category === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div className="space-y-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
              <FileText size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-semibold">No notices found</p>
              <p className="text-sm text-slate-400 mt-1">Try a different search term or filter</p>
            </div>
          ) : (
            paginated.map((notice) => (
              <div
                key={notice.id}
                className={`bg-white border rounded-xl p-5 hover:shadow-md transition-all hover:border-slate-400 ${
                  notice.highlight ? 'border-l-4 border-l-accent border-slate-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/8 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {notice.highlight && (
                        <span className="text-[10px] font-bold bg-accent text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">New</span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryColors[notice.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        <Tag size={9} className="inline mr-0.5" />
                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-primary text-sm leading-snug">{notice.title}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">{formatDate(notice.date)}</p>
                  </div>
                  <button
                    onClick={() => setPdfViewer({ isOpen: true, url: notice.fileUrl || '', title: notice.title })}
                    className="flex items-center gap-1.5 shrink-0 text-xs font-bold text-primary border border-primary/20 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    <Eye size={12} /> View Notice
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${
                    p === page ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
        <p className="text-xs text-slate-400 text-center">
          Showing {paginated.length} of {filtered.length} notices · Page {page} of {totalPages}
        </p>

      </div>

      <PdfViewerModal
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer(prev => ({ ...prev, isOpen: false }))}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
    </div>
  )
}

export default NoticesPage
