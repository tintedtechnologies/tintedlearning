import { Link } from 'react-router-dom'

type LegalSection = {
  title: string
  paragraphs: string[]
}

type LegalPageProps = {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
}

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return <main className="min-h-[calc(100vh-5rem)] bg-cream px-5 py-14 sm:px-8 sm:py-20">
    <article className="mx-auto max-w-4xl">
      <Link to="/" className="text-sm font-bold text-teal hover:text-gold">Tinted Learning</Link>
      <p className="mt-10 text-xs font-bold uppercase tracking-[0.24em] text-muted">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold leading-tight text-teal sm:text-6xl">{title}</h1>
      <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{intro}</p>
      <p className="mt-5 text-sm text-muted">Effective September 19, 2026</p>
      <div className="mt-12 space-y-10 border-t border-line pt-10">
        {sections.map((section) => <section key={section.title}>
          <h2 className="font-display text-3xl font-bold text-teal">{section.title}</h2>
          <div className="mt-4 space-y-4 text-base leading-8 text-ink">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>)}
      </div>
    </article>
  </main>
}