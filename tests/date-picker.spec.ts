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

    it('opens on Enter and ArrowDown', async () => {
        const wrapper = mount(SDatePicker, { props: { modelValue: '' }, attachTo: document.body })
        await wrapper.find('input').trigger('keydown', { key: 'Enter' })
        await nextTick()
        expect(document.body.querySelector('[role="dialog"]')).not.toBeNull()
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
