import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { MinimalUiProvider } from './contexts/MinimalUiContext'
import { ToastProvider } from './contexts/ToastContext'
import { SeoOverrideProvider } from './contexts/SeoOverrideContext'
import { UsdApproxPreferenceProvider } from './contexts/UsdApproxPreferenceContext'
import SkipLink from './components/SkipLink'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import SiteCapabilityHint from './components/SiteCapabilityHint'
import NetworkStatusBanner from './components/NetworkStatusBanner'
import BackToTop from './components/BackToTop'
import Footer from './components/Footer'
import PageFallback from './components/PageFallback'
import ErrorBoundary from './components/ErrorBoundary'
import AIChatWidget from './components/AIChatWidget'
import SeoHead from './components/SeoHead'
import RecentPathsTracker from './components/RecentPathsTracker'
import { isAiChatEnabled } from './services/aiChat'
import { useMapHomeImmersive } from './hooks/useMapHomeImmersive'
import { useMinimalUi } from './contexts/MinimalUiContext'
import Home from './pages/Home'

const PlannerLaunchPage = lazy(() => import('./pages/PlannerLaunchPage'))

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
const TripAiPage = lazy(() => import('./pages/TripAiPage'))
const MapHubPage = lazy(() => import('./pages/MapHubPage'))
const AdvisorPage = lazy(() => import('./pages/AdvisorPage'))
const GuideLibraryPage = lazy(() => import('./pages/GuideLibraryPage'))
const BudgetStewardPage = lazy(() => import('./pages/BudgetStewardPage'))
const ChinaReadinessPage = lazy(() => import('./pages/ChinaReadinessPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

// 子路径部署（如 GitHub Pages: /budget-travel/）时与 vite base 一致
const basename = import.meta.env.BASE_URL === '/' ? '' : (import.meta.env.BASE_URL || '').replace(/\/$/, '')

export function AppLayout() {
  const location = useLocation()
  const { minimal: minimalUi } = useMinimalUi()
  const mapHomeImmersive = useMapHomeImmersive()
  const hideFloatingAiWidget =
    minimalUi ||
    location.pathname === '/ai' ||
    location.pathname === '/ai-planner' ||
    location.pathname === '/plan' ||
    location.pathname === '/globe' ||
    location.pathname === '/trip-ai' ||
    location.pathname === '/map-hub' ||
    location.pathname === '/advisor' ||
    location.pathname === '/library' ||
    location.pathname === '/steward'
  /** 启程全屏页：隐藏顶栏底栏与浮窗 AI，与旧 /globe 行为一致 */
  const isPlannerImmersive = location.pathname === '/plan' || location.pathname === '/globe'
  /** 设计稿首页不展示全局配置说明条，保持首屏干净 */
  const hideCapabilityHintOnHome =
    (location.pathname === '/' || location.pathname === '/map') && !mapHomeImmersive

  return (
    <ToastProvider>
      <SeoOverrideProvider>
      <UsdApproxPreferenceProvider>
      <SeoHead />
      <RecentPathsTracker />
      <div className="min-h-screen flex flex-col bg-transparent dark:bg-slate-950">
        <SkipLink />
        <NetworkStatusBanner />
        {!isPlannerImmersive && !mapHomeImmersive && <Header />}
        {!isPlannerImmersive && !mapHomeImmersive && !minimalUi && !hideCapabilityHintOnHome && (
          <SiteCapabilityHint />
        )}
        <main
          id="main-content"
          tabIndex={-1}
          className={
            !isPlannerImmersive && mapHomeImmersive
              ? 'relative min-h-[100dvh]'
              : !isPlannerImmersive
                ? 'rw-main-surface pb-[calc(5rem+env(safe-area-inset-bottom))]'
                : undefined
          }
        >
          <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Home />} />
            <Route path="/plan" element={<PlannerLaunchPage />} />
            <Route path="/globe" element={<Navigate to="/plan" replace />} />
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
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/budget-calculator" element={<Navigate to="/budget" replace />} />
            <Route path="/about" element={<About />} />
            <Route path="/china-readiness" element={<ChinaReadinessPage />} />
            <Route path="/ai" element={<AiTravelmate />} />
            <Route path="/ai-planner" element={<AiPlannerPage />} />
            <Route path="/trip-ai" element={<TripAiPage />} />
            <Route path="/map-hub" element={<MapHubPage />} />
            <Route path="/advisor" element={<AdvisorPage />} />
            <Route path="/library" element={<GuideLibraryPage />} />
            <Route path="/steward" element={<BudgetStewardPage />} />
            <Route path="/privacy" element={<LegalPrivacy />} />
            <Route path="/terms" element={<LegalTerms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          </ErrorBoundary>
        </main>
        {!isPlannerImmersive && <BottomNav mapHomeImmersive={mapHomeImmersive} />}
        {!isPlannerImmersive && !mapHomeImmersive && !minimalUi && <Footer />}
        {!isPlannerImmersive && <BackToTop />}
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
      <MinimalUiProvider>
        <AppLayout />
      </MinimalUiProvider>
    </BrowserRouter>
  )
}

export default App
