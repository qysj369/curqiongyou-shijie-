import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastProvider } from './contexts/ToastContext'
import { SeoOverrideProvider } from './contexts/SeoOverrideContext'
import { UsdApproxPreferenceProvider } from './contexts/UsdApproxPreferenceContext'
import SkipLink from './components/SkipLink'
import Header from './components/Header'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import PageFallback from './components/PageFallback'
import ErrorBoundary from './components/ErrorBoundary'
import AIChatWidget from './components/AIChatWidget'
import SeoHead from './components/SeoHead'
import { isAiChatEnabled } from './services/aiChat'
import GlobeEntrance from './components/GlobeEntrance'
import Home from './pages/Home'

const Articles = lazy(() => import('./pages/Articles'))
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Community = lazy(() => import('./pages/Community'))
const CommunityQA = lazy(() => import('./pages/CommunityQA'))
const CommunityQADetail = lazy(() => import('./pages/CommunityQA').then((m) => ({ default: m.QADetail })))
const CommunityBuddies = lazy(() => import('./pages/CommunityBuddies'))
const MessageBoard = lazy(() => import('./pages/MessageBoard'))
const Membership = lazy(() => import('./pages/Membership'))
const BudgetCalculator = lazy(() => import('./pages/BudgetCalculator'))
const Me = lazy(() => import('./pages/Me'))
const About = lazy(() => import('./pages/About'))
const LegalPrivacy = lazy(() => import('./pages/LegalPrivacy'))
const LegalTerms = lazy(() => import('./pages/LegalTerms'))
const AiTravelmate = lazy(() => import('./pages/ai-travelmate'))
const AiPlannerPage = lazy(() => import('./pages/ai-planner'))
const NotFound = lazy(() => import('./pages/NotFound'))

// 子路径部署（如 GitHub Pages: /budget-travel/）时与 vite base 一致
const basename = import.meta.env.BASE_URL === '/' ? '' : (import.meta.env.BASE_URL || '').replace(/\/$/, '')

function AppLayout() {
  const location = useLocation()
  const hideFloatingAiWidget = location.pathname === '/ai' || location.pathname === '/ai-planner'
  const isGlobeEntrance = location.pathname === '/'

  return (
    <ToastProvider>
      <SeoOverrideProvider>
      <UsdApproxPreferenceProvider>
      <SeoHead />
      <div className="min-h-screen bg-slate-50 flex flex-col dark:bg-slate-950">
        <SkipLink />
        {!isGlobeEntrance && <Header />}
        <main id="main-content" tabIndex={-1}>
          <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<GlobeEntrance />} />
            <Route path="/map" element={<Home />} />
            <Route path="/destination" element={<Navigate to="/map" replace />} />
            <Route path="/destination/:id" element={<Navigate to="/map" replace />} />
            <Route path="/destinations" element={<Navigate to="/map" replace />} />
            <Route path="/destinations/:id" element={<Navigate to="/map" replace />} />
            <Route path="/routes" element={<Articles />} />
            <Route path="/routes/:id" element={<ArticleDetail />} />
            <Route path="/budget" element={<BudgetCalculator />} />
            <Route path="/me" element={<Me />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/qa" element={<CommunityQA />} />
            <Route path="/community/qa/:id" element={<CommunityQADetail />} />
            <Route path="/community/buddies" element={<CommunityBuddies />} />
            <Route path="/board" element={<MessageBoard />} />
            <Route path="/membership" element={<Membership />} />
            {/* legacy routes: keep old links alive */}
            <Route path="/articles" element={<Navigate to="/routes" replace />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/favorites" element={<Navigate to="/me" replace />} />
            <Route path="/budget-calculator" element={<Navigate to="/budget" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/ai" element={<AiTravelmate />} />
            <Route path="/ai-planner" element={<AiPlannerPage />} />
            <Route path="/privacy" element={<LegalPrivacy />} />
            <Route path="/terms" element={<LegalTerms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </main>
        {!isGlobeEntrance && <Footer />}
        {!isGlobeEntrance && <BackToTop />}
        {isAiChatEnabled() && !hideFloatingAiWidget && <AIChatWidget />}
      </div>
      </UsdApproxPreferenceProvider>
      </SeoOverrideProvider>
      </ToastProvider>
  )
}

function App() {
  return (
    <BrowserRouter basename={basename}>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
