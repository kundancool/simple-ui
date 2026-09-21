import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
    plugins: [vue()],
    resolve: {
        /**
         * Tests run against `src`, not the built bundle, so `npm test` works on
         * a fresh clone with no prior build. The built package is still
         * verified end-to-end by `npm run build:docs`, which compiles every
         * docs example against `dist`.
         */
        alias: [{ find: /^@kundancool\/simple-ui$/, replacement: resolve(root, 'src/index.ts') }],
    },
    test: {
        environment: 'jsdom',
        include: ['tests/**/*.spec.ts'],
    },
})
