<template>
    <div>
        <nav class="flex items-start" aria-label="Progress">
            <template v-for="(step, index) in steps" :key="step.key">
                <button
                    type="button"
                    :disabled="index > activeIndex"
                    :aria-current="index === activeIndex ? 'step' : undefined"
                    class="s-focus-ring flex-1 min-w-0 flex flex-col items-center gap-1.5 rounded"
                    :class="index <= activeIndex ? 'cursor-pointer' : 'cursor-default'"
                    @click="$emit('update:modelValue', step.key)"
                >
                    <div
                        class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        :class="stepCircleClass(index)"
                    >
                        <svg v-if="index < activeIndex" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span v-else>{{ index + 1 }}</span>
                    </div>
                    <span
                        class="md:whitespace-nowrap text-[10px] md:text-xs font-medium transition-colors text-center leading-tight break-words"
                        :class="index <= activeIndex ? 's-text-primary' : 's-text-muted'"
                    >{{ step.label }}</span>
                </button>
                <div
                    v-if="index < steps.length - 1"
                    aria-hidden="true"
                    class="flex-1 h-0.5 mx-1 md:mx-4 mt-4 transition-colors"
                    :class="index < activeIndex ? 's-bg-accent' : 's-bg-border-theme'"
                />
            </template>
        </nav>
        <slot :name="modelValue" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SSteps' })

const props = defineProps({
    modelValue: { type: String, required: true },
    /** [{ key, label }] */
    steps: { type: Array, required: true },
})

defineEmits(['update:modelValue'])

const activeIndex = computed(() => {
    const at = props.steps.findIndex((s) => s.key === props.modelValue)
    return at === -1 ? 0 : at
})

function stepCircleClass(index) {
    if (index < activeIndex.value) {
        return 's-bg-accent s-text-on-accent'
    }
    if (index === activeIndex.value) {
        return 's-bg-accent s-text-on-accent s-step-active'
    }
    return 's-bg-surface-raised s-text-muted border s-border-theme'
}
</script>

<style>
.s-step-active {
    box-shadow: 0 0 0 2px var(--s-surface), 0 0 0 4px var(--s-accent-border);
}
</style>
