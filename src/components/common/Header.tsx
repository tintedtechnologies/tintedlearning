import { Menu, X } from 'lucide-react'
import { Show, SignInButton, useClerk, useUser } from '@clerk/react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Learn', to: '/learn' },
  { label: 'Playground', to: '/playground' },
  { label: 'About', to: '/about' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { user } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    if (!accountOpen) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('[data-account-menu]')) setAccountOpen(false)
    }
    document.addEventListener('click', closeOnOutsideClick)
    return () => document.removeEventListener('click', closeOnOutsideClick)
  }, [accountOpen])

  return (
    <header className="border-b border-line/80 bg-cream/90 backdrop-blur">
      <div className="shell flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img src="/tintedlearninglogo.png" alt="Tinted Learning logo" className="h-12 w-12 shrink-0 rounded-2xl object-contain transition-transform group-hover:-rotate-6" />
          <span>
            <span className="flex items-center gap-2"><span className="block font-display text-xl font-bold leading-none text-teal">Tinted Learning</span><span className="rounded-full bg-sand px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-teal">v0.6.0</span></span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-bold transition-colors ${isActive ? 'text-teal' : 'text-muted hover:text-teal'}`}>
              {item.label}
            </NavLink>
          ))}
          <Show when="signed-out"><SignInButton mode="modal"><button type="button" className="text-sm font-bold text-teal hover:text-gold">Sign in</button></SignInButton></Show>
          <Show when="signed-in"><div data-account-menu className="relative flex items-center gap-3"><button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-label="Open account menu" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gold text-sm font-bold text-teal ring-2 ring-transparent transition-all hover:ring-gold/40">{user?.imageUrl ? <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}</button><span className="text-sm font-bold text-teal">{user?.firstName ?? user?.username ?? 'Learner'}</span>{accountOpen && <div className="absolute right-0 top-12 z-20 min-w-40 rounded-2xl border border-line bg-white p-2 shadow-soft"><Link to="/dashboard" onClick={() => setAccountOpen(false)} className="block rounded-xl px-3 py-2 text-sm font-bold text-teal hover:bg-mist">Dashboard</Link><button type="button" onClick={() => signOut()} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-muted hover:bg-mist hover:text-teal">Sign out</button></div>}</div></Show>
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
            <Show when="signed-out"><SignInButton mode="modal"><button type="button" className="rounded-xl px-3 py-3 text-left font-bold text-teal hover:bg-mist">Sign in</button></SignInButton></Show>
            <Show when="signed-in"><div data-account-menu className="flex items-center gap-3 px-3 py-2"><button type="button" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen} aria-label="Open account menu" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gold text-sm font-bold text-teal">{user?.imageUrl ? <img src={user.imageUrl} alt="Profile" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}</button><span className="text-sm font-bold text-teal">{user?.firstName ?? user?.username ?? 'Learner'}</span></div>{accountOpen && <div className="ml-3 flex flex-col gap-1 border-l border-line pl-3"><Link to="/dashboard" onClick={() => { setAccountOpen(false); setIsOpen(false) }} className="rounded-xl px-3 py-2 text-sm font-bold text-teal hover:bg-mist">Dashboard</Link><button type="button" onClick={() => signOut()} className="rounded-xl px-3 py-2 text-left text-sm font-bold text-muted hover:bg-mist hover:text-teal">Sign out</button></div>}</Show>
          </div>
        </nav>
      )}
    </header>
  )
}
