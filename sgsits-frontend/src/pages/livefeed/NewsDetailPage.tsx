import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getAllNews } from '../../services/newsService'
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Bookmark, 
  MessageSquare, 
  Clock, 
  Check, 
  Copy, 
  ChevronRight,
  TrendingUp,
  Heart
} from 'lucide-react'

// Avatar options for interactive comments
const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60',
]

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [newsList, setNewsList] = useState<any[]>([])
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showShareTooltip, setShowShareTooltip] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  // Interactive comment state
  const [comments, setComments] = useState<Array<{
    id: string
    name: string
    avatar: string
    text: string
    date: string
  }>>([
    {
      id: 'c1',
      name: 'Dr. Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      text: 'This is a monumental achievement for our institute! The scope of renewable energy grid research is more critical now than ever before. Heartiest congratulations to Prof. Nema and the entire research team.',
      date: '2025-05-16'
    },
    {
      id: 'c2',
      name: 'Amit Patel',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      text: 'Incredible news! As a student, seeing such advanced labs being set up on campus is highly motivating. Excited to see what research publications come out of this initiative.',
      date: '2025-05-17'
    }
  ])
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0])

  // Load news list from backend
  useEffect(() => { getAllNews().then(setNewsList).catch(() => {}) }, [])

  // Get active article
  const article = useMemo(() => {
    return newsList.find(item => item.id === id)
  }, [newsList, id])

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // If article not found, redirect to news page
  useEffect(() => {
    if (!article && id) {
      const timer = setTimeout(() => {
        navigate('/news')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [article, id, navigate])

  // Format date helper
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  // Related articles (matching category, or latest if no matches)
  const relatedArticles = useMemo(() => {
    if (!article) return []
    const matching = newsList.filter(item => item.id !== article.id && item.category === article.category)
    if (matching.length > 0) return matching.slice(0, 3)
    return newsList.filter(item => item.id !== article.id).slice(0, 3)
  }, [newsList, article])

  // Category specific color style
  const getCategoryStyles = (category?: string) => {
    const cat = (category || '').toLowerCase()
    switch (cat) {
      case 'research':
        return {
          bg: 'bg-indigo-50 border-indigo-100',
          text: 'text-indigo-600',
          indicator: 'bg-indigo-500'
        }
      case 'achievement':
        return {
          bg: 'bg-amber-50 border-amber-100',
          text: 'text-amber-600',
          indicator: 'bg-amber-500'
        }
      case 'event':
        return {
          bg: 'bg-emerald-50 border-emerald-100',
          text: 'text-emerald-600',
          indicator: 'bg-emerald-500'
        }
      case 'industry':
        return {
          bg: 'bg-violet-50 border-violet-100',
          text: 'text-violet-600',
          indicator: 'bg-violet-500'
        }
      default:
        return {
          bg: 'bg-slate-50 border-slate-100',
          text: 'text-slate-600',
          indicator: 'bg-slate-500'
        }
    }
  }

  // Render article content with simple Markdown-like parser
  const renderContent = (contentString?: string) => {
    if (!contentString) return null
    
    return contentString.split('\n\n').map((paragraph, index) => {
      const trimmed = paragraph.trim()
      
      // Header 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 
            key={index} 
            className="text-lg md:text-xl font-display font-bold text-primary mt-8 mb-4 border-l-4 border-accent pl-3 text-slate-800"
          >
            {trimmed.replace('### ', '')}
          </h3>
        )
      }
      
      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote 
            key={index} 
            className="my-6 border-l-4 border-accent bg-slate-50 p-5 rounded-r-xl italic text-slate-600 font-sans text-sm md:text-base shadow-sm relative overflow-hidden"
          >
            <div className="absolute right-3 bottom-1 text-slate-200/50 text-7xl font-serif pointer-events-none select-none">”</div>
            <p className="relative z-10 leading-relaxed">
              {trimmed.replace(/>\s*["']?|["']?$/g, '').trim()}
            </p>
          </blockquote>
        )
      }
      
      // Regular paragraph
      return (
        <p 
          key={index} 
          className="text-slate-600 text-sm md:text-[15px] leading-relaxed font-sans mb-5 text-justify"
        >
          {trimmed}
        </p>
      )
    })
  }

  // Copy link action
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setShowShareTooltip(true)
    setTimeout(() => {
      setShowShareTooltip(false)
    }, 2000)
  }

  // Comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentName.trim() || !commentText.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      name: commentName.trim(),
      avatar: selectedAvatar,
      text: commentText.trim(),
      date: new Date().toISOString().split('T')[0]
    }

    setComments(prev => [newComment, ...prev])
    setCommentName('')
    setCommentText('')
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-20 px-6">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-display font-bold text-primary mb-2">Article Loading or Not Found</h2>
        <p className="text-slate-500 text-sm mb-6 text-center max-w-sm">
          Please wait while we fetch the article, or you will be redirected to the News Feed.
        </p>
        <Link 
          to="/news" 
          className="px-5 py-2.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-xs tracking-wider uppercase transition-all shadow-sm"
        >
          Go Back to News
        </Link>
      </div>
    )
  }

  const catStyles = getCategoryStyles(article.category)

  return (
    <div className="space-y-8 bg-white animate-fade-in">
      {/* Back to news button */}
      <div className="pb-4 border-b border-slate-150">
        <Link 
          to="/news" 
          className="group inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to news list
        </Link>
      </div>

      {/* Article Grid Layout */}
      <div className="grid lg:grid-cols-10 gap-8 items-start">
        
        {/* Main Content Column (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200/60 rounded-2xl p-6 md:p-10 shadow-premium">
            
            {/* Header Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${catStyles.bg} ${catStyles.text}`}>
                  {article.category}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Clock size={12} className="text-slate-350" /> 3 min read
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-primary leading-tight tracking-tight text-slate-800">
                {article.title}
              </h1>

              {/* Author and Date Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100/80">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs uppercase border border-slate-200">
                      {article.author.slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">{article.author}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Contributor</div>
                    </div>
                  </div>
                  <span className="h-6 w-px bg-slate-200 hidden xs:block" />
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium font-sans">
                    <Calendar size={13} className="text-slate-450" />
                    {formatDate(article.date)}
                  </div>
                </div>

                {/* Micro Action Buttons (Like / Bookmark) */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-2.5 rounded-full border transition-all duration-300 relative group flex items-center justify-center ${
                      isLiked 
                        ? 'bg-rose-50 border-rose-200 text-rose-500' 
                        : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title="Like article"
                  >
                    <Heart size={15} className={`transition-transform duration-300 ${isLiked ? 'fill-rose-500 scale-110' : 'group-hover:scale-115'}`} />
                  </button>

                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-2.5 rounded-full border transition-all duration-300 relative group flex items-center justify-center ${
                      isBookmarked 
                        ? 'bg-amber-50 border-amber-200 text-amber-500' 
                        : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                    title="Bookmark article"
                  >
                    <Bookmark size={15} className={`transition-transform duration-300 ${isBookmarked ? 'fill-amber-500 scale-110' : 'group-hover:scale-115'}`} />
                    {isBookmarked && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-bounce font-medium font-sans">
                        Saved!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {article.image && (
              <div className="mt-8 relative rounded-2xl overflow-hidden shadow-md max-h-[380px] border border-slate-100 group">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500" 
                  style={{ maxHeight: '380px', width: '100%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Visual Glassmorphic Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/70 backdrop-blur-md border border-white/40 p-4 rounded-xl hidden md:flex items-center justify-between shadow-glass">
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${catStyles.indicator} animate-pulse`} />
                    <span className="text-xs font-bold text-primary font-sans">SGSITS Editorial Release</span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider font-sans">Official Release</span>
                </div>
              </div>
            )}

            {/* Article Content Rendered */}
            <div className="mt-8 font-sans border-b border-slate-100 pb-8">
              {/* Lead Paragraph Styling */}
              <div className="text-slate-700 text-base md:text-lg font-medium leading-relaxed mb-6 font-sans">
                {article.excerpt}
              </div>
              
              {renderContent(article.content)}
            </div>

            {/* Interactive Comment Board Section */}
            <div className="mt-10 space-y-8">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <MessageSquare size={18} className="text-primary" />
                <h3 className="text-lg font-display font-bold text-primary">Discussion ({comments.length})</h3>
              </div>

              {/* Form */}
              <form onSubmit={handleCommentSubmit} className="bg-slate-50 border border-slate-100 rounded-xl p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">Leave a Reply</h4>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Your Name</label>
                    <input 
                      type="text" 
                      value={commentName}
                      onChange={e => setCommentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma" 
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-colors"
                    />
                  </div>

                  {/* Avatar Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Choose Avatar</label>
                    <div className="flex items-center gap-2.5 h-[34px]">
                      {AVATAR_OPTIONS.map((avatar, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setSelectedAvatar(avatar)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform ${
                            selectedAvatar === avatar 
                              ? 'border-accent scale-110 shadow-sm' 
                              : 'border-transparent hover:scale-105'
                          }`}
                        >
                          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Your Comment</label>
                  <textarea 
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Share your thoughts on this story..." 
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white transition-colors resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </form>

              {/* Comment Feed */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="flex gap-4 p-4 border border-slate-100 hover:border-slate-200/80 rounded-xl transition-all hover:shadow-sm duration-200 bg-white"
                  >
                    <img 
                      src={comment.avatar} 
                      alt={comment.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-700">{comment.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium font-sans">{formatDate(comment.date)}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans text-justify">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column (3 cols) */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-[96px] lg:self-start">
            
            {/* Share Widget */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-premium">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3.5 border-b border-slate-100 pb-2">
                Share Article
              </h3>
              
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={window.location.href} 
                  readOnly 
                  className="bg-slate-50 border border-slate-100 text-[10px] text-slate-400 px-3 py-2 rounded-lg flex-1 focus:outline-none select-all truncate"
                />
                
                <button 
                  onClick={handleCopyLink}
                  className={`p-2 rounded-lg border transition-all duration-300 relative flex items-center justify-center ${
                    showShareTooltip 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                  title="Copy link to clipboard"
                >
                  {showShareTooltip ? <Check size={14} /> : <Copy size={14} />}
                  {showShareTooltip && (
                    <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap animate-bounce font-medium font-sans">
                      Copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Social placeholders with subtle animations */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <a 
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-400 hover:text-sky-500 border border-transparent hover:border-sky-100 transition-all font-sans text-[10px]"
                >
                  <Share2 size={12} /> Twitter
                </a>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100 transition-all font-sans text-[10px]"
                >
                  <Share2 size={12} /> Facebook
                </a>
                <a 
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + window.location.href)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-transparent hover:border-emerald-100 transition-all font-sans text-[10px]"
                >
                  <Share2 size={12} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Facts Card */}
            <div className="bg-white border border-slate-200/60 rounded-xl p-5 shadow-premium space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <TrendingUp size={14} className="text-accent" />
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider">
                  Quick Highlights
                </h3>
              </div>
              <ul className="space-y-3 font-sans text-xs text-slate-500 leading-relaxed list-disc pl-4">
                <li>Released by the official {article.author} department.</li>
                <li>Pertains to our dynamic <span className="font-semibold text-slate-700">{article.category}</span> initiative at SGSITS Indore.</li>
                <li>Fully reviewed and authorized by college academic council, ensuring strict adherence to standards.</li>
              </ul>
            </div>

            {/* Floating Contact Block */}
            <div className="bg-gradient-to-br from-primary to-primary/90 border border-primary text-white rounded-xl p-5 shadow-premium text-center relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-accent/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-500" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-1.5 font-sans">SGSITS Press Relations</h4>
              <p className="text-[10px] text-slate-300 font-sans leading-relaxed mb-4">
                Have a press release, student achievement story, or institutional query? Get in touch with our PR Cell.
              </p>
              <Link 
                to="/contact" 
                className="inline-block px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-bold rounded-lg text-[9px] uppercase tracking-wider transition-colors shadow-sm"
              >
                Contact PR Cell
              </Link>
            </div>

          </div>

        </div>

        {/* Related News Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 border-t border-slate-200/80 pt-12 space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-primary">Read Next</h3>
                <p className="text-xs text-slate-400 font-medium mt-1">Recommended campus news articles and achievements</p>
              </div>
              <Link 
                to="/news" 
                className="text-xs font-bold text-accent hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-wider"
              >
                View all news <ChevronRight size={12} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((item) => {
                const itemCatStyles = getCategoryStyles(item.category)
                return (
                  <Link 
                    key={item.id} 
                    to={`/news/${item.id}`} 
                    className="bg-white border border-slate-200/60 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group flex flex-col shadow-sm"
                  >
                    {item.image && (
                      <div className="relative overflow-hidden h-[160px] border-b border-slate-100 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <span className={`absolute bottom-3 left-3 px-2 py-0.5 border rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm shadow-sm ${itemCatStyles.text} border-slate-200/50`}>
                          {item.category}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-display font-bold text-primary text-sm leading-snug group-hover:text-accent transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2 flex-1">
                        {item.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/80 text-[10px] text-slate-400 font-semibold font-sans">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-slate-350" /> {formatDate(item.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={11} className="text-slate-350" /> {item.author.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

    </div>
  )
}

export default NewsDetailPage
