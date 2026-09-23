import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'

describe('SDatePicker columns', () => {
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
