import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSeoOverride } from '../contexts/SeoOverrideContext'
import {
  absolutePageUrl,
  getSiteOrigin,
  getDefaultOgImageUrl,
  toAbsoluteMediaUrl,
} from '../utils/siteUrl'

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

function removeMeta(attr, key) {
  const sel = attr === 'name' ? `meta[name="${key}"]` : `meta[property="${key}"]`
  document.head.querySelector(sel)?.remove()
}

function removeOgImages() {
  ;['og:image', 'og:image:secure_url'].forEach((k) => removeMeta('property', k))
  removeMeta('name', 'twitter:image')
}

function removeSeoHreflangLinks() {
  document.head.querySelectorAll('link[data-roamwise-hreflang]').forEach((el) => el.remove())
}

function upsertHreflang(hreflang, href) {
  const el = document.createElement('link')
  el.setAttribute('rel', 'alternate')
  el.setAttribute('hreflang', hreflang)
  el.setAttribute('href', href)
  el.setAttribute('data-roamwise-hreflang', '1')
  document.head.appendChild(el)
}

function removeOgLocaleAlternates() {
  document.head
    .querySelectorAll('meta[property="og:locale:alternate"]')
    .forEach((el) => el.remove())
}

/** 各列表/静态路由独立 description，避免全站重复 meta description */
const ROUTE_DESC_KEYS = [
  [/^\/plan\/?$/, 'seo.descPlanHub'],
  [/^\/globe\/?$/, 'seo.descPlanHub'],
  [/^\/map\/?$/, 'seo.descHome'],
  [/^\/trip-ai\/?$/, 'seo.descTripAi'],
  [/^\/map-hub\/?$/, 'seo.descMapHub'],
  [/^\/advisor\/?$/, 'seo.descAdvisor'],
  [/^\/ai\/?$/, 'seo.descAiTravelmate'],
  [/^\/library\/?$/, 'seo.descLibrary'],
  [/^\/steward\/?$/, 'seo.descSteward'],
  [/^\/routes\/?$/, 'seo.descArticles'],
  [/^\/budget\/?$/, 'seo.descBudgetCalculator'],
  [/^\/me\/?$/, 'seo.descMe'],
  [/^\/community\/qa\/?$/, 'seo.descCommunityQA'],
  [/^\/community\/buddies/, 'seo.descCommunityBuddies'],
  [/^\/community\/?$/, 'seo.descCommunity'],
  [/^\/destinations\/?$/, 'seo.descDestinations'],
  [/^\/articles\/?$/, 'seo.descArticles'],
  [/^\/favorites/, 'seo.descFavorites'],
  [/^\/board/, 'seo.descBoard'],
  [/^\/membership/, 'seo.descMembership'],
  [/^\/budget-calculator\/?$/, 'seo.descBudgetCalculator'],
  [/^\/china-readiness\/?$/, 'seo.descChinaReadiness'],
  [/^\/about/, 'seo.descAbout'],
  [/^\/privacy\/?$/, 'seo.descPrivacy'],
  [/^\/terms\/?$/, 'seo.descTerms'],
]

function resolveRouteDescription(pathname, t) {
  if (!pathname || pathname === '/') return t('seo.descHome')
  for (const [re, key] of ROUTE_DESC_KEYS) {
    if (re.test(pathname)) return t(key)
  }
  if (/^\/(?:articles|routes)\/[^/]+\/?$/.test(pathname)) return t('seo.descArticleDetail')
  if (/^\/destinations\/[^/]+\/?$/.test(pathname)) return t('seo.descDestinationDetail')
  if (/^\/community\/qa\/[^/]+\/?$/.test(pathname)) return t('seo.descCommunityQADetail')
  return t('seo.descFallback')
}

/** 仅列表/静态页；详情页由 `useSeoOverride` 提供标题。顺序：先匹配更具体的路径。 */
const ROUTE_TITLE_KEYS = [
  [/^\/plan\/?$/, 'common.navPlanHub'],
  [/^\/globe\/?$/, 'common.navPlanHub'],
  [/^\/map\/?$/, 'common.navMap'],
  [/^\/trip-ai\/?$/, 'common.navTripAi'],
  [/^\/map-hub\/?$/, 'common.navMapHub'],
  [/^\/advisor\/?$/, 'common.navAdvisor'],
  [/^\/ai\/?$/, 'common.navAiTravelmate'],
  [/^\/library\/?$/, 'common.navLibrary'],
  [/^\/steward\/?$/, 'common.navSteward'],
  [/^\/routes\/?$/, 'common.navRoutes'],
  [/^\/budget\/?$/, 'common.navBudget'],
  [/^\/me\/?$/, 'common.navMe'],
  [/^\/community\/qa\/?$/, 'community.qa'],
  [/^\/community\/buddies/, 'community.buddies'],
  [/^\/community\/?$/, 'community.title'],
  [/^\/destinations\/?$/, 'common.destinations'],
  [/^\/articles\/?$/, 'common.articles'],
  [/^\/favorites/, 'common.favorites'],
  [/^\/board/, 'common.board'],
  [/^\/membership/, 'commerce.membership'],
  [/^\/budget-calculator\/?$/, 'common.navBudgetCalculator'],
  [/^\/china-readiness\/?$/, 'chinaReadiness.title'],
  [/^\/about/, 'footer.about'],
  [/^\/privacy\/?$/, 'legal.privacyTitle'],
  [/^\/terms\/?$/, 'legal.termsTitle'],
]

function resolveRouteTitleKey(pathname) {
  const path = pathname || '/'
  for (const [re, key] of ROUTE_TITLE_KEYS) {
    if (re.test(path)) return key
  }
  return null
}

function fallbackDetailListTitle(pathname, t) {
  if (/^\/(?:articles|routes)\/[^/]+\/?$/.test(pathname)) {
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
  const { t } = useTranslation()
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
  }, [pathname, t])

  const documentTitle = override?.title || defaultTitle
  const metaDescription =
    override?.description || resolveRouteDescription(pathname, t)
  const canonicalHref = getSiteOrigin() ? absolutePageUrl(pathname) : ''
  const ogImageUrl = override?.image
    ? toAbsoluteMediaUrl(override.image) || getDefaultOgImageUrl()
    : getDefaultOgImageUrl()

  const ogType = /^\/(?:articles|routes)\/[^/]+\/?$/.test(pathname) ? 'article' : 'website'

  useEffect(() => {
    document.title = documentTitle
    upsertMeta('name', 'description', metaDescription)
    upsertMeta('name', 'keywords', t('seo.keywords'))
    upsertMeta('property', 'og:title', documentTitle)
    upsertMeta('property', 'og:description', metaDescription)
    upsertMeta('property', 'og:type', ogType)
    if (canonicalHref) {
      upsertMeta('property', 'og:url', canonicalHref)
    } else {
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }
    upsertCanonical(canonicalHref || null)
    if (ogImageUrl) {
      upsertMeta('property', 'og:image', ogImageUrl)
      upsertMeta('name', 'twitter:image', ogImageUrl)
      upsertMeta('property', 'og:image:secure_url', ogImageUrl)
    } else {
      removeOgImages()
    }
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', documentTitle)
    upsertMeta('name', 'twitter:description', metaDescription)
    upsertMeta('property', 'og:locale', 'zh_CN')
    removeOgLocaleAlternates()
    removeSeoHreflangLinks()
    if (canonicalHref) {
      upsertHreflang('x-default', canonicalHref)
      upsertHreflang('zh-CN', canonicalHref)
    }
  }, [documentTitle, metaDescription, canonicalHref, ogImageUrl, ogType, t])

  useEffect(() => {
    const el = document.getElementById('seo-ld-website')
    if (!el) return
    const base = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: t('common.siteName'),
      alternateName: t('common.brandTagline'),
      description: t('seo.description'),
      inLanguage: ['zh-CN'],
    }
    const siteUrl = absolutePageUrl('/')
    if (siteUrl) base.url = siteUrl
    const routesSearchUrl = absolutePageUrl('/routes')
    if (routesSearchUrl) {
      base.potentialAction = {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${routesSearchUrl}?keyword={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      }
    }
    el.textContent = JSON.stringify(base)
  }, [t])

  return null
}
