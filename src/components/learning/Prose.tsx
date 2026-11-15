import { Fragment } from 'react'

/** Renders prose with `backtick` spans as inline code. */
export function Prose({ text }: { text: string }) {
  const parts = text.split('`')
  return <>{parts.map((part, index) => index % 2 === 1 ? <code key={index} className="rounded bg-mist px-1.5 py-0.5 font-mono text-[0.9em] text-teal [overflow-wrap:anywhere]">{part}</code> : <Fragment key={index}>{part}</Fragment>)}</>
}
