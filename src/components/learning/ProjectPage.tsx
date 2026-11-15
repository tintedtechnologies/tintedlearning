import { Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../common/SeoMetadata'
import type { ProjectPlan } from '../../types/project'
import type { Lesson } from '../../types/curriculum'

interface ProjectPageProps {
  lesson: Lesson
  plan: ProjectPlan
  lessonTitles: Record<string, string>
}

const sectionClass = 'mt-12'
const headingClass = 'font-display text-3xl font-bold leading-tight text-teal'
const preClass = 'mt-5 overflow-x-auto whitespace-pre rounded-2xl bg-ink p-4 text-sm leading-6 text-white'

/** The project layout from CLAUDE.md: what you'll build, before you start, requirements, milestones, finished means, show your work, stretch goals. */
export function ProjectPage({ lesson, plan, lessonTitles }: ProjectPageProps) {
  return <><SeoMetadata title={lesson.title} description={lesson.description} /><article className="shell max-w-4xl py-12 sm:py-16">
    <div className="text-sm font-bold text-muted"><Link to="/learn" className="hover:text-teal">Learn</Link><span className="mx-2">/</span><span>Project</span></div>
    <header className="mt-10 border-b border-line pb-10">
      <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-muted"><span className="rounded-full bg-sand px-3 py-1 text-teal">{lesson.difficulty}</span><span className="inline-flex items-center"><Clock3 size={16} className="mr-2" />{plan.time}</span></div>
      <h1 className="mt-5 max-w-3xl break-words font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">{lesson.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{lesson.description}</p>
    </header>

    <section className={sectionClass}>
      <p className="eyebrow">Section 1</p>
      <h2 className={headingClass}>What you&apos;ll build</h2>
      <p className="mt-4 text-lg leading-8 text-muted">{plan.whatYouBuild}</p>
      <pre className={preClass}>{plan.diagram}</pre>
    </section>

    <section className={sectionClass}>
      <p className="eyebrow">Section 2</p>
      <h2 className={headingClass}>Before you start</h2>
      <p className="mt-4 text-muted">Work through these lessons first. Each one is linked.</p>
      <ul className="mt-4 space-y-2">{plan.lessons.map((id) => <li key={id}><Link to={`/learn/${id}`} className="font-bold text-teal underline-offset-4 hover:underline">{lessonTitles[id] ?? id}</Link></li>)}</ul>
      <p className="mt-6 font-bold text-teal">Tools</p>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-muted">{plan.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
      <p className="mt-6 text-muted"><span className="font-bold text-teal">Time: </span>{plan.time}</p>
    </section>

    <section className={sectionClass}>
      <p className="eyebrow">Section 3</p>
      <h2 className={headingClass}>Requirements</h2>
      <ul className="mt-4 space-y-2 text-muted">{plan.requirements.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true">☐</span><span>{item}</span></li>)}</ul>
    </section>

    <section className={sectionClass}>
      <p className="eyebrow">Section 4</p>
      <h2 className={headingClass}>Milestones</h2>
      <div className="mt-6 space-y-10">{plan.milestones.map((milestone, index) => <div key={milestone.title} className="rounded-3xl border border-line p-6 sm:p-8">
        <p className="eyebrow">Milestone {index + 1}</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-teal">{milestone.title}</h3>
        <p className="mt-3 text-muted">{milestone.goal}</p>
        <p className="mt-5 font-bold text-teal">Hints</p>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-muted">{milestone.hints.map((hint) => <li key={hint}>{hint}</li>)}</ul>
        {milestone.code && <>
          {milestone.code.filename && <p className="mt-5 text-sm font-bold text-muted">{milestone.code.filename}</p>}
          <pre className={preClass}>{milestone.code.code}</pre>
          {milestone.code.output && <><p className="mt-4 text-sm font-bold text-muted">Output</p><pre className={preClass}>{milestone.code.output}</pre></>}
        </>}
        <p className="mt-5 rounded-2xl bg-mist p-4 text-teal"><span className="font-bold">Checkpoint: </span>{milestone.checkpoint}</p>
      </div>)}</div>
    </section>

    <section className={sectionClass}>
      <p className="eyebrow">Section 5</p>
      <h2 className={headingClass}>Finished means</h2>
      <ul className="mt-4 space-y-2 text-muted">{plan.finishedMeans.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true">☐</span><span>{item}</span></li>)}</ul>
    </section>

    <section className={sectionClass}>
      <p className="eyebrow">Section 6</p>
      <h2 className={headingClass}>Show your work</h2>
      <p className="mt-4 text-muted">Start your README from this template. Replace each square-bracket placeholder with your own words.</p>
      <pre className={preClass}>{plan.readmeTemplate}</pre>
      <p className="mt-6 text-lg leading-8 text-muted">{plan.portfolioText}</p>
    </section>

    <section className={sectionClass}>
      <p className="eyebrow">Section 7</p>
      <h2 className={headingClass}>Stretch goals</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-muted">{plan.stretchGoals.map((goal) => <li key={goal}>{goal}</li>)}</ul>
    </section>

    <div className="mt-14 border-t border-line pt-8"><Link to="/learn" className="text-sm font-bold text-muted hover:text-teal">Back to Learn</Link></div>
  </article></>
}
