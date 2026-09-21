import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/**
 * Library build: ES + UMD bundles, compiled stylesheet, declarations.
 */
export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({ entryRoot: 'src', outDir: 'dist', tsconfigPath: 'tsconfig.json', exclude: ['docs', 'tests', 'scripts', 'mcp'] }),
    ],
    build: {
        outDir: 'dist',
        // Never wipe in watch mode: emptyOutDir deletes dist/ mid-rebuild and
        // the docs dev server (which imports the built bundle) 404s, unmounting
        // the whole preview. Fixed output names overwrite cleanly instead.
        emptyOutDir: false,
        cssCodeSplit: false,
        lib: {
            entry: resolve(root, 'src/index.ts'),
            name: 'SimpleUI',
            formats: ['es', 'umd'],
            fileName: (format) => (format === 'es' ? 'simple-ui.js' : 'simple-ui.umd.cjs'),
        },
        rollupOptions: {
            external: ['vue', 'chart.js', 'vue-chartjs'],
            output: {
                globals: { vue: 'Vue', 'chart.js': 'Chart', 'vue-chartjs': 'VueChartJs' },
                assetFileNames: (asset) =>
                    asset.name === 'style.css' ? 'simple-ui.css' : asset.name ?? '[name][extname]',
            },
        },
    },
})
