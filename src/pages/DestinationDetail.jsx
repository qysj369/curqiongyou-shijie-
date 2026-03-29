import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { destinations, articles } from '../data/mockData'
import { destinationGuides } from '../data/destinationGuides'
import { getUserGuidesByDestination } from '../data/userGuidesStore'
import Breadcrumbs from '../components/Breadcrumbs'
import UserGuideForm from '../components/UserGuideForm'
import ServiceLinks from '../components/ServiceLinks'

export default function DestinationDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [ugcRefresh, setUgcRefresh] = useState(0)
  const dest = destinations.find(d => d.id === id)
  if (!dest) return <div className="p-8 text-center">{t('destinationDetail.notFound')}</div>
  const relatedArticles = articles.filter(a => a.destination === dest.name)
  const relatedUserGuides = useMemo(() => getUserGuidesByDestination(dest.name), [dest.name, ugcRefresh])
  const guide = destinationGuides[dest.id]
  const breadcrumbs = [
    { label: t('common.home'), to: '/' },
    { label: t('common.destinations'), to: '/destinations' },
    { label: dest.name },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 pt-6 print:hidden">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{dest.name}</h1>
          <p className="text-slate-200 mt-1">{dest.country} · {dest.continent}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">{t('destinationDetail.overview')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50 rounded-xl">
              <p className="text-slate-500 text-sm">{t('destinationDetail.dailyBudget')}</p>
              <p className="text-2xl font-bold text-amber-600">¥{dest.dailyBudget}</p>
            </div>
            <div className="p-4 bg-teal-50 rounded-xl">
              <p className="text-slate-500 text-sm">{t('destinationDetail.visa')}</p>
              <p className="text-lg font-semibold text-teal-700">{dest.visaType}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-slate-500 text-sm">{t('destinationDetail.recommendedStay')}</p>
              <p className="text-lg font-semibold text-blue-700">{t('destinationDetail.recommendedDays')}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {dest.tags.map(tagItem => (
              <span key={tagItem} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                #{tagItem}
              </span>
            ))}
          </div>
          <div className="mt-6 print:hidden">
            <ServiceLinks destinationName={dest.name} />
          </div>
        </div>

        {guide && (
          <div className="space-y-6 mb-10">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">{t('destinationDetail.customsTaboos')}</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{guide.customsTaboos || t('destinationDetail.noInfo')}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">{t('destinationDetail.beliefs')}</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{guide.beliefs || t('destinationDetail.noInfo')}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-3">{t('destinationDetail.travelRisks')}</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{guide.travelRisks || t('destinationDetail.noInfo')}</p>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-slate-800 mb-4">{t('destinationDetail.guides')}</h2>
        <div className="space-y-4">
          {relatedArticles.length > 0 ? (
            relatedArticles.map(a => (
              <Link
                key={a.id}
                to={`/articles/${a.id}`}
                className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex gap-4">
                  <img src={a.cover} alt="" loading="lazy" className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800">{a.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t('destinationDetail.daysBudgetAuthor', { days: a.days, budget: a.budget, author: a.author })}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : null}
          {relatedUserGuides.length > 0 && (
            <>
              <p className="text-slate-600 text-sm mt-4 mb-2">{t('userGuide.relatedExperiences')}</p>
              {relatedUserGuides.map(g => (
                <Link
                  key={g.id}
                  to={`/articles/${g.id}`}
                  className="block bg-amber-50/80 rounded-xl p-4 shadow-sm hover:shadow-md transition border border-amber-100"
                >
                  <div className="flex gap-4">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-amber-700 font-medium">{t('userGuide.userBadge')}</span>
                      <h3 className="font-bold text-slate-800 mt-0.5">{g.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{g.destinationName} · ¥{g.budget} · {g.author} · {g.createdAt.slice(0, 10)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
          {relatedArticles.length === 0 && relatedUserGuides.length === 0 && (
            <p className="text-slate-500">{t('destinationDetail.noGuides')}</p>
          )}
        </div>

        <section className="mt-8">
          <h3 className="text-lg font-bold text-slate-800 mb-3">{t('userGuide.shareExperience')}</h3>
          <UserGuideForm initialDestination={dest.name} onSuccess={() => setUgcRefresh((n) => n + 1)} compact />
        </section>
      </div>
    </div>
  )
}
