import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SButton from '../src/components/button/SButton.vue'
import STag from '../src/components/tag/STag.vue'
import SAlert from '../src/components/alert/SAlert.vue'
import SSkeleton from '../src/components/skeleton/SSkeleton.vue'
import { useToast } from '../src/composables/useToast'

describe('SButton', () => {
    it('renders the default slot', () => {
        const wrapper = mount(SButton, { slots: { default: 'Save' } })
        expect(wrapper.text()).toContain('Save')
        expect(wrapper.attributes('type')).toBe('button')
    })

    it('emits click', async () => {
        const wrapper = mount(SButton, { slots: { default: 'Go' } })
        await wrapper.trigger('click')
        expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('sizes md to the shared control height', () => {
        const wrapper = mount(SButton, { slots: { default: 'Go' } })
        expect(wrapper.classes()).toContain('h-9')
    })

    it('disables while loading', () => {
        const wrapper = mount(SButton, { props: { loading: true }, slots: { default: 'Go' } })
        expect(wrapper.attributes('disabled')).toBeDefined()
    })
})

describe('STag', () => {
    it('applies the danger subtle preset', () => {
        const wrapper = mount(STag, { props: { type: 'danger' }, slots: { default: 'Off' } })
        expect(wrapper.classes().join(' ')).toContain('s-bg-danger-subtle')
    })
})

describe('SAlert', () => {
    it('emits dismiss', async () => {
        const wrapper = mount(SAlert, { props: { dismissible: true }, slots: { default: 'Hi' } })
        await wrapper.find('button[aria-label="Dismiss"]').trigger('click')
        expect(wrapper.emitted('dismiss')).toHaveLength(1)
    })
})

describe('SSkeleton', () => {
    it('renders the requested line count', () => {
        const wrapper = mount(SSkeleton, { props: { lines: 3 } })
        expect(wrapper.findAll('.s-skeleton')).toHaveLength(3)
    })
})

describe('useToast', () => {
    it('adds and removes toasts', () => {
        const { success, toasts, remove, clear } = useToast()
        clear()
        const id = success('Hello')
        expect(toasts.value).toHaveLength(1)
        remove(id)
        expect(toasts.value).toHaveLength(0)
    })
})

describe('inline mode', () => {
    it('drops the block margin on SInput', async () => {
        const { default: SInput } = await import('../src/components/input/SInput.vue')
        const { mount } = await import('@vue/test-utils')
        expect(mount(SInput).classes()).toContain('mb-4')
        expect(mount(SInput, { props: { inline: true } }).classes()).not.toContain('mb-4')
    })
})
