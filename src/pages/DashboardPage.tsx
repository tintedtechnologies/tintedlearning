import { CheckCircle2, LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Show, SignInButton, useClerk, useUser } from '@clerk/react'
import { Link, useNavigate } from 'react-router-dom'
import { lessons } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function DashboardPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const progress = useProgress(lessons.length)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'clear' | 'delete' | null>(null)
  const [accountError, setAccountError] = useState('')

  const uploadProfileImage = async (file: File | undefined) => {
    if (!file || !user) return
    if (!file.type.startsWith('image/')) return setUploadError('Please choose an image file.')
    if (file.size > 5 * 1024 * 1024) return setUploadError('Please choose an image smaller than 5 MB.')
    setUploadError('')
    setUploading(true)
    try {
      await user.setProfileImage({ file })
    } catch {
      setUploadError('The image could not be uploaded. Please try again.')
    } finally {
      setUploading(false)
      setAvatarMenuOpen(false)
    }
  }

  const removeProfileImage = async () => {
    if (!user || !window.confirm('Remove your profile image?')) return
    setUploadError('')
    setUploading(true)
    try {
      await user.setProfileImage({ file: null })
    } catch {
      setUploadError('The image could not be removed. Please try again.')
    } finally {
      setUploading(false)
      setAvatarMenuOpen(false)
    }
  }

  const deleteAccount = async () => {
    if (!user) return false
    setDeleting(true)
    setAccountError('')
    try {
      progress.clearProgress()
      await user.delete()
      await signOut()
      navigate('/')
      return true
    } catch {
      setAccountError('Clerk could not delete the account. Please try again or manage the account from Clerk.')
      return false
    } finally {
      setDeleting(false)
    }
  }

  return <main className="shell max-w-5xl py-12 sm:py-16">
    <Show when="signed-in" fallback={<section className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft"><h1 className="font-display text-4xl font-bold text-teal">Sign in to view your progress</h1><p className="mt-4 leading-7 text-muted">Your account is only used to remember your learning progress across sessions.</p><SignInButton mode="modal"><button type="button" className="button button-primary mt-6">Sign in</button></SignInButton></section>}>
      <header className="rounded-3xl bg-teal p-7 text-white shadow-soft sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Your learning dashboard</p><div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="flex items-center gap-4"><div className="relative"><button type="button" title="Profile image options" aria-label="Open profile image options" aria-expanded={avatarMenuOpen} onClick={() => setAvatarMenuOpen((open) => !open)} className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gold text-xl font-bold text-teal ring-2 ring-transparent transition-all hover:ring-gold/60">{user?.imageUrl ? <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}</button>{avatarMenuOpen && <div className="absolute left-0 top-20 z-20 min-w-44 rounded-2xl border border-line bg-white p-2 shadow-soft"><label className="block cursor-pointer rounded-xl px-3 py-2 text-sm font-bold text-teal hover:bg-mist">{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadProfileImage(event.target.files?.[0]); event.currentTarget.value = '' }} /></label><button type="button" onClick={() => { void removeProfileImage() }} disabled={uploading || !user?.imageUrl} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-muted hover:bg-mist hover:text-teal disabled:cursor-not-allowed disabled:opacity-40">Remove image</button></div>}</div><h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl">Hi, {user?.firstName ?? user?.username ?? 'learner'}.</h1></div><p className="mt-4 max-w-xl text-base leading-7 text-white/75">A private space for your Tinted Learning progress. Click your profile image to manage it.</p>{uploadError && <p className="mt-2 text-sm font-bold text-red-200">{uploadError}</p>}</div><CheckCircle2 className="text-gold" size={42} /></div></header>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-line bg-white p-7 shadow-soft sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Overall progress</p><p className="mt-3 font-display text-6xl font-bold text-teal">{progress.getProgressPercentage()}%</p></div><span className="rounded-full bg-mist px-3 py-2 text-xs font-bold text-teal">{progress.completedLessons.length}/{lessons.length} lessons</span></div><div className="mt-7 h-4 overflow-hidden rounded-full bg-mist"><div className="h-full rounded-full bg-teal transition-all duration-500" style={{ width: `${progress.getProgressPercentage()}%` }} /></div><p className="mt-4 text-sm leading-6 text-muted">Keep moving through the pathway. Each completed lesson adds evidence to your learning journey.</p><Link to="/learn" className="button button-primary mt-6">Continue learning</Link></section>
          <section className="rounded-3xl border border-teal/10 bg-mist p-7 sm:p-8 lg:col-span-2"><p className="eyebrow">Current learning</p><h2 className="mt-3 font-display text-3xl font-bold text-teal">{progress.currentStage?.title ?? 'Start your pathway'}</h2><p className="mt-2 text-sm font-bold text-teal">Module: {progress.currentModule?.title ?? 'Foundation'}</p><p className="mt-1 text-sm leading-6 text-muted">Next lesson: {progress.currentLesson?.title ?? 'Choose a starting point'}</p><div className="mt-6 grid gap-5 md:grid-cols-2"><div><p className="eyebrow">Completed stages</p><div className="mt-3 flex flex-wrap gap-2">{progress.completedStages.length ? progress.completedStages.map((stage) => <span key={stage.id} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-teal">{stage.title}</span>) : <span className="text-sm text-muted">No stages completed yet.</span>}</div></div><div><p className="eyebrow">Completed lessons</p><div className="mt-3 max-h-32 overflow-auto rounded-2xl bg-white p-3 text-sm text-muted">{progress.completedLessons.length ? lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).map((lesson) => <p key={lesson.id} className="py-1">✓ {lesson.title}</p>) : <p>No lessons completed yet.</p>}</div></div></div></section>
          <section className="rounded-3xl border border-line bg-cream p-7 sm:p-8 lg:col-span-2"><p className="eyebrow">Account controls</p><h2 className="mt-3 font-display text-3xl font-bold text-teal">Manage your data</h2><p className="mt-3 text-sm leading-6 text-muted">Clear your progress, sign out, or permanently delete your account.</p><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => setConfirmAction('clear')} className="button button-secondary"><Trash2 size={16} className="mr-2" />Clear progress</button><button type="button" onClick={() => signOut()} className="button button-secondary"><LogOut size={16} className="mr-2" />Sign out</button><button type="button" disabled={deleting} onClick={() => setConfirmAction('delete')} className="button border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 size={16} className="mr-2" />{deleting ? 'Deleting…' : 'Delete account'}</button></div></section>
      </div>
    </Show>
    {confirmAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123F3D]/50 p-5" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"><p className="eyebrow">Please confirm</p><h2 id="confirm-title" className="mt-3 font-display text-3xl font-bold text-teal">{confirmAction === 'clear' ? 'Clear your progress?' : 'Delete your account?'}</h2><p className="mt-4 text-sm leading-6 text-muted">{confirmAction === 'clear' ? 'All completed lessons for this account will be removed. Your account will remain active.' : 'This permanently deletes your Clerk account and its progress. You will be signed out and this action cannot be undone.'}</p>{accountError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">{accountError}</p>}<div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" disabled={deleting} onClick={() => setConfirmAction(null)} className="button button-secondary disabled:opacity-50">Cancel</button><button type="button" disabled={deleting} onClick={async () => { if (confirmAction === 'clear') { progress.clearProgress(); setConfirmAction(null) } else if (await deleteAccount()) setConfirmAction(null) }} className={`button ${confirmAction === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'button-primary'} disabled:opacity-50`}>{deleting ? 'Deleting…' : confirmAction === 'clear' ? 'Clear progress' : 'Delete account'}</button></div></div></div>}
  </main>
}
