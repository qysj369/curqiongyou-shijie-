import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = (
    <>
      <Link to="/" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('common.home')}</Link>
      <Link to="/destinations" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('common.destinations')}</Link>
      <Link to="/articles" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('common.articles')}</Link>
      <Link to="/favorites" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('common.favorites')}</Link>
      <Link to="/community" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('common.community')}</Link>
      <Link to="/membership" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('commerce.membership')}</Link>
      <Link to="/board" className="text-slate-600 hover:text-amber-600 transition" onClick={() => setMobileOpen(false)}>{t('common.board')}</Link>
      <div className="flex items-center gap-2">
        <span className="text-slate-500 text-sm">{t('common.lang')}:</span>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('zh-CN')}
          className={`px-2 py-1 rounded text-sm font-medium transition ${i18n.language === 'zh-CN' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50'}`}
        >
          中文
        </button>
        <button
          type="button"
          onClick={() => i18n.changeLanguage('en')}
          className={`px-2 py-1 rounded text-sm font-medium transition ${i18n.language === 'en' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-amber-50'}`}
        >
          EN
        </button>
      </div>
    </>
  )

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-xl text-amber-600">{t('common.siteName')}</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {navLinks}
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label={mobileOpen ? '关闭菜单' : '打开菜单'}
          >
            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-3">
            {navLinks}
          </div>
        )}
      </nav>
    </header>
  )
}
