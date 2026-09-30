import { ArrowRight, Bot, Braces, Box, Code2, Layers3, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

const playgrounds = [
  { title: 'Python', text: 'Write and run Python directly in your browser. Start with variables, lists, functions, and simple calculations.', level: 'Start here', focus: 'Programming', icon: Code2, to: '/playground/python' },
  { title: 'Tokens', text: 'See how a sentence can be broken into smaller pieces for an AI model to process.', level: 'Start here', focus: 'Language models', icon: Braces, to: '/playground/tokens' },
  { title: 'Context windows', text: 'Explore how much information an AI model can consider at one time.', level: 'Foundations', focus: 'Language models', icon: Layers3, to: '/playground/context' },
  { title: 'Temperature', text: 'See how randomness can change the style of generated responses.', level: 'Foundations', focus: 'Model behavior', icon: SlidersHorizontal, to: '/playground/temperature' },
  { title: 'Prompt builder', text: 'Put together a clear request with instructions, context, and a goal.', level: 'Foundations', focus: 'Application design', icon: Sparkles, to: '/playground/prompt-builder' },
  { title: 'Embeddings', text: 'Discover how AI systems compare the meaning of different text.', level: 'Intermediate', focus: 'Representations', icon: Box, to: '/playground/embeddings' },
  { title: 'RAG', text: 'Follow a question as it searches for useful information before answering.', level: 'Intermediate', focus: 'Retrieval', icon: Search, to: '/playground/rag' },
  { title: 'AI agents', text: 'Watch a goal become a plan, tool choice, result, and next action.', level: 'Intermediate', focus: 'Systems', icon: Bot, to: '/playground/agents' },
]

export function PlaygroundPage() {
  return <div><section className="shell max-w-7xl py-16 sm:py-20"><p className="eyebrow">Interactive learning</p><h1 className="section-title mt-3">Learn by doing.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Reading about AI is useful. Seeing it work makes it click. Start with Python or Tokens, then choose a focused experiment when you are ready to go deeper.</p></section><section className="shell max-w-7xl grid gap-4 pb-24 sm:grid-cols-2 lg:grid-cols-3">{playgrounds.map(({ title, text, level, focus, icon: Icon, to }) => <Link to={to} key={title}><div className="h-full rounded-[1.75rem] border border-line bg-white p-6 transition-transform hover:-translate-y-1 hover:shadow-soft"><div className="flex items-start justify-between gap-3"><Icon size={25} className="text-teal" /><span className="rounded-full bg-mist px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-teal">{level}</span></div><h2 className="mt-8 font-display text-2xl font-bold text-teal">{title}</h2><p className="mt-3 leading-7 text-muted">{text}</p><div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4"><span className="text-xs font-bold uppercase tracking-widest text-muted">{focus}</span><span className="inline-flex items-center text-sm font-bold text-teal">Try it <ArrowRight size={16} className="ml-2" /></span></div></div></Link>)}</section></div>
}
