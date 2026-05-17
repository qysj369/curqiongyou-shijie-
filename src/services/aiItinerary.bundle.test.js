import { describe, it, expect } from 'vitest'
import {
  buildMockItineraryBundle,
  isItineraryBundle,
  wrapLegacySpecAsBundle,
} from '../services/aiItinerary.js'
import { enrichTripBundleWithGuideLibrary } from '../services/itineraryGuideBridge.js'

describe('ai itinerary bundle', () => {
  it('buildMockItineraryBundle returns primary and alternate with valid POI coords', () => {
    const b = buildMockItineraryBundle({ destination: '杭州', days: 3, budget: 3000 })
    expect(isItineraryBundle(b)).toBe(true)
    expect(b.primary.days.length).toBe(3)
    expect(b.alternate.days.length).toBe(3)
    expect(b.primary.title).not.toBe(b.alternate.title)
    const p0 = b.primary.days[0].pois[0]
    expect(Number.isFinite(p0.lng)).toBe(true)
    expect(Number.isFinite(p0.lat)).toBe(true)
  })

  it('enrichTripBundleWithGuideLibrary does not throw', () => {
    const b = buildMockItineraryBundle({ destination: '杭州', days: 2, budget: 2000 })
    const { bundle } = enrichTripBundleWithGuideLibrary(b, '杭州')
    expect(bundle.primary).toBeDefined()
    expect(bundle.alternate).toBeDefined()
  })

  it('wrapLegacySpecAsBundle wraps flat spec', () => {
    const legacy = {
      title: 'Test',
      destination: '成都',
      totalBudget: 4000,
      days: [
        {
          day: 1,
          theme: 'A',
          dayBudget: 4000,
          transport: 'bus',
          pois: [
            { name: 'X', kind: 'blue', budgetHint: 'free', lng: 104.06, lat: 30.67 },
          ],
        },
      ],
      replacements: [],
    }
    const b = wrapLegacySpecAsBundle(legacy)
    expect(isItineraryBundle(b)).toBe(true)
    expect(b.alternate.title).toContain('备选')
  })
})
