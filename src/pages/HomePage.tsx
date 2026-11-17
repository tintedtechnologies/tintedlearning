import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, BrainCircuit, Code2, Compass, FlaskConical, FolderKanban, Gamepad2, Play, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const routes = [
  { icon: Compass, title: 'I am starting fresh', description: 'Learn the basic ideas, math, Python, and software habits that every tech path builds on.', to: '/learn/sections/foundations' },
  { icon: Code2, title: 'I want to become a Python developer', description: 'Practice maintainable Python, testing, APIs, algorithms, packages, and project work.', to: '/learn/sections/python' },
  { icon: BrainCircuit, title: 'I already use AI', description: 'Move from prompts to evaluation, retrieval, agents, and reliable production systems.', to: '/learn/sections/ai-engineering' },
  { icon: FlaskConical, title: 'I like math and research', description: 'Study modeling, optimization, inference, numerical methods, and reproducible experiments.', to: '/learn/sections/math' },
  { icon: Gamepad2, title: 'I want to build games', description: 'Make small 2D games in Godot, from the first moving character to a game you can share.', to: '/learn/sections/game-development' },
  { icon: UsersRound, title: 'I want to lead technical work', description: 'Build customer, communication, planning, decision-making, and influence skills for ambiguous technical work.', to: '/learn/sections/technical-leadership' },
]

const buildWords = ['a website', 'an AI app', 'a cloud service', 'a Python tool']

const journey = [
  { title: 'Learn the idea', text: 'Plain-language lessons, one idea at a time.' },
  { title: 'Practice it', text: 'Run code and try prompts right in your browser.' },
  { title: 'Build a project', text: 'Apply it to something real you can finish.' },
  { title: 'Show the proof', text: 'Leave with work you can share with anyone.' },
]

// Each homepage section fills the visible screen below the header. Snapping
// is switched on only while this page is open, so the rest of the site scrolls normally.
const fullScreen = 'home-screen flex min-h-[calc(100svh-5rem)] items-center py-14 sm:py-20'
const card = 'rounded-3xl border border-line bg-white shadow-sm'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function HomePage() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('home-snap')
    return () => root.classList.remove('home-snap')
  }, [])

  useEffect(() => {
    if (reducedMotion()) return
    const timer = window.setInterval(() => setWordIndex((index) => (index + 1) % buildWords.length), 2400)
    return () => window.clearInterval(timer)
  }, [])

  return <>
    <SeoMetadata title="Learn tech without the overwhelm" description="Free, friendly tech education, from first code to AI, with plain-language lessons, interactive practice, and portfolio projects." />

    <section className={`${fullScreen} home-hero relative overflow-hidden border-b border-line`}>
      <div className="shell relative w-full text-center">
        <p className="home-rise mx-auto inline-flex items-center gap-2 rounded-full border border-teal/15 bg-white/80 px-4 py-1.5 text-xs font-bold text-teal shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
          Free, and no login needed to start
        </p>

        <h1 className="home-rise mt-6 font-display text-5xl font-bold leading-[0.98] tracking-tight text-teal sm:text-7xl lg:text-8xl" style={{ animationDelay: '80ms' }}>
          Learn to build
          <span className="mt-3 block h-[1.25em] overflow-hidden text-4xl text-[#8a5a22] sm:text-6xl lg:text-7xl">
            <span key={wordIndex} className="home-rise inline-block">{buildWords[wordIndex]}</span>
          </span>
        </h1>

        <p className="home-rise mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl" style={{ animationDelay: '160ms' }}>
          Learn how software, cloud and AI work, practice the skills in your browser, and build proof of what you can do.
        </p>

        <div className="home-rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: '240ms' }}>
          <Link to="/learn/sections/foundations" className="button button-primary">Start with Foundations <ArrowRight size={17} className="ml-2" /></Link>
          <Link to="/learn" className="button button-secondary">Explore the curriculum</Link>
        </div>

        <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 text-left sm:grid-cols-4" aria-label="The learning journey">
          {journey.map((step, index) => (
            <li key={step.title} className={`home-rise ${card} p-4 sm:p-5`} style={{ animationDelay: `${320 + index * 120}ms` }}>
              <span className="font-display text-sm font-bold text-[#8a5a22]">0{index + 1}</span>
              <h2 className="mt-2 text-base font-bold text-teal">{step.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-2 text-xs font-bold text-teal">
          <span className="rounded-full bg-white px-3 py-2 shadow-sm">Free forever</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm">Interactive practice</span>
          <span className="rounded-full bg-white px-3 py-2 shadow-sm">Portfolio projects</span>
        </div>
      </div>
    </section>

    <section className={`${fullScreen} bg-white`}>
      <div className="shell w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Choose a route</p>
          <h2 className="section-title mt-3">Start with your goal.</h2>
          <p className="mt-4 text-lg leading-8 text-muted">Every route begins with the same foundation. Choose the direction that best describes what you want to do next.</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routes.map(({ icon: Icon, title, description, to }, index) => (
            <Link key={title} to={to} className={`group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-3xl border border-line bg-cream p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-teal/25 hover:bg-white hover:shadow-soft`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal text-white"><Icon size={20} /></span>
              <span className="mt-8">
                <h3 className="font-display text-xl font-bold text-teal">{title}</h3>
                <span className="mt-2 block text-sm leading-6 text-muted">{description}</span>
                <span className="mt-4 inline-flex items-center text-sm font-bold text-teal">View route <ArrowRight size={15} className="ml-2 transition-transform group-hover:translate-x-1" /></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <section className={`${fullScreen} border-t border-line bg-cream`}>
      <div className="shell w-full">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What you will do</p>
          <h2 className="section-title mt-3">Turn learning into evidence.</h2>
          <p className="mt-4 text-lg leading-8 text-muted">Lessons explain the idea. Playgrounds let you test it. Projects help you show that you can apply it.</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
          <div className={`${card} p-6 text-left`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-teal"><BookOpen size={20} /></span>
            <h3 className="mt-6 font-display text-xl font-bold text-teal">Learn</h3>
            <p className="mt-2 text-sm leading-6 text-ink">Plain-language lessons with technical depth.</p>
          </div>
          <div className={`${card} p-6 text-left`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-teal"><Play size={20} /></span>
            <h3 className="mt-6 font-display text-xl font-bold text-teal">Practice</h3>
            <p className="mt-2 text-sm leading-6 text-ink">Interactive exercises and browser playgrounds.</p>
          </div>
          <div className={`${card} p-6 text-left`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-teal"><FolderKanban size={20} /></span>
            <h3 className="mt-6 font-display text-xl font-bold text-teal">Build</h3>
            <p className="mt-2 text-sm leading-6 text-ink">Projects and portfolio evidence you can share.</p>
          </div>
        </div>
      </div>
    </section>
  </>
}
