import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import SCarousel from '../src/components/carousel/SCarousel.vue'
import SAccordion from '../src/components/accordion/SAccordion.vue'
import SLightbox from '../src/components/lightbox/SLightbox.vue'
import SRating from '../src/components/rating/SRating.vue'
import SSegmented from '../src/components/segmented/SSegmented.vue'
import STabs from '../src/components/tabs/STabs.vue'
import SSteps from '../src/components/steps/SSteps.vue'

/**
 * Components with optional v-model must also work uncontrolled:
 * emitting alone is not enough — the UI has to move.
 */
describe('uncontrolled interaction', () => {
    it('SCarousel advances without v-model', async () => {
        const wrapper = mount(SCarousel, {
            slots: { default: [h('div', 'one'), h('div', 'two')] },
        })
        await wrapper.find('[aria-label="Next slide"]').trigger('click')
        await nextTick()
        const track = wrapper.find('.flex.h-full')
        expect(track.attributes('style')).toContain('-100%')
    })

    it('SAccordion opens without v-model', async () => {
        const wrapper = mount(SAccordion, {
            props: { items: [{ key: 'a', title: 'A', text: 'Body A' }] },
        })
        await wrapper.find('button').trigger('click')
        await nextTick()
        expect(wrapper.text()).toContain('Body A')
    })

    it('SRating lights without v-model', async () => {
        const wrapper = mount(SRating, { props: { modelValue: 0 } })
        await wrapper.findAll('button')[3].trigger('click')
        await nextTick()
        expect(wrapper.findAll('svg')[3].classes().join(' ')).toContain('s-text-warning')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
    })

    it('SSegmented selects without v-model', async () => {
        const wrapper = mount(SSegmented, {
            props: { modelValue: 'm', options: [{ label: 'M', value: 'm' }, { label: 'Y', value: 'y' }] },
        })
        await wrapper.findAll('button')[1].trigger('click')
        await nextTick()
        expect(wrapper.findAll('button')[1].attributes('aria-pressed')).toBe('true')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['y'])
    })

    it('STabs activates without v-model', async () => {
        const wrapper = mount(STabs, {
            props: { tabs: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] },
        })
        expect(wrapper.findAll('button')[0].attributes('aria-selected')).toBe('true')
        await wrapper.findAll('button')[1].trigger('click')
        await nextTick()
        expect(wrapper.findAll('button')[1].attributes('aria-selected')).toBe('true')
    })

    it('SSteps starts at the first step without v-model', async () => {
        const wrapper = mount(SSteps, {
            props: { steps: [{ key: 'a', label: 'A' }, { key: 'b', label: 'B' }] },
        })
        // future steps stay locked; the current one is marked and clickable
        expect(wrapper.findAll('button')[0].attributes('aria-current')).toBe('step')
        expect(wrapper.findAll('button')[1].attributes('disabled')).toBeDefined()
        await wrapper.findAll('button')[0].trigger('click')
        await nextTick()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['a'])
        expect(wrapper.findAll('button')[0].attributes('aria-current')).toBe('step')
    })

    it('SLightbox steps without v-model:index', async () => {
        const images = [
            { src: 'a.jpg', alt: 'A' },
            { src: 'b.jpg', alt: 'B' },
        ]
        const wrapper = mount(SLightbox, {
            props: { images, open: true },
            attachTo: document.body,
        })
        await nextTick()
        document.body
            .querySelector('[aria-label="Next image"]')
            .dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(document.body.textContent).toContain('2 / 2')
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
