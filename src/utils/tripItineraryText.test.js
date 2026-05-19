import { describe, it, expect } from 'vitest'
import { buildMockItineraryBundle } from '../services/aiItinerary.js'
import {
  formatItineraryBundleMarkdown,
  formatItineraryDayShareText,
  formatItineraryLegSummary,
} from './tripItineraryText.js'

describe('tripItineraryText', () => {
  it('formats markdown with day headings', () => {
    const bundle = buildMockItineraryBundle({
      destination: '成都',
      days: 3,
      budget: 3000,
    })
    const md = formatItineraryBundleMarkdown(bundle)
    expect(md).toContain('# 成都')
    expect(md).toContain('## 第 1 天')
    expect(md).toContain('主推线')
    expect(md).toContain('备选线')
  })

  it('formats day share text for social copy', () => {
    const bundle = buildMockItineraryBundle({
      destination: '成都',
      days: 2,
      budget: 2000,
    })
    const text = formatItineraryDayShareText(bundle.primary, 1)
    expect(text).toContain('第1天')
    expect(text).toContain('动线：')
    expect(text).toContain('成都')
  })

  it('builds a short summary line', () => {
    const bundle = buildMockItineraryBundle({
      destination: '厦门',
      days: 2,
      budget: 2000,
    })
    const s = formatItineraryLegSummary(bundle.primary)
    expect(s).toContain('第1天')
    expect(s.length).toBeGreaterThan(20)
  })
})
