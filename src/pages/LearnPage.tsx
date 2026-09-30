import { ArrowRight, Check, Compass } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { CurriculumStage } from '../components/learning/CurriculumStage'
import { careerLevels, curriculumStages, isCareerLevelComplete, lessons } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function LearnPage() {
  const progress = useProgress(lessons.length)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const nextLesson = lessons.find((lesson) => !progress.isLessonComplete(lesson.id))

  useEffect(() => {
    const stageId = searchParams.get('stage')
    const targetId = location.hash.replace(/^#/, '') || stageId
    if (!targetId) return
    window.setTimeout(() => {
      const target = document.getElementById(targetId)
      const stage = target?.closest('details') as HTMLDetailsElement | null
      if (stage) stage.open = true
      target?.scrollIntoView({ block: 'start' })
    }, 50)
  }, [location.hash, searchParams])

  return <div>
    <section className="shell py-12 sm:py-16">
      <p className="eyebrow">The career pathway</p>
      <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="section-title">From first steps to AI architecture.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Tinted Learning is a source map: learn the essential idea here, then follow trusted free resources until you can build a system and defend every decision.</p>
          <p className="mt-4 text-sm font-bold text-teal">{lessons.length} in-app lessons · {curriculumStages.length} stages · {progress.getProgressPercentage()}% complete</p>
        </div>
        {nextLesson && <div className="max-w-xs rounded-2xl border border-teal/10 bg-white p-4 shadow-soft"><p className="eyebrow">Next step</p><Link to={`/learn/${nextLesson.id}`} className="button button-primary mt-3 w-full justify-between text-left">Continue with: {nextLesson.title}<ArrowRight size={17} /></Link></div>}
      </div>
    </section>

    <section className="border-y border-line bg-white py-8 sm:py-10">
      <div className="shell">
        <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">Your next milestone</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Choose the capability you are building toward.</h2></div><Compass className="hidden text-gold sm:block" size={26} /></div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {careerLevels.map((level, index) => {
            const complete = isCareerLevelComplete(level, progress.completedLessons)
            const destination = `/careers/${level.id}`
            return <Link key={level.id} to={destination} className={`relative rounded-2xl border p-4 transition-transform hover:-translate-y-0.5 hover:shadow-soft ${complete ? 'border-teal/30 bg-mist' : 'border-line bg-cream'}`}>
              <span className="flex items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-widest text-muted">{index === 0 ? 'Begin' : `Level ${index}`}</span>{complete ? <Check size={17} className="text-teal" /> : <span className="text-sm font-bold text-gold">{index + 1}</span>}</span>
              <span className="mt-3 block font-display text-xl font-bold text-teal">{level.title}</span>
              <span className="mt-2 block text-xs leading-5 text-muted">{complete ? 'Milestone reached' : level.description}</span>
              <span className="mt-3 block text-[10px] font-bold uppercase tracking-[0.14em] text-teal">{level.portfolioArtifacts.length} evidence deliverables</span>
            </Link>
          })}
        </div>
      </div>
    </section>

    <section className="shell space-y-5 py-12 pb-20">
      {curriculumStages.map((stage) => <CurriculumStage key={stage.id} stage={stage} completedLessonIds={progress.completedLessons} isLessonComplete={progress.isLessonComplete} setLessonComplete={progress.setLessonComplete} isStageAssessmentPassed={progress.hasPassedStageAssessment} />)}
      <div className="flex flex-wrap justify-center gap-3 pt-3"><Link to="/portfolio" className="button button-primary">Build your portfolio <ArrowRight size={17} className="ml-2" /></Link><Link to="/playground" className="button button-secondary">Practice what you learn <ArrowRight size={17} className="ml-2" /></Link></div>
    </section>
  </div>
}
