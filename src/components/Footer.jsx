import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SocialFollow from './SocialFollow'
import { parseFriendlyLinks, getIcpFilingText } from '../utils/footerEnv'

export default function Footer() {
  const { t } = useTranslation()
  const icp = getIcpFilingText()
  const friendly = parseFriendlyLinks()

  return (
    <footer className="bg-slate-800 dark:bg-slate-950 text-slate-300 border-t border-slate-700/80 dark:border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-amber-400 dark:text-amber-400/95 font-semibold mb-2 text-center">🌍 {t('common.siteName')}</p>
        <p className="text-sm text-center text-slate-200 dark:text-slate-100 mb-1">
          <span className="font-semibold text-amber-400/95">{t('home.sloganPrimaryEn')}</span>
        </p>
        <p className="text-sm text-center text-slate-300 dark:text-slate-400 mb-2">{t('home.sloganPrimaryZh')}</p>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-4 max-w-xl mx-auto leading-relaxed">
          {t('footer.taglineSub')}
        </p>
        <div className="mb-4">
          <SocialFollow />
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm mb-4">
          <Link
            to="/"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('common.home')}
          </Link>
          <Link
            to="/destinations"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('common.destinations')}
          </Link>
          <Link
            to="/articles"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('common.articles')}
          </Link>
          <Link
            to="/community"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('common.community')}
          </Link>
          <Link
            to="/membership"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('commerce.membership')}
          </Link>
          <Link
            to="/board"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('footer.boardAndGuidelines')}
          </Link>
          <Link
            to="/about"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('footer.about')}
          </Link>
          <Link
            to="/privacy"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            to="/terms"
            className="hover:text-amber-400 dark:hover:text-amber-300 transition px-2 py-2 min-h-11 inline-flex items-center rounded-lg"
          >
            {t('footer.terms')}
          </Link>
          <Link
            to="/about#slogan-playbook"
            className="inline-flex items-center gap-1 px-3 py-2 min-h-11 rounded-full bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 transition text-xs font-medium"
          >
            <span aria-hidden>✨</span>
            {t('common.brand')}
          </Link>
        </div>

        {friendly.length > 0 && (
          <div className="mb-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">{t('footer.friendlyLinks')}</p>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
              {friendly.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-amber-400 dark:hover:text-amber-300 underline-offset-2 hover:underline min-h-11 inline-flex items-center"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {icp && (
          <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-2">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400/90 underline-offset-2 hover:underline"
            >
              {t('footer.icpPrefix')}
              {icp}
            </a>
          </p>
        )}

        <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-1">{t('footer.copyright')}</p>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500">{t('footer.missionShort')}</p>
      </div>
    </footer>
  )
}
