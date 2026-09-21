import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Docs demo app build (static output for GitHub Pages).
 *
 * `npm run dev:docs` to iterate, `npm run build:docs` to ship.
 */
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    root: 'docs',
    base: './',
    build: {
        outDir: '../docs-dist',
        emptyOutDir: true,
    },
    server: {
        port: 5174,
    },
})
