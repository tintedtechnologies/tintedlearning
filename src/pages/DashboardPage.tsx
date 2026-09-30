import { BarChart3, BookOpen, CheckCircle2, CircleUserRound, LayoutDashboard, LogOut, Route, Trash2 } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Show, SignInButton, useClerk, useUser } from '@clerk/react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { LearningPlanBuilder } from '../components/learning/LearningPlanBuilder'
import { curriculumStages, lessons } from '../data/curriculum'
import { getGoalTitle, getLearningPlanModules, getPlanEvidence, goalOptions, readLearningPlan, type LearningGoal } from '../data/learningPlans'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useProgress } from '../hooks/useProgress'

type DashboardSection = 'overview' | 'plan' | 'progress' | 'profile'

const dashboardSections: { id: DashboardSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'plan', label: 'Learning plan', icon: Route },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'profile', label: 'Profile & data', icon: CircleUserRound },
]

interface DashboardPanelProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

function DashboardPanel({ eyebrow, title, description, children }: DashboardPanelProps) {
  return <section className="min-w-0"><header className="border-b border-line pb-5"><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 font-display text-3xl font-bold text-teal sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p></header><div className="pt-6">{children}</div></section>
}

export function DashboardPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const progress = useProgress(lessons.length)
  const requestedSection = searchParams.get('section')
  const [activeSection, setActiveSection] = useState<DashboardSection>(requestedSection === 'plan' || requestedSection === 'progress' || requestedSection === 'profile' ? requestedSection : 'overview')
  useEffect(() => {
    if (requestedSection === 'plan' || requestedSection === 'progress' || requestedSection === 'profile') setActiveSection(requestedSection)
  }, [requestedSection])
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [confirmAction, setConfirmAction] = useState<'clear' | 'delete' | null>(null)
  const [accountError, setAccountError] = useState('')
  const confirmDialogRef = useFocusTrap<HTMLDivElement>(Boolean(confirmAction), () => { if (!deleting) setConfirmAction(null) })

  const plan = readLearningPlan(user?.unsafeMetadata?.tintedLearningPlan)
  const planModules = plan ? getLearningPlanModules(plan) : []
  const planLessons = Array.from(new Map(planModules.flatMap((module) => module.lessons).map((lesson) => [lesson.id, lesson])).values())
  const completedPlanLessons = planLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length
  const planPercentage = planLessons.length ? Math.round((completedPlanLessons / planLessons.length) * 100) : 0
  const nextPlanLesson = planLessons.find((lesson) => !progress.completedLessons.includes(lesson.id))
  const evidence = plan ? getPlanEvidence(plan.goal) : []
  const completedEvidence = plan?.completedEvidenceIds?.length ?? 0
  const requestedGoal = searchParams.get('goal')
  const guestStage = requestedGoal === 'technical-leadership' ? 'professional-practice' : 'foundation'
  const guestPathTitle = requestedGoal === 'python-developer' ? 'Python Developer' : requestedGoal === 'ai-mathematics' ? 'AI Mathematics & Research' : requestedGoal === 'technical-leadership' ? 'Technical Leadership & Communication' : 'Foundation'

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
    }
  }

  const deleteAccount = async () => {
    if (!user) return false
    setDeleting(true)
    setAccountError('')
    try {
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

  const renderOverview = () => <DashboardPanel eyebrow="Dashboard" title={`Welcome back, ${user?.firstName ?? user?.username ?? 'learner'}.`} description="Your next step, current plan, and progress at a glance.">
    <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-line bg-mist/60 p-5"><p className="eyebrow">Plan progress</p><p className="mt-2 font-display text-4xl font-bold text-teal">{plan ? `${planPercentage}%` : '—'}</p><p className="mt-1 text-xs text-muted">{plan ? `${completedPlanLessons}/${planLessons.length} lessons` : 'Create a plan to begin'}</p></div><div className="rounded-2xl border border-line bg-white p-5"><p className="eyebrow">Full curriculum</p><p className="mt-2 font-display text-4xl font-bold text-teal">{progress.getProgressPercentage()}%</p><p className="mt-1 text-xs text-muted">{progress.completedLessons.length}/{lessons.length} lessons</p></div><div className="rounded-2xl border border-line bg-sand/60 p-5"><p className="eyebrow">Portfolio evidence</p><p className="mt-2 font-display text-4xl font-bold text-teal">{plan ? `${completedEvidence}/${evidence.length}` : '—'}</p><p className="mt-1 text-xs text-muted">items ready to show</p></div></div>

    <section className="mt-5 overflow-hidden rounded-2xl bg-teal text-white"><div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center">{plan ? <><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Current plan</p><h2 className="mt-2 font-display text-3xl font-bold">{getGoalTitle(plan.goal)}</h2><p className="mt-2 text-sm text-white/70">{planModules.length} modules · {plan.weeklyHours} hours per week</p></div><button type="button" onClick={() => setActiveSection('plan')} className="button bg-gold text-teal hover:bg-white">Open plan</button></> : <><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Personalized learning</p><h2 className="mt-2 font-display text-3xl font-bold">Build a plan around your goal.</h2><p className="mt-2 text-sm text-white/70">Answer a few questions and get a curated route through the curriculum.</p></div><button type="button" onClick={() => setActiveSection('plan')} className="button bg-gold text-teal hover:bg-white">Create plan</button></>}</div>{plan && <div className="border-t border-white/10 bg-white/5 px-6 py-4"><p className="text-xs font-bold uppercase tracking-widest text-white/50">Next recommended lesson</p>{nextPlanLesson ? <Link to={`/learn/${nextPlanLesson.id}`} className="mt-1 inline-flex items-center font-bold text-white hover:text-gold">{nextPlanLesson.title}<BookOpen size={16} className="ml-2" /></Link> : <p className="mt-1 font-bold text-gold">All plan lessons complete</p>}</div>}</section>

    <div className="mt-5 grid gap-4 md:grid-cols-2"><section className="rounded-2xl border border-line p-5"><p className="eyebrow">Current position</p>{progress.currentLesson ? <><h3 className="mt-2 font-display text-2xl font-bold text-teal">{progress.currentStage?.title}</h3><p className="mt-2 text-sm font-bold text-teal">{progress.currentModule?.title}</p><p className="mt-1 text-sm leading-6 text-muted">Next in the full track: {progress.currentLesson.title}</p></> : <><h3 className="mt-2 font-display text-2xl font-bold text-teal">Curriculum complete</h3><p className="mt-2 text-sm leading-6 text-muted">Every lesson in the full track is marked complete.</p></>}<button type="button" onClick={() => setActiveSection('progress')} className="mt-4 text-sm font-bold text-teal hover:text-gold">View progress</button></section><section className="rounded-2xl border border-line p-5"><p className="eyebrow">Quick actions</p><div className="mt-3 grid gap-2"><Link to="/learn" className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-sm font-bold text-teal">Browse curriculum<BookOpen size={16} /></Link><Link to="/portfolio" className="flex items-center justify-between rounded-xl bg-cream px-4 py-3 text-sm font-bold text-teal">Open portfolio studio<Route size={16} /></Link></div></section></div>
  </DashboardPanel>

  const renderProgress = () => <DashboardPanel eyebrow="Learning record" title="Progress" description="Review completed work across your personalized plan and the full curriculum.">
    <div className="grid gap-4 sm:grid-cols-2">{plan ? <section className="rounded-2xl border border-line bg-mist/50 p-5"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Plan lessons</p><p className="mt-2 font-display text-4xl font-bold text-teal">{planPercentage}%</p></div><span className="text-xs font-bold text-muted">{completedPlanLessons}/{planLessons.length}</span></div><div role="progressbar" aria-label="Personalized plan lessons completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={planPercentage} className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className="h-full bg-teal" style={{ width: `${planPercentage}%` }} /></div></section> : <section className="rounded-2xl border border-line bg-mist/50 p-5"><p className="eyebrow">Personalized plan</p><p className="mt-2 font-bold text-teal">No plan created yet.</p><button type="button" onClick={() => setActiveSection('plan')} className="mt-3 text-sm font-bold text-teal hover:text-gold">Create a learning plan</button></section>}<section className="rounded-2xl border border-line bg-white p-5"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Full curriculum</p><p className="mt-2 font-display text-4xl font-bold text-teal">{progress.getProgressPercentage()}%</p></div><span className="text-xs font-bold text-muted">{progress.completedLessons.length}/{lessons.length}</span></div><div role="progressbar" aria-label="Full curriculum lessons completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.getProgressPercentage()} className="mt-4 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full bg-gold" style={{ width: `${progress.getProgressPercentage()}%` }} /></div></section></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><section><p className="eyebrow">Stage progress</p><div className="mt-3 space-y-2">{curriculumStages.map((stage) => { const stageLessonIds = [...new Set(stage.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id)))]; const completed = stageLessonIds.filter((lessonId) => progress.completedLessons.includes(lessonId)).length; const complete = stageLessonIds.length > 0 && completed === stageLessonIds.length; return <div key={stage.id} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold ${complete ? 'border-teal/20 bg-mist text-teal' : 'border-line bg-white text-muted'}`}><span>{stage.title}</span><span className="flex items-center gap-2">{completed}/{stageLessonIds.length}{complete && <CheckCircle2 size={17} />}</span></div> })}</div></section><section><p className="eyebrow">Completed lessons</p><div className="mt-3 max-h-[28rem] overflow-y-auto rounded-2xl border border-line bg-white p-3">{progress.completedLessons.length ? lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).map((lesson) => <Link key={lesson.id} to={`/learn/${lesson.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-ink hover:bg-mist"><CheckCircle2 size={16} className="shrink-0 text-teal" />{lesson.title}</Link>) : <p className="p-4 text-sm text-muted">No lessons completed yet.</p>}</div></section></div>
  </DashboardPanel>

  const renderProfile = () => <DashboardPanel eyebrow="Settings" title="Profile & data" description="Manage your profile image, learning history, and account.">
    <div className="grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-line bg-white p-6"><p className="eyebrow">Profile image</p><div className="mt-5 flex items-center gap-4"><span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold text-2xl font-bold text-teal">{user?.imageUrl ? <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}</span><div><p className="font-display text-2xl font-bold text-teal">{user?.fullName ?? user?.username ?? 'Learner'}</p><p className="mt-1 text-sm text-muted">Signed-in learner</p></div></div><div className="mt-6 flex flex-wrap gap-3"><label className="button button-secondary cursor-pointer">{uploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadProfileImage(event.target.files?.[0]); event.currentTarget.value = '' }} /></label><button type="button" onClick={() => { void removeProfileImage() }} disabled={uploading || !user?.imageUrl} className="button button-secondary disabled:opacity-40">Remove image</button></div>{uploadError && <p className="mt-4 text-sm font-bold text-red-700">{uploadError}</p>}</section>
      <section className="rounded-2xl border border-line bg-cream p-6"><p className="eyebrow">Account controls</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Manage your data</h2><p className="mt-2 text-sm leading-6 text-muted">Clearing progress keeps your account and plan. Account deletion is permanent.</p>{progress.saveError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{progress.saveError}</p>}<div className="mt-5 grid gap-2"><button type="button" disabled={progress.isSaving} onClick={() => setConfirmAction('clear')} className="button button-secondary justify-start disabled:opacity-50"><Trash2 size={16} className="mr-2" />{progress.isSaving ? 'Saving progress...' : 'Clear lesson progress'}</button><button type="button" onClick={() => signOut()} className="button button-secondary justify-start"><LogOut size={16} className="mr-2" />Sign out</button><button type="button" disabled={deleting} onClick={() => setConfirmAction('delete')} className="button justify-start border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 size={16} className="mr-2" />{deleting ? 'Deleting...' : 'Delete account'}</button></div></section></div>
  </DashboardPanel>

  return <main className="shell max-w-[90rem] py-6 sm:py-8">
    <Show when="signed-in" fallback={<section className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft"><p className="eyebrow">{guestPathTitle}</p><h1 className="mt-3 font-display text-4xl font-bold text-teal">Choose how to continue</h1><p className="mt-4 leading-7 text-muted">All curriculum content is free to browse without an account. Sign in only if you want Tinted Learning to remember your personalized plan, progress, and portfolio evidence.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to={`/learn?stage=${guestStage}`} className="button button-primary">Continue free</Link><SignInButton mode="modal"><button type="button" className="button button-secondary">Save my plan</button></SignInButton></div></section>}>
      {!progress.isLoaded ? <section className="rounded-2xl border border-line bg-white p-8 text-center shadow-soft"><p className="font-bold text-teal">Loading your dashboard...</p></section> :
      <div className="dashboard-layout">
        <aside className="overflow-hidden rounded-2xl bg-teal text-white shadow-soft lg:sticky lg:top-5">
          <nav className="flex gap-1 overflow-x-auto p-2 lg:flex-col" aria-label="Dashboard settings">{dashboardSections.map((section) => { const Icon = section.icon; const active = activeSection === section.id; return <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} aria-current={active ? 'page' : undefined} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition-colors lg:w-full ${active ? 'bg-white text-teal' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon size={18} />{section.label}</button> })}</nav>
        </aside>

        <div className="min-w-0 rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-7 lg:min-h-[calc(100dvh-8.5rem)] lg:p-8">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'plan' && <LearningPlanBuilder completedLessonIds={progress.completedLessons} initialGoal={goalOptions.some((option) => option.id === searchParams.get('goal')) ? searchParams.get('goal') as LearningGoal : undefined} />}
          {activeSection === 'progress' && renderProgress()}
          {activeSection === 'profile' && renderProfile()}
        </div>
      </div>}
    </Show>

    {confirmAction && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123F3D]/50 p-5" role="presentation"><div ref={confirmDialogRef} role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" onKeyDown={(event) => { if (event.key === 'Escape' && !deleting) setConfirmAction(null) }} className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"><p className="eyebrow">Please confirm</p><h2 id="confirm-title" className="mt-3 font-display text-3xl font-bold text-teal">{confirmAction === 'clear' ? 'Clear your progress?' : 'Delete your account?'}</h2><p id="confirm-description" className="mt-4 text-sm leading-6 text-muted">{confirmAction === 'clear' ? 'All completed lessons for this account will be removed. Your personalized plan will remain.' : 'This permanently deletes your Clerk account, learning plan, and progress. You will be signed out and this action cannot be undone.'}</p>{accountError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold leading-6 text-red-700">{accountError}</p>}<div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" autoFocus disabled={deleting} onClick={() => setConfirmAction(null)} className="button button-secondary disabled:opacity-50">Cancel</button><button type="button" disabled={deleting} onClick={async () => { if (confirmAction === 'clear') { progress.clearProgress(); setConfirmAction(null) } else if (await deleteAccount()) setConfirmAction(null) }} className={`button ${confirmAction === 'delete' ? 'bg-red-600 text-white hover:bg-red-700' : 'button-primary'} disabled:opacity-50`}>{deleting ? 'Deleting...' : confirmAction === 'clear' ? 'Clear progress' : 'Delete account'}</button></div></div></div>}
  </main>
}
