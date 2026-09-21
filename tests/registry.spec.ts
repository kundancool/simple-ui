import { describe, expect, it } from 'vitest'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SimpleUIResolver } from '../src/resolver'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('registry completeness', () => {
    const dirs = readdirSync(join(root, 'src', 'components'), { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)

    it('every component dir has an index, a vue file and meta.json', () => {
        expect(dirs.length).toBeGreaterThan(20)
        for (const dir of dirs) {
            const base = join(root, 'src', 'components', dir)
            expect(existsSync(join(base, 'index.ts')), `${dir}/index.ts`).toBe(true)
            expect(existsSync(join(base, 'meta.json')), `${dir}/meta.json`).toBe(true)
            const vueFiles = readdirSync(base).filter((f) => f.endsWith('.vue'))
            expect(vueFiles.length, `${dir} *.vue`).toBeGreaterThan(0)
        }
    })

    it('every meta.json has name, description, props and example', () => {
        for (const dir of dirs) {
            const meta = JSON.parse(readFileSync(join(root, 'src', 'components', dir, 'meta.json'), 'utf8'))
            expect(meta.tag?.startsWith('s-'), `${dir} s- tag`).toBe(true)
            expect(meta.name?.length, `${dir} display name`).toBeGreaterThan(0)
            expect(Array.isArray(meta.props), `${dir} props`).toBe(true)
            expect(meta.example?.length, `${dir} example`).toBeGreaterThan(0)
        }
    })

    it('every component is exported, resolvable and demonstrated', () => {
        const componentsTs = readFileSync(join(root, 'src', 'components.ts'), 'utf8')
        const resolver = SimpleUIResolver()
        for (const dir of dirs) {
            const meta = JSON.parse(readFileSync(join(root, 'src', 'components', dir, 'meta.json'), 'utf8'))
            const pascal = meta.tag
                .split('-')
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join('')
            // the tag must resolve to a real export (Vue matches <s-x> to SXx, never SXX)
            expect(componentsTs.includes(`    ${pascal},`), `${dir} exports ${pascal}`).toBe(true)
            expect(resolver.resolve(pascal)?.name, `${dir} resolvable`).toBe(pascal)
            expect(existsSync(join(root, 'docs', 'examples', `${dir}.vue`)), `${dir} docs example`).toBe(true)
        }
    })
})

describe('SimpleUIResolver', () => {
    it('resolves S* names', () => {
        const resolver = SimpleUIResolver()
        expect(resolver.resolve('SButton')).toMatchObject({ name: 'SButton' })
        expect(resolver.resolve('SDataTable')).toMatchObject({ name: 'SDataTable' })
        expect(resolver.resolve('ElButton')).toBeUndefined()
    })
})
