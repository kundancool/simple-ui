import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function vueFiles(dir: string): string[] {
    const out: string[] = []
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
            out.push(...vueFiles(full))
        } else if (entry.name.endsWith('.vue') || entry.name.endsWith('.ts')) {
            out.push(full)
        }
    }
    return out
}

/**
 * chart.js and vue-chartjs are optional peers. Anything that imports them at
 * module scope makes them required at load time, which breaks every consumer
 * who never renders a chart — the 0.1.0 release shipped exactly that bug.
 */
describe('optional chart peers', () => {
    it('only the lazy chart runtime imports chart.js', () => {
        const offenders: string[] = []
        for (const file of vueFiles(join(root, 'src'))) {
            if (file.endsWith(join('charts', 'runtime.ts'))) {
                continue
            }
            const source = readFileSync(file, 'utf8')
            const staticImport = /^\s*import\s[^;]*from\s+['"](chart\.js|vue-chartjs)['"]/m
            if (staticImport.test(source)) {
                offenders.push(file.replace(root + '/', ''))
            }
        }
        expect(offenders).toEqual([])
    })

    it('chart components reach the runtime through a dynamic import', () => {
        for (const dir of ['line-chart', 'bar-chart', 'doughnut-chart']) {
            const source = readFileSync(join(root, 'src', 'components', dir, `${dir === 'line-chart' ? 'SLineChart' : dir === 'bar-chart' ? 'SBarChart' : 'SDoughnutChart'}.vue`), 'utf8')
            expect(source, `${dir} lazy import`).toMatch(/await import\(['"][^'"]*charts\/runtime['"]\)/)
        }
    })

    it('the built entry has no static chart.js import', () => {
        const entry = join(root, 'dist', 'simple-ui.js')
        if (!existsSync(entry)) {
            return
        }
        expect(readFileSync(entry, 'utf8')).not.toMatch(/^\s*import\s[^;]*from\s*['"](chart\.js|vue-chartjs)['"]/m)
    })
})

/**
 * Every public subpath must resolve without conditions a CJS resolver cannot
 * satisfy, and no build output may be promised that the build no longer emits.
 */
describe('package exports', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

    it('every subpath entry is resolvable', () => {
        for (const [key, value] of Object.entries(pkg.exports)) {
            if (typeof value === 'string') {
                expect(value, `${key} points at a file`).toMatch(/\.(js|css|json)$/)
                continue
            }
            expect(Object.keys(value), `${key} conditions`).toEqual(
                expect.arrayContaining(['types', 'import', 'default']),
            )
        }
    })

    it('does not advertise a UMD/CJS bundle', () => {
        expect(pkg.main).toBeUndefined()
        expect(pkg.unpkg).toBeUndefined()
        expect(pkg.jsdelivr).toBeUndefined()
        expect(pkg.module).toBe('./dist/simple-ui.js')
    })

    it('publishes dist and the agent docs', () => {
        expect(pkg.files).toEqual(expect.arrayContaining(['dist', 'llms.txt', 'README.md']))
    })
})
