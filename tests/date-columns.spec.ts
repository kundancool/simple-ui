import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'

describe('SDatePicker columns', () => {
    it('shows one centered heading naming every visible month', async () => {
        const wrapper = mount(SDatePicker, {
            props: { modelValue: [], range: true },
            attachTo: document.body,
        })
        await wrapper.find('input').trigger('click')
        await nextTick()
        // nav label only — no per-month duplicate headings
        const navLabel = document.body.querySelector('[aria-label="Previous month"] + span')
        expect(navLabel?.textContent).toContain('–')
        expect(document.body.querySelectorAll('.s-cal-month').length).toBeGreaterThan(0)
        for (const month of document.body.querySelectorAll('.s-cal-month')) {
            expect(month.querySelector('p')).toBeNull()
        }
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('keeps extra months and options desktop-only (mobile pages with nav buttons)', async () => {
        const wrapper = mount(SDatePicker, {
            props: {
                modelValue: [],
                range: true,
                options: [{ label: 'Week', range: ['2026-09-01', '2026-09-07'] }],
            },
            attachTo: document.body,
        })
        await wrapper.find('input').trigger('click')
        await nextTick()
        const months = [...document.body.querySelectorAll('.s-cal-month')]
        expect(months).toHaveLength(2)
        expect(months[1].className).toContain('hidden')
        expect(months[1].className).toContain('min-[540px]:block')
        const group = document.body.querySelector('[role="group"]')
        expect(group?.className).toContain('hidden')
        expect(group?.className).toContain('min-[540px]:flex')
        // single visible month still navigates
        const before = document.body.querySelector('[aria-label="Previous month"] + span')?.textContent
        document.body.querySelector('[aria-label="Next month"]')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(document.body.querySelector('[aria-label="Previous month"] + span')?.textContent).not.toBe(before)
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('defaults to two months in range mode', async () => {
        const wrapper = mount(SDatePicker, { props: { range: true, modelValue: [] }, attachTo: document.body })
        await wrapper.find('input').trigger('click')
        await nextTick()
        expect(document.body.querySelectorAll('.s-cal-month')).toHaveLength(2)
        wrapper.unmount()
    })

    it('defaults to one month in single mode and honors columns=1', async () => {
        const single = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        await single.find('input').trigger('click')
        await nextTick()
        expect(document.body.querySelectorAll('.s-cal-month')).toHaveLength(1)
        single.unmount()

        const forced = mount(SDatePicker, { props: { range: true, modelValue: [], columns: 1 }, attachTo: document.body })
        await forced.find('input').trigger('click')
        await nextTick()
        expect(document.body.querySelectorAll('.s-cal-month')).toHaveLength(1)
        forced.unmount()
    })
})
