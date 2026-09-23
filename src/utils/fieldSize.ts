import type { FormSize } from '../composables/formContext'

/**
 * Shared control-height scale (docs/spec/01 §Control height contract).
 *
 * Every single-line form control resolves `--s-field-h` from this map so a
 * mixed row lines up by construction. Never duplicate these literals in a
 * component — import them.
 */
export const FIELD_HEIGHTS: Record<FormSize, string> = {
    xs: '28px',
    sm: '32px',
    md: '36px',
    lg: '40px',
}

export const FIELD_SIZES: FormSize[] = ['xs', 'sm', 'md', 'lg']

export function isFieldSize(value: unknown): boolean {
    return value === undefined || (typeof value === 'string' && (FIELD_SIZES as string[]).includes(value))
}
