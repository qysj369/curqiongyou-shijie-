import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { describe, it, expect } from 'vitest'
import { FEATURE_MODULE_PATH } from './featureModules.js'

const _dir = dirname(fileURLToPath(import.meta.url))
const appSrc = readFileSync(join(_dir, '../App.jsx'), 'utf8')
const seoHeadSrc = readFileSync(join(_dir, '../components/SeoHead.jsx'), 'utf8')

/**
 * 交付门槛：`featureModules` 中的主路径必须与 App 路由、SEO 映射共存，
 * 避免改名或漏注册导致「产品上说已交付、路由却打不开」。
 */
describe('six feature modules — router & SEO wiring', () => {
  it.each(Object.entries(FEATURE_MODULE_PATH))(
    'module %s uses path="%s" in App.jsx',
    (moduleId, pathname) => {
      expect(appSrc).toContain(`path="${pathname}"`)
    },
  )

  it('planner launch /plan is registered in App.jsx', () => {
    expect(appSrc).toContain('path="/plan"')
  })

  it('SeoHead.jsx references each module path (meta description / title)', () => {
    for (const pathname of Object.values(FEATURE_MODULE_PATH)) {
      const esc = pathname.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')
      expect(seoHeadSrc).toMatch(new RegExp(esc))
    }
    expect(seoHeadSrc).toContain('/plan')
  })
})
