import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'

/**
 * The trigger is a readonly text input — the correct tag for a form value:
 * it joins native submission (name), label association, placeholder and
 * focus behavior exactly like every other field. A button trigger could do
 * none of that.
 */
describe('SDatePicker trigger', () => {
    it('renders a readonly text input, not a button', () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        const input = wrapper.find('input[type="text"]')
        expect(input.exists()).toBe(true)
        expect(input.attributes('readonly')).toBeDefined()
        expect(wrapper.find('button.s-input').exists()).toBe(false)
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('shows the native placeholder when empty and the date as its value', () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '', placeholder: 'Pick a day' } })
        const input = wrapper.find('input')
        expect(input.attributes('placeholder')).toBe('Pick a day')
        expect((input.element as HTMLInputElement).value).toBe('')
        wrapper.unmount()
    })

    it('exposes name for native form submission', () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '2026-09-21', name: 'dob' } })
        const input = wrapper.find('input')
        expect(input.attributes('name')).toBe('dob')
        expect((input.element as HTMLInputElement).value).toContain('2026')
        wrapper.unmount()
    })

    it('wires the label to the input', () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '', label: 'Start' } })
        const label = wrapper.find('label')
        const input = wrapper.find('input')
        expect(label.attributes('for')).toBe(input.attributes('id'))
        wrapper.unmount()
    })

    it('opens on click and closes on Escape', async () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        expect(document.body.querySelector('[role="dialog"]')).toBeNull()
        await wrapper.find('input').trigger('click')
        await nextTick()
        expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
        await wrapper.find('input').trigger('keydown', { key: 'Escape' })
        await nextTick()
        expect(document.body.querySelector('[role="dialog"]')).toBeNull()
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('right-aligns near the right edge instead of leaving the viewport', async () => {
        Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
        Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true })
        const wrapper = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        await wrapper.find('input').trigger('click')
        await nextTick()
        const input = wrapper.find('input').element
        input.getBoundingClientRect = () => ({ left: 900, right: 1000, top: 100, bottom: 136, width: 100, height: 36 }) as unknown as DOMRect
        const panel = document.body.querySelector('[role="dialog"]')
        Object.defineProperty(panel, 'offsetWidth', { value: 500, configurable: true })
        Object.defineProperty(panel, 'offsetHeight', { value: 300, configurable: true })
        window.dispatchEvent(new Event('resize'))
        await nextTick()
        const style = (panel as HTMLElement).style
        // 900 + 500 overflows 1024 → right-aligned at 1000 - 500
        expect(style.left).toBe('500px')
        // 136 + 300 fits 768 → still drops below
        expect(style.top).toBe('140px')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('flips above the trigger when there is no room below', async () => {
        Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
        Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true })
        const wrapper = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        await wrapper.find('input').trigger('click')
        await nextTick()
        const input = wrapper.find('input').element
        input.getBoundingClientRect = () => ({ left: 100, right: 300, top: 500, bottom: 536, width: 200, height: 36 }) as unknown as DOMRect
        const panel = document.body.querySelector('[role="dialog"]')
        Object.defineProperty(panel, 'offsetWidth', { value: 320, configurable: true })
        Object.defineProperty(panel, 'offsetHeight', { value: 300, configurable: true })
        window.dispatchEvent(new Event('resize'))
        await nextTick()
        const style = (panel as HTMLElement).style
        expect(style.left).toBe('100px')
        // 536 + 300 overflows 600 → opens above at 500 - 300 - 4
        expect(style.top).toBe('196px')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('opens on Enter and ArrowDown', async () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        await wrapper.find('input').trigger('keydown', { key: 'Enter' })
        await nextTick()
        expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
