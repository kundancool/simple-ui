import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import SInput from '../src/components/input/SInput.vue'
import SSelect from '../src/components/select/SSelect.vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'
import SMultiSelect from '../src/components/multi-select/SMultiSelect.vue'
import SNumberInput from '../src/components/number-input/SNumberInput.vue'
import { FIELD_HEIGHTS } from '../src/utils/fieldSize'

/**
 * Control height contract (docs/spec/01 §Control height contract).
 *
 * A row of mixed controls lines up by construction: every single-line form
 * control resolves `--s-field-h` from the one shared scale, at every size.
 * A select next to an input must never look taller or shorter.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const CONTROLS = { SInput, SSelect, SDatePicker, SMultiSelect, SNumberInput }

function fieldHeight(wrapper) {
    const el = wrapper.find('[style*="--s-field-h"]')
    expect(el.exists(), `${wrapper.vm.$options.name} sets --s-field-h`).toBe(true)
    return (el.element as HTMLElement).style.getPropertyValue('--s-field-h').trim()
}

describe('height parity', () => {
    for (const size of Object.keys(FIELD_HEIGHTS)) {
        it(`every control resolves ${FIELD_HEIGHTS[size]} at size ${size}`, () => {
            for (const [name, Component] of Object.entries(CONTROLS)) {
                const wrapper = mount(Component, { props: { size } })
                expect(fieldHeight(wrapper), `${name}@${size}`).toBe(FIELD_HEIGHTS[size])
                wrapper.unmount()
            }
        })
    }

    it('defaults resolve the md height', () => {
        for (const [name, Component] of Object.entries(CONTROLS)) {
            const wrapper = mount(Component)
            expect(fieldHeight(wrapper), name).toBe(FIELD_HEIGHTS.md)
            wrapper.unmount()
        }
    })

    it('no control duplicates the height literals (single shared scale)', () => {
        const offenders: string[] = []
        for (const file of [
            'src/components/input/SInput.vue',
            'src/components/select/SSelect.vue',
            'src/components/date-picker/SDatePicker.vue',
            'src/components/multi-select/SMultiSelect.vue',
            'src/components/number-input/SNumberInput.vue',
        ]) {
            const source = readFileSync(join(root, file), 'utf8')
            if (!source.includes("from '../../utils/fieldSize'")) {
                offenders.push(`${file}: must resolve heights from utils/fieldSize`)
            }
            for (const literal of ["'28px'", "'32px'", "'36px'", "'40px'"]) {
                if (source.includes(literal)) {
                    offenders.push(`${file}: duplicated height literal ${literal}`)
                }
            }
        }
        expect(offenders).toEqual([])
    })
})
