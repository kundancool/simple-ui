<template>
    <div class="flex items-start gap-3 px-4 py-3 rounded-lg text-sm" :class="variantClasses">
        <component :is="icon" v-if="icon" class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div class="flex-1 min-w-0">
            <p v-if="title" class="font-semibold mb-0.5">{{ title }}</p>
            <slot />
        </div>
        <button
            v-if="dismissible"
            type="button"
            aria-label="Dismiss"
            class="s-focus-ring flex-shrink-0 w-6 h-6 flex items-center justify-center rounded opacity-60 hover:opacity-100 transition-opacity"
            @click="$emit('dismiss')"
        >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SAlert' })

const props = defineProps({
    variant: {
        type: String,
        default: 'info',
        validator: (v) => ['info', 'success', 'warning', 'danger'].includes(v),
    },
    title: { type: String, default: '' },
    icon: { type: [Object, Function], default: null },
    dismissible: { type: Boolean, default: false },
})

defineEmits(['dismiss'])

const variantClasses = computed(() => {
    const map = {
        info: 's-alert-accent',
        success: 's-alert-success',
        warning: 's-alert-warning',
        danger: 's-alert-danger',
    }
    return map[props.variant]
})
</script>
