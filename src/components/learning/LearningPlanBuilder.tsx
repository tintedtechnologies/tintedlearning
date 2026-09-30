import { ArrowRight, Check, Target } from 'lucide-react'
import { useState } from 'react'
import { useUser } from '@clerk/react'
import {
  experienceOptions,
  goalOptions,
  objectiveOptions,
  providerOptions,
  readLearningPlan,
  type LearningGoal,
  type LearningPlanProfile,
} from '../../data/learningPlans'
import { LearningPlanOverview } from './LearningPlanOverview'

interface LearningPlanBuilderProps {
  completedLessonIds: string[]
  initialGoal?: LearningGoal
}

const defaultProfile: LearningPlanProfile = {
  version: 1,
  goal: 'explore-ai',
  experience: 'beginner',
  provider: 'undecided',
  objective: 'career-change',
  weeklyHours: 5,
}

export function LearningPlanBuilder({ completedLessonIds, initialGoal }: LearningPlanBuilderProps) {
  const { user } = useUser()
  const storedProfile = readLearningPlan(user?.unsafeMetadata?.tintedLearningPlan)
  const requestedNewGoal = Boolean(initialGoal && storedProfile?.goal !== initialGoal)
  const [savedProfile, setSavedProfile] = useState<LearningPlanProfile | null>(requestedNewGoal ? null : storedProfile)
  const [draft, setDraft] = useState<LearningPlanProfile>(requestedNewGoal || !storedProfile ? { ...defaultProfile, goal: initialGoal ?? defaultProfile.goal } : storedProfile)
  const [editing, setEditing] = useState(!storedProfile || requestedNewGoal)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const savePlan = async () => {
    if (!user) return
    setSaving(true)
    setSaveError('')
    const goalChanged = Boolean(savedProfile && savedProfile.goal !== draft.goal)
    const provider = draft.goal === 'cloud-engineer' || draft.goal === 'ai-architect' ? draft.provider : 'undecided'
    const profile: LearningPlanProfile = {
      ...draft,
      provider,
      modulePreferences: goalChanged ? {} : draft.modulePreferences,
      completedEvidenceIds: goalChanged ? [] : draft.completedEvidenceIds,
    }
    try {
      await user.updateMetadata({ unsafeMetadata: { tintedLearningPlan: profile } })
      setSavedProfile(profile)
      setDraft(profile)
      setEditing(false)
    } catch {
      setSaveError('Your learning plan could not be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!editing && savedProfile) {
    return <LearningPlanOverview
      profile={savedProfile}
      completedLessonIds={completedLessonIds}
      onProfileChange={(profile) => { setSavedProfile(profile); setDraft(profile) }}
      onReassess={(startOver) => { setDraft(startOver ? defaultProfile : savedProfile); setEditing(true) }}
      onDelete={() => { setSavedProfile(null); setDraft(defaultProfile); setEditing(true) }}
    />
  }

  const needsProvider = draft.goal === 'cloud-engineer' || draft.goal === 'ai-architect'
  return <section className="rounded-3xl border border-teal/15 bg-white p-6 shadow-soft sm:p-8 lg:col-span-2">
    <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal text-white"><Target size={20} /></span><div><p className="eyebrow">Personalized learning</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Build your learning plan</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">Choose where you want to go and what you already know. Your goal, objective, and experience shape the recommended modules.</p></div></div>

    <fieldset className="mt-8"><legend className="font-display text-xl font-bold text-teal">What are you working toward?</legend><div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{goalOptions.map((option) => <button key={option.id} type="button" aria-pressed={draft.goal === option.id} onClick={() => setDraft((current) => ({ ...current, goal: option.id }))} className={`min-h-32 rounded-2xl border p-4 text-left transition-colors ${draft.goal === option.id ? 'border-teal bg-mist' : 'border-line bg-cream/50 hover:border-teal/30'}`}><span className="flex items-center justify-between gap-2 font-bold text-teal">{option.title}{draft.goal === option.id && <Check size={17} />}</span><span className="mt-2 block text-xs leading-5 text-muted">{option.description}</span></button>)}</div></fieldset>

    <fieldset className="mt-7"><legend className="font-display text-xl font-bold text-teal">Where are you starting?</legend><div className="mt-3 grid gap-3 md:grid-cols-3">{experienceOptions.map((option) => <button key={option.id} type="button" aria-pressed={draft.experience === option.id} onClick={() => setDraft((current) => ({ ...current, experience: option.id }))} className={`rounded-2xl border p-4 text-left transition-colors ${draft.experience === option.id ? 'border-teal bg-mist' : 'border-line bg-white hover:border-teal/30'}`}><span className="font-bold text-teal">{option.title}</span><span className="mt-2 block text-xs leading-5 text-muted">{option.description}</span></button>)}</div></fieldset>

    {needsProvider && <fieldset className="mt-7"><legend className="font-display text-xl font-bold text-teal">Which cloud provider?</legend><div className="mt-3 grid gap-2 sm:grid-cols-2">{providerOptions.map((option) => <button key={option.id} type="button" aria-pressed={draft.provider === option.id} onClick={() => setDraft((current) => ({ ...current, provider: option.id }))} className={`rounded-xl border px-4 py-3 text-left text-sm font-bold transition-colors ${draft.provider === option.id ? 'border-teal bg-mist text-teal' : 'border-line bg-white text-muted hover:text-teal'}`}>{option.title}</button>)}</div></fieldset>}

    <div className="mt-7 grid gap-6 md:grid-cols-2"><fieldset><legend className="font-display text-xl font-bold text-teal">What is your main objective?</legend><div className="mt-3 space-y-2">{objectiveOptions.map((option) => <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink"><input type="radio" name="learning-objective" value={option.id} checked={draft.objective === option.id} onChange={() => setDraft((current) => ({ ...current, objective: option.id }))} className="accent-teal" />{option.title}</label>)}</div></fieldset><fieldset><legend className="font-display text-xl font-bold text-teal">How much time each week?</legend><div className="mt-3 grid grid-cols-3 gap-2">{([3, 5, 10] as const).map((hours) => <button key={hours} type="button" aria-pressed={draft.weeklyHours === hours} onClick={() => setDraft((current) => ({ ...current, weeklyHours: hours }))} className={`rounded-xl border px-3 py-4 text-center transition-colors ${draft.weeklyHours === hours ? 'border-teal bg-teal text-white' : 'border-line bg-white text-teal'}`}><span className="block font-display text-2xl font-bold">{hours}</span><span className="text-xs font-bold">hours</span></button>)}</div><p className="mt-3 text-xs leading-5 text-muted">This estimates lesson time only and does not set deadlines.</p></fieldset></div>

    {saveError && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{saveError}</p>}
    <div className="mt-7 flex flex-wrap gap-3"><button type="button" disabled={saving} onClick={() => { void savePlan() }} className="button button-primary disabled:opacity-50">{saving ? 'Saving plan...' : savedProfile ? 'Update my plan' : 'Create my plan'}<ArrowRight size={17} className="ml-2" /></button>{savedProfile && <button type="button" disabled={saving} onClick={() => { setDraft(savedProfile); setEditing(false) }} className="button button-secondary">Cancel</button>}</div>
  </section>
}
