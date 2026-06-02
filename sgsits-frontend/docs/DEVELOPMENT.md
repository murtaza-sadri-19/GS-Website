# Development Guide

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- Backend running (see `GS-Website/backend/`)

## Setup

```bash
cd GS-Website/sgsits-frontend
npm install
cp .env.local.example .env.local   # if example exists, else create manually
```

`.env.local` minimum content:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running

```bash
npm run dev        # Dev server → http://localhost:5173 (hot reload)
npm run build      # Production build → dist/
npm run preview    # Serve the dist/ build locally
npm run typecheck  # TypeScript check (no emit)
npm run lint       # ESLint
```

---

## Adding a New Public Page

### 1. Create the page file

```
src/pages/<section>/MyPage.tsx
```

### 2. Register the route in `routes.tsx`

```tsx
// At the top, add lazy import
const MyPage = lazy(() => import('../pages/<section>/MyPage'))

// In the route tree under the appropriate layout/parent:
{
  path: 'my-page',
  element: <S><MyPage /></S>,
  handle: bc('My Page Label'),
},
```

`bc()` is a helper defined in `routes.tsx`: `const bc = (label: string) => ({ breadcrumb: label })`.
`<S>` is the Suspense wrapper defined at the top of routes.tsx.

### 3. Write the page

```tsx
import React, { useState, useEffect } from 'react'
import PageSeo from '../../components/global/PageSeo'
import { SkeletonPage } from '../../components/ui/Skeleton'
import { myService, myDefaults } from '../../services/myService'

const MyPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(myDefaults)

  useEffect(() => {
    myService.getData().then(d => {
      setData(d)
      setLoading(false)
    })
  }, [])

  return (
    <>
      <PageSeo pageKey="section/my-page" />

      {loading ? (
        <SkeletonPage />
      ) : (
        <div className="animate-fade-in">
          <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-10">
            <h1 className="font-display text-3xl font-bold text-brand-burgundy mb-4">
              {data.title}
            </h1>
            {/* page content */}
          </div>
        </div>
      )}
    </>
  )
}

export default MyPage
```

### 4. Add nav link (if needed)

Edit `src/services/navService.ts` — the `localNavItems` array. Or configure via Admin → CMS → Navigation.

---

## Adding a New Dashboard Page

### 1. Create the page file

```
src/pages/<role>/MyDashPage.tsx
```

Standard dashboard page pattern:

```tsx
import React, { useState, useEffect } from 'react'
import { SkeletonTable } from '../../components/ui/Skeleton'
import { myService } from '../../services/myService'

const MyDashPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<MyType[]>([])

  useEffect(() => {
    myService.getAll().then(data => {
      setItems(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold text-slate-900 mb-6">My Section</h1>

      {loading ? (
        <SkeletonTable rows={6} columns={3} />
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-sm font-medium">No items found.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          {/* table content */}
        </table>
      )}
    </div>
  )
}

export default MyDashPage
```

### 2. Register in routes.tsx under the correct layout group

```tsx
const MyDashPage = lazy(() => import('../pages/admin/MyDashPage'))

// Inside AdminLayout group:
{
  path: 'my-section',
  element: <S><MyDashPage /></S>,
  handle: bc('My Section'),
},
```

### 3. Add to sidebar nav

Each layout's sidebar nav is defined in its layout file (e.g. `AdminLayout.tsx`). Add an entry to the nav items array.

---

## Adding a New Service

```tsx
// src/services/myService.ts

import apiClient from '../api/client'

export interface MyType {
  id: number
  name: string
  // ...
}

// Defaults for immediate first-render — no flash, no undefined
export const myDefaults: MyType[] = []

export const getAll = async (): Promise<MyType[]> => {
  try {
    const res = await apiClient.get('/v1/my-endpoint')
    return res.data?.data ?? myDefaults
  } catch {
    return myDefaults
  }
}

export const create = async (payload: Omit<MyType, 'id'>): Promise<MyType> => {
  const res = await apiClient.post('/v1/my-endpoint', payload)
  return res.data.data
}

export const update = async (id: number, payload: Partial<MyType>): Promise<MyType> => {
  const res = await apiClient.put(`/v1/my-endpoint/${id}`, payload)
  return res.data.data
}

export const remove = async (id: number): Promise<void> => {
  await apiClient.delete(`/v1/my-endpoint/${id}`)
}

export const myService = { getAll, create, update, remove }
export default myService
```

---

## Adding a CMS Section

CMS sections are key-value stores in the backend under `GET|PUT /api/v1/settings/cms/<key>`.

```tsx
// src/services/myContentService.ts

import { getCmsSection, saveCmsSection } from './settingsService'

export interface MyContent {
  heading: string
  body: string
}

const KEY = 'my-section'

export const myContentDefaults: MyContent = {
  heading: '',
  body: '',
}

export const getMyContent = async (): Promise<MyContent> => {
  const data = await getCmsSection<MyContent>(KEY)
  return data ? { ...myContentDefaults, ...data } : myContentDefaults
}

export const saveMyContent = async (data: MyContent): Promise<void> => {
  await saveCmsSection(KEY, data)
}
```

Then wire it into the Admin Settings UI under `AdminStaticPages.tsx` or create a dedicated admin page.

---

## Error Handling Rules

**Never use `alert()`. Always use a toast or inline error state.**

```tsx
// ✅ Inline error state
const [error, setError] = useState('')

const handleSubmit = async () => {
  try {
    await myService.save(formData)
    setError('')
    // show success
  } catch (e) {
    setError('Failed to save. Please try again.')
  }
}

// In JSX:
{error && (
  <p className="text-sm text-red-600 mt-2">{error}</p>
)}

// ✅ Or use a toast library
import toast from 'react-hot-toast'
toast.success('Saved successfully!')
toast.error('Failed to save.')
```

**Never use `console.log()` in component or service code.**
Use `console.error()` only for unexpected catch blocks:

```tsx
catch (error) {
  console.error('[MyService] Failed to load data:', error)
  return defaults
}
```

---

## State Management Conventions

### When to use `useState` + `useEffect`

Simple page-level data fetching that doesn't need caching:

```tsx
const [data, setData] = useState(defaults)
const [loading, setLoading] = useState(true)

useEffect(() => {
  myService.getData().then(d => {
    setData(d)
    setLoading(false)
  })
}, [])
```

### When to use React Query

Data that benefits from caching, refetching, or is shared across components:

```tsx
import { useQuery } from '@tanstack/react-query'

const { data, isLoading } = useQuery({
  queryKey: ['my-data'],
  queryFn: () => myService.getData(),
})
```

### When to use Zustand

Global state that must survive navigation or be accessed from multiple unrelated components:
- Auth: `useAdminStore`
- UI state (mobile menu, font size, contrast): `useUIStore`
- CMS preview data: `previewStore`
- Page cache: `pageCacheStore`

---

## Common Patterns

### Empty State

Every list/table that can be empty needs an empty state:

```tsx
{items.length === 0 ? (
  <div className="text-center py-16">
    <div className="text-slate-300 mb-3">
      <InboxIcon className="w-10 h-10 mx-auto" />
    </div>
    <p className="text-sm font-semibold text-slate-500">No items yet</p>
    <p className="text-xs text-slate-400 mt-1">Items will appear here once added.</p>
  </div>
) : (
  <ItemList items={items} />
)}
```

### Confirmation Before Destructive Action

```tsx
const handleDelete = async (id: number) => {
  if (!window.confirm('Delete this item? This cannot be undone.')) return
  try {
    await myService.remove(id)
    setItems(prev => prev.filter(i => i.id !== id))
  } catch {
    // show error
  }
}
```

### Optimistic Updates

```tsx
// Remove from local state immediately, rollback on error
const handleDelete = async (id: number) => {
  setItems(prev => prev.filter(i => i.id !== id))
  try {
    await myService.remove(id)
  } catch {
    setItems(prev => [...prev, deletedItem]) // rollback
  }
}
```

### Form with Loading State

```tsx
const [saving, setSaving] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setSaving(true)
  try {
    await myService.save(formData)
  } finally {
    setSaving(false)
  }
}

// In JSX:
<button type="submit" disabled={saving}>
  {saving ? 'Saving...' : 'Save Changes'}
</button>
```

---

## Code Style

- **No comments** unless the *why* is non-obvious (hidden constraint, subtle invariant, workaround)
- No multi-line comment blocks or JSDoc paragraphs
- Prefer named exports over default exports for utilities and services
- One component per file; file name matches component name
- Use `type` not `interface` for union types; use `interface` for object shapes
- No `any` in new code — use `unknown` and narrow, or define the type

---

## TypeScript Conventions

```tsx
// Component props
interface MyProps {
  title: string
  count?: number
  onAction: (id: number) => void
}

// Discriminated unions for state
type LoadState =
  | { status: 'loading' }
  | { status: 'success'; data: MyType[] }
  | { status: 'error'; message: string }

// API response shape (backend returns { success, data, message })
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
```

---

## Testing

No test setup exists yet. When adding tests, use:
- **Vitest** (already compatible with Vite) for unit tests
- **React Testing Library** for component tests
- **Playwright** for E2E

Critical paths to test first:
1. Auth flow (login → token stored → protected route accessible)
2. Form submission (validation, success, error)
3. Data fetching (loading state → success state → empty state)

---

## Git Conventions

Branch naming:
- `feat/add-placement-records-skeleton`
- `fix/header-title-undefined`
- `refactor/standardize-card-spacing`
- `docs/update-architecture`

Commit messages:
```
feat: add skeleton loader to PlacementRecord page
fix: use correct SeoMeta field names in PageSeo (title not pageTitle)
refactor: replace alert() with toast in TeacherLeaves
```

---

## Known Issues & Tech Debt

See the full audit report for details. Top items:

| Priority | Issue | File(s) |
|----------|-------|---------|
| CRITICAL | `alert()` used for error handling | 9 files |
| CRITICAL | `console.log` in production | AdminNews, AdminNotices, CmsLivePreviewPane |
| CRITICAL | `href="#"` broken links | CodeOfConduct, TeqipPage |
| HIGH | Mock data arrays (not connected to API) | ExamAcademicCalendar, ExamResults, ExamDownloads |
| HIGH | Hardcoded hex colors instead of tokens | ~95% of files |
| HIGH | Arbitrary text sizes (`text-[10px]`) | ~95% of files |
| HIGH | Hardcoded stats (AboutLanding, PlacementRecord) | 2 files |
| MEDIUM | Missing empty states on list pages | 15+ pages |
| MEDIUM | Missing skeleton loaders | ContactUs, PlacementRecord, TelephoneDirectory |
| MEDIUM | Weather hardcoded in MainLayout footer | MainLayout.tsx:459 |
| LOW | "Website last updated on" hardcoded date | MainLayout.tsx:568 |
