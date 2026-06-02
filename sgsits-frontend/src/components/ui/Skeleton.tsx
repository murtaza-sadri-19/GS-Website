/**
 * Skeleton loader system — reusable animated placeholders for every
 * major UI shape in the SGSITS website.
 *
 * All elements use the `.skeleton-shimmer` class (defined in index.css)
 * for a soft left-to-right shimmer.  Wrap loaded content in
 * `<div className="animate-fade-in">` for a smooth reveal transition.
 *
 * Usage pattern:
 *   {loading ? <SkeletonEventRow /> : <RealEventRow />}
 */

import React from 'react'

// ── Base shimmer primitive ────────────────────────────────────────────────────
// Uses Tailwind's animate-pulse + bg-slate-200 as the guaranteed-visible base.
// The .skeleton-shimmer class from index.css overlays the gradient shimmer on
// top — if CSS loads, you get the sweep; if not, you still get a gray pulse.

export const Sk: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse bg-slate-300 rounded skeleton-shimmer ${className}`}
  />
)

// ── Stat card ─────────────────────────────────────────────────────────────────
// Matches the stat cards in AdminDashboard (icon box + big number + label + desc)

export const SkeletonStatCard: React.FC = () => (
  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm" aria-hidden="true">
    <div className="flex items-center justify-between mb-3">
      <Sk className="w-9 h-9 rounded-lg" />
      <Sk className="w-4 h-4 rounded" />
    </div>
    <Sk className="w-12 h-7 rounded mb-2" />
    <Sk className="w-24 h-3 rounded mb-1.5" />
    <Sk className="w-36 h-2.5 rounded" />
  </div>
)

// ── Table rows ────────────────────────────────────────────────────────────────
// Matches CrudPage table layout.  Pass the number of data columns (excluding
// the "Actions" column which is added automatically when hasActions=true).

interface SkeletonTableProps {
  rows?: number
  columns?: number
  hasActions?: boolean
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 6,
  columns = 3,
  hasActions = true,
}) => {
  const colWidths = ['w-40', 'w-28', 'w-20', 'w-24', 'w-16']

  return (
    <div className="overflow-x-auto" aria-hidden="true">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Sk className="h-3 w-20 rounded" />
              </th>
            ))}
            {hasActions && (
              <th className="px-4 py-3 text-right">
                <Sk className="h-3 w-14 rounded ml-auto" />
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c} className="px-4 py-3">
                  <Sk className={`h-3.5 rounded ${colWidths[c % colWidths.length]}`} />
                </td>
              ))}
              {hasActions && (
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Sk className="w-7 h-7 rounded" />
                    <Sk className="w-7 h-7 rounded" />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Event / Notice / Tender list row ─────────────────────────────────────────
// Matches EventsPage / TendersPage / Notices list row layout

export const SkeletonEventRow: React.FC = () => (
  <div className="bg-white rounded-md p-4 border border-slate-200 shadow-sm" aria-hidden="true">
    <div className="flex items-start justify-between gap-4">
      <div className="flex-grow space-y-2">
        <div className="flex items-center gap-2">
          <Sk className="h-3.5 w-44 rounded" />
          <Sk className="h-4 w-16 rounded-full" />
        </div>
        <Sk className="h-3 w-72 rounded" />
        <Sk className="h-3 w-28 rounded" />
      </div>
      <Sk className="h-3 w-20 rounded shrink-0 mt-1" />
    </div>
  </div>
)

// ── Department grid card ──────────────────────────────────────────────────────
// Matches DepartmentLanding card layout (name + HOD + program badges + faculty count)

export const SkeletonDeptCard: React.FC = () => (
  <div className="bg-white rounded border border-slate-200 p-5 flex flex-col" aria-hidden="true">
    <div className="flex items-start justify-between gap-2 mb-3">
      <Sk className="h-4 w-36 rounded flex-grow" />
      <Sk className="w-4 h-4 rounded shrink-0 mt-0.5" />
    </div>
    <Sk className="h-3 w-32 rounded mb-3" />
    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
      <div className="flex gap-1">
        <Sk className="h-4 w-8 rounded" />
        <Sk className="h-4 w-8 rounded" />
        <Sk className="h-4 w-10 rounded" />
      </div>
      <Sk className="h-3 w-16 rounded" />
    </div>
  </div>
)

// ── Department section grid ───────────────────────────────────────────────────
// Mirrors the DeptGrid layout (section header + n×3 card grid)

interface SkeletonDeptGridProps {
  title: string
  count?: number
}

export const SkeletonDeptGrid: React.FC<SkeletonDeptGridProps> = ({ title, count = 3 }) => (
  <div aria-hidden="true">
    <div className="flex items-center gap-3 mb-4">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
      <div className="flex-grow h-px bg-slate-200" />
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonDeptCard key={i} />
      ))}
    </div>
  </div>
)

// ── Generic content card ──────────────────────────────────────────────────────
// Image placeholder + title + body lines + button

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`bg-white rounded-lg border border-slate-200 p-5 shadow-sm ${className}`}
    aria-hidden="true"
  >
    <Sk className="h-40 w-full rounded-md mb-4" />
    <Sk className="h-4 w-3/4 rounded mb-2" />
    <Sk className="h-3 w-full rounded mb-1.5" />
    <Sk className="h-3 w-5/6 rounded mb-4" />
    <Sk className="h-8 w-28 rounded-lg" />
  </div>
)

// ── Profile card ──────────────────────────────────────────────────────────────
// Circular avatar + name + role + bio paragraphs

export const SkeletonProfile: React.FC = () => (
  <div className="flex items-start gap-5 p-6" aria-hidden="true">
    <Sk className="w-20 h-20 rounded-full shrink-0" />
    <div className="flex-grow space-y-3">
      <Sk className="h-5 w-48 rounded" />
      <Sk className="h-3.5 w-32 rounded" />
      <div className="space-y-1.5 pt-1">
        <Sk className="h-3 w-full rounded" />
        <Sk className="h-3 w-5/6 rounded" />
        <Sk className="h-3 w-4/6 rounded" />
      </div>
    </div>
  </div>
)

// ── List item ─────────────────────────────────────────────────────────────────
// Small icon box + title/subtitle + trailing meta

export const SkeletonListItem: React.FC = () => (
  <div className="flex items-center gap-4 py-3 border-b border-slate-100" aria-hidden="true">
    <Sk className="w-8 h-8 rounded-lg shrink-0" />
    <div className="flex-grow space-y-1.5">
      <Sk className="h-3.5 w-40 rounded" />
      <Sk className="h-3 w-56 rounded" />
    </div>
    <Sk className="h-3 w-16 rounded shrink-0" />
  </div>
)

// ── News / notice row ─────────────────────────────────────────────────────────
// Badge + date header, then title + 2 body lines

export const SkeletonNewsRow: React.FC = () => (
  <div className="bg-white rounded-md p-4 border border-slate-200 shadow-sm space-y-2" aria-hidden="true">
    <div className="flex items-center gap-2">
      <Sk className="h-4 w-14 rounded-full" />
      <Sk className="h-3 w-24 rounded" />
    </div>
    <Sk className="h-4 w-3/4 rounded" />
    <Sk className="h-3 w-full rounded" />
    <Sk className="h-3 w-2/3 rounded" />
  </div>
)

// ── Hero / banner section ─────────────────────────────────────────────────────
// Full-width tall block with overlay-style title and subtitle

export const SkeletonBanner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`w-full rounded-xl overflow-hidden ${className}`}
    aria-hidden="true"
  >
    <Sk className="w-full h-64 md:h-80 rounded-none" />
    <div className="p-6 space-y-3 bg-white border border-t-0 border-slate-200 rounded-b-xl">
      <Sk className="h-6 w-64 rounded" />
      <Sk className="h-4 w-96 rounded" />
      <Sk className="h-4 w-80 rounded" />
      <div className="flex gap-3 pt-2">
        <Sk className="h-10 w-32 rounded-lg" />
        <Sk className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  </div>
)

// ── Form fields + submit ──────────────────────────────────────────────────────
// Stacked label + input groups with a submit button

export const SkeletonForm: React.FC<{ fields?: number }> = ({ fields = 4 }) => (
  <div className="space-y-5" aria-hidden="true">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-1.5">
        <Sk className="h-3 w-24 rounded" />
        <Sk className="h-10 w-full rounded" />
      </div>
    ))}
    <div className="flex gap-3 pt-2">
      <Sk className="h-10 w-28 rounded" />
      <Sk className="h-10 w-20 rounded" />
    </div>
  </div>
)

// ── Dashboard quick-action button ─────────────────────────────────────────────

export const SkeletonQuickAction: React.FC = () => (
  <div className="border border-slate-200 rounded-lg p-4 text-center bg-white" aria-hidden="true">
    <Sk className="w-5 h-5 rounded mx-auto mb-2" />
    <Sk className="h-3 w-20 rounded mx-auto" />
  </div>
)

// ── Faculty / people card ─────────────────────────────────────────────────────

export const SkeletonFacultyCard: React.FC = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm" aria-hidden="true">
    <div className="flex items-center gap-4 mb-4">
      <Sk className="w-14 h-14 rounded-full shrink-0" />
      <div className="flex-grow space-y-2">
        <Sk className="h-4 w-32 rounded" />
        <Sk className="h-3 w-24 rounded" />
      </div>
    </div>
    <Sk className="h-3 w-full rounded mb-1.5" />
    <Sk className="h-3 w-5/6 rounded mb-3" />
    <div className="flex gap-2">
      <Sk className="h-4 w-16 rounded-full" />
      <Sk className="h-4 w-16 rounded-full" />
    </div>
  </div>
)

// ── Placement stat row ────────────────────────────────────────────────────────

export const SkeletonPlacementRow: React.FC = () => (
  <div className="flex items-center justify-between py-3 px-4 border-b border-slate-100" aria-hidden="true">
    <div className="flex items-center gap-3">
      <Sk className="w-8 h-8 rounded-lg shrink-0" />
      <div className="space-y-1.5">
        <Sk className="h-3.5 w-36 rounded" />
        <Sk className="h-3 w-20 rounded" />
      </div>
    </div>
    <Sk className="h-5 w-20 rounded-full" />
  </div>
)

// ── Generic page content skeleton ─────────────────────────────────────────────
// Used as the Suspense fallback and wherever a page-level spinner was shown.
// Shows a header block + several content lines — looks like real page content loading.

export const SkeletonPage: React.FC = () => (
  <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8 space-y-8" aria-hidden="true">
    {/* Page header */}
    <div className="border-b border-slate-200 pb-6 space-y-3">
      <Sk className="h-3 w-28 rounded" />
      <Sk className="h-7 w-64 rounded" />
      <Sk className="h-4 w-96 max-w-full rounded" />
    </div>
    {/* Content rows */}
    <div className="space-y-3">
      {[100, 90, 95, 80, 85, 70, 88].map((w, i) => (
        <Sk key={i} className={`h-3.5 rounded`} style={{ width: `${w}%` }} />
      ))}
    </div>
    {/* Sub-section */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded border border-slate-200 bg-white p-5 space-y-2">
          <Sk className="w-9 h-9 rounded-lg mb-3" />
          <Sk className="h-4 w-3/4 rounded" />
          <Sk className="h-3 w-full rounded" />
          <Sk className="h-3 w-5/6 rounded" />
        </div>
      ))}
    </div>
  </div>
)

// ── Nav category card ─────────────────────────────────────────────────────────
// Matches NavCategoryPage card: icon box + title + 2 desc lines + arrow

export const SkeletonNavCard: React.FC = () => (
  <div className="rounded border border-slate-200 bg-white p-5 flex flex-col" aria-hidden="true">
    <Sk className="w-9 h-9 rounded-lg mb-3 shrink-0" />
    <Sk className="h-4 w-3/4 rounded mb-2" />
    <Sk className="h-3 w-full rounded mb-1" />
    <Sk className="h-3 w-4/5 rounded mb-1 flex-1" />
    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
      <Sk className="w-4 h-4 rounded" />
    </div>
  </div>
)

// ── Nav category grid ─────────────────────────────────────────────────────────
// Full skeleton for NavCategoryPage (header + search bar + card grid)

interface SkeletonNavGridProps {
  count?: number
}

export const SkeletonNavGrid: React.FC<SkeletonNavGridProps> = ({ count = 8 }) => (
  <div className="max-w-[1400px] mx-auto px-4 lg:px-12 py-8" aria-hidden="true">
    {/* Header */}
    <div className="border-b border-slate-200 pb-6 mb-8 space-y-3">
      <Sk className="h-3 w-32 rounded" />
      <Sk className="h-3 w-20 rounded" />
      <Sk className="h-8 w-64 rounded" />
      <Sk className="h-4 w-96 rounded" />
      <div className="flex gap-3 pt-1">
        <Sk className="h-9 w-36 rounded" />
        <Sk className="h-9 w-28 rounded" />
      </div>
    </div>
    {/* Search */}
    <Sk className="h-10 w-64 rounded mb-8" />
    {/* Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonNavCard key={i} />
      ))}
    </div>
  </div>
)

// ── Simple stat card ──────────────────────────────────────────────────────────
// Matches About/Department stat card: big number + label (no icon)

export const SkeletonSimpleStat: React.FC = () => (
  <div className="rounded border border-slate-200 bg-white p-4 text-center shadow-sm" aria-hidden="true">
    <Sk className="h-8 w-20 rounded mx-auto mb-2" />
    <Sk className="h-3 w-24 rounded mx-auto" />
  </div>
)

export default Sk
