import { useEffect, useState } from 'react'

export type AnalyticsChoice = 'granted' | 'denied'

const storageKey = 'tintedAnalyticsConsent'
const changeEvent = 'tinted-analytics-consent-change'

export const analyticsMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || ''

export function getAnalyticsChoice(): AnalyticsChoice | null {
  try {
    const value = window.localStorage.getItem(storageKey)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

export function setAnalyticsChoice(choice: AnalyticsChoice) {
  try { window.localStorage.setItem(storageKey, choice) } catch { /* Storage can be blocked. The banner then shows again on reload. */ }
  window.dispatchEvent(new Event(changeEvent))
}

/** Clears the stored choice so the banner appears again. */
export function resetAnalyticsChoice() {
  try { window.localStorage.removeItem(storageKey) } catch { /* Nothing to clear if storage is blocked. */ }
  window.dispatchEvent(new Event(changeEvent))
}

/** The current choice, kept in step with changes made anywhere on the page. */
export function useAnalyticsChoice() {
  const [choice, setChoice] = useState<AnalyticsChoice | null>(() => getAnalyticsChoice())

  useEffect(() => {
    const update = () => setChoice(getAnalyticsChoice())
    window.addEventListener(changeEvent, update)
    return () => window.removeEventListener(changeEvent, update)
  }, [])

  return choice
}

/** Asks visitors before any analytics runs. Shown only when analytics is configured and no choice exists yet. */
export function AnalyticsConsentBanner() {
  const choice = useAnalyticsChoice()
  if (!analyticsMeasurementId || choice !== null) return null

  return (
    <aside aria-labelledby="analytics-consent-title" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-6">
      <h2 id="analytics-consent-title" className="font-display text-lg font-bold text-teal">Help us see what helps</h2>
      <p className="mt-2 text-sm leading-6 text-ink">
        With your permission, we use Google Analytics to count visits and see which pages people use. It does not run until you choose. You can change your choice at any time from the Analytics settings link in the footer. Details are in the <a href="/privacy" className="font-bold text-teal underline decoration-gold decoration-2 underline-offset-4">Privacy policy</a>.
      </p>
      <div className="mt-4 flex flex-wrap justify-end gap-3">
        <button type="button" onClick={() => setAnalyticsChoice('denied')} className="button button-secondary">No thanks</button>
        <button type="button" onClick={() => setAnalyticsChoice('granted')} className="button button-primary">Allow analytics</button>
      </div>
    </aside>
  )
}
