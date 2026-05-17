import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SocialFollow from './SocialFollow'
import BrandLogo from './BrandLogo'
import { parseFriendlyLinks, getIcpFilingText } from '../utils/footerEnv'

export default function Footer() {
  const { t } = useTranslation()
  const icp = getIcpFilingText()
  const friendly = parseFriendlyLinks()

  const linkClass =
    'inline-flex min-h-10 items-center rounded-lg px-2 py-1.5 text-sm text-slate-300 transition hover:text-sky-300 dark:hover:text-sky-200'

  return (
    <footer className="mt-auto border-t border-slate-700/80 bg-slate-800 py-6 text-slate-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-3 flex justify-center">
          <BrandLogo variant="lockup" lockupOnDark size="sm" className="justify-center" />
        </div>
        <p className="mx-auto mb-2 max-w-lg text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          {t('footer.missionShort')}
        </p>
        <p className="mx-auto mb-4 max-w-md text-center text-[11px] leading-relaxed text-slate-500 dark:text-slate-500">
          {t('footer.compactHint')}
        </p>
        <div className="mb-4 flex justify-center">
          <SocialFollow />
        </div>

        <nav
          className="mb-4 flex flex-wrap justify-center gap-x-1 gap-y-1 text-center"
          aria-label={t('footer.secondaryNavAria')}
        >
          <Link to="/community" className={linkClass}>
            {t('common.navCommunity')}
          </Link>
          <span className="text-slate-600 dark:text-slate-600" aria-hidden>
            ·
          </span>
          <Link to="/about" className={linkClass}>
            {t('footer.about')}
          </Link>
          <span className="text-slate-600 dark:text-slate-600" aria-hidden>
            ·
          </span>
          <Link to="/china-readiness" className={linkClass}>
            {t('footer.chinaReadiness')}
          </Link>
          <span className="text-slate-600 dark:text-slate-600" aria-hidden>
            ·
          </span>
          <Link to="/privacy" className={linkClass}>
            {t('footer.privacy')}
          </Link>
          <span className="text-slate-600 dark:text-slate-600" aria-hidden>
            ·
          </span>
          <Link to="/terms" className={linkClass}>
            {t('footer.terms')}
          </Link>
        </nav>

        {friendly.length > 0 ? (
          <div className="mb-4 text-center">
            <p className="mb-1.5 text-[11px] text-slate-500 dark:text-slate-500">{t('footer.friendlyLinks')}</p>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
              {friendly.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 underline-offset-2 hover:text-sky-300 hover:underline dark:hover:text-sky-200"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {icp ? (
          <p className="mb-2 text-center text-[11px] text-slate-500 dark:text-slate-500">
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
        ) : null}

        <p className="text-center text-[11px] text-slate-500 dark:text-slate-500">{t('footer.copyright')}</p>
      </div>
    </footer>
  )
}
