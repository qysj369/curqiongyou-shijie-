import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { SeoOverrideProvider } from './contexts/SeoOverrideContext'
import SkipLink from './components/SkipLink'
import Header from './components/Header'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import Home from './pages/Home'
import ErrorBoundary from './components/ErrorBoundary'
import AIChatWidget from './components/AIChatWidget'
import SeoHead from './components/SeoHead'
import { isAiChatEnabled } from './services/aiChat'

const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Articles = lazy(() => import('./pages/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Community = lazy(() => import('./pages/Community'))
const CommunityQA = lazy(() => import('./pages/CommunityQA'))
const CommunityQADetail = lazy(() => import('./pages/CommunityQA').then((m) => ({ default: m.QADetail })))
const CommunityBuddies = lazy(() => import('./pages/CommunityBuddies'))
const MessageBoard = lazy(() => import('./pages/MessageBoard'))
const Membership = lazy(() => import('./pages/Membership'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <p className="text-slate-500">加载中…</p>
    </div>
  )
}

// 子路径部署（如 GitHub Pages: /budget-travel/）时与 vite base 一致
const basename = import.meta.env.BASE_URL === '/' ? '' : (import.meta.env.BASE_URL || '').replace(/\/$/, '')

function App() {
  return (
    <BrowserRouter basename={basename}>
      <ToastProvider>
      <SeoOverrideProvider>
      <SeoHead />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <SkipLink />
        <Header />
        <main id="main-content" tabIndex={-1}>
          <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetail />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/qa" element={<CommunityQA />} />
            <Route path="/community/qa/:id" element={<CommunityQADetail />} />
            <Route path="/community/buddies" element={<CommunityBuddies />} />
            <Route path="/board" element={<MessageBoard />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <BackToTop />
        {isAiChatEnabled() && <AIChatWidget />}
      </div>
      </SeoOverrideProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
