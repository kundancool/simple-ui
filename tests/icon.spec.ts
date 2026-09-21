import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SIcon from '../src/components/icon/SIcon.vue'
import IconRender from '../src/icons/IconRender.vue'
import { iconNames, icons } from '../src/icons/registry'

/** Every name the consuming app requires (spec §2.1). */
const REQUIRED = [
    'refresh', 'refreshright', 'plus', 'operation', 'edit', 'download', 'view', 'tickets',
    'promotion', 'document', 'select', 'check', 'morefilled', 'delete', 'close', 'arrowright',
    'arrowleft', 'user', 'copydocument', 'officebuilding', 'location', 'setting', 'dataanalysis',
    'arrowdown', 'chevrondown', 'upload', 'switchbutton', 'star', 'odometer', 'notebook', 'money',
    'message', 'medal', 'loading', 'key', 'fold', 'cpu', 'coin', 'calendar', 'mail', 'phone',
    'shieldcheck', 'image', 'forbidden', 'maintenance',
]

describe('SIcon', () => {
    it('registers every required icon name', () => {
        expect(REQUIRED.filter((name) => !iconNames.includes(name))).toEqual([])
    })

    it('renders inline svg shapes with no icon dependency', () => {
        const wrapper = mount(SIcon, { props: { name: 'refresh' } })
        expect(wrapper.element.tagName).toBe('svg')
        expect(wrapper.findAll('path').length).toBeGreaterThan(0)
    })

    it('is case-insensitive and silent for unknown names', () => {
        expect(mount(SIcon, { props: { name: 'REFRESH' } }).find('svg').exists()).toBe(true)
        expect(mount(SIcon, { props: { name: 'does-not-exist' } }).find('svg').exists()).toBe(false)
    })

    it('marks icons decorative unless labelled', () => {
        expect(mount(SIcon, { props: { name: 'check' } }).attributes('aria-hidden')).toBe('true')
        const labelled = mount(SIcon, { props: { name: 'check', label: 'Done' } })
        expect(labelled.attributes('aria-label')).toBe('Done')
        expect(labelled.attributes('role')).toBe('img')
        expect(labelled.attributes('aria-hidden')).toBeUndefined()
    })

    it('applies the size scale and spin', () => {
        expect(mount(SIcon, { props: { name: 'check', size: 'lg' } }).classes()).toContain('size-5')
        expect(mount(SIcon, { props: { name: 'loading', spinning: true } }).classes()).toContain('animate-spin')
    })

    it('forwards stray attributes to the svg', () => {
        const wrapper = mount(SIcon, { props: { name: 'check' }, attrs: { 'data-test': 'x' } })
        expect(wrapper.attributes('data-test')).toBe('x')
    })

    it('every registered icon has at least one shape', () => {
        const empty = iconNames.filter((name) => !icons[name]?.length)
        expect(empty).toEqual([])
    })
})

describe('IconRender', () => {
    it('accepts a registry name string', () => {
        const wrapper = mount(IconRender, { props: { icon: 'star' } })
        expect(wrapper.find('svg').exists()).toBe(true)
    })

    it('accepts a component and applies the size class', () => {
        const Inner = { template: '<svg class="custom" />' }
        const wrapper = mount(IconRender, { props: { icon: Inner, size: 'lg' } })
        expect(wrapper.find('.custom').classes()).toContain('w-5')
    })

    it('renders nothing without an icon', () => {
        const wrapper = mount(IconRender)
        expect(wrapper.find('svg').exists()).toBe(false)
        expect(wrapper.text()).toBe('')
    })
})
