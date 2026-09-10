import { ArrowRight, Check } from 'lucide-react'
import { useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const steps = [
  ['Goal', 'Plan a simple study schedule for this week.'],
  ['Planning', 'Break the goal into subjects, time blocks, and review sessions.'],
  ['Tool selection', 'Choose a calendar tool and a task list tool.'],
  ['Tool result', 'The calendar has three open study blocks.'],
  ['Next action', 'Place the study blocks and add a reminder for each one.'],
  ['Final result', 'A weekly study plan is ready for review.'],
]

export function AgentsPage() {
  const [visible, setVisible] = useState(steps.length)
  return <PlaygroundFrame eyebrow="AI agents" title="How does an AI agent work through a goal?" description="An agent can plan, choose tools, inspect results, and decide what to do next. This local demo shows the pattern without taking any real actions."><div className="rounded-3xl border border-line bg-white p-5 shadow-soft sm:p-7"><div className="overflow-x-auto pb-4"><div className="flex min-w-[960px] items-stretch gap-3">{steps.map(([label, text], index) => <div key={label} className="flex flex-1 items-center gap-3"><div className={`playground-step w-40 shrink-0 rounded-2xl border p-4 transition-colors ${index < visible ? 'opacity-100' : 'translate-y-2 opacity-25'} ${index === visible - 1 ? 'border-gold bg-sand' : 'border-line bg-cream'}`} style={{ animationDelay: `${index * 90}ms` }}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-teal">{index + 1}</span><p className="mt-4 font-bold text-teal">{label}</p><p className="mt-2 text-xs leading-5 text-muted">{text}</p></div>{index < steps.length - 1 && <ArrowRight className="shrink-0 text-gold" size={20} />}</div>)}</div></div><div className="mt-7 flex flex-wrap items-center justify-center gap-3"><button type="button" onClick={() => setVisible((current) => current >= steps.length ? 1 : current + 1)} className="button button-primary">{visible >= steps.length ? 'Replay the flow' : 'Run next step'}</button>{visible >= steps.length && <span className="inline-flex items-center text-sm font-bold text-teal"><Check size={16} className="mr-2" />Complete flow</span>}</div></div><p className="mt-5 text-center text-sm leading-7 text-muted">On a small screen, swipe sideways to follow the agent from goal to result.</p></PlaygroundFrame>
}
