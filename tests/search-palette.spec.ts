import { describe, expect, it, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SSearchPalette from '../src/components/search-palette/SSearchPalette.vue'

const items = [
    { label: 'Overview', hint: 'Guide', to: '#/' },
    { label: 'Data Table', hint: 'Data', to: '#/components/data-table' },
    { label: 'Dialog', hint: 'Feedback', to: '#/components/dialog' },
]

    it('tolerates duplicate links without duplicate-key warnings', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const dupes = [
            { label: 'Docs', to: '#/docs' },
            { label: 'Guides', to: '#/docs' },
        ]
        const wrapper = mount(SSearchPalette, { props: { items: dupes, modelValue: true }, attachTo: document.body })
        await nextTick()
        expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(2)
        await wrapper.setProps({ items: [...dupes, { label: 'More', to: '#/docs' }] })
        expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Duplicate keys'))
        warn.mockRestore()
        wrapper.unmount()
        document.body.innerHTML = ''
    })

function panelInput(): HTMLInputElement {
    const el = document.body.querySelector('.s-spotlight-panel input')
    if (!el) {
        throw new Error('palette input not found')
    }
    return el as HTMLInputElement
}

function type(text: string) {
    const el = panelInput()
    el.value = text
    el.dispatchEvent(new Event('input', { bubbles: true }))
}

afterEach(() => {
    document.body.innerHTML = ''
})

describe('SSearchPalette', () => {
    it('filters items by label and hint', async () => {
        mount(SSearchPalette, { props: { items, modelValue: true }, attachTo: document.body })
        await nextTick()
        type('dialog')
        await nextTick()
        const options = document.body.querySelectorAll('.s-spotlight-panel [role="option"]')
        expect(options).toHaveLength(1)
        expect(document.body.textContent).toContain('Dialog')
    })

    it('emits select on Enter and closes', async () => {
        const wrapper = mount(SSearchPalette, { props: { items, modelValue: true }, attachTo: document.body })
        await nextTick()
        panelInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('select')?.[0]).toEqual([items[0]])
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    })

    it('toggles with the global shortcut', async () => {
        const wrapper = mount(SSearchPalette, { props: { items, modelValue: false }, attachTo: document.body })
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
        await nextTick()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
        wrapper.unmount()
    })
})
