import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  optimizeDeps: {
    include: ['mapbox-gl'], // Asegúrate de incluir Mapbox en los módulos optimizados
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Maneja módulos ES/JS mixtos
    },
  },
});
