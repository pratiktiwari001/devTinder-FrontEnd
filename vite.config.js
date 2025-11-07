import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        // Must match your backend's local running port
        target: 'http://localhost:7777',
        changeOrigin: true,
        // *** This line removes the '/api' prefix ***
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
})