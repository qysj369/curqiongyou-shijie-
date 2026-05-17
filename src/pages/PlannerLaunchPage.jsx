import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * 原 /globe 三维地球入口已移除：本页用轻量 CSS/SVG 动效突出「智能辅助穷游规划」，
 * 实际排程与地图仍在一键行程、分层地图、顾问与文库中完成。
 */
export default function PlannerLaunchPage() {
  const { t } = useTranslation()

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-slate-950 text-slate-100"
      aria-labelledby="planner-launch-title"
    >
      <div className="pointer-events-none absolute inset-0 opacity-90" aria-hidden>
        <div className="rw-plan-blobs absolute inset-0">
          <div className="absolute -left-1/4 -top-1/4 h-[70vmin] w-[70vmin] rounded-full bg-sky-500/25 blur-3xl" />
          <div className="rw-plan-blobs-slow absolute -right-1/5 top-1/3 h-[55vmin] w-[55vmin] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-[45vmin] w-[45vmin] rounded-full bg-violet-500/15 blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-4 pb-10 pt-14 sm:px-8 sm:pt-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/90">
          {t('plannerLaunch.kicker')}
        </p>
        <h1 id="planner-launch-title" className="mt-2 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">
          {t('plannerLaunch.title')}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">{t('plannerLaunch.lead')}</p>

        <div className="relative mx-auto mt-10 flex w-full max-w-lg flex-1 items-center justify-center py-6">
          <svg
            className="h-[min(52vw,280px)] w-full max-w-[420px] drop-shadow-[0_0_28px_rgba(56,189,248,0.15)]"
            viewBox="0 0 400 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <defs>
              <linearGradient id="rw-plan-stroke" x1="0" y1="110" x2="400" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.45" stopColor="#34d399" />
                <stop offset="1" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <path
              className="rw-plan-route"
              d="M 32 168 C 90 32 150 32 210 108 S 330 72 372 44"
              stroke="url(#rw-plan-stroke)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {[
              { cx: 32, cy: 168, label: t('plannerLaunch.nodeAsk') },
              { cx: 210, cy: 108, label: t('plannerLaunch.nodeRoute') },
              { cx: 372, cy: 44, label: t('plannerLaunch.nodeSave') },
            ].map((n) => (
              <g key={n.label}>
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="22"
                  className="fill-slate-900 stroke-sky-400/70"
                  strokeWidth="2"
                />
                <text
                  x={n.cx}
                  y={n.cy + 4}
                  textAnchor="middle"
                  fill="#f1f5f9"
                  style={{ fontSize: '11px', fontWeight: 600 }}
                >
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        <nav
          className="mx-auto mt-4 grid w-full max-w-lg grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          aria-label={t('plannerLaunch.navAria')}
        >
          <Link
            to="/trip-ai"
            className="rounded-xl border border-sky-500/40 bg-sky-500/15 px-3 py-3 text-center text-sm font-semibold text-sky-100 transition hover:border-sky-400 hover:bg-sky-500/25"
          >
            {t('plannerLaunch.ctaTripAi')}
          </Link>
          <Link
            to="/advisor"
            className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-3 text-center text-sm font-semibold text-emerald-50 transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
          >
            {t('plannerLaunch.ctaAdvisor')}
          </Link>
          <Link
            to="/map-hub"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            {t('plannerLaunch.ctaMap')}
          </Link>
          <Link
            to="/library"
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/10"
          >
            {t('plannerLaunch.ctaLibrary')}
          </Link>
        </nav>

        <p className="mx-auto mt-6 max-w-lg text-center text-xs leading-relaxed text-slate-500">{t('plannerLaunch.hint')}</p>
      </div>
    </section>
  )
}
