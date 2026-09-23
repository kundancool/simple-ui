import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SDateRangePicker from '../src/components/date-range-picker/SDateRangePicker.vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'
import { isIsoDate, normalizePreset, resolvePresets } from '../src/utils/datePresets'

/**
 * Shortcut contract (docs/spec/03 API conventions): consumers override via
 * `presets`, malformed entries are ignored — never thrown on or emitted.
 */
describe('date preset validation', () => {
    it('accepts real calendar dates, rejects impossible ones', () => {
        expect(isIsoDate('2026-09-21')).toBe(true)
        expect(isIsoDate('2026-02-30')).toBe(false)
        expect(isIsoDate('21-09-2026')).toBe(false)
        expect(isIsoDate('')).toBe(false)
        expect(isIsoDate(null)).toBe(false)
    })

    it('normalizes range presets and rejects bad shapes', () => {
        expect(normalizePreset({ label: 'A', range: ['2026-09-01', '2026-09-21'] }, true)).toEqual([
            '2026-09-01',
            '2026-09-21',
        ])
        expect(normalizePreset({ label: 'A', range: ['2026-09-21', '2026-09-01'] }, true)).toBeNull()
        expect(normalizePreset({ label: 'A', range: ['nope', '2026-09-01'] }, true)).toBeNull()
        expect(normalizePreset({ label: 'A', value: '2026-09-01' }, true)).toBeNull()
        expect(normalizePreset({ label: 'A', value: '2026-09-01' }, false)).toBe('2026-09-01')
        expect(normalizePreset({ label: 'A' }, false)).toBeNull()
    })

    it('resolvePresets keeps order and drops the bad ones', () => {
        const out = resolvePresets(
            [
                { label: 'Good', range: ['2026-09-01', '2026-09-21'] },
                { label: 'Bad', range: ['xx', '2026-09-01'] },
                { label: 'Ok', range: ['2026-09-21', '2026-09-21'] },
            ],
            true,
        )
        expect(out.map((p) => p.label)).toEqual(['Good', 'Ok'])
    })
})

describe('range picker shortcuts', () => {
    it('renders built-ins by default and applies a custom override', async () => {
        const wrapper = mount(SDateRangePicker, {
            props: {
                modelValue: [],
                presets: [{ label: 'Launch week', range: ['2026-09-01', '2026-09-07'] }],
            },
            attachTo: document.body,
        })
        const chips = wrapper.findAll('[role="group"] button')
        expect(chips.map((c) => c.text())).toEqual(['Launch week'])
        await chips[0].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-09-01', '2026-09-07']])
        expect(chips[0].attributes('aria-pressed')).toBe('true')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('ignores malformed presets without throwing', async () => {
        const warn = console.warn
        const calls: unknown[][] = []
        console.warn = (...a: unknown[]) => {
            calls.push(a)
        }
        const wrapper = mount(SDateRangePicker, {
            props: {
                modelValue: [],
                presets: [
                    { label: 'Bad dates', range: ['yesterday', 'today'] },
                    { label: 'Reversed', range: ['2026-09-07', '2026-09-01'] },
                    { label: 'Single', value: '2026-09-01' },
                ],
            },
            attachTo: document.body,
        })
        console.warn = warn
        expect(wrapper.find('[role="group"]')).toBeTruthy()
        expect(wrapper.findAll('[role="group"] button')).toHaveLength(0)
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(calls.length).toBeGreaterThan(0)
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('hides the group for [] or showPresets=false', () => {
        const cases: Record<string, unknown>[] = [
            { modelValue: [], presets: [] },
            { modelValue: [], showPresets: false },
        ]
        for (const props of cases) {
            const wrapper = mount(SDateRangePicker, { props, attachTo: document.body })
            expect(wrapper.find('[role="group"]').exists()).toBe(false)
            wrapper.unmount()
            document.body.innerHTML = ''
        }
    })
})

describe('single picker shortcuts', () => {
    it('applies a value preset from the footer', async () => {
        const wrapper = mount(SDatePicker, {
            props: { modelValue: '', presets: [{ label: 'Payday', value: '2026-09-30' }] },
            attachTo: document.body,
        })
        await wrapper.find('input').trigger('click')
        await nextTick()
        const chip = document.body.querySelector('[role="group"] button')
        expect(chip?.textContent).toBe('Payday')
        chip?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2026-09-30'])
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
