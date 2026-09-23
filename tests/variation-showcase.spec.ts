import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Variation showcase contract: every `docs/examples/<dir>.<slug>.vue` file
 * declares its own section heading as `<!-- demo: Title — description -->`
 * on the first line. ComponentPage parses it; titles are never derived
 * from filenames (that produced `copy.vue.vue — Vue` class bugs).
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const examplesDir = join(root, 'docs', 'examples')

function variationFiles(): string[] {
    return readdirSync(examplesDir).filter((f) => f.endsWith('.vue') && f.split('.').length === 3)
}

function parseDemoHeader(raw: string): { title: string; description: string } | null {
    const match = raw.match(/<!--\s*demo:\s*([\s\S]*?)\s*-->/)
    if (!match) {
        return null
    }
    const [title, ...rest] = match[1].split('—')
    return { title: (title || '').trim(), description: rest.join('—').trim() }
}

describe('variation showcase', () => {
    it('every variation file declares a title and description', () => {
        const files = variationFiles()
        expect(files.length).toBeGreaterThan(20)
        const offenders: string[] = []
        for (const file of files) {
            const raw = readFileSync(join(examplesDir, file), 'utf8')
            const header = parseDemoHeader(raw)
            if (!header || !header.title || !header.description) {
                offenders.push(`${file}: needs <!-- demo: Title — description --> on the first line`)
            }
        }
        expect(offenders).toEqual([])
    })

    it('variation slugs belong to a real component dir', () => {
        const dirs = new Set(
            readdirSync(join(root, 'src', 'components'), { withFileTypes: true })
                .filter((d) => d.isDirectory())
                .map((d) => d.name),
        )
        const offenders = variationFiles().filter((f) => !dirs.has(f.split('.')[0]))
        expect(offenders).toEqual([])
    })
})
