import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx',
            ],
            refresh: true,

            // 👇 ESTA ES LA CLAVE
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
})
