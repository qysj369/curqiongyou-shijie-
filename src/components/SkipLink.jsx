import { useTranslation } from 'react-i18next'

export default function SkipLink() {
  const { t } = useTranslation()
  return (
    <a
      href="#main-content"
      className="absolute -left-[9999px] top-4 z-[100] px-4 py-2 bg-sky-600 text-white rounded-lg focus:left-4 focus:outline-none focus:ring-2 focus:ring-sky-400"
    >
      {t('a11y.skipToContent')}
    </a>
  )
}
