import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      input: 'src/client/main.jsx',
      output: {
        dir: 'dist',
        entryFileNames: 'main.js',
        format: 'iife',
        name: 'LTOApp',
      },
    },
  },
  server: {
    port: 5173,
    cors: true,
  },
});

