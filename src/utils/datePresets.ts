/**
 * Shared preset contract for date pickers (docs/spec/03 API conventions).
 *
 * Shape: `{ label, value: 'YYYY-MM-DD' }` for single dates,
 * `{ label, range: ['YYYY-MM-DD', 'YYYY-MM-DD'] }` for ranges.
 * Consumers override shortcuts by passing `presets`; malformed entries are
 * ignored (dev-warned), never thrown on or emitted.
 */

export interface DatePreset {
    label: string
    value?: string
    range?: [string, string] | string[]
}

export function isIsoDate(value: unknown): value is string {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false
    }
    const [y, m, d] = value.split('-').map(Number)
    const date = new Date(Date.UTC(y, m - 1, d))
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}

function warn(message: string): void {
    console.warn(`[Simple UI] date preset ignored: ${message}`)
}

/**
 * Validate one preset for the given mode. Returns the cleaned value
 * (string for single, [from, to] for range) or null when unusable.
 */
export function normalizePreset(preset: DatePreset, range: boolean): string | [string, string] | null {
    if (!preset || typeof preset.label !== 'string') {
        warn('preset needs a string label.')
        return null
    }
    if (range) {
        const [from, to] = preset.range ?? []
        if (!isIsoDate(from) || !isIsoDate(to)) {
            warn(`"${preset.label}" needs range: [from, to] as YYYY-MM-DD.`)
            return null
        }
        if (from > to) {
            warn(`"${preset.label}" starts after it ends.`)
            return null
        }
        return [from, to]
    }
    if (!isIsoDate(preset.value)) {
        warn(`"${preset.label}" needs value as YYYY-MM-DD.`)
        return null
    }
    return preset.value
}

/** Resolve a presets prop to its usable entries (order preserved). */
export function resolvePresets(presets: DatePreset[] | null | undefined, range: boolean): DatePreset[] {
    if (!Array.isArray(presets)) {
        return []
    }
    return presets.filter((p) => normalizePreset(p, range) !== null)
}

function iso(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function startOfDay(d: Date): Date {
    const c = new Date(d)
    c.setHours(0, 0, 0, 0)
    return c
}

function addDays(d: Date, n: number): Date {
    const c = new Date(d)
    c.setDate(c.getDate() + n)
    return c
}

/** Built-in range shortcuts, used unless the consumer passes `presets`. */
export function defaultRangePresets(): DatePreset[] {
    const today = startOfDay(new Date())
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const firstOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
    return [
        { label: 'Today', range: [iso(today), iso(today)] },
        { label: 'Yesterday', range: [iso(addDays(today, -1)), iso(addDays(today, -1))] },
        { label: 'Last 7 days', range: [iso(addDays(today, -6)), iso(today)] },
        { label: 'Last 30 days', range: [iso(addDays(today, -29)), iso(today)] },
        { label: 'This month', range: [iso(firstOfMonth), iso(today)] },
        { label: 'Last month', range: [iso(firstOfLastMonth), iso(lastOfLastMonth)] },
    ]
}
