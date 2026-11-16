import { Outlet } from 'react-router-dom'
import { FeedbackButton } from '../components/common/FeedbackButton'
import { Footer } from '../components/common/Footer'
import { Header } from '../components/common/Header'
import { NewsletterPrompt } from '../components/common/NewsletterPrompt'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Header />
      <main><Outlet /></main>
      <Footer />
      <FeedbackButton />
      <NewsletterPrompt />
    </div>
  )
}
