import { ArrowUpRight, Check, ChevronDown, Circle, LockKeyhole } from 'lucide-react'
import { Show } from '@clerk/react'
import { Link } from 'react-router-dom'
import { getModuleProgress } from '../../data/curriculum'
import { StageBadge } from './StageBadge'
import type { CurriculumStage as CurriculumStageData } from '../../types/curriculum'

interface CurriculumStageProps {
  stage: CurriculumStageData
  completedLessonIds: string[]
  isLessonComplete: (lessonId: string) => boolean
  setLessonComplete: (lessonId: string, complete: boolean) => void
  isStageAssessmentPassed: (stageId: string) => boolean
}

export function CurriculumStage({ stage, completedLessonIds, isLessonComplete, setLessonComplete, isStageAssessmentPassed }: CurriculumStageProps) {
  const lessonCount = stage.modules.reduce((total, module) => total + module.lessons.length, 0)
  const completedCount = stage.modules.reduce((total, module) => total + getModuleProgress(module, completedLessonIds).completed, 0)
  const stageComplete = lessonCount > 0 && completedCount === lessonCount
  const badgeEarned = stage.id !== 'projects' && stageComplete && (!stage.assessment || isStageAssessmentPassed(stage.id))
  const tone = stage.tone === 'teal' ? 'bg-mist' : stage.tone === 'gold' ? 'bg-sand' : 'bg-white'

  return (
    <details id={stage.id} className={`scroll-mt-8 rounded-[2rem] border border-line p-5 shadow-soft sm:p-8 ${tone}`}>
      <summary className="group flex cursor-pointer list-none items-center justify-between gap-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h2 className="mt-2 font-display text-3xl font-bold text-teal sm:text-4xl">{stage.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 !text-ink">{stage.description}</p>
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-teal">{lessonCount ? `${completedCount} of ${lessonCount} lessons complete` : 'Source map and project work'}</p>
          {badgeEarned && <Show when="signed-in"><div className="mt-4"><StageBadge stageTitle={stage.title} /></div></Show>}
        </div>
        <ChevronDown size={24} className="shrink-0 text-teal transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>

      <div className="mt-6 border-t border-teal/10 pt-5">
      <div className="space-y-4">
        {stage.modules.map((module) => {
          const progress = getModuleProgress(module, completedLessonIds)
          return (
            <article id={module.id} key={module.id} className="scroll-mt-8 rounded-3xl border border-line/80 bg-white/75 p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-2xl font-bold text-teal">{module.title}</h3>
                    {module.provider && module.provider !== 'shared' && <span className="rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-teal">{module.provider}</span>}
                    {module.status === 'coming-soon' && <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">Resource-led</span>}
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{module.description}</p>
                </div>
                {progress.total > 0 && <span className="shrink-0 text-xs font-bold text-muted">{progress.completed}/{progress.total}</span>}
              </div>

              <div className="mt-4 rounded-2xl border border-gold/20 bg-sand/60 p-4"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Before this module</p><ul className="mt-2 space-y-1 text-sm leading-6 text-ink">{module.prerequisites.map((prerequisite) => <li key={prerequisite}>• {prerequisite}</li>)}</ul></div>

              {module.lessons.length > 0 && <div className="mt-4 divide-y divide-line/70 border-t border-line/70">
                {module.lessons.map((lesson) => {
                  const complete = isLessonComplete(lesson.id)
                  return <div key={lesson.id} className="flex items-center gap-3 py-3 sm:gap-4">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-teal text-white' : 'bg-mist text-teal'}`}>{complete ? <Check size={15} /> : String(lesson.order).padStart(2, '0')}</span>
                    <Link to={`/learn/${lesson.id}`} className="min-w-0 flex-1"><span className="block font-bold text-ink hover:text-teal">{lesson.title}</span><span className="mt-1 block text-xs text-muted">{lesson.duration} min · {lesson.difficulty}</span></Link>
                    <button type="button" onClick={() => setLessonComplete(lesson.id, !complete)} className="shrink-0 text-muted hover:text-teal" aria-label={`${complete ? 'Mark' : 'Mark'} ${lesson.title} ${complete ? 'incomplete' : 'complete'}`}>{complete ? <Check size={17} /> : <Circle size={17} />}</button>
                  </div>
                })}
              </div>}

              {module.lessons.length === 0 && <div className="mt-4 flex items-center gap-3 rounded-2xl bg-cream/80 p-4 text-sm text-muted"><LockKeyhole className="shrink-0 text-gold" size={18} /><span>Use the free resources below to build this capability. Tinted Learning will add a concise orientation when it improves the path.</span></div>}

              {module.resources && module.lessons.length === 0 && <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-muted">Open this module to follow the recommended sources</p>}

              {stage.id === 'projects' && module.lessons[0] && <Link to={`/learn/${module.lessons[0].id}`} className="mt-4 inline-flex items-center text-sm font-bold text-teal hover:text-gold">Open project brief <ArrowUpRight size={16} className="ml-2" /></Link>}
            </article>
          )
        })}
      </div>

      {stage.learnerOutcome && <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-teal/10 bg-white/80 p-4"><p className="eyebrow">You will understand</p><p className="mt-2 text-sm leading-6 text-ink">{stage.learnerOutcome.understand}</p></div>
        <div className="rounded-2xl border border-teal/10 bg-white/80 p-4"><p className="eyebrow">You will build</p><p className="mt-2 text-sm leading-6 text-ink">{stage.learnerOutcome.build}</p></div>
        <div className="rounded-2xl border border-teal/10 bg-white/80 p-4"><p className="eyebrow">You can show</p><p className="mt-2 text-sm leading-6 text-ink">{stage.learnerOutcome.show}</p></div>
      </div>}
      {stage.assessment && <div className="mt-8 flex flex-col justify-between gap-4 rounded-3xl border border-teal/15 bg-white p-5 sm:flex-row sm:items-center sm:p-6"><div><p className="eyebrow">Section assessment</p><h3 className="mt-2 font-display text-2xl font-bold text-teal">{stage.assessment.title}</h3><p className="mt-2 text-sm leading-6 text-muted">Test this section in a dedicated assessment view.</p></div><Link to={`/learn/stage/${stage.id}/test`} className="button button-primary shrink-0">Take the section test <ArrowUpRight size={16} className="ml-2" /></Link></div>}
      </div>
    </details>
  )
}
