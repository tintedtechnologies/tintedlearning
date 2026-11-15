import { useMemo, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const choices = [
  { word: 'blue', base: 0.7 },
  { word: 'clear', base: 0.12 },
  { word: 'gray', base: 0.08 },
  { word: 'beautiful', base: 0.06 },
  { word: 'bright', base: 0.04 },
]

function probabilities(temperature: number) {
  const exponent = 1 / Math.max(0.05, temperature)
  const weights = choices.map((choice) => choice.base ** exponent)
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  return weights.map((weight, index) => ({ ...choices[index], probability: weight / total }))
}

function sample(items: ReturnType<typeof probabilities>) {
  const random = Math.random()
  let cursor = 0
  for (const item of items) { cursor += item.probability; if (random <= cursor) return item.word }
  return items[items.length - 1].word
}

export function TemperaturePage() {
  const [temperature, setTemperature] = useState(0.5)
  const [samples, setSamples] = useState<string[]>([])
  const distribution = useMemo(() => probabilities(temperature), [temperature])
  const rangeLabel = temperature < 0.35 ? 'Focused and predictable' : temperature < 0.9 ? 'Balanced' : 'More varied'
  const pickFive = () => setSamples(Array.from({ length: 5 }, () => sample(distribution)))

  return <PlaygroundFrame eyebrow="Temperature" title="How does temperature change a response?" description="Temperature changes how likely a model is to choose less common next tokens. It changes variation, not knowledge or personality."><div className="grid gap-8 lg:grid-cols-[0.8fr_1fr]"><aside className="rounded-3xl bg-sand p-7"><p className="eyebrow">Generation setting</p><p className="mt-4 font-display text-5xl font-bold text-teal">{temperature.toFixed(1)}</p><p className="mt-2 font-bold text-teal">{rangeLabel}</p><label htmlFor="temperature" className="mt-8 block text-sm font-bold text-teal">Temperature</label><input id="temperature" type="range" min="0" max="2" step="0.1" value={temperature} onChange={(event) => { setTemperature(Number(event.target.value)); setSamples([]) }} className="mt-4 w-full accent-teal" /><div className="mt-3 flex justify-between text-xs font-bold text-muted"><span>0 · focused</span><span>2 · varied</span></div><button type="button" onClick={pickFive} className="button button-primary mt-7 w-full">Pick 5 times</button><p className="mt-5 text-sm leading-7 text-muted">At low temperature, the most likely token dominates. At higher temperature, less likely tokens get more opportunity.</p></aside><div className="rounded-3xl border border-line bg-white p-7 shadow-soft"><p className="eyebrow">Next-token probabilities</p><p className="mt-3 rounded-2xl bg-cream p-4 text-lg font-bold text-teal">The sky is ___</p><div className="mt-7 space-y-4">{distribution.map((item) => <div key={item.word}><div className="flex justify-between gap-4 text-sm font-bold text-ink"><span>{item.word}</span><span className="text-teal">{Math.round(item.probability * 100)}%</span></div><div className="mt-2 h-4 rounded-full bg-cream"><div className="h-full rounded-full bg-teal transition-all duration-300" style={{ width: `${item.probability * 100}%` }} /></div></div>)}</div>{samples.length > 0 && <div className="mt-8 rounded-2xl bg-mist p-5"><p className="eyebrow">Five sampled completions</p><div className="mt-3 flex flex-wrap gap-2">{samples.map((word, index) => <span key={`${word}-${index}`} className="rounded-full bg-white px-3 py-2 text-sm font-bold text-teal">{word}</span>)}</div><p className="mt-3 text-xs leading-5 text-muted">{temperature === 0 ? 'At temperature 0, the most likely token is selected every time.' : 'At higher temperatures, the same distribution can produce a mix of sampled tokens.'}</p></div>}</div></div></PlaygroundFrame>
}
