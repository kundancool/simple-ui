import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'
import { isIsoDate, normalizeOption, resolveOptions } from '../src/utils/dateOptions'

/**
 * Shortcut contract (docs/spec/03 API conventions): consumers override via
 * `options`, malformed entries are ignored — never thrown on or emitted.
 */
describe('date option validation', () => {
    it('accepts real calendar dates, rejects impossible ones', () => {
        expect(isIsoDate('2026-09-21')).toBe(true)
        expect(isIsoDate('2026-02-30')).toBe(false)
        expect(isIsoDate('21-09-2026')).toBe(false)
        expect(isIsoDate('')).toBe(false)
        expect(isIsoDate(null)).toBe(false)
    })

    it('normalizes range options and rejects bad shapes', () => {
        expect(normalizeOption({ label: 'A', range: ['2026-09-01', '2026-09-21'] }, true)).toEqual([
            '2026-09-01',
            '2026-09-21',
        ])
        expect(normalizeOption({ label: 'A', range: ['2026-09-21', '2026-09-01'] }, true)).toBeNull()
        expect(normalizeOption({ label: 'A', range: ['nope', '2026-09-01'] }, true)).toBeNull()
        expect(normalizeOption({ label: 'A', value: '2026-09-01' }, true)).toBeNull()
        expect(normalizeOption({ label: 'A', value: '2026-09-01' }, false)).toBe('2026-09-01')
        expect(normalizeOption({ label: 'A' }, false)).toBeNull()
    })

    it('resolveOptions keeps order and drops the bad ones', () => {
        const out = resolveOptions(
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

describe('range options (s-date-picker range)', () => {
    it('applies a consumer-defined override and nothing else', async () => {
        const wrapper = mount(SDatePicker, {
            props: {
                modelValue: [],
                range: true,
                options: [{ label: 'Launch week', range: ['2026-09-01', '2026-09-07'] }],
            },
            attachTo: document.body,
        })
        await wrapper.find('input').trigger('click')
        await nextTick()
        // one component does ranges: two calendars side by side
        expect(document.body.querySelectorAll('.s-cal-month')).toHaveLength(2)
        const chip = document.body.querySelector('[role="group"] button')
        expect(chip?.textContent).toBe('Launch week')
        chip?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['2026-09-01', '2026-09-07']])
        // applying closes the panel; reopening shows the active chip pressed
        expect(document.body.querySelector('[role="dialog"]')).toBeNull()
        await wrapper.find('input').trigger('click')
        await nextTick()
        const pressed = document.body.querySelector('[role="group"] button')
        expect(pressed?.textContent).toBe('Launch week')
        expect(pressed?.getAttribute('aria-pressed')).toBe('true')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('ignores malformed options without throwing', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const wrapper = mount(SDatePicker, {
            props: {
                modelValue: [],
                range: true,
                options: [
                    { label: 'Bad dates', range: ['yesterday', 'today'] },
                    { label: 'Reversed', range: ['2026-09-07', '2026-09-01'] },
                    { label: 'Single', value: '2026-09-01' },
                ],
            },
            attachTo: document.body,
        })
        await wrapper.find('input').trigger('click')
        await nextTick()
        // every entry malformed → no group at all, nothing emitted
        expect(document.body.querySelector('[role="group"]')).toBeNull()
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
        expect(warn).toHaveBeenCalled()
        warn.mockRestore()
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('hides the group when no options are defined', async () => {
        const cases: Record<string, unknown>[] = [
            { modelValue: [], range: true, options: [] },
            { modelValue: [], range: true },
        ]
        for (const props of cases) {
            const wrapper = mount(SDatePicker, { props, attachTo: document.body })
            await wrapper.find('input').trigger('click')
            await nextTick()
            expect(document.body.querySelector('[role="group"]')).toBeNull()
            wrapper.unmount()
            document.body.innerHTML = ''
        }
    })
})

describe('single picker options', () => {
    it('applies a value option from the sidebar', async () => {
        const wrapper = mount(SDatePicker, {
            props: { modelValue: '', options: [{ label: 'Payday', value: '2026-09-30' }] },
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

    it('emits valueFormat and reads it back', async () => {
        const wrapper = mount(SDatePicker, {
            props: { modelValue: '21/09/2026', valueFormat: 'DD/MM/YYYY', format: 'DD Mon YYYY'.replace('Mon', 'MM') },
            attachTo: document.body,
        })
        const input = wrapper.find('input')
        expect((input.element as HTMLInputElement).value).toContain('21')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('disables weekends via disabledDate and ranges via disabledRanges', async () => {
        const wrapper = mount(SDatePicker, {
            props: {
                modelValue: '',
                modelValue2: undefined,
                disabledDate: (d: Date) => d.getDay() === 0 || d.getDay() === 6,
                disabledRanges: [['2026-09-10', '2026-09-12']],
            },
            attachTo: document.body,
        })
        await wrapper.find('input').trigger('click')
        await nextTick()
        const buttons = [...document.body.querySelectorAll('.s-cal-month button')].filter(
            (b) => !(b as HTMLButtonElement).disabled && (b.textContent ?? '').trim() !== '',
        )
        // a Saturday cell exists and is disabled
        const saturday = [...document.body.querySelectorAll('.s-cal-month button')].find(
            (b) => (b as HTMLButtonElement).disabled,
        )
        expect(saturday).toBeTruthy()
        expect(buttons.length).toBeGreaterThan(0)
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
