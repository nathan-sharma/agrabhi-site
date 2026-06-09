import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path' // Required to locate the physical HTML files

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/agrabhi-site",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        updates: resolve(__dirname, 'updates.html'),
        'data-hub': resolve(__dirname, 'data-hub.html'),
      },
    },
  },
})