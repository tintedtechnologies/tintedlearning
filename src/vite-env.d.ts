/// <reference types="vite/client" />

/**
 * Environment variables the site reads at build time.
 * Vite exposes any variable that starts with VITE_ automatically, so none of them need an entry in vite.config.ts.
 * Locally they come from .env.local. On GitHub Pages they come from the repository secrets named in .github/workflows/deploy.yml.
 */
interface ImportMetaEnv {
  /** Clerk publishable key. Required: sign in does not work without it. */
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string
  /** Google Form "viewform" link for the feedback button. The button is hidden when this is missing. */
  readonly VITE_FEEDBACK_FORM_URL?: string
  /** Google Form "viewform" link for the newsletter signup. The signup is hidden when this is missing. */
  readonly VITE_NEWSLETTER_FORM_URL?: string
  /** Google Analytics measurement ID. Analytics is off when this is missing. */
  readonly VITE_GA_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
