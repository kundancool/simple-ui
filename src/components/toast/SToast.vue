<template>
    <div
        role="alert"
        class="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg overflow-hidden w-full text-white md:max-w-[320px] pointer-events-auto"
        :class="variant.wrapper"
        style="box-shadow: var(--s-shadow-lg)"
    >
        <div
            class="absolute bottom-0 left-0 h-0.5 transition-none"
            :class="variant.bar"
            :style="{ width: progress + '%', transition: paused ? 'none' : `width ${toast.duration ?? 4000}ms linear` }"
        />
        <svg v-if="toast.variant === 'success'" class="w-4 h-4 flex-shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="toast.variant === 'error'" class="w-4 h-4 flex-shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="toast.variant === 'warning'" class="w-4 h-4 flex-shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <svg v-else class="w-4 h-4 flex-shrink-0 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p class="text-sm font-medium flex-1 leading-snug">{{ toast.message }}</p>
        <button
            type="button"
            aria-label="Dismiss notification"
            class="s-focus-ring inline-flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-70 ml-1 rounded opacity-70"
            @click="$emit('close')"
        >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineOptions({ name: 'SToast' })

const props = defineProps({
    toast: { type: Object, required: true },
})

defineEmits(['close'])

const progress = ref(100)
const paused = ref(true)
let raf = null
let startTime = null
const duration = computed(() => props.toast.duration ?? 4000)

onMounted(() => {
    requestAnimationFrame(() => {
        paused.value = false
        progress.value = 0
    })
    startTime = Date.now()
    function tick() {
        const elapsed = Date.now() - startTime
        progress.value = Math.max(0, 100 - (elapsed / duration.value) * 100)
        if (progress.value > 0) {
            raf = requestAnimationFrame(tick)
        }
    }
    raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
    if (raf) {
        cancelAnimationFrame(raf)
    }
})

const variantMap = {
    success: { wrapper: 's-toast-success', bar: 'bg-white/40' },
    error: { wrapper: 's-toast-error', bar: 'bg-white/40' },
    warning: { wrapper: 's-toast-warning', bar: 'bg-white/40' },
    info: { wrapper: 's-toast-info', bar: 'bg-white/40' },
}

const variant = computed(() => variantMap[props.toast.variant] ?? variantMap.info)
</script>

<style>
.s-toast-success { background-color: #16a34a; }
.s-toast-error { background-color: #d93025; }
.s-toast-warning { background-color: #b45309; }
.s-toast-info { background-color: var(--s-accent); }
</style>
