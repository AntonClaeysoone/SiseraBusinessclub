import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Clear output directory before building
    emptyOutDir: true,
    // Ensure filenames include content hashes for cache busting
    rollupOptions: {
      output: {
        // Add hash to chunk filenames
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  // Ensure public files are copied correctly
  publicDir: 'public',
})
