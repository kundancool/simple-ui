/**
 * Shared option contract for date pickers (docs/spec/03 API conventions).
 *
 * Shape: `{ label, value: 'YYYY-MM-DD' }` for single dates,
 * `{ label, range: ['YYYY-MM-DD', 'YYYY-MM-DD'] }` for ranges.
 * Consumers override shortcuts by passing `options`; malformed entries are
 * ignored (dev-warned), never thrown on or emitted.
 *
 * Canonical internal form is ISO (`YYYY-MM-DD`). `format` controls the
 * trigger text, `valueFormat` controls emitted values — both accept
 * YYYY / MM / DD tokens in any order.
 */

export interface DateOption {
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
    console.warn(`[Simple UI] date option ignored: ${message}`)
}

/**
 * Validate one option for the given mode. Returns the cleaned value
 * (string for single, [from, to] for range) or null when unusable.
 */
export function normalizeOption(option: DateOption, range: boolean): string | [string, string] | null {
    if (!option || typeof option.label !== 'string') {
        warn('option needs a string label.')
        return null
    }
    if (range) {
        const [from, to] = option.range ?? []
        if (!isIsoDate(from) || !isIsoDate(to)) {
            warn(`"${option.label}" needs range: [from, to] as YYYY-MM-DD.`)
            return null
        }
        if (from > to) {
            warn(`"${option.label}" starts after it ends.`)
            return null
        }
        return [from, to]
    }
    if (!isIsoDate(option.value)) {
        warn(`"${option.label}" needs value as YYYY-MM-DD.`)
        return null
    }
    return option.value
}

/** True when an ISO date falls in any well-formed [from, to] range. Malformed entries are ignored. */
export function isInDisabledRanges(iso: string, ranges: unknown): boolean {
    if (!Array.isArray(ranges)) {
        return false
    }
    return ranges.some((entry) => {
        if (!Array.isArray(entry)) {
            return false
        }
        const [from, to] = entry
        return isIsoDate(from) && isIsoDate(to) && iso >= from && iso <= to
    })
}

/** Resolve an options prop to its usable entries (order preserved). */
export function resolveOptions(options: DateOption[] | null | undefined, range: boolean): DateOption[] {
    if (!Array.isArray(options)) {
        return []
    }
    return options.filter((o) => normalizeOption(o, range) !== null)
}

/** Render a Date with YYYY / MM / DD tokens in any order. */
export function formatWithTokens(date: Date, fmt: string): string {
    return fmt
        .replace('YYYY', String(date.getFullYear()))
        .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
        .replace('DD', String(date.getDate()).padStart(2, '0'))
}

/** Parse a token-formatted string back to a Date. Null when unusable. */
export function parseWithTokens(value: unknown, fmt: string): Date | null {
    if (typeof value !== 'string' || !value) {
        return null
    }
    const order: string[] = []
    const pattern = fmt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/YYYY|MM|DD/g, (token) => {
        order.push(token)
        return token === 'YYYY' ? '(\\d{4})' : '(\\d{2})'
    })
    const match = value.match(new RegExp(`^${pattern}$`))
    if (!match) {
        return null
    }
    const parts: Record<string, number> = {}
    order.forEach((token, i) => {
        parts[token] = Number(match[i + 1])
    })
    const date = new Date(parts.YYYY, (parts.MM ?? 1) - 1, parts.DD ?? 1)
    if (date.getFullYear() !== parts.YYYY || date.getMonth() !== (parts.MM ?? 1) - 1 || date.getDate() !== (parts.DD ?? 1)) {
        return null
    }
    date.setHours(0, 0, 0, 0)
    return date
}
