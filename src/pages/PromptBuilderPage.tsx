import { useMemo, useState } from 'react'
import { PlaygroundFrame } from '../components/playground/PlaygroundFrame'

const scenarios = [
  { id: 'tutor', label: 'Learn a concept', role: 'You are a patient tutor.', task: 'Explain photosynthesis to a beginner.', context: 'Use one everyday analogy. Define any scientific terms. End with two questions that check understanding.', tip: 'For learning, ask for explanations, examples, and a small check for understanding.' },
  { id: 'summary', label: 'Summarize text', role: 'You are a careful editor.', task: 'Summarize the text below for a busy reader.', context: 'Use five bullet points. Separate facts from opinions. Preserve important numbers and names.', tip: 'For summaries, specify the audience, length, format, and details that must not be lost.' },
  { id: 'code', label: 'Write code', role: 'You are a senior TypeScript developer.', task: 'Write a function that groups a list of users by city.', context: 'Use a typed function. Include a small example input and output. Mention one edge case and do not use external libraries.', tip: 'For code, name the language, interfaces, constraints, expected output, and tests or edge cases.' },
  { id: 'plan', label: 'Make a plan', role: 'You are a practical project coach.', task: 'Help me plan a two-week study schedule for an introductory statistics exam.', context: 'Ask me for missing information first. Then make a day-by-day plan with realistic sessions, review, and one rest day.', tip: 'For planning, include constraints, dependencies, decision points, and a way to review progress.' },
]

export function PromptBuilderPage() {
  const [scenarioId, setScenarioId] = useState('tutor')
  const scenario = useMemo(() => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0], [scenarioId])
  const [role, setRole] = useState(scenario.role)
  const [task, setTask] = useState(scenario.task)
  const [context, setContext] = useState(scenario.context)
  const selectScenario = (id: string) => {
    const next = scenarios.find((item) => item.id === id) ?? scenarios[0]
    setScenarioId(next.id)
    setRole(next.role)
    setTask(next.task)
    setContext(next.context)
  }
  const prompt = useMemo(() => `${role}\n\nTask: ${task}\n\nContext and constraints: ${context}`, [role, task, context])
  return <PlaygroundFrame eyebrow="Prompt builder" title="Build a clearer request." description="Prompts are not magic spells. They are task instructions. Choose a scenario, then shape the goal, context, output, and constraints so another person could follow it too."><div className="mb-8 flex flex-wrap gap-2">{scenarios.map((item) => <button type="button" key={item.id} onClick={() => selectScenario(item.id)} className={`rounded-full px-4 py-2 text-sm font-bold ${scenarioId === item.id ? 'bg-teal text-white' : 'bg-white text-teal shadow-sm hover:bg-mist'}`}>{item.label}</button>)}</div><div className="mb-8 rounded-3xl bg-sand p-6"><p className="eyebrow">Scenario lesson</p><p className="mt-3 text-base leading-7 text-muted">{scenario.tip}</p></div><div className="grid gap-8 lg:grid-cols-[0.9fr_1fr]"><div className="space-y-5">{[['role', 'Role or perspective', role, setRole], ['task', 'Task', task, setTask], ['context', 'Context, output, and constraints', context, setContext]].map(([id, label, value, setter]) => <label key={id as string} htmlFor={id as string} className="block"><span className="text-sm font-bold text-teal">{label as string}</span><textarea id={id as string} value={value as string} onChange={(event) => (setter as React.Dispatch<React.SetStateAction<string>>)(event.target.value)} className="mt-2 min-h-24 w-full resize-y rounded-2xl border border-line bg-white p-4 text-sm leading-7 text-ink focus:border-gold focus:outline-none" /></label>)}</div><aside className="self-start rounded-3xl bg-mist p-7"><p className="eyebrow">Your assembled prompt</p><pre className="mt-5 whitespace-pre-wrap font-sans text-sm leading-7 text-ink">{prompt}</pre><div className="mt-7 rounded-2xl bg-white p-4 text-sm leading-6 text-muted"><strong className="text-teal">A strong prompt usually answers four questions:</strong><br />What role should the system take? What is the task? What context matters? What should the output look like?</div></aside></div></PlaygroundFrame>
}
