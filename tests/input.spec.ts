import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SInput from '../src/components/input/SInput.vue'
import SFormItem from '../src/components/form-item/SFormItem.vue'
import SSpinner from '../src/components/spinner/SSpinner.vue'

describe('SInput events and attrs', () => {
    it('emits input and change for typing', async () => {
        const wrapper = mount(SInput)
        const el = wrapper.find('input')
        await el.setValue('abc')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['abc'])
        expect(wrapper.emitted('input')?.[0]).toEqual(['abc'])
        await el.trigger('change')
        expect(wrapper.emitted('change')?.[0]).toEqual(['abc'])
    })

    it('emits blur and focus', async () => {
        const wrapper = mount(SInput)
        await wrapper.find('input').trigger('focus')
        await wrapper.find('input').trigger('blur')
        expect(wrapper.emitted('focus')).toHaveLength(1)
        expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('forwards unknown attributes to the real control', () => {
        const wrapper = mount(SInput, {
            props: { placeholder: 'x' },
            attrs: { autocomplete: 'email', name: 'email', maxlength: '10', 'data-test': 'x' },
        })
        const input = wrapper.find('input')
        expect(input.attributes('autocomplete')).toBe('email')
        expect(input.attributes('name')).toBe('email')
        expect(input.attributes('maxlength')).toBe('10')
        expect(input.attributes('data-test')).toBe('x')
    })

    it('keeps class and style on the wrapper', () => {
        const wrapper = mount(SInput, { attrs: { class: 'w-64', style: 'margin:0' } })
        expect(wrapper.classes()).toContain('w-64')
        expect(wrapper.attributes('style')).toContain('margin: 0')
    })

    it('clears and emits clear', async () => {
        const wrapper = mount(SInput, { props: { modelValue: 'abc', clearable: true } })
        await wrapper.find('[aria-label="Clear"]').trigger('click')
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([''])
        expect(wrapper.emitted('clear')).toHaveLength(1)
    })

    it('toggles password visibility', async () => {
        const wrapper = mount(SInput, { props: { type: 'password' } })
        expect(wrapper.find('input').attributes('type')).toBe('password')
        await wrapper.find('[aria-label="Show password"]').trigger('click')
        expect(wrapper.find('input').attributes('type')).toBe('text')
        expect(wrapper.emitted('toggle-visibility')?.[0]).toEqual([true])
    })

    it('shows a word limit counter', () => {
        const wrapper = mount(SInput, { props: { modelValue: 'abc', maxlength: 10, showWordLimit: true } })
        expect(wrapper.text()).toContain('3/10')
    })

    it('honours the size scale and inline mode', () => {
        expect(mount(SInput, { props: { size: 'lg' } }).find('input').attributes('style')).toContain('--s-field-h: 40px')
        expect(mount(SInput, { props: { inline: true } }).classes()).not.toContain('mb-4')
    })

    it('inherits size from the enclosing form item', async () => {
        const wrapper = mount(SFormItem, { props: { label: 'X', size: 'xs' }, slots: { default: SInput } })
        await nextTick()
        expect(wrapper.find('input').attributes('style')).toContain('--s-field-h: 28px')
    })

    it('uses the form item id so the label points at the control', () => {
        const wrapper = mount(SFormItem, { props: { label: 'Customer' }, slots: { default: SInput } })
        expect(wrapper.find('label').attributes('for')).toBe(wrapper.find('input').attributes('id'))
    })
})

describe('SSpinner', () => {
    it('is decorative by default and labelled on request', () => {
        expect(mount(SSpinner).attributes('aria-hidden')).toBe('true')
        const labelled = mount(SSpinner, { props: { label: 'Loading' } })
        expect(labelled.attributes('aria-label')).toBe('Loading')
    })

    it('applies the size scale', () => {
        expect(mount(SSpinner, { props: { size: 'xs' } }).classes()).toContain('w-3')
        expect(mount(SSpinner, { props: { size: 'lg' } }).classes()).toContain('w-6')
    })
})
