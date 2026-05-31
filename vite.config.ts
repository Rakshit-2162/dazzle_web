import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Works for local + GitHub Pages
  base:
    process.env.NODE_ENV === 'production'
      ? '/dazzle-web/'
      : '/',
})