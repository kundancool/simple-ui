import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import App from '../docs/App.vue'

function stubBrowserChartApis() {
    const noop = () => {}
    const ctx = new Proxy(
        {},
        {
            get: (target, prop) => {
                if (prop === 'canvas') {
                    return document.createElement('canvas')
                }
                if (prop === 'measureText') {
                    return () => ({ width: 0 })
                }
                if (prop === 'getImageData') {
                    return () => ({ data: [] })
                }
                return typeof prop === 'string' ? noop : undefined
            },
        },
    )
    HTMLCanvasElement.prototype.getContext = (() => ctx) as unknown as typeof HTMLCanvasElement.prototype.getContext
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    } as unknown as typeof ResizeObserver
    if (typeof window.requestAnimationFrame !== 'function') {
        window.requestAnimationFrame = ((fn: FrameRequestCallback) => setTimeout(() => fn(Date.now()), 16)) as typeof window.requestAnimationFrame
    }
}

function slug(file: string): string {
    return file
        .replace(/\.vue$/, '')
        .replace(/^Demo/, '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase()
}

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'pages', 'demo')
const routes = readdirSync(dir)
    .filter((f) => f.endsWith('.vue'))
    .map((f) => `/demo/${slug(f)}`)

describe('docs shell routing', () => {
    beforeAll(stubBrowserChartApis)

    it('roots the shell in themed background + text so icons follow dark mode', () => {
        const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'App.vue'), 'utf8')
        expect(source).toMatch(/s-bg-app[\s\S]{0,80}s-text-primary|s-text-primary[\s\S]{0,80}s-bg-app/)
    })

    it.each(['/docs', '/docs/theming', '/docs/components/button'])('renders %s without errors', async (route) => {
        window.location.hash = `#${route}`
        const realFetch = global.fetch
        global.fetch = (async () => ({
            ok: true,
            json: async () => ({
                package: '@kundancool/simple-ui',
                version: '0.1.0',
                components: [{ dir: 'button', name: 'Button', tag: 's-button', category: 'Basic', description: 'd', props: [], events: [], slots: [], example: '<s-button />' }],
            }),
        })) as unknown as typeof fetch
        const wrapper = mount(App, { attachTo: document.body })
        await nextTick()
        await new Promise((r) => setTimeout(r, 50))
        expect(wrapper.html().length).toBeGreaterThan(500)
        // sidebar grouping ran (the Map-shadowing regression)
        if (route.startsWith('/docs/components')) {
            expect(wrapper.html()).toContain('Basic')
        }
        // the RIGHT page, not a fallback (the prefix-matcher regression)
        if (route === '/docs/components/button') {
            expect(wrapper.html()).toContain('&lt;s-button&gt;')
        }
        // the docs shell renders the real sidebar component (not a dead element)
        if (route !== '/' && !route.startsWith('/demo/')) {
            expect(wrapper.html()).toContain('Simple UI')
            expect(wrapper.find('aside.s-sidebar').exists()).toBe(true)
        }
        global.fetch = realFetch
        wrapper.unmount()
        document.body.innerHTML = ''
        window.location.hash = '#/'
    })

    for (const route of routes) {
        it(`renders ${route} without errors`, async () => {
            window.location.hash = `#${route}`
            const wrapper = mount(App, { attachTo: document.body })
            await nextTick()
            await new Promise((r) => setTimeout(r, 50))
            expect(wrapper.html().length).toBeGreaterThan(500)
            wrapper.unmount()
            document.body.innerHTML = ''
            window.location.hash = '#/'
        })
    }
})
