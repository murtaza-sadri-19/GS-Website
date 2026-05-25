# SGSITS AI Chatbot — Architecture & Implementation Report
**Date:** 2026-05-25  
**Stack:** LangChain · Groq LLaMA-3.3-70b · MySQL RAG · React  

---

## 1. Chatbot Architecture

```
User Message (React widget)
        ↓
POST /api/v1/chat/ask   (rate-limited: 20 req/15 min per IP)
        ↓
Zod validation (chat.schema.js)
        ↓
chat.service.js  →  chat.retriever.js  →  MySQL multi-source parallel queries
        ↓                                     departments, faculty, notices,
  Context bundle                              downloads, events, placement,
        ↓                                     CMS sections, site settings
LangChain message array
  [SystemMessage(prompt + context)]
  [HumanMessage / AIMessage (history)]
  [HumanMessage(question)]
        ↓
Groq ChatGroq API (llama-3.3-70b-versatile)
        ↓
{ answer, has_context, latency_ms }
        ↓
React widget renders Markdown response
```

**Design principles:**
- Stateless backend — history carried by caller (last 6 turns)
- Context injected ONLY via System message (prompt injection guard)
- Graceful degradation: if DB unreachable, answers from system-prompt defaults
- Rate limited at route level (reuses `authLimiter`: 20 req/15 min)

---

## 2. LangChain Flow

File: `backend/src/modules/chat/chat.service.js`

```javascript
// 1. Sanitize input
const clean = sanitize(question)  // strip HTML + LLaMA instruction tags

// 2. Retrieve context
const context = await retrieveContext(clean)  // chat.retriever.js

// 3. Build LangChain messages
const msgs = [
  new SystemMessage(BASE_SYSTEM_PROMPT + '\n\n## CONTEXT\n' + context),
  ...history.slice(-6).map(t => t.role==='user' ? new HumanMessage(t.content) : new AIMessage(t.content)),
  new HumanMessage(question)
]

// 4. Invoke Groq LLM
const response = await llm.invoke(msgs)

// 5. Return
return { answer: response.content, has_context: Boolean(context), latency_ms: elapsed }
```

**LangChain packages used:**
- `@langchain/groq` — ChatGroq wrapper
- `@langchain/core/messages` — HumanMessage, AIMessage, SystemMessage

---

## 3. Groq Integration

File: `backend/src/modules/chat/chat.service.js`

```javascript
const llm = new ChatGroq({
  apiKey:      process.env.GROQ_API_KEY,
  model:       process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  temperature: 0.15,   // low = factual, deterministic
  maxTokens:   1200,
})
```

**Configuration via `.env`:**
```
GROQ_API_KEY=gsk_...your_key...
GROQ_MODEL=llama-3.3-70b-versatile   # optional override
```

**Error handling:**
- Missing `GROQ_API_KEY` → 503 with descriptive error (lazy init, no startup crash)
- Groq rate-limit detected in frontend → "temporarily busy" message shown to user
- Groq failure → `config.fallbackMessage` shown (contact registrar@sgsits.ac.in)

---

## 4. RAG Pipeline

```
User Question
  → chat.retriever.js: parallel MySQL queries (Promise.allSettled)
    • departments + HOD contact (LIKE match on name/description)
    • faculty profiles + designations + specializations
    • recent published notices (last 5)
    • downloads/documents with file URLs
    • events (published, recent)
    • placement records (companies, year, description)
    • CMS sections (about, stats, vision, accreditation)
    • site settings (phone, email, director name, address)
  → buildContextText(): format into structured Markdown sections
  → inject as System message context block
  → Groq LLM generates answer constrained to context
```

**Retrieval strategy:** LIKE-based full-text matching on question string. For production scale, MySQL FULLTEXT indexes are created by migration 010, making LIKE queries fast on these columns.

**Context budget:** ~2000 tokens injected (5 results per source × 8 sources × ~50 tokens each). Total prompt stays under Groq's 8k context window.

---

## 5. Embedding Strategy

**Current:** DB-based LIKE matching (no embeddings). Fast, deterministic, zero cost.

**Path to semantic embeddings (future):**
1. Install `@langchain/community` + `chromadb` or `@qdrant/js-client`
2. Add embedding generation on document write hooks (notices, downloads, faculty)
3. Replace `chat.retriever.js` LIKE queries with vector similarity search
4. Use `HuggingFaceInferenceEmbeddings` (free) or Groq embeddings

**Why not now:** LIKE matching is sufficient for structured institution data. Embeddings add value for long-form syllabus PDFs and unstructured documents. See Section 7.

---

## 6. Vector DB Structure (Future Design)

When implemented, collection schema:

```
Collection: sgsits_documents
{
  id:         uuid,
  content:    string,    // chunked text
  metadata: {
    source:     'faculty' | 'notice' | 'download' | 'cms' | 'pdf',
    source_id:  number,
    department: string,
    semester:   number | null,
    category:   string,
    tags:       string[],
    visibility: 'public' | 'internal',
    updated_at: ISO date
  }
}
```

**Recommended DB:** Chroma (local, zero cost) → Qdrant Cloud (production scale)

---

## 7. PDF Ingestion Pipeline (Future Design)

When implemented:

```
Admin uploads PDF (via /v1/files/upload)
  → Multer stores file locally or Cloudinary
  → POST /v1/documents/ingest {file_id, category, department, semester}
    → pdf-parse extracts text
    → text chunked (500 tokens, 50 overlap)
    → each chunk → embedding model → vector stored with metadata
    → original file_url + metadata stored in document_embeddings table
  → chatbot retriever adds vector similarity search alongside LIKE queries
```

**PDF types to ingest:**
- Syllabus PDFs (per branch, per semester)
- Academic calendar
- Exam notices + circulars
- Placement brochures
- Hostel regulations
- Fee structures
- Ordinances + regulations

---

## 8. Search Architecture

The chatbot retriever (`chat.retriever.js`) shares the same data sources as the search module (`/v1/search`):

| Source | Chatbot Uses | Search Uses |
|---|---|---|
| Departments table | ✅ LIKE query | ✅ FULLTEXT |
| Faculty profiles | ✅ LIKE query | ✅ FULLTEXT |
| Notices table | ✅ LIKE query | ✅ FULLTEXT |
| Downloads table | ✅ LIKE query | ✅ FULLTEXT |
| Events table | ✅ LIKE query | ✅ FULLTEXT |
| Placement records | ✅ LIKE query | ✅ FULLTEXT |
| CMS sections | ✅ Direct lookup | ❌ Not indexed |
| Site settings | ✅ Direct lookup | ❌ Not indexed |

Both systems can share the same FULLTEXT index infrastructure when MySQL FULLTEXT indexes are applied (migration 010).

---

## 9. DB Schema

Tables that feed the chatbot (existing + future):

### Existing (used by chatbot now)
```sql
departments       (name, short_name, description, hod_user_id, contact_email, contact_phone)
faculty_profiles  (user_id, designation, specialization, research_areas, qualification)
users             (name, email, phone, status, role)
notices           (title, description, notice_type, publish_date, status)
downloads         (title, category, file_id, status)
events            (title, description, event_date, status)
placement_records (title, company_name, academic_year, description, record_type, status)
cms_sections      (section_key, section_data JSON)
site_settings     (setting_key, setting_value)
```

### Future (for PDF RAG)
```sql
CREATE TABLE document_embeddings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  file_id      INT REFERENCES files(id),
  chunk_index  INT NOT NULL,
  chunk_text   TEXT NOT NULL,
  embedding    JSON,             -- float[] serialized (or point to vector DB id)
  vector_id    VARCHAR(100),     -- Chroma/Qdrant ID
  source_type  VARCHAR(50),      -- 'syllabus', 'notice', 'circular', 'policy'
  department   VARCHAR(50),
  semester     TINYINT,
  tags         JSON,
  visibility   ENUM('public','internal') DEFAULT 'public',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot_sessions (
  id           VARCHAR(36) PRIMARY KEY,   -- UUID
  user_ip      VARCHAR(45),
  user_id      INT NULL REFERENCES users(id),
  started_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_active  DATETIME
);

CREATE TABLE chatbot_messages (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  session_id   VARCHAR(36) REFERENCES chatbot_sessions(id),
  role         ENUM('user','assistant'),
  content      TEXT NOT NULL,
  has_context  BOOLEAN DEFAULT FALSE,
  latency_ms   INT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chatbot_feedback (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  message_id   INT REFERENCES chatbot_messages(id),
  rating       TINYINT,           -- 1=thumbs down, 5=thumbs up
  comment      TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 10. API Structure

### Current (live)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/chat/ask` | Public | Ask AI chatbot (rate-limited 20/15min/IP) |
| GET | `/api/v1/chatbot/config` | Public | Fetch bot name, avatar, quick prompts |
| PUT | `/api/v1/chatbot/config` | CENTRAL_ADMIN | Update branding |

### Request / Response

```typescript
// POST /api/v1/chat/ask
Request: {
  question: string,    // 2–500 chars
  history:  { role: 'user'|'assistant', content: string }[]  // max 10 turns
}

Response: {
  success: true,
  data: {
    answer:      string,   // Markdown-formatted response
    has_context: boolean,  // true = DB data was found for this query
    latency_ms:  number    // end-to-end pipeline time
  }
}
```

---

## 11. Security Protections

| Protection | Implementation | Location |
|---|---|---|
| Rate limiting | `authLimiter` (20 req/15 min/IP) | `chat.routes.js` |
| Input validation | Zod schema (min 2, max 500 chars) | `chat.schema.js` |
| HTML injection strip | `sanitize()` strips `<[^>]+>` | `chat.service.js` |
| Prompt injection guard | Strips `[INST]`, `---SYSTEM`, `###` delimiters | `chat.service.js` |
| Context isolation | Context in System msg only, never User msg | `chat.service.js` |
| API key guard | Lazy init with descriptive 503 if missing | `chat.service.js` |
| Admin data leakage | DB queries only return `status=ACTIVE/PUBLISHED` rows | `chat.retriever.js` |
| Sensitive fields excluded | No `password_hash`, `jwt_secret`, internal tokens in queries | `chat.retriever.js` |

**Remaining risks:**
- No per-user quota tracking (only per-IP via rate limiter)
- History content not sanitized on backend (only question is sanitized)
- No monitoring for adversarial prompt injection attempts

---

## 12. Validation Coverage

| Layer | Field | Validation | Status |
|---|---|---|---|
| Backend | `question` | Zod: string, min 2, max 500, trim | ✅ |
| Backend | `history[]` | Zod: array max 10, each max 2000 chars | ✅ |
| Backend | `history[].role` | Zod: enum('user','assistant') | ✅ |
| Backend | Input sanitization | HTML strip + delimiter strip | ✅ |
| Frontend | Question | maxLength=500, non-empty before send | ✅ |
| Frontend | History | sliced to last 6 before sending | ✅ |
| Future PDF upload | file_type, file_size | MIME check + Multer limit | ⚠️ To add |
| Future PDF metadata | category, department, semester | Zod schema needed | ❌ |

---

## 13. Performance Optimizations

| Optimization | Status | Detail |
|---|---|---|
| Parallel DB queries | ✅ Done | `Promise.allSettled([...8 queries...])` |
| Context size cap | ✅ Done | 5 results per source = ~2000 tokens |
| History window cap | ✅ Done | Last 6 turns sent to Groq |
| LLM lazy init | ✅ Done | `_llm` cached after first call |
| Low temperature | ✅ Done | 0.15 = fast, deterministic, factual |
| `maxTokens: 1200` | ✅ Done | Prevents runaway responses |
| DB failures non-fatal | ✅ Done | `Promise.allSettled` + `safe(r)` wrapper |
| Rate limiter | ✅ Done | Prevents chatbot abuse burning Groq quota |
| Frontend history trim | ✅ Done | Capped at 10 turns in `historyRef` |
| Typing indicator | ✅ Done | UX: user sees feedback during inference |

**Remaining performance improvements:**
- Add Redis cache for common questions (5-min TTL)
- Add MySQL FULLTEXT index on `notices.title + description` (migration 010 may already have this)
- Stream Groq responses to frontend (Server-Sent Events) for faster perceived latency

---

## 14. Remaining Risks

| Risk | Severity | Detail | Fix |
|---|---|---|---|
| GROQ_API_KEY not set | Critical | 503 on all chatbot requests | Set env var in `.env` |
| Empty DB (fresh install) | High | No context → vague answers | Seed DB before launch |
| History not sanitized | Medium | Adversarial history could affect Groq output | Add sanitize() to history items |
| No session persistence | Medium | Conversation lost on page refresh | Add localStorage session save or DB sessions |
| Hallucination on empty context | Medium | LLM may invent details if no DB row matches | System prompt rule #2 handles this; monitor |
| No feedback loop | Low | Can't improve retrieval without user ratings | Implement chatbot_feedback table + UI |
| No streaming | Low | Whole response appears at once | Implement SSE streaming with LangChain stream() |

---

## 15. Production Deployment Plan

### Step 1: Environment Setup
```bash
# backend/.env
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
```

### Step 2: Seed Database
Run seed script to populate:
- `departments` with HOD emails
- `faculty_profiles` with faculty data  
- `site_settings` with institute phone/email/address/director

### Step 3: Verify Chatbot
Test these queries manually before launch:
- "What is the email of HOD CSE?" → Should return real HOD email from DB
- "Latest placement statistics" → Should return data from `placement_records`
- "Show exam timetable" → Should return link from `exam_documents`
- "Contact details" → Should return from `site_settings`

### Step 4: Monitor Groq Usage
Check Groq console for token usage. Each question consumes ~500-2000 tokens.
At 20 req/15 min rate limit, max ~80 req/hour per IP.

### Step 5: Future Vector Enhancement
1. `npm install @langchain/community chromadb pdf-parse` in backend
2. Create `document_embeddings` table (migration)
3. Add ingestion endpoint `/v1/documents/ingest`
4. Update `chat.retriever.js` to include vector similarity search
5. Test PDF retrieval for "Give me syllabus of CSE 3rd sem"

---

*Chat module files: `backend/src/modules/chat/chat.routes.js`, `chat.service.js`, `chat.retriever.js`, `chat.schema.js`*  
*Frontend: `src/components/global/Chatbot.tsx`, `src/services/chatbotService.ts`*
