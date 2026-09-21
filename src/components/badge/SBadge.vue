<template>
    <span class="s-badge-wrap">
        <slot />
        <span
            v-if="!hidden && (dot || showValue)"
            class="s-badge-flag"
            :class="[dot ? 's-badge-dot' : 's-badge-count', toneClass]"
            aria-hidden="true"
        >{{ dot ? '' : displayValue }}</span>
    </span>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SBadge' })

const props = defineProps({
    value: { type: [Number, String], default: null },
    /** Cap numeric values: 99 → "99+". */
    max: { type: Number, default: 99 },
    /** Plain dot, no value. */
    dot: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    tone: { type: String, default: 'danger', validator: (v) => ['danger', 'success', 'warning', 'info', 'default'].includes(v) },
})

const showValue = computed(() => props.value !== null && props.value !== '' && props.value !== undefined)

const displayValue = computed(() => {
    if (typeof props.value === 'number' && props.value > props.max) {
        return `${props.max}+`
    }
    return props.value
})

const toneClass = computed(() => {
    const map = {
        danger: 's-bg-danger',
        success: 's-bg-success',
        warning: 's-bg-warning',
        info: 's-bg-icon-blue-solid',
        default: 's-bg-icon-blue-solid',
    }
    return map[props.tone]
})
</script>

<style>
.s-badge-wrap {
    position: relative;
    display: inline-flex;
}
.s-badge-flag {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    color: var(--s-text-on-solid);
    font-size: 10px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
}
.s-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 9999px;
}
.s-badge-count {
    padding: 2px 5px;
    border-radius: 9999px;
}
</style>
