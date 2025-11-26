import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: true,
    allowedHosts: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    proxy: {
      '/api/places': {
        target: 'https://maps.googleapis.com/maps/api/place',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/places/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
          });
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
