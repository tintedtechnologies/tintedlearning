import { useEffect, useMemo, useState } from 'react'
import { pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const items = ['How do I reset my password?', 'I cannot log into my account.', 'What is the weather today?', 'Where can I change my login details?', 'Banana smoothie recipe']
const itemPositions = [{ left: 18, top: 25 }, { left: 68, top: 26 }, { left: 34, top: 68 }, { left: 78, top: 72 }, { left: 88, top: 52 }]

export function EmbeddingsPage() {
  const [query, setQuery] = useState('Is it going to rain tomorrow?')
  const [scores, setScores] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [embedder, setEmbedder] = useState<FeatureExtractionPipeline | null>(null)

  useEffect(() => {
    let active = true
    void pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2').then((loaded) => {
      if (active) { setEmbedder(() => loaded as FeatureExtractionPipeline); setLoading(false) }
    }).catch(() => { if (active) { setError('The local embedding model could not load. Refresh to try again.'); setLoading(false) } })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!embedder) return
    let active = true
    void (async () => {
      try {
        const output = await embedder([query, ...items], { pooling: 'mean', normalize: true })
        const vectors = output.tolist() as number[][]
        const queryVector = vectors[0]
        const nextScores = vectors.slice(1).map((vector) => queryVector.reduce((sum, value, index) => sum + value * vector[index], 0))
        if (active) setScores(nextScores)
      } catch { if (active) setError('The embedding comparison failed. Try a shorter question.') }
    })()
    return () => { active = false }
  }, [embedder, query])

  const bestMatch = scores.length ? Math.max(...scores) : 0
  const hasStrongMatch = bestMatch >= 0.45
  const closestItem = scores.length ? (hasStrongMatch ? items[scores.indexOf(bestMatch)] : 'No strong match') : 'Loading meaning matches...'
  const queryPosition = useMemo(() => {
    if (!scores.length) return { left: 50, top: 50 }
    const total = scores.reduce((sum, score) => sum + Math.max(score, 0.01), 0)
    return scores.reduce((position, score, index) => ({ left: position.left + (itemPositions[index].left * Math.max(score, 0.01)) / total, top: position.top + (itemPositions[index].top * Math.max(score, 0.01)) / total }), { left: 0, top: 0 })
  }, [scores])

  return <PlaygroundFrame eyebrow="Embeddings" title="Can AI compare meaning?" description="Embeddings turn text into vectors. Similar ideas can land close together even when they use different words. This page runs a small embedding model locally in your browser."><div className="grid gap-8 lg:grid-cols-[0.85fr_1fr]"><div className="rounded-3xl bg-sand p-7"><label htmlFor="embedding-query" className="eyebrow">Your question</label><textarea id="embedding-query" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-4 min-h-32 w-full resize-y rounded-2xl border border-line bg-white p-4 text-sm leading-7 text-ink focus:border-gold focus:outline-none" /><div className="mt-6 flex flex-wrap gap-2">{['weather', 'password', 'smoothie'].map((keyword) => <button type="button" key={keyword} onClick={() => setQuery(keyword === 'weather' ? 'Is it going to rain tomorrow?' : keyword === 'password' ? 'I forgot how to sign in' : 'How do I make a banana smoothie?')} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-teal hover:bg-mist">{keyword}</button>)}</div><div className="mt-8 rounded-2xl border border-teal/10 bg-white p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">The idea</p><p className="mt-2 text-sm leading-6 text-muted">The model compares vectors, not just shared words. A rain question can match a weather sentence even when neither sentence uses the same wording.</p></div></div><div className="rounded-3xl border border-line bg-white p-7 shadow-soft"><p className="eyebrow">Meaning map</p>{loading && <p className="mt-4 text-sm font-bold text-teal">Loading the local embedding model (about 23 MB) …</p>}{error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}<div className="relative mt-6 h-48 overflow-hidden rounded-2xl bg-cream"><div className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-gold shadow-lg transition-all duration-700 playground-pulse" style={{ left: `${queryPosition.left}%`, top: `${queryPosition.top}%` }} /><span className="absolute right-3 top-3 rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-teal">your meaning</span>{itemPositions.map((position, index) => <div key={items[index]} className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 ${scores[index] === bestMatch && hasStrongMatch ? 'bg-teal ring-4 ring-teal/20' : 'bg-teal/45'}`} style={{ left: `${position.left}%`, top: `${position.top}%` }} />)}<span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-widest text-muted">abstract meaning space</span></div><div className="mt-5 rounded-2xl bg-mist p-4"><p className="text-xs font-bold uppercase tracking-widest text-muted">Closest match</p><p className="mt-2 font-bold text-teal">{closestItem}</p>{scores.length > 0 && <p className="mt-1 text-sm text-muted">Cosine similarity: {bestMatch.toFixed(2)}<br /><span className="text-xs">0 = unrelated · 1 = same meaning</span></p>}{scores.length > 0 && !hasStrongMatch && <p className="mt-2 text-sm font-bold text-teal">These sentences are not strongly related.</p>}</div><div className="mt-6 space-y-5">{items.map((item, index) => <div key={item} className={`rounded-xl p-2 transition-colors ${scores[index] === bestMatch && hasStrongMatch ? 'bg-mist' : ''}`}><div className="flex justify-between gap-4 text-sm font-bold text-ink"><span>{item}</span><span className="text-teal">{scores[index] === undefined ? 'Not run' : scores[index].toFixed(2)}</span></div><div className="mt-2 h-3 rounded-full bg-cream"><div className="playground-bar h-full rounded-full bg-teal" style={{ width: `${Math.max(0, (scores[index] ?? 0) * 100)}%` }} /></div></div>)}</div><button type="button" onClick={() => setDetailsOpen((open) => !open)} className="mt-7 flex w-full items-center justify-between border-t border-line pt-5 text-left text-sm font-bold text-teal">How this works {detailsOpen ? '−' : '+'}</button>{detailsOpen && <p className="mt-4 text-sm leading-7 text-muted">The browser loads Xenova/all-MiniLM-L6-v2 through Transformers.js, creates a normalized vector for each sentence, and ranks the items by raw cosine similarity. The model is downloaded once and then runs locally.</p>}</div></div></PlaygroundFrame>
}
