import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The spec library is the project's working memory. It must exist, be
 * indexed, and be reachable from the human entry points — otherwise a fresh
 * clone (human or agent) cannot work spec-first.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const SPECS = [
    'README.md',
    '00-overview.md',
    '01-design-principles.md',
    '02-tokens-theming.md',
    '03-component-contract.md',
    '04-component-workflow.md',
    '05-docs-demo-registry.md',
    '06-testing.md',
    '07-packaging-release.md',
    '08-vocabulary.md',
    '09-local-setup.md',
    '10-mcp-agents.md',
]

describe('spec index', () => {
    it('every spec file exists and is substantive', () => {
        for (const file of SPECS) {
            const full = join(root, 'docs', 'spec', file)
            expect(existsSync(full), `${file} exists`).toBe(true)
            expect(readFileSync(full, 'utf8').trim().length, `${file} non-empty`).toBeGreaterThan(500)
        }
    })

    it('the spec README indexes every spec', () => {
        const index = readFileSync(join(root, 'docs', 'spec', 'README.md'), 'utf8')
        for (const file of SPECS.filter((f) => f !== 'README.md')) {
            expect(index.includes(file), `README indexes ${file}`).toBe(true)
        }
    })

    it('human entry points link to the spec library', () => {
        for (const entry of ['AGENTS.md', 'DESIGN.md', 'CONTRIBUTING.md', 'README.md']) {
            const source = readFileSync(join(root, entry), 'utf8')
            expect(source.includes('docs/spec'), `${entry} links docs/spec`).toBe(true)
        }
    })
})
