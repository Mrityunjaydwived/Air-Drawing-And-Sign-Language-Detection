import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Use relative base path for seamless GitHub Pages deployment under any repository subfolder
  base: './',
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
