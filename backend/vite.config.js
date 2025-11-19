import { defineConfig, loadEnv } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {

    // 📌 Cargar variables del .env
    const env = loadEnv(mode, process.cwd(), '')

    return {
        define: {
            // 📌 Esto permite usar process.env.VARIABLE en React
            'process.env': env,
        },

        plugins: [
            laravel({
                input: [
                    'resources/css/app.css',
                    'resources/js/app.jsx',
                ],
                refresh: true,

                // Carpeta donde Vite construye los assets
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
