import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SocialFollow from './SocialFollow'
import BrandLogo from './BrandLogo'
import { parseFriendlyLinks, getIcpFilingText } from '../utils/footerEnv'

export default function Footer() {
  const { t } = useTranslation()
  const icp = getIcpFilingText()
  const friendly = parseFriendlyLinks()

  return (
    <footer className="bg-slate-800 dark:bg-slate-950 text-slate-300 border-t border-slate-700/80 dark:border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-2 flex justify-center">
          <BrandLogo variant="lockup" lockupOnDark size="sm" className="justify-center" />
        </div>
        <p className="mb-1 text-center text-sm font-semibold text-sky-300/95 dark:text-slate-100">
          {t('home.heroSloganZh')}
        </p>
        <p className="text-sm text-center text-slate-300 dark:text-slate-400 mb-2">{t('home.heroSloganEn')}</p>
        <p className="text-xs text-center text-slate-500 dark:text-slate-500 mb-4 max-w-xl mx-auto leading-relaxed">
          {t('footer.taglineSub')}
        </p>
        <p className="text-xs text-center text-slate-400 dark:text-slate-500 mb-4 max-w-md mx-auto">
          {t('common.globalUxLine')}
        </p>
        <div className="mb-4">
          <SocialFollow />
        </div>
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm mb-4">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('common.home')}
          </Link>
          <Link
            to="/articles"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('common.articles')}
          </Link>
          <Link
            to="/community"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('common.community')}
          </Link>
          <Link
            to="/membership"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('commerce.membership')}
          </Link>
          <Link
            to="/about#business-model"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('common.navBusinessModel')}
          </Link>
          <Link
            to="/board"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('footer.boardAndGuidelines')}
          </Link>
          <Link
            to="/about"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('footer.about')}
          </Link>
          <Link
            to="/privacy"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            to="/terms"
            className="inline-flex min-h-11 items-center rounded-lg px-2 py-2 transition hover:text-sky-300 dark:hover:text-sky-200"
          >
            {t('footer.terms')}
          </Link>
          <Link
            to="/about#slogan-playbook"
            className="inline-flex min-h-11 items-center gap-1 rounded-full bg-sky-500/15 px-3 py-2 text-xs font-medium text-sky-300 transition hover:bg-sky-500/25"
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
                    className="inline-flex min-h-11 items-center text-slate-300 underline-offset-2 hover:text-sky-300 hover:underline dark:hover:text-sky-200"
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
              className="underline-offset-2 hover:text-sky-300/90 hover:underline"
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
