import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'

const promises = ['Plain-language lessons and visual explanations', 'Browser practice with Python, algorithms, and AI workflows', 'Projects and portfolio evidence for your next opportunity']

export function AboutPage() {
  return <><SeoMetadata title="About Tinted Learning" description="Tinted Learning is a free bridge into AI understanding, browser practice, trusted resources, and portfolio evidence." /><main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-cream">
    <div className="bg-teal px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <img src="/tintedlearninglogo.png" alt="Tinted Learning" className="h-40 w-40 rounded-[2.5rem] object-contain shadow-soft sm:h-56 sm:w-56" />
        <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-gold">A free way into AI</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-7xl">A stepping stone into the world of AI.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Tinted Learning helps people build real AI understanding without needing a college degree, an expensive course, or a technical network.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/learn" className="button button-primary">Explore the pathway <ArrowRight size={17} className="ml-2" /></Link>
          <Link to="/playground/python" className="button button-secondary">Try Python <ArrowRight size={17} className="ml-2" /></Link>
        </div>
        <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-3">{promises.map((promise) => <div key={promise} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85"><CheckCircle2 className="mb-3 text-gold" size={19} />{promise}</div>)}</div>
      </div>
    </div>

    <div className="bg-white px-5 py-14 text-ink sm:px-8 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Why this exists</p>
        <h2 className="mt-3 font-display text-4xl font-bold leading-tight text-teal sm:text-5xl">Technical understanding should not depend on your zip code.</h2>
        <p className="mt-5 text-lg leading-8 text-muted">Many curious people have no advanced computing class, no experienced instructor, and no technical network nearby, and a degree or an expensive course is not a realistic first step for everyone.</p>
        <p className="mt-5 text-lg leading-8 text-muted">Tinted Learning is a free bridge from curiosity to evidence. It does not replace teachers, schools or hands-on experience.</p>
        <p className="mt-5 text-base leading-7 text-muted">The statistics behind this, and their sources, are on the <Link to="/why-this-matters" className="font-bold text-teal hover:text-gold">Why this matters</Link> page.</p>

        <section className="mt-12 rounded-3xl border border-line bg-cream p-6 sm:p-8">
          <p className="eyebrow">Who runs Tinted Learning</p>
          <p className="mt-3 text-base leading-7 text-muted">Tinted Learning is a project of Tinted Technologies LLC, <a href="https://tintedtechnologies.com" target="_blank" rel="noreferrer" className="font-bold text-teal hover:text-gold">tintedtechnologies.com</a>.</p>
        </section>

        <aside className="mt-8 rounded-3xl bg-teal p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">A careful promise</p>
          <p className="mt-3 text-base leading-7 text-white/85">Free access is the starting point, not the whole answer. Learn the idea, practice it, build something real, and know where real instructors, peers and experience still matter.</p>
        </aside>

        <div className="mt-12 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal">Follow Tinted Technologies</p>
          <a href="https://www.instagram.com/tintedtechnologies" target="_blank" rel="noreferrer" className="mt-3 inline-flex font-bold text-teal hover:text-gold">Instagram: @tintedtechnologies</a>
        </div>
      </div>
    </div>
  </main></>
}
