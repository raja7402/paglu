import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Supports both Vercel ('/' or './') and GitHub Pages ('/repo-name/' via VITE_BASE_PATH or automatic './')
export default defineConfig({
  base: process.env.VITE_BASE_PATH || './',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'three']
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    cors: true
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: true,
    cors: true
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-motion': ['framer-motion', 'gsap']
        }
      }
    }
  }
});
