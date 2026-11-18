import { useEffect, useState } from 'react'
import type { ConceptVisual } from '../../types/lesson'

/** What the picture shows at one step: how many boxes are visible, which one is active, and the code line it matches. */
export function describeStep(visual: ConceptVisual, step: number) {
  const n = visual.values.length
  if (visual.kind === 'variables') {
    const name = visual.names?.[step] ?? `value${step + 1}`
    return { visible: step + 1, active: step, line: `${name} = ${visual.values[step]}` }
  }
  if (visual.kind === 'list') {
    return { visible: n, active: step, line: `books[${step}] is ${visual.values[step]}` }
  }
  return { visible: n, active: step, line: `for book in books:  book is ${visual.values[step]}` }
}

export function ConceptScene({ visual }: { visual: ConceptVisual }) {
  const total = visual.values.length
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const state = describeStep(visual, step)

  // Play advances one step at a time, and stops at the last step.
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setStep((current) => {
        if (current >= total - 1) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 1400)
    return () => window.clearInterval(timer)
  }, [playing, total])

  // A new visual starts from its first step.
  useEffect(() => {
    setStep(0)
    setPlaying(false)
  }, [visual])

  const labels = visual.kind === 'variables' ? visual.names ?? visual.values.map((_, i) => `${i + 1}`) : visual.values.map((_, i) => `[${i}]`)
  const share = 100 / total

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div className="relative px-4 pb-2 pt-10" role="img" aria-label={`${visual.caption}. Current step: ${state.line}`}>
        <div className="flex items-end">
          {visual.values.map((value, i) => {
            const shown = i < state.visible
            const active = i === state.active
            return (
              <div key={`${value}-${i}`} className="flex flex-col items-center" style={{ width: `${share}%` }} data-testid="concept-column">
                <div
                  data-testid="concept-box"
                  data-state={!shown ? 'hidden' : active ? 'active' : 'shown'}
                  title={value}
                  className="flex h-16 w-full max-w-[9.5rem] items-center justify-center rounded-xl px-1 text-center font-bold shadow-sm transition-all duration-500 ease-out motion-reduce:transition-none"
                  style={{
                    fontSize: value.length > 9 ? '0.75rem' : '0.875rem',
                    opacity: shown ? 1 : 0,
                    transform: shown ? (active ? 'translateY(-12px) scale(1.06)' : 'translateY(0) scale(1)') : 'translateY(24px) scale(0.6)',
                    background: active ? '#dea667' : '#173b38',
                    color: active ? '#173b38' : '#ffffff',
                  }}
                >
                  <span className="whitespace-nowrap">{value}</span>
                </div>
                <span
                  className="mt-2 text-xs font-bold text-teal transition-opacity duration-500 motion-reduce:transition-none"
                  style={{ opacity: visual.kind === 'variables' && !shown ? 0.3 : 1 }}
                >
                  {labels[i]}
                </span>
              </div>
            )
          })}
        </div>
        {visual.kind === 'loop' && (
          <div
            data-testid="loop-pointer"
            className="pointer-events-none absolute top-1 -translate-x-1/2 rounded-full bg-gold px-3 py-1 text-xs font-bold text-teal transition-[left] duration-500 ease-out motion-reduce:transition-none"
            style={{ left: `${(state.active + 0.5) * share}%` }}
          >
            book
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        <button type="button" className="button button-secondary px-3 py-2" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>Previous</button>
        <button type="button" className="button button-secondary px-3 py-2" onClick={() => setStep((s) => Math.min(total - 1, s + 1))} disabled={step >= total - 1}>Next</button>
        <button type="button" className="button button-primary px-3 py-2" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" className="button button-secondary px-3 py-2" onClick={() => { setPlaying(false); setStep(0) }}>Reset</button>
        <code className="ml-auto rounded-lg bg-mist px-3 py-2 text-sm text-teal" aria-live="polite" data-testid="concept-line">{state.line}</code>
      </div>
      <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-muted">{visual.caption}</figcaption>
    </figure>
  )
}
