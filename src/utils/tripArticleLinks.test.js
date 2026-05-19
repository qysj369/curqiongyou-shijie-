import { describe, it, expect } from 'vitest'
import { buildMockItineraryBundle } from '../services/aiItinerary.js'
import { enrichTripBundleWithGuideLibrary } from '../services/itineraryGuideBridge.js'
import { resolveGuideArticleId } from './tripArticleLinks.js'

describe('tripArticleLinks', () => {
  it('resolves article id for enriched itinerary POI', () => {
    const raw = buildMockItineraryBundle({ destination: '成都', days: 3, budget: 3000 })
    const { bundle } = enrichTripBundleWithGuideLibrary(raw)
    const poi = bundle.primary?.days?.[0]?.pois?.[0]
    expect(poi).toBeTruthy()
    const id = resolveGuideArticleId(poi, '成都')
    expect(id === null || typeof id === 'string').toBe(true)
    if (poi.guideArticleId) {
      expect(id).toBe(poi.guideArticleId)
    }
  })
})
