import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Base condicional:
  // - Producción (GitHub Pages): /sandinowebtest/
  // - Desarrollo (vite/preview): /
  base: process.env.NODE_ENV === 'production' ? '/sandinowebtest/' : '/',

  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    open: true,
  },
})
