import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * The library is a general-purpose UI kit. Copy, examples and metadata must stay
 * domain-neutral: no hospitality / PMS vocabulary (rooms, guests, bookings,
 * nights, OTAs …).
 */
const root = join(fileURLToPath(import.meta.url), '..', '..')

const SCAN = [
    'docs/examples',
    'docs/pages',
    'docs/App.vue',
    'src/components',
    'mcp/src/tools.ts',
    'README.md',
    'DESIGN.md',
    'CONTRIBUTING.md',
    'CHANGELOG.md',
    'tests',
]

const SKIP_DIRS = new Set(['node_modules', 'dist', 'docs-dist', '.git'])
const SKIP_FILES = new Set(['vocabulary.spec.ts'])
const EXTENSIONS = new Set(['.vue', '.ts', '.js', '.mjs', '.json', '.md'])

/** Hospitality / PMS vocabulary. `checkout` is intentionally absent (generic). */
const BANNED = [
    /\bguests?\b/i,
    /\bbookings?\b/i,
    /\breservations?\b/i,
    /\boccupancy\b/i,
    /\boverbook\w*\b/i,
    /\bhotels?\b/i,
    /\bresorts?\b/i,
    /\bvillas?\b/i,
    /\bmotels?\b/i,
    /\bhostels?\b/i,
    /\brestaurants?\b/i,
    /\blobby\b/i,
    /\bhousekeeping\b/i,
    /\bconcierge\b/i,
    /\bfront desk\b/i,
    /\bnights?\b/i,
    /\bnightly\b/i,
    /\bper night\b/i,
    /\broom (type|no|number|rate|key)s?\b/i,
    /\bdeluxe\b/i,
    /\bspas?\b/i,
    /\badults?\b/i,
    /\binfants?\b/i,
    /\bturndown\b/i,
    /\bminibar\b/i,
    /\blinen\b/i,
    /\bcheck-?in\b/i,
    /MakeMyTrip/,
    /Goibibo/,
    /Booking\.com/,
    /\bMMT\b/,
    /Acme Stays/,
    /Tripmakerz/,
]

function collect(target, files = []) {
    const full = join(root, target)
    let entries
    try {
        entries = readdirSync(full, { withFileTypes: true })
    } catch {
        return files
    }
    for (const entry of entries) {
        if (SKIP_DIRS.has(entry.name)) {
            continue
        }
        const path = join(full, entry.name)
        if (entry.isDirectory()) {
            collect(target === '.' ? entry.name : join(target, entry.name), files)
        } else if (EXTENSIONS.has(extname(entry.name)) && !SKIP_FILES.has(entry.name)) {
            files.push(path)
        }
    }
    return files
}

describe('vocabulary', () => {
    it('keeps every example, demo and metadata entry domain-neutral', () => {
        const offenders = []
        for (const file of SCAN.flatMap((target) => collect(target))) {
            const lines = readFileSync(file, 'utf8').split('\n')
            lines.forEach((line, index) => {
                for (const pattern of BANNED) {
                    if (pattern.test(line)) {
                        offenders.push(`${file.replace(`${root}/`, '')}:${index + 1} → ${line.trim().slice(0, 120)}`)
                    }
                }
            })
        }
        expect(offenders).toEqual([])
    })
})
