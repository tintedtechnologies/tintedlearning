import { ArrowRight, Clock3, ExternalLink, WalletCards, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SignInButton, useUser } from '@clerk/react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ProjectGuide } from '../components/learning/ProjectGuide'
import { lessons, portfolioProjects, portfolioTracks } from '../data/curriculum'
import { emptyPortfolioProfile, encodePortfolioProfile, readPortfolioProfile } from '../data/portfolioProfile'
import { getSectionLessonIds, learningSections } from '../data/learningSections'
import { useProgress } from '../hooks/useProgress'
import type { PortfolioAccomplishment, PortfolioProfile } from '../types/portfolio'

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

function resumeText(profile: Pick<PortfolioProfile, 'displayName' | 'headline' | 'summary' | 'resume' | 'accomplishments' | 'githubLinks'>) {
  const divider = '============================================================'
  const section = (title: string) => [`${divider}`, title.toUpperCase(), divider]
  return [
    profile.displayName,
    profile.headline || profile.resume.targetRole,
    [profile.resume.location, profile.resume.email, profile.resume.phone, profile.resume.linkedin, profile.resume.github || profile.githubLinks.join(' · '), profile.resume.portfolio].filter(Boolean).join(' | '),
    '',
    ...section('Professional Summary'),
    profile.resume.summary || profile.summary,
    '',
    ...section('Technical Skills'),
    profile.resume.skills,
    '',
    ...section('Professional Experience'),
    profile.resume.experience,
    '',
    ...section('Projects'),
    ...profile.accomplishments.flatMap((item) => [item.title, item.summary, item.link, '']),
    ...section('Certifications'),
    profile.resume.certifications,
    '',
    ...section('Education'),
    profile.resume.education,
  ].filter((line, index, lines) => line || (index > 0 && lines[index - 1])).join('\n')
}

function downloadResume(profile: Pick<PortfolioProfile, 'displayName' | 'headline' | 'summary' | 'resume' | 'accomplishments' | 'githubLinks'>) {
  const blob = new Blob([resumeText(profile)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${(profile.displayName || 'resume').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-resume.txt`
  link.click()
  URL.revokeObjectURL(url)
}

function ResumeExportActions({ profile }: { profile: Pick<PortfolioProfile, 'displayName' | 'headline' | 'summary' | 'resume' | 'accomplishments' | 'githubLinks'> }) {
  return <div className="flex flex-wrap gap-3"><button type="button" onClick={() => downloadResume(profile)} className="button button-secondary">Download TXT</button><button type="button" onClick={() => window.print()} className="button button-secondary">Print / save PDF</button></div>
}

function ResumePrintDocument({ profile }: { profile: PortfolioProfile }) {
  return <section className="resume-print-document"><header><h1>{profile.displayName || 'Resume'}</h1><p>{[profile.resume.location, profile.resume.email, profile.resume.phone, profile.resume.linkedin, profile.resume.github || profile.githubLinks.join(' · '), profile.resume.portfolio].filter(Boolean).join(' · ')}</p></header><section><h2>Professional summary</h2><p>{profile.resume.summary || profile.summary}</p></section><section><h2>Technical skills</h2><p>{profile.resume.skills}</p></section><section><h2>Professional experience</h2><p>{profile.resume.experience}</p></section><section><h2>Projects</h2>{profile.accomplishments.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.summary}</p>{item.link && <p>{item.link}</p>}</article>)}</section><div className="resume-print-grid"><section><h2>Certifications</h2><p>{profile.resume.certifications}</p></section><section><h2>Education</h2><p>{profile.resume.education}</p></section></div></section>
}

function ProjectMetadata({ trackId }: { trackId: string }) {
  const metadata = projectMetadata[trackId]
  if (!metadata) return null
  return <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><Wrench size={15} />{metadata.difficulty}</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><Clock3 size={15} />{metadata.time}</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><WalletCards size={15} />{metadata.cost}</span><span className="flex items-center gap-2 rounded-xl bg-white px-3 py-3 text-xs font-bold text-teal"><ExternalLink size={15} />{metadata.setup}</span></div>
}

function ExamplePortfolio() {
  return <section className="rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8"><p className="eyebrow text-teal">Resume</p><h1 className="mt-3 font-display text-5xl font-bold text-teal sm:text-6xl">Jordan Lee</h1><p className="mt-2 text-2xl font-bold text-teal">AI Engineer</p><p className="mt-3 text-sm font-medium text-muted">Austin, TX · jordan@example.com · (555) 010-2026 · linkedin.com/in/jordanlee · github.com/jordanlee · jordanlee.dev</p><p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-muted">This example shows the new portfolio format: a professional resume header, evidence-backed work, GitHub links, certifications, and education.</p><section className="mt-8 grid gap-6 md:grid-cols-[1.3fr_0.7fr]"><div><h2 className="font-display text-4xl font-bold text-teal">Professional summary</h2><p className="mt-3 text-lg leading-8 text-muted">AI engineer who turns ambiguous product needs into tested, observable systems. Strongest in evaluation design, retrieval workflows, Python services, and cloud delivery.</p><h2 className="mt-8 font-display text-3xl font-bold text-teal">Professional experience</h2><ul className="mt-3 space-y-3 text-base font-medium leading-7 text-ink"><li>• Built an evaluation harness covering groundedness, safety, latency, cost, and failure review.</li><li>• Deployed a containerized service with health checks, logs, budget assumptions, and rollback notes.</li><li>• Documented technical decisions so reviewers could reproduce the result and understand the tradeoffs.</li></ul></div><div><h2 className="font-display text-3xl font-bold text-teal">Technical skills</h2><p className="mt-3 text-base font-medium leading-7 text-ink">Python, APIs, SQL, RAG, prompt design, evaluation, Docker, cloud operations, observability</p><h2 className="mt-8 font-display text-3xl font-bold text-teal">Certifications</h2><p className="mt-3 text-base leading-7 text-muted">AWS, Azure, and Google Cloud foundations; vendor-neutral cloud security study; AI risk and evaluation practice.</p><h2 className="mt-8 font-display text-3xl font-bold text-teal">Education</h2><p className="mt-3 text-base leading-7 text-muted">Independent AI engineering study supported by completed lessons, project reports, deployment artifacts, and public demonstrations.</p></div></section><section className="mt-10 border-t border-line pt-8"><h2 className="font-display text-4xl font-bold text-teal">Projects · GitHub links</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><a href="https://github.com/example/ai-evaluation-harness" target="_blank" rel="noreferrer" className="rounded-2xl bg-mist p-4 text-base font-bold text-teal hover:bg-cream">AI evaluation harness <ExternalLink size={15} className="ml-1 inline" /></a><a href="https://github.com/example/cloud-service" target="_blank" rel="noreferrer" className="rounded-2xl bg-mist p-4 text-base font-bold text-teal hover:bg-cream">Cloud service deployment <ExternalLink size={15} className="ml-1 inline" /></a></div></section></section>
}

function PortfolioStudio({ user }: { user: NonNullable<ReturnType<typeof useUser>['user']> }) {
  const progress = useProgress(lessons.length)
  const [profile, setProfile] = useState<PortfolioProfile>(() => readPortfolioProfile(user.unsafeMetadata?.tintedPortfolio, user.fullName ?? user.username ?? ''))
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const progressSnapshot = {
    completedLessons: progress.completedLessons.length,
    totalLessons: lessons.length,
    sections: learningSections.filter((section) => section.kind === 'learning').map((section) => {
      const sectionLessons = getSectionLessonIds(section)
      return { title: section.title, completed: sectionLessons.filter((lessonId) => progress.completedLessons.includes(lessonId)).length, total: sectionLessons.length }
    }),
  }

  useEffect(() => {
    setProfile(readPortfolioProfile(user.unsafeMetadata?.tintedPortfolio, user.fullName ?? user.username ?? ''))
  }, [user.id, user.unsafeMetadata?.tintedPortfolio])

  const updateProfile = (next: Partial<PortfolioProfile>) => setProfile((current) => ({ ...current, ...next }))
  const updateResume = (next: Partial<PortfolioProfile['resume']>) => setProfile((current) => ({ ...current, resume: { ...current.resume, ...next } }))
  const updateAccomplishment = (id: string, next: Partial<PortfolioAccomplishment>) => setProfile((current) => ({ ...current, accomplishments: current.accomplishments.map((item) => item.id === id ? { ...item, ...next } : item) }))
  const addAccomplishment = () => setProfile((current) => ({ ...current, accomplishments: [...current.accomplishments, { id: crypto.randomUUID(), title: '', summary: '', link: '' }] }))
  const removeAccomplishment = (id: string) => setProfile((current) => ({ ...current, accomplishments: current.accomplishments.filter((item) => item.id !== id) }))
  const save = async () => {
    setSaving(true)
    setSaveError('')
    setSaved(false)
    try {
      const next = { ...profile, currentProgress: progressSnapshot, updatedAt: new Date().toISOString() }
      await user.updateMetadata({ unsafeMetadata: { tintedPortfolio: next } })
      setProfile(next)
      if (next.visibility === 'public') setShareUrl(`${window.location.origin}/portfolio/share?profile=${encodeURIComponent(encodePortfolioProfile(next))}`)
      else setShareUrl('')
      setSaved(true)
    } catch {
      setSaveError('Your portfolio could not be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const clearPortfolio = async () => {
    if (!window.confirm('Clear your resume, accomplishments, links, and portfolio settings?')) return
    setSaving(true)
    setSaveError('')
    try {
      await user.updateMetadata({ unsafeMetadata: { tintedPortfolio: null } })
      setProfile(emptyPortfolioProfile(user.fullName ?? user.username ?? ''))
      setShareUrl('')
      setSaved(false)
    } catch {
      setSaveError('Your portfolio could not be cleared. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return <section className="rounded-3xl border border-teal/15 bg-white p-6 shadow-soft sm:p-8"><div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-start"><div><p className="eyebrow">Portfolio studio</p><h1 className="mt-2 font-display text-4xl font-bold text-teal">Build your resume and proof.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Create a resume, collect GitHub work, and track your learning progress.</p></div><span className={`rounded-full px-3 py-2 text-xs font-bold ${profile.visibility === 'public' ? 'bg-mist text-teal' : 'bg-sand text-teal'}`}>{profile.visibility === 'public' ? 'Public sharing on' : 'Private'}</span></div><nav className="mt-5 flex flex-wrap gap-2" aria-label="Portfolio sections"><a href="#resume" className="rounded-full bg-sand px-3 py-2 text-xs font-bold text-teal hover:bg-mist">Resume</a><a href="#portfolio" className="rounded-full bg-sand px-3 py-2 text-xs font-bold text-teal hover:bg-mist">Portfolio</a><a href="#progress" className="rounded-full bg-sand px-3 py-2 text-xs font-bold text-teal hover:bg-mist">Progress</a></nav>
    <section id="resume" className="mt-6 scroll-mt-6 rounded-2xl bg-sand p-5"><p className="eyebrow">Resume</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Your professional profile</h2><div className="mt-4 grid gap-3 lg:grid-cols-2"><label><span className="text-sm font-bold text-teal">Name</span><input value={profile.displayName} onChange={(event) => updateProfile({ displayName: event.target.value })} className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">Headline / target role</span><input value={profile.headline} onChange={(event) => updateProfile({ headline: event.target.value })} placeholder="AI engineer focused on reliable systems" className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">Location</span><input value={profile.resume.location} onChange={(event) => updateResume({ location: event.target.value })} placeholder="City, State or Remote" className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">Email</span><input value={profile.resume.email} onChange={(event) => updateResume({ email: event.target.value })} type="email" className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">Phone</span><input value={profile.resume.phone} onChange={(event) => updateResume({ phone: event.target.value })} className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">LinkedIn</span><input value={profile.resume.linkedin} onChange={(event) => updateResume({ linkedin: event.target.value })} placeholder="https://linkedin.com/in/..." className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">GitHub</span><input value={profile.resume.github} onChange={(event) => updateResume({ github: event.target.value })} placeholder="https://github.com/..." className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label><label><span className="text-sm font-bold text-teal">Portfolio URL</span><input value={profile.resume.portfolio} onChange={(event) => updateResume({ portfolio: event.target.value })} placeholder="https://..." className="mt-2 w-full rounded-xl border border-line p-3 text-sm" /></label></div>
    <label className="mt-5 block"><span className="text-sm font-bold text-teal">Professional summary</span><textarea value={profile.resume.summary} onChange={(event) => updateResume({ summary: event.target.value })} rows={4} placeholder="Write two or three sentences about your experience, specialization, and value." className="mt-2 w-full rounded-xl border border-line p-3 text-sm leading-6" /></label><div className="mt-5 grid gap-3 lg:grid-cols-2"><label><span className="text-sm font-bold text-teal">Technical skills</span><textarea value={profile.resume.skills} onChange={(event) => updateResume({ skills: event.target.value })} rows={4} placeholder="Cloud platforms, AI, languages, frameworks, and tools" className="mt-2 w-full rounded-xl border border-line p-3 text-sm leading-6" /></label><label><span className="text-sm font-bold text-teal">Professional experience</span><textarea value={profile.resume.experience} onChange={(event) => updateResume({ experience: event.target.value })} rows={4} placeholder="Roles, responsibilities, and measurable achievements" className="mt-2 w-full rounded-xl border border-line p-3 text-sm leading-6" /></label><label><span className="text-sm font-bold text-teal">Certifications</span><textarea value={profile.resume.certifications} onChange={(event) => updateResume({ certifications: event.target.value })} rows={3} placeholder="AWS, Azure, Google Cloud, security, and other credentials" className="mt-2 w-full rounded-xl border border-line p-3 text-sm leading-6" /></label><label><span className="text-sm font-bold text-teal">Education</span><textarea value={profile.resume.education} onChange={(event) => updateResume({ education: event.target.value })} rows={3} placeholder="Degrees, institutions, and relevant training" className="mt-2 w-full rounded-xl border border-line p-3 text-sm leading-6" /></label></div></section>
    <section id="portfolio" className="mt-8 scroll-mt-6 rounded-3xl bg-mist p-5"><div className="flex items-center justify-between gap-3"><div><p className="eyebrow">Portfolio</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Your work and accomplishments</h2></div><button type="button" onClick={addAccomplishment} className="button button-secondary">Add accomplishment</button></div><div className="mt-4 space-y-3">{profile.accomplishments.map((item) => <div key={item.id} className="rounded-xl bg-white p-4"><div className="flex items-start gap-3"><div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2"><input value={item.title} onChange={(event) => updateAccomplishment(item.id, { title: event.target.value })} placeholder="Project or accomplishment" className="rounded-lg border border-line p-3 text-sm" /><input value={item.link} onChange={(event) => updateAccomplishment(item.id, { link: event.target.value })} placeholder="GitHub or evidence URL" className="rounded-lg border border-line p-3 text-sm" /><textarea value={item.summary} onChange={(event) => updateAccomplishment(item.id, { summary: event.target.value })} rows={3} placeholder="What did you do, and what evidence can someone inspect?" className="mt-0 w-full rounded-lg border border-line p-3 text-sm leading-6 sm:col-span-2" /></div><button type="button" onClick={() => removeAccomplishment(item.id)} aria-label={`Remove ${item.title || 'accomplishment'}`} className="rounded-lg border border-line px-3 py-2 text-sm font-bold text-muted hover:border-red-300 hover:text-red-700">Remove</button></div></div>)}{!profile.accomplishments.length && <p className="text-sm leading-6 text-muted">Add your first project, lesson insight, evaluation report, or deployment result.</p>}</div></section>
    {progressSnapshot.completedLessons > 0 && <section id="progress" className="mt-8 scroll-mt-6 rounded-2xl border border-line p-5"><p className="eyebrow">Current progress on Tinted Learning</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Show what you have finished.</h2><div className="mt-4 flex flex-wrap gap-2">{progressSnapshot.sections.filter((section) => section.completed > 0).map((section) => <span key={section.title} className="rounded-full bg-mist px-3 py-2 text-xs font-bold text-teal">{section.title}: {section.completed}/{section.total}</span>)}</div></section>}
    {saveError && <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{saveError}</p>}<div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" onClick={() => { void save() }} disabled={saving} className="button button-primary disabled:opacity-50">{saving ? 'Saving...' : 'Save portfolio'}</button><ResumeExportActions profile={profile} /><button type="button" onClick={() => { void clearPortfolio() }} disabled={saving} className="button border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50">Clear all resume data</button>{saved && <span className="text-sm font-bold text-teal">Saved.</span>}</div>
    <ResumePrintDocument profile={profile} />
  </section>
}

export function PortfolioPage() {
  const { trackId } = useParams()
  const { user, isLoaded } = useUser()

  if (!trackId) {
    return <main className="shell py-12 sm:py-16"><p className="eyebrow">Portfolio studio</p>{isLoaded && user ? <PortfolioStudio user={user} /> : <><ExamplePortfolio /><div className="mt-8 flex flex-wrap gap-3"><SignInButton mode="modal"><button type="button" className="button button-primary">Sign in to build your portfolio</button></SignInButton><Link to="/portfolio/ai-system-evaluation" className="button button-secondary">Explore the example project</Link></div></>}</main>
  }

  if (trackId === 'example') return <main className="shell py-12 sm:py-16"><Link to="/portfolio" className="text-xs font-bold uppercase tracking-[0.2em] text-teal hover:text-gold">Back to portfolio studio</Link><div className="mt-8"><ExamplePortfolio /></div><div className="mt-8 flex flex-wrap gap-3"><SignInButton mode="modal"><button type="button" className="button button-primary">Sign in to build your portfolio</button></SignInButton><Link to="/portfolio/ai-system-evaluation" className="button button-secondary">Open the example project</Link></div></main>

  const track = portfolioTracks.find((item) => item.id === trackId)
  if (!track) return <Navigate to="/portfolio" replace />
  const projectKey = projectByTrack[track.id]
  const project = projectKey ? portfolioProjects[projectKey] : undefined

  return <main className="shell py-12 sm:py-16"><Link to="/portfolio" className="text-xs font-bold uppercase tracking-[0.2em] text-teal hover:text-gold">Back to portfolio studio</Link><section className={`mt-8 rounded-3xl border border-line p-6 sm:p-8 ${track.tone === 'teal' ? 'bg-mist' : track.tone === 'gold' ? 'bg-sand' : 'bg-white'}`}><p className="eyebrow">Portfolio track</p><h1 className="mt-3 font-display text-4xl font-bold text-teal sm:text-5xl">{track.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{track.description}</p><div className="mt-8 grid gap-6 md:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Publish these artifacts</p><ul className="mt-3 space-y-2 text-sm leading-7 text-ink">{track.deliverables.map((item) => <li key={item}>• {item}</li>)}</ul></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">A reviewer should verify</p><ul className="mt-3 space-y-2 text-sm leading-7 text-ink">{track.evidence.map((item) => <li key={item}>• {item}</li>)}</ul></div></div><div className="mt-8 grid gap-3 sm:grid-cols-2">{track.resources.map((resource) => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="rounded-2xl border border-line bg-white p-4 hover:border-teal/30"><span className="flex items-start justify-between gap-3"><span><span className="block text-sm font-bold text-teal">{resource.title}</span><span className="mt-1 block text-[10px] font-bold uppercase tracking-widest text-muted">{resource.provider}</span></span><ExternalLink size={15} className="text-teal" /></span><span className="mt-2 block text-sm leading-6 text-muted">{resource.description}</span></a>)}</div></section><ProjectMetadata trackId={track.id} />{project && <ProjectGuide project={project} />}</main>
}
