import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

const promises = ['Plain-language lessons and visual explanations', 'Browser practice with Python, algorithms, and AI workflows', 'Projects and portfolio evidence for your next opportunity']

export function AboutPage() {
  return <main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-cream">
    <div className="bg-teal px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
      <img src="/tintedlearninglogo.png" alt="Tinted Learning" className="h-48 w-48 rounded-[2.5rem] object-contain shadow-soft sm:h-64 sm:w-64" />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-gold">A free way into AI</p>
      <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-7xl">A stepping stone into the world of AI.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Tinted Learning helps people build real AI understanding without needing a college degree, an expensive course, or a technical network.</p>
      <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-3">{promises.map((promise) => <div key={promise} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85"><CheckCircle2 className="mb-3 text-gold" size={19} />{promise}</div>)}</div>
      </div>
    </div>
    <div className="bg-white px-5 py-14 text-ink sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl"><p className="eyebrow">Why this exists</p><h2 className="mt-3 font-display text-4xl font-bold leading-tight text-teal sm:text-5xl">Technical understanding should not depend on your zip code.</h2><p className="mt-5 text-lg leading-8 text-muted">A student may be curious about AI but have no advanced computer-science class, experienced instructor, reliable device, broadband connection, or technical network nearby. Public schools and communities do not all have the same access to current computing education, and a university degree or expensive course is not a realistic first step for everyone.</p><p className="mt-5 text-lg leading-8 text-muted">Tinted Learning is a free bridge: plain-language explanations, college-level ideas, browser practice, trusted resources, and portfolio projects that help a learner move from curiosity to evidence without pretending that one website replaces teachers, schools, or hands-on experience.</p></div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-line bg-cream p-6 sm:p-8"><p className="eyebrow">What the evidence says</p><h3 className="mt-3 font-display text-2xl font-bold text-teal">The opportunity is uneven, and the gap is measurable.</h3><p className="mt-4 text-base leading-7 text-muted">The OECD's current PISA 2025 results assessed more than 760,000 15-year-olds across 91 countries and economies. The assessment introduced computational problem-solving, including modelling, programming tools, experiments, and digital-product design. The report found the highest mean scores in Macao (China), Singapore, and the Beijing-Shanghai-Jiangsu-Zhejiang region, while also showing that access to school-based AI literacy opportunities is more common among socio-economically advantaged students.</p><p className="mt-4 text-base leading-7 text-muted">UNESCO's Global Education Monitoring Report reaches a complementary conclusion: technology can support access, equity, inclusion, and quality, but only when systems also provide access, governance, and teacher preparation. The answer is not technology alone; it is trustworthy learning support around the technology.</p><div className="mt-6 flex flex-wrap gap-3"><a href="https://www.oecd.org/en/publications/pisa-2025-results-volume-i_73451bc5-en.html" target="_blank" rel="noreferrer" className="button button-primary">Read OECD PISA 2025 <ExternalLink size={16} className="ml-2" /></a><a href="https://www.oecd.org/en/data/dashboards/pisa-education-and-skills.html" target="_blank" rel="noreferrer" className="button button-secondary">Compare country data <ExternalLink size={16} className="ml-2" /></a></div></section>
          <aside className="rounded-3xl border border-teal/15 bg-teal p-6 text-white sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">A careful promise</p><h3 className="mt-3 font-display text-2xl font-bold">Free access is the starting point, not the whole answer.</h3><ul className="mt-5 space-y-3 text-sm leading-7 text-white/80"><li>• Learn the core idea in plain language.</li><li>• Practice with code, math, and interactive visuals.</li><li>• Follow authoritative resources for deeper study.</li><li>• Build projects that make understanding visible.</li><li>• Know where real instructors, peers, and experience still matter.</li></ul></aside>
        </div>

        <div className="mt-12 text-center"><p className="mx-auto max-w-2xl text-base leading-7 text-muted">Start where you are. Learn the idea, practice the skill, build something real, and collect evidence you can use for your next step.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/learn" className="button button-primary">Explore the pathway <ArrowRight size={17} className="ml-2" /></Link><Link to="/playground/python" className="button button-secondary">Try Python <ArrowRight size={17} className="ml-2" /></Link></div></div>
      </div>
    </div>
  </main>
}
