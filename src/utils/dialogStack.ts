/**
 * Tracks open dialogs, oldest first, so only the topmost one answers
 * Escape/Tab when dialogs stack.
 */

const stack = []

/** @param {symbol} id */
export function pushDialog(id) {
    if (!stack.includes(id)) {
        stack.push(id)
    }
}

/** @param {symbol} id */
export function popDialog(id) {
    const at = stack.indexOf(id)
    if (at !== -1) {
        stack.splice(at, 1)
    }
}

/** @param {symbol} id */
export function isTopDialog(id) {
    return stack.length > 0 && stack[stack.length - 1] === id
}
