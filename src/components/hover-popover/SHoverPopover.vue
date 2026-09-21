<template>
    <span ref="triggerRef" class="contents" @mouseenter="show" @mouseleave="hide" @click="toggleTouch" @focusin="show" @focusout="hide">
        <slot />
    </span>
    <Teleport to="body">
        <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="open"
                ref="popoverRef"
                class="fixed pointer-events-auto"
                :style="{ ...popoverStyle, zIndex: 'var(--s-z-popover)' }"
                @mouseenter="cancelHide"
                @mouseleave="hide"
            >
                <div class="s-bg-surface border s-border-theme rounded-lg s-shadow-lg-theme p-3 min-w-[200px] max-w-[calc(100vw-1rem)]">
                    <slot name="content" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'SHoverPopover' })

const props = defineProps({
    placement: { type: String, default: 'top', validator: (v) => ['top', 'bottom'].includes(v) },
    delay: { type: Number, default: 100 },
})

const triggerRef = ref(null)
const popoverRef = ref(null)
const open = ref(false)
const popoverStyle = ref({})

let showTimer = null
let hideTimer = null

function onKeydown(event) {
    if (open.value && event.key === 'Escape') {
        open.value = false
    }
}

onMounted(() => document.addEventListener('keydown', onKeydown))

function calcPosition() {
    if (!triggerRef.value) {
        return
    }
    const trigger = triggerRef.value.firstElementChild ?? triggerRef.value
    if (!trigger?.getBoundingClientRect) {
        return
    }
    const rect = trigger.getBoundingClientRect()
    nextTick(() => {
        const popoverEl = popoverRef.value
        const pw = popoverEl?.offsetWidth ?? 200
        const ph = popoverEl?.offsetHeight ?? 100
        let top
        if (props.placement === 'bottom') {
            top = rect.bottom + 8
            if (top + ph > window.innerHeight - 8) {
                top = rect.top - ph - 8
            }
        } else {
            top = rect.top - ph - 8
            if (top < 8) {
                top = rect.bottom + 8
            }
        }
        top = Math.max(8, Math.min(top, window.innerHeight - ph - 8))
        let left = rect.left + rect.width / 2 - pw / 2
        if (left < 8) {
            left = 8
        }
        if (left + pw > window.innerWidth - 8) {
            left = window.innerWidth - pw - 8
        }
        popoverStyle.value = { top: `${top}px`, left: `${left}px` }
    })
}

function show() {
    clearTimeout(hideTimer)
    showTimer = setTimeout(() => {
        open.value = true
        nextTick(() => calcPosition())
    }, props.delay)
}

function cancelHide() {
    clearTimeout(hideTimer)
}

function hide() {
    clearTimeout(showTimer)
    hideTimer = setTimeout(() => {
        open.value = false
    }, 150)
}

/**
 * Touch devices have no hover — a tap toggles instead. Mouse users never
 * reach here with intent: mouseenter already opened it, and the toggle
 * would fight the hover timers, so touch taps only.
 */
function toggleTouch() {
    if (!window.matchMedia?.('(hover: none)').matches) {
        return
    }
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    if (open.value) {
        open.value = false
    } else {
        open.value = true
        nextTick(() => calcPosition())
    }
}

onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
})
</script>
