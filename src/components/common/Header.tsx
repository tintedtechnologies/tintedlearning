import { Coffee, Menu, X } from 'lucide-react'
import { SignInButton, useAuth, useClerk, useUser } from '@clerk/react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Learn', to: '/learn' },
  { label: 'Playground', to: '/playground' },
  { label: 'About', to: '/about' },
]

const donationUrl = 'https://www.buymeacoffee.com/tintedlearning'


type AccountUser = ReturnType<typeof useUser>['user']

/** The signed-in state is the name alone. Clicking it opens a menu with the dashboard and sign out. */
function AccountName({ user, onNavigate }: { user: AccountUser; onNavigate?: () => void }) {
  const { signOut } = useClerk()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!(event.target as Element).closest('[data-account-menu]')) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('click', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('click', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div data-account-menu className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" className="whitespace-nowrap text-sm font-bold text-teal hover:text-gold">
        {user?.firstName ?? user?.username ?? user?.fullName ?? 'Learner'}
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-12 z-20 min-w-40 rounded-2xl border border-line bg-white p-2 shadow-soft">
          <Link role="menuitem" to="/dashboard" onClick={() => { setOpen(false); onNavigate?.() }} className="block rounded-xl px-3 py-2 text-sm font-bold text-teal hover:bg-mist">Dashboard</Link>
          <button role="menuitem" type="button" onClick={() => { setOpen(false); onNavigate?.(); void signOut() }} className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold text-muted hover:bg-mist hover:text-teal">Sign out</button>
        </div>
      )}
    </div>
  )
}

/**
 * The signed-in state the header shows. It follows Clerk straight away, so sign in and sign out appear
 * instantly. The cross-fade in AuthSwitch makes the change smooth.
 */
function useAuthState() {
  const { isLoaded, isSignedIn } = useAuth()
  if (!isLoaded) return 'pending'
  return isSignedIn ? 'in' : 'out'
}

/**
 * The name and the Sign in button share one grid cell. The active one fades in and the other fades out,
 * so switching between signed in and signed out is smooth in both directions.
 */
function AuthSwitch({ state, user, onNavigate, mobile = false }: { state: 'pending' | 'in' | 'out'; user: AccountUser; onNavigate?: () => void; mobile?: boolean }) {
  const layer = (active: boolean) => `col-start-1 row-start-1 transition-[opacity,visibility] duration-300 ${active ? 'visible opacity-100' : 'invisible opacity-0'}`
  return (
    <div className={`grid ${mobile ? 'px-3 py-2' : 'justify-items-start'}`}>
      <div className={layer(state === 'in')} aria-hidden={state !== 'in'}>
        <AccountName user={user} onNavigate={onNavigate} />
      </div>
      <div className={layer(state === 'out')} aria-hidden={state !== 'out'}>
        <SignInButton mode="modal"><button type="button" className={`text-sm font-bold text-teal hover:text-gold ${mobile ? 'rounded-xl px-3 py-3 text-left hover:bg-mist' : ''}`}>Sign in</button></SignInButton>
      </div>
    </div>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const steadyState = useAuthState()
  const { user } = useUser()
  // Keep the last known user, so the avatar keeps its photo or initial while Clerk refreshes the user.
  const lastUser = useRef<AccountUser>(user)
  if (user) lastUser.current = user
  const displayUser = user ?? lastUser.current

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
          <AuthSwitch state={steadyState} user={displayUser} />
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
            <AuthSwitch state={steadyState} user={displayUser} onNavigate={() => setIsOpen(false)} mobile />
          </div>
        </nav>
      )}
    </header>
  )
}
