import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // Esta es la línea más importante.
  // Le dice a tu proyecto que vive dentro de la carpeta /sandinowebtest/
  base: '/sandinowebtest/',
  
  plugins: [react()],
  
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
