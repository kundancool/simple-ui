import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import SSelect from '../src/components/select/SSelect.vue'
import SOption from '../src/components/option/SOption.vue'
import SRadio from '../src/components/radio/SRadio.vue'
import SRadioGroup from '../src/components/radio-group/SRadioGroup.vue'
import SUpload from '../src/components/upload/SUpload.vue'
import SFormItem from '../src/components/form-item/SFormItem.vue'

describe('SSelect', () => {
    const Slotted = {
        components: { SSelect, SOption },
        props: ['initial'],
        template: `
            <SSelect :model-value="initial" label="Channel" filterable clearable @update:model-value="$emit('picked', $event)">
                <SOption label="Direct" value="direct" />
                <SOption label="Marketplace" value="mmt" />
                <SOption label="Gone" value="none" disabled />
            </SSelect>`,
    }

    it('collects slotted s-option children', async () => {
        const wrapper = mount(Slotted, { props: { initial: 'direct' } })
        await wrapper.find('input').trigger('focus')
        await nextTick()
        const options = document.body.querySelectorAll('[role="option"]')
        expect(options).toHaveLength(3)
        expect(options[0].textContent).toContain('Direct')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('selects a slotted option and emits change', async () => {
        const wrapper = mount(Slotted, { props: { initial: '' } })
        await wrapper.find('input').trigger('focus')
        await nextTick()
        const option = document.body.querySelectorAll('[role="option"]')[1]
        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('picked')?.at(-1)).toEqual(['mmt'])
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('refuses disabled slotted options', async () => {
        const wrapper = mount(Slotted, { props: { initial: '' } })
        await wrapper.find('input').trigger('focus')
        await nextTick()
        const option = document.body.querySelectorAll('[role="option"]')[2]
        option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('picked')).toBeUndefined()
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('still supports array options', async () => {
        const wrapper = mount(SSelect, {
            props: { options: [{ id: 1, name: 'One' }, { id: 2, name: 'Two' }], filterable: true },
        })
        await wrapper.find('input').trigger('focus')
        await nextTick()
        expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(2)
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('emits clear and visible-change', async () => {
        const wrapper = mount(SSelect, {
            props: { modelValue: 'x', clearable: true, filterable: true, options: [{ id: 'x', name: 'X' }] },
        })
        // The clear affordance is hidden while the menu is open.
        await wrapper.find('[aria-label="Clear selection"]').trigger('mousedown')
        expect(wrapper.emitted('clear')).toHaveLength(1)

        await wrapper.find('input').trigger('focus')
        expect(wrapper.emitted('visible-change')?.[0]).toEqual([true])
    })

    it('shows emptyText when nothing matches', async () => {
        const wrapper = mount(SSelect, {
            props: { options: [{ id: 'a', name: 'Alpha' }], filterable: true, emptyText: 'Nothing here' },
        })
        await wrapper.find('input').setValue('zzz')
        await nextTick()
        expect(document.body.textContent).toContain('Nothing here')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('inherits size from a form item', () => {
        const wrapper = mount(SFormItem, {
            props: { label: 'Channel', size: 'sm' },
            slots: { default: SSelect },
        })
        expect(wrapper.find('select').attributes('style')).toContain('--s-field-h: 32px')
    })
})

describe('SRadio / SRadioGroup', () => {
    it('group owns the value and emits change', async () => {
        const wrapper = mount(
            {
                components: { SRadioGroup, SRadio },
                template: `
                    <SRadioGroup :model-value="value" @update:model-value="$emit('changed', $event)">
                        <SRadio value="a">A</SRadio>
                        <SRadio value="b">B</SRadio>
                    </SRadioGroup>`,
                props: { value: 'a' },
            },
            { props: { value: 'a' } },
        )
        const inputs = wrapper.findAll('input[type="radio"]')
        expect(inputs[0].attributes('checked')).toBeDefined()
        await inputs[1].setValue()
        expect(wrapper.emitted('changed')?.[0]).toEqual(['b'])
    })

    it('renders a custom dot rather than native chrome', () => {
        const wrapper = mount(SRadio, { props: { value: 'a' }, slots: { default: 'A' } })
        expect(wrapper.find('.s-radio-dot').exists()).toBe(true)
        expect(wrapper.find('input').classes()).toContain('s-radio-input')
    })

    it('group disabled cascades and blocks selection', async () => {
        const wrapper = mount(SRadioGroup, {
            props: { modelValue: 'a', disabled: true },
            slots: { default: h(SRadio, { value: 'b' }, { default: () => 'B' }) },
        })
        expect(wrapper.find('input').attributes('disabled')).toBeDefined()
        await wrapper.find('input').setValue()
        expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('accepts the legacy label prop as the value', () => {
        const wrapper = mount(SRadio, { props: { modelValue: 'legacy', label: 'legacy' } })
        expect(wrapper.find('input').attributes('checked')).toBeDefined()
    })
})

describe('SUpload', () => {
    function mountUpload(props = {}) {
        return mount(SUpload, { props: { action: '/uploads', ...props }, attachTo: document.body })
    }

    it('requires an action and renders a button-like drop zone', () => {
        const wrapper = mountUpload()
        const zone = wrapper.find('[role="button"]')
        expect(zone.exists()).toBe(true)
        expect(zone.attributes('tabindex')).toBe('0')
    })

    it('reports selected files and clears the input', async () => {
        const wrapper = mountUpload({ autoUpload: false })
        const input = wrapper.find('input[type="file"]')
        const file = new File(['x'], 'photo.png', { type: 'image/png' })
        Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
        await input.trigger('change')
        expect(wrapper.emitted('change')?.[0]?.[0]).toEqual([file])
        expect(wrapper.text()).toContain('photo.png')
    })

    it('posts multipart with the CSRF meta token when autoUpload is on', async () => {
        const meta = document.createElement('meta')
        meta.setAttribute('name', 'csrf-token')
        meta.setAttribute('content', 'token-123')
        document.head.appendChild(meta)

        const open = vi.fn()
        const send = vi.fn()
        const setHeader = vi.fn()
        class FakeXhr {
            upload = {}
            status = 200
            responseText = '{"ok":true}'
            open = open
            send = send
            setRequestHeader = setHeader
        }
        const original = global.XMLHttpRequest
        global.XMLHttpRequest = FakeXhr as unknown as typeof XMLHttpRequest

        const wrapper = mountUpload({ data: { folder: 'items' }, headers: { 'X-Custom': '1' } })
        const input = wrapper.find('input[type="file"]')
        const file = new File(['x'], 'a.png')
        Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
        await input.trigger('change')

        expect(open).toHaveBeenCalledWith('POST', '/uploads', true)
        expect(send).toHaveBeenCalledTimes(1)
        expect(setHeader).toHaveBeenCalledWith('X-CSRF-TOKEN', 'token-123')
        expect(setHeader).toHaveBeenCalledWith('X-Custom', '1')

        global.XMLHttpRequest = original
        meta.remove()
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('blocks interaction when disabled', () => {
        const wrapper = mountUpload({ disabled: true })
        expect(wrapper.find('[role="button"]').attributes('aria-disabled')).toBe('true')
    })
})
