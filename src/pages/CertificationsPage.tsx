import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'
import { certifications } from '../data/certifications'
import { lessons } from '../data/curriculum'
import { learningSectionById } from '../data/learningSections'
import type { Certification, CertificationArea, CertificationCost, CertificationLevel } from '../types/curriculum'

const areas: ('All' | CertificationArea)[] = ['All', 'Cloud', 'AI', 'Security', 'Networking', 'Programming & Developer Tools']
const levels: ('All' | CertificationLevel)[] = ['All', 'Entry', 'Associate', 'Professional']
const costs: ('All' | CertificationCost)[] = ['All', 'Free', 'Free training, paid exam', 'Paid exam']

const costOrder: Record<CertificationCost, number> = { Free: 0, 'Free training, paid exam': 1, 'Paid exam': 2 }
const levelOrder: Record<CertificationLevel, number> = { Entry: 0, Associate: 1, Professional: 2 }

const paths: { title: string; intro: string; ids: string[] }[] = [
  { title: 'New to tech', intro: 'Start with free training, then one entry certificate.', ids: ['freecodecamp-certifications', 'azure-fundamentals', 'aws-cloud-practitioner'] },
  { title: 'Moving into cloud', intro: 'Earn one entry certificate, then an associate-level exam on the same cloud.', ids: ['azure-fundamentals', 'azure-administrator', 'kcna'] },
  { title: 'Moving into AI', intro: 'Learn the vocabulary first, then show you can use AI responsibly.', ids: ['azure-ai-fundamentals', 'aws-ai-practitioner', 'gcp-generative-ai-leader'] },
  { title: 'Connecting networks', intro: 'Learn how devices talk to each other, then prove it with a vendor-neutral entry exam and a hands-on associate exam.', ids: ['comptia-network-plus', 'cisco-ccna'] },
  { title: 'Building with AI tools', intro: 'Learn the GitHub workflow that AI-assisted projects run on.', ids: ['github-foundations'] },
  { title: 'Making games', intro: 'Learn the engine and the project workflow, then take a recognized game developer credential.', ids: ['unity-certified-associate-game-developer'] },
]

const titleOf = (id: string) => certifications.find((item) => item.id === id)?.name ?? id
const lessonTitle = (id: string) => lessons.find((lesson) => lesson.id === id)?.title ?? id
const sectionTitle = (id: string) => learningSectionById.get(id)?.title ?? id

/** One filter row: the label in the first column, its options in the second, so every row lines up. */
function Chips<T extends string>({ label, options, value, onChange }: { label: string; options: readonly T[]; value: T; onChange: (value: T) => void }) {
  return <>
    <span className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-muted first:mt-0 sm:mt-0 sm:text-right">{label}</span>
    <div role="group" aria-label={label} className="flex flex-wrap justify-center gap-2 sm:justify-start">
      {options.map((option) => <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`rounded-full px-3 py-1.5 text-xs font-bold ${value === option ? 'bg-teal text-white' : 'bg-mist text-teal hover:bg-sand'}`}>{option}</button>)}
    </div>
  </>
}

function CredentialCard({ item }: { item: Certification }) {
  return <article className="flex flex-col items-center rounded-3xl border border-line bg-white p-6 shadow-soft">
    <p className="text-xs font-bold uppercase tracking-widest text-muted">{item.issuer} · {item.area} · {item.level}</p>
    <h3 className="mt-2 font-display text-xl font-bold leading-tight text-teal">{item.name}</h3>
    <p className="mt-2 inline-flex w-fit rounded-full bg-sand px-2.5 py-1 text-xs font-bold text-teal">{item.cost}</p>
    <p className="mt-4 text-sm leading-6 text-muted"><span className="font-bold text-teal">For employers: </span>{item.employerSentence}</p>
    {item.validity && <p className="mt-3 w-full rounded-xl bg-cream/70 p-3 text-xs leading-5 text-muted"><span className="font-semibold text-ink">Validity and renewal: </span>{item.validity}</p>}
    {item.note && <p className="mt-3 w-full rounded-xl bg-cream/70 p-3 text-xs leading-5 text-muted">{item.note}</p>}
    <div className="mt-4 w-full rounded-xl bg-mist/60 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-teal">Prepare with Tinted Learning</p>
      <ul className="mt-2 space-y-1">{item.prepare.links.map((link) => <li key={link.to}><Link to={link.to} className="text-sm font-bold text-teal underline-offset-4 hover:underline">{link.to.startsWith('/learn/sections/') ? sectionTitle(link.to.split('/').pop() ?? '') : lessonTitle(link.to.split('/').pop() ?? '')}</Link></li>)}</ul>
      <p className="mt-3 text-xs leading-5 text-ink">Still to study elsewhere: {item.prepare.stillNeed}</p>
    </div>
    <div className="mt-auto flex flex-col items-center gap-2 pt-5">
      <a href={item.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-bold text-teal hover:text-gold">Official page<ArrowUpRight size={15} className="ml-1" /></a>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Last checked {item.lastChecked}</span>
    </div>
  </article>
}

export function CertificationsPage() {
  const [area, setArea] = useState<'All' | CertificationArea>('All')
  const [level, setLevel] = useState<'All' | CertificationLevel>('All')
  const [cost, setCost] = useState<'All' | CertificationCost>('All')

  const shown = certifications
    .filter((item) => (area === 'All' || item.area === area) && (level === 'All' || item.level === level) && (cost === 'All' || item.cost === cost))
    .sort((a, b) => a.area.localeCompare(b.area) || costOrder[a.cost] - costOrder[b.cost] || levelOrder[a.level] - levelOrder[b.level])

  return <main className="shell max-w-7xl py-10 text-center sm:py-16">
    <SeoMetadata title="Certifications" description="Real credentials that count on a resume, from recognized organizations, and how Tinted Learning helps you prepare." />
    <Link to="/learn" className="inline-flex items-center text-sm font-bold text-muted hover:text-teal"><ArrowLeft size={16} className="mr-2" />All learning sections</Link>
    <header className="mt-8 border-b border-line pb-8">
      <p className="eyebrow">Certifications</p>
      <h1 className="mx-auto mt-3 max-w-3xl font-display text-4xl font-bold leading-tight text-teal sm:text-5xl">Credentials that count on a resume</h1>
      <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted">Tinted Learning does not issue these credentials. Each one is issued by the organization named on its card. Register and check your status on the official page, and use our lessons to prepare.</p>
    </header>

    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {paths.map((path) => <div key={path.title} className="rounded-3xl bg-mist p-6">
        <h2 className="font-display text-2xl font-bold text-teal">{path.title}</h2>
        <p className="mt-2 text-sm leading-6 text-ink">{path.intro}</p>
        <ol className="mt-3 list-inside list-decimal space-y-1 text-sm font-bold text-teal">{path.ids.map((id) => <li key={id}>{titleOf(id)}</li>)}</ol>
      </div>)}
    </section>

    <section className="mt-12">
      <div className="mx-auto grid w-fit grid-cols-1 items-center gap-x-4 gap-y-2 sm:grid-cols-[auto_auto] sm:gap-y-3">
        <Chips label="Area" options={areas} value={area} onChange={setArea} />
        <Chips label="Level" options={levels} value={level} onChange={setLevel} />
        <Chips label="Cost" options={costs} value={cost} onChange={setCost} />
      </div>
      <p className="mt-4 text-sm text-muted">Showing {shown.length} of {certifications.length}. Free options come first within each area.</p>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{shown.map((item) => <CredentialCard key={item.id} item={item} />)}</div>
      {shown.length === 0 && <p className="mt-8 text-muted">No credentials match these filters. Try another area, level or cost.</p>}
    </section>

    <section className="mt-16">
      <div className="rounded-3xl border border-line bg-white p-6">
        <h2 className="font-display text-2xl font-bold text-teal">Free versus paid</h2>
        <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-muted">Many credentials cost money to sit the exam, even when the training is free. Issuers sometimes offer free vouchers or student programs, but these change. Check the official page before you book, and never pay a third-party site for an answer key.</p>
        <p className="mt-3 text-xs leading-5 text-muted">Sections on Tinted Learning that these credentials build on: {['cloud-engineering', 'ai-engineering', 'security', 'python'].map(sectionTitle).join(', ')}.</p>
      </div>
    </section>
  </main>
}
