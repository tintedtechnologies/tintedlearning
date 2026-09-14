import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectGuide } from '../components/learning/ProjectGuide'
import { portfolioProjects, portfolioTracks } from '../data/curriculum'

const projectByTrack: Record<string, keyof typeof portfolioProjects> = {
  'cloud-deployment': 'cloudDeployment',
  'cicd-deployment': 'cicdDeployment',
  'infrastructure-as-code-execution': 'infrastructureAsCode',
}

export function PortfolioPage() {
  const { trackId } = useParams()

  if (!trackId) {
    return <main className="shell py-12 sm:py-16"><p className="eyebrow">Portfolio studio</p><h1 className="section-title mt-3">Turn learning into proof.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Your portfolio should make it easy for a reviewer to see what you built, how it works, what failed, and why you made each decision.</p><div className="mt-10 grid gap-4 md:grid-cols-2">{portfolioTracks.map((track) => <Link key={track.id} to={`/portfolio/${track.id}`} className={`rounded-3xl border border-line p-6 transition-transform hover:-translate-y-1 hover:shadow-soft ${track.tone === 'teal' ? 'bg-mist' : track.tone === 'gold' ? 'bg-sand' : 'bg-white'}`}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Portfolio track</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">{track.title}</h2></div><ArrowRight className="shrink-0 text-teal" size={20} /></div><p className="mt-4 text-sm leading-6 text-muted">{track.description}</p><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-teal">{track.deliverables.length} deliverables · {track.evidence.length} proof points</p></Link>)}</div></main>
  }

  const track = portfolioTracks.find((item) => item.id === trackId)
  if (!track) return <Navigate to="/portfolio" replace />
  const projectKey = projectByTrack[track.id]
  const project = projectKey ? portfolioProjects[projectKey] : undefined

  return <main className="shell py-12 sm:py-16"><Link to="/portfolio" className="text-xs font-bold uppercase tracking-[0.2em] text-teal hover:text-gold">Back to portfolio studio</Link><section className={`mt-8 rounded-3xl border border-line p-6 sm:p-8 ${track.tone === 'teal' ? 'bg-mist' : track.tone === 'gold' ? 'bg-sand' : 'bg-white'}`}><p className="eyebrow">Portfolio track</p><h1 className="mt-3 font-display text-4xl font-bold text-teal sm:text-5xl">{track.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{track.description}</p><div className="mt-8 grid gap-6 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Publish these artifacts</p><ul className="mt-3 space-y-2 text-sm leading-7 text-ink">{track.deliverables.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">A reviewer should verify</p><ul className="mt-3 space-y-2 text-sm leading-7 text-ink">{track.evidence.map((item) => <li key={item}>• {item}</li>)}</ul></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{track.resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-line bg-white p-4 hover:border-teal/30"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={15} className="text-teal" /></span><span className="mt-2 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div></section>{project && <ProjectGuide project={project} />}</main>
}
