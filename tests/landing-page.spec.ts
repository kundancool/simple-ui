import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LandingPage from '../docs/pages/LandingPage.vue'

function stubRaf() {
    if (typeof window.requestAnimationFrame !== 'function') {
        window.requestAnimationFrame = ((fn: FrameRequestCallback) => setTimeout(() => fn(Date.now()), 16)) as typeof window.requestAnimationFrame
    }
}

describe('landing page', () => {
    beforeAll(stubRaf)

    it('CTA buttons navigate', async () => {
        window.location.hash = '#/'
        const wrapper = mount(LandingPage, {
            props: { registry: { package: 'x', version: '0.1.0', components: [] } },
            attachTo: document.body,
        })
        await nextTick()
        const buttons = wrapper.findAllComponents({ name: 'SButton' })
        const getStarted = buttons.find((b) => b.text().includes('Get started'))
        expect(getStarted, 'Get started CTA exists').toBeTruthy()
        await getStarted.trigger('click')
        expect(window.location.hash).toBe('#/docs')
        wrapper.unmount()
        document.body.innerHTML = ''
        window.location.hash = '#/'
    })

    it('every footer link has a destination', async () => {
        const wrapper = mount(LandingPage, {
            props: { registry: { package: 'x', version: '0.1.0', components: [] } },
            attachTo: document.body,
        })
        await nextTick()
        const footer = wrapper.find('footer')
        expect(footer.exists()).toBe(true)
        const dead = footer.findAll('a').filter((a) => !a.attributes('href'))
        expect(dead.map((a) => a.text())).toEqual([])
        wrapper.unmount()
        document.body.innerHTML = ''
    })
})
