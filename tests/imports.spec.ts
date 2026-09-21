import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Every component used in a template must be imported (or locally defined).
 * An unimported icon/component renders nothing in dev and throws
 * `X is not defined` in production — this test fails the build instead.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function vueFiles(dir: string): string[] {
    const out: string[] = []
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules') {
                out.push(...vueFiles(full))
            }
        } else if (entry.name.endsWith('.vue')) {
            out.push(full)
        }
    }
    return out
}

function kebabToPascal(tag: string): string {
    return tag
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
}

describe('component import coverage', () => {
    const files = [...vueFiles(join(root, 'docs')), ...vueFiles(join(root, 'src', 'components'))]
    expect(files.length).toBeGreaterThan(50)

    for (const file of files) {
        it(`${file.replace(root + '/', '')} imports what it renders`, () => {
            const source = readFileSync(file, 'utf8')
            const template = source.split('<script')[0]

            const used = new Set<string>()
            for (const match of template.matchAll(/<([A-Z][A-Za-z0-9]*|s-[a-z0-9-]+)/g)) {
                used.add(match[1])
            }
            // icon: X references in data arrays (nav items, menus)
            for (const match of source.matchAll(/icon:\s*([A-Z][A-Za-z0-9]*)/g)) {
                used.add(match[1])
            }

            const script = source.includes('<script') ? source.slice(source.indexOf('<script')) : ''
            const imported = new Set<string>()
            for (const match of script.matchAll(/import\s*\{([^}]*)\}/g)) {
                for (const name of match[1].split(',')) {
                    const clean = name.trim().split(/\s+as\s+/).pop()?.trim()
                    if (clean) {
                        imported.add(clean)
                    }
                }
            }
            for (const match of script.matchAll(/import\s+([A-Za-z0-9_]+)\s+from/g)) {
                imported.add(match[1])
            }
            const defined = new Set<string>()
            for (const match of script.matchAll(/(?:const|let|function)\s+([A-Za-z0-9_]+)/g)) {
                defined.add(match[1])
            }

            const missing = [...used]
                .map((tag) => (tag.startsWith('s-') ? kebabToPascal(tag) : tag))
                .filter((name) => !imported.has(name) && !defined.has(name))
                .filter((name) => !['Transition', 'TransitionGroup', 'Teleport', 'KeepAlive', 'Suspense', 'Slot', 'Component'].includes(name))
            expect(missing, file).toEqual([])
        })
    }
})
