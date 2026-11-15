import { FormEvent, useState } from 'react'
import { toFormResponseUrl } from '../../utils/googleForm'

const newsletterFormUrl = import.meta.env.VITE_NEWSLETTER_FORM_URL?.trim()
const newsletterResponseUrl = toFormResponseUrl(newsletterFormUrl)
/** The Email question in the newsletter Google Form. It is the only field collected. */
const emailEntry = 'entry.1332342356'

/** Footer signup. It collects only an email address, through the same Google Form pattern as the feedback form. */
export function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!newsletterFormUrl) return null

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
    } catch {
      setError('We could not sign you up. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Get new lessons when they drop</p>
      {isSubmitted ? (
        <p className="mt-4 text-sm text-white/80" role="status">Thanks. You are on the list.</p>
      ) : (
        <form className="mt-4 flex max-w-sm flex-col gap-2 sm:flex-row" onSubmit={submit} noValidate>
          <label className="sr-only" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" name={emailEntry} type="email" autoComplete="email" required placeholder="you@example.com" aria-invalid={Boolean(error)} aria-describedby={error ? 'newsletter-error' : undefined} className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-sm text-ink" />
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-gold px-4 py-2 text-sm font-bold text-teal disabled:opacity-60">{isSubmitting ? 'Sending...' : 'Subscribe'}</button>
        </form>
      )}
      {error && <p id="newsletter-error" className="mt-2 text-xs text-gold" role="alert">{error}</p>}
    </div>
  )
}
