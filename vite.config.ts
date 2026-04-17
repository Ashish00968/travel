import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion') || id.includes('@framer')) return 'framer';
            if (id.includes('@googlemaps') || id.includes('google-maps')) return 'maps';
            if (id.includes('lite-youtube')) return 'yt';
            return 'vendor';
          }
        }
      }
    }
  }
})
