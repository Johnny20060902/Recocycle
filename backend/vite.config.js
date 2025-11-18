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

    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      watch: { usePolling: true },
      cors: true,
      hmr: {
        host: 'localhost',
        protocol: 'ws',
        port: 5173,
      },
    },

    build: {
      outDir: 'public/build',
      manifest: true,
      emptyOutDir: true,

      // 👇 NO SE IMPORTA TERSER, SOLO SE ACTIVA
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },

      rollupOptions: {
        input: {
          app: 'resources/js/app.jsx',
        },
        output: {
          manualChunks: undefined,
        },
      },
    },

    resolve: {
      alias: {
        '@': '/resources/js',
      },
    },
  }
})
