/**
 * Reference-counted body scroll lock for overlays.
 * Several dialogs may be open at once; the page scrolls again only after
 * the last holder releases.
 */

let depth = 0
let previous = null

function scrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth
}

export function lockBodyScroll() {
    depth += 1
    if (depth > 1) {
        return
    }
    const { body } = document
    const gap = scrollbarWidth()
    previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
    body.style.overflow = 'hidden'
    if (gap > 0) {
        const current = parseFloat(window.getComputedStyle(body).paddingRight) || 0
        body.style.paddingRight = `${current + gap}px`
    }
}

export function unlockBodyScroll() {
    if (depth === 0) {
        return
    }
    depth -= 1
    if (depth > 0) {
        return
    }
    const { body } = document
    body.style.overflow = previous?.overflow ?? ''
    body.style.paddingRight = previous?.paddingRight ?? ''
    previous = null
}
