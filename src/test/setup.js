import '@testing-library/jest-dom/vitest'

/** maplibre-gl 在 import 时会调用 createObjectURL；jsdom 默认未实现 */
if (typeof globalThis.URL !== 'undefined') {
  if (!globalThis.URL.createObjectURL) {
    globalThis.URL.createObjectURL = () => 'blob:vitest-mock'
  }
  if (!globalThis.URL.revokeObjectURL) {
    globalThis.URL.revokeObjectURL = () => {}
  }
}

import i18n from '../i18n.js'

/** 稳定断言文案与日期格式（与路由 smoke 无关的页面仍可能读 navigator） */
beforeEach(async () => {
  await i18n.changeLanguage('zh-CN')
})
