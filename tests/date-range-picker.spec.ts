import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SDateRangePicker from '../src/components/date-range-picker/SDateRangePicker.vue'

describe('SDateRangePicker', () => {
    it('applies the Last 7 days preset', async () => {
        const wrapper = mount(SDateRangePicker, { props: { modelValue: [] }, attachTo: document.body })
        const buttons = wrapper.findAll('button')
        const preset = buttons.find((b) => b.text() === 'Last 7 days')
        expect(preset).toBeTruthy()
        await preset.trigger('click')
        const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as [string, string]
        expect(Array.isArray(emitted)).toBe(true)
        expect(emitted).toHaveLength(2)
        const [from, to] = emitted
        const diff = (new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / 86400000
        expect(diff).toBe(6)
        wrapper.unmount()
    })

    it('supports custom preset lists', async () => {
        const wrapper = mount(SDateRangePicker, {
            props: { modelValue: [], presets: [{ label: 'Weekend', range: ['2026-01-03', '2026-01-04'] }] },
        })
        expect(wrapper.text()).toContain('Weekend')
        expect(wrapper.text()).not.toContain('Last 30 days')
    })
})
