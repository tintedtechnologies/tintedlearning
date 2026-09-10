import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-teal text-white">
      <div className="shell grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">Tinted Academy</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/70">Free AI education for everyone.</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Explore</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/75">
            <Link to="/learn" className="hover:text-white">Learn</Link>
            <Link to="/playground" className="hover:text-white">Playground</Link>
            <Link to="/about" className="hover:text-white">About</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">A Tinted Technologies project</p>
          <p className="mt-4 text-sm leading-6 text-white/70">Technology is only as powerful as the people who understand it.</p>
        </div>
      </div>
      <div className="shell border-t border-white/15 py-5 text-xs text-white/55">© 2026 Tinted Technologies LLC</div>
    </footer>
  )
}
