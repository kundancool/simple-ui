import { describe, expect, it, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SCopy from '../src/components/copy/SCopy.vue'

afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
})

describe('SCopy', () => {
    it('flashes “Copied” for a second on success', async () => {
        Object.defineProperty(window.navigator, 'clipboard', {
            value: { writeText: vi.fn().mockResolvedValue(undefined) },
            configurable: true,
        })
        Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true })
        vi.useFakeTimers()

        const wrapper = mount(SCopy, { props: { value: 'TMZ-1' }, attachTo: document.body })
        await wrapper.find('button').trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('Copied')

        vi.advanceTimersByTime(1000)
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).not.toContain('Copied')

        vi.useRealTimers()
        wrapper.unmount()
    })
})
