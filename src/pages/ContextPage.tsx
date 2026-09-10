import { useMemo, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const messages = [
  { role: 'System', text: 'You are a helpful tutor.', tokens: 7 },
  { role: 'User', text: 'Explain machine learning in simple terms.', tokens: 9 },
  { role: 'Assistant', text: 'Machine learning helps software find patterns from examples.', tokens: 10 },
  { role: 'User', text: 'Give me a real-world example.', tokens: 7 },
]

const messageSets = {
  short: messages.slice(0, 2),
  conversation: messages,
  crowded: [...messages, { role: 'User', text: 'Now compare three different approaches and include a source for each one.', tokens: 15 }, { role: 'Assistant', text: 'Here is a longer response that uses more of the available working space.', tokens: 15 }],
}

export function ContextPage() {
  const [limit, setLimit] = useState(40)
  const [setName, setSetName] = useState<keyof typeof messageSets>('conversation')
  const activeMessages = messageSets[setName]
  const used = useMemo(() => activeMessages.reduce((total, message) => total + message.tokens, 0), [activeMessages])
  const percentage = Math.min(100, Math.round((used / limit) * 100))
  return <PlaygroundFrame eyebrow="Context windows" title="How much can an AI remember at once?" description="A context window is the model's working space for one request. Think of it like a desk: the model can work with what fits on the desk right now."><div className="mb-8 rounded-3xl border border-line bg-white p-6 shadow-soft"><p className="eyebrow">Choose a conversation</p><div className="mt-4 flex flex-wrap gap-2">{(Object.keys(messageSets) as Array<keyof typeof messageSets>).map((name) => <button type="button" key={name} onClick={() => setSetName(name)} className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${setName === name ? 'bg-teal text-white' : 'bg-cream text-teal hover:bg-mist'}`}>{name}</button>)}</div><p className="mt-4 text-sm leading-7 text-muted">Watch how adding messages uses more of the model's available working space. Older messages do not become free just because newer messages arrive.</p></div><div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]"><div className="space-y-3">{activeMessages.map((message, index) => <div key={message.role + message.text} className="playground-step flex gap-4 rounded-2xl border border-line bg-white p-5 shadow-sm" style={{ animationDelay: `${index * 70}ms` }}><span className="w-20 shrink-0 text-xs font-bold uppercase tracking-widest text-muted">{message.role}</span><p className="flex-1 text-sm leading-7 text-ink">{message.text}</p><span className="text-xs font-bold text-teal">{message.tokens} tokens</span></div>)}</div><aside className={`self-start rounded-3xl p-7 ${percentage > 80 ? 'bg-sand' : 'bg-mist'}`}><p className="eyebrow">Your working desk</p><p className="mt-3 font-display text-4xl font-bold text-teal">{used} / {limit}</p><div className="mt-5 h-4 overflow-hidden rounded-full bg-white"><div className={`playground-bar h-full rounded-full ${percentage > 80 ? 'bg-gold' : 'bg-teal'}`} style={{ width: `${percentage}%` }} /></div><p className="mt-3 text-sm font-bold text-teal">{percentage > 100 ? 'Some information will not fit.' : percentage > 80 ? 'The desk is getting crowded.' : 'There is room for more context.'}</p><p className="mt-3 text-sm leading-6 text-muted">This example uses a simplified token count. Real context limits are measured in tokens and vary by model.</p><label htmlFor="context-limit" className="mt-7 block text-sm font-bold text-teal">Available tokens: {limit}</label><input id="context-limit" type="range" min="20" max="80" step="5" value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="mt-3 w-full accent-teal" /></aside></div></PlaygroundFrame>
}
