/**
 * All user-facing timestamps must display in Asia/Kolkata (IST, UTC+5:30).
 * Never use toLocaleString() without an explicit timeZone option — it falls back
 * to the browser/OS timezone, which differs across machines and causes the
 * double-offset bug (server stores IST, mysql2 reads as UTC, browser adds +5:30 again).
 */

const IST_ZONE = 'Asia/Kolkata'

function getParts(d: Date): Record<string, string> {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone:  IST_ZONE,
    year:      'numeric',
    month:     'numeric',
    day:       '2-digit',
    hour:      'numeric',
    minute:    '2-digit',
    hour12:    true,
  }).formatToParts(d)
  return Object.fromEntries(parts.map(p => [p.type, p.value]))
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

/** "03 Jun 2026, 10:48 PM IST" */
export function formatInIST(ts: string | Date): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts
  if (isNaN(d.getTime())) return '—'
  const p = getParts(d)
  const month = MONTHS[parseInt(p.month) - 1]
  return `${p.day} ${month} ${p.year}, ${p.hour}:${p.minute} ${p.dayPeriod.toUpperCase()} IST`
}

/** "03 Jun 2026" */
export function formatDateOnlyIST(ts: string | Date): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts
  if (isNaN(d.getTime())) return '—'
  const p = getParts(d)
  const month = MONTHS[parseInt(p.month) - 1]
  return `${p.day} ${month} ${p.year}`
}

/** "10:48 PM IST" */
export function formatTimeOnlyIST(ts: string | Date): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts
  if (isNaN(d.getTime())) return '—'
  const p = getParts(d)
  return `${p.hour}:${p.minute} ${p.dayPeriod.toUpperCase()} IST`
}

/** "10:48 PM" — no suffix, for use inside timeline where IST is implicit */
export function formatTimeShort(ts: string | Date): string {
  const d = typeof ts === 'string' ? new Date(ts) : ts
  if (isNaN(d.getTime())) return '—'
  const p = getParts(d)
  return `${p.hour}:${p.minute} ${p.dayPeriod.toUpperCase()}`
}
