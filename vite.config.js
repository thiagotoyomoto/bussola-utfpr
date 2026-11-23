import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/search': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/registry': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
