import { Outlet } from 'react-router-dom'
import { Footer } from '../components/common/Footer'
import { Header } from '../components/common/Header'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  )
}
