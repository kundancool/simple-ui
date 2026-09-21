import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

/**
 * Per-component ES build for on-demand imports.
 *
 * Emits dist/components/<dir>/index.js (+ shared chunks) so subpath
 * imports like `@kundancool/simple-ui/components/button` load only what
 * they use. The full bundle (vite.config.ts) stays untouched.
 */
function componentEntries() {
    const entries = {}
    const base = resolve(root, 'src/components')
    for (const dir of readdirSync(base, { withFileTypes: true })) {
        if (dir.isDirectory()) {
            entries[`components/${dir.name}/index`] = resolve(base, dir.name, 'index.ts')
        }
    }
    return entries
}

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
        dts({ entryRoot: 'src', outDir: 'dist', tsconfigPath: 'tsconfig.json', exclude: ['docs', 'tests', 'scripts', 'mcp'] }),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: false,
        cssCodeSplit: true,
        lib: {
            entry: componentEntries(),
            formats: ['es'],
        },
        rollupOptions: {
            external: ['vue', 'chart.js', 'vue-chartjs'],
            output: {
                preserveModules: true,
                preserveModulesRoot: 'src',
            },
        },
    },
})
