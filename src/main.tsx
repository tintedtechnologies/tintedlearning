import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { ClerkProvider } from '@clerk/react'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = document.getElementById('root')!

if (!clerkPublishableKey) {
  root.innerHTML = '<main style="min-height:100vh;display:grid;place-items:center;padding:2rem;background:#f7f5ef;color:#183735;font-family:DM Sans, sans-serif"><section style="max-width:38rem"><p style="font-size:.75rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#5e6f6c">Tinted Learning setup</p><h1 style="margin:1rem 0;font-family:Fraunces,serif;font-size:clamp(2.25rem,7vw,4rem);line-height:1.05;color:#123f3d">Add your Clerk publishable key.</h1><p style="font-size:1.1rem;line-height:1.7;color:#5e6f6c">Create a <code style="color:#123f3d">.env.local</code> file in the project root and add <code style="color:#123f3d">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</code>, then restart the dev server.</p></section></main>'
} else {
  createRoot(root).render(
    <StrictMode>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        appearance={{
          variables: {
            colorPrimary: '#123F3D',
            colorBackground: '#F7F5EF',
            borderRadius: '1rem',
            fontFamily: 'DM Sans, sans-serif',
          },
          elements: {
            card: 'border border-line shadow-soft',
            headerTitle: 'font-display text-teal',
            headerSubtitle: 'text-muted',
            formButtonPrimary: 'bg-teal hover:bg-[#0c3432] text-white',
            socialButtonsBlockButton: 'border-line text-teal hover:bg-mist',
            formFieldInput: 'border-line focus:border-gold focus:ring-gold',
            footerActionLink: 'text-teal hover:text-gold',
            identityPreviewEditButton: 'text-teal hover:text-gold',
          },
        }}
      >
        <HashRouter>
          <App />
        </HashRouter>
      </ClerkProvider>
    </StrictMode>,
  )
}
