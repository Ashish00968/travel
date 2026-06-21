import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/travel/' : '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    reportCompressedSize: false,   // speeds up build output step
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core — must stay together for hook reconciler
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) return 'react-core'
          // Framer Motion — large animation runtime, lazy-loaded with components
          if (id.includes('node_modules/framer-motion')) return 'framer'
          // Mapbox GL JS — very large (~1.6MB), only loaded when MapContainer mounts
          if (id.includes('node_modules/mapbox-gl')) return 'mapbox'
          // Turf.js — geospatial helpers, used only inside MapContainer
          if (id.includes('node_modules/@turf')) return 'turf'
          // Zustand — tiny state management
          if (id.includes('node_modules/zustand')) return 'zustand'
        }
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion', 'zustand'],
  },
})
