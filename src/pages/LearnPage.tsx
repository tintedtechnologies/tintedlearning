import { ArrowRight, BookOpen, CheckCircle2, FolderKanban } from 'lucide-react'
import { SignInButton, useAuth } from '@clerk/react'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'
import { lessons } from '../data/curriculum'
import { curriculumLessonTotal, getSectionIdForLegacyStage, getSectionIdForModule, getSectionLessonIds, getSectionModules, isSectionLive, learningSections } from '../data/learningSections'
import { useProgress } from '../hooks/useProgress'

const sectionGroups = [
  { title: 'Start here', ids: ['foundations', 'math', 'python'] },
  { title: 'Build skills', ids: ['software-engineering', 'ai-engineering', 'cloud-engineering', 'security'] },
  { title: 'Grow', ids: ['research', 'technical-leadership'] },
  { title: 'Prove it', ids: ['projects'] },
] as const

export function LearnPage() {
  const { isSignedIn } = useAuth()
  const progress = useProgress(curriculumLessonTotal)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const nextLesson = lessons.find((lesson) => !progress.isLessonComplete(lesson.id))
  const hasProgress = progress.completedLessons.length > 0

  useEffect(() => {
    const stageId = searchParams.get('stage')
    const pathway = searchParams.get('pathway')
    if (pathway === 'ai-mathematics') {
      navigate('/learn/sections/math', { replace: true })
      return
    }
    if (!stageId) return
    const legacySectionId = getSectionIdForLegacyStage(stageId)
    if (!legacySectionId) return
    const hash = location.hash.replace(/^#/, '')
    const moduleSectionId = hash ? getSectionIdForModule(hash) : undefined
    const sectionId = moduleSectionId ?? legacySectionId
    const sectionHasModule = getSectionModules(sectionId).some(({ module }) => module.id === hash)
    navigate(`/learn/sections/${sectionId}${sectionHasModule ? `#${hash}` : ''}`, { replace: true })
  }, [location.hash, navigate, searchParams])

  const renderSectionCard = (sectionId: string) => {
    const section = learningSections.find((item) => item.id === sectionId)
    if (!section) return null
    const sectionLessonIds = getSectionLessonIds(section)
    const completed = sectionLessonIds.filter((lessonId) => progress.completedLessons.includes(lessonId)).length
    const totalMinutes = getSectionModules(section.id).reduce((total, { lessons: moduleLessons }) => total + moduleLessons.reduce((minutes, lesson) => minutes + lesson.duration, 0), 0)
    const estimatedHours = Math.max(1, Math.ceil(totalMinutes / 60))
    if (!isSectionLive(section.id)) return <div key={section.id} aria-disabled="true" className="flex min-h-52 flex-col rounded-3xl border border-dashed border-line bg-cream/60 p-6 opacity-70">
      <span className="flex items-start justify-between gap-3"><span className="font-display text-2xl font-bold text-muted">{section.title}</span><span className="shrink-0 rounded-full bg-sand px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">Coming soon</span></span>
      <span className="mt-3 flex-1 text-sm leading-6 text-muted">{section.description}</span>
      <span className="mt-5 text-xs font-bold text-muted">We are rewriting this section. It will open when every lesson is ready.</span>
    </div>
    return <Link key={section.id} to={`/learn/sections/${section.id}`} className="group flex min-h-52 flex-col rounded-3xl border border-line bg-white p-6 shadow-soft transition-colors hover:border-teal/30 hover:bg-mist">
      <span className="flex items-start justify-between gap-3"><span className="font-display text-2xl font-bold text-teal">{section.title}</span><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mist text-teal group-hover:bg-white"><BookOpen size={17} /></span></span>
      <span className="mt-3 flex-1 text-sm leading-6 text-muted">{section.description}</span>
      <span className="mt-5 flex items-center justify-between gap-3 text-xs font-bold text-teal"><>{completed}/{sectionLessonIds.length} lessons · About {estimatedHours} hour{estimatedHours === 1 ? '' : 's'}</><span className="inline-flex items-center gap-1">{completed === sectionLessonIds.length && sectionLessonIds.length > 0 ? <><CheckCircle2 size={15} />Complete</> : 'Explore'}<ArrowRight size={15} /></span></span>
    </Link>
  }

  const portfolioCard = <article className="flex min-h-52 flex-col justify-between rounded-3xl border border-teal/15 bg-mist p-6">
    <div><span className="flex items-start justify-between gap-3"><span className="font-display text-2xl font-bold text-teal">Your Portfolio</span><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-teal"><FolderKanban size={17} /></span></span><p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-teal">Your portfolio</p><h3 className="mt-2 font-display text-2xl font-bold text-teal">Keep the proof of what you’ve built.</h3><p className="mt-3 text-sm leading-6 text-ink">Save project work, evaluation reports, and notes from your lessons in one place you can share with employers or clients.</p></div>
    <div className="mt-5 flex flex-wrap gap-3">{isSignedIn ? <Link to="/portfolio" className="button button-primary">Open your portfolio<ArrowRight size={16} className="ml-2" /></Link> : <SignInButton mode="modal"><button type="button" className="button button-primary">Sign in to start your portfolio<ArrowRight size={16} className="ml-2" /></button></SignInButton>}<Link to="/portfolio/example" className="button button-secondary">See an example</Link></div>
  </article>

  return <div>
    <SeoMetadata title="Learn" description="Explore independent sections in AI, math, Python, research, software engineering, AI engineering, cloud, security, and certifications." />
    <section className="shell py-12 sm:py-16">
      <p className="eyebrow">Learn by section</p>
      <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="section-title">Choose what you want to learn.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Each section stands on its own. New to AI? Start with Foundations, or jump straight to what you need.</p>
        </div>
        {nextLesson && <div className="max-w-sm"><p className="eyebrow">{hasProgress ? 'Continue learning' : 'New here?'}</p><Link to={`/learn/${nextLesson.id}`} className="mt-2 inline-flex items-start gap-2 font-bold leading-6 text-teal hover:text-gold"><span>{hasProgress ? nextLesson.title : 'Start Learning'}</span><ArrowRight size={17} className="mt-1 shrink-0" /></Link>{!hasProgress && <span className="mt-1 block text-xs text-muted">Begin with a five-minute introduction to AI.</span>}</div>}
      </div>
    </section>

    <section className="shell pb-20" aria-label="Learning sections">
      <div className="space-y-10">
        {sectionGroups.map((group) => <section key={group.title} aria-labelledby={`group-${group.title.toLowerCase().replaceAll(' ', '-')}`}>
          <div className="flex items-end justify-between gap-4 border-b border-line pb-3"><h2 id={`group-${group.title.toLowerCase().replaceAll(' ', '-')}`} className="font-display text-2xl font-bold text-teal">{group.title}</h2><span className="text-xs font-bold uppercase tracking-widest text-muted">{group.ids.length} {group.ids.length === 1 ? 'section' : 'sections'}</span></div>
          <div className={`mt-4 grid gap-4 ${group.title === 'Start here' ? 'sm:grid-cols-2 lg:grid-cols-3' : group.title === 'Prove it' ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>{group.ids.map(renderSectionCard)}{group.title === 'Prove it' && portfolioCard}</div>
        </section>)}
      </div>
      <Link to="/learn/sections/certifications" className="mt-8 flex flex-col rounded-3xl border border-line bg-white p-6 shadow-soft transition-colors hover:border-teal sm:flex-row sm:items-center sm:justify-between"><span><span className="block font-display text-2xl font-bold text-teal">Certifications</span><span className="mt-2 block max-w-2xl text-sm leading-6 text-muted">Looking for certifications? Browse the certifications catalog: real credentials from recognized organizations, free options first, with a guide to preparing for each one.</span></span><span className="mt-4 text-sm font-bold text-teal sm:mt-0">Open the catalog</span></Link>
    </section>
  </div>
}
