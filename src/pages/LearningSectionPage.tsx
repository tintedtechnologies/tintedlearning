import { ArrowLeft, ArrowUpRight, Check, Circle, ExternalLink } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'
import { certifications } from '../data/certifications'
import { curriculumStages, lessons } from '../data/curriculum'
import { lessonContent } from '../data/lessonContent'
import { projectPlans } from '../data/projects'
import { curriculumLessonTotal, getSectionModules, learningSectionById } from '../data/learningSections'
import { useProgress } from '../hooks/useProgress'

/** Shows a total in whole hours, rounded up to at least one hour, for example "About 3 hours total". */
function formatHoursTotal(minutes: number) {
  const hours = Math.max(1, Math.round(minutes / 60))
  return `About ${hours} hour${hours === 1 ? '' : 's'} total`
}

export function LearningSectionPage() {
  const { sectionId } = useParams()
  const section = sectionId ? learningSectionById.get(sectionId) : undefined
  const progress = useProgress(curriculumLessonTotal)

  if (!section) return <Navigate to="/learn" replace />

  const sectionModules = getSectionModules(section.id)
  const sectionLessonIds = sectionModules.flatMap(({ lessons: moduleLessons }) => moduleLessons.map((lesson) => lesson.id))
  const completedLessons = sectionLessonIds.filter((lessonId) => progress.completedLessons.includes(lessonId)).length
  const sectionAssessments = (section.assessmentStageIds ?? [])
    .map((stageId) => curriculumStages.find((stage) => stage.id === stageId))
    .filter((stage) => stage?.assessment)
  const relatedCertificationCount = certifications.filter((certification) => certification.prepare.links.some((link) => link.to === `/learn/sections/${section.id}`)).length

  return <main className="shell max-w-7xl py-10 sm:py-16">
    <SeoMetadata title={section.title} description={section.description} />
    <Link to="/learn" className="inline-flex items-center text-sm font-bold text-muted hover:text-teal"><ArrowLeft size={16} className="mr-2" />All learning sections</Link>
    <header className="mt-8 border-b border-line pb-8">
      <p className="eyebrow">{section.kind === 'reference' ? 'Reference catalog' : 'Independent learning section'}</p>
      <h1 className="mt-3 section-title">{section.title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{section.description}</p>
      {section.kind === 'learning' && <p className="mt-4 text-sm font-bold text-teal">{completedLessons} of {sectionLessonIds.length} lessons complete</p>}
    </header>

    <>
      <section className="mt-8 space-y-5">
        {sectionModules.map(({ module, lessons: moduleLessons }) => {
          const reference = section.modules.find((item) => item.moduleId === module.id)
          const moduleTitle = reference?.title ?? module.title
          const moduleDescription = reference?.description ?? module.description
          return <article key={`${module.id}-${moduleLessons[0]?.id ?? 'empty'}`} id={module.id} className="scroll-mt-8 rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div><h2 className="font-display text-2xl font-bold text-teal">{moduleTitle}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{moduleDescription}</p></div>
            {moduleLessons.length > 0 && <div className="shrink-0 text-right text-xs font-bold text-muted"><span className="block">{moduleLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length}/{moduleLessons.length} complete</span><span className="mt-1 block font-medium">{formatHoursTotal(moduleLessons.reduce((total, lesson) => total + lesson.duration, 0))}</span></div>}
          </div>
          {moduleLessons.length > 0 && <ul className="mt-4 divide-y divide-line border-t border-line">
            {moduleLessons.map((lesson) => {
              const complete = progress.completedLessons.includes(lesson.id)
              const content = lessonContent[lesson.id]
              const project = projectPlans[lesson.id]
              return <li key={lesson.id} className="flex items-start gap-3 py-4">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${complete ? 'bg-teal text-white' : 'bg-mist text-teal'}`}>{complete ? <Check size={15} /> : <Circle size={15} />}</span>
                <div className="min-w-0 flex-1"><Link to={`/learn/${lesson.id}`} className="block"><span className="block font-bold text-ink hover:text-teal">{lesson.title}</span><span className="mt-1 block text-xs text-muted">{project ? project.time : `${lesson.duration} min · ${lesson.difficulty}`}</span><span className="mt-2 block max-w-3xl text-sm leading-6 text-muted">{project ? `${project.whatYouBuild.split('. ')[0]}.` : lesson.description}</span></Link>{!project && content?.learningPoints?.length ? <ul className="mt-2 hidden list-disc space-y-1 pl-4 text-xs leading-5 text-muted sm:block">{content.learningPoints.slice(0, 2).map((point) => <li key={point}>{point}</li>)}</ul> : null}</div>
                <button type="button" onClick={() => progress.setLessonComplete(lesson.id, !complete)} aria-label={`${complete ? 'Mark' : 'Mark'} ${lesson.title} ${complete ? 'incomplete' : 'complete'}`} className="mt-1 shrink-0 text-muted hover:text-teal">{complete ? <Check size={17} /> : <Circle size={17} />}</button>
              </li>
            })}
          </ul>}
          {module.prerequisites.length > 0 && section.id !== 'projects' && <p className="mt-4 text-xs leading-5 text-muted"><span className="font-bold text-teal">Helpful context:</span> {module.prerequisites.join(' · ')}</p>}
          {section.id === 'foundations' && module.id === 'computing-math' && <p className="mt-4 rounded-xl bg-mist/70 px-4 py-3 text-sm leading-6 text-muted">This is the programming and data orientation. Continue with the <Link to="/learn/sections/python" className="font-bold text-teal hover:text-gold">Python section</Link> for hands-on coding, syntax, testing, and project work.</p>}
        </article>
        })}
      </section>

      {section.crossReferenceLessonIds?.length ? <section className="mt-10 rounded-3xl border border-gold/30 bg-sand/50 p-5 sm:p-7">
        <p className="eyebrow">Related provider lessons</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-teal">Cloud-specific security</h2>
        <p className="mt-2 text-sm leading-6 text-muted">These lessons remain part of their provider paths and are linked here for reference; they are not duplicated in this section.</p>
        <div className="mt-4 flex flex-wrap gap-2">{section.crossReferenceLessonIds.map((lessonId) => {
          const lesson = lessons.find((item) => item.id === lessonId)
          return lesson ? <Link key={lessonId} to={`/learn/${lessonId}`} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-teal hover:bg-mist">{lesson.title}<ArrowUpRight size={14} className="ml-1 inline" /></Link> : null
        })}</div>
      </section> : null}

      {sectionAssessments.length > 0 && <section className="mt-10 rounded-3xl border border-teal/15 bg-mist/60 p-5 sm:p-7">
        <p className="eyebrow">Check what you know</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">{sectionAssessments.map((stage) => stage && <Link key={stage.id} to={`/learn/stage/${stage.id}/test`} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 font-bold text-teal hover:bg-cream"><span>{stage.assessment?.title}</span><ArrowUpRight size={17} /></Link>)}</div>
        <p className="mt-3 text-xs leading-5 text-muted">Set aside about 10 minutes to check your understanding.</p>
      </section>}

      {section.id !== 'security' && <p className="mt-8 text-sm leading-6 text-muted">Interested in security? <Link to="/learn/sections/security" className="font-bold text-teal hover:text-gold">Explore the Security section</Link>.</p>}
      {relatedCertificationCount > 0 && <p className="mt-8 text-sm leading-6 text-muted">Credentials that build on this section are optional. <Link to="/learn/sections/certifications" className="font-bold text-teal hover:text-gold">Browse certifications</Link>.</p>}
    </>
  </main>
}
