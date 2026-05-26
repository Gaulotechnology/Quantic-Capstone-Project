import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
      '/api/cvs': {
        target: 'http://127.0.0.1:8002',
        changeOrigin: true,
      },
      '/api/vectors': {
        target: 'http://127.0.0.1:8003',
        changeOrigin: true,
      },
      '/api/matching': {
        target: 'http://127.0.0.1:8004',
        changeOrigin: true,
      },
      '/api/jobs': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
      },
      '/api/applications': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
      },
      '/api/shortlists': {
        target: 'http://127.0.0.1:8005',
        changeOrigin: true,
        timeout: 60000,
        proxyTimeout: 60000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('proxy error', err);
          });
        }
      },
    },
  },
})
