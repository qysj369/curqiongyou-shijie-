import { describe, it, expect } from 'vitest'
import {
  buildCommunityBuddiesHref,
  buildCommunityQaHref,
  buildTripCommunityBuddiesPrefill,
  buildTripCommunityQaPrefill,
} from './tripCommunityBridge.js'

describe('tripCommunityBridge', () => {
  it('builds qa href with destination and focus', () => {
    const href = buildCommunityQaHref({
      destination: '成都',
      title: '交通疑问',
      focusAsk: true,
    })
    expect(href).toContain('/community/qa?')
    expect(href).toContain('destination=')
    expect(href).toContain('focus=ask')
  })

  it('builds buddies href with intro prefill', () => {
    const href = buildCommunityBuddiesHref({
      destination: '西安',
      intro: '找旅伴',
      focusPost: true,
    })
    expect(href).toContain('/community/buddies?')
    expect(href).toContain('focus=post')
  })

  it('builds buddies prefill via t stub', () => {
    const t = (key) => key
    const prefill = buildTripCommunityBuddiesPrefill({ destination: '成都', title: '成都慢游', days: 5 }, t)
    expect(prefill.destination).toBe('成都')
    expect(prefill.intro).toBe('tripAiPage.buddiesPrefillIntro')
    expect(prefill.focusPost).toBe(true)
  })

  it('builds prefill via t stub', () => {
    const t = (key, vars) => `${key}:${JSON.stringify(vars || {})}`
    const prefill = buildTripCommunityQaPrefill(
      { destination: '厦门', title: '厦门慢游', days: 4, totalBudget: 3800 },
      t,
    )
    expect(prefill.destination).toBe('厦门')
    expect(prefill.title).toContain('tripAiPage.qaPrefillTitle')
    expect(prefill.focusAsk).toBe(true)
  })
})
