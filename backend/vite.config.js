import { defineConfig, loadEnv } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {

    // Cargar variables del .env, prefijo VITE_
    const env = loadEnv(mode, process.cwd(), 'VITE_')

    return {
        plugins: [
            laravel({
                input: [
                    'resources/css/app.css',
                    'resources/js/app.jsx',
                ],
                refresh: true,
                buildDirectory: 'build',
            }),
            react(),
        ],

        resolve: {
            alias: {
                '@': '/resources/js',
            },
        },

        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            watch: { usePolling: true },
            hmr: {
                host: 'localhost',
                protocol: 'ws',
                port: 5173,
            },
        },

        build: {
            minify: "terser",
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
        },
    }
})
