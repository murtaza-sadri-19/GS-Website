# Design System

## Color Palette

All colors are defined as Tailwind tokens in `tailwind.config.js` and as CSS custom properties in `src/index.css`.

### Brand Colors

| Name | Token | Hex | Usage |
|------|-------|-----|-------|
| Navy / Primary | `brand-burgundy` / `primary` | `#0b2545` | Headings, primary UI, nav background, footer |
| Gold / Accent | `brand-gold` / `accent` | `#bfa15f` | Active states, highlights, borders, CTAs |
| Light Background | `brand-light` | `#f7f8fa` | Page backgrounds, alternating sections |
| Card Background | `brand-card` | `#ffffff` | Cards, panels, modals |

### Usage Rules

```tsx
// ✅ Always use tokens
<div className="bg-brand-burgundy text-white">...</div>
<span className="text-brand-gold">...</span>
<section className="bg-brand-light">...</section>

// CSS variable form (also valid)
<div className="bg-primary text-accent">...</div>

// ❌ Never hardcode hex values
<div className="bg-[#0b2545] text-[#bfa15f]">...</div>
```

### Opacity Modifiers

Use Tailwind's built-in opacity modifier syntax:

```tsx
bg-brand-burgundy/5    // 5% opacity navy
bg-brand-burgundy/10   // 10% opacity navy
text-brand-gold/70     // 70% opacity gold
border-brand-gold/30   // 30% opacity gold border
```

### Semantic Colors

| Purpose | Class |
|---------|-------|
| Success | `text-emerald-600` / `bg-emerald-50` |
| Error | `text-red-600` / `bg-red-50` |
| Warning | `text-amber-600` / `bg-amber-50` |
| Info | `text-sky-600` / `bg-sky-50` |
| Muted text | `text-slate-500` |
| Body text | `text-slate-800` |
| Subtle border | `border-slate-200` |

---

## Typography

### Font Families

| Family | Token | Usage |
|--------|-------|-------|
| Inter (sans-serif) | `font-sans` | All body text, UI elements, tables, forms |
| Lora (serif) | `font-display` | Page headings (h1, h2), hero titles |

### Type Scale

Use Tailwind's built-in scale **only** — never arbitrary pixel sizes.

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Labels, badges, captions, tiny metadata |
| `text-sm` | 14px | Secondary body, table cells, form help text |
| `text-base` | 16px | Primary body text |
| `text-lg` | 18px | Lead paragraphs, card titles |
| `text-xl` | 20px | Section sub-headings |
| `text-2xl` | 24px | Page section headings |
| `text-3xl` | 30px | Page headings |
| `text-4xl` | 36px | Hero headings |
| `text-5xl` | 48px | Landing page hero titles |

```tsx
// ✅ Correct
<h1 className="font-display text-4xl font-bold text-brand-burgundy">...</h1>
<p className="text-sm text-slate-600">...</p>
<span className="text-xs text-slate-400">...</span>

// ❌ Wrong
<h1 className="text-[38px] font-bold">...</h1>
<span className="text-[10px]">...</span>
```

### Heading Hierarchy

```tsx
// Page title (one per page)
<h1 className="font-display text-3xl lg:text-4xl font-bold text-brand-burgundy">

// Section heading
<h2 className="font-display text-2xl font-bold text-brand-burgundy">

// Sub-section heading
<h3 className="text-lg font-bold text-slate-900">

// Card title / label
<h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
```

---

## Spacing & Layout

### Page Container

Every page uses this exact container — no exceptions:

```tsx
<div className="max-w-[1400px] mx-auto px-4 lg:px-12">
  {/* page content */}
</div>
```

### Section Spacing

```tsx
// Between major page sections
<section className="py-12 lg:py-16">

// Within a section
<div className="space-y-6">   // vertical stack
<div className="gap-6">       // grid/flex gap
```

### Standard Grids

```tsx
// 3-column card grid (most common)
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

// 4-column grid
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

// 2-column with sidebar
<div className="grid lg:grid-cols-[1fr_300px] gap-8">
```

---

## Cards

### Standard Card

```tsx
<div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
  {/* content */}
</div>
```

### Properties

| Property | Value |
|----------|-------|
| Background | `bg-white` |
| Border | `border border-slate-200` |
| Border radius | `rounded-lg` (8px) |
| Padding | `p-5` (20px) |
| Shadow | `shadow-sm` resting, `shadow-md` on hover |
| Hover transition | `hover:shadow-md transition-shadow duration-200` |

### Elevated Card (for featured content)

```tsx
<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-premium">
```

### Accent Card (bordered with gold)

```tsx
<div className="bg-white border-l-4 border-brand-gold rounded-lg p-5 shadow-sm">
```

---

## Buttons

### Primary Button

```tsx
<button className="px-5 py-2.5 bg-brand-burgundy text-white text-sm font-semibold rounded-lg
  hover:bg-brand-burgundy/90 active:scale-[0.98] transition-all duration-150 shadow-sm">
  Submit
</button>
```

### Secondary Button

```tsx
<button className="px-5 py-2.5 border border-brand-burgundy text-brand-burgundy text-sm font-semibold
  rounded-lg hover:bg-brand-burgundy/5 transition-colors duration-150">
  Cancel
</button>
```

### Ghost / Text Button

```tsx
<button className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-brand-burgundy
  hover:bg-slate-50 rounded-md transition-colors duration-150">
  View All
</button>
```

### Danger Button

```tsx
<button className="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg
  hover:bg-red-700 transition-colors duration-150">
  Delete
</button>
```

### Icon Button (aria-label required)

```tsx
<button
  aria-label="Edit item"
  className="p-2 text-slate-400 hover:text-brand-burgundy hover:bg-slate-50 rounded-lg transition-colors"
>
  <Pencil className="w-4 h-4" />
</button>
```

### Button with Loading State

```tsx
<button disabled={loading} className="px-5 py-2.5 bg-brand-burgundy text-white text-sm font-semibold
  rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all">
  {loading ? 'Saving...' : 'Save'}
</button>
```

---

## Form Inputs

### Text Input

```tsx
<div className="space-y-1.5">
  <label className="block text-sm font-medium text-slate-700">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white
      focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy
      placeholder:text-slate-400 text-slate-800"
    placeholder="you@example.com"
  />
</div>
```

### Textarea

```tsx
<textarea
  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white
    focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy
    resize-none text-slate-800"
  rows={4}
/>
```

### Select

```tsx
<select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white
  focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy
  text-slate-800 cursor-pointer">
  <option>Option A</option>
</select>
```

### Input States

| State | Classes to add |
|-------|---------------|
| Error | `border-red-400 focus:border-red-500 focus:ring-red-500` |
| Success | `border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500` |
| Disabled | `disabled:opacity-60 disabled:cursor-not-allowed bg-slate-50` |

---

## Badges / Tags

```tsx
// Status badge
<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
  bg-emerald-50 text-emerald-700 border border-emerald-200">
  Active
</span>

// Category tag
<span className="px-2 py-0.5 rounded text-xs font-medium bg-brand-burgundy/10 text-brand-burgundy">
  B.Tech
</span>

// Gold accent tag
<span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-gold/10 text-brand-gold">
  Featured
</span>
```

---

## Skeleton Loaders

All skeleton primitives are in `src/components/ui/Skeleton.tsx`. The base primitive is `<Sk />`.

### Quick Reference

```tsx
import {
  Sk,                  // raw shimmer block — use with className for custom shapes
  SkeletonPage,        // full page placeholder (header + content rows + grid)
  SkeletonStatCard,    // dashboard stat card
  SkeletonTable,       // table with configurable rows/columns
  SkeletonCard,        // generic content card
  SkeletonNavCard,     // nav category card
  SkeletonNavGrid,     // full nav category page
  SkeletonEventRow,    // event / notice / tender list row
  SkeletonNewsRow,     // news row with badge + date
  SkeletonProfile,     // avatar + name + bio lines
  SkeletonFacultyCard, // faculty card with avatar
  SkeletonDeptCard,    // department card
  SkeletonDeptGrid,    // section of department cards
  SkeletonListItem,    // icon + title/subtitle + meta
  SkeletonBanner,      // hero / banner section
  SkeletonForm,        // stacked form fields
  SkeletonSimpleStat,  // big number + label
  SkeletonPlacementRow,// placement stat row
  SkeletonQuickAction, // dashboard quick-action button
} from '../components/ui/Skeleton'
```

### Pattern

```tsx
const [loading, setLoading] = useState(true)
const [data, setData] = useState(defaults)

useEffect(() => {
  myService.getData().then(d => {
    setData(d)
    setLoading(false)
  })
}, [])

return loading ? <SkeletonPage /> : <div className="animate-fade-in">...</div>
```

### Custom Shape

```tsx
// Sk accepts any className for size/shape
<Sk className="w-12 h-12 rounded-full" />   // avatar circle
<Sk className="h-4 w-3/4 rounded" />         // text line
<Sk className="h-40 w-full rounded-lg" />    // image placeholder
```

---

## Animations

### CSS Keyframes (defined in `index.css`)

| Name | Duration | Usage |
|------|----------|-------|
| `shimmer` | 1.8s ease-in-out infinite | Applied via `.skeleton-shimmer` class on all Sk elements |
| `fade-in` | 0.35s ease-out | Applied via `animate-fade-in` — wrap content after loading |

### Tailwind Utilities

```tsx
// Smooth content reveal after skeleton
<div className="animate-fade-in">
  {/* real content */}
</div>

// Slide in from right (mobile drawer)
<div className="animate-slide-in-right">

// Slide in from top (dropdown)
<div className="animate-in fade-in slide-in-from-top-1 duration-150">
```

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | subtle | Default card resting state |
| `shadow-md` | medium | Card hover state, dropdowns |
| `shadow-lg` | prominent | Modals, floating panels |
| `shadow-premium` | `0 8px 30px rgba(0,0,0,0.04)` | Featured/hero cards |
| `shadow-glass` | `0 8px 32px rgba(31,38,135,0.07)` | Glassmorphism panels |

---

## Borders & Radius

| Usage | Class |
|-------|-------|
| Inputs, small elements | `rounded` (4px) |
| Cards, panels | `rounded-lg` (8px) |
| Large cards, modals | `rounded-xl` (12px) |
| Pills, badges | `rounded-full` |
| Standard divider | `border-slate-200` |
| Subtle divider | `border-slate-100` |
| On dark bg | `border-white/10` |

---

## Responsive Breakpoints

Tailwind defaults (mobile-first):

| Prefix | Min-width | Device |
|--------|-----------|--------|
| (none) | 0px | Mobile |
| `sm:` | 640px | Large mobile / tablet portrait |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop / desktop |
| `xl:` | 1280px | Wide desktop |
| `2xl:` | 1536px | Ultrawide |

The nav switches from mobile drawer to desktop horizontal at `lg:` (1024px).

---

## Icons

Uses `lucide-react`. Import named exports:

```tsx
import { ChevronDown, Search, Menu, X, ArrowRight } from 'lucide-react'

// Standard sizes
<Search className="w-4 h-4" />   // small (inside inputs, badges)
<Menu className="w-5 h-5" />     // medium (nav icons)
<X className="w-6 h-6" />        // large (close buttons)
```

Always pair icon-only buttons with `aria-label`:

```tsx
<button aria-label="Close modal">
  <X className="w-5 h-5" />
</button>
```

---

## Accessibility Checklist

Before shipping any component:

- [ ] All `<img>` have descriptive `alt` text (not empty `alt=""` unless decorative)
- [ ] All icon-only `<button>` have `aria-label`
- [ ] All form inputs have an associated `<label>` (or `aria-label`)
- [ ] Modals have `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] Dropdowns/accordions have `aria-expanded` on the trigger
- [ ] Active nav items have `aria-current="page"`
- [ ] Interactive elements are reachable by keyboard (Tab, Enter, Space, Escape)
- [ ] Focus rings visible on focus (use `focus:ring-2 focus:ring-brand-burgundy focus:outline-none`)
- [ ] Color is not the only indicator of state (pair color with icon or text)
