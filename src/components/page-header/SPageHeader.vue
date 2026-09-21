<template>
    <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 mb-5">
        <div class="min-w-0 flex-1">
            <h1 class="text-lg sm:text-xl font-semibold s-text-primary break-words">{{ title }}</h1>
            <p v-if="subtitle" class="text-sm s-text-muted mt-0.5 break-words">{{ subtitle }}</p>
        </div>
        <div v-if="addText || refreshable || $slots.default" class="flex items-center flex-wrap gap-2 shrink-0">
            <slot />
            <SButton v-if="addText" @click="$emit('add')">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                    <path stroke-linecap="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {{ addText }}
            </SButton>
            <SButton v-if="refreshable" variant="secondary" :loading="loading" label="Refresh" @click="$emit('refresh')">
                <template v-if="!loading">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </template>
            </SButton>
        </div>
    </div>
</template>

<script setup>
import SButton from '../button/SButton.vue'

defineOptions({ name: 'SPageHeader' })

defineProps({
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    /** Renders an add button emitting `add`. */
    addText: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    /** Renders a refresh button emitting `refresh`. */
    refreshable: { type: Boolean, default: false },
})

defineEmits(['add', 'refresh'])
</script>
