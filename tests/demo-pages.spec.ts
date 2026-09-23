import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Smoke test: every docs demo page mounts without throwing, so a broken
 * demo can never take down docs navigation. Pages are discovered from the
 * directory — adding a file auto-covers it.
 */
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

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'pages', 'demo')
const files = readdirSync(dir).filter((f) => f.endsWith('.vue'))

describe('demo pages', () => {
    beforeAll(stubBrowserChartApis)

    it('has a healthy number of demos', () => {
        expect(files.length).toBeGreaterThanOrEqual(40)
    })

    for (const file of files) {
        it(`${file} mounts without errors`, async () => {
            const mod = await import(`../docs/pages/demo/${file}`)
            const wrapper = mount(mod.default, { attachTo: document.body })
            await nextTick()
            expect(wrapper.html().length).toBeGreaterThan(100)
            wrapper.unmount()
            document.body.innerHTML = ''
        }, 30000)
    }
})
