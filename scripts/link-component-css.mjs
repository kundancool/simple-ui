/**
 * Links each component's emitted stylesheet into its subpath entry.
 *
 * The preserveModules build emits `<Name>.vue_vue_type_style_index_0_lang.css`
 * next to each component but nothing imports them — subpath consumers would
 * get unstyled components. Appending the import makes
 * `@kundancool/simple-ui/components/<dir>` self-sufficient for its own
 * `<style>` blocks (shared utilities + tokens still come from the main CSS).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const base = join(root, 'dist', 'components')

let linked = 0
for (const dir of readdirSync(base, { withFileTypes: true })) {
    if (!dir.isDirectory()) {
        continue
    }
    const folder = join(base, dir.name)
    const css = readdirSync(folder).filter((f) => f.endsWith('.css'))
    if (!css.length) {
        continue
    }
    const entry = join(folder, 'index.js')
    let code = readFileSync(entry, 'utf8')
    for (const file of css) {
        const stmt = `import "./${file}";`
        if (!code.includes(stmt)) {
            code += `\n${stmt}\n`
            linked++
        }
    }
    writeFileSync(entry, code)
}
console.log(`[component-css] linked ${linked} stylesheet(s)`);
