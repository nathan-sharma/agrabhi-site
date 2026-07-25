import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path' // Required to locate the physical HTML files

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        updates: resolve(__dirname, 'updates.html'),
        'dashboard': resolve(__dirname, 'dashboard.html'),
      },
    },
  },
})