import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SAccordion from '../src/components/accordion/SAccordion.vue'
import SBreadcrumb from '../src/components/breadcrumb/SBreadcrumb.vue'
import SProgress from '../src/components/progress/SProgress.vue'
import SSteps from '../src/components/steps/SSteps.vue'
import SFilter from '../src/components/filter/SFilter.vue'
import SSelect from '../src/components/select/SSelect.vue'
import SDataTable from '../src/components/data-table/SDataTable.vue'
import SDataTableColumn from '../src/components/data-table-column/SDataTableColumn.vue'
import SCheckbox from '../src/components/checkbox/SCheckbox.vue'
import SRating from '../src/components/rating/SRating.vue'
import SSegmented from '../src/components/segmented/SSegmented.vue'
import SInput from '../src/components/input/SInput.vue'
import SDatePicker from '../src/components/date-picker/SDatePicker.vue'
import { SSearchPalette } from '../src/components/search-palette/index'

describe('scrutiny fixes', () => {
    it('SAccordion tolerates a non-array multiple value', async () => {
        const wrapper = mount(SAccordion, {
            props: { items: [{ key: 'a', title: 'A', text: 'x' }], multiple: true, modelValue: 'a' },
        })
        expect(wrapper.text()).toContain('A')
    })

    it('SAccordion links headers to panels', () => {
        const wrapper = mount(SAccordion, {
            props: { items: [{ key: 'a', title: 'A', text: 'x' }] },
        })
        const button = wrapper.find('button')
        const panel = wrapper.find('[role="region"]')
        expect(button.attributes('aria-controls')).toBe(panel.attributes('id'))
    })

    it('SBreadcrumb renders to-less middles as text', () => {
        const wrapper = mount(SBreadcrumb, {
            props: { items: [{ label: 'A', to: '/a' }, { label: 'B' }, { label: 'C' }] },
        })
        const links = wrapper.findAll('a')
        expect(links).toHaveLength(1)
        expect(wrapper.text()).toContain('B')
    })

    it('SProgress honors duration', () => {
        const wrapper = mount(SProgress, { props: { value: 50, duration: 700 } })
        expect(wrapper.find('[role="progressbar"] > div').attributes('style')).toContain('700ms')
    })

    it('SSteps falls back to the first step on unknown keys', () => {
        const wrapper = mount(SSteps, {
            props: { modelValue: 'nope', steps: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] },
        })
        expect(wrapper.findAll('button')[0].attributes('aria-current')).toBe('step')
    })

    it('SFilter input is labelled', () => {
        const wrapper = mount(SFilter)
        expect(wrapper.find('input').attributes('aria-label')).toBeTruthy()
    })

    it('SSelect controls are labelled without a label prop', () => {
        const native = mount(SSelect, { props: { placeholder: 'Pick one' } })
        expect(native.find('select').attributes('aria-label')).toBe('Pick one')
    })

    it('SDataTable renders a caption for screen readers', () => {
        const wrapper = mount(SDataTable, {
            props: { data: [{ a: 'x' }], caption: 'Orders' },
        })
        expect(wrapper.find('caption').text()).toBe('Orders')
    })

    it('SCheckbox shows errors and inline drops margin', () => {
        const wrapper = mount(SCheckbox, { props: { error: 'Required' } })
        expect(wrapper.text()).toContain('Required')
        expect(mount(SCheckbox, { props: { inline: true } }).classes()).not.toContain('mb-4')
    })

    it('SRating moves with arrows', async () => {
        const wrapper = mount(SRating, { props: { modelValue: 3 } })
        await wrapper.findAll('button')[2].trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    })

    it('SSegmented moves and selects with arrows', async () => {
        const wrapper = mount(SSegmented, {
            props: { modelValue: 'm', options: [{ label: 'M', value: 'm' }, { label: 'Y', value: 'y' }] },
        })
        await wrapper.findAll('button')[0].trigger('keydown', { key: 'ArrowRight' })
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['y'])
    })

    it('SInput and SDatePicker support inline mode', () => {
        expect(mount(SInput, { props: { inline: true } }).classes()).not.toContain('mb-4')
        expect(mount(SDatePicker, { props: { inline: true } }).classes()).not.toContain('mb-4')
    })

    it('SSearchPalette input is labelled', async () => {
        const wrapper = mount(SSearchPalette, { props: { items: [], modelValue: true }, attachTo: document.body })
        await nextTick()
        expect(document.body.querySelector('.s-spotlight-panel input')?.getAttribute('aria-label')).toBeTruthy()
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
