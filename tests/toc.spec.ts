import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SToc from '../src/components/toc/SToc.vue'

describe('SToc', () => {
    const items = [
        { id: 'install', label: 'Install' },
        { id: 'theming', label: 'Theming', depth: 2 },
    ]

    it('renders entries and jumps on click', async () => {
        const scrollIntoView = function (this: Element) {
            ;(this as unknown as { scrolled?: boolean }).scrolled = true
        }
        Element.prototype.scrollIntoView = scrollIntoView as unknown as typeof Element.prototype.scrollIntoView
        document.body.innerHTML = '<h2 id="install">x</h2><h2 id="theming">y</h2>'
        const wrapper = mount(SToc, { props: { items, spy: false }, attachTo: document.body })
        const buttons = wrapper.findAll('button')
        expect(buttons).toHaveLength(2)
        await buttons[1].trigger('click')
        expect(wrapper.emitted('select')?.[0]).toEqual(['theming'])
        expect(document.getElementById('theming')).toBeTruthy()
        wrapper.unmount()
        document.body.innerHTML = ''
    })

    it('indents nested depths', () => {
        const wrapper = mount(SToc, { props: { items, spy: false } })
        expect(wrapper.findAll('button')[1].classes()).toContain('pl-5')
    })
})
