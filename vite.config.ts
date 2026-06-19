import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 5173,
  },
  // Works for local + GitHub Pages
  base:
    process.env.NODE_ENV === 'production'
      ? '/dazzle_web/'
      : '/',
})