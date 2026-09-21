<template>
    <div class="text-center py-8 px-4">
        <slot name="icon">
            <span class="inline-flex w-12 h-12 rounded-full s-bg-surface-raised items-center justify-center">
                <component :is="icon" v-if="icon" class="w-6 h-6 s-text-muted" />
                <svg v-else class="w-6 h-6 s-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </span>
        </slot>
        <p v-if="title" class="text-sm font-semibold s-text-primary mt-3">{{ title }}</p>
        <p v-if="description" class="text-sm s-text-muted mt-1 max-w-sm mx-auto">{{ description }}</p>
        <div v-if="$slots.default" class="mt-4 flex justify-center gap-2 flex-wrap">
            <slot />
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'SEmpty' })

defineProps({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    /** Icon component override. */
    icon: { type: [Object, Function], default: null },
})
</script>
