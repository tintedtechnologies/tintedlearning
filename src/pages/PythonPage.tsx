import { Play, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const starterCode = 'name = "AI learner"\nprint(f"Hello, {name}!")\n\nnumbers = [2, 4, 6, 8]\nprint("Average:", sum(numbers) / len(numbers))'

export function PythonPage() {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [pyodide, setPyodide] = useState<any>(null)

  useEffect(() => {
    let active = true
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js'
    script.onload = async () => {
      if (!active) return
      setStatus('loading')
      try {
        const runtime = await (window as any).loadPyodide()
        if (active) { setPyodide(runtime); setStatus('ready') }
      } catch { if (active) setStatus('error') }
    }
    script.onerror = () => active && setStatus('error')
    document.body.appendChild(script)
    return () => { active = false; script.remove() }
  }, [])

  const runCode = async () => {
    if (!pyodide) return
    setOutput('Running...')
    try {
      const result = await pyodide.runPythonAsync(`import io\nimport contextlib\n_buffer = io.StringIO()\nwith contextlib.redirect_stdout(_buffer):\n${code.split('\n').map((line) => `    ${line}`).join('\n')}\n_buffer.getvalue()`)
      setOutput(result || 'Your code ran without printed output.')
    } catch (error) {
      setOutput(String(error))
    }
  }

  return <PlaygroundFrame eyebrow="Python playground" title="Write Python in your browser." description="Practice Python without installing anything. This runtime runs locally in your browser. It does not connect to the internet or expose API keys."><div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]"><div><div className="flex items-center justify-between"><p className="eyebrow">Your code</p><button type="button" onClick={() => setCode(starterCode)} className="inline-flex items-center text-sm font-bold text-teal"><RotateCcw size={15} className="mr-2" />Reset</button></div><textarea aria-label="Python code" value={code} onChange={(event) => setCode(event.target.value)} spellCheck={false} className="mt-3 min-h-80 w-full resize-y rounded-3xl border border-line bg-[#102f2e] p-5 font-mono text-sm leading-7 text-white/90 focus:border-gold focus:outline-none" /><button type="button" onClick={runCode} disabled={status !== 'ready'} className="button button-primary mt-4 disabled:cursor-not-allowed disabled:opacity-50"><Play size={16} className="mr-2" />{status === 'ready' ? 'Run Python' : status === 'error' ? 'Runtime unavailable' : 'Loading Python...'}</button></div><aside className="self-start rounded-3xl border border-line bg-white p-7 shadow-soft"><p className="eyebrow">Output</p><pre className="mt-4 min-h-40 whitespace-pre-wrap rounded-2xl bg-cream p-4 font-mono text-sm leading-7 text-ink">{output || 'Run the example to see output here.'}</pre><div className="mt-6 rounded-2xl bg-mist p-4 text-sm leading-6 text-muted"><strong className="text-teal">What to notice:</strong> Python can store values, call functions, loop through data, and print results. These are the building blocks used in later AI projects.</div></aside></div></PlaygroundFrame>
}