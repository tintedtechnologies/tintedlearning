import { useState } from 'react'
import { experienceOptions, goalOptions, objectiveOptions, providerOptions, type CloudProvider, type ExperienceLevel, type LearningGoal, type LearningObjective, type LearningPlanProfile } from '../../data/learningPlans'

interface PlanBuilderProps {
  saving: boolean
  error: string
  onSave: (profile: LearningPlanProfile) => void
}

/** Create plan: a goal, experience, cloud provider, objective and weekly time. The plan ends in the Projects step. */
export function PlanBuilder({ saving, error, onSave }: PlanBuilderProps) {
  const [goal, setGoal] = useState<LearningGoal>('python-developer')
  const [experience, setExperience] = useState<ExperienceLevel>('beginner')
  const [provider, setProvider] = useState<CloudProvider>('undecided')
  const [objective, setObjective] = useState<LearningObjective>('build-project')
  const [weeklyHours, setWeeklyHours] = useState<3 | 5 | 10>(5)

  const selectClass = 'mt-2 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink'

  return <form className="mt-5 space-y-5" onSubmit={(event) => { event.preventDefault(); onSave({ version: 1, goal, experience, provider, objective, weeklyHours }) }}>
    <fieldset>
      <legend className="text-sm font-bold text-teal">What is your goal?</legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{goalOptions.map((option) => <label key={option.id} className={`cursor-pointer rounded-2xl border p-4 ${goal === option.id ? 'border-teal bg-mist' : 'border-line bg-white'}`}><input type="radio" name="goal" value={option.id} checked={goal === option.id} onChange={() => setGoal(option.id)} className="sr-only" /><span className="block font-bold text-teal">{option.title}</span><span className="mt-1 block text-xs leading-5 text-muted">{option.description}</span></label>)}</div>
    </fieldset>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-bold text-teal">Experience<select className={selectClass} value={experience} onChange={(event) => setExperience(event.target.value as ExperienceLevel)}>{experienceOptions.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}</select></label>
      <label className="block text-sm font-bold text-teal">Main objective<select className={selectClass} value={objective} onChange={(event) => setObjective(event.target.value as LearningObjective)}>{objectiveOptions.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}</select></label>
      <label className="block text-sm font-bold text-teal">Cloud provider<select className={selectClass} value={provider} onChange={(event) => setProvider(event.target.value as CloudProvider)}>{providerOptions.map((option) => <option key={option.id} value={option.id}>{option.title}</option>)}</select></label>
      <label className="block text-sm font-bold text-teal">Hours per week<select className={selectClass} value={weeklyHours} onChange={(event) => setWeeklyHours(Number(event.target.value) as 3 | 5 | 10)}><option value={3}>3 hours</option><option value={5}>5 hours</option><option value={10}>10 hours</option></select></label>
    </div>
    {error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700" role="alert">{error}</p>}
    <button type="submit" disabled={saving} className="button button-primary disabled:opacity-50">{saving ? 'Saving plan...' : 'Create my plan'}</button>
  </form>
}
