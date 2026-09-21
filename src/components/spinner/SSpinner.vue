<template>
    <svg
        class="s-spinner"
        :class="sizeClass"
        viewBox="0 0 24 24"
        fill="none"
        :role="label ? 'status' : undefined"
        :aria-label="label || undefined"
        :aria-hidden="label ? undefined : 'true'"
    >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SSpinner' })

const props = defineProps({
    size: { type: String, default: 'md', validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v) },
    /** Accessible name. Omit for a decorative spinner. */
    label: { type: String, default: '' },
})

const sizeClass = computed(() => {
    const map = {
        xs: 'w-3 h-3',
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    }
    return map[props.size]
})
</script>

<style>
.s-spinner {
    display: inline-block;
    flex-shrink: 0;
    animation: s-spinner-spin 0.8s linear infinite;
}
@keyframes s-spinner-spin {
    to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
    .s-spinner { animation-duration: 2.4s; }
}
</style>
