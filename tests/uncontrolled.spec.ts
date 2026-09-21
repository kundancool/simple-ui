import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import SCarousel from '../src/components/carousel/SCarousel.vue'
import SAccordion from '../src/components/accordion/SAccordion.vue'
import SLightbox from '../src/components/lightbox/SLightbox.vue'

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
