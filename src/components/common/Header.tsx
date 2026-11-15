import { Coffee, Menu, X } from 'lucide-react'
import { SignInButton, useAuth, useUser } from '@clerk/react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Learn', to: '/learn' },
  { label: 'Playground', to: '/playground' },
  { label: 'About', to: '/about' },
]

const donationUrl = 'https://www.buymeacoffee.com/tintedlearning'

/** The signed-in state is the avatar alone. It links to the dashboard, where account controls live. */
function AccountAvatar({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useUser()
  return (
    <Link to="/dashboard" onClick={onNavigate} aria-label="Go to your dashboard" className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gold text-sm font-bold text-teal ring-2 ring-transparent transition-all hover:ring-gold/40">
      {user?.imageUrl ? <img src={user.imageUrl} alt="" className="h-full w-full object-cover" /> : (user?.firstName?.[0] ?? 'L')}
    </Link>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { isLoaded, isSignedIn } = useAuth()

  return (
    <header className="border-b border-line/80 bg-cream/90 backdrop-blur">
      <div className="shell flex h-20 items-center justify-between">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setIsOpen(false)}>
          <img src="/tintedlearninglogo.png" alt="Tinted Learning logo" className="h-12 w-12 shrink-0 rounded-2xl object-contain transition-transform group-hover:-rotate-6" />
          <span>
            <span className="flex items-center gap-2"><span className="block font-display text-xl font-bold leading-none text-teal">Tinted Learning</span><span className="rounded-full bg-sand px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-teal">v1.0.6</span></span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `text-sm font-bold transition-colors ${isActive ? 'text-teal' : 'text-muted hover:text-teal'}`}>
              {item.label}
            </NavLink>
          ))}
          <a href={donationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-teal hover:text-gold"><Coffee size={16} />Donate</a>
          {!isLoaded ? <span className="h-10 w-10" aria-hidden="true" /> : !isSignedIn ? <SignInButton mode="modal"><button type="button" className="text-sm font-bold text-teal hover:text-gold">Sign in</button></SignInButton> : <AccountAvatar />}
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
            <a href={donationUrl} target="_blank" rel="noreferrer" onClick={() => setIsOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-left font-bold text-teal hover:bg-mist"><Coffee size={17} />Donate</a>
            {!isLoaded ? null : !isSignedIn ? <SignInButton mode="modal"><button type="button" className="rounded-xl px-3 py-3 text-left font-bold text-teal hover:bg-mist">Sign in</button></SignInButton> : <div className="px-3 py-2"><AccountAvatar onNavigate={() => setIsOpen(false)} /></div>}
          </div>
        </nav>
      )}
    </header>
  )
}
