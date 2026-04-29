import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import zhCN from './locales/zh-CN.json'
import en from './locales/en.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      en: { translation: en },
    },
    /** 根组件未包 Suspense 时，useSuspense:true 会导致首屏白屏 */
    react: { useSuspense: false },
    /** 全球访客：浏览器语言优先；缺 key 时先回退英文再中文 */
    fallbackLng: ['en', 'zh-CN'],
    supportedLngs: ['en', 'zh-CN'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => {
        if (!lng || typeof lng !== 'string') return lng
        const lower = lng.toLowerCase()
        if (lower === 'zh' || lower.startsWith('zh-')) return 'zh-CN'
        if (lower === 'en' || lower.startsWith('en-')) return 'en'
        return lng
      },
    },
  })

function syncDocumentLang(lng) {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lng === 'zh-CN' ? 'zh-CN' : lng
}

i18n.on('languageChanged', syncDocumentLang)
if (typeof document !== 'undefined') {
  syncDocumentLang(i18n.language)
}

export default i18n
