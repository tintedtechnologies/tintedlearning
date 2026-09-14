import { Clipboard } from 'lucide-react'
import type { GuidedProject } from '../../types/curriculum'

interface ProjectGuideProps {
  project: GuidedProject
}

function CopyButton({ value, label }: { value: string; label: string }) {
  return <button type="button" className="shrink-0 text-white/70 hover:text-gold" aria-label={label} title={label} onClick={() => navigator.clipboard?.writeText(value)}><Clipboard size={15} /></button>
}

export function ProjectGuide({ project }: ProjectGuideProps) {
  return <section className="my-10 rounded-3xl border border-teal/15 bg-mist p-6 sm:p-8">
    <p className="eyebrow">Hands-on build</p>
    <h2 className="mt-3 font-display text-3xl font-bold text-teal">Build it on your machine</h2>
    <p className="mt-4 text-base leading-7 text-muted">{project.goal}</p>

    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Before you start</p><ul className="mt-3 space-y-2 text-sm leading-6 text-ink">{project.prerequisites.map((item) => <li key={item}>• {item}</li>)}</ul></div>
      <div className="rounded-2xl bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Setup, one step at a time</p><ol className="mt-3 space-y-3 text-sm leading-6 text-ink">{project.setup.map((item, index) => <li key={item}><span className="mr-2 font-bold text-teal">{index + 1}.</span>{item}</li>)}</ol></div>
    </div>

    {project.files && <div className="mt-4 rounded-2xl bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Files to create</p><div className="mt-3 divide-y divide-line">{project.files.map((file) => <div key={file.path} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5"><code className="font-mono text-sm font-bold text-teal">{file.path}</code><span className="text-sm leading-6 text-muted">{file.purpose}</span></div>)}</div></div>}
    {project.platformNotes && <div className="mt-4 rounded-2xl border border-gold/30 bg-sand p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Platform and safety notes</p><ul className="mt-3 space-y-2 text-sm leading-6 text-ink">{project.platformNotes.map((note) => <li key={note}>• {note}</li>)}</ul></div>}

    <div className="mt-4 rounded-2xl bg-teal p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Install dependencies</p><div className="mt-3 space-y-2">{project.dependencies.map((dependency) => <div key={dependency} className="flex items-start gap-2 rounded-lg bg-white/10 px-3 py-2"><code className="min-w-0 flex-1 overflow-x-auto font-mono text-sm text-white/90">{dependency}</code><CopyButton value={dependency} label={`Copy dependency ${dependency}`} /></div>)}</div></div>

    <div className="mt-8 space-y-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Build steps</p>{project.steps.map((step, index) => <details key={step.title} className="group rounded-2xl border border-line bg-white p-5" open={index === 0}><summary className="cursor-pointer list-none font-display text-xl font-bold text-teal"><span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand text-sm font-bold">{index + 1}</span>{step.title}</summary><div className="mt-5 pl-0 sm:pl-11"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Do this</p><ul className="mt-3 space-y-2 text-sm leading-6 text-ink">{step.instructions.map((instruction) => <li key={instruction}>• {instruction}</li>)}</ul>{step.commands && <div className="mt-5 space-y-2"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Commands</p>{step.commands.map((command) => <div key={command} className="flex items-start gap-2 rounded-lg bg-[#173b38] px-3 py-2"><code className="min-w-0 flex-1 overflow-x-auto font-mono text-sm text-white">{command}</code><CopyButton value={command} label={`Copy command ${command}`} /></div>)}</div>}{step.code && <div className="mt-5 rounded-xl bg-[#173b38] p-4"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Code</span><CopyButton value={step.code} label={`Copy code for ${step.title}`} /></div><pre className="overflow-x-auto text-sm leading-7 text-white"><code>{step.code}</code></pre></div>}<div className="mt-5 rounded-xl bg-mist p-4"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Checkpoint</p><p className="mt-2 text-sm leading-6 text-ink">{step.checkpoint}</p></div></div></details>)}</div>

    {project.verification && <div className="mt-8 rounded-2xl border border-teal/20 bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Finished means</p><ul className="mt-3 space-y-2 text-sm leading-6 text-ink">{project.verification.map((item) => <li key={item}>• {item}</li>)}</ul></div>}
    <div className="mt-8 rounded-2xl border border-line bg-white p-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Next steps</p><ul className="mt-3 space-y-2 text-sm leading-6 text-ink">{project.nextSteps.map((item) => <li key={item}>• {item}</li>)}</ul></div>
  </section>
}
