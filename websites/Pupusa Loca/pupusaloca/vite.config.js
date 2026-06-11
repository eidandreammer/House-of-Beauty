import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        index: resolve(projectRoot, 'index.html'),
        menu: resolve(projectRoot, 'menu.html'),
      },
    },
  },
  plugins: [react()],
})
