import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FEATURE_MODULES, FEATURE_MODULE_PATH, FEATURE_MODULE_ROLLOUT_ORDER } from '../product/featureModules.js'
import Breadcrumbs from '../components/Breadcrumbs'
import CopyPageLinkButton from '../components/CopyPageLinkButton'

export default function About() {
  const { t } = useTranslation()
  const orderedModules = useMemo(
    () => FEATURE_MODULE_ROLLOUT_ORDER.map((id) => FEATURE_MODULES.find((m) => m.id === id)).filter(Boolean),
    [],
  )
  const breadcrumbs = [
    { label: t('common.navMap'), to: '/map' },
    { label: t('about.title') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{t('about.title')}</h1>
          <CopyPageLinkButton />
        </div>

        <nav aria-label={t('about.tocAria')} className="mb-6">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-300">{t('about.tocLead')}</span>
          {(
            [
              ['outline-ia', 'tocLinkIa'],
              ['about-differentiation', 'tocLinkDifferentiation'],
              ['about-data-trust', 'tocLinkData'],
              ['about-china-market', 'tocLinkMarketChina'],
              ['feature-modules-shipped', 'tocLinkShipped'],
              ['outline-ai', 'tocLinkAi'],
              ['outline-tech', 'tocLinkTech'],
              ['outline-visual', 'tocLinkVisual'],
              ['outline-ops', 'tocLinkOps'],
              ['outline-phases', 'tocLinkPhases'],
            ] 
          ).map(([id, labelKey], i) => (
            <span key={id}>
              {i > 0 ? <span aria-hidden> · </span> : ' '}
              <a
                href={`#${id}`}
                className="text-sky-700 underline-offset-2 hover:underline dark:text-sky-300"
              >
                {t(`about.${labelKey}`)}
              </a>
            </span>
          ))}
        </p>
        </nav>

        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('about.introTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {t('about.introBody')}
          </p>
        </section>

        <section
          id="about-differentiation"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="about-differentiation-heading"
        >
          <h2 id="about-differentiation-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t('about.differentiationTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 whitespace-pre-line">
            {t('about.differentiationLead')}
          </p>
          <ul className="m-0 list-none space-y-2.5 p-0 text-sm text-slate-700 dark:text-slate-300">
            <li className="border-l-2 border-violet-400/90 pl-3">{t('about.diffPointTransport')}</li>
            <li className="border-l-2 border-violet-400/90 pl-3">{t('about.diffPointHandoff')}</li>
            <li className="border-l-2 border-violet-400/90 pl-3">{t('about.diffPointTripAi')}</li>
            <li className="border-l-2 border-violet-400/90 pl-3">{t('about.diffPointLibrarySteward')}</li>
            <li className="border-l-2 border-violet-400/90 pl-3">{t('about.diffPointVerify')}</li>
          </ul>
        </section>

        <section
          id="about-data-trust"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="about-data-trust-heading"
        >
          <h2 id="about-data-trust-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t('about.dataTrustTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {t('about.dataTrustBody')}
          </p>
        </section>

        <section
          id="about-china-market"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900/40 p-6 mb-6"
          aria-labelledby="about-china-market-heading"
        >
          <h2 id="about-china-market-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t('about.marketChinaTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {t('about.marketChinaBody')}
          </p>
          <p className="mt-4">
            <Link
              to="/china-readiness"
              className="inline-flex min-h-10 items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
            >
              {t('about.marketReadinessCta')}
            </Link>
          </p>
        </section>

        <div className="mb-6 rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/35 dark:text-amber-50">
          {t('about.softLaunchBanner')}
        </div>

        <section
          id="outline-ia"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-sky-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="outline-ia-heading"
        >
          <h2 id="outline-ia-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t('about.outlineSectionIaTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.outlineSectionIaBody')}</p>
        </section>

        <section
          id="feature-modules-shipped"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="feature-modules-heading"
        >
          <h2 id="feature-modules-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t('about.featureReleaseTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t('about.featureReleaseLead')}</p>
          <ol className="m-0 list-none space-y-3 p-0 text-sm text-slate-700 dark:text-slate-300">
            {orderedModules.map((m, index) => {
              const title = m.titleZh
              const summary = m.summaryZh
              const to = FEATURE_MODULE_PATH[m.id]
              return (
                <li key={m.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/40">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-900 dark:bg-sky-900/50 dark:text-sky-100"
                    aria-hidden
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <Link to={to} className="font-semibold text-sky-800 hover:underline dark:text-sky-300">
                        {title}
                      </Link>
                      <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200">
                        {t('about.featureReleaseBadge')}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{summary}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>

        <section
          id="outline-ai"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="outline-ai-heading"
        >
          <h2 id="outline-ai-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t('about.outlineSectionAiTitle')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{t('about.outlineSectionAiLead')}</p>
          <ul className="m-0 list-none space-y-2.5 p-0 text-sm text-slate-700 dark:text-slate-300">
            <li className="border-l-2 border-sky-400/90 pl-3">{t('about.outlineAiGeo')}</li>
            <li className="border-l-2 border-sky-400/90 pl-3">{t('about.outlineAiSave')}</li>
            <li className="border-l-2 border-sky-400/90 pl-3">{t('about.outlineAiAdapt')}</li>
            <li className="border-l-2 border-sky-400/90 pl-3">{t('about.outlineAiInteract')}</li>
          </ul>
        </section>

        <section
          id="outline-tech"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="outline-tech-heading"
        >
          <h2 id="outline-tech-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t('about.outlineSectionTechTitle')}
          </h2>
          <ul className="m-0 list-none space-y-2.5 p-0 text-sm text-slate-700 dark:text-slate-300">
            <li className="border-l-2 border-emerald-500/80 pl-3">{t('about.outlineTechFrontend')}</li>
            <li className="border-l-2 border-emerald-500/80 pl-3">{t('about.outlineTechBackend')}</li>
            <li className="border-l-2 border-emerald-500/80 pl-3">{t('about.outlineTechDeploy')}</li>
          </ul>
        </section>

        <section
          id="outline-visual"
          className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-sky-50 via-brand-cream to-emerald-50 p-6 mb-6 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900"
          aria-labelledby="outline-visual-heading"
        >
          <h2 id="outline-visual-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t('about.outlineSectionVisualTitle')}
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{t('about.outlineSectionVisualBody')}</p>
        </section>

        <section
          id="outline-ops"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="outline-ops-heading"
        >
          <h2 id="outline-ops-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t('about.outlineSectionOpsTitle')}
          </h2>
          <ul className="m-0 list-none space-y-2.5 p-0 text-sm text-slate-700 dark:text-slate-300">
            <li className="border-l-2 border-amber-400/90 pl-3">{t('about.outlineOpsTraffic')}</li>
            <li className="border-l-2 border-amber-400/90 pl-3">{t('about.outlineOpsMonetize')}</li>
          </ul>
        </section>

        <section
          id="outline-phases"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="outline-phases-heading"
        >
          <h2 id="outline-phases-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t('about.outlineSectionDevStagesTitle')}
          </h2>
          <ol className="m-0 list-none space-y-4 p-0">
            {[
              ['outlineStage1Title', 'outlineStage1Body'],
              ['outlineStage2Title', 'outlineStage2Body'],
              ['outlineStage3Title', 'outlineStage3Body'],
            ].map(([titleKey, bodyKey], i) => (
              <li
                key={titleKey}
                className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/40"
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{t(`about.${titleKey}`)}</p>
                  <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">{t(`about.${bodyKey}`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          id="light-roam-brief"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="light-roam-heading"
        >
          <h2 id="light-roam-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
            {t('about.lightRoamTitle')}
          </h2>
          <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-none p-0 m-0">
            <li className="border-l-2 border-sky-400/80 pl-3">{t('about.lightRoamPhilosophy')}</li>
            <li className="border-l-2 border-sky-400/80 pl-3">{t('about.lightRoamSloganWallet')}</li>
            <li className="border-l-2 border-sky-400/80 pl-3">{t('about.lightRoamPositioning')}</li>
            <li className="border-l-2 border-sky-400/80 pl-3">{t('about.lightRoamValues')}</li>
          </ul>
          <details className="mt-5 rounded-xl border border-slate-200 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
            <summary className="cursor-pointer font-medium text-slate-800 dark:text-slate-200 select-none">
              {t('about.roadmapDetailsSummary')}
            </summary>
            <p className="mt-3 leading-relaxed">{t('home.roadmapLead')}</p>
            <ul className="mt-2 space-y-2 list-disc pl-5 marker:text-sky-500 text-slate-700 dark:text-slate-300">
              <li>{t('home.roadmapCoreModules')}</li>
              <li>{t('home.roadmapMap')}</li>
              <li>{t('home.roadmapItinerary')}</li>
              <li>{t('home.roadmapHonest')}</li>
              <li>{t('about.roadmapSwipeNote')}</li>
            </ul>
          </details>
        </section>

        <section
          id="business-model"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="business-model-heading"
        >
          <h2 id="business-model-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t('about.businessModelTitle')}
          </h2>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{t('about.businessModelPhilosophy')}</p>
          <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-none p-0 m-0">
            <li className="border-l-2 border-emerald-500/80 pl-3">{t('about.businessModelMembership')}</li>
            <li className="border-l-2 border-emerald-500/80 pl-3">{t('about.businessModelAffiliate')}</li>
            <li className="border-l-2 border-emerald-500/80 pl-3">{t('about.businessModelMerch')}</li>
          </ul>
        </section>

        <section
          className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6"
          aria-labelledby="media-disclaimer-heading"
        >
          <h2 id="media-disclaimer-heading" className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t('about.mediaDisclaimerTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t('about.mediaDisclaimerBody')}</p>
        </section>

        <section
          id="mission-pillars"
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6"
          aria-labelledby="mission-pillars-heading"
        >
          <h2 id="mission-pillars-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t('about.pillarsSectionTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-5">{t('about.pillarsIntro')}</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['pillarBudgetTitle', 'pillarBudgetBody'],
              ['pillarFunTitle', 'pillarFunBody'],
              ['pillarSafeTitle', 'pillarSafeBody'],
              ['pillarQuickTitle', 'pillarQuickBody'],
              ['pillarHealthTitle', 'pillarHealthBody'],
            ].map(([titleKey, bodyKey]) => (
              <div
                key={titleKey}
                className="rounded-xl border border-slate-200 dark:border-slate-600 p-4 flex flex-col"
              >
                <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">
                  {t(`home.${titleKey}`)}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 leading-relaxed flex-1">
                  {t(`home.${bodyKey}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-sky-50 rounded-2xl border border-sky-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-sky-800 mb-3">{t('about.guidelinesTitle')}</h2>
          <p className="text-sky-800 leading-relaxed whitespace-pre-line">{t('about.guidelinesBody')}</p>
          <Link
            to="/board"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 transition text-sm"
          >
            {t('about.goToBoard')}
          </Link>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6" aria-labelledby="terminology-heading">
          <h2 id="terminology-heading" className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            {t('about.terminologyTitle')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">{t('terminology.sectionLead')}</p>
          <dl className="space-y-4 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            <div>
              <dt className="font-semibold text-slate-800 dark:text-slate-100">{t('terminology.termGuide')}</dt>
              <dd className="mt-1">{t('terminology.defGuide')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800 dark:text-slate-100">{t('terminology.termSubmit')}</dt>
              <dd className="mt-1">{t('terminology.defSubmit')}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-800 dark:text-slate-100">{t('terminology.termReview')}</dt>
              <dd className="mt-1">{t('terminology.defReview')}</dd>
            </div>
          </dl>
        </section>

        <details
          id="slogan-playbook"
          className="group mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <summary className="cursor-pointer list-none rounded-2xl px-6 py-4 text-sm font-semibold text-slate-800 marker:text-slate-400 dark:text-slate-100 [&::-webkit-details-marker]:hidden">
            {t('about.playbookArchiveSummary')}
          </summary>
          <div className="border-t border-slate-100 px-6 pb-6 pt-2 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">品牌口号全案（归档）</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            口号是品牌的灵魂：对强调真实体验与预算智慧的穷游产品来说，它更是一种价值选择——用智慧代替盲目消费，用体验代替打卡堆砌，用勇气代替自我设限。
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度一：智慧与价值（重新定义“穷”）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">智行天下，见所未见。</p>
                  <p>把“穷游”从“没钱”转化为“聪明旅行”。会规划、会取舍，所以能看得更远、更广。</p>
                </li>
                <li>
                  <p className="font-medium">不负每一公里。</p>
                  <p>既是“珍惜每一步”，也是“每一步都要有价值”。不浪费预算，也不浪费时间。</p>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度二：体验与本质（回归旅行初心）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">行囊虽轻，生命厚重。</p>
                  <p>物质上的轻，是为了体验上的重。少一点负担，多一点世界与人生的密度。</p>
                </li>
                <li>
                  <p className="font-medium">世界在窗外，不在床头。</p>
                  <p>用一句带态度的话，区分“住在旅途里”和“活在旅途里”的人。</p>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度三：勇气与行动（打破预算边界）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">预算有价，梦想无疆。</p>
                  <p>承认现实，但不向现实低头。账户余额不应该决定你能看见多大的世界。</p>
                </li>
                <li>
                  <p className="font-medium">走得更远。</p>
                  <p>既是地理上的更远，也是认知上的更深。简短有力，适合传播和记忆。</p>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度四：连接与归属（旅行共同体）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">拥抱真实世界。</p>
                  <p>不追滤镜，不做摆拍；走进真实街道、真实文化与真实的人。</p>
                </li>
                <li>
                  <p className="font-medium">世界公民，彼此照应。</p>
                  <p>把“穷游”升级为身份认同：跨文化、低偏见、愿分享、能共情。</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 p-5">
            <h3 className="font-semibold text-sky-800 mb-2">{t('about.playbookFinalTitle')}</h3>
            <p className="text-slate-900 font-bold text-lg">{t('home.sloganPrimaryZh')}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{t('about.playbookFinalBlurb')}</p>
          </div>
          </div>
        </details>

        <p className="text-slate-500 text-sm text-center">
          <Link to="/map" className="text-sky-700 hover:underline">{t('common.home')}</Link>
          {' · '}
          <Link to="/board" className="text-sky-700 hover:underline">{t('common.board')}</Link>
        </p>
      </div>
    </div>
  )
}
