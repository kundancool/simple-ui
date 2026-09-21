import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SForm from '../src/components/form/SForm.vue'
import SFormItem from '../src/components/form-item/SFormItem.vue'
import SInput from '../src/components/input/SInput.vue'
import SButton from '../src/components/button/SButton.vue'

function mountForm(props = {}, error = '') {
    return mount(
        {
            components: { SForm, SFormItem, SInput, SButton },
            props: ['formProps', 'error'],
            template: `
                <SForm v-bind="formProps" @submit="$emit('submitted')">
                    <SFormItem label="Guest name" required :error="error">
                        <SInput v-model="name" />
                    </SFormItem>
                    <SFormItem label="Notes" success success-message="Saved">
                        <SInput v-model="notes" type="textarea" />
                    </SFormItem>
                </SForm>`,
            data: () => ({ name: '', notes: '' }),
        },
        { props: { formProps: props, error } },
    )
}

describe('SForm', () => {
    it('renders a real form and prevents native submission', async () => {
        const wrapper = mountForm()
        expect(wrapper.find('form').exists()).toBe(true)
        await wrapper.find('form').trigger('submit')
        expect(wrapper.emitted('submitted')).toHaveLength(1)
    })

    it('blocks interaction when disabled', () => {
        const wrapper = mountForm({ disabled: true })
        expect(wrapper.find('form').classes()).toContain('pointer-events-none')
        expect(wrapper.find('form').attributes('aria-busy')).toBe('true')
    })

    it('cascades size to every control', () => {
        const wrapper = mountForm({ size: 'sm' })
        expect(wrapper.find('input').attributes('style')).toContain('--s-field-h: 32px')
    })

    it('scrollToFirstError focuses the first invalid row into view', async () => {
        const scrollIntoView = vi.fn()
        Element.prototype.scrollIntoView = scrollIntoView
        const wrapper = mountForm({}, 'Name is required')
        await nextTick()
        const form = wrapper.findComponent(SForm)
        form.vm.scrollToFirstError()
        expect(scrollIntoView).toHaveBeenCalled()
    })

    it('exposes label width to left-aligned rows', () => {
        const wrapper = mountForm({ labelPosition: 'left', labelWidth: '160px' })
        const label = wrapper.find('.s-form-item-label')
        expect(label.attributes('style')).toContain('width: 160px')
    })
})

describe('SFormItem', () => {
    it('wires the label to the control id', () => {
        const wrapper = mountForm()
        const label = wrapper.find('.s-form-item-label')
        const input = wrapper.find('input')
        expect(label.attributes('for')).toBe(input.attributes('id'))
    })

    it('shows the error with role=alert and the success with role=status', () => {
        const errored = mountForm({}, 'Name is required')
        expect(errored.find('[role="alert"]').text()).toBe('Name is required')
        const ok = mountForm()
        expect(ok.find('[role="status"]').text()).toBe('Saved')
    })

    it('renders the helper slot when there is no error or success', () => {
        const wrapper = mount(SFormItem, {
            props: { label: 'Phone' },
            slots: { default: '<input />', helper: 'Include country code' },
        })
        expect(wrapper.text()).toContain('Include country code')
    })

    it('marks required fields', () => {
        expect(mountForm().find('.s-form-item-label').text()).toContain('*')
    })

    it('accepts a boolean error for a bare border', () => {
        const wrapper = mount(SFormItem, { props: { label: 'X', error: true } })
        expect(wrapper.find('[role="alert"]').text()).toContain('invalid')
    })
})
