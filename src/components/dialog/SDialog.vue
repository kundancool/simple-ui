<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0"
        >
            <div
                v-if="modelValue"
                class="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm p-4"
                :style="{ zIndex: zIndex }"
                @click.self="closeOnClick && cancel()"
            >
                <Transition
                    enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95 -translate-y-2" enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0" leave-to-class="opacity-0 scale-95 -translate-y-2"
                    appear
                >
                    <div
                        v-if="modelValue"
                        ref="panelRef"
                        role="dialog"
                        aria-modal="true"
                        :aria-labelledby="title ? titleId : undefined"
                        :aria-label="title ? undefined : (ariaLabel || undefined)"
                        tabindex="-1"
                        class="s-card rounded-2xl w-full overflow-hidden flex flex-col focus:outline-none"
                        :class="fullscreen ? 'fixed inset-0 rounded-none' : widthClass"
                        :style="fullscreen ? { zIndex: zIndex } : undefined"
                    >
                        <div class="flex items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4 border-b s-border-theme flex-shrink-0">
                            <slot name="header">
                                <h2 :id="titleId" class="text-sm font-semibold s-text-primary">{{ title }}</h2>
                            </slot>
                            <button
                                type="button"
                                aria-label="Close dialog"
                                class="s-focus-ring s-dialog-close flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md s-text-muted transition-colors"
                                @click="cancel"
                            >
                                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div class="px-4 py-4 md:px-6 md:py-5 overflow-y-auto" :class="fullscreen ? 'flex-1' : 'max-h-[75vh]'">
                            <slot />
                        </div>
                        <div v-if="$slots.footer" class="px-4 py-3 md:px-6 md:py-4 border-t s-border-theme s-bg-surface-raised flex-shrink-0 flex flex-wrap items-center justify-end gap-2 md:gap-3">
                            <slot name="footer" />
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, useId, watch } from 'vue'
import { lockBodyScroll, unlockBodyScroll } from '../../utils/scrollLock'
import { isTopDialog, popDialog, pushDialog } from '../../utils/dialogStack'

defineOptions({ name: 'SDialog' })

const props = defineProps({
    modelValue: { type: Boolean, required: true },
    title: { type: String, default: '' },
    /** xs | sm | md | lg | xl | 2xl | 3xl | 4xl | default. Alias: size. */
    width: { type: String, default: 'default' },
    size: { type: String, default: null },
    fullscreen: { type: Boolean, default: false },
    closeOnClick: { type: Boolean, default: true },
    closeOnEsc: { type: Boolean, default: true },
    ariaLabel: { type: String, default: '' },
    zIndex: { type: Number, default: 200 },
})

const emit = defineEmits(['update:modelValue', 'close', 'cancel'])

const instance = Symbol('dialog')
const resolvedWidth = computed(() => props.size || props.width)
const titleId = useId()
const panelRef = ref(null)

let previouslyFocused = null

const widthClass = computed(() => {
    const widths = {
        default: 'w-[90%] md:w-[50%]',
        xs: 'w-[90%] md:max-w-xs',
        sm: 'w-[90%] md:max-w-sm',
        md: 'w-[90%] md:max-w-md',
        lg: 'w-[90%] md:max-w-lg',
        xl: 'w-[90%] md:max-w-xl',
        '2xl': 'w-[90%] md:max-w-2xl',
        '3xl': 'w-[90%] md:max-w-3xl',
        '4xl': 'w-[90%] md:max-w-4xl',
    }
    return widths[resolvedWidth.value] || resolvedWidth.value
})

function close() {
    emit('update:modelValue', false)
    emit('close')
}

function cancel() {
    emit('cancel')
    close()
}

const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',')

/** Popovers teleported to body carry `data-overlay` so the trap includes them. */
function trapRoots() {
    return panelRef.value ? [panelRef.value, ...document.querySelectorAll('[data-overlay]')] : []
}

function focusableItems() {
    return trapRoots()
        .flatMap((root) => Array.from(root.querySelectorAll(FOCUSABLE)))
        .filter((el) => el.offsetParent !== null || el === document.activeElement)
}

function trapTab(event) {
    const items = focusableItems()
    if (!items.length || !trapRoots().some((root) => root.contains(document.activeElement))) {
        return
    }
    const first = items[0]
    const last = items[items.length - 1]
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
    }
}

function handleKeydown(e) {
    if (!props.modelValue || !isTopDialog(instance)) {
        return
    }
    if (e.key === 'Escape' && props.closeOnEsc) {
        cancel()
    } else if (e.key === 'Tab') {
        trapTab(e)
    }
}

async function activate() {
    previouslyFocused = document.activeElement
    pushDialog(instance)
    document.addEventListener('keydown', handleKeydown)
    lockBodyScroll()
    await nextTick()
    const [first] = focusableItems()
    ;(first || panelRef.value)?.focus()
}

function deactivate() {
    popDialog(instance)
    document.removeEventListener('keydown', handleKeydown)
    unlockBodyScroll()
    previouslyFocused?.focus?.()
    previouslyFocused = null
}

watch(
    () => props.modelValue,
    (isOpen) => {
        if (isOpen) {
            activate()
        } else {
            deactivate()
        }
    },
)

onMounted(() => {
    if (props.modelValue) {
        activate()
    }
})

onUnmounted(() => {
    popDialog(instance)
    document.removeEventListener('keydown', handleKeydown)
    if (props.modelValue) {
        unlockBodyScroll()
    }
})
</script>

<style>
.s-dialog-close:hover {
    color: var(--s-text-primary);
    background-color: var(--s-surface-raised);
}
</style>
