import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import SLightbox from '../src/components/lightbox/SLightbox.vue'
import SGallery from '../src/components/gallery/SGallery.vue'
import SCarousel from '../src/components/carousel/SCarousel.vue'
import SSectionHeading from '../src/components/section-heading/SSectionHeading.vue'
import SFeature from '../src/components/feature/SFeature.vue'
import STestimonial from '../src/components/testimonial/STestimonial.vue'
import SBlogCard from '../src/components/blog-card/SBlogCard.vue'
import SNewsletter from '../src/components/newsletter/SNewsletter.vue'
import SFooter from '../src/components/footer/SFooter.vue'
import SCta from '../src/components/cta/SCta.vue'
import SMarquee from '../src/components/marquee/SMarquee.vue'

const photos = [
    { src: 'a.jpg', alt: 'A' },
    { src: 'b.jpg', alt: 'B' },
]

describe('landing kit', () => {
    afterEach(() => {
        document.body.innerHTML = ''
    })
    it('SLightbox navigates and closes', async () => {
        const wrapper = mount(SLightbox, { props: { images: photos, open: true, index: 0 }, attachTo: document.body })
        await nextTick()
        expect(document.body.textContent).toContain('1 / 2')
        const btn = (label: string) => {
            const el = document.body.querySelector(`[aria-label="${label}"]`)
            if (!el) {
                throw new Error(`missing ${label}`)
            }
            return el
        }
        btn('Next image').dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('update:index')?.[0]).toEqual([1])
        btn('Close viewer').dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('SGallery opens the lightbox at the clicked image', async () => {
        const wrapper = mount(SGallery, { props: { images: photos }, attachTo: document.body })
        await wrapper.findAll('button')[0].trigger('click')
        await nextTick()
        expect(document.body.textContent).toContain('1 / 2')
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('SCarousel steps through slides', async () => {
        const wrapper = mount(SCarousel, {
            slots: { default: [h('div', 'one'), h('div', 'two'), h('div', 'three')] },
        })
        await wrapper.find('[aria-label="Next slide"]').trigger('click')
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
    })

    it('SSectionHeading renders eyebrow and title', () => {
        const wrapper = mount(SSectionHeading, { props: { eyebrow: 'Hi', title: 'Hello' } })
        expect(wrapper.text()).toContain('Hi')
        expect(wrapper.text()).toContain('Hello')
    })

    it('SFeature emits link', async () => {
        const wrapper = mount(SFeature, { props: { title: 'F', linkLabel: 'More' } })
        await wrapper.find('button').trigger('click')
        expect(wrapper.emitted('link')).toHaveLength(1)
    })

    it('STestimonial renders quote and author', () => {
        const wrapper = mount(STestimonial, { props: { quote: 'Great', name: 'Ann' } })
        expect(wrapper.text()).toContain('Great')
        expect(wrapper.text()).toContain('Ann')
    })

    it('SBlogCard renders title and byline', () => {
        const wrapper = mount(SBlogCard, { props: { title: 'Post', author: 'Ann', date: 'Today' } })
        expect(wrapper.text()).toContain('Post')
        expect(wrapper.text()).toContain('Ann')
    })

    it('SNewsletter validates and succeeds', async () => {
        vi.useFakeTimers()
        const wrapper = mount(SNewsletter)
        await wrapper.find('form').trigger('submit')
        expect(wrapper.text()).toContain('valid email')
        await wrapper.find('input').setValue('a@b.test')
        await wrapper.find('form').trigger('submit')
        vi.advanceTimersByTime(600)
        await nextTick()
        expect(wrapper.emitted('submit')?.[0]).toEqual(['a@b.test'])
        vi.useRealTimers()
    })

    it('SFooter renders columns', () => {
        const wrapper = mount(SFooter, {
            props: { brandName: 'Acme', columns: [{ heading: 'Docs', links: [{ label: 'Install' }] }], bottomNote: '©' },
        })
        expect(wrapper.text()).toContain('Acme')
        expect(wrapper.text()).toContain('Install')
    })

    it('SCta renders actions', () => {
        const wrapper = mount(SCta, { props: { title: 'Go' }, slots: { default: '<button>Start</button>' } })
        expect(wrapper.text()).toContain('Go')
        expect(wrapper.find('button').exists()).toBe(true)
    })

    it('SMarquee renders content twice for the loop', () => {
        const wrapper = mount(SMarquee, { slots: { default: '<span>hi</span>' } })
        expect(wrapper.findAll('.s-marquee-half')).toHaveLength(2)
    })
})
