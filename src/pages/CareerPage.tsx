import { Check, LockKeyhole } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { careerLevels, curriculumModules, isCareerLevelComplete, lessons } from '../data/curriculum'
import { useProgress } from '../hooks/useProgress'

export function CareerPage() {
  const { careerId } = useParams()
  const level = careerLevels.find((item) => item.id === careerId)
  const progress = useProgress(lessons.length)
  if (!level) return <Navigate to="/learn" replace />
  const complete = isCareerLevelComplete(level, progress.completedLessons)
  const modules = level.requiredModuleIds.map((id) => curriculumModules.find((module) => module.id === id)).filter(Boolean)
  const projectLessons = level.requiredProjectLessonIds?.map((id) => lessons.find((lesson) => lesson.id === id)).filter(Boolean) ?? []

  return <div>
      <section className={`border-b border-line ${level.tone === 'teal' ? 'bg-mist' : level.tone === 'gold' ? 'bg-sand' : 'bg-teal text-white'}`}>
        <div className="shell py-16 sm:py-20">
          <Link to="/learn" className={`text-xs font-bold uppercase tracking-[0.2em] ${level.tone === 'neutral' ? 'text-gold' : 'text-teal'}`}>Back to pathway</Link>
          <p className={`mt-8 text-xs font-bold uppercase tracking-[0.2em] ${level.tone === 'neutral' ? 'text-gold' : 'text-muted'}`}>Career milestone</p>
          <h1 className={`font-display text-5xl font-bold leading-tight sm:text-6xl ${level.tone === 'neutral' ? 'text-white' : 'text-teal'}`}>{level.title}</h1>
          <p className={`mt-6 max-w-2xl text-lg leading-8 ${level.tone === 'neutral' ? 'text-white/75' : 'text-muted'}`}>{level.description}</p>
        </div>
      </section>
      <main className="shell max-w-5xl py-12 sm:py-16">
        <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
          <p className="eyebrow">Unlock condition</p>
          <p className="mt-3 max-w-3xl text-base leading-8 text-muted">{level.unlockText} A milestone means you can show evidence of the work, not only mark lessons complete.</p>
        </section>
        <section className="mt-8 rounded-3xl border border-line bg-mist p-6 sm:p-8">
          <p className="eyebrow">Required learning</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-teal">Modules to understand</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {modules.map((module) => <div key={module?.id} className="rounded-2xl bg-white p-4"><p className="font-bold text-teal">{module?.title}</p><p className="mt-1 text-sm leading-6 text-muted">{module?.description}</p></div>)}
          </div>
          {level.providerModuleIds && <p className="mt-5 text-sm leading-6 text-muted">Choose one provider track: Azure, AWS, or GCP. Compare the other providers, but demonstrate one deeply.</p>}
        </section>
        {projectLessons.length > 0 && <section className="mt-8 rounded-3xl border border-line bg-white p-6 sm:p-8"><p className="eyebrow">Required project evidence</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">Build and prove it</h2><div className="mt-5 space-y-3">{projectLessons.map((project) => <Link key={project?.id} to={`/learn/${project?.id}`} className="flex items-center justify-between gap-4 rounded-2xl border border-line p-4 hover:border-teal/30 hover:bg-mist"><span><span className="block font-bold text-teal">{project?.title}</span><span className="mt-1 block text-sm text-muted">{progress.isLessonComplete(project!.id) ? 'Completed' : 'Open project guide'}</span></span>{progress.isLessonComplete(project!.id) ? <Check className="text-teal" size={18} /> : <span className="text-xs font-bold text-gold">View</span>}</Link>)}</div></section>}
        <section className="mt-8 rounded-3xl border border-line bg-sand p-6 sm:p-8"><p className="eyebrow">Portfolio evidence</p><h2 className="mt-2 font-display text-3xl font-bold text-teal">What you should be able to show</h2><ul className="mt-5 space-y-3 text-sm leading-7 text-ink">{level.portfolioArtifacts.map((artifact) => <li key={artifact}>• {artifact}</li>)}</ul><Link to="/portfolio" className="button button-primary mt-6">Open portfolio studio</Link></section>
        <div className="mt-10 flex flex-wrap gap-3"><Link to="/learn" className="button button-primary">Return to pathway</Link>{!complete && <Link to={`/learn?stage=${level.id === 'ai-developer' ? 'software-engineering' : level.id === 'ai-engineer' ? 'ai-engineering' : level.id === 'ai-architect' ? 'ai-architecture' : 'foundation'}`} className="button button-secondary">Continue learning</Link>}</div>
      </main>
    </div>
}