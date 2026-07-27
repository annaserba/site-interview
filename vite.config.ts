import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // /api/rag/* тоже обслуживает api.mjs — отдельный RAG-процесс в dev не нужен
      '/api': 'http://127.0.0.1:3001',
    },
  },
})
