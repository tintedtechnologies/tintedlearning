import { Link } from 'react-router-dom'

interface PlaygroundFrameProps {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
}

export function PlaygroundFrame({ eyebrow, title, description, children }: PlaygroundFrameProps) {
  return <div><section className="bg-teal text-white"><div className="shell max-w-7xl py-16 sm:py-20"><Link to="/playground" className="text-xs font-bold uppercase tracking-[0.2em] text-gold hover:text-white">Back to playgrounds</Link><h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">{description}</p></div></section><section className="shell max-w-7xl py-12 sm:py-16">{children}</section></div>
}
