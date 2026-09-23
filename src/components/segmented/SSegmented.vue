<template>
    <div
        class="inline-flex items-center gap-0.5 p-1 rounded-full border s-border-theme s-bg-surface-raised"
        role="group"
        :aria-label="ariaLabel || undefined"
    >
        <button
            v-for="(option, index) in options"
            :key="option.value"
            type="button"
            :aria-pressed="option.value === current"
            class="s-focus-ring px-3.5 h-8 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
            :class="option.value === current ? 's-bg-accent s-text-on-accent' : 's-text-secondary s-segment-idle'"
            @click="select(option.value)"
            @keydown="onKeydown($event, index)"
        >
            {{ option.label }}
        </button>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

defineOptions({ name: 'SSegmented' })

const props = defineProps({
    /** [{ label, value }] */
    options: { type: Array, required: true },
    modelValue: { type: [String, Number, Boolean], default: null },
    ariaLabel: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'change'])

const inner = ref(null)
watch(
    () => props.modelValue,
    (value) => {
        inner.value = value
    },
)
const current = computed(() => inner.value ?? props.modelValue)

function select(value) {
    inner.value = value
    emit('update:modelValue', value)
    emit('change', value)
}

function onKeydown(event, index) {
    const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 1, ArrowUp: -1 }
    if (!(event.key in moves)) {
        if (event.key !== 'Home' && event.key !== 'End') {
            return
        }
    }
    event.preventDefault()
    let next = index
    if (event.key === 'Home') {
        next = 0
    } else if (event.key === 'End') {
        next = props.options.length - 1
    } else {
        next = (index + moves[event.key] + props.options.length) % props.options.length
    }
    const option = props.options[next]
    event.currentTarget?.parentElement?.children[next]?.focus()
    if (option && option.value !== current.value) {
        select(option.value)
    }
}
</script>

<style>
.s-segment-idle:hover {
    color: var(--s-text-primary);
}
</style>
