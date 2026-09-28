import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    if (!measurementId) return

    if (!window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
      window.gtag('js', new Date())
      window.gtag('config', measurementId, { send_page_view: false })
    }

    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
    })
  }, [location])

  return null
}