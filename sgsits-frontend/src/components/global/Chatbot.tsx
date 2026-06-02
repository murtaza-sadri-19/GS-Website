/**
 * Sara — Official University AI Assistant (LangChain + Groq RAG chatbot widget)
 *
 * Features:
 *  ✔ Premium glassmorphic design & HSL tailored styling
 *  ✔ Automatic PDF/Document Link Extractor
 *  ✔ Sleek Document Attachment Card component (PdfAttachmentCard)
 *  ✔ Elegant Side-by-Side sliding PDF Iframe Reader panel (PdfViewerPanel)
 *  ✔ Multi-device responsive overlay & bottom sheet adaptation
 *  ✔ Polished custom scrollbars and animations
 *  ✔ No sensitive data exposure — all responses filtered via secure RAG pipeline
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  chatbotService,
  chatbotDefaults,
  type ChatbotConfig,
  type ChatHistoryTurn,
} from '../../services/chatbotService'

// ─── Document / PDF Types ───────────────────────────────────────────────────

interface PdfLink {
  title: string
  url: string
}

// ─── PDF Link Extractor ──────────────────────────────────────────────────────

function extractPdfLinks(text: string): PdfLink[] {
  const pdfLinks: PdfLink[] = []
  // Matches markdown links pointing to PDF files, uploads directory, or file services
  const pattern = /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+?(?:\.pdf|\/uploads\/|\/files\/)[^\s)]*)\)/gi
  let match
  while ((match = pattern.exec(text)) !== null) {
    pdfLinks.push({
      title: match[1],
      url: match[2],
    })
  }
  return pdfLinks
}

// ─── Minimal Markdown renderer ────────────────────────────────────────────────
// Parses patterns produced by the LLM and handles relative & absolute URLs nicely.

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="list-disc list-inside space-y-1 my-1.5 pl-1.5 text-slate-700">
        {listBuffer.map((item, i) => (
          <li key={i} className="leading-relaxed">{renderInline(item.replace(/^[-•*]\s*/, ''))}</li>
        ))}
      </ul>
    )
    listBuffer = []
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trim()
    if (!trimmed) { flushList(); nodes.push(<br key={`br-${idx}`} />); return }

    // Bullet list
    if (/^[-•*]\s/.test(trimmed)) {
      listBuffer.push(trimmed)
      return
    }
    flushList()

    // Heading
    if (/^#{1,3}\s/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{1,3}\s/, '')
      nodes.push(<p key={idx} className="font-bold text-primary text-[14px] mt-2 mb-1 tracking-tight leading-snug">{renderInline(headingText)}</p>)
      return
    }

    nodes.push(<p key={idx} className="leading-relaxed text-slate-700">{renderInline(trimmed)}</p>)
  })

  flushList()
  return nodes
}

function renderInline(text: string): React.ReactNode {
  // Process bold (**text**), then links ([label](url)) supporting relative & absolute paths
  const parts: React.ReactNode[] = []
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g
  let last = 0, m: RegExpExecArray | null

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) {
      parts.push(<strong key={m.index} className="font-extrabold text-slate-900">{m[1]}</strong>)
    } else if (m[2] && m[3]) {
      parts.push(
        <a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer"
           className="text-primary font-semibold underline underline-offset-2 hover:text-accent break-all transition-colors duration-150">
          {m[2]}
        </a>
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts.length > 0 ? <>{parts}</> : text
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: number
  sender: 'bot' | 'user'
  text: string
  isError?: boolean
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const PdfAttachmentCard: React.FC<{
  title: string
  url: string
  onView: (title: string, url: string) => void
}> = ({ title, url, onView }) => {
  const downloadUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`

  return (
    <div className="p-3 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-100 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-200 group pdf-card-glow border-l-4 border-l-red-500 w-full animate-slide-in">
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {/* PDF Icon Badge */}
        <div className="w-9 h-9 rounded-lg bg-red-50 flex flex-col items-center justify-center border border-red-100 shrink-0 text-red-500 font-bold relative transition-transform duration-200 group-hover:scale-105">
          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6c0 1.1-.9 2-2 2h-2v2h-2V7h4c1.1 0 2 .9 2 2zm-5 0h2V8h-2v1zm9 3c0 1.1-.9 2-2 2h-4V7h4c1.1 0 2 .9 2 2v3zm-2-1V8h-2v3h2z"/>
          </svg>
          <span className="absolute bottom-0.5 text-[6.5px] font-black tracking-wider uppercase">PDF</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-800 truncate leading-tight group-hover:text-primary transition-colors" title={title}>
            {title}
          </p>
          <p className="text-[8px] text-slate-400 mt-0.5 font-semibold uppercase tracking-wider">Syllabus / Document</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onView(title, url)}
          className="px-2.5 py-1.5 rounded-lg bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold flex items-center gap-0.5 transition-all active:scale-95 border border-primary/10"
          title="View PDF directly in chat drawer"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          View
        </button>

        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 transition-all active:scale-95 flex items-center justify-center"
          title="Download PDF"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </a>
      </div>
    </div>
  )
}

const MessageBubble: React.FC<{
  msg: Message
  avatarUrl: string
  botName: string
  onViewPdf: (title: string, url: string) => void
}> = ({ msg, avatarUrl, botName, onViewPdf }) => {
  const isBot = msg.sender === 'bot'
  const pdfLinks = isBot ? extractPdfLinks(msg.text) : []

  return (
    <div className={`flex items-end gap-2 mb-3.5 ${isBot ? 'justify-start' : 'justify-end'} animate-slide-in`}>
      {isBot && (
        <img
          src={avatarUrl}
          alt={botName}
          className="w-7.5 h-7.5 rounded-full object-contain bg-white border border-slate-200 shrink-0 mb-0.5 shadow-sm"
        />
      )}
      <div className="max-w-[85%] flex flex-col items-start gap-1">
        <div
          className={`px-4 py-2.5 rounded-2xl text-[12.5px] leading-relaxed shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${
            isBot
              ? `bg-white text-slate-800 rounded-tl-sm border ${msg.isError ? 'border-red-200 bg-red-50/60 text-red-700' : 'border-slate-100'}`
              : 'rounded-tr-sm text-white'
          }`}
          style={!isBot ? { backgroundColor: 'var(--color-primary)' } : {}}
        >
          {isBot ? (
            <div className="space-y-0.5">{renderMarkdown(msg.text)}</div>
          ) : (
            msg.text
          )}
        </div>
        
        {/* Render interactive PDF card blocks underneath the bubble */}
        {pdfLinks.length > 0 && (
          <div className="flex flex-col gap-2 mt-1 w-full max-w-[310px]">
            {pdfLinks.map((pdf, idx) => (
              <PdfAttachmentCard
                key={idx}
                title={pdf.title}
                url={pdf.url}
                onView={onViewPdf}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const TypingIndicator: React.FC<{ avatarUrl: string; botName: string }> = ({ avatarUrl, botName }) => (
  <div className="flex items-end gap-2 mb-3.5 justify-start">
    <img
      src={avatarUrl}
      alt={botName}
      className="w-7.5 h-7.5 rounded-full object-contain bg-white border border-slate-200 shrink-0"
    />
    <div className="bg-white border border-slate-100 px-4.5 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 animate-pulse">
      <span className="w-2 h-2 bg-amber-500/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-amber-500/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-amber-500/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
)

// ─── Main Component ───────────────────────────────────────────────────────────

const Chatbot: React.FC = () => {
  const [config, setConfig] = useState<ChatbotConfig>(chatbotDefaults)

  useEffect(() => {
    chatbotService.getChatbotConfig().then(setConfig)
  }, [])

  // ── Chat state ────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen]       = useState(false)
  const [messages, setMessages]   = useState<Message[]>([])
  const [inputValue, setInput]    = useState('')
  const [isTyping, setIsTyping]   = useState(false)
  const [nearFooter, setNearFoot] = useState(false)

  // PDF Viewer Drawer State
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null)
  const [activePdfTitle, setActivePdfTitle] = useState<string>('')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  // Listen to window size to handle side-by-side or responsive overlay modes
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Conversation history sent to the backend (role + content pairs)
  const historyRef = useRef<ChatHistoryTurn[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // Welcome message on config load
  useEffect(() => {
    setMessages([{ id: 1, sender: 'bot', text: config.welcomeMessage }])
  }, [config.welcomeMessage])

  // Footer proximity detection (changes FAB color)
  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return
    const obs = new IntersectionObserver(([e]) => setNearFoot(e.isIntersecting), { threshold: 0.05 })
    obs.observe(footer)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  // Close PDF panel when chatbot closes
  useEffect(() => {
    if (!isOpen) {
      setActivePdfUrl(null)
      setActivePdfTitle('')
    }
  }, [isOpen])

  // ── Send message ──────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (text?: string) => {
    const question = (text ?? inputValue).trim()
    if (!question || isTyping) return

    const userMsg: Message = { id: Date.now(), sender: 'user', text: question }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Record user turn in history
    historyRef.current = [...historyRef.current, { role: 'user', content: question }]

    try {
      const result = await chatbotService.askChatbot(question, historyRef.current.slice(-6))

      const botMsg: Message = {
        id:   Date.now() + 1,
        sender: 'bot',
        text: result.answer || config.fallbackMessage,
      }
      setMessages(prev => [...prev, botMsg])

      // Record assistant turn in history
      historyRef.current = [...historyRef.current, { role: 'assistant', content: result.answer }]

      // Trim history to last 10 turns to prevent unbounded growth
      if (historyRef.current.length > 10) {
        historyRef.current = historyRef.current.slice(-10)
      }
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      const isQuota = apiMsg?.toLowerCase().includes('rate limit') || apiMsg?.toLowerCase().includes('quota')

      const errText = isQuota
        ? 'The assistant is temporarily busy. Please try again in a moment.'
        : config.fallbackMessage

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: errText, isError: true }])

      // Remove the failed user turn from history so it doesn't confuse next request
      historyRef.current = historyRef.current.slice(0, -1)
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, isTyping, config.fallbackMessage])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleClear = () => {
    historyRef.current = []
    setMessages([{ id: Date.now(), sender: 'bot', text: config.welcomeMessage }])
    setActivePdfUrl(null)
    setActivePdfTitle('')
  }

  // FAB color shift near footer
  const btnBg = nearFooter ? 'var(--color-accent)' : 'var(--color-primary)'

  return (
    <>
      {/* ── Custom CSS Stylesheet Injection ───────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .chatbot-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chatbot-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chatbot-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 99px;
        }
        .chatbot-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        @keyframes chatbotSlideInUp {
          from {
            opacity: 0;
            transform: translateY(18px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-slide-in {
          animation: chatbotSlideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .pdf-card-glow {
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .pdf-card-glow:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px -4px rgba(239, 68, 68, 0.12);
        }
      `}} />

      {/* ── Chat Window ────────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-5 z-[200] w-[385px] flex flex-col bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.22)] border border-slate-100/90 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          maxWidth: 'calc(100vw - 20px)',
          maxHeight: '600px',
          height: '580px',
          fontFamily: "'Outfit', 'Inter', -apple-system, sans-serif"
        }}
      >
        {/* Elegant Gradient Header */}
        <div className="flex items-center gap-3 px-4.5 py-4 rounded-t-3xl shrink-0 bg-primary">
          <div className="relative shrink-0">
            <img
              src={config.avatarUrl}
              alt={config.botName}
              className="w-10.5 h-10.5 rounded-full object-contain bg-white p-0.5 border-2 border-white/20 shadow-md"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-amber-400 rounded-full border-2 border-primary animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-[13.5px] leading-tight tracking-wide">{config.botName}</p>
            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider mt-0.5">Official University AI Assistant</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClear}
              className="text-white/60 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider"
              title="Clear conversation"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Close chatbot"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto px-4.5 py-4 min-h-0 chatbot-scrollbar bg-slate-50/20">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              avatarUrl={config.avatarUrl}
              botName={config.botName}
              onViewPdf={(title, url) => {
                setActivePdfUrl(url)
                setActivePdfTitle(title)
              }}
            />
          ))}
          {isTyping && <TypingIndicator avatarUrl={config.avatarUrl} botName={config.botName} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3.5 py-2 flex gap-1.5 flex-wrap shrink-0 border-t border-slate-100 bg-slate-50/50">
          {config.quickPrompts.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:border-primary hover:text-primary text-slate-600 transition-all duration-200 shadow-sm disabled:opacity-50 truncate max-w-[170px] active:scale-95"
              title={q}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Premium Input Form */}
        <div className="px-3.5 py-3 flex items-center gap-2 bg-white rounded-b-3xl border-t border-slate-100 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? 'Thinking…' : config.inputPlaceholder}
            disabled={isTyping}
            maxLength={500}
            className="flex-1 text-[13px] px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/10 bg-slate-50/50 hover:bg-slate-50 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium text-slate-800"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 active:scale-95 shrink-0 shadow-sm"
            style={{ background: 'var(--color-primary)' }}
            aria-label="Send message"
          >
            <svg width="15" height="15" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Premium Side / Overlay PDF Viewer Panel ───────────────────────────── */}
      {activePdfUrl && (
        <div
          className="fixed bottom-24 bg-white/98 backdrop-blur-md rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.3)] border border-slate-100 flex flex-col transition-all duration-300 animate-slide-in"
          style={{
            height: '580px',
            maxHeight: 'calc(100vh - 120px)',
            // Desktop: slide out directly to the left of the chatbot
            // Mobile/Tablet: cover the screen/chatbot completely as a top sheet
            right: windowWidth > 940 ? '415px' : '10px',
            width: windowWidth > 940 ? '560px' : 'calc(100vw - 20px)',
            maxWidth: '100vw',
            zIndex: windowWidth > 940 ? '201' : '205',
            fontFamily: "'Outfit', 'Inter', sans-serif"
          }}
        >
          {/* Viewer Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/70 rounded-t-3xl">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="p-2 bg-red-50 text-red-500 rounded-lg shrink-0 border border-red-100/50">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6c0 1.1-.9 2-2 2h-2v2h-2V7h4c1.1 0 2 .9 2 2zm-5 0h2V8h-2v1zm9 3c0 1.1-.9 2-2 2h-4V7h4c1.1 0 2 .9 2 2v3zm-2-1V8h-2v3h2z"/>
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 text-[12.5px] truncate leading-tight" title={activePdfTitle}>
                  {activePdfTitle}
                </p>
                <p className="text-[8.5px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">Live Document Reader</p>
              </div>
            </div>
            
            {/* Action Group */}
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <a
                href={activePdfUrl.startsWith('http') ? activePdfUrl : `${window.location.origin}${activePdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 hover:bg-slate-100 text-primary hover:text-accent transition-all rounded-lg flex items-center gap-1 text-[10px] font-bold border border-slate-200 bg-white shadow-sm active:scale-95"
                title="Open PDF in new tab"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Open Full
              </a>
              <button
                onClick={() => { setActivePdfUrl(null); setActivePdfTitle('') }}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all rounded-lg border border-slate-200 bg-white active:scale-95 flex items-center justify-center"
                aria-label="Close Reader"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* IFrame Embedded Document Viewer */}
          <div className="flex-1 bg-slate-100 rounded-b-3xl overflow-hidden relative">
            <iframe
              src={activePdfUrl.startsWith('http') ? activePdfUrl : `${window.location.origin}${activePdfUrl}`}
              title={activePdfTitle}
              className="w-full h-full border-none bg-slate-100"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ── Floating Action Button ──────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[200] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: btnBg, boxShadow: `0 8px 30px ${nearFooter ? 'rgba(var(--color-accent-rgb), 0.5)' : 'rgba(0,0,0,0.2)'}` }}
        aria-label="Toggle Sara – Official University AI Assistant"
      >
        {isOpen ? (
          <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!isOpen && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: btnBg }}
          />
        )}
      </button>
    </>
  )
}

export default Chatbot
