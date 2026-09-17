import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/index.css'
import { ClerkProvider } from '@clerk/react'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')

createRoot(document.getElementById('root')!).render(
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
