import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NotificationBell from './NotificationBell'

const navLinkClass =
  'text-slate-600 hover:text-amber-600 transition dark:text-slate-300 dark:hover:text-amber-400 py-2.5 md:py-0 rounded-lg md:rounded-none min-h-11 md:min-h-0 flex items-center md:inline'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = (
    <>
      <Link to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.home')}</Link>
      <Link to="/destinations" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.destinations')}</Link>
      <Link to="/articles" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.articles')}</Link>
      <Link to="/favorites" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.favorites')}</Link>
      <Link to="/community" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.community')}</Link>
      <Link to="/membership" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('commerce.membership')}</Link>
      <Link to="/board" className={navLinkClass} onClick={() => setMobileOpen(false)}>{t('common.board')}</Link>
      <Link
        to="/about#slogan-playbook"
        className="inline-flex items-center gap-1 px-2.5 py-2 md:py-1 rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 transition font-medium dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/60 min-h-11 md:min-h-0"
        onClick={() => setMobileOpen(false)}
      >
        <span aria-hidden>✨</span>
        {t('common.brand')}
      </Link>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-slate-500 dark:text-slate-400 text-sm">{t('common.lang')}:</span>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('zh-CN')}
          aria-pressed={i18n.language === 'zh-CN'}
          aria-label={t('a11y.langZh')}
          className={`min-h-9 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${i18n.language === 'zh-CN' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
        >
          {t('common.langButtonZh')}
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          aria-pressed={i18n.language === 'en' || i18n.language?.startsWith('en')}
          aria-label={t('a11y.langEn')}
          className={`min-h-9 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition whitespace-nowrap shrink-0 ${i18n.language === 'en' || i18n.language?.startsWith('en') ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50 dark:text-slate-300 dark:hover:bg-slate-800'}`}
        >
          {t('common.langButtonEn')}
        </button>
      </div>
    </>
  )

  return (
    <header className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label={t('a11y.mainNavigation')}>
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2" aria-label={t('a11y.siteHome')}>
            <span className="text-2xl" aria-hidden>🌍</span>
            <span className="font-bold text-xl text-amber-600 dark:text-amber-400 tracking-tight">{t('common.headerBrand')}</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <NotificationBell />
            <div className="flex items-center gap-6">{navLinks}</div>
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
