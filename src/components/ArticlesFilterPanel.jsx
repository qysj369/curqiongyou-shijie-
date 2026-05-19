import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CopyPageLinkButton from './CopyPageLinkButton'
import StickyFilterBar from './StickyFilterBar'
import { useMinimalUi } from '../contexts/MinimalUiContext'
import {
  ARTICLE_INTENT_FILTER_OPTIONS,
  INTENT_CHIP_GROUPS,
} from '../data/chinaIntentVariants.js'

const BUDGET_OPTIONS = [
  { value: 'any', labelKey: 'home.budgetAny' },
  { value: '2000', labelKey: 'home.budget0_2000' },
  { value: '5000', labelKey: 'home.budget2000_5000' },
  { value: '10000', labelKey: 'home.budget5000_10000' },
]
const DAYS_OPTIONS = [
  { value: 'any', labelKey: 'home.daysAny' },
  { value: '3', labelKey: 'home.days3' },
  { value: '7', labelKey: 'home.days7' },
  { value: '15', labelKey: 'home.days15' },
]

function countActiveFilters(state) {
  let n = 0
  if (state.budgetMax !== 'any') n += 1
  if (state.daysFilter !== 'any') n += 1
  if (state.destinationFilter !== 'any') n += 1
  if (state.sortBy !== 'budgetAsc') n += 1
  if (state.sourceFilter !== 'all') n += 1
  if (state.intentFilter !== 'any') n += 1
  if (state.keyword.trim()) n += 1
  return n
}

export default function ArticlesFilterPanel({
  keyword,
  setKeyword,
  sourceFilter,
  setSourceFilter,
  budgetMax,
  setBudgetMax,
  daysFilter,
  setDaysFilter,
  destinationFilter,
  setDestinationFilter,
  intentFilter,
  setIntentFilter,
  sortBy,
  setSortBy,
  destinationList,
  hasActiveFilters,
  resetFilters,
  resultsCount,
}) {
  const { t } = useTranslation()
  const { minimal } = useMinimalUi()
  const activeCount = useMemo(
    () =>
      countActiveFilters({
        budgetMax,
        daysFilter,
        destinationFilter,
        sortBy,
        sourceFilter,
        intentFilter,
        keyword,
      }),
    [budgetMax, daysFilter, destinationFilter, sortBy, sourceFilter, intentFilter, keyword],
  )

  const [filtersOpen, setFiltersOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.localStorage.getItem('roamwise:minimal-ui-v1') === '1') return false
    return window.matchMedia('(min-width: 1024px)').matches
  })
  const [burstKey, setBurstKey] = useState(0)

  useEffect(() => {
    if (minimal) setFiltersOpen(false)
  }, [minimal])

  useEffect(() => {
    if (activeCount > 0) setFiltersOpen(true)
  }, [activeCount])

  const toggleFilters = () => {
    setFiltersOpen((open) => {
      if (!open) setBurstKey((k) => k + 1)
      return !open
    })
  }

  const showPanel = filtersOpen
  const selectClass =
    'px-2.5 py-1.5 min-h-9 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400'

  return (
    <StickyFilterBar>
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${
          showPanel && burstKey > 0 ? 'rw-routes-filter-shell--burst' : ''
        }`}
      >
        {showPanel ? (
          <div
            className="rw-routes-filter-aurora pointer-events-none absolute inset-0 rounded-2xl"
            aria-hidden
          />
        ) : null}
        {showPanel ? (
          <>
            <span className="rw-routes-filter-spark rw-routes-filter-spark--1" aria-hidden />
            <span className="rw-routes-filter-spark rw-routes-filter-spark--2" aria-hidden />
            <span className="rw-routes-filter-spark rw-routes-filter-spark--3" aria-hidden />
          </>
        ) : null}

        <div className={`relative z-[1] ${showPanel ? 'p-3 md:p-4' : 'p-2.5 md:p-3'} space-y-2.5`}>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="articles-keyword" className="sr-only">
              {t('articles.searchPlaceholder')}
            </label>
            <input
              id="articles-keyword"
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={
                minimal ? t('articles.searchPlaceholderMinimal') : t('articles.searchPlaceholder')
              }
              autoComplete="off"
              className="flex-1 min-w-[min(100%,10rem)] max-w-xl px-3 py-2 min-h-10 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-800 text-sm dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="button"
              onClick={toggleFilters}
              aria-expanded={filtersOpen}
              aria-controls="articles-filters-panel"
              className={`rw-routes-filter-toggle inline-flex min-h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold transition ${
                filtersOpen
                  ? 'bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 text-white shadow-lg shadow-fuchsia-500/30'
                  : 'border border-slate-200 bg-slate-50 text-slate-800 hover:border-sky-300 hover:bg-sky-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
              }`}
            >
              <span className="rw-routes-filter-star text-base leading-none" aria-hidden>
                ✦
              </span>
              {filtersOpen ? t('articles.filtersCollapse') : t('articles.filtersExpand')}
              {activeCount > 0 ? (
                <span
                  className={`rw-routes-filter-badge ml-0.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[11px] font-bold ${
                    filtersOpen ? 'bg-white/25 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {activeCount}
                </span>
              ) : null}
            </button>
            <CopyPageLinkButton />
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-2 min-h-10 text-xs font-medium text-sky-800 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-xl hover:bg-sky-100 dark:hover:bg-sky-900/30 transition"
              >
                {t('articles.resetFilters')}
              </button>
            ) : null}
          </div>

          {minimal && !filtersOpen ? (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 px-0.5">
              {t('articles.minimalFiltersHint', { count: resultsCount })}
            </p>
          ) : null}

          <div
            id="articles-filters-panel"
            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none ${
              showPanel ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
            aria-hidden={!showPanel}
          >
            <div className="overflow-hidden">
              <div className={`space-y-3 pt-1 ${showPanel ? 'rw-routes-filter-panel-in' : ''}`}>
                {!minimal ? (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {t('userGuide.sourceAll')}:
                    </span>
                    {['all', 'editor', 'user'].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSourceFilter(key)}
                        className={`px-2.5 py-1.5 min-h-9 rounded-lg text-xs font-medium transition ${
                          sourceFilter === key
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {key === 'all'
                          ? t('userGuide.sourceAll')
                          : key === 'editor'
                            ? t('userGuide.sourceEditor')
                            : t('userGuide.sourceUser')}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <select
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    aria-label={t('articles.filterByBudget')}
                    className={selectClass}
                  >
                    {BUDGET_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(e.target.value)}
                    aria-label={t('articles.filterByDays')}
                    className={selectClass}
                  >
                    {DAYS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={destinationFilter}
                    onChange={(e) => setDestinationFilter(e.target.value)}
                    aria-label={t('articles.filterByDest')}
                    className={`${selectClass} min-w-[7rem] max-w-[12rem]`}
                  >
                    <option value="any">{t('articles.destinationAny')}</option>
                    {destinationList.map((dest) => (
                      <option key={dest} value={dest}>
                        {dest}
                      </option>
                    ))}
                  </select>
                  <select
                    value={intentFilter}
                    onChange={(e) => setIntentFilter(e.target.value)}
                    aria-label={t('articles.filterByIntent')}
                    className={`${selectClass} min-w-[6rem] max-w-[10rem]`}
                  >
                    {ARTICLE_INTENT_FILTER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label={t('sort.label')}
                    className={selectClass}
                  >
                    <option value="budgetAsc">{t('sort.budgetAsc')}</option>
                    <option value="dateDesc">{t('sort.dateDesc')}</option>
                    <option value="viewsDesc">{t('sort.viewsDesc')}</option>
                    <option value="daysAsc">{t('sort.daysAsc')}</option>
                  </select>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {t('articles.intentQuickChipsLabel')}
                  </p>
                  <div className="touch-scroll-x flex gap-2 pb-1 -mx-0.5 px-0.5">
                    {INTENT_CHIP_GROUPS.flatMap((group) =>
                      group.values.map((value) => {
                        const opt = ARTICLE_INTENT_FILTER_OPTIONS.find((o) => o.value === value)
                        if (!opt) return null
                        const active = intentFilter === value
                        return (
                          <button
                            key={`${group.id}-${value}`}
                            type="button"
                            onClick={() => setIntentFilter(active ? 'any' : value)}
                            aria-pressed={active}
                            className={`shrink-0 px-2.5 py-1.5 min-h-8 rounded-full text-xs font-medium transition ${
                              active
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/35 rw-routes-chip-active'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {t(opt.labelKey)}
                          </button>
                        )
                      }),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StickyFilterBar>
  )
}
