import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@xxr': path.resolve(__dirname, 'src/xxr'),
    },
    dedupe: ['three'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'r3f': ['@react-three/fiber', '@react-three/drei', '@react-three/xr'],
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    target: 'esnext',
    minify: 'esbuild',
  },
})
