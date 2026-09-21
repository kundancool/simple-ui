<template>
    <div :class="['s-card', rounded ? 'rounded-xl' : '', shadowClasses[shadow]]">
        <div v-if="title || $slots.header" class="px-4 py-3 md:px-5 md:py-4 border-b s-border-theme flex items-center justify-between gap-3">
            <slot name="header">
                <span class="text-sm font-semibold s-text-primary">{{ title }}</span>
            </slot>
        </div>
        <div :class="padding ? 'px-4 py-4 md:px-5 md:py-5' : ''">
            <SSkeleton v-if="loading" :lines="skeletonLines" aria-label="Loading content" />
            <slot v-else />
        </div>
        <div v-if="$slots.footer" class="px-4 py-3 md:px-5 md:py-4 border-t s-border-theme s-bg-surface-raised">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup>
import SSkeleton from '../skeleton/SSkeleton.vue'

defineOptions({ name: 'SCard' })

defineProps({
    title: { type: String, default: '' },
    rounded: { type: Boolean, default: true },
    shadow: {
        type: String,
        default: 'sm',
        validator: (v) => ['', 'none', 'sm', 'md', 'lg', 'hover'].includes(v),
    },
    padding: { type: Boolean, default: true },
    /** Replaces the body with placeholders while content loads. */
    loading: { type: Boolean, default: false },
    skeletonLines: { type: Number, default: 3 },
})

const shadowClasses = {
    '': '',
    none: '',
    sm: 's-shadow-sm-theme',
    md: 's-shadow-md-theme',
    lg: 's-shadow-lg-theme',
    hover: 's-shadow-hover',
}
</script>
