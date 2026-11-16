import { BookOpen, CheckCircle2, FolderKanban, LogOut, Trash2 } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Show, SignInButton, useClerk, useUser } from '@clerk/react'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { PlanBuilder } from '../components/learning/PlanBuilder'
import { projectPlans } from '../data/projects'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { lessons } from '../data/curriculum'
import { curriculumLessonTotal, getSectionIdForLesson, getSectionModules, learningSections } from '../data/learningSections'
import { getGoalTitle, getLearningPlanModules, getPlanEvidence, projectsByGoal, readLearningPlan, type LearningPlanProfile } from '../data/learningPlans'
import { useProgress } from '../hooks/useProgress'
import { encodePortfolioProfile, readPortfolioProfile } from '../data/portfolioProfile'

/** A titled block on the dashboard. Every block uses the same heading pattern, so the page is easy to scan. */
function Section({ id, eyebrow, title, description, children }: { id?: string; eyebrow: string; title: string; description?: string; children: ReactNode }) {
  return <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-6">
    <div className="mb-5">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id ? `${id}-title` : undefined} className="mt-1 font-display text-2xl font-bold text-teal sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-ink">{description}</p>}
    </div>
    {children}
  </section>
}

/** A single number with a short label. Used for the three headline figures at the top. */
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-line bg-white p-6 shadow-soft">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">{label}</p>
    <p className="mt-3 font-display text-4xl font-bold text-teal">{value}</p>
    <p className="mt-2 text-sm leading-6 text-ink">{detail}</p>
  </div>
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

  const firstName = user?.firstName ?? user?.username ?? 'learner'
  const overallPercent = progress.getProgressPercentage()
  const linkClass = 'font-bold text-teal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold'

  return <main className="shell max-w-6xl py-8 sm:py-12">
    <Show when="signed-in" fallback={<section className="mx-auto max-w-xl rounded-3xl border border-line bg-white p-8 text-center shadow-soft"><p className="eyebrow">{guestPathTitle}</p><h1 className="mt-3 font-display text-4xl font-bold text-teal">Choose how to continue</h1><p className="mt-4 leading-7 text-ink">All curriculum content is free to browse without an account. Sign in only if you want Tinted Learning to remember your personalized plan, progress, and portfolio evidence.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link to={guestDestination} className="button button-primary">Continue free</Link><SignInButton mode="modal"><button type="button" className="button button-secondary">Save my plan</button></SignInButton></div></section>}>
      {!progress.isLoaded ? <section className="rounded-2xl border border-line bg-white p-8 text-center shadow-soft"><p className="font-bold text-teal">Loading your dashboard...</p></section> :
      <div className="space-y-14">

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-2 font-display text-4xl font-bold text-teal sm:text-5xl">Welcome back, {firstName}.</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-ink">Your next step, your progress and your portfolio, in one place.</p>
          </div>
          <nav aria-label="Dashboard sections" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold">
            <a href="#next" className={linkClass}>Next step</a>
            <a href="#plan" className={linkClass}>Plan</a>
            <a href="#portfolio" className={linkClass}>Portfolio</a>
            <a href="#settings" className={linkClass}>Settings</a>
          </nav>
        </header>

        <section id="next" aria-labelledby="next-title" className="scroll-mt-6 rounded-3xl bg-teal p-6 text-white shadow-soft sm:p-8">
          {plan ? <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Your plan</p>
              <h2 id="next-title" className="mt-2 font-display text-3xl font-bold sm:text-4xl">{getGoalTitle(plan.goal)}</h2>
              <p className="mt-3 text-sm text-white/85">{planModules.length} modules · {plan.weeklyHours} hours a week</p>
              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Next lesson</p>
                {nextPlanLesson ? <Link to={`/learn/${nextPlanLesson.id}`} className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-teal hover:bg-gold">{nextPlanLesson.title}<BookOpen size={16} /></Link> : <p className="mt-2 font-bold text-gold">All plan lessons complete</p>}
              </div>
            </div>
            <a href="#plan" className="button bg-gold text-teal hover:bg-white">View projects</a>
          </div> : <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Get started</p>
              <h2 id="next-title" className="mt-2 font-display text-3xl font-bold sm:text-4xl">Build a plan around your goal.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/85">Your plan lists the lessons for your goal, then the projects that turn them into portfolio evidence.</p>
            </div>
            <a href="#plan" className="button bg-gold text-teal hover:bg-white">Create plan</a>
          </div>}
        </section>

        <section aria-label="Your progress" className="grid gap-4 sm:grid-cols-3">
          <Stat label="Lessons finished" value={`${overallPercent}%`} detail={`${progress.completedLessons.length} of ${lessons.length} lessons`} />
          <Stat label="Plan progress" value={plan ? `${planPercentage}%` : '—'} detail={plan ? `${completedPlanLessons} of ${planLessons.length} plan lessons` : 'Create a plan to begin'} />
          <Stat label="Evidence ready" value={plan ? `${completedEvidence} of ${evidence.length}` : '—'} detail="Portfolio items you have finished" />
        </section>

        <Section id="plan" eyebrow="Plan" title={plan ? getGoalTitle(plan.goal) : 'Choose your goal'} description={plan ? 'These lessons and projects build toward your goal. Tick each evidence item when you finish it.' : 'Pick the goal closest to where you want to end up.'}>
          {!plan ? <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"><PlanBuilder saving={planSaving} error={planError} onSave={(profile) => { void savePlanProfile(profile) }} /></div>
          : <div id="portfolio-evidence" className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
              <h3 className="font-display text-2xl font-bold text-teal">Projects</h3>
              <p className="mt-2 text-sm leading-6 text-ink">Each project ends in finished work you can show.</p>
              <ul className="mt-5 divide-y divide-line">{projectsByGoal[plan.goal].map((id) => { const lesson = lessons.find((item) => item.id === id); const project = projectPlans[id]; return <li key={id} className="py-4"><Link to={`/learn/${id}`} className="font-bold text-teal hover:text-gold">{lesson?.title ?? id}</Link>{project?.time && <p className="mt-1 text-xs font-bold text-muted">{project.time}</p>}</li> })}</ul>
              <Link to="/learn/sections/projects" className="mt-4 inline-flex text-sm font-bold text-teal hover:text-gold">See all projects</Link>
            </div>
            <div className="rounded-3xl border border-line bg-white p-6 shadow-soft">
              <h3 className="font-display text-2xl font-bold text-teal">Evidence checklist</h3>
              <p className="mt-2 text-sm leading-6 text-ink">Tick an item when you have finished it.</p>
              <div className="mt-5 space-y-4">{getPlanEvidence(plan.goal).map((item) => <label key={item.id} className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-ink"><input type="checkbox" className="mt-1 h-4 w-4 accent-teal" checked={(plan.completedEvidenceIds ?? []).includes(item.id)} disabled={planSaving} onChange={() => toggleEvidence(item.id)} /><span>{item.title}</span></label>)}</div>
              {planError && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">{planError}</p>}
            </div>
          </div>}
        </Section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section aria-labelledby="position-title" className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
            <p className="eyebrow">Where you are</p>
            {progress.currentLesson ? <>
              <h2 id="position-title" className="mt-2 font-display text-2xl font-bold text-teal sm:text-3xl">{currentSection?.title ?? 'Learning'}</h2>
              <p className="mt-2 text-sm font-bold text-teal">{currentSectionModule?.title ?? progress.currentModule?.title}</p>
              <p className="mt-3 text-sm leading-6 text-ink">Next: {progress.currentLesson.title}</p>
            </> : <>
              <h2 id="position-title" className="mt-2 font-display text-2xl font-bold text-teal sm:text-3xl">Curriculum complete</h2>
              <p className="mt-3 text-sm leading-6 text-ink">Every lesson in the full track is marked complete.</p>
            </>}
            <Link to="/learn" className="mt-6 inline-flex text-sm font-bold text-teal hover:text-gold">Go to the learning pathway</Link>
          </section>

          <section id="portfolio" aria-labelledby="portfolio-title" className="scroll-mt-6 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Portfolio</p>
                <h2 id="portfolio-title" className="mt-2 font-display text-2xl font-bold text-teal sm:text-3xl">{hasPortfolioContent ? portfolioProfile.displayName || 'Your portfolio' : 'Start your portfolio'}</h2>
                <p className="mt-2 text-sm leading-6 text-ink">{hasPortfolioContent ? `${portfolioProfile.accomplishments.length} accomplishments saved.` : 'Create a resume and add the work you complete.'}</p>
              </div>
              <FolderKanban className="shrink-0 text-teal" size={28} aria-hidden="true" />
            </div>

            <fieldset className="mt-6 border-t border-line pt-6">
              <legend className="text-sm font-bold text-teal">Who can see your portfolio</legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm ${portfolioVisibility === 'private' ? 'border-teal bg-mist' : 'border-line bg-white'}`}>
                  <input type="radio" name="visibility" checked={portfolioVisibility === 'private'} disabled={portfolioSaving} onChange={() => { void updatePortfolioVisibility('private') }} className="mt-1 accent-teal" />
                  <span><span className="block font-bold text-teal">Private</span><span className="mt-1 block leading-5 text-ink">Only you can see it.</span></span>
                </label>
                <label className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm ${portfolioVisibility === 'public' ? 'border-teal bg-mist' : 'border-line bg-white'}`}>
                  <input type="radio" name="visibility" checked={portfolioVisibility === 'public'} disabled={portfolioSaving} onChange={() => { void updatePortfolioVisibility('public') }} className="mt-1 accent-teal" />
                  <span><span className="block font-bold text-teal">Public link</span><span className="mt-1 block leading-5 text-ink">Anyone with the link can view it.</span></span>
                </label>
              </div>
              {portfolioShareUrl && <div className="mt-4 rounded-2xl bg-mist p-4"><label htmlFor="share-url" className="text-xs font-bold text-teal">Your public link</label><input id="share-url" readOnly value={portfolioShareUrl} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-xs text-ink" /></div>}
            </fieldset>

            <Link to="/portfolio" className="button button-primary mt-6">Open portfolio studio</Link>
          </section>
        </div>

        <Section id="settings" eyebrow="Settings" title="Profile and data" description="Your profile image, your lesson history and your account.">
          <div className="grid gap-6 lg:grid-cols-2">
            <section aria-labelledby="image-title" className="rounded-3xl border border-line bg-white p-6 shadow-soft">
              <h3 id="image-title" className="font-display text-2xl font-bold text-teal">Profile image</h3>
              <div className="mt-5 flex items-center gap-4">
                <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold text-2xl font-bold text-teal">{user?.imageUrl ? <img src={user.imageUrl} alt="Your profile" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}</span>
                <div>
                  <p className="font-display text-xl font-bold text-teal">{user?.fullName ?? user?.username ?? 'Learner'}</p>
                  <p className="mt-1 text-sm text-ink">Signed-in learner</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <label className="button button-secondary cursor-pointer">{uploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" disabled={uploading} onChange={(event) => { void uploadProfileImage(event.target.files?.[0]); event.currentTarget.value = '' }} /></label>
                <button type="button" onClick={() => setConfirmAction('image')} disabled={uploading || !user?.imageUrl} className="button button-secondary disabled:opacity-40">Remove image</button>
              </div>
              {uploadError && <p className="mt-4 text-sm font-bold text-red-700" role="alert">{uploadError}</p>}
            </section>

            <section aria-labelledby="account-title" className="rounded-3xl border border-line bg-white p-6 shadow-soft">
              <h3 id="account-title" className="font-display text-2xl font-bold text-teal">Account</h3>
              <p className="mt-2 text-sm leading-6 text-ink">Manage your lesson history and your account.</p>
              {progress.saveError && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">{progress.saveError}</p>}
              <div className="mt-6 grid gap-3">
                <button type="button" disabled={progress.isSaving} onClick={() => setConfirmAction('clear')} className="button button-secondary justify-start disabled:opacity-50"><Trash2 size={16} className="mr-2" />{progress.isSaving ? 'Saving progress...' : 'Clear lesson progress'}</button>
                <button type="button" onClick={() => signOut()} className="button button-secondary justify-start"><LogOut size={16} className="mr-2" />Sign out</button>
              </div>
              <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-5">
                <p className="font-bold text-red-700">Delete account</p>
                <p className="mt-1 text-sm leading-6 text-ink">Permanently removes your account, plan and progress. This cannot be undone.</p>
                <button type="button" disabled={deleting} onClick={() => setConfirmAction('delete')} className="button mt-4 border border-red-200 bg-white text-red-700 hover:bg-red-100 disabled:opacity-50"><Trash2 size={16} className="mr-2" />{deleting ? 'Deleting...' : 'Delete account'}</button>
              </div>
            </section>
          </div>
        </Section>
      </div>}
    </Show>

    <ConfirmDialog open={Boolean(confirmAction)} title={confirmAction ? confirmCopy[confirmAction].title : ''} description={confirmAction ? confirmCopy[confirmAction].description : ''} confirmLabel={confirmAction ? confirmCopy[confirmAction].label : ''} destructive busy={deleting || uploading} error={accountError || uploadError} onConfirm={() => { void runConfirmedAction() }} onCancel={() => { setAccountError(''); setConfirmAction(null) }} />
  </main>
}
