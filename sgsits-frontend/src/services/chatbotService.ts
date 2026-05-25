/**
 * Chatbot Service — LangChain + Groq RAG backend
 *
 * Replaces the old keyword-matching mock with a real AI pipeline.
 *
 * POST /api/v1/chat/ask
 *   Body:  { question: string, history: {role, content}[] }
 *   Reply: { answer: string, has_context: boolean, latency_ms: number }
 *
 * Config (bot name, avatar, welcome message, quick prompts) still fetched
 * from /api/v1/chatbot/config so admins can update branding without deploys.
 */

import apiClient from '../api/client'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ChatHistoryTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatAskResponse {
  answer: string
  has_context: boolean
  latency_ms: number
}

export interface ChatbotResponseItem {
  id: string
  category: string
  keywords: string[]
  reply: string
}

export interface ChatbotConfig {
  botName: string
  avatarUrl: string
  welcomeMessage: string
  inputPlaceholder: string
  fallbackMessage: string
  quickPrompts: string[]
  responses: ChatbotResponseItem[]
}

// ── Defaults (prevent flash while config loads) ────────────────────────────────

export const chatbotDefaults: ChatbotConfig = {
  botName:          'SGSITS Assistant',
  avatarUrl:        '/assets/image.png',
  welcomeMessage:   'Hello! I\'m the **SGSITS Virtual Assistant**.\n\nAsk me anything about:\n• Admissions & Eligibility\n• Departments & Faculty\n• Placements & Companies\n• Exams & Schedules\n• Hostel & Facilities\n• Contact & Location',
  inputPlaceholder: 'Ask about admissions, fees, placements…',
  fallbackMessage:  'I couldn\'t find that information. Please contact the institute at **+91-731-2582100** or **registrar@sgsits.ac.in**.',
  quickPrompts: [
    'HOD email of CSE department?',
    'Latest placement statistics',
    'How to apply for admission?',
    'Exam timetable / notices',
    'Contact the institute',
  ],
  responses: [],
}

// ── Config fetch (branding, quick prompts) ────────────────────────────────────

export const getChatbotConfig = async (): Promise<ChatbotConfig> => {
  try {
    const [configRes, responsesRes] = await Promise.all([
      apiClient.get('/v1/chatbot/config'),
      apiClient.get('/v1/chatbot/responses')
    ])
    const d = configRes.data?.data
    const resps = responsesRes.data?.data || []
    const formattedResponses: ChatbotResponseItem[] = resps.map((r: any) => ({
      id: String(r.id),
      category: r.category || 'General',
      keywords: typeof r.keywords === 'string' ? r.keywords.split(',').map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(r.keywords) ? r.keywords : []),
      reply: r.reply || ''
    }))

    if (!d) return { ...chatbotDefaults, responses: formattedResponses }
    return {
      botName:          d.bot_name          || chatbotDefaults.botName,
      avatarUrl:        d.avatar_url        || chatbotDefaults.avatarUrl,
      welcomeMessage:   d.welcome_message   || chatbotDefaults.welcomeMessage,
      inputPlaceholder: d.input_placeholder || chatbotDefaults.inputPlaceholder,
      fallbackMessage:  d.fallback_message  || chatbotDefaults.fallbackMessage,
      quickPrompts:     chatbotDefaults.quickPrompts, // always use curated defaults
      responses:        formattedResponses
    }
  } catch {
    return { ...chatbotDefaults, responses: [] }
  }
}

// ── AI ask — LangChain + Groq RAG ─────────────────────────────────────────────

/**
 * Send a question to the RAG chatbot.
 * @param question  sanitized user input
 * @param history   last N conversation turns (for context window)
 */
export const askChatbot = async (
  question: string,
  history: ChatHistoryTurn[] = []
): Promise<ChatAskResponse> => {
  const res = await apiClient.post('/v1/chat/ask', {
    question,
    history: history.slice(-6), // send at most 6 turns to keep payload small
  })
  return res.data?.data as ChatAskResponse
}

export const saveChatbotConfig = async (config: ChatbotConfig): Promise<void> => {
  try {
    // 1. Save general config
    await apiClient.put('/v1/chatbot/config', {
      bot_name:          config.botName,
      avatar_url:        config.avatarUrl,
      welcome_message:   config.welcomeMessage,
      input_placeholder: config.inputPlaceholder,
      fallback_message:  config.fallbackMessage,
    })

    // 2. Fetch existing responses to determine which ones to delete/update/create
    const res = await apiClient.get('/v1/chatbot/responses')
    const existing: any[] = res.data?.data || []

    const incoming = config.responses || []

    // 2a. Delete responses that are in existing but NOT in incoming
    const incomingIds = new Set(incoming.map(r => String(r.id)))
    const toDelete = existing.filter(r => !incomingIds.has(String(r.id)))
    for (const r of toDelete) {
      await apiClient.delete(`/v1/chatbot/responses/${r.id}`)
    }

    // 2b. Create or Update incoming responses
    for (const r of incoming) {
      const payload = {
        category: r.category,
        keywords: Array.isArray(r.keywords) ? r.keywords.join(', ') : '',
        reply: r.reply,
        is_active: 1
      }
      const exists = existing.some(ext => String(ext.id) === String(r.id))
      if (exists) {
        await apiClient.put(`/v1/chatbot/responses/${r.id}`, payload)
      } else {
        await apiClient.post('/v1/chatbot/responses', payload)
      }
    }
  } catch (err) {
    console.error('Error saving chatbot config:', err)
    throw err
  }
}

export const chatbotService = {
  getChatbotConfig,
  saveChatbotConfig,
  askChatbot,
}

export default chatbotService
