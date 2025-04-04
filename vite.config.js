import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8080,
        strictPort: true,
        hmr: {
            overlay: false
        },
        watch: {
            usePolling: true,
            interval: 1000
        },
        cors: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
})