import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // On GitHub Pages the app is served under /<repo>/. The deploy workflow sets
  // VITE_BASE to "/<repo>/"; locally it stays "/".
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    // Firebase's SDK is ~170 kB gzipped on its own; that's expected.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split heavy vendors into their own cached chunks.
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
