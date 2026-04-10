import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSeoOverride } from '../contexts/SeoOverrideContext'
import { absolutePageUrl, getSiteOrigin } from '../utils/siteUrl'

function upsertMeta(attr, key, content) {
  const sel = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`
  let el = document.head.querySelector(sel)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** 仅列表/静态页；详情页由 `useSeoOverride` 提供标题。顺序：先匹配更具体的路径。 */
const ROUTE_TITLE_KEYS = [
  [/^\/community\/qa\/?$/, 'community.qa'],
  [/^\/community\/buddies/, 'community.buddies'],
  [/^\/community\/?$/, 'community.title'],
  [/^\/destinations\/?$/, 'common.destinations'],
  [/^\/articles\/?$/, 'common.articles'],
  [/^\/favorites/, 'common.favorites'],
  [/^\/board/, 'common.board'],
  [/^\/membership/, 'commerce.membership'],
  [/^\/about/, 'footer.about'],
]

function resolveRouteTitleKey(pathname) {
  const path = pathname || '/'
  for (const [re, key] of ROUTE_TITLE_KEYS) {
    if (re.test(path)) return key
  }
  return null
}

function fallbackDetailListTitle(pathname, t) {
  if (/^\/articles\/[^/]+\/?$/.test(pathname)) {
    return t('seo.pageTitleTemplate', {
      page: t('common.articles'),
      site: t('common.siteName'),
    })
  }
  if (/^\/destinations\/[^/]+\/?$/.test(pathname)) {
    return t('seo.pageTitleTemplate', {
      page: t('common.destinations'),
      site: t('common.siteName'),
    })
  }
  if (/^\/community\/qa\/[^/]+\/?$/.test(pathname)) {
    return t('seo.pageTitleTemplate', {
      page: t('community.qa'),
      site: t('common.siteName'),
    })
  }
  return null
}

export default function SeoHead() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const { override } = useSeoOverride()

  const defaultTitle = useMemo(() => {
    if (!pathname || pathname === '/') return t('seo.title')
    const routeKey = resolveRouteTitleKey(pathname)
    if (routeKey) {
      return t('seo.pageTitleTemplate', {
        page: t(routeKey),
        site: t('common.siteName'),
      })
    }
    const interim = fallbackDetailListTitle(pathname, t)
    if (interim) return interim
    return t('seo.pageTitleTemplate', {
      page: t('notFound.pageTitle'),
      site: t('common.siteName'),
    })
  }, [pathname, t, i18n.language])

  const documentTitle = override?.title || defaultTitle
  const metaDescription = override?.description || t('seo.description')
  const canonicalHref = getSiteOrigin() ? absolutePageUrl(pathname) : ''

  useEffect(() => {
    document.title = documentTitle
    upsertMeta('name', 'description', metaDescription)
    upsertMeta('name', 'keywords', t('seo.keywords'))
    upsertMeta('property', 'og:title', documentTitle)
    upsertMeta('property', 'og:description', metaDescription)
    if (canonicalHref) {
      upsertMeta('property', 'og:url', canonicalHref)
    } else {
      const ogUrl = document.head.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.remove()
    }
    upsertCanonical(canonicalHref || null)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', documentTitle)
    upsertMeta('name', 'twitter:description', metaDescription)
    upsertMeta('property', 'og:locale', i18n.language === 'zh-CN' ? 'zh_CN' : 'en_US')
  }, [documentTitle, metaDescription, canonicalHref, t, i18n.language])

  return null
}
