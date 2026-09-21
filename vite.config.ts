import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/**
 * Library build: ESM bundle with a lazy chart chunk, compiled stylesheet,
 * declarations.
 *
 * ESM only on purpose: chart.js is an optional peer and charts are reached
 * through a dynamic import. A UMD/CJS build cannot code-split, so it would
 * inline a hard `require('chart.js')` and break every consumer who has not
 * installed the chart peers.
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
            formats: ['es'],
            fileName: () => 'simple-ui.js',
        },
        rollupOptions: {
            external: ['vue', 'chart.js', 'vue-chartjs'],
            output: {
                assetFileNames: (asset) =>
                    asset.name === 'style.css' ? 'simple-ui.css' : asset.name ?? '[name][extname]',
            },
        },
    },
})
