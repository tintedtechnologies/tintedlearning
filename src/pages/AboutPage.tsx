import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const founderNote = [
  'Hi, I\'m Jay. I didn\'t start with a degree. I learned to code from books, free tutorials and a lot of trial and error, and I know how much harder that path is when nobody around you has taken it. Tinted Learning is the free version of what I wish I\'d had: clear explanations, practice you can run in your browser, and projects that show what you can actually do.',
  'I still believe real teachers and peers matter. This site is a starting point, and I say so on purpose. When you need someone to review your work or answer a hard question, look for an instructor, a study group or a community.',
  'I\'m building this in public, so if something is confusing or wrong, tell me. I\'d rather fix it than have you struggle through it.',
]

const isList = ['Clear explanations of the idea, in plain language', 'Practice you can run in your browser, with no setup', 'Projects that become evidence you can show someone']
const isNotList = ['A replacement for teachers, schools or a study group', 'A promise of a job, a certificate or a salary', 'A finished course. The site grows in public, and feedback shapes it']

export function AboutPage() {
  return <><SeoMetadata title="About Tinted Learning" description="Tinted Learning is a free bridge into AI understanding, browser practice, trusted resources, and portfolio evidence." /><main className="min-h-[calc(100vh-5rem)] bg-cream">

    <header className="shell max-w-4xl pb-12 pt-16 text-center sm:pt-24">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">About</p>
      <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">Technical understanding should not depend on your zip code.</h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">Tinted Learning is a free bridge into AI for people without a degree, an expensive course or a technical network.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-6">
        <Link to="/learn" className="inline-flex items-center font-bold text-teal hover:text-gold">Explore the pathway <ArrowRight size={17} className="ml-2" /></Link>
        <Link to="/playground/python" className="inline-flex items-center font-bold text-teal hover:text-gold">Try Python <ArrowRight size={17} className="ml-2" /></Link>
      </div>
    </header>

    <section className="shell max-w-3xl py-12 sm:py-16">
      <p className="text-lg leading-8 text-ink">Many curious people have no advanced computing class, no experienced instructor and no technical network nearby. A degree or an expensive course is not a realistic first step for everyone.</p>
      <p className="mt-6 text-base leading-7 text-muted">The statistics behind this, and their sources, are on the <Link to="/why-this-matters" className="font-bold text-teal hover:text-gold">Why this matters</Link> page.</p>
    </section>

    <section className="bg-mist">
      <div className="shell max-w-4xl py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">A note from the founder</p>
        <blockquote className="mt-8 space-y-6 border-l-4 border-gold pl-6 text-lg leading-8 text-ink sm:pl-10">
          {founderNote.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </blockquote>
        <p className="mt-10 pl-6 sm:pl-10">
          <span className="block font-display text-3xl font-bold text-teal">Jay</span>
          <span className="mt-1 block text-sm leading-6 text-ink">Founder, Tinted Learning, a project of <a href="https://tintedtechnologies.com" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">Tinted Technologies</a></span>
        </p>
      </div>
    </section>

    <section className="shell grid max-w-4xl gap-12 py-16 sm:grid-cols-2 sm:py-20">
      <div>
        <h2 className="font-display text-3xl font-bold text-teal">What it is</h2>
        <ul className="mt-6 space-y-4">{isList.map((item) => <li key={item} className="border-t border-line pt-4 text-base leading-7 text-ink">{item}</li>)}</ul>
      </div>
      <div>
        <h2 className="font-display text-3xl font-bold text-teal">What it is not</h2>
        <ul className="mt-6 space-y-4">{isNotList.map((item) => <li key={item} className="border-t border-line pt-4 text-base leading-7 text-muted">{item}</li>)}</ul>
      </div>
    </section>

    <section className="shell max-w-4xl border-t border-line py-14 text-center">
      <p className="text-lg leading-8 text-ink">Learn the idea, practice the skill, and build something real.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <Link to="/learn" className="inline-flex items-center font-bold text-teal hover:text-gold">Explore the pathway <ArrowRight size={17} className="ml-2" /></Link>
        <Link to="/playground/python" className="inline-flex items-center font-bold text-teal hover:text-gold">Try Python <ArrowRight size={17} className="ml-2" /></Link>
        <a href="https://www.instagram.com/tintedtechnologies" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">Instagram: @tintedtechnologies</a>
      </div>
    </section>
  </main></>
}
