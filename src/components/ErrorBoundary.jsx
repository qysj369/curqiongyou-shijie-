import { Component } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

class ErrorBoundaryClass extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      )
    }
    return this.props.children
  }
}

function ErrorFallback({ onRetry, error }) {
  const { t } = useTranslation()
  const devDetail =
    import.meta.env.DEV && error?.message ? String(error.message) : ''
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12 bg-slate-50 dark:bg-slate-950">
      <p className="text-sky-700 dark:text-sky-300 font-semibold mb-2">{t('errorBoundary.title')}</p>
      <p className="text-slate-600 dark:text-slate-400 text-sm text-center mb-6 max-w-sm">
        {t('errorBoundary.body')}
      </p>
      {devDetail ? (
        <p className="mb-6 max-w-md rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left font-mono text-xs text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100">
          {devDetail}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center px-5 py-2.5 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700"
          aria-label={t('errorBoundary.home')}
        >
          {t('errorBoundary.home')}
        </Link>
        {typeof onRetry === 'function' ? (
          <button
            type="button"
            onClick={() => onRetry()}
            className="inline-flex min-h-11 items-center px-5 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
            aria-label={t('errorBoundary.retry')}
          >
            {t('errorBoundary.retry')}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex min-h-11 items-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label={t('errorBoundary.reload')}
        >
          {t('errorBoundary.reload')}
        </button>
      </div>
    </div>
  )
}

export default ErrorBoundaryClass
