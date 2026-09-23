import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Layout neutrality — the godly rule (docs/spec/01-design-principles.md §0).
 *
 * A component MUST NOT shift its surroundings by default: root elements carry
 * no outer margins. Spacing between components belongs to the consumer
 * (parent gap / space-y) or to layout components (s-form-item, s-layout).
 * Internal rhythm (label→control, control→error) is unaffected.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const componentsDir = join(root, 'src', 'components')

/** Matches Tailwind outer-margin utilities: m-4, mb-4, mt-1, mx-auto, … */
const MARGIN = /\bm([trblxyse]-|-\d)/

/**
 * `s-section-heading` centers itself with `mx-auto` only when the consumer
 * explicitly opts into `align="center"` (default is left, margin-free).
 * Explicit layout opt-ins are allowed; default margins are not.
 */
const EXCEPTIONS = new Map([['section-heading', 'mx-auto under explicit align="center"']])

function rootTag(source: string): string {
    const template = source.slice(source.indexOf('<template>') + '<template>'.length)
    const stripped = template.replace(/<!--[\s\S]*?-->/g, '')
    const open = stripped.search(/<[a-zA-Z]/)
    const tag = stripped.slice(open)
    let depth = 0
    let inQuote = ''
    for (let i = 0; i < tag.length; i++) {
        const ch = tag[i]
        if (inQuote) {
            if (ch === inQuote) {
                inQuote = ''
            }
        } else if (ch === '"' || ch === "'") {
            inQuote = ch
        } else if (ch === '>') {
            return tag.slice(0, i + 1)
        }
    }
    return tag
}

describe('layout neutrality', () => {
    it('no component root carries an outer margin utility', () => {
        const offenders: string[] = []
        for (const entry of readdirSync(componentsDir, { withFileTypes: true })) {
            if (!entry.isDirectory()) {
                continue
            }
            for (const file of readdirSync(join(componentsDir, entry.name)).filter((f) => f.endsWith('.vue'))) {
                const source = readFileSync(join(componentsDir, entry.name, file), 'utf8')
                const tag = rootTag(source)
                // Strip the one sanctioned exception before scanning (see EXCEPTIONS).
                const scannable = EXCEPTIONS.has(entry.name) ? tag.replace(/mx-auto/g, '') : tag
                const match = scannable.match(MARGIN)
                if (match) {
                    offenders.push(`${entry.name}/${file}: root contains outer margin \`${match[0]}…\``)
                }
            }
        }
        expect(offenders).toEqual([])
    })

    it('form controls render margin-free by default', async () => {
        const targets = [
            '../src/components/input/SInput.vue',
            '../src/components/select/SSelect.vue',
            '../src/components/checkbox/SCheckbox.vue',
            '../src/components/date-picker/SDatePicker.vue',
            
            '../src/components/multi-select/SMultiSelect.vue',
            '../src/components/number-input/SNumberInput.vue',
            '../src/components/upload/SUpload.vue',
            '../src/components/filter/SFilter.vue',
        ]
        for (const path of targets) {
            const { default: Component } = await import(path)
            for (const classes of [mount(Component).classes(), mount(Component, { props: { inline: true } }).classes()]) {
                expect(classes.filter((c) => MARGIN.test(c)), path).toEqual([])
            }
        }
    })
})
