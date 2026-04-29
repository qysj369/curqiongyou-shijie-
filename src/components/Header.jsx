import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotificationBell from './NotificationBell'
import BrandLogo from './BrandLogo'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'

const navLinkClass =
  'text-slate-600 hover:text-sky-700 transition dark:text-slate-300 dark:hover:text-sky-300 py-2.5 md:py-0 rounded-lg md:rounded-none min-h-11 md:min-h-0 flex items-center md:inline md:whitespace-nowrap shrink-0'

export default function Header() {
  const { t, i18n } = useTranslation()
  const { showUsdApprox, toggleUsdApprox } = useUsdApproxDisplay()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const navLinks = (
    <>
      <Link to="/map" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.navMap')}</Link>
      <Link to="/ai" className={navLinkClass} onClick={() => setMobileOpen(false)}>🤖 AI搭子</Link>
      <Link to="/budget" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.navSavingTips')}</Link>
      <Link to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.navAbout')}</Link>
      <div className="flex shrink-0 items-center gap-2 flex-wrap">
        <span className="text-slate-500 dark:text-slate-400 text-sm">{t('common.lang')}:</span>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('zh-CN')}
          aria-pressed={i18n.language === 'zh-CN'}
          aria-label={t('a11y.langZh')}
          className={`min-h-9 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${i18n.language === 'zh-CN' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
        >
          {t('common.langButtonZh')}
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          aria-pressed={i18n.language === 'en' || i18n.language?.startsWith('en')}
          aria-label={t('a11y.langEn')}
          className={`min-h-9 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${i18n.language === 'en' || i18n.language?.startsWith('en') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-sky-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
        >
          {t('common.langButtonEn')}
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-500 dark:text-slate-400 text-sm">{t('common.usdToggleLead')}</span>
        <button
          type="button"
          onClick={toggleUsdApprox}
          aria-pressed={showUsdApprox}
          aria-label={t('a11y.usdApproxToggle')}
          title={t('common.fxDisclaimer')}
          className={`min-h-9 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${
            showUsdApprox
              ? 'bg-emerald-600 text-white dark:bg-emerald-600'
              : 'text-slate-600 hover:bg-emerald-50 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          {showUsdApprox ? t('common.usdToggleOn') : t('common.usdToggleOff')}
        </button>
      </div>
    </>
  )

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label={t('a11y.mainNavigation')}>
        <div className="flex justify-between items-center gap-3 h-16 min-w-0">
          <div className="relative z-10 flex min-w-0 shrink-0 items-center gap-2">
            <Link to="/" className="flex min-w-0 shrink-0 items-center" aria-label={t('a11y.siteHome')}>
              <BrandLogo />
            </Link>
            <Link
              to="/"
              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              onClick={() => setMobileOpen(false)}
            >
              {t('common.navHome')}
            </Link>
          </div>
          <div className="hidden min-w-0 flex-1 items-center justify-end gap-2 md:flex">
            <div className="shrink-0">
              <NotificationBell />
            </div>
            <div className="scrollbar-hide flex min-w-0 max-w-full items-center justify-end overflow-x-auto overscroll-x-contain">
              <div className="flex w-max min-w-0 flex-nowrap items-center gap-4 lg:gap-5">{navLinks}</div>
            </div>
          </div>
          <div className="flex md:hidden items-center gap-1">
            <NotificationBell />
            <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="min-h-11 min-w-11 p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center justify-center"
            aria-label={mobileOpen ? t('a11y.closeMenu') : t('a11y.openMenu')}
            aria-expanded={mobileOpen}
          >
            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-1">
            {navLinks}
          </div>
        )}
      </nav>
    </header>
  )
}
