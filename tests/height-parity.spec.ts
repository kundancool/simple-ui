import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import SInput from '../src/components/input/SInput.vue'
import SSelect from '../src/components/select/SSelect.vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'
import SMultiSelect from '../src/components/multi-select/SMultiSelect.vue'
import SNumberInput from '../src/components/number-input/SNumberInput.vue'
import SButton from '../src/components/button/SButton.vue'
import SAvatar from '../src/components/avatar/SAvatar.vue'
import SIcon from '../src/components/icon/SIcon.vue'
import STag from '../src/components/tag/STag.vue'
import SRating from '../src/components/rating/SRating.vue'
import SProgress from '../src/components/progress/SProgress.vue'
import SSpinner from '../src/components/spinner/SSpinner.vue'
import SSectionHeading from '../src/components/section-heading/SSectionHeading.vue'
import SCta from '../src/components/cta/SCta.vue'
import SCheckbox from '../src/components/checkbox/SCheckbox.vue'
import SRadio from '../src/components/radio/SRadio.vue'
import IconRender from '../src/icons/IconRender.vue'
import { FIELD_HEIGHTS, FIELD_SIZES, isFieldSize } from '../src/utils/fieldSize'

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

    it('covers the full t-shirt scale xs to 3xl', () => {
        expect(FIELD_SIZES).toEqual(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'])
        for (const size of FIELD_SIZES) {
            expect(isFieldSize(size), size).toBe(true)
        }
        for (const bad of ['xxl', 'huge', '', 'MD']) {
            expect(isFieldSize(bad), bad).toBe(false)
        }
        expect(isFieldSize(undefined)).toBe(true)
    })

    it('every sized component accepts the full scale without warnings', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const cases: Array<[any, Record<string, unknown>, Record<string, unknown>]> = [
            [SButton, { size: '3xl' }, { default: 'Go' }],
            [SAvatar, { size: '3xl', name: 'Aarav Sharma' }, {}],
            [SIcon, { size: '3xl', name: 'check' }, {}],
            [STag, { size: '3xl' }, { default: 'New' }],
            [SRating, { size: '3xl', modelValue: 3 }, {}],
            [SProgress, { size: '3xl', value: 50 }, {}],
            [SSpinner, { size: '3xl' }, {}],
            [SSectionHeading, { size: '3xl', title: 'T' }, {}],
            [SCta, { size: '3xl', title: 'T' }, {}],
            [SInput, { size: '3xl' }, {}],
            [SSelect, { size: '3xl' }, {}],
            [SDatePicker, { size: '3xl' }, {}],
            [SMultiSelect, { size: '3xl' }, {}],
            [SNumberInput, { size: '3xl' }, {}],
            [SCheckbox, { size: '3xl', label: 'X' }, {}],
            [SRadio, { size: '3xl', value: 'a' }, { default: 'A' }],
            [IconRender, { size: '3xl', icon: 'check' }, {}],
        ]
        for (const [Component, props, slots] of cases) {
            const wrapper = mount(Component, { props, slots })
            expect(wrapper.html().length).toBeGreaterThan(0)
            wrapper.unmount()
        }
        expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Invalid prop'))
        warn.mockRestore()
    })

    it('IconRender mirrors SIcon glyph sizes', () => {
        const XIcon = { name: 'X', render: () => h('svg') }
        const expected = { xs: 'w-3.5', sm: 'w-4', md: 'w-4', lg: 'w-5', xl: 'w-6', '2xl': 'w-8', '3xl': 'w-10' }
        for (const [size, width] of Object.entries(expected)) {
            const wrapper = mount(IconRender, { props: { size, icon: XIcon } })
            expect(wrapper.classes(), size).toContain(width)
            wrapper.unmount()
        }
    })

    it('buttons map every size to a distinct height', () => {
        const heights = ['h-6', 'h-7', 'h-9', 'h-10', 'h-11', 'h-12', 'h-14']
        FIELD_SIZES.forEach((size, i) => {
            const wrapper = mount(SButton, { props: { size }, slots: { default: 'Go' } })
            expect(wrapper.classes(), size).toContain(heights[i])
            wrapper.unmount()
        })
    })

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
