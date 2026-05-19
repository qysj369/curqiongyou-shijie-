import { describe, it, expect } from 'vitest'
import { articles } from './articlesData.js'
import {
  INTENT_VARIANTS_PER_CITY,
  INTENT_CHIP_GROUPS,
  INTENT_QUICK_CHIP_VALUES,
  matchesArticleIntentFilter,
  isValidArticleIntentFilter,
} from './chinaIntentVariants.js'
import { matchesArticleDestinationFilter } from '../utils/chinaCityFromTitle.js'
import { matchesGuideCard } from '../utils/searchMatch.js'

describe('chinaIntentVariants', () => {
  it('ships twenty-four variants per featured city', () => {
    const featured = articles.filter((a) => a.featured && a.id.startsWith('cn-feat-'))
    const variants = articles.filter((a) => a.intentVariant)
    expect(INTENT_VARIANTS_PER_CITY).toBe(24)
    expect(variants.length).toBe(featured.length * 24)
    expect(articles.find((a) => a.id === 'cn-var-langzhong-town')?.intentKind).toBe('town')
    expect(articles.find((a) => a.id === 'cn-var-langzhong-town')?.tags).toContain('古镇')
    expect(articles.find((a) => a.id === 'cn-var-zhangjiajie-camp')?.intentKind).toBe('camp')
    expect(articles.find((a) => a.id === 'cn-var-shanghai-business')?.tags).toContain('商务')
  })

  it('exposes chip groups for crowd / season / transport', () => {
    expect(INTENT_CHIP_GROUPS).toHaveLength(3)
    expect(INTENT_CHIP_GROUPS[0].values).toContain('family')
    expect(INTENT_CHIP_GROUPS[1].values).toContain('camp')
    expect(INTENT_CHIP_GROUPS[2].values).toContain('hsr')
    expect(INTENT_QUICK_CHIP_VALUES.length).toBeGreaterThan(20)
  })

  it('filters list by intent kind and tier', () => {
    const chengduFeat = articles.find((a) => a.id === 'cn-feat-chengdu')
    const chengduTown = articles.find((a) => a.id === 'cn-var-chengdu-town')
    expect(matchesArticleIntentFilter(chengduFeat, 'featured')).toBe(true)
    expect(matchesArticleIntentFilter(chengduTown, 'town')).toBe(true)
    expect(isValidArticleIntentFilter('business')).toBe(true)
    expect(isValidArticleIntentFilter('nope')).toBe(false)
  })

  it('matches new intent summaries in search', () => {
    const town = articles.find((a) => a.id === 'cn-var-shaoxing-town')
    const camp = articles.find((a) => a.id === 'cn-var-zhangjiajie-camp')
    const business = articles.find((a) => a.id === 'cn-var-beijing-business')
    expect(matchesGuideCard(town, '绍兴 古镇')).toBe(true)
    expect(matchesGuideCard(camp, '露营')).toBe(true)
    expect(matchesGuideCard(business, '北京 商务')).toBe(true)
  })
})
