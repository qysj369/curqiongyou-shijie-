import { describe, it, expect } from 'vitest'
import {
  PRIMARY_MARKET_CODE,
  SUPPORTED_MARKET_CODES,
  isChinaPrimaryMarket,
  isSupportedMarketCode,
} from './marketScope.js'

describe('market scope — China-first rollout', () => {
  it('primary market is CN', () => {
    expect(PRIMARY_MARKET_CODE).toBe('CN')
  })

  it('only CN is in the supported list until other regions are validated', () => {
    expect(SUPPORTED_MARKET_CODES).toEqual(['CN'])
  })

  it('helpers reflect China-primary policy', () => {
    expect(isChinaPrimaryMarket()).toBe(true)
    expect(isSupportedMarketCode('cn')).toBe(true)
    expect(isSupportedMarketCode('JP')).toBe(false)
  })
})
