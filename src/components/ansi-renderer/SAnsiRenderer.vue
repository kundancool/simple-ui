<template>
    <pre class="s-ansi-viewer" v-html="html" />
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SAnsiRenderer' })

const props = defineProps({
    value: { type: String, default: '' },
})

const PALETTE = ['#111827', '#ef4444', '#22c55e', '#eab308', '#3b82f6', '#a855f7', '#06b6d4', '#e5e7eb']
const BRIGHT = ['#374151', '#f87171', '#86efac', '#fde047', '#93c5fd', '#c084fc', '#67e8f9', '#f9fafb']

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function ansiToHtml(text) {
    if (!text) {
        return ''
    }
    const state = { fg: null, bg: null, bold: false, italic: false, underline: false, strikethrough: false, inverse: false }
    let result = ''
    let open = false

    function styles() {
        const out = []
        if (state.bold) {
            out.push('font-weight:bold')
        }
        if (state.italic) {
            out.push('font-style:italic')
        }
        if (state.underline) {
            out.push('text-decoration:underline')
        }
        if (state.strikethrough) {
            out.push('text-decoration:line-through')
        }
        if (state.inverse) {
            out.push(`color:${state.bg ?? '#111827'};background-color:${state.fg ?? '#e5e7eb'}`)
        } else {
            if (state.fg) {
                out.push(`color:${state.fg}`)
            }
            if (state.bg) {
                out.push(`background-color:${state.bg}`)
            }
        }
        return out.join(';')
    }

    function reset() {
        state.fg = null
        state.bg = null
        state.bold = false
        state.italic = false
        state.underline = false
        state.strikethrough = false
        state.inverse = false
    }

    function apply(nums) {
        let i = 0
        while (i < nums.length) {
            const n = nums[i]
            if (n === 0) {
                reset()
            } else if (n === 1) {
                state.bold = true
            } else if (n === 3) {
                state.italic = true
            } else if (n === 4) {
                state.underline = true
            } else if (n === 7) {
                state.inverse = true
            } else if (n === 9) {
                state.strikethrough = true
            } else if (n >= 30 && n <= 37) {
                state.fg = (state.bold ? BRIGHT : PALETTE)[n - 30]
            } else if (n >= 90 && n <= 97) {
                state.fg = BRIGHT[n - 90]
            } else if (n >= 40 && n <= 47) {
                state.bg = PALETTE[n - 40]
            } else if (n >= 100 && n <= 107) {
                state.bg = BRIGHT[n - 100]
            } else if ((n === 38 || n === 48) && nums[i + 1] === 5 && nums[i + 2] !== undefined) {
                const c = xterm256(nums[i + 2])
                if (n === 38) {
                    state.fg = c
                } else {
                    state.bg = c
                }
                i += 2
            } else if ((n === 38 || n === 48) && nums[i + 1] === 2 && nums[i + 2] !== undefined) {
                const c = `rgb(${nums[i + 2] ?? 0},${nums[i + 3] ?? 0},${nums[i + 4] ?? 0})`
                if (n === 38) {
                    state.fg = c
                } else {
                    state.bg = c
                }
                i += 4
            } else if (n === 39) {
                state.fg = null
            } else if (n === 49) {
                state.bg = null
            }
            i += 1
        }
    }

    function xterm256(n) {
        if (n < 8) {
            return PALETTE[n]
        }
        if (n < 16) {
            return BRIGHT[n - 8]
        }
        if (n < 232) {
            const v = n - 16
            const r = Math.floor(v / 36)
            const g = Math.floor((v % 36) / 6)
            const b = v % 6
            const conv = (c) => (c === 0 ? 0 : 55 + c * 40)
            return `rgb(${conv(r)},${conv(g)},${conv(b)})`
        }
        const g = 8 + (n - 232) * 10
        return `rgb(${g},${g},${g})`
    }

    let i = 0
    while (i < text.length) {
        if (text[i] === '\x1b' && text[i + 1] === '[') {
            const end = text.indexOf('m', i)
            if (end === -1) {
                result += escapeHtml(text[i])
                i += 1
                continue
            }
            const code = text.substring(i + 2, end)
            i = end + 1
            if (open) {
                result += '</span>'
                open = false
            }
            apply(code === '' ? [0] : code.split(';').map(Number))
            const s = styles()
            if (s) {
                result += `<span style="${s}">`
                open = true
            }
            continue
        }
        result += escapeHtml(text[i])
        i += 1
    }
    if (open) {
        result += '</span>'
    }
    return result
}

const html = computed(() => ansiToHtml(props.value))
</script>
