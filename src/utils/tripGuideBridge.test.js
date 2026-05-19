import { describe, it, expect } from 'vitest'
import { articles } from '../data/mockData.js'
import {
  buildTripAiHrefFromArticle,
  buildTripAiSearchParamsFromArticle,
  buildTripNotesFromArticle,
  findEditorArticleById,
} from './tripGuideBridge.js'

describe('tripGuideBridge', () => {
  it('builds trip-ai href with article fields', () => {
    const article = articles[0]
    expect(article).toBeTruthy()
    const href = buildTripAiHrefFromArticle(article, { autogenerate: true })
    expect(href).toMatch(/^\/trip-ai\?/)
    expect(href).toContain(`articleId=${encodeURIComponent(article.id)}`)
    expect(href).toContain('autogenerate=1')
    expect(href).toContain(`destination=${encodeURIComponent(article.destination)}`)
  })

  it('finds article by id and builds notes', () => {
    const article = articles[0]
    const hit = findEditorArticleById(article.id)
    expect(hit?.id).toBe(article.id)
    expect(buildTripNotesFromArticle(hit)).toContain(article.title)
  })

  it('resolves intent variant to featured anchor for trip-ai prefill', () => {
    const variant = articles.find((a) => a.id === 'cn-var-chengdu-hsr')
    const anchor = articles.find((a) => a.id === 'cn-feat-chengdu')
    expect(variant?.guideAnchorId).toBe('cn-feat-chengdu')
    expect(anchor).toBeTruthy()
    const params = buildTripAiSearchParamsFromArticle(variant)
    expect(params.get('articleId')).toBe('cn-feat-chengdu')
    expect(params.get('destination')).toBe(anchor.city)
    const href = buildTripAiHrefFromArticle(variant)
    expect(href).toContain('articleId=cn-feat-chengdu')
  })
})
