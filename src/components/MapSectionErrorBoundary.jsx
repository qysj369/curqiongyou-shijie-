import { Component } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

class MapSectionErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('MapSectionErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <MapSectionFallback onRetry={() => this.setState({ hasError: false })} />
      )
    }
    return this.props.children
  }
}

function MapSectionFallback({ onRetry }) {
  const { t } = useTranslation()
  return (
    <div
      className="flex min-h-[min(52vh,22rem)] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100/80 px-4 py-10 text-center dark:border-slate-600 dark:bg-slate-800/50 md:min-h-[24rem]"
      role="alert"
    >
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{t('home.mapEmbedFailedTitle')}</p>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        {t('home.mapEmbedFailedBody')}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link
          to="/map-hub"
          className="inline-flex min-h-10 items-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white hover:bg-sky-700"
        >
          {t('home.mapEmbedOpenHub')}
        </Link>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex min-h-10 items-center rounded-xl border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-white dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {t('errorBoundary.retry')}
        </button>
      </div>
    </div>
  )
}

export default MapSectionErrorBoundary
