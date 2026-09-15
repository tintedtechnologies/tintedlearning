import { ArrowRight, Check, LockKeyhole } from 'lucide-react'
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
    window.setTimeout(() => document.getElementById(targetId)?.scrollIntoView({ block: 'start' }), 50)
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
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4">
          <div><p className="text-xs font-bold uppercase tracking-widest text-muted">Your local progress</p><p className="mt-1 font-display text-2xl font-bold text-teal">{progress.getProgressPercentage()}% complete</p>{nextLesson && <Link to={`/learn/${nextLesson.id}`} className="mt-1 block max-w-48 truncate text-xs font-bold text-teal hover:text-gold">Continue with: {nextLesson.title}</Link>}</div>
          <button type="button" onClick={progress.clearProgress} className="text-xs font-bold text-muted underline decoration-line underline-offset-4 hover:text-teal">Clear progress</button>
        </div>
      </div>
    </section>

    <section className="border-y border-line bg-mist/60 py-8 sm:py-10">
      <div className="shell"><p className="eyebrow">Where should I start?</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Choose the route that matches your goal.</h2><div className="mt-5 grid gap-3 md:grid-cols-3">
        <Link to="/learn?stage=foundation" className="rounded-2xl border border-line bg-white p-5 transition-transform hover:-translate-y-0.5 hover:shadow-soft"><span className="text-xs font-bold uppercase tracking-widest text-muted">New to AI</span><h3 className="mt-2 font-display text-xl font-bold text-teal">Start with the foundations</h3><p className="mt-2 text-sm leading-6 text-muted">Build the mental models, math, Python, and software habits that make later AI concepts easier.</p><span className="mt-4 block text-xs font-bold text-teal">Start Foundation →</span></Link>
        <Link to="/learn#python" className="rounded-2xl border border-line bg-white p-5 transition-transform hover:-translate-y-0.5 hover:shadow-soft"><span className="text-xs font-bold uppercase tracking-widest text-muted">Already know Python</span><h3 className="mt-2 font-display text-xl font-bold text-teal">Jump into AI engineering</h3><p className="mt-2 text-sm leading-6 text-muted">Move toward models, prompts, retrieval, tools, evaluation, and production AI systems.</p><span className="mt-4 block text-xs font-bold text-teal">Explore the pathway →</span></Link>
        <Link to="/careers/ai-developer" className="rounded-2xl border border-line bg-white p-5 transition-transform hover:-translate-y-0.5 hover:shadow-soft"><span className="text-xs font-bold uppercase tracking-widest text-muted">Want employable skills</span><h3 className="mt-2 font-display text-xl font-bold text-teal">Build toward AI Developer</h3><p className="mt-2 text-sm leading-6 text-muted">Follow the software route and finish with a working project, tests, README, and portfolio evidence.</p><span className="mt-4 block text-xs font-bold text-teal">See the milestone →</span></Link>
      </div></div>
    </section>

    <section className="border-y border-line bg-white py-8 sm:py-10">
      <div className="shell">
        <div className="flex items-center justify-between gap-4"><div><p className="eyebrow">What this unlocks</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Choose the capability you are building toward.</h2></div><LockKeyhole className="hidden text-gold sm:block" size={26} /></div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {careerLevels.map((level, index) => {
            const complete = isCareerLevelComplete(level, progress.completedLessons)
            const destination = level.id === 'start-here' ? '#foundation' : `/careers/${level.id}`
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
      {curriculumStages.map((stage) => <CurriculumStage key={stage.id} stage={stage} completedLessonIds={progress.completedLessons} isLessonComplete={progress.isLessonComplete} setLessonComplete={progress.setLessonComplete} />)}
      <div className="flex flex-wrap justify-center gap-3 pt-3"><Link to="/portfolio" className="button button-primary">Build your portfolio <ArrowRight size={17} className="ml-2" /></Link><Link to="/playground" className="button button-secondary">Practice what you learn <ArrowRight size={17} className="ml-2" /></Link></div>
    </section>
  </div>
}
