import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/python': 'http://localhost:5000',
      '/api/go': 'http://localhost:8080'
    }
  }
})