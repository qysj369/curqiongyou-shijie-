import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const SHOW_AFTER = 400

export default function BackToTop() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const stackAboveBottomNav = pathname !== '/plan' && pathname !== '/globe'
  const [narrowScreen, setNarrowScreen] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(max-width: 767px)')
    const fn = () => setNarrowScreen(mq.matches)
    fn()
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  const mapHomeImmersiveChrome =
    narrowScreen && stackAboveBottomNav && (pathname === '/' || pathname === '/map')
  const bottomClass = stackAboveBottomNav
    ? mapHomeImmersiveChrome
      ? 'bottom-[calc(8.5rem+env(safe-area-inset-bottom))]'
      : 'bottom-[calc(5rem+env(safe-area-inset-bottom))]'
    : 'bottom-6'

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed ${bottomClass} left-6 z-50 rounded-full bg-sky-600 p-3 text-white shadow-lg transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400`}
      title={t('a11y.backToTop')}
      aria-label={t('a11y.backToTop')}
    >
      <span className="text-lg leading-none" aria-hidden>↑</span>
    </button>
  )
}
