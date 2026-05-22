import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotificationBell from './NotificationBell'
import BrandLogo from './BrandLogo'
import MoreMenuDrawer from './MoreMenuDrawer'

export default function Header() {
  const { t } = useTranslation()
  const [moreOpen, setMoreOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMoreOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!moreOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [moreOpen])

  const homeDesigned =
    (location.pathname === '/' || location.pathname === '/map') &&
    location.search.indexOf('immersive=1') === -1

  return (
    <header
      className={
        homeDesigned
          ? 'absolute top-0 left-0 right-0 z-50 border-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent shadow-none'
          : 'sticky top-0 z-50 border-b border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'
      }
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8" aria-label={t('a11y.mainNavigation')}>
        <Link to="/" className="flex min-w-0 shrink-0 items-center" aria-label={t('a11y.siteHome')}>
          <BrandLogo lockupOnDark={homeDesigned} />
        </Link>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={
              homeDesigned
                ? 'flex min-h-11 min-w-11 items-center justify-center rounded-lg text-white/95 hover:bg-white/15'
                : 'flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }
            aria-label={t('a11y.openMoreMenu')}
            aria-expanded={moreOpen}
          >
            <span className="text-xl leading-none" aria-hidden>⋯</span>
          </button>
        </div>
      </nav>

      <MoreMenuDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </header>
  )
}
