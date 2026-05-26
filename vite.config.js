import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 3000,

    allowedHosts: ['mnemikon.duckdns.org'],

    hmr: {
      protocol: 'wss',
      host: 'mnemikon.duckdns.org',
      clientPort: 443
    }
  },

  build: {
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios'],
        }
      }
    }
  }
})
