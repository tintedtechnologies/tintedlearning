import { useMemo, useState } from 'react'
import { encode } from 'gpt-tokenizer'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

type Message = { role: string; text: string }
const initialMessages: Message[] = [
  { role: 'System', text: 'You are a helpful tutor.' },
  { role: 'User', text: 'My name is Jordan. Explain machine learning in simple terms.' },
  { role: 'Assistant', text: 'Machine learning helps software find patterns from examples.' },
  { role: 'User', text: 'Give me a real-world example.' },
  { role: 'Assistant', text: 'A music app can learn listening patterns to recommend a song.' },
]

export function ContextPage() {
  const [limit, setLimit] = useState(40)
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const tokenCounts = messages.map((message) => encode(message.text).length)
  const used = tokenCounts.reduce((total, count) => total + count, 0)
  const keptIndexes = new Set<number>()
  let remaining = limit
  if (messages[0] && tokenCounts[0] <= remaining) { keptIndexes.add(0); remaining -= tokenCounts[0] }
  for (let index = messages.length - 1; index >= 1; index -= 1) {
    if (tokenCounts[index] <= remaining) { keptIndexes.add(index); remaining -= tokenCounts[index] }
  }
  const visibleMessages = messages.map((message, index) => ({ ...message, tokens: tokenCounts[index], dropped: !keptIndexes.has(index) }))
  const visibleUsed = visibleMessages.filter((message) => !message.dropped).reduce((total, message) => total + message.tokens, 0)
  const percentage = Math.min(100, Math.round((visibleUsed / limit) * 100))
  const nameMessageDropped = visibleMessages.some((message) => message.text.includes('My name is Jordan') && message.dropped)
  const addMessage = () => { if (!draft.trim()) return; setMessages((current) => [...current, { role: 'User', text: draft.trim() }]); setDraft('') }
  const reset = () => { setMessages(initialMessages); setDraft('') }

  return <PlaygroundFrame eyebrow="Context windows" title="How much can an AI remember at once?" description="A context window is the model's working space for one request. When the conversation exceeds the limit, older messages can be dropped from what the model can see."><div className="mb-8 rounded-3xl border border-line bg-white p-6 shadow-soft"><p className="eyebrow">Add your own message</p><div className="mt-4 flex gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') addMessage() }} placeholder="Try: What was my name?" className="w-full rounded-xl border border-line p-3 text-sm" /><button type="button" onClick={addMessage} className="button button-primary">Add</button></div><button type="button" onClick={reset} className="mt-3 text-sm font-bold text-teal">Reset conversation</button></div><div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]"><div className="space-y-3">{visibleMessages.map((message, index) => <div key={`${index}-${message.text}`} className={`flex gap-4 rounded-2xl border p-5 ${message.dropped ? 'border-line bg-cream/60 opacity-60' : 'border-line bg-white shadow-sm'}`}><span className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-muted">{message.role}</span><div className="flex-1"><p className="text-sm leading-7 text-ink">{message.text}</p>{message.dropped && <p className="mt-2 text-xs font-bold text-muted">Dropped: the model can’t see this anymore.</p>}</div><span className="text-xs font-bold text-teal">{message.tokens} tokens</span></div>)}{messages.some((message) => message.text.includes('What was my name')) && <div className="rounded-2xl border border-teal/15 bg-mist p-5"><p className="text-xs font-bold uppercase tracking-widest text-muted">Assistant can see</p><p className="mt-2 text-sm font-bold text-teal">{nameMessageDropped ? 'A typical reply: “I don’t think you’ve told me your name. What should I call you?”' : 'A typical reply: “Your name is Jordan.”'}</p>{nameMessageDropped && <p className="mt-2 text-xs leading-5 text-muted">The model cannot see that a message was dropped, so it cannot tell you it forgot.</p>}</div>}</div><aside className={`self-start rounded-3xl p-7 ${percentage >= 100 ? 'bg-sand' : percentage > 80 ? 'bg-cream' : 'bg-mist'}`}><p className="eyebrow">Model view</p><p className="mt-3 font-display text-4xl font-bold text-teal">{visibleUsed} / {limit}</p><div className="mt-5 h-4 overflow-hidden rounded-full bg-white"><div className={`playground-bar h-full rounded-full ${percentage >= 100 ? 'bg-red-500' : percentage > 80 ? 'bg-gold' : 'bg-teal'}`} style={{ width: `${percentage}%` }} /></div><p className="mt-3 text-sm font-bold text-teal">{percentage >= 100 ? 'Older messages are dropped.' : percentage > 80 ? 'Almost full.' : 'There is room for more context.'}</p><p className="mt-3 text-sm leading-6 text-muted">The newest messages are kept first while the system message is preserved. The exact strategy depends on the application.</p><label htmlFor="context-limit" className="mt-7 block text-sm font-bold text-teal">Available tokens: {limit}</label><input id="context-limit" type="range" min="20" max="80" step="5" value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="mt-3 w-full accent-teal" /></aside></div></PlaygroundFrame>
}
