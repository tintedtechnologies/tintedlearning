import { BookOpen, CheckCircle2, CircleUserRound, FolderKanban, LayoutDashboard, Trash2 } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Show, SignInButton, useClerk, useUser } from '@clerk/react'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { PlanBuilder } from '../components/learning/PlanBuilder'
import { projectPlans } from '../data/projects'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { lessons } from '../data/curriculum'
import { curriculumLessonTotal, getSectionIdForLesson, getSectionLessonIds, getSectionModules, learningSections } from '../data/learningSections'
import { getGoalTitle, getLearningPlanModules, getPlanEvidence, goalOptions, projectsByGoal, readLearningPlan, type LearningGoal, type LearningPlanProfile } from '../data/learningPlans'
import { useProgress } from '../hooks/useProgress'

import { encodePortfolioProfile, readPortfolioProfile } from '../data/portfolioProfile'

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
  const progress = useProgress(curriculumLessonTotal)
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [confirmAction, setConfirmAction] = useState<'clear' | 'delete' | 'image' | null>(null)
  const [planSaving, setPlanSaving] = useState(false)
  const [planError, setPlanError] = useState('')
  const [accountError, setAccountError] = useState('')


  const plan = readLearningPlan(user?.unsafeMetadata?.tintedLearningPlan)
  const planModules = plan ? getLearningPlanModules(plan) : []
  const planLessons = Array.from(new Map(planModules.flatMap((module) => module.lessons).map((lesson) => [lesson.id, lesson])).values())
  const completedPlanLessons = planLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length
  const planPercentage = planLessons.length ? Math.round((completedPlanLessons / planLessons.length) * 100) : 0
  const nextPlanLesson = planLessons.find((lesson) => !progress.completedLessons.includes(lesson.id))
  const evidence = plan ? getPlanEvidence(plan.goal) : []
  const completedEvidence = plan?.completedEvidenceIds?.length ?? 0
  const requestedGoal = searchParams.get('goal')
  const guestSectionId = requestedGoal === 'technical-leadership' ? 'technical-leadership' : requestedGoal === 'ai-mathematics' ? 'math' : requestedGoal === 'python-developer' ? 'python' : requestedGoal === 'cloud-engineer' ? 'cloud-engineering' : requestedGoal === 'ai-engineer' ? 'ai-engineering' : requestedGoal === 'ai-architect' ? 'ai-engineering' : 'foundations'
  const guestSection = learningSections.find((section) => section.id === guestSectionId)
  const guestDestination = `/learn/sections/${guestSectionId}`
  const guestPathTitle = requestedGoal === 'technical-leadership' ? 'Technical Leadership & Communication' : guestSection?.title ?? 'Foundations'
  const currentSectionId = getSectionIdForLesson(progress.currentLesson?.id ?? '')
  const currentSection = learningSections.find((section) => section.id === currentSectionId)
  const currentSectionModule = currentSection ? getSectionModules(currentSection.id).find(({ lessons: sectionLessons }) => sectionLessons.some((lesson) => lesson.id === progress.currentLesson?.id))?.module : undefined
  const portfolioProfile = readPortfolioProfile(user?.unsafeMetadata?.tintedPortfolio, user?.fullName ?? user?.username ?? '')
  const [portfolioVisibility, setPortfolioVisibility] = useState<'private' | 'public'>(portfolioProfile.visibility)
  const [portfolioShareUrl, setPortfolioShareUrl] = useState('')
  const [portfolioSaving, setPortfolioSaving] = useState(false)
  const hasPortfolioContent = Boolean(portfolioProfile.headline || portfolioProfile.summary || portfolioProfile.resume.targetRole || portfolioProfile.accomplishments.length || portfolioProfile.githubLinks.length)
  useEffect(() => setPortfolioVisibility(portfolioProfile.visibility), [portfolioProfile.visibility])
  const updatePortfolioVisibility = async (visibility: 'private' | 'public') => {
    if (!user) return
    setPortfolioVisibility(visibility)
    setPortfolioSaving(true)
    try {
      const next = { ...portfolioProfile, visibility, updatedAt: new Date().toISOString() }
      await user.updateMetadata({ unsafeMetadata: { tintedPortfolio: next } })
      setPortfolioShareUrl(visibility === 'public' ? `${window.location.origin}/portfolio/share?profile=${encodeURIComponent(encodePortfolioProfile(next))}` : '')
    } catch {
      setPortfolioVisibility(portfolioProfile.visibility)
    } finally {
      setPortfolioSaving(false)
    }
  }

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
    if (!user) return
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

  const savePlanProfile = async (profile: LearningPlanProfile) => {
    if (!user) return
    setPlanSaving(true)
    setPlanError('')
    try {
      await user.updateMetadata({ unsafeMetadata: { tintedLearningPlan: profile } })
    } catch {
      setPlanError('Your plan could not be saved. Please try again.')
    } finally {
      setPlanSaving(false)
    }
  }

  const toggleEvidence = (evidenceId: string) => {
    if (!plan) return
    const current = plan.completedEvidenceIds ?? []
    const next = current.includes(evidenceId) ? current.filter((id) => id !== evidenceId) : [...current, evidenceId]
    void savePlanProfile({ ...plan, completedEvidenceIds: next })
  }

  const confirmCopy = {
    clear: { title: 'Clear your progress?', description: 'All completed lessons for this account will be removed. Your personalized plan will remain.', label: 'Clear progress' },
    delete: { title: 'Delete your account?', description: 'This permanently deletes your Clerk account, learning plan, and progress. You will be signed out and this action cannot be undone.', label: 'Delete account' },
    image: { title: 'Remove your profile image?', description: 'Your profile will show your first initial instead.', label: 'Remove image' },
  }

  const runConfirmedAction = async () => {
    if (confirmAction === 'clear') {
      progress.clearProgress()
      setConfirmAction(null)
    } else if (confirmAction === 'image') {
      await removeProfileImage()
      setConfirmAction(null)
    } else if (confirmAction === 'delete' && await deleteAccount()) {
      setConfirmAction(null)
    }
  }

  const renderOverview = () => <DashboardPanel eyebrow="Dashboard" title={`Welcome back, ${user?.firstName ?? user?.username ?? 'learner'}.`} description="Your current plan, progress, and portfolio at a glance.">
    <section className="mt-5 overflow-hidden rounded-2xl bg-teal text-white"><div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center">{plan ? <><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Current plan</p><h2 className="mt-2 font-display text-3xl font-bold">{getGoalTitle(plan.goal)}</h2><p className="mt-2 text-sm text-white/70">{planModules.length} modules · {plan.weeklyHours} hours per week</p></div><a href="#portfolio-evidence" className="button bg-gold text-teal hover:bg-white">View projects</a></> : <><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Personalized learning</p><h2 className="mt-2 font-display text-3xl font-bold">Build a plan around your goal.</h2><p className="mt-2 text-sm text-white/70">Your plan ends in projects that become portfolio evidence.</p></div><a href="#create-plan" className="button bg-gold text-teal hover:bg-white">Create plan</a></>}</div>{plan && <div className="border-t border-white/10 bg-white/5 px-6 py-4"><p className="text-xs font-bold uppercase tracking-widest text-white/50">Next recommended lesson</p>{nextPlanLesson ? <Link to={`/learn/${nextPlanLesson.id}`} className="mt-1 inline-flex items-center font-bold text-white hover:text-gold">{nextPlanLesson.title}<BookOpen size={16} className="ml-2" /></Link> : <p className="mt-1 font-bold text-gold">All plan lessons complete</p>}</div>}</section>
    {!plan ? <section id="create-plan" className="mt-5 rounded-2xl border border-line bg-white p-6"><p className="eyebrow">Create plan</p><h3 className="mt-2 font-display text-2xl font-bold text-teal">Choose your goal</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Your plan lists the lessons for your goal, then the projects that turn them into portfolio evidence.</p><PlanBuilder saving={planSaving} error={planError} onSave={(profile) => { void savePlanProfile(profile) }} /></section>
    : <section id="portfolio-evidence" className="mt-5 grid gap-6 rounded-2xl border border-line bg-white p-6 lg:grid-cols-2"><div><p className="eyebrow">Projects</p><h3 className="mt-2 font-display text-2xl font-bold text-teal">Build your portfolio evidence</h3><p className="mt-2 text-sm leading-6 text-muted">These projects produce the evidence for {getGoalTitle(plan.goal)}. Each one ends in finished work you can show.</p><ul className="mt-4 divide-y divide-line">{projectsByGoal[plan.goal].map((id) => { const lesson = lessons.find((item) => item.id === id); const project = projectPlans[id]; return <li key={id} className="py-3"><Link to={`/learn/${id}`} className="font-bold text-teal hover:text-gold">{lesson?.title ?? id}</Link><p className="mt-1 text-xs font-bold text-muted">{project?.time ?? ''}</p></li> })}</ul><Link to="/learn/sections/projects" className="mt-4 inline-flex text-sm font-bold text-teal hover:text-gold">See all projects</Link></div><div><p className="eyebrow">Evidence checklist</p><p className="mt-2 text-sm leading-6 text-muted">Tick an item when you have finished it.</p><div className="mt-4 space-y-3">{getPlanEvidence(plan.goal).map((item) => <label key={item.id} className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink"><input type="checkbox" className="mt-1" checked={(plan.completedEvidenceIds ?? []).includes(item.id)} disabled={planSaving} onChange={() => toggleEvidence(item.id)} /><span>{item.title}</span></label>)}</div>{planError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">{planError}</p>}</div></section>}

    <div className="mt-5 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-line bg-white p-5"><p className="eyebrow">Full curriculum</p><p className="mt-2 font-display text-4xl font-bold text-teal">{progress.getProgressPercentage()}%</p><p className="mt-1 text-xs text-muted">{progress.completedLessons.length}/{lessons.length} lessons</p></div><div className="rounded-2xl border border-line bg-mist/60 p-5"><p className="eyebrow">Plan progress</p><p className="mt-2 font-display text-4xl font-bold text-teal">{plan ? `${planPercentage}%` : '—'}</p><p className="mt-1 text-xs text-muted">{plan ? `${completedPlanLessons}/${planLessons.length} lessons` : 'Create a plan to begin'}</p></div><div className="rounded-2xl border border-line bg-sand/60 p-5"><p className="eyebrow">Portfolio evidence</p><p className="mt-2 font-display text-4xl font-bold text-teal">{plan ? `${completedEvidence}/${evidence.length}` : '—'}</p><p className="mt-1 text-xs text-muted">items ready to show</p></div></div>

    <div className="mt-5 grid gap-4 md:grid-cols-2 dashboard-current-position"><section className="rounded-2xl border border-line p-5"><p className="eyebrow">Current position</p>{progress.currentLesson ? <><h3 className="mt-2 font-display text-2xl font-bold text-teal">{currentSection?.title ?? 'Learning'}</h3><p className="mt-2 text-sm font-bold text-teal">{currentSectionModule?.title ?? progress.currentModule?.title}</p><p className="mt-1 text-sm leading-6 text-muted">Next: {progress.currentLesson.title}</p></> : <><h3 className="mt-2 font-display text-2xl font-bold text-teal">Curriculum complete</h3><p className="mt-2 text-sm leading-6 text-muted">Every lesson in the full track is marked complete.</p></>}<button type="button" onClick={() => navigate('/learn')} className="mt-4 text-sm font-bold text-teal hover:text-gold">View progress</button></section><section className="rounded-2xl border border-line p-5"><p className="eyebrow">Portfolio</p><div className="mt-2 flex items-start justify-between gap-3"><div><h3 className="font-display text-2xl font-bold text-teal">{hasPortfolioContent ? portfolioProfile.displayName || 'Your portfolio' : 'Start your portfolio'}</h3><p className="mt-1 text-sm leading-6 text-muted">{hasPortfolioContent ? `${portfolioProfile.accomplishments.length} accomplishments · ${portfolioProfile.visibility === 'public' ? 'Public link enabled' : 'Private'}` : 'Create a resume, add evidence, and track your finished learning.'}</p></div><FolderKanban className="shrink-0 text-teal" size={24} /></div><Link to="/portfolio" className="mt-4 inline-flex text-sm font-bold text-teal hover:text-gold">Open portfolio studio</Link></section></div>
  </DashboardPanel>

  const renderProgress = () => <DashboardPanel eyebrow="Learning record" title="Progress" description="Review completed work across your personalized plan and the full curriculum.">
    <div className="grid gap-4 sm:grid-cols-2">{plan ? <section className="rounded-2xl border border-line bg-mist/50 p-5"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Plan lessons</p><p className="mt-2 font-display text-4xl font-bold text-teal">{planPercentage}%</p></div><span className="text-xs font-bold text-muted">{completedPlanLessons}/{planLessons.length}</span></div><div role="progressbar" aria-label="Personalized plan lessons completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={planPercentage} className="mt-4 h-2 overflow-hidden rounded-full bg-white"><div className="h-full bg-teal" style={{ width: `${planPercentage}%` }} /></div></section> : <section className="rounded-2xl border border-line bg-mist/50 p-5"><p className="eyebrow">Personalized plan</p><p className="mt-2 font-bold text-teal">No plan created yet.</p><a href="#create-plan" className="mt-3 inline-flex text-sm font-bold text-teal hover:text-gold">Create a learning plan</a></section>}<section className="rounded-2xl border border-line bg-white p-5"><div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Full curriculum</p><p className="mt-2 font-display text-4xl font-bold text-teal">{progress.getProgressPercentage()}%</p></div><span className="text-xs font-bold text-muted">{progress.completedLessons.length}/{lessons.length}</span></div><div role="progressbar" aria-label="Full curriculum lessons completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.getProgressPercentage()} className="mt-4 h-2 overflow-hidden rounded-full bg-mist"><div className="h-full bg-gold" style={{ width: `${progress.getProgressPercentage()}%` }} /></div></section></div>
    <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]"><section><p className="eyebrow">Section progress</p><div className="mt-3 space-y-2">{learningSections.filter((section) => section.kind === 'learning').map((section) => { const sectionLessonIds = getSectionLessonIds(section); const completed = sectionLessonIds.filter((lessonId) => progress.completedLessons.includes(lessonId)).length; const complete = sectionLessonIds.length > 0 && completed === sectionLessonIds.length; return <Link key={section.id} to={`/learn/sections/${section.id}`} className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm font-bold ${complete ? 'border-teal/20 bg-mist text-teal' : 'border-line bg-white text-muted'}`}><span>{section.title}</span><span className="flex items-center gap-2">{completed}/{sectionLessonIds.length}{complete && <CheckCircle2 size={17} />}</span></Link> })}</div></section><section><p className="eyebrow">Completed lessons</p><div className="mt-3 max-h-[28rem] overflow-y-auto rounded-2xl border border-line bg-white p-3">{progress.completedLessons.length ? lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).map((lesson) => <Link key={lesson.id} to={`/learn/${lesson.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-ink hover:bg-mist"><CheckCircle2 size={16} className="shrink-0 text-teal" />{lesson.title}</Link>) : <p className="p-4 text-sm text-muted">No lessons completed yet.</p>}</div></section></div>
  </DashboardPanel>

  const renderPortfolio = () => <DashboardPanel eyebrow="Portfolio" title="Resume and proof" description="Keep your resume, project links, accomplishments, and completed learning evidence in one place.">
    <section className="rounded-3xl border border-teal/15 bg-mist p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="eyebrow">Portfolio status</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">{portfolioProfile.displayName || 'Build your portfolio'}</h2><p className="mt-2 text-sm leading-6 text-muted">{hasPortfolioContent ? `${portfolioProfile.accomplishments.length} accomplishments saved · ${portfolioVisibility === 'public' ? 'Public sharing enabled' : 'Private portfolio'}` : 'Create a resume and add evidence from the work you complete.'}</p></div><FolderKanban className="text-teal" size={32} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">Lessons finished</p><p className="mt-2 font-display text-3xl font-bold text-teal">{progress.completedLessons.length}</p></div><div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">Accomplishments</p><p className="mt-2 font-display text-3xl font-bold text-teal">{portfolioProfile.accomplishments.length}</p></div><div className="rounded-2xl bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">Sharing</p><p className="mt-2 font-display text-xl font-bold text-teal">{portfolioVisibility === 'public' ? 'Public' : 'Private'}</p></div></div><section className="mt-6 border-t border-teal/10 pt-6"><p className="eyebrow">Portfolio visibility</p><h3 className="mt-2 font-display text-2xl font-bold text-teal">Make your portfolio public or private.</h3><div className="mt-4 flex flex-wrap gap-3"><label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${portfolioVisibility === 'private' ? 'border-teal bg-white text-teal' : 'border-line bg-white/60 text-muted'}`}><input type="radio" checked={portfolioVisibility === 'private'} disabled={portfolioSaving} onChange={() => { void updatePortfolioVisibility('private') }} className="accent-teal" />Private</label><label className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold ${portfolioVisibility === 'public' ? 'border-teal bg-white text-teal' : 'border-line bg-white/60 text-muted'}`}><input type="radio" checked={portfolioVisibility === 'public'} disabled={portfolioSaving} onChange={() => { void updatePortfolioVisibility('public') }} className="accent-teal" />Public link</label></div><p className="mt-3 text-xs leading-5 text-muted">Private portfolios stay in your account. Public portfolios create a shareable link containing your saved resume and proof.</p>{portfolioShareUrl && <div className="mt-4 rounded-xl bg-white p-3"><p className="text-xs font-bold text-teal">Public portfolio link</p><input readOnly value={portfolioShareUrl} className="mt-2 w-full rounded-lg border border-line bg-white p-2 text-xs" /></div>}</section><Link to="/portfolio" className="button button-primary mt-6">Open Portfolio Studio</Link></section>
  </DashboardPanel>

  const renderProfile = () => <DashboardPanel eyebrow="Settings" title="Profile & data" description="Manage your profile image, learning history, and account.">
    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]"><section className="rounded-3xl border border-teal/10 bg-mist p-6 shadow-soft"><p className="eyebrow">Profile image</p><div className="mt-5 flex items-center gap-4"><span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold text-2xl font-bold text-teal">{user?.imageUrl ? <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}</span><div><p className="font-display text-2xl font-bold text-teal">{user?.fullName ?? user?.username ?? 'Learner'}</p><p className="mt-1 text-sm text-muted">Signed-in learner</p></div></div><div className="mt-6 flex flex-wrap gap-3"><label className="button button-secondary cursor-pointer">{uploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadProfileImage(event.target.files?.[0]); event.currentTarget.value = '' }} /></label><button type="button" onClick={() => setConfirmAction('image')} disabled={uploading || !user?.imageUrl} className="button button-secondary disabled:opacity-40">Remove image</button></div>{uploadError && <p className="mt-4 text-sm font-bold text-red-700">{uploadError}</p>}</section>
      <section className="rounded-3xl border border-line bg-cream p-6 shadow-soft"><p className="eyebrow">Account controls</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Manage your data</h2><p className="mt-2 max-w-xl text-sm leading-6 text-muted">Keep control of your account, lesson history, and personal information.</p>{progress.saveError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{progress.saveError}</p>}<div className="mt-6 grid gap-3"><button type="button" disabled={progress.isSaving} onClick={() => setConfirmAction('clear')} className="button button-secondary justify-start disabled:opacity-50"><Trash2 size={16} className="mr-2" />{progress.isSaving ? 'Saving progress...' : 'Clear lesson progress'}</button><button type="button" disabled={deleting} onClick={() => setConfirmAction('delete')} className="button justify-start border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 size={16} className="mr-2" />{deleting ? 'Deleting...' : 'Delete account'}</button></div></section></div>
  </DashboardPanel>

  return <main className="shell max-w-[90rem] py-6 sm:py-8">
    <Show when="signed-in" fallback={<section className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft"><p className="eyebrow">{guestPathTitle}</p><h1 className="mt-3 font-display text-4xl font-bold text-teal">Choose how to continue</h1><p className="mt-4 leading-7 text-muted">All curriculum content is free to browse without an account. Sign in only if you want Tinted Learning to remember your personalized plan, progress, and portfolio evidence.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to={guestDestination} className="button button-primary">Continue free</Link><SignInButton mode="modal"><button type="button" className="button button-secondary">Save my plan</button></SignInButton></div></section>}>
      {!progress.isLoaded ? <section className="rounded-2xl border border-line bg-white p-8 text-center shadow-soft"><p className="font-bold text-teal">Loading your dashboard...</p></section> :
      <div className="space-y-10"><div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-7">{renderOverview()}</div>{renderPortfolio()}{renderProfile()}</div>}
    </Show>

    <ConfirmDialog open={Boolean(confirmAction)} title={confirmAction ? confirmCopy[confirmAction].title : ''} description={confirmAction ? confirmCopy[confirmAction].description : ''} confirmLabel={confirmAction ? confirmCopy[confirmAction].label : ''} destructive busy={deleting || uploading} error={accountError || uploadError} onConfirm={() => { void runConfirmedAction() }} onCancel={() => { setAccountError(''); setConfirmAction(null) }} />
  </main>
}
