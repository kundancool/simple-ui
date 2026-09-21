<template>
    <button
        type="button"
        role="switch"
        :aria-checked="modelValue"
        :aria-label="ariaLabel || undefined"
        :disabled="disabled || loading"
        class="s-focus-ring s-touch-target relative inline-flex flex-shrink-0 h-5 w-9 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        :class="modelValue ? 's-bg-accent' : 's-bg-switch-track s-border-strong'"
        @click="toggle"
    >
        <span
            class="pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out"
            :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
        >
            <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
                <svg class="w-2.5 h-2.5 animate-spin s-text-accent-fill" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </span>
        </span>
    </button>
</template>

<script setup>
defineOptions({ name: 'SSwitch' })

const props = defineProps({
    modelValue: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    ariaLabel: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

function toggle() {
    if (props.disabled || props.loading) {
        return
    }
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
}
</script>
