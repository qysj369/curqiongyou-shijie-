/**
 * 行程页 → 社区问答 URL（目的地筛选 + 可选预填标题/正文）。
 * @param {{ destination?: string, title?: string, content?: string, focusAsk?: boolean }} opts
 */
export function buildCommunityQaHref(opts = {}) {
  const params = new URLSearchParams()
  const { destination, title, content, focusAsk } = opts
  if (destination) params.set('destination', destination)
  if (title) params.set('title', title)
  if (content) params.set('content', content)
  if (focusAsk) params.set('focus', 'ask')
  const qs = params.toString()
  return qs ? `/community/qa?${qs}` : '/community/qa'
}

/**
 * @param {{ destination?: string, title?: string, days?: number, totalBudget?: number }} spec
 * @param {(key: string, vars?: object) => string} t i18n t function
 */
export function buildTripCommunityQaPrefill(spec, t) {
  const dest = spec?.destination || ''
  const dayCount = Array.isArray(spec?.days) ? spec.days.length : Number(spec?.days) || 0
  const total = spec?.totalBudget ?? 0
  const tripTitle = spec?.title || dest
  return {
    destination: dest,
    title: t('tripAiPage.qaPrefillTitle', { dest: dest || t('tripAiPage.readGuidesGeneric'), title: tripTitle }),
    content: t('tripAiPage.qaPrefillContent', {
      dest: dest || '—',
      days: dayCount,
      budget: total,
      title: tripTitle,
    }),
    focusAsk: true,
  }
}

/**
 * @param {{ destination?: string, intro?: string, dateFrom?: string, dateTo?: string, focusPost?: boolean }} opts
 */
export function buildCommunityBuddiesHref(opts = {}) {
  const params = new URLSearchParams()
  const { destination, intro, dateFrom, dateTo, focusPost } = opts
  if (destination) params.set('destination', destination)
  if (intro) params.set('intro', intro)
  if (dateFrom) params.set('dateFrom', dateFrom)
  if (dateTo) params.set('dateTo', dateTo)
  if (focusPost) params.set('focus', 'post')
  const qs = params.toString()
  return qs ? `/community/buddies?${qs}` : '/community/buddies'
}

/**
 * @param {{ destination?: string, title?: string, days?: object[]|number, totalBudget?: number }} spec
 * @param {(key: string, vars?: object) => string} t
 */
export function buildTripCommunityBuddiesPrefill(spec, t) {
  const dest = spec?.destination || ''
  const dayCount = Array.isArray(spec?.days) ? spec.days.length : Number(spec?.days) || 0
  const total = spec?.totalBudget ?? 0
  const tripTitle = spec?.title || dest
  return {
    destination: dest,
    intro: t('tripAiPage.buddiesPrefillIntro', {
      dest: dest || '—',
      days: dayCount,
      budget: total,
      title: tripTitle,
    }),
    focusPost: true,
  }
}
