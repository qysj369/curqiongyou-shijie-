import { destinations, popularDestinations } from './mockData'

/**
 * Place model adapter (phase-1 migration):
 * keep runtime behavior unchanged while shifting call sites
 * from destination naming to place naming.
 */
export const places = destinations
export const popularPlaces = popularDestinations

export function getPlaceById(id) {
  return places.find((p) => String(p.id) === String(id)) || null
}

export function getPlaceByName(name) {
  const n = String(name || '').trim()
  if (!n) return null
  return places.find((p) => p.name === n) || null
}
