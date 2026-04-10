import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SocialFollow from './SocialFollow'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-amber-400 font-semibold mb-2 text-center">🌍 {t('common.siteName')}</p>
        <p className="text-sm text-center text-slate-200 mb-1">
          <span className="font-semibold text-amber-400/95">{t('home.sloganPrimaryEn')}</span>
        </p>
        <p className="text-sm text-center text-slate-300 mb-2">{t('home.sloganPrimaryZh')}</p>
        <p className="text-xs text-center text-slate-500 mb-4 max-w-xl mx-auto leading-relaxed">
          {t('footer.taglineSub')}
        </p>
        <div className="mb-4">
          <SocialFollow />
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm mb-4">
          <Link to="/" className="hover:text-amber-400 transition">{t('common.home')}</Link>
          <Link to="/destinations" className="hover:text-amber-400 transition">{t('common.destinations')}</Link>
          <Link to="/articles" className="hover:text-amber-400 transition">{t('common.articles')}</Link>
          <Link to="/community" className="hover:text-amber-400 transition">{t('common.community')}</Link>
          <Link to="/membership" className="hover:text-amber-400 transition">{t('commerce.membership')}</Link>
          <Link to="/board" className="hover:text-amber-400 transition">{t('footer.boardAndGuidelines')}</Link>
          <Link to="/about" className="hover:text-amber-400 transition">{t('footer.about')}</Link>
          <Link
            to="/about#slogan-playbook"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition text-xs font-medium"
          >
            <span aria-hidden>✨</span>
            {t('common.brand')}
          </Link>
        </div>
        <p className="text-xs text-center text-slate-500 mb-1">{t('footer.copyright')}</p>
        <p className="text-xs text-center text-slate-500">{t('commerce.disclosureShort')}</p>
      </div>
    </footer>
  )
}
