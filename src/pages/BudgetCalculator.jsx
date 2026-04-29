import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useUsdApproxDisplay } from '../contexts/UsdApproxPreferenceContext'
import { approxUsdFromCny, formatInteger } from '../utils/localeFormat'
import { articles } from '../data/mockData'

function toPositiveNumber(value, fallback = 0) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < 0) return fallback
  return n
}

function toBudgetFilterKey(totalBudgetPerPerson) {
  if (totalBudgetPerPerson <= 2000) return '2000'
  if (totalBudgetPerPerson <= 5000) return '5000'
  return '10000'
}

function toDaysFilterKey(days) {
  if (days <= 3) return '3'
  if (days <= 7) return '7'
  return '15'
}

function toMatchLevel(gap, excellent, good) {
  if (gap <= excellent) return 'high'
  if (gap <= good) return 'medium'
  return 'low'
}

function matchLevelMeta(level, type) {
  const dict = {
    high: {
      budget: { label: '预算高匹配', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
      days: { label: '天数高匹配', className: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
    },
    medium: {
      budget: { label: '预算中匹配', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
      days: { label: '天数中匹配', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
    },
    low: {
      budget: { label: '预算低匹配', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
      days: { label: '天数低匹配', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    },
  }
  return dict[level]?.[type] || dict.low[type]
}

export default function BudgetCalculator() {
  const { t, i18n } = useTranslation()
  const { showUsdApprox } = useUsdApproxDisplay()

  const [days, setDays] = useState(7)
  const [travelers, setTravelers] = useState(1)
  const [transportPerPerson, setTransportPerPerson] = useState(1200)
  const [stayPerNight, setStayPerNight] = useState(220)
  const [foodPerDayPerPerson, setFoodPerDayPerPerson] = useState(110)
  const [ticketsPerPerson, setTicketsPerPerson] = useState(300)
  const [miscPerDayPerPerson, setMiscPerDayPerPerson] = useState(60)

  const result = useMemo(() => {
    const safeDays = Math.max(1, Math.round(toPositiveNumber(days, 1)))
    const safeTravelers = Math.max(1, Math.round(toPositiveNumber(travelers, 1)))
    const transport = toPositiveNumber(transportPerPerson) * safeTravelers
    const stay = toPositiveNumber(stayPerNight) * safeDays
    const food = toPositiveNumber(foodPerDayPerPerson) * safeDays * safeTravelers
    const tickets = toPositiveNumber(ticketsPerPerson) * safeTravelers
    const misc = toPositiveNumber(miscPerDayPerPerson) * safeDays * safeTravelers
    const total = transport + stay + food + tickets + misc
    const perPerson = total / safeTravelers
    const perPersonPerDay = perPerson / safeDays
    return {
      days: safeDays,
      travelers: safeTravelers,
      transport,
      stay,
      food,
      tickets,
      misc,
      total,
      perPerson,
      perPersonPerDay,
    }
  }, [days, travelers, transportPerPerson, stayPerNight, foodPerDayPerPerson, ticketsPerPerson, miscPerDayPerPerson])

  const fmt = (value) => `¥${formatInteger(Math.round(value), i18n.language)}`
  const usdLine = (value) => {
    if (!showUsdApprox) return null
    const usd = approxUsdFromCny(value)
    if (usd == null) return null
    return `~US$${formatInteger(usd, i18n.language)}`
  }

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 shadow-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'

  const recommendedRoutes = useMemo(() => {
    const targetBudget = result.perPerson
    const targetDays = result.days
    return [...articles]
      .map((route) => {
        const budget = Number(route.budget) || 0
        const days = Number(route.days) || 0
        const budgetGap = Math.abs(budget - targetBudget)
        const dayGap = Math.abs(days - targetDays)
        const score = budgetGap + dayGap * 500
        return {
          route,
          score,
          budgetGap,
          dayGap,
          budgetLevel: toMatchLevel(budgetGap, 600, 1500),
          daysLevel: toMatchLevel(dayGap, 1, 2),
        }
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(({ route, budgetLevel, daysLevel, budgetGap, dayGap }) => ({
        route,
        budgetLevel,
        daysLevel,
        budgetGap,
        dayGap,
      }))
  }, [result.perPerson, result.days])

  const routesQuery = useMemo(() => {
    const b = toBudgetFilterKey(result.perPerson)
    const d = toDaysFilterKey(result.days)
    return `/routes?sort=budgetAsc&budget=${b}&days=${d}`
  }, [result.perPerson, result.days])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('budgetCalculator.title')}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{t('budgetCalculator.lead')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('budgetCalculator.formTitle')}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.days')}</span>
              <input type="number" min="1" className={inputClass} value={days} onChange={(e) => setDays(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.travelers')}</span>
              <input type="number" min="1" className={inputClass} value={travelers} onChange={(e) => setTravelers(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.transport')}</span>
              <input type="number" min="0" className={inputClass} value={transportPerPerson} onChange={(e) => setTransportPerPerson(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.stay')}</span>
              <input type="number" min="0" className={inputClass} value={stayPerNight} onChange={(e) => setStayPerNight(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.food')}</span>
              <input type="number" min="0" className={inputClass} value={foodPerDayPerPerson} onChange={(e) => setFoodPerDayPerPerson(e.target.value)} />
            </label>
            <label className="space-y-1">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.tickets')}</span>
              <input type="number" min="0" className={inputClass} value={ticketsPerPerson} onChange={(e) => setTicketsPerPerson(e.target.value)} />
            </label>
            <label className="space-y-1 sm:col-span-2">
              <span className="text-sm text-slate-600 dark:text-slate-300">{t('budgetCalculator.misc')}</span>
              <input type="number" min="0" className={inputClass} value={miscPerDayPerPerson} onChange={(e) => setMiscPerDayPerPerson(e.target.value)} />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-sky-200 bg-sky-50 p-5 shadow-sm dark:border-sky-700/40 dark:bg-sky-950/30">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{t('budgetCalculator.resultTitle')}</h2>
          <div className="mt-4 space-y-2 text-sm sm:text-base">
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.transportTotal')}</span><strong>{fmt(result.transport)}</strong></p>
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.stayTotal')}</span><strong>{fmt(result.stay)}</strong></p>
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.foodTotal')}</span><strong>{fmt(result.food)}</strong></p>
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.ticketsTotal')}</span><strong>{fmt(result.tickets)}</strong></p>
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.miscTotal')}</span><strong>{fmt(result.misc)}</strong></p>
            <hr className="border-sky-200 dark:border-sky-700/40" />
            <p className="flex justify-between gap-3 text-base sm:text-lg"><span>{t('budgetCalculator.total')}</span><strong>{fmt(result.total)}</strong></p>
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.perPerson')}</span><strong>{fmt(result.perPerson)}</strong></p>
            <p className="flex justify-between gap-3"><span>{t('budgetCalculator.perPersonPerDay')}</span><strong>{fmt(result.perPersonPerDay)}</strong></p>
            {showUsdApprox && (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {t('budgetCalculator.usdHint', {
                  total: usdLine(result.total) || '--',
                  perPerson: usdLine(result.perPerson) || '--',
                  perDay: usdLine(result.perPersonPerDay) || '--',
                })}
              </p>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-emerald-200/80 bg-white/80 px-3 py-2 text-sm text-slate-700 dark:border-emerald-700/40 dark:bg-slate-900/40 dark:text-slate-200">
            {t('budgetCalculator.tip', { days: result.days, travelers: result.travelers })}
          </div>
          <Link to={routesQuery} className="mt-4 inline-flex items-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
            {t('budgetCalculator.cta')}
          </Link>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            匹配路线推荐 · Recommended routes
          </h2>
          <Link to={routesQuery} className="text-sm font-medium text-sky-700 hover:text-sky-800 dark:text-sky-300 dark:hover:text-sky-200">
            查看更多匹配路线 →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {recommendedRoutes.map(({ route, budgetLevel, daysLevel, budgetGap, dayGap }) => {
            const budgetMeta = matchLevelMeta(budgetLevel, 'budget')
            const daysMeta = matchLevelMeta(daysLevel, 'days')
            return (
              <Link key={route.id} to={`/routes/${route.id}`} className="rounded-xl border border-sky-100 bg-sky-50/60 p-3 hover:border-sky-300 transition dark:border-sky-900/50 dark:bg-sky-950/20">
                <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{route.title}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                {route.destination} · {fmt(route.budget)} · {route.days}天
              </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${budgetMeta.className}`}>{budgetMeta.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${daysMeta.className}`}>{daysMeta.label}</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-400">
                  预算差 {fmt(budgetGap)} · 天数差 {Math.round(dayGap)} 天
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
