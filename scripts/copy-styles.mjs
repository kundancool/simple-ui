/**
 * Copies the standalone tokens stylesheet into dist so single-component
 * users can import just `@kundancool/simple-ui/styles/tokens.css`.
 */
import { copyFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(join(root, 'dist', 'styles'), { recursive: true })
copyFileSync(join(root, 'src', 'styles', 'tokens.css'), join(root, 'dist', 'styles', 'tokens.css'))
console.log('[styles] dist/styles/tokens.css')
