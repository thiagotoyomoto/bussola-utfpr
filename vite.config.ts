import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // `process.cwd()` em vez de `__dirname`: o config é ESM
      // (`"type": "module"`), onde `__dirname` não existe.
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
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
