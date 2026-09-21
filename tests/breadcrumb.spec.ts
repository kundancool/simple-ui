import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SBreadcrumb from '../src/components/breadcrumb/SBreadcrumb.vue'

describe('SBreadcrumb', () => {
    const items = [{ label: 'Reports', to: '/reports' }, { label: 'Revenue' }]

    it('marks the last item as current page', () => {
        const wrapper = mount(SBreadcrumb, { props: { items } })
        const current = wrapper.find('[aria-current="page"]')
        expect(current.text()).toBe('Revenue')
        expect(current.element.tagName).toBe('SPAN')
    })

    it('renders links for earlier items and emits navigate', async () => {
        const wrapper = mount(SBreadcrumb, { props: { items } })
        const link = wrapper.find('a')
        expect(link.text()).toBe('Reports')
        await link.trigger('click')
        expect(wrapper.emitted('navigate')?.[0]).toEqual([items[0]])
    })
})
