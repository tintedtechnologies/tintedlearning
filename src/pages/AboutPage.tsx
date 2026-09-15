import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const promises = ['Plain-language lessons and visual explanations', 'Browser practice with Python, algorithms, and AI workflows', 'Projects and portfolio evidence for your next opportunity']

export function AboutPage() {
  return <main className="min-h-[calc(100vh-5rem)] overflow-hidden bg-cream">
    <div className="bg-teal px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
      <img src="/tintedlearninglogo.png" alt="Tinted Learning" className="h-40 w-40 rounded-[2.5rem] object-contain shadow-soft sm:h-52 sm:w-52" />
      <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-gold">A free way into AI</p>
      <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-7xl">A stepping stone into the world of AI.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">Tinted Learning helps people build real AI understanding without needing a college degree, an expensive course, a technical network, or a login.</p>
      <div className="mt-9 grid w-full gap-3 text-left sm:grid-cols-3">{promises.map((promise) => <div key={promise} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm leading-6 text-white/85"><CheckCircle2 className="mb-3 text-gold" size={19} />{promise}</div>)}</div>
      </div>
    </div>
    <div className="px-5 py-12 text-center text-ink sm:px-8 sm:py-16">
      <p className="mx-auto max-w-2xl text-base leading-7 text-muted">Start where you are. Learn the idea, practice the skill, build something real, and collect evidence you can use for your next step.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/learn" className="button button-primary">Explore the pathway <ArrowRight size={17} className="ml-2" /></Link><Link to="/playground/python" className="button button-secondary">Try Python <ArrowRight size={17} className="ml-2" /></Link></div>
    </div>
  </main>
}
