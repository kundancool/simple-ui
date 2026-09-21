/**
 * Links the package to itself (node_modules/@kundancool/simple-ui → root)
 * so docs import the BUILT library by package name, exactly like consumers.
 * Runs on postinstall and before docs dev/build.
 */
import { existsSync, mkdirSync, symlinkSync, readlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(
    (await import('node:fs')).readFileSync(join(root, 'package.json'), 'utf8'),
)
const scopeDir = join(root, 'node_modules', '@kundancool')
const link = join(scopeDir, 'simple-ui')

mkdirSync(scopeDir, { recursive: true })
try {
    if (existsSync(link) && readlinkSync(link) === root) {
        process.exit(0)
    }
} catch {
    // missing or foreign — recreate below
}
try {
    if (existsSync(link)) {
        ;(await import('node:fs')).rmSync(link, { recursive: true, force: true })
    }
    symlinkSync(root, link, 'junction')
    console.log(`[link-self] ${pkg.name} → node_modules (docs use the built package)`)
} catch (error) {
    console.error('[link-self] failed:', error.message)
    process.exit(1)
}
