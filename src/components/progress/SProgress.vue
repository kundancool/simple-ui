<template>
    <div
        role="progressbar"
        :aria-valuenow="clamped"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="ariaLabel || undefined"
        class="s-progress w-full rounded-full overflow-hidden s-bg-surface-raised"
        :class="barHeight"
    >
        <div
            class="h-full rounded-full"
            :class="toneClass"
            :style="{ width: `${clamped}%`, transitionDuration: `${duration}ms` }"
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { isFieldSize } from '../../utils/fieldSize'

defineOptions({ name: 'SProgress' })

const props = defineProps({
    /** 0–100, clamped. */
    value: { type: Number, default: 0 },
    tone: { type: String, default: 'accent', validator: (v) => ['accent', 'success', 'warning', 'danger', 'info'].includes(v) },
    size: { type: String, default: 'md', validator: isFieldSize },
    /** Transition ms for value changes. */
    duration: { type: Number, default: 300 },
    ariaLabel: { type: String, default: '' },
})

const clamped = computed(() => Math.max(0, Math.min(100, props.value)))

const barHeight = computed(() => {
    const map = { xs: 'h-1', sm: 'h-1.5', md: 'h-2', lg: 'h-2.5', xl: 'h-3', '2xl': 'h-4', '3xl': 'h-5' }
    return map[props.size] ?? 'h-2'
})

const toneClass = computed(() => {
    const map = {
        accent: 's-bg-accent',
        success: 's-bg-success',
        warning: 's-bg-warning',
        danger: 's-bg-danger',
        info: 's-bg-icon-blue-solid',
    }
    return map[props.tone]
})
</script>

<style>
.s-progress > div {
    transition-property: width;
    transition-timing-function: var(--s-ease-out);
}
@media (prefers-reduced-motion: reduce) {
    .s-progress > div { transition: none; }
}
</style>
