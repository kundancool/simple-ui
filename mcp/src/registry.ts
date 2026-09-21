import { existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export interface RegistryComponent {
    dir: string
    name: string
    tag: string
    description: string
    props?: Array<{ name: string; type?: string; default?: string; description?: string }>
    events?: Array<{ name: string; description?: string }>
    slots?: Array<{ name: string; params?: string; description?: string }>
    example?: string
}

export interface Registry {
    package: string
    version: string
    prefix: string
    /** Names accepted by s-icon. */
    icons?: string[]
    install?: Record<string, string>
    theme?: Record<string, string>
    components: RegistryComponent[]
}

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@kundancool/simple-ui'
const memory = new Map<string, { at: number; registry: Registry }>()

async function fromUrl(url: string): Promise<Registry | null> {
    try {
        const res = await fetch(url)
        if (!res.ok) {
            return null
        }
        return (await res.json()) as Registry
    } catch {
        return null
    }
}

async function resolveLatestVersion(): Promise<string> {
    try {
        const res = await fetch('https://data.jsdelivr.com/v1/packages/npm/@kundancool/simple-ui')
        if (res.ok) {
            const data = (await res.json()) as { tags?: { latest?: string } }
            if (data.tags?.latest) {
                return data.tags.latest
            }
        }
    } catch {
        // fall through
    }
    return 'latest'
}

function localCandidates(): string[] {
    const here = dirname(fileURLToPath(import.meta.url))
    return [
        process.env.SIMPLE_UI_REGISTRY ?? '',
        join(process.cwd(), 'node_modules', '@kundancool', 'simple-ui', 'dist', 'registry.json'),
        join(here, '..', '..', 'dist', 'registry.json'),
        join(here, '..', '..', 'docs', 'public', 'registry.json'),
    ].filter(Boolean)
}

/**
 * Load the registry for a version.
 *
 * Order: explicit local path → user's installed package → dev checkout →
 * jsDelivr CDN (works in Workers, which have no filesystem).
 */
export async function loadRegistry(version = 'latest'): Promise<Registry> {
    const key = version || 'latest'
    const cached = memory.get(key)
    if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
        return cached.registry
    }

    for (const path of localCandidates()) {
        try {
            if (path && existsSync(path)) {
                const registry = JSON.parse(readFileSync(path, 'utf8')) as Registry
                memory.set(key, { at: Date.now(), registry })
                return registry
            }
        } catch {
            // try next source
        }
    }

    const resolved = key === 'latest' ? await resolveLatestVersion() : key
    const registry =
        (await fromUrl(`${CDN_BASE}@${resolved}/dist/registry.json`)) ??
        (await fromUrl(`${CDN_BASE}/dist/registry.json`))

    if (!registry) {
        throw new Error(`Could not load the Simple UI registry for version "${key}".`)
    }
    memory.set(key, { at: Date.now(), registry })
    return registry
}
