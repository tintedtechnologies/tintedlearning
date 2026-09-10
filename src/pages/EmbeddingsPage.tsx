import { useMemo, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const items = ['How do I reset my password?', 'I cannot log into my account.', 'What is the weather today?', 'Where can I change my login details?']
const keywords = ['password', 'account', 'weather', 'login']
const itemPositions = [{ left: 18, top: 25 }, { left: 68, top: 26 }, { left: 34, top: 68 }, { left: 78, top: 72 }]

export function EmbeddingsPage() {
  const [query, setQuery] = useState('I forgot my password')
  const scores = useMemo(() => items.map((item) => {
    const queryWords = query.toLowerCase().split(/\W+/).filter(Boolean)
    const itemWords = item.toLowerCase().split(/\W+/).filter(Boolean)
    const matches = queryWords.filter((word) => itemWords.some((itemWord) => itemWord.includes(word) || word.includes(itemWord))).length
    return Math.min(98, 28 + matches * 23 + (item.includes('password') && query.toLowerCase().includes('forgot') ? 18 : 0))
  }), [query])
  const bestMatch = Math.max(...scores)
  const closestItem = items[scores.indexOf(bestMatch)]
  const queryPosition = useMemo(() => {
    const total = scores.reduce((sum, score) => sum + score, 0) || 1
    return scores.reduce((position, score, index) => ({ left: position.left + (itemPositions[index].left * score) / total, top: position.top + (itemPositions[index].top * score) / total }), { left: 0, top: 0 })
  }, [scores])

  return <PlaygroundFrame eyebrow="Embeddings" title="Can AI compare meaning?" description="Embeddings represent text as numbers. Similar ideas tend to be closer together, even when they use different words."><div className="grid gap-8 lg:grid-cols-[0.85fr_1fr]"><div className="rounded-3xl bg-sand p-7"><label htmlFor="embedding-query" className="eyebrow">Your question</label><textarea id="embedding-query" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-4 min-h-32 w-full resize-y rounded-2xl border border-line bg-white p-4 text-sm leading-7 text-ink focus:border-gold focus:outline-none" /><div className="mt-6 flex flex-wrap gap-2">{keywords.map((keyword) => <button type="button" key={keyword} onClick={() => setQuery(`I need help with ${keyword}`)} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-teal hover:bg-mist">{keyword}</button>)}</div><div className="mt-8 rounded-2xl border border-teal/10 bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">The idea</p><p className="mt-2 text-sm leading-6 text-muted">Imagine each sentence becomes a point on a meaning map. Related questions land closer together, even when their exact words differ.</p></div></div><div className="rounded-3xl border border-line bg-white p-7 shadow-soft"><p className="eyebrow">Meaning map</p><div className="relative mt-6 h-48 overflow-hidden rounded-2xl bg-cream"><div className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-gold shadow-lg transition-all duration-700 playground-pulse" style={{ left: `${queryPosition.left}%`, top: `${queryPosition.top}%` }} /><span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-teal">your meaning</span>{itemPositions.map((position, index) => <div key={items[index]} className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${scores[index] === bestMatch ? 'bg-teal ring-4 ring-teal/20' : 'bg-teal/45'}`} style={{ left: `${position.left}%`, top: `${position.top}%` }} />)}<span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-muted">abstract meaning space</span></div><div className="mt-5 rounded-2xl bg-mist p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">Closest match</p><p className="mt-2 font-bold text-teal">{closestItem}</p><p className="mt-1 text-sm text-muted">Similarity estimate: {bestMatch}%</p></div><div className="mt-6 space-y-5">{items.map((item, index) => <div key={item} className={`rounded-xl p-2 transition-colors ${scores[index] === bestMatch ? 'bg-mist' : ''}`}><div className="flex justify-between gap-4 text-sm font-bold text-ink"><span>{item}</span><span className="text-teal">{scores[index]}%</span></div><div className="mt-2 h-3 rounded-full bg-cream"><div className="playground-bar h-full rounded-full bg-teal" style={{ width: `${scores[index]}%` }} /></div></div>)}</div><p className="mt-7 text-sm leading-6 text-muted">This is a teaching approximation, not a real embedding model. Real embeddings use high-dimensional vectors and a similarity calculation.</p></div></div></PlaygroundFrame>
}
