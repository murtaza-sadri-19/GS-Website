import React, { useState, useMemo } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { Link } from 'react-router-dom'
import { getAllNews } from '../../services/newsService'
import { Calendar, User, ArrowRight, Search, RefreshCw } from 'lucide-react'
import { SkeletonCard, SkeletonNewsRow, Sk } from '../../components/ui/Skeleton'
import { usePageData } from '../../hooks/usePageData'
import { usePageCacheStore } from '../../store/pageCacheStore'

const fetchNews = () => getAllNews()

// Skeleton for the featured 2-column article
const SkeletonFeatured: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md" aria-hidden="true">
    <div className="grid md:grid-cols-2">
      <Sk className="h-64 md:h-full rounded-none" />
      <div className="p-8 space-y-3">
        <Sk className="h-2.5 w-20 rounded" />
        <Sk className="h-6 w-3/4 rounded" />
        <Sk className="h-6 w-1/2 rounded" />
        <div className="space-y-1.5 pt-1">
          <Sk className="h-3.5 w-full rounded" />
          <Sk className="h-3.5 w-5/6 rounded" />
          <Sk className="h-3.5 w-4/5 rounded" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-4">
            <Sk className="h-3 w-20 rounded" />
            <Sk className="h-3 w-16 rounded" />
          </div>
          <Sk className="h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  </div>
)

const NewsPage: React.FC = () => {
  const { data: news, loading, isFetching, refresh } = usePageData<any[]>('news', fetchNews)

  // UI state — initialised from persisted store so search/category survive navigation
  const newsUI    = usePageCacheStore(s => s.newsUI)
  const setNewsUI = usePageCacheStore(s => s.setNewsUI)

  const [activeCategory, setActiveCategory] = useState(newsUI.category)
  const [search, setSearch]                 = useState(newsUI.search)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setNewsUI({ category: cat })
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearch(val)
    setNewsUI({ search: val })
  }

  const allNews = news ?? []

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allNews.map((n: any) => n.category)))
    return ['All', ...cats]
  }, [allNews])

  const filtered = useMemo(() => {
    let result = allNews
    if (activeCategory !== 'All') result = result.filter((n: any) => n.category === activeCategory)
    if (search.trim()) result = result.filter((n: any) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase())
    )
    return result
  }, [allNews, activeCategory, search])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="space-y-6 bg-white">
      <PageSeo pageKey="news" />

      {/* Search + Category Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search news..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-sm text-slate-500 font-medium">
            {isFetching ? '...' : `${filtered.length} article${filtered.length !== 1 ? 's' : ''}`}
          </span>
          <button
            onClick={refresh}
            disabled={isFetching}
            title="Refresh news"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-primary transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Category Tabs — only show when data is ready */}
      {!loading && (
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="space-y-6 animate-fade-in">
          <SkeletonFeatured />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {/* Content */}
      {!loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Featured Article */}
          {activeCategory === 'All' && !search && filtered.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
              <div className="grid md:grid-cols-2">
                <div className="relative overflow-hidden" style={{ minHeight: '260px' }}>
                  <img
                    src={filtered[0].image}
                    alt={filtered[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ minHeight: '260px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute top-4 left-4 bg-accent text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    Featured
                  </span>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">{filtered[0].category}</span>
                  <h2 className="text-xl font-display font-bold text-primary mb-3 leading-snug">{filtered[0].title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-sans mb-5">{filtered[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(filtered[0].date)}</span>
                      <span className="flex items-center gap-1.5"><User size={12} /> {filtered[0].author}</span>
                    </div>
                    <Link to={`/news/${filtered[0].id}`} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-accent transition-colors">
                      Read More <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-slate-500 font-semibold">No news articles found</p>
              <p className="text-sm text-slate-400 mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeCategory === 'All' && !search ? filtered.slice(1) : filtered).map((item: any) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                  <div className="relative overflow-hidden" style={{ height: '200px' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display font-bold text-primary text-sm leading-snug mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans flex-1 line-clamp-3">{item.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {formatDate(item.date)}</span>
                        <span className="flex items-center gap-1"><User size={10} /> {item.author}</span>
                      </div>
                      <Link to={`/news/${item.id}`} className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-accent transition-colors shrink-0">
                        Read More <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NewsPage
