import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Breadcrumbs from '../components/Breadcrumbs'

export default function About() {
  const { t } = useTranslation()
  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('about.title') },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">{t('about.title')}</h1>

        <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('about.introTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{t('about.introBody')}</p>
        </section>

        <section className="bg-amber-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-amber-800 mb-3">{t('about.guidelinesTitle')}</h2>
          <p className="text-amber-800 leading-relaxed whitespace-pre-line">{t('about.guidelinesBody')}</p>
          <Link
            to="/board"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition text-sm"
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

        <section id="slogan-playbook" className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">品牌口号全案（中英双语）</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            好的 Slogan（口号）是品牌的灵魂。对面向全球、强调真实体验与预算智慧的品牌来说，
            口号不只是宣传语，更是一种价值选择：用智慧代替金钱，用体验代替享受，用勇气代替安逸。
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度一：智慧与价值（重新定义“穷”）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">Travel Smart, See More. ｜ 智行天下，见所未见。</p>
                  <p>把“穷游”从“没钱”转化为“聪明旅行”。会规划、会取舍，所以能看得更远、更广。</p>
                </li>
                <li>
                  <p className="font-medium">Value Every Mile. ｜ 不负每一公里。</p>
                  <p>既是“珍惜每一步”，也是“每一步都要有价值”。不浪费预算，也不浪费时间。</p>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度二：体验与本质（回归旅行初心）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">Less Luggage, More Life. ｜ 行囊虽轻，生命厚重。</p>
                  <p>物质上的轻，是为了体验上的重。少一点负担，多一点世界与人生的密度。</p>
                </li>
                <li>
                  <p className="font-medium">The World, Not The Hotel. ｜ 世界在窗外，不在床头。</p>
                  <p>用一句带态度的话，区分“住在旅途里”和“活在旅途里”的人。</p>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度三：勇气与行动（打破预算边界）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">Budget is Limited, Dreams are Not. ｜ 预算有价，梦想无疆。</p>
                  <p>承认现实，但不向现实低头。账户余额不应该决定你能看见多大的世界。</p>
                </li>
                <li>
                  <p className="font-medium">Go Further. ｜ 走得更远。</p>
                  <p>既是地理上的更远，也是认知上的更深。简短有力，适合传播和记忆。</p>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800 mb-2">维度四：连接与归属（全球旅行共同体）</h3>
              <ul className="space-y-3 text-slate-700 text-sm leading-relaxed">
                <li>
                  <p className="font-medium">Join the Real World. ｜ 拥抱真实世界。</p>
                  <p>不追滤镜，不做摆拍；走进真实街道、真实文化与真实的人。</p>
                </li>
                <li>
                  <p className="font-medium">Citizen of the World. ｜ 世界公民。</p>
                  <p>把“穷游”升级为身份认同：跨文化、低偏见、愿分享、能共情。</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-5">
            <h3 className="font-semibold text-amber-800 mb-2">{t('about.playbookFinalTitle')}</h3>
            <p className="text-slate-900 font-bold text-lg">{t('home.sloganPrimaryEn')}</p>
            <p className="text-slate-700 mb-2">{t('home.sloganPrimaryZh')}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{t('about.playbookFinalBlurb')}</p>
          </div>
        </section>

        <p className="text-slate-500 text-sm text-center">
          <Link to="/" className="text-amber-600 hover:underline">{t('common.home')}</Link>
          {' · '}
          <Link to="/board" className="text-amber-600 hover:underline">{t('common.board')}</Link>
        </p>
      </div>
    </div>
  )
}
