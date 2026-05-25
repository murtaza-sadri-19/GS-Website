# Enterprise Dual Attachment System

**Version:** 1.0  
**Date:** 2026-05-25  
**Scope:** Backend (GS-Website/backend) + Frontend (sgsits-frontend)

---

## 1. Overview

Every upload-enabled module now supports **two attachment modes**:

| Mode | Description | Storage |
|------|-------------|---------|
| **FILE** | Real binary upload | LOCAL disk or CLOUDINARY |
| **EXTERNAL_LINK** | URL-only reference | No binary stored — URL registered in DB |

Both modes return a `file_id` that dependent modules reference via standard FK.  
There are **zero breaking changes** to any existing module table.

---

## 2. Architecture

```
Admin Form
    │
    ├── Upload File ──────► POST /api/v1/files/upload (multipart)
    │                            └─► files table (attachment_type='FILE')
    │
    └── External Link ─────► POST /api/v1/files/link (JSON)
                                  └─► files table (attachment_type='EXTERNAL_LINK')
    
Both paths return: { id, attachment_type, file_url, ... }
                        └── used as file_id FK in notices, downloads, events...
```

---

## 3. Database Schema Changes

**Migration:** `database/migrations/012_dual_attachment_support.sql`

### Changes to `files` table

| Column | Change | Notes |
|--------|--------|-------|
| `attachment_type` | **NEW** `ENUM('FILE','EXTERNAL_LINK') DEFAULT 'FILE'` | All existing rows = FILE |
| `external_url` | **NEW** `TEXT NULL` | URL for EXTERNAL_LINK type |
| `thumbnail_url` | **NEW** `TEXT NULL` | Optional preview/thumbnail |
| `alt_text` | **NEW** `VARCHAR(255) NULL` | Accessible description |
| `meta_title` | **NEW** `VARCHAR(255) NULL` | SEO/display title |
| `meta_description` | **NEW** `TEXT NULL` | Optional description |
| `stored_name` | Modified to `VARCHAR(255) NULL` | NULL for external links |
| `file_size` | Modified to `INT NULL` | NULL for external links |
| `storage_type` | Extended ENUM to include `'EXTERNAL'` | Used by external links |

**How to apply:**
```bash
cd GS-Website/backend
mysql -u root -p college_website < database/migrations/012_dual_attachment_support.sql
```

---

## 4. API Changes

### New Endpoints

#### `POST /api/v1/files/link`
Register an external URL as an attachment.

**Auth:** Required (any authenticated user)

**Request Body (JSON):**
```json
{
  "external_url": "https://drive.google.com/file/d/abc/view",
  "original_name": "Syllabus 2026 (optional display name)",
  "alt_text": "Accessible description (optional)",
  "thumbnail_url": "https://example.com/thumb.jpg (optional)",
  "meta_title": "BE Computer Science Syllabus 2026",
  "meta_description": "Full syllabus PDF for 2026 batch",
  "usage": "downloads"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "External link registered successfully",
  "data": {
    "id": 42,
    "attachment_type": "EXTERNAL_LINK",
    "original_name": "Syllabus 2026",
    "file_url": "https://drive.google.com/file/d/abc/view",
    "external_url": "https://drive.google.com/file/d/abc/view",
    "file_type": "application/pdf",
    "storage_type": "EXTERNAL",
    ...
  }
}
```

#### `PATCH /api/v1/files/link/:id`
Update metadata on an existing EXTERNAL_LINK attachment.

**Auth:** Owner or CENTRAL_ADMIN

**Request Body (JSON, all fields optional):**
```json
{
  "external_url": "https://new-url.com/doc.pdf",
  "original_name": "Updated Name",
  "alt_text": "...",
  "thumbnail_url": "...",
  "meta_title": "...",
  "meta_description": "..."
}
```

### Updated Endpoints

#### `GET /api/v1/files?attachment_type=FILE|EXTERNAL_LINK`
New optional query param to filter by attachment type.

#### `POST /api/v1/files/upload`
Now accepts `usage` field (was `category`) in form body.
Added new usage values: `tenders`, `labs`, `achievements`, `research`, `cms`, `chatbot`.

---

## 5. Validation Rules

### File Upload Validation
| Check | Rule |
|-------|------|
| MIME type | Checked against usage-specific allowlist in `files.service.js` |
| File size | Usage-specific: gallery=2MB, notices=10MB, downloads=25MB |
| Extension | Enforced by `fileFilter` in `upload.middleware.js` |
| Malware | Not implemented (use an AV service in production) |

### External Link Validation (`src/utils/urlValidator.js`)
| Check | Rule |
|-------|------|
| URL syntax | Must be parseable by `new URL()` |
| Protocol | `http:` or `https:` only |
| Blocked domains | URL shorteners blocked (bit.ly, tinyurl.com, etc.) |
| Private IPs | RFC-1918 + loopback blocked (SSRF protection) |
| AWS metadata | `169.254.169.254` blocked |
| GCP metadata | `metadata.google.internal` blocked |
| URL length | Max 2048 chars |

---

## 6. Storage Strategy

### Current Storage Options

| `storage_type` | When Used | Cost |
|----------------|-----------|------|
| `LOCAL` | Cloudinary not configured | Free (disk space) |
| `CLOUDINARY` | Cloudinary env vars set | Paid (free tier available) |
| `EXTERNAL` | External link registered | Free (no storage used) |

### Future CDN Migration

The `storage_type` field is designed for extensibility:
1. Add `'S3'`, `'AZURE_BLOB'` etc. to the ENUM
2. Implement a new upload path in `files.service.js` → `uploadToS3()` etc.
3. Set `isCloudinaryConfigured()` equivalent per provider
4. No changes needed to any module (notices, downloads, etc.)

---

## 7. Frontend Component

**File:** `src/components/admin/AttachmentUpload.tsx`

### Props
```typescript
interface AttachmentUploadProps {
  usage?: string           // 'notices' | 'downloads' | 'exam' | 'gallery' | ...
  onAttached: (record: AttachmentRecord) => void   // called after successful registration
  onClear: () => void      // called when attachment is removed
  initialValue?: AttachmentRecord | null  // for edit mode
  className?: string
  compact?: boolean
  disabled?: boolean
  label?: string
  required?: boolean
}
```

### Features
- **Mode toggle**: "Upload File" / "External Link" tab buttons
- **Drag-and-drop** file upload zone with visual feedback
- **Real-time upload progress** bar
- **URL validation** with green/red visual feedback
- **Link preview** with "Preview" anchor
- **Attached state** shows file name, type badge, size, source badge
- **Clear/replace** button for editing
- **Error display** with dismiss + retry
- **Usage-based** MIME/size configuration

### Usage Example
```tsx
import AttachmentUpload from '../../components/admin/AttachmentUpload'
import type { AttachmentRecord } from '../../api/index'

// In your form:
const [fileId, setFileId] = useState<number | null>(null)
const [attachmentRecord, setAttachmentRecord] = useState<AttachmentRecord | null>(null)

<AttachmentUpload
  usage="notices"
  label="Attachment (optional)"
  onAttached={(record) => {
    setFileId(record.id)
    setAttachmentRecord(record)
  }}
  onClear={() => {
    setFileId(null)
    setAttachmentRecord(null)
  }}
  initialValue={attachmentRecord}
/>

// Then in form submission:
const payload = { title, ..., file_id: fileId }
```

---

## 8. Files Updated

### Backend
| File | Change |
|------|--------|
| `database/migrations/012_dual_attachment_support.sql` | NEW — DB migration |
| `src/utils/urlValidator.js` | NEW — URL validation utility |
| `src/modules/files/files.service.js` | Extended with `registerExternalLink()`, `updateExternalLink()`, updated `uploadFile()`, `listFiles()`, `deleteFile()` |
| `src/modules/files/files.controller.js` | Added `registerLink()`, `updateLink()` handlers |
| `src/modules/files/files.routes.js` | Added `POST /link`, `PATCH /link/:id` routes |

### Frontend
| File | Change |
|------|--------|
| `src/api/index.ts` | Extended `filesAPI` with `registerLink()`, `updateLink()`, `getOne()`, `delete()`. New `AttachmentRecord` type. |
| `src/components/admin/AttachmentUpload.tsx` | NEW — reusable dual upload component |
| `src/pages/admin/AdminNotices.tsx` | Updated form — uses `AttachmentUpload`, passes `file_id` |
| `src/pages/admin/AdminDownloads.tsx` | Updated — real API + `AttachmentUpload` |
| `src/pages/admin/AdminTenders.tsx` | Updated — real API + `AttachmentUpload` |
| `src/pages/admin/AdminEvents.tsx` | Updated — `AttachmentUpload` for cover image |
| `src/pages/admin/AdminNews.tsx` | Updated — `AttachmentUpload` for news image |
| `src/pages/admin/AdminGallery.tsx` | Updated — real API + `AttachmentUpload` for cover |
| `src/pages/exam/ExamNotices.tsx` | Updated — `AttachmentUpload` replaces plain URL input |

---

## 9. Modules Covered

| Module | Attachment Field | Usage Config |
|--------|-----------------|-------------|
| Notices | `file_id` | `notices` (PDF, Word, Image, 10MB) |
| Downloads | `file_id` | `downloads` (PDF, Word, ZIP, 25MB) |
| Tenders | `file_id` | `tenders` (PDF, Word, 10MB) |
| Events | `cover_image_file_id` | `events` (Images, 2MB) |
| News | `image_file_id` | `gallery` (Images, 2MB) |
| Gallery | `file_id` | `gallery` (Images, 2MB) |
| Exam Notices | `file_id` | `exam` (PDF, 10MB) |
| Faculty | `profile_image_file_id` | `faculty` (Images, 2MB) |
| Departments | `image_file_id` | `departments` (Images, 2MB) |

---

## 10. Chatbot / Search Retrieval

Both attachment types expose `file_url` as a single unified field.
The chatbot retrieval system (`src/modules/chat/`) should:

```javascript
// For FILE type: file_url = cloudinary/local URL
// For EXTERNAL_LINK: file_url = external_url (same value)
// Both types always have a usable file_url

const url = attachment.file_url  // Works for BOTH types
```

For RAG indexing of PDFs:
- **FILE type**: Fetch from `file_url` and parse
- **EXTERNAL_LINK (PDF)**: `file_type = 'application/pdf'` — can be fetched and parsed the same way
- **EXTERNAL_LINK (Google Drive)**: Must use Google Drive API or embed viewer

---

## 11. Security Protections

| Attack | Protection |
|--------|-----------|
| Malicious uploads | MIME type + extension allowlist per usage |
| Large file DoS | 25 MB global ceiling + usage-specific limits |
| SSRF via external links | Private IP ranges blocked in `urlValidator.js` |
| Metadata endpoint abuse | `169.254.169.254` explicitly blocked |
| URL shortener obfuscation | Popular shorteners blocked |
| Phishing via link | Blocked domain list (extensible) |
| Unauthorized access | Owner + CENTRAL_ADMIN enforced in service layer |
| File path traversal | `sanitizeFilename()` strips special chars |
| Executable uploads | MIME allowlist prevents `.exe`, `.sh`, etc. |

---

## 12. Admin UI Experience

Admins see:
1. **Mode toggle**: Upload File / External Link (tab buttons)
2. **After attachment**: Badge showing "FILE" or "External Link" + file name + size (if file)
3. **Attachment actions**: Open link (external), Remove/replace
4. **Table columns**: Attachment column shows type icon + clickable link

---

## 13. Running the Migration

```bash
# 1. Apply DB migration
cd GS-Website/backend
mysql -u root -p college_website < database/migrations/012_dual_attachment_support.sql

# 2. Restart backend
npm run dev

# 3. Test new endpoint
curl -X POST http://localhost:8000/api/v1/files/link \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "external_url": "https://www.sgsits.ac.in/syllabus.pdf",
    "original_name": "SGSITS Syllabus",
    "usage": "downloads"
  }'
```

---

## 14. Extending to New Modules

To add dual attachment support to a new module:

**Backend:**
1. Add `file_id INT NULL` FK to the module table (already done for most)
2. Accept `file_id` in the create/update schema
3. No other changes needed — the files table handles everything

**Frontend:**
1. Import `AttachmentUpload` and `AttachmentRecord`
2. Add `file_id` state and `attachmentRecord` state to your form
3. Render `<AttachmentUpload usage="yourUsage" onAttached={...} onClear={...} />`
4. Include `file_id` in the API payload

That's it. ~15 lines of code per new form.
