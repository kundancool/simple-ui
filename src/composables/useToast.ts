import { ref } from 'vue'

/**
 * Toast state + programmatic API (ElMessage-style ergonomics).
 *
 * `useToast()` inside a component tree that renders `<SToastContainer />`,
 * or call the standalone `toast.success('…')` anywhere — the container
 * auto-mounts to `document.body` on first use.
 */

const toasts = ref([])
let nextId = 0
let mounted = false

function add({ variant = 'info', message, duration = 4000 }: { variant?: string; message: string; duration?: number }) {
    const id = ++nextId
    toasts.value.push({ id, variant, message, duration })
    if (duration > 0) {
        setTimeout(() => remove(id), duration)
    }
    return id
}

function remove(id) {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index !== -1) {
        toasts.value.splice(index, 1)
    }
}

function clear() {
    toasts.value.splice(0)
}

async function ensureMounted() {
    if (mounted || typeof document === 'undefined') {
        return
    }
    mounted = true
    const { createApp, h } = await import('vue')
    const { default: SToastContainer } = await import('../components/toast/SToastContainer.vue')
    const el = document.createElement('div')
    el.setAttribute('data-simple-ui-toasts', '')
    document.body.appendChild(el)
    createApp({ render: () => h(SToastContainer) }).mount(el)
}

function standalone(variant: string, message: string, duration?: number) {
    void ensureMounted()
    return add({ variant, message, duration })
}

export const toast = {
    success: (message, duration) => standalone('success', message, duration),
    error: (message, duration) => standalone('error', message, duration),
    warning: (message, duration) => standalone('warning', message, duration),
    info: (message, duration) => standalone('info', message, duration),
    remove,
    clear,
}

export function useToast() {
    return {
        toasts,
        remove,
        clear,
        success: (message: string, duration?: number) => add({ variant: 'success', message, duration }),
        error: (message: string, duration?: number) => add({ variant: 'error', message, duration }),
        warning: (message: string, duration?: number) => add({ variant: 'warning', message, duration }),
        info: (message: string, duration?: number) => add({ variant: 'info', message, duration }),
    }
}
