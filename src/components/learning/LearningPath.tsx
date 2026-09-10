import { ArrowUpRight, Check, Circle, ExternalLink, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { LearningPath } from '../../types/curriculum'

interface LearningPathProps {
  path: LearningPath
  isLessonComplete: (lessonId: string) => boolean
  setLessonComplete: (lessonId: string, complete: boolean) => void
}

export function LearningPath({ path, isLessonComplete, setLessonComplete }: LearningPathProps) {
  const tone = path.tone === 'teal' ? 'bg-mist' : path.tone === 'gold' ? 'bg-sand' : 'bg-white'
  return (
    <section id={path.id} className={`scroll-mt-8 rounded-[2rem] border border-line p-5 shadow-soft sm:p-8 ${tone}`}>
      <div className="flex flex-col justify-between gap-4 border-b border-teal/10 pb-6 sm:flex-row">
        <div><div className="flex flex-wrap items-center gap-3"><p className="eyebrow">{path.eyebrow}</p>{path.level && <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-teal">{path.level}</span>}</div><Link to={`/learn?path=${path.id}`} className="group inline-flex items-center gap-2"><h2 className="mt-2 font-display text-3xl font-bold text-teal group-hover:text-gold">{path.title}</h2><ArrowUpRight size={20} className="mt-2 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div>
        <p className="max-w-sm text-sm leading-6 text-muted">{path.description}</p>
      </div>
      <div className="mt-3">
        {path.lessons.map((lesson) => {
          const complete = isLessonComplete(lesson.id)
          const available = lesson.status !== 'coming-soon'
          const row = <div className={`flex items-center gap-4 rounded-2xl px-3 py-4 transition-colors sm:px-4 ${available ? 'hover:bg-white/70' : 'opacity-65'}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${complete ? 'bg-teal text-white' : 'bg-white text-teal'}`}>{complete ? <Check size={17} /> : String(lesson.order).padStart(2, '0')}</span>
            <Link to={`/learn/${lesson.id}`} className="min-w-0 flex-1"><span className="block font-bold text-ink">{lesson.title}</span><span className="mt-1 block text-xs text-muted">{lesson.duration} min · {lesson.difficulty}</span></Link>
            {available ? <><button type="button" onClick={() => setLessonComplete(lesson.id, !complete)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition-colors ${complete ? 'bg-mist text-teal hover:bg-sand' : 'bg-white text-muted hover:bg-mist hover:text-teal'}`} aria-label={`${complete ? 'Mark' : 'Mark'} ${lesson.title} ${complete ? 'incomplete' : 'complete'}`}><span>{complete ? 'Complete' : 'Mark done'}</span>{complete ? <Check size={14} /> : <Circle size={14} />}</button><ArrowUpRight size={18} className="text-teal" /></> : <LockKeyhole size={17} className="text-muted" />}
          </div>
          return <div key={lesson.id}>{row}</div>
        })}
      </div>
      {path.id === 'python' && <Link to="/playground/python" className="mt-5 flex items-center justify-between rounded-2xl border border-teal/20 bg-teal p-5 text-white hover:bg-[#0c3432]"><span><span className="block text-xs font-bold uppercase tracking-[0.18em] text-gold">Practice now</span><span className="mt-2 block font-display text-xl font-bold">Run Python in your browser</span><span className="mt-1 block text-sm text-white/70">Try the examples before installing Python locally.</span></span><ArrowUpRight size={22} className="text-gold" /></Link>}
      {path.resources && <aside className="mt-5 rounded-2xl border border-teal/10 bg-white/70 p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Build the prerequisites</p><p className="mt-2 text-sm leading-6 text-muted">These optional resources support this stage. Use them when a lesson introduces a skill you want to practice more deeply.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{path.resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-line bg-white p-4 transition-colors hover:border-teal/30 hover:bg-mist"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-xs font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={16} className="shrink-0 text-teal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span><span className="mt-3 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div></aside>}
    </section>
  )
}
