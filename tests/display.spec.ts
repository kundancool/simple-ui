import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SAvatar from '../src/components/avatar/SAvatar.vue'
import SBadge from '../src/components/badge/SBadge.vue'
import SEmpty from '../src/components/empty/SEmpty.vue'
import SProgress from '../src/components/progress/SProgress.vue'
import SAccordion from '../src/components/accordion/SAccordion.vue'
import SRating from '../src/components/rating/SRating.vue'
import STimeline from '../src/components/timeline/STimeline.vue'
import SDescriptions from '../src/components/descriptions/SDescriptions.vue'
import SSegmented from '../src/components/segmented/SSegmented.vue'

describe('new display components', () => {
    it('SAvatar derives initials', () => {
        expect(mount(SAvatar, { props: { name: 'Priya Nair' } }).text()).toBe('PN')
        expect(mount(SAvatar, { props: { name: 'Madonna' } }).text()).toBe('M')
    })

    it('SBadge caps numeric values', () => {
        expect(mount(SBadge, { props: { value: 128 } }).text()).toBe('99+')
        expect(mount(SBadge, { props: { value: 3 } }).text()).toBe('3')
    })

    it('SEmpty renders title and action slot', () => {
        const wrapper = mount(SEmpty, {
            props: { title: 'Empty', description: 'Nothing here.' },
            slots: { default: '<button>Act</button>' },
        })
        expect(wrapper.text()).toContain('Empty')
        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('SProgress clamps to 0–100', () => {
        expect(mount(SProgress, { props: { value: 140 } }).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('100')
        expect(mount(SProgress, { props: { value: -5 } }).find('[role="progressbar"]').attributes('aria-valuenow')).toBe('0')
    })

    it('SAccordion toggles single sections', async () => {
        const wrapper = mount(SAccordion, {
            props: { modelValue: null, items: [{ key: 'a', title: 'A', text: 'Body A' }] },
        })
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
    })

    it('SRating emits on click and respects readonly', async () => {
        const wrapper = mount(SRating, { props: { modelValue: 0 } })
        await wrapper.findAll('button')[3].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
        const ro = mount(SRating, { props: { modelValue: 0, readonly: true } })
        await ro.findAll('button')[3].trigger('click')
        expect(ro.emitted('update:modelValue')).toBeUndefined()
    })

    it('STimeline renders entries', () => {
        const wrapper = mount(STimeline, {
            props: { items: [{ title: 'Shipped', time: 'now', tag: 'Ops', tone: 'success' }] },
        })
        expect(wrapper.text()).toContain('Shipped')
    })

    it('SDescriptions renders label/value rows', () => {
        const wrapper = mount(SDescriptions, {
            props: { items: [{ label: 'Due', value: 'Friday' }] },
        })
        expect(wrapper.text()).toContain('Due')
        expect(wrapper.text()).toContain('Friday')
    })

    it('SSegmented selects options', async () => {
        const wrapper = mount(SSegmented, {
            props: { modelValue: 'm', options: [{ label: 'Monthly', value: 'm' }, { label: 'Yearly', value: 'y' }] },
        })
        await wrapper.findAll('button')[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['y'])
    })
})
