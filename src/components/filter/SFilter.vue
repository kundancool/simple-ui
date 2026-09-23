<template>
    <div class="flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-3">
        <div class="relative flex-1 min-w-0">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 s-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                :value="localValue"
                type="text"
                :placeholder="placeholder"
                :aria-label="placeholder"
                class="s-input w-full pl-9 pr-4 py-2 rounded-md text-sm"
                @input="onInput"
            />
        </div>
        <div class="flex flex-wrap items-center gap-3">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

defineOptions({ name: 'SFilter' })

const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: 'Search...' },
    /** Debounce ms before emitting. */
    debounce: { type: Number, default: 300 },
})

const emit = defineEmits(['update:modelValue', 'search'])

const localValue = ref(props.modelValue)

watch(
    () => props.modelValue,
    (value) => {
        localValue.value = value
    },
)

let timeout = null

onBeforeUnmount(() => clearTimeout(timeout))

function onInput(e) {
    localValue.value = e.target.value
    clearTimeout(timeout)
    timeout = setTimeout(() => {
        emit('update:modelValue', localValue.value)
        emit('search', localValue.value)
    }, props.debounce)
}
</script>
