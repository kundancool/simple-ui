<template>
    <div
        class="inline-flex items-center gap-0.5"
        role="radiogroup"
        :aria-label="ariaLabel || undefined"
        :aria-readonly="readonly || undefined"
    >
        <button
            v-for="n in max"
            :key="n"
            type="button"
            :disabled="readonly || disabled"
            class="s-focus-ring rounded p-0.5 transition-transform disabled:cursor-default"
            :class="!readonly && !disabled ? 'hover:scale-125 cursor-pointer' : 'cursor-default'"
            :aria-label="`Rate ${n} of ${max}`"
            :aria-checked="n === rounded || undefined"
            role="radio"
            @click="rate(n)"
            @keydown="onKeydown($event, n)"
            @mouseenter="hover = n"
            @mouseleave="hover = 0"
        >
            <svg :class="[starClass, lit(n) ? activeColor : 's-text-muted opacity-40']" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.28 3.94a1 1 0 00.95.69h4.14c.97 0 1.37 1.24.59 1.81l-3.35 2.44a1 1 0 00-.36 1.12l1.28 3.93c.3.93-.75 1.7-1.54 1.13l-3.35-2.43a1 1 0 00-1.17 0l-3.35 2.43c-.78.57-1.84-.2-1.54-1.13l1.28-3.93a1 1 0 00-.36-1.12L2.1 9.37c-.78-.57-.38-1.81.6-1.81h4.13a1 1 0 00.95-.69l1.27-3.94z" />
            </svg>
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ name: 'SRating' })

const props = defineProps({
    modelValue: { type: Number, default: 0 },
    max: { type: Number, default: 5 },
    /** Display only — no interaction. */
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    size: { type: String, default: 'md', validator: (v) => ['sm', 'md', 'lg'].includes(v) },
    /** Star color when lit. */
    color: { type: String, default: 'warning' },
    ariaLabel: { type: String, default: 'Rating' },
})

const emit = defineEmits(['update:modelValue', 'change'])
const hover = ref(0)

const rounded = computed(() => Math.round(props.modelValue))
const shown = computed(() => hover.value || rounded.value)

function lit(n) {
    return n <= shown.value
}

const starClass = computed(() => {
    const map = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' }
    return map[props.size]
})

const activeColor = computed(() => (props.color === 'warning' ? 's-text-warning' : 's-text-accent'))

function rate(n) {
    if (props.readonly || props.disabled) {
        return
    }
    emit('update:modelValue', n)
    emit('change', n)
}

function onKeydown(event, n) {
    if (props.readonly || props.disabled) {
        return
    }
    let next = null
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
        next = Math.min(props.max, n + 1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
        next = Math.max(1, n - 1)
    } else if (event.key === 'Home') {
        next = 1
    } else if (event.key === 'End') {
        next = props.max
    }
    if (next === null) {
        return
    }
    event.preventDefault()
    rate(next)
}
</script>
