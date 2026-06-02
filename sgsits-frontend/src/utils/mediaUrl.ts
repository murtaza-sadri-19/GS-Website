/**
 * mediaUrl — normalize image/file URLs for display.
 *
 * The backend stores full absolute URLs for local files
 * (e.g. http://localhost:8000/uploads/gallery/photo_123.jpg).
 * External links store their own absolute URLs.
 *
 * If a URL arrives as a relative /uploads/... path (legacy or edge case),
 * this prepends the backend origin so <img src> always works.
 */

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api')
  .replace(/\/api$/, '')
  .replace(/\/$/, '')

const FALLBACK_IMAGE = '/placeholder-image.svg'

export function mediaUrl(url: string | null | undefined, fallback = FALLBACK_IMAGE): string {
  if (!url || !url.trim()) return fallback
  const u = url.trim()
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  if (u.startsWith('/uploads/') || u.startsWith('uploads/')) {
    const rel = u.startsWith('/') ? u : `/${u}`
    return `${API_ORIGIN}${rel}`
  }
  return u
}

/**
 * Structured media field — stored in CMS JSON when sourceType tracking is needed.
 * Compatible with the `files` table: sourceType maps to attachment_type.
 */
export interface MediaField {
  sourceType: 'upload' | 'url'
  fileUrl: string | null
  externalUrl: string | null
}

/**
 * Resolve a media field that may be either:
 *  - A plain URL string (legacy CMS JSON or direct URL entry)
 *  - A MediaField object { sourceType, fileUrl, externalUrl }
 *
 * Returns the best accessible URL, or fallback if nothing is available.
 */
export function resolveMediaUrl(
  field: string | MediaField | null | undefined,
  fallback = FALLBACK_IMAGE
): string {
  if (!field) return fallback
  if (typeof field === 'string') return mediaUrl(field, fallback)
  if (field.sourceType === 'upload') return mediaUrl(field.fileUrl, fallback)
  if (field.sourceType === 'url')    return mediaUrl(field.externalUrl, fallback)
  return fallback
}

/**
 * Convert a plain URL string into a MediaField object.
 * Guesses sourceType from whether the URL is local or external.
 */
export function urlToMediaField(url: string | null | undefined): MediaField | null {
  if (!url || !url.trim()) return null
  const u = url.trim()
  const isLocal = u.startsWith('/uploads/') || u.startsWith('uploads/') ||
    u.includes('/uploads/')
  return isLocal
    ? { sourceType: 'upload', fileUrl: u, externalUrl: null }
    : { sourceType: 'url',    fileUrl: null, externalUrl: u }
}

export function isImageMime(mimeOrExt: string | null | undefined): boolean {
  if (!mimeOrExt) return false
  const s = mimeOrExt.toLowerCase()
  return (
    s.includes('image') ||
    s.endsWith('.jpg') || s.endsWith('.jpeg') ||
    s.endsWith('.png') || s.endsWith('.webp') || s.endsWith('.gif')
  )
}
