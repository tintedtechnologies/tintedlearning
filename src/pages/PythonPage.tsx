import { CheckCircle2, CircleAlert, Play, RotateCcw, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const exercises = [
  { title: 'Values', description: 'Store values and print a result.', code: 'name = "AI learner"\nscore = 82\nprint(name, "scored", score)' },
  { title: 'Conditions', description: 'Let a condition choose a path.', code: 'score = 82\n\nif score >= 60:\n    print("Pass")\nelse:\n    print("Try again")' },
  { title: 'Collections', description: 'Loop through a list of data.', code: 'numbers = [2, 4, 6, 8]\n\nfor number in numbers:\n    print(number, "->", number * 2)' },
  { title: 'Functions', description: 'Package reusable behavior.', code: 'def average(values):\n    return sum(values) / len(values)\n\nprint(average([2, 4, 6, 8]))' },
  { title: 'Files', description: 'Read text from a file safely.', code: 'from io import StringIO\n\nfile = StringIO("Python makes data useful.")\nwith file as source:\n    text = source.read()\n\nprint(text)' },
  { title: 'API + JSON', description: 'Model a request and validate its response.', code: 'import json\n\n# Offline simulation of an API response\nresponse = {"status": 200, "data": {"name": "Ada", "active": True}}\nbody = json.dumps(response)\nresult = json.loads(body)\n\nif result["status"] == 200:\n    print("User:", result["data"]["name"])' },
  { title: 'Data check', description: 'Inspect and summarize a dataset.', code: 'scores = [82, 91, 76, None, 88]\nvalid = [score for score in scores if score is not None]\n\nprint("Rows:", len(scores))\nprint("Missing:", scores.count(None))\nprint("Average:", sum(valid) / len(valid))' },
  { title: 'AI workflow', description: 'Keep an AI workflow in small testable steps.', code: 'def prepare(question):\n    return question.strip().lower()\n\ndef answer(question):\n    prompt = prepare(question)\n    return f"Prepared prompt: {prompt}"\n\nprint(answer("  Explain embeddings  "))' },
  { title: 'Errors', description: 'Handle an expected failure clearly.', code: 'def divide(total, count):\n    try:\n        return total / count\n    except ZeroDivisionError:\n        return "Count must be greater than zero"\n\nprint(divide(10, 2))\nprint(divide(10, 0))' },
  { title: 'Comprehensions', description: 'Transform a collection in one readable expression.', code: 'words = ["AI", "Python", "data"]\nlong_words = [word.lower() for word in words if len(word) > 2]\n\nprint(long_words)' },
  { title: 'Testing', description: 'Turn an expectation into a repeatable check.', code: 'def add_tax(price, rate):\n    return price * (1 + rate)\n\nresult = add_tax(100, 0.1)\nassert result == 110\nprint("Test passed:", result)' },
  { title: 'Classes', description: 'Bundle data and behavior into an object.', code: 'class Document:\n    def __init__(self, title, text):\n        self.title = title\n        self.text = text\n\n    def word_count(self):\n        return len(self.text.split())\n\ndoc = Document("Notes", "Python makes data useful")\nprint(doc.title, doc.word_count())' },
  { title: 'Dictionaries', description: 'Look up structured data by key.', code: 'user = {"name": "Ada", "role": "engineer", "active": True}\n\nprint(user["name"])\nprint(user.get("team", "Unassigned"))' },
  { title: 'Sets', description: 'Remove duplicates and compare groups.', code: 'seen = {"python", "ai", "python"}\nrequired = {"python", "testing"}\n\nprint("Unique:", seen)\nprint("Missing:", required - seen)' },
  { title: 'Binary search', description: 'Find a value by halving the search space.', code: 'values = [2, 4, 6, 8, 10, 12, 14]\ntarget = 10\nleft, right = 0, len(values) - 1\n\nwhile left <= right:\n    middle = (left + right) // 2\n    if values[middle] == target:\n        print("Found at index", middle)\n        break\n    if values[middle] < target:\n        left = middle + 1\n    else:\n        right = middle - 1' },
  { title: 'Linear search', description: 'Check items one by one until you find a match.', code: 'values = ["draft", "review", "approved", "published"]\ntarget = "approved"\n\nfor index, value in enumerate(values):\n    if value == target:\n        print("Found at index", index)\n        break' },
  { title: 'Sorting', description: 'Order values so later work becomes easier.', code: 'values = [7, 2, 9, 4, 1]\n\nfor end in range(len(values) - 1, 0, -1):\n    for index in range(end):\n        if values[index] > values[index + 1]:\n            values[index], values[index + 1] = values[index + 1], values[index]\n\nprint(values)' },
  { title: 'Two pointers', description: 'Move inward from both ends of a sequence.', code: 'values = [1, 2, 3, 4, 5, 6]\nleft, right = 0, len(values) - 1\ntarget = 7\n\nwhile left < right:\n    total = values[left] + values[right]\n    if total == target:\n        print("Pair:", values[left], values[right])\n        break\n    if total < target:\n        left += 1\n    else:\n        right -= 1' },
  { title: 'Stack', description: 'Process the most recently added item first.', code: 'history = []\nhistory.append("home")\nhistory.append("lessons")\nhistory.append("python")\n\nlast_page = history.pop()\nprint("Back from:", last_page)\nprint("Now at:", history[-1])' },
  { title: 'Queue and BFS', description: 'Process items in arrival order while exploring neighbors.', code: 'from collections import deque\n\ngraph = {"A": ["B", "C"], "B": ["D"], "C": [], "D": []}\nqueue = deque(["A"])\nvisited = []\n\nwhile queue:\n    node = queue.popleft()\n    if node in visited:\n        continue\n    visited.append(node)\n    queue.extend(graph[node])\n\nprint("Visited:", visited)' },
  { title: 'Recursion', description: 'Solve a problem by reducing it to a smaller version.', code: 'def countdown(number):\n    if number == 0:\n        return\n    print(number)\n    countdown(number - 1)\n\ncountdown(3)' },
  { title: 'Frequency count', description: 'Count repeated values to answer lookup questions quickly.', code: 'words = ["ai", "python", "ai", "data", "ai", "python"]\ncounts = {}\n\nfor word in words:\n    counts[word] = counts.get(word, 0) + 1\n\nprint(counts)' },
]

export function PythonPage() {
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [code, setCode] = useState(exercises[0].code)
  const [output, setOutput] = useState('')
  const [hasRun, setHasRun] = useState(false)
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
    setHasRun(true)
    try {
      const result = await pyodide.runPythonAsync(`import io\nimport contextlib\n_buffer = io.StringIO()\nwith contextlib.redirect_stdout(_buffer):\n${code.split('\n').map((line) => `    ${line}`).join('\n')}\n_buffer.getvalue()`)
      setOutput(result || 'Your code ran without printed output.')
    } catch (error) {
      setOutput(String(error))
    }
  }

  const selectExercise = (index: number) => {
    setExerciseIndex(index)
    setCode(exercises[index].code)
    setOutput('')
    setHasRun(false)
  }

  const resetExercise = () => selectExercise(exerciseIndex)

  return <PlaygroundFrame eyebrow="Python playground" title="Write Python in your browser." description="Practice Python without installing anything. Start with a guided exercise, change the code, and run it. This runtime runs locally in your browser and does not expose API keys.">
    <div className="grid min-h-[70vh] gap-6 lg:grid-cols-2"><div className="flex min-h-[620px] flex-col"><div className="flex items-center justify-between"><div><p className="eyebrow">Your code</p><p className="mt-1 text-xs text-muted">Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to run</p></div><button type="button" onClick={resetExercise} className="inline-flex items-center text-sm font-bold text-teal"><RotateCcw size={15} className="mr-2" />Reset exercise</button></div><textarea aria-label="Python code" aria-keyshortcuts="Control+Enter Meta+Enter" value={code} onChange={(event) => setCode(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); void runCode() } }} spellCheck={false} className="mt-3 min-h-[540px] flex-1 w-full resize-y rounded-3xl border border-line bg-[#102f2e] p-6 font-mono text-sm leading-7 text-white/90 shadow-soft focus:border-gold focus:outline-none" /><div className="flex flex-wrap gap-3"><button type="button" onClick={runCode} disabled={status !== 'ready'} className="button button-primary mt-4 disabled:cursor-not-allowed disabled:opacity-50"><Play size={16} className="mr-2" />{status === 'ready' ? 'Run Python' : status === 'error' ? 'Runtime unavailable' : 'Loading Python...'}</button>{hasRun && <button type="button" onClick={() => setOutput('')} className="button button-secondary mt-4"><Trash2 size={15} className="mr-2" />Clear output</button>}</div></div><aside className="flex min-h-[620px] flex-col rounded-3xl border border-line bg-white p-7 shadow-soft"><div className="flex items-center justify-between"><p className="eyebrow">Output</p>{hasRun && <span className="text-xs font-bold text-muted">Exercise: {exercises[exerciseIndex].title}</span>}</div><pre className={`mt-4 min-h-[300px] flex-1 whitespace-pre-wrap overflow-auto rounded-2xl p-5 font-mono text-sm leading-7 ${output.startsWith('Traceback') || output.includes('Error:') ? 'bg-red-50 text-red-900' : 'bg-cream text-ink'}`}>{output || 'Run the example to see output here.'}</pre><div className="mt-6 rounded-2xl bg-mist p-4 text-sm leading-6 text-muted"><strong className="text-teal">What to notice:</strong> {exercises[exerciseIndex].description} Change a value or instruction, run again, and compare the result.</div></aside></div>
    <div className="mt-8 rounded-3xl border border-teal/10 bg-white p-5 shadow-soft sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">Choose a starting point</p><h2 className="mt-2 font-display text-2xl font-bold text-teal">Learn by changing one idea</h2></div><span className={`inline-flex items-center text-xs font-bold ${status === 'ready' ? 'text-teal' : status === 'error' ? 'text-red-700' : 'text-muted'}`}>{status === 'ready' ? <CheckCircle2 size={15} className="mr-1.5" /> : status === 'error' ? <CircleAlert size={15} className="mr-1.5" /> : <span className="mr-1.5 h-2.5 w-2.5 animate-pulse rounded-full bg-gold" />}{status === 'ready' ? 'Python ready' : status === 'error' ? 'Runtime unavailable' : 'Loading Python runtime'}</span></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">{exercises.map((exercise, index) => <button type="button" key={exercise.title} onClick={() => selectExercise(index)} className={`rounded-2xl border p-3 text-left transition-colors ${exerciseIndex === index ? 'border-teal bg-mist' : 'border-line bg-cream hover:border-teal/30'}`}><span className="block text-sm font-bold text-teal">{String(index + 1).padStart(2, '0')} · {exercise.title}</span><span className="mt-1 block text-xs leading-5 text-muted">{exercise.description}</span></button>)}</div>
      <div className="mt-4 rounded-2xl bg-cream px-4 py-3 text-sm leading-6 text-muted"><strong className="text-teal">What you’ll practice:</strong> {exercises[exerciseIndex].description} Select another starting point to load its code.</div>
    </div>
  </PlaygroundFrame>
}