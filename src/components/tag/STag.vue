<template>
    <span
        class="inline-flex items-center font-medium transition-colors rounded-full whitespace-nowrap"
        :class="[sizeClasses, color ? '' : variantClasses]"
        :style="color ? customColorStyle : null"
    >
        <slot />
    </span>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'STag' })

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'success', 'warning', 'danger', 'info'].includes(v),
    },
    variant: {
        type: String,
        default: 'subtle',
        validator: (v) => ['subtle', 'solid', 'outline'].includes(v),
    },
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md'].includes(v),
    },
    /** Custom hex color — bypasses the type/variant presets. */
    color: { type: String, default: null },
})

const sizeClasses = computed(() => {
    const sizes = { sm: 'px-1.5 py-0.5 text-[10px]', md: 'px-2 py-1 text-xs' }
    return sizes[props.size]
})

const customColorStyle = computed(() => ({
    backgroundColor: props.color,
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25))',
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.45)',
}))

const variantClasses = computed(() => {
    const typeMap = {
        default: {
            subtle: 's-bg-surface-raised s-text-secondary',
            solid: 's-bg-icon-blue-solid s-text-on-solid',
            outline: 'border s-border-strong s-text-secondary',
        },
        success: {
            subtle: 's-bg-success-subtle s-text-success',
            solid: 's-bg-success s-text-on-solid',
            outline: 'border s-border-success s-text-success',
        },
        warning: {
            subtle: 's-bg-warning-subtle s-text-warning',
            solid: 's-bg-warning s-text-on-solid',
            outline: 'border s-border-warning s-text-warning',
        },
        danger: {
            subtle: 's-bg-danger-subtle s-text-danger',
            solid: 's-bg-danger s-text-on-solid',
            outline: 'border s-border-danger s-text-danger',
        },
        info: {
            subtle: 's-bg-icon-blue s-text-icon-blue',
            solid: 's-bg-icon-blue-solid s-text-on-solid',
            outline: 'border s-border-icon-blue s-text-icon-blue',
        },
    }
    return typeMap[props.type]?.[props.variant] || typeMap.default.subtle
})
</script>
