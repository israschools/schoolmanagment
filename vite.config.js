import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages fix — repo name ke sath match karna zaroori hai
export default defineConfig({
  base: '/schoolmanagment/',   // ← aapka exact repo name
  plugins: [react()],
})
