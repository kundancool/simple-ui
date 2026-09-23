<template>
    <button
        class="s-focus-ring inline-flex items-center justify-center gap-1.5 font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
        :class="[sizeClasses, variantClasses, { 'rounded-full': isIconOnly }]"
        :disabled="disabled || loading"
        :aria-busy="loading || undefined"
        :type="type"
        :title="isIconOnly ? label : undefined"
        v-bind="$attrs"
        @click="$emit('click', $event)"
    >
        <svg v-if="loading" class="animate-spin" :class="iconSizeClasses" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <component v-else-if="icon" :is="icon" :class="iconSizeClasses" />
        <slot v-if="!isIconOnly" />
    </button>
</template>

<script setup>
import { computed, useSlots } from 'vue'

defineOptions({ name: 'SButton' })

const props = defineProps({
    /** HTML button type — the styling prop is `variant`. */
    type: {
        type: String,
        default: 'button',
        validator: (v) => ['button', 'submit', 'reset'].includes(v),
    },
    variant: {
        type: String,
        default: 'primary',
        validator: (v) => ['primary', 'secondary', 'danger', 'ghost', 'link'].includes(v),
    },
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v),
    },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    icon: { type: [Object, Function], default: null },
    /** Accessible name when icon-only (no default slot). */
    label: { type: String, default: '' },
})

defineEmits(['click'])

const slots = useSlots()

const isIconOnly = computed(() => props.icon && !slots.default?.())

const sizeClasses = computed(() => {
    const sizes = {
        xs: isIconOnly.value ? 'w-6 h-6 rounded' : 'h-6 px-2.5 text-xs rounded',
        sm: isIconOnly.value ? 'w-7 h-7 rounded-md' : 'h-7 px-3 text-xs rounded-md',
        md: isIconOnly.value ? 'w-9 h-9 rounded-md' : 'h-9 px-4 text-sm rounded-md',
        lg: isIconOnly.value ? 'w-10 h-10 rounded-md' : 'h-10 px-5 text-sm rounded-md',
    }
    return sizes[props.size]
})

const iconSizeClasses = computed(() => {
    const sizes = { xs: 'w-3 h-3', sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' }
    return sizes[props.size]
})

const variantClasses = computed(() => {
    const variants = {
        primary: 's-btn-primary',
        secondary: 's-btn-ghost',
        danger: 's-btn-danger',
        ghost: 's-btn-plain',
        link: 's-btn-link',
    }
    return variants[props.variant]
})
</script>
