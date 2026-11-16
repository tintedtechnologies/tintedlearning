import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const founderNote = [
  'Hi, I\'m Jay. I didn\'t start with a degree. I learned to code from books, free tutorials and a lot of trial and error, and I know how much harder that path is when nobody around you has taken it. Tinted Learning is the free version of what I wish I\'d had: clear explanations, practice you can run in your browser, and projects that show what you can actually do.',
  'I still believe real teachers and peers matter. This site is a starting point, and I say so on purpose. When you need someone to review your work or answer a hard question, look for an instructor, a study group or a community.',
  'I\'m building this in public, so if something is confusing or wrong, tell me. I\'d rather fix it than have you struggle through it.',
]

const stats = [
  {
    figure: '51%',
    label: 'of U.S. high schools offered computer science in 2023-24.',
    source: 'Civil Rights Data Collection',
    href: 'https://www.ed.gov/laws-and-policy/civil-rights-laws/civil-rights-data-collection-crdc/civil-rights-data',
  },
  {
    figure: '45%',
    label: 'of U.S. high schools offered calculus in 2023-24.',
    source: 'Civil Rights Data Collection',
    href: 'https://www.ed.gov/laws-and-policy/civil-rights-laws/civil-rights-data-collection-crdc/civil-rights-data',
  },
  {
    figure: '27% vs 11%',
    label: 'of districts serving mostly White students, compared with districts serving mostly students of color, had provided AI training to teachers by fall 2023.',
    source: 'RAND',
    href: 'https://www.rand.org/pubs/commentary/2024/08/five-charts-that-tell-us-about-the-state-of-public.html',
  },
]

const actions = [
  'Plain-language lessons that explain the idea without assuming a degree or a technical network',
  'Browser practice so you do not need expensive software or a powerful laptop',
  'Portfolio projects that turn learning into evidence employers and clients can see',
]

const sources = [
  {
    text: 'U.S. Department of Education, Civil Rights Data Collection, 2023-24',
    href: 'https://www.ed.gov/laws-and-policy/civil-rights-laws/civil-rights-data-collection-crdc/civil-rights-data',
  },
  {
    text: 'RAND, "The State of Public Education in 2024 in Five Charts"',
    href: 'https://www.rand.org/pubs/commentary/2024/08/five-charts-that-tell-us-about-the-state-of-public.html',
  },
  {
    text: 'Pew Research Center, "How Teens Use and View AI," February 2026',
    href: 'https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/',
  },
]

const linkClass = 'font-bold text-teal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold'
const ctaClass = 'inline-flex items-center font-bold text-teal hover:text-gold'

export function AboutPage() {
  return <><SeoMetadata title="About Tinted Learning" description="Tinted Learning is a free way into AI for learners who have been left out of technical education, with browser practice and portfolio projects." /><main className="min-h-[calc(100vh-5rem)] bg-cream text-center">

    <header className="shell max-w-4xl pb-12 pt-16 sm:pt-24">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">A free way into AI</p>
      <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.05] tracking-[-0.025em] text-teal sm:text-6xl">Access to AI learning should not depend on who you are or where you went to school.</h1>
      <div className="mt-9 flex flex-wrap justify-center gap-6">
        <Link to="/learn" className={ctaClass}>Explore the pathway <ArrowRight size={17} className="ml-2" /></Link>
        <Link to="/playground/python" className={ctaClass}>Try Python <ArrowRight size={17} className="ml-2" /></Link>
      </div>
    </header>

    <section className="shell max-w-3xl py-12 sm:py-16">
      <p className="mx-auto max-w-3xl text-lg leading-8 text-ink">Tinted Learning is built for learners who have been left out of technical education: Black students, first-generation learners, and anyone whose school never offered a computer science class.</p>
    </section>

    <section className="bg-mist">
      <div className="shell max-w-4xl py-16 sm:py-20">
        <h2 className="font-display text-3xl font-bold text-teal sm:text-4xl">The gap is measurable.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <figure key={stat.figure} className="flex flex-col items-center rounded-3xl border border-line bg-white p-7 shadow-soft">
              <p className="font-display text-4xl font-bold leading-none text-teal">{stat.figure}</p>
              <figcaption className="mt-4 flex-1 text-base leading-7 text-ink">{stat.label}</figcaption>
              <a href={stat.href} target="_blank" rel="noreferrer" className="mt-6 text-sm font-bold text-teal underline decoration-gold decoration-2 underline-offset-4 hover:text-gold">Source: {stat.source}</a>
            </figure>
          ))}
        </div>
        <p className="mx-auto mt-12 max-w-3xl text-lg leading-8 text-ink">In high schools where Black and Latino students make up more than three-quarters of enrollment, only 32% offered calculus. That is 18 percentage points below schools with fewer of those students. <a href="https://www.advancedequity.org/briefs/a-second-look-202324crdc" target="_blank" rel="noreferrer" className={linkClass}>Read the analysis of the 2023-24 data</a>.</p>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-ink">Teachers are part of the gap too. The RAND figures above describe the districts, not individual teachers.</p>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-ink">Students are already using AI. Pew Research Center's 2026 survey found that Black teens use AI chatbots for schoolwork at higher rates than White teens. <a href="https://www.pewresearch.org/internet/2026/02/24/demographic-differences-in-how-teens-use-and-view-ai/" target="_blank" rel="noreferrer" className={linkClass}>Read the Pew report</a>.</p>
      </div>
    </section>

    <section className="shell max-w-4xl py-16 sm:py-20">
      <h2 className="font-display text-3xl font-bold text-teal sm:text-4xl">What we do about it.</h2>
      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        {actions.map((item, index) => (
          <li key={item} className="flex flex-col items-center border-t-4 border-gold pt-5">
            <p className="font-display text-2xl font-bold text-teal">0{index + 1}</p>
            <p className="mt-3 text-base leading-7 text-ink">{item}</p>
          </li>
        ))}
      </ol>
    </section>

    <section className="shell max-w-3xl pb-16">
      <h2 className="font-display text-3xl font-bold text-teal sm:text-4xl">A careful promise.</h2>
      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-ink">Free access is the starting point, not the whole answer. Real instructors, peers, and community still matter. We point you to them when it counts, and we are open about what we are still building.</p>
    </section>

    <section className="bg-mist">
      <div className="shell max-w-4xl py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal">A note from the founder</p>
        <blockquote className="mx-auto mt-8 max-w-3xl space-y-6 text-lg leading-8 text-ink">
          {founderNote.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </blockquote>
        <p className="mt-10">
          <span className="block font-display text-3xl font-bold text-teal">Jay</span>
          <span className="mt-1 block text-sm leading-6 text-ink">Founder, Tinted Learning, a project of <a href="https://tintedtechnologies.com" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">Tinted Technologies</a></span>
        </p>
      </div>
    </section>

    <section className="shell max-w-4xl py-16 sm:py-20">
      <h2 className="font-display text-3xl font-bold text-teal">Sources</h2>
      <ol className="mx-auto mt-8 max-w-3xl space-y-4 text-base leading-7 text-ink">
        {sources.map((source) => (
          <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer" className={linkClass}>{source.text}</a></li>
        ))}
      </ol>
      <p className="mt-8 text-base leading-7 text-ink">The full evidence, with what each study does and does not show, is on the <Link to="/why-this-matters" className={linkClass}>Why this matters</Link> page.</p>
    </section>

    <section className="shell max-w-4xl border-t border-line py-14 text-center">
      <p className="text-lg leading-8 text-ink">Learn the idea, practice the skill, and build something real.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
        <Link to="/learn" className={ctaClass}>Explore the pathway <ArrowRight size={17} className="ml-2" /></Link>
        <Link to="/playground/python" className={ctaClass}>Try Python <ArrowRight size={17} className="ml-2" /></Link>
        <a href="https://www.instagram.com/tintedtechnologies" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">Instagram: @tintedtechnologies</a>
      </div>
    </section>
  </main></>
}
