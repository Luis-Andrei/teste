import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: true,
    port: 5500,
    open: true,
    strictPort: true,
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  },
  publicDir: 'public',
  root: '.'
})