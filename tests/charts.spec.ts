import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SBarChart from '../src/components/bar-chart/SBarChart.vue'
import SLineChart from '../src/components/line-chart/SLineChart.vue'
import SDoughnutChart from '../src/components/doughnut-chart/SDoughnutChart.vue'

/**
 * Regression test for dual chart.js copies: the components must render
 * against the SAME chart.js instance they register with, otherwise
 * Chart.js throws inside the mounted hook ("not a registered scale").
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

describe('charts', () => {
    beforeAll(stubBrowserChartApis)

    it('mounts a bar chart without errors', async () => {
        const wrapper = mount(SBarChart, {
            props: { labels: ['A', 'B'], datasets: [{ label: 'X', data: [1, 2] }] },
        })
        await nextTick()
        expect(wrapper.find('canvas').exists()).toBe(true)
    })

    it('mounts line and doughnut charts without errors', async () => {
        const line = mount(SLineChart, {
            props: { labels: ['A', 'B'], datasets: [{ label: 'X', data: [1, 2] }] },
        })
        const doughnut = mount(SDoughnutChart, {
            props: { labels: ['A', 'B'], datasets: [{ data: [1, 2] }] },
        })
        await nextTick()
        expect(line.find('canvas').exists()).toBe(true)
        expect(doughnut.find('canvas').exists()).toBe(true)
    })

    it('shows the empty slot without labels', () => {
        const wrapper = mount(SBarChart)
        expect(wrapper.text()).toContain('No data')
    })
})
