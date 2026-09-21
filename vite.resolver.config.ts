import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/**
 * Resolver build: ES-only helper for unplugin-vue-components.
 */
export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
            entry: resolve(root, 'src/resolver.ts'),
            name: 'SimpleUIResolver',
            formats: ['es'],
            fileName: () => 'resolver.js',
        },
        rollupOptions: {
            external: ['vue'],
        },
    },
})
