import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',  // This means current directory (frontend/)
  // or don't specify root - it defaults to where config is
})
