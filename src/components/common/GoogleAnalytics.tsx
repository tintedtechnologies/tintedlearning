import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { analyticsMeasurementId, useAnalyticsChoice } from './AnalyticsConsent'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

/**
 * Loads Google Analytics only after the visitor allows it. If they later decline,
 * the standard Google opt-out flag stops measurement for the rest of the visit.
 */
export function GoogleAnalytics() {
  const location = useLocation()
  const choice = useAnalyticsChoice()

  useEffect(() => {
    if (!analyticsMeasurementId) return

    const disableKey = `ga-disable-${analyticsMeasurementId}`
    if (choice !== 'granted') {
      if (choice === 'denied') (window as unknown as Record<string, boolean>)[disableKey] = true
      return
    }
    (window as unknown as Record<string, boolean>)[disableKey] = false

    if (!window.gtag) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsMeasurementId}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = (...args: unknown[]) => window.dataLayer.push(args)
      window.gtag('js', new Date())
      window.gtag('config', analyticsMeasurementId, { send_page_view: false })
    }

    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
    })
  }, [location, choice])

  return null
}
