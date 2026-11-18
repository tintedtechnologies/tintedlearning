import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { WhyThisMattersPage } from './pages/WhyThisMattersPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LearningSectionPage } from './pages/LearningSectionPage'
import { CertificationsPage } from './pages/CertificationsPage'
import { StageAssessmentPage } from './pages/StageAssessmentPage'
import { LessonPage } from './pages/LessonPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { TemperaturePage } from './pages/TemperaturePage'
import { PromptBuilderPage } from './pages/PromptBuilderPage'
import { AgentsPage } from './pages/AgentsPage'
// These playgrounds use large libraries (a tokenizer and an embedding model), so each page
// loads only when someone opens it, instead of with every page of the site.
const TokensPage = lazy(() => import('./pages/TokensPage').then((module) => ({ default: module.TokensPage })))
const ContextPage = lazy(() => import('./pages/ContextPage').then((module) => ({ default: module.ContextPage })))
const EmbeddingsPage = lazy(() => import('./pages/EmbeddingsPage').then((module) => ({ default: module.EmbeddingsPage })))
const playgroundLoading = <p className="shell py-16 text-muted">Loading the playground…</p>
import { ScrollToTop } from './components/common/ScrollToTop'
import { PythonPage } from './pages/PythonPage'
import { PortfolioPage } from './pages/PortfolioPage'
import { PortfolioSharePage } from './pages/PortfolioSharePage'
import { DashboardPage } from './pages/DashboardPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { GoogleAnalytics } from './components/common/GoogleAnalytics'

export default function App() {
  return (
    <>
      <GoogleAnalytics />
      <ScrollToTop />
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/stage/:stageId/test" element={<StageAssessmentPage />} />
        <Route path="/learn/sections/certifications" element={<CertificationsPage />} />
        <Route path="/learn/sections/foundations" element={<Navigate to="/learn/sections/ai-foundations" replace />} />
        <Route path="/certifications" element={<Navigate to="/learn/sections/certifications" replace />} />
        <Route path="/learn/certifications" element={<Navigate to="/learn/sections/certifications" replace />} />
        <Route path="/learn/certification/:slug" element={<Navigate to="/learn/sections/certifications" replace />} />
        <Route path="/learn/sections/:sectionId" element={<LearningSectionPage />} />
        <Route path="/learn/algorithms-and-data-structures" element={<Navigate to="/learn/python-search-and-sort" replace />} />
        <Route path="/learn/chatbot-openai" element={<Navigate to="/learn/build-a-chatbot" replace />} />
        <Route path="/learn/chatbot-gemini" element={<Navigate to="/learn/build-a-chatbot" replace />} />
        <Route path="/learn/chatbot-local" element={<Navigate to="/learn/build-a-chatbot" replace />} />
        <Route path="/learn/chatbot-production" element={<Navigate to="/learn/build-a-chatbot" replace />} />
        <Route path="/learn/chatbot-concepts" element={<Navigate to="/learn/large-language-models" replace />} />
        <Route path="/learn/:lessonId" element={<LessonPage />} />
        <Route path="/careers/*" element={<Navigate to="/learn" replace />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/share" element={<PortfolioSharePage />} />
        <Route path="/portfolio/example" element={<PortfolioPage />} />
        <Route path="/portfolio/:trackId" element={<PortfolioPage />} />
        <Route path="/playground/python" element={<PythonPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/playground/tokens" element={<Suspense fallback={playgroundLoading}><TokensPage /></Suspense>} />
          <Route path="/playground/context" element={<Suspense fallback={playgroundLoading}><ContextPage /></Suspense>} />
          <Route path="/playground/temperature" element={<TemperaturePage />} />
          <Route path="/playground/prompt-builder" element={<PromptBuilderPage />} />
          <Route path="/playground/embeddings" element={<Suspense fallback={playgroundLoading}><EmbeddingsPage /></Suspense>} />
          <Route path="/playground/rag" element={<Navigate to="/playground" replace />} />
          <Route path="/playground/agents" element={<AgentsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/why-this-matters" element={<WhyThisMattersPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </>
  )
}
