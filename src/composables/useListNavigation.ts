import { ref, toValue, watch } from 'vue'

/**
 * Keyboard navigation for menus, listboxes, or any vertical list of choices.
 * Arrows move, Home/End jump, Enter picks, Escape leaves. The highlight is
 * tracked by index (not DOM focus) so a combobox can keep the caret in its
 * field while the highlight moves — the `aria-activedescendant` pattern.
 */
export interface ListNavigationOptions {
    onSelect?: (item: unknown, index: number) => void
    onClose?: () => void
    loop?: boolean
    typeahead?: boolean
    label?: (item: unknown) => string
}

export function useListNavigation(items, options: ListNavigationOptions = {}) {
    const {
        onSelect = () => {},
        onClose = () => {},
        loop = true,
        typeahead = false,
        label = (item) => String(item ?? ''),
    } = options

    const activeIndex = ref(0)

    let typed = ''
    let typedAt = 0

    const list = () => toValue(items) ?? []

    function setActive(index) {
        const size = list().length
        if (size === 0) {
            activeIndex.value = -1
            return
        }
        activeIndex.value = loop ? (index + size) % size : Math.max(0, Math.min(index, size - 1))
    }

    function reset() {
        activeIndex.value = list().length > 0 ? 0 : -1
        typed = ''
    }

    function matchTypeahead(key) {
        if (!typeahead || key.length !== 1 || !/\S/.test(key)) {
            return false
        }
        const now = Date.now()
        typed = now - typedAt > 1000 ? key : typed + key
        typedAt = now
        const at = list().findIndex((item) => label(item).toLowerCase().startsWith(typed.toLowerCase()))
        if (at !== -1) {
            activeIndex.value = at
        }
        return true
    }

    function onKeydown(event) {
        const size = list().length
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                setActive(activeIndex.value + 1)
                break
            case 'ArrowUp':
                event.preventDefault()
                setActive(activeIndex.value - 1)
                break
            case 'Home':
                event.preventDefault()
                setActive(0)
                break
            case 'End':
                event.preventDefault()
                setActive(size - 1)
                break
            case 'Enter':
                if (activeIndex.value >= 0 && activeIndex.value < size) {
                    event.preventDefault()
                    onSelect(list()[activeIndex.value], activeIndex.value)
                }
                break
            case 'Escape':
                event.preventDefault()
                onClose()
                break
            case 'Tab':
                onClose()
                break
            default:
                if (matchTypeahead(event.key)) {
                    event.preventDefault()
                }
        }
    }

    watch(
        () => list().length,
        (size) => {
            if (activeIndex.value >= size) {
                activeIndex.value = size > 0 ? size - 1 : -1
            }
        },
    )

    return { activeIndex, onKeydown, reset, setActive }
}
