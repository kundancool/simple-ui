import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Single-indicator focus contract (docs/spec/01 §Focus & touch).
 *
 * A focused field shows exactly one indicator: the accent border plus the
 * theme halo. Native outlines must be dead everywhere, including engines
 * that draw their own (Firefox :-moz-focusring on selects) — otherwise the
 * user sees a border AND an outline.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tokens = readFileSync(join(root, 'src', 'styles', 'tokens.css'), 'utf8')

function block(selector: string): string {
    const match = tokens.match(new RegExp(`${selector.replace(/[.:-]/g, (c) => `\\${c}`)}\\s*\\{([^}]*)\\}`))
    return match?.[1] ?? ''
}

describe('focus system', () => {
    it('fields kill the native outline and show a single halo', () => {
        const focus = block('.s-input:focus')
        expect(focus, '.s-input:focus exists').not.toBe('')
        expect(focus).toMatch(/outline\s*:\s*none/)
        expect(focus.match(/box-shadow\s*:/g)).toHaveLength(1)
    })

    it('resets the Firefox select ring that ignores outline:none', () => {
        const reset = block('select.s-input:-moz-focusring')
        expect(reset, 'firefox reset exists').not.toBe('')
        expect(reset).toMatch(/outline\s*:\s*none/)
    })

    it('the palette bar owns the single focus indicator', () => {
        const source = readFileSync(join(root, 'src', 'components', 'search-palette', 'SSearchPalette.vue'), 'utf8')
        const bar = source.match(/\.s-palette-bar:focus-within\s*\{([^}]*)\}/)?.[1] ?? ''
        expect(bar, 'bar focus-within rule exists').not.toBe('')
        expect(bar.match(/box-shadow\s*:/g)).toHaveLength(1)
        // no second indicator on the input itself
        expect(source).not.toMatch(/\.s-palette-input:focus-visible\s*\{[^}]*box-shadow/)
    })

    it('every native select carries s-input so the resets apply', () => {
        const offenders: string[] = []
        const walk = (dir: string) => {
            for (const entry of readdirSync(dir, { withFileTypes: true })) {
                const full = join(dir, entry.name)
                if (entry.isDirectory()) {
                    walk(full)
                } else if (entry.name.endsWith('.vue')) {
                    const source = readFileSync(full, 'utf8')
                    for (const match of source.matchAll(/<select\b([^>]*)>/g)) {
                        if (!match[1].includes('s-input')) {
                            offenders.push(`${full.replace(`${root}/`, '')}: select without s-input`)
                        }
                    }
                }
            }
        }
        walk(join(root, 'src', 'components'))
        expect(offenders).toEqual([])
    })
})
