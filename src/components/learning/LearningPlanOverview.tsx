import { ArrowRight, Check, ChevronDown, Clock3, ListFilter, RotateCcw, Settings2, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '@clerk/react'
import { Link } from 'react-router-dom'
import { curriculumModules, curriculumStages } from '../../data/curriculum'
import {
  getGoalTitle,
  getLearningPlanModules,
  getPlanEvidence,
  objectiveOptions,
  providerOptions,
  type LearningPlanProfile,
  type ModulePreference,
} from '../../data/learningPlans'

interface LearningPlanOverviewProps {
  profile: LearningPlanProfile
  completedLessonIds: string[]
  onProfileChange: (profile: LearningPlanProfile) => void
  onReassess: (startOver: boolean) => void
  onDelete: () => void
}

export function LearningPlanOverview({ profile, completedLessonIds, onProfileChange, onReassess, onDelete }: LearningPlanOverviewProps) {
  const { user } = useUser()
  const [showCustomize, setShowCustomize] = useState(false)
  const [incompleteOnly, setIncompleteOnly] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const modules = getLearningPlanModules(profile)
  const defaultModules = getLearningPlanModules({ ...profile, modulePreferences: {} })
  const defaultModuleIds = new Set(defaultModules.map((module) => module.id))
  const planLessons = Array.from(new Map(modules.flatMap((module) => module.lessons).map((lesson) => [lesson.id, lesson])).values())
  const completedPlanLessons = planLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length
  const percentage = planLessons.length ? Math.round((completedPlanLessons / planLessons.length) * 100) : 0
  const totalMinutes = planLessons.reduce((total, lesson) => total + lesson.duration, 0)
  const estimatedWeeks = Math.max(1, Math.ceil(totalMinutes / (profile.weeklyHours * 60)))
  const nextLesson = planLessons.find((lesson) => !completedLessonIds.includes(lesson.id))
  const objective = objectiveOptions.find((option) => option.id === profile.objective)?.title
  const provider = providerOptions.find((option) => option.id === profile.provider)?.title
  const projectLessons = Array.from(new Map(modules.filter((module) => module.id.endsWith('-project')).flatMap((module) => module.lessons).map((lesson) => [lesson.id, lesson])).values())
  const completedProjects = projectLessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length
  const evidence = getPlanEvidence(profile.goal)
  const completedEvidenceIds = profile.completedEvidenceIds ?? []

  const persistProfile = async (nextProfile: LearningPlanProfile) => {
    if (!user) return
    setSaving(true)
    setSaveError('')
    try {
      await user.updateMetadata({ unsafeMetadata: { tintedLearningPlan: nextProfile } })
      onProfileChange(nextProfile)
    } catch {
      setSaveError('Your plan changes could not be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const setModulePreference = (moduleId: string, value: ModulePreference | 'default' | 'not-included') => {
    const modulePreferences = { ...(profile.modulePreferences ?? {}) }
    if (value === 'default' || value === 'not-included') delete modulePreferences[moduleId]
    else modulePreferences[moduleId] = value
    void persistProfile({ ...profile, modulePreferences })
  }

  const toggleEvidence = (evidenceId: string) => {
    const nextIds = completedEvidenceIds.includes(evidenceId)
      ? completedEvidenceIds.filter((id) => id !== evidenceId)
      : [...completedEvidenceIds, evidenceId]
    void persistProfile({ ...profile, completedEvidenceIds: nextIds })
  }

  const deletePlan = async () => {
    if (!user) return
    setSaving(true)
    setSaveError('')
    try {
      await user.updateMetadata({ unsafeMetadata: { tintedLearningPlan: null } })
      onDelete()
    } catch {
      setSaveError('Your learning plan could not be removed. Please try again.')
    } finally {
      setSaving(false)
      setConfirmDelete(false)
    }
  }

  return <section className="overflow-hidden rounded-3xl border border-teal/15 bg-white shadow-soft lg:col-span-2">
    <header className="bg-teal p-6 text-white sm:p-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Your personalized plan</p><h2 className="mt-2 font-display text-4xl font-bold">{getGoalTitle(profile.goal)}</h2><div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-white/80"><span className="rounded-full bg-white/10 px-3 py-2">{objective}</span>{profile.provider !== 'undecided' && <span className="rounded-full bg-white/10 px-3 py-2">{provider}</span>}<span className="rounded-full bg-white/10 px-3 py-2">{profile.weeklyHours} hours/week</span></div></div><button type="button" onClick={() => onReassess(false)} className="inline-flex items-center text-sm font-bold text-white hover:text-gold"><RotateCcw size={16} className="mr-2" />Reassess</button></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-3"><div><span className="font-display text-3xl font-bold">{percentage}%</span><span className="mt-1 block text-xs text-white/70">{completedPlanLessons}/{planLessons.length} lessons complete</span></div><div><span className="font-display text-3xl font-bold">{modules.length}</span><span className="mt-1 block text-xs text-white/70">active modules</span></div><div><span className="font-display text-3xl font-bold">~{estimatedWeeks}</span><span className="mt-1 block text-xs text-white/70">weeks of lesson time</span></div></div><div role="progressbar" aria-label="Personalized plan lessons completed" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${percentage}%` }} /></div>
    </header>

    <div className="p-6 sm:p-8">
      {nextLesson ? <div className="flex flex-col justify-between gap-4 rounded-2xl bg-mist p-5 sm:flex-row sm:items-center"><div><p className="eyebrow">Next recommended lesson</p><p className="mt-2 font-bold text-teal">{nextLesson.title}</p></div><Link to={`/learn/${nextLesson.id}`} className="button button-primary shrink-0">Continue<ArrowRight size={17} className="ml-2" /></Link></div> : <div className="rounded-2xl bg-mist p-5"><p className="font-bold text-teal">You have completed every in-app lesson in this plan.</p><p className="mt-1 text-sm text-muted">Continue with your portfolio evidence and external resources.</p></div>}

      <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-line bg-cream/60 p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-muted">Project-module lessons</p><p className="mt-2 font-display text-2xl font-bold text-teal">{completedProjects}/{projectLessons.length}</p></div><div className="rounded-2xl border border-line bg-cream/60 p-4"><p className="text-[10px] font-bold uppercase tracking-widest text-muted">Portfolio evidence</p><p className="mt-2 font-display text-2xl font-bold text-teal">{completedEvidenceIds.length}/{evidence.length}</p></div></div>

      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">Recommended route</p><h3 className="mt-2 font-display text-2xl font-bold text-teal">Modules grouped by stage</h3></div><label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-teal"><input type="checkbox" checked={incompleteOnly} onChange={(event) => setIncompleteOnly(event.target.checked)} className="accent-teal" /><ListFilter size={16} />Incomplete only</label></div>
      <div className="mt-4 space-y-3">{curriculumStages.map((stage) => {
        const stageModules = stage.modules.filter((module) => modules.some((selected) => selected.id === module.id)).filter((module) => !incompleteOnly || module.lessons.some((lesson) => !completedLessonIds.includes(lesson.id)))
        if (!stageModules.length) return null
        return <details key={stage.id} open className="rounded-2xl border border-line bg-cream/40"><summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 font-bold text-teal"><span>{stage.title}<span className="ml-2 text-xs font-medium text-muted">{stageModules.length} modules</span></span><ChevronDown size={17} /></summary><div className="grid gap-2 border-t border-line p-3 md:grid-cols-2">{stageModules.map((module) => {
          const completed = module.lessons.filter((lesson) => completedLessonIds.includes(lesson.id)).length
          const complete = module.lessons.length > 0 && completed === module.lessons.length
          const preference = profile.modulePreferences?.[module.id]
          return <Link key={module.id} to={`/learn?stage=${stage.id}#${module.id}`} className="group flex min-h-24 items-start justify-between gap-4 rounded-xl bg-white p-4 hover:bg-mist"><span><span className="flex flex-wrap items-center gap-2"><span className="font-bold text-teal">{module.title}</span><span className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-widest ${preference === 'optional' ? 'bg-sand text-teal' : 'bg-mist text-muted'}`}>{preference === 'optional' ? 'Optional' : preference === 'required' ? 'Required' : 'Core'}</span></span><span className="mt-2 block text-xs text-muted">{completed}/{module.lessons.length} lessons</span></span>{complete ? <Check size={18} className="shrink-0 text-teal" /> : <ArrowRight size={17} className="shrink-0 text-teal transition-transform group-hover:translate-x-1" />}</Link>
        })}</div></details>
      })}</div>

      <section className="mt-8 rounded-2xl border border-gold/25 bg-sand/50 p-5"><p className="eyebrow">Portfolio evidence</p><h3 className="mt-2 font-display text-xl font-bold text-teal">What you can show</h3><div className="mt-4 grid gap-2 md:grid-cols-2">{evidence.map((item) => <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 text-sm font-bold text-ink"><input type="checkbox" checked={completedEvidenceIds.includes(item.id)} disabled={saving} onChange={() => toggleEvidence(item.id)} className="mt-0.5 accent-teal" /><span className={completedEvidenceIds.includes(item.id) ? 'text-muted line-through' : ''}>{item.title}</span></label>)}</div></section>

      <section className="mt-6 rounded-2xl border border-line p-5"><button type="button" onClick={() => setShowCustomize((open) => !open)} aria-expanded={showCustomize} className="flex w-full items-center justify-between gap-4 text-left"><span><span className="flex items-center gap-2 font-display text-xl font-bold text-teal"><Settings2 size={19} />Customize modules</span><span className="mt-1 block text-xs leading-5 text-muted">Add optional study, require a module, or mark material you already know.</span></span><ChevronDown size={18} className={`shrink-0 text-teal transition-transform ${showCustomize ? 'rotate-180' : ''}`} /></button>{showCustomize && <div className="mt-5 max-h-96 space-y-5 overflow-y-auto border-t border-line pt-5">{curriculumStages.map((stage) => <div key={stage.id}><p className="text-xs font-bold uppercase tracking-widest text-muted">{stage.title}</p><div className="mt-2 space-y-2">{stage.modules.map((module) => {
          const isDefault = defaultModuleIds.has(module.id)
          const preference = profile.modulePreferences?.[module.id]
          const value = preference ?? (isDefault ? 'default' : 'not-included')
          return <label key={module.id} className="flex flex-col justify-between gap-2 rounded-xl bg-cream/60 p-3 sm:flex-row sm:items-center"><span className="text-sm font-bold text-teal">{module.title}</span><select value={value} disabled={saving} onChange={(event) => setModulePreference(module.id, event.target.value as ModulePreference | 'default' | 'not-included')} className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-teal"><option value={isDefault ? 'default' : 'not-included'}>{isDefault ? 'Core recommendation' : 'Not included'}</option><option value="required">Required</option><option value="optional">Optional</option><option value="known">Already know this</option></select></label>
        })}</div></div>)}</div>}</section>

      {saveError && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{saveError}</p>}
      <div className="mt-6 flex flex-wrap gap-3"><Link to="/learn" className="button button-secondary">Browse full curriculum</Link><Link to="/portfolio" className="button button-secondary">Open portfolio studio</Link><button type="button" onClick={() => onReassess(true)} className="button button-secondary"><RotateCcw size={16} className="mr-2" />Start over</button><button type="button" onClick={() => setConfirmDelete(true)} className="button border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"><Trash2 size={16} className="mr-2" />Remove plan</button></div>
    </div>

    {confirmDelete && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#123F3D]/50 p-5" role="presentation"><div role="dialog" aria-modal="true" aria-labelledby="remove-plan-title" aria-describedby="remove-plan-description" onKeyDown={(event) => { if (event.key === 'Escape' && !saving) setConfirmDelete(false) }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft"><p className="eyebrow">Please confirm</p><h3 id="remove-plan-title" className="mt-2 font-display text-3xl font-bold text-teal">Remove your plan?</h3><p id="remove-plan-description" className="mt-3 text-sm leading-6 text-muted">Your assessment choices, module preferences, and evidence checks will be removed. Completed lessons will remain.</p><div className="mt-6 flex justify-end gap-3"><button type="button" autoFocus disabled={saving} onClick={() => setConfirmDelete(false)} className="button button-secondary">Cancel</button><button type="button" disabled={saving} onClick={() => { void deletePlan() }} className="button bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{saving ? 'Removing...' : 'Remove plan'}</button></div></div></div>}
  </section>
}
