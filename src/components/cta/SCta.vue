<template>
    <div class="s-card rounded-2xl p-6 md:p-10 text-center overflow-hidden relative" :class="tone === 'accent' ? 's-cta-accent' : ''">
        <div class="relative">
            <p v-if="eyebrow" class="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold s-bg-accent-subtle s-text-accent uppercase tracking-wider">{{ eyebrow }}</p>
            <p class="mt-3 font-bold s-text-primary tracking-tight" :class="titleClass">{{ title }}</p>
            <p v-if="description" class="text-sm s-text-secondary mt-2 max-w-lg mx-auto">{{ description }}</p>
            <div v-if="$slots.default" class="mt-5 flex flex-wrap justify-center gap-2">
                <slot />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { isFieldSize } from '../../utils/fieldSize'

defineOptions({ name: 'SCta' })

const props = defineProps({
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    size: { type: String, default: 'md', validator: isFieldSize },
    tone: { type: String, default: 'surface', validator: (v) => ['surface', 'accent'].includes(v) },
})

const titleClass = computed(() => ({
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
    xl: 'text-3xl md:text-4xl',
    '2xl': 'text-4xl md:text-5xl',
    '3xl': 'text-5xl md:text-6xl',
}[props.size] ?? 'text-xl md:text-2xl'))
</script>

<style>
.s-cta-accent {
    background:
        radial-gradient(500px 200px at 50% 0%, var(--s-accent-subtle), transparent 70%),
        var(--s-surface);
}
</style>
