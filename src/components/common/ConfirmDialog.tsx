import { useFocusTrap } from '../../hooks/useFocusTrap'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  /** Destructive actions use red and start with focus on Cancel. */
  destructive?: boolean
  busy?: boolean
  error?: string
  onConfirm: () => void
  onCancel: () => void
}

/** A confirmation step for any action that removes data. Escape and Cancel both leave the data alone. */
export function ConfirmDialog({ open, title, description, confirmLabel, destructive = false, busy = false, error, onConfirm, onCancel }: ConfirmDialogProps) {
  const dialogRef = useFocusTrap<HTMLDivElement>(open, () => { if (!busy) onCancel() })
  if (!open) return null

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123F3D]/50 p-5" role="presentation">
    <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" onKeyDown={(event) => { if (event.key === 'Escape' && !busy) onCancel() }} className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
      <p className="eyebrow">Please confirm</p>
      <h2 id="confirm-title" className="mt-3 font-display text-3xl font-bold text-teal">{title}</h2>
      <p id="confirm-description" className="mt-4 text-sm leading-6 text-muted">{description}</p>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700" role="alert">{error}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button type="button" autoFocus disabled={busy} onClick={onCancel} className="button button-secondary disabled:opacity-50">Cancel</button>
        <button type="button" disabled={busy} onClick={onConfirm} className={`button ${destructive ? 'bg-red-600 text-white hover:bg-red-700' : 'button-primary'} disabled:opacity-50`}>{busy ? 'Working...' : confirmLabel}</button>
      </div>
    </div>
  </div>
}
