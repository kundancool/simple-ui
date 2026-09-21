import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Every docs example must mount without throwing — a broken demo
 * unmounts its whole page in production.
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

const files = readdirSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'examples')).filter((f) => f.endsWith('.vue'))

describe('docs examples', () => {
    beforeAll(stubBrowserChartApis)

    for (const file of files) {
        it(`${file} mounts without errors`, async () => {
            const mod = await import(`../docs/examples/${file}`)
            const wrapper = mount(mod.default, { attachTo: document.body })
            await nextTick()
            expect(wrapper.html().length).toBeGreaterThan(20)
            wrapper.unmount()
            document.body.innerHTML = ''
        })
    }
})
