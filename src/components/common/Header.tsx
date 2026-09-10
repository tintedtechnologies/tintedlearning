import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Learn', to: '/learn' },
  { label: 'Playground', to: '/playground' },
  { label: 'About', to: '/about' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="border-b border-line/80 bg-cream/90 backdrop-blur">
      <div className="shell flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal text-lg font-bold text-white transition-transform group-hover:-rotate-6">T</span>
          <span>
            <span className="block font-display text-xl font-bold leading-none text-teal">Tinted Academy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-bold transition-colors ${isActive ? 'text-teal' : 'text-muted hover:text-teal'}`}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/learn" className="button button-primary">Start learning</Link>
        </nav>

        <button type="button" className="icon-button md:hidden" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {isOpen && (
        <nav className="shell border-t border-line py-4 md:hidden" aria-label="Mobile navigation">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setIsOpen(false)} className="rounded-xl px-3 py-3 font-bold text-teal hover:bg-mist">{item.label}</NavLink>
            ))}
            <Link to="/learn" onClick={() => setIsOpen(false)} className="button button-primary mt-2">Start learning</Link>
          </div>
        </nav>
      )}
    </header>
  )
}
