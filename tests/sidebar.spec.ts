import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SSidebar from '../src/components/sidebar/SSidebar.vue'

describe('SSidebar', () => {
    it('renders brand, menu and footer slots', () => {
        const wrapper = mount(SSidebar, {
            props: { open: true, brandName: 'Acme', brandSub: 'v2' },
            slots: { default: '<nav>menu</nav>', footer: '<p>foot</p>' },
        })
        expect(wrapper.text()).toContain('Acme')
        expect(wrapper.text()).toContain('menu')
        expect(wrapper.text()).toContain('foot')
    })

    it('emits close from the collapse button', async () => {
        const wrapper = mount(SSidebar, { props: { open: true } })
        await wrapper.find('[aria-label="Collapse sidebar"]').trigger('click')
        expect(wrapper.emitted('update:open')?.[0]).toEqual([false])
    })

    it('collapses its own layout footprint on desktop', async () => {
        window.innerWidth = 1280
        const wrapper = mount(SSidebar, { props: { open: true }, attachTo: document.body })
        expect(wrapper.find('aside').attributes('style')).not.toContain('margin-left')
        await wrapper.setProps({ open: false })
        await nextTick()
        expect(wrapper.find('aside').attributes('style')).toContain('margin-left: -288px')
        wrapper.unmount()
        window.innerWidth = 1024
    })

    it('embeds in normal flow when fixed is false', () => {
        const wrapper = mount(SSidebar, { props: { open: true, fixed: false } })
        const aside = wrapper.find('aside')
        expect(aside.classes()).toContain('relative')
        expect(aside.classes()).not.toContain('fixed')
        expect(wrapper.find('.border-b').exists()).toBe(true)
    })

    it('resolves docs usage: menu + footer render inside', () => {
        const wrapper = mount(SSidebar, {
            props: { open: true },
            slots: {
                brand: '<a href="#/">brand</a>',
                default: '<nav>docs nav</nav>',
                footer: '<p>docs foot</p>',
            },
        })
        expect(wrapper.html()).toContain('docs nav')
        expect(wrapper.html()).toContain('docs foot')
    })
})
