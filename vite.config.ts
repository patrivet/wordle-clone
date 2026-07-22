import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const wordleProxy = {
  target: 'https://www.nytimes.com',
  changeOrigin: true,
  rewrite: (path: string) => path.replace(/^\/api\/wordle/, '/svc/wordle/v2'),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/wordle': wordleProxy,
    },
  },
  preview: {
    proxy: {
      '/api/wordle': wordleProxy,
    },
  },
})
