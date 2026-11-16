import { FormEvent, useState } from 'react'
import { toFormResponseUrl } from '../../utils/googleForm'

const newsletterFormUrl = import.meta.env.VITE_NEWSLETTER_FORM_URL?.trim()
const newsletterResponseUrl = toFormResponseUrl(newsletterFormUrl)
/** The Email question in the newsletter Google Form. It is the only field collected. */
const emailEntry = 'entry.1332342356'

/** True when a newsletter form link is configured. Without one, no signup is shown anywhere. */
export const newsletterEnabled = Boolean(newsletterFormUrl)

/** Browser storage key that records the visitor closed the prompt or subscribed, so the prompt never returns. */
export const newsletterPromptClosedKey = 'tl-newsletter-prompt'

/** Records that this visitor should not see the newsletter prompt again. */
export function closeNewsletterPromptForGood() {
  try { window.localStorage.setItem(newsletterPromptClosedKey, 'closed') } catch { /* Storage can be blocked. The prompt then closes for this page only. */ }
}

interface NewsletterFormProps {
  /** Makes the input id unique when two forms are on one page. */
  id: string
  /** "dark" sits on the teal footer. "light" sits on a white card. */
  tone: 'dark' | 'light'
  onSubscribed?: () => void
}

/** The email field and Subscribe button. It collects only an email address, through the newsletter Google Form. */
export function NewsletterForm({ id, tone, onSubscribed }: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const dark = tone === 'dark'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const email = String((new FormData(form)).get(emailEntry) ?? '').trim()
    const input = form.elements.namedItem(emailEntry) as HTMLInputElement

    if (!input.validity.valid || !email) {
      setError('Enter a valid email address.')
      input.focus()
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await fetch(newsletterResponseUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ [emailEntry]: email }),
      })
      form.reset()
      setIsSubmitted(true)
      // A subscriber never needs the prompt again.
      closeNewsletterPromptForGood()
      onSubscribed?.()
    } catch {
      setError('We could not sign you up. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) return <p className={`mt-4 text-sm ${dark ? 'text-white/80' : 'font-bold text-teal'}`} role="status">Thanks. You are on the list.</p>

  return <>
    <form className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row" onSubmit={submit} noValidate>
      <label className="sr-only" htmlFor={id}>Email address</label>
      <input id={id} name={emailEntry} type="email" autoComplete="email" required placeholder="you@example.com" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} className={`min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-sm text-ink ${dark ? '' : 'border border-line'}`} />
      <button type="submit" disabled={isSubmitting} className={`rounded-full px-4 py-2 text-sm font-bold disabled:opacity-60 ${dark ? 'bg-gold text-teal' : 'bg-teal text-white hover:bg-[#0c3432]'}`}>{isSubmitting ? 'Sending...' : 'Subscribe'}</button>
    </form>
    {error && <p id={`${id}-error`} className={`mt-2 text-xs ${dark ? 'text-gold' : 'font-bold text-red-700'}`} role="alert">{error}</p>}
  </>
}

/** Footer signup. */
export function NewsletterSignup() {
  if (!newsletterEnabled) return null

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Get new lessons when they drop</p>
      <NewsletterForm id="newsletter-email" tone="dark" />
    </div>
  )
}
