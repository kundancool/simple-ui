<template>
    <div :class="['max-w-2xl', align === 'center' ? 'mx-auto text-center' : 'text-left']">
        <p v-if="eyebrow" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold s-bg-accent-subtle s-text-accent uppercase tracking-wider" :class="align === 'center' ? '' : ''">{{ eyebrow }}</p>
        <component :is="level" class="mt-3 font-bold s-text-primary tracking-tight" :class="titleClass">{{ title }}</component>
        <p v-if="description" class="mt-2 text-sm md:text-base s-text-secondary" :class="align === 'center' ? 'mx-auto' : ''">{{ description }}</p>
        <div v-if="$slots.default" class="mt-4 flex flex-wrap gap-2" :class="align === 'center' ? 'justify-center' : ''">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SSectionHeading' })

const props = defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    align: { type: String, default: 'center', validator: (v) => ['left', 'center'].includes(v) },
    size: { type: String, default: 'md', validator: (v) => ['md', 'lg'].includes(v) },
})

const level = 'h2'

const titleClass = computed(() => (props.size === 'lg' ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'))
</script>
