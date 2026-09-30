import { ArrowRight, Clock3, ExternalLink, WalletCards, Wrench } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectGuide } from '../components/learning/ProjectGuide'
import { portfolioProjects, portfolioTracks } from '../data/curriculum'

const projectByTrack: Record<string, keyof typeof portfolioProjects> = {
  'cloud-deployment': 'cloudDeployment',
  'cicd-deployment': 'cicdDeployment',
  'infrastructure-as-code-execution': 'infrastructureAsCode',
  'ai-system-evaluation': 'aiSystemEvaluation',
  'technical-leadership-portfolio': 'technicalLeadershipPortfolio',
  'ai-mathematics-research': 'aiMathematicsResearchPortfolio',
}

const projectMetadata: Record<string, { difficulty: string; time: string; cost: string; setup: string }> = {
  'github-pages-portfolio': { difficulty: 'Beginner', time: '2-4 hours', cost: 'Free', setup: 'GitHub account' },
  'cloud-deployment': { difficulty: 'Intermediate', time: '4-8 hours', cost: 'Cloud billing may apply', setup: 'Cloud account, CLI, Docker' },
  'cicd-deployment': { difficulty: 'Advanced', time: '6-10 hours', cost: 'Cloud billing may apply', setup: 'GitHub Actions and cloud IAM' },
  'ai-system-evaluation': { difficulty: 'Advanced', time: '8-12 hours', cost: 'Free with local mock; provider costs vary', setup: 'Python and evaluation cases' },
  'infrastructure-as-code-execution': { difficulty: 'Advanced', time: '6-10 hours', cost: 'Cloud billing may apply', setup: 'Terraform and cloud account' },
  'technical-leadership-portfolio': { difficulty: 'Advanced', time: '8-12 hours', cost: 'Free', setup: 'Stakeholder case and reviewer' },
  'ai-mathematics-research': { difficulty: 'Advanced', time: '10-16 hours', cost: 'Free with public or synthetic data', setup: 'Python and scientific libraries' },
}

function ProjectMetadata({ trackId }: { trackId: string }) {
  const metadata = projectMetadata[trackId]
  if (!metadata) return null
  return <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><Wrench size={15} />{metadata.difficulty}</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><Clock3 size={15} />{metadata.time}</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><WalletCards size={15} />{metadata.cost}</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><ExternalLink size={15} />{metadata.setup}</span></div>
}

export function PortfolioPage() {
  const { trackId } = useParams()

  if (!trackId) {
    return <main className="shell py-12 sm:py-16"><p className="eyebrow">Portfolio studio</p><h1 className="section-title mt-3">Turn learning into proof.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Your portfolio should make it easy for a reviewer to see what you built, how it works, what failed, and why you made each decision.</p><div className="mt-10 grid gap-4 md:grid-cols-2">{portfolioTracks.map((track) => <Link key={track.id} to={`/portfolio/${track.id}`} className={`rounded-3xl border border-line p-6 transition-transform hover:-translate-y-1 hover:shadow-soft ${track.tone === 'teal' ? 'bg-mist' : track.tone === 'gold' ? 'bg-sand' : 'bg-white'}`}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow !text-ink">Portfolio track</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">{track.title}</h2></div><ArrowRight className="shrink-0 text-teal" size={20} /></div><p className="mt-4 text-sm leading-6 !text-ink">{track.description}</p><ProjectMetadata trackId={track.id} /><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-teal">{track.deliverables.length} deliverables · {track.evidence.length} proof points</p></Link>)}</div></main>
  }

  const track = portfolioTracks.find((item) => item.id === trackId)
  if (!track) return <Navigate to="/portfolio" replace />
  const projectKey = projectByTrack[track.id]
  const project = projectKey ? portfolioProjects[projectKey] : undefined

  return <main className="shell py-12 sm:py-16"><Link to="/portfolio" className="text-xs font-bold uppercase tracking-[0.2em] text-teal hover:text-gold">Back to portfolio studio</Link><section className={`mt-8 rounded-3xl border border-line p-6 sm:p-8 ${track.tone === 'teal' ? 'bg-mist' : track.tone === 'gold' ? 'bg-sand' : 'bg-white'}`}><p className="eyebrow">Portfolio track</p><h1 className="mt-3 font-display text-4xl font-bold text-teal sm:text-5xl">{track.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{track.description}</p><div className="mt-8 grid gap-6 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Publish these artifacts</p><ul className="mt-3 space-y-2 text-sm leading-7 text-ink">{track.deliverables.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">A reviewer should verify</p><ul className="mt-3 space-y-2 text-sm leading-7 text-ink">{track.evidence.map((item) => <li key={item}>• {item}</li>)}</ul></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{track.resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-line bg-white p-4 hover:border-teal/30"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={15} className="text-teal" /></span><span className="mt-2 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div></section><ProjectMetadata trackId={track.id} />{project && <ProjectGuide project={project} />}</main>
}
