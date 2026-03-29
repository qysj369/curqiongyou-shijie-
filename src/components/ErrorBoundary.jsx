import { Component } from 'react'
import { Link } from 'react-router-dom'

class ErrorBoundaryClass extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
    }
    return this.props.children
  }
}

function ErrorFallback({ onRetry }) {
  // useTranslation 需要在 React 组件里用，这里用简单文案避免 hook 在 class 子组件里的问题
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12">
      <p className="text-amber-600 font-semibold mb-2">出了点小问题</p>
      <p className="text-slate-600 text-sm text-center mb-6">
        页面加载异常，请刷新或返回首页重试。
      </p>
      <div className="flex gap-3">
        <Link to="/" className="px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600">
          返回首页
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 font-medium hover:bg-slate-300"
        >
          刷新页面
        </button>
      </div>
    </div>
  )
}

export default ErrorBoundaryClass
