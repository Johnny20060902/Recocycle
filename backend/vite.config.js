import { defineConfig, loadEnv } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      laravel({
        input: ['resources/js/app.jsx', 'resources/css/app.css'],
        refresh: true,
      }),
      react(),
    ],

    // 🌐 Servidor de desarrollo dentro de Docker
    server: {
      host: '0.0.0.0', // Escucha dentro del contenedor Node
      port: 5173,
      strictPort: true,
      watch: { usePolling: true }, // Arregla el hot reload en Docker Desktop
      cors: true, // Permite acceso desde Laravel (localhost:8080)
      hmr: {
        host: 'localhost', // Lo que ve tu navegador
        protocol: 'ws',
        port: 5173,
      },
    },

    // 🏗️ Build de producción (npm run build)
    build: {
      outDir: 'public/build',
      manifest: true,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
      // ⚙️ Esto asegura que el manifest quede directamente en /public/build
      manifestDir: '.', 
    },

    // 🔍 Alias de recursos
    resolve: {
      alias: {
        '@': '/resources/js',
      },
    },
  }
})
