import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { destinations } from '../data/mockData'
import Breadcrumbs from '../components/Breadcrumbs'
import { matchesDestinationCard } from '../utils/searchMatch'

const CONTINENT_VALUES = ['all', '亚洲', '欧洲', '北美', '南美', '非洲', '大洋洲', '南极洲']
const CONTINENT_KEYS = ['all', 'asia', 'europe', 'northAmerica', 'southAmerica', 'africa', 'oceania', 'antarctica']
const TAG_KEYS = ['all', 'visaFriendly', 'budgetFriendly', 'beginnerFriendly', 'offTheBeatenPath']

const matchesTag = (d, tagKey) => {
  if (tagKey === 'all') return true
  if (tagKey === 'visaFriendly')
    return ['落地签', '电子签', '申根签', '免签'].some((v) => (d.visaType || '').includes(v))
  if (tagKey === 'budgetFriendly') return d.tags.some(t => ['便宜', '超便宜', '物价友好'].includes(t))
  if (tagKey === 'beginnerFriendly') return d.tags.some(t => ['新手友好'].includes(t))
  if (tagKey === 'offTheBeatenPath') return d.tags.some(t => ['冷门', '小众'].includes(t))
  return true
}

export default function Destinations() {
  const { t } = useTranslation()
  const [continent, setContinent] = useState('all')
  const [tag, setTag] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [search, setSearch] = useState('')

  const getContinentValue = (key) => (key === 'all' ? key : CONTINENT_VALUES[CONTINENT_KEYS.indexOf(key)])
  const filtered = useMemo(() => {
    const list = destinations.filter((d) => {
      const matchContinent = continent === 'all' || d.continent === getContinentValue(continent)
      const matchTag = matchesTag(d, tag)
      const matchSearch = matchesDestinationCard(d, search)
      return matchContinent && matchTag && matchSearch
    })
    if (sortBy === 'budgetAsc') return [...list].sort((a, b) => (a.dailyBudget ?? 0) - (b.dailyBudget ?? 0))
    if (sortBy === 'nameAsc') return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    return list
  }, [continent, tag, sortBy, search])

  const breadcrumbs = [{ label: t('common.home'), to: '/' }, { label: t('destinations.title') }]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('destinations.title')}</h1>
        <p className="text-slate-600 mb-2">{t('destinations.subtitle')}</p>
        <p className="text-slate-500 text-sm mb-6">
          {t('world.sevenContinents')} · {t('world.fiveOceans')} · {t('world.coverAll')}
        </p>

        <div className="mb-6">
          <label htmlFor="dest-search" className="sr-only">
            {t('destinations.searchPlaceholder')}
          </label>
          <input
            id="dest-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('destinations.searchPlaceholder')}
            autoComplete="off"
            className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-slate-600 font-medium">{t('destinations.continent')}</span>
          {CONTINENT_KEYS.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => setContinent(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                continent === c
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-slate-600 hover:bg-amber-50'
              }`}
            >
              {c === 'all' ? t('destinations.all') : t(`continents.${c}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-slate-600 font-medium">{t('destinations.tag')}</span>
          {TAG_KEYS.map((tKey) => (
            <button
              key={tKey}
              type="button"
              onClick={() => setTag(tKey)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                tag === tKey ? 'bg-teal-500 text-white' : 'bg-white text-slate-600 hover:bg-teal-50'
              }`}
            >
              {tKey === 'all' ? t('destinations.all') : t(`tags.${tKey}`)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-slate-600 font-medium">{t('sort.label')}</span>
          {['default', 'budgetAsc', 'nameAsc'].map((key) => (
            <button
              key={key}
              onClick={() => setSortBy(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                sortBy === key ? 'bg-slate-700 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t(`sort.${key}`)}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <p className="text-slate-600 text-sm mb-4">{t('destinations.resultsCount', { count: filtered.length })}</p>
        ) : null}

        {filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
            {t('destinations.noResults')}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <Link
                key={d.id}
                to={`/destinations/${d.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition">
                    {d.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {d.country} · {d.continent}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-amber-600 font-bold">{t('destinations.perDay', { value: d.dailyBudget })}</span>
                    <span className="text-slate-400 text-sm">{t('destinations.routesCount', { count: d.routeCount })}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {d.tags.slice(0, 3).map((tagItem) => (
                      <span key={tagItem} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                        #{tagItem}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
