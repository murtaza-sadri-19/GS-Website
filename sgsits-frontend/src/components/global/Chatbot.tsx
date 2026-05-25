/**
 * SGSITS AI Assistant — LangChain + Groq RAG chatbot widget
 *
 * Architecture:
 *  - User message → POST /api/v1/chat/ask (with conversation history)
 *  - Backend retrieves live context from MySQL (departments, faculty,
 *    notices, downloads, placement, CMS) and passes it to Groq LLaMA-3.3-70b
 *  - Response rendered with lightweight Markdown parser
 *  - Conversation history kept in component state (stateless backend)
 *
 * Features:
 *  ✔ Real AI responses (no keyword matching)
 *  ✔ Markdown rendering (bold, links, bullet lists)
 *  ✔ Conversation memory (last 6 turns sent to backend)
 *  ✔ Typing indicator during API call
 *  ✔ Error handling with graceful fallback message
 *  ✔ Quick prompts (configurable via admin)
 *  ✔ Foot-proximity color shift
 *  ✔ Accessible keyboard navigation
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  chatbotService,
  chatbotDefaults,
  type ChatbotConfig,
  type ChatHistoryTurn,
} from '../../services/chatbotService'

// ─── Minimal Markdown renderer ────────────────────────────────────────────────
// Only parses the patterns the LLM actually produces; keeps bundle small.

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="list-disc list-inside space-y-0.5 my-1">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item.replace(/^[-•]\s*/, ''))}</li>
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
      const text = trimmed.replace(/^#{1,3}\s/, '')
      nodes.push(<p key={idx} className="font-bold text-primary mt-1">{renderInline(text)}</p>)
      return
    }

    nodes.push(<p key={idx} className="leading-relaxed">{renderInline(trimmed)}</p>)
  })

  flushList()
  return nodes
}

function renderInline(text: string): React.ReactNode {
  // Process bold (**text**), then links ([label](url))
  const parts: React.ReactNode[] = []
  const pattern = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  let last = 0, m: RegExpExecArray | null

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    if (m[1]) {
      parts.push(<strong key={m.index}>{m[1]}</strong>)
    } else if (m[2] && m[3]) {
      parts.push(
        <a key={m.index} href={m[3]} target="_blank" rel="noopener noreferrer"
           className="text-primary underline break-all">
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

const MessageBubble: React.FC<{ msg: Message; avatarUrl: string; botName: string }> = ({
  msg,
  avatarUrl,
  botName,
}) => {
  const isBot = msg.sender === 'bot'
  return (
    <div className={`flex items-end gap-2 mb-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <img
          src={avatarUrl}
          alt={botName}
          className="w-7 h-7 rounded-full object-contain bg-white border border-gray-200 shrink-0 mb-0.5"
        />
      )}
      <div
        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
          isBot
            ? `bg-white text-gray-800 rounded-tl-sm border ${msg.isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-100'}`
            : 'rounded-tr-sm text-white'
        }`}
        style={!isBot ? { backgroundColor: 'var(--color-primary)' } : {}}
      >
        {isBot ? (
          <div className="space-y-0.5 text-[13px]">{renderMarkdown(msg.text)}</div>
        ) : (
          msg.text
        )}
      </div>
    </div>
  )
}

const TypingIndicator: React.FC<{ avatarUrl: string; botName: string }> = ({ avatarUrl, botName }) => (
  <div className="flex items-end gap-2 mb-3 justify-start">
    <img
      src={avatarUrl}
      alt={botName}
      className="w-7 h-7 rounded-full object-contain bg-white border border-gray-200 shrink-0"
    />
    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
  }

  // FAB color shift near footer
  const btnBg = nearFooter ? '#bfa15f' : 'var(--color-primary)'

  return (
    <>
      {/* ── Chat Window ────────────────────────────────────────────────────── */}
      <div
        className={`fixed bottom-24 right-5 z-[200] w-[370px] flex flex-col bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] border border-gray-200 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
        style={{ maxWidth: 'calc(100vw - 20px)', maxHeight: '580px' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-t-2xl shrink-0" style={{ background: 'var(--color-primary)' }}>
          <div className="relative shrink-0">
            <img
              src={config.avatarUrl}
              alt={config.botName}
              className="w-10 h-10 rounded-full object-contain bg-white p-0.5 border-2 border-white/30"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#bfa15f] rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight truncate">{config.botName}</p>
            <p className="text-white/70 text-[11px]">AI-Powered · SGSITS Portal</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleClear}
              className="text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 text-[10px] font-medium"
              title="Clear conversation"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close chatbot"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0" style={{ maxHeight: '340px' }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} avatarUrl={config.avatarUrl} botName={config.botName} />
          ))}
          {isTyping && <TypingIndicator avatarUrl={config.avatarUrl} botName={config.botName} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-3 py-2 flex gap-1.5 flex-wrap shrink-0 border-t border-gray-100 bg-gray-50/60">
          {config.quickPrompts.slice(0, 4).map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={isTyping}
              className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors shadow-sm disabled:opacity-50 truncate max-w-[170px]"
              title={q}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-3 py-3 flex items-center gap-2 bg-white rounded-b-2xl border-t border-gray-100 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isTyping ? 'Thinking…' : config.inputPlaceholder}
            disabled={isTyping}
            maxLength={500}
            className="flex-1 text-sm px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none bg-white transition-all focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isTyping}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:opacity-90 active:scale-95 shrink-0"
            style={{ background: 'var(--color-primary)' }}
            aria-label="Send message"
          >
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Floating Action Button ──────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[200] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: btnBg, boxShadow: `0 8px 30px ${nearFooter ? 'rgba(191,161,95,0.5)' : 'rgba(0,0,0,0.2)'}` }}
        aria-label="Toggle AI assistant"
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
