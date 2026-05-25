/**
 * PageSeo — Dynamic SEO head tag injector
 *
 * Renders dynamic <title> and <meta> tags for each page.
 * All data is loaded from seoService (mock → future backend API).
 *
 * Usage:
 *   <PageSeo pageKey="home" />
 *   <PageSeo pageKey="about/institute" />
 *   <PageSeo pageKey="placement/tnp-cell" />
 *
 * Admin can configure per-page SEO via AdminStaticPages → SEO tab.
 */

import React, { useEffect, useState } from 'react'
import { seoService, defaultSeoMeta, type SeoMeta } from '../../services/seoService'

interface PageSeoProps {
  /** Unique page key — must match a key in seoData.ts / backend SEO config */
  pageKey: string
  /** Optional overrides — useful for dynamic pages (e.g., department detail) */
  overrides?: Partial<SeoMeta>
}

const PageSeo: React.FC<PageSeoProps> = ({ pageKey, overrides }) => {
  const [seo, setSeo] = useState<SeoMeta>(defaultSeoMeta)

  useEffect(() => {
    seoService.getPageSeo(pageKey).then((data) => {
      setSeo({ ...data, ...overrides })
    })
  }, [pageKey]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Apply overrides synchronously when they change ────────────────────────
  useEffect(() => {
    if (overrides) {
      setSeo((prev) => ({ ...prev, ...overrides }))
    }
  }, [overrides])

  // ── Mutate <head> tags ────────────────────────────────────────────────────
  useEffect(() => {
    // Page title
    document.title = seo.pageTitle

    // Meta description
    setMetaTag('name', 'description', seo.metaDescription)

    // Keywords
    if (seo.keywords) {
      setMetaTag('name', 'keywords', seo.keywords)
    }

    // Open Graph
    if (seo.ogTitle)       setMetaTag('property', 'og:title',       seo.ogTitle)
    if (seo.ogDescription) setMetaTag('property', 'og:description',  seo.ogDescription)
    if (seo.ogImage)       setMetaTag('property', 'og:image',        seo.ogImage)

    // Twitter Card
    if (seo.twitterCard) {
      setMetaTag('name', 'twitter:card',        seo.twitterCard)
      if (seo.ogTitle)       setMetaTag('name', 'twitter:title',       seo.ogTitle)
      if (seo.ogDescription) setMetaTag('name', 'twitter:description',  seo.ogDescription)
      if (seo.ogImage)       setMetaTag('name', 'twitter:image',        seo.ogImage)
    }

    // Canonical URL
    setCanonicalUrl(seo.canonicalUrl)
  }, [seo])

  // Component renders nothing — it only mutates <head>
  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setMetaTag(attrKey: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrKey}="${attrValue}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrKey, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonicalUrl(url?: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!url) {
    if (link) link.remove()
    return
  }
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

export default PageSeo
