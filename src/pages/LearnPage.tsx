import { ArrowRight } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { careerPaths, learningPaths, lessons } from '../data/curriculum'
import { LearningPath } from '../components/learning/LearningPath'

export function LearnPage() {
  const progress = useProgress(lessons.length)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const pathId = searchParams.get('path')
    if (!pathId) return
    document.getElementById(pathId)?.scrollIntoView({ block: 'start' })
  }, [searchParams])

  return <div><section className="shell py-16 sm:py-20"><p className="eyebrow">The curriculum</p><div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><h1 className="section-title">A complete education in modern AI.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Move from plain-language foundations to the math, models, systems, and engineering practices behind AI in 2026. Every stage assumes what came before it.</p><p className="mt-4 text-sm font-bold text-teal">{lessons.length} lessons across eight stages</p></div><div className="flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-widest text-muted">Your local progress</p><p className="mt-1 font-display text-2xl font-bold text-teal">{progress.getProgressPercentage()}% complete</p></div><button type="button" onClick={progress.clearProgress} className="text-xs font-bold text-muted underline decoration-line underline-offset-4 hover:text-teal">Clear progress</button></div></div></section><section className="shell space-y-5 pb-20">{learningPaths.map((path) => <LearningPath key={path.id} path={path} isLessonComplete={progress.isLessonComplete} setLessonComplete={progress.setLessonComplete} />)}<section className="pt-12"><p className="eyebrow">Career directions</p><h2 className="section-title mt-3">Where could this take you?</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-muted">Choose a direction to see an ordered path from your first step to job-ready practice.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{careerPaths.map((career) => <Link key={career.id} to={`/careers/${career.id}`} className={`block rounded-3xl border border-line p-6 transition-transform hover:-translate-y-1 hover:shadow-soft ${career.tone === 'teal' ? 'bg-mist' : career.tone === 'gold' ? 'bg-sand' : 'bg-white'}`}><span className="flex items-start justify-between gap-4"><span><span className="block font-display text-2xl font-bold text-teal">{career.title}</span><span className="mt-3 block text-sm leading-6 text-muted">{career.description}</span></span><ArrowRight className="shrink-0 text-teal" size={20} /></span><span className="mt-6 inline-flex text-sm font-bold text-teal">Open roadmap</span></Link>)}</div></section></section></div>
}
