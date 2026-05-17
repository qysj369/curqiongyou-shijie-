import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from './locales/zh-CN.json'

/** 中国版：仅简体中文资源，不加载英文包、不做浏览器语言探测。市场范围见 `src/product/marketScope.js`。 */
i18n.use(initReactI18next).init({
  resources: {
    'zh-CN': { translation: zhCN },
  },
  lng: 'zh-CN',
  fallbackLng: 'zh-CN',
  supportedLngs: ['zh-CN'],
  react: { useSuspense: false },
  interpolation: { escapeValue: false },
})

function syncDocumentLang() {
  if (typeof document === 'undefined') return
  document.documentElement.lang = 'zh-CN'
}

i18n.on('languageChanged', syncDocumentLang)
if (typeof document !== 'undefined') {
  syncDocumentLang()
}

export default i18n
