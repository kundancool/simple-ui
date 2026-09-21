import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SBarChart from '../src/components/bar-chart/SBarChart.vue'
import SLineChart from '../src/components/line-chart/SLineChart.vue'
import SDoughnutChart from '../src/components/doughnut-chart/SDoughnutChart.vue'

/**
 * Regression tests for the chart layer:
 *  1. the runtime is fetched through a dynamic import, so a skeleton shows
 *     first and the canvas only after the peer has loaded;
 *  2. the components render against the SAME chart.js instance they register
 *     with, otherwise Chart.js throws "not a registered scale".
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

/**
 * The chart runtime is fetched through a dynamic import, so the canvas appears
 * once the module resolves. Poll instead of guessing a fixed tick count — the
 * first import in a run also pays the transform cost.
 */
async function waitFor(predicate: () => boolean, timeout = 3000) {
    const started = Date.now()
    while (Date.now() - started < timeout) {
        if (predicate()) {
            return
        }
        await new Promise((resolve) => setTimeout(resolve, 10))
        await nextTick()
    }
}

describe('charts', () => {
    beforeAll(stubBrowserChartApis)

    it('mounts a bar chart without errors', async () => {
        const wrapper = mount(SBarChart, {
            props: { labels: ['A', 'B'], datasets: [{ label: 'X', data: [1, 2] }] },
        })
        await waitFor(() => wrapper.find('canvas').exists())
        expect(wrapper.find('canvas').exists()).toBe(true)
    })

    it('mounts line and doughnut charts without errors', async () => {
        const line = mount(SLineChart, {
            props: { labels: ['A', 'B'], datasets: [{ label: 'X', data: [1, 2] }] },
        })
        const doughnut = mount(SDoughnutChart, {
            props: { labels: ['A', 'B'], datasets: [{ data: [1, 2] }] },
        })
        await waitFor(() => line.find('canvas').exists() && doughnut.find('canvas').exists())
        expect(line.find('canvas').exists()).toBe(true)
        expect(doughnut.find('canvas').exists()).toBe(true)
    })

    it('renders a skeleton until chart.js has loaded', async () => {
        const wrapper = mount(SLineChart, {
            props: { labels: ['A'], datasets: [{ label: 'X', data: [1] }] },
        })
        expect(wrapper.find('.s-skeleton').exists()).toBe(true)
        await waitFor(() => wrapper.find('canvas').exists())
        expect(wrapper.find('.s-skeleton').exists()).toBe(false)
    })

    it('shows the empty slot without labels', () => {
        const wrapper = mount(SBarChart)
        expect(wrapper.text()).toContain('No data')
    })
})
