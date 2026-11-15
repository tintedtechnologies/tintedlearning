import { useMemo, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const scenarios = [
  { id: 'tutor', label: 'Learn a concept', role: 'You are a patient tutor.', task: 'Explain photosynthesis to a beginner.', context: 'The learner is in 8th grade and has never taken biology.', output: 'Use one everyday analogy. Define scientific terms. End with two questions that check understanding.', tip: 'For learning, ask for explanations, examples, and a small check for understanding.' },
  { id: 'summary', label: 'Summarize text', role: 'You are a careful editor.', task: 'Summarize the text below for a busy reader.', context: 'The reader has two minutes and needs the main claims.', output: 'Use five bullet points. Separate facts from opinions. Preserve important numbers and names.\n\nText:\n[Paste your text here]', tip: 'For summaries, specify the audience, length, format, and details that must not be lost.' },
  { id: 'code', label: 'Write code', role: 'You are a senior TypeScript developer.', task: 'Write a function that groups a list of users by city.', context: 'This runs in a Node.js backend. Some users have no city, and city names may be lowercase.', output: 'Use a typed function and no external libraries. Include an example input and output, one edge case, and a test.', tip: 'For code, name the language, interfaces, constraints, expected output, and tests or edge cases.' },
  { id: 'plan', label: 'Make a plan', role: 'You are a practical project coach.', task: 'Help me plan a two-week study schedule for an introductory statistics exam.', context: 'I work full-time and can study about one hour on weekdays and three hours on Saturday.', output: 'Ask for any essential missing information. Make a day-by-day plan with review sessions and one rest day.', tip: 'For planning, include constraints, dependencies, decision points, and a way to review progress.' },
]

export function PromptBuilderPage() {
  const [scenarioId, setScenarioId] = useState('tutor')
  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0], [scenarioId])
  const [role, setRole] = useState(scenario.role)
  const [task, setTask] = useState(scenario.task)
  const [context, setContext] = useState(scenario.context)
  const [output, setOutput] = useState(scenario.output)
  const [copied, setCopied] = useState(false)
  const selectScenario = (id: string) => {
    const next = scenarios.find((item) => item.id === id) ?? scenarios[0]
    setScenarioId(next.id)
    setRole(next.role)
    setTask(next.task)
    setContext(next.context)
    setOutput(next.output)
    setCopied(false)
  }
  const prompt = useMemo(() => [[role && `Role: ${role}`], [task && `Task: ${task}`], [context && `Context: ${context}`], [output && `Output: ${output}`]].flat().filter(Boolean).join('\n\n'), [role, task, context, output])
  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = prompt
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      fallback.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return <PlaygroundFrame eyebrow="Prompt builder" title="Build a clearer request." description="Prompts are not magic spells. They are task instructions. Choose a scenario, then shape the role, task, context, and output so another person could follow it too."><div className="mb-8 flex flex-wrap gap-2">{scenarios.map((item) => <button type="button" key={item.id} onClick={() => selectScenario(item.id)} className={`rounded-full px-4 py-2 text-sm font-bold ${scenarioId === item.id ? 'bg-teal text-white' : 'bg-white text-teal shadow-sm hover:bg-mist'}`}>{item.label}</button>)}</div><div className="mb-8 rounded-3xl bg-sand p-6"><p className="eyebrow">Scenario lesson</p><p className="mt-3 text-base leading-7 text-muted">{scenario.tip}</p></div><div className="grid gap-8 lg:grid-cols-[0.9fr_1fr]"><div className="space-y-5">{[['role', 'Role or perspective', role, setRole], ['task', 'Task', task, setTask], ['context', 'Context', context, setContext], ['output', 'Desired output and rules', output, setOutput]].map(([id, label, value, setter]) => <label key={id as string} htmlFor={id as string} className="block"><span className="text-sm font-bold text-teal">{label as string}</span><textarea id={id as string} value={value as string} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-line bg-white p-4 text-sm leading-7 text-ink focus:border-gold focus:outline-none" />{id === 'context' && !context && <span className="mt-2 block text-xs leading-5 text-muted">Without context, the AI has to guess who this is for and what situation matters.</span>}</label>)}</div><aside className="self-start rounded-3xl bg-mist p-7"><div className="flex items-start justify-between gap-3"><p className="eyebrow">Your assembled prompt</p><button type="button" onClick={() => { void copyPrompt() }} className="rounded-full bg-white px-3 py-2 text-xs font-bold text-teal hover:bg-cream">{copied ? 'Copied' : 'Copy prompt'}</button></div><pre className="mt-5 whitespace-pre-wrap font-sans text-sm leading-7 text-ink">{prompt || 'Fill in the four parts to build your prompt.'}</pre><div className="mt-7 rounded-2xl bg-white p-4 text-sm leading-6 text-muted"><strong className="text-teal">A strong prompt answers four questions:</strong><br />What role should the system take? What is the task? What context matters? What should the output look like?</div></aside></div></PlaygroundFrame>
}
