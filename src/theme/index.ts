import { ref } from 'vue'

/**
 * Theme engine: dark-mode toggle + runtime token overrides.
 *
 * Dark mode follows the `.dark`-on-`<html>` convention, so one class
 * switches the whole page. The choice persists in localStorage.
 */

const STORAGE_KEY = 'simple-ui:theme'

const isDark = ref(false)

function readStored(): boolean | null {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        if (value === 'dark') {
            return true
        }
        if (value === 'light') {
            return false
        }
        return null
    } catch {
        return null
    }
}

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {
        // private mode — session choice stands
    }
}

function applyClass() {
    if (typeof document === 'undefined') {
        return
    }
    document.documentElement.classList.toggle('dark', isDark.value)
}

export function useDark() {
    function toggle(force?: boolean) {
        isDark.value = typeof force === 'boolean' ? force : !isDark.value
        persist()
        applyClass()
    }

    function init() {
        const stored = readStored()
        if (stored !== null) {
            isDark.value = stored
        } else if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
            isDark.value = true
        }
        applyClass()
    }

    return { isDark, toggle, init }
}

/**
 * Override any `--s-*` token at runtime, scoped to `:root` by default.
 *
 * Because subtle/border shades derive from their base via `color-mix()`,
 * overriding one base (e.g. `accent: '#7c3aed'`) re-themes the whole family.
 *
 * @param {Record<string, string>} tokens e.g. `{ accent: '#7c3aed' }`
 * @param {HTMLElement} [target] element to scope the overrides to
 */
export function setTheme(tokens: Record<string, string>, target?: HTMLElement) {
    const el = target ?? (typeof document !== 'undefined' ? document.documentElement : null)
    if (!el) {
        return
    }
    for (const [key, value] of Object.entries(tokens ?? {})) {
        el.style.setProperty(`--s-${key}`, value)
    }
}

/** Convenience for the most common override. */
export function setPrimary(color: string) {
    setTheme({ accent: color })
}
