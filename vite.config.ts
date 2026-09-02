import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Air-Drawing-And-Sign-Language-Detection/',

  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: true,
    port: 5173,
  },

  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision'],
  },
})