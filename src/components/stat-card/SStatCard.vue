<template>
    <component
        :is="to ? 'a' : 'div'"
        :href="to || undefined"
        class="s-card rounded-xl p-3 md:p-4 flex items-center gap-3"
        :class="to ? 'cursor-pointer s-stat-link' : ''"
    >
        <div v-if="icon" :class="bgColor" class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0">
            <component :is="icon" class="w-4 h-4" :class="iconColor" />
        </div>
        <div class="min-w-0">
            <SSkeleton v-if="loading" height="6" width="2.5rem" class="mb-0.5" :aria-label="`Loading ${label}`" />
            <p v-else class="text-lg font-bold s-text-primary leading-tight truncate">{{ value }}</p>
            <p v-if="label" class="text-xs s-text-muted">{{ label }}</p>
        </div>
    </component>
</template>

<script setup>
import SSkeleton from '../skeleton/SSkeleton.vue'

defineOptions({ name: 'SStatCard' })

defineProps({
    /** Leading icon tile. Omit for a text-only stat. */
    icon: { type: [Object, Function], default: null },
    bgColor: { type: String, default: 's-bg-icon-blue' },
    iconColor: { type: String, default: 's-text-icon-blue' },
    value: { type: [String, Number], default: '0' },
    /** Caption under the value. Omit for a value-only stat. */
    label: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    /** Makes the whole card a link. */
    to: { type: String, default: null },
})
</script>

<style>
.s-stat-link {
    transition: box-shadow 150ms ease;
}
.s-stat-link:hover {
    box-shadow: 0 0 0 1px var(--s-accent-border), var(--s-shadow-sm);
}
</style>
