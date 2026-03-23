import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include: ['pdfjs-dist'] },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Reduce oversized chunks by splitting heavy PDF libraries.
          // They are only needed on the specific tool pages (already lazy-loaded),
          // but manualChunks keeps them from being bundled into one >1MB chunk.
          pdfLib: ['pdf-lib'],
          pdfJs: ['pdfjs-dist'],
          jspdf: ['jspdf'],
          image: ['browser-image-compression'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
