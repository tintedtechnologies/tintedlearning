import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { SeoMetadata } from '../components/common/SeoMetadata'
import { decodePortfolioProfile } from '../data/portfolioProfile'

export function PortfolioSharePage() {
  const [searchParams] = useSearchParams()
  const profile = decodePortfolioProfile(searchParams.get('profile') ?? '')
  if (!profile || profile.visibility !== 'public') return <Navigate to="/portfolio" replace />

  return <main className="shell max-w-5xl py-10 sm:py-16">
    <SeoMetadata title={`${profile.displayName || 'Portfolio'} portfolio`} description={profile.summary || 'A portfolio of learning evidence and technical accomplishments.'} />
    <Link to="/portfolio" className="inline-flex items-center text-sm font-bold text-muted hover:text-teal"><ArrowLeft size={16} className="mr-2" />Portfolio studio</Link>
    <header className="mt-8 rounded-3xl bg-teal p-6 text-white shadow-soft sm:p-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Portfolio</p><h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">{profile.displayName || 'Portfolio'}</h1>{profile.headline && <p className="mt-3 text-xl text-white/80">{profile.headline}</p>}{profile.summary && <p className="mt-5 max-w-3xl text-base leading-7 text-white/75">{profile.summary}</p>}</header>
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"><p className="eyebrow">Portfolio · GitHub links</p><div className="mt-5 space-y-4">{profile.accomplishments.length ? profile.accomplishments.map((item) => <article key={item.id} className="rounded-2xl bg-mist p-5"><div className="flex items-start justify-between gap-3"><h2 className="font-display text-2xl font-bold text-teal">{item.title}</h2>{item.link && <a href={item.link} target="_blank" rel="noreferrer" aria-label={`Open ${item.title}`} className="text-teal hover:text-gold"><ExternalLink size={17} /></a>}</div><p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p></article>) : <p className="text-sm leading-6 text-muted">This portfolio is still being assembled.</p>}</div>{profile.githubLinks.length > 0 && <div className="mt-6 border-t border-line pt-5"><p className="text-xs font-bold uppercase tracking-widest text-muted">GitHub</p><div className="mt-2 space-y-2">{profile.githubLinks.map((link) => <a key={link} href={link} target="_blank" rel="noreferrer" className="block text-sm font-bold text-teal hover:text-gold">{link}</a>)}</div></div>}</div>
      <aside className="rounded-3xl border border-line bg-sand p-6 sm:p-8"><p className="eyebrow">Resume</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">{profile.resume.targetRole || 'Technical practitioner'}</h2>{profile.resume.skills && <><p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted">Skills</p><p className="mt-2 text-sm leading-6 text-ink">{profile.resume.skills}</p></>}{profile.resume.experience && <><p className="mt-5 text-xs font-bold uppercase tracking-widest text-muted">Experience</p><p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink">{profile.resume.experience}</p></>}</aside>
    </section>
    {profile.currentProgress.completedLessons > 0 && <section className="mt-5 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"><p className="eyebrow">Current progress on Tinted Learning</p><div className="mt-4 flex flex-wrap gap-3"><span className="rounded-full bg-mist px-3 py-2 text-sm font-bold text-teal">{profile.currentProgress.completedLessons}/{profile.currentProgress.totalLessons} lessons complete</span>{profile.currentProgress.sections.filter((section) => section.completed > 0).slice(0, 5).map((section) => <span key={section.title} className="rounded-full bg-cream px-3 py-2 text-xs font-bold text-teal">{section.title}: {section.completed}/{section.total}</span>)}</div></section>}
  </main>
}
