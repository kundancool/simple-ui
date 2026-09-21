import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/**
 * The registry is the single source for docs, llms.txt and the MCP server, so
 * it must stay in step with the icon set — otherwise agents invent names.
 */
describe('registry icon coverage', () => {
    it('carries every registered icon name', () => {
        const registryPath = join(root, 'dist', 'registry.json')
        const registry = JSON.parse(readFileSync(registryPath, 'utf8'))
        const source = readFileSync(join(root, 'src', 'icons', 'registry.ts'), 'utf8')
        const names = JSON.parse(source.match(/export const iconNames: string\[\] = (\[[^\]]*\])/)[1])

        expect(names.length).toBeGreaterThan(40)
        expect(registry.icons).toEqual(names)
    })

    it('keeps every spec-required icon resolvable through s-icon', () => {
        const source = readFileSync(join(root, 'src', 'icons', 'registry.ts'), 'utf8')
        const names = JSON.parse(source.match(/export const iconNames: string\[\] = (\[[^\]]*\])/)[1])
        const required = ['refresh', 'plus', 'edit', 'delete', 'close', 'check', 'user', 'setting', 'calendar', 'money']
        expect(required.filter((name) => !names.includes(name))).toEqual([])
    })
})
