# SGSITS Frontend — Claude Code Context

## What this project is

React + Vite + TypeScript + Tailwind CSS frontend for the **Shri G. S. Institute of Technology & Science, Indore** college website. It has two distinct surfaces:

1. **Public website** — 180+ pages browsable by anyone (about, academics, departments, placements, facilities, etc.)
2. **Staff dashboards** — role-gated portals for Central Admin, HOD, Teacher, Exam Controller, Placement Officer

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Language | TypeScript 6 |
| Routing | React Router v7 (file-based lazy routes) |
| State | Zustand (adminStore, uiStore, pageCacheStore, previewStore) |
| Server state | TanStack React Query v5 |
| Styling | Tailwind CSS v4 + custom tokens |
| Icons | lucide-react |
| Animation | framer-motion |
| HTTP | axios via `src/api/client.ts` |

## Repository layout

```
sgsits-frontend/
├── src/
│   ├── api/            # Axios client — single instance, JWT attach
│   ├── components/
│   │   ├── admin/      # Protected-route guards + CMS admin panels
│   │   ├── global/     # Header, Footer, Chatbot, Breadcrumbs, PageSeo, ErrorBoundary
│   │   ├── layout/     # MainLayout, AdminLayout, HodLayout, FacultyLayout, ExamLayout, PlacementLayout
│   │   └── ui/         # Skeleton.tsx — all shimmer primitives
│   ├── pages/
│   │   ├── about/      # ~12 pages
│   │   ├── academics/  # ~12 pages
│   │   ├── admin/      # ~20 admin CRUD pages
│   │   ├── departments/ # listing + dynamic detail
│   │   ├── exam/       # Exam Controller dashboard pages
│   │   ├── facilities/ # ~8 pages
│   │   ├── hod/        # HOD dashboard pages
│   │   ├── placement/  # Public + Placement Officer dashboard
│   │   ├── students/   # Campus Life pages
│   │   ├── teacher/    # Teacher dashboard pages
│   │   └── ...         # contact, home, login, policy, etc.
│   ├── routes/
│   │   └── routes.tsx  # Single file — all routes, all lazy imports, all Suspense wrappers
│   ├── services/       # One file per domain — thin API wrappers, all fallback to defaults
│   ├── store/          # Zustand slices
│   └── types/          # Shared TypeScript interfaces
├── tailwind.config.js  # Brand color tokens
└── index.html          # Static title fallback
```

## Layouts and when they apply

| Layout | Route prefix | Auth guard |
|--------|-------------|------------|
| `MainLayout` | all public routes | none |
| `SidebarLayout` | department detail sidebar | none |
| `AdminLayout` | `/dashboard/central-admin/*` | `AdminProtectedRoute` |
| `HodLayout` | `/dashboard/hod/*` | `HodProtectedRoute` |
| `FacultyLayout` | `/dashboard/teacher/*` | `FacultyProtectedRoute` |
| `ExamLayout` | `/dashboard/exam/*` | `ExamProtectedRoute` |
| `PlacementLayout` | `/dashboard/placement/*` | `PlacementProtectedRoute` |

## Service layer rules

- Every service lives in `src/services/`. Pages **never** call `apiClient` directly.
- Every service exports `*Defaults` / `*Default` constants used as initial `useState` values — this ensures zero-flash first render.
- Backend endpoint: `GET|PUT /api/v1/...`
- CMS settings endpoint pattern: `GET|PUT /api/v1/settings/cms/<sectionKey>`
- All services catch fetch errors and return their default — pages never see a rejected promise.

## Skeleton loader rules

The skeleton system lives entirely in `src/components/ui/Skeleton.tsx`.

**Always use the existing primitives — never write inline `animate-pulse` divs.**

```tsx
// CORRECT
import { SkeletonPage, SkeletonTable, SkeletonCard } from '../components/ui/Skeleton'
{loading ? <SkeletonPage /> : <RealContent />}

// WRONG — don't do this
{loading && <div className="animate-pulse bg-gray-200 h-4 w-full" />}
```

Available exports: `Sk`, `SkeletonStatCard`, `SkeletonTable`, `SkeletonEventRow`, `SkeletonDeptCard`, `SkeletonDeptGrid`, `SkeletonCard`, `SkeletonProfile`, `SkeletonListItem`, `SkeletonNewsRow`, `SkeletonBanner`, `SkeletonForm`, `SkeletonQuickAction`, `SkeletonFacultyCard`, `SkeletonPlacementRow`, `SkeletonPage`, `SkeletonNavCard`, `SkeletonNavGrid`, `SkeletonSimpleStat`

## Color token rules

**Always use design tokens — never hardcode hex values.**

```tsx
// CORRECT
className="text-brand-burgundy bg-brand-gold border-brand-light"
// or via CSS vars
className="text-primary bg-accent"

// WRONG — never do this
className="text-[#0b2545] bg-[#bfa15f]"
```

| Token | Hex | Tailwind class |
|-------|-----|---------------|
| Navy / Primary | `#0b2545` | `brand-burgundy` / `primary` |
| Gold / Accent | `#bfa15f` | `brand-gold` / `accent` |
| Light bg | `#f7f8fa` | `brand-light` |
| Card bg | `#ffffff` | `brand-card` |

## Typography rules

Use Tailwind's built-in scale — never arbitrary pixel sizes.

```tsx
// CORRECT
className="text-xs text-sm text-base text-lg text-xl text-2xl"

// WRONG
className="text-[10px] text-[11px] text-[13.5px]"
```

Font families: `font-sans` (Inter) for body/UI, `font-display` (Lora serif) for headings.

## Container width standard

Every page uses this exact wrapper — no exceptions:

```tsx
<div className="max-w-[1400px] mx-auto px-4 lg:px-12">
```

## Error handling rules

**Never use `alert()` or `console.log()` in page/component code.**

```tsx
// CORRECT — use toast (or any notification primitive)
import toast from 'react-hot-toast'
toast.error('Failed to save changes.')

// WRONG
alert('Failed to save changes.')
console.log('[CMS] Saving item...')
```

## Auth / store

`useAdminStore` (Zustand + persist) holds `{ token, user }`. Token is persisted to `localStorage` under key `sgsits-admin-auth`. Role checks: `isAdmin()`, `isFaculty()`. Logout = `clearAuth()` — no server-side invalidation.

`useUIStore` holds: `mobileMenuOpen`, `alertsModalOpen`, `fontSize` (`sm|base|lg`), `highContrast`, `pageLoading`.

## Known issues (from audit — do not perpetuate)

- Several pages have hardcoded `MOCK_*` arrays instead of real API calls (ExamAcademicCalendar, ExamResults, ExamDownloads, TeacherPublications)
- The `CodeOfConduct.tsx` download button and `Header.tsx` search are `alert()` placeholders
- Weather in `MainLayout` footer is hardcoded ("35°C | Scattered clouds") — not a real API

## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
```

Backend must be running at `http://localhost:5000` (or whatever `VITE_API_BASE_URL` points to in `.env.local`).
