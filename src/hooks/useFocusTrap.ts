import { useEffect, useRef } from 'react'

const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export function useFocusTrap<T extends HTMLElement>(open: boolean, onEscape?: () => void) {
  const containerRef = useRef<T>(null)

  useEffect(() => {
    if (!open) return

    const container = containerRef.current
    if (!container) return

    const focusable = () => Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onEscape?.()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusable()
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    const first = focusable()[0]
    first?.focus()
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, open])

  return containerRef
}
