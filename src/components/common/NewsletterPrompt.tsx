import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NewsletterForm, closeNewsletterPromptForGood, newsletterEnabled, newsletterPromptClosedKey } from './NewsletterSignup'

/** How long a visitor reads before the prompt may appear. */
const delayMs = 30_000
/** The prompt may also appear once the visitor opens this many pages. */
const pagesBeforePrompt = 2
/** Phones never see the prompt: it would cover too much of a small screen. */
const desktopQuery = '(min-width: 768px)'

const visitStartKey = 'tl-visit-start'
const pageCountKey = 'tl-page-count'

function wasClosedBefore() {
  try { return window.localStorage.getItem(newsletterPromptClosedKey) === 'closed' } catch { return false }
}

/** Reads a number kept for this browser tab, so the timer and page count survive a full page reload. */
function readVisitNumber(key: string, fallback: number) {
  try {
    const stored = Number(window.sessionStorage.getItem(key))
    return Number.isFinite(stored) && stored > 0 ? stored : fallback
  } catch { return fallback }
}

function saveVisitNumber(key: string, value: number) {
  try { window.sessionStorage.setItem(key, String(value)) } catch { /* Without storage the count restarts on reload, which only delays the prompt. */ }
}

/**
 * A small corner card that invites a visitor to get new lessons by email.
 * It appears once, after 30 seconds or on the second page viewed, whichever comes first.
 * It never appears on phones, and never again after it is closed or the visitor subscribes.
 * It does not block the page: there is no overlay, and focus stays where the visitor left it.
 */
export function NewsletterPrompt() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(() => !newsletterEnabled || wasClosedBefore())
  const countedPath = useRef<string | null>(null)

  // Count pages viewed in this tab, and open on the second one.
  useEffect(() => {
    if (done || open) return
    // Count each page once. In development React runs effects twice, which would count the first page as two.
    if (countedPath.current === location.pathname) return
    countedPath.current = location.pathname
    const count = readVisitNumber(pageCountKey, 0) + 1
    saveVisitNumber(pageCountKey, count)
    if (count >= pagesBeforePrompt && window.matchMedia(desktopQuery).matches && !wasClosedBefore()) setOpen(true)
  }, [location.pathname])

  // Or open 30 seconds after the visit started.
  useEffect(() => {
    if (done || open) return
    const start = readVisitNumber(visitStartKey, Date.now())
    saveVisitNumber(visitStartKey, start)
    const timer = window.setTimeout(() => {
      if (window.matchMedia(desktopQuery).matches && !wasClosedBefore()) setOpen(true)
    }, Math.max(0, start + delayMs - Date.now()))
    return () => window.clearTimeout(timer)
  }, [done, open])

  const close = () => {
    closeNewsletterPromptForGood()
    setOpen(false)
    setDone(true)
  }

  // Escape closes the card, the same as its Close button.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return null

  return (
    <aside aria-labelledby="newsletter-prompt-title" className="fixed bottom-6 left-6 z-30 hidden w-[22rem] rounded-3xl border border-line bg-white p-6 shadow-soft md:block">
      <button type="button" onClick={close} aria-label="Close newsletter signup" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-teal hover:bg-mist"><X size={18} /></button>
      <h2 id="newsletter-prompt-title" className="pr-8 font-display text-xl font-bold text-teal">Get new lessons when they drop</h2>
      <p className="mt-2 text-sm leading-6 text-ink">One email when a new lesson or project is published. Only your email address is collected.</p>
      <NewsletterForm id="newsletter-prompt-email" tone="light" onSubscribed={() => window.setTimeout(() => { setOpen(false); setDone(true) }, 4000)} />
      <button type="button" onClick={close} className="mt-4 text-sm font-bold text-teal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">No thanks</button>
    </aside>
  )
}
