<template>
    <footer class="border-t s-border-theme s-bg-surface">
        <div class="px-4 md:px-8 py-8 grid gap-6" :class="gridClass">
            <div>
                <span class="flex items-center gap-2">
                    <slot name="brand">
                        <span class="w-7 h-7 rounded-lg s-bg-accent flex items-center justify-center text-white font-bold text-xs">{{ brandInitial }}</span>
                        <span class="s-text-primary font-semibold text-sm">{{ brandName }}</span>
                    </slot>
                </span>
                <p v-if="tagline" class="text-xs s-text-muted mt-2 max-w-xs">{{ tagline }}</p>
                <div v-if="$slots.social" class="flex gap-1.5 mt-3">
                    <slot name="social" />
                </div>
            </div>
            <nav v-for="col in columns" :key="col.heading" :aria-label="col.heading">
                <p class="text-[11px] font-semibold uppercase tracking-wider s-text-muted mb-2">{{ col.heading }}</p>
                <ul class="space-y-1.5">
                    <li v-for="link in col.links" :key="link.label">
                        <component :is="link.to ? linkTag : 'span'" v-bind="linkAttrs(link)" :class="link.to ? 'text-sm s-text-secondary s-footer-link transition-colors' : 'text-sm s-text-muted'">{{ link.label }}</component>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="px-4 md:px-8 py-4 border-t s-border-theme flex flex-wrap items-center gap-x-4 gap-y-1 text-xs s-text-muted">
            <span>{{ bottomNote }}</span>
            <span class="ml-auto" />
            <slot name="legal" />
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'SFooter' })

const props = defineProps({
    brandName: { type: String, default: '' },
    brandInitial: { type: String, default: 'S' },
    tagline: { type: String, default: '' },
    /** [{ heading, links: [{ label, to }] }] */
    columns: { type: Array, default: () => [] },
    bottomNote: { type: String, default: '' },
    linkTag: { type: [String, Object, Function], default: 'a' },
    linkProps: { type: Function, default: null },
})

function linkAttrs(link) {
    if (typeof props.linkProps === 'function') {
        return props.linkProps(link)
    }
    if (!link.to) {
        return {}
    }
    return props.linkTag === 'a' ? { href: link.to } : { to: link.to }
}

const columnCount = computed(() => Math.min(4, (props.columns?.length ?? 0) + 1))

const gridClass = computed(() => {
    const map = { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' }
    return map[columnCount.value]
})
</script>

<style>
.s-footer-link:hover {
    color: var(--s-accent-text);
}
</style>
