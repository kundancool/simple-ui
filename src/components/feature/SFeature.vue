<template>
    <div class="s-card rounded-xl p-4 h-full">
        <span class="w-9 h-9 rounded-lg flex items-center justify-center" :class="[bgClass, fgClass]">
            <component :is="icon" v-if="icon" class="w-4 h-4" />
            <slot v-else name="icon" />
        </span>
        <p class="text-sm font-semibold s-text-primary mt-2.5">{{ title }}</p>
        <p class="text-sm s-text-secondary mt-1">{{ description }}</p>
        <div v-if="$slots.default || linkLabel" class="mt-3">
            <slot>
                <button v-if="linkLabel" type="button" class="s-feature-link text-sm font-medium s-text-accent inline-flex items-center gap-1" @click="$emit('link')">
                    {{ linkLabel }}
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
            </slot>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SFeature' })

const props = defineProps({
    icon: { type: [Object, Function], default: null },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    /** Tint pair key. */
    tone: { type: String, default: 'blue', validator: (v) => ['blue', 'green', 'yellow', 'purple', 'orange'].includes(v) },
    linkLabel: { type: String, default: '' },
})

defineEmits(['link'])

const bgClass = computed(() => {
    const map = {
        blue: 's-bg-icon-blue',
        green: 's-bg-icon-green',
        yellow: 's-bg-icon-yellow',
        purple: 's-bg-icon-purple',
        orange: 's-bg-icon-orange',
    }
    return map[props.tone]
})

const fgClass = computed(() => {
    const map = {
        blue: 's-text-icon-blue',
        green: 's-text-icon-green',
        yellow: 's-text-icon-yellow',
        purple: 's-text-icon-purple',
        orange: 's-text-icon-orange',
    }
    return map[props.tone]
})
</script>

<style>
.s-feature-link:hover {
    color: var(--s-accent-text-hover);
    text-decoration: underline;
}
</style>
