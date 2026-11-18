import { ChevronDown, ExternalLink, RotateCcw } from 'lucide-react'
import { ConceptScene } from './ConceptScene'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { GuidedProject } from '../../types/curriculum'
import type { CodeExample, QuizQuestion, StructuredLesson } from '../../types/lesson'
import { ProjectGuide } from './ProjectGuide'
import { Prose } from './Prose'

export { Prose } from './Prose'

function CodeBlock({ example }: { example: CodeExample }) {
  const label = example.filename ?? (example.language === 'python' ? 'Python' : example.language === 'bash' ? 'Terminal' : 'Example')
  return <div className="not-prose my-5 overflow-hidden rounded-2xl border border-teal/15">
    <div className={`bg-mist px-4 py-2 text-[11px] font-bold tracking-widest text-muted ${example.filename ? 'font-mono normal-case tracking-normal text-xs' : 'uppercase'}`}>{label}</div>
    <pre className="overflow-x-auto bg-[#173b38] p-4 text-sm leading-7 text-white"><code>{example.code}</code></pre>
    {example.output !== undefined && <><div className="border-t border-line bg-cream px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted">Output</div><pre className="overflow-x-auto bg-cream px-4 pb-4 text-sm leading-7 text-ink"><code>{example.output}</code></pre></>}
  </div>
}

interface QuizProps {
  quiz: QuizQuestion[]
  answers: Record<number, string>
  onAnswer: (index: number, choice: string) => void
  onRetry: () => void
}

function Quiz({ quiz, answers, onAnswer, onRetry }: QuizProps) {
  const [index, setIndex] = useState(0)
  const question = quiz[index]
  const chosen = answers[index]
  const correctText = question.options[question.answer].text
  const retry = () => { setIndex(0); onRetry() }
  return <section className="not-prose my-12 rounded-3xl bg-teal p-6 text-white sm:p-8" aria-labelledby="check-heading">
    <div className="flex flex-wrap items-start justify-between gap-3"><h2 id="check-heading" className="font-display text-3xl font-bold">Check your understanding</h2><span className="shrink-0 rounded-full bg-white/10 px-3 py-2 text-xs font-bold">Question {index + 1} of {quiz.length}</span></div>
    <div className="mt-6">
      <p className="font-bold leading-7"><Prose text={question.question} /></p>
      {question.code && <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#102f2e] p-4 text-sm leading-7 text-white"><code>{question.code.code}</code></pre>}
      <div className="mt-4 grid gap-3">{question.options.map((option) => {
        const isChosen = chosen === option.text
        const isCorrect = option.text === correctText
        const tone = !chosen ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : isCorrect ? 'border-gold bg-gold text-teal' : isChosen ? 'border-red-300 bg-red-100 text-red-900' : 'border-white/10 bg-white/5 text-white/70'
        return <div key={option.text}>
          <button type="button" disabled={Boolean(chosen)} onClick={() => onAnswer(index, option.text)} className={`w-full rounded-2xl border px-4 py-4 text-left text-sm font-bold transition-colors disabled:cursor-default ${tone}`}><Prose text={option.text} /></button>
          {chosen && <p className={`mt-1 px-2 text-sm leading-6 ${isCorrect ? 'text-gold' : isChosen ? 'text-red-200' : 'text-white/60'}`}>{isCorrect ? 'Correct. ' : isChosen ? 'Not quite. ' : ''}<Prose text={option.explanation} /></p>}
        </div>
      })}</div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setIndex((value) => Math.max(value - 1, 0))} disabled={index === 0} className="button border border-white/25 text-white disabled:cursor-not-allowed disabled:opacity-40">Previous question</button>
        <div className="flex gap-3">{chosen && index < quiz.length - 1 && <button type="button" onClick={() => setIndex((value) => Math.min(value + 1, quiz.length - 1))} className="button bg-gold text-teal">Next question</button>}<button type="button" onClick={retry} className="inline-flex items-center text-sm font-bold text-white/80 hover:text-white"><RotateCcw size={15} className="mr-2" />Retry quiz</button></div>
      </div>
    </div>
  </section>
}

interface StructuredLessonBodyProps {
  lessonId: string
  lesson: StructuredLesson
  answers: Record<number, string>
  onAnswer: (index: number, choice: string) => void
  onRetry: () => void
  evidenceNote: string
  onEvidenceChange: (value: string) => void
  onEvidenceSave: () => void
  project?: GuidedProject
}

const playgroundLabels: Record<NonNullable<NonNullable<StructuredLesson['tryIt']>['playground']>, string> = {
  python: 'Open this code in the Python playground',
  tokens: 'Open the Tokens playground',
  context: 'Open the Context windows playground',
  temperature: 'Open the Temperature playground',
  'prompt-builder': 'Open the Prompt builder',
  agents: 'Open the AI agents playground',
  embeddings: 'Open the Embeddings playground',
}

export function StructuredLessonBody({ lessonId, lesson, answers, onAnswer, onRetry, evidenceNote, onEvidenceChange, onEvidenceSave, project }: StructuredLessonBodyProps) {
  const [deeperOpen, setDeeperOpen] = useState(false)
  const { tryIt, underTheHood, resources } = lesson
  const playgroundLink = tryIt?.playground === 'python' ? `/playground/python?lesson=${lessonId}` : tryIt?.playground ? `/playground/${tryIt.playground}` : undefined

  return <>
    <section className="lesson-copy py-10">
      {lesson.assumes && <p className="not-prose !mt-0 mb-8 rounded-2xl border border-line bg-mist p-4 text-sm leading-6 text-ink"><strong className="text-teal">Before you start: </strong><Prose text={lesson.assumes} /></p>}
      <h2 className={lesson.assumes ? undefined : '!mt-0'}>What you'll learn</h2>
      <ul>{lesson.goals.map((goal) => <li key={goal}><Prose text={goal} /></li>)}</ul>

      <h2>The big idea</h2>
      <p><Prose text={lesson.bigIdea} /></p>

      <h2>Why it matters</h2>
      <p><Prose text={lesson.whyItMatters} /></p>

      {lesson.goalSections.map((section) => <div key={section.heading}>
        <h2>{section.heading}</h2>
        {section.paragraphs.map((paragraph) => <p key={paragraph}><Prose text={paragraph} /></p>)}
        {section.visual && <ConceptScene visual={section.visual} />}
        {section.figures?.map((figure) => <figure key={figure.src} className="my-6 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <img src={figure.src} alt={figure.alt} loading="lazy" className="block h-auto w-full" />
          <figcaption className="border-t border-line px-4 py-3 text-sm leading-6 text-muted">{figure.caption}<span className="mt-2 block text-xs text-muted/80">Image: <a href={figure.credit.url} target="_blank" rel="noreferrer" className="underline hover:text-teal">{figure.credit.text}</a></span></figcaption>
        </figure>)}
        <CodeBlock example={section.example} />
      </div>)}

      <h2>See it in action</h2>
      <p className="font-bold text-teal">{lesson.seeItInAction.title}</p>
      <p><Prose text={lesson.seeItInAction.intro} /></p>
      <CodeBlock example={lesson.seeItInAction.example} />
      <ol className="not-prose my-6 space-y-4">{lesson.seeItInAction.steps.map((step, index) => <li key={index} className="rounded-2xl border border-line bg-white p-4">
        <pre className="overflow-x-auto rounded-xl bg-mist px-3 py-2 text-sm leading-6 text-teal"><code>{step.code}</code></pre>
        <p className="mt-3 text-base leading-7 text-muted"><Prose text={step.explanation} /></p>
      </li>)}</ol>

      {tryIt && <>
        <h2>Try it yourself</h2>
        <ol className="not-prose my-5 list-decimal space-y-2 pl-6 text-base leading-7 text-ink">{tryIt.instructions.map((instruction) => <li key={instruction}><Prose text={instruction} /></li>)}</ol>
        {tryIt.files?.map((file, index) => <CodeBlock key={file.filename ?? index} example={file} />)}
        {playgroundLink && <Link to={playgroundLink} className="button button-primary not-prose">{playgroundLabels[tryIt.playground ?? 'python']}<ExternalLink size={16} className="ml-2" /></Link>}
        {tryIt.evidencePrompt && <label className="not-prose mt-6 block">
          <span className="text-sm font-bold text-teal">{tryIt.evidencePrompt.label}</span>
          <textarea value={evidenceNote} onChange={(event) => onEvidenceChange(event.target.value)} onBlur={onEvidenceSave} rows={5} placeholder={tryIt.evidencePrompt.placeholder} className="mt-2 w-full rounded-2xl border border-line bg-white p-4 text-sm leading-6 text-ink outline-none focus:border-teal" />
          <span className="mt-2 block text-xs text-muted">Your answer is saved when you leave the box.</span>
        </label>}
        {(tryIt.project ?? project) && <div className="not-prose mt-8"><ProjectGuide project={(tryIt.project ?? project)!} nested /></div>}
      </>}

      <h2>Common mistakes</h2>
      <div className="not-prose my-5 grid gap-3">{lesson.mistakes.map((item) => <div key={item.mistake} className="rounded-2xl border border-gold/30 bg-sand p-5">
        <p className="font-bold leading-7 text-teal"><Prose text={item.mistake} /></p>
        <p className="mt-2 text-sm leading-6 text-ink"><span className="font-bold">How to avoid it: </span><Prose text={item.fix} /></p>
      </div>)}</div>
    </section>

    <Quiz key={lessonId} quiz={lesson.quiz} answers={answers} onAnswer={onAnswer} onRetry={onRetry} />

    <section className="mx-auto max-w-3xl rounded-3xl bg-sand p-6 sm:p-8" aria-labelledby="takeaway-heading">
      <h2 id="takeaway-heading" className="font-display text-2xl font-bold text-teal">Key takeaway</h2>
      <p className="mt-3 text-lg leading-8 text-ink"><Prose text={lesson.takeaway} /></p>
    </section>

    {(resources?.length || underTheHood) && <section className="mx-auto my-12 max-w-3xl" aria-labelledby="deeper-heading">
      <h2 id="deeper-heading" className="font-display text-3xl font-bold text-teal">Go deeper (optional)</h2>
      <p className="mt-3 text-base leading-7 text-muted">You do not need these to continue. They are here if you want more.</p>
      {underTheHood && <div className="mt-6 rounded-2xl border border-line bg-white">
        <button type="button" aria-expanded={deeperOpen} onClick={() => setDeeperOpen((open) => !open)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><span><span className="block text-xs font-bold uppercase tracking-[0.18em] text-muted">Under the hood</span><span className="mt-1 block font-display text-xl font-bold text-teal">{underTheHood.heading}</span></span><ChevronDown className={`shrink-0 text-teal transition-transform ${deeperOpen ? 'rotate-180' : ''}`} /></button>
        {deeperOpen && <div className="border-t border-line px-5 pb-5 pt-4 text-base leading-7 text-muted">{underTheHood.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 first:mt-0"><Prose text={paragraph} /></p>)}</div>}
      </div>}
      {resources?.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-line bg-white p-4 hover:border-teal/30 hover:bg-mist"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={15} className="shrink-0 text-teal" /></span><span className="mt-2 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div> : null}
    </section>}
  </>
}
