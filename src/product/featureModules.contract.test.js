import { describe, it, expect } from 'vitest'
import {
  FEATURE_MODULES,
  FEATURE_MODULE_PATH,
  FEATURE_MODULE_ROLLOUT_ORDER,
  getFeatureModuleById,
} from './featureModules.js'

describe('featureModules product contract', () => {
  it('has six modules, all shipped, rollout matches FEATURE_MODULES ids', () => {
    expect(FEATURE_MODULES).toHaveLength(6)
    expect(FEATURE_MODULE_ROLLOUT_ORDER).toHaveLength(6)
    for (const id of FEATURE_MODULE_ROLLOUT_ORDER) {
      const m = getFeatureModuleById(id)
      expect(m, `missing module ${id}`).toBeTruthy()
      expect(m.lifecycle).toBe('shipped')
      expect(m.summaryZh?.trim().length).toBeGreaterThan(10)
      expect(m.summaryEn?.trim().length).toBeGreaterThan(10)
      expect(FEATURE_MODULE_PATH[id]).toMatch(/^\//)
    }
    const rolloutSet = new Set(FEATURE_MODULE_ROLLOUT_ORDER)
    expect(rolloutSet.size).toBe(6)
    for (const m of FEATURE_MODULES) {
      expect(rolloutSet.has(m.id)).toBe(true)
    }
  })

  it('FEATURE_MODULE_PATH covers every module with app routes', () => {
    for (const m of FEATURE_MODULES) {
      const p = FEATURE_MODULE_PATH[m.id]
      expect(typeof p).toBe('string')
      expect(p.startsWith('/')).toBe(true)
    }
    expect(Object.keys(FEATURE_MODULE_PATH)).toHaveLength(6)
  })
})
