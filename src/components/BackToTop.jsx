import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const SHOW_AFTER = 400

export default function BackToTop() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-sky-600 text-white shadow-lg hover:bg-sky-700 transition focus:outline-none focus:ring-2 focus:ring-sky-400"
      title={t('a11y.backToTop')}
      aria-label={t('a11y.backToTop')}
    >
      <span className="text-lg leading-none" aria-hidden>↑</span>
    </button>
  )
}
