import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { LessonPage } from './pages/LessonPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import { TokensPage } from './pages/TokensPage'
import { ContextPage } from './pages/ContextPage'
import { TemperaturePage } from './pages/TemperaturePage'
import { PromptBuilderPage } from './pages/PromptBuilderPage'
import { EmbeddingsPage } from './pages/EmbeddingsPage'
import { RagPage } from './pages/RagPage'
import { AgentsPage } from './pages/AgentsPage'
import { ScrollToTop } from './components/common/ScrollToTop'
import { CareerPage } from './pages/CareerPage'
import { PythonPage } from './pages/PythonPage'

export default function App() {
  return (
    <>
      <ScrollToTop />
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:lessonId" element={<LessonPage />} />
        <Route path="/careers/:careerId" element={<CareerPage />} />
        <Route path="/playground/python" element={<PythonPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/playground/tokens" element={<TokensPage />} />
          <Route path="/playground/context" element={<ContextPage />} />
          <Route path="/playground/temperature" element={<TemperaturePage />} />
          <Route path="/playground/prompt-builder" element={<PromptBuilderPage />} />
          <Route path="/playground/embeddings" element={<EmbeddingsPage />} />
          <Route path="/playground/rag" element={<RagPage />} />
          <Route path="/playground/agents" element={<AgentsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    </>
  )
}
