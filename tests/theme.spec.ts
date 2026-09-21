import { describe, expect, it, beforeEach } from 'vitest'
import { useDark, setTheme } from '../src/theme/index'

function ensureStorage() {
    if (typeof localStorage !== 'undefined') {
        return
    }
    const store = new Map<string, string>()
    Object.defineProperty(globalThis, 'localStorage', {
        value: {
            getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
            setItem: (k: string, v: string) => void store.set(k, String(v)),
            removeItem: (k: string) => void store.delete(k),
            clear: () => store.clear(),
        },
        configurable: true,
    })
}

describe('useDark', () => {
    beforeEach(() => {
        ensureStorage()
        localStorage.clear()
        document.documentElement.classList.remove('dark')
    })

    it('persists toggles to localStorage', () => {
        const { isDark, toggle } = useDark()
        toggle(true)
        expect(isDark.value).toBe(true)
        expect(localStorage.getItem('simple-ui:theme')).toBe('dark')
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        toggle(false)
        expect(localStorage.getItem('simple-ui:theme')).toBe('light')
    })

    it('init restores the stored choice over system preference', () => {
        localStorage.setItem('simple-ui:theme', 'dark')
        const { isDark, init } = useDark()
        init()
        expect(isDark.value).toBe(true)
        expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
})

describe('setTheme', () => {
    it('writes --s-* variables', () => {
        setTheme({ accent: '#7c3aed' })
        expect(document.documentElement.style.getPropertyValue('--s-accent')).toBe('#7c3aed')
        document.documentElement.style.removeProperty('--s-accent')
    })
})
