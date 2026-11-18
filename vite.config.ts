import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  server: {
    host: '0.0.0.0',
  },
  plugins: [react()],
})
