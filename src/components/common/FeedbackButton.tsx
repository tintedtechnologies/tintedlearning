import { Check, MessageCircle, Send, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useFocusTrap } from '../../hooks/useFocusTrap'

const feedbackFormUrl = import.meta.env.VITE_FEEDBACK_FORM_URL?.trim()
const feedbackResponseUrl = (() => {
  if (!feedbackFormUrl) return ''

  try {
    const url = new URL(feedbackFormUrl)
    url.pathname = url.pathname.replace(/\/viewform$/, '/formResponse')
    url.search = ''
    return url.toString()
  } catch {
    return feedbackFormUrl
  }
})()

type FeedbackErrors = {
  idea?: string
  reason?: string
  email?: string
}

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FeedbackErrors>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useFocusTrap<HTMLElement>(isOpen, () => setIsOpen(false))

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isSubmitted) return

    const closeTimer = window.setTimeout(() => {
      setIsOpen(false)
      setIsSubmitted(false)
    }, 1800)

    return () => window.clearTimeout(closeTimer)
  }, [isSubmitted])

  if (!feedbackFormUrl) return null

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const idea = String(formData.get('entry.2125045524') ?? '').trim()
    const reason = String(formData.get('entry.133312910') ?? '').trim()
    const email = String(formData.get('entry.306814970') ?? '').trim()
    const emailInput = form.elements.namedItem('entry.306814970') as HTMLInputElement
    const errors: FeedbackErrors = {}

    if (!idea) errors.idea = 'Tell us what you would love to see.'
    else if (idea.length < 10) errors.idea = 'Please enter at least 10 characters.'

    if (!reason) errors.reason = 'Tell us why it would be useful.'
    else if (reason.length < 10) errors.reason = 'Please enter at least 10 characters.'

    if (email && !emailInput.validity.valid) errors.email = 'Enter a valid email address or leave this field blank.'

    setFieldErrors(errors)
    const firstInvalidField = errors.idea
      ? 'entry.2125045524'
      : errors.reason
        ? 'entry.133312910'
        : errors.email
          ? 'entry.306814970'
          : null

    if (firstInvalidField) {
      requestAnimationFrame(() => {
        const field = form.elements.namedItem(firstInvalidField) as HTMLInputElement | HTMLTextAreaElement | null
        field?.focus()
      })
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await fetch(feedbackResponseUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({
          'entry.2125045524': idea,
          'entry.133312910': reason,
          'entry.306814970': email,
        }),
      })
      form.reset()
      setFieldErrors({})
      setIsSubmitted(true)
    } catch {
      setSubmitError('We could not send your feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setSubmitError('')
          setFieldErrors({})
          setIsOpen(true)
        }}
        className="fixed bottom-4 right-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gold text-sm font-bold text-teal shadow-soft transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:w-auto sm:gap-2 sm:px-4"
        aria-label="Share feedback"
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span className="hidden sm:inline">Share feedback</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-teal/70 p-4 backdrop-blur-sm sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false)
          }}
        >
          <section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            className="flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-cream shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Help shape Tinted Learning</p>
                <h2 id="feedback-title" className="mt-1 font-display text-2xl font-bold text-teal">Share your feedback</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                className="icon-button shrink-0"
                aria-label="Close feedback form"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>
            {isSubmitted ? (
              <div className="flex min-h-96 flex-col items-center justify-center px-6 py-12 text-center" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-mist text-teal">
                  <Check size={30} aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-3xl font-bold text-teal">Thank you.</h3>
                <p className="mt-3 max-w-sm leading-7 text-muted">Your idea has been sent. It will help shape what Tinted Learning builds next.</p>
              </div>
            ) : (
              <form className="min-h-0 overflow-y-auto px-5 py-6 sm:px-8 sm:py-7" onSubmit={submitFeedback} noValidate>
                <p className="max-w-xl leading-7 text-muted">Tell us what would make your learning experience more useful. Your feedback helps shape what we build next.</p>

                <div className="mt-6 space-y-6">
                  <label className="block">
                    <span className="text-sm font-bold text-teal">What would you love to see?</span>
                    <textarea
                      name="entry.2125045524"
                      required
                      minLength={10}
                      rows={4}
                      className={`mt-2 w-full resize-none rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-muted/60 ${fieldErrors.idea ? 'border-red-700' : 'border-line'}`}
                      placeholder="A lesson, tool, project, or feature..."
                      aria-invalid={Boolean(fieldErrors.idea)}
                      aria-describedby={fieldErrors.idea ? 'feedback-idea-help feedback-idea-error' : 'feedback-idea-help'}
                      onChange={() => setFieldErrors((current) => current.idea ? { ...current, idea: undefined } : current)}
                    />
                    <span id="feedback-idea-help" className="mt-1 block text-xs text-muted">At least 10 characters.</span>
                    {fieldErrors.idea && <span id="feedback-idea-error" className="mt-1 block text-sm font-bold text-red-700" role="alert">{fieldErrors.idea}</span>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-teal">Why would it be useful?</span>
                    <textarea
                      name="entry.133312910"
                      required
                      minLength={10}
                      rows={3}
                      className={`mt-2 w-full resize-none rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-muted/60 ${fieldErrors.reason ? 'border-red-700' : 'border-line'}`}
                      placeholder="How would it help you learn or build?"
                      aria-invalid={Boolean(fieldErrors.reason)}
                      aria-describedby={fieldErrors.reason ? 'feedback-reason-help feedback-reason-error' : 'feedback-reason-help'}
                      onChange={() => setFieldErrors((current) => current.reason ? { ...current, reason: undefined } : current)}
                    />
                    <span id="feedback-reason-help" className="mt-1 block text-xs text-muted">At least 10 characters.</span>
                    {fieldErrors.reason && <span id="feedback-reason-error" className="mt-1 block text-sm font-bold text-red-700" role="alert">{fieldErrors.reason}</span>}
                  </label>

                  <label className="block">
                    <span className="text-sm font-bold text-teal">Email <span className="font-normal text-muted">(optional)</span></span>
                    <input
                      type="email"
                      name="entry.306814970"
                      className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-ink placeholder:text-muted/60 ${fieldErrors.email ? 'border-red-700' : 'border-line'}`}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'feedback-email-error' : undefined}
                      onChange={() => setFieldErrors((current) => current.email ? { ...current, email: undefined } : current)}
                    />
                    {fieldErrors.email && <span id="feedback-email-error" className="mt-1 block text-sm font-bold text-red-700" role="alert">{fieldErrors.email}</span>}
                  </label>
                </div>

                {submitError && <p className="mt-5 text-sm font-bold text-red-700" role="alert">{submitError}</p>}

                <div className="mt-7 flex justify-end border-t border-line pt-5">
                  <button type="submit" disabled={isSubmitting} className="button button-primary gap-2 disabled:cursor-wait disabled:opacity-60">
                    <Send size={17} aria-hidden="true" />
                    {isSubmitting ? 'Sending...' : 'Send feedback'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  )
}