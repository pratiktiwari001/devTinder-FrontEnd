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
        // HTTP API Proxy (for REST calls)
        target: 'http://localhost:7777',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), 
      },
      // --- FIX: Add Socket.io/WebSocket Proxy ---
      // This rule intercepts the standard Socket.io handshake requests
      // and forwards them to your Node.js server on port 7777,
      // enabling the necessary WebSocket upgrade.
      '/socket.io': {
        target: 'http://localhost:7777', // Target your backend server port
        ws: true, 
        changeOrigin: true,
      },
    },
  },
})