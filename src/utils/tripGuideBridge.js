import { articles } from '../data/mockData.js'

/**
 * @param {string} id
 */
export function findEditorArticleById(id) {
  if (!id) return null
  return articles.find((a) => a.id === id) ?? null
}

/**
 * @param {{ id?: string, title?: string, destination?: string, days?: number, budget?: number }} article
 */
export function buildTripNotesFromArticle(article) {
  if (!article?.title) return ''
  const id = article.id ? `（id: ${article.id}）` : ''
  return `参考攻略《${article.title}》${id}：按该路线预算与动线生成，可再微调节奏与替换项。`
}

/**
 * @param {{ id?: string, title?: string, destination?: string, days?: number, budget?: number }} article
 * @param {{ autogenerate?: boolean }} [opts]
 */
/**
 * 意图变体卡片预填行程时，优先绑定对应深度路书。
 * @param {{ id?: string, guideAnchorId?: string }} article
 */
export function resolveGuideArticleForTrip(article) {
  if (!article) return null
  const anchorId = article.guideAnchorId
  if (anchorId) {
    const anchor = findEditorArticleById(anchorId)
    if (anchor) return anchor
  }
  return article
}

export function buildTripAiSearchParamsFromArticle(article, opts = {}) {
  const source = resolveGuideArticleForTrip(article) || article
  const params = new URLSearchParams()
  const destLabel = source?.city || source?.destination
  if (destLabel) params.set('destination', destLabel)
  if (source?.days && Number(source.days) > 0) params.set('days', String(source.days))
  if (source?.budget && Number(source.budget) > 0) params.set('budget', String(source.budget))
  if (source?.id) params.set('articleId', source.id)
  const notes = buildTripNotesFromArticle(source)
  if (notes) params.set('notes', notes)
  if (opts.autogenerate) params.set('autogenerate', '1')
  return params
}

/**
 * @param {{ id?: string, title?: string, destination?: string, days?: number, budget?: number }} article
 * @param {{ autogenerate?: boolean }} [opts]
 */
export function buildTripAiHrefFromArticle(article, opts = {}) {
  const qs = buildTripAiSearchParamsFromArticle(article, opts).toString()
  return qs ? `/trip-ai?${qs}` : '/trip-ai'
}
